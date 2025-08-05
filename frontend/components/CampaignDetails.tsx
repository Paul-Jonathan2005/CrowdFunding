import React, { useEffect, useState } from 'react';

const imageMap: Record<number, string> = {
  16: "/image.png",
  17: "/image1.png",
  18: "/image2.png",
  19: "/image3.png",
  4: "/image4.png",
  // Add more mappings as needed
};
import { useParams } from 'react-router-dom';
import { AptosClient } from 'aptos';

const client = new AptosClient('https://fullnode.testnet.aptoslabs.com');

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<any>(null);
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const account = await window.aptos.account();
        const response = await client.view({
          function: '0x0a5927ae7812c5e39202cae67f7e3465319fcb7e235105ae57e9b7c7bf9bd462::fund_me::get_campaign',
          type_arguments: [],
          arguments: [account.address, String(Number(id))],
        });
        const [summary] = response;
        setCampaign({
          id: summary.id,
          title: summary.title,
          description: summary.description,
          total_amount: summary.total_amount,
          fund_raised: summary.fund_raised,
          image: imageMap[Number(id)] || "/default.png"
        });
      } catch (err) {
        console.error('Failed to fetch campaign details:', err);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  const handleContribute = async () => {
    if (amount <= 0) {
      alert('Amount must be greater than zero.');
      return;
    }

    try {
      const account = await window.aptos.account();
      await window.aptos.signAndSubmitTransaction({
        type: 'entry_function_payload',
        function: '0x0a5927ae7812c5e39202cae67f7e3465319fcb7e235105ae57e9b7c7bf9bd462::fund_me::contribute',
        type_arguments: [],
        arguments: [account.address, Number(id), amount],
      });
      window.location.reload();
    } catch (err) {
      console.error('Contribution failed:', err);
    }
  };

  if (!campaign) return <p>Loading...</p>;

  const progressPercent = (campaign.fund_raised / campaign.total_amount) * 100;

  return (
    <div style={{
      background: 'linear-gradient(-135deg, #0f2027, #203a43, #2c5364)',
      minHeight: '100vh',
      paddingTop: '80px',
      paddingBottom: '60px',
      color: 'white',
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      margin: 0,
      width: '100vw',
      overflowX: 'hidden',
      overflowY: 'hidden',
      marginLeft: 0,
      paddingLeft: 0,
      position: 'absolute',
      left: 0,
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '2rem',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: '2rem',
        width: '100%',
        maxWidth: '900px',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box'
      }}>
        <div style={{ flex: '1 1 350px', minWidth: '300px', alignSelf: 'flex-start', marginRight: '2rem' }}>
          <h2>{campaign.title}</h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem' }}>{campaign.description}</p>
          <div style={{
            margin: '1rem 0',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            height: '20px',
            width: '100%',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              background: 'linear-gradient(to right, #00b09b, #96c93d)',
              height: '100%',
              borderRadius: '10px',
              transition: 'width 0.5s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '8px',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              whiteSpace: 'nowrap'
            }}>
              {Math.floor(progressPercent)}%
            </div>
          </div>
          <p>{campaign.fund_raised} / {campaign.total_amount} APT raised</p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter amount"
              style={{
                padding: '0.5rem',
                flex: '1 1 200px',
                minWidth: '150px'
              }}
            />
            <button
              onClick={handleContribute}
              disabled={Number(campaign.fund_raised) >= Number(campaign.total_amount)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: Number(campaign.fund_raised) >= Number(campaign.total_amount) ? '#ccc' : '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: Number(campaign.fund_raised) >= Number(campaign.total_amount) ? 'not-allowed' : 'pointer',
                flex: '0 0 auto'
              }}
            >
              Contribute
            </button>
          </div>
        </div>
        <div style={{ flex: '1 1 250px', minWidth: '200px', textAlign: 'center' }}>
          <img src={campaign.image} alt="Campaign" style={{width:'130%' ,borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }} />
        </div>
      </div>
      {/* Responsive styles for smaller screens */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="flex-direction: row"] {
            flex-direction: column !important;
            align-items: center !important;
          }
        }
        @media (max-width: 650px) {
          div[style*="max-width: 900px"] {
            padding: 1rem !important;
            max-width: 98vw !important;
          }
        }
        @media (max-width: 480px) {
          div[style*="max-width: 900px"] h2 {
            font-size: 1.3rem !important;
          }
          div[style*="max-width: 900px"] p {
            font-size: 0.95rem !important;
          }
        }
      `}</style>
      <style>{`
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default CampaignDetails;