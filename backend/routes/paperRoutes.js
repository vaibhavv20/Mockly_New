const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Paper = require('../models/Paper');
const Result = require('../models/Result');
const Question = require('../models/Question');
const xlsx = require('xlsx');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const prisma = require('../utils/prisma');
const { processProficiencies } = require('../utils/analyticsHelper');

// --- Multer Configuration for Image Uploads ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/questions/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// --- Image Upload Endpoint (Admin) ---
// POST /api/papers/upload-image
router.post('/upload-image', admin, upload.single('questionImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // Return the URL path to the file
    const imageUrl = `/uploads/questions/${req.file.filename}`;
    res.json({ success: true, imageUrl: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Server error during upload' });
  }
});

// --- Paper CRUD Endpoints ---

// POST /api/papers (Admin: Create a new paper)
router.post('/', admin, async (req, res) => {
  try {
    const { questions, ...paperData } = req.body;
    const newPaper = new Paper(paperData);

    const sectionsMap = {};

    if (questions && questions.length > 0) {
      for (const q of questions) {
        const sectionName = q.section || 'General';
        
        // Create Question document
        const newQuestion = new Question({
          questionText: q.questionText,
          questionImage: q.questionImage,
          options: q.options,
          correctOptionIndex: q.correctOptionIndex,
          marks: q.marks,
          negativeMarks: q.negativeMarks,
          idealTimeSeconds: q.idealTimeSeconds || 45,
          subject: newPaper.subject || newPaper.category || 'General',
          topic: newPaper.topic || 'General',
          subTopic: q.subTopic || newPaper.subTopic || 'General',
          examTags: [newPaper.examName, newPaper.tier].filter(Boolean)
        });
        
        const savedQ = await newQuestion.save();

        if (!sectionsMap[sectionName]) {
          sectionsMap[sectionName] = [];
        }
        sectionsMap[sectionName].push(savedQ._id);
      }

      // Build sections array for Paper
      for (const [secName, qIds] of Object.entries(sectionsMap)) {
        newPaper.sections.push({
          name: secName,
          questions: qIds,
          duration: null
        });
      }
    }

    const savedPaper = await newPaper.save();
    res.status(201).json({ success: true, paper: savedPaper });
  } catch (error) {
    console.error('Error creating paper:', error);
    res.status(500).json({ success: false, message: 'Server error creating paper', error: error.message });
  }
});

// GET /api/papers/bulk-template (Admin: Download bulk upload template)
router.get('/bulk-template', admin, (req, res) => {
  try {
    const ws_data = [
      ['Section Name', 'Topic', 'Sub Topic', 'Question (English)', 'Question (Hindi)', 'Question Image URL (English)', 'Question Image URL (Hindi)', 'Option A (English)', 'Option A (Hindi)', 'Option A Image URL', 'Option B (English)', 'Option B (Hindi)', 'Option B Image URL', 'Option C (English)', 'Option C (Hindi)', 'Option C Image URL', 'Option D (English)', 'Option D (Hindi)', 'Option D Image URL', 'Correct Option (A/B/C/D)', 'Marks', 'Negative Marks', 'Ideal Time (Seconds)', 'Explanation (English)', 'Explanation (Hindi)', 'Explanation Image URL (English)', 'Explanation Image URL (Hindi)'],
      ['Quantitative Aptitude', 'Number System', 'Divisibility', 'What is 2+2?', '2+2 कितना होता है?', '', '', '3', '३', '', '4', '४', '', '5', '५', '', '6', '६', '', 'B', '2', '0.5', '30', '2+2 equals 4.', '2+2 बराबर 4 होता है।', '', ''],
      ['General Intelligence', 'Classification', 'Words', 'Find the odd one out: Apple, Banana, Carrot, Orange', 'बेजोड़ खोजें: सेब, केला, गाजर, संतरा', '', '', 'Apple', 'सेब', '', 'Banana', 'केला', '', 'Carrot', 'गाजर', '', 'Orange', 'संतरा', '', 'C', '2', '0.5', '45', 'Carrot is a vegetable, rest are fruits.', 'गाजर एक सब्जी है, बाकी सब फल हैं।', '', '']
    ];
    const ws = xlsx.utils.aoa_to_sheet(ws_data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Questions Template");
    
    // Set column widths for better readability
    ws['!cols'] = [ {wch:20}, {wch:20}, {wch:20}, {wch:40}, {wch:40}, {wch:20}, {wch:20}, {wch:20}, {wch:20}, {wch:20}, {wch:20}, {wch:20}, {wch:20}, {wch:25}, {wch:10} ];
    
    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Disposition', 'attachment; filename="Mockly_Question_Template.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating template:', error);
    res.status(500).json({ success: false, message: 'Server error generating template' });
  }
});

// POST /api/papers/bulk-upload (Admin: Upload Excel to create paper)
router.post('/bulk-upload', admin, upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No Excel file uploaded' });
    }

    const paperConfig = JSON.parse(req.body.paperConfig);
    const newPaper = new Paper(paperConfig);

    // Parse the Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: "", raw: false });

    if (jsonData.length === 0) {
      return res.status(400).json({ success: false, message: 'Excel file is empty' });
    }

    const sectionsMap = {}; // Group questions by section name
    const optionMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
    let questionCount = 0;

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const qEng = row['Question (English)'] || row['Question'];
      // Skip the example rows if they are unmodified
      if (qEng === 'What is 2+2?' || !qEng) continue;

      const sectionName = row['Section Name'] || 'General';
      const correctOptLetter = String(row['Correct Option (A/B/C/D)'] || row['Correct Option'] || '').trim().toUpperCase();
      const correctOptionIndex = optionMap[correctOptLetter] !== undefined ? optionMap[correctOptLetter] : 0;

      const newQuestion = new Question({
        questionText: {
          english: String(qEng || '').trim(),
          hindi: String(row['Question (Hindi)'] || '').trim()
        },
        questionImage: {
          english: String(row['Question Image URL (English)'] || row['Question Image URL'] || '').trim(),
          hindi: String(row['Question Image URL (Hindi)'] || '').trim()
        },
        options: [
          { english: String(row['Option A (English)'] || row['Option A'] || '').trim(), hindi: String(row['Option A (Hindi)'] || '').trim(), image: String(row['Option A Image URL'] || '').trim() },
          { english: String(row['Option B (English)'] || row['Option B'] || '').trim(), hindi: String(row['Option B (Hindi)'] || '').trim(), image: String(row['Option B Image URL'] || '').trim() },
          { english: String(row['Option C (English)'] || row['Option C'] || '').trim(), hindi: String(row['Option C (Hindi)'] || '').trim(), image: String(row['Option C Image URL'] || '').trim() },
          { english: String(row['Option D (English)'] || row['Option D'] || '').trim(), hindi: String(row['Option D (Hindi)'] || '').trim(), image: String(row['Option D Image URL'] || '').trim() }
        ],
        correctOptionIndex: correctOptionIndex,
        solution: {
          english: String(row['Explanation (English)'] || row['Explanation'] || '').trim(),
          hindi: String(row['Explanation (Hindi)'] || '').trim(),
          image: {
            english: String(row['Explanation Image URL (English)'] || row['Explanation Image URL'] || '').trim(),
            hindi: String(row['Explanation Image URL (Hindi)'] || '').trim()
          }
        },
        marks: Number(row['Marks']) || 2,
        negativeMarks: Number(row['Negative Marks']) || 0.5,
        idealTimeSeconds: Number(row['Ideal Time (Seconds)']) || Number(row['Ideal Time']) || 45,
        subject: newPaper.subject || newPaper.category || 'General',
        topic: String(row['Topic'] || newPaper.topic || 'General').trim(),
        subTopic: String(row['Sub Topic'] || row['Subtopic'] || '').trim(),
        examTags: [newPaper.examName, newPaper.tier].filter(Boolean)
      });

      const savedQ = await newQuestion.save();
      questionCount++;

      if (!sectionsMap[sectionName]) sectionsMap[sectionName] = [];
      sectionsMap[sectionName].push(savedQ._id);
    }

    if (questionCount === 0) {
      return res.status(400).json({ success: false, message: 'No valid questions found in Excel file' });
    }

    // Build sections array for Paper
    for (const [secName, qIds] of Object.entries(sectionsMap)) {
      newPaper.sections.push({
        name: secName,
        questions: qIds,
        duration: null
      });
    }

    const savedPaper = await newPaper.save();
    res.status(201).json({ success: true, paper: savedPaper, message: 'Successfully uploaded ' + questionCount + ' questions.' });
  } catch (error) {
    console.error('Error in bulk upload:', error);
    res.status(500).json({ success: false, message: 'Server error processing bulk upload', error: error.message });
  }
});

