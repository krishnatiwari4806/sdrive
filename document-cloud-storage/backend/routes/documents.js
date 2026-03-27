const express = require('express');
const Document = require('../models/Document');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all documents for user
router.get('/', protect, async (req, res) => {
  try {
    const documents = await Document.find({ owner: req.userId }).populate('folder');
    res.status(200).json({ success: true, documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get document by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Check permissions
    if (document.owner.toString() !== req.userId && !document.isPublic) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create document
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, documentType, folder, tags } = req.body;

    const document = await Document.create({
      name,
      description,
      documentType: documentType || 'personal',
      folder,
      tags: tags || [],
      owner: req.userId,
    });

    res.status(201).json({ success: true, document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update document
router.put('/:id', protect, async (req, res) => {
  try {
    let document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (document.owner.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    document = await Document.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete document
router.delete('/:id', protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (document.owner.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Document deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
