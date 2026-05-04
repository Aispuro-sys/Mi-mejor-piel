import Header from './components/Header';
import Hero from './components/Hero';
import Historia from './components/Historia';
import Producto from './components/Producto';
import ComoUsar from './components/ComoUsar';
import Testimonios from './components/Testimonios';
import OrderForm from './components/OrderForm';
import Footer from './components/Footer';
import { FloatingElements } from './components/UI';
import { useScrollAnimation } from './hooks';

import './styles/globals.css';

function App() {
  useScrollAnimation();
  
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Historia />
        <Producto />
        <ComoUsar />
        <Testimonios />
        <OrderForm />
      </main>
      <Footer />
      <FloatingElements />
    </>
  );
}

export default App;
