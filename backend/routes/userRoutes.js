const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Result = require('../models/Result');
const TestSession = require('../models/TestSession');
const auth = require('../middleware/auth');

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ msg: 'Access denied. Admins only.' });
        }
        next();
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/users
// @desc    Get all users with pagination, search, and filtering
// @access  Private (Admin)
router.get('/', auth, adminAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const roleFilter = req.query.role || 'all'; // 'all', 'admin', 'premium'

        const query = {};

        // Search logic
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Role filtering logic
        if (roleFilter === 'admin') {
            query.isAdmin = true;
        } else if (roleFilter === 'premium') {
            query.isPremium = true;
        }

        const startIndex = (page - 1) * limit;
        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit)
            .select('-password');

        res.json({
            success: true,
            count: users.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            users
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error fetching users');
    }
});

// @route   PUT /api/users/:id/role
// @desc    Update user role (isAdmin, isPremium)
// @access  Private (Admin)
router.put('/:id/role', auth, adminAuth, async (req, res) => {
    try {
        const { isAdmin, isPremium } = req.body;
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Prevent admin from removing their own admin status accidentally
        if (req.params.id === req.user.id && isAdmin === false) {
             return res.status(400).json({ msg: 'You cannot remove your own admin privileges.' });
        }

        if (typeof isAdmin === 'boolean') user.isAdmin = isAdmin;
        if (typeof isPremium === 'boolean') user.isPremium = isPremium;

        await user.save();

        res.json({ success: true, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, isAdmin: user.isAdmin, isPremium: user.isPremium } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error updating user role');
    }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user and their associated results
// @access  Private (Admin)
router.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (req.params.id === req.user.id) {
            return res.status(400).json({ msg: 'You cannot delete your own account.' });
        }

        // Cascade delete results and sessions associated with the user
        await Result.deleteMany({ userId: req.params.id });
        await TestSession.deleteMany({ userId: req.params.id });

        await User.findByIdAndDelete(req.params.id);

        res.json({ success: true, msg: 'User and associated data deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error deleting user');
    }
});

module.exports = router;
