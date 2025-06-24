import express from 'express';
import { 
  createCheckin, 
  getCheckins, 
  checkoutGuest, 
  getCheckinStats, 
  getCheckinById 
} from '../controllers/checkinController';

const router = express.Router();

// Lấy thống kê check-in
router.get('/stats', getCheckinStats);

// Lấy danh sách check-in
router.get('/', getCheckins);

// Lấy check-in theo ID
router.get('/:checkinId', getCheckinById);

// Tạo check-in mới
router.post('/', createCheckin);

// Check-out khách
router.post('/:checkinId/checkout', checkoutGuest);

export default router; 