const pool = require('../config/database');

// Helper function to convert database row to FHIR Patient resource
const toFHIRPatient = (dbRow) => {
  const patient = {
    resourceType: 'Patient',
    id: String(dbRow.id),
    meta: {
      lastUpdated: dbRow.updated_at || dbRow.created_at
    },
    name: [{
      use: 'official',
      family: dbRow.family_name,
      given: [dbRow.given_name]
    }],
    gender: dbRow.gender,
    birthDate: dbRow.birth_date
  };

  // Add telecom if phone or email exists
  const telecom = [];
  if (dbRow.phone) {
    telecom.push({ system: 'phone', value: dbRow.phone });
  }
  if (dbRow.email) {
    telecom.push({ system: 'email', value: dbRow.email });
  }
  if (telecom.length > 0) {
    patient.telecom = telecom;
  }

  // Add address if any address fields exist
  if (dbRow.address || dbRow.city || dbRow.postal_code || dbRow.country) {
    patient.address = [{
      use: 'home',
      line: dbRow.address ? [dbRow.address] : undefined,
      city: dbRow.city,
      postalCode: dbRow.postal_code,
      country: dbRow.country
    }];
  }

  return patient;
};

// Helper function to convert FHIR Patient resource to database format
const fromFHIRPatient = (fhirPatient) => {
  const name = fhirPatient.name?.[0] || {};
  const telecom = fhirPatient.telecom || [];
  const address = fhirPatient.address?.[0] || {};

  const phone = telecom.find(t => t.system === 'phone')?.value || null;
  const email = telecom.find(t => t.system === 'email')?.value || null;

  return {
    family_name: name.family,
    given_name: name.given?.[0],
    gender: fhirPatient.gender,
    birth_date: fhirPatient.birthDate,
    phone,
    email,
    address: address.line?.[0] || null,
    city: address.city || null,
    postal_code: address.postalCode || null,
    country: address.country || null
  };
};

// GET all patients (FHIR Bundle)
const getAllPatients = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM patients ORDER BY created_at DESC'
    );

    // Return FHIR Bundle
    const bundle = {
      resourceType: 'Bundle',
      type: 'searchset',
      total: result.rows.length,
      entry: result.rows.map(row => ({
        fullUrl: `${req.protocol}://${req.get('host')}/Patient/${row.id}`,
        resource: toFHIRPatient(row)
      }))
    };

    res.json(bundle);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({
      resourceType: 'OperationOutcome',
      issue: [{
        severity: 'error',
        code: 'processing',
        diagnostics: error.message
      }]
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
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'not-found',
          diagnostics: `Patient with id ${id} not found`
        }]
      });
    }

    res.json(toFHIRPatient(result.rows[0]));
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({
      resourceType: 'OperationOutcome',
      issue: [{
        severity: 'error',
        code: 'processing',
        diagnostics: error.message
      }]
    });
  }
};

// POST create new patient (accepts FHIR Patient resource)
const createPatient = async (req, res) => {
  try {
    // Convert FHIR Patient to database format
    const dbData = fromFHIRPatient(req.body);

    // Validation
    if (!dbData.family_name || !dbData.given_name || !dbData.gender || !dbData.birth_date) {
      return res.status(400).json({
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'required',
          diagnostics: 'Missing required fields: name.family, name.given, gender, birthDate'
        }]
      });
    }

    const result = await pool.query(
      `INSERT INTO patients
       (family_name, given_name, gender, birth_date, phone, email, address, city, postal_code, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [dbData.family_name, dbData.given_name, dbData.gender, dbData.birth_date,
       dbData.phone, dbData.email, dbData.address, dbData.city, dbData.postal_code, dbData.country]
    );

    res.status(201).json(toFHIRPatient(result.rows[0]));
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({
      resourceType: 'OperationOutcome',
      issue: [{
        severity: 'error',
        code: 'processing',
        diagnostics: error.message
      }]
    });
  }
};

// PUT update patient (accepts FHIR Patient resource)
const updatePatient = async (req, res) => {
  const { id } = req.params;

  try {
    // Convert FHIR Patient to database format
    const dbData = fromFHIRPatient(req.body);

    // Validation
    if (!dbData.family_name || !dbData.given_name || !dbData.gender || !dbData.birth_date) {
      return res.status(400).json({
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'required',
          diagnostics: 'Missing required fields: name.family, name.given, gender, birthDate'
        }]
      });
    }

    const result = await pool.query(
      `UPDATE patients
       SET family_name = $1, given_name = $2, gender = $3, birth_date = $4,
           phone = $5, email = $6, address = $7, city = $8, postal_code = $9, country = $10
       WHERE id = $11
       RETURNING *`,
      [dbData.family_name, dbData.given_name, dbData.gender, dbData.birth_date,
       dbData.phone, dbData.email, dbData.address, dbData.city, dbData.postal_code, dbData.country, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'not-found',
          diagnostics: `Patient with id ${id} not found`
        }]
      });
    }

    res.json(toFHIRPatient(result.rows[0]));
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({
      resourceType: 'OperationOutcome',
      issue: [{
        severity: 'error',
        code: 'processing',
        diagnostics: error.message
      }]
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
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'not-found',
          diagnostics: `Patient with id ${id} not found`
        }]
      });
    }

    // Return deleted patient as FHIR resource
    res.json(toFHIRPatient(result.rows[0]));
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({
      resourceType: 'OperationOutcome',
      issue: [{
        severity: 'error',
        code: 'processing',
        diagnostics: error.message
      }]
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
