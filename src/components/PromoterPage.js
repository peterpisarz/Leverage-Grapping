import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import LeverageABI from '../abis/Leverage.json';

const PromoterPage = ({ contractAddress }) => {
  const [entranceFee, setEntranceFee] = useState('');
  const [promotionShare, setPromotionShare] = useState('');
  const [matches, setMatches] = useState([]);

  const deployTournament = async () => {
    if (!entranceFee || !promotionShare) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, LeverageABI.abi, signer);

    try {
      const tx = await contract.createMatches(parseInt(entranceFee), parseInt(promotionShare));
      await tx.wait();
      alert('Tournament created successfully');
    } catch (error) {
      console.error('Error creating tournament:', error);
    }
  };

  return (
    <div className="promoter-page">
      <div class="row w-100">
        <div class="col-md-4 d-flex justify-content-center">

          <div className="promoter-card">
            <h2>Create New Tournament</h2>
            <form onSubmit={deployTournament}>
              <div className="form-group">
                <label>Entrance Fee:</label>
                <input type="text" className="form-control" value={entranceFee} onChange={(e) => setEntranceFee(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Promotion Share % (i.e. 3):</label>
                <input type="text" className="form-control" value={promotionShare} onChange={(e) => setPromotionShare(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary margin-top">Deploy</button>
            </form>
          </div>
        
        </div>
        <div className="col d-flex align-items-center">

          <h2>Matches</h2>
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
