const { Schema, model } = require('mongoose');

const GallerySectionSchema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        coverImage: { type: String }, // Main display image URL
        images: [{ url: String, publicId: String }], // Cloudinary data
        videos: [{ url: String, publicId: String }], // Cloudinary data
    },
    { timestamps: true }
);

module.exports = model('GallerySection', GallerySectionSchema);
