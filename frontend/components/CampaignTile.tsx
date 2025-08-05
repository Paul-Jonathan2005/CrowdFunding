import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CampaignTileProps {
  id: string;
  title: string;
  onDelete: (id: string) => void;
  tileIndex: number;
}

const CampaignTile: React.FC<CampaignTileProps> = ({ id, title, onDelete, tileIndex }) => {
  const navigate = useNavigate();
  const handleViewClick = () => {
    navigate(`/campaign/${encodeURIComponent(id)}`);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '300px',
      minHeight: '200px',
      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      // backgroundColor: '#1e3c72',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative',
      margin: '10px',
      flex: '1 1 calc(33.33% - 20px)',
      boxSizing: 'border-box'
    }}>
      <div 
        onClick={async () => {
          try {
            const account = await window.aptos.account();
            await window.aptos.signAndSubmitTransaction({
              type: 'entry_function_payload',
              function: '0x0a5927ae7812c5e39202cae67f7e3465319fcb7e235105ae57e9b7c7bf9bd462::fund_me::delete_campaign',
              type_arguments: [],
              arguments: [String(Number(id))],
            });
            onDelete(id); // Refresh parent list
          } catch (err) {
            console.error('Failed to delete campaign:', err);
          }
        }}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          backgroundColor: 'white',
          color: 'black',
          border: 'none',
          borderRadius: '4px',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }}
        title="Delete"
      >
        🗑️
      </div>
      <div style={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        marginTop: '16px'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '18px', 
          color: 'white', 
          textAlign: 'center', 
          fontWeight: 700, 
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.6)' 
        }}>{title}</h3>
      </div>
      <button onClick={handleViewClick} style={{
        marginTop: 'auto',
        padding: '8px 16px',
        borderRadius: '4px',
        background: 'linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
      }}>
        View
      </button>
    </div>
  );
};

export default CampaignTile;
