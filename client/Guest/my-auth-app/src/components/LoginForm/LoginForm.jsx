import React, { useState } from 'react';
import styles from '../AuthFormContainer/AuthFormContainer.module.css';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';

function LoginForm({ onForgotPassword }) { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    // Add login logic 
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
            style={{ position: 'absolute', right: '10px', top: '12px', cursor: 'pointer', fontSize: '0.9em', color: '#666' }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'} Password
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            {/* Call onForgotPassword when clicked */}
            <a href="#" onClick={(e) => { e.preventDefault(); onForgotPassword(); }}
               style={{ fontSize: '0.9em', color: '#666', textDecoration: 'none' }}>
                Forgot Password?
            </a>
        </div>
        <button type="submit" className={styles.formButton}>Log In</button>
      </form>
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