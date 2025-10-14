require('dotenv').config();
const { Pool } = require('pg');

// Create connection to PostgreSQL server (not to specific database)
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || ''),
  database: 'postgres', // Connect to default postgres database
});

async function generateDatabase() {
  const dbName = process.env.DB_NAME || 'fhir_db';

  console.log(`Checking if database "${dbName}" exists...`);

  try {
    // Check if database exists
    const checkDb = await pool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (checkDb.rows.length > 0) {
      console.log(`✓ Database "${dbName}" already exists`);
    } else {
      // Create database
      console.log(`Creating database "${dbName}"...`);
      await pool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✓ Database "${dbName}" created successfully!`);
    }

    console.log('\nNext step: Run "npm run db:migrate" to create tables');

  } catch (error) {
    console.error('✗ Database generation failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run generation
generateDatabase();
