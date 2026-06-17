import React, { useState } from 'react';
import { Card, CardContent, CardActions, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import axios from 'axios';

const CreatePost = ({ onAddPost }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState([]);
  const navigate = useNavigate();

  const handleImageChange = (imageList) => {
    setImage(imageList[0]?.file); // เก็บไฟล์ของรูปภาพที่เลือก (มีแค่รูปเดียว)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to create a post');
      navigate('/login');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image); // ส่งรูปภาพไปยัง backend
      }  

      // สร้างคำขอ POST ไปยัง Backend
      const response = await axios.post('http://localhost:5000/pawpaw_test/create', 
        formData, 
        { headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        const newPost = {
          userId: response.data.post.userId,
          content: response.data.post.content,
          images: response.data.post.images,
          likes: response.data.post.likes,
          createdAt: response.data.post.createdAt,
        };
        onAddPost(newPost);
        setContent('');
        setImage(null);
        console.log('Creating post with content:', content);

      }
    } catch (error) {
      console.error('Failed to create post', error);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, margin: '20px auto' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Create a Post
        </Typography>
        <TextField
          label="What's on your mind?"
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          sx={{ marginBottom: '1rem' }}
        />
        {/* ใช้ ImageUpload component ที่ปรับปรุงแล้ว */}
        <ImageUpload onImagesChange={handleImageChange} />
        {image && (
          <Typography variant="body2" color="textSecondary">
            1 image selected: {image.name}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Post
        </Button>
      </CardActions>
    </Card>
  );
};

export default CreatePost;
