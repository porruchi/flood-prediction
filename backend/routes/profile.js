const express = require('express');
const router = express.Router();
const multer = require('multer');

// ตั้งค่า multer สำหรับการอัปโหลดไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// เส้นทางการดึงข้อมูลโปรไฟล์
router.get('/user/profile', (req, res) => {
  const userProfile = {
    phone: "123-456-7890",
    birthday: "1990-01-01",
    bio: "This is my bio",
    petTypes: ['Dog', 'Cat'],
    showEmail: true,
    profileImage: '/uploads/someimage.jpg', // รูปภาพจากโฟลเดอร์ uploads
  };

  res.status(200).json({ message: 'User profile fetched successfully', data: userProfile });
});

// เส้นทางการอัปเดตโปรไฟล์
router.put('/user/profile', upload.single('profileImage'), (req, res) => {
  const { phone, birthday, bio, petTypes, showEmail } = req.body;
  const profileImage = req.file; // รูปภาพที่ถูกอัปโหลด

  const updatedUser = {
    phone,
    birthday,
    bio,
    petTypes,
    showEmail,
    profileImage: profileImage ? profileImage.path : null,
  };

  res.status(200).json({ message: 'Profile updated successfully', data: updatedUser });
});

module.exports = router;
