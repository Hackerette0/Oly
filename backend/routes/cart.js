const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect } = require('../middleware/auth');

const router = express.Router();

// Add to cart
router.post('/add', protect, async (req, res) => {
  const { productId, quantity } = req.body;
  const user = await User.findById(req.user.id);
  const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);
  if (itemIndex > -1) user.cart[itemIndex].quantity += quantity;
  else user.cart.push({ product: productId, quantity });
  await user.save();
  const populated = await User.findById(req.user.id).populate('cart.product');
  res.json(user.cart);
});

// Get cart
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Checkout
router.post('/checkout', protect, async (req, res) => {
  const user = await User.findById(req.user.id).populate('cart.product');
  const total = user.cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total * 100,
    currency: 'usd',
  });
  const order = new Order({ user: req.user.id, products: user.cart, total });
  await order.save();
  user.cart = [];
  await user.save();
  res.json({ clientSecret: paymentIntent.client_secret });
});

module.exports = router;