import React, { useState } from 'react';
import commonStyles from '../AuthFormContainer/AuthFormContainer.module.css';
import specificStyles from './SignUpForm.module.css'; 
import { FaFacebookF, FaGoogle, FaEye, FaEyeSlash} from 'react-icons/fa';
import Terms from '../Terms/Terms';

function SignUpForm({ onRegistrationSuccess }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      setLoading(false);
      return;
    }
    if (!agreedToTerms) {
      setError("You must agree to the Terms and Privacy Policy.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, firstName, lastName, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data);
        if (onRegistrationSuccess) {
          onRegistrationSuccess();
        }
      } else {
        console.error('Registration failed:', data.error);
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Network error or unexpected issue:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${commonStyles.formGroup} ${specificStyles.signUpFormGroup}`}>
      <h2 className={specificStyles.signUpFormGroup}>Create an Account</h2>
      <p style={{ fontSize: '0.8em', marginBottom: '25px', textAlign: 'left' }}>
        Join and Explore the possibilities that Teachers Camp have!
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className={`${commonStyles.formInput} ${specificStyles.signUpFormInput}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div style={{ display: 'flex', gap: '10px', width: '100%', marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="First Name"
            className={`${commonStyles.formInput} ${specificStyles.signUpFormInput}`}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            style={{ marginBottom: '0', flex: 1 }}
          />
          <input
            type="text"
            placeholder="Last Name"
            className={`${commonStyles.formInput} ${specificStyles.signUpFormInput}`}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            style={{ marginBottom: '0', flex: 1 }}
          />
        </div>
        <div style={{ position: 'relative', marginBottom: '15px', width: '100%' }}> 
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className={`${commonStyles.formInput} ${specificStyles.signUpFormInput}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: '0' }}
          />
          <span
            style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#666',
              fontSize: '1.1em'
            }}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div style={{ position: 'relative', marginBottom: '20px', width: '100%' }}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            className={`${commonStyles.formInput} ${specificStyles.signUpFormInput}`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ marginBottom: '0' }}
          />
          <span
            style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#666',
              fontSize: '1.1em'
            }}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', width: '100%' }}>
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          <label htmlFor="terms" className={commonStyles.formGroup} style={{ fontSize: '0.9em', color: '#666' }}>
            I agree to the{' '}
            <span
              onClick={() => setShowTermsModal(true)}
              style={{ cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline', color: '#4CAF50' }}
            >
              Terms and Privacy Policy
            </span>
          </label>
        </div>
        <button type="submit" className={`${commonStyles.formButton} ${specificStyles.signUpFormButton}`} disabled={loading}>Sign Up</button>
      </form>
      {loading && <p>Signing up...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p className={`${commonStyles.orSeparator} ${specificStyles.signUpOrSeparator}`}>or</p> 
      <div className={commonStyles.socialLogin}>
        <button className={commonStyles.socialButton} aria-label="Sign up with Facebook">
          <FaFacebookF style={{ color: '#1877F2' }} />
        </button>
        <button className={commonStyles.socialButton} aria-label="Sign up with Google">
          <FaGoogle style={{ color: '#DB4437' }} />
        </button>
      </div>
      {showTermsModal && <Terms onClose={() => setShowTermsModal(false)} />}
    </div>
  );
}

export default SignUpForm;