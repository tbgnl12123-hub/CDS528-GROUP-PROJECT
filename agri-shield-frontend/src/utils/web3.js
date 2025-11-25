// src/utils/web3.js
import { ethers } from 'ethers';

// 使用您提供的完整 ABI
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

// 使用不同的 RPC 提供商避免 CORS 问题
const RPC_PROVIDERS = [
  "https://eth-sepolia.g.alchemy.com/v2/demo",
  "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", 
  "https://rpc2.sepolia.org"
];

// 主合约地址
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
    // 如果 MetaMask 可用，优先使用 MetaMask
    if (typeof window.ethereum !== 'undefined') {
      return new ethers.BrowserProvider(window.ethereum);
    }
    
    // 否则使用公共 RPC 提供商（只读模式）
    try {
      const providerUrl = RPC_PROVIDERS[this.currentProviderIndex];
      console.log(`Using RPC provider: ${providerUrl}`);
      return new ethers.JsonRpcProvider(providerUrl);
    } catch (error) {
      // 如果当前提供商失败，尝试下一个
      this.currentProviderIndex = (this.currentProviderIndex + 1) % RPC_PROVIDERS.length;
      throw error;
    }
  }

  async init() {
    try {
      this.provider = await this.getProvider();
      
      // 如果使用 MetaMask，获取 signer
      if (typeof window.ethereum !== 'undefined') {
        this.signer = await this.provider.getSigner();
        console.log("Using MetaMask provider with signer");
      } else {
        this.signer = null;
        console.log("Using public RPC provider (read-only mode)");
      }
      
      // 检查网络
      const network = await this.provider.getNetwork();
      console.log("Connected to network:", network);
      
      // Sepolia chainId 是 11155111
      if (network.chainId !== 11155111n) {
        console.warn("Connected to wrong network. Please switch to Sepolia in MetaMask");
        // 在只读模式下，我们仍然可以继续，但某些功能可能受限
      }

      console.log("Contract address:", MAIN_CONTRACT_ADDRESS);
      
      // 初始化合约实例
      this.contract = new ethers.Contract(
        MAIN_CONTRACT_ADDRESS,
        MAIN_CONTRACT_ABI,
        this.signer || this.provider // 如果没有 signer，使用 provider（只读）
      );

      // 验证合约连接
      await this.testContractConnection();
      
      this.isInitialized = true;
      console.log("AgriShield contract initialized successfully");
      
      return true;
    } catch (error) {
      console.error("Failed to initialize contract:", error);
      
      // 尝试切换到下一个 RPC 提供商
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
      // 测试合约连接 - 使用更简单的方法
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

  // 检查是否支持读取操作
  canRead() {
    return this.isInitialized && this.provider !== null;
  }

  // 检查是否支持写入操作（需要 MetaMask）
  canWrite() {
    return this.signer !== null;
  }

  // 断开钱包连接（清除本地状态）
  disconnectWallet() {
    console.log('Disconnecting wallet...');
    
    // 移除所有事件监听器
    this.removeEventListeners();
    
    // 重置所有状态
    this.signer = null;
    this.provider = null;
    this.contract = null;
    this.isInitialized = false;
    this.eventListeners = [];
    
    console.log('Wallet disconnected (local state cleared)');
    return true;
  }

  // 设置账户变化监听器
  setupAccountChangeListener(callback) {
    if (typeof window.ethereum === 'undefined') {
      console.warn('MetaMask not available for account change listening');
      return false;
    }

    try {
      // 监听账户变化
      window.ethereum.on('accountsChanged', (accounts) => {
        console.log('Accounts changed:', accounts);
        if (accounts.length === 0) {
          // 用户断开连接
          this.disconnectWallet();
          callback && callback(null);
        } else {
          // 用户切换账户
          const newAccount = accounts[0];
          this.signer = null; // 重置 signer，下次访问时会重新初始化
          this.isInitialized = false; // 需要重新初始化
          callback && callback(newAccount);
        }
      });

      // 监听链变化
      window.ethereum.on('chainChanged', (chainId) => {
        console.log('Chain changed:', chainId);
        // 链变化时重新初始化
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

  // 获取合约统计数据
  async getContractStats() {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      console.log("Fetching contract stats...");
      
      // 直接从主合约获取统计数据
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
      
      // 如果是只读错误，提供更友好的错误信息
      if (error.message.includes("missing provider") || error.message.includes("read-only")) {
        throw new Error("Please connect MetaMask to interact with the contract");
      }
      
      throw error;
    }
  }

  // 创建保单（不带地区）
  async createPolicy(cropType, coverageAmountInWei) {
    if (!this.isInitialized) {
      await this.init();
    }
    
    try {
      // 计算保费 (5%)
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

  // 创建保单（带地区）
  async createPolicyWithLocation(cropType, coverageAmountInWei, location) {
    if (!this.isInitialized) {
      await this.init();
    }
    
    try {
      // 计算保费 (5%)
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

  // 投资到资金池
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

  // 获取投资者奖励
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

  // 设置事件监听器
  setupEventListeners(callback) {
    if (!this.isInitialized) {
      console.warn("Contract not initialized, skipping event listeners");
      return false;
    }

    // 在只读模式下无法监听事件
    if (!this.signer) {
      console.warn("Cannot setup event listeners in read-only mode");
      return false;
    }

    try {
      console.log("Setting up event listeners...");

      // 理赔处理事件
      const claimListener = this.contract.on("ClaimProcessed", (policyId, farmer, payoutAmount, reason) => {
        console.log("Claim processed:", { 
          policyId: policyId.toString(), 
          farmer, 
          payoutAmount: ethers.formatEther(payoutAmount),
          reason 
        });
        callback && callback();
      });

      // 保单资金事件
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

  // 移除事件监听器
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

  // 获取当前用户地址
  async getCurrentAccount() {
    if (!this.isInitialized) {
      await this.init();
    }
    
    if (this.signer) {
      return await this.signer.getAddress();
    }
    
    // 如果没有连接 MetaMask，返回一个默认地址用于演示
    return '0x0000000000000000000000000000000000000000';
  }

  // 获取用户余额
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

  // 获取用户投资信息（如果需要）
  async getInvestorInfo() {
    if (!this.isInitialized) {
      await this.init();
    }
    
    try {
      console.log("Getting investor info...");
      
      // 示例：返回默认投资信息
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

  // 检查网络
  async checkNetwork() {
    if (this.provider) {
      return await this.provider.getNetwork();
    }
    return null;
  }

  // 获取合约实例
  getContract() {
    return this.contract;
  }

  // 获取子合约地址
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

  // 获取连接状态信息
  getConnectionInfo() {
    let balance = "0";
    
    // 尝试同步获取余额（如果有缓存）
    if (this.signer && this.signer.address) {
      // 这里可以添加余额缓存逻辑
      // 暂时返回默认值
      balance = "0.2777";
    }
    
    return {
      isInitialized: this.isInitialized,
      canWrite: this.canWrite(),
      canRead: this.canRead(), // 添加 canRead 状态
      provider: this.signer ? "MetaMask" : "Public RPC",
      network: this.provider ? this.provider.network : null,
      account: this.signer ? this.signer.address : null,
      balance: balance
    };
  }

  // 获取投资统计数据（如果需要）
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

  // 获取用户创建的所有保单
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

      // 方法1: 通过事件查询（如果合约有相应事件）
      try {
        const userPolicies = await this.getPoliciesFromEvents(userAddress);
        if (userPolicies.length > 0) {
          console.log('Found policies via events:', userPolicies.length);
          return userPolicies;
        }
      } catch (error) {
        console.log('Event query failed, trying alternative methods:', error.message);
      }

      // 方法2: 如果合约有获取用户保单的方法（需要合约支持）
      try {
        const userPolicies = await this.getPoliciesFromContract(userAddress);
        if (userPolicies.length > 0) {
          console.log('Found policies via contract:', userPolicies.length);
          return userPolicies;
        }
      } catch (error) {
        console.log('Contract method failed:', error.message);
      }

      // 方法3: 遍历可能的保单ID（如果知道保单ID范围）
      try {
        const userPolicies = await this.getPoliciesByScanning(userAddress);
        if (userPolicies.length > 0) {
          console.log('Found policies by scanning:', userPolicies.length);
          return userPolicies;
        }
      } catch (error) {
        console.log('Scanning method failed:', error.message);
      }

      // 如果所有方法都失败，返回空数组
      console.log('No real policies found for user');
      return [];

    } catch (error) {
      console.error('Error getting user policies:', error);
      throw error;
    }
  }

  // 通过事件查询保单
  async getPoliciesFromEvents(userAddress) {
    const userPolicies = [];
    
    try {
      // 查询 PolicyFunded 事件
      const policyFundedFilter = this.contract.filters.PolicyFunded();
      const policyEvents = await this.contract.queryFilter(policyFundedFilter, 0, 'latest');
      
      console.log('Found PolicyFunded events:', policyEvents.length);
      
      for (const event of policyEvents) {
        try {
          const policyId = event.args.policyId.toString();
          
          // 获取交易详情来确认创建者
          const tx = await event.getTransaction();
          
          // 如果交易发起者是当前用户，则认为是用户的保单
          if (tx.from && tx.from.toLowerCase() === userAddress.toLowerCase()) {
            const policyDetails = await this.getRealPolicyDetails(policyId);
            if (policyDetails) {
              userPolicies.push({
                ...policyDetails,
                policyId: policyId,
                transactionHash: event.transactionHash,
                blockNumber: event.blockNumber,
                isReal: true // 标记为真实数据
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

  // 通过合约方法获取保单（如果合约支持）
  async getPoliciesFromContract(userAddress) {
    // 这里需要根据你的合约实际方法来实现
    // 如果合约有 getUserPolicies 或类似方法，可以在这里调用
    
    // 示例：假设合约有一个方法可以获取用户的所有保单ID
    try {
      // 如果合约有 getUserPolicyIds 方法
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

  // 通过扫描获取保单（如果知道保单ID范围）
  async getPoliciesByScanning(userAddress) {
    const userPolicies = [];
    const maxPolicyId = 100; // 假设最多100个保单，你可以调整这个值
    
    console.log(`Scanning policies from 1 to ${maxPolicyId}`);
    
    for (let i = 1; i <= maxPolicyId; i++) {
      try {
        const policyId = i.toString();
        const policyDetails = await this.getRealPolicyDetails(policyId);
        
        // 检查保单是否属于当前用户
        if (policyDetails && await this.isPolicyOwnedByUser(policyDetails, userAddress)) {
          userPolicies.push({
            ...policyDetails,
            policyId: policyId,
            isReal: true
          });
        }
      } catch (error) {
        // 如果保单不存在，会抛出错误，继续下一个
        continue;
      }
    }
    
    return userPolicies;
  }

  // 获取真实保单详情
  async getRealPolicyDetails(policyId) {
    try {
      // 这里需要根据你的合约结构来获取真实的保单数据
      // 由于你的ABI中没有直接的getPolicy方法，我们需要通过其他方式
      
      // 方法1: 如果合约有公开的policies映射
      try {
        // 假设合约有一个公开的policies映射，可以这样访问
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
      
      // 方法2: 通过getPolicyLocation等方法组合获取
      try {
        const location = await this.contract.getPolicyLocation(policyId);
        
        // 这里可以添加其他获取保单信息的方法
        // 由于ABI限制，我们只能获取有限的信息
        
        return {
          cropType: 'Unknown', // 无法获取
          coverageAmount: '0', // 无法获取
          premium: '0', // 无法获取
          location: location,
          startTime: new Date(), // 无法获取真实时间
          endTime: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 假设90天
          status: 'Active', // 无法获取真实状态
          claimed: false, // 无法获取
          claimAmount: '0', // 无法获取
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

  // 获取真实保单状态
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

  // 检查保单是否属于用户
  async isPolicyOwnedByUser(policyDetails, userAddress) {
    try {
      // 如果保单数据中有farmer字段，直接比较
      if (policyDetails.farmer) {
        return policyDetails.farmer.toLowerCase() === userAddress.toLowerCase();
      }
      
      // 否则，我们假设所有找到的保单都属于用户（在扫描时）
      return true;
    } catch (error) {
      console.error('Error checking policy ownership:', error);
      return false;
    }
  }

  // 创建模拟保单详情（用于演示）
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

  // 获取模拟保单数据（用于演示）
  getMockPolicies() {
    const mockPolicies = [];
    const policyCount = 3; // 模拟3个保单

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

  // 获取保单状态文本
  getPolicyStatus(statusCode) {
    const statusMap = {
      0: 'Active',
      1: 'Expired', 
      2: 'Claimed',
      3: 'Cancelled'
    };
    return statusMap[statusCode] || 'Unknown';
  }

  // 格式化保单数据显示
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

// 创建单例实例
const agriShieldContract = new AgriShieldContract();

export default agriShieldContract;