const { BadRequestError, UnauthenticatedError } = require('../errors')
const User = require('../models/User')
const { StatusCodes } = require("http-status-codes")

const register = async (req, res) => {
  const user = await User.create({ ...req.body })

  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ token, user: { name: user.name } })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  const user = await User.findOne({ email })

  //  check user
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials")
  }

  // check password
  const isCorrectPassword = await user.comparePassword(password)
  if (!isCorrectPassword) {
    throw new UnauthenticatedError('Invalid credentials')
  }

  const token = user.createJWT()
  
  res.status(StatusCodes.CREATED).json({ token, user: { name: user.name } })
}

module.exports = { register, login }