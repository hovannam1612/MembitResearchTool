import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS with options
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Proxy endpoint for Membit API
app.post('/api/proxy', async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`\n[${requestId}] ========== PROXY REQUEST ==========`);
  
  try {
    let { endpoint, params, apiKey } = req.body;

    // Parse params if it's a string
    if (typeof params === 'string') {
      params = JSON.parse(params);
      console.log(`[${requestId}] ??  Parsed params from string`);
    }

    console.log(`[${requestId}] Body received:`, JSON.stringify({ endpoint, params, apiKey: apiKey?.substring(0, 10) + '...' }));

    if (!apiKey) {
      console.error(`[${requestId}] ? Missing API key`);
      return res.status(400).json({ error: 'Missing apiKey' });
    }

    if (!endpoint) {
      console.error(`[${requestId}] ? Missing endpoint`);
      return res.status(400).json({ error: 'Missing endpoint' });
    }

    // Build URL with params
    const url = new URL(`https://api.membit.ai/v1${endpoint}`);
    Object.entries(params || {}).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    const fullUrl = url.toString();
    console.log(`[${requestId}] Base URL:`, fullUrl);
    console.log(`[${requestId}] API Key (first 10 chars):`, apiKey.substring(0, 10));

    console.log(`[${requestId}] Making fetch request to:`, fullUrl);
    console.log(`[${requestId}] Using header: X-Membit-Api-Key: ${apiKey.substring(0, 10)}...`);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Membit-Api-Key': apiKey,
      },
    });

    const statusCode = response.status;
    const contentType = response.headers.get('content-type');
    
    console.log(`[${requestId}] Response status: ${statusCode} ${response.statusText}`);
    console.log(`[${requestId}] Content-Type: ${contentType}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${requestId}] ? API Error ${statusCode}:`, errorText);
      
      return res.status(statusCode).json({
        error: `API request failed with status ${statusCode}`,
        message: response.statusText,
        details: errorText,
      });
    }

    const data = await response.json();
    console.log(`[${requestId}] ? Success: Got response`, JSON.stringify(data).substring(0, 100));
    res.json(data);
  } catch (error) {
    console.error(`[${requestId}] ? Proxy error:`, error);
    res.status(500).json({
      error: 'Proxy server error',
      message: error instanceof Error ? error.message : String(error),
    });
  }
  
  console.log(`[${requestId}] ========== END REQUEST ==========\n`);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Membit Proxy Server Running' });
});

// 404 handler
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Not Found', path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({
    error: 'Server error',
    message: err instanceof Error ? err.message : String(err),
  });
});

app.listen(PORT, () => {
  console.log(`\n? Membit Proxy Server running on http://localhost:${PORT}`);
  console.log(`? Proxy endpoint: POST http://localhost:${PORT}/api/proxy`);
  console.log(`? Health check: GET http://localhost:${PORT}/health`);
  console.log(`\n? Ready to proxy requests to Membit API\n`);
});
