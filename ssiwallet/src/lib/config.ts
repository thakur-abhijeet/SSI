import { parseUnits } from 'ethers/lib/utils';

const ASSETS_BASE_URL =
  process.env.NEXT_PUBLIC_ASSETS_BASE_URL || "http://192.168.1.24:8000/public";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.24:8000/api/v1";
const WEBSITE_BASE_URL =
  process.env.NEXT_PUBLIC_WEBSITE_BASE_URL || "http://localhost:3000";
const PERSIST_VERSION = 1;
const PERSIST_KEY = "murarkey";
const FEATURE_FLAGS = {
  newFeature: true,
  experimentalFeature: false,
};

// Environment Variables Type Declaration
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_INFURA_API_KEY?: string;
      NEXT_PUBLIC_ALCHEMY_API_KEY?: string;
      NEXT_PUBLIC_SSI_CONTRACT_ADDRESS?: string;
      NEXT_PUBLIC_ETHEREUM_NETWORK?: string;
      NEXT_PUBLIC_ASSETS_BASE_URL?: string;
    }
  }
}

// Blockchain Configuration
export const BLOCKCHAIN_CONFIG = {
  // Network Configuration
  NETWORKS: {
    MAINNET: {
      chainId: 1,
      name: 'Ethereum Mainnet',
      rpcUrl: process.env.NEXT_PUBLIC_INFURA_API_KEY
        ? `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
        : '',
    },
    TESTNET: {
      chainId: 5,
      name: 'Goerli Testnet',
      rpcUrl: process.env.NEXT_PUBLIC_INFURA_API_KEY
        ? `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
        : '',
    },
  },

  // Contract Addresses (to be updated after deployment)
  CONTRACT_ADDRESSES: {
    SSI: process.env.NEXT_PUBLIC_SSI_CONTRACT_ADDRESS || '',
  },

  // Gas Settings
  GAS_SETTINGS: {
    DEFAULT_GAS_LIMIT: 300000,
    MAX_GAS_PRICE: parseUnits('100', 'gwei'),
  },

  // Transaction Settings
  TRANSACTION_SETTINGS: {
    CONFIRMATION_BLOCKS: 3,
    TIMEOUT: 60000, // 1 minute
  },
};

// Credential Schema Configuration
export const CREDENTIAL_SCHEMAS = {
  BASIC_IDENTITY: {
    type: 'BasicIdentity',
    fields: ['name', 'email', 'dob'],
  },
  EDUCATIONAL: {
    type: 'EducationalCredential',
    fields: ['institution', 'degree', 'year', 'field'],
  },
  PROFESSIONAL: {
    type: 'ProfessionalCredential',
    fields: ['organization', 'position', 'startDate', 'endDate'],
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  WALLET_NOT_FOUND: 'MetaMask wallet not found. Please install MetaMask extension.',
  NETWORK_NOT_SUPPORTED: 'Unsupported network. Please switch to a supported network.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  INSUFFICIENT_FUNDS: 'Insufficient funds for transaction.',
  USER_REJECTED: 'User rejected the transaction.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully.',
  CREDENTIAL_ISSUED: 'Credential issued successfully.',
  CREDENTIAL_VERIFIED: 'Credential verified successfully.',
  CREDENTIAL_REVOKED: 'Credential revoked successfully.',
};

export {
  ASSETS_BASE_URL,
  API_BASE_URL,
  WEBSITE_BASE_URL,
  FEATURE_FLAGS,
  PERSIST_VERSION,
  PERSIST_KEY,
};
