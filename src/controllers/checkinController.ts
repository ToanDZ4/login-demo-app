import { Request, Response } from 'express';
import Checkin from '../models/Checkin';
import Room from '../models/Room';

export const createCheckin = async (req: Request, res: Response) => {
  try {
    const {
      guestName,
      guestPhone,
      guestEmail,
      guestIdCard,
      roomNumber,
      roomType,
      checkInDate,
      checkOutDate,
      notes
    } = req.body;

    // Validate required fields
    if (!guestName || !guestPhone || !guestIdCard || !roomNumber || !roomType) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin: tên khách, số điện thoại, CMND/CCCD, số phòng, loại phòng'
      });
    }

    // Check if room is available
    const room = await Room.findOne({ number: roomNumber });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phòng'
      });
    }

    if (room.status !== 'ready') {
      return res.status(400).json({
        success: false,
        message: 'Phòng không sẵn sàng để check-in'
      });
    }

    // Check if room is already occupied
    const existingCheckin = await Checkin.findOne({
      roomNumber,
      status: 'active'
    });

    if (existingCheckin) {
      return res.status(409).json({
        success: false,
        message: 'Phòng đã có khách đang ở'
      });
    }

    // Generate key number
    const keyNumber = `K${roomNumber}`;

    // Create checkin record
    const checkin = new Checkin({
      guestName,
      guestPhone,
      guestEmail,
      guestIdCard,
      roomNumber,
      roomType,
      keyNumber,
      checkInDate: checkInDate || new Date(),
      checkOutDate,
      notes
    });

    await checkin.save();

    // Update room status to occupied
    await Room.findByIdAndUpdate(room._id, {
      status: 'occupied',
      lastUpdated: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Check-in thành công',
      data: checkin
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
};

export const getCheckins = async (req: Request, res: Response) => {
  try {
    const { status, date } = req.query;
    let query: any = {};

    if (status) {
      query.status = status;
    }

    if (date) {
      const startDate = new Date(date as string);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      query.checkInDate = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const checkins = await Checkin.find(query)
      .sort({ checkInDate: -1 });

    res.json({ success: true, data: checkins });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
};

export const checkoutGuest = async (req: Request, res: Response) => {
  try {
    const { checkinId } = req.params;
    const { notes } = req.body;

    const checkin = await Checkin.findById(checkinId);
    if (!checkin) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin check-in'
      });
    }

    if (checkin.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Khách đã check-out hoặc hủy phòng'
      });
    }

    // Update checkin status
    checkin.status = 'checked-out';
    checkin.checkOutDate = new Date();
    if (notes) checkin.notes = notes;
    await checkin.save();

    // Update room status to cleaning
    await Room.findOneAndUpdate(
      { number: checkin.roomNumber },
      {
        status: 'cleaning',
        lastUpdated: new Date()
      }
    );

    res.json({
      success: true,
      message: 'Check-out thành công',
      data: checkin
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
};

export const getCheckinStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayCheckins = await Checkin.countDocuments({
      checkInDate: { $gte: today, $lt: tomorrow }
    });

    const activeCheckins = await Checkin.countDocuments({ status: 'active' });
    const totalCheckins = await Checkin.countDocuments();

    const stats = {
      todayCheckins,
      activeCheckins,
      totalCheckins
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
};

export const getCheckinById = async (req: Request, res: Response) => {
  try {
    const { checkinId } = req.params;
    const checkin = await Checkin.findById(checkinId);

    if (!checkin) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin check-in'
      });
    }

    res.json({ success: true, data: checkin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
}; 