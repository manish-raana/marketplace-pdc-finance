import { Alchemy, Network } from "alchemy-sdk";

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
  network: Network.MATIC_MUMBAI, // Replace with your network.
};

const alchemy = new Alchemy(settings);

const getTokenBalances = async (address) => {
  const tokenBalances = await alchemy.core.getTokenBalances(address);
  return tokenBalances;
};

module.exports = {
  getTokenBalances,
};
