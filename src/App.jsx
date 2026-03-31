import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import HealthPulse from './pages/HealthPulse';
import Queue from './pages/Queue';
import Prescriptions from './pages/Prescriptions';
import Reviews from './pages/Reviews';
import BookAppointment from './pages/BookAppointment';
import FollowUp from './pages/FollowUp';

function PageRouter() {
  const { currentPage } = useApp();
  const pages = {
    'dashboard': <Dashboard />,
    'appointments': <Appointments />,
    'health-pulse': <HealthPulse />,
    'queue': <Queue />,
    'prescriptions': <Prescriptions />,
    'reviews': <Reviews />,
    'book': <BookAppointment />,
    'follow-up': <FollowUp />,
    'doctors': <Dashboard />,
    'reports': <Dashboard />,
  };
  return pages[currentPage] || <Dashboard />;
}

function AppLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4fdf8', fontFamily: "'DM Sans', 'Nunito', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <PageRouter />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
