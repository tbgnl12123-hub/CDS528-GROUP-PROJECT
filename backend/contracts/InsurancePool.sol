// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract InsurancePool {
    struct Investor {
        uint256 investedAmount;
        uint256 sharePercentage;
        uint256 claimedRewards;
        bool exists;
    }

    struct PoolStats {
        uint256 totalCapital;
        uint256 utilizedCapital;
        uint256 availableCapital;
        uint256 totalPremiums;
        uint256 totalPayouts;
        uint256 investorCount;
    }

    mapping(address => Investor) public investors;
    address[] public investorAddresses;

    uint256 public totalCapital;
    uint256 public utilizedCapital;
    uint256 public totalPremiums;
    uint256 public totalPayouts;
    uint256 public constant MIN_INVESTMENT = 0.01 ether;

    address public owner;

    event InvestmentAdded(address indexed investor, uint256 amount, uint256 share);
    event PremiumReceived(uint256 amount, address indexed from);
    event PayoutMade(uint256 amount, address indexed to, string reason);
    event RewardsClaimed(address indexed investor, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function invest() external payable {
        require(msg.value >= MIN_INVESTMENT, "Investment below minimum");
        require(msg.sender != owner, "Owner cannot invest");

        uint256 investment = msg.value;
        totalCapital += investment;

        if (!investors[msg.sender].exists) {
            investors[msg.sender] = Investor({
                investedAmount: investment,
                sharePercentage: 0,
                claimedRewards: 0,
                exists: true
            });
            investorAddresses.push(msg.sender);
        } else {
            investors[msg.sender].investedAmount += investment;
        }

        _updateSharePercentages();

        emit InvestmentAdded(msg.sender, investment, investors[msg.sender].sharePercentage);
    }

    function recordPremium(uint256 amount) external onlyOwner {
        totalPremiums += amount;
        emit PremiumReceived(amount, msg.sender);
    }

    function executePayout(address payable farmer, uint256 amount, string memory reason)
        external
        onlyOwner
    {
        require(amount <= getAvailableCapital(), "Insufficient capital for payout");

        utilizedCapital += amount;
        totalPayouts += amount;

        (bool success, ) = farmer.call{value: amount}("");
        require(success, "Payout failed");

        emit PayoutMade(amount, farmer, reason);
    }

    function claimRewards() external {
        require(investors[msg.sender].exists, "Not an investor");

        uint256 totalRewards = calculateAvailableRewards(msg.sender);
        require(totalRewards > 0, "No rewards available");

        investors[msg.sender].claimedRewards += totalRewards;

        (bool success, ) = msg.sender.call{value: totalRewards}("");
        require(success, "Reward claim failed");

        emit RewardsClaimed(msg.sender, totalRewards);
    }

    function calculateAvailableRewards(address investor) public view returns (uint256) {
        if (!investors[investor].exists || totalCapital == 0) return 0;

        Investor memory inv = investors[investor];
        uint256 totalRewards = totalPremiums > totalPayouts ? totalPremiums - totalPayouts : 0;

        return (totalRewards * inv.sharePercentage) / 10000;
    }

    function _updateSharePercentages() internal {
        for (uint i = 0; i < investorAddresses.length; i++) {
            address investor = investorAddresses[i];
            if (totalCapital > 0) {
                uint256 percentage = (investors[investor].investedAmount * 10000) / totalCapital;
                investors[investor].sharePercentage = percentage;
            }
        }
    }

    function getPoolStats() external view returns (PoolStats memory) {
        return PoolStats({
            totalCapital: totalCapital,
            utilizedCapital: utilizedCapital,
            availableCapital: getAvailableCapital(),
            totalPremiums: totalPremiums,
            totalPayouts: totalPayouts,
            investorCount: investorAddresses.length
        });
    }

    function getAvailableCapital() public view returns (uint256) {
        return totalCapital - utilizedCapital;
    }

    function getInvestorCount() external view returns (uint256) {
        return investorAddresses.length;
    }

    receive() external payable {}
}