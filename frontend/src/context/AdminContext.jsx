import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AdminContext = createContext(null);

const MOCK_SERVICES = ['AC Repair', 'Electrical', 'Cleaning', 'Plumbing', 'Carpentry'];
const MOCK_CUSTOMERS = ['Anita Nair', 'Rahul Kumar', 'Priya Menon', 'Vikram Singh', 'Meera Nair'];
const MOCK_HELPERS = ['Alex Thomas', 'Rajesh Kumar', 'Sneha Menon', 'Kiran Nair', 'Arjun Das'];

function generateRequestId() {
  return `REQ-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function generateHelperId() {
  return `HLP-${Math.random().toString(36).slice(2, 9).toUpperCase()}`;
}

function createMockRequest() {
  return {
    id: generateRequestId(),
    customerName: MOCK_CUSTOMERS[Math.floor(Math.random() * MOCK_CUSTOMERS.length)],
    serviceType: MOCK_SERVICES[Math.floor(Math.random() * MOCK_SERVICES.length)],
    status: 'Pending',
    assignedHelper: null,
    createdAt: new Date().toISOString(),
    eta: Math.floor(Math.random() * 30) + 5,
    mlScore: ['High match', 'Medium match', 'Low match'][Math.floor(Math.random() * 3)],
    fraudRisk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
    paymentAmount: Math.floor(Math.random() * 500) + 300,
  };
}

function createMockHelper() {
  const statuses = ['Available', 'Busy', 'Offline'];
  return {
    id: generateHelperId(),
    name: MOCK_HELPERS[Math.floor(Math.random() * MOCK_HELPERS.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    currentJob: null,
    rating: (Math.random() * 2 + 3).toFixed(1),
    earningsToday: Math.floor(Math.random() * 2000) + 500,
    location: ['Kochi', 'Ernakulam', 'Thrissur'][Math.floor(Math.random() * 3)],
  };
}

export function AdminProvider({ children }) {
  const [requests, setRequests] = useState([]);
  const [helpers, setHelpers] = useState([]);
  const [metrics, setMetrics] = useState({
    totalActiveRequests: 0,
    totalOnlineHelpers: 0,
    completedToday: 0,
    cancelledToday: 0,
    revenueToday: 0,
    avgResponseTime: '4.2 min',
    systemUptime: '99.8%',
  });
  const [logs, setLogs] = useState([]);
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [systemSettings, setSystemSettings] = useState({
    autoAssignment: true,
    demandSurge: false,
    maintenanceMode: false,
    notifications: true,
  });
  const [notifications, setNotifications] = useState([]);

  // Initialize mock data
  useEffect(() => {
    const initialRequests = Array.from({ length: 8 }, createMockRequest);
    const initialHelpers = Array.from({ length: 12 }, createMockHelper);
    setRequests(initialRequests);
    setHelpers(initialHelpers);

    const initialLogs = Array.from({ length: 20 }, (_, i) => ({
      id: `log-${i}`,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      eventType: ['Request Created', 'Helper Assigned', 'Job Completed', 'System Update'][Math.floor(Math.random() * 4)],
      actor: ['System', 'Admin', 'Helper'][Math.floor(Math.random() * 3)],
      description: 'Mock log entry',
      status: ['Success', 'Warning', 'Error'][Math.floor(Math.random() * 3)],
    }));
    setLogs(initialLogs);

    const initialFraud = initialRequests
      .filter((r) => r.fraudRisk === 'High')
      .map((r) => ({
        requestId: r.id,
        customerName: r.customerName,
        riskLevel: r.fraudRisk,
        reason: 'Suspicious payment pattern',
      }));
    setFraudAlerts(initialFraud);
  }, []);

  // Update metrics
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics({
        totalActiveRequests: requests.filter((r) => r.status !== 'Completed' && r.status !== 'Cancelled').length,
        totalOnlineHelpers: helpers.filter((h) => h.status !== 'Offline').length,
        completedToday: requests.filter((r) => r.status === 'Completed').length,
        cancelledToday: requests.filter((r) => r.status === 'Cancelled').length,
        revenueToday: requests
          .filter((r) => r.status === 'Completed')
          .reduce((sum, r) => sum + r.paymentAmount, 0),
        avgResponseTime: `${(Math.random() * 2 + 3).toFixed(1)} min`,
        systemUptime: '99.8%',
      });
    };
    updateMetrics();
  }, [requests, helpers]);

  // Real-time: Add new request every 20s
  useEffect(() => {
    const interval = setInterval(() => {
      const newReq = createMockRequest();
      setRequests((prev) => [newReq, ...prev]);
      pushNotification(`New ${newReq.serviceType} request from ${newReq.customerName}`);
      
      if (newReq.fraudRisk === 'High') {
        setFraudAlerts((prev) => [
          {
            requestId: newReq.id,
            customerName: newReq.customerName,
            riskLevel: 'High',
            reason: 'Suspicious payment pattern',
          },
          ...prev,
        ]);
      }

      setLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          eventType: 'Request Created',
          actor: 'System',
          description: `New ${newReq.serviceType} request created`,
          status: 'Success',
        },
        ...prev.slice(0, 49),
      ]);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  // Simulate helper status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setHelpers((prev) =>
        prev.map((h) => {
          if (Math.random() > 0.7) {
            const statuses = ['Available', 'Busy', 'Offline'];
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            if (h.status !== newStatus) {
              pushNotification(`Helper ${h.name} is now ${newStatus}`);
            }
            return { ...h, status: newStatus };
          }
          return h;
        }),
      );
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Simulate request status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRequests((prev) =>
        prev.map((req) => {
          if (req.status === 'Pending' && Math.random() > 0.85) {
            const helper = helpers.find((h) => h.status === 'Available');
            if (helper) {
              pushNotification(`Request ${req.id} assigned to ${helper.name}`);
              return {
                ...req,
                status: 'Assigned',
                assignedHelper: helper.name,
              };
            }
          }
          if (req.status === 'Assigned' && Math.random() > 0.9) {
            pushNotification(`Request ${req.id} completed`);
            return { ...req, status: 'Completed' };
          }
          return req;
        }),
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [helpers]);

  const pushNotification = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const notif = { id, message, type };
    setNotifications((prev) => [...prev, notif]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const cancelRequest = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Cancelled' } : r)),
    );
    pushNotification(`Request ${id} cancelled`);
  };

  const forceComplete = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Completed' } : r)),
    );
    pushNotification(`Request ${id} force completed`);
  };

  const manualAssign = (requestId, helperId) => {
    const helper = helpers.find((h) => h.id === helperId);
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'Assigned', assignedHelper: helper?.name || 'Unknown' }
          : r,
      ),
    );
    setHelpers((prev) =>
      prev.map((h) =>
        h.id === helperId ? { ...h, status: 'Busy', currentJob: requestId } : h,
      ),
    );
    pushNotification(`Request ${requestId} manually assigned to ${helper?.name}`);
  };

  const changeHelperStatus = (helperId, newStatus) => {
    setHelpers((prev) =>
      prev.map((h) => (h.id === helperId ? { ...h, status: newStatus } : h)),
    );
    pushNotification(`Helper status updated to ${newStatus}`);
  };

  const suspendHelper = (helperId) => {
    setHelpers((prev) =>
      prev.map((h) => (h.id === helperId ? { ...h, status: 'Offline' } : h)),
    );
    pushNotification('Helper suspended');
  };

  const blockFraudRequest = (requestId) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Cancelled', fraudRisk: 'Blocked' } : r)),
    );
    setFraudAlerts((prev) => prev.filter((a) => a.requestId !== requestId));
    pushNotification(`Request ${requestId} blocked due to fraud`);
  };

  const allowFraudRequest = (requestId) => {
    setFraudAlerts((prev) => prev.filter((a) => a.requestId !== requestId));
    pushNotification(`Request ${requestId} allowed`);
  };

  const updateSettings = (key, value) => {
    setSystemSettings((prev) => ({ ...prev, [key]: value }));
    pushNotification(`Setting ${key} updated`);
  };

  const value = useMemo(
    () => ({
      requests,
      helpers,
      metrics,
      logs,
      fraudAlerts,
      systemSettings,
      notifications,
      cancelRequest,
      forceComplete,
      manualAssign,
      changeHelperStatus,
      suspendHelper,
      blockFraudRequest,
      allowFraudRequest,
      updateSettings,
    }),
    [requests, helpers, metrics, logs, fraudAlerts, systemSettings, notifications],
  );

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return ctx;
}
