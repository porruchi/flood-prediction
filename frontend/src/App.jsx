import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Forum from './pages/Forum';
import Login from './pages/Login';
import Register from './pages/Register';
import { jwtDecode } from 'jwt-decode';



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ตรวจสอบ token ใน localStorage เมื่อโหลดแอปครั้งแรก
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    // ลบ token ออกจาก localStorage และอัปเดตสถานะการล็อกอิน
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  useEffect(() => {
    // ตรวจสอบ token ใน localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // ตรวจสอบว่า token หมดอายุหรือไม่
        if (decodedToken.exp < currentTime) {
          handleLogout(); // ถ้าหมดอายุให้ logout ออก
          alert('Session expired. You have been logged out.');
        } else {
          setIsLoggedIn(true); // ถ้า token ยังไม่หมดอายุ
        }
      } catch (error) {
        console.error('Invalid token');
        handleLogout();
      }
    }
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main style={{ flexGrow: 1, padding: '24px', marginTop: '60px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
