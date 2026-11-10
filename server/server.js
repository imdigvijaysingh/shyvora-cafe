import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import settingsRoutes from './routes/settings.js';
import galleryRoutes from './routes/gallery.js';
import dealsRoutes from './routes/deals.js';
import paymentRoutes from './routes/payment.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory for media
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Static images and videos from public folder
const publicDir = path.join(__dirname, '..', 'public');
app.use('/images', express.static(path.join(publicDir, 'images')));
app.use('/videos', express.static(path.join(publicDir, 'videos')));
app.use(express.static(publicDir));

// Fallback static route for any legacy /src/assets paths
const srcAssetsDir = path.join(__dirname, '..', 'src', 'assets');
app.use('/src/assets', express.static(srcAssetsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/payment', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Production: Serve Vite build from ../dist
const clientDist = path.join(__dirname, '..', 'dist');
app.use(express.static(clientDist));

app.get('*', (req, res, next) => {
  // Never return index.html for missing images, assets, or API calls
  if (
    req.path.startsWith('/api') || 
    req.path.startsWith('/uploads') ||
    req.path.startsWith('/src/assets') ||
    req.path.startsWith('/images') ||
    req.path.startsWith('/videos') ||
    req.path.startsWith('/assets')
  ) {
    return res.status(404).send('Not found');
  }
  res.sendFile(path.join(clientDist, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`☕ Brew & Bloom Cafe Server running on port ${PORT}`);

  // Auto Keep-Alive for Render / Cloud hosting
  // Render free tier spins down after 15 mins of inactivity.
  const externalUrl = process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL;
  if (externalUrl) {
    const PING_INTERVAL_MS = 5 * 60 * 1000; // Ping every 5 minutes
    const healthUrl = `${externalUrl.replace(/\/+$/, '')}/api/health`;
    console.log(`📡 Auto Keep-Alive enabled for: ${healthUrl} (every 5 mins)`);

    setInterval(async () => {
      try {
        await fetch(healthUrl);
        console.log(`[Keep-Alive] Pinged ${healthUrl} at ${new Date().toLocaleTimeString()}`);
      } catch (err) {
        console.warn(`[Keep-Alive] Ping warning: ${err.message}`);
      }
    }, PING_INTERVAL_MS);
  }
});

export default app;

