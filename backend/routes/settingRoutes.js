const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const User = require('../models/User');
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

// Helper function to get or create the global setting document
const getGlobalSettings = async () => {
    let settings = await Setting.findOne({ identifier: 'global_settings' });
    if (!settings) {
        settings = new Setting({ identifier: 'global_settings' });
        await settings.save();
    }
    return settings;
};

// @route   GET /api/settings
// @desc    Get global settings
// @access  Public (some settings might be hidden in the future if needed)
router.get('/', async (req, res) => {
    try {
        const settings = await getGlobalSettings();
        // For now, all these settings are safe to be public as they affect the frontend UX
        res.json({
            success: true,
            settings: {
                maintenanceMode: settings.maintenanceMode,
                allowRegistrations: settings.allowRegistrations,
                globalBannerActive: settings.globalBannerActive,
                globalBannerText: settings.globalBannerText
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error fetching settings');
    }
});

// @route   PUT /api/settings
// @desc    Update global settings
// @access  Private (Admin)
router.put('/', auth, adminAuth, async (req, res) => {
    try {
        const { maintenanceMode, allowRegistrations, globalBannerActive, globalBannerText } = req.body;
        
        let settings = await getGlobalSettings();
        
        if (typeof maintenanceMode === 'boolean') settings.maintenanceMode = maintenanceMode;
        if (typeof allowRegistrations === 'boolean') settings.allowRegistrations = allowRegistrations;
        if (typeof globalBannerActive === 'boolean') settings.globalBannerActive = globalBannerActive;
        if (globalBannerText !== undefined) settings.globalBannerText = globalBannerText;

        await settings.save();

        res.json({
            success: true,
            msg: 'Settings updated successfully',
            settings
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error updating settings');
    }
});

module.exports = router;
