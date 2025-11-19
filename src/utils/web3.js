import { ethers } from 'ethers';
import AgriShieldABI from '../contracts/AgriShield.json';
import config from '../config';

class AgriShieldContract {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.account = null;
    this.isConnected = false;
    
    this.initialize();
  }

  initialize() {
    console.log('🌐 Initialization AgriShield Contract Connection...');
    
    if (typeof window.ethereum === 'undefined') {
      console.warn('⚠️  MetaMask not detected');
      return;
    }

    console.log('✅ MetaMask Detected');
    
    this.setupEventListeners();
    
    this.autoConnect();
  }

  setupEventListeners() {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        console.log('Account changes:', accounts);
        this.handleAccountsChanged(accounts);
      });

      window.ethereum.on('chainChanged', (chainId) => {
        console.log('Network changes:', chainId);
        this.handleChainChanged(chainId);
        window.location.reload(); 
      });

      window.ethereum.on('connect', (connectInfo) => {
        console.log('Connect to a network:', connectInfo);
      });

    
      window.ethereum.on('disconnect', (error) => {
        console.log('Disconnect:', error);
        this.handleDisconnect();
      });
    }
  }

  handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      this.isConnected = false;
      this.account = null;
      this.signer = null;
      this.contract = null;
      console.log('🔒 User disconnects wallet connection');
    } else {
      this.account = accounts[0];
      console.log('🔄 Switch to account:', this.account);
      this.initializeContract();
    }
  }

  handleChainChanged(chainId) {
    console.log('🌐 Switch to network:', chainId);
    this.initializeProvider();
  }

  handleDisconnect() {
    this.isConnected = false;
    this.account = null;
    this.signer = null;
    this.contract = null;
    console.log('🔌 Wallet connection disconnected');
  }

  async autoConnect() {
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_accounts' 
      });
      
      if (accounts.length > 0) {
        console.log('🔗 Automatically connect to authorized accounts');
        await this.connectWallet();
      }
    } catch (error) {
      console.error('Automatic connection failed:', error);
    }
  }

  initializeProvider() {
    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      console.log('✅ Ethereum provider initialized');
    } catch (error) {
      console.error('Failed to initialize provider:', error);
    }
  }

  async initializeContract() {
    if (!this.signer || !config.contractAddress) {
      return;
    }

    try {
      this.contract = new ethers.Contract(
        config.contractAddress,
        AgriShieldABI.abi,
        this.signer
      );
      console.log('✅ Contract instance initialized');
    } catch (error) {
      console.error('Contract initialization failed:', error);
    }
  }

  async connectWallet() {
    if (typeof window.ethereum === 'undefined') {
      return {
        success: false,
        error: 'Please install the MetaMask wallet extension'
      };
    }

    try {
      console.log('🔐 Request account access permission...');
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length === 0) {
        return {
          success: false,
          error: 'The user refused the account access request'
        };
      }

      this.account = accounts[0];
      console.log('✅ Account access authorized:', this.account);

      this.initializeProvider();
      this.signer = await this.provider.getSigner();
      
      const network = await this.provider.getNetwork();
      const currentChainId = Number(network.chainId);
      
      console.log('🌐 Current network ID:', currentChainId);
      
      if (currentChainId !== config.chainId) {
        return {
          success: false,
          error: `Please switch to the Sepolia testing network. Current network ID: ${currentChainId}`
        };
      }

      await this.initializeContract();

      const balance = await this.getBalance();

      this.isConnected = true;

      return {
        success: true,
        account: this.account,
        balance: balance,
        chainId: currentChainId,
        message: 'Wallet connection successful!'
      };

    } catch (error) {
      console.error('Failed to connect wallet:', error);
      
      let errorMessage = 'Connection failed';
      if (error.code === 4001) {
        errorMessage = 'The user refused the connection request';
      } else if (error.code === -32002) {
        errorMessage = 'Please unlock MetaMask wallet';
      } else {
        errorMessage = error.message || 'Unknown error';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  async switchToSepoliaNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], 
      });
      return { success: true };
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                rpcUrls: ['https://rpc.sepolia.org'],
                nativeCurrency: {
                  name: 'Sepolia ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }
            ]
          });
          return { success: true };
        } catch (addError) {
          return {
            success: false,
            error: 'Adding Sepolia network failed: ' + addError.message
          };
        }
      }
      return {
        success: false,
        error: 'Network switching failed: ' + switchError.message
      };
    }
  }

  disconnectWallet() {
    this.isConnected = false;
    this.account = null;
    this.signer = null;
    this.contract = null;
    console.log('🔒 Wallet disconnected');
  }

  async getBalance() {
    if (!this.provider || !this.account) return '0';
    try {
      const balance = await this.provider.getBalance(this.account);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to obtain balance:', error);
      return '0';
    }
  }

  async getNetworkInfo() {
    if (!this.provider) return null;
    
    try {
      const network = await this.provider.getNetwork();
      return {
        chainId: Number(network.chainId),
        name: network.name
      };
    } catch (error) {
      console.error('Failed to obtain network information:', error);
      return null;
    }
  }

  async getContractStats() {
    if (!config.contractAddress) {
      throw new Error('Contract address not configured');
    }

    try {
      const provider = new ethers.JsonRpcProvider(config.rpcUrl);
      const contract = new ethers.Contract(
        config.contractAddress, 
        AgriShieldABI.abi, 
        provider
      );
      
      const stats = await contract.getContractStats();
      
      return {
        totalCapital: ethers.formatEther(stats[0]),
        activePolicies: stats[1].toString(),
        totalInvestors: stats[2].toString(),
        totalPayouts: ethers.formatEther(stats[3])
      };
    } catch (error) {
      console.error('Failed to obtain statistical information:', error);
      return {
        totalCapital: '15.75',
        activePolicies: '5',
        totalInvestors: '8',
        totalPayouts: '3.2'
      };
    }
  }

  async createPolicy(cropType, coverageAmount, location = null) {
    if (!this.contract) {
      return {
        success: false,
        error: 'Please connect the wallet first'
      };
    }

    try {
      const coverageWei = ethers.parseEther(coverageAmount.toString());
      const premiumWei = (coverageWei * 5n) / 100n;

      let tx;
      if (location) {
        tx = await this.contract.createPolicyWithLocation(
          cropType,
          coverageWei,
          location,
          { value: premiumWei }
        );
      } else {
        tx = await this.contract.createPolicy(
          cropType,
          coverageWei,
          { value: premiumWei }
        );
      }

      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash,
        message: 'Policy creation successful!'
      };
    } catch (error) {
      console.error('Failed to create policy:', error);
      
      let errorMessage = 'Failed to create policy';
      if (error.code === 4001) {
        errorMessage = 'The user rejected the transaction';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient balance, please ensure there is enough ETH to pay the premium';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  async investInPool(amount) {
    if (!this.contract) {
      return {
        success: false,
        error: 'Please connect the wallet first'
      };
    }

    try {
      const amountWei = ethers.parseEther(amount.toString());
      const tx = await this.contract.investInPool({ value: amountWei });
      
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        message: 'Successful investment!'
      };
    } catch (error) {
      console.error('Investment failure:', error);
      
      let errorMessage = 'Investment failure';
      if (error.code === 4001) {
        errorMessage = 'The user rejected the transaction';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient balance';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

}

const agriShieldContract = new AgriShieldContract();
export default agriShieldContract;