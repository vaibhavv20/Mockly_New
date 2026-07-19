const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const auth = require('../middleware/auth'); // Reusing existing JWT auth middleware
const Result = require('../models/Result');
const User = require('../models/User');
const Paper = require('../models/Paper');


// @route   GET /api/analytics/topic-performance
// @desc    Get topic proficiency data for scatter plots
// @access  Private
router.get('/topic-performance', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const proficiencies = await prisma.topicProficiency.findMany({
            where: { userId },
            select: {
                topic: true,
                subTopic: true,
                avgAccuracy: true,
                avgTimeSeconds: true,
                totalAttempted: true
            }
        });

        // Structure it for the frontend
        const scatterData = proficiencies.map(p => ({
            name: p.subTopic,
            accuracy: p.avgAccuracy,
            timeSpent: p.avgTimeSeconds,
            topic: p.topic
        }));

        res.json(scatterData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in Topic Performance');
    }
});



// @route   GET /api/analytics/dashboard/summary
// @desc    Get dashboard summary statistics
// @access  Private
router.get('/dashboard/summary', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // 1. Fetch user results
        const allResults = await Result.find({ userId }).sort({ createdAt: 1 });
        
        let testsTaken = allResults.length;
        const results = allResults.slice(-10); // LATEST 10 MOCK TESTS
        
        let totalCorrect = 0;
        let totalAnswered = 0;
        let totalTimeSpent = 0;
        let avgSpeed = 0;
        let accuracy = 0;
        
        let accuracyHistory = [];
        let rankHistory = [];
        
        if (testsTaken > 0) {
            results.forEach((result, index) => {
                let rCorrect = 0;
                let rAnswered = 0;
                
                result.answers.forEach(ans => {
                    if (ans.selectedOptionIndex !== null) {
                        totalAnswered++;
                        rAnswered++;
                        if (ans.isCorrect) {
                            totalCorrect++;
                            rCorrect++;
                        }
                    }
                    totalTimeSpent += ans.timeSpent || 0;
                });
                
                // History arrays
                if (rAnswered > 0) {
                    accuracyHistory.push(Math.round((rCorrect / rAnswered) * 100));
                } else {
                    accuracyHistory.push(0);
                }
                
                // Generate a mock rank that improves based on score
                let mockRank = Math.max(1, 10000 - (result.score * 50) - (index * 500));
                rankHistory.push(mockRank);
            });
            
            if (totalAnswered > 0) {
                accuracy = Math.round((totalCorrect / totalAnswered) * 100);
                avgSpeed = Math.round(totalTimeSpent / totalAnswered);
            }
        }
        
        // 2. Mock/Estimate other fields dynamically based on user history
        let predictedScore = Math.round((accuracy / 100) * 200);
        if (testsTaken === 0) predictedScore = 0;
        
        // Assume user's target score is 160 (or higher if predicted is > 160)
        let targetScore = Math.max(160, predictedScore + 10);
        let targetGap = predictedScore > 0 ? targetScore - predictedScore : 0;
        
        // Coverage goes up by 5% for every test taken, capped at 98%
        let coverage = testsTaken === 0 ? 0 : Math.min(98, 15 + (testsTaken * 5));

        const summary = {
            hasTakenTests: testsTaken > 0,
            testsTaken,
            accuracy,
            avgSpeed,
            globalRank: testsTaken > 0 ? rankHistory[rankHistory.length - 1] : 0, 
            rankHistory,
            accuracyHistory,
            predictedScore,
            targetGap,
            coverage 
        };
        
        res.json(summary);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in Dashboard Summary');
    }
});

