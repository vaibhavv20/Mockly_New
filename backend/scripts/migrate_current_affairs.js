const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const CurrentAffair = require('../models/CurrentAffair');

// Simple slugify function
function generateSlug(title) {
    if (!title) return `article-${Date.now()}`;
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove non-word characters
        .replace(/[\s_-]+/g, '-') // Swap whitespace and dashes for a single dash
        .replace(/^-+|-+$/g, '') + // Trim dashes from start and end
        `-${Math.floor(Math.random() * 1000)}`; // add random number to ensure uniqueness
}

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mockly');
        console.log('MongoDB Connected...');

        const affairs = await CurrentAffair.find({});
        console.log(`Found ${affairs.length} current affairs to migrate.`);

        let updatedCount = 0;

        for (let affair of affairs) {
            let needsSave = false;

            // Generate slug if it doesn't exist
            if (!affair.slug) {
                affair.slug = generateSlug(affair.title);
                needsSave = true;
            }

            // Set default difficulty if missing
            if (!affair.difficulty) {
                affair.difficulty = 'Medium';
                needsSave = true;
            }

            if (!affair.author) {
                affair.author = 'Antigravity Editorial';
                needsSave = true;
            }

            if (needsSave) {
                await affair.save();
                updatedCount++;
            }
        }

        console.log(`Migration Complete. Updated ${updatedCount} records.`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
