import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Shipments } from './pages/Shipments';
import { ShipmentDetail } from './pages/ShipmentDetail';
import { Locations } from './pages/Locations';
import { Users } from './pages/Users';
import { Analytics } from './pages/Analytics';
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/shipments/:trackingCode" element={<ShipmentDetail />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/users" element={<Users />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
