import React, { useState } from 'react';
import AuthFormContainer from './components/AuthFormContainer/AuthFormContainer';
import AuthSidePanel from './components/AuthSidePanel/AuthSidePanel';
import LoginForm from './components/LoginForm/LoginForm';
import SignUpForm from './components/SignUpForm/SignUpForm';
import ForgotPasswordForm from './components/ForgotPasswordForm/ForgotPasswordForm'; 
import backgroundImage from './assets/background-blur.png';
import styles from './App.module.css';

function App() {
  const [formState, setFormState] = useState('login');

  const toggleForm = (state) => {
    setFormState(state);
  };

  return (
    <div className={styles.authPageWrapper} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className={styles.authContainer}>
        <AuthSidePanel
          isLogin={formState === 'login'} 
          isForgotPassword={formState === 'forgot-password'} 
          onToggleForm={toggleForm}
        />
        <AuthFormContainer>
          {formState === 'login' && (
            <LoginForm onForgotPassword={() => toggleForm('forgot-password')} />
          )}
          {formState === 'signup' && <SignUpForm onRegistrationSuccess={() => toggleForm('login')} />}
          {formState === 'forgot-password' && (
            <ForgotPasswordForm onBackToLogin={() => toggleForm('login')} />
          )}
        </AuthFormContainer>
      </div>
    </div>
  );
}

export default App;