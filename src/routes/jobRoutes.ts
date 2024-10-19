import express from 'express';
import { createJob } from '../controllers/jobController';
import auth from '../middlewares/auth';


const router = express.Router();

router.post('/post-job',auth, createJob);

export default router;
