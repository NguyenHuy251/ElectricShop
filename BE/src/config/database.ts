import sql from 'mssql';

const config: sql.config = {
  server: 'DESKTOP-2DPRNES\\SQLEXPRESS01',
  database: 'ElectricShop',
  user: 'sa',
  password: '1',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    connectTimeout: 15000,
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
