require('dotenv').config();
const mongoose = require('mongoose');
const GallerySection = require('./models/GallerySection');

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/shivani-photos";

const gallerySections = [
  {
    title: 'Wedding Photography',
    slug: 'wedding-photography',
    description: 'Timeless candids and classic portraits that preserve the emotion of every ritual.',
    coverImage: '/weddis.jpeg',
    images: ['/19759466-ff37-4f16-81f6-1aab9cdbac4e.jpg', '/p1.jpg', '/wed4.jpeg', '/wedding1.jpeg'],
    videos: []
  },
  {
    title: 'Pre-Wedding Photography',
    slug: 'pre-wedding-photography',
    description: 'Editorial pre-wedding stories with cinematic light, locations, and styling.',
    coverImage: '/preweddis.jpeg',
    images: ['/6952c7e1-dc5e-4327-9942-c5a86698bf49.jpg', '/prewed1.jpeg', '/c132c5a0-cc14-4002-85b1-be1a049a16f7.jpg', '/prewed3.jpeg'],
    videos: []
  },
  {
    title: 'Engagement Photography',
    slug: 'engagement-photography',
    description: 'Celebrate the promise with graceful imagery that feels intimate and elegant.',
    coverImage: '/engagedis.jpeg',
    images: ['/953d842d-4fb1-4f1a-aa32-ef61410b7a55.jpg', '/engage1.jpeg', '/engage2.jpeg', '/engage4.jpeg'],
    videos: []
  },
  {
    title: 'Birthday Photography',
    slug: 'birthday-photography',
    description: 'Joyful frames that bottle the laughter, décor, and surprise of every celebration.',
    coverImage: '/birthdis.jpeg',
    images: ['/8444d528-a5a3-4921-850d-2ff996021f98.jpg', '/birhtday2.jpeg', '/birthday3.jpeg', '/birthday4.jpeg'],
    videos: []
  },
  {
    title: 'Portraits Photography',
    slug: 'portraits-photography',
    description: 'Studio-style portraits with refined light direction for individuals and families.',
    coverImage: '/port4.jpeg',
    images: ['/e403e208-fb75-4e5a-a579-de01fafd487a.jpg', '/gallery-1.jpg', '/port1.jpeg', '/port4.jpeg'],
    videos: []
  },
  {
    title: 'Munj Photography',
    slug: 'munj-photography',
    description: 'Cultural ceremonies photographed with sensitivity to tradition and detail.',
    coverImage: '/munj1.jpeg',
    images: ['/munj4.jpeg', '/munj2.jpeg', '/munj3.jpeg', '/munj1.jpeg'],
    videos: []
  },
  {
    title: 'Street Photography',
    slug: 'street-photography',
    description: 'Documentary-style stories that capture life as it unfolds naturally.',
    coverImage: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    images: ['/street4.jpeg', '/street2.jpeg', '/street3.jpeg', '/street1.jpeg'],
    videos: []
  },
  {
    title: 'Wild Photography',
    slug: 'wild-photography',
    description: 'Bold wildlife narratives with patience, precision, and respect for nature.',
    coverImage: '/WhatsApp Image 2026-01-21 at 9.02.34 PM.jpeg',
    images: ['/wild1.jpeg', '/wild2.jpeg', '/wild3.jpeg', '/wild4.jpeg'],
    videos: []
  },
  {
    title: 'Product Photography',
    slug: 'product-photography',
    description: 'Clean, high-impact visuals that help your brand stand out online and in print.',
    coverImage: '/proddis.jpeg',
    images: ['/product1.jpeg', '/product2.jpeg', '/product3.jpeg', '/product4.jpeg'],
    videos: []
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB Connected to:', uri);
    
    for (let section of gallerySections) {
      const existing = await GallerySection.findOne({ slug: section.slug });
      if (!existing) {
        await GallerySection.create(section);
        console.log(`Added missing gallery: ${section.title}`);
      } else {
        console.log(`Skipped existing gallery: ${section.title}`);
      }
    }
    
    console.log('Database seeding complete. Existing cards were NOT deleted.');
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
};

seedData();
