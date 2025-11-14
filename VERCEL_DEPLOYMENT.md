# Vercel Deployment Guide

## C?u tr?c sau khi ?p d?ng Option 1

```
project/
„¥„Ÿ„Ÿ api/
„    „¤„Ÿ„Ÿ proxy.js          # Vercel Serverless Function
„¥„Ÿ„Ÿ src/
„    „¤„Ÿ„Ÿ context/
„        „¤„Ÿ„Ÿ MembitContext.tsx  # ?? s?a ?? d?ng proxy ??ng
„¥„Ÿ„Ÿ vercel.json           # C?u h?nh Vercel
„¤„Ÿ„Ÿ package.json          # ?? th?m @vercel/node
```

## C?ch ho?t ??ng

### Local Development (localhost)
- Code s? g?i request ??n `http://localhost:3001/api/proxy`
- Ch?y proxy server c? v?i: `npm run proxy`
- Ho?c: `npm run dev:full` (ch?y c? vite v? proxy)

### Production (Vercel)
- Code s? g?i request ??n `/api/proxy`
- Vercel t? ??ng deploy `api/proxy.js` nh? serverless function
- Kh?ng c?n ch?y proxy server ri?ng

## Ch?y locally

### Option A: D?ng proxy server c? (nh? b?y gi?)
```bash
npm install
npm run dev:full
```
C?a s? 1:
```bash
npm run dev
```
C?a s? 2:
```bash
npm run proxy
```

### Option B: Ho?c ch? ch?y vite (kh?ng c?n proxy n?u API cho ph?p CORS)
```bash
npm run dev
```

## Deploy l?n Vercel

### Method 1: D?ng Vercel CLI
```bash
npm install -g vercel
vercel
```

### Method 2: D?ng GitHub (Recommended)
1. Push code l?n GitHub
2. V?o https://vercel.com
3. Import GitHub repository
4. T? ??ng deploy khi push

## Ki?m tra Deployment

Sau khi deploy, m? DevTools (F12) v? ki?m tra:

```javascript
// Trong console
fetch('/api/proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    endpoint: '/clusters/search',
    params: { q: 'test', limit: 5 },
    apiKey: 'your-api-key'
  })
}).then(r => r.json()).then(console.log)
```

## Troubleshooting

### Local: Proxy kh?ng k?t n?i
```bash
npm run proxy
# Ho?c ch?y dev:full
npm run dev:full
```

### Vercel: API Error
- Ki?m tra API Key c? h?p l? kh?ng
- Ki?m tra Membit API endpoint c? ??ng kh?ng
- Xem logs: `vercel logs`

### CORS Error
- Vercel proxy.js ?? set CORS headers
- N?u v?n l?i, ki?m tra `/api/proxy` endpoint

## C?p nh?t sau n?y

N?u mu?n s?a proxy logic:

**Local**: S?a `proxy-server.js`
**Vercel**: S?a `api/proxy.js`

Sau ?? push l?n GitHub, Vercel t? ??ng redeploy.

## L?i ?ch

? Ch?y b?nh th??ng local
? Deploy l?n Vercel m? kh?ng c?n s?a code
? T? ??ng CORS handling
? B?o m?t API key (ke trong backend)
? Free tier Vercel ?? d?ng
