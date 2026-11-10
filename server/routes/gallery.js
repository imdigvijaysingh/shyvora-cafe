import express from 'express';
import { readJson, writeJson } from '../utils/db.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';

const router = express.Router();

// Public: Get all gallery photos
router.get('/', async (req, res) => {
  try {
    const gallery = (await readJson('gallery.json')) || [];
    return res.json({ success: true, count: gallery.length, data: gallery });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch gallery photos.' });
  }
});

// Admin: Upload a new gallery photo (Strictly images only - no videos allowed)
router.post('/', authenticateAdmin, uploadImage.single('photo'), async (req, res) => {
  try {
    const { title, category, imageUrl } = req.body;
    let photoPath = imageUrl;

    if (req.file) {
      photoPath = `/uploads/${req.file.filename}`;
    }

    if (!photoPath) {
      return res.status(400).json({ success: false, message: 'Image file or imageUrl is required.' });
    }

    const gallery = (await readJson('gallery.json')) || [];
    const newPhoto = {
      id: 'gallery_' + Date.now(),
      title: title ? title.trim() : 'Cafe Ambiance',
      category: category ? category.trim() : 'Ambience',
      imageUrl: photoPath,
      uploadedAt: new Date().toISOString()
    };

    gallery.unshift(newPhoto);
    await writeJson('gallery.json', gallery);

    return res.status(201).json({ success: true, message: 'Photo uploaded to gallery.', data: newPhoto });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Failed to upload photo.' });
  }
});

// Admin: Delete a photo from gallery
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = (await readJson('gallery.json')) || [];
    const filtered = gallery.filter(item => item.id !== id);

    if (filtered.length === gallery.length) {
      return res.status(404).json({ success: false, message: 'Photo not found.' });
    }

    await writeJson('gallery.json', filtered);
    return res.json({ success: true, message: 'Photo removed from gallery.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to remove photo.' });
  }
});

export default router;

