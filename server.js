// ===========================
// server.js - Main Entry Point
// ===========================
// This is the heart of our backend. It sets up Express,
// connects to MongoDB, and registers all our routes.

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();

// --- MIDDLEWARE ---
// Allow cross-origin requests (so our frontend can talk to backend)
app.use(cors());
// Parse incoming JSON request bodies
app.use(express.json());
// Serve static frontend files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// --- ROUTES ---
// We split our routes into separate files for organization
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected!');
    // Start the server only after DB is connected
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
