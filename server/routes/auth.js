import express from 'express';
import bcrypt from 'bcryptjs';
import { readJson, writeJson } from '../utils/db.js';
import { generateToken, authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required.' });
    }

    const settings = await readJson('settings.json');
    if (!settings || !settings.admin) {
      return res.status(500).json({ success: false, message: 'Server configuration error.' });
    }

    const isMatch = username.toLowerCase() === settings.admin.username.toLowerCase() &&
      await bcrypt.compare(password, settings.admin.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const token = generateToken({ username: settings.admin.username, role: 'owner' });
    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: { username: settings.admin.username, cafeName: settings.cafeName }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Verify active token
router.get('/verify', authenticateAdmin, (req, res) => {
  return res.json({ success: true, user: req.admin });
});

// Change Admin Password
router.post('/change-password', authenticateAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const settings = await readJson('settings.json');
    const isCurrentMatch = await bcrypt.compare(currentPassword, settings.admin.passwordHash);
    if (!isCurrentMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match.' });
    }

    settings.admin.passwordHash = await bcrypt.hash(newPassword, 10);
    await writeJson('settings.json', settings);

    return res.json({ success: true, message: 'Admin password updated successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
});

export default router;

