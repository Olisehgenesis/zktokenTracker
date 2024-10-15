# ZKSync Token Tracker

## Overview

ZKSync Token Tracker is a React-based web application that allows users to track token balances on the ZKSync Era network. It provides a user-friendly interface for connecting wallets, adding custom tokens, and checking balances for any Ethereum address on the ZKSync network.

## Features

- Connect to MetaMask wallet
- Add custom ERC20 tokens
- Check token balances for any Ethereum address on ZKSync Era
- Displays ETH balance and balances for added tokens
- Responsive design with a gradient background

## Technologies Used

- React
- Vite
- Web3.js
- ZKSync Era
- Tailwind CSS

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- MetaMask browser extension

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/zksync-token-tracker.git
   ```

2. Navigate to the project directory:

   ```
   cd zksync-token-tracker
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory of the project.
2. Add the following environment variables:
   ```
   VITE_ZKSYNC_RPC_URL=https://sepolia.era.zksync.dev
   VITE_ETHEREUM_RPC_URL=https://rpc.sepolia.org
   ```

## Running the Application

To start the development server:

```
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Usage

1. Connect your MetaMask wallet by clicking the "Connect Wallet" button.
2. Enter an Ethereum address in the "Wallet Address to Check" field to view its token balances on ZKSync Era.
3. To add a custom token, enter its contract address in the "Add New Token" field and click "Add Token".
4. The table will display the balances of ETH and all added tokens for the specified address.

## Building for Production

To create a production build:

```
npm run build
```

The built files will be in the `dist` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [ZKSync](https://zksync.io/)
- [Web3.js](https://web3js.readthedocs.io/)
- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
