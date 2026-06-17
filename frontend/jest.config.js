module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // ใช้ identity-obj-proxy เพื่อจัดการไฟล์ CSS
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-slick)/)', // ข้ามการ ignore การแปลงโค้ดของ react-slick
  ],
};
