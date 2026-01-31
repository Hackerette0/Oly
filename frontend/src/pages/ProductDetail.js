import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const getGalleryImages = (product) => {
    if (!product?.name) return ['https://placehold.co/1200x800?text=No+Image'];

    const base = `${backendUrl}/uploads/`;

    const imageMap = {
      "Mamaearth Tea Tree Face Wash": [
        `${base}mamaearth-tea-main.jpg`,
        `${base}mamaearth-tea-side.jpg`,
        `${base}mamaearth-tea-closeup.jpg`,
      ],
      "Beauty of Joseon Relief Sun: Rice + Probiotics SPF50+ PA++++": [
        `${base}beauty-main.jpg`,
        `${base}beauty-side.jpg`,
        `${base}beauty-closeup.jpg`,
      ],
      "Dot & Key Barrier Repair Cream":[
        `${base}dot&key-main.jpg`,
        `${base}dot&key-side.jpg`,
        `${base}dot&key-closeup.jpg`,
      ],
      "Mamaearth Ubtan Face Wash":[
        `${base}mamaubtan-main.jpg`,
        `${base}mamaubtan-side.jpg`,
        `${base}mamaubtan-closeup.jpg`,
      ],
      "Pilgrim 3% Redensyl Hair Growth Serum":[
        `${base}pilgrim3-main.jpg`,
        `${base}pilgrim3-side.jpg`,
        `${base}pilgrim3-closeup.jpg`,
      ]
      // Add more products here when you upload images for them
    };

    return imageMap[product.name] || [
      product.image ? `${backendUrl}${product.image}` : 'https://placehold.co/1200x800?text=Product+Image'
    ];
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Product fetch error:', err);
        setLoading(false);
      });
  }, [id]);

  const gallery = getGalleryImages(product);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please login first to add items to cart');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/add`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.success ? 'Added to cart successfully!' : 'Failed to add');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          src={gallery[selectedImage]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black" />
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-5xl md:text-7xl font-semibold mb-4"
          >
            {product.name}
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="text-xl md:text-3xl mb-8"
          >
            ₹{product.price} • {product.skinType ? `Best for ${product.skinType}` : 'Premium Skincare'}
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={loading || product.stock <= 0}
            className="bg-white text-black px-10 py-4 rounded-full text-lg font-medium hover:bg-gray-200 transition"
          >
            {loading ? 'Adding...' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </motion.button>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-6 md:px-20 bg-gray-900">
        <h2 className="text-4xl md:text-5xl font-semibold text-center mb-12">Explore the Finish</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {gallery.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative rounded-2xl overflow-hidden border-4 transition-all ${
                selectedImage === idx ? 'border-white scale-105' : 'border-transparent'
              }`}
            >
              <img src={img} alt={`Variant ${idx}`} className="w-full h-64 object-cover" />
            </button>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto space-y-32">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h3 className="text-4xl font-semibold mb-6">Premium Ingredients</h3>
              <p className="text-xl text-gray-300">
                {product.description || 'Formulated with clinically proven actives for visible results.'}
              </p>
            </div>
            <img
              src={gallery[1] || 'https://placehold.co/600x600?text=Feature+1'}
              alt="Feature"
              className="rounded-3xl shadow-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse"
          >
            <div>
              <h3 className="text-4xl font-semibold mb-6">Tailored for Your Skin</h3>
              <p className="text-xl text-gray-300">
                Best for {product.skinType || 'all types'} – gentle yet effective.
              </p>
            </div>
            <img
              src={gallery[2] || 'https://placehold.co/600x600?text=Feature+2'}
              alt="Feature"
              className="rounded-3xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg py-4 px-6 md:px-20 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-300">₹{product.price}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={loading || product.stock <= 0}
            className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200"
          >
            {loading ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {message && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full z-50">
          {message}
        </div>
      )}
    </div>
  );
}

export default ProductDetails;