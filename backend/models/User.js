//models User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { 
        type: String, 
        default: 'No phone number provided',
        validate: {
          validator: function(v) {
            return /^[0-9]{10,15}$/.test(v); // ตรวจสอบหมายเลขโทรศัพท์ให้มีตัวเลข 10-15 หลัก
          },
          message: props => `${props.value} is not a valid phone number!`
        }
    },      
    birthday: { type: Date, default: null }, 
    bio: { type: String, default: 'Write something about yourself or your pets' },
    petTypes: { type: [String], enum: ['Cat', 'Dog', 'Bird', 'Fish', 'Rabbit', 'Turtle', 'Other'], default: [] },
    profileImage: { type: String, default: '' },
    showEmail: { type: Boolean, default: false },
});

UserSchema.pre('save', function(next) {
  if (this.phone && /^[0-9]{10,15}$/.test(this.phone)) {
      // จัดรูปแบบหมายเลขโทรศัพท์เป็น xxx-xxx-xxxx ก่อนบันทึก
      this.phone = `${this.phone.slice(0, 3)}-${this.phone.slice(3, 6)}-${this.phone.slice(6, 10)}`;
  }
  next();
});

  
module.exports = mongoose.model('User', UserSchema);