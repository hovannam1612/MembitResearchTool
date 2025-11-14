import React from 'react';
import { useMembit } from '../context/useMembit';
import { LogOut, BarChart3, Search, MessageSquare, TrendingUp } from 'lucide-react';
import '../styles/Header.css';

type TabType = 'cluster-search' | 'post-search' | 'crypto-trending';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'cluster-search', label: 'Cluster Search', icon: <Search size={16} /> },
  { id: 'post-search', label: 'Post Search', icon: <MessageSquare size={16} /> },
  { id: 'crypto-trending', label: 'Crypto Trending', icon: <TrendingUp size={16} /> },
];

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tabId: TabType) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { logout, apiKey } = useMembit();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <BarChart3 size={32} className="logo" />
          <h1 className="title">Membit Research Tool</h1>
          
          <div className="header-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`header-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
                disabled={activeTab === tab.id}
                title={activeTab === tab.id ? 'Current tab' : `Switch to ${tab.label}`}
              >
                <span className="header-tab-icon">{tab.icon}</span>
                <span className="header-tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="header-right">
          <span className="api-key-display">
            API Key: {apiKey?.slice(0, 8)}...
          </span>
          <button
            onClick={handleLogout}
            className="logout-btn"
            title="Logout"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
