// src/components/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import AgriShieldContract from '../utils/web3';
import '../App.css';

// 粒子背景组件
const ParticlesBackground = () => {
  return (
    <div className="particles">
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCapital: '0',
    activePolicies: '0',
    totalInvestors: '0',
    totalPayouts: '0'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [contractStatus, setContractStatus] = useState('disconnected');
  const [listenerStatus, setListenerStatus] = useState('inactive');
  const [dataSource, setDataSource] = useState('unknown');
  const [connectionInfo, setConnectionInfo] = useState({});

  const loadStats = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setLoading(true);
      }

      console.log('🔄 Loading contract statistics...');
      
      let contractStats;
      try {
        // 先测试合约连接
        console.log('🔌 Testing contract connection...');
        await AgriShieldContract.init();
        
        // 获取连接信息
        const info = AgriShieldContract.getConnectionInfo();
        setConnectionInfo(info);
        
        // 获取真实数据
        contractStats = await AgriShieldContract.getContractStats();
        setDataSource('contract');
        setError('');
        setContractStatus('connected');
        
        console.log('✅ Real contract data loaded:', contractStats);
      } catch (contractError) {
        console.error('❌ Contract call failed:', contractError);
        console.log('Error details:', {
          message: contractError.message,
          code: contractError.code,
          stack: contractError.stack
        });
        
        setDataSource('demo');
        setContractStatus('error');
        
        const info = AgriShieldContract.getConnectionInfo();
        setConnectionInfo(info);
        
        if (isManualRefresh || !stats.totalCapital || stats.totalCapital === '0') {
          let errorMessage = `Contract connection issue: ${contractError.message}. Using demo data.`;
          
          // 提供更友好的错误信息
          if (contractError.message.includes("read-only")) {
            errorMessage = "Please connect MetaMask to see real-time data. Using demo data for now.";
          }
          
          setError(errorMessage);
        }
        
        // 使用模拟数据作为后备
        contractStats = {
          totalCapital: '25.8',
          activePolicies: '12',
          totalInvestors: '23',
          totalPayouts: '8.3'
        };
        console.log('📋 Using demo data:', contractStats);
      }

      if (contractStats) {
        setStats(contractStats);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('💥 Unexpected error in loadStats:', err);
      setError('Unexpected error loading data');
      setContractStatus('error');
    } finally {
      setLoading(false);
    }
  }, [stats.totalCapital]);

  const testConnection = useCallback(async () => {
    try {
      setContractStatus('testing');
      const connected = await AgriShieldContract.init();
      setContractStatus(connected ? 'connected' : 'disconnected');
      return connected;
    } catch (error) {
      setContractStatus('error');
      console.error('Connection test failed:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      console.log('🚀 Initializing Dashboard...');
      await testConnection();
      await loadStats();
      
      try {
        const listenersActive = AgriShieldContract.setupEventListeners(() => {
          console.log('🎯 Contract event detected, refreshing data...');
          setListenerStatus('active');
          loadStats();
        });
        setListenerStatus(listenersActive ? 'active' : 'inactive');
      } catch (error) {
        console.error('Failed to setup event listeners:', error);
        setListenerStatus('error');
      }
    };

    initialize();

    return () => {
      console.log('🧹 Cleaning up Dashboard...');
      AgriShieldContract.removeEventListeners();
      setListenerStatus('inactive');
    };
  }, [loadStats, testConnection]);

  useEffect(() => {
    if (!autoRefresh) {
      console.log('⏸️ Auto-refresh paused');
      return;
    }

    console.log('🔄 Auto-refresh enabled (10s interval)');
    const interval = setInterval(() => {
      if (!loading) {
        loadStats();
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      console.log('🛑 Auto-refresh stopped');
    };
  }, [autoRefresh, loadStats, loading]);

  const handleManualRefresh = async () => {
    console.log('🔃 Manual refresh requested');
    await loadStats(true);
  };

  const handleReconnect = async () => {
    console.log('🔌 Reconnecting to contract...');
    setLoading(true);
    setError('');
    const connected = await testConnection();
    if (connected) {
      await loadStats(true);
    }
  };

  const toggleAutoRefresh = () => {
    const newState = !autoRefresh;
    setAutoRefresh(newState);
    console.log(newState ? '▶️ Auto-refresh enabled' : '⏸️ Auto-refresh disabled');
  };

  if (loading && (!stats || stats.totalCapital === '0')) {
    return (
      <div className="dashboard">
        <ParticlesBackground />
        <div className="dashboard-header">
          <h2><i className="fas fa-chart-line"></i> AgriShield Data Panel</h2>
          <p className="dashboard-subtitle">Real-time Blockchain Insurance Analytics</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <p>Loading AgriShield data...</p>
          <div className="connection-status">
            <span className={`status-badge ${contractStatus}`}>
              {contractStatus.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <ParticlesBackground />
      <div className="dashboard-header">
        <h2><i className="fas fa-chart-line"></i> AgriShield Data Panel</h2>
        <p className="dashboard-subtitle">Real-time Blockchain Insurance Analytics</p>
      </div>
      
      {/* 控制面板 */}
      <div className="control-panel">
        <div className="status-bar">
          <div className="status-item">
            <span className="label">Last updated:</span>
            <span className="value">
              <i className="fas fa-clock"></i> {lastUpdated || 'Never'}
            </span>
          </div>
          
          <div className="status-item">
            <span className="label">Contract:</span>
            <span className={`status-badge ${contractStatus}`}>
              <i className={`fas ${
                contractStatus === 'connected' ? 'fa-check-circle' : 
                contractStatus === 'error' ? 'fa-exclamation-triangle' : 
                'fa-plug'
              }`}></i>
              {contractStatus.toUpperCase()}
            </span>
          </div>
          
          <div className="status-item">
            <span className="label">Mode:</span>
            <span className={`mode ${connectionInfo.canWrite ? 'write' : 'read-only'}`}>
              {connectionInfo.canWrite ? 'Read/Write' : 'Read-Only'}
            </span>
          </div>
          
          <div className="status-item">
            <span className="label">Data Source:</span>
            <span className={`data-source ${dataSource}`}>
              {dataSource === 'contract' ? 'Live Data' : 'Demo Data'}
            </span>
          </div>
        </div>

        <div className="controls">
          <button 
            onClick={toggleAutoRefresh} 
            className={`btn ${autoRefresh ? 'btn-primary' : 'btn-secondary'}`}
          >
            <i className={`fas ${autoRefresh ? 'fa-pause' : 'fa-play'}`}></i> 
            {autoRefresh ? ' Pause Auto-Refresh' : ' Enable Auto-Refresh'}
          </button>
          
          <button 
            onClick={handleManualRefresh} 
            disabled={loading}
            className="btn btn-secondary"
          >
            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i> 
            {loading ? ' Refreshing...' : ' Refresh Now'}
          </button>
          
          <button 
            onClick={handleReconnect}
            className="btn btn-warning"
          >
            <i className="fas fa-plug"></i> Reconnect
          </button>
        </div>
      </div>

      {/* 连接警告 */}
      {!connectionInfo.canWrite && connectionInfo.isInitialized && (
        <div className="connection-warning">
          <i className="fas fa-exclamation-triangle"></i>
          <span>
            <strong>Read-Only Mode:</strong> Connect MetaMask to interact with the contract and see real-time updates.
          </span>
        </div>
      )}
      
      {/* 错误显示 */}
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i> 
          <span>{error}</span>
          <button onClick={() => setError('')} className="btn-close">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      {/* 数据统计网格 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">
            <i className="fas fa-piggy-bank"></i>
          </div>
          <div className="stat-content">
            <h3>TOTAL CAPITAL POOL</h3>
            <p className="stat-value">{stats.totalCapital} ETH</p>
            <p className="stat-description">Total insurance funds in pool</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon success">
            <i className="fas fa-file-contract"></i>
          </div>
          <div className="stat-content">
            <h3>ACTIVE POLICIES</h3>
            <p className="stat-value">{stats.activePolicies}</p>
            <p className="stat-description">Currently active insurance policies</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon info">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>NUMBER OF INVESTORS</h3>
            <p className="stat-value">{stats.totalInvestors}</p>
            <p className="stat-description">Active pool investors</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon warning">
            <i className="fas fa-hand-holding-usd"></i>
          </div>
          <div className="stat-content">
            <h3>TOTAL COMPENSATION</h3>
            <p className="stat-value">{stats.totalPayouts} ETH</p>
            <p className="stat-description">Historical payout total to farmers</p>
          </div>
        </div>
      </div>
      
      {/* 平台描述 */}
      <div className="info-section">
        <h4><i className="fas fa-info-circle"></i> Platform Description</h4>
        <p>AgriShield is a blockchain based decentralized agricultural insurance platform that provides reliable weather disaster protection for farmers and creates profit opportunities for investors.</p>
      </div>
      
      {/* 活动动态 */}
      <div className="activity-feed">
        <h4><i className="fas fa-list-alt"></i> Recent Activity</h4>
        <div className="activity-list">
          <div className="activity-item">
            <i className="fas fa-file-contract text-primary"></i>
            <span>New policy created for Wheat farm in Beijing</span>
            <span className="activity-time">2 minutes ago</span>
          </div>
          <div className="activity-item">
            <i className="fas fa-money-bill-wave text-success"></i>
            <span>New investment of 5 ETH added to pool</span>
            <span className="activity-time">15 minutes ago</span>
          </div>
          <div className="activity-item">
            <i className="fas fa-cloud-rain text-warning"></i>
            <span>Weather data updated for Shanghai region</span>
            <span className="activity-time">1 hour ago</span>
          </div>
          <div className="activity-item">
            <i className="fas fa-hand-holding-usd text-info"></i>
            <span>Claim processed for Rice farm in Jiangsu</span>
            <span className="activity-time">3 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;