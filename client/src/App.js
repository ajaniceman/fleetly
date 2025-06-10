import React, { useState, useEffect } from 'react';
import Hero from './components/Hero/Hero';
import Features from './features/Features/Features';
import Testimonials from './features/Testimonials/Testimonials';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => setHealth({ error: err.message }));
  }, []);

  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </>
  );
}

export default App;