const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Paper = require('../models/Paper');
const Question = require('../models/Question');
const TestSession = require('../models/TestSession');

// @route   GET api/ssc/papers
// @desc    Get all active SSC papers (can filter by examName, tier, paperType)
// @access  Public (or Private depending on requirements, making it public for catalog)
router.get('/papers', async (req, res) => {
  try {
    const { examName, tier, paperType } = req.query;
    let query = { isActive: true, category: 'SSC' };
    
    if (examName) query.examName = examName;
    if (tier) query.tier = tier;
    if (paperType) query.paperType = paperType;

    // Don't populate questions here to keep the catalog payload small
    const papers = await Paper.find(query).sort({ createdAt: -1 });
    res.json(papers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ssc/test/start/:paperId
// @desc    Start a test session for a paper
// @access  Private
router.post('/test/start/:paperId', auth, async (req, res) => {
  try {
    const paperId = req.params.paperId;
    const userId = req.user.id;

    // Check if the paper exists
    const paper = await Paper.findById(paperId);
    if (!paper) {
      return res.status(404).json({ msg: 'Paper not found' });
    }

    // Check if there is already an active session for this user and paper
    let session = await TestSession.findOne({ userId, paperId, state: 'in_progress' });
    
    if (session) {
      // Resume existing session
      return res.json(session);
    }

    // Create a new session
    session = new TestSession({
      userId,
      paperId,
      state: 'in_progress'
    });

    await session.save();
    res.json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/ssc/test/session/:sessionId/questions
// @desc    Get full paper data including populated questions for the test interface
// @access  Private
router.get('/test/session/:sessionId/questions', auth, async (req, res) => {
  try {
    const session = await TestSession.findOne({ _id: req.params.sessionId, userId: req.user.id });
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    const paper = await Paper.findById(session.paperId).populate('sections.questions');
    if (!paper) {
      return res.status(404).json({ msg: 'Paper not found' });
    }

    res.json({ session, paper });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/ssc/test/sync/:sessionId
// @desc    Sync test session progress (answers, time elapsed)
// @access  Private
router.put('/test/sync/:sessionId', auth, async (req, res) => {
  try {
    const { timeElapsed, answers } = req.body;
    const session = await TestSession.findOne({ _id: req.params.sessionId, userId: req.user.id });

    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    if (session.state !== 'in_progress') {
      return res.status(400).json({ msg: 'Cannot sync a test that is not in progress' });
    }

    // Update time and answers
    session.timeElapsed = timeElapsed;
    
    // Efficiently update answers array (upsert logic)
    // In a real high-scale scenario, you might send only incremental changes
    answers.forEach(newAns => {
      const existingAnsIndex = session.answers.findIndex(a => a.questionId.toString() === newAns.questionId);
      if (existingAnsIndex > -1) {
        session.answers[existingAnsIndex].selectedOptionIndex = newAns.selectedOptionIndex;
        session.answers[existingAnsIndex].status = newAns.status;
        session.answers[existingAnsIndex].language = newAns.language;
        session.answers[existingAnsIndex].timeSpent = newAns.timeSpent;
      } else {
        session.answers.push(newAns);
      }
    });

    await session.save();
    res.json({ msg: 'Synced successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ssc/test/submit/:sessionId
// @desc    Submit the test session and calculate results
// @access  Private
router.post('/test/submit/:sessionId', auth, async (req, res) => {
  try {
    const session = await TestSession.findOne({ _id: req.params.sessionId, userId: req.user.id });

    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }
    if (session.state === 'submitted') {
      return res.status(400).json({ msg: 'Test already submitted' });
    }

    session.state = 'submitted';
    session.submittedAt = Date.now();
    await session.save();

    // Note: Result calculation logic (checking correct options from Question model and tallying scores)
    // should ideally be done here and stored in the Result model.
    // For now, we just mark the session as submitted.
    
    res.json({ msg: 'Test submitted successfully', sessionId: session._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
