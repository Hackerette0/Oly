// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, required: true, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
  isAdmin: { type: Boolean, default: false },
  
  // --- NEW COMMUNITY FIELDS ---
  skinType: { 
    type: String, 
    enum: ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'],
    default: 'Normal' 
  },
  reputation: { type: Number, default: 0 }, // Reward helpful contributors
  skinJourney: [{
    date: { type: Date, default: Date.now },
    milestone: String,
    imageUrl: String
  }],
  // ----------------------------

  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }]
});

// Hash password before save
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);