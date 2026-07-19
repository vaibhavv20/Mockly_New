const prisma = require('./prisma');

// Helper function to update rolling averages
async function processProficiencies(userId, questions) {
    for (const q of questions) {
        const { topic, subTopic, isCorrect, timeSpentSeconds } = q;
        
        try {
            // Find existing record
            const existing = await prisma.topicProficiency.findUnique({
                where: {
                    userId_subTopic: { userId, subTopic }
                }
            });

            if (existing) {
                // Calculate new rolling averages
                const newTotal = existing.totalAttempted + 1;
                const newAvgAccuracy = ((existing.avgAccuracy * existing.totalAttempted) + (isCorrect ? 100 : 0)) / newTotal;
                const newAvgTime = ((existing.avgTimeSeconds * existing.totalAttempted) + timeSpentSeconds) / newTotal;

                await prisma.topicProficiency.update({
                    where: { id: existing.id },
                    data: {
                        avgAccuracy: newAvgAccuracy,
                        avgTimeSeconds: newAvgTime,
                        totalAttempted: newTotal
                    }
                });
            } else {
                // Create new record
                await prisma.topicProficiency.create({
                    data: {
                        userId,
                        topic,
                        subTopic,
                        avgAccuracy: isCorrect ? 100 : 0,
                        avgTimeSeconds: timeSpentSeconds,
                        totalAttempted: 1
                    }
                });
            }
        } catch (error) {
            console.error(`Error updating proficiency for user ${userId}, subTopic ${subTopic}:`, error);
        }
    }
}

module.exports = {
    processProficiencies
};
