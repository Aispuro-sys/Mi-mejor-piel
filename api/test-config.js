export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const hasStripeSecret = !!process.env.STRIPE_SECRET_KEY;
  const hasStripePublishable = !!process.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const hasDatabase = !!process.env.DATABASE_URL;
  
  const stripeSecretPrefix = process.env.STRIPE_SECRET_KEY 
    ? process.env.STRIPE_SECRET_KEY.substring(0, 12) + '...' 
    : 'NOT SET';
  
  res.status(200).json({
    status: 'ok',
    config: {
      STRIPE_SECRET_KEY: hasStripeSecret ? stripeSecretPrefix : 'NOT SET',
      VITE_STRIPE_PUBLISHABLE_KEY: hasStripePublishable ? 'SET' : 'NOT SET',
      DATABASE_URL: hasDatabase ? 'SET' : 'NOT SET',
    },
    message: hasStripeSecret && stripeSecretPrefix.startsWith('sk_') 
      ? 'Config looks good!' 
      : 'STRIPE_SECRET_KEY missing or invalid'
  });
}
