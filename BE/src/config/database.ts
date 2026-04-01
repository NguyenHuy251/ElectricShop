import sql from 'mssql';

const DB_PORT = Number(process.env.DB_PORT ?? 1433);

const config: sql.config = {
  server: process.env.DB_SERVER ?? 'DESKTOP-2DPRNES\\SQLEXPRESS01',
  database: process.env.DB_NAME ?? 'ElectricShop',
  user: process.env.DB_USER ?? 'sa',
  password: process.env.DB_PASSWORD ?? '1',
  port: Number.isNaN(DB_PORT) ? 1433 : DB_PORT,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERT !== 'false',
  },
};

let pool: sql.ConnectionPool | null = null;

export const connectToDatabase = async (): Promise<sql.ConnectionPool> => {
  if (pool) {
    return pool;
  }

  try {
    pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('✓ Connected to SQL Server successfully');
    return pool;
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    throw error;
  }
};

export const getPool = (): sql.ConnectionPool | null => {
  return pool;
};

export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('✓ Database connection closed');
  }
};

export default sql;
