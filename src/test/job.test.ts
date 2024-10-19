import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';
import Company from '../models/Company';

describe('Job Routes', () => {
    let token:string; // Declare token variable
    let companyId; // Declare companyId variable

    beforeAll(async () => {
        // Find the company before running the tests
        const company = await Company.findOne({ email: 'test@example.com' });

        // If the company exists, generate the token
        if (company) {
            companyId = company._id; // Store the company ID
            token = jwt.sign({ id: companyId, name: 'Test Company' }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
        } else {
            throw new Error('Test Company not found');
        }
    });

    it('should create a new job posting and send job alerts', async () => {
        jest.setTimeout(10000); 
        const res = await request(app)
            .post('/api/jobs/post-job')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Software Engineer 1',
                description: 'We are looking for a software engineer.1',
                experienceLevel: 'Entry',
                endDate: '2024-12-31',
                candidateEmails: ['candidate@example.com'],
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.msg).toBe('Job posted successfully');
    });

    it('should return error if no token is provided', async () => {
        const res = await request(app)
            .post('/api/jobs/post-job')
            .send({
                title: 'Software Engineer',
                description: 'We are looking for a software engineer.',
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe('No token, authorization denied');
    });
});