import React, { useState } from 'react';
import AuthFormContainer from './components/AuthFormContainer/AuthFormContainer';
import AuthSidePanel from './components/AuthSidePanel/AuthSidePanel';
import LoginForm from './components/LoginForm/LoginForm';
import SignUpForm from './components/SignUpForm/SignUpForm';
import ForgotPasswordForm from './components/ForgotPasswordForm/ForgotPasswordForm'; // Import the new component
import backgroundImage from './assets/background-blur.png';
import styles from './App.module.css';

function App() {
  // Use a more descriptive state to manage which form is active
  // Possible values: 'login', 'signup', 'forgot-password'
  const [formState, setFormState] = useState('login');

  // Function to toggle between different form states
  const toggleForm = (state) => {
    setFormState(state);
  };

  return (
    <div className={styles.authPageWrapper} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className={styles.authContainer}>
        {/* Pass the current formState and the toggle function to AuthSidePanel */}
        <AuthSidePanel
          isLogin={formState === 'login'} // True if formState is 'login'
          isForgotPassword={formState === 'forgot-password'} // True if formState is 'forgot-password'
          onToggleForm={toggleForm} // Pass the new toggle function
        />
        <AuthFormContainer>
          {/* Conditionally render the correct form based on formState */}
          {formState === 'login' && (
            <LoginForm onForgotPassword={() => toggleForm('forgot-password')} />
          )}
          {formState === 'signup' && <SignUpForm />}
          {formState === 'forgot-password' && (
            <ForgotPasswordForm onBackToLogin={() => toggleForm('login')} />
          )}
        </AuthFormContainer>
      </div>
    </div>
  );
}

export default App;