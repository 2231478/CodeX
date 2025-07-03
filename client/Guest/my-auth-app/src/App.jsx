import React, { useState } from 'react';
import AuthFormContainer from './components/AuthFormContainer/AuthFormContainer';
import AuthSidePanel from './components/AuthSidePanel/AuthSidePanel';
import LoginForm from './components/LoginForm/LoginForm';
import SignUpForm from './components/SignUpForm/SignUpForm';
import backgroundImage from './assets/background-blur.png'; // Path to your background image
import styles from './App.module.css';

function App() {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className={styles.authPageWrapper} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className={styles.authContainer}>
        <AuthSidePanel isLogin={isLogin} onToggleForm={toggleForm} />
        <AuthFormContainer>
          {isLogin ? <LoginForm /> : <SignUpForm />}
        </AuthFormContainer>
      </div>
    </div>
  );
}

export default App;