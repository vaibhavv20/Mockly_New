const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paper',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId, // referencing the question inside paper
      required: true
    },
    selectedOptionIndex: {
      type: Number, // 0, 1, 2, 3, or null if unattempted
      default: null
    },
    isCorrect: {
      type: Boolean,
      default: false
    },
    marksAwarded: {
      type: Number,
      default: 0
    },
    timeSpent: {
      type: Number,
      default: 0
    }
  }],
  timeTaken: {
    type: Number,
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Result', resultSchema);
