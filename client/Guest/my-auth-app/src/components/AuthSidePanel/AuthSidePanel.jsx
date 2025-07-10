import React from 'react';
import styles from './AuthSidePanel.module.css';
import mountainLogo from '../../assets/logo.png'; // Assuming your logo path

function AuthSidePanel({ isLogin, isForgotPassword, onToggleForm }) { // isForgotPassword is a new prop
  return (
    <div className={styles.sidePanel}>
      <div className={styles.logoContainer}>
        <img src={mountainLogo} alt="Baguio Teachers Camp Logo" className={styles.logo} />
        <p className={styles.logoText}>Baguio Teachers Camp</p>
      </div>
      <div className={styles.textContent}>
        {isLogin ? (
          <>
            <h2>Welcome Back!</h2>
            <p>Your Next Adventure Awaits!</p>
            <p className={styles.promptText}>Don't have an Account?</p>
            {/* When "Sign up" is clicked, set formState to 'signup' */}
            <button className={styles.toggleButton} onClick={() => onToggleForm('signup')}>Sign up</button>
          </>
        ) : isForgotPassword ? ( // Condition for Forgot Password state
          <>
            <h2>Need help with your password?</h2>
            <p>We're here to assist you.</p>
            <p className={styles.promptText}>Remembered your password?</p>
            {/* When "Back to Log In" is clicked, set formState to 'login' */}
            <button className={styles.toggleButton} onClick={() => onToggleForm('login')}>Back to Log In</button>
          </>
        ) : ( // Default case: SignUp state (not login, and not forgot password)
          <>
            <h2>Join Us & <br/> Unlock the Best Experience!</h2>
            <p className={styles.promptText}>Already have an Account?</p>
            {/* When "Log In" is clicked, set formState to 'login' */}
            <button className={styles.toggleButton} onClick={() => onToggleForm('login')}>Log In</button>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthSidePanel;