const User = require('../model/userSchema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET  // Use env variables

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

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' })

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid Credentials' })

    // Generate JWT with role included
    const token = jwt.sign(
      { id: user._id }, 
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({ token, userId: user._id, role: user.role }) // ✅ Return role in response
  } catch (error) {
    console.error('Login Error:', error.message)
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}



exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id // Support both /profile/:id and authenticated user

    const user = await User.findById(userId).select('-password') // Exclude password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user) // Send user data to the client
  } catch (error) {
    console.error('Error fetching user profile:', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}



exports.editProfile = async(req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
