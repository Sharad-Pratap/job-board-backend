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
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
// Start an in-memory MongoDB server for testing purposes
let mongo;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongo = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    yield mongoose_1.default.connect(mongoUri);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    if (mongo) {
        yield mongo.stop();
    }
    yield mongoose_1.default.connection.close();
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    const db = mongoose_1.default.connection.db;
    if (!db) {
        throw new Error('Database connection is not established');
    }
    const collections = yield db.collections();
    for (let collection of collections) {
        yield collection.deleteMany({});
    }
}));
