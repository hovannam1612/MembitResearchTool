import React, { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface MembitContextType {
  apiKey: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (key: string) => Promise<void>;
  logout: () => void;
  clusterSearch: (query: string, limit?: number) => Promise<any>;
  clusterInfo: (clusterName: string, limit?: number) => Promise<any>;
  postSearch: (query: string, limit?: number) => Promise<any>;
}

const MembitContext = createContext<MembitContextType | undefined>(undefined);

export { MembitContext };

// Helper function to determine proxy URL based on environment
const getProxyUrl = () => {
  if (typeof window === 'undefined') {
    return '/api/proxy';
  }

  // Local development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/api/proxy';
  }

  // Production (Vercel or other)
  return '/api/proxy';
};

// Helper function to call through proxy server
const callProxyAPI = async (endpoint: string, params: Record<string, any>, apiKey: string) => {
  const proxyUrl = getProxyUrl();
  
  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint,
        params,
        apiKey,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocalhost) {
        throw new Error('Proxy server not running. Please start: npm run proxy');
      } else {
        throw new Error('Unable to connect to API. Please check your connection.');
      }
    }
    throw error;
  }
};

export const MembitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string | null>(() => {
    return localStorage.getItem('membit_api_key');
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (key: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!key || key.trim() === '') {
        throw new Error('API key cannot be empty');
      }

      // Store immediately - actual validation happens on first API call
      setApiKey(key);
      localStorage.setItem('membit_api_key', key);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setApiKey(null);
    setError(null);
    localStorage.removeItem('membit_api_key');
  }, []);

  const clusterSearch = useCallback(async (query: string, limit = 10) => {
    if (!apiKey) throw new Error('Please login first');
    
    try {
      setIsLoading(true);
      setError(null);
      
      if (!query || query.trim() === '') {
        throw new Error('Search query cannot be empty');
      }
      
      console.log('Cluster Search:', { query, limit, apiKey: apiKey?.substring(0, 5) + '...' });
      
      const result = await callProxyAPI('/clusters/search', { q: query, limit }, apiKey);
      console.log('Cluster Search Result:', result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error searching clusters. Check your API key and internet connection.';
      console.error('Cluster Search Error:', { error: errorMessage, query, limit });
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const clusterInfo = useCallback(async (clusterName: string, limit = 5) => {
    if (!apiKey) throw new Error('Please login first');
    
    try {
      setIsLoading(true);
      setError(null);
      
      if (!clusterName || clusterName.trim() === '') {
        throw new Error('Cluster name cannot be empty');
      }
      
      console.log('Cluster Info:', { clusterName, limit, apiKey: apiKey?.substring(0, 5) + '...' });
      
      const result = await callProxyAPI('/clusters/info', { label: clusterName, limit }, apiKey);
      console.log('Cluster Info Result:', result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error getting cluster info. Check your API key and internet connection.';
      console.error('Cluster Info Error:', { error: errorMessage, clusterName, limit });
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const postSearch = useCallback(async (query: string, limit = 10) => {
    if (!apiKey) throw new Error('Please login first');
    
    try {
      setIsLoading(true);
      setError(null);
      
      if (!query || query.trim() === '') {
        throw new Error('Search query cannot be empty');
      }
      
      console.log('Post Search:', { query, limit, apiKey: apiKey?.substring(0, 5) + '...' });
      
      const result = await callProxyAPI('/posts/search', { q: query, limit }, apiKey);
      console.log('Post Search Result:', result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error searching posts. Check your API key and internet connection.';
      console.error('Post Search Error:', { error: errorMessage, query, limit });
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  return (
    <MembitContext.Provider
      value={{
        apiKey,
        isLoggedIn: !!apiKey,
        isLoading,
        error,
        login,
        logout,
        clusterSearch,
        clusterInfo,
        postSearch,
      }}
    >
      {children}
    </MembitContext.Provider>
  );
};
