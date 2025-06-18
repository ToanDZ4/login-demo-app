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
    const { username, password } = req.body;

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

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const user = new User({ username, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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