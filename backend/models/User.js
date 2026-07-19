const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: '1'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isPremium: {
        type: Boolean,
        default: false
    },

    streak: {
        type: Number,
        default: 0
    },
    lastLoginDate: {
        type: Date
    },
    achievements: [{
        type: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
