import express from 'express';
import { readJson, writeJson } from '../utils/db.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';

const router = express.Router();

// Public: Get all menu items
router.get('/', async (req, res) => {
  try {
    const menu = (await readJson('menu.json')) || [];
    return res.json({ success: true, count: menu.length, data: menu });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch menu items.' });
  }
});

// Admin: Add a new item
router.post('/', authenticateAdmin, uploadImage.single('image'), async (req, res) => {
  try {
    const { title, description, price, category, type, isVeg, isFeatured, imageUrl } = req.body;
    if (!title || !price || !category) {
      return res.status(400).json({ success: false, message: 'Title, price, and category are required.' });
    }

    const menu = (await readJson('menu.json')) || [];
    const imagePath = req.file ? `/uploads/${req.file.filename}` : (imageUrl || '/images/menu_cappuccino_1784782504483.webp');

    const newItem = {
      id: 'item_' + Date.now(),
      title: title.trim(),
      description: description ? description.trim() : '',
      price: parseFloat(price) || 0,
      category: category.trim(),
      type: type === 'Iced' ? 'Iced' : 'Hot',
      isVeg: isVeg === 'true' || isVeg === true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      image: imagePath,
      createdAt: new Date().toISOString()
    };

    menu.push(newItem);
    await writeJson('menu.json', menu);

    return res.status(201).json({ success: true, message: 'Item added successfully.', data: newItem });
  } catch (err) {
    console.error('Add item error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to add menu item.' });
  }
});

// Admin: Update existing item
router.put('/:id', authenticateAdmin, uploadImage.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, type, isVeg, isFeatured, imageUrl } = req.body;

    const menu = (await readJson('menu.json')) || [];
    const itemIndex = menu.findIndex(item => item.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }

    const currentItem = menu[itemIndex];
    const imagePath = req.file ? `/uploads/${req.file.filename}` : (imageUrl || currentItem.image);

    const updatedItem = {
      ...currentItem,
      title: title !== undefined ? title.trim() : currentItem.title,
      description: description !== undefined ? description.trim() : currentItem.description,
      price: price !== undefined ? parseFloat(price) : currentItem.price,
      category: category !== undefined ? category.trim() : currentItem.category,
      type: type !== undefined ? (type === 'Iced' ? 'Iced' : 'Hot') : currentItem.type,
      isVeg: isVeg !== undefined ? (isVeg === 'true' || isVeg === true) : currentItem.isVeg,
      isFeatured: isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : currentItem.isFeatured,
      image: imagePath,
      updatedAt: new Date().toISOString()
    };

    menu[itemIndex] = updatedItem;
    await writeJson('menu.json', menu);

    return res.json({ success: true, message: 'Item updated successfully.', data: updatedItem });
  } catch (err) {
    console.error('Update item error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to update menu item.' });
  }
});

// Admin: Delete item
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const menu = (await readJson('menu.json')) || [];
    const filtered = menu.filter(item => item.id !== id);

    if (filtered.length === menu.length) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    await writeJson('menu.json', filtered);
    return res.json({ success: true, message: 'Item deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete menu item.' });
  }
});

export default router;

