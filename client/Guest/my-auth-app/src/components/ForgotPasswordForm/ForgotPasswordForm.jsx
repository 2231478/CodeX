import React, { useState } from 'react';
import commonStyles from '../AuthFormContainer/AuthFormContainer.module.css';
import styles from './ForgotPasswordForm.module.css'; // For specific styles if any

function ForgotPasswordForm({ onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // To show success/error messages

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    if (!email) {
      setMessage('Please enter your email address.');
      return;
    }

    // Simulate an API call for password reset
    console.log('Forgot password request for:', email);
    setMessage('If an account with that email exists, a password reset link has been sent.');
    // In a real app:
    // try {
    //   const response = await fetch('/api/forgot-password', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email }),
    //   });
    //   const data = await response.json();
    //   if (response.ok) {
    //     setMessage(data.message || 'Password reset email sent successfully!');
    //   } else {
    //     setMessage(data.message || 'Failed to send reset email.');
    //   }
    // } catch (error) {
    //   setMessage('An error occurred. Please try again later.');
    // }
  };

  return (
    <div className={commonStyles.formGroup}> {/* Use common form group styling */}
      <h2>Forgot Password?</h2>
      <p>Enter your email and we'll send you a link to reset your password.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className={commonStyles.formInput} // Use common input styling
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {message && <p className={styles.message}>{message}</p>} {/* Display message */}
        <button type="submit" className={commonStyles.formButton}>
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;