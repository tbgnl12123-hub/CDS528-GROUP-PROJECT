import React, { useState } from 'react';
import AgriShieldContract from '../utils/web3';

const WeatherData = () => {
  const [formData, setFormData] = useState({
    location: '',
    temperature: '',
    rainfall: '',
    humidity: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateWeather = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const { location, temperature, rainfall, humidity } = formData;
      const result = await AgriShieldContract.updateWeatherData(
        location,
        parseInt(temperature),
        parseInt(rainfall),
        parseInt(humidity)
      );

      setResult({
        type: 'success',
        message: result.message,
        transactionHash: result.transactionHash
      });

      setFormData({
        location: '',
        temperature: '',
        rainfall: '',
        humidity: ''
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

  return (
    <div className="weather-data">
      <h2>🌤️ Weather data management</h2>
      
      <form onSubmit={updateWeather} className="weather-form">
        <div className="form-group">
          <label htmlFor="location">location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="For example: Beijing"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="temperature">temperature (℃ × 10):</label>
          <input
            type="number"
            id="temperature"
            name="temperature"
            value={formData.temperature}
            onChange={handleInputChange}
            placeholder="For example: 250 express 25°C"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="rainfall">precipitation (mm × 10):</label>
          <input
            type="number"
            id="rainfall"
            name="rainfall"
            value={formData.rainfall}
            onChange={handleInputChange}
            placeholder="For example: 100 express 10mm"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="humidity">humidity (% × 10):</label>
          <input
            type="number"
            id="humidity"
            name="humidity"
            value={formData.humidity}
            onChange={handleInputChange}
            placeholder="For example: 600 express 60%"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Updating...' : 'Update weather data'}
        </button>
      </form>

      {result && (
        <div className={`result ${result.type}`}>
          <p>{result.message}</p>
          {result.transactionHash && (
            <p>
              <small>
                transaction hash: {result.transactionHash}
              </small>
            </p>
          )}
        </div>
      )}

      <div className="info">
        <h4>Data format description:</h4>
        <ul>
          <li>Temperature: Actual temperature × 10 (25°C input 250)</li>
          <li>Rainfall: Actual rainfall × 10 (10mm input 100)</li>
          <li>Humidity: Actual humidity × 10 (60% input 600)</li>
        </ul>
      </div>
    </div>
  );
};

export default WeatherData;