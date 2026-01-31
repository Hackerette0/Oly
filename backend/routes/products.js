//backend/routes/productRoutes.js
const express = require('express');
const path = require('path');
const Product = require('../models/Product');
const { protect, isSeller } = require('../middleware/auth');
const multer = require('multer');

const uploadDir = path.join(__dirname, '..', 'uploads');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

//PUBLIC
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
    .select('name price category skinType image description stock') 
    .sort({ createdAt: -1 });
    console.log('Backend found products:', products.length);
    console.log('Products fetched:', products.length);
    console.log('First product sample:', products[0] ? products[0].name : 'None');
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

//PUBLIC
router.get('/:id', async (req, res) => { const product = await Product.findById(req.params.id); res.json(product); });

//PROTECTED
router.post('/', protect, isSeller, async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const productsData = req.body.map(item => ({
        name: item.name?.trim(),
        description: item.description?.trim() || '',
        price: Number(item.price),
        category: item.category?.toLowerCase(),
        skinType: item.skinType?.toLowerCase() || 'all',
        stock: Number(item.stock) || 0,
        image: item.image || '', 
      }));

      const validProducts = productsData.filter(p => p.name && !isNaN(p.price) && p.category);

      if (validProducts.length === 0) {
        return res.status(400).json({ msg: 'No valid products in the array' });
      }

      const inserted = await Product.insertMany(validProducts);
      return res.status(201).json({
        msg: `Added ${inserted.length} products successfully`,
        count: inserted.length
      });
    }

    // Original single product logic (without multer for now)
    const { name, description, price, category, skinType = 'all', stock = 0, image = '' } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ msg: 'Name, price, and category are required' });
    }

    const product = new Product({
      name: name.trim(),
      description: description?.trim() || '',
      price: Number(price),
      category: category.toLowerCase(),
      skinType,
      stock: Number(stock),
      image,
    });

    await product.save();
    res.status(201).json(product);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const featured = await Product.findOne({ isFeatured: true }); // Assume your model has this field
    res.json(featured);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;