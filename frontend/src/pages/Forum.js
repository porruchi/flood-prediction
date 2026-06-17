import React, { useState, useEffect } from 'react';
import { Box, Typography, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import axios from 'axios';

const Forum = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pawpaw_test/all');
        if (response.data.success) {
          setPosts(response.data.posts);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    fetchPosts(); // เรียกใช้ fetchPosts เมื่อตัวคอมโพเนนต์ถูก mount
  }, []);

  // ฟังก์ชันสำหรับเพิ่มโพสต์ใหม่ใน state
  const handleAddPost = (newPost) => {
    setPosts([newPost, ...posts]); // เพิ่มโพสต์ใหม่ที่ด้านบนของรายการโพสต์
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Forum
      </Typography>
      {/* คอมโพเนนต์สำหรับสร้างโพสต์ */}
      <CreatePost onAddPost={handleAddPost} />
      {/* แสดงคอมโพเนนต์โพสต์ */}
      <Box sx={{ width: '100%', maxWidth: '800px' }}>
        {posts.map((post, index) => (
          <Post key={post._id || index} post={post} />
        ))}
      </Box>
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => alert('Add new functionality coming soon')}
        sx={{ position: 'fixed', bottom: 20, right: 20 }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default Forum;
