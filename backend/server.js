require('dotenv').config();
const express = require('express');
const fs = require('fs');
const { readdirSync } = fs;
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./config/database');
const userRoutes = require('./routes/user'); // Import userRoutes

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // อนุญาต origin สำหรับ frontend
    credentials: true,
}));
app.use(bodyParser.json({ limit: '10mb' }));

// Connect to database
connectDB();

// ตรวจสอบและสร้างโฟลเดอร์ 'uploads' หากยังไม่มี
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// ตั้งค่า Static Path สำหรับการเข้าถึงไฟล์ในโฟลเดอร์ 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


readdirSync('./routes').map((route) => {
    console.log(`Loading route: ${route}`);
    // เพิ่มการเชื่อมโยงไปยัง routes ที่ต้องการ
    if (route === 'user.js') {
        app.use('/pawpaw_test', userRoutes); // เชื่อมโยง /pawpaw_test กับ user.js
    }
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
