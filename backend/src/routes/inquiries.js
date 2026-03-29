const express = require('express');
const Inquiry = require('../models/Inquiry');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ message: 'Name, email, and message are required' });
  }

  try {
    const inquiry = await Inquiry.create({ name, email, message });
    return res.status(201).json(inquiry);
  } catch (err) {
    console.error('Create inquiry error:', err.message);
    return res.status(500).json({ message: 'Unable to save inquiry' });
  }
});

router.get('/', auth, async (_req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return res.json(inquiries);
  } catch (err) {
    console.error('Fetch inquiries error:', err.message);
    return res.status(500).json({ message: 'Unable to fetch inquiries' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Inquiry.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    return res.json({ message: 'Inquiry deleted' });
  } catch (err) {
    console.error('Delete inquiry error:', err.message);
    return res.status(500).json({ message: 'Unable to delete inquiry' });
  }
});

module.exports = router;

