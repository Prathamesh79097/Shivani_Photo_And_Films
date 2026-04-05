const express = require('express');
const router = express.Router();
const upload = require('../../config/cloudinary');
const GallerySection = require('../models/GallerySection');
const auth = require('../middleware/auth');
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

        // Ideally, we would also iterate and delete images/videos from Cloudinary here
        if (section.images && section.images.length > 0) {
            for (const img of section.images) {
                if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
            }
        }
        if (section.videos && section.videos.length > 0) {
            for (const vid of section.videos) {
                if (vid.publicId) await cloudinary.uploader.destroy(vid.publicId, { resource_type: 'video' });
            }
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

            const imageUrl = req.file.path;
            const publicId = req.file.filename;

            const section = await GallerySection.findOne({ slug: req.params.slug });

            if (!section) {
                return res.status(404).json({ message: 'Section not found' });
            }

            section.images.push({ url: imageUrl, publicId: publicId });
            await section.save();

            req.io.emit('gallery-updated');
            res.json(section);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// POST /api/gallery/:slug/videos - Add video
router.post(
    '/:slug/videos',
    auth,
    upload.single('video'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const videoUrl = req.file.path;
            const publicId = req.file.filename;

            const section = await GallerySection.findOne({ slug: req.params.slug });

            if (!section) {
                return res.status(404).json({ message: 'Section not found' });
            }

            if (!section.videos) section.videos = [];

            section.videos.push({ url: videoUrl, publicId: publicId });
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
    const { publicId, imageUrl } = req.body;
    try {
        const section = await GallerySection.findOne({ slug: req.params.slug });
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
            section.images = section.images.filter((img) => img.publicId !== publicId);
        } else if (imageUrl) {
            section.images = section.images.filter((img) => typeof img === 'string' ? img !== imageUrl : img.url !== imageUrl);
        }
        
        await section.save();

        req.io.emit('gallery-updated');
        res.json(section);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/gallery/:slug/videos - Remove video
router.delete('/:slug/videos', auth, async (req, res) => {
    const { publicId, videoUrl } = req.body;
    try {
        const section = await GallerySection.findOne({ slug: req.params.slug });
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        if (section.videos) {
            if (publicId) {
                await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
                section.videos = section.videos.filter((vid) => vid.publicId !== publicId);
            } else if (videoUrl) {
                section.videos = section.videos.filter((vid) => typeof vid === 'string' ? vid !== videoUrl : vid.url !== videoUrl);
            }
            await section.save();
        }

        req.io.emit('gallery-updated');
        res.json(section);
    } catch (err) {
        console.error(err);
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
