import React, { useState } from 'react';
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
        throw new Error('Select crop type');
      }

      const result = await AgriShieldContract.createPolicy(
        cropType,
        coverageAmount,
        location || null
      );

      setResult({
        type: 'success',
        message: result.message,
        transactionHash: result.transactionHash
      });

      setFormData({
        cropType: '',
        coverageAmount: '',
        location: ''
      });
    } catch (error) {
      setResult({
        type: 'error',
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const premium = formData.coverageAmount ? (formData.coverageAmount * 0.05).toFixed(4) : '0';

  return (
    <div className="policy-management">
      <h2><i className="fas fa-file-contract"></i> Policy Management</h2>
      
      <form onSubmit={createPolicy} className="policy-form">
        <div className="form-group">
          <label htmlFor="cropType">
            <i className="fas fa-seedling"></i> crop type
          </label>
          <select
            id="cropType"
            name="cropType"
            value={formData.cropType}
            onChange={handleInputChange}
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
            <i className="fas fa-shield-alt"></i> sum insured (ETH)
          </label>
          <input
            type="number"
            id="coverageAmount"
            name="coverageAmount"
            value={formData.coverageAmount}
            onChange={handleInputChange}
            step="0.01"
            min="0.1"
            placeholder="For example: 1.0"
            required
          />
          <small>premium: {premium} ETH (The insurance amount 5%)</small>
        </div>

        <div className="form-group">
          <label htmlFor="location">
            <i className="fas fa-map-marker-alt"></i> Insurance location (optional)
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="For example: Haidian District, Beijing"
          />
          <small>Specify the geographical location covered by insurance</small>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Creating...
            </>
          ) : (
            <>
              <i className="fas fa-plus-circle"></i>
              Create policy
            </>
          )}
        </button>
      </form>

      {result && (
        <div className={`result ${result.type}`}>
          <p>
            {result.type === 'success' ? (
              <i className="fas fa-check-circle"></i>
            ) : (
              <i className="fas fa-exclamation-circle"></i>
            )}
            {result.message}
          </p>
          {result.transactionHash && (
            <p>
              <small>
                Transaction hash: {result.transactionHash}
              </small>
            </p>
          )}
        </div>
      )}

      <div className="info">
        <h4><i className="fas fa-lightbulb"></i> Insurance Description</h4>
        <ul>
          <li>The policy is valid for 90 days</li>
          <li>The premium is 5% of the insured amount</li>
          <li>Automatically claim compensation when extreme weather events occur</li>
          <li>The claim amount shall be paid proportionally based on the severity of the disaster</li>
          <li>Support insurance for multiple types of crops</li>
        </ul>
      </div>
    </div>
  );
};

export default PolicyManagement;