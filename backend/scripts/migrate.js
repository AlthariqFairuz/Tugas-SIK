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

async function migrate() {
  console.log('Starting database migration...');

  try {
    // Read schema.sql file
    const schemaPath = path.join(__dirname, '../config/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema.sql...');

    // Execute the schema
    await pool.query(schema);

    console.log('✓ Database migration completed successfully!');
    console.log('✓ Table "patients" created with indexes and triggers');
    console.log('✓ Sample data inserted');

  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration
migrate();
