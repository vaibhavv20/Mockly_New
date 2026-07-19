const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  // The index of the option the user selected (0, 1, 2, 3) or null if not answered
  selectedOptionIndex: {
    type: Number,
    default: null
  },
  // The language the user viewed this question in (english, hindi)
  language: {
    type: String,
    enum: ['english', 'hindi'],
    default: 'english'
  },
  // TCS Status: 'not_visited', 'not_answered', 'answered', 'marked_for_review', 'answered_marked_for_review'
  status: {
    type: String,
    enum: ['not_visited', 'not_answered', 'answered', 'marked_for_review', 'answered_marked_for_review'],
    default: 'not_visited'
  },
  // Time spent on this specific question in seconds (optional feature for advanced analytics)
  timeSpent: {
    type: Number,
    default: 0
  }
});

const testSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  paperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paper',
    required: true,
    index: true
  },
  // Total time elapsed since the test started in seconds
  timeElapsed: {
    type: Number,
    default: 0
  },
  // If strict navigation, we need to track time per section
  sectionTimes: [{
    sectionId: { type: mongoose.Schema.Types.ObjectId },
    timeElapsed: { type: Number, default: 0 }
  }],
  answers: [answerSchema],
  // Test state: 'in_progress', 'submitted', 'abandoned'
  state: {
    type: String,
    enum: ['in_progress', 'submitted', 'abandoned'],
    default: 'in_progress'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: {
    type: Date
  }
});

// A user can only have one active session per paper at a time
testSessionSchema.index({ userId: 1, paperId: 1, state: 1 });

module.exports = mongoose.model('TestSession', testSessionSchema);
