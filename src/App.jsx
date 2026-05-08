import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Historia from './components/Historia';
import Producto from './components/Producto';
import ComoUsar from './components/ComoUsar';
import Testimonios from './components/Testimonios';
import OrderForm from './components/OrderForm';
import OrderFormNew from './components/OrderForm/OrderFormNew';
import Footer from './components/Footer';
import PaymentSuccess from './pages/PaymentSuccess';
import { FloatingElements } from './components/UI';
import { useScrollAnimation } from './hooks';

import './styles/globals.css';

function App() {
  useScrollAnimation();
  
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={
            <main>
              <Hero />
              <Historia />
              <Producto />
              <ComoUsar />
              <Testimonios />
              <OrderFormNew />
            </main>
          } />
          <Route path="/payment/success" element={<PaymentSuccess />} />
        </Routes>
        <Footer />
        <FloatingElements />
      </div>
    </Router>
  );
}

export default App;
