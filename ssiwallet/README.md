# SSI Wallet

A Self-Sovereign Identity (SSI) wallet built on blockchain technology that enables users to manage their digital identities, credentials, and verifiable claims in a decentralized manner.

## Features

- Decentralized Identity Management
- Credential Issuance and Verification
- Blockchain-based Authentication
- Secure Key Management
- User-friendly Interface
- Role-based Access (Issuer, Holder, Verifier)

## Requirements

### System Requirements
- Node.js v16 or higher
- npm v8 or higher
- Modern web browser with MetaMask extension

### Dependencies
- Next.js 13.5.6
- React 18
- Redux Toolkit
- MetaMask SDK
- Axios
- TypeScript 5
- Zod for schema validation

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ssiwallet
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_ETHEREUM_NETWORK=mainnet|testnet
```

4. Start the development server:
```bash
npm run dev
```

## Usage

### As a Holder
1. Connect your MetaMask wallet
2. Navigate to the Holder dashboard
3. Request credentials from issuers
4. Manage your received credentials
5. Present credentials to verifiers

### As an Issuer
1. Connect your MetaMask wallet
2. Navigate to the Issuer dashboard
3. Create and issue credentials
4. Manage issued credentials
5. Verify holder requests

### As a Verifier
1. Connect your MetaMask wallet
2. Navigate to the Verifier dashboard
3. Request credential verification
4. Verify presented credentials
5. Manage verification requests

## Security Considerations

- Private keys are stored securely in MetaMask
- All transactions are signed client-side
- Credentials are encrypted before storage
- Regular security audits are recommended

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team. 