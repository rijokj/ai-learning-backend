const User = require('../model/userSchema')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables')
}

// Middleware to Protect Routes
const authMiddlware = async (req, res, next) => {
  const authHeader = req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied. No token provided' })
  }

  const token = authHeader.split(' ')[1] // Extract token from "Bearer <token>"

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password') // Attach user data (excluding password)

    if (!req.user) {
      return res.status(403).json({ message: 'User not found' }) // Use 403 for forbidden access
    }

    next() // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Auth Error:', error.message) // Log the error for debugging
    res.status(401).json({ message: 'Invalid or Expired Token' })
  }
}
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access Denied. Admins only.' })
  }
  next()
}

module.exports = { authMiddlware, 
                  adminMiddleware }