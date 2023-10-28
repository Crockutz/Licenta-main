const express = require('express');
const cors = require('cors');
const app = express();
const {ethers} = require('ethers');
const axios = require('axios');

// Etherscan API: 7RBN81J8TJYICRUXRQISMB3U3AJQZTJ45P

// Gas Fee
const urlGasPrice = 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=7RBN81J8TJYICRUXRQISMB3U3AJQZTJ45P';

let urlTransactionHistory;


// Ethereum Price 
const urlEthereumPrice = 'https://api.binance.com/api/v3/avgPrice?symbol=ETHUSDT';

// Wallet
let receivedWallet;

app.use(cors());
app.use(express.json());

app.get('/api/gasprice', async (req,res) => {
    const gas = await axios.get(urlGasPrice);
    const gasPrice = gas.data.result.SafeGasPrice;
    res.send(gasPrice);
})

app.get('/api/ethereumprice', async (req, res) => {
    const ethereum = await axios.get(urlEthereumPrice);
    const ethereumPrice = ethereum.data.price;
    const parsed = parseFloat(ethereumPrice);
    res.send(parsed.toFixed(2));
})

app.post('/api/wallet', (req, res) => {
    receivedWallet = req.body.key;
    console.log("Received wallet: ", receivedWallet);
    res.send("Data received successfully");

    urlTransactionHistory = `https://api.etherscan.io/api?module=account&action=txlist&address=${receivedWallet}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=7RBN81J8TJYICRUXRQISMB3U3AJQZTJ45P`;

    console.log(urlTransactionHistory);
})


app.get('/api/wallet/history', async (req, res) => {
    try {
      const getData = await axios.get(urlTransactionHistory);
      if (getData) {
        const walletHistory = getData.data;
        const functionNames = walletHistory.result.map(item => item.functionName);
        res.json(functionNames);
      } else {
        res.json("0");
      }
    } catch (error) {
      console.error('Error fetching wallet history:', error);
      res.status(500).json({ error: 'An error occurred while fetching wallet history.' });
    }
  });
  



app.get('/api', (req,res) => {
    res.json({message: "Hello from the server!"});
})

app.listen(4000, () => {
    console.log("Server started on port 4000");
})