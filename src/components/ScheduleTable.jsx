import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ScheduleTable() {
    const { vehicles, allMaintenanceItems, getMaintenanceStatus } = useApp();
    const [selectedVehicle, setSelectedVehicle] = useState('');

    const statuses = selectedVehicle ? getMaintenanceStatus(selectedVehicle) : null;

    const getStatusClass = (status) => {
        switch (status) {
            case 'overdue': return 'status-overdue';
            case 'warning': return 'status-warning';
            case 'ok': return 'status-ok';
            default: return 'status-unknown';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'overdue': return 'Overdue';
            case 'warning': return 'Due Soon';
            case 'ok': return 'OK';
            default: return 'No Record';
        }
    };

    const formatInterval = (km, months) => {
        const parts = [];
        if (km) parts.push(`${km.toLocaleString()} km`);
        if (months) parts.push(`${months} months`);
        return parts.join(' / ') || '—';
    };

    return (
        <div className="schedule-table-page">
            <div className="page-header">
                <h1>Maintenance Schedule</h1>
            </div>

            {vehicles.length > 0 && (
                <div className="filter-bar">
                    <label>Select vehicle to see status:</label>
                    <select value={selectedVehicle} onChange={e => setSelectedVehicle(e.target.value)}>
                        <option value="">No vehicle selected</option>
                        {vehicles.map(v => (
                            <option key={v.id} value={v.id}>{v.name} — {v.year} {v.make} {v.model}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="log-table-container">
                <table className="data-table schedule">
                    <thead>
                        <tr>
                            <th>Part / Service</th>
                            <th>Category</th>
                            <th>Interval</th>
                            {statuses && <th>Status</th>}
                            {statuses && <th>Km Remaining</th>}
                            {statuses && <th>Time Remaining</th>}
                            {statuses && <th>Last Service</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {(statuses || allMaintenanceItems.map(item => ({ item }))).map((entry, idx) => {
                            const item = entry.item;
                            return (
                                <tr key={item.id || idx} className={statuses ? getStatusClass(entry.status) : ''}>
                                    <td>
                                        <span className="item-name">
                                            {item.name}
                                            {item.isCustom && <span className="custom-tag">Custom</span>}
                                        </span>
                                    </td>
                                    <td><span className="category-tag">{item.category}</span></td>
                                    <td>{formatInterval(item.intervalKm, item.intervalMonths)}</td>
                                    {statuses && (
                                        <>
                                            <td>
                                                <span className={`status-badge ${entry.status}`}>
                                                    {getStatusLabel(entry.status)}
                                                </span>
                                            </td>
                                            <td>
                                                {entry.kmRemaining !== null
                                                    ? `${entry.kmRemaining.toLocaleString()} km`
                                                    : '—'}
                                            </td>
                                            <td>
                                                {entry.monthsRemaining !== null
                                                    ? `${entry.monthsRemaining} month${Math.abs(entry.monthsRemaining) !== 1 ? 's' : ''}`
                                                    : '—'}
                                            </td>
                                            <td>
                                                {entry.lastService
                                                    ? `${new Date(entry.lastService.date).toLocaleDateString()} @ ${entry.lastService.kmAtService.toLocaleString()} km`
                                                    : '—'}
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
