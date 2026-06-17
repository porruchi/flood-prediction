const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    content: { type: String, required: true },
    images: [{ url: String }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }] // อ้างอิงผู้ใช้ที่กดไลค์
});

module.exports = mongoose.model('Post', PostSchema);
