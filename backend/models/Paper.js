const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: {
    type: String, // e.g., 'General Intelligence and Reasoning'
    required: true,
    trim: true
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  // For strict timing (e.g. CGL Tier 2 where each section has fixed time)
  // Optional if the test has flexible timing overall
  duration: {
    type: Number, // in minutes
    default: null 
  }
});

const paperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  // Overall duration of the test (if not strict section-wise)
  duration: {
    type: Number, // in minutes
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  category: {
    type: String, // e.g., 'SSC', 'Banking'
    required: true,
    trim: true,
    index: true
  },
  examName: {
    type: String, // e.g., 'CGL', 'CHSL', 'MTS'
    trim: true,
    index: true
  },
  tier: {
    type: String, // e.g., 'Tier-1', 'Tier-2'
    trim: true
  },
  paperType: {
    type: String, // e.g., 'Full Length Mock', 'Sectional', 'Topic-wise', 'Chapter-wise', 'PYP'
    required: true,
    trim: true,
    index: true
  },
  examYear: {
    type: Number // Required if paperType is 'PYP'
  },
  // For Sectional/Topic-wise/Chapter-wise
  subject: {
    type: String,
    trim: true
  },
  topic: {
    type: String,
    trim: true
  },
  chapter: {
    type: String,
    trim: true
  },
  // Whether navigation is strict (cannot jump sections) or flexible
  navigationType: {
    type: String,
    enum: ['flexible', 'strict'],
    default: 'flexible'
  },
  sections: [sectionSchema],
  difficulty: {
    type: String,
    enum: ['EASY', 'MODERATE', 'HARD'],
    default: 'MODERATE'
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  isFree: {
    type: Boolean,
    default: false
  },
  isLiveNow: {
    type: Boolean,
    default: false
  },
  enrolledCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notifyUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isNotified: {
    type: Boolean,
    default: false
  },
  verifiedTag: {
    type: String,
    trim: true,
    default: 'TCS PATTERN VERIFIED'
  },
  rewardText: {
    type: String,
    trim: true,
    default: 'Top 50 get 1 Month PRO Pass'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Paper', paperSchema);
