import { useApp } from '../context/AppContext';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'vehicles', label: 'Vehicles', icon: '🚗' },
    { id: 'log', label: 'Maintenance Log', icon: '🔧' },
    { id: 'schedule', label: 'Schedule', icon: '📋' },
    { id: 'custom', label: 'Custom Services', icon: '➕' },
];

export default function Sidebar({ activePage, onNavigate, collapsed, onToggle }) {
    const { vehicles } = useApp();

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="logo">
                    {!collapsed && <span className="logo-text">🛠️ AutoCare</span>}
                    {collapsed && <span className="logo-icon">🛠️</span>}
                </div>
                <button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
                    {collapsed ? '▶' : '◀'}
                </button>
            </div>

            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                        onClick={() => onNavigate(item.id)}
                        title={item.label}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {!collapsed && <span className="nav-label">{item.label}</span>}
                    </button>
                ))}
            </nav>

            {!collapsed && (
                <div className="sidebar-footer">
                    <div className="vehicle-count">
                        <span className="count-number">{vehicles.length}</span>
                        <span className="count-label">Vehicle{vehicles.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            )}
        </aside>
    );
}
