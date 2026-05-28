import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BrandDNA from './components/BrandDNA';
import Showroom from './components/Showroom';
import FinanceCalculator from './components/FinanceCalculator';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';

// Rutas de Administración
import Login from './components/admin/Login';
import Dashboard from './components/admin/Dashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';

const LandingPage = () => (
  <div className="bg-zinc-950 min-h-screen text-white overflow-x-hidden">
    <Navbar />
    <main>
      <HeroSection />
      <section id="showroom">
        <BrandDNA />
      </section>
      <Showroom />
      <FinanceCalculator />
    </main>
    <Footer />
    <ChatWidget />
  </div>
);

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Ruta principal pública */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Rutas de Administración */}
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
