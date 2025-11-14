import type { IncomingMessage, ServerResponse } from 'http';

export default async function handler(
  req: IncomingMessage & { body?: any; query?: Record<string, any> },
  res: ServerResponse & { json?: (data: any) => void; status?: (code: number) => any }
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { endpoint, params, apiKey } = req.body;

    if (!apiKey || !endpoint) {
      return res.status(400).json({ error: 'Missing apiKey or endpoint' });
    }

    const url = new URL(`https://api.membit.ai/v1${endpoint}`);
    Object.entries(params || {}).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    console.log(`[Vercel Proxy] ${req.method} ${url.toString()}`);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Membit-Api-Key': apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Vercel Proxy] Error ${response.status}:`, errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    console.log(`[Vercel Proxy] Success: Got response`);
    res.status(200).json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Vercel Proxy] Error:', errorMessage);
    res.status(500).json({ error: errorMessage });
  }
}
