import React, { useState, useEffect } from 'react';
import EditProfile from './EditProfile';  // เชื่อมโยงกับ component ที่มีการแก้ไขโปรไฟล์

const App = () => {
  const [userProfile, setUserProfile] = useState(null);

  // ฟังก์ชันที่ใช้รับข้อมูลโปรไฟล์ที่อัปเดตจาก EditProfile
  const handleProfileUpdate = (updatedProfile) => {
    setUserProfile(updatedProfile);  // อัปเดตข้อมูลโปรไฟล์ใน state
  };

  // การจำลองการโหลดข้อมูลโปรไฟล์จาก API หรือ LocalStorage
  useEffect(() => {
    // ตัวอย่างข้อมูลโปรไฟล์
    const token = localStorage.getItem('token');
    if (token) {
      setUserProfile({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        birthday: '1990-01-01',
        bio: 'This is a sample bio.',
        petTypes: ['Dog', 'Cat'],
        profileImage: 'https://via.placeholder.com/150',
        showEmail: true,
      });
    }
  }, []);

  return (
    <div>
      <h1>Welcome to the Profile App</h1>
      
      {/* ส่งข้อมูลโปรไฟล์และฟังก์ชัน onSave ไปยัง EditProfile */}
      <EditProfile user={userProfile} onSave={handleProfileUpdate} />
      
      {userProfile && (
        <div>
          <h3>Profile</h3>
          <p>Name: {userProfile.name}</p>
          <p>Email: {userProfile.email}</p>
          <p>Phone: {userProfile.phone}</p>
          <p>Birthday: {userProfile.birthday}</p>
          <p>Bio: {userProfile.bio}</p>
          <p>Pets: {userProfile.petTypes.join(', ')}</p>
          {userProfile.profileImage && (
            <img src={userProfile.profileImage} alt="Profile" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
