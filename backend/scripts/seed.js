require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Create connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || 'postgres'),
  database: process.env.DB_NAME || 'fhir_db',
});

async function seed() {
  console.log('Starting database seeding...');

  try {
    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'patients'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.error('✗ Table "patients" does not exist!');
      console.log('Please run "npm run db:migrate" first to create the table.');
      process.exit(1);
    }

    // Read seed.sql file
    const seedPath = path.join(__dirname, '../config/seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');

    console.log('Inserting seed data...');

    // Execute the seed SQL
    await pool.query(seedSQL);

    // Count total patients
    const countResult = await pool.query('SELECT COUNT(*) FROM patients');
    const totalPatients = countResult.rows[0].count;

    console.log('✓ Database seeding completed successfully!');
    console.log(`✓ Total patients in database: ${totalPatients}`);

  } catch (error) {
    if (error.code === '23505') {
      console.log('⚠ Some patients already exist (duplicate key). Skipping duplicates.');
    } else {
      console.error('✗ Seeding failed:', error.message);
      process.exit(1);
    }
  } finally {
    await pool.end();
  }
}

// Run seeding
seed();
