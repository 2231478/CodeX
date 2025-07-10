import React, { useState } from 'react';
import styles from '../AuthFormContainer/AuthFormContainer.module.css';
import { FaFacebookF, FaGoogle } from 'react-icons/fa'; 

function SignUpForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (!agreedToTerms) {
        alert("You must agree to the Terms and Privacy Policy.");
        return;
    }
    console.log('Sign Up attempt:', { email, username, password, agreedToTerms });
    // Add signup logic
  };

  return (
    <div className={styles.formGroup}>
      <h2>Create an Account</h2>
      <p>Join and Explore the possibilities that Teachers Camp have!</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className={styles.formInput}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          className={styles.formInput}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.formInput}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className={styles.formInput}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            style={{ marginRight: '10px' }}
          />
          <label htmlFor="terms" style={{ fontSize: '0.9em', color: '#666' }}>
            I agree to the Terms and Privacy Policy
          </label>
        </div>
        <button type="submit" className={styles.formButton}>Sign Up</button>
      </form>
      <p className={styles.orSeparator}>or</p>
      <div className={styles.socialLogin}>
        <button className={styles.socialButton} aria-label="Sign up with Facebook">
          <FaFacebookF style={{ color: '#1877F2' }} />
        </button>
        <button className={styles.socialButton} aria-label="Sign up with Google">
          <FaGoogle style={{ color: '#DB4437' }} />
        </button>
      </div>
    </div>
  );
}

export default SignUpForm;