// GET /api/papers (Get all active papers, with optional filters)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.all !== 'true') filter.isActive = true;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.paperType) filter.paperType = req.query.paperType;
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.examName) filter.examName = req.query.examName;
    if (req.query.examYear) filter.examYear = req.query.examYear;
    if (req.query.isFree) filter.isFree = req.query.isFree === 'true';
    if (req.query.isLiveNow) filter.isLiveNow = req.query.isLiveNow === 'true';
    
    // Select specific fields to not send all questions in the list view
    const papers = await Paper.find(filter).select('-questions');
    res.json({ success: true, papers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching papers' });
  }
});

// GET /api/papers/:id (Get specific paper with questions for taking the test)
router.get('/:id', async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id).populate('sections.questions');
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }
    res.json({ success: true, paper });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching paper' });
  }
});

// PUT /api/papers/:id (Admin: Update paper configuration)
router.put('/:id', admin, async (req, res) => {
  try {
    const { title, description, duration, totalMarks, category, examName, tier, paperType, subject, topic, chapter, isFree, isLiveNow, isActive, verifiedTag, rewardText } = req.body;
    
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }

    if (title !== undefined) paper.title = title;
    if (description !== undefined) paper.description = description;
    if (duration !== undefined) paper.duration = duration;
    if (totalMarks !== undefined) paper.totalMarks = totalMarks;
    if (category !== undefined) paper.category = category;
    if (verifiedTag !== undefined) paper.verifiedTag = verifiedTag;
    if (rewardText !== undefined) paper.rewardText = rewardText;
    if (examName !== undefined) paper.examName = examName;
    if (tier !== undefined) paper.tier = tier;
    if (paperType !== undefined) paper.paperType = paperType;
    if (subject !== undefined) paper.subject = subject;
    if (topic !== undefined) paper.topic = topic;
    if (chapter !== undefined) paper.chapter = chapter;
    if (isFree !== undefined) paper.isFree = isFree;
    if (isLiveNow !== undefined) paper.isLiveNow = isLiveNow;
    if (isActive !== undefined) paper.isActive = isActive;

    const updatedPaper = await paper.save();
    res.json({ success: true, paper: updatedPaper, message: 'Paper updated successfully' });
  } catch (error) {
    console.error('Error updating paper:', error);
    res.status(500).json({ success: false, message: 'Server error updating paper' });
  }
});

