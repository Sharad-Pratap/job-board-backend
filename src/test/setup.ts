import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Start an in-memory MongoDB server for testing purposes
let mongo: MongoMemoryServer;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

beforeEach(async () => {
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error('Database connection is not established');
    }
    const collections = await db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});
