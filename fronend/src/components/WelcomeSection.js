// src/components/WelcomeSection.js
import React from 'react';
import '../css/WelcomeSection.css'; 
import artistImage from '../assets/im1.png'; 

const WelcomeSection = () => {
  return (
    <section className="welcome-section">
      <div className="welcome-content">
        <h1>BIENVENIDO A SIGTA </h1>
        <p>Confía en SIGTA para convertir tus desafíos en oportunidades. Con nuestro enfoque innovador, tendrás soluciones precisas y garantizadas que te llevarán al éxito.</p>
        
      </div>
      <div className="welcome-image">
        <img src={artistImage} alt="Painting Artist" />
      </div>
    </section>
  );
};

export default WelcomeSection;