// POST /api/papers/:id/replace-questions (Admin: Replace questions of an existing paper)
router.post('/:id/replace-questions', admin, upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No Excel file uploaded' });
    }

    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }

    // Delete existing questions
    const oldQuestionIds = paper.sections.flatMap(sec => sec.questions);
    if (oldQuestionIds.length > 0) {
      await Question.deleteMany({ _id: { $in: oldQuestionIds } });
    }

    // Clear old sections
    paper.sections = [];

    // Parse the new Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: "", raw: false });

    if (jsonData.length === 0) {
      return res.status(400).json({ success: false, message: 'Excel file is empty' });
    }

    const sectionsMap = {}; // Group questions by section name
    const optionMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
    let questionCount = 0;

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const qEng = row['Question (English)'] || row['Question'];
      if (qEng === 'What is 2+2?' || !qEng) continue;

      const sectionName = row['Section Name'] || 'General';
      const correctOptLetter = String(row['Correct Option (A/B/C/D)'] || row['Correct Option'] || '').trim().toUpperCase();
      const correctOptionIndex = optionMap[correctOptLetter] !== undefined ? optionMap[correctOptLetter] : 0;

      const newQuestion = new Question({
        questionText: {
          english: String(qEng || '').trim(),
          hindi: String(row['Question (Hindi)'] || '').trim()
        },
        questionImage: {
          english: String(row['Question Image URL (English)'] || row['Question Image URL'] || '').trim(),
          hindi: String(row['Question Image URL (Hindi)'] || '').trim()
        },
        options: [
          { english: String(row['Option A (English)'] || row['Option A'] || '').trim(), hindi: String(row['Option A (Hindi)'] || '').trim(), image: String(row['Option A Image URL'] || '').trim() },
          { english: String(row['Option B (English)'] || row['Option B'] || '').trim(), hindi: String(row['Option B (Hindi)'] || '').trim(), image: String(row['Option B Image URL'] || '').trim() },
          { english: String(row['Option C (English)'] || row['Option C'] || '').trim(), hindi: String(row['Option C (Hindi)'] || '').trim(), image: String(row['Option C Image URL'] || '').trim() },
          { english: String(row['Option D (English)'] || row['Option D'] || '').trim(), hindi: String(row['Option D (Hindi)'] || '').trim(), image: String(row['Option D Image URL'] || '').trim() }
        ],
        correctOptionIndex: correctOptionIndex,
        solution: {
          english: String(row['Explanation (English)'] || row['Explanation'] || '').trim(),
          hindi: String(row['Explanation (Hindi)'] || '').trim(),
          image: {
            english: String(row['Explanation Image URL (English)'] || row['Explanation Image URL'] || '').trim(),
            hindi: String(row['Explanation Image URL (Hindi)'] || '').trim()
          }
        },
        marks: Number(row['Marks']) || 2,
        negativeMarks: Number(row['Negative Marks']) || 0.5,
        idealTimeSeconds: Number(row['Ideal Time (Seconds)']) || Number(row['Ideal Time']) || 45,
        subject: paper.subject || paper.category || 'General',
        topic: String(row['Topic'] || paper.topic || 'General').trim(),
        subTopic: String(row['Sub Topic'] || row['Subtopic'] || '').trim(),
        examTags: [paper.examName, paper.tier].filter(Boolean)
      });

      const savedQ = await newQuestion.save();
      questionCount++;

      if (!sectionsMap[sectionName]) sectionsMap[sectionName] = [];
      sectionsMap[sectionName].push(savedQ._id);
    }

    if (questionCount === 0) {
      return res.status(400).json({ success: false, message: 'No valid questions found in Excel file' });
    }

    // Build sections array for Paper
    for (const [secName, qIds] of Object.entries(sectionsMap)) {
      paper.sections.push({
        name: secName,
        questions: qIds,
        duration: null
      });
    }

    const savedPaper = await paper.save();
    res.status(200).json({ success: true, paper: savedPaper, message: 'Successfully updated ' + questionCount + ' questions.' });
  } catch (error) {
    console.error('Error in replace-questions:', error);
    res.status(500).json({ success: false, message: 'Server error processing Excel file', error: error.message });
  }
});

// POST /api/papers/:id/submit (Submit test and calculate score)
router.post('/:id/submit', async (req, res) => {
  try {
    const { userId, answers, timeTaken } = req.body;
    const paperId = req.params.id;

    if (!userId || !answers) {
      return res.status(400).json({ success: false, message: 'Missing userId or answers' });
    }

    const paper = await Paper.findById(paperId).populate('sections.questions');
    if (!paper) return res.status(404).json({ success: false, message: 'Paper not found' });

    let score = 0;
    const processedAnswers = [];
    const analyticsQuestions = []; // For PostgreSQL Analytics

    // Create a flat map of all questions in the paper
    const questionMap = {};
    paper.sections.forEach(sec => {
      sec.questions.forEach(q => {
        questionMap[q._id.toString()] = q;
      });
    });

    // Calculate score
    for (const answer of answers) {
      const question = questionMap[answer.questionId];
      if (!question) continue;

      let isCorrect = false;
      let marksAwarded = 0;

      if (answer.selectedOptionIndex !== null) {
        if (answer.selectedOptionIndex === question.correctOptionIndex) {
          isCorrect = true;
          marksAwarded = question.marks;
        } else {
          marksAwarded = -question.negativeMarks;
        }
      }

      score += marksAwarded;
      const timeSpent = answer.timeSpent || 0;
      
      // Calculate Behavior Flag for advanced analytics
      let behaviorFlag = 'NORMAL';
      const idealTime = question.idealTimeSeconds || 45;
      
      if (!isCorrect && timeSpent < (idealTime * 0.5)) {
          behaviorFlag = 'SILLY_MISTAKE';
      } else if (timeSpent > (idealTime * 1.5)) {
          behaviorFlag = 'TIME_TRAP';
      } else if (!isCorrect) {
          behaviorFlag = 'CONCEPTUAL_GAP';
      } else if (isCorrect && timeSpent < (idealTime * 0.5)) {
          behaviorFlag = 'FAST_AND_CORRECT';
      }

      processedAnswers.push({
        questionId: question._id,
        selectedOptionIndex: answer.selectedOptionIndex,
        isCorrect,
        marksAwarded,
        timeSpent: timeSpent
      });

      // Prepare data for PostgreSQL
      analyticsQuestions.push({
          questionId: question._id.toString(),
          topic: question.topic || 'General',
          subTopic: question.subTopic || 'General',
          isCorrect: isCorrect,
          timeSpentSeconds: timeSpent,
          behaviorFlag: behaviorFlag
      });
    }

    const result = new Result({
      userId,
      paperId,
      score,
      totalMarks: paper.totalMarks,
      answers: processedAnswers,
      timeTaken: timeTaken || 0
    });

    await result.save();

    // Asynchronously save analytics to PostgreSQL
    try {
        await prisma.testAttempt.create({
            data: {
                userId: userId.toString(),
                paperId: paperId.toString(),
                totalScore: score,
                totalTimeSeconds: timeTaken || 0,
                questionAttempts: {
                    create: analyticsQuestions
                }
            }
        });
        
        // Update rolling averages
        processProficiencies(userId.toString(), analyticsQuestions);
    } catch (analyticsError) {
        console.error('Error saving analytics to Postgres:', analyticsError);
        // We don't fail the submission if analytics fails
    }
    res.json({ success: true, result, score });
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({ success: false, message: 'Server error submitting test' });
  }
});

