import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import defaultMaintenanceItems from '../data/maintenanceItems';

const AppContext = createContext();

const STORAGE_KEYS = {
    vehicles: 'vmt_vehicles',
    logs: 'vmt_logs',
    customItems: 'vmt_custom_items',
};

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function loadFromStorage(key, fallback = []) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
    } catch {
        return fallback;
    }
}

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function AppProvider({ children }) {
    const [vehicles, setVehicles] = useState(() => loadFromStorage(STORAGE_KEYS.vehicles));
    const [logs, setLogs] = useState(() => loadFromStorage(STORAGE_KEYS.logs));
    const [customItems, setCustomItems] = useState(() => loadFromStorage(STORAGE_KEYS.customItems));
    const [isSyncing, setIsSyncing] = useState(false);
    const isInitialMount = useRef(true);

    // Initial load from server
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/data');
                if (response.ok) {
                    const data = await response.json();
                    if (data.vehicles) setVehicles(data.vehicles);
                    if (data.logs) setLogs(data.logs);
                    if (data.customItems) setCustomItems(data.customItems);
                    console.log('Data synced from server');
                }
            } catch (error) {
                console.error('Failed to fetch data from server:', error);
            }
        };
        fetchData();
    }, []);

    // Persist to server and localStorage on changes
    useEffect(() => {
        saveToStorage(STORAGE_KEYS.vehicles, vehicles);
        saveToStorage(STORAGE_KEYS.logs, logs);
        saveToStorage(STORAGE_KEYS.customItems, customItems);

        // Skip the very first run to avoid overwriting server data with local empty state
        // or re-sending what we just fetched.
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const syncToServer = async () => {
            setIsSyncing(true);
            try {
                await fetch('/api/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ vehicles, logs, customItems }),
                });
            } catch (error) {
                console.error('Failed to sync data to server:', error);
            } finally {
                setIsSyncing(false);
            }
        };

        const timeout = setTimeout(syncToServer, 1000); // Debounce sync
        return () => clearTimeout(timeout);
    }, [vehicles, logs, customItems]);

    // All maintenance items (default + custom)
    const allMaintenanceItems = [...defaultMaintenanceItems, ...customItems];

    // Vehicle CRUD
    const addVehicle = useCallback((vehicle) => {
        setVehicles(prev => [...prev, { ...vehicle, id: generateId() }]);
    }, []);

    const updateVehicle = useCallback((id, updates) => {
        setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
    }, []);

    const deleteVehicle = useCallback((id) => {
        setVehicles(prev => prev.filter(v => v.id !== id));
        setLogs(prev => prev.filter(l => l.vehicleId !== id));
    }, []);

    // Maintenance log CRUD
    const addLog = useCallback((log) => {
        setLogs(prev => [...prev, { ...log, id: generateId() }]);
    }, []);

    const deleteLog = useCallback((id) => {
        setLogs(prev => prev.filter(l => l.id !== id));
    }, []);

    // Custom maintenance items
    const addCustomItem = useCallback((item) => {
        const newItem = { ...item, id: generateId(), isCustom: true };
        setCustomItems(prev => [...prev, newItem]);
    }, []);

    const deleteCustomItem = useCallback((id) => {
        setCustomItems(prev => prev.filter(i => i.id !== id));
        setLogs(prev => prev.filter(l => l.itemId !== id));
    }, []);

    // Calculate maintenance status for a vehicle
    const getMaintenanceStatus = useCallback((vehicleId) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return [];

        return allMaintenanceItems.map(item => {
            const relevantLogs = logs
                .filter(l => l.vehicleId === vehicleId && l.itemId === item.id)
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            const lastService = relevantLogs[0] || null;

            let kmRemaining = null;
            let monthsRemaining = null;
            let status = 'ok'; // ok, warning, overdue, unknown

            if (lastService) {
                if (item.intervalKm) {
                    const kmSinceLast = vehicle.currentKm - lastService.kmAtService;
                    kmRemaining = item.intervalKm - kmSinceLast;
                }
                if (item.intervalMonths) {
                    const lastDate = new Date(lastService.date);
                    const now = new Date();
                    const monthsSinceLast = (now.getFullYear() - lastDate.getFullYear()) * 12 + (now.getMonth() - lastDate.getMonth());
                    monthsRemaining = item.intervalMonths - monthsSinceLast;
                }

                // Determine status
                if (kmRemaining !== null && kmRemaining <= 0) status = 'overdue';
                else if (monthsRemaining !== null && monthsRemaining <= 0) status = 'overdue';
                else if (kmRemaining !== null && kmRemaining < item.intervalKm * 0.25) status = 'warning';
                else if (monthsRemaining !== null && monthsRemaining < item.intervalMonths * 0.25) status = 'warning';
            } else {
                status = 'unknown';
            }

            return {
                item,
                lastService,
                kmRemaining,
                monthsRemaining,
                status,
            };
        });
    }, [vehicles, logs, allMaintenanceItems]);

    const value = {
        vehicles,
        logs,
        customItems,
        allMaintenanceItems,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addLog,
        deleteLog,
        addCustomItem,
        deleteCustomItem,
        getMaintenanceStatus,
        isSyncing,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}

