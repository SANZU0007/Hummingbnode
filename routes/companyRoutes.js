// routes/companyRoutes.js
import express from 'express';
import { getAllCompanyNames, registerCompany } from '../controllers/companyController.js';

const router = express.Router();

// Route to register a new company
router.post('/register', registerCompany);

router.get('/names', getAllCompanyNames);

export default router;
