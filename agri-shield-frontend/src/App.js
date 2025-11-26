// src/App.js
import React, { useState, useEffect } from 'react';
import ConnectWallet from './components/ConnectWallet';
import Dashboard from './components/Dashboard';
import PolicyManagement from './components/PolicyManagement';
import PolicyList from './components/PolicyList';
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

  const handleWalletDisconnect = () => {
    setCurrentAccount('');
    console.log('Wallet disconnected');
  };

  const handleAccountChange = (newAccount) => {
    setCurrentAccount(newAccount);
    console.log('Account changed to:', newAccount);
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          });
          if (accounts.length > 0) {
            setCurrentAccount(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="App">
      <header className="app-header">
        <h1>🌾 AgriShield - Decentralized Agricultural Insurance</h1>
        <ConnectWallet 
          onConnect={handleWalletConnect}
          onDisconnect={handleWalletDisconnect}
          onAccountChange={handleAccountChange}
        />
      </header>

      <nav className="app-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'policy' ? 'active' : ''}
          onClick={() => setActiveTab('policy')}
        >
          Create Policy
        </button>
        <button 
          className={activeTab === 'policies' ? 'active' : ''}
          onClick={() => setActiveTab('policies')}
        >
          My Policies
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
        {activeTab === 'dashboard' && <Dashboard currentAccount={currentAccount} />}
        {activeTab === 'policy' && <PolicyManagement currentAccount={currentAccount} />}
        {activeTab === 'policies' && <PolicyList currentAccount={currentAccount} />}
        {activeTab === 'investment' && <Investment currentAccount={currentAccount} />}
        {activeTab === 'weather' && <WeatherData currentAccount={currentAccount} />}
      </main>

      <footer className="app-footer">
        <p>AgriShield - Agricultural Insurance Platform Based on Blockchain | Development and Testing Mode</p>
      </footer>
    </div>
  );
}

export default App;