// ===========================
// models/User.js - User Schema
// ===========================
// This defines what a User looks like in our database.
// Both students and faculty are stored in this same collection,
// distinguished by the 'role' field.

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,         // No two users can have the same email
    lowercase: true,      // Always store email in lowercase
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'faculty'],  // Only these two values are allowed
    default: 'student'
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);
