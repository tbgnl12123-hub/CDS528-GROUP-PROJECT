// src/config.js - 手动管理环境变量

// 硬编码配置（临时解决方案）
const config = {
  contractAddress: '0x904d791a7D829fB33f5cB066C80Bbd94A075453A', // 替换为你的真实合约地址
  rpcUrl: 'https://rpc.sepolia.org',
  chainId: 11155111
};

// 如果环境变量存在，优先使用环境变量
if (typeof import.meta !== 'undefined' && import.meta.env) {
  config.contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || config.contractAddress;
  config.rpcUrl = import.meta.env.VITE_RPC_URL || config.rpcUrl;
  config.chainId = parseInt(import.meta.env.VITE_CHAIN_ID) || config.chainId;
}

console.log('应用配置:', config);

export default config;