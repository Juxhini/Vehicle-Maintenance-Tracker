import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VehicleManager from './components/VehicleManager';
import MaintenanceLog from './components/MaintenanceLog';
import ScheduleTable from './components/ScheduleTable';
import CustomServices from './components/CustomServices';

function AppContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isSyncing } = useApp();

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={setActivePage} />;
      case 'vehicles':
        return <VehicleManager />;
      case 'log':
        return <MaintenanceLog />;
      case 'schedule':
        return <ScheduleTable />;
      case 'custom':
        return <CustomServices />;
      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="main-content">
        {renderPage()}
      </main>

      {isSyncing ? (
        <div className="sync-indicator syncing">
          <span className="sync-icon">🔄</span>
          <span>Syncing to project...</span>
        </div>
      ) : (
        <div className="sync-indicator">
          <span className="sync-icon">✅</span>
          <span>Synced</span>
        </div>
      )}
    </div>
  );
}


export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
