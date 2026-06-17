import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/pawpaw_test/login', formData);
      console.log(response.data); // ตรวจสอบข้อมูลที่ได้รับจาก server
  
      if (response.data.success) {
        alert('Login successful!');
  
        // รับ token และ userId จากเซิร์ฟเวอร์
        const { token, userId } = response.data;
  
        // เก็บ token และ userId ใน Local Storage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId); // เพิ่มการเก็บ userId
  
        console.log('JWT Token:', token);
        console.log('User ID:', userId);
        console.log('User ID set in localStorage:', localStorage.getItem('userId'));
  
        onLogin(); // อัปเดตสถานะล็อกอิน
        navigate('/'); // นำไปหน้า home หลังล็อกอินสำเร็จ
      } else {
        alert(response.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Login failed. Please check your username/email and password.');
    }
  };
  
  

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
      }}
    >
      <Grid container sx={{ maxWidth: '900px', height: '500px', boxShadow: 3, borderRadius: '12px', overflow: 'hidden' }}>
        {/* Left Side - Login Form */}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            backgroundColor: '#fff',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: '1rem' }}>
            Sign In
          </Typography>

          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSubmit}>
            <TextField
              label="Email or Username"
              variant="outlined"
              fullWidth
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              autoComplete="username"
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password" // เพิ่ม autocomplete attribute
            />

            <Button variant="contained" color="primary" type="submit" sx={{ marginTop: '1rem' }}>
              Login
            </Button>
          </Box>
        </Grid>

        {/* Right Side - Create Account Option */}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            backgroundColor: '#26a69a',
            color: '#fff',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Hello, Friend!
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '2rem', textAlign: 'center' }}>
            Don't have an account yet? Click below to sign up.
          </Typography>
          <Link to="/register">
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#fff',
                color: '#26a69a',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
              }}
            >
              Sign Up
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
