import React from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import ProductSection from './components/ProductSection';
import Footer from './components/Footer';
import './index.css';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <main>
        <Banner />
        <ProductSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;