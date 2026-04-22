// ===========================
// routes/projects.js - Project API
// ===========================
// All project-related routes:
// POST   /api/projects         - Student: Submit a project
// GET    /api/projects/my      - Student: View their own projects
// GET    /api/projects         - Faculty: View ALL projects
// PUT    /api/projects/:id     - Faculty: Review (approve/reject + feedback)

const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// ---- SUBMIT PROJECT (Student only) ----
// POST /api/projects
// Body: { title, description, fileLink }
// Headers: Authorization: Bearer <token>
router.post('/', protect, restrictTo('student'), async (req, res) => {
  try {
    const { title, description, fileLink } = req.body;

    if (!title || !description || !fileLink) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // req.user.id comes from our JWT middleware
    const project = await Project.create({
      title,
      description,
      fileLink,
      studentId: req.user.id
    });

    res.status(201).json({ message: 'Project submitted successfully!', project });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ---- GET MY PROJECTS (Student only) ----
// GET /api/projects/my
// Headers: Authorization: Bearer <token>
router.get('/my', protect, restrictTo('student'), async (req, res) => {
  try {
    // Find only projects submitted by the logged-in student
    const projects = await Project.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ---- GET ALL PROJECTS (Faculty only) ----
// GET /api/projects
// Headers: Authorization: Bearer <token>
router.get('/', protect, restrictTo('faculty'), async (req, res) => {
  try {
    // .populate() fetches the student's name & email from the User collection
    // instead of just showing the raw ObjectId
    const projects = await Project.find()
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ---- REVIEW PROJECT (Faculty only) ----
// PUT /api/projects/:id
// Body: { status, feedback }
// Headers: Authorization: Bearer <token>
router.put('/:id', protect, restrictTo('faculty'), async (req, res) => {
  try {
    const { status, feedback } = req.body;

    // Validate status value
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be "approved" or "rejected".' });
    }

    // Find the project and update it
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status, feedback },
      { new: true }  // Return the updated document
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    res.json({ message: 'Project reviewed successfully!', project });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

module.exports = router;
