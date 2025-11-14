import React, { useState } from 'react';
import { Search, MessageSquare } from 'lucide-react';
import { useMembit } from '../context/useMembit';
import SearchTab from './SearchTab';
import '../styles/TabNav.css';

type TabType = 'cluster-search' | 'cluster-info' | 'post-search';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'cluster-search', label: 'Cluster Search', icon: <Search size={16} /> },
  { id: 'post-search', label: 'Post Search', icon: <MessageSquare size={16} /> },
];

const TabNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('cluster-search');
  const { clusterSearch, postSearch } = useMembit();

  const getTabContent = (tabId: TabType) => {
    switch (tabId) {
      case 'cluster-search':
        return (
          <SearchTab
            title="Membit Cluster Search"
            placeholder="Enter a keyword to search trending discussion clusters (e.g., artificial intelligence)"
            onSearch={clusterSearch}
          />
        );
      case 'post-search':
        return (
          <SearchTab
            title="Membit Post Search"
            placeholder="Enter a keyword to search individual social media posts (e.g., machine learning)"
            onSearch={postSearch}
          />
        );
    }
  };

  return (
    <div className="tab-navigation">
      <div className="tab-buttons">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="tab-content">
        {getTabContent(activeTab)}
      </div>
    </div>
  );
};

export default TabNavigation;
