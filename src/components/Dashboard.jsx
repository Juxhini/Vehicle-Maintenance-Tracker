import { useApp } from '../context/AppContext';

export default function Dashboard({ onNavigate }) {
    const { vehicles, getMaintenanceStatus } = useApp();

    // Gather all statuses across all vehicles
    const allStatuses = vehicles.flatMap(vehicle => {
        const statuses = getMaintenanceStatus(vehicle.id);
        return statuses.map(s => ({ ...s, vehicle }));
    });

    const overdueItems = allStatuses.filter(s => s.status === 'overdue');
    const warningItems = allStatuses.filter(s => s.status === 'warning');
    const unknownItems = allStatuses.filter(s => s.status === 'unknown');

    return (
        <div className="dashboard">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p className="page-subtitle">Overview of your vehicle maintenance status</p>
            </div>

            {vehicles.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🚗</div>
                    <h2>No vehicles yet</h2>
                    <p>Add your first vehicle to start tracking maintenance.</p>
                    <button className="btn btn-primary" onClick={() => onNavigate('vehicles')}>
                        Add Vehicle
                    </button>
                </div>
            ) : (
                <>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">🚗</div>
                            <div className="stat-info">
                                <span className="stat-value">{vehicles.length}</span>
                                <span className="stat-label">Vehicle{vehicles.length !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                        <div className="stat-card overdue">
                            <div className="stat-icon">🔴</div>
                            <div className="stat-info">
                                <span className="stat-value">{overdueItems.length}</span>
                                <span className="stat-label">Overdue</span>
                            </div>
                        </div>
                        <div className="stat-card warning">
                            <div className="stat-icon">🟡</div>
                            <div className="stat-info">
                                <span className="stat-value">{warningItems.length}</span>
                                <span className="stat-label">Due Soon</span>
                            </div>
                        </div>
                        <div className="stat-card unknown">
                            <div className="stat-icon">❓</div>
                            <div className="stat-info">
                                <span className="stat-value">{unknownItems.length}</span>
                                <span className="stat-label">No Record</span>
                            </div>
                        </div>
                    </div>

                    {overdueItems.length > 0 && (
                        <div className="alert-section">
                            <h2 className="section-title">⚠️ Overdue Maintenance</h2>
                            <div className="alert-list">
                                {overdueItems.map((item, idx) => (
                                    <div key={idx} className="alert-card overdue">
                                        <div className="alert-header">
                                            <span className="alert-vehicle">{item.vehicle.name}</span>
                                            <span className="status-badge overdue">Overdue</span>
                                        </div>
                                        <div className="alert-body">
                                            <span className="alert-item-name">{item.item.name}</span>
                                            <div className="alert-details">
                                                {item.kmRemaining !== null && (
                                                    <span className="alert-detail">
                                                        {Math.abs(item.kmRemaining).toLocaleString()} km overdue
                                                    </span>
                                                )}
                                                {item.monthsRemaining !== null && (
                                                    <span className="alert-detail">
                                                        {Math.abs(item.monthsRemaining)} month{Math.abs(item.monthsRemaining) !== 1 ? 's' : ''} overdue
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {warningItems.length > 0 && (
                        <div className="alert-section">
                            <h2 className="section-title">🔔 Due Soon</h2>
                            <div className="alert-list">
                                {warningItems.map((item, idx) => (
                                    <div key={idx} className="alert-card warning">
                                        <div className="alert-header">
                                            <span className="alert-vehicle">{item.vehicle.name}</span>
                                            <span className="status-badge warning">Due Soon</span>
                                        </div>
                                        <div className="alert-body">
                                            <span className="alert-item-name">{item.item.name}</span>
                                            <div className="alert-details">
                                                {item.kmRemaining !== null && (
                                                    <span className="alert-detail">
                                                        {item.kmRemaining.toLocaleString()} km remaining
                                                    </span>
                                                )}
                                                {item.monthsRemaining !== null && (
                                                    <span className="alert-detail">
                                                        {item.monthsRemaining} month{item.monthsRemaining !== 1 ? 's' : ''} remaining
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="vehicles-overview">
                        <h2 className="section-title">🚗 Your Vehicles</h2>
                        <div className="vehicle-cards">
                            {vehicles.map(vehicle => {
                                const statuses = getMaintenanceStatus(vehicle.id);
                                const overdue = statuses.filter(s => s.status === 'overdue').length;
                                const warnings = statuses.filter(s => s.status === 'warning').length;
                                const ok = statuses.filter(s => s.status === 'ok').length;
                                return (
                                    <div key={vehicle.id} className="vehicle-summary-card">
                                        <div className="vehicle-summary-header">
                                            <h3>{vehicle.name}</h3>
                                            <span className="vehicle-km">{vehicle.currentKm.toLocaleString()} km</span>
                                        </div>
                                        <p className="vehicle-details-text">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                                        <div className="vehicle-status-bar">
                                            {overdue > 0 && <span className="mini-badge overdue">{overdue} overdue</span>}
                                            {warnings > 0 && <span className="mini-badge warning">{warnings} due soon</span>}
                                            {ok > 0 && <span className="mini-badge ok">{ok} ok</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
