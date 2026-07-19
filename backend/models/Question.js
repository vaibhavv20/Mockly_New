const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  // Bilingual support for the question text
  questionText: {
    english: { type: String, required: true },
    hindi: { type: String, default: "" }
  },
  // Bilingual image support for the question
  questionImage: {
    english: { type: String, default: "" },
    hindi: { type: String, default: "" }
  },
  // Bilingual support for options. Usually 4 options.
  options: [{
    english: { type: String, default: "" },
    hindi: { type: String, default: "" },
    image: { type: String, default: "" } // Optional image per option
  }],
  // Index of the correct option (0-based)
  correctOptionIndex: {
    type: Number,
    required: true,
    min: 0
  },
  // Bilingual support for detailed solution/explanation
  solution: {
    english: { type: String, default: "" },
    hindi: { type: String, default: "" },
    image: {
      english: { type: String, default: "" },
      hindi: { type: String, default: "" }
    }
  },
  // Metadata for analytics and categorization
  subject: {
    type: String, // e.g., 'Quantitative Aptitude', 'General Intelligence'
    required: true,
    trim: true,
    index: true
  },
  topic: {
    type: String, // e.g., 'Algebra', 'Blood Relations'
    trim: true,
    index: true
  },
  subTopic: {
    type: String, // e.g., 'Linear Equations'
    trim: true,
    index: true
  },
  difficulty: {
    type: String, // 'Easy', 'Medium', 'Hard'
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
    index: true
  },
  // Positive marks awarded for correct answer
  marks: {
    type: Number,
    required: true,
    default: 2
  },
  // Negative marks deducted for incorrect answer (e.g., 0.5)
  negativeMarks: {
    type: Number,
    required: true,
    default: 0.5
  },
  // The expected time a top-tier student takes to solve this
  idealTimeSeconds: {
    type: Number,
    required: false,
    default: 45 // Default to 45 seconds if not provided
  },
  // e.g., 'SSC CGL', 'CHSL', 'MTS' - allows reuse across exams
  examTags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index for faster querying by subject and topic
questionSchema.index({ subject: 1, topic: 1 });

module.exports = mongoose.model('Question', questionSchema);
