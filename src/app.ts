import cors from 'cors';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';
import express, { Request } from 'express';
import dotenv from 'dotenv';
const app = express();
dotenv.config();
// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors<Request>());

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

