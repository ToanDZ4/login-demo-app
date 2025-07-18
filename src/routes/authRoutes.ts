import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password, rememberMe } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Check for special characters
    if (/[^\x00-\x7F]/.test(username)) {
      return res.status(400).json({ message: 'Username cannot contain special characters' });
    }
    if (/[^\x00-\x7F]/.test(password)) {
      return res.status(400).json({ message: 'Password cannot contain special characters' });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: rememberMe ? '7d' : '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    const errors: Record<string, string> = {};
    if (!username || typeof username !== 'string' || username.trim().length < 3) {
      errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }
    if (!email || typeof email !== 'string') {
      errors.email = 'Email là bắt buộc';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = 'Email không hợp lệ';
      }
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Check for special characters
    if (/[^ -\u007F]/.test(username)) {
      return res.status(400).json({ success: false, errors: { username: 'Tên đăng nhập không được chứa ký tự đặc biệt' } });
    }
    if (/[^ -\u007F]/.test(password)) {
      return res.status(400).json({ success: false, errors: { password: 'Mật khẩu không được chứa ký tự đặc biệt' } });
    }

    // Check if username or email exists
    const existingUser = await User.findOne({ $or: [ { username }, { email } ] });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(409).json({ success: false, errors: { username: 'Tên đăng nhập đã tồn tại' } });
      }
      if (existingUser.email === email) {
        return res.status(409).json({ success: false, errors: { email: 'Email đã được sử dụng' } });
      }
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    return res.status(201).json({ success: true, message: 'Đăng ký thành công', userId: user._id });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
  }
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // In a real application, you would send a password reset email here
    res.json({ message: 'Password reset instructions sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 