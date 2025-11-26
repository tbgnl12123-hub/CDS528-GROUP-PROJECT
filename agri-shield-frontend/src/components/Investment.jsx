import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AgriShieldContract from '../utils/web3';

const Investment = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [connectionInfo, setConnectionInfo] = useState({});
  const [userBalance, setUserBalance] = useState('0');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const initializeConnection = async () => {
      try {
        await AgriShieldContract.init();
        const info = AgriShieldContract.getConnectionInfo();
        setConnectionInfo(info);
        
        if (info.canWrite) {
          try {
            const balance = await AgriShieldContract.getBalance();
            setUserBalance(parseFloat(balance).toFixed(4));
            
            await checkIfOwner();
          } catch (error) {
            console.error('Failed to get user balance:', error);
          }
        }
      } catch (error) {
        console.error('Failed to initialize connection:', error);
      }
    };

    initializeConnection();
  }, []);

  const checkIfOwner = async () => {
    try {
      const contract = AgriShieldContract.getContract();
      const ownerAddress = await contract.owner();
      const currentAccount = await AgriShieldContract.getCurrentAccount();
      
      const ownerCheck = ownerAddress.toLowerCase() === currentAccount.toLowerCase();
      setIsOwner(ownerCheck);
      
      console.log('Owner check:', {
        ownerAddress,
        currentAccount,
        isOwner: ownerCheck
      });
      
      return ownerCheck;
    } catch (error) {
      console.error('Error checking owner status:', error);
      return false;
    }
  };

  const connectMetaMask = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      await AgriShieldContract.init();
      const info = AgriShieldContract.getConnectionInfo();
      setConnectionInfo(info);

      if (info.canWrite) {
        const balance = await AgriShieldContract.getBalance();
        setUserBalance(parseFloat(balance).toFixed(4));
        await checkIfOwner();
      }

      setResult({
        type: 'success',
        message: 'Successfully connected to MetaMask!'
      });
    } catch (error) {
      console.error('Failed to connect MetaMask:', error);
      setResult({
        type: 'error',
        message: error.message || 'Failed to connect to MetaMask. Please try again.'
      });
    }
  };

  const invest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const investmentAmount = parseFloat(amount);
      
      if (!amount || isNaN(investmentAmount) || investmentAmount <= 0) {
        throw new Error('Please enter a valid investment amount');
      }

      if (investmentAmount < 0.01) {
        throw new Error('Minimum investment amount is 0.01 ETH');
      }

      const balance = parseFloat(userBalance);
      if (connectionInfo.canWrite && balance < investmentAmount) {
        throw new Error(`Insufficient balance. You have ${userBalance} ETH, but trying to invest ${investmentAmount} ETH`);
      }

      if (connectionInfo.canWrite && balance < investmentAmount + 0.01) {
        throw new Error(`Insufficient balance for gas fees. You need at least ${(investmentAmount + 0.01).toFixed(4)} ETH (investment + gas)`);
      }

      const ownerStatus = await checkIfOwner();
      if (ownerStatus) {
        throw new Error('Contract owners cannot invest in their own pool. Please use a different account.');
      }

      console.log('Attempting to invest in pool:', { 
        investmentAmount,
        userBalance: balance,
        isOwner: ownerStatus,
        hasEnoughForGas: balance >= investmentAmount + 0.01
      });

      await AgriShieldContract.init();


      if (!AgriShieldContract.canWrite()) {
        throw new Error('Please connect MetaMask to make an investment');
      }

      const network = await AgriShieldContract.checkNetwork();
      if (network && network.chainId !== 11155111n) {
        throw new Error('Please switch to Sepolia testnet in MetaMask');
      }

      console.log('Calling investInPool with amount:', investmentAmount);
      
      const transaction = await AgriShieldContract.investInPool(investmentAmount);

      console.log('Transaction sent:', transaction.hash);
      
      setResult({
        type: 'info',
        message: `Transaction submitted! Waiting for confirmation...`,
        transactionHash: transaction.hash
      });

      console.log('Waiting for transaction confirmation...');
      const receipt = await transaction.wait();
      console.log('Investment successful! Receipt:', receipt);

      if (receipt.status === 1) {
        setResult({
          type: 'success',
          message: `Successfully invested ${investmentAmount} ETH in the pool!`,
          transactionHash: transaction.hash
        });
      } else {
        throw new Error('Transaction failed on chain');
      }

      const newBalance = await AgriShieldContract.getBalance();
      setUserBalance(parseFloat(newBalance).toFixed(4));

      setAmount('');

    } catch (error) {
      console.error('Error investing in pool:', error);
      
      let errorMessage = error.message;
      
      if (error.message.includes('user rejected transaction')) {
        errorMessage = 'Transaction was cancelled by user.';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient ETH balance for this investment and gas fees.';
      } else if (error.message.includes('Please connect MetaMask')) {
        errorMessage = 'Please connect MetaMask to make an investment.';
      } else if (error.message.includes('execution reverted') && error.message.includes('Owner cannot invest')) {
        errorMessage = 'Contract owners cannot invest in their own pool. Please use a different MetaMask account.';
      } else if (error.message.includes('Owner cannot invest')) {
        errorMessage = 'Contract owners cannot invest in their own pool. Please use a different MetaMask account.';
      } else if (error.message.includes('Switch to Sepolia')) {
        errorMessage = 'Please switch to Sepolia testnet in MetaMask to make investments.';
      }

      setResult({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <div className="investment">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <i className="fas fa-chart-line"></i> Fund Pool Investment
          </h2>
        </div>

        {/* 所有者警告 */}
        {isOwner && (
          <div className="connection-warning">
            <i className="fas fa-exclamation-triangle"></i>
            <div>
              <strong>Contract Owner Detected</strong>
              <p>As the contract owner, you cannot invest in your own pool. Please switch to a different MetaMask account to make investments.</p>
            </div>
          </div>
        )}

        {/* 连接状态显示 */}
        {!connectionInfo.canWrite && (
          <div className="connection-warning">
            <i className="fas fa-exclamation-triangle"></i>
            <div>
              <strong>Wallet Not Connected</strong>
              <p>Please connect your MetaMask wallet to make investments.</p>
              <button 
                onClick={connectMetaMask}
                className="btn btn-primary"
                style={{ marginTop: '10px' }}
              >
                <i className="fas fa-plug"></i> Connect MetaMask
              </button>
            </div>
          </div>
        )}

        {connectionInfo.canWrite && !isOwner && (
          <div className="connection-success">
            <i className="fas fa-check-circle"></i>
            <div>
              <strong>Wallet Connected</strong>
              <p>Your balance: <strong>{userBalance} ETH</strong></p>
            </div>
          </div>
        )}

        {/* 结果显示 */}
        {result && (
          <div className={`result-message ${result.type}`}>
            <div className="message-content">
              {result.type === 'success' ? (
                <i className="fas fa-check-circle"></i>
              ) : result.type === 'info' ? (
                <i className="fas fa-info-circle"></i>
              ) : (
                <i className="fas fa-exclamation-circle"></i>
              )}
              <span>{result.message}</span>
            </div>
            {result.transactionHash && (
              <div className="transaction-info">
                <small>
                  Transaction: <code>{result.transactionHash}</code>
                </small>
              </div>
            )}
            <button 
              onClick={() => setResult(null)} 
              className="btn-close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        <form onSubmit={invest} className="investment-form">
          <div className="form-group">
            <label htmlFor="amount">
              <i className="fas fa-coins"></i> Investment Amount (ETH)
            </label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              className="form-control"
              placeholder="For example: 1.0"
              disabled={!connectionInfo.canWrite || loading || isOwner}
              required
            />
            <div className="form-hint">
              Minimum investment amount: 0.01 ETH
              {connectionInfo.canWrite && !isOwner && (
                <span style={{ display: 'block', marginTop: '5px' }}>
                  Available: <strong>{userBalance} ETH</strong>
                </span>
              )}
              {isOwner && (
                <span style={{ display: 'block', marginTop: '5px', color: '#e74c3c' }}>
                  Contract owners cannot invest
                </span>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !connectionInfo.canWrite || !amount || isOwner}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Investing...
              </>
            ) : (
              <>
                <i className="fas fa-hand-holding-usd"></i>
                {isOwner ? 'Owner Cannot Invest' : 'Investment'}
              </>
            )}
          </button>
        </form>

        {/* 投资描述 */}
        <div className="feature-list">
          <div className="feature-item">
            <i className="fas fa-hand-holding-usd feature-icon"></i>
            <div>Investors share premium income</div>
          </div>
          <div className="feature-item">
            <i className="fas fa-shield-alt feature-icon"></i>
            <div>Jointly bear insurance risks</div>
          </div>
          <div className="feature-item">
            <i className="fas fa-wallet feature-icon"></i>
            <div>You can withdraw profits at any time</div>
          </div>
        </div>

        {/* 平台信息 */}
        <div className="info-section">
          <h4>
            <i className="fas fa-info-circle"></i>
            Investment Description
          </h4>
          <p>
            AgriShield - Agricultural Insurance Platform Based on Blockchain | Development and Testing Mode
          </p>
          {isOwner && (
            <div className="risk-warning">
              <i className="fas fa-user-shield"></i>
              <div>
                <strong>Owner Account Detected:</strong> For security and fairness, contract owners are not allowed to invest in their own pools. 
                Please use a different MetaMask account to participate as an investor.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Investment;