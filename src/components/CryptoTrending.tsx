import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useMembit } from '../context/useMembit';
import { Loader, AlertCircle, Newspaper, FolderOpen, MessageCircle, SearchCheck, Repeat, Heart } from 'lucide-react';
import '../styles/CryptoTrending.css';

interface CryptoPriceData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap?: number;
  volume24h?: number;
}

interface CryptoTrendingProps {
  tabKey?: string;
}

const CRYPTO_COINS = ['BTC', 'ETH', 'BNB', 'SOL', 'BAND'];

const COINGECKO_COIN_MAP: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BNB: 'binancecoin',
  SOL: 'solana',
  BAND: 'band-protocol',
};

const CryptoTrending: React.FC<CryptoTrendingProps> = () => {
  const { isLoading, error, clusterSearch, clusterInfo } = useMembit();
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [prices, setPrices] = useState<Record<string, CryptoPriceData>>({});
  const [results, setResults] = useState<any>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<any>(null);
  const [clusterDetailLoading, setClusterDetailLoading] = useState(false);
  const [pricesLoading, setPricesLoading] = useState(true);
  const [tooltipData, setTooltipData] = useState<{ x: number; y: number; price: string; date: string } | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Fetch real-time crypto prices from CoinGecko
  useEffect(() => {
    const fetchPrices = async () => {
      setPricesLoading(true);
      try {
        const coinIds = CRYPTO_COINS.map(symbol => COINGECKO_COIN_MAP[symbol]).join(',');
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`
        );
        const data = await response.json();

        const priceData: Record<string, CryptoPriceData> = {};
        CRYPTO_COINS.forEach((symbol) => {
          const coinId = COINGECKO_COIN_MAP[symbol];
          const coinData = data[coinId];
          if (coinData) {
            priceData[symbol] = {
              symbol,
              name: symbol,
              price: coinData.usd || 0,
              change24h: coinData.usd_24h_change || 0,
              marketCap: coinData.usd_market_cap,
              volume24h: coinData.usd_24h_vol,
            };
          }
        });

        setPrices(priceData);
      } catch {
        setLocalError('Failed to fetch crypto prices');
      } finally {
        setPricesLoading(false);
      }
    };

    fetchPrices();

    // Refresh prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch chart data from CoinGecko
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const fetchChartData = async () => {
      setLocalError(null);
      try {
        const coinId = COINGECKO_COIN_MAP[selectedCoin];
        console.log('Fetching chart data for:', selectedCoin, coinId);
        
        // Fetch 7-day price history
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
        );
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const prices = data.prices || [];
        console.log('Price data received, points:', prices.length);
        
        if (!prices || prices.length === 0) {
          throw new Error('No price data available');
        }

        // Create simple chart using SVG and Canvas
        if (!chartContainerRef.current) {
          throw new Error('Chart container not ready');
        }
        
        // Clear previous content
        chartContainerRef.current.innerHTML = '';
        
        const prices_only = prices.map((p: any[]) => p[1]);
        const minPrice = Math.min(...prices_only);
        const maxPrice = Math.max(...prices_only);
        const priceRange = maxPrice - minPrice || 1;
        
        // Create SVG chart
        const svgWidth = chartContainerRef.current.clientWidth || 800;
        const svgHeight = 400;
        const padding = 40;
        const chartWidth = svgWidth - 2 * padding;
        const chartHeight = svgHeight - 2 * padding;
        
        // Build SVG
        const points = prices.map((p: any[], idx: number) => {
          const x = padding + (idx / (prices.length - 1)) * chartWidth;
          const y = svgHeight - padding - ((p[1] - minPrice) / priceRange) * chartHeight;
          return `${x},${y}`;
        }).join(' ');
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('style', 'display: block; background: transparent;');
        
        // Add grid lines and chart
        const gridSvg = `
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#2563eb;stop-opacity:0.3" />
              <stop offset="100%" style="stop-color:#2563eb;stop-opacity:0" />
            </linearGradient>
          </defs>
          
          <!-- Grid -->
          <g stroke="rgba(148, 163, 184, 0.2)" stroke-width="1">
            <line x1="${padding}" y1="${svgHeight - padding}" x2="${svgWidth - padding}" y2="${svgHeight - padding}" />
            <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${svgHeight - padding}" />
          </g>
          
          <!-- Area chart -->
          <polygon points="${padding},${svgHeight - padding} ${points} ${svgWidth - padding},${svgHeight - padding}" 
                   fill="url(#chartGradient)" opacity="0.5" />
          
          <!-- Line chart -->
          <polyline points="${points}" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          
          <!-- Interactive hover areas (invisible circles) -->
          ${prices.map((p: any[], idx: number) => {
            const x = padding + (idx / (prices.length - 1)) * chartWidth;
            const y = svgHeight - padding - ((p[1] - minPrice) / priceRange) * chartHeight;
            return `<circle cx="${x}" cy="${y}" r="8" fill="transparent" class="hover-point" data-idx="${idx}" style="cursor: pointer;" />`;
          }).join('')}
          
          <!-- Data points -->
          <g fill="#2563eb" r="3">
            ${prices.map((p: any[], idx: number) => {
              const x = padding + (idx / (prices.length - 1)) * chartWidth;
              const y = svgHeight - padding - ((p[1] - minPrice) / priceRange) * chartHeight;
              return `<circle cx="${x}" cy="${y}" r="2" fill="#2563eb" opacity="0.6" />`;
            }).join('')}
          </g>
          
          <!-- Price labels (only show some to avoid clutter) -->
          <g font-size="12" fill="#94a3b8" text-anchor="middle">
            ${prices.map((p: any[], idx: number) => {
              // Show every 10th point or first/last
              if (idx % 10 === 0 || idx === prices.length - 1) {
                const x = padding + (idx / (prices.length - 1)) * chartWidth;
                const y = svgHeight - padding + 20;
                const dateObj = new Date(p[0]);
                const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return `<text x="${x}" y="${y}">${label}</text>`;
              }
              return '';
            }).join('')}
          </g>
        `;
        
        svg.innerHTML = gridSvg;
        svgRef.current = svg;
        chartContainerRef.current.appendChild(svg);
        
        // Add hover event listeners
        const hoverPoints = svg.querySelectorAll('.hover-point');
        hoverPoints.forEach((point) => {
          point.addEventListener('mouseenter', (e: any) => {
            const idx = parseInt(e.target.getAttribute('data-idx'));
            const pricePoint = prices[idx];
            const x = padding + (idx / (prices.length - 1)) * chartWidth;
            const y = svgHeight - padding - ((pricePoint[1] - minPrice) / priceRange) * chartHeight;
            
            setTooltipData({
              x: x,
              y: y,
              price: `$${pricePoint[1].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              date: new Date(pricePoint[0]).toLocaleString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })
            });
          });
          
          point.addEventListener('mouseleave', () => {
            setTooltipData(null);
          });
        });
        
        console.log('SVG chart rendered successfully with hover tooltips');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error fetching chart data';
        console.error('Chart data fetch error:', errorMsg);
        setLocalError(`Chart error: ${errorMsg}`);
      }
    };

    fetchChartData();

    return () => {
      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch (e) {
          console.warn('Error removing chart:', e);
        }
        chartRef.current = null;
      }
    };
  }, [selectedCoin]);

  const fetchClusterResults = useCallback(async (coin: string) => {
    setLocalError(null);
    setResults(null);
    setSelectedCluster(null);

    // Create dynamic query with the current coin name
    const coinName = coin === 'BTC' ? 'Bitcoin' : 
                     coin === 'ETH' ? 'Ethereum' : 
                     coin === 'BNB' ? 'Binance Coin' :
                     coin === 'SOL' ? 'Solana' :
                     coin === 'BAND' ? 'Band Protocol' : coin;

    const query = `Search and summarize the most recently updated information about ${coinName} (${coin})`;

    try {
      const data = await clusterSearch(query, 10);
      console.log(query);
      setResults(data);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Search error');
    }
  }, [clusterSearch]);

  // Fetch cluster results when coin is selected
  useEffect(() => {
    if (selectedCoin) {
      fetchClusterResults(selectedCoin);
    }
  }, [selectedCoin, fetchClusterResults]);

  const handleClusterClick = async (clusterLabel: string) => {
    try {
      setClusterDetailLoading(true);
      const clusterDetail = await clusterInfo(clusterLabel, 10);
      setSelectedCluster(clusterDetail);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Error loading cluster details');
      setSelectedCluster(null);
    } finally {
      setClusterDetailLoading(false);
    }
  };

  const selectedPrice = prices[selectedCoin];

  return (
    <div className="crypto-trending">
      <div className="crypto-header">
        <h2>Crypto Trending</h2>
      </div>

      {/* Crypto Prices Bar */}
      <div className="crypto-prices-bar">
        {pricesLoading ? (
          <div className="prices-loading">
            <Loader className="spinner" size={18} />
            <span>Loading prices...</span>
          </div>
        ) : (
          <div className="prices-container">
            {CRYPTO_COINS.map((coin) => {
              const priceData = prices[coin];
              if (!priceData) return null;
              
              const isPositive = priceData.change24h >= 0;
              const isSelected = selectedCoin === coin;

              return (
                <div
                  key={coin}
                  className={`price-card ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedCoin(coin)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {if (e.key === 'Enter') setSelectedCoin(coin);}}
                >
                  <div className="price-symbol">{coin}</div>
                  <div className="price-value">${priceData.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? '+' : ''}{priceData.change24h.toFixed(2)}%
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Coin Details */}
      {selectedPrice && (
        <div className="coin-details-bar">
          <div className="coin-detail-item">
            <span className="detail-label">Market Cap:</span>
            <span className="detail-value">
              {selectedPrice.marketCap 
                ? `$${(selectedPrice.marketCap / 1e9).toFixed(2)}B` 
                : 'N/A'}
            </span>
          </div>
          <div className="coin-detail-item">
            <span className="detail-label">24h Volume:</span>
            <span className="detail-value">
              {selectedPrice.volume24h 
                ? `$${(selectedPrice.volume24h / 1e6).toFixed(2)}M` 
                : 'N/A'}
            </span>
          </div>
          <div className="coin-detail-item">
            <span className="detail-label">24h Change:</span>
            <span className={`detail-value ${selectedPrice.change24h >= 0 ? 'positive' : 'negative'}`}>
              {selectedPrice.change24h >= 0 ? '+' : ''}{selectedPrice.change24h.toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {(error || localError) && (
        <div className="error-container">
          <AlertCircle size={18} />
          <span>{error || localError}</span>
        </div>
      )}

      {/* Chart */}
      <div className="crypto-chart-container">
        <div ref={chartContainerRef} className="chart-placeholder" />
        
        {/* Tooltip */}
        {tooltipData && (
          <div 
            className="chart-tooltip" 
            style={{
              position: 'absolute',
              left: `${tooltipData.x}px`,
              top: `${tooltipData.y - 60}px`,
              pointerEvents: 'none',
            }}
          >
            <div className="tooltip-content">
              <div className="tooltip-price">{tooltipData.price}</div>
              <div className="tooltip-date">{tooltipData.date}</div>
            </div>
            <div className="tooltip-arrow" />
          </div>
        )}
      </div>

      {/* Cluster Results */}
      {results && (
        <div className="results-container">
          <div className="results-header">
            <h3>Related Clusters for {selectedCoin}</h3>
            <span className="result-count">
              {Array.isArray(results) 
                ? results.length 
                : results.clusters?.length || 0} results
            </span>
          </div>
          <div className="results-content">
            {renderClusterResults(results, handleClusterClick)}
          </div>
        </div>
      )}

      {isLoading && !results && (
        <div className="loading-container">
          <Loader className="spinner" size={24} />
          <p>Loading clusters for {selectedCoin}...</p>
        </div>
      )}

      {!results && !localError && !isLoading && (
        <div className="empty-state">
          <p>Loading cluster data for {selectedCoin}...</p>
        </div>
      )}

      {/* Cluster Detail Modal */}
      {selectedCluster && (
        <div className="modal-overlay" onClick={() => setSelectedCluster(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <Newspaper size={20} className="modal-header-icon" />
                <h3>{selectedCluster.label || 'Cluster Details'}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedCluster(null)} title="Close">
                x
              </button>
            </div>

            {clusterDetailLoading ? (
              <div className="modal-loading">
                <Loader className="spinner" size={24} />
                <p>Loading cluster details...</p>
              </div>
            ) : (
              <div className="modal-body">
                {selectedCluster.category && (
                  <div className="modal-section">
                    <span className="modal-label">CATEGORY: {selectedCluster.category}</span>
                  </div>
                )}

                {selectedCluster.summary && (
                  <div className="modal-section">
                    <span className="modal-label">SUNMMARY: {selectedCluster.summary}</span>
                  </div>
                )}

                {selectedCluster.engagement_score !== undefined && (
                  <div className="modal-section">
                    <span className="modal-label">ENGAGEMENT SCORE: {Math.round(selectedCluster.engagement_score)}</span>
                  </div>
                )}

                {selectedCluster.posts && selectedCluster.posts.length > 0 && (
                  <div className="modal-section">
                    <h4 className="modal-posts-title">Related Posts ({selectedCluster.posts.length})</h4>
                    <div className="modal-posts-list">
                      {selectedCluster.posts.map((post: any, idx: number) => (
                        <div key={idx} className="modal-post-item">
                          {post.author && (
                            <div className="modal-post-author">
                              {post.author.profile_image && (
                                <img
                                  src={post.author.profile_image}
                                  alt={post.author.handle}
                                  className="modal-post-avatar"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              )}
                              <div>
                                <div className="modal-post-name">{post.author.name}</div>
                                <div className="modal-post-handle">{post.author.handle}</div>
                              </div>
                            </div>
                          )}

                          {post.content && <p className="modal-post-content">{post.content}</p>}

                          {post.timestamp && (
                            <span className="modal-post-time">
                              {new Date(post.timestamp).toLocaleString()}
                            </span>
                          )}

                          {post.engagement && (
                            <div className="modal-post-engagement">
                              <span className="stat-badge"><MessageCircle size={15} color='#f2991c' /> {post.engagement.replies}</span>
                              <span className="stat-badge"><Repeat size={15} /> {post.engagement.retweets}</span>
                              <span className="stat-badge"><Heart color="#b40e5e" size={15} /> {post.engagement.likes}</span>
                            </div>
                          )}

                          {post.url && (
                            <a href={post.url} target="_blank" rel="noopener noreferrer" className="modal-post-link">
                              View details
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function renderClusterResults(data: any, onClusterClick: (label: string) => void) {
  let clusters: any[] = [];

  if (Array.isArray(data)) {
    clusters = data;
  } else if (data.clusters) {
    clusters = data.clusters;
  }

  if (clusters.length === 0) {
    return <div className="no-results">No clusters found</div>;
  }

  return (
    <div className="results-list">
      {clusters.map((cluster: any, idx: number) => (
        <div
          key={idx}
          className="result-item cluster-result clickable-cluster"
          onClick={() => onClusterClick(cluster.label)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') onClusterClick(cluster.label);}}
        >
          <div className="cluster-icon"><Newspaper size={24} strokeWidth={1.5} /></div>
          <div className="cluster-content">
            {cluster.label && <h4 className="cluster-label">{cluster.label}</h4>}
            {cluster.summary && <p className="cluster-summary">{cluster.summary}</p>}
            {cluster.category && (
              <span className="cluster-category"><FolderOpen size={14} />{cluster.category}</span>
            )}
            <div className="cluster-scores">
              {cluster.engagement_score !== undefined && (
                <span className="score-item"><MessageCircle size={14} />Engagement: <strong>{Math.round(cluster.engagement_score)}</strong></span>
              )}
              {cluster.search_score !== undefined && (
                <span className="score-item"><SearchCheck size={14} />Search: <strong>{(cluster.search_score * 100).toFixed(1)}%</strong></span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CryptoTrending;
