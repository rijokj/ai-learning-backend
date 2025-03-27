const express = require('express') // Import express
const router = express.Router() // Use Router()
const userController = require('../controller/userController') // Import controller
const auth = require('../middleware/authMiddlware')

// Register User Route
router.post('/signup', userController.register)

// Login User Route
router.post('/login', userController.login)


router.get('/profile', auth, userController.getUserProfile)

module.exports = router // Export router
