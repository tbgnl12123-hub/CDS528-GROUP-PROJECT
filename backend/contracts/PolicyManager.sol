// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PolicyManager {
    struct InsurancePolicy {
        uint256 policyId;
        address farmer;
        string cropType;
        uint256 coverageAmount;
        uint256 premiumAmount;
        uint256 startDate;
        uint256 endDate;
        uint256 claimedAmount;
        PolicyStatus status;
        bool exists;
    }

    enum PolicyStatus {
        PENDING,
        ACTIVE,
        EXPIRED,
        CLAIMED,
        CANCELLED
    }

    mapping(uint256 => InsurancePolicy) public policies;
    mapping(address => uint256[]) public farmerPolicies;
    uint256 public nextPolicyId;

    address public owner;

    event PolicyCreated(
        uint256 indexed policyId,
        address indexed farmer,
        string cropType,
        uint256 coverageAmount,
        uint256 premiumAmount
    );
    event PolicyActivated(uint256 indexed policyId);
    event PolicyExpired(uint256 indexed policyId);
    event ClaimFiled(uint256 indexed policyId, uint256 claimedAmount);

    uint256 public constant PREMIUM_RATE = 500; // 5%
    uint256 public constant MIN_COVERAGE = 0.1 ether;
    uint256 public constant POLICY_DURATION = 90 days;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
        nextPolicyId = 1;
    }

    function createPolicy(
        string memory cropType,
        uint256 coverageAmount
    ) external payable returns (uint256) {
        require(coverageAmount >= MIN_COVERAGE, "Coverage below minimum");
        require(bytes(cropType).length > 0, "Crop type required");

        uint256 premiumAmount = (coverageAmount * PREMIUM_RATE) / 10000;
        require(msg.value >= premiumAmount, "Insufficient premium payment");

        uint256 policyId = nextPolicyId++;

        policies[policyId] = InsurancePolicy({
            policyId: policyId,
            farmer: msg.sender,
            cropType: cropType,
            coverageAmount: coverageAmount,
            premiumAmount: premiumAmount,
            startDate: block.timestamp,
            endDate: block.timestamp + POLICY_DURATION,
            claimedAmount: 0,
            status: PolicyStatus.PENDING,
            exists: true
        });

        farmerPolicies[msg.sender].push(policyId);

        emit PolicyCreated(policyId, msg.sender, cropType, coverageAmount, premiumAmount);

        return policyId;
    }

    function activatePolicy(uint256 policyId) external onlyOwner {
        require(policies[policyId].exists, "Policy does not exist");
        require(policies[policyId].status == PolicyStatus.PENDING, "Policy not pending");

        policies[policyId].status = PolicyStatus.ACTIVE;
        emit PolicyActivated(policyId);
    }

    function recordClaim(uint256 policyId, uint256 claimAmount) external onlyOwner {
        InsurancePolicy storage policy = policies[policyId];
        require(policy.exists, "Policy does not exist");
        require(policy.status == PolicyStatus.ACTIVE, "Policy not active");
        require(block.timestamp <= policy.endDate, "Policy expired");
        require(claimAmount <= policy.coverageAmount - policy.claimedAmount, "Claim exceeds coverage");

        policy.claimedAmount += claimAmount;

        if (policy.claimedAmount >= policy.coverageAmount) {
            policy.status = PolicyStatus.CLAIMED;
        }

        emit ClaimFiled(policyId, claimAmount);
    }

    function checkAndExpirePolicies() external {
        for (uint256 i = 1; i < nextPolicyId; i++) {
            if (policies[i].exists &&
                policies[i].status == PolicyStatus.ACTIVE &&
                block.timestamp > policies[i].endDate) {
                policies[i].status = PolicyStatus.EXPIRED;
                emit PolicyExpired(i);
            }
        }
    }

    function getFarmerPolicies(address farmer) external view returns (uint256[] memory) {
        return farmerPolicies[farmer];
    }

    function getPolicyDetails(uint256 policyId) external view returns (InsurancePolicy memory) {
        require(policies[policyId].exists, "Policy does not exist");
        return policies[policyId];
    }

    function getActivePolicyCount() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 1; i < nextPolicyId; i++) {
            if (policies[i].exists && policies[i].status == PolicyStatus.ACTIVE) {
                count++;
            }
        }
        return count;
    }
}