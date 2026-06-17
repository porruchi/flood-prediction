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
            return /^[0-9]{10,15}$/.test(v);
          },
          message: props => `${props.value} is not a valid phone number!`
        }
    },      
    birthday: { type: Date, default: null }, 
    bio: { type: String, default: 'Write something about yourself or your pets' },
    petTypes: { type: [String], enum: ['Cat', 'Dog', 'Bird', 'Fish', 'Rabbit', 'Turtle', 'Other'], default: [] },
});

UserSchema.pre('save', function(next) {
    if (this.phone && /^[0-9]{10,15}$/.test(this.phone)) {
        this.phone = `${this.phone.slice(0, 3)}-${this.phone.slice(3, 6)}-${this.phone.slice(6)}`;
    }
    next();
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
