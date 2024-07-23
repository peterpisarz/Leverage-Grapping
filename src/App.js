import React, { useEffect,useState } from 'react';
import { ethers } from 'ethers';
import HomePage from './components/HomePage';
import CompetitorPage from './components/CompetitorPage';
import PromoterPage from './components/PromoterPage';
import { BrowserRouter, Routes, Route, Link, } from "react-router-dom";
import './App.css';

const App = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } else {
        alert('Open this App in a Web3 Browser like MetaMask or Coinbase Wallet');
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      alert('Error connecting to wallet. Check console for details.');
    }
  };

  useEffect(() => {
    const initWallet = async () => {
      if (window.ethereum && !account) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setProvider(provider);
        }
      }
    };

    initWallet();
  }, [account]);

  return (

      <BrowserRouter>

        <div className="App">
          <nav className="navbar navbar-dark bg-dark">
            <Link className="navbar-brand" to="/">Leverage Grappling</Link>
            <button className="btn btn-success" onClick={connectWallet}>
              {account ? account.substring(0, 6) + '...' + account.substring(account.length - 4) : 'Connect Wallet'}
            </button>
          </nav>
          { !account ? (
            <div className="container-fluid">Please connect your Wallet to begin</div>
            ) : (
            <div className="home-page-container">
              <Routes>
                <Route path="/" element={<HomePage accounts={account} />} />
                <Route path="/competitor" element={<CompetitorPage contract={contract} accounts={account} />} />
                <Route path="/promoter" element={<PromoterPage contract={contract} accounts={account} />} />
              </Routes>
            </div>
          )}
        </div>

      </BrowserRouter>
  );
};

export default App;
