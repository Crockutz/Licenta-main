import React from 'react'
import { ethers, parseEther } from 'ethers'
import { useRef, useState, useEffect } from 'react';

let provider = null;
let signer = null;





function SendEthereum() {

    const inputWallet = useRef(null);
    const inputValue = useRef(null);
    const [errorMessage, setErrorMessage] = useState(null);

    async function sendButton() {
        try {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const balance = await provider.getBalance(accounts[0]);
        const ownerBalance = ethers.formatEther(balance);

        //console.log(getBalance);
        const tx = await signer.sendTransaction({
            to: inputWallet.current.value,
            value: parseEther(inputValue.current.value),
        });   

        } catch (error) {
            if(error.action == 'estimateGas') setErrorMessage(error.action);
            console.log(errorMessage);
            console.log(inputValue.current.value);
            console.log(inputWallet.current.value);
            console.error(error);
        }
        
    }


    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="col-md-6">
            <div>Wallet Address Recipient
              <input ref={inputWallet} type="text" className="form-control" placeholder="Ethereum Wallet Address" />
            </div>
            <div>Ethereum Value
              <input ref={inputValue} type="text" className="form-control" placeholder="ETH Value" />
            </div>
            <div className='text-danger'>{errorMessage}</div>
            <div className="text-center mt-5">
              <button onClick={sendButton} className="btn btn-primary">SEND</button>
            </div>
          </div>
        </div>
      );
}

export default SendEthereum
