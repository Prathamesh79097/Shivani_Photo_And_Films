const { Schema, model } = require('mongoose');

const GallerySectionSchema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        coverImage: { type: String }, // Main display image URL/path
        images: [{ type: String }], // Array of image URLs/paths
        videos: [{ type: String }], // Array of video URLs/paths
    },
    { timestamps: true }
);

module.exports = model('GallerySection', GallerySectionSchema);
