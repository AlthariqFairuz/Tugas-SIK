import React, { useState, useEffect } from 'react';
import './PatientForm.css';

function PatientForm({ onSubmit, editingPatient, onCancel }) {
  const [formData, setFormData] = useState({
    family_name: '',
    given_name: '',
    gender: '',
    birth_date: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postal_code: '',
    country: ''
  });

  useEffect(() => {
    if (editingPatient) {
      // Extract data from FHIR Patient resource
      const name = editingPatient.name?.[0] || {};
      const telecom = editingPatient.telecom || [];
      const address = editingPatient.address?.[0] || {};

      // Format birth_date to YYYY-MM-DD for input[type="date"]
      let formattedBirthDate = '';
      if (editingPatient.birthDate) {
        const date = new Date(editingPatient.birthDate);
        formattedBirthDate = date.toISOString().split('T')[0];
      }

      setFormData({
        family_name: name.family || '',
        given_name: name.given?.[0] || '',
        gender: editingPatient.gender || '',
        birth_date: formattedBirthDate,
        phone: telecom.find(t => t.system === 'phone')?.value || '',
        email: telecom.find(t => t.system === 'email')?.value || '',
        address: address.line?.[0] || '',
        city: address.city || '',
        postal_code: address.postalCode || '',
        country: address.country || ''
      });
    } else {
      resetForm();
    }
  }, [editingPatient]);

  const resetForm = () => {
    setFormData({
      family_name: '',
      given_name: '',
      gender: '',
      birth_date: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      postal_code: '',
      country: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert form data to FHIR Patient resource
    const fhirPatient = {
      resourceType: 'Patient',
      name: [{
        use: 'official',
        family: formData.family_name,
        given: [formData.given_name]
      }],
      gender: formData.gender,
      birthDate: formData.birth_date
    };

    // Add telecom if phone or email exists
    const telecom = [];
    if (formData.phone) {
      telecom.push({ system: 'phone', value: formData.phone });
    }
    if (formData.email) {
      telecom.push({ system: 'email', value: formData.email });
    }
    if (telecom.length > 0) {
      fhirPatient.telecom = telecom;
    }

    // Add address if any address fields exist
    if (formData.address || formData.city || formData.postal_code || formData.country) {
      fhirPatient.address = [{
        use: 'home',
        line: formData.address ? [formData.address] : undefined,
        city: formData.city || undefined,
        postalCode: formData.postal_code || undefined,
        country: formData.country || undefined
      }];
    }

    const success = editingPatient
      ? await onSubmit(editingPatient.id, fhirPatient)
      : await onSubmit(fhirPatient);

    if (success) {
      resetForm();
    }
  };

  const handleCancel = () => {
    resetForm();
    if (onCancel) onCancel();
  };

  return (
    <div className="patient-form-container">
      <h2>{editingPatient ? 'Edit Patient' : 'Add New Patient'}</h2>
      <form onSubmit={handleSubmit} className="patient-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="given_name">Given Name *</label>
            <input
              type="text"
              id="given_name"
              name="given_name"
              value={formData.given_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="family_name">Family Name *</label>
            <input
              type="text"
              id="family_name"
              name="family_name"
              value={formData.family_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gender">Gender *</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="birth_date">Birth Date *</label>
            <input
              type="date"
              id="birth_date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="postal_code">Postal Code</label>
            <input
              type="text"
              id="postal_code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingPatient ? 'Update Patient' : 'Add Patient'}
          </button>
          {editingPatient && (
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PatientForm;
