const { validationResult } = require('express-validator');
const Insight = require('../models/Insight');
const fs = require('fs');
const path = require('path');

// Helper function to create slug
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// @desc    Get all insights
// @route   GET /api/insights
// @access  Public
exports.getAllInsights = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const category = req.query.category;

    const result = await Insight.getAll(page, limit, status, category);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching insights'
    });
  }
};

// @desc    Get single insight by slug
// @route   GET /api/insights/:slug
// @access  Public
exports.getInsightBySlug = async (req, res) => {
  try {
    const insight = await Insight.getBySlug(req.params.slug);

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: 'Insight not found'
      });
    }

    // Increment views
    await Insight.incrementViews(insight.id);

    res.json({
      success: true,
      insight
    });
  } catch (error) {
    console.error('Get insight error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching insight'
    });
  }
};

// @desc    Create new insight
// @route   POST /api/insights
// @access  Private (Admin)
exports.createInsight = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { title, content, excerpt, image_url, image_type, category, author, status } = req.body;

    // Create slug from title
    const slug = createSlug(title);

    // Check if slug already exists
    const existingInsight = await Insight.getBySlug(slug);
    if (existingInsight) {
      return res.status(400).json({
        success: false,
        message: 'An insight with similar title already exists'
      });
    }

    const insightData = {
      title,
      slug,
      content,
      excerpt,
      image_url,
      image_type: image_type || 'local',
      category: category || 'blog',
      author: author || req.admin.username,
      status: status || 'draft'
    };

    const insightId = await Insight.create(insightData);

    res.status(201).json({
      success: true,
      message: 'Insight created successfully',
      insightId
    });
  } catch (error) {
    console.error('Create insight error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating insight'
    });
  }
};

// @desc    Update insight
// @route   PUT /api/insights/:id
// @access  Private (Admin)
exports.updateInsight = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const insightId = req.params.id;
    const { title, content, excerpt, image_url, image_type, category, author, status } = req.body;

    // Check if insight exists
    const existingInsight = await Insight.getById(insightId);
    if (!existingInsight) {
      return res.status(404).json({
        success: false,
        message: 'Insight not found'
      });
    }

    // Create new slug if title changed
    let slug = existingInsight.slug;
    if (title !== existingInsight.title) {
      slug = createSlug(title);
      
      // Check if new slug already exists
      const slugExists = await Insight.getBySlug(slug);
      if (slugExists && slugExists.id !== parseInt(insightId)) {
        return res.status(400).json({
          success: false,
          message: 'An insight with similar title already exists'
        });
      }
    }

    const insightData = {
      title,
      slug,
      content,
      excerpt,
      image_url,
      image_type: image_type || existingInsight.image_type,
      category: category || existingInsight.category,
      author: author || existingInsight.author,
      status: status || existingInsight.status
    };

    await Insight.update(insightId, insightData);

    res.json({
      success: true,
      message: 'Insight updated successfully'
    });
  } catch (error) {
    console.error('Update insight error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating insight'
    });
  }
};

// @desc    Delete insight
// @route   DELETE /api/insights/:id
// @access  Private (Admin)
exports.deleteInsight = async (req, res) => {
  try {
    const insightId = req.params.id;

    // Check if insight exists
    const insight = await Insight.getById(insightId);
    if (!insight) {
      return res.status(404).json({
        success: false,
        message: 'Insight not found'
      });
    }

    // Delete associated local image if exists
    if (insight.image_type === 'local' && insight.image_url) {
      const imagePath = path.join(__dirname, '../uploads/insights', path.basename(insight.image_url));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Insight.delete(insightId);

    res.json({
      success: true,
      message: 'Insight deleted successfully'
    });
  } catch (error) {
    console.error('Delete insight error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting insight'
    });
  }
};

// @desc    Get recent insights
// @route   GET /api/insights/recent/:limit
// @access  Public
exports.getRecentInsights = async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 5;
    const insights = await Insight.getRecent(limit);

    res.json({
      success: true,
      insights
    });
  } catch (error) {
    console.error('Get recent insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent insights'
    });
  }
};

// @desc    Search insights
// @route   GET /api/insights/search/:term
// @access  Public
exports.searchInsights = async (req, res) => {
  try {
    const searchTerm = req.params.term;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await Insight.search(searchTerm, page, limit);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Search insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching insights'
    });
  }
};