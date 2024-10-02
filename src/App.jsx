import React, { useState, useEffect } from 'react';
import { Web3 } from 'web3';
import { ZKsyncPlugin } from 'web3-plugin-zksync';

const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  }
];

const INITIAL_TOKENS = [
  { address: '0x000000000000000000000000000000000000800A', symbol: 'ETH' },
  { address: '0xF0067Dc3590b82ffBF6ADC156CD077dcCa9dD604', symbol: 'LLT' },
];

function App() {
  const [web3, setWeb3] = useState(null);
  const [zksync, setZksync] = useState(null);
  const [account, setAccount] = useState('');
  const [tokens, setTokens] = useState(INITIAL_TOKENS);
  const [balances, setBalances] = useState({});
  const [newTokenAddress, setNewTokenAddress] = useState('');
  const [walletToCheck, setWalletToCheck] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {
    try {
      const web3Instance = new Web3("https://rpc.sepolia.org");
      const zksyncRpcUrl = "https://sepolia.era.zksync.dev";
      console.log(`📞 Connecting to ZKsync Era [${zksyncRpcUrl}]`);
      web3Instance.registerPlugin(new ZKsyncPlugin(zksyncRpcUrl));
      setWeb3(web3Instance);
      setZksync(web3Instance.ZKsync);
      console.log("L2 contract addresses:", await web3Instance.ZKsync.ContractsAddresses);
    } catch (err) {
      setError('Failed to initialize Web3: ' + err.message);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install it to connect your wallet.');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setSuccess('Wallet connected successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to connect wallet: ' + err.message);
    }
  };

  const addToken = async () => {
    if (!web3.utils.isAddress(newTokenAddress)) {
      setError('Invalid token address');
      return;
    }
    try {
      const contract = new zksync.L2.eth.Contract(ERC20_ABI, newTokenAddress);
      const symbol = await contract.methods.symbol().call();
      setTokens(prev => [...prev, { address: newTokenAddress, symbol }]);
      setNewTokenAddress('');
      setSuccess('Token added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error adding token: ' + err.message);
    }
  };

  const refreshBalances = async (addressToCheck) => {
    if (!addressToCheck) {
      setError('Please enter a wallet address to check');
      return;
    }
    if (!web3.utils.isAddress(addressToCheck)) {
      setError('Invalid wallet address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const newBalances = {};
      for (let token of tokens) {
        if (token.address === '0x000000000000000000000000000000000000800A') {
          const balance = await zksync.L2.getBalance(addressToCheck);
          newBalances[token.address] = Web3.utils.fromWei(balance, 'ether');
        } else {
          const contract = new zksync.L2.eth.Contract(ERC20_ABI, token.address);
          const balance = await contract.methods.balanceOf(addressToCheck).call();
          const decimals = await contract.methods.decimals().call();
          // Convert balance to a string before using fromWei
          const adjustedBalance = Web3.utils.fromWei(balance.toString(), 'ether');
          // Format the balance to a fixed number of decimal places
          newBalances[token.address] = parseFloat(adjustedBalance).toFixed(6);
        }
      }
      setBalances(newBalances);
      setSuccess('Balances refreshed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error refreshing balances: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-3xl font-extrabold text-gray-900">ZKSync Token Tracker</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Track token balances on ZKSync Era network</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {!account && (
            <button 
              onClick={connectWallet}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Connect Wallet
            </button>
          )}
          {account && (
            <p className="text-sm font-medium text-gray-500">Connected Account: <span className="font-semibold text-gray-900">{account}</span></p>
          )}
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="wallet" className="block text-sm font-medium text-gray-700">
                Wallet Address to Check
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="wallet"
                  id="wallet"
                  value={walletToCheck}
                  onChange={(e) => setWalletToCheck(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="0x..."
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <button
                onClick={() => refreshBalances(walletToCheck)}
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Check Balances
              </button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="newToken" className="block text-sm font-medium text-gray-700">
                Add New Token
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="newToken"
                  id="newToken"
                  value={newTokenAddress}
                  onChange={(e) => setNewTokenAddress(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Token Address"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <button
                onClick={addToken}
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add Token
              </button>
            </div>
          </div>
          {loading && (
            <div className="mt-6">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-400 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-400 rounded"></div>
                    <div className="h-4 bg-gray-400 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          {success && (
            <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline"> {success}</span>
            </div>
          )}
          {Object.keys(balances).length > 0 && (
            <div className="mt-8 flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Token
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tokens.map((token) => (
                          <tr key={token.address}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{token.symbol}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{balances[token.address] || '0'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;