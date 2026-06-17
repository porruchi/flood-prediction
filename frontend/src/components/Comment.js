import React, { useState, useEffect, memo } from 'react';
import { TextField, Button, Typography, IconButton, Box } from '@mui/material';
import ReviewsIcon from '@mui/icons-material/Reviews';
import IosShareIcon from '@mui/icons-material/IosShare';
import LikeButton from './LikeButton';
import { shareContent } from './shareUtil';
import DeleteButton from './DeleteButton';
import axios from 'axios';

const Comment = ({ postId, initialComments }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplyFields, setShowReplyFields] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/pawpaw_test/posts/${postId}/comments`);
      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };
  
  // Fetch comments when component mounts
  useEffect(() => {
    if (!initialComments) {
      fetchComments();
    }

    const userId = localStorage.getItem('userId');
    if (userId) {
      setCurrentUserId(userId);
      console.log("Loaded User ID in Comment:", userId);
    } else {
      console.error("User ID is not set in localStorage");
    }


    // eslint-disable-next-line
  }, [initialComments]);
  // eslint-disable-next-line

  // Handle submitting a reply to a comment
  const handleReplySubmit = async (commentId) => {
    const replyContent = replyInputs[commentId];
    if (replyContent && replyContent.trim() !== '') {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please log in to reply.');
          return;
        }

        // Sending reply to the backend
        const response = await axios.post(
          `http://localhost:5000/pawpaw_test/posts/${postId}/comment`,
          {
            content: replyContent,
            parentCommentId: commentId, // Specify parentCommentId to indicate it's a reply
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          // Fetch comments again to get the updated list
          await fetchComments();

          // Clear the reply input field
          setReplyInputs((prevState) => ({
            ...prevState,
            [commentId]: '', // Clear reply input field
          }));
        }
      } catch (error) {
        console.error('Failed to create reply:', error);
      }
    }
  };

  const handleShareComment = (comment) => {
    shareContent({
      title: `Check out this comment by ${comment.userId?.username}`,
      text: comment.content,
      url: `${window.location.origin}/posts/${postId}#comment-${comment._id}`,
    });
  };
  

  // Handle like or unlike a comment
  const handleLikeComment = async (commentId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to like this comment.');
      return false;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/pawpaw_test/comments/${commentId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        console.log("comment.likes:", comments.likes);
        console.log("Current User ID:", currentUserId);

        // อัปเดต likes ใน frontend
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId ? { ...comment, likes: response.data.likes } : comment
          )
        );
        fetchComments();
        return true;
      }
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
    return false;
  };


  // Toggle reply input field visibility
  const toggleReplyField = (commentId) => {
    setShowReplyFields((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to delete the comment.');
        return;
      }
  
      await axios.delete(`http://localhost:5000/pawpaw_test/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Remove the deleted comment from state
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
      alert('Comment deleted successfully.');
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };
  

  // Memoized comment card component
  const CommentCard = memo(({ comment, isReply }) => {
    return (
      <Box
        sx={{
          marginTop: '16px',
          padding: '16px',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          backgroundColor: isReply ? '#f9f9f9' : '#ffffff', // Lighter background for replies
          marginLeft: isReply ? '24px' : '0px', // Indent replies slightly
          position: 'relative',
        }}
      >

        {/* Delete Button */}
        {currentUserId && comment.userId && currentUserId === comment.userId._id && (
          <Box sx={{ position: 'absolute', top: '8px', right: '8px' }}>
            <DeleteButton onDelete={() => handleDeleteComment(comment._id)} />
          </Box>
        )}

        {/* Username, Date, and Time */}
        <Typography variant="subtitle2">
          <span style={{ fontWeight: 'bold' }}>{comment.userId?.username || 'Unknown'}</span>
          {' '}| {new Date(comment.createdAt).toLocaleDateString()} | {new Date(comment.createdAt).toLocaleTimeString()}
        </Typography>
  
        {/* Comment Content */}
        <Typography variant="body2" sx={{ marginTop: '8px' }}>
          {comment.content}
        </Typography>
  
        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          <LikeButton
            likedByUser={currentUserId ? comment.likes.includes(currentUserId) : false}
            onLike={() => handleLikeComment(comment._id)}
            likeCount={comment.likes.length}
          />
          <IconButton aria-label="reply" onClick={() => toggleReplyField(comment._id)}>
            <ReviewsIcon />
          </IconButton>
          <IconButton aria-label="share" onClick={() => handleShareComment(comment)}>
            <IosShareIcon />
          </IconButton>
        </Box>
  
        {/* Reply Input */}
        {showReplyFields[comment._id] && (
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px', gap: '8px' }}>
            <TextField
              placeholder="Write a reply..."
              variant="outlined"
              size="small"
              value={replyInputs[comment._id] || ''}
              onChange={(e) =>
                setReplyInputs((prevState) => ({
                  ...prevState,
                  [comment._id]: e.target.value,
                }))
              }
              sx={{ flexGrow: 1 }}
            />
            <Button variant="contained" color="primary" onClick={() => handleReplySubmit(comment._id)}>
              Reply
            </Button>
          </Box>
        )}
      </Box>
    );
  });
  
  
  return (
    <div>
      {comments.map((comment) => (
        <React.Fragment key={comment._id}>
          {/* Parent Comment */}
          <CommentCard comment={comment} isReply={false} />
  
          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            comment.replies.map((reply) => (
              <CommentCard key={reply._id} comment={reply} isReply={true} />
            ))
          )}
        </React.Fragment>
      ))}
    </div>
  );  
};

export default Comment;
