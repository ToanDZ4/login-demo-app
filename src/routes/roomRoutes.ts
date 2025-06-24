import express from 'express';
import { 
  getAllRooms, 
  getRoomStats, 
  updateRoomStatus, 
  createRoom, 
  getRoomById 
} from '../controllers/roomController';

const router = express.Router();

// Lấy thống kê phòng
router.get('/stats', getRoomStats);

// Lấy tất cả phòng
router.get('/', getAllRooms);

// Lấy phòng theo ID
router.get('/:roomId', getRoomById);

// Tạo phòng mới
router.post('/', createRoom);

// Cập nhật trạng thái phòng
router.put('/:roomId/status', updateRoomStatus);

export default router; 