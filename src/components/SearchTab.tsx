import React, { useState, useEffect } from 'react';
import { useMembit } from '../context/useMembit';
import { Loader, AlertCircle, Newspaper, FolderOpen, MessageCircle, Dice1, FileText, User, SearchCheck, ThumbsUp, Repeat, Twitter, Zap, Repeat2, MessageSquare, Heart, X } from 'lucide-react';
import '../styles/SearchTab.css';

interface SearchTabProps {
  title: string;
  placeholder: string;
  onSearch: (query: string, limit: number) => Promise<any>;
  tabKey?: string; // Key to detect tab changes
  defaultLimit?: number; // Default limit for this tab
}

const SearchTab: React.FC<SearchTabProps> = ({ title, placeholder, onSearch, tabKey, defaultLimit = 5 }) => {
  const { isLoading, error, clusterInfo } = useMembit();
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(defaultLimit);
  const [results, setResults] = useState<any>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<any>(null);
  const [clusterDetailLoading, setClusterDetailLoading] = useState(false);

  // Reset state when tab changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setQuery('');
    setLimit(defaultLimit);
    setResults(null);
    setLocalError(null);
    setSelectedCluster(null);
  }, [tabKey, defaultLimit]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setResults(null);

    if (!query.trim()) {
      setLocalError('Please enter a search keyword');
      return;
    }

    try {
      const data = await onSearch(query, limit);
      setResults(data);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Search error');
    }
  };

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

  return (
    <div className="search-tab">
      <div className="search-header">
        <h2>{title}</h2>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="form-row">
          <div className="form-group flex-1">
            <label htmlFor="search-input" className="form-label">Keyword</label>
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="search-input"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="limit-select" className="form-label">Limit Results</label>
            <select
              id="limit-select"
              value={limit.toString()}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="limit-select"
              disabled={isLoading}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
          <button
            type="submit"
            className="search-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="spinner" size={18} />
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>

      {(error || localError) && (
        <div className="error-container">
          <AlertCircle size={18} />
          <span>{error || localError}</span>
        </div>
      )}

      {results && (
        <div className="results-container">
          <div className="results-header">
            <h3>Search Results</h3>
            <span className="result-count">
              {Array.isArray(results) 
                ? results.length 
                : results.clusters?.length || results.posts?.length || 0} results
            </span>
          </div>

          <div className="results-content">
            {renderResults(results, tabKey, handleClusterClick)}
          </div>
        </div>
      )}

      {!results && !localError && !isLoading && (
        <div className="empty-state">
          <p>Enter a keyword and click search to begin</p>
        </div>
      )}

      {/* Cluster Detail Modal */}
      {selectedCluster && (
        <div className="modal-overlay" onClick={() => setSelectedCluster(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Cluster Details</h3>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedCluster(null)}
                title="Close"
              >
                <X></X>
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
                    <span className="modal-label">Category: {selectedCluster.category}</span>
                  </div>
                )}

                {selectedCluster.summary && (
                  <div className="modal-section">
                    <span className="modal-label">Summary:</span>
                    <p className="modal-summary">{selectedCluster.summary}</p>
                  </div>
                )}

                {selectedCluster.engagement_score !== undefined && (
                  <div className="modal-section">
                    <span className="modal-label">Engagement Score: {Math.round(selectedCluster.engagement_score)}</span>
                  </div>
                )}
                <hr />
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
                            <a
                              href={post.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="modal-post-link"
                            >
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderResults(data: any, tabKey?: string, onClusterClick?: (label: string) => void) {
  // Handle Post Search - show in grid layout (4 posts per row)
  if (tabKey === 'post-search' && data.posts) {
    return (
      <div className="posts-grid">
        {data.posts.map((post: any, idx: number) => (
          <div key={idx} className="post-grid-card">
            {/* Author Section */}
            {post.author && (
              <div className="post-author-section">
                {post.author.profile_image && (
                  <img
                    src={post.author.profile_image}
                    alt={post.author.handle}
                    className="post-avatar-grid"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div className="post-author-info-grid">
                  <div className="post-author-name-grid">{post.author.name}</div>
                  <div className="post-author-handle-grid">{post.author.handle}</div>
                </div>
              </div>
            )}

            {/* Post Content */}
            {post.content && <p className="post-text-grid">{post.content}</p>}

            {/* Timestamp */}
            {post.timestamp && (
              <div className="post-timestamp-grid">
                {new Date(post.timestamp).toLocaleString()}
              </div>
            )}

            {/* Engagement and Scores */}
            <div className="post-stats-grid">
              {post.engagement && (
                <>
                  <span className="stat-badge">
                    <MessageCircle size={15} color='#f2991c' />
                    {post.engagement.replies}
                  </span>
                  <span className="stat-badge">
                    <Repeat size={15} />
                    {post.engagement.retweets}
                  </span>
                  <span className="stat-badge">
                    <Heart color="#b40e5e" size={15} />
                    {post.engagement.likes}
                  </span>
                </>
              )}
              {post.engagement_score !== undefined && (
                <span className="engagement-badge">
                  Score: {post.engagement_score.toFixed(2)}
                </span>
              )}
              {post.search_score !== undefined && (
                <span className="search-badge">
                  <Zap size={15} />
                  Relevance: {(post.search_score * 100).toFixed(1)}%
                </span>
              )}
            </div>

            {/* Action Buttons */}
            {post.url && (
              <div className="post-actions-grid">
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-link-grid"
                >
                  <FileText size={14} />
                  View
                </a>
                <button
                  onClick={() => shareToTwitter(post)}
                  className="action-button-grid"
                  title="Retweet on X"
                >
                  <Repeat2 size={14} />
                  Retweet
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
  if (Array.isArray(data)) {
    return (
      <div className="results-list">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="result-item cluster-result clickable-cluster"
            onClick={() => onClusterClick?.(item.label)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onClusterClick?.(item.label);
              }
            }}
          >
            <div className="cluster-icon">
              <Newspaper size={24} strokeWidth={1.5} />
            </div>
            <div className="cluster-content">
              {item.label && <h4 className="cluster-label">{item.label}</h4>}
              {item.summary && <p className="cluster-summary">{item.summary}</p>}
              {item.category && (
                <span className="cluster-category">
                  <FolderOpen size={14} />
                  {item.category}
                </span>
              )}
              <div className="cluster-scores">
                {item.engagement_score !== undefined && (
                  <span className="score-item">
                    <MessageCircle size={14} />
                    Engagement: <strong>{Math.round(item.engagement_score)}</strong>
                  </span>
                )}
                {item.search_score !== undefined && (
                  <span className="score-item">
                    <Dice1 size={14} />
                    Search: <strong>{(item.search_score * 100).toFixed(1)}%</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (data.clusters) {
    return (
      <div className="results-list">
        {data.clusters.map((cluster: any, idx: number) => (
          <div
            key={idx}
            className="result-item cluster-result clickable-cluster"
            onClick={() => onClusterClick?.(cluster.label)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onClusterClick?.(cluster.label);
              }
            }}
          >
            <div className="cluster-icon">
              <Newspaper size={24} strokeWidth={1.5} />
            </div>
            <div className="cluster-content">
              {cluster.label && <h4 className="cluster-label">{cluster.label}</h4>}
              {cluster.summary && <p className="cluster-summary">{cluster.summary}</p>}
              {cluster.category && (
                <span className="cluster-category">
                  <FolderOpen size={14} />
                  {cluster.category}
                </span>
              )}
              <div className="cluster-scores">
                {cluster.engagement_score !== undefined && (
                  <span className="score-item">
                    <MessageCircle size={14} />
                    Engagement: <strong>{Math.round(cluster.engagement_score)}</strong>
                  </span>
                )}
                {cluster.search_score !== undefined && (
                  <span className="score-item">
                    <SearchCheck size={14} />
                    Search: <strong>{(cluster.search_score * 100).toFixed(1)}%</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Handle Cluster Info format with posts array
  if (data.posts && Array.isArray(data.posts)) {
    return (
      <div className="cluster-info-container">
        <div className="cluster-info-header">
          {data.category && (
            <span className="cluster-category-badge">
              <FolderOpen size={16} />
              {data.category}
            </span>
          )}
          {data.summary && <p className="cluster-info-summary">{data.summary}</p>}
          {data.engagement_score !== undefined && (
            <div className="cluster-info-score">
              <MessageCircle size={16} />
              Engagement Score: <strong>{Math.round(data.engagement_score)}</strong>
            </div>
          )}
        </div>

        <div className="posts-list">
          <h4 className="posts-title">Related Posts ({data.posts.length})</h4>
          {data.posts.map((post: any, idx: number) => (
            <div key={idx} className="post-card">
              {/* Post Author */}
              {post.author && (
                <div className="post-author">
                  {post.author.profile_image && (
                    <img
                      src={post.author.profile_image}
                      alt={post.author.handle}
                      className="post-avatar"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="post-author-info">
                    <div className="post-author-name">{post.author.name}</div>
                    <div className="post-author-handle">{post.author.handle}</div>
                  </div>
                </div>
              )}

              {/* Post Content */}
              {post.content && <p className="post-text">{post.content}</p>}

              {/* Mentioned Post */}
              {post.mentioned && (
                <div className="mentioned-post">
                  <div className="mentioned-header">
                    Replying to:
                  </div>
                  {post.mentioned.author && (
                    <div className="mentioned-author">
                      <strong>{post.mentioned.author.name}</strong>
                      <span className="mentioned-handle"> {post.mentioned.author.handle}</span>
                    </div>
                  )}
                  {post.mentioned.content && (
                    <p className="mentioned-text">{post.mentioned.content}</p>
                  )}
                  {post.mentioned.timestamp && (
                    <span className="mentioned-time">
                      {new Date(post.mentioned.timestamp).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}

              {/* Post Engagement */}
              {post.engagement && (
                <div className="post-engagement">
                  <span className="engagement-stat">
                    <MessageSquare size={14} />
                    {post.engagement.replies}
                  </span>
                  <span className="engagement-stat">
                    <Repeat size={14} />
                    {post.engagement.retweets}
                  </span>
                  <span className="engagement-stat">
                    <ThumbsUp size={14} />
                    {post.engagement.likes}
                  </span>
                  {post.engagement_score !== undefined && (
                    <span className="engagement-score">
                      Score: {(post.engagement_score).toFixed(2)}
                    </span>
                  )}
                </div>
              )}

              {/* Post Timestamp */}
              {post.timestamp && (
                <span className="post-timestamp">
                  {new Date(post.timestamp).toLocaleDateString()}
                </span>
              )}

              {/* Action Buttons */}
              <div className="post-actions">
                {post.url && (
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="post-action-btn view-btn"
                    title="View on X"
                  >
                    <FileText size={16} />
                    View
                  </a>
                )}
                {post.url && (
                  <button
                    onClick={() => shareToTwitter(post)}
                    className="post-action-btn share-btn"
                    title="Share on X"
                  >
                    <Twitter size={16} />
                    Share
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.posts) {
    return (
      <div className="results-list">
        {data.posts.map((post: any, idx: number) => (
          <div key={idx} className="result-item post-result">
            <div className="post-icon">
              <FileText size={22} strokeWidth={1.5} />
            </div>
            <div className="post-content">
              {post.title && <h4 className="post-title">{post.title}</h4>}
              {post.content && <p className="post-content-text">{post.content}</p>}
              {post.author && (
                <span className="post-meta">
                  <User size={12} />
                  By {post.author}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="result-item">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

// Helper function to share post to Twitter
function shareToTwitter(post: any) {
  const text = post.content ? `"${post.content.substring(0, 100)}..." - via Membit AI` : 'Check this out via Membit AI';
  const url = post.url;
  const twitterShareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(twitterShareUrl, '_blank', 'width=550,height=420');
}

export default SearchTab;
