import { AptosClient } from 'aptos';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function App() {
  const [owner, setOwner] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isConnected = await window.aptos.isConnected();
    if (!isConnected) {
      alert("Please connect your wallet.");
      return;
    }

    const account = await window.aptos.account();

    try {
      const payload = {
        type: "entry_function_payload",
        function: "0x0a5927ae7812c5e39202cae67f7e3465319fcb7e235105ae57e9b7c7bf9bd462::fund_me::create_campaign",
        type_arguments: [],
        arguments: [title, description, parseInt(amount)],
      };

      const tx = await window.aptos.signAndSubmitTransaction({ sender: account.address, payload });
      console.log("Transaction submitted:", tx.hash);
      alert("Campaign created successfully!");
      navigate('/campaigns');
    } catch (err) {
      console.error(err);
      alert("Transaction failed.");
    }
  };
  return (
    <div style={{
      background: 'linear-gradient(-135deg, #0f2027, #203a43, #2c5364)',
      minHeight: '100vh',
      paddingTop: '80px',
      paddingBottom: '60px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      overflowX: 'hidden',
      overflowY: 'auto',
      margin: 0,
      paddingLeft: 0,
      marginLeft: 0,
      position: 'absolute',
      left: 0,
      top: 0
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        margin: '80px auto',
        padding: '30px',
        backgroundColor: '#f4f4f4',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Start Your Own Campaign</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '25px' }}>
            <label htmlFor="owner" style={{ display: 'block', marginBottom: '6px' }}>Owner</label>
            <input type="text" id="owner" name="owner" value={owner} onChange={(e) => setOwner(e.target.value)} style={{
              width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc'
            }} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '6px' }}>Campaign Title</label>
            <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} style={{
              width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc'
            }} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '6px' }}>Description</label>
            <textarea id="description" name="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} style={{
              width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc'
            }}></textarea>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label htmlFor="goal" style={{ display: 'block', marginBottom: '6px' }}>Funding Goal (APT)</label>
            <input type="number" id="goal" name="goal" value={amount} onChange={(e) => setAmount(e.target.value)} style={{
              width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc'
            }} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <button type="submit" style={{
              padding: '12px 30px',
              backgroundColor: '#2d88ff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Submit Campaign
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>
          <button type="button" style={{
            padding: '10px 20px',
            backgroundColor: '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }} onClick={async () => {
            try {
              const isConnected = await window.aptos.isConnected();
              if (!isConnected) {
                await window.aptos.connect();
              }
              const account = await window.aptos.account();

              const client = new AptosClient("https://fullnode.testnet.aptoslabs.com");
              const resources = await client.getAccountResources(account.address);
              const alreadyInitialized = resources.some((r) =>
                r.type.includes("fund_me::Campaigns")
              );

              if (alreadyInitialized) {
                alert("Account already initialized.");
              } else {
                alert("Account not initialized.");
              }
            } catch (err) {
              console.error("Check failed", err);
              alert("Failed to check initialization. See console.");
            }
          }}>
            Initialize Account
          </button>
          <p style={{ marginTop: '8px', color: '#333', fontSize: '14px' }}>
            Before starting a campaign, please initialize your account.
          </p>
        </div>
      </div>
    </div>
  );
}