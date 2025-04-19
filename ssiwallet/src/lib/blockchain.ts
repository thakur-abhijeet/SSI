import { BrowserProvider, JsonRpcProvider, Contract } from 'ethers';
import { MetaMaskSDK } from '@metamask/sdk-react';
import { BLOCKCHAIN_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from './config';
import SSIContract from './contracts/SSI.json';

// Initialize MetaMask SDK
const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: 'SSI Wallet',
    url: typeof window !== 'undefined' ? window.location.origin : '',
  },
});

// Initialize ethers provider
const getProvider = async () => {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    return new BrowserProvider(window.ethereum);
  }
  throw new Error(ERROR_MESSAGES.WALLET_NOT_FOUND);
};

// SSI Smart Contract Interface
interface SSICredential {
  issuer: string;
  holder: string;
  data: string;
  isValid: boolean;
  issuedAt: number;
}

// Blockchain Service Class
export class BlockchainService {
  private provider: BrowserProvider | null = null;
  private contract: Contract | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      this.provider = await getProvider();
      if (BLOCKCHAIN_CONFIG.CONTRACT_ADDRESSES.SSI) {
        const signer = await this.provider.getSigner();
        this.contract = new Contract(
          BLOCKCHAIN_CONFIG.CONTRACT_ADDRESSES.SSI,
          SSIContract.abi,
          signer
        );
      }
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  // Connect wallet
  async connectWallet(): Promise<string> {
    try {
      if (!this.provider) {
        this.provider = await getProvider();
      }
      const signer = await this.provider.getSigner();
      return await signer.getAddress();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  // Issue credential
  async issueCredential(holderAddress: string, credentialData: string): Promise<string> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
      const tx = await this.contract.issueCredential(holderAddress, credentialData);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Failed to issue credential:', error);
      throw error;
    }
  }

  // Verify credential
  async verifyCredential(credentialId: string): Promise<boolean> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
      return await this.contract.verifyCredential(credentialId);
    } catch (error) {
      console.error('Failed to verify credential:', error);
      throw error;
    }
  }

  // Get credential
  async getCredential(credentialId: string): Promise<SSICredential> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
      const credential = await this.contract.getCredential(credentialId);
      return {
        issuer: credential.issuer,
        holder: credential.holder,
        data: credential.data,
        isValid: credential.isValid,
        issuedAt: credential.issuedAt.toNumber(),
      };
    } catch (error) {
      console.error('Failed to get credential:', error);
      throw error;
    }
  }

  // Revoke credential
  async revokeCredential(credentialId: string): Promise<string> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
      const tx = await this.contract.revokeCredential(credentialId);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Failed to revoke credential:', error);
      throw error;
    }
  }

  // Get network information
  async getNetworkInfo(): Promise<{
    chainId: bigint;
    networkName: string;
    blockNumber: number;
  }> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      return {
        chainId: network.chainId,
        networkName: network.name,
        blockNumber,
      };
    } catch (error) {
      console.error('Failed to get network info:', error);
      throw error;
    }
  }

  // Switch network
  async switchNetwork(chainId: number): Promise<void> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }
      if (typeof window.ethereum === 'undefined') {
        throw new Error(ERROR_MESSAGES.WALLET_NOT_FOUND);
      }
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      console.error('Failed to switch network:', error);
      throw error;
    }
  }

  // Get transaction status
  async getTransactionStatus(txHash: string): Promise<{
    status: 'pending' | 'success' | 'failed';
    blockNumber?: number;
    confirmations?: number;
  }> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }
      const receipt = await this.provider.getTransactionReceipt(txHash);
      if (!receipt) {
        return { status: 'pending' };
      }
      return {
        status: receipt.status === 1 ? 'success' : 'failed',
        blockNumber: Number(receipt.blockNumber),
        confirmations: receipt.confirmations,
      };
    } catch (error) {
      console.error('Failed to get transaction status:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService(); 