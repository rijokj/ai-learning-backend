const express = require('express') // Import express
const router = express.Router() // Use Router()
const userController = require('../controller/userController') // Import controller
const auth = require('../middleware/authMiddlware')


// Register User Route
router.post('/signup', userController.register)

// Login User Route
router.post('/login', userController.login)


router.get('/profile/:id', auth.authMiddlware, userController.getUserProfile)

router.put('/profile/:id', auth.authMiddlware, userController.editProfile)

module.exports = router // Export router
