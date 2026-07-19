const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Define the email options
    const mailOptions = {
        from: `Mockly Admin <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    // Send the email with retry logic (useful for when PC wakes from sleep)
    let retries = 3;
    while (retries > 0) {
        try {
            await transporter.sendMail(mailOptions);
            break; // Success, exit loop
        } catch (error) {
            retries--;
            if (retries === 0) throw error;
            // Wait 2 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
};

module.exports = sendEmail;
