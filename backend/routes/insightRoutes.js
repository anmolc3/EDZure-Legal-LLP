const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const insightController = require('../controllers/insightController');
const authMiddleware = require('../middleware/authMiddleware');

// Validation rules
const insightValidation = [
  body('title')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Title must be at least 5 characters long'),
  body('content')
    .trim()
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters long'),
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Excerpt must not exceed 200 characters'),
  body('category')
    .optional()
    .isIn(['blog', 'news'])
    .withMessage('Category must be either blog or news'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either draft or published')
];

// Public routes
router.get('/', insightController.getAllInsights);
router.get('/recent/:limit?', insightController.getRecentInsights);
router.get('/search/:term', insightController.searchInsights);
router.get('/:slug', insightController.getInsightBySlug);

// Protected routes (Admin only)
router.post('/', authMiddleware, insightValidation, insightController.createInsight);
router.put('/:id', authMiddleware, insightValidation, insightController.updateInsight);
router.delete('/:id', authMiddleware, insightController.deleteInsight);

module.exports = router;