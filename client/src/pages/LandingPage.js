import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import './DashboardPage.css'


function LandingPage() {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="text-center">
        <header className="masthead mb-auto">
          <div className="inner">
            <h2 className="masthead-brand">Ethereum Wallet Manager</h2>
          </div>
        </header>

        <main role="main" className="inner cover">
          <h1 className="cover-heading">Welcome to our landing page.</h1>
          <p className="lead">Unify all your Ethereum accounts without giving up your privacy or security.</p>
          <Link to="/dashboard" className='btn btn-secondary btn-lg'>Go to Dashboard</Link>
        </main>
      </div>
    </div>
  );
}

export default LandingPage;
