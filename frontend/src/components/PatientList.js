import React from 'react';
import './PatientList.css';

function PatientList({ patients, onEdit, onDelete, loading }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="patient-list-container">
        <h2>Patient List</h2>
        <div className="loading">Loading patients...</div>
      </div>
    );
  }

  return (
    <div className="patient-list-container">
      <h2>Patient List ({patients.length})</h2>

      {patients.length === 0 ? (
        <div className="empty-state">
          <p>No patients found. Add your first patient above.</p>
        </div>
      ) : (
        <div className="patient-grid">
          {patients.map((patient) => (
            <div key={patient.id} className="patient-card">
              <div className="patient-header">
                <h3>{patient.given_name} {patient.family_name}</h3>
                <span className={`gender-badge ${patient.gender}`}>
                  {patient.gender}
                </span>
              </div>

              <div className="patient-details">
                <div className="detail-row">
                  <span className="label">Birth Date:</span>
                  <span className="value">{formatDate(patient.birth_date)}</span>
                </div>

                {patient.phone && (
                  <div className="detail-row">
                    <span className="label">Phone:</span>
                    <span className="value">{patient.phone}</span>
                  </div>
                )}

                {patient.email && (
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{patient.email}</span>
                  </div>
                )}

                {patient.address && (
                  <div className="detail-row">
                    <span className="label">Address:</span>
                    <span className="value">
                      {patient.address}
                      {patient.city && `, ${patient.city}`}
                      {patient.postal_code && ` ${patient.postal_code}`}
                      {patient.country && `, ${patient.country}`}
                    </span>
                  </div>
                )}
              </div>

              <div className="patient-actions">
                <button
                  className="btn-edit"
                  onClick={() => onEdit(patient)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(patient)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PatientList;
