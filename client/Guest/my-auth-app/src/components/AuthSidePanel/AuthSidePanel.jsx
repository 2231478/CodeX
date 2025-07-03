import React from 'react';
import styles from './AuthSidePanel.module.css';
import mountainLogo from '../../assets/logo.png'; // Path to your logo

function AuthSidePanel({ isLogin, onToggleForm }) {
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
            <button className={styles.toggleButton} onClick={onToggleForm}>Sign up</button>
          </>
        ) : (
          <>
            <h2>Join Us & <br/> Unlock the Best Experience!</h2>
            <p className={styles.promptText}>Already have an Account?</p>
            <button className={styles.toggleButton} onClick={onToggleForm}>Log In</button>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthSidePanel;