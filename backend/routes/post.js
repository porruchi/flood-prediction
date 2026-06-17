//routes post.js
const express = require('express');
const router = express.Router();
const post = require('../controllers/post');
const auth = require('../middleware/auth'); // middleware for checking if user is authenticated
const multer = require('multer');

// กำหนด fileFilter เพื่อกรองไฟล์ประเภทที่ยอมรับ
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/gif') {
    cb(null, true); // อนุญาตให้ผ่าน
  } else {
    cb(new Error('Unsupported file type, please upload .png, .jpeg, or .gif'), false); // ปฏิเสธไฟล์
  }
};

// กำหนด storage ของ multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // เก็บไฟล์ไว้ในโฟลเดอร์ 'uploads' ใน backend
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // ตั้งชื่อไฟล์ให้ไม่ซ้ำกัน
  }
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter // กรองไฟล์ตามประเภทที่กำหนด
});

// route สำหรับสร้างโพสต์ใหม่และใช้ middleware auth กับการอัปโหลดรูปภาพ
router.post('/create', auth, upload.single('image'), post.createPost);
// Route สำหรับการกดไลค์โพสต์
router.post('/:postId/like', auth, post.likePost);
//router.put('/edit/:id', auth, post.editPost);
// ลบโพสต์
router.delete('/:postId', auth, post.deletePost);
//router.post('/:id/comment', auth, post.commentPost);
router.get('/all', post.getAllPosts);

// Route สำหรับดึงโพสต์ทั้งหมดที่ผู้ใช้คนหนึ่งได้สร้างไว้
router.get('/user/:userId', auth, post.getPostsByUser);


module.exports = router;