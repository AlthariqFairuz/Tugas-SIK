import mongoose from 'mongoose';

const observationSchema = new mongoose.Schema({
  resourceType: {
    type: String,
    default: 'Observation'
  },
  status: {
    type: String,
    enum: ['registered', 'preliminary', 'final', 'amended'],
    default: 'final'
  },
  code: {
    coding: [{
      system: String,
      code: String,
      display: String
    }],
    text: String
  },
  subject: {
    reference: String,
    display: String
  },
  effectiveDateTime: String,
  valueQuantity: {
    value: Number,
    unit: String,
    system: String,
    code: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Observation', observationSchema);
