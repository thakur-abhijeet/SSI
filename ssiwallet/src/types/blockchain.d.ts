interface Window {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (params: any) => void) => void;
    removeListener: (event: string, callback: (params: any) => void) => void;
  };
}

declare module 'ethers' {
  export * from 'ethers/lib/index';
}

declare module '@metamask/sdk-react' {
  export class MetaMaskSDK {
    constructor(options: {
      dappMetadata: {
        name: string;
        url: string;
      };
    });
  }
} 