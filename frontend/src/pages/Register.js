// src/pages/Register.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        username,
        password,
      });

      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.msg || 'Registration failed. Please try again.';
      setError(msg);
      console.error('Register error:', err.response?.data);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FFF5F7',
      padding: '20px',
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 8px 25px rgba(241,26,0,0.1)',
        maxWidth: '400px',
        width: '100%',
      }}>
        <h2 style={{ color: '#F11A00', textAlign: 'center', marginBottom: '30px' }}>
          Register to ōly
        </h2>

        {error && (
          <p style={{
            color: '#F11A00',
            background: '#FFECEC',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value.trim())}
              required
              minLength={3}
              style={{
                width: '100%',
                padding: '14px',
                border: '1px solid #ddd',
                borderRadius: '10px',
                fontSize: '16px',
              }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '14px',
                border: '1px solid #ddd',
                borderRadius: '10px',
                fontSize: '16px',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: '#F11A00',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '17px',
              cursor: 'pointer',
            }}
          >
            Register
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#555' }}>
          Already have an account? <a href="/login" style={{ color: '#F11A00' }}>Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;