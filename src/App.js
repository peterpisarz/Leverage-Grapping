import React, { useState } from 'react';
import { ethers } from 'ethers';
import HomePage from './components/HomePage';
import CompetitorPage from './components/CompetitorPage';
import PromoterPage from './components/PromoterPage';
import { BrowserRouter, Routes, Route, Link, } from "react-router-dom";
import './App.css';

const App = () => {
  const [account, setAccount] = useState(null);
  const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE";

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } else {
      alert('Please install MetaMask');
    }
  };

  return (

      <BrowserRouter>

        <div className="App">
          <nav className="navbar navbar-dark bg-dark">
            <a className="navbar-brand" href="/">Leverage Grappling</a>
            <button className="btn btn-outline-success" onClick={connectWallet}>
              {account ? account.substring(0, 6) + '...' + account.substring(account.length - 4) : 'Connect Wallet'}
            </button>
          </nav>
          { !account ? (
            <div className="container-fluid">Please connect your Wallet to begin</div>
            ) : (
            <div className="home-page-container">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/competitor" element={<CompetitorPage />} />
                <Route path="/promoter" element={<PromoterPage />} />
              </Routes>
            </div>
          )}
        </div>

      </BrowserRouter>
  );
};

export default App;
