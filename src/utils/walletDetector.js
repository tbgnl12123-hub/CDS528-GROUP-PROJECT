
export function checkMetaMaskAvailability() {
  const results = {
    hasMetaMask: typeof window.ethereum !== 'undefined',
    isMetaMask: false,
    currentChain: null,
    currentAccount: null
  };

  if (results.hasMetaMask) {
    results.isMetaMask = window.ethereum.isMetaMask || false;
    
    if (window.ethereum.chainId) {
      results.currentChain = window.ethereum.chainId;
    }
    
    if (window.ethereum.selectedAddress) {
      results.currentAccount = window.ethereum.selectedAddress;
    }
  }

  console.log('MetaMask test results:', results);
  return results;
}

export function getNetworkName(chainId) {
  const networks = {
    '0x1': 'Ethereum Mainnet',
    '0xaa36a7': 'Sepolia Testnet',  // 11155111 in hex
    '0x5': 'Goerli Testnet',
    '0x89': 'Polygon Mainnet',
    '0x13881': 'Mumbai Testnet'
  };
  return networks[chainId] || `Unknown Network (${chainId})`;
}