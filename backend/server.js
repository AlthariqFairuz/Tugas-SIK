const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const patientRoutes = require('./routes/patientRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'FHIR API Documentation'
}));

/**
 * @swagger
 * /:
 *   get:
 *     summary: API information
 *     description: Returns basic information about the FHIR API
 *     tags: [FHIR]
 *     responses:
 *       200:
 *         description: API information
 */
app.get('/', (req, res) => {
  res.json({
    message: 'FHIR Patient Management API',
    version: '1.0.0',
    fhirVersion: '4.0.1',
    endpoints: {
      metadata: '/metadata',
      patients: '/Patient',
      documentation: '/api-docs'
    }
  });
});

// FHIR metadata endpoint 
app.get('/metadata', (req, res) => {
  res.json({
    resourceType: 'CapabilityStatement',
    status: 'active',
    date: new Date().toISOString(),
    kind: 'instance',
    fhirVersion: '4.0.1',
    format: ['json'],
    rest: [{
      mode: 'server',
      resource: [{
        type: 'Patient',
        interaction: [
          { code: 'read' },
          { code: 'create' },
          { code: 'update' },
          { code: 'delete' },
          { code: 'search-type' }
        ]
      }]
    }]
  });
});

app.use('/Patient', patientRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}`);
});
