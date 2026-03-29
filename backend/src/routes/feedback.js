const express = require('express');
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message, rating } = req.body;

  if (!name || !message) {
    return res.status(400).json({ message: 'Name and message are required' });
  }

  try {
    const feedback = await Feedback.create({ name, email, message, rating });
    return res.status(201).json(feedback);
  } catch (err) {
    console.error('Create feedback error:', err.message);
    return res.status(500).json({ message: 'Unable to save feedback' });
  }
});

// Public: Fetch visible feedbacks
router.get('/', async (_req, res) => {
  try {
    const feedbacks = await Feedback.find({}).sort({ createdAt: -1 });
    return res.json(feedbacks);
  } catch (err) {
    console.error('Fetch public feedback error:', err.message);
    return res.status(500).json({ message: 'Unable to fetch feedback' });
  }
});

// Admin: Fetch all feedbacks
router.get('/all', auth, async (_req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    return res.json(feedbacks);
  } catch (err) {
    console.error('Fetch admin feedback error:', err.message);
    return res.status(500).json({ message: 'Unable to fetch feedback' });
  }
});

// Admin: Toggle visibility or update
router.put('/:id', auth, async (req, res) => {
  try {
    const { isVisible } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { isVisible },
      { new: true }
    );
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    return res.json(feedback);
  } catch (err) {
    console.error('Update feedback error:', err.message);
    return res.status(500).json({ message: 'Unable to update feedback' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Feedback.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    return res.json({ message: 'Feedback deleted' });
  } catch (err) {
    console.error('Delete feedback error:', err.message);
    return res.status(500).json({ message: 'Unable to delete feedback' });
  }
});

module.exports = router;

