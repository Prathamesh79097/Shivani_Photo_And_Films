const mongoose = require('mongoose');
const dotenv = require('dotenv');
const GallerySection = require('./models/GallerySection');

dotenv.config();

const gallerySections = [
    {
        title: 'Wedding Photography',
        slug: 'wedding-photography',
        description:
            'Timeless candids and classic portraits that preserve the emotion of every ritual.',
        image:
            '/weddis.jpeg',
        coverImage: '/weddis.jpeg',
        images: [
            '/19759466-ff37-4f16-81f6-1aab9cdbac4e.jpg',
            '/p1.jpg',
            '/wed4.jpeg',
            '/wedding1.jpeg',
        ],
    },
    {
        title: 'Pre-Wedding Photography',
        slug: 'pre-wedding-photography',
        description:
            'Editorial pre-wedding stories with cinematic light, locations, and styling.',
        image:
            '/preweddis.jpeg',
        coverImage: '/preweddis.jpeg',
        images: [
            '/6952c7e1-dc5e-4327-9942-c5a86698bf49.jpg',
            '/prewed1.jpeg',
            '/c132c5a0-cc14-4002-85b1-be1a049a16f7.jpg',
            '/prewed3.jpeg',
        ],
    },
    {
        title: 'Engagement Photography',
        slug: 'engagement-photography',
        description:
            'Celebrate the promise with graceful imagery that feels intimate and elegant.',
        image:
            '/engagedis.jpeg',
        coverImage: '/engagedis.jpeg',
        images: [
            '/953d842d-4fb1-4f1a-aa32-ef61410b7a55.jpg',
            '/engage1.jpeg',
            '/engage2.jpeg',
            '/engage4.jpeg'
        ],
    },
    {
        title: 'Birthday Photography',
        slug: 'birthday-photography',
        description:
            'Joyful frames that bottle the laughter, décor, and surprise of every celebration.',
        image:
            '/birthdis.jpeg',
        coverImage: '/birthdis.jpeg',
        images: [
            '/8444d528-a5a3-4921-850d-2ff996021f98.jpg',
            '/birhtday2.jpeg',
            '/birthday3.jpeg',
            '/birthday4.jpeg'
        ],
    },
    {
        title: 'Portraits Photography',
        slug: 'portraits-photography',
        description:
            'Studio-style portraits with refined light direction for individuals and families.',
        image:
            '/port4.jpeg',
        coverImage: '/port4.jpeg',
        images: [
            '/e403e208-fb75-4e5a-a579-de01fafd487a.jpg',
            '/gallery-1.jpg',
            '/port1.jpeg',
            '/port4.jpeg'
        ],
    },
    {
        title: 'Munj Photography',
        slug: 'munj-photography',
        description:
            'Cultural ceremonies photographed with sensitivity to tradition and detail.',
        image:
            '/munj1.jpeg',
        coverImage: '/munj1.jpeg',
        images: [
            '/munj4.jpeg',
            '/munj2.jpeg',
            '/munj3.jpeg',
            '/munj1.jpeg'
        ],
    },
    {
        title: 'Street Photography',
        slug: 'street-photography',
        description:
            'Documentary-style stories that capture life as it unfolds naturally.',
        image:
            'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
        coverImage: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
        images: [
            '/street4.jpeg',
            '/street2.jpeg',
            '/street3.jpeg',
            '/street1.jpeg'
        ],
    },
    {
        title: 'Wild Photography',
        slug: 'wild-photography',
        description:
            'Bold wildlife narratives with patience, precision, and respect for nature.',
        image:
            '/WhatsApp Image 2026-01-21 at 9.02.34 PM.jpeg',
        coverImage: '/WhatsApp Image 2026-01-21 at 9.02.34 PM.jpeg',
        images: [
            '/wild1.jpeg',
            '/wild2.jpeg',
            '/wild3.jpeg',
            '/wild4.jpeg'
        ],
    },
    {
        title: 'Product Photography',
        slug: 'product-photography',
        description:
            'Clean, high-impact visuals that help your brand stand out online and in print.',
        image:
            '/proddis.jpeg',
        coverImage: '/proddis.jpeg',
        images: [
            '/product1.jpeg',
            '/product2.jpeg',
            '/product3.jpeg',
            '/product4.jpeg'
        ],
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        await GallerySection.deleteMany({});
        console.log('Cleared existing gallery sections');

        await GallerySection.insertMany(gallerySections);
        console.log('Seed data inserted');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
