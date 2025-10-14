import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

let patients = [];
let observations = [];

patients.push({
  resourceType: "Patient",
  id: "patient-001",
  identifier: [{
    system: "http://hospital.example.com/patients",
    value: "12345"
  }],
  name: [{
    use: "official",
    family: "Santoso",
    given: ["Budi"]
  }],
  gender: "male",
  birthDate: "1985-06-15",
  telecom: [{
    system: "phone",
    value: "+62812345678",
    use: "mobile"
  }],
  address: [{
    use: "home",
    line: ["Jl. Merdeka No. 123"],
    city: "Jakarta",
    postalCode: "12345",
    country: "ID"
  }]
});

app.get('/fhir/metadata', (c) => {
  return c.json({
    resourceType: "CapabilityStatement",
    status: "active",
    date: new Date().toISOString(),
    kind: "instance",
    fhirVersion: "4.0.1",
    format: ["json"],
    rest: [{
      mode: "server",
      resource: [
        { type: "Patient" },
        { type: "Observation" }
      ]
    }]
  });
});

app.post('/fhir/patient', async (c) => {
  const patient = await c.req.json();
  patient.id = `patient-${Date.now()}`;
  patients.push(patient);
  return c.json(patient, 201);
});

app.get('/fhir/Patient/:id', (c) => {
  const patient = patients.find(p => p.id === c.req.param('id'));
  if (patient) {
    return c.json(patient);
  }
  return c.json({
    resourceType: "OperationOutcome",
    issue: [{
      severity: "error",
      code: "not-found",
      diagnostics: "Patient not found"
    }]
  }, 404);
});

app.get('/fhir/Patient', (c) => {
  const name = c.req.query('name');
  const gender = c.req.query('gender');
  let results = patients;
  
  if (name) {
    results = results.filter(p => 
      p.name.some(n => 
        n.family.toLowerCase().includes(name.toLowerCase()) ||
        n.given.some(g => g.toLowerCase().includes(name.toLowerCase()))
      )
    );
  }
  
  if (gender) {
    results = results.filter(p => p.gender === gender);
  }
  
  return c.json({
    resourceType: "Bundle",
    type: "searchset",
    total: results.length,
    entry: results.map(r => ({ resource: r }))
  });
});

app.put('/fhir/Patient/:id', async (c) => {
  const id = c.req.param('id');
  const index = patients.findIndex(p => p.id === id);
  
  if (index !== -1) {
    const body = await c.req.json();
    patients[index] = { ...body, id };
    return c.json(patients[index]);
  }
  
  return c.json({
    resourceType: "OperationOutcome",
    issue: [{
      severity: "error",
      code: "not-found"
    }]
  }, 404);
});

app.delete('/fhir/Patient/:id', (c) => {
  const index = patients.findIndex(p => p.id === c.req.param('id'));
  
  if (index !== -1) {
    patients.splice(index, 1);
    return c.body(null, 204);
  }
  
  return c.json({
    resourceType: "OperationOutcome",
    issue: [{
      severity: "error",
      code: "not-found"
    }]
  }, 404);
});

app.post('/fhir/Observation', async (c) => {
  const observation = await c.req.json();
  observation.id = `obs-${Date.now()}`;
  observations.push(observation);
  return c.json(observation, 201);
});

app.get('/fhir/Observation/:id', (c) => {
  const obs = observations.find(o => o.id === c.req.param('id'));
  
  if (obs) {
    return c.json(obs);
  }
  
  return c.json({
    resourceType: "OperationOutcome",
    issue: [{
      severity: "error",
      code: "not-found"
    }]
  }, 404);
});

const PORT = 3000;
serve({
  fetch: app.fetch,
  port: PORT
});

console.log(`Server on http://localhost:${PORT}/fhir`);