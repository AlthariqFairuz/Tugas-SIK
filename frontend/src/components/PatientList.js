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

  // Extract data from FHIR Patient resource
  const getPatientData = (patient) => {
    const name = patient.name?.[0] || {};
    const telecom = patient.telecom || [];
    const address = patient.address?.[0] || {};

    return {
      givenName: name.given?.[0] || '',
      familyName: name.family || '',
      gender: patient.gender || 'unknown',
      birthDate: patient.birthDate || '',
      phone: telecom.find(t => t.system === 'phone')?.value || '',
      email: telecom.find(t => t.system === 'email')?.value || '',
      addressLine: address.line?.[0] || '',
      city: address.city || '',
      postalCode: address.postalCode || '',
      country: address.country || ''
    };
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
          {patients.map((patient) => {
            const data = getPatientData(patient);
            return (
              <div key={patient.id} className="patient-card">
                <div className="patient-header">
                  <h3>{data.givenName} {data.familyName}</h3>
                  <span className={`gender-badge ${data.gender}`}>
                    {data.gender}
                  </span>
                </div>

                <div className="patient-details">
                  <div className="detail-row">
                    <span className="label">Birth Date:</span>
                    <span className="value">{formatDate(data.birthDate)}</span>
                  </div>

                  {data.phone && (
                    <div className="detail-row">
                      <span className="label">Phone:</span>
                      <span className="value">{data.phone}</span>
                    </div>
                  )}

                  {data.email && (
                    <div className="detail-row">
                      <span className="label">Email:</span>
                      <span className="value">{data.email}</span>
                    </div>
                  )}

                  {data.addressLine && (
                    <div className="detail-row">
                      <span className="label">Address:</span>
                      <span className="value">
                        {data.addressLine}
                        {data.city && `, ${data.city}`}
                        {data.postalCode && ` ${data.postalCode}`}
                        {data.country && `, ${data.country}`}
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
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PatientList;
