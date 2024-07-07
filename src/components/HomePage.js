import React from 'react';
import { BrowserRouter, Routes, Route, Link, } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="page-container">
      <div className="card home-card">
        <h1>Welcome to Leverage Grappling</h1>
        <p>Select one...</p>
        <div className="row">
          <div className="col-md-6">
            <Link className="btn btn-primary btn-block" to="/competitor">
              For Competitors
            </Link>
          </div>
          <div className="col-md-6">
            <Link className="btn btn-primary btn-block" to="/promoter">
              For Promoters
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
