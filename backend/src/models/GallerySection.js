const { Schema, model } = require('mongoose');

const GallerySectionSchema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        coverImage: { type: Schema.Types.Mixed }, // Main display image URL/path
        images: [{ type: Schema.Types.Mixed }], // Array of image URLs/paths or objects with { url, publicId }
        videos: [{ type: Schema.Types.Mixed }], // Array of video URLs/paths or objects with { url, publicId }
    },
    { timestamps: true }
);

module.exports = model('GallerySection', GallerySectionSchema);
