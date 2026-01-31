const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const colorAnalysisRoutes = require('./routes/colorAnalysis');
const chatRoutes = require('./routes/chat');
const orderRoutes = require('./routes/orders');
const userRouter = require('./routes/user');

console.log('About to mount user routes...');
console.log('Imported userRouter:', typeof userRouter);  
console.log('userRouter type:', userRouter);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes); 
app.use('/api/color-analysis', colorAnalysisRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRouter);

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR HANDLER:");
  console.error(err.stack || err);
  console.error("Request path:", req.originalUrl);
  console.error("Method:", req.method);
  console.error("Headers:", req.headers.authorization ? "Has token" : "No token");

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Multer error: ${err.message}` });
  }
  if (err.message?.includes("Only .jpg")) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: "Server error – check backend logs" });
});

// 404 handler should come AFTER this
app.use((req, res) => {
  console.log(`404 - ${req.method} ${req.originalUrl} not found`);
  res.status(404).json({ error: "Route not found" });
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));