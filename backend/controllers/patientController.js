const pool = require('../config/database');

// GET all patients
const getAllPatients = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM patients ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({
      error: 'Failed to fetch patients',
      message: error.message
    });
  }
};

// GET single patient by ID
const getPatientById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM patients WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Patient not found'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({
      error: 'Failed to fetch patient',
      message: error.message
    });
  }
};

// POST create new patient
const createPatient = async (req, res) => {
  const {
    family_name,
    given_name,
    gender,
    birth_date,
    phone,
    email,
    address,
    city,
    postal_code,
    country
  } = req.body;

  // Validation
  if (!family_name || !given_name || !gender || !birth_date) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['family_name', 'given_name', 'gender', 'birth_date']
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO patients
       (family_name, given_name, gender, birth_date, phone, email, address, city, postal_code, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [family_name, given_name, gender, birth_date, phone, email, address, city, postal_code, country]
    );

    res.status(201).json({
      message: 'Patient created successfully',
      patient: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({
      error: 'Failed to create patient',
      message: error.message
    });
  }
};

// PUT update patient
const updatePatient = async (req, res) => {
  const { id } = req.params;
  const {
    family_name,
    given_name,
    gender,
    birth_date,
    phone,
    email,
    address,
    city,
    postal_code,
    country
  } = req.body;

  // Validation
  if (!family_name || !given_name || !gender || !birth_date) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['family_name', 'given_name', 'gender', 'birth_date']
    });
  }

  try {
    const result = await pool.query(
      `UPDATE patients
       SET family_name = $1, given_name = $2, gender = $3, birth_date = $4,
           phone = $5, email = $6, address = $7, city = $8, postal_code = $9, country = $10
       WHERE id = $11
       RETURNING *`,
      [family_name, given_name, gender, birth_date, phone, email, address, city, postal_code, country, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Patient not found'
      });
    }

    res.json({
      message: 'Patient updated successfully',
      patient: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({
      error: 'Failed to update patient',
      message: error.message
    });
  }
};

// DELETE patient
const deletePatient = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM patients WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Patient not found'
      });
    }

    res.json({
      message: 'Patient deleted successfully',
      patient: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({
      error: 'Failed to delete patient',
      message: error.message
    });
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
};
