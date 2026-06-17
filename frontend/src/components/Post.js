// Post.js
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line
import { Card, CardContent, CardActions, IconButton, Typography, Grid, TextField, Button, Box } from '@mui/material';
import ReviewsIcon from '@mui/icons-material/Reviews';
import IosShareIcon from '@mui/icons-material/IosShare';
import LikeButton from './LikeButton';
import axios from 'axios';
import Comment from './Comment';
import DeleteButton from './DeleteButton';
import { shareContent } from './shareUtil';

const Post = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [comment, setComment] = useState('');

  const [postState, setPostState] = useState({
    ...post,
    likes: Array.isArray(post.likes) ? post.likes : [] // ตรวจสอบว่า likes เป็น array ถ้าไม่ใช่ให้กำหนดเป็น array เปล่า
  });

  // Fetch user ID and comments when the component mounts
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setCurrentUserId(userId);
      console.log("Loaded User ID:", userId);
    } else {
      console.error("User ID is not set in localStorage");
    }

    
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/pawpaw_test/posts/${postState._id}/comments`);
        setComments(response.data.comments);  // Set comments from the backend response
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };
    
    // eslint-disable-next-line
    fetchComments();
    
  }, [postState._id]);

  // Function to add a new comment to the state
  const handleAddComment = (newComment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };
  

  // Handle like for post
  const handleLikePost = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to like the post.');
        return false; // แสดงสถานะว่าไม่สำเร็จ
      }
  
      const response = await axios.post(
        `http://localhost:5000/pawpaw_test/posts/${postState._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.success) {
        console.log("postState.likes:", postState.likes);
        console.log("Current User ID:", currentUserId);
        setPostState((prevState) => ({
          ...prevState,
          likes: response.data.likes, // อัปเดตจำนวนไลค์ใน state
        }));
        return true; // แสดงสถานะว่าสำเร็จ
      }
    } catch (error) {
      console.error('Failed to like/unlike the post', error);
    }
    return false; // แสดงสถานะว่าไม่สำเร็จ
  };
  
  const handleSharePost = () => {
    shareContent({
      title: postState.content || 'Check out this post!',
      text: postState.content,
      url: `${window.location.origin}/posts/${postState._id}`,
    });
  };
  
  
  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (comment.trim() !== '') {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please log in to comment.');
          return;
        }

        // Send the comment to the backend
        const response = await axios.post(`http://localhost:5000/pawpaw_test/posts/${postState._id}/comment`, { content: comment }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(postState._id)

        // Check if the comment submission was successful
        if (response.data.success) {
          console.log('New Comment:', response.data.comment);
          handleAddComment(response.data.comment);  // Add the new comment to state
          setComment('');  // Clear the comment input field
        }
        
      } catch (error) {
        console.error('Failed to create comment:', error);
      }
    }
  };

  console.log("Current User ID:", currentUserId);
  console.log("Post User ID:", postState.userId);

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to delete the post.');
        return;
      }
  
      await axios.delete(`http://localhost:5000/pawpaw_test/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // TODO: Remove the post from UI after successful deletion
      alert('Post deleted successfully.');
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };
  

  return (
    <Card
  key={postState._id}
  sx={{
    maxWidth: 800, // Adjusted width for a better layout
    margin: '20px auto',
    borderRadius: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
  }}
>
  {/* Post Header */}
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <Typography variant="subtitle1">
    <Typography component="span" sx={{ fontWeight: 'bold' }}>
      {postState.userId.username}
    </Typography>
    {' '}| {new Date(postState.createdAt).toLocaleDateString()} | {new Date(postState.createdAt).toLocaleTimeString()}
  </Typography>
    {currentUserId && postState.userId && currentUserId.toString() === postState.userId._id.toString() && (
      <DeleteButton onDelete={() => handleDeletePost(postState._id)} />
    )}
  </Box>

  {/* Thumbnail and Content */}
  <Box sx={{ display: 'flex', marginTop: '16px' }}>
    {post.images && post.images.length > 0 && (
      <img
        src={`http://localhost:5000${post.images[0].url}`}
        alt="Post Thumbnail"
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '12px',
          objectFit: 'cover',
          marginRight: '16px',
          cursor: 'pointer',
        }}
        onClick={() => window.open(`http://localhost:5000${post.images[0].url}`, '_blank')}
      />
    )}
    <Typography variant="body1" sx={{ flex: 1, alignSelf: 'center' }}>
      {postState.content}
    </Typography>
  </Box>

  {/* Actions */}
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
    <LikeButton
      likedByUser={currentUserId ? postState.likes.includes(currentUserId) : false}
      onLike={handleLikePost}
      likeCount={postState.likes.length}
    />
    <IconButton aria-label="comment">
      <ReviewsIcon />
    </IconButton>
    <TextField
      placeholder="Write a comment..."
      variant="outlined"
      size="small"
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      sx={{
        flexGrow: 1,
        backgroundColor: '#ffffff',
        borderRadius: '16px',
      }}
    />
    <Button variant="contained" color="primary" onClick={handleCommentSubmit} sx={{ borderRadius: '16px' }}>
      Comment
    </Button>
    <IconButton aria-label="share" onClick={handleSharePost}>
      <IosShareIcon />
    </IconButton>
  </Box>

  {/* Comments Section */}
  {comments.length > 0 && (
    <Box sx={{ marginTop: '16px' }}>
      <Comment postId={postState._id} initialComments={comments} />
    </Box>
  )}
</Card>

  );
};

export default Post;
