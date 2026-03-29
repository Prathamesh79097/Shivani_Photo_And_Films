const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Adjust path to models if necessary
const GallerySection = require('./models/GallerySection');

// Load env vars from backend root (assuming script is run from backend dir or we point to .env)
// We'll assume we run this from 'backend' root folder so .env is in ./
dotenv.config({ path: 'src/../.env' });

// Or if .env is in backend root:
// dotenv.config();

const checkDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error("MONGODB_URI is not defined in .env");
            // Try explicit path if generic logic fails
            require('dotenv').config({ path: '.env' });
        }

        console.log("Connecting to:", process.env.MONGODB_URI);

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const sections = await GallerySection.find({});
        console.log('Found', sections.length, 'sections');

        const fs = require('fs');
        fs.writeFileSync('db_dump.json', JSON.stringify(sections, null, 2));
        console.log('Dumped to db_dump.json');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDB();
