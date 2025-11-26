// src/components/ConnectWallet.js
import React, { useState, useEffect } from 'react';
import AgriShieldContract from '../utils/web3';

const ConnectWallet = ({ onConnect, onDisconnect, onAccountChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAccount, setCurrentAccount] = useState('');


  useEffect(() => {
    checkConnectedWallet();
  }, []);

 
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
   
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          setCurrentAccount('');
          onDisconnect && onDisconnect();
        } else {
          const newAccount = accounts[0];
          setCurrentAccount(newAccount);
          onAccountChange && onAccountChange(newAccount);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [onDisconnect, onAccountChange]);

  const checkConnectedWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length > 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        onConnect && onConnect(account);
      }
    } catch (error) {
      console.error('Error checking connected wallet:', error);
    }
  };

  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask to use this dApp');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const account = accounts[0];
      setCurrentAccount(account);
      
      await AgriShieldContract.init();
      
      onConnect && onConnect(account);
      
      console.log('Connected account:', account);
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      setCurrentAccount('');
      
      AgriShieldContract.disconnectWallet();
      
      onDisconnect && onDisconnect();
      
      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      setError(error.message);
    }
  };

  const switchAccount = async () => {
    setLoading(true);
    try {
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      });
      
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        onAccountChange && onAccountChange(account);
      }
    } catch (error) {
      console.error('Error switching account:', error);
    } finally {
      setLoading(false);
    }
  };

  if (currentAccount) {
    return (
      <div className="account-info">
        <div className="account-details">
          <div className="account-address">
            <i className="fas fa-wallet"></i>
            {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
          </div>
          <div className="account-actions">
            <button 
              onClick={switchAccount}
              disabled={loading}
              className="btn btn-outline btn-sm"
              title="Switch Account"
            >
              <i className="fas fa-sync-alt"></i>
              Switch
            </button>
            <button 
              onClick={disconnectWallet}
              className="btn btn-warning btn-sm"
              title="Disconnect Wallet"
            >
              <i className="fas fa-sign-out-alt"></i>
              Disconnect
            </button>
          </div>
        </div>
        
        {error && (
          <div className="error-message" style={{marginTop: '10px'}}>
            <div className="message-content">
              <i className="fas fa-exclamation-triangle"></i>
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="connect-wallet">
      <button 
        onClick={connectWallet}
        disabled={loading}
        className="btn btn-primary"
        style={{minWidth: '200px'}}
      >
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            Connecting...
          </>
        ) : (
          <>
            <i className="fas fa-plug"></i>
            Connect Wallet
          </>
        )}
      </button>
      
      {error && (
        <div className="error-message" style={{marginTop: '10px'}}>
          <div className="message-content">
            <i className="fas fa-exclamation-triangle"></i>
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;