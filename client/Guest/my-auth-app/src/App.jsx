import React, { useState } from 'react';
import AuthFormContainer from './components/AuthFormContainer/AuthFormContainer';
import AuthSidePanel from './components/AuthSidePanel/AuthSidePanel';
import LoginForm from './components/LoginForm/LoginForm';
import SignUpForm from './components/SignUpForm/SignUpForm';
import ForgotPasswordForm from './components/ForgotPasswordForm/ForgotPasswordForm';
import Terms from './components/Terms/Terms';
import LandingPage from './components/LandingPage/LandingPage';
import MainServices from './components/MainServices/MainServices';
import Homepage from './components/Homepage/Homepage';
import HistoryPage from './components/History/History'; 
import ServicesPage from './components/MServices/Services';
import FAQsPage from './components/FAQs/FAQs';
import ContactsPage from './components/Contacts/Contacts';

import backgroundImage from './assets/background-blur.png';
import styles from './App.module.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function AuthLayout() {
  const [authFormState, setAuthFormState] = useState('login');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const navigate = useNavigate();

  const toggleAuthForm = (state) => {
    setAuthFormState(state);
    navigate(`/auth/${state}`);
  };

  const handleLoginSuccess = () => {
    console.log("Login successful! Redirecting to logged-in experience.");
    alert("Login Successful! (You would go to a dashboard now)");
  };

  return (
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
            <ForgotPasswordForm onBackToLogin={() => toggleAuthForm('login')} />
          )}
        </AuthFormContainer>
      </div>
      {showTermsModal && <Terms onClose={() => setShowTermsModal(false)} />}
    </div>
  );
}

function App() {
  const navigate = useNavigate();

  const handleReserveNow = () => {
    navigate('/auth/login');
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onReserveNow={handleReserveNow} />} />
      <Route path="/auth/*" element={<AuthLayout />} />
      <Route path="/services/*" element={<MainServices />} />
      <Route path="/homepage/*" element={<Homepage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/faqs" element={<FAQsPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
    </Routes>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;