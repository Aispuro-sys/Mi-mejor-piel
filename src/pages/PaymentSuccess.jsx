import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Mail, Package, MapPin } from 'lucide-react';
import { Button } from '../components/UI';
import './PaymentSuccess.css';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    if (orderId) {
      // Aquí podrías obtener los datos de la orden desde la API
      fetchOrderDetails(orderId);
    }
  }, [searchParams]);

  const fetchOrderDetails = async (orderId) => {
    try {
      // Simulación - en producción harías una llamada real a la API
      setTimeout(() => {
        setOrderData({
          id: orderId,
          status: 'completed',
          amount: 600,
          quantity: 2,
          customerName: 'Cliente Demo',
          customerEmail: 'cliente@ejemplo.com',
          createdAt: new Date().toISOString()
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching order:', error);
      setLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    // Generar y descargar PDF del comprobante
    alert('Descargando comprobante...');
  };

  if (loading) {
    return (
      <div className="payment-success loading">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="payment-success">
      <div className="success-container">
        <div className="success-icon">
          <Check size={64} />
        </div>
        
        <h1>¡Pago Exitoso!</h1>
        <p>Tu pedido ha sido procesado exitosamente</p>
        
        {orderData && (
          <div className="order-details">
            <h2>Detalles del Pedido</h2>
            
            <div className="detail-row">
              <span className="detail-label">Número de Orden:</span>
              <span className="detail-value">{orderData.id}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Estado:</span>
              <span className="detail-value status-completed">Completado</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Producto:</span>
              <span className="detail-value">
                Suero de Ácido Hialurónico x{orderData.quantity}
              </span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Total Pagado:</span>
              <span className="detail-value amount">${orderData.amount} MXN</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Fecha:</span>
              <span className="detail-value">
                {new Date(orderData.createdAt).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{orderData.customerEmail}</span>
            </div>
          </div>
        )}
        
        <div className="next-steps">
          <h2>¿Qué sigue?</h2>
          
          <div className="step-item">
            <Mail size={24} />
            <div>
              <h3>Comprobante enviado</h3>
              <p>Hemos enviado tu comprobante de pago a tu correo electrónico</p>
            </div>
          </div>
          
          <div className="step-item">
            <Package size={24} />
            <div>
              <h3>Preparación del pedido</h3>
              <p>Tu pedido será preparado y enviado en las próximas 24-48 horas</p>
            </div>
          </div>
          
          <div className="step-item">
            <MapPin size={24} />
            <div>
              <h3>Seguimiento del envío</h3>
              <p>Recibirás actualizaciones sobre el estado de tu entrega</p>
            </div>
          </div>
        </div>
        
        <div className="action-buttons">
          <Button
            variant="primary"
            onClick={handleDownloadReceipt}
            className="download-button"
          >
            Descargar Comprobante
          </Button>
          
          <Button
            variant="outline"
            href="/"
            className="home-button"
          >
            Volver al Inicio
          </Button>
        </div>
        
        <div className="contact-info">
          <p>¿Tienes preguntas? Contáctanos en:</p>
          <p><strong>WhatsApp:</strong> +52 619 341 4647</p>
          <p><strong>Email:</strong> info@mimejorpiel.com</p>
        </div>
      </div>
    </div>
  );
}
