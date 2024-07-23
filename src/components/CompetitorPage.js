import React, { useState } from 'react';
import { ethers } from 'ethers';
import LeverageABI from '../abis/Leverage.json';

const CompetitorPage = ({ accounts }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [competitors, setCompetitors] = useState([]);
  const contractAddress = '0xd6e1afe5cA8D00A2EFC01B89997abE2De47fdfAf'

  const register = async (e) => {
    console.log("We registering dogg")
    console.log(e)
    e.preventDefault();

    if (!firstName || !lastName) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    console.log(provider)
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, LeverageABI.abi, signer);

    try {
      const tx = await contract.register(firstName, lastName, { value: ethers.parseEther("1") });
      await tx.wait();
      setCompetitors([...competitors, { firstName, lastName }]);
      alert('Great Success!');
    } catch (error) {
      console.error('Error registering:', error);
      alert('Error: Registration Failed');
    }
  };

  const renderBracket = () => {
    const matches = [
      { competitors: [competitors[0], competitors[7]] },
      { competitors: [competitors[1], competitors[6]] },
      { competitors: [competitors[2], competitors[5]] },
      { competitors: [competitors[3], competitors[4]] },
    ];

    return (
      <div className="bracket">
          {matches.map((match, index) => (
            <div className="col-4 mb-3" key={index}>
              <div className="card mb-2">
                <div className="card-body">
                  <p className="card-text">
                    {match.competitors[0] ? `${match.competitors[0].firstName} ${match.competitors[0].lastName}` : "Competitor"}
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <p className="card-text">
                    {match.competitors[1] ? `${match.competitors[1].firstName} ${match.competitors[1].lastName}` : "Competitor"}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div>
      <div className="row register-row w-100">
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
          {renderBracket()}
        </div>
      </div>
    </div>
  );
};

export default CompetitorPage;
