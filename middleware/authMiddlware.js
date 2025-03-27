const User = require('../model/userSchema')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

// Middleware to Protect Routes
authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied. No token provided' })
  }

  const token = authHeader.split(' ')[1] // Extract token from "Bearer <token>"

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password') // Attach user data (excluding password)

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' })
    }

    next() // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Invalid or Expired Token' })
  }
}


module.exports = authMiddleware