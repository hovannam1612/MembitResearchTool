# Membit Research Tool

A compact research tool using Membit AI SDK to discover the latest information from Membit's APIs and cryptocurrency market data. The application is built with React and TypeScript featuring a modern and user-friendly interface.

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

## Project Structure

```
src/
„¥„Ÿ„Ÿ components/
„    „¥„Ÿ„Ÿ Login.tsx              # Login component with API key input
„    „¥„Ÿ„Ÿ Header.tsx             # Header with title and logout button
„    „¥„Ÿ„Ÿ TabNavigation.tsx      # Tab navigation for 3 main tabs
„    „¥„Ÿ„Ÿ SearchTab.tsx          # Cluster Search component
„    „¥„Ÿ„Ÿ CryptoTrending.tsx     # Crypto Trending component with chart
„    „¤„Ÿ„Ÿ Footer.tsx             # Footer with links
„¥„Ÿ„Ÿ context/
„    „¥„Ÿ„Ÿ MembitContext.tsx      # Membit Context API for state management
„    „¤„Ÿ„Ÿ useMembit.ts           # Custom React hook for Membit operations
„¥„Ÿ„Ÿ styles/
„    „¥„Ÿ„Ÿ index.css              # Global styles and CSS variables
„    „¥„Ÿ„Ÿ Login.css              # Login page styles
„    „¥„Ÿ„Ÿ Header.css             # Header styles
„    „¥„Ÿ„Ÿ TabNav.css             # Tab navigation styles
„    „¥„Ÿ„Ÿ SearchTab.css          # Search tab styles
„    „¥„Ÿ„Ÿ CryptoTrending.css     # Crypto trending styles with charts
„    „¥„Ÿ„Ÿ Footer.css             # Footer styles
„    „¥„Ÿ„Ÿ App.css                # App layout styles
„    „¤„Ÿ„Ÿ index.css              # Index page styles
„¥„Ÿ„Ÿ types/
„    „¤„Ÿ„Ÿ index.ts               # TypeScript interfaces and types
„¥„Ÿ„Ÿ App.tsx                    # Main App component
„¤„Ÿ„Ÿ main.tsx                   # React entry point
```

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

### Development Tools
- **ESLint** - Code linting and quality checking
- **TypeScript Compiler** - Type checking and compilation
- **npm** - Package management and scripts

## Color Scheme and Design

- Primary Color: number 2563eb (Blue)
- Secondary Color: number 7c3aed (Purple)
- Dark Background: number 0f172a
- Card Background: number 1e293b
- Gradient: Blue to Purple

The interface is designed to match membit.ai branding with a modern dark mode and subtle gradients for a professional research tool appearance.

## API Integration

### Membit Cluster Search API
Searches for related clusters by keyword using Membit SDK
```typescript
const clusters = await client.cluster_search("query", {
  limit: 10,
  format: "json"
});
```
Reference: https://docs.membit.ai/cluster-search

### Membit Post Search API
Searches for posts and articles in the Membit network
```typescript
const posts = await client.post_search("query", {
  limit: 10
});
```
Reference: https://docs.membit.ai/post-search

### Cryptocurrency Price API
Fetches live price data for trending cryptocurrencies
```typescript
// Fetches prices for: BTC, ETH, BNB, SOL, BAND
// Updates every 30 seconds
// Returns: current price, 7-day historical data for charting
```

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

## License

MIT

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
