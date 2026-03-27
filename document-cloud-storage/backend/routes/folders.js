const express = require('express');
const Folder = require('../models/Folder');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all folders for user
router.get('/', protect, async (req, res) => {
  try {
    const folders = await Folder.find({ owner: req.userId });
    res.status(200).json({ success: true, folders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create folder
router.post('/', protect, async (req, res) => {
  try {
    const { name, parentFolder } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Folder name required' });
    }

    const folder = await Folder.create({
      name,
      owner: req.userId,
      parentFolder: parentFolder || null,
    });

    res.status(201).json({ success: true, folder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update folder
router.put('/:id', protect, async (req, res) => {
  try {
    let folder = await Folder.findById(req.params.id);

    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    if (folder.owner.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    folder = await Folder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, folder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete folder
router.delete('/:id', protect, async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);

    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    if (folder.owner.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Folder.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Folder deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
