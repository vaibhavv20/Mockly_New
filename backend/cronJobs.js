const cron = require('node-cron');
const Paper = require('./models/Paper');
const User = require('./models/User');
const sendEmail = require('./utils/sendEmail');

const startCronJobs = () => {
    console.log('Cron jobs scheduler started.');

    // Run every minute
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            const tenMinsFromNow = new Date(now.getTime() + 10 * 60000);

            // 1. Find papers that start in <= 10 mins and haven't sent the start notification yet
            const upcomingPapers = await Paper.find({
                startTime: { $lte: tenMinsFromNow },
                isNotified: false
            }).populate('notifyUsers');

            for (const paper of upcomingPapers) {
                console.log(`Sending start notification for paper: ${paper.title}`);
                
                // Email each user
                for (const user of paper.notifyUsers) {
                    if (!user.email) continue;
                    
                    const message = `Hi ${user.firstName},\n\nThe test "${paper.title}" is starting soon! Get ready and log in to Mockly to attempt it.`;
                    const htmlTemplate = `
                    <div style="font-family: 'Inter', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; padding: 40px; border-radius: 16px; color: #f8fafc; border: 1px solid #334155;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #10b981; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -1px;">Mockly</h1>
                        </div>
                        <div style="background-color: #1e293b; padding: 40px 30px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                            <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); color: #10b981; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 20px auto;">🔥</div>
                            <h2 style="margin-top: 0; font-size: 24px; font-weight: 600;">It's Time!</h2>
                            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">Hi ${user.firstName}, the <strong>${paper.title}</strong> is starting soon! Get your pen and paper ready.</p>
                            <a href="http://127.0.0.1:5501/frontend/index.html" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Go to Mockly</a>
                        </div>
                    </div>
                    `;

                    await sendEmail({
                        email: user.email,
                        subject: `Starts Soon: ${paper.title} - Mockly`,
                        message,
                        html: htmlTemplate
                    }).catch(err => console.error(`Failed to send email to ${user.email}:`, err));
                }

                // Mark as notified
                paper.isNotified = true;
                await paper.save();
            }

            // 2. Automatically mark papers as isLiveNow = true when their start time is reached
            const livePapersResult = await Paper.updateMany(
                { startTime: { $lte: now }, isLiveNow: false },
                { $set: { isLiveNow: true } }
            );
            
            if (livePapersResult.modifiedCount > 0) {
                console.log(`Auto-activated ${livePapersResult.modifiedCount} papers that reached their start time.`);
            }

        } catch (error) {
            console.error('Error in cron job:', error);
        }
    });
};

module.exports = { startCronJobs };
