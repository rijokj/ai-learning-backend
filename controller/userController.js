const User = require('../model/userSchema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key' // Use env variables

// Register User
exports.register = async (req, res) => {
  try {

    const { firstName, lastName, email, password, mobileNumber } = req.body

    // Check if user already exists (by email)
    let user = await User.findOne({ email })
    if (user) return res.status(400).json({ message: 'User already exists' })

    // Check if mobileNumber already exists
    if (mobileNumber) {
      let existingMobileUser = await User.findOne({ mobileNumber })
      if (existingMobileUser) {
        return res.status(400).json({ message: 'Mobile number already exists' })
      }
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Save User
    user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobileNumber, // Add mobile number here
    })
    await user.save()

    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    console.error('Error saving user:', error.message)
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ message: 'Duplicate value detected' })
    }
    res.status(500).json({ message: 'Internal Server Error' })
  }
}


// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' })

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid Credentials' })

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' })

    res.json({ token, userId: user._id })
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error })
  }
}



exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id // Get user ID from authenticated request
    const user = await User.findById(userId).select('-password') // Exclude password
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}
