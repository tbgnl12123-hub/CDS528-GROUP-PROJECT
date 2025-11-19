import React, { useState, useEffect } from 'react';
import AgriShieldContract from '../utils/web3';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    try {
      setLoading(true);
      const contractStats = await AgriShieldContract.getContractStats();
      setStats(contractStats);
    } catch (err) {
      console.error('Failed to load statistical information:', err);
      setError('Unable to load statistical data');
      setStats({
        totalCapital: '25.8',
        activePolicies: '12',
        totalInvestors: '23',
        totalPayouts: '8.3'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <h2><i className="fas fa-chart-line"></i> AgriShield data panel</h2>
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i> Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2><i className="fas fa-chart-line"></i> AgriShield data panel</h2>
      
      {error && (
        <div className="error">
          <i className="fas fa-exclamation-triangle"></i> {error}
        </div>
      )}
      
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <i className="fas fa-piggy-bank"></i>
            <h3>Total capital pool</h3>
            <p className="stat-value">{stats.totalCapital} ETH</p>
          </div>
          
          <div className="stat-card">
            <i className="fas fa-file-contract"></i>
            <h3>Active policy</h3>
            <p className="stat-value">{stats.activePolicies}</p>
          </div>
          
          <div className="stat-card">
            <i className="fas fa-users"></i>
            <h3>Number of investors</h3>
            <p className="stat-value">{stats.totalInvestors}</p>
          </div>
          
          <div className="stat-card">
            <i className="fas fa-hand-holding-usd"></i>
            <h3>Total compensation amount</h3>
            <p className="stat-value">{stats.totalPayouts} ETH</p>
          </div>
        </div>
      )}
      
      <div className="info">
        <h4><i className="fas fa-info-circle"></i> Platform Description</h4>
        <p>AgriShield is a blockchain based decentralized agricultural insurance platform that provides reliable weather disaster protection for farmers and creates profit opportunities for investors.</p>
      </div>
      
      <button onClick={loadStats} className="btn btn-secondary">
        <i className="fas fa-sync-alt"></i> Refresh data
      </button>
    </div>
  );
};

export default Dashboard;