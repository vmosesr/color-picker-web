import React from 'react';
import GoogleAuth from './GoogleAuth';
import '../App.css';

function Navbar({ user, setUser }) {
  return (
    <nav className="navbar">
      <div className="logo">
        <h1>Color Picker</h1>
      </div>
      <div className="logo-media-screen">
        <h1>CP</h1>
      </div>
      <div className="account">
        <GoogleAuth user={user} setUser={setUser} />
      </div>
    </nav>
  );
}

export default Navbar;