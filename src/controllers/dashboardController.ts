import { Request, Response } from 'express';
import User from '../models/User';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Lấy tất cả users
    const allUsers = await User.find();
    
    // Khách mới (đăng ký trong tháng này)
    const newUsers = await User.find({
      createdAt: { $gte: startOfMonth }
    });
    
    // Khách quay lại (có visitCount > 1)
    const returningUsers = await User.find({
      visitCount: { $gt: 1 }
    });

    const stats = {
      totalCustomers: allUsers.length,
      newCustomers: newUsers.length,
      returningCustomers: returningUsers.length
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
};

export const getCustomersList = async (req: Request, res: Response) => {
  try {
    const { filter = 'all' } = req.query;
    let query = {};
    
    if (filter === 'new') {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      query = { createdAt: { $gte: startOfMonth } };
    } else if (filter === 'returning') {
      query = { visitCount: { $gt: 1 } };
    }

    const customers = await User.find(query)
      .select('username email createdAt lastVisit visitCount')
      .sort({ createdAt: -1 });

    const customersWithStatus = customers.map(customer => ({
      id: customer._id,
      name: customer.username,
      email: customer.email,
      registrationDate: customer.createdAt,
      lastVisit: customer.lastVisit,
      visitCount: customer.visitCount,
      status: customer.visitCount > 1 ? 'returning' : 'new'
    }));

    res.json({ success: true, data: customersWithStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
};

export const updateUserVisit = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        lastVisit: new Date(),
        $inc: { visitCount: 1 }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    res.json({ success: true, message: 'Cập nhật lượt ghé thăm thành công', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
}; 