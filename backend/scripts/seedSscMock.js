const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('../models/Question');
const Paper = require('../models/Paper');

dotenv.config({ path: '../.env' }); // Load env variables

const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mockly_db';

async function seedSSCMock() {
  try {
    await mongoose.connect(DB_URI);
    console.log('Connected to MongoDB');

    // Clear old SSC data (Optional, for clean state)
    await Paper.deleteMany({ category: 'ssc-cgl' });
    await Question.deleteMany({ examTags: 'SSC CGL' });
    console.log('Cleared old SSC Mock data.');

    // Sections configuration
    const sectionsConfig = [
      { name: 'General Intelligence', subject: 'General Intelligence', qCount: 25 },
      { name: 'General Awareness', subject: 'General Awareness', qCount: 25 },
      { name: 'Quantitative Aptitude', subject: 'Quantitative Aptitude', qCount: 25 },
      { name: 'English Comprehension', subject: 'English Comprehension', qCount: 25 }
    ];

    let allQuestionsIds = [];
    let sectionObjects = [];
    let globalQNum = 1;

    for (const sec of sectionsConfig) {
        let sectionQIds = [];
        for (let i = 1; i <= sec.qCount; i++) {
            const newQ = new Question({
                questionText: {
                    english: `[${sec.name}] This is dummy question number ${globalQNum}. Some questions may have images. What is the correct option?`,
                    hindi: `[${sec.name}] यह डमी प्रश्न संख्या ${globalQNum} है। कुछ प्रश्नों में चित्र हो सकते हैं। सही विकल्प क्या है?`
                },
                questionImage: "", 
                options: [
                    { english: `Option A for Q${globalQNum}`, hindi: `विकल्प A (Q${globalQNum})`, image: "" },
                    { english: `Option B for Q${globalQNum}`, hindi: `विकल्प B (Q${globalQNum})`, image: "" },
                    { english: `Option C for Q${globalQNum}`, hindi: `विकल्प C (Q${globalQNum})`, image: "" },
                    { english: `Option D for Q${globalQNum}`, hindi: `विकल्प D (Q${globalQNum})`, image: "" }
                ],
                correctOptionIndex: Math.floor(Math.random() * 4), 
                solution: {
                    english: `Detailed solution for question ${globalQNum}. The correct answer was derived using standard formulas.`,
                    hindi: `प्रश्न ${globalQNum} का विस्तृत समाधान।`
                },
                subject: sec.subject,
                topic: 'Miscellaneous',
                difficulty: 'Medium',
                marks: 2,
                negativeMarks: 0.5,
                examTags: ['SSC CGL']
            });

            const savedQ = await newQ.save();
            sectionQIds.push(savedQ._id);
            allQuestionsIds.push(savedQ._id);
            globalQNum++;
        }

        sectionObjects.push({
            name: sec.name,
            questions: sectionQIds,
            duration: 15 // 15 mins per section
        });
        console.log(`Seeded 25 questions for ${sec.name}`);
    }

    // Create the Paper
    const sscMock = new Paper({
        title: 'SSC CGL Tier 1 Full Mock 1',
        description: 'Complete syllabus mock test based on latest TCS Eduquity pattern.',
        duration: 60,
        totalMarks: 200,
        category: 'ssc-cgl',
        examName: 'CGL',
        tier: 'Tier-1',
        paperType: 'Full Length Mock',
        navigationType: 'flexible', // Allow jumping for now
        sections: sectionObjects,
        isActive: true
    });

    await sscMock.save();
    console.log(`Successfully created Mock Test: ${sscMock.title} with ID: ${sscMock._id}`);
    
    // Also create a dummy sectional test
    const sscSectional = new Paper({
        title: 'SSC CGL Quant Sectional 1',
        description: '25 Questions of Quantitative Aptitude.',
        duration: 15,
        totalMarks: 50,
        category: 'ssc-cgl',
        examName: 'CGL',
        tier: 'Tier-1',
        paperType: 'Sectional',
        subject: 'Quantitative Aptitude',
        navigationType: 'flexible',
        sections: [sectionObjects[2]], // Only Quant section
        isActive: true
    });
    
    await sscSectional.save();
    console.log(`Successfully created Sectional Test: ${sscSectional.title}`);

    mongoose.disconnect();
    console.log('Done.');

  } catch (error) {
    console.error('Error seeding data:', error);
    mongoose.disconnect();
  }
}

seedSSCMock();
