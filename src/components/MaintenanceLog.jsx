import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function MaintenanceLog() {
    const { vehicles, logs, allMaintenanceItems, addLog, deleteLog } = useApp();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ vehicleId: '', itemId: '', date: '', kmAtService: '', notes: '' });
    const [filterVehicle, setFilterVehicle] = useState('all');

    const resetForm = () => {
        setForm({ vehicleId: '', itemId: '', date: '', kmAtService: '', notes: '' });
        setShowForm(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addLog({
            vehicleId: form.vehicleId,
            itemId: form.itemId,
            date: form.date,
            kmAtService: parseInt(form.kmAtService),
            notes: form.notes.trim(),
        });
        resetForm();
    };

    const handleVehicleSelect = (vehicleId) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        setForm({
            ...form,
            vehicleId,
            kmAtService: vehicle ? vehicle.currentKm.toString() : '',
        });
    };

    const filteredLogs = filterVehicle === 'all'
        ? [...logs].sort((a, b) => new Date(b.date) - new Date(a.date))
        : [...logs].filter(l => l.vehicleId === filterVehicle).sort((a, b) => new Date(b.date) - new Date(a.date));

    const getItemName = (itemId) => {
        const item = allMaintenanceItems.find(i => i.id === itemId);
        return item ? item.name : 'Unknown Service';
    };

    const getVehicleName = (vehicleId) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        return vehicle ? vehicle.name : 'Unknown Vehicle';
    };

    return (
        <div className="maintenance-log">
            <div className="page-header">
                <h1>Maintenance Log</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(true)} disabled={vehicles.length === 0}>
                    + Log Service
                </button>
            </div>

            {showForm && (
                <div className="modal-overlay" onClick={resetForm}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Log Maintenance Service</h2>
                            <button className="modal-close" onClick={resetForm}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="form">
                            <div className="form-group">
                                <label>Vehicle</label>
                                <select
                                    value={form.vehicleId}
                                    onChange={e => handleVehicleSelect(e.target.value)}
                                    required
                                >
                                    <option value="">Select a vehicle...</option>
                                    {vehicles.map(v => (
                                        <option key={v.id} value={v.id}>{v.name} — {v.year} {v.make} {v.model}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Service</label>
                                <select
                                    value={form.itemId}
                                    onChange={e => setForm({ ...form, itemId: e.target.value })}
                                    required
                                >
                                    <option value="">Select a service...</option>
                                    {allMaintenanceItems.map(item => (
                                        <option key={item.id} value={item.id}>
                                            {item.name} {item.isCustom ? '(Custom)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={form.date}
                                        onChange={e => setForm({ ...form, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Km at Service</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 50000"
                                        value={form.kmAtService}
                                        onChange={e => setForm({ ...form, kmAtService: e.target.value })}
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Notes (optional)</label>
                                <textarea
                                    placeholder="Any additional notes..."
                                    value={form.notes}
                                    onChange={e => setForm({ ...form, notes: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Log Service</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {vehicles.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🔧</div>
                    <h2>Add a vehicle first</h2>
                    <p>You need to add a vehicle before logging maintenance.</p>
                </div>
            ) : (
                <>
                    <div className="filter-bar">
                        <label>Filter by vehicle:</label>
                        <select value={filterVehicle} onChange={e => setFilterVehicle(e.target.value)}>
                            <option value="all">All Vehicles</option>
                            {vehicles.map(v => (
                                <option key={v.id} value={v.id}>{v.name}</option>
                            ))}
                        </select>
                    </div>

                    {filteredLogs.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <h2>No maintenance records</h2>
                            <p>Click "Log Service" to record a completed maintenance.</p>
                        </div>
                    ) : (
                        <div className="log-table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Vehicle</th>
                                        <th>Service</th>
                                        <th>Km</th>
                                        <th>Notes</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLogs.map(log => (
                                        <tr key={log.id}>
                                            <td>{new Date(log.date).toLocaleDateString()}</td>
                                            <td>{getVehicleName(log.vehicleId)}</td>
                                            <td>{getItemName(log.itemId)}</td>
                                            <td>{log.kmAtService.toLocaleString()}</td>
                                            <td className="notes-cell">{log.notes || '—'}</td>
                                            <td>
                                                <button
                                                    className="btn-icon delete"
                                                    onClick={() => {
                                                        if (confirm('Delete this log entry?')) deleteLog(log.id);
                                                    }}
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
