import React, { useEffect, useCallback } from 'react'; 
import '../App.css';
import axios from 'axios';

function GoogleAuth({ user, setUser }) {
  const handleCredentialResponse = useCallback(async (response) => {
    const decodedToken = parseJwt(response.credential);

    const userData = {
      id: decodedToken.sub,
      name: decodedToken.name,
      email: decodedToken.email,
      picture: decodedToken.picture,
    };

    setUser(userData); 

    
    try {
      await axios.post('http://localhost:5000/api/users', userData);
      console.log('User data saved to backend');
    } catch (error) {
      console.error('Error saving user data:', error);
      // Optional: Handle error gracefully, e.g., show a message to the user
    }
  }, [setUser]); 

  const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error('Failed to load Google Sign-In script');
    };
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: '909281728019-8e2s07k14e8gmr07v6biriivn2mnlaup.apps.googleusercontent.com',
          callback: handleCredentialResponse 
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { theme: 'outline', size: 'large' }
        );

        window.google.accounts.id.prompt();
      } else {
        console.error('Google Sign-In library not available');
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [handleCredentialResponse]);

  const handleSignOut = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
    setUser(null);
  };

  return (
    <div className="google-auth">
      {!user ? (
        <div id="google-signin-button"></div>
      ) : (
        <div className="user-profile">
          <img
            src={user.picture}
            alt={user.name}
            className="profile-picture"
          />
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <button className="sign-out-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GoogleAuth;