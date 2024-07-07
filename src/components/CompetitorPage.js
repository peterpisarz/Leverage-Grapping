import React, { useState } from 'react';
import { ethers } from 'ethers';
import LeverageABI from '../abis/Leverage.json';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const CompetitorPage = ({ contractAddress, accounts }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [competitors, setCompetitors] = useState([]);

  const register = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, LeverageABI.abi, signer);

    try {
      const tx = await contract.register(firstName, lastName, { value: ethers.parseEther("0.1") });
      await tx.wait();
      setCompetitors([...competitors, { firstName, lastName }]);
      alert('Registration successful');
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div>
      <div className="row w-100">
        <div className="col-md-4 d-flex justify-content-center">

          <div className="card competitor-card">
            <h2>Register as a Competitor</h2>
            <form onSubmit={register}>
              <div className="form-group">
                <label>First Name:</label>
                <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Last Name:</label>
                <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary margin-top">Pay and Register</button>
            </form>
          </div>
        </div>
        <div className="col-md-8">
          <h2>Competitors</h2>
        </div>
      </div>
    </div>
  );
};

export default CompetitorPage;
