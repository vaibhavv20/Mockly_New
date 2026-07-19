const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
    // Since we only need one global settings document, we use a single identifier.
    // By convention, we can just find the document or use a specific fixed key.
    identifier: {
        type: String,
        default: 'global_settings',
        unique: true
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    allowRegistrations: {
        type: Boolean,
        default: true
    },
    globalBannerActive: {
        type: Boolean,
        default: false
    },
    globalBannerText: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema);
