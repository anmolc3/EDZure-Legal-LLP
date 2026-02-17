const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Protected routes (Admin only)
router.post(
  '/insight',
  authMiddleware,
  upload.single('image'),
  uploadController.uploadInsightImage
);

router.delete(
  '/insight/:filename',
  authMiddleware,
  uploadController.deleteInsightImage
);

module.exports = router;