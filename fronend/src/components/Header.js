// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo1">SIGTA</div>
      <nav className="navigation">
        <Link to="/login">Login</Link>
        <Link to="/register">Registrar</Link>
        <Link to="/">inicio</Link>
      </nav>
    </header>
  );
};

export default Header;


