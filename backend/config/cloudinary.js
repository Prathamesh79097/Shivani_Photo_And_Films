const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Links to the keys we will hide in the .env file
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let resource_type = 'auto';
        if (file.mimetype.includes('video')) {
            resource_type = 'video';
        } else if (file.mimetype.includes('image')) {
            resource_type = 'image';
        }

        return {
            folder: 'shivani_gallery',
            resource_type: resource_type,
            chunk_size: 6000000, // 6 MB chunk size to support large mobile video uploads smoothly
        };
    },
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // Set max upload to 100MB max per file limit just in case
    }
});

module.exports = upload;