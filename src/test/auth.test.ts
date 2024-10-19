import request from 'supertest';
import app from '../app';
import Company from '../models/Company';
import bcrypt from 'bcryptjs';

describe('Auth Routes', () => {
    beforeAll(async () => {
        // Seed a company to test login
        const hashedPassword = await bcrypt.hash('password123', 10);
        const company = new Company({
            name: 'Test Company',
            email: 'test@example.com',
            password: hashedPassword,
            phone: '1233467890',
        });
        await company.save();
    });

    it('should register a new company', async () => {
        const res = await request(app).post('/api/auth/register').send({
            name: 'New Test Company',
            email: 'lucky85@yopmail.com',
            password: 'password123',
            phone: '0987554321',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.msg).toBe('Registration successful. Please verify your email.');
    });

    it('should log in a registered company', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'lucky85@yopmail.com',
            password: 'password123',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should return error for invalid credentials', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'lucky85@yopmail.com',
            password: 'wrongpassword',
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe('Invalid credentials');
    });
});
