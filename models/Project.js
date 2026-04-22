// ===========================
// models/Project.js - Project Schema
// ===========================
// This defines what a Project submission looks like in MongoDB.
// It links to the User who submitted it via 'studentId'.

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required']
  },
  fileLink: {
    type: String,
    required: [true, 'File link (e.g., Google Drive URL) is required']
  },
  // Reference to the User who submitted this project
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',              // Links to the User collection
    required: true
  },
  // Faculty updates this field after reviewing
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  // Faculty writes feedback here
  feedback: {
    type: String,
    default: ''
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Project', projectSchema);
