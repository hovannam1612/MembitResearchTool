# Membit Research Tool

A compact research tool using Membit AI API to discover the latest information from Membit's APIs and cryptocurrency market data. The application is built with React and TypeScript featuring a modern and user-friendly interface.

## Features

Three Main Tabs:
- **Cluster Search** - Search for related clusters and topics using Membit API
- **Post Search** - Search for specific posts and articles from Membit network
- **Crypto Trending** - View live cryptocurrency prices with 7-day price charts

Additional Features:
- Secure login with API Key authentication
- Temporary API Key storage in session
- Easy logout functionality
- Modern Dark Mode design (membit.ai style)
- Responsive Design - works on all devices
- Gradient colors with Blue and Purple theme
- Smooth animations and transitions
- Real-time cryptocurrency price updates (30-second intervals)

## Installation and Running

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- API Key from https://membit.ai

### Install Dependencies
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```

### Run Proxy Server
```bash
npm run proxy
```

Application will run at http://localhost:5173/

### Build for Production
```bash
npm run build
```

Output will be in the dist folder

## Usage Guide

### 1. Login
- Open the application
- Enter your API Key from https://membit.ai
- Click Sign In
- System will validate the API Key by testing a small query

### 2. Cluster Search Tab
- Enter a keyword (example: "artificial intelligence")
- Adjust the number of results (1-100)
- Click Search to see related clusters
- View cluster information in JSON format
- Copy results for external use

### 3. Post Search Tab
- Enter keyword to search posts
- Adjust result limit (1-100)
- Click Search to see related posts
- View post details and metadata
- Export results as needed

### 4. Crypto Trending Tab
- View live cryptocurrency prices for: BTC, ETH, BNB, SOL, BAND
- See 7-day price chart with interactive visualization
- Hover over chart points to view price and date
- Click on coins to view related market clusters
- Access detailed cluster information for each cryptocurrency
- Prices update automatically every 30 seconds


## Technologies and Libraries

### Frontend Framework
- **React 18** - Modern UI library with Hooks
- **TypeScript** - Static type checking and type safety
- **Vite** - Fast build tool and development server
- **CSS3** - Modern styling with CSS Grid and Flexbox

### Core Libraries and APIs
- **@bandprotocol/membit** - Membit AI SDK for cluster and post search
  - Documentation: https://github.com/bandprotocol/membit-js
  - API Reference: https://docs.membit.ai
  
### UI and Icons
- **lucide-react** - Modern icon library for UI components
  - Package: https://lucide.dev
  - Icons used: Search, LogOut, TrendingUp, etc.

### Data Fetching and Crypto Data
- **Native Fetch API** - For cryptocurrency price data
- **Chart.js** (or Recharts) - For 7-day price charts
- **Cryptocurrency APIs** - Live price data for BTC, ETH, BNB, SOL, BAND

### Cryptocurrency Price API
Fetches live price data for trending cryptocurrencies


## Security

- API Key is validated before storage in application
- API Key temporarily stored in React Context state
- Support for localStorage available (disabled by default for security)
- Logout clears all sensitive data from memory
- No persistent storage of credentials between sessions
- All API calls use official Membit SDK
- HTTPS required for production deployment

## Browser Support

- Chrome and Chromium browsers (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari and Chrome Mobile)

## Future Improvements

- Export results to CSV or JSON format
- Bookmarks and Favorites system for saved searches
- Search history tracking
- Advanced filters for better search results
- Dark and Light theme toggle
- Multi-language support (internationalization)
- PWA support for offline capability
- More cryptocurrencies in trending tab
- Advanced charting options

## Support and Documentation

For more information about Membit API and SDK:
- Membit Docs: https://docs.membit.ai
- Membit SDK GitHub: https://github.com/bandprotocol/membit-js
- Membit Website: https://membit.ai

For React and TypeScript documentation:
- React Official: https://react.dev
- TypeScript Docs: https://www.typescriptlang.org/docs
- Vite Docs: https://vite.dev

---

Created by hvn_bit
Last Updated: November 2025

## Try now: https://membit-ai-trending.vercel.app/
