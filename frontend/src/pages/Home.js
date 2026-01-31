import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import axios from 'axios';
import { Heart, CheckCircle } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion } from 'framer-motion';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function Home() {
  const { categoryName } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/products`)
      .then((res) => {
        setAllProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setLoading(false);
      });

    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(savedWishlist);
  }, []);

  useEffect(() => {
    if (categoryName) {
      const filtered = allProducts.filter(p => 
        p.category?.toLowerCase().replace(/ /g, '-') === categoryName
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts);
    }
  }, [categoryName, allProducts]);

  const triggerToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const toggleWishlist = (e, product) => {
    e.preventDefault();
    let updatedWishlist = [...wishlist];
    const isPresent = wishlist.find(item => item._id === product._id);

    if (isPresent) {
      updatedWishlist = wishlist.filter(item => item._id !== product._id);
      triggerToast("Removed from wishlist");
    } else {
      updatedWishlist.push(product);
      triggerToast("Added to wishlist ✨");
    }

    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event('storage'));
  };

  // NEW: Function to get main image (first from uploads or fallback)
  const getMainImage = (product) => {
    if (!product?.name) return 'https://placehold.co/1600x900?text=No+Image';

    const base = `${backendUrl}/uploads/`;

    const imageMap = {
      "Mamaearth Tea Tree Face Wash": `${base}mamaearth-tea-main.jpg`,
      "Beauty of Joseon Relief Sun: Rice + Probiotics SPF50+ PA++++": `${base}beauty-main.jpg`,
      "Dot & Key Barrier Repair Cream":`${base}dot&key-main.jpg`,

    };

    return imageMap[product.name] || 
           (product.image ? `${backendUrl}${product.image}` : 'https://placehold.co/1600x900?text=ōly');
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 1200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: false,
  };

  if (loading) return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <motion.div 
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-2xl text-dark-muted font-serif-aesthetic"
      >
        Curating your beauty ritual...
      </motion.div>
    </div>
  );

  return (
    <div className="bg-dark-bg text-dark-text min-h-screen">
      {/* Toast */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: toast.show ? 0 : 100, opacity: toast.show ? 1 : 0 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="bg-dark-card/90 backdrop-blur-lg text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10">
          <CheckCircle size={16} className="text-emerald-400" />
          <span className="font-sans-aesthetic text-sm font-medium">{toast.message}</span>
        </div>
      </motion.div>

      {/* Hero Carousel */}
      {!categoryName && (
        <div className="relative">
          <Slider {...settings}>
            {allProducts.slice(0, 5).map((product) => (
              <Link key={product._id} to={`/product/${product._id}`}>
                <div className="relative h-[80vh] md:h-screen overflow-hidden">
                  <motion.img
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 12, ease: "easeOut" }}
                    src={getMainImage(product)}  // ← NOW uses your uploaded image
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
                    <motion.span 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-xs md:text-sm uppercase tracking-[0.4em] text-dark-muted mb-4"
                    >
                      Signature Collection
                    </motion.span>
                    <motion.h2
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-4xl md:text-7xl font-serif-aesthetic font-light leading-tight text-white"
                    >
                      {product.name}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      className="text-lg md:text-2xl mt-4 text-dark-muted"
                    >
                      ₹{product.price}
                    </motion.p>
                  </div>
                </div>
              </Link>
            ))}
          </Slider>
        </div>
      )}

      {/* Title */}
      <h2 className="text-center mt-16 md:mt-24 mb-12 text-4xl md:text-5xl font-serif-aesthetic font-light text-white tracking-tight">
        {categoryName ? categoryName.replace(/-/g, ' ') : 'Curated for You'}
      </h2>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10 px-6 md:px-12 max-w-7xl mx-auto pb-32">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const isWished = wishlist.some(item => item._id === product._id);
            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="group relative"
              >
                <button
                  onClick={(e) => toggleWishlist(e, product)}
                  className="absolute top-4 right-4 z-20 p-3 bg-dark-card/60 backdrop-blur-md rounded-full hover:bg-dark-card/90 transition-all"
                >
                  <Heart
                    size={20}
                    className={isWished ? "fill-primary text-primary" : "text-dark-muted hover:text-white"}
                  />
                </button>

                <Link to={`/product/${product._id}`} className="block">
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-dark-card mb-5 shadow-xl group-hover:shadow-2xl transition-all duration-700">
                    <img
                      src={getMainImage(product)}  // ← NOW uses your uploaded image
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                      alt={product.name}
                    />
                  </div>
                  <div className="px-2">
                    <p className="text-xs uppercase tracking-wider text-primary font-medium mb-1">
                      {product.brand || "ōly"}
                    </p>
                    <h3 className="font-sans-aesthetic text-base md:text-lg font-medium text-white mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-dark-muted text-sm md:text-base">₹{product.price}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-32">
            <p className="text-dark-muted text-2xl font-serif-aesthetic italic">
              Curating something beautiful for you...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;