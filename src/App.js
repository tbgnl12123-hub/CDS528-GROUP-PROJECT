import React, { useState } from 'react';
import ConnectWallet from './components/ConnectWallet';
import Dashboard from './components/Dashboard';
import PolicyManagement from './components/PolicyManagement';
import Investment from './components/Investment';
import WeatherData from './components/WeatherData';
import './App.css';

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleWalletConnect = (account) => {
    setCurrentAccount(account);
    console.log('Wallet connected:', account);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🌾 AgriShield - Decentralized Agricultural Insurance</h1>
        <ConnectWallet onConnect={handleWalletConnect} />
      </header>

      <nav className="app-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Data Panel
        </button>
        <button 
          className={activeTab === 'policy' ? 'active' : ''}
          onClick={() => setActiveTab('policy')}
        >
          Policy Management
        </button>
        <button 
          className={activeTab === 'investment' ? 'active' : ''}
          onClick={() => setActiveTab('investment')}
        >
          Investment
        </button>
        <button 
          className={activeTab === 'weather' ? 'active' : ''}
          onClick={() => setActiveTab('weather')}
        >
          Weather Data
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'policy' && <PolicyManagement />}
        {activeTab === 'investment' && <Investment />}
        {activeTab === 'weather' && <WeatherData />}
      </main>

      <footer className="app-footer">
        <p>AgriShield - Agricultural Insurance Platform Based on Blockchain | Development and Testing Mode</p>
      </footer>
    </div>
  );
}

export default App;