//post.js controllers
//post.js
const Post = require('../models/Post');
const User = require('../models/User');

// ฟังก์ชันสร้างโพสต์
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`; // สร้าง URL ของรูปภาพ
    }

    console.log('Request User:', req.user);
    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);

    // ตรวจสอบว่ามี username และ userId ใน req.user หรือไม่
    if (!req.user || !req.user.username || !req.user.userId) {
      return res.status(400).json({ success: false, message: 'User information is missing' });
    }

    // สร้างโพสต์ใหม่
    let post = new Post({
      content,
      images: imageUrl ? [{ url: imageUrl }] : [], // เก็บ URL ของรูปภาพในโพสต์
      userId: req.user.userId,
      username: req.user.username,
    });

    await post.save();
    post = await post.populate('userId', 'username'); // สามารถเปลี่ยนแปลงค่าได้

    res.status(201).json({ success: true, post });

  } catch (error) {
    console.error('Failed to create post:', error);
    res.status(500).json({ success: false, message: 'Failed to create post', error });
  }
};


exports.getAllPosts = async (req, res) => {
  try {
    console.log('Fetching all posts...');
    const posts = await Post.find().populate('userId', 'username');
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error('Error while fetching posts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch posts', error });
  }
};

// Like or unlike a post
exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    if (!postId) {
      return res.status(400).json({ success: false, message: 'Post ID is required' });
    }

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    let action;
    if (post.likes.includes(userId)) {
      post.likes.pull(userId); // Unlike
      action = 'Unlike';
    } else {
      post.likes.push(userId); // Like
      action = 'Like';
    }

    console.log("Updated likes in backend:", post.likes);

    await post.save();
    res.status(200).json({ success: true, action, likes: post.likes, likeCount: post.likes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to like post', error });
  }
};

// Get all posts by a specific user

exports.getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params; // รับ userId จาก URL parameter
    const posts = await Post.find({ userId }).sort({ createdAt: -1 }); // ดึงโพสต์เรียงตามวันที่ล่าสุด
    res.status(200).json({ posts });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Failed to fetch user posts' });
  }
};
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params; // ดึง postId จาก URL
    const post = await Post.findById(postId); // ค้นหาโพสต์จากฐานข้อมูล

    // ตรวจสอบว่าโพสต์นี้ถูกสร้างโดยผู้ใช้ที่กำลังล็อกอินอยู่หรือไม่
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.userId.toString() !== req.user.userId) {
      // หาก userId ของโพสต์ไม่ตรงกับ userId ของผู้ที่ล็อกอินอยู่
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this post' });
    }

    // ลบโพสต์ออกจากฐานข้อมูล
    await post.remove();
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Failed to delete post:', error);
    res.status(500).json({ success: false, message: 'Failed to delete post', error });
  }
};