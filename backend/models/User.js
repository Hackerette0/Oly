// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, required: true, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
  isAdmin: { type: Boolean, default: false },
  
  skinType: { 
    type: String, 
    enum: ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'],
    default: 'Normal' 
  },
  reputation: { type: Number, default: 0 },
  skinJourney: [{
    date: { type: Date, default: Date.now },
    milestone: String,
    imageUrl: String
  }],

  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }],   // ← ADD COMMA HERE

  skinDiary: [{
    date: { type: Date, default: Date.now },
    photoUrl: { type: String, required: true }, 
    scores: {
      hydration: { type: Number }, 
      acneSeverity: { type: Number }, 
    },
    notes: { type: String } 
  }]
});
// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);