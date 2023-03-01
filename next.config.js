/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "placeimg.com",
      "www.isyssolutions.com",
      "dummyimage.com",
      "cdn.sanity.io",
    ],
    unoptimized: true,
  },
  env: {
    COVALENT_API_KEY: process.env.COVALENT_API_KEY,
    NEXT_PUBLIC_MORALIS_TESTNET_API_SERVER_URL:
      process.env.NEXT_PUBLIC_MORALIS_TESTNET_API_SERVER_URL,
    NEXT_PUBLIC_MORALIS_TESTNET_APP_ID:
      process.env.NEXT_PUBLIC_MORALIS_TESTNET_APP_ID,
    NEXT_PUBLIC_PDC_NFT_CONTRACT_ADDRESS:
      process.env.NEXT_PUBLIC_PDC_NFT_CONTRACT_ADDRESS,
    NEXT_PUBLIC_PDC_FACTORY_CONTRACT_ADDRESS:
      process.env.NEXT_PUBLIC_PDC_FACTORY_CONTRACT_ADDRESS,
    NEXT_PUBLIC_MATIC_EXPLORER: process.env.NEXT_PUBLIC_MATIC_EXPLORER,
    NEXT_PUBLIC_MATIC_EXPLORER_ACCOUNT:
      process.env.NEXT_PUBLIC_MATIC_EXPLORER_ACCOUNT,
    NEXT_PUBLIC_MORALIS_API_KEY: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
    NEXT_PUBLIC_TOKEN_FAUCET_ADDRESS:
      process.env.NEXT_PUBLIC_TOKEN_FAUCET_ADDRESS,
    NEXT_PUBLIC_MORALIS_TABLE_NAME: process.env.NEXT_PUBLIC_MORALIS_TABLE_NAME,
    NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  },
};

module.exports = nextConfig;
