const mongoose = require('mongoose');
const dotenv = require('dotenv');
const GallerySection = require('./models/GallerySection');
const fs = require('fs');
const path = require('path');

dotenv.config();

const restoreDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const dumpPath = path.join(__dirname, '../sections_dump.json');
        if (!fs.existsSync(dumpPath)) {
            console.error('Dump file not found:', dumpPath);
            process.exit(1);
        }

        const rawData = fs.readFileSync(dumpPath, 'utf-8');
        const sections = JSON.parse(rawData);

        // Delete existing data
        await GallerySection.deleteMany({});
        console.log('Cleared existing gallery sections');

        // Insert new data
        await GallerySection.insertMany(sections);
        console.log('Restored', sections.length, 'sections from dump');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

restoreDB();
