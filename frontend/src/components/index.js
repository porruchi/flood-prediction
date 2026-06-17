import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // ใช้ไฟล์ CSS สำหรับการตกแต่ง (หากมี)
import App from './App';  // import App.js
import reportWebVitals from './reportWebVitals';  // หากใช้ฟังก์ชันเพื่อการวัดประสิทธิภาพ (ไม่จำเป็นต้องใช้)

ReactDOM.render(
  <React.StrictMode>
    <App />  {/* เรากำลัง render component App */}
  </React.StrictMode>,
  document.getElementById('root')  // จุดที่จะ render component (ปกติจะอยู่ใน index.html)
);

// Optional: ฟังก์ชัน reportWebVitals สามารถใช้สำหรับการวัดประสิทธิภาพของแอป
reportWebVitals();
