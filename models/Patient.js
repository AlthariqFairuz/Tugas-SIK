import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  resourceType: {
    type: String,
    default: 'Patient'
  },
  identifier: [{
    system: String,
    value: String
  }],
  name: [{
    use: String,
    family: String,
    given: [String]
  }],
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'unknown']
  },
  birthDate: String,
  telecom: [{
    system: String,
    value: String,
    use: String
  }],
  address: [{
    use: String,
    line: [String],
    city: String,
    postalCode: String,
    country: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('Patient', patientSchema);
