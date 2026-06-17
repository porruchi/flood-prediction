import React, { useState, useEffect } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { IconButton, Typography } from '@mui/material';

const LikeButton = ({ likedByUser, onLike, likeCount }) => {
  // ตั้งค่า state ให้ตรงกับ props ที่รับเข้ามา
  const [liked, setLiked] = useState(likedByUser);
  const [count, setCount] = useState(likeCount);

  // อัปเดต state ทุกครั้งที่ props เปลี่ยนแปลง
  useEffect(() => {
    console.log("LikedByUser prop in LikeButton:", likedByUser);
    console.log("LikeCount prop in LikeButton:", likeCount);
    setLiked(likedByUser);
    setCount(likeCount);
  }, [likedByUser, likeCount]);
  
  const handleLikeClick = async () => {
    const token = localStorage.getItem('token'); // ตรวจสอบ token
    if (!token) {
      alert('Please log in to like.');
      return;
    }
    const success = await onLike();
    if (success) {
      setLiked((prevLiked) => !prevLiked); // Toggle liked
      setCount((prevCount) => prevCount + (liked ? -1 : 1)); // อัปเดตจำนวนไลค์
      console.log("Liked state:", liked);
    }
  };  
  
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <IconButton onClick={handleLikeClick}>
        {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
      </IconButton>
      <Typography variant="body2">{count} Likes</Typography>
    </div>
  );
};

export default LikeButton;
