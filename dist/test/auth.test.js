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
const Company_1 = __importDefault(require("../models/Company"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
describe('Auth Routes', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Seed a company to test login
        const hashedPassword = yield bcryptjs_1.default.hash('password123', 10);
        const company = new Company_1.default({
            name: 'Test Company',
            email: 'test@example.com',
            password: hashedPassword,
            phone: '1233467890',
        });
        yield company.save();
    }));
    it('should register a new company', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({
            name: 'New Test Company',
            email: 'lucky85@yopmail.com',
            password: 'password123',
            phone: '0987554321',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.msg).toBe('Registration successful. Please verify your email.');
    }));
    it('should log in a registered company', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
            email: 'lucky85@yopmail.com',
            password: 'password123',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    }));
    it('should return error for invalid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
            email: 'lucky85@yopmail.com',
            password: 'wrongpassword',
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe('Invalid credentials');
    }));
});
