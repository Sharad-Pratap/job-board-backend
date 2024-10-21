"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Company_1 = __importDefault(require("../models/Company"));
describe('Job Routes', () => {
    let token; // Declare token variable
    let companyId; // Declare companyId variable
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Find the company before running the tests
        const company = yield Company_1.default.findOne({ email: 'test@example.com' });
        // If the company exists, generate the token
        if (company) {
            companyId = company._id; // Store the company ID
            token = jsonwebtoken_1.default.sign({ id: companyId, name: 'Test Company' }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
        }
        else {
            throw new Error('Test Company not found');
        }
    }));
    it('should create a new job posting and send job alerts', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.setTimeout(10000);
        const res = yield (0, supertest_1.default)(app_1.default)
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
    }));
    it('should return error if no token is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/jobs/post-job')
            .send({
            title: 'Software Engineer',
            description: 'We are looking for a software engineer.',
        });
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe('No token, authorization denied');
    }));
});
