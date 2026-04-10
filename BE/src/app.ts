import 'dotenv/config';
import express from 'express';
import type { Express } from 'express';
import cors from 'cors';
import { connectToDatabase } from './config/database.js';
import authRouter from './routes/authRoutes.js';
import productRouter from './routes/productRoutes.js';
import supplierRouter from './routes/supplierRoutes.js';
import inventoryRouter from './routes/inventoryRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import reportRouter from './routes/reportRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import voucherRouter from './routes/voucherRoutes.js';
import employeeRouter from './routes/employeeRoutes.js';
import orderRouter from './routes/orderRoutes.js';

const app: Express = express();
const PORT = process.env.PORT || 5000;
const DB_NAME = process.env.DB_NAME || 'ElectricShop';
const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to ElectricShop API' });
});

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/suppliers', supplierRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/cart', cartRouter);
app.use('/api/reports', reportRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/vouchers', voucherRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/orders', orderRouter);

app.get('/test-db', async (_req, res) => {
  try {
    const pool = await connectToDatabase();
    if (pool) {
      res.json({
        status: 'success',
        message: 'Database connected successfully',
        database: DB_NAME,
      });
    } else {
      res.status(500).json({ status: 'error', message: 'No pool connection' });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: String(error),
    });
  }
});

const startServer = async () => {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};
startServer();

export default app;