// @route   GET /api/analytics/dashboard/cognitive
// @desc    Get cognitive profile data for radar chart
// @access  Private
router.get('/dashboard/cognitive', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const allResults = await Result.find({ userId }).sort({ createdAt: 1 });
        const results = allResults.slice(-10); // LATEST 10 TESTS
        
        let speedScore = 50;
        let accuracyScore = 50;
        let enduranceScore = 50;
        let strategyScore = 50;
        let knowledgeScore = 50;
        
        if (results.length > 0) {
            let totalCorrect = 0, totalAnswered = 0, totalTimeSpent = 0;
            let totalQuestions = 0;
            let skippedQuestions = 0;
            
            results.forEach(result => {
                totalQuestions += result.answers.length;
                result.answers.forEach(ans => {
                    if (ans.selectedOptionIndex !== null) {
                        totalAnswered++;
                        if (ans.isCorrect) totalCorrect++;
                    } else {
                        skippedQuestions++;
                    }
                    totalTimeSpent += ans.timeSpent || 0;
                });
            });
            
            if (totalAnswered > 0) {
                const acc = (totalCorrect / totalAnswered) * 100;
                accuracyScore = Math.round(acc);
                knowledgeScore = Math.round(acc * 0.9 + 10);
                
                const avgTime = totalTimeSpent / totalAnswered;
                speedScore = Math.round(Math.min(100, Math.max(0, 100 - (avgTime / 2))));
                
                // Endurance: Ratio of questions attempted across all 10 tests
                enduranceScore = Math.round((totalAnswered / (totalQuestions || 1)) * 100);
                
                // Strategy: High accuracy + willingness to skip = good strategy
                strategyScore = Math.round(Math.min(100, (accuracyScore * 0.7) + ((skippedQuestions / (totalQuestions || 1)) * 100 * 0.3)));
            }
        }
        
        res.json({
            userProfile: [speedScore, accuracyScore, enduranceScore, strategyScore, knowledgeScore],
            topperAverage: [95, 92, 90, 95, 88] 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in Cognitive Profile');
    }
});

