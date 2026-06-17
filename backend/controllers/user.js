const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer'); // ใช้ multer ในการจัดการไฟล์
const path = require('path');
require('dotenv').config();

// การตั้งค่า Multer สำหรับการเก็บไฟล์รูปภาพ
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // กำหนดที่เก็บไฟล์
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ให้ไม่ซ้ำกัน
    }
});

const upload = multer({ storage: storage });

// Register a new user
exports.registerUser = async (req, res) => {
    const { email, username, password, phone } = req.body;
    
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, username, password: hashedPassword, phone });
        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ success: true, message: 'User registered successfully', token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

// Login user
exports.loginUser = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email/username or password' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid email/username or password' });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ success: true, message: 'Login successful!', token, userId: user._id });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get profile of logged-in user
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // ดึง userId จาก token
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update profile and upload image
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log('Request Body:', req.body);
        console.log('Uploaded File:', req.file);

        const updatedData = req.body;
        if (req.file) {
            updatedData.profileImage = '/uploads/' + req.file.filename;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true, runValidators: true });

        if (!updatedUser) {
            console.error('User not found for ID:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
