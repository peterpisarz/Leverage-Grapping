import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Leverage from '../abis/Leverage.json';

const PromoterPage = ({ accounts }) => {
  const [entranceFee, setEntranceFee] = useState('');
  const [promotionShare, setPromotionShare] = useState('');
  const [matches, setMatches] = useState([]);
  const [contractAddress, setContractAddress] = useState('0xd6e1afe5cA8D00A2EFC01B89997abE2De47fdfAf')
  const [bracket, setBracket] = useState(null)

  const deployTournament = async (e) => {
    e.preventDefault();
    if (!entranceFee || !promotionShare) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    const factory = new ethers.ContractFactory(Leverage.abi, Leverage.bytecode, signer);

    try {
      const leverage = await factory.deploy(ethers.parseEther(entranceFee), promotionShare);
      await leverage.deployed();
      console.log(leverage.target)
      setContractAddress(leverage.target)
      alert('Tournament created successfully - ', contractAddress);
    } catch (error) {
      console.error('Error creating tournament:', error);
    }
  };

  const getBracket = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, Leverage.abi, signer);

    try {
      const bracket = await contract.getBracket(1);
      setBracket(bracket);
      console.log('Bracket:', bracket);
    } catch (error) {
      console.error('Error getting bracket:', error);
    }
  };

  return (
    <div>
      <div className="row w-100">
        <div className="col-md-4 d-flex flex-column align-items-center">
          <div className="card promoter-card">
            <h2>Create New Tournament</h2>
            <form onSubmit={deployTournament}>
              <div className="form-group">
                <label>Entrance Fee (ETH):</label>
                <input type="text" className="form-control" value={entranceFee} onChange={(e) => setEntranceFee(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Promotion Share % (i.e. 3):</label>
                <input type="text" className="form-control" value={promotionShare} onChange={(e) => setPromotionShare(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary margin-top">Deploy New Tournament</button>
            </form>
          </div>
          <button onClick={getBracket} className="btn btn-secondary margin-top">Get Bracket</button>
        </div>
        
        <div className="col-md-8">
          <h2>Upcoming Matches</h2>
          <ul>
            {matches.map((match, index) => (
              <li key={index}>Match {match.id}: Competitor {match.competitor1} vs Competitor {match.competitor2}</li>
            ))}
          </ul>

        </div>
      </div>
    </div>
  );
};

export default PromoterPage;