// @route   GET /api/analytics/dashboard/insights
// @desc    Get AI insights, weaknesses, and time leaks
// @access  Private
router.get('/dashboard/insights', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        
        let proficiencies = [];
        try {
            proficiencies = await prisma.topicProficiency.findMany({
                where: { userId },
                orderBy: { avgAccuracy: 'asc' }
            });
        } catch (e) {
            console.warn("Prisma error, falling back to mock insights:", e.message);
        }
        
        let criticalWeakness = { topic: 'No Data', subTopic: 'Take a test', accuracy: 0, extraTime: 0 };
        let timeLeaks = [];
        
        try {
            const allResultsWithQs = await Result.find({ userId })
                .populate('answers.questionId')
                .sort({ createdAt: 1 });
            const recentWithQs = allResultsWithQs.slice(-10);
            
            let topicStats = {};
            let totalOverallTime = 0;
            let totalOverallAnswered = 0;
            
            recentWithQs.forEach(res => {
                res.answers.forEach(ans => {
                    if (ans.selectedOptionIndex !== null && ans.questionId && ans.questionId.topic) {
                        const topicStr = ans.questionId.topic;
                        const subTopicStr = ans.questionId.subTopic || topicStr;
                        const t = `${topicStr}|${subTopicStr}`;
                        if (!topicStats[t]) {
                            topicStats[t] = { correct: 0, answered: 0, timeSpent: 0 };
                        }
                        topicStats[t].answered++;
                        topicStats[t].timeSpent += (ans.timeSpent || 0);
                        if (ans.isCorrect) topicStats[t].correct++;
                        
                        totalOverallAnswered++;
                        totalOverallTime += (ans.timeSpent || 0);
                    }
                });
            });
            
            const avgGlobalTime = totalOverallAnswered > 0 ? (totalOverallTime / totalOverallAnswered) : 60;
            
            let weakestTopic = null;
            let lowestAcc = 100;
            
            for (const [key, stats] of Object.entries(topicStats)) {
                if (stats.answered >= 3) { // Require at least 3 questions to judge
                    const [topic, subTopic] = key.split('|');
                    const acc = Math.round((stats.correct / stats.answered) * 100);
                    const avgTime = Math.round(stats.timeSpent / stats.answered);
                    const timeDiff = avgTime - avgGlobalTime;
                    
                    if (acc < lowestAcc) {
                        lowestAcc = acc;
                        weakestTopic = {
                            topic: topic,
                            subTopic: subTopic,
                            accuracy: acc,
                            extraTime: Math.max(0, Math.round(timeDiff))
                        };
                    }
                    
                    // Time leaks (High time + low accuracy = leak, Low time + high accuracy = save)
                    if (timeDiff > 20 && acc < 60) {
                        timeLeaks.push({
                            topic: topic,
                            subTopic: subTopic,
                            impact: `-${Math.round((timeDiff * stats.answered) / 60)} Mins Wasted`,
                            impactClass: 'text-red',
                            desc: `You spend ${Math.round(timeDiff)}s extra per question here with low accuracy. AI Suggestion: Skip hard questions early.`,
                            fillPercent: 80,
                            fillColor: '#ef4444'
                        });
                    } else if (timeDiff < -10 && acc >= 75) {
                        timeLeaks.push({
                            topic: topic,
                            subTopic: subTopic,
                            impact: `+${Math.abs(Math.round((timeDiff * stats.answered) / 60))} Mins Saved`,
                            impactClass: 'text-green',
                            desc: `Excellent pacing! You answer ${Math.abs(Math.round(timeDiff))}s faster than average with high accuracy.`,
                            fillPercent: 30,
                            fillColor: '#10b981'
                        });
                    }
                }
            }
            
            if (weakestTopic) {
                criticalWeakness = weakestTopic;
            }
            
            if (timeLeaks.length === 0 && Object.keys(topicStats).length > 0) {
                timeLeaks = [{
                    topic: 'Pacing Optimal',
                    impact: '0 Mins Wasted',
                    impactClass: 'text-green',
                    desc: 'Your time management across topics is stable.',
                    fillPercent: 10,
                    fillColor: '#10b981'
                }];
            }
        } catch (err) {
            console.error("Error calculating AI insights:", err.message);
        }
        let strongestAreas = [];
        try {
            // Aggregate subjects directly from latest results
            const allResults = await Result.find({ userId })
                .populate('paperId')
                .populate('answers.questionId')
                .sort({ createdAt: 1 });
            const recentResults = allResults.slice(-10); // LATEST 10 MOCK TESTS
            
            let subjectStats = {};
            
            recentResults.forEach(res => {
                res.answers.forEach(ans => {
                    if (ans.selectedOptionIndex !== null && ans.questionId) {
                        const subject = ans.questionId.subTopic || ans.questionId.topic || res.paperId?.subject || 'General';
                        
                        if (!subjectStats[subject]) {
                            subjectStats[subject] = { totalCorrect: 0, totalAnswered: 0 };
                        }
                        
                        subjectStats[subject].totalAnswered++;
                        if (ans.isCorrect) subjectStats[subject].totalCorrect++;
                    }
                });
            });
            
            for (const [subject, stats] of Object.entries(subjectStats)) {
                let acc = 0;
                if (stats.totalAnswered > 0) {
                    acc = Math.round((stats.totalCorrect / stats.totalAnswered) * 100);
                }
                
                let status = 'danger';
                let leakInfo = 'Needs Improvement';
                let leakClass = 'text-red';
                
                if (acc >= 90) {
                    status = 'optimal';
                    leakInfo = 'Strongest Area';
                    leakClass = 'text-green';
                } else if (acc >= 75) {
                    status = 'warning';
                    leakInfo = 'Moderate Leak';
                    leakClass = 'text-yellow';
                } else {
                    status = 'danger';
                    leakInfo = 'Critical Leak';
                    leakClass = 'text-red';
                }
                
                strongestAreas.push({
                    topic: subject,
                    score: acc + '%',
                    status: status,
                    leakInfo: leakInfo,
                    leakClass: leakClass
                });
            }
            
            // If user has no test data, fallback
            if (strongestAreas.length === 0) {
                strongestAreas = [
                    { topic: 'No Data Yet', score: '0%', status: 'warning', leakInfo: 'Take a test to see vitals', leakClass: 'text-yellow' }
                ];
            }
        } catch (err) {
            console.error("Error calculating dynamic strongest areas:", err.message);
            strongestAreas = [
                { topic: 'Data Error', score: '0%', status: 'danger', leakInfo: 'Failed to load', leakClass: 'text-red' }
            ];
        }
        
        if (proficiencies.length > 0) {
            const weakest = proficiencies[0];
            criticalWeakness = {
                topic: weakest.topic,
                subTopic: weakest.subTopic,
                accuracy: Math.round(weakest.avgAccuracy),
                extraTime: Math.max(0, Math.round(weakest.avgTimeSeconds - 40))
            };
            
            const leaks = proficiencies.filter(p => p.avgTimeSeconds > 50 && p.avgAccuracy < 60).slice(0, 2);
            if (leaks.length > 0) {
                timeLeaks = leaks.map(l => ({
                    topic: l.subTopic,
                    impact: `-${Math.round((l.avgTimeSeconds - 40) / 60 * l.totalAttempted)} Mins Wasted`,
                    impactClass: 'text-red',
                    desc: `You spend too much time here with only ${Math.round(l.avgAccuracy)}% accuracy.`,
                    fillPercent: 80,
                    fillColor: '#ef4444'
                }));
            }
            
            const strong = proficiencies.filter(p => p.avgAccuracy > 70).sort((a, b) => b.avgAccuracy - a.avgAccuracy).slice(0, 3);
            if (strong.length > 0) {
                strongestAreas = strong.map((s, index) => ({
                    topic: s.topic || s.subTopic,
                    score: `${Math.round(s.avgAccuracy)}%`,
                    status: index === 0 ? 'optimal' : (index === 1 ? 'warning' : 'danger'),
                    leakInfo: index === 0 ? 'Strongest Area' : 'Need more practice',
                    leakClass: index === 0 ? 'text-green' : 'text-red'
                }));
            }
        }
        
        res.json({
            criticalWeakness,
            timeLeaks,
            strongestAreas
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in AI Insights');
    }
});
// @route   GET /api/analytics/dashboard/deep-dive
// @desc    Get detailed analytics for the Deep Analytics page
// @access  Private
router.get('/dashboard/deep-dive', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { range } = req.query;
        
        let query = { userId };
        if (range && range !== 'all') {
            const days = parseInt(range);
            if (!isNaN(days)) {
                const date = new Date();
                date.setDate(date.getDate() - days);
                query.submittedAt = { $gte: date };
            }
        }
        
        const allResults = await Result.find(query).populate('answers.questionId');
        
        // 1. Attempt vs Unattempted
        let attemptStats = { correct: 0, incorrect: 0, skipped: 0 };
        
        // 2. Time Management
        let totalTime = 0;
        let totalAnswered = 0;
        
        // 3. Skill Balance
        let subjectStats = {
            'Quantitative': { correct: 0, total: 0 },
            'Logical Reasoning': { correct: 0, total: 0 },
            'General English': { correct: 0, total: 0 },
            'General Awareness': { correct: 0, total: 0 },
            'Computer': { correct: 0, total: 0 }
        };
        
        // 4. Accuracy by Difficulty
        let difficultyStats = {
            easy: { correct: 0, total: 0 },
            medium: { correct: 0, total: 0 },
            hard: { correct: 0, total: 0 }
        };
        
        allResults.forEach(res => {
            res.answers.forEach(ans => {
                if (!ans.questionId) return;
                
                // Attempt Stats
                if (ans.selectedOptionIndex === null || ans.selectedOptionIndex === undefined || ans.selectedOptionIndex === -1) {
                    attemptStats.skipped++;
                } else {
                    if (ans.isCorrect) attemptStats.correct++;
                    else attemptStats.incorrect++;
                    
                    // Time Management (only count answered)
                    totalTime += (ans.timeSpent || 0);
                    totalAnswered++;
                }
                
                // Skill Balance
                const subj = ans.questionId.subject || 'General';
                if (!subjectStats[subj]) subjectStats[subj] = { correct: 0, total: 0 };
                subjectStats[subj].total++;
                if (ans.isCorrect) subjectStats[subj].correct++;
                
                // Difficulty Stats
                const diff = (ans.questionId.difficultyLevel || 'medium').toLowerCase();
                if (difficultyStats[diff]) {
                    difficultyStats[diff].total++;
                    if (ans.isCorrect) difficultyStats[diff].correct++;
                }
            });
        });
        
        // Compile Time Management
        const avgTime = totalAnswered > 0 ? Math.round(totalTime / totalAnswered) : 0;
        const topperAvgTime = 42;
        const timeGap = avgTime > 0 ? avgTime - topperAvgTime : 0;
        
        let speedDistribution = { fast: 20, medium: 30, slow: 50 }; // mock distribution for now
        let timeHint = "Keep practicing to reduce your average time per question.";
        if (timeGap > 20) timeHint = "You are taking significantly longer than toppers. Focus on speed drills.";
        else if (timeGap < 0) timeHint = "Excellent! You are answering faster than the top 1%.";
        
        // Compile Skill Balance
        const labels = Object.keys(subjectStats);
        const scores = labels.map(subj => {
            const stats = subjectStats[subj];
            return stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
        });
        // mock topper scores
        const topperScores = labels.map(() => Math.floor(Math.random() * 15) + 80); // 80-95
        
        let topSkill = "None";
        if (scores.length > 0) {
            const maxScore = Math.max(...scores);
            topSkill = labels[scores.indexOf(maxScore)];
        }
        
        // Compile Difficulty
        const formatDiff = (diffStats) => {
            return diffStats.total > 0 ? Math.round((diffStats.correct / diffStats.total) * 100) : 0;
        };
        
        const finalDifficulty = {
            easy: formatDiff(difficultyStats.easy),
            medium: formatDiff(difficultyStats.medium),
            hard: formatDiff(difficultyStats.hard),
        };
        
        let diffHint = "You lose the most marks on Hard questions. Stop guessing and skip them to save time.";
        if (finalDifficulty.easy < 80) diffHint = "You are making silly mistakes on Easy questions. Double-check your calculations.";
        
        res.json({
            attemptStats,
            timeManagement: {
                avgTime,
                gap: timeGap,
                topperAvg: topperAvgTime,
                speedDistribution,
                hint: timeHint
            },
            skillBalance: {
                labels,
                scores,
                topperScores,
                topSkill
            },
            difficultyStats: {
                ...finalDifficulty,
                hint: diffHint
            }
        });
        
    } catch (err) {
        console.error("Error fetching deep analytics:", err.message);
        res.status(500).send('Server Error in Deep Analytics');
    }
});

// @route   GET /api/analytics/admin/stats
// @desc    Get admin dashboard stats
// @access  Private (Admin)
router.get('/admin/stats', auth, async (req, res) => {
    try {
        // Since auth middleware doesn't strictly check isAdmin natively without more db lookups or token claims
        // we'll fetch the user to double check they are an admin
        const user = await User.findById(req.user.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ msg: 'Access denied. Admins only.' });
        }

        const totalUsers = await User.countDocuments();
        const totalPapers = await Paper.countDocuments();
        const totalTestsTaken = await Result.countDocuments();

        // Let's get the 5 most recent signups
        const recentSignups = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('firstName lastName email createdAt isPremium');

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalPapers,
                totalTestsTaken
            },
            recentSignups
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error fetching admin stats');
    }
});

module.exports = router;
