import React, { useState } from 'react';
import commonStyles from '../AuthFormContainer/AuthFormContainer.module.css';
import specificStyles from './SignUpForm.module.css'; 
import { FaFacebookF, FaGoogle, FaEye, FaEyeSlash} from 'react-icons/fa';
import Terms from '../Terms/Terms';

function SignUpForm() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);


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
    console.log('Sign Up attempt:', { email, firstName, lastName, password, agreedToTerms });
    // Add actual signup logic 
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
        <button type="submit" className={`${commonStyles.formButton} ${specificStyles.signUpFormButton}`}>Sign Up</button>
      </form>
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