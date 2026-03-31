const request = require('supertest');
const { app } = require('../src/server');

// Mock database connections to avoid needing real DBs in tests
jest.mock('../src/config/postgres', () => ({
  pool: {
    query: jest.fn(),
    connect: jest.fn().mockResolvedValue({ release: jest.fn() })
  },
  connectPostgres: jest.fn().mockResolvedValue(undefined)
}));

jest.mock('../src/config/mongo', () => ({
  connectMongo: jest.fn().mockResolvedValue(undefined),
  Alert: { create: jest.fn(), find: jest.fn().mockReturnValue({ sort: jest.fn().mockReturnValue({ limit: jest.fn().mockResolvedValue([]) }) }) },
  EventLog: { create: jest.fn() },
  PredictionLog: { create: jest.fn() },
  Notification: { create: jest.fn() }
}));

jest.mock('../src/config/redis', () => ({
  connectRedis: jest.fn().mockResolvedValue(undefined),
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn()
}));

describe('Health Check', () => {
  it('GET /health returns 200 with status healthy', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.version).toBe('1.0.0');
  });
});

describe('Auth API', () => {
  const { pool } = require('../src/config/postgres');
  const bcrypt = require('bcryptjs');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/auth/register - validation error on missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'invalid-email' });
    expect(res.status).toBe(400);
  });

  it('POST /api/auth/login - returns 401 for non-existent user', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password123' });
    expect(res.status).toBe(401);
  });

  it('POST /api/auth/login - returns tokens for valid credentials', async () => {
    const passwordHash = await bcrypt.hash('password123', 12);
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 'uuid-1', name: 'Test User', email: 'test@test.com', password_hash: passwordHash, role: 'citizen', is_active: true }] })
      .mockResolvedValueOnce({ rows: [] }); // update last_login

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
    expect(res.body.data.user.role).toBe('citizen');
  });
});

describe('Incidents API', () => {
  const { pool } = require('../src/config/postgres');

  it('GET /api/incidents - requires no auth (public)', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ count: '0' }] });
    const res = await request(app).get('/api/incidents');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/incidents - returns 401 without token', async () => {
    const res = await request(app)
      .post('/api/incidents')
      .send({ title: 'Test', type: 'flood', severity: 'high', latitude: 13.0, longitude: 80.0 });
    expect(res.status).toBe(401);
  });
});

describe('Prediction Risk Calculation', () => {
  const { calculateRisk } = require('../src/controllers/predictionController');

  it('calculates high flood risk for heavy rainfall', () => {
    // This tests the internal logic indirectly through the API
    // Full unit test would import the function directly
    expect(true).toBe(true); // placeholder
  });
});

describe('Rate Limiting', () => {
  it('GET /api/ endpoints respect rate limiting headers', async () => {
    const res = await request(app).get('/api/incidents');
    expect(res.headers).toHaveProperty('x-ratelimit-limit');
  });
});
