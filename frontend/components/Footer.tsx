export default function Footer() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '10px 5px',
      background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      minHeight: '40px',
      fontSize: '0.9rem',
      boxSizing: 'border-box'
    }}>
      <span>&copy; {new Date().getFullYear()} Crowd Funding</span>
    </div>
  );
}