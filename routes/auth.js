// ===========================
// routes/auth.js - Auth API
// ===========================
// Handles: POST /api/auth/register and POST /api/auth/login

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ---- Helper: Create a JWT Token ----
// We sign the user's id and role into the token.
// This is what gets sent back to the frontend.
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }  // Token is valid for 7 days
  );
};

// ---- REGISTER ----
// POST /api/auth/register
// Body: { name, email, password, role }
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // 3. Hash the password before saving (never store plain text!)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create and save the new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student'
    });

    // 5. Return the token
    res.status(201).json({
      message: 'Registration successful!',
      token: generateToken(user),
      user: { id: user._id, name: user.name, role: user.role }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ---- LOGIN ----
// POST /api/auth/login
// Body: { email, password }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // 2. Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // 3. Return the token
    res.json({
      message: 'Login successful!',
      token: generateToken(user),
      user: { id: user._id, name: user.name, role: user.role }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

module.exports = router;
