import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';

const EditProfile = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    phone: '',
    birthday: '',
    bio: '',
    petTypes: [],
    showEmail: false,
  });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        phone: user.phone || '',
        birthday: user.birthday || '',
        bio: user.bio || '',
        petTypes: user.petTypes || [],
        showEmail: user.showEmail || false,
      });
      setProfileImage(user.profileImage || null);  // ตรวจสอบภาพโปรไฟล์ที่มีอยู่
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in first');
        return;
      }

      const data = new FormData();
      data.append('phone', formData.phone);
      data.append('bio', formData.bio);
      data.append('petTypes', formData.petTypes);
      data.append('birthday', formData.birthday);
      data.append('showEmail', formData.showEmail);

      if (profileImage) {
        data.append('profileImage', profileImage); // ส่งไฟล์ภาพ
      }

      const response = await axios.post('http://localhost:5000/pawpaw_test/user/profile', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Profile updated successfully');
      window.location.reload();  // รีเฟรชหน้า

      // ส่งข้อมูลที่อัปเดตไปยัง parent component
      if (onSave) {
        onSave(response.data.data);  // ตรวจสอบให้ดีว่า response เป็นแบบไหน
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <Box>
      <h2>Edit Profile</h2>
      <form>
        {profileImage && (
          <img src={`http://localhost:5000${profileImage}`} alt="Profile" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
        )}
        <TextField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Birthday"
          name="birthday"
          type="date"
          value={formData.birthday}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Select
          multiple
          value={formData.petTypes}
          onChange={(e) => setFormData({ ...formData, petTypes: e.target.value })}
          fullWidth
          margin="normal"
        >
          {['Cat', 'Dog', 'Bird', 'Fish', 'Rabbit', 'Turtle', 'Other'].map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.showEmail}
              onChange={(e) => setFormData({ ...formData, showEmail: e.target.checked })}
            />
          }
          label="Show Email on Profile"
        />
        <input
          type="file"
          onChange={(e) => setProfileImage(e.target.files[0])}
          accept="image/*"
        />
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </form>
    </Box>
  );
};

export default EditProfile;
