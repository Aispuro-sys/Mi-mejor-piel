import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Crear tabla de productos
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'mxn',
        image_url VARCHAR(500),
        stock INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Crear tabla de clientes
    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Crear tabla de pedidos
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50),
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'mxn',
        status VARCHAR(50) DEFAULT 'pending',
        payment_status VARCHAR(50) DEFAULT 'pending',
        payment_method VARCHAR(50),
        payment_intent_id VARCHAR(255),
        stripe_payment_id VARCHAR(255),
        delivery_method VARCHAR(50),
        shipping_address TEXT,
        shipping_city VARCHAR(100),
        shipping_colony VARCHAR(100),
        shipping_cp VARCHAR(10),
        tracking_number VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Crear tabla de pagos
    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) REFERENCES orders(id),
        stripe_payment_intent_id VARCHAR(255) UNIQUE,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'mxn',
        status VARCHAR(50) NOT NULL,
        payment_method VARCHAR(100),
        receipt_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Crear tabla de comprobantes
    await sql`
      CREATE TABLE IF NOT EXISTS receipts (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) REFERENCES orders(id),
        receipt_number VARCHAR(100) UNIQUE,
        pdf_url VARCHAR(500),
        sent_to_customer BOOLEAN DEFAULT false,
        customer_email VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Crear tabla de configuración
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT,
        description TEXT,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Insertar producto por defecto
    await sql`
      INSERT INTO products (name, description, price, currency, stock, is_active)
      VALUES (
        'Suero de Ácido Hialurónico',
        'Suero de alta calidad para hidratación profunda y reducción de arrugas. Resultados visibles en 2 semanas.',
        300.00,
        'mxn',
        1000,
        true
      )
      ON CONFLICT DO NOTHING
    `;

    // Insertar configuración por defecto
    await sql`
      INSERT INTO settings (key, value, description)
      VALUES 
        ('site_name', 'Mi Mejor Piel', 'Nombre del sitio'),
        ('currency', 'mxn', 'Moneda por defecto'),
        ('tax_rate', '0.16', 'Tasa de impuestos'),
        ('shipping_cost', '0', 'Costo de envío'),
        ('email_from', 'noreply@mimejorpiel.com', 'Email de envío'),
        ('whatsapp_number', '+526193414647', 'Número de WhatsApp')
      ON CONFLICT DO NOTHING
    `;

    // Crear índices
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_receipts_order_id ON receipts(order_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email)`;

    res.status(200).json({ 
      message: 'Database setup completed successfully',
      tables: ['products', 'customers', 'orders', 'payments', 'receipts', 'settings']
    });
  } catch (error) {
    console.error('Database setup error:', error);
    res.status(500).json({ error: error.message });
  }
}
