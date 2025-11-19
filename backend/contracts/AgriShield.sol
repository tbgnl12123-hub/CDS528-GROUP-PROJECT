// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./InsurancePool.sol";
import "./PolicyManager.sol";
import "./WeatherOracle.sol";

contract AgriShield {
    InsurancePool public insurancePool;
    PolicyManager public policyManager;
    WeatherOracle public weatherOracle;

    address public owner;

    event PolicyFunded(uint256 policyId, uint256 premiumAmount);
    event ClaimProcessed(uint256 policyId, address farmer, uint256 payoutAmount, string reason);

    // 存储保单位置信息
    mapping(uint256 => string) private _policyLocations;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
        insurancePool = new InsurancePool();
        policyManager = new PolicyManager();
        weatherOracle = new WeatherOracle();
    }

    // 移除未使用的 location 参数
    function createPolicy(
        string memory cropType,
        uint256 coverageAmount
    ) external payable returns (uint256) {
        uint256 policyId = policyManager.createPolicy{value: msg.value}(cropType, coverageAmount);
        insurancePool.recordPremium(msg.value);
        policyManager.activatePolicy(policyId);

        emit PolicyFunded(policyId, msg.value);
        return policyId;
    }

    // 新增：创建带位置的保单
    function createPolicyWithLocation(
        string memory cropType,
        uint256 coverageAmount,
        string memory location
    ) external payable returns (uint256) {
        uint256 policyId = policyManager.createPolicy{value: msg.value}(cropType, coverageAmount);

        // 存储位置信息
        _policyLocations[policyId] = location;

        insurancePool.recordPremium(msg.value);
        policyManager.activatePolicy(policyId);

        emit PolicyFunded(policyId, msg.value);
        return policyId;
    }

    // 使用存储的位置信息处理理赔
    function processWeatherClaim(
        uint256 policyId,
        uint256 payoutPercentage
    ) external onlyOwner {
        string memory location = _policyLocations[policyId];
        require(bytes(location).length > 0, "Policy location not set");

        (bool shouldPayout, string memory reason) = weatherOracle.checkPayoutConditions(location);
        require(shouldPayout, "No payout conditions met");

        PolicyManager.InsurancePolicy memory policy = policyManager.getPolicyDetails(policyId);
        require(policy.exists, "Policy does not exist");
        require(policy.status == PolicyManager.PolicyStatus.ACTIVE, "Policy not active");

        uint256 payoutAmount = (policy.coverageAmount * payoutPercentage) / 100;
        require(payoutAmount > 0, "Invalid payout amount");

        insurancePool.executePayout(payable(policy.farmer), payoutAmount, reason);
        policyManager.recordClaim(policyId, payoutAmount);

        emit ClaimProcessed(policyId, policy.farmer, payoutAmount, reason);
    }

    // 为特定位置处理理赔
    function processWeatherClaimForLocation(
        uint256 policyId,
        string memory location,
        uint256 payoutPercentage
    ) external onlyOwner {
        (bool shouldPayout, string memory reason) = weatherOracle.checkPayoutConditions(location);
        require(shouldPayout, "No payout conditions met");

        PolicyManager.InsurancePolicy memory policy = policyManager.getPolicyDetails(policyId);
        require(policy.exists, "Policy does not exist");
        require(policy.status == PolicyManager.PolicyStatus.ACTIVE, "Policy not active");

        uint256 payoutAmount = (policy.coverageAmount * payoutPercentage) / 100;
        require(payoutAmount > 0, "Invalid payout amount");

        insurancePool.executePayout(payable(policy.farmer), payoutAmount, reason);
        policyManager.recordClaim(policyId, payoutAmount);

        // 更新位置信息
        _policyLocations[policyId] = location;

        emit ClaimProcessed(policyId, policy.farmer, payoutAmount, reason);
    }

    function investInPool() external payable {
        insurancePool.invest{value: msg.value}();
    }

    function claimInvestorRewards() external {
        insurancePool.claimRewards();
    }

    function updateWeatherData(
        string memory location,
        int256 temperature,
        uint256 rainfall,
        uint256 humidity
    ) external onlyOwner {
        weatherOracle.updateWeatherData(location, temperature, rainfall, humidity);
    }

    function getContractStats() external view returns (
        uint256 totalCapital,
        uint256 activePolicies,
        uint256 totalInvestors,
        uint256 totalPayouts
    ) {
        totalCapital = insurancePool.totalCapital();
        activePolicies = policyManager.getActivePolicyCount();
        totalInvestors = insurancePool.getInvestorCount();
        totalPayouts = insurancePool.totalPayouts();
    }

    function getPolicyLocation(uint256 policyId) external view returns (string memory) {
        return _policyLocations[policyId];
    }

    function getSubContractAddresses() external view returns (
        address insurancePoolAddr,
        address policyManagerAddr,
        address weatherOracleAddr
    ) {
        return (address(insurancePool), address(policyManager), address(weatherOracle));
    }

    receive() external payable {}
}