const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const GallerySection = require('../models/GallerySection');
const auth = require('../middleware/auth');

// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../uploads');
        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // secure unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'file-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|mp4|webm|ogg/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images and videos are allowed'));
    },
});

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
            coverImage: req.file ? `/uploads/${req.file.filename}` : undefined,
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

// POST /api/gallery/:slug/images - Add image
router.post(
    '/:slug/images',
    auth,
    upload.single('image'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const fileUrl = `/uploads/${req.file.filename}`;
            const section = await GallerySection.findOne({ slug: req.params.slug });

            if (!section) {
                return res.status(404).json({ message: 'Section not found' });
            }

            section.images.push(fileUrl);
            await section.save();

            req.io.emit('gallery-updated');
            res.json(section);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// POST /api/gallery/:slug/videos - Add video (using same upload middleware, field name 'video')
router.post(
    '/:slug/videos',
    auth,
    upload.single('video'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const fileUrl = `/uploads/${req.file.filename}`;
            const section = await GallerySection.findOne({ slug: req.params.slug });

            if (!section) {
                return res.status(404).json({ message: 'Section not found' });
            }

            // Ensure videos array exists
            if (!section.videos) section.videos = [];

            section.videos.push(fileUrl);
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

        section.images = section.images.filter((img) => img !== imageUrl);
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
            section.videos = section.videos.filter((vid) => vid !== videoUrl);
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
