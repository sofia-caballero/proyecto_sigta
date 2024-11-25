// src/pages/HomePage.js
import React from 'react';
import Header from '../components/Header';
import WelcomeSection from '../components/WelcomeSection';
import Footer from '../components/Footer';

const inicio = () => {
  return (
    <div>
      <Header />
      <main>
        <WelcomeSection />
      </main>
      <Footer />
    </div>
  );
};

export default inicio ;


