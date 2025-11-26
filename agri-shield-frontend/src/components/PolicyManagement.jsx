import React, { useState } from 'react';
import { ethers } from 'ethers';
import AgriShieldContract from '../utils/web3';

const PolicyManagement = () => {
  const [formData, setFormData] = useState({
    cropType: '',
    coverageAmount: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const cropOptions = [
    { value: '', label: 'Select crop type' },
    { value: 'wheat', label: '🌾 wheat' },
    { value: 'rice', label: '🌱 rice' },
    { value: 'corn', label: '🌽 corn' },
    { value: 'soybean', label: '🫘 soybean' },
    { value: 'cotton', label: '🧵 cotton' },
    { value: 'tea', label: '🍃 tea' },
    { value: 'fruit', label: '🍎 fruit' },
    { value: 'vegetable', label: '🥦 vegetable' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createPolicy = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const { cropType, coverageAmount, location } = formData;
      
      if (!cropType) {
        throw new Error('Please select a crop type');
      }

      if (!coverageAmount || parseFloat(coverageAmount) <= 0) {
        throw new Error('Please enter a valid insurance amount');
      }

      console.log('Creating policy with:', {
        cropType,
        coverageAmount,
        location: location || ''
      });

      await AgriShieldContract.init();

      if (!AgriShieldContract.canWrite()) {
        throw new Error('Please connect MetaMask to create a policy');
      }

      const coverageAmountInWei = ethers.parseEther(coverageAmount.toString());

      console.log('Converted amount:', {
        coverageAmountInWei: coverageAmountInWei.toString()
      });

      let transaction;
      
      if (location && location.trim() !== '') {
        console.log('Using createPolicyWithLocation with location:', location);
        transaction = await AgriShieldContract.createPolicyWithLocation(
          cropType,                    // string
          coverageAmountInWei,         // BigInt (wei)
          location                     // string
        );
      } else {
        console.log('Using createPolicy without location');
        transaction = await AgriShieldContract.createPolicy(
          cropType,                    // string
          coverageAmountInWei          // BigInt (wei)
        );
      }

      console.log('Transaction sent:', transaction.hash);
      
      const receipt = await transaction.wait();
      console.log('Policy created successfully!', receipt);

      setResult({
        type: 'success',
        message: `Policy created successfully! ${location ? `Location: ${location}` : ''}`,
        transactionHash: transaction.hash
      });

      setFormData({
        cropType: '',
        coverageAmount: '',
        location: ''
      });

    } catch (error) {
      console.error('Error creating policy:', error);
      
      let errorMessage = error.message;
      
      if (error.message.includes('Invalid FixedNumber string value')) {
        errorMessage = 'Contract parameter error: Please check your inputs and try again.';
      } else if (error.message.includes('user rejected transaction')) {
        errorMessage = 'Transaction was cancelled by user.';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient ETH balance to pay the premium.';
      } else if (error.message.includes('non-payable')) {
        errorMessage = 'Contract function error. Please check contract configuration.';
      } else if (error.message.includes('value out-of-bounds')) {
        errorMessage = 'Insurance amount is too small or too large.';
      } else if (error.message.includes('createPolicyWithLocation is not a function')) {
        errorMessage = 'Contract method not available. Please check contract configuration.';
      } else if (error.message.includes('Please connect MetaMask')) {
        errorMessage = 'Please connect MetaMask to create a policy.';
      }

      setResult({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const premium = formData.coverageAmount ? (parseFloat(formData.coverageAmount) * 0.05).toFixed(4) : '0.0000';

  return (
    <div className="policy-management">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <i className="fas fa-file-contract"></i> Policy Management
          </h2>
        </div>

        {/* 结果显示 */}
        {result && (
          <div className={`result-message ${result.type}`}>
            <div className="message-content">
              {result.type === 'success' ? (
                <i className="fas fa-check-circle"></i>
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

        <form onSubmit={createPolicy} className="policy-form">
          <div className="input-group">
            <div className="form-group">
              <label htmlFor="cropType">
                <i className="fas fa-seedling"></i> Crop Type
              </label>
              <select
                id="cropType"
                name="cropType"
                value={formData.cropType}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                {cropOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="coverageAmount">
                <i className="fas fa-shield-alt"></i> Sum Insured (ETH)
              </label>
              <input
                type="number"
                id="coverageAmount"
                name="coverageAmount"
                value={formData.coverageAmount}
                onChange={handleInputChange}
                className="form-control"
                step="0.01"
                min="0.1"
                placeholder="For example: 1.0"
                required
              />
              <div className="form-hint">
                Premium: {premium} ETH (5% of insured amount)
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">
              <i className="fas fa-map-marker-alt"></i> Insurance Location (optional)
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="form-control"
              placeholder="For example: Haidian District, Beijing"
            />
            <div className="form-hint">
              Specify the geographical location covered by insurance
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !formData.cropType || !formData.coverageAmount}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Creating Policy...
              </>
            ) : (
              <>
                <i className="fas fa-plus-circle"></i>
                Create Policy
              </>
            )}
          </button>
        </form>

        {/* 保险描述 */}
        <div className="feature-list">
          <div className="feature-item">
            <i className="fas fa-calendar-check feature-icon"></i>
            <div>The policy is valid for 90 days</div>
          </div>
          <div className="feature-item">
            <i className="fas fa-percentage feature-icon"></i>
            <div>The premium is 5% of the insured amount</div>
          </div>
          <div className="feature-item">
            <i className="fas fa-bolt feature-icon"></i>
            <div>Automatically claim compensation when extreme weather events occur</div>
          </div>
          <div className="feature-item">
            <i className="fas fa-chart-pie feature-icon"></i>
            <div>The claim amount shall be paid proportionally based on the severity of the disaster</div>
          </div>
          <div className="feature-item">
            <i className="fas fa-seedling feature-icon"></i>
            <div>Support insurance for multiple types of crops</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyManagement;