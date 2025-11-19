// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract WeatherOracle {
    struct WeatherData {
        uint256 timestamp;
        int256 temperature;
        uint256 rainfall;
        uint256 humidity;
        string location;
    }

    struct WeatherThresholds {
        int256 minTemperature;
        int256 maxTemperature;
        uint256 maxRainfall;
    }

    mapping(string => WeatherThresholds) public locationThresholds;
    mapping(string => WeatherData) public latestWeatherData;

    address public owner;

    event WeatherDataUpdated(string location, int256 temperature, uint256 rainfall);
    event WeatherAlert(string location, string alertType, int256 value);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;

        locationThresholds["Beijing"] = WeatherThresholds({
            minTemperature: -50,
            maxTemperature: 400,
            maxRainfall: 500
        });

        locationThresholds["Shanghai"] = WeatherThresholds({
            minTemperature: -20,
            maxTemperature: 380,
            maxRainfall: 600
        });
    }

    function updateWeatherData(
        string memory location,
        int256 temperature,
        uint256 rainfall,
        uint256 humidity
    ) external onlyOwner {
        latestWeatherData[location] = WeatherData({
            timestamp: block.timestamp,
            temperature: temperature,
            rainfall: rainfall,
            humidity: humidity,
            location: location
        });

        emit WeatherDataUpdated(location, temperature, rainfall);

        _checkWeatherAlerts(location, temperature, rainfall);
    }

    function _checkWeatherAlerts(string memory location, int256 temperature, uint256 rainfall) internal {
        WeatherThresholds memory thresholds = locationThresholds[location];

        if (temperature < thresholds.minTemperature) {
            emit WeatherAlert(location, "LOW_TEMPERATURE", temperature);
        }

        if (temperature > thresholds.maxTemperature) {
            emit WeatherAlert(location, "HIGH_TEMPERATURE", temperature);
        }

        if (rainfall > thresholds.maxRainfall) {
            emit WeatherAlert(location, "HEAVY_RAINFALL", int256(rainfall));
        }
    }

    function setWeatherThresholds(
        string memory location,
        int256 minTemperature,
        int256 maxTemperature,
        uint256 maxRainfall
    ) external onlyOwner {
        locationThresholds[location] = WeatherThresholds({
            minTemperature: minTemperature,
            maxTemperature: maxTemperature,
            maxRainfall: maxRainfall
        });
    }

    function checkPayoutConditions(string memory location) external view returns (bool, string memory) {
        WeatherData memory data = latestWeatherData[location];
        WeatherThresholds memory thresholds = locationThresholds[location];

        if (data.timestamp == 0) {
            return (false, "No weather data available");
        }

        if (data.temperature < thresholds.minTemperature) {
            return (true, "Extreme low temperature");
        }

        if (data.temperature > thresholds.maxTemperature) {
            return (true, "Extreme high temperature");
        }

        if (data.rainfall > thresholds.maxRainfall) {
            return (true, "Heavy rainfall");
        }

        return (false, "Normal weather conditions");
    }

    function getWeatherData(string memory location) external view returns (WeatherData memory) {
        return latestWeatherData[location];
    }
}