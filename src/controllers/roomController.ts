import { Request, Response } from 'express';
import Room from '../models/Room';

export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find().sort({ number: 1 });
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
};

export const getRoomStats = async (req: Request, res: Response) => {
  try {
    const readyCount = await Room.countDocuments({ status: 'ready' });
    const cleaningCount = await Room.countDocuments({ status: 'cleaning' });
    const occupiedCount = await Room.countDocuments({ status: 'occupied' });
    const totalCount = await Room.countDocuments();

    const stats = {
      ready: readyCount,
      cleaning: cleaningCount,
      occupied: occupiedCount,
      total: totalCount
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
};

export const updateRoomStatus = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const { status, notes } = req.body;

    if (!status || !['ready', 'cleaning', 'occupied'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Trạng thái không hợp lệ. Phải là: ready, cleaning, hoặc occupied' 
      });
    }

    const room = await Room.findByIdAndUpdate(
      roomId,
      { 
        status, 
        notes: notes || undefined,
        lastUpdated: new Date()
      },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phòng' });
    }

    res.json({ success: true, message: 'Cập nhật trạng thái phòng thành công', data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { number, type, status = 'ready', notes } = req.body;

    if (!number || !type) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng nhập số phòng và loại phòng' 
      });
    }

    // Kiểm tra phòng đã tồn tại
    const existingRoom = await Room.findOne({ number });
    if (existingRoom) {
      return res.status(409).json({ 
        success: false, 
        message: 'Số phòng đã tồn tại' 
      });
    }

    const room = new Room({ number, type, status, notes });
    await room.save();

    res.status(201).json({ success: true, message: 'Tạo phòng thành công', data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
};

export const getRoomById = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phòng' });
    }

    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
}; 