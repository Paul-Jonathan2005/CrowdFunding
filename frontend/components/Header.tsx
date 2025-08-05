import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const isMobile = window.innerWidth <= 768;

const Header = ({ }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false); // close menu on route change
  }, [location.pathname]);

  useEffect(() => {
    async function checkWalletConnection() {
      try {
        const isConnected = await window.aptos.isConnected();
        if (isConnected) {
          const account = await window.aptos.account();
          setWalletAddress(account.address);
        }
      } catch (error) {
        console.error("Failed to check wallet connection:", error);
      }
    }
    checkWalletConnection();
  }, []);

  useEffect(() => {
    const isPetraMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && typeof window.aptos !== 'undefined';

    if (!isPetraMobile) return;

    const tryConnect = async () => {
      try {
        const isConnected = await window.aptos.isConnected();
        if (!isConnected) {
          await window.aptos.connect({ network: "Testnet" });
        }
        const account = await window.aptos.account();
        setWalletAddress(account.address);
      } catch (err) {
        console.error("Petra auto-connect failed:", err);
      }
    };

    const interval = setInterval(() => {
      if (typeof window.aptos !== 'undefined') {
        tryConnect();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shouldConnect = urlParams.get("petra_connect") === "true";

    const tryConnect = async () => {
      try {
        const isConnected = await window.aptos.isConnected();
        if (!isConnected) {
          await window.aptos.connect({ network: "Testnet" });
        }
        const account = await window.aptos.account();
        setWalletAddress(account.address);
        // Remove query param after connection
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        console.error("Petra auto-connect failed (petra_connect=true):", err);
      }
    };

    if (shouldConnect && typeof window.aptos !== 'undefined') {
      tryConnect();
    }
  }, []);

  async function onConnectWallet() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Deep link to open the dApp in the Petra mobile app
      window.open(
        "petra://dapp?url=" +
          encodeURIComponent(window.location.href + "?petra_connect=true"),
        "_blank"
      );
      return;
    }

    try {
      const isConnected = await window.aptos.isConnected();
      if (!isConnected) {
        await window.aptos.connect({ network: "Testnet" });
      }
      const account = await window.aptos.account();
      setWalletAddress(account.address);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  }

  async function disconnectWallet() {
    try {
      await window.aptos.disconnect();
      setWalletAddress(null);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 5vw',
      background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      height: 'auto',
      boxSizing: 'border-box'
    }}>
      <div 
        style={{ fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', flex: '1 0 auto' }}
        onClick={() => navigate('/')}
      >
        Crowd Funding
      </div>
      {isMobile ? (
        <div style={{ flex: '1 0 auto', textAlign: 'right', alignSelf: 'center', position: 'relative' }}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ☰
          </button>
          {isMenuOpen && (
            <div style={{
              position: 'absolute',
              top: '40px',
              right: '0',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease-in-out',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
              padding: '12px',
              zIndex: 1100,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              minWidth: '180px'
            }}>
              <button style={{ padding: '10px', fontSize: '16px', backgroundColor: '#2d88ff', color: 'white', border: 'none', borderRadius: '6px' }} onClick={() => { navigate('/campaigns'); setIsMenuOpen(false); }}>Campaigns</button>
              <button style={{ padding: '10px', fontSize: '16px', backgroundColor: '#3ccf4e', color: 'white', border: 'none', borderRadius: '6px' }} onClick={() => { navigate('/start-campaign'); setIsMenuOpen(false); }}>Start Campaign</button>
              {walletAddress ? (
                <>
                  <span style={{ color: '#00e676', fontWeight: 'bold' }}>
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                  <button style={{ padding: '8px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => { disconnectWallet(); setIsMenuOpen(false); }}>Disconnect</button>
                </>
              ) : (
                <button style={{ padding: '8px 12px', backgroundColor: '#ff784f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => { onConnectWallet(); setIsMenuOpen(false); }}>Connect Wallet</button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'flex-end',
          alignItems: 'center',
          flex: '1 0 auto'
        }}>
          <button style={{ padding: '8px 12px', backgroundColor: '#2d88ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => navigate('/campaigns')}>Campaigns</button>
          <button style={{ padding: '8px 12px', backgroundColor: '#3ccf4e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => navigate('/start-campaign')}>Start Campaign</button>
          {walletAddress ? (
            <>
              <span style={{ color: '#00e676', fontWeight: 'bold' }}>
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
              <button style={{ padding: '8px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={disconnectWallet}>Disconnect</button>
            </>
          ) : (
            <button style={{ padding: '8px 12px', backgroundColor: '#ff784f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={onConnectWallet}>Connect Wallet</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;