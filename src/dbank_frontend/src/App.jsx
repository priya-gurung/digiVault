import React, { useEffect, useState } from 'react';
import { dbank_backend } from 'declarations/dbank_backend';

function App() {
  const [balance, setBalance] = useState(1000);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");

  useEffect(() => {
    getBalance();
  }, []);

  async function getBalance() {
    try{
      const bal = await dbank_backend.checkBalance();
      const formatted = Number(bal).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setBalance(formatted);
    } catch (error){
      console.log("failed to fetch balance: ", error);
    } 
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try{if (topUpAmount) {
      await dbank_backend.topUp(parseFloat(topUpAmount));
    }

    if (withdrawalAmount) {
      await dbank_backend.withdraw(parseFloat(withdrawalAmount));
    }
    // await dbank_backend.compound();

    setTopUpAmount("");
    setWithdrawalAmount("");
    await getBalance();
  } catch (error){
    console.log("Transaction error: ", error);
  }
  }

  return (
    <div className='container'>
      <img src='/dbank_logo.png' alt='dBank logo' width={400}></img>
      <h1>Current Balance: <span id='value'>{balance}</span></h1>

      <form onSubmit={handleSubmit}>
        <h2>Amount to TopUp</h2>
        <input id="input-amount" type="number" step={0.01} min={"0"} value={topUpAmount} onChange={(e)=>setTopUpAmount(e.target.value)}></input>

        <h2>Amount to Withdraw</h2>
        <input id="withdrawal-amount" type="number" step={0.01} min={"0"} value={withdrawalAmount} onChange={(e)=>setWithdrawalAmount(e.target.value)}></input>

        <input id="submit-btn" type="submit" value={"Finalize Transaction"}></input>
      </form>
    </div>
  )

}
export default App;