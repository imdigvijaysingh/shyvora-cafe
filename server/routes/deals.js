import express from 'express';
import { readJson, writeJson } from '../utils/db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public: Get all deals
router.get('/', async (req, res) => {
  try {
    const deals = (await readJson('deals.json')) || [];
    return res.json({ success: true, count: deals.length, data: deals });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch deals.' });
  }
});

// Admin: Add a new deal
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { title, description, originalPrice, discountPrice, badge, isActive } = req.body;
    if (!title || !discountPrice) {
      return res.status(400).json({ success: false, message: 'Title and discounted price are required.' });
    }

    const deals = (await readJson('deals.json')) || [];
    const newDeal = {
      id: 'deal_' + Date.now(),
      title: title.trim(),
      description: description ? description.trim() : '',
      originalPrice: parseFloat(originalPrice) || 0,
      discountPrice: parseFloat(discountPrice) || 0,
      badge: badge ? badge.trim() : 'Special Offer',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdAt: new Date().toISOString()
    };

    deals.push(newDeal);
    await writeJson('deals.json', deals);

    return res.status(201).json({ success: true, message: 'Deal created successfully.', data: newDeal });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to add deal.' });
  }
});

// Admin: Update a deal
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, originalPrice, discountPrice, badge, isActive } = req.body;

    const deals = (await readJson('deals.json')) || [];
    const index = deals.findIndex(d => d.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Deal not found.' });
    }

    deals[index] = {
      ...deals[index],
      title: title !== undefined ? title.trim() : deals[index].title,
      description: description !== undefined ? description.trim() : deals[index].description,
      originalPrice: originalPrice !== undefined ? parseFloat(originalPrice) : deals[index].originalPrice,
      discountPrice: discountPrice !== undefined ? parseFloat(discountPrice) : deals[index].discountPrice,
      badge: badge !== undefined ? badge.trim() : deals[index].badge,
      isActive: isActive !== undefined ? Boolean(isActive) : deals[index].isActive,
      updatedAt: new Date().toISOString()
    };

    await writeJson('deals.json', deals);
    return res.json({ success: true, message: 'Deal updated.', data: deals[index] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update deal.' });
  }
});

// Admin: Delete a deal
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deals = (await readJson('deals.json')) || [];
    const filtered = deals.filter(d => d.id !== id);

    if (filtered.length === deals.length) {
      return res.status(404).json({ success: false, message: 'Deal not found.' });
    }

    await writeJson('deals.json', filtered);
    return res.json({ success: true, message: 'Deal deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete deal.' });
  }
});

export default router;