// GET /api/papers/result/:resultId (Fetch detailed result)
router.get('/result/:resultId', async (req, res) => {
  try {
    const result = await Result.findById(req.params.resultId).populate('paperId').populate('userId', 'name');
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error fetching result:', error);
    res.status(500).json({ success: false, message: 'Server error fetching result' });
  }
});

// GET /api/papers/my-results (Fetch user's past results)
router.get('/my-results', auth, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.id })
      .populate('paperId', 'title category examName')
      .sort({ submittedAt: -1 })
      .limit(10);
    res.json({ success: true, results });
  } catch (error) {
    console.error('Error fetching user results:', error);
    res.status(500).json({ success: false, message: 'Server error fetching user results' });
  }
});

// POST /api/papers/generate-rescue
// Generates a targeted mini-mock test based on a weak topic
router.post('/generate-rescue', auth, async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic || topic === 'No Data') {
      return res.status(400).json({ success: false, message: 'Invalid topic for rescue mock.' });
    }

    // 1. Fetch up to 15 random questions for this topic
    // Using aggregation for random sampling
    const questions = await Question.aggregate([
      { $match: { topic: topic } },
      { $sample: { size: 15 } }
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ success: false, message: 'No questions found for this topic to generate a rescue mock.' });
    }

    const questionIds = questions.map(q => q._id);

    // 2. Create a new "Rescue" Paper
    const newPaper = new Paper({
      title: `Rescue Mock: ${topic}`,
      description: `Targeted practice to patch your critical weakness in ${topic}.`,
      type: 'mock',
      subject: topic,
      duration: questions.length * 2, // 2 minutes per question
      totalMarks: questions.length * 2,
      isActive: true,
      sections: [{
        name: 'Target Practice',
        instructions: `Focus on accuracy for ${topic}.`,
        questions: questionIds
      }]
    });

    const savedPaper = await newPaper.save();

    res.json({ success: true, paperId: savedPaper._id, message: 'Rescue mock generated successfully!' });
  } catch (error) {
    console.error('Error generating rescue mock:', error);
    res.status(500).json({ success: false, message: 'Server error generating rescue mock' });
  }
});

module.exports = router;
