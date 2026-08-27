const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const connectDB = require('../../config/db');
const jwt = require('jsonwebtoken');
const appConfig = require('../../config/appConfig');

// So the mongoDB connection runs first
beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await mongoose.connection.close();
});


describe('Events API', () => {

    test('GET /api/events returns 200 and an array of events', async () => {
        const response = await request(app)
            .get('/api/events');

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('POST /api/events without JWT returns 401', async () => {
        const response = await request(app)
            .post('/api/events')
            .send({
                title: 'Test Event',
                category: '507f1f77bcf86cd799439011',
                date: '2026-09-01',
                capacity: 100
            });

        expect(response.statusCode).toBe(401);
    });

    test('POST /api/events with missing required fields returns 422', async () => {
    const token = jwt.sign(
        {
            userId: '507f1f77bcf86cd799439011',
            role: 'admin'
        },
        appConfig.jwtSecret
    );

    const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send({});

    expect(response.statusCode).toBe(422);
    expect(response.body.status).toBe('fail');
    expect(Array.isArray(response.body.errors)).toBe(true);
});

});