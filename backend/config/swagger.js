const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FHIR Patient Management API',
      version: '1.0.0',
      description: 'A FHIR-compliant API for managing patient resources',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'FHIR',
        description: 'FHIR metadata and capability statements'
      },
      {
        name: 'Patient',
        description: 'FHIR Patient resource operations'
      }
    ],
    components: {
      schemas: {
        FHIRPatient: {
          type: 'object',
          required: ['resourceType', 'name', 'gender', 'birthDate'],
          properties: {
            resourceType: {
              type: 'string',
              enum: ['Patient'],
              example: 'Patient'
            },
            id: {
              type: 'string',
              description: 'Patient ID',
              example: '1'
            },
            meta: {
              type: 'object',
              properties: {
                lastUpdated: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-10-15T10:30:00Z'
                }
              }
            },
            name: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  use: {
                    type: 'string',
                    enum: ['official', 'usual', 'nickname'],
                    example: 'official'
                  },
                  family: {
                    type: 'string',
                    example: 'Doe'
                  },
                  given: {
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    example: ['John']
                  }
                }
              }
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'other', 'unknown'],
              example: 'male'
            },
            birthDate: {
              type: 'string',
              format: 'date',
              example: '1990-01-15'
            },
            telecom: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  system: {
                    type: 'string',
                    enum: ['phone', 'email', 'fax', 'url'],
                    example: 'phone'
                  },
                  value: {
                    type: 'string',
                    example: '+1234567890'
                  }
                }
              }
            },
            address: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  use: {
                    type: 'string',
                    enum: ['home', 'work', 'temp'],
                    example: 'home'
                  },
                  line: {
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    example: ['123 Main St']
                  },
                  city: {
                    type: 'string',
                    example: 'Boston'
                  },
                  postalCode: {
                    type: 'string',
                    example: '02101'
                  },
                  country: {
                    type: 'string',
                    example: 'USA'
                  }
                }
              }
            }
          }
        },
        FHIRBundle: {
          type: 'object',
          properties: {
            resourceType: {
              type: 'string',
              enum: ['Bundle'],
              example: 'Bundle'
            },
            type: {
              type: 'string',
              enum: ['searchset'],
              example: 'searchset'
            },
            total: {
              type: 'integer',
              example: 10
            },
            entry: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  fullUrl: {
                    type: 'string',
                    example: 'http://localhost:3001/Patient/1'
                  },
                  resource: {
                    $ref: '#/components/schemas/FHIRPatient'
                  }
                }
              }
            }
          }
        },
        OperationOutcome: {
          type: 'object',
          properties: {
            resourceType: {
              type: 'string',
              enum: ['OperationOutcome'],
              example: 'OperationOutcome'
            },
            issue: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  severity: {
                    type: 'string',
                    enum: ['error', 'warning', 'information'],
                    example: 'error'
                  },
                  code: {
                    type: 'string',
                    example: 'not-found'
                  },
                  diagnostics: {
                    type: 'string',
                    example: 'Patient not found'
                  }
                }
              }
            }
          }
        },
        CapabilityStatement: {
          type: 'object',
          properties: {
            resourceType: {
              type: 'string',
              enum: ['CapabilityStatement'],
              example: 'CapabilityStatement'
            },
            status: {
              type: 'string',
              example: 'active'
            },
            date: {
              type: 'string',
              format: 'date-time'
            },
            kind: {
              type: 'string',
              example: 'instance'
            },
            fhirVersion: {
              type: 'string',
              example: '4.0.1'
            },
            format: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['json']
            },
            rest: {
              type: 'array',
              items: {
                type: 'object'
              }
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './server.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
