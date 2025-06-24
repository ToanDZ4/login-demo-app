import { Request, Response } from 'express';
import Feedback from '../models/Feedback';

export const getAllFeedbacks = async (req: Request, res: Response) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
};

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { customer, content } = req.body;
    if (!customer || !content) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên khách và nội dung góp ý' });
    }
    const feedback = new Feedback({ customer, content });
    await feedback.save();
    res.status(201).json({ success: true, message: 'Gửi góp ý thành công', data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
};

export const respondFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    if (!response) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập nội dung phản hồi' });
    }
    const feedback = await Feedback.findByIdAndUpdate(id, { response }, { new: true });
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy góp ý' });
    }
    res.json({ success: true, message: 'Phản hồi thành công', data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
}; 