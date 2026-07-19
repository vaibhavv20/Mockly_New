const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const CurrentAffair = require('../models/CurrentAffair');

const filePath = path.join(__dirname, '../../data/current_affairs/sample_data.txt');

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const lines = fileContent.split('\n');

        let currentCategory = 'General';
        let currentItem = null;
        const affairsToInsert = [];

        // Simple Regex to detect numbered items like "1. Title"
        const itemRegex = /^(\d+)\.\s+(.*)/;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Check if it's an item title
            const match = line.match(itemRegex);
            if (match) {
                // If we already have an item, push it to array
                if (currentItem) {
                    affairsToInsert.push(currentItem);
                }
                
                // Start a new item
                currentItem = {
                    title: match[2].trim(),
                    category: currentCategory,
                    content: ''
                };
            } 
            // Check if it looks like a category header (e.g. starts with emoji or fully uppercase without numbers)
            else if (!currentItem && !line.match(/^[a-z]/)) {
                // We assume lines that don't match items, and appear outside items, are categories
                currentCategory = line.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/gu, '').trim();
            } 
            // Otherwise, it is content for the current item
            else if (currentItem) {
                // If it's a category header showing up after an item, we need to handle it.
                // Usually categories are uppercase and have emojis.
                if (line.match(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u) || (line === line.toUpperCase() && line.length > 5 && !line.includes(':'))) {
                    // Push the old item
                    affairsToInsert.push(currentItem);
                    currentItem = null;
                    // Update category
                    currentCategory = line.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/gu, '').trim();
                } else {
                    currentItem.content += line + '\n\n';
                }
            }
        }

        // Push the very last item
        if (currentItem) {
            affairsToInsert.push(currentItem);
        }

        if (affairsToInsert.length === 0) {
            console.log('No current affairs parsed.');
            process.exit(0);
        }

        // Clean up content slightly
        affairsToInsert.forEach(a => a.content = a.content.trim());

        console.log(`Parsed ${affairsToInsert.length} current affairs. Inserting to database...`);

        // You can choose to delete existing ones or just insert new ones
        // await CurrentAffair.deleteMany({});
        
        await CurrentAffair.insertMany(affairsToInsert);
        
        console.log('Data successfully seeded!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
}

seedData();
