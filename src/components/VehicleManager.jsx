import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function VehicleManager() {
    const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useApp();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: '', make: '', model: '', year: '', currentKm: '' });
    const [updateKmId, setUpdateKmId] = useState(null);
    const [newKm, setNewKm] = useState('');

    const resetForm = () => {
        setForm({ name: '', make: '', model: '', year: '', currentKm: '' });
        setShowForm(false);
        setEditingId(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: form.name.trim(),
            make: form.make.trim(),
            model: form.model.trim(),
            year: parseInt(form.year),
            currentKm: parseInt(form.currentKm),
        };

        if (editingId) {
            updateVehicle(editingId, data);
        } else {
            addVehicle(data);
        }
        resetForm();
    };

    const startEdit = (vehicle) => {
        setForm({
            name: vehicle.name,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year.toString(),
            currentKm: vehicle.currentKm.toString(),
        });
        setEditingId(vehicle.id);
        setShowForm(true);
    };

    const handleUpdateKm = (vehicleId) => {
        if (newKm && !isNaN(newKm)) {
            updateVehicle(vehicleId, { currentKm: parseInt(newKm) });
            setUpdateKmId(null);
            setNewKm('');
        }
    };

    return (
        <div className="vehicle-manager">
            <div className="page-header">
                <h1>Vehicles</h1>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
                    + Add Vehicle
                </button>
            </div>

            {showForm && (
                <div className="modal-overlay" onClick={resetForm}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingId ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
                            <button className="modal-close" onClick={resetForm}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="form">
                            <div className="form-group">
                                <label>Vehicle Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. My BMW"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Make</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. BMW"
                                        value={form.make}
                                        onChange={e => setForm({ ...form, make: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Model</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 320d"
                                        value={form.model}
                                        onChange={e => setForm({ ...form, model: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Year</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 2020"
                                        value={form.year}
                                        onChange={e => setForm({ ...form, year: e.target.value })}
                                        required
                                        min="1900"
                                        max="2030"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Current Km</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 50000"
                                        value={form.currentKm}
                                        onChange={e => setForm({ ...form, currentKm: e.target.value })}
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingId ? 'Update' : 'Add Vehicle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {vehicles.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🚗</div>
                    <h2>No vehicles added</h2>
                    <p>Click "Add Vehicle" to get started.</p>
                </div>
            ) : (
                <div className="vehicle-grid">
                    {vehicles.map(vehicle => (
                        <div key={vehicle.id} className="vehicle-card">
                            <div className="vehicle-card-header">
                                <h3>{vehicle.name}</h3>
                                <div className="vehicle-actions">
                                    <button className="btn-icon" onClick={() => startEdit(vehicle)} title="Edit">✏️</button>
                                    <button className="btn-icon" onClick={() => {
                                        if (confirm(`Delete ${vehicle.name}? This will also remove all maintenance logs.`)) {
                                            deleteVehicle(vehicle.id);
                                        }
                                    }} title="Delete">🗑️</button>
                                </div>
                            </div>
                            <div className="vehicle-card-body">
                                <div className="vehicle-info">
                                    <span className="vehicle-make-model">{vehicle.year} {vehicle.make} {vehicle.model}</span>
                                </div>
                                <div className="vehicle-km-display">
                                    <span className="km-value">{vehicle.currentKm.toLocaleString()}</span>
                                    <span className="km-label">km</span>
                                </div>
                                {updateKmId === vehicle.id ? (
                                    <div className="km-update-form">
                                        <input
                                            type="number"
                                            placeholder="New km reading"
                                            value={newKm}
                                            onChange={e => setNewKm(e.target.value)}
                                            min={vehicle.currentKm}
                                            autoFocus
                                        />
                                        <button className="btn btn-small btn-primary" onClick={() => handleUpdateKm(vehicle.id)}>Save</button>
                                        <button className="btn btn-small btn-secondary" onClick={() => { setUpdateKmId(null); setNewKm(''); }}>Cancel</button>
                                    </div>
                                ) : (
                                    <button className="btn btn-small btn-outline" onClick={() => { setUpdateKmId(vehicle.id); setNewKm(vehicle.currentKm.toString()); }}>
                                        Update Odometer
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
