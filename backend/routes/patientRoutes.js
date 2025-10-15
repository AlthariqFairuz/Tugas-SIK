const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

/**
 * @swagger
 * /Patient:
 *   get:
 *     summary: Search all patients
 *     description: Returns a FHIR Bundle containing all patient resources
 *     tags: [Patient]
 *     responses:
 *       200:
 *         description: A FHIR Bundle of patients
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FHIRBundle'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OperationOutcome'
 */
router.get('/', patientController.getAllPatients);

/**
 * @swagger
 * /Patient/{id}:
 *   get:
 *     summary: Get a patient by ID
 *     description: Returns a single FHIR Patient resource
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: A FHIR Patient resource
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FHIRPatient'
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OperationOutcome'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OperationOutcome'
 */
router.get('/:id', patientController.getPatientById);

/**
 * @swagger
 * /Patient:
 *   post:
 *     summary: Create a new patient
 *     description: Creates a new patient resource from a FHIR Patient
 *     tags: [Patient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FHIRPatient'
 *     responses:
 *       201:
 *         description: Patient created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FHIRPatient'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OperationOutcome'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OperationOutcome'
 */
router.post('/', patientController.createPatient);

/**
 * @swagger
 * /Patient/{id}:
 *   put:
 *     summary: Update a patient
 *     description: Updates an existing patient resource with FHIR Patient data
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FHIRPatient'
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FHIRPatient'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OperationOutcome'
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OperationOutcome'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OperationOutcome'
 */
router.put('/:id', patientController.updatePatient);

/**
 * @swagger
 * /Patient/{id}:
 *   delete:
 *     summary: Delete a patient
 *     description: Deletes a patient and returns the deleted FHIR Patient resource
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FHIRPatient'
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OperationOutcome'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OperationOutcome'
 */
router.delete('/:id', patientController.deletePatient);

module.exports = router;
