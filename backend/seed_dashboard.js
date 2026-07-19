const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Result = require('./models/Result');
const Paper = require('./models/Paper');
const prisma = require('./utils/prisma');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Create a fake user
        const email = 'john.doe@example.com';
        const password = 'password123';
        
        let user = await User.findOne({ email });
        if (user) {
            await User.deleteOne({ email });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            firstName: 'John',
            lastName: 'Doe',
            email: email,
            mobile: '1234567890',
            password: hashedPassword,
            isVerified: true,
            isPremium: true
        });

        await user.save();
        console.log(`Fake user created: ${email} / ${password}`);

        // Create a dummy paper if none exists
        let paper = await Paper.findOne();
        if (!paper) {
            paper = new Paper({
                title: 'SSC CGL Mock Test 1',
                description: 'Full Length Mock',
                duration: 60,
                totalMarks: 200,
                totalQuestions: 100,
                price: 0,
                subject: 'SSC',
                isLiveNow: true,
                sections: []
            });
            await paper.save();
        }

        // Create some dummy results
        await Result.deleteMany({ userId: user._id });

        const mockAnswers = Array.from({ length: 50 }).map((_, i) => ({
            questionId: new mongoose.Types.ObjectId(),
            selectedOptionIndex: Math.floor(Math.random() * 4),
            isCorrect: Math.random() > 0.3, // 70% accuracy
            marksAwarded: 2,
            timeSpent: Math.floor(Math.random() * 60) + 10 // 10s - 70s
        }));

        const mockResult = new Result({
            userId: user._id,
            paperId: paper._id,
            score: 140,
            totalMarks: 200,
            answers: mockAnswers,
            timeTaken: 3000
        });

        await mockResult.save();
        
        // Seed Prisma TopicProficiency (Commented out if Prisma is not active)
        /*
        await prisma.topicProficiency.deleteMany({
            where: { userId: user._id.toString() }
        });

        await prisma.topicProficiency.createMany({
            data: [
                {
                    userId: user._id.toString(),
                    topic: 'Quantitative Aptitude',
                    subTopic: 'Number System',
                    avgAccuracy: 45.0,
                    avgTimeSeconds: 65.0,
                    totalAttempted: 30
                },
                {
                    userId: user._id.toString(),
                    topic: 'Quantitative Aptitude',
                    subTopic: 'Algebra',
                    avgAccuracy: 85.0,
                    avgTimeSeconds: 30.0,
                    totalAttempted: 40
                },
                {
                    userId: user._id.toString(),
                    topic: 'Logical Reasoning',
                    subTopic: 'Puzzles',
                    avgAccuracy: 92.0,
                    avgTimeSeconds: 25.0,
                    totalAttempted: 50
                },
                {
                    userId: user._id.toString(),
                    topic: 'General English',
                    subTopic: 'Reading Comprehension',
                    avgAccuracy: 60.0,
                    avgTimeSeconds: 85.0,
                    totalAttempted: 20
                }
            ]
        });
        */

        console.log('Dummy analytics data seeded successfully.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
