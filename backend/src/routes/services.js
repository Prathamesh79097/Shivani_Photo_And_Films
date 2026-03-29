const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// Initial seed data from frontend constants
const initialServices = [
    {
        name: 'Wedding Signature',
        price: 'From ₹50,000',
        perks: ['Two lead photographers', 'Full-day coverage', 'Highlight album', '4K cinematic film'],
        order: 0
    },
    {
        name: 'Cinematic Films',
        price: 'From ₹35,000',
        perks: ['Storyboarding & shot lists', 'Drone coverage (where permitted)', 'Licensed music', 'Teaser + full film'],
        order: 1
    },
    {
        name: 'Portraits & Editorial',
        price: 'From ₹8,500',
        perks: ['Studio & on-location', 'Creative direction', 'Professional retouching', 'Next-day selects'],
        order: 2
    },
    {
        name: 'Events & Birthdays',
        price: 'From ₹12,000',
        perks: ['Candid focus', 'Detail storytelling', 'Highlights reel', 'Private gallery delivery'],
        order: 3
    },
    {
        name: 'Product Stories',
        price: 'From ₹9,000',
        perks: ['Styled sets', 'Consistent lighting', 'Color-accurate edits', 'E-commerce ready exports'],
        order: 4
    },
    {
        name: 'Pre-Wedding Editorial',
        price: 'From ₹18,000',
        perks: ['Location scout', 'Wardrobe coordination', 'Golden hour coverage', 'Cinematic grading'],
        order: 5
    },
];

// Seed services if empty
const seedServices = async () => {
    try {
        const count = await Service.countDocuments();
        if (count === 0) {
            await Service.insertMany(initialServices);
            console.log('Services seeded successfully');
        }
    } catch (err) {
        console.error('Error seeding services:', err);
    }
};

seedServices();

// GET all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find().sort({ order: 1 });
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST new service (Admin only)
router.post('/', auth, async (req, res) => {
    try {
        const { name, price, perks } = req.body;
        const count = await Service.countDocuments();
        const newService = new Service({
            name,
            price,
            perks,
            order: count,
        });
        const service = await newService.save();
        req.io.emit('services-updated');
        res.json(service);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT update service (Admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, price, perks } = req.body;
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            { name, price, perks },
            { new: true }
        );
        req.io.emit('services-updated');
        res.json(service);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE service (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        req.io.emit('services-updated');
        res.json({ message: 'Service removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
