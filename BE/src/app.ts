import 'dotenv/config';
import express from 'express';
import type { Express } from 'express';
import cors from 'cors';
import { connectToDatabase } from './config/database.js';
import authRouter from './routes/authRoutes.js';

const app: Express = express();
const PORT = process.env.PORT || 5000;
const DB_NAME = process.env.DB_NAME || 'ElectricShop';
const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middleware
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ElectricShop API' });
});

app.use('/api/auth', authRouter);

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    const pool = await connectToDatabase();
    if (pool) {
      res.json({ 
        status: 'success', 
        message: 'Database connected successfully',
        database: DB_NAME
      });
    } else {
      res.status(500).json({ status: 'error', message: 'No pool connection' });
    }
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: String(error)
    });
  }
});

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to database
    await connectToDatabase();

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};
startServer();

export default app;
