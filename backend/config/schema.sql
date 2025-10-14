-- Create database (run this separately if database doesn't exist)
-- CREATE DATABASE fhir_db;

-- Connect to the database
-- \c fhir_db;

-- Create patients table based on FHIR Patient resource
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    family_name VARCHAR(100) NOT NULL,
    given_name VARCHAR(100) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other', 'unknown')),
    birth_date DATE NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on name fields for faster searching
CREATE INDEX IF NOT EXISTS idx_patient_name ON patients(family_name, given_name);

-- Create index on birth_date for age-based queries
CREATE INDEX IF NOT EXISTS idx_patient_birth_date ON patients(birth_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_patient_updated_at ON patients;
CREATE TRIGGER update_patient_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
