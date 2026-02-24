import { useState } from 'react';
import { useApp } from '../context/AppContext';

const CATEGORIES = [
    'Filters & Plugs',
    'Ignition',
    'Belts & Pulleys',
    'Transmission',
    'Seals',
    'Fluids',
    'Brakes',
    'Electrical',
    'Suspension',
    'Other',
];

export default function CustomServices() {
    const { customItems, addCustomItem, deleteCustomItem } = useApp();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: '',
        category: 'Other',
        intervalKm: '',
        intervalMonths: '',
    });

    const resetForm = () => {
        setForm({ name: '', category: 'Other', intervalKm: '', intervalMonths: '' });
        setShowForm(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.intervalKm && !form.intervalMonths) {
            alert('Please specify at least one interval (km or months).');
            return;
        }
        addCustomItem({
            name: form.name.trim(),
            category: form.category,
            intervalKm: form.intervalKm ? parseInt(form.intervalKm) : null,
            intervalMonths: form.intervalMonths ? parseInt(form.intervalMonths) : null,
        });
        resetForm();
    };

    return (
        <div className="custom-services">
            <div className="page-header">
                <h1>Custom Services</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    + Add Custom Service
                </button>
            </div>

            <p className="page-subtitle">
                Add your own maintenance services to track alongside the default schedule.
            </p>

            {showForm && (
                <div className="modal-overlay" onClick={resetForm}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add Custom Service</h2>
                            <button className="modal-close" onClick={resetForm}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="form">
                            <div className="form-group">
                                <label>Service Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Timing chain"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Interval (Km)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 60000"
                                        value={form.intervalKm}
                                        onChange={e => setForm({ ...form, intervalKm: e.target.value })}
                                        min="1"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Interval (Months)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 24"
                                        value={form.intervalMonths}
                                        onChange={e => setForm({ ...form, intervalMonths: e.target.value })}
                                        min="1"
                                    />
                                </div>
                            </div>
                            <p className="form-hint">Specify at least one interval (km or months, or both).</p>
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Add Service</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {customItems.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">➕</div>
                    <h2>No custom services</h2>
                    <p>Add custom maintenance services that aren't in the default list.</p>
                </div>
            ) : (
                <div className="custom-items-grid">
                    {customItems.map(item => (
                        <div key={item.id} className="custom-item-card">
                            <div className="custom-item-header">
                                <h3>{item.name}</h3>
                                <button
                                    className="btn-icon delete"
                                    onClick={() => {
                                        if (confirm(`Delete "${item.name}"? This will also remove related log entries.`)) {
                                            deleteCustomItem(item.id);
                                        }
                                    }}
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            </div>
                            <span className="category-tag">{item.category}</span>
                            <div className="custom-item-intervals">
                                {item.intervalKm && (
                                    <span className="interval-badge">Every {item.intervalKm.toLocaleString()} km</span>
                                )}
                                {item.intervalMonths && (
                                    <span className="interval-badge">Every {item.intervalMonths} months</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
