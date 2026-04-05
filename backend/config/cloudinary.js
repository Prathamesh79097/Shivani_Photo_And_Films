const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Links to the keys we will hide in the .env file
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_KEY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'shivani_gallery',
        allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov'],
        resource_type: 'auto', // Detects if it's a photo or a reel
    },
});

const upload = multer({ storage: storage });

module.exports = upload;