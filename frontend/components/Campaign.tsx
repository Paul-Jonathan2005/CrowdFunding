import React, { useEffect, useState } from 'react';
import { AptosClient } from 'aptos';
import CampaignTile from './CampaignTile';

interface Campaign {
  id: number;
  title: string;
}

const Campaign: React.FC = () => {
  const client = new AptosClient('https://fullnode.testnet.aptoslabs.com');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const handleDelete = (id: number) => {
    setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id));
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const isConnected = await window.aptos.isConnected();
        if (!isConnected) {
          await window.aptos.connect();
        }

        const account = await window.aptos.account();
        console.log("Connected account:", account.address);
        const response = await client.view({
          function: '0x0a5927ae7812c5e39202cae67f7e3465319fcb7e235105ae57e9b7c7bf9bd462::fund_me::get_all_campaign_summaries',
          type_arguments: [],
          arguments: [account.address],
        });

        const campaignList: Campaign[] = response[0].map((summary: any) => ({
          id: summary.id,
          title: summary.title,
        }));

        setCampaigns(campaignList);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      background: 'linear-gradient(-135deg, #0f2027, #203a43, #2c5364)',
      width: '100%',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      overflowY: 'hidden',
      marginLeft: 0,
      paddingLeft: 0,
      position: 'absolute',
      left: 0,
    }}>
      <div style={{
        padding: '0 20px',
        maxWidth: '1200px',
        margin: '80px auto',
        boxSizing: 'border-box',
        flex: 1,
        width: '100%',
      }}>
        <h2 style={{ textAlign: 'center', margin: '24px 0 8px 0', color: 'white' }}>Campaigns</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          padding: '20px 0',
        }}>
          {campaigns.map((campaign) => (
            <CampaignTile
              key={campaign.id}
              id={campaign.id}
              title={campaign.title}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Campaign;