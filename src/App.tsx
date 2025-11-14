import { MembitProvider } from './context/MembitContext';
import { useMembit } from './context/useMembit';
import { useState } from 'react';
import Login from './components/Login';
import Header from './components/Header';
import SearchTab from './components/SearchTab';
import CryptoTrending from './components/CryptoTrending';
import Footer from './components/Footer';
import './styles/index.css';
import './styles/App.css';

type TabType = 'cluster-search' | 'post-search' | 'crypto-trending';

interface TabContentConfig {
  id: TabType;
  title: string;
  placeholder?: string;
  onSearch?: (query: string, limit: number) => Promise<any>;
  defaultLimit?: number;
}

const AppContent = () => {
  const { isLoggedIn, clusterSearch, postSearch } = useMembit();
  const [activeTab, setActiveTab] = useState<TabType>('cluster-search');

  if (!isLoggedIn) {
    return <Login />;
  }

  const getTabContent = (tabId: TabType): TabContentConfig => {
    switch (tabId) {
      case 'cluster-search':
        return {
          id: tabId,
          title: 'Membit Cluster Search',
          placeholder: 'Enter keyword to search clusters (e.g. artificial intelligence)',
          onSearch: clusterSearch,
          defaultLimit: 10,
        };
      case 'post-search':
        return {
          id: tabId,
          title: 'Membit Post Search',
          placeholder: 'Enter keyword to search posts (e.g. machine learning)',
          onSearch: postSearch,
          defaultLimit: 20,
        };
      case 'crypto-trending':
        return {
          id: tabId,
          title: 'Crypto Trending',
        };
      default:
        return {
          id: 'cluster-search',
          title: 'Membit Cluster Search',
          placeholder: 'Enter keyword to search clusters (e.g. artificial intelligence)',
          onSearch: clusterSearch,
          defaultLimit: 10,
        };
    }
  };

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
  };

  const tabContent = getTabContent(activeTab);

  return (
    <div className="app-container">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="app-main">
        <div className="app-content">
          {activeTab === 'crypto-trending' ? (
            <CryptoTrending tabKey={activeTab} />
          ) : (
            <SearchTab
              title={tabContent.title}
              placeholder={tabContent.placeholder || ''}
              onSearch={tabContent.onSearch || (async () => null)}
              tabKey={activeTab}
              defaultLimit={tabContent.defaultLimit || 5}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <MembitProvider>
      <AppContent />
    </MembitProvider>
  );
}

export default App;
