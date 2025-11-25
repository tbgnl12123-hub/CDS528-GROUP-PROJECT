// src/components/PolicyList.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AgriShieldContract from '../utils/web3';

const PolicyList = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // 加载用户保单
  const loadPolicies = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      await AgriShieldContract.init();
      
      if (!AgriShieldContract.canRead()) {
        throw new Error('Please connect to network to view policies');
      }

      const userPolicies = await AgriShieldContract.getUserPolicies();
      setPolicies(userPolicies);
      
    } catch (error) {
      console.error('Error loading policies:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  // 格式化以太币金额
  const formatEther = (wei) => {
    try {
      return parseFloat(ethers.formatEther(wei)).toFixed(4);
    } catch (error) {
      return '0.0000';
    }
  };

  // 格式化日期
  const formatDate = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // 计算剩余天数
  const getDaysRemaining = (endTime) => {
    const end = new Date(endTime);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // 获取状态标签样式
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': { class: 'status-badge connected', icon: 'fas fa-check-circle' },
      'Expired': { class: 'status-badge error', icon: 'fas fa-clock' },
      'Claimed': { class: 'status-badge', icon: 'fas fa-file-invoice-dollar' },
      'Cancelled': { class: 'status-badge error', icon: 'fas fa-ban' }
    };
    
    const config = statusConfig[status] || { class: 'status-badge', icon: 'fas fa-question-circle' };
    
    return (
      <span className={config.class}>
        <i className={config.icon}></i>
        {status}
      </span>
    );
  };

  // 查看保单详情
  const viewPolicyDetails = (policy) => {
    setSelectedPolicy(policy);
  };

  // 关闭详情模态框
  const closeDetails = () => {
    setSelectedPolicy(null);
  };

  // 下载保单证书
  const downloadCertificate = (policy) => {
    // 模拟下载功能
    alert(`Downloading certificate for Policy #${policy.policyId}`);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin loading-spinner"></i>
          <p>Loading your insurance policies...</p>
          <div className="form-hint">Fetching data from blockchain network</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* 头部区域 */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-main">
            <div className="header-meta">
              <div className="meta-item">
                <span className="meta-label">Total Policies</span>
                <span className="meta-value">
                  <i className="fas fa-file-contract"></i>
                  {policies.length}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Active Coverage</span>
                <span className="meta-value">
                  <i className="fas fa-shield-alt"></i>
                  {policies.filter(p => p.status === 'Active').length}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Network</span>
                <span className="meta-value">
                  <i className="fas fa-network-wired"></i>
                  Sepolia Testnet
                </span>
              </div>
            </div>
            <h2>My Insurance Policies</h2>
            <p className="dashboard-subtitle">
              Manage and monitor your agricultural insurance coverage
            </p>
          </div>

          <div className="account-section">
            <div className="account-info">
              <div className="balance-display">
                <div className="balance-amount">
                  <i className="fas fa-wallet"></i>
                  {policies.length} Policies
                </div>
                <span className="network-badge">Active</span>
              </div>
              <button 
                onClick={() => loadPolicies(true)}
                disabled={refreshing}
                className="btn btn-primary"
                style={{width: '100%'}}
              >
                {refreshing ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sync-alt"></i>
                    Refresh Policies
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="error-message">
          <div className="message-content">
            <i className="fas fa-exclamation-triangle"></i>
            <span>{error}</span>
          </div>
          <button onClick={() => loadPolicies()} className="btn btn-warning">
            Try Again
          </button>
        </div>
      )}

      {/* 保单列表 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <i className="fas fa-file-contract"></i> Policy Portfolio
          </h2>
          <div className="controls">
            <button 
              onClick={() => window.location.hash = '#create'}
              className="btn btn-primary"
            >
              <i className="fas fa-plus-circle"></i>
              New Policy
            </button>
          </div>
        </div>

        {policies.length === 0 && !error ? (
          <div className="empty-state" style={{textAlign: 'center', padding: '60px 20px', color: '#666'}}>
            <i className="fas fa-folder-open" style={{fontSize: '48px', marginBottom: '16px', color: '#ccc'}}></i>
            <h3 style={{color: '#2c3e50', marginBottom: '12px'}}>No Policies Found</h3>
            <p style={{marginBottom: '24px', fontSize: '1.1rem'}}>
              You haven't created any insurance policies yet.
            </p>
            <button 
              onClick={() => window.location.hash = '#create'} 
              className="btn btn-primary"
            >
              <i className="fas fa-plus-circle"></i>
              Create Your First Policy
            </button>
          </div>
        ) : (
          <div className="policies-container" style={{display: 'grid', gap: '20px'}}>
            {policies.map((policy) => (
              <div key={policy.policyId} className="stat-card" style={{cursor: 'pointer'}}>
                <div className="policy-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px'}}>
                  <div className="policy-info">
                    <h3 style={{color: '#2c3e50', margin: '0 0 8px 0', fontSize: '1.3rem', fontWeight: '700'}}>
                      Policy #{policy.policyId}
                    </h3>
                    <p className="crop-type" style={{margin: '0', color: '#666', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem'}}>
                      <i className="fas fa-seedling"></i>
                      {policy.cropType.charAt(0).toUpperCase() + policy.cropType.slice(1)}
                    </p>
                  </div>
                  {getStatusBadge(policy.status)}
                </div>

                <div className="policy-details">
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
                    <div className="detail-item">
                      <label style={{fontWeight: '600', color: '#6c757d', fontSize: '0.9rem'}}>Coverage Amount:</label>
                      <span className="amount" style={{fontWeight: '700', color: '#2ecc71', fontSize: '1.1rem'}}>
                        {formatEther(policy.coverageAmount)} ETH
                      </span>
                    </div>
                    <div className="detail-item">
                      <label style={{fontWeight: '600', color: '#6c757d', fontSize: '0.9rem'}}>Premium Paid:</label>
                      <span className="premium" style={{fontWeight: '700', color: '#e74c3c', fontSize: '1.1rem'}}>
                        {formatEther(policy.premium)} ETH
                      </span>
                    </div>
                  </div>
                  
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
                    <div className="detail-item">
                      <label style={{fontWeight: '600', color: '#6c757d', fontSize: '0.9rem'}}>Coverage Period:</label>
                      <span style={{fontWeight: '500', color: '#2c3e50'}}>
                        {formatDate(policy.startTime)} - {formatDate(policy.endTime)}
                      </span>
                    </div>
                    {policy.location && (
                      <div className="detail-item">
                        <label style={{fontWeight: '600', color: '#6c757d', fontSize: '0.9rem'}}>Location:</label>
                        <span style={{fontWeight: '500', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '4px'}}>
                          <i className="fas fa-map-marker-alt"></i>
                          {policy.location}
                        </span>
                      </div>
                    )}
                  </div>

                  {policy.claimed && (
                    <div className="claim-info" style={{background: 'rgba(52, 152, 219, 0.1)', padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', border: '1px solid rgba(52, 152, 219, 0.2)'}}>
                      <i className="fas fa-file-invoice-dollar" style={{color: '#3498db'}}></i>
                      <span style={{fontWeight: '600', color: '#3498db'}}>
                        Claim Paid: {formatEther(policy.claimAmount)} ETH
                      </span>
                    </div>
                  )}

                  {policy.status === 'Active' && (
                    <div style={{background: 'rgba(46, 204, 113, 0.1)', padding: '8px 12px', borderRadius: '8px', marginTop: '12px', border: '1px solid rgba(46, 204, 113, 0.2)'}}>
                      <span style={{fontSize: '0.85rem', color: '#27ae60', fontWeight: '600'}}>
                        <i className="fas fa-clock"></i> {getDaysRemaining(policy.endTime)} days remaining
                      </span>
                    </div>
                  )}
                </div>

                <div className="policy-actions" style={{display: 'flex', gap: '12px', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '20px', marginTop: '16px'}}>
                  <button 
                    onClick={() => viewPolicyDetails(policy)}
                    className="btn btn-outline"
                    style={{flex: 1, background: 'transparent', border: '1px solid #3498db', color: '#3498db'}}
                  >
                    <i className="fas fa-eye"></i> View Details
                  </button>
                  
                  {policy.status === 'Active' && (
                    <button 
                      onClick={() => downloadCertificate(policy)}
                      className="btn btn-outline"
                      style={{flex: 1, background: 'transparent', border: '1px solid #9b59b6', color: '#9b59b6'}}
                    >
                      <i className="fas fa-download"></i> Certificate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 保单详情模态框 */}
      {selectedPolicy && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div className="card" style={{maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto'}}>
            <div className="card-header">
              <h2 className="card-title">
                <i className="fas fa-file-alt"></i> Policy Details #{selectedPolicy.policyId}
              </h2>
              <button onClick={closeDetails} className="btn-close">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={{padding: '0'}}>
              <div className="detail-section" style={{padding: '24px', borderBottom: '1px solid rgba(0,0,0,0.1)'}}>
                <h4 style={{color: '#2c3e50', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <i className="fas fa-info-circle"></i> Basic Information
                </h4>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                  <div className="detail-item">
                    <label style={{fontWeight: '600', color: '#6c757d'}}>Policy ID:</label>
                    <span style={{fontWeight: '500', color: '#2c3e50'}}>#{selectedPolicy.policyId}</span>
                  </div>
                  <div className="detail-item">
                    <label style={{fontWeight: '600', color: '#6c757d'}}>Status:</label>
                    {getStatusBadge(selectedPolicy.status)}
                  </div>
                  <div className="detail-item">
                    <label style={{fontWeight: '600', color: '#6c757d'}}>Crop Type:</label>
                    <span style={{fontWeight: '500', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <i className="fas fa-seedling"></i>
                      {selectedPolicy.cropType.charAt(0).toUpperCase() + selectedPolicy.cropType.slice(1)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label style={{fontWeight: '600', color: '#6c757d'}}>Location:</label>
                    <span style={{fontWeight: '500', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <i className="fas fa-map-marker-alt"></i>
                      {selectedPolicy.location || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section" style={{padding: '24px', borderBottom: '1px solid rgba(0,0,0,0.1)'}}>
                <h4 style={{color: '#2c3e50', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <i className="fas fa-chart-line"></i> Financial Information
                </h4>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                  <div className="detail-item">
                    <label style={{fontWeight: '600', color: '#6c757d'}}>Coverage Amount:</label>
                    <span style={{fontWeight: '700', color: '#2ecc71', fontSize: '1.1rem'}}>
                      {formatEther(selectedPolicy.coverageAmount)} ETH
                    </span>
                  </div>
                  <div className="detail-item">
                    <label style={{fontWeight: '600', color: '#6c757d'}}>Premium Paid:</label>
                    <span style={{fontWeight: '700', color: '#e74c3c', fontSize: '1.1rem'}}>
                      {formatEther(selectedPolicy.premium)} ETH
                    </span>
                  </div>
                  {selectedPolicy.claimed && (
                    <div className="detail-item">
                      <label style={{fontWeight: '600', color: '#6c757d'}}>Claim Amount:</label>
                      <span style={{fontWeight: '700', color: '#3498db', fontSize: '1.1rem'}}>
                        {formatEther(selectedPolicy.claimAmount)} ETH
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-section" style={{padding: '24px', borderBottom: '1px solid rgba(0,0,0,0.1)'}}>
                <h4 style={{color: '#2c3e50', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <i className="fas fa-calendar-alt"></i> Coverage Period
                </h4>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                  <div className="detail-item">
                    <label style={{fontWeight: '600', color: '#6c757d'}}>Start Date:</label>
                    <span style={{fontWeight: '500', color: '#2c3e50'}}>{formatDate(selectedPolicy.startTime)}</span>
                  </div>
                  <div className="detail-item">
                    <label style={{fontWeight: '600', color: '#6c757d'}}>End Date:</label>
                    <span style={{fontWeight: '500', color: '#2c3e50'}}>{formatDate(selectedPolicy.endTime)}</span>
                  </div>
                  <div className="detail-item">
                    <label style={{fontWeight: '600', color: '#6c757d'}}>Days Remaining:</label>
                    <span style={{fontWeight: '500', color: '#2c3e50'}}>
                      {getDaysRemaining(selectedPolicy.endTime)} days
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section" style={{padding: '24px'}}>
                <h4 style={{color: '#2c3e50', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <i className="fas fa-database"></i> Blockchain Information
                </h4>
                <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '16px'}}>
                  <div className="detail-item">
                    <label style={{fontWeight: '600', color: '#6c757d'}}>Transaction Hash:</label>
                    <span style={{fontWeight: '500', color: '#2c3e50', fontFamily: 'monospace', fontSize: '0.9rem', wordBreak: 'break-all'}}>
                      {selectedPolicy.transactionHash}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label style={{fontWeight: '600', color: '#6c757d'}}>Block Number:</label>
                    <span style={{fontWeight: '500', color: '#2c3e50'}}>{selectedPolicy.blockNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{padding: '20px', borderTop: '1px solid rgba(0,0,0,0.1)', display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
              <button onClick={closeDetails} className="btn btn-secondary">
                Close
              </button>
              <button onClick={() => downloadCertificate(selectedPolicy)} className="btn btn-primary">
                <i className="fas fa-print"></i> Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 信息说明区域 */}
      <div className="info-section">
        <h4>
          <i className="fas fa-info-circle"></i> About Your Insurance Policies
        </h4>
        <p>
          Your agricultural insurance policies are securely stored on the blockchain. 
          Each policy provides coverage against extreme weather events for your crops. 
          Policies are automatically active for 90 days from creation and claims are 
          processed based on verified weather data.
        </p>
        <div className="risk-warning">
          <i className="fas fa-exclamation-triangle"></i>
          <div>
            <strong>Important:</strong> Insurance coverage is subject to terms and conditions. 
            Claims are automatically processed when extreme weather events are detected by our oracle system.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyList;