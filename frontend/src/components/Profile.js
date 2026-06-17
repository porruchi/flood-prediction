import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]); // เพิ่ม state สำหรับโพสต์
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ฟังก์ชันสำหรับดึงข้อมูลโปรไฟล์
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pawpaw_test/user/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProfileData(response.data.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    // ฟังก์ชันสำหรับดึงโพสต์ของผู้ใช้
    const fetchUserPosts = async () => {
        try {
          const userId = localStorage.getItem('userId');
          const response = await axios.get(`http://localhost:5000/pawpaw_test/posts/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setPosts(response.data.posts); // บันทึกโพสต์ใน state
        } catch (error) {
          console.error('Error fetching user posts:', error);
        }
      };
      
    fetchProfileData();
    fetchUserPosts();
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      {profileData && (
        <div>
          <p><strong>Phone:</strong> {profileData.phone || 'No phone number provided'}</p>
          <p><strong>Birthday:</strong> {profileData.birthday || 'Not provided'}</p>
          <p><strong>Bio:</strong> {profileData.bio || 'Not provided'}</p>
          <p><strong>Pets:</strong> {profileData.petTypes?.join(', ') || 'No pets added'}</p>
          <p><strong>Show Email:</strong> {profileData.showEmail ? 'Yes' : 'No'}</p>
          {profileData.profileImage && (
            <img src={`http://localhost:5000${profileData.profileImage}`} alt="Profile" />
          )}
        </div>
      )}

      <h3>Posts</h3>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id}>
            <p>{post.content}</p>
            {post.images?.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:5000${img.url}`}
                alt={`Post ${index + 1}`}
                style={{ width: '100px', height: '100px' }}
              />
            ))}
          </div>
        ))
      ) : (
        <p>No posts available. Try posting something about your pet!</p>
      )}
    </div>
  );
};

export default Profile;
