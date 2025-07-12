import React, { useState } from 'react';
import AuthFormContainer from './components/AuthFormContainer/AuthFormContainer';
import AuthSidePanel from './components/AuthSidePanel/AuthSidePanel';
import LoginForm from './components/LoginForm/LoginForm';
import SignUpForm from './components/SignUpForm/SignUpForm';
import ForgotPasswordForm from './components/ForgotPasswordForm/ForgotPasswordForm';
import Terms from './components/Terms/Terms';
import LandingPage from './components/LandingPage/LandingPage';

import backgroundImage from './assets/background-blur.png';
import styles from './App.module.css';

function App() {
  const [pageState, setPageState] = useState('landing');
  const [authFormState, setAuthFormState] = useState('login'); 

  const handleReserveNow = () => {
    setPageState('auth');
    setAuthFormState('login');
  };

  const toggleAuthForm = (state) => {
    setAuthFormState(state);
  };

  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleLoginSuccess = () => {
    console.log("Login successful! Redirecting to logged-in experience.");
    alert("Login Successful! (You would go to a dashboard now)");
  };

  return (
    <>
      {pageState === 'landing' ? (
        <LandingPage onReserveNow={handleReserveNow} />
      ) : (
        <div className={styles.authPageWrapper} style={{ backgroundImage: `url(${backgroundImage})` }}>
          <div className={styles.authContainer}>
            <AuthSidePanel
              isLogin={authFormState === 'login'}
              isForgotPassword={authFormState === 'forgot-password'}
              onToggleForm={toggleAuthForm}
            />
            <AuthFormContainer>
              {authFormState === 'login' && (
                <LoginForm
                  onForgotPassword={() => toggleAuthForm('forgot-password')}
                  onLoginSuccess={handleLoginSuccess}
                />
              )}
              {authFormState === 'signup' && (
                <SignUpForm onShowTerms={() => setShowTermsModal(true)} />
              )}
              {authFormState === 'forgot-password' && (
                <ForgotPasswordForm onBackToLogin={() => toggleForm('login')} />
              )}
            </AuthFormContainer>
          </div>
          {showTermsModal && <Terms onClose={() => setShowTermsModal(false)} />}
        </div>
      )}
    </>
  );
}

export default App;