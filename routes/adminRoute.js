const express = require('express')
const router = express.Router()
const {
  authMiddlware,
  adminMiddleware,
} = require('../middleware/authMiddlware')

// Protect all admin routes
router.use(authMiddlware)
router.use(adminMiddleware)

router.get('/', (req, res) => {
  res.json({ message: 'Welcome, Admin!' })
})

// Add more admin-specific routes

module.exports = router
