import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import PatientForm from './components/PatientForm';
import PatientList from './components/PatientList';
import Modal from './components/Modal';

function App() {
  const [patients, setPatients] = useState([]);
  const [editingPatient, setEditingPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, patientId: null, patientName: '' });

  // Fetch all patients
  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/Patient');
      // Extract patients from FHIR Bundle
      const bundle = response.data;
      const patients = bundle.entry ? bundle.entry.map(entry => entry.resource) : [];
      setPatients(patients);
    } catch (err) {
      setError('Failed to fetch patients: ' + err.message);
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Create patient
  const handleCreate = async (patientData) => {
    try {
      await axios.post('/Patient', patientData);
      fetchPatients();
      return true;
    } catch (err) {
      setError('Failed to create patient: ' + err.message);
      console.error('Error creating patient:', err);
      return false;
    }
  };

  // Update patient
  const handleUpdate = async (id, patientData) => {
    try {
      await axios.put(`/Patient/${id}`, patientData);
      setEditingPatient(null);
      fetchPatients();
      return true;
    } catch (err) {
      setError('Failed to update patient: ' + err.message);
      console.error('Error updating patient:', err);
      return false;
    }
  };

  // Open delete modal
  const handleDeleteClick = (patient) => {
    const name = patient.name?.[0] || {};
    const givenName = name.given?.[0] || '';
    const familyName = name.family || '';
    setDeleteModal({
      isOpen: true,
      patientId: patient.id,
      patientName: `${givenName} ${familyName}`
    });
  };

  // Close delete modal
  const handleCloseModal = () => {
    setDeleteModal({ isOpen: false, patientId: null, patientName: '' });
  };

  // Confirm delete patient
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/Patient/${deleteModal.patientId}`);
      fetchPatients();
      handleCloseModal();
    } catch (err) {
      setError('Failed to delete patient: ' + err.message);
      console.error('Error deleting patient:', err);
      handleCloseModal();
    }
  };

  // Edit patient
  const handleEdit = (patient) => {
    setEditingPatient(patient);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingPatient(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>FHIR Patient Management System</h1>
      </header>

      <main className="App-main">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <PatientForm
          onSubmit={editingPatient ? handleUpdate : handleCreate}
          editingPatient={editingPatient}
          onCancel={handleCancelEdit}
        />

        <PatientList
          patients={patients}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          loading={loading}
        />

        <Modal
          isOpen={deleteModal.isOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          title="Delete Patient"
          message={`Are you sure you want to delete ${deleteModal.patientName}? This action cannot be undone.`}
        />
      </main>
    </div>
  );
}

export default App;
