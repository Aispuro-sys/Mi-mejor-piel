import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Historia from './components/Historia';
import Producto from './components/Producto';
import ComoUsar from './components/ComoUsar';
import Testimonios from './components/Testimonios';
import OrderForm from './components/OrderForm';
import Footer from './components/Footer';
import PaymentSuccess from './pages/PaymentSuccess';
import Checkout from './pages/Checkout';
import { FloatingElements } from './components/UI';
import { useScrollAnimation } from './hooks';

import './styles/globals.css';

function AppContent() {
  useScrollAnimation();
  const location = useLocation();
  const isCheckoutPage = location.pathname.startsWith('/checkout') || location.pathname.startsWith('/payment');
  
  return (
    <div className="app">
      {!isCheckoutPage && <Header />}
      <Routes>
        <Route path="/" element={
          <main>
            <Hero />
            <Historia />
            <Producto />
            <ComoUsar />
            <Testimonios />
            <OrderForm />
          </main>
        } />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
      </Routes>
      {!isCheckoutPage && <Footer />}
      {!isCheckoutPage && <FloatingElements />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
