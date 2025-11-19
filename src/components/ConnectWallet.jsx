import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers'; 
import AgriShieldContract from '../utils/web3';

const ConnectWallet = ({ onConnect }) => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [network, setNetwork] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasMetaMask, setHasMetaMask] = useState(false);

  useEffect(() => {
    const checkMetaMask = () => {
      const available = typeof window.ethereum !== 'undefined';
      setHasMetaMask(available);
      
      if (available) {
        console.log(' MetaMask Detected');
        
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        
        window.ethereum.on('chainChanged', handleChainChanged);
        
        checkConnectionStatus();
      } else {
        console.log(' MetaMask not detected');
      }
    };

    checkMetaMask();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_accounts' 
      });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        updateBalance(accounts[0]);
        updateNetwork();
        onConnect(accounts[0]);
      }
    } catch (error) {
      console.error('Failed to check connection status:', error);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount('');
      setBalance('');
      setNetwork('');
      setError('');
      onConnect('');
    } else {
      setAccount(accounts[0]);
      updateBalance(accounts[0]);
      updateNetwork();
      onConnect(accounts[0]);
    }
  };

  const handleChainChanged = (chainId) => {
    console.log('Network switched:', chainId);
    updateNetwork();
  };

  const updateBalance = async (accountAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(accountAddress);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  };

  const updateNetwork = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      setNetwork(getNetworkName(Number(network.chainId)));
    } catch (error) {
      console.error('Failed to update network information:', error);
    }
  };

  const getNetworkName = (chainId) => {
    const networks = {
      1: 'Ethereum Mainnet',
      11155111: 'Sepolia Testnet',
      5: 'Goerli Testnet',
      137: 'Polygon Mainnet',
      80001: 'Mumbai Testnet'
    };
    return networks[chainId] || `Unknown Network (${chainId})`;
  };

  const connectWallet = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await AgriShieldContract.connectWallet();
      
      if (result.success) {
        setAccount(result.account);
        setBalance(result.balance);
        setNetwork(getNetworkName(result.chainId));
        onConnect(result.account);
      } else {
        setError(result.error);
        
        if (result.error.includes('Sepolia')) {
          setError(`${result.error} Click the button below to switch networks`);
        }
      }
    } catch (err) {
      setError('Connection failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchNetwork = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await AgriShieldContract.switchToSepoliaNetwork();
      
      if (result.success) {
        setError('Network switch successful, please reconnect to wallet');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Network switching failed:' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    AgriShieldContract.disconnectWallet();
    setAccount('');
    setBalance('');
    setNetwork('');
    setError('');
    onConnect('');
  };

  if (!hasMetaMask) {
    return (
      <div className="connect-wallet">
        <div className="wallet-error">
          <p>Not detected MetaMask</p>
          <p className="small-text">
            Please install <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">MetaMask</a> Wallet extension program
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="connect-wallet">
      {!account ? (
        <div className="wallet-connect">
          <button 
            onClick={connectWallet} 
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Connecting...
              </>
            ) : (
              'Connecting MetaMask'
            )}
          </button>
          
          {error && error.includes('Switch network') && (
            <button 
              onClick={switchNetwork}
              className="btn btn-secondary switch-network-btn"
            >
              switch to Sepolia network
            </button>
          )}
        </div>
      ) : (
        <div className="wallet-info">
          <div className="wallet-details">
            <div className="account">
              <strong>account:</strong> 
              <span className="account-address">
                {`${account.slice(0, 6)}...${account.slice(-4)}`}
              </span>
            </div>
            <div className="balance">
              <strong>balance:</strong> {parseFloat(balance).toFixed(4)} ETH
            </div>
            <div className="network">
              <strong>network:</strong> {network}
            </div>
          </div>
          <button 
            onClick={disconnectWallet}
            className="btn btn-outline disconnect-btn"
          >
            Disconnect
          </button>
        </div>
      )}
      
      {error && !error.includes('Switch network') && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;