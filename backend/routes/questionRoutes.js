const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const admin = require('../middleware/admin');

// GET /api/questions (Get paginated questions with optional filters)
router.get('/', admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.subject) {
      filter.subject = new RegExp(req.query.subject, 'i');
    }
    if (req.query.search) {
      filter['questionText.english'] = new RegExp(req.query.search, 'i');
    }

    const questions = await Question.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Question.countDocuments(filter);

    res.json({
      success: true,
      questions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalQuestions: total
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ success: false, message: 'Server error fetching questions' });
  }
});

// PUT /api/questions/:id (Update a specific question)
router.put('/:id', admin, async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    res.json({ success: true, question: updatedQuestion });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ success: false, message: 'Server error updating question' });
  }
});

// DELETE /api/questions/:id (Hard delete a question)
router.delete('/:id', admin, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ success: false, message: 'Server error deleting question' });
  }
});

module.exports = router;
