const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Adjust path if needed
const GallerySection = require('./models/GallerySection');

// Load env vars
dotenv.config({ path: 'src/../.env' });
// Fallback
if (!process.env.MONGODB_URI) require('dotenv').config();

const updates = {
    'pre-wedding-photography': '/preweddis.jpeg',
    'engagement-photography': '/engagedis.jpeg',
    'birthday-photography': '/birthdis.jpeg',
    'portraits-photography': '/port4.jpeg',
    'munj-photography': '/munj1.jpeg',
    'street-photography': 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    'cinematic-films-reels': '/wild1.jpeg' // Using safe image for this one
};

const fixDB = async () => {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        for (const [slug, imgPath] of Object.entries(updates)) {
            const res = await GallerySection.updateOne(
                { slug: slug },
                { $set: { coverImage: imgPath } }
            );
            console.log(`Updated ${slug}: matched ${res.matchedCount}, modified ${res.modifiedCount}`);
        }

        console.log('Fix complete');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixDB();
