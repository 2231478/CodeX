import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { FacebookProvider } from '@kazion/react-facebook-login';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="1008062122575-8eqaihqq8j6sk01g90v95vivqld5m62m.apps.googleusercontent.com">
      <FacebookProvider appId="1243513920731621" version="v19.0">
        <App />
      </FacebookProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);