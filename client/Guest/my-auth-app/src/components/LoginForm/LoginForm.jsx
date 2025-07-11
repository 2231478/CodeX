import React, { useState } from 'react';
import styles from '../AuthFormContainer/AuthFormContainer.module.css';
import { FaFacebookF, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';

function LoginForm({ onForgotPassword }) { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        // Store accessToken, userId, role (e.g., in localStorage or context)
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userRole', data.role);
        // Redirect or update UI as needed
      } else {
        console.error('Login failed:', data.error);
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Network error or unexpected issue:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formGroup}>
      <h2>Log in</h2>
      <p>Let us explore the possibilities that Teachers Camp have!</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className={styles.formInput}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className={styles.formInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: '0' }}
          />
          <span
            style={{position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#666', fontSize: '1.1em' }}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'} 
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); onForgotPassword(); }}
               style={{ fontSize: '0.9em', color: '#1E3C24', textDecoration: 'none' }}>
                Forgot Password?
            </a>
        </div>
        <button type="submit" className={styles.formButton} disabled={loading}>Log In</button>
      </form>
      {loading && <p>Logging in...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p className={styles.orSeparator}>or</p>
      <div className={styles.socialLogin}>
        <button className={styles.socialButton} aria-label="Login with Facebook">
          <FaFacebookF style={{ color: '#1877F2' }} />
        </button>
        <button className={styles.socialButton} aria-label="Login with Google">
          <FaGoogle style={{ color: '#DB4437' }} />
        </button>
      </div>
    </div>
  );
}

export default LoginForm;