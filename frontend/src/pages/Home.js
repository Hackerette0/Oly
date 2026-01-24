import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import { getProductImageUrl } from '../utils/helpers';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL}/products`;
  console.log('Fetching from URL:', url);

    axios.get(`${process.env.REACT_APP_API_URL}/products`)
  .then((res) => {
    console.log('Products from API:', res.data);
    setProducts(res.data);
    setLoading(false);
  })
    .catch((err) => {
      console.error('Fetch error details:', err.message, err.response?.data);
      setLoading(false);
    });
}, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    fade: true,
  };

  const carouselProducts = products.slice(0, 6);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '140px 20px', color: '#777' }}>
        Loading your beauty favorites... 💄✨
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 20px' }}>
        <h2>No products available yet</h2>
        <p>Check back soon for new arrivals! 🌸</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#FFF5F7', minHeight: '100vh' }}>
      {/* Hero Carousel */}
      <div className="hero-carousel" style={{ marginBottom: '60px' }}>
        <Slider {...settings}>
          {carouselProducts.map((product) => {
            let imageSrc = product.image
  ? `${backendUrl}${product.image}`   // product.image already starts with /
  : 'https://placehold.co/800x500/ff69b4/ffffff/png?text=No+Image';
  console.log(`Using backendUrl: ${backendUrl}`);
            console.log(`Carousel image src for ${product.name}:`, imageSrc);
            console.log('REACT_APP_API_URL value:', process.env.REACT_APP_API_URL);

            return (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={imageSrc}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/800x500/ff69b4/ffffff/png?text=Image+Not+Found';
                      e.currentTarget.onerror = null; // Prevent infinite loop
                    }}
                    style={{
                      width: '100%',
                      height: '500px',
                      objectFit: 'cover',
                      borderRadius: '0 0 24px 24px',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: '0',
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '60px 40px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#F11A00',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        marginBottom: '12px',
                      }}
                    >
                      Featured
                    </span>
                    <h2
                      style={{
                        color: 'white',
                        fontSize: 'clamp(28px, 5vw, 48px)',
                        fontWeight: '700',
                        margin: '0 0 16px',
                        lineHeight: '1.1',
                      }}
                    >
                      {product.name}
                    </h2>
                    <p
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: '600',
                        margin: '0 0 24px',
                      }}
                    >
                      ₹{product.price}
                    </p>
                    <button
                      style={{
                        width: 'fit-content',
                        padding: '14px 36px',
                        background: '#F11A00',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        fontSize: '17px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = '#d10f00')}
                      onMouseOut={(e) => (e.currentTarget.style.background = '#F11A00')}
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </Slider>
      </div>

      {/* Trending Grid */}
      <h2
        style={{
          textAlign: 'center',
          margin: '60px 0 40px',
          color: '#F11A00',
          fontSize: '32px',
          fontWeight: '700',
        }}
      >
        Trending Beauty Picks
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '28px',
          padding: '0 20px 80px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {products.map((product) => {
          let imageSrc = product.image
  ? `${backendUrl}${product.image}`
  : 'https://placehold.co/300x300/ff69b4/ffffff/png?text=No+Image';

  console.log(`Final image src for ${product.name}: ${imageSrc}`);
  
          console.log(`Grid image src for ${product.name}:`, imageSrc);

          return (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                color: 'inherit',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(241,26,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{ position: 'relative', aspectRatio: '1 / 1' }}>
                <img
                  src={imageSrc}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/300x300/ff69b4/ffffff/png?text=No+Image';
                    e.currentTarget.onerror = null; // ← Prevents infinite loop
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease',
                  }}
                />
                <button
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(255,255,255,0.85)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ color: '#F11A00' }}>
                    favorite
                  </span>
                </button>
              </div>
              <div style={{ padding: '16px', textAlign: 'center' }}>
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0 0 8px',
                    minHeight: '48px',
                    lineHeight: '1.4',
                  }}
                >
                  {product.name}
                </h3>
                <p style={{ color: '#F11A00', fontSize: '18px', fontWeight: '700', margin: '8px 0' }}>
                  ₹{product.price}
                </p>
                {product.skinType && (
                  <small style={{ color: '#666', fontSize: '13px' }}>
                    Best for {product.skinType} skin
                  </small>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Home;