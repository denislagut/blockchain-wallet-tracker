export const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getSepoliaAddressUrl = (address: string) => {
  return `https://sepolia.etherscan.io/address/${address}`;
};

export const getSepoliaTxUrl = (transactionHash: string) => {
  return `https://sepolia.etherscan.io/tx/${transactionHash}`;
};
