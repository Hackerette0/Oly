const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['skincare', 'makeup', 'haircare', 'fragrance', 'bodycare', 'tools', 'other'],
    trim: true
  },
  skinType: {
    type: String,
    enum: ['dry', 'oily', 'combination', 'sensitive', 'normal', 'acne-prone', 'mature', 'all'],
    default: 'all'
  },
  //image: {
    //type: String,
    //required: true   // e.g. "/uploads/filename.jpg"
  //},
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  gallery: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);