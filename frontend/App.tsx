import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Campaigns from './components/Campaign';
import StartCampaign from './components/StartCampaign';
import Header from './components/Header';
import Footer from './components/Footer';
import CampaignDetails from './components/CampaignDetails';

function App() {
  return (
    <>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campaign/:id" element={<CampaignDetails />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/start-campaign" element={<StartCampaign />} />
        </Routes>
      <Footer />
    </>
  );
}

export default App;