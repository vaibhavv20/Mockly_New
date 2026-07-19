const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Paper = require('../models/Paper');
const OTP = require('../models/OTP');
const BlacklistedToken = require('../models/BlacklistedToken');
const sendEmail = require('../utils/sendEmail');
const auth = require('../middleware/auth');

// Helper to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// @route   POST api/auth/signup
// @desc    Register a user & send OTP
// @access  Public
router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, mobile, password, avatar } = req.body;

        if (!firstName || !lastName || !email || !mobile || !password) {
            return res.status(400).json({ msg: 'Please enter all required fields' });
        }

        let user = await User.findOne({ email });
        if (user && user.isVerified) {
            return res.status(400).json({ msg: 'User already exists and is verified' });
        }

        if (user && !user.isVerified) {
            // Update password and details for unverified user
            user.firstName = firstName;
            user.lastName = lastName;
            user.mobile = mobile;
            user.avatar = avatar;
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        } else {
            user = new User({ firstName, lastName, email, mobile, password, avatar });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        // Generate OTP
        const otpValue = generateOTP();
        
        // Remove existing OTPs for this email to prevent spam
        await OTP.deleteMany({ email });
        
        const newOTP = new OTP({ email, otp: otpValue });
        await newOTP.save();

        // Send Email
        const message = `Welcome to Mockly! Your email verification code is: ${otpValue}\nThis code is valid for 5 minutes.`;
        
        const htmlTemplate = `
        <div style="font-family: 'Inter', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; padding: 40px; border-radius: 16px; color: #f8fafc; border: 1px solid #334155;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #3b82f6; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -1px;">Mockly</h1>
            </div>
            <div style="background-color: #1e293b; padding: 40px 30px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                <h2 style="margin-top: 0; font-size: 24px; font-weight: 600;">Verify Your Email</h2>
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">Welcome aboard! Use the secure verification code below to activate your Mockly account and start your journey.</p>
                <div style="background-color: #0f172a; border: 2px dashed #3b82f6; padding: 20px; border-radius: 12px; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #3b82f6; margin-bottom: 30px; box-shadow: inset 0 0 20px rgba(59, 130, 246, 0.1);">
                    ${otpValue}
                </div>
                <p style="color: #64748b; font-size: 14px; margin: 0;">This code will expire in 5 minutes.</p>
            </div>
            <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 13px; line-height: 1.5;">
                &copy; 2026 Mockly Premium Test Series.<br>
                If you didn't request this, you can safely ignore this email.
            </div>
        </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Verify Your Email - Mockly',
                message,
                html: htmlTemplate
            });
            res.status(200).json({ msg: 'OTP sent to email. Please check your inbox.' });
        } catch (err) {
            console.error('Email error:', err);
            res.status(500).json({ msg: 'Error sending email. Please try again later.' });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/verify-email
// @desc    Verify OTP and log in
// @access  Public
router.post('/verify-email', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) return res.status(400).json({ msg: 'Email and OTP are required' });

        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) return res.status(400).json({ msg: 'Invalid or expired OTP' });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        user.isVerified = true;
        await user.save();
        await OTP.deleteMany({ email }); // clear used OTPs

        const payload = { user: { id: user.id, isAdmin: user.isAdmin } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, avatar: user.avatar, isAdmin: user.isAdmin }
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ msg: 'Please enter all required fields' });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        if (!user.isVerified) return res.status(401).json({ msg: 'Please verify your email first' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id, isAdmin: user.isAdmin } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, avatar: user.avatar, isAdmin: user.isAdmin }
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/forgot-password
// @desc    Send OTP for password reset
// @access  Public
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ msg: 'Email is required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User with this email does not exist' });

        const otpValue = generateOTP();
        await OTP.deleteMany({ email });
        const newOTP = new OTP({ email, otp: otpValue });
        await newOTP.save();

        const message = `Your password reset code is: ${otpValue}\nThis code is valid for 5 minutes.`;
        
        const htmlTemplate = `
        <div style="font-family: 'Inter', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; padding: 40px; border-radius: 16px; color: #f8fafc; border: 1px solid #334155;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #8b5cf6; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -1px;">Mockly</h1>
            </div>
            <div style="background-color: #1e293b; padding: 40px 30px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                <h2 style="margin-top: 0; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">We received a request to reset your password. Use the secure code below to securely change your password.</p>
                <div style="background-color: #0f172a; border: 2px dashed #8b5cf6; padding: 20px; border-radius: 12px; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #8b5cf6; margin-bottom: 30px; box-shadow: inset 0 0 20px rgba(139, 92, 246, 0.1);">
                    ${otpValue}
                </div>
                <p style="color: #64748b; font-size: 14px; margin: 0;">This code will expire in 5 minutes.</p>
            </div>
            <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 13px; line-height: 1.5;">
                &copy; 2026 Mockly Premium Test Series.<br>
                If you didn't request this password reset, please ignore this email and your account will remain safe.
            </div>
        </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Mockly - Password Reset OTP',
                message,
                html: htmlTemplate
            });
            res.status(200).json({ msg: 'OTP sent to email. Please check your inbox.' });
        } catch (err) {
            console.error('Email error:', err);
            res.status(500).json({ msg: 'Error sending email' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/reset-password
// @desc    Reset password using OTP
// @access  Public
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) return res.status(400).json({ msg: 'Please provide email, OTP, and new password' });

        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) return res.status(400).json({ msg: 'Invalid or expired OTP' });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        await OTP.deleteMany({ email });

        res.json({ msg: 'Password has been reset successfully. You can now log in.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/logout
// @desc    Logout user & blacklist token
// @access  Private (requires token)
router.post('/logout', auth, async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        const blacklisted = new BlacklistedToken({ token });
        await blacklisted.save();
        res.json({ msg: 'Logged out successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/notify
// @desc    Register to be notified for a specific exam/mock
// @access  Private
router.post('/notify', auth, async (req, res) => {
    try {
        const { testId, testName } = req.body;
        if (!testId || !testName) {
            return res.status(400).json({ msg: 'Test ID and name are required' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        const paper = await Paper.findById(testId);
        if (!paper) {
            return res.status(404).json({ msg: 'Test not found' });
        }
        
        const now = new Date();
        const isActuallyLive = paper.startTime ? new Date(paper.startTime) <= now : paper.isLiveNow;
        
        if (isActuallyLive) {
            return res.status(400).json({ msg: 'Test is already live!' });
        }
        
        // Add user to notify array if not already present
        if (!paper.notifyUsers.includes(user._id)) {
            paper.notifyUsers.push(user._id);
            await paper.save();
        }

        const message = `Hi ${user.firstName}, you have successfully registered to be notified when the ${testName} mock test goes live!`;
        
        const htmlTemplate = `
        <div style="font-family: 'Inter', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; padding: 40px; border-radius: 16px; color: #f8fafc; border: 1px solid #334155;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #10b981; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -1px;">Mockly</h1>
            </div>
            <div style="background-color: #1e293b; padding: 40px 30px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); color: #10b981; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 20px auto;">🔔</div>
                <h2 style="margin-top: 0; font-size: 24px; font-weight: 600;">Notification Confirmed!</h2>
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">Hi ${user.firstName}, you're officially on the list. We'll send you an alert the moment the <strong>${testName}</strong> goes live.</p>
                
                <p style="color: #64748b; font-size: 14px; margin: 0;">In the meantime, keep preparing and check out our daily quizzes.</p>
            </div>
            <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 13px; line-height: 1.5;">
                &copy; 2026 Mockly Premium Test Series.<br>
                Empowering your preparation journey.
            </div>
        </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: `Notification Set: ${testName} - Mockly`,
                message,
                html: htmlTemplate
            });
            res.status(200).json({ msg: `Notification set for ${testName}` });
        } catch (err) {
            console.error('Email error:', err);
            res.status(500).json({ msg: 'Error sending confirmation email' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/admin-login
// @desc    Admin login - sends OTP
// @access  Public
router.post('/admin-login', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ msg: 'Email is required' });

        const user = await User.findOne({ email });
        if (!user || !user.isAdmin) {
            return res.status(403).json({ msg: 'Unauthorized: Not an Admin' });
        }

        const otpValue = generateOTP();
        await OTP.deleteMany({ email });
        const newOTP = new OTP({ email, otp: otpValue });
        await newOTP.save();

        const message = `Your Admin login OTP is: ${otpValue}\nThis code is valid for 5 minutes.`;
        
        try {
            await sendEmail({
                email: user.email,
                subject: 'Admin Login OTP - Mockly',
                message,
                html: `<div style="font-family: sans-serif; padding: 20px;"><h2>Admin Login</h2><p>Your OTP is: <strong>${otpValue}</strong></p></div>`
            });
            res.status(200).json({ msg: 'OTP sent to admin email.' });
        } catch (err) {
            console.error('Email error:', err);
            res.status(500).json({ msg: 'Error sending email' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/admin-verify
// @desc    Verify Admin OTP and log in
// @access  Public
router.post('/admin-verify', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ msg: 'Email and OTP required' });

        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) return res.status(400).json({ msg: 'Invalid or expired OTP' });

        const user = await User.findOne({ email });
        if (!user || !user.isAdmin) return res.status(403).json({ msg: 'Unauthorized' });

        await OTP.deleteMany({ email });

        const payload = { user: { id: user.id, isAdmin: true } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                user: { id: user.id, email: user.email, isAdmin: true }
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
