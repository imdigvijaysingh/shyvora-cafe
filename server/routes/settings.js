import express from 'express';
import { readJson, writeJson } from '../utils/db.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { uploadHeroMedia } from '../middleware/upload.js';

const router = express.Router();

// Public: Get public cafe settings (omitting sensitive admin hashes)
router.get('/', async (req, res) => {
  try {
    const settings = (await readJson('settings.json')) || {};
    const { admin, razorpay, ...publicSettings } = settings;
    return res.json({
      success: true,
      data: {
        ...publicSettings,
        razorpayKeyId: razorpay ? razorpay.keyId : ''
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch settings.' });
  }
});

// Admin: Update Seasonal / Festival Theme
router.put('/seasonal', authenticateAdmin, async (req, res) => {
  try {
    const { enabled, theme, title, discountCode, discountText, showFloatingSanta, showSnowflakes, bannerColor } = req.body;
    const settings = await readJson('settings.json');

    settings.seasonalTheme = {
      ...settings.seasonalTheme,
      enabled: enabled !== undefined ? Boolean(enabled) : settings.seasonalTheme.enabled,
      theme: theme || settings.seasonalTheme.theme,
      title: title !== undefined ? title : settings.seasonalTheme.title,
      discountCode: discountCode !== undefined ? discountCode : settings.seasonalTheme.discountCode,
      discountText: discountText !== undefined ? discountText : settings.seasonalTheme.discountText,
      showFloatingSanta: showFloatingSanta !== undefined ? Boolean(showFloatingSanta) : settings.seasonalTheme.showFloatingSanta,
      showSnowflakes: showSnowflakes !== undefined ? Boolean(showSnowflakes) : settings.seasonalTheme.showSnowflakes,
      bannerColor: bannerColor || settings.seasonalTheme.bannerColor
    };

    await writeJson('settings.json', settings);
    return res.json({ success: true, message: 'Seasonal theme updated.', data: settings.seasonalTheme });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update seasonal settings.' });
  }
});

// Admin: Update WhatsApp notification phone number
router.put('/whatsapp', authenticateAdmin, async (req, res) => {
  try {
    const { whatsappNumber, whatsappCountryCode } = req.body;
    if (!whatsappNumber) {
      return res.status(400).json({ success: false, message: 'WhatsApp number is required.' });
    }

    const settings = await readJson('settings.json');
    settings.whatsappNumber = whatsappNumber.replace(/[^0-9]/g, '');
    if (whatsappCountryCode) {
      settings.whatsappCountryCode = whatsappCountryCode.replace(/[^0-9]/g, '');
    }

    await writeJson('settings.json', settings);
    return res.json({
      success: true,
      message: 'WhatsApp number updated successfully.',
      whatsappNumber: settings.whatsappNumber
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update WhatsApp settings.' });
  }
});

// Admin: Update Hero Media & Text
router.put('/hero', authenticateAdmin, uploadHeroMedia.fields([
  { name: 'video', maxCount: 1 },
  { name: 'poster', maxCount: 1 }
]), async (req, res) => {
  try {
    const { videoUrl, posterUrl, tagline, titleLine1, titleLine2 } = req.body;
    const settings = await readJson('settings.json');

    let newVideoUrl = settings.hero.videoUrl;
    let newPosterUrl = settings.hero.posterUrl;

    if (req.files && req.files['video'] && req.files['video'][0]) {
      newVideoUrl = `/uploads/${req.files['video'][0].filename}`;
    } else if (videoUrl) {
      newVideoUrl = videoUrl;
    }

    if (req.files && req.files['poster'] && req.files['poster'][0]) {
      newPosterUrl = `/uploads/${req.files['poster'][0].filename}`;
    } else if (posterUrl) {
      newPosterUrl = posterUrl;
    }

    settings.hero = {
      ...settings.hero,
      videoUrl: newVideoUrl,
      posterUrl: newPosterUrl,
      tagline: tagline !== undefined ? tagline : settings.hero.tagline,
      titleLine1: titleLine1 !== undefined ? titleLine1 : settings.hero.titleLine1,
      titleLine2: titleLine2 !== undefined ? titleLine2 : settings.hero.titleLine2
    };

    await writeJson('settings.json', settings);
    return res.json({ success: true, message: 'Hero settings updated.', data: settings.hero });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Failed to update hero settings.' });
  }
});

// Admin: Update Razorpay Credentials
router.put('/razorpay', authenticateAdmin, async (req, res) => {
  try {
    const { keyId, keySecret } = req.body;
    const settings = await readJson('settings.json');

    settings.razorpay = {
      keyId: keyId !== undefined ? keyId : settings.razorpay.keyId,
      keySecret: keySecret !== undefined ? keySecret : settings.razorpay.keySecret
    };

    await writeJson('settings.json', settings);
    return res.json({ success: true, message: 'Razorpay credentials saved.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update payment settings.' });
  }
});

export default router;

