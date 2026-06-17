import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Post from '../components/Post'; // นำ component Post มาใช้เพื่อแสดงโพสต์ในหน้าโปรไฟล์
import EditProfile from '../components/EditProfile'; // นำ EditProfile มาใช้เพื่อแก้ไขข้อมูลโปรไฟล์

const Profile = () => {
  const [user, setUser] = useState({
    _id: localStorage.getItem('userId'),
    username: localStorage.getItem('username'),
  });
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); // สถานะเพื่อบอกว่าอยู่ในโหมดแก้ไขหรือไม่

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      alert('You are not logged in. Please log in first.');
      navigate('/login');
      return;
    }

    // ดึงข้อมูลโปรไฟล์ผู้ใช้
    axios
      .get('http://localhost:5000/pawpaw_test/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setUser(response.data); // กำหนดข้อมูลที่ได้รับจาก API มาให้กับ state user
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        alert('Failed to load user profile. Please try again.');
        navigate('/login');
      });

    // ดึงโพสต์ของผู้ใช้
    axios
      .get(`http://localhost:5000/pawpaw_test/posts/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPosts(response.data.posts); // ดึง posts จาก response.data.posts
      })
      .catch((error) => {
        console.error('Error fetching user posts:', error);
      });
  }, [navigate]);

  // ฟังก์ชันสำหรับเปิด/ปิดโหมดแก้ไข
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // ฟังก์ชันสำหรับบันทึกการแก้ไขโปรไฟล์
  const handleSave = (updatedUser) => {
    setUser(updatedUser);
    setIsEditing(false);
  };

  // ตรวจสอบข้อมูลผู้ใช้และโพสต์
  if (!user) {
    return null; // ไม่แสดงอะไรถ้ายังไม่มีข้อมูลผู้ใช้หรือยังไม่ได้ล็อกอิน
  }

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        {!isEditing ? (
          <>
            <div style={styles.profileHeader}>
              <img
                src={user.profileImage || '/default-profile.png'}
                alt="Profile"
                style={styles.profileImage}
              />
              <h2>{user.username}</h2>
            </div>
            <div style={styles.aboutSection}>
              <h3>About</h3>
              {user.showEmail && <p><strong>Email:</strong> {user.email}</p>}
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Bio:</strong> {user.bio}</p>
              <p><strong>Birthday:</strong> {user.birthday ? new Date(user.birthday).toLocaleDateString() : 'Not provided'}</p>
              <p><strong>Pet Types:</strong> {user.petTypes ? user.petTypes.join(', ') : 'No pets added'}</p>
            </div>
            <button style={styles.editButton} onClick={toggleEditMode}>
              Edit Profile
            </button>
          </>
        ) : (
          // ถ้าอยู่ในโหมดแก้ไข ให้แสดง EditProfile component
          <EditProfile user={user} onSave={handleSave} onCancel={toggleEditMode} />
        )}
      </div>

      <div style={styles.posts}>
        <h3>Posts</h3>
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post._id} post={post} /> // ใช้ Component Post ในการแสดงโพสต์
          ))
        ) : (
          <p>No posts available. Try posting something about your pet!</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
  },
  sidebar: {
    width: '30%',
    backgroundColor: '#f4f4f4',
    padding: '20px',
    borderRadius: '8px',
  },
  profileHeader: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  profileImage: {
    borderRadius: '50%',
    width: '120px',
    height: '120px',
    objectFit: 'cover',
  },
  aboutSection: {
    marginTop: '20px',
  },
  posts: {
    width: '65%',
    paddingLeft: '20px',
  },
};

export default Profile;
