// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import './App.css';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import SendEthereum from './pages/SendEthereum';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage/>}/>
          <Route path="/sendethereum" element={<SendEthereum/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
