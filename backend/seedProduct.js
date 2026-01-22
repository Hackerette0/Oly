const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Product.deleteMany({}); // clear existing (careful!)

    await Product.insertMany([
      {
        name: "CeraVe Hydrating Cleanser",
        price: 1050,
        category: "skincare",
        skinType: "dry",
        image: "/uploads/cerave-cleanser.jpg",
        description: "Gentle non-foaming cleanser",
        stock: 85
      },
      {
        name: "Minimalist SPF 50 PA++++",
        price: 399,
        category: "skincare",
        skinType: "all",
        image: "/uploads/minimalist-spf50.jpg",
        description: "Lightweight, no white cast",
        stock: 200
      },
      {
        name: "The Ordinary Niacinamide 10% + Zinc",
        price: 650,
        category: "skincare",
        skinType: "oily",
        image: "/uploads/ordinary-niacinamide.jpg",
        description: "Reduces pores & oil",
        stock: 45
      },
      {
        name: "Pilgrim Red Beet Lip Balm",
        price: 299,
        category: "makeup",
        skinType: "all",
        image: "/uploads/pilgrim-lipbalm.jpg",
        description: "Tinted & hydrating",
        stock: 120
      },
      {
        name: "Mamaearth Onion Hair Oil",
        price: 399,
        category: "haircare",
        skinType: "all",
        image: "/uploads/mamaearth-onion-oil.jpg",
        description: "Reduces hair fall",
        stock: 60
      }
      // Add more...
    ]);

    console.log('Products seeded!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });