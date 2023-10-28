import React from 'react'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DashboardPage.css';
import { Link } from 'react-router-dom';

let provider = null;
let signer = null;

export function getProvider() {
  return provider;
}

export function getSigner() {
  return signer;
}


function DashboardPage() {

  // Properties
  const [walletAddress, setWalletAddress] = useState(null);
  const [balanceAddress, setBalanceAddress] = useState(null);
  const [gasPrice, setGasPrice] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);
  const [balanceValue, setBalanceValue] = useState(null);
  const [bitcoinHoldings, setBitcoinHoldings] = useState(null);
  const [usdtHoldings, setUsdtHoldings] = useState(null);
  const [walletHistory, setWalletHistory] = useState(null);
  const [accountRequested, setAccountRequested] = useState(false);
  


  const abi = [
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function balanceOf(address a) view returns (uint)",
  ];

  // Cerere pret Ethereum
  useEffect(() => {
    fetch("http://localhost:4000/api/ethereumprice")
    .then(response => response.json())
    .then(data => setEthPrice(data));
  }, []);

  // Cerere pret Gas
  
  useEffect(() => {
    fetch("http://localhost:4000/api/gasprice")
    .then(response => response.json())
    .then(data => setGasPrice(data))
  }, []);

  // Cerere Wallet History
  useEffect(() => {
    fetch("http://localhost:4000/api/wallet/history")
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setWalletHistory(data);
        } else {
          // Handle the case where the data is not an array
          console.error("Invalid data format:", data);
        }
      })
      .catch(error => {
        // Handle fetch errors
        console.error("Fetch error:", error);
      });
  }, []);

  

  //Cerem acces la wallet-ul de MetaMask al utilizatorului
  async function requestAccount() {
    console.log('Requesting account...');

    //Verificam daca exista extensia Metamask
    if(window.ethereum) {
      console.log('Metamask Detected')
      try {
        setAccountRequested(true);
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
        console.log(accounts);
      }catch(error) {
        console.log('Error connecting');
      }

    } else {
      console.log('Metamask is not detected');
    }
  }

  async function connectWallet() {

    if(window.ethereum) {
      try {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        console.log('Connected to MetaMask');
        console.log(provider);

        // Cerere balanta wallet + formatare
        const balance = await provider.getBalance(walletAddress);
        const res = ethers.formatEther(balance);
        setBalanceAddress(res);


        //const ethRounded = Math.round(balance * 100) / 100;

        const formattedEther = ethers.formatEther(balance);
        setBalanceValue(formattedEther * ethPrice);

        axios.post('http://localhost:4000/api/wallet', {key: walletAddress})
          .then(response => {
            console.log("Server respone: ", response.data);
        })
          .catch(error => {
            console.error("Error: ", error);
        });

        // Bitcoin Holdings
        const wbtcContract = new ethers.Contract("0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", abi, provider);
        const symbol = await wbtcContract.symbol();
        const balanceOfBitcoin = await wbtcContract.balanceOf("0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599");
        const decimalsBitcoin = await wbtcContract.decimals();

        const balanceBitcoinParsed = parseFloat(balanceOfBitcoin);
        const decimalsBitcoinParsed = parseFloat(decimalsBitcoin);

        setBitcoinHoldings(ethers.formatUnits(balanceBitcoinParsed, decimalsBitcoinParsed));
        console.log(bitcoinHoldings);

        console.log("Symbol:", symbol);
        console.log("Balance:", balanceBitcoinParsed);
        console.log("Decimals:", decimalsBitcoinParsed);
        console.log("Bitcoin holdings of the address: ", ethers.formatUnits(parseFloat(balanceOfBitcoin), parseFloat(decimalsBitcoin)));

        // USDT Holdings
        const usdtContract = new ethers.Contract("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", abi, provider);
        const balanceOfUsdt = await usdtContract.balanceOf("0xbd061779f3762804E0837460e36721E07ACCC467");
        const decimalsUsdt = await usdtContract.decimals();

        const balanceUsdtParsed = parseFloat(balanceOfUsdt);
        const decimalsUsdtParsed = parseFloat(decimalsUsdt);

        setUsdtHoldings(ethers.formatUnits(balanceUsdtParsed, decimalsUsdtParsed));

        // Apelam functia de Wallet History
        console.log(walletHistory);

      } catch (error) {
        console.error('Error connecting: ', error.message);
      }
    } else {
      console.error('Metamask not detected');
    }
  }

  function sendEth() {
    // const [value, setValue] = useState(null);
    // const [toWallet, setToWallet] = useState(null);

    // const sendEthereumButton() {
      
    // }
  }


  return (
    <div className='App'>
      <h1 className="grid text-center mt-3">My Dashboard</h1>
        <div className="grid text-center mt-5">
          <button type="button" className="my-custom-button m-3" onClick={requestAccount}>Request Wallet</button>
          <button type="button" className="my-costum-button m-3" onClick={connectWallet}>Connect Wallet</button>
          {!accountRequested && <p className= "text-decoration-underline">You have to request before you connect.</p>}

        </div>

        <div className="d-flex justify-content-center">
          <div class="card border mx-5 mt-5 d-inline-flex">
            <div class="card-body">
              <h5 class="card-title">Wallet Address</h5>
              <p class="card-text">{walletAddress}</p>
            </div>
          </div>
          <div className="card border mx-5 mt-5 d-inline-flex">
            <div className="card-body">
              <h5 className="card-title">Ethereum Gas Tracker</h5>
              <p class="card-text">{gasPrice} GWEI</p>
            </div>
          </div>
          <div class="card border mx-5 mt-5 d-inline-flex">
            <div class="card-body">
              <h5 class="card-title">Ethereum Price</h5>
              <p class="card-text">{ethPrice} $</p>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-start">
          <div className="card border mx-5 mt-5 d-inline-flex">
            <div className="card-body">
              <h5 className="card-title">Wallet Balance</h5>
              <p className="card-text">Balance: {balanceAddress ? `${Math.round(balanceAddress * 1e3) / 1e3} ETH`: "Your balance is empty."}</p>
              <p className="card-text">Ethereum Value: {`${Math.round(balanceValue * 1e2) / 1e2} $`} </p>
              <p className="card-text">Bitcoin Balance: {`${Math.round(bitcoinHoldings * 1e6) / 1e6} BTC`}</p>
              <p className="card-text">USDT Balance: {`${Math.round(usdtHoldings * 1e2) / 1e2} USDT`}</p>
            </div>
          </div>
          <div className="card border mx-5 mt-5 d-inline-flex">
            <h5 className="card-title">Wallet History</h5>
            <p className="card-text">
              <ul>{walletHistory !== null ? walletHistory.map((historyItem, index) => (
            <li key={index}>{historyItem.split('(')[0]}
            </li>)) : "No transaction history"}
              </ul>
            </p>
          </div>
        </div>

        <Link to="/sendethereum" className='btn btn-secondary btn-lg'>Send Ethereum</Link>
        <Link to="/swapassets" className='btn btn-secondary btn-lg'>Swap Your Assets</Link>

    </div>
  )
}



export default DashboardPage