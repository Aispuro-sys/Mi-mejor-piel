// Configuración de Stripe
export const stripeConfig = {
  // Obtener del entorno
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxx',
  
  // URLs para redirección
  successUrl: `${window.location.origin}/payment/success`,
  cancelUrl: `${window.location.origin}/payment/cancel`,
};

// Configuración del backend
export const backendConfig = {
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  currency: 'mxn',
  locale: 'es-MX',
};

// Configuración del producto
export const productConfig = {
  name: 'Suero de Ácido Hialurónico',
  description: 'Suero de alta calidad para hidratación profunda',
  images: ['/producto-image.jpg'],
  amount: 30000, // $300 MXN en centavos
  currency: 'mxn',
};
