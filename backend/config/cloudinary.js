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
    params: async (req, file) => {
        return {
            folder: 'shivani_gallery',
            asset_folder: 'shivani_gallery',
            use_asset_folder_as_public_id_prefix: true,
            allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov'],
            resource_type: 'auto',
            display_name: file.originalname,
        };
    },
});

const upload = multer({ storage: storage });

module.exports = upload;