import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ProductDetails() {
  const { id } = useParams();

  const styles = {
    productDetails: {
      display: 'flex',
      flexDirection: 'row',
      gap: '40px',
      padding: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    imageContainer: {
      flex: '1',
    },
    detailsContent: {
      flex: '1',
      paddingTop: '20px',
    },
  };

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error('Product fetch error:', err));
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Please login first to add items to cart');
      return;
    }

    if (!product?._id) {
      setMessage('Product information is missing');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/add`,
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setMessage('Added to cart successfully!');
      }
    } catch (err) {
      console.error('Add to cart error:', err);

      if (err.response?.status === 401) {
        setMessage('Session expired. Please login again.');
        // Optional: localStorage.removeItem('token');
      } else {
        setMessage(
          err.response?.data?.msg || 'Failed to add to cart. Try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="product-details" style={{ padding: '20px' }}>
      <div style={styles.productDetails}>
        <div style={styles.imageContainer}>
          <img
            src={
              product.image
                ? `${process.env.REACT_APP_API_URL}${
                    product.image.startsWith('/') ? '' : '/'
                  }${product.image}`
                : 'https://placehold.co/500x600/ff69b4/ffffff/png?text=Product'
            }
            alt={product.name || 'Product image'}
            style={{
              width: '100%',
              borderRadius: '16px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            }}
            onError={(e) =>
              (e.target.src =
                'https://placehold.co/500x500?text=Image+Not+Found')
            }
          />
        </div>

        <div style={styles.detailsContent}>
          <h1>{product.name}</h1>

          <div
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#e91e63',
              margin: '16px 0',
            }}
          >
            ₹{product.price}
          </div>

          <p>{product.description || 'Premium beauty product with long-lasting formula...'}</p>

          {product.category && (
            <p>
              <strong>Category:</strong> {product.category}
            </p>
          )}

          {product.skinType && (
            <p>
              <strong>Best for:</strong> {product.skinType} skin
            </p>
          )}

          {product.stock > 0 ? (
            <p style={{ color: 'green' }}>In Stock ({product.stock} left)</p>
          ) : (
            <p style={{ color: 'red' }}>Out of Stock</p>
          )}

          {message && (
            <p
              style={{
                margin: '16px 0',
                padding: '12px',
                borderRadius: '8px',
                background: message.includes('success') ? '#e8f5e9' : '#ffebee',
                color: message.includes('success') ? '#2e7d32' : '#c62828',
              }}
            >
              {message}
            </p>
          )}

          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={loading || product.stock <= 0}
            style={{
              padding: '14px 32px',
              fontSize: '16px',
              background: loading ? '#ccc' : '#e91e63',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: loading || product.stock <= 0 ? 'not-allowed' : 'pointer',
              marginTop: '20px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;