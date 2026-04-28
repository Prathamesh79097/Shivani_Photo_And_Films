const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const GallerySection = require('../models/GallerySection');
const auth = require('../middleware/auth');

const upload = require('../../config/cloudinary');
const cloudinary = require('cloudinary').v2;

// Helper to create slug
const createSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');      // Trim - from end of text
};

// GET /api/gallery/signature - Generate Cloudinary upload signature
router.get('/signature', auth, (req, res) => {
    try {
        const timestamp = Math.round((new Date).getTime() / 1000);
        const folder = 'shivani_gallery';
        const signature = cloudinary.utils.api_sign_request({
            timestamp: timestamp,
            folder: folder
        }, process.env.CLOUDINARY_API_SECRET);

        res.json({
            timestamp,
            signature,
            folder,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to generate signature' });
    }
});

// GET /api/gallery - Get all sections
router.get('/', async (req, res) => {
    try {
        const sections = await GallerySection.find().sort({ createdAt: 1 });
        res.json(sections);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/gallery - Create new section
router.post('/', auth, upload.single('coverImage'), async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const slug = createSlug(title);

        // Check if slug exists
        const existing = await GallerySection.findOne({ slug });
        if (existing) {
            return res.status(400).json({ message: 'Section with this title already exists' });
        }

        const newSection = new GallerySection({
            title,
            description,
            slug,
            coverImage: req.file ? req.file.path : undefined,
            images: [],
            videos: []
        });

        await newSection.save();
        res.json(newSection);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/gallery/:id - Delete section
router.delete('/:id', auth, async (req, res) => {
    try {
        const section = await GallerySection.findById(req.params.id);
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        await GallerySection.findByIdAndDelete(req.params.id);
        res.json({ message: 'Section deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/gallery/:slug/images - Add image URLs directly
router.post(
    '/:slug/images',
    auth,
    async (req, res) => {
        try {
            const { files } = req.body; // Array of {url, publicId}
            if (!files || !Array.isArray(files) || files.length === 0) {
                return res.status(400).json({ message: 'No files provided' });
            }

            const section = await GallerySection.findOne({ slug: req.params.slug });

            if (!section) {
                return res.status(404).json({ message: 'Section not found' });
            }

            section.images.push(...files);
            await section.save();

            req.io.emit('gallery-updated');
            res.json(section);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// POST /api/gallery/:slug/videos - Add video URLs directly
router.post(
    '/:slug/videos',
    auth,
    async (req, res) => {
        try {
            const { files } = req.body; // Array of {url, publicId}
            if (!files || !Array.isArray(files) || files.length === 0) {
                return res.status(400).json({ message: 'No files provided' });
            }

            const section = await GallerySection.findOne({ slug: req.params.slug });

            if (!section) {
                return res.status(404).json({ message: 'Section not found' });
            }

            // Ensure videos array exists
            if (!section.videos) section.videos = [];

            section.videos.push(...files);
            await section.save();

            req.io.emit('gallery-updated');
            res.json(section);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// DELETE /api/gallery/:slug/images - Remove image
router.delete('/:slug/images', auth, async (req, res) => {
    const { imageUrl } = req.body;
    try {
        const section = await GallerySection.findOne({ slug: req.params.slug });
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        section.images = section.images.filter((img) => {
            if (typeof img === 'string') return img !== imageUrl;
            return img.url !== imageUrl;
        });
        await section.save();

        req.io.emit('gallery-updated');
        res.json(section);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/gallery/:slug/videos - Remove video
router.delete('/:slug/videos', auth, async (req, res) => {
    const { videoUrl } = req.body;
    try {
        const section = await GallerySection.findOne({ slug: req.params.slug });
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        if (section.videos) {
            section.videos = section.videos.filter((vid) => {
                if (typeof vid === 'string') return vid !== videoUrl;
                return vid.url !== videoUrl;
            });
            await section.save();
        }

        req.io.emit('gallery-updated');
        res.json(section);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/gallery/seed - Seed data from body (Admin only)
router.post('/seed', auth, async (req, res) => {
    try {
        const { sections } = req.body; // Array of section objects
        if (!sections || !Array.isArray(sections)) {
            return res.status(400).json({ message: 'Invalid data' });
        }

        // Clear existing
        await GallerySection.deleteMany({});

        // Insert new
        await GallerySection.insertMany(sections);

        res.json({ message: 'Database seeded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;


