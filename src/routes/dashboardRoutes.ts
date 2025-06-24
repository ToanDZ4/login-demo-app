import express from 'express';
import { getDashboardStats, getCustomersList, updateUserVisit } from '../controllers/dashboardController';

const router = express.Router();

router.get('/stats', getDashboardStats);
router.get('/customers', getCustomersList);
router.post('/customers/:userId/visit', updateUserVisit);

export default router; 