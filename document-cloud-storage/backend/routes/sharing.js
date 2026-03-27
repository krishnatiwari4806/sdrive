const express = require('express');
const Share = require('../models/Share');
const Document = require('../models/Document');
const Folder = require('../models/Folder');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Share document with user
router.post('/document', protect, async (req, res) => {
  try {
    const { documentId, userId, permission } = req.body;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (document.owner.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Add to sharedWith array
    document.sharedWith.push({
      user: userId,
      permission: permission || 'view',
    });

    await document.save();

    res.status(201).json({ success: true, message: 'Document shared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Share folder with user
router.post('/folder', protect, async (req, res) => {
  try {
    const { folderId, userId, permission } = req.body;

    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    if (folder.owner.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Add to sharedWith array
    folder.sharedWith.push({
      user: userId,
      permission: permission || 'view',
    });

    await folder.save();

    res.status(201).json({ success: true, message: 'Folder shared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get shared documents/folders
router.get('/shared-with-me', protect, async (req, res) => {
  try {
    const sharedDocs = await Document.find({ 'sharedWith.user': req.userId });
    const sharedFolders = await Folder.find({ 'sharedWith.user': req.userId });

    res.status(200).json({ 
      success: true, 
      documents: sharedDocs, 
      folders: sharedFolders 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Revoke share
router.delete('/:docId/user/:userId', protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.docId);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (document.owner.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    document.sharedWith = document.sharedWith.filter(
      share => share.user.toString() !== req.params.userId
    );

    await document.save();

    res.status(200).json({ success: true, message: 'Share revoked' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
