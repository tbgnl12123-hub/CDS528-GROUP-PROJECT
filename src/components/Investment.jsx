import React, { useState } from 'react';
import AgriShieldContract from '../utils/web3';

const Investment = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const invest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const result = await AgriShieldContract.investInPool(amount);
      
      setResult({
        type: 'success',
        message: result.message,
        transactionHash: result.transactionHash
      });

      setAmount('');
    } catch (error) {
      setResult({
        type: 'error',
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="investment">
      <h2>💰 Fund pool investment</h2>
      
      <form onSubmit={invest} className="investment-form">
        <div className="form-group">
          <label htmlFor="amount">investment amount (ETH):</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0.01"
            placeholder="For example: 1.0"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'In Investment...' : 'Investment'}
        </button>
      </form>

      {result && (
        <div className={`result ${result.type}`}>
          <p>{result.message}</p>
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
        <h4>Investment Description:</h4>
        <ul>
          <li>Minimum investment amount: 0.01 ETH</li>
          <li>Investors share premium income</li>
          <li>Jointly bear insurance risks</li>
          <li>You can withdraw profits at any time</li>
        </ul>
      </div>
    </div>
  );
};

export default Investment;