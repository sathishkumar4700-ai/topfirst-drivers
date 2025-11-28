const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

// Public route - Get all active content
router.get('/', async (req, res) => {
  try {
    const { section } = req.query;
    const filter = { isActive: true };
    if (section) filter.section = section;
    
    const content = await Content.find(filter).sort({ section: 1, order: 1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get content by section
router.get('/:section', async (req, res) => {
  try {
    const content = await Content.find({ 
      section: req.params.section,
      isActive: true 
    }).sort({ order: 1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
