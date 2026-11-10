/**
 * Keep-Alive Ping Script for Render / Cloud Hosted Backends
 * 
 * Sends an HTTP GET request to /api/health every 5 minutes
 * to prevent the backend server from going to sleep on free-tier hosting (like Render).
 * 
 * Usage:
 *   node scripts/ping-server.js [optional_backend_url]
 * 
 * Examples:
 *   node scripts/ping-server.js https://my-cafe-website.onrender.com
 *   npm run ping
 */

const INTERVAL_MINUTES = 5;
const INTERVAL_MS = INTERVAL_MINUTES * 60 * 1000;

// Resolve target URL from CLI arg, environment variable, or fallback
const rawUrl = process.argv[2] 
  || process.env.BACKEND_URL 
  || process.env.RENDER_EXTERNAL_URL 
  || process.env.VITE_API_URL 
  || 'http://localhost:5000';

const baseUrl = rawUrl.replace(/\/+$/, '');
const targetUrl = baseUrl.endsWith('/api/health') ? baseUrl : `${baseUrl}/api/health`;

console.log('='.repeat(55));
console.log('☕ Brew & Bloom - Backend Keep-Alive Service');
console.log('='.repeat(55));
console.log(`📡 Target Endpoint : ${targetUrl}`);
console.log(`⏱️ Ping Interval   : Every ${INTERVAL_MINUTES} minutes`);
console.log(`🕒 Started At      : ${new Date().toLocaleString()}`);
console.log('='.repeat(55));
console.log('Press Ctrl + C to stop the keep-alive script anytime.\n');

let pingCount = 0;

async function pingBackend() {
  pingCount++;
  const startTime = Date.now();
  const timestamp = new Date().toLocaleTimeString();

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'BrewAndBloom-KeepAlive/1.0',
        'Accept': 'application/json'
      },
      // 15 second timeout
      signal: AbortSignal.timeout(15000)
    });

    const elapsedMs = Date.now() - startTime;
    const isOk = response.ok;

    let payload = '';
    try {
      const data = await response.json();
      payload = JSON.stringify(data);
    } catch (_) {
      payload = `Status ${response.status}`;
    }

    if (isOk) {
      console.log(`[${timestamp}] ✅ Ping #${pingCount} SUCCESS (${elapsedMs}ms) -> ${payload}`);
    } else {
      console.warn(`[${timestamp}] ⚠️ Ping #${pingCount} Status ${response.status} (${elapsedMs}ms)`);
    }
  } catch (err) {
    const elapsedMs = Date.now() - startTime;
    console.error(`[${timestamp}] ❌ Ping #${pingCount} FAILED (${elapsedMs}ms): ${err.message}`);
  }
}

// Initial ping on start
pingBackend();

// Recurring schedule every 5 minutes
setInterval(pingBackend, INTERVAL_MS);

