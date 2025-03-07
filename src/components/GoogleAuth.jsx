import React, { useEffect } from 'react';
import '../App.css';

function GoogleAuth({ user, setUser }) {
  useEffect(() => {
    const handleCredentialResponse = (response) => {
    // Decode the JWT token to get user info
    const decodedToken = parseJwt(response.credential);
      
      setUser({
        id: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        picture: decodedToken.picture
      });
    };

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: '909281728019-8e2s07k14e8gmr07v6biriivn2mnlaup.apps.googleusercontent.com',
        callback: handleCredentialResponse
      });
      
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large' }
      );
      
      // Also display the One Tap UI
      window.google.accounts.id.prompt();
    };

    return () => {
      document.body.removeChild(script);
    };
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

  const handleSignOut = () => {
    // Sign out and clear user state
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