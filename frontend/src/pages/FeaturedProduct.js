// frontend/src/pages/FeaturedProduct.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FeaturedProduct = () => {
  const [product, setProduct ] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured product from backend
    axios.get('/api/products/featured') // Assume backend endpoint
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="min-h-screen   text-black">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${product.heroImage})` }} // Use product image from backend
      >
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl mb-8">{product.tagline}</p>
          <button className="px-8 py-4 bg-black text-white rounded-full">Buy Now</button>
        </div>
      </motion.section>

      {/* Feature Sections – with scroll animations */}
      <Section title="Innovative Formula" description={product.features[0]} image={product.images[0]} />
      <Section title="Proven Results" description={product.features[1]} image={product.images[1]} reverse />
      <Section title="Sustainable Packaging" description={product.features[2]} image={product.images[2]} />

      {/* Specs Section */}
      <section className="p-10 bg-gray-100">
        <h2 className="text-4xl font-bold mb-8 text-center">Tech Specs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {product.specs.map((spec, i) => (
            <div key={i} className="p-6   rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">{spec.title}</h3>
              <p>{spec.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="p-10 text-center">
        <h2 className="text-4xl font-bold mb-8">Ready for Your Skin Journey?</h2>
      </section>

      {/* CTA Footer */}
      <section className="p-10 bg-black text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Pre-Order Now</h2>
        <button className="px-8 py-4   text-black rounded-full">Secure Your Spot</button>
      </section>
    </div>
  );
};

// Reusable Section Component with Animation
const Section = ({ title, description, image, reverse }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) controls.start({ opacity: 1, y: 0 });
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.8 }}
      className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center p-10`}
    >
      <div className="md:w-1/2 p-6">
        <h2 className="text-4xl font-bold mb-4">{title}</h2>
        <p className="text-lg">{description}</p>
      </div>
      <img src={image} alt={title} className="md:w-1/2 rounded-lg shadow-lg" />
    </motion.section>
  );
};

export default FeaturedProduct;