const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNumber: { type: String, unique: true, sparse: true }, // Optional at sign-up, can be added later
    DOB: { type: Date }, // Optional, can be added later
    gender: { type: String, enum: ['Male', 'Female', 'Other'] }, // Optional, can be added later
    profilePicture: { type: String }, // URL to profile image
    bio: { type: String, maxlength: 500 }, // New field for user bio
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    progress: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        completedLessons: [
          { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
        ],
      },
    ],
    certificates: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        issuedDate: { type: Date, default: Date.now },
        certificateUrl: { type: String },
      },
    ],
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false }, // Can be updated after email/OTP verification
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)
module.exports = User
