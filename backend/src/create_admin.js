require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

console.log('Starting create_admin...');

// Use MONGO_URI from .env if available
const uri = process.env.MONGO_URI || "mongodb://localhost:27017/shivani-photos";

const createAdmin = async () => {
    try {
        console.log('User model loaded');

        await mongoose.connect(uri);
        console.log('MongoDB Connected');

        // Delete old admin if exists
        await User.deleteOne({ username: 'admin' });
        console.log('Removed old "admin" user if existed');

        const existingAdmin = await User.findOne({ username: 'spf@12' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Harsh@1205', salt);

        if (existingAdmin) {
            console.log('User spf@12 already exists');
            // Reset password
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();
            console.log('Password updated for spf@12');
        } else {
            console.log('Creating user spf@12...');
            const admin = new User({
                username: 'spf@12',
                password: hashedPassword,
            });
            await admin.save();
            console.log('User spf@12 created');
        }

        process.exit();
    } catch (err) {
        console.error('CRASHED:', err);
        process.exit(1);
    }
};

createAdmin();
