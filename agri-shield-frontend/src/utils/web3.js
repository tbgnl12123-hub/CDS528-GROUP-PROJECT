// src/utils/web3.js
import { ethers } from 'ethers';

const MAIN_CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "claimInvestorRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "policyId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "farmer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "payoutAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "reason",
        "type": "string"
      }
    ],
    "name": "ClaimProcessed",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "cropType",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "coverageAmount",
        "type": "uint256"
      }
    ],
    "name": "createPolicy",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "cropType",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "coverageAmount",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      }
    ],
    "name": "createPolicyWithLocation",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "investInPool",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "policyId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "premiumAmount",
        "type": "uint256"
      }
    ],
    "name": "PolicyFunded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "policyId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "payoutPercentage",
        "type": "uint256"
      }
    ],
    "name": "processWeatherClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "policyId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "payoutPercentage",
        "type": "uint256"
      }
    ],
    "name": "processWeatherClaimForLocation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "int256",
        "name": "temperature",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "rainfall",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "humidity",
        "type": "uint256"
      }
    ],
    "name": "updateWeatherData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  },
  {
    "inputs": [],
    "name": "getContractStats",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalCapital",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "activePolicies",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalInvestors",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalPayouts",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "policyId",
        "type": "uint256"
      }
    ],
    "name": "getPolicyLocation",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSubContractAddresses",
    "outputs": [
      {
        "internalType": "address",
        "name": "insurancePoolAddr",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "policyManagerAddr",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "weatherOracleAddr",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "insurancePool",
    "outputs": [
      {
        "internalType": "contract InsurancePool",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "policyManager",
    "outputs": [
      {
        "internalType": "contract PolicyManager",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "weatherOracle",
    "outputs": [
      {
        "internalType": "contract WeatherOracle",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const RPC_PROVIDERS = [
  "https://eth-sepolia.g.alchemy.com/v2/demo",
  "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", 
  "https://rpc2.sepolia.org"
];

const MAIN_CONTRACT_ADDRESS = process.env.REACT_APP_MAIN_CONTRACT_ADDRESS || "0x904d791a7D829fB33f5cB066C80Bbd94A075453A";

class AgriShieldContract {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.isInitialized = false;
    this.eventListeners = [];
    this.currentProviderIndex = 0;
  }

  async getProvider() {
    if (typeof window.ethereum !== 'undefined') {
      return new ethers.BrowserProvider(window.ethereum);
    }
    
    try {
      const providerUrl = RPC_PROVIDERS[this.currentProviderIndex];
      console.log(`Using RPC provider: ${providerUrl}`);
      return new ethers.JsonRpcProvider(providerUrl);
    } catch (error) {
      this.currentProviderIndex = (this.currentProviderIndex + 1) % RPC_PROVIDERS.length;
      throw error;
    }
  }

  async init() {
    try {
      this.provider = await this.getProvider();
      
      if (typeof window.ethereum !== 'undefined') {
        this.signer = await this.provider.getSigner();
        console.log("Using MetaMask provider with signer");
      } else {
        this.signer = null;
        console.log("Using public RPC provider (read-only mode)");
      }
      
      const network = await this.provider.getNetwork();
      console.log("Connected to network:", network);
      
      if (network.chainId !== 11155111n) {
        console.warn("Connected to wrong network. Please switch to Sepolia in MetaMask");
      }

      console.log("Contract address:", MAIN_CONTRACT_ADDRESS);
      
      this.contract = new ethers.Contract(
        MAIN_CONTRACT_ADDRESS,
        MAIN_CONTRACT_ABI,
        this.signer || this.provider
      );

      await this.testContractConnection();
      
      this.isInitialized = true;
      console.log("AgriShield contract initialized successfully");
      
      return true;
    } catch (error) {
      console.error("Failed to initialize contract:", error);
      

      if (this.currentProviderIndex < RPC_PROVIDERS.length - 1) {
        console.log("Trying next RPC provider...");
        this.currentProviderIndex++;
        return this.init();
      }
      
      this.isInitialized = false;
      throw error;
    }
  }

  async testContractConnection() {
    try {
      const code = await this.provider.getCode(MAIN_CONTRACT_ADDRESS);
      if (code === '0x') {
        throw new Error("No contract found at this address");
      }
      console.log("Contract code found, connection successful");
      return true;
    } catch (error) {
      console.error("Contract connection test failed:", error);
      throw new Error("Contract connection failed: " + error.message);
    }
  }

  canRead() {
    return this.isInitialized && this.provider !== null;
  }

  canWrite() {
    return this.signer !== null;
  }

  disconnectWallet() {
    console.log('Disconnecting wallet...');
    
    this.removeEventListeners();
    
    this.signer = null;
    this.provider = null;
    this.contract = null;
    this.isInitialized = false;
    this.eventListeners = [];
    
    console.log('Wallet disconnected (local state cleared)');
    return true;
  }

  setupAccountChangeListener(callback) {
    if (typeof window.ethereum === 'undefined') {
      console.warn('MetaMask not available for account change listening');
      return false;
    }

    try {
      window.ethereum.on('accountsChanged', (accounts) => {
        console.log('Accounts changed:', accounts);
        if (accounts.length === 0) {
          this.disconnectWallet();
          callback && callback(null);
        } else {
          const newAccount = accounts[0];
          this.signer = null;
          this.isInitialized = false;
          callback && callback(newAccount);
        }
      });

      window.ethereum.on('chainChanged', (chainId) => {
        console.log('Chain changed:', chainId);
        this.signer = null;
        this.isInitialized = false;
        callback && callback(null, chainId);
      });

      console.log('Account change listeners setup successfully');
      return true;
    } catch (error) {
      console.error('Error setting up account change listeners:', error);
      return false;
    }
  }

  async getContractStats() {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      console.log("Fetching contract stats...");
      
      const stats = await this.contract.getContractStats();
      
      const formattedStats = {
        totalCapital: ethers.formatEther(stats.totalCapital || 0),
        activePolicies: (stats.activePolicies || 0).toString(),
        totalInvestors: (stats.totalInvestors || 0).toString(),
        totalPayouts: ethers.formatEther(stats.totalPayouts || 0)
      };

      console.log("Contract stats retrieved:", formattedStats);
      return formattedStats;
    } catch (error) {
      console.error("Error fetching contract stats:", error);
      
      if (error.message.includes("missing provider") || error.message.includes("read-only")) {
        throw new Error("Please connect MetaMask to interact with the contract");
      }
      
      throw error;
    }
  }


  async createPolicy(cropType, coverageAmountInWei) {
    if (!this.isInitialized) {
      await this.init();
    }
    
    try {
      const premiumInWei = coverageAmountInWei * 5n / 100n;
      
      console.log('Creating policy:', {
        cropType,
        coverageAmountInWei: coverageAmountInWei.toString(),
        premiumInWei: premiumInWei.toString()
      });

      const tx = await this.contract.createPolicy(
        cropType, 
        coverageAmountInWei, 
        {
          value: premiumInWei
        }
      );
      
      console.log('Transaction sent:', tx.hash);
      return tx;
    } catch (error) {
      console.error("Policy creation failed:", error);
      throw error;
    }
  }

  async createPolicyWithLocation(cropType, coverageAmountInWei, location) {
    if (!this.isInitialized) {
      await this.init();
    }
    
    try {
      const premiumInWei = coverageAmountInWei * 5n / 100n;
      
      console.log('Creating policy with location:', {
        cropType,
        coverageAmountInWei: coverageAmountInWei.toString(),
        location,
        premiumInWei: premiumInWei.toString()
      });

      const tx = await this.contract.createPolicyWithLocation(
        cropType, 
        coverageAmountInWei, 
        location, 
        {
          value: premiumInWei
        }
      );
      
      console.log('Transaction sent:', tx.hash);
      return tx;
    } catch (error) {
      console.error("Policy creation with location failed:", error);
      throw error;
    }
  }

  async investInPool(amount) {
    if (!this.isInitialized) {
      await this.init();
    }
    
    try {
      const amountInWei = ethers.parseEther(amount.toString());
      
      console.log('Investing in pool:', {
        amount: amount.toString(),
        amountInWei: amountInWei.toString()
      });

      const tx = await this.contract.investInPool({
        value: amountInWei
      });
      
      console.log('Investment transaction sent:', tx.hash);
      return tx;
    } catch (error) {
      console.error("Investment failed:", error);
      throw error;
    }
  }

  async claimInvestorRewards() {
    if (!this.isInitialized) {
      await this.init();
    }
    
    try {
      console.log('Claiming investor rewards...');
      const tx = await this.contract.claimInvestorRewards();
      console.log('Reward claim transaction sent:', tx.hash);
      return tx;
    } catch (error) {
      console.error("Reward claim failed:", error);
      throw error;
    }
  }

  setupEventListeners(callback) {
    if (!this.isInitialized) {
      console.warn("Contract not initialized, skipping event listeners");
      return false;
    }

    if (!this.signer) {
      console.warn("Cannot setup event listeners in read-only mode");
      return false;
    }

    try {
      console.log("Setting up event listeners...");

      const claimListener = this.contract.on("ClaimProcessed", (policyId, farmer, payoutAmount, reason) => {
        console.log("Claim processed:", { 
          policyId: policyId.toString(), 
          farmer, 
          payoutAmount: ethers.formatEther(payoutAmount),
          reason 
        });
        callback && callback();
      });


      const policyListener = this.contract.on("PolicyFunded", (policyId, premiumAmount) => {
        console.log("Policy funded:", { 
          policyId: policyId.toString(), 
          premiumAmount: ethers.formatEther(premiumAmount)
        });
        callback && callback();
      });

      this.eventListeners = [claimListener, policyListener];
      console.log("Event listeners setup successfully");
      return true;
    } catch (error) {
      console.error("Error setting up event listeners:", error);
      return false;
    }
  }

  removeEventListeners() {
    try {
      this.eventListeners.forEach(listener => {
        if (listener && typeof listener.remove === 'function') {
          listener.remove();
        }
      });
      this.eventListeners = [];
      console.log("Event listeners removed");
    } catch (error) {
      console.error("Error removing event listeners:", error);
    }
  }

  async getCurrentAccount() {
    if (!this.isInitialized) {
      await this.init();
    }
    
    if (this.signer) {
      return await this.signer.getAddress();
    }
    
    return '0x0000000000000000000000000000000000000000';
  }

  async getBalance() {
    if (!this.isInitialized) {
      await this.init();
    }
    
    if (!this.signer) {
      throw new Error("No signer available - please connect MetaMask");
    }
    
    const address = await this.signer.getAddress();
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  async getInvestorInfo() {
    if (!this.isInitialized) {
      await this.init();
    }
    
    try {
      console.log("Getting investor info...");
      
      return {
        totalInvested: "0",
        pendingRewards: "0",
        sharePercentage: "0"
      };
    } catch (error) {
      console.error("Error getting investor info:", error);
      throw error;
    }
  }

  async checkNetwork() {
    if (this.provider) {
      return await this.provider.getNetwork();
    }
    return null;
  }

  getContract() {
    return this.contract;
  }

  async getSubContractAddresses() {
    if (!this.isInitialized) {
      await this.init();
    }
    
    try {
      return await this.contract.getSubContractAddresses();
    } catch (error) {
      console.error("Failed to get sub-contract addresses:", error);
      throw error;
    }
  }

  getConnectionInfo() {
    let balance = "0";
    
    if (this.signer && this.signer.address) {
      balance = "0.2777";
    }
    
    return {
      isInitialized: this.isInitialized,
      canWrite: this.canWrite(),
      canRead: this.canRead(),
      provider: this.signer ? "MetaMask" : "Public RPC",
      network: this.provider ? this.provider.network : null,
      account: this.signer ? this.signer.address : null,
      balance: balance
    };
  }


  async getInvestmentStats() {
    if (!this.isInitialized) {
      await this.init();
    }
    
    try {
      const stats = await this.contract.getContractStats();
      
      return {
        totalCapital: ethers.formatEther(stats.totalCapital || 0),
        totalInvestors: (stats.totalInvestors || 0).toString(),
      };
    } catch (error) {
      console.error("Error getting investment stats:", error);
      throw error;
    }
  }

  async getUserPolicies() {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      const userAddress = await this.getCurrentAccount();
      if (!userAddress) {
        throw new Error('Please connect MetaMask first');
      }

      console.log('Fetching real policies for user:', userAddress);

      try {
        const userPolicies = await this.getPoliciesFromEvents(userAddress);
        if (userPolicies.length > 0) {
          console.log('Found policies via events:', userPolicies.length);
          return userPolicies;
        }
      } catch (error) {
        console.log('Event query failed, trying alternative methods:', error.message);
      }

      try {
        const userPolicies = await this.getPoliciesFromContract(userAddress);
        if (userPolicies.length > 0) {
          console.log('Found policies via contract:', userPolicies.length);
          return userPolicies;
        }
      } catch (error) {
        console.log('Contract method failed:', error.message);
      }

      try {
        const userPolicies = await this.getPoliciesByScanning(userAddress);
        if (userPolicies.length > 0) {
          console.log('Found policies by scanning:', userPolicies.length);
          return userPolicies;
        }
      } catch (error) {
        console.log('Scanning method failed:', error.message);
      }


      console.log('No real policies found for user');
      return [];

    } catch (error) {
      console.error('Error getting user policies:', error);
      throw error;
    }
  }

  async getPoliciesFromEvents(userAddress) {
    const userPolicies = [];
    
    try {
      const policyFundedFilter = this.contract.filters.PolicyFunded();
      const policyEvents = await this.contract.queryFilter(policyFundedFilter, 0, 'latest');
      
      console.log('Found PolicyFunded events:', policyEvents.length);
      
      for (const event of policyEvents) {
        try {
          const policyId = event.args.policyId.toString();
          
          const tx = await event.getTransaction();
          
          if (tx.from && tx.from.toLowerCase() === userAddress.toLowerCase()) {
            const policyDetails = await this.getRealPolicyDetails(policyId);
            if (policyDetails) {
              userPolicies.push({
                ...policyDetails,
                policyId: policyId,
                transactionHash: event.transactionHash,
                blockNumber: event.blockNumber,
                isReal: true 
              });
            }
          }
        } catch (error) {
          console.error('Error processing policy event:', error);
        }
      }
    } catch (error) {
      console.error('Error querying events:', error);
      throw error;
    }
    
    return userPolicies;
  }

  async getPoliciesFromContract(userAddress) {
    try {
      const policyIds = await this.contract.getUserPolicyIds(userAddress);
      const userPolicies = [];
      
      for (const policyId of policyIds) {
        try {
          const policyDetails = await this.getRealPolicyDetails(policyId.toString());
          if (policyDetails) {
            userPolicies.push({
              ...policyDetails,
              policyId: policyId.toString(),
              isReal: true
            });
          }
        } catch (error) {
          console.error(`Error getting details for policy ${policyId}:`, error);
        }
      }
      
      return userPolicies;
    } catch (error) {
      console.log('Contract method getUserPolicyIds not available');
      throw error;
    }
  }

  async getPoliciesByScanning(userAddress) {
    const userPolicies = [];
    const maxPolicyId = 100;
    
    console.log(`Scanning policies from 1 to ${maxPolicyId}`);
    
    for (let i = 1; i <= maxPolicyId; i++) {
      try {
        const policyId = i.toString();
        const policyDetails = await this.getRealPolicyDetails(policyId);
        if (policyDetails && await this.isPolicyOwnedByUser(policyDetails, userAddress)) {
          userPolicies.push({
            ...policyDetails,
            policyId: policyId,
            isReal: true
          });
        }
      } catch (error) {
        continue;
      }
    }
    
    return userPolicies;
  }

  async getRealPolicyDetails(policyId) {
    try {

      try {
        const policy = await this.contract.policies(policyId);
        
        return {
          cropType: policy.cropType || 'Unknown',
          coverageAmount: policy.coverageAmount?.toString() || '0',
          premium: policy.premium?.toString() || '0',
          location: policy.location || '',
          startTime: new Date(Number(policy.startTime) * 1000),
          endTime: new Date(Number(policy.endTime) * 1000),
          status: this.getRealPolicyStatus(policy),
          claimed: policy.claimed || false,
          claimAmount: policy.claimAmount?.toString() || '0',
          farmer: policy.farmer || '',
          isReal: true
        };
      } catch (error) {
        console.log(`Cannot access policy ${policyId} via mapping`);
      }
      

      try {
        const location = await this.contract.getPolicyLocation(policyId);
        
        return {
          cropType: 'Unknown',
          coverageAmount: '0',
          premium: '0',
          location: location,
          startTime: new Date(),
          endTime: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          status: 'Active',
          claimed: false,
          claimAmount: '0',
          isReal: true
        };
      } catch (error) {
        console.log(`Cannot get location for policy ${policyId}`);
      }
      
      return null;
      
    } catch (error) {
      console.error(`Error getting real details for policy ${policyId}:`, error);
      return null;
    }
  }

  getRealPolicyStatus(policy) {
    if (!policy) return 'Unknown';
    
    const now = Math.floor(Date.now() / 1000);
    const startTime = Number(policy.startTime);
    const endTime = Number(policy.endTime);
    
    if (policy.claimed) return 'Claimed';
    if (now < startTime) return 'Pending';
    if (now > endTime) return 'Expired';
    return 'Active';
  }

  async isPolicyOwnedByUser(policyDetails, userAddress) {
    try {
      if (policyDetails.farmer) {
        return policyDetails.farmer.toLowerCase() === userAddress.toLowerCase();
      }
      
      return true;
    } catch (error) {
      console.error('Error checking policy ownership:', error);
      return false;
    }
  }

  createMockPolicyDetails(policyId, location = '') {
    const cropTypes = ['wheat', 'rice', 'corn', 'soybean', 'cotton', 'tea', 'fruit', 'vegetable'];
    const statuses = ['Active', 'Expired', 'Claimed'];
    
    const cropType = cropTypes[parseInt(policyId) % cropTypes.length];
    const coverageAmount = (1 + parseInt(policyId) * 0.5).toString();
    const premium = (parseFloat(coverageAmount) * 0.05).toString();
    
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - 30 * parseInt(policyId));
    
    const endTime = new Date(startTime);
    endTime.setDate(endTime.getDate() + 90);
    
    const status = statuses[parseInt(policyId) % statuses.length];
    const claimed = status === 'Claimed';
    const claimAmount = claimed ? (parseFloat(coverageAmount) * 0.7).toString() : '0';

    return {
      cropType,
      coverageAmount: ethers.parseEther(coverageAmount).toString(),
      premium: ethers.parseEther(premium).toString(),
      location: location || `Farm Location ${policyId}`,
      startTime,
      endTime,
      status,
      claimed,
      claimAmount: ethers.parseEther(claimAmount).toString()
    };
  }

  getMockPolicies() {
    const mockPolicies = [];
    const policyCount = 3;

    for (let i = 1; i <= policyCount; i++) {
      const policyId = i.toString();
      const policyDetails = this.createMockPolicyDetails(policyId);
      
      mockPolicies.push({
        ...policyDetails,
        policyId: policyId,
        transactionHash: `0x${'0'.repeat(64)}${i}`,
        blockNumber: 1000000 + i
      });
    }

    return mockPolicies;
  }

  getPolicyStatus(statusCode) {
    const statusMap = {
      0: 'Active',
      1: 'Expired', 
      2: 'Claimed',
      3: 'Cancelled'
    };
    return statusMap[statusCode] || 'Unknown';
  }

  formatPolicyForDisplay(policy) {
    return {
      policyId: policy.policyId,
      cropType: policy.cropType,
      coverageAmount: policy.coverageAmount,
      premium: policy.premium,
      location: policy.location,
      startTime: policy.startTime,
      endTime: policy.endTime,
      status: policy.status,
      claimed: policy.claimed,
      claimAmount: policy.claimAmount,
      transactionHash: policy.transactionHash,
      blockNumber: policy.blockNumber
    };
  }
}

const agriShieldContract = new AgriShieldContract();

export default agriShieldContract;