import React, { useState } from 'react';
import { useMembit } from '../context/useMembit';
import { Loader } from 'lucide-react';
import '../styles/Login.css';

const Login: React.FC = () => {
  const { login, isLoading, error } = useMembit();
  const [apiKey, setApiKey] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const validateApiKey = (key: string): boolean => {
    const trimmedKey = key.trim();
    
    // Check format: must start with "u-" and be exactly 50 characters total
    // Format: u- (2 chars) + 48 alphanumeric chars = 50 total
    if (!trimmedKey.startsWith('u-')) {
      return false;
    }
    
    if (trimmedKey.length !== 50) {
      return false;
    }
    
    // Check character set: only alphanumeric after "u-" prefix
    const validCharacters = /^u-[A-Za-z0-9]{48}$/.test(trimmedKey);
    if (!validCharacters) {
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!apiKey.trim()) {
      setLocalError('Please enter your API key');
      return;
    }

    if (!validateApiKey(apiKey)) {
      setLocalError('Invalid API key format. API key should start with "u-" and contain 50 characters total.');
      return;
    }

    try {
      await login(apiKey);
    } catch {
      setLocalError('Authentication failed. Please check your API key.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Membit Research Tool</h1>
          <p>Discover the latest AI information from Membit</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="api-key">API Key</label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="api-input"
              disabled={isLoading}
            />
          </div>

          {(error || localError) && (
            <div className="error-message">
              <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
                {error || localError}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="spinner" size={18} />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an API key?{' '}
            <a
              href="https://membit.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Get one from membit.ai
            </a>
          </p>
        </div>
      </div>

      <div className="login-background"></div>
    </div>
  );
};

export default Login;
