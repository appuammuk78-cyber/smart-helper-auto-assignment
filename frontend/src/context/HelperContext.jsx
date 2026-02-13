import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const HelperContext = createContext(null);

const INITIAL_EARNINGS = {
  today: 0,
  totalJobs: 0,
  weekly: 0,
};

const MOCK_REQUESTS = [
  {
    customerName: 'Anita Nair',
    serviceType: 'AC Repair',
    distanceKm: 1.8,
    etaMinutes: 8,
    paymentAmount: 650,
    location: 'Panampilly Nagar, Kochi',
    requestedTime: 'Now',
    mlScore: 'High match',
    demand: 'Peak demand',
  },
  {
    customerName: 'Rahul Kumar',
    serviceType: 'Electrical',
    distanceKm: 3.2,
    etaMinutes: 15,
    paymentAmount: 450,
    location: 'Kakkanad, Kochi',
    requestedTime: 'In 30 mins',
    mlScore: 'Medium match',
    demand: 'Normal',
  },
  {
    customerName: 'Priya Menon',
    serviceType: 'Cleaning',
    distanceKm: 0.9,
    etaMinutes: 5,
    paymentAmount: 520,
    location: 'Vyttila, Kochi',
    requestedTime: 'Today, 5:30 PM',
    mlScore: 'High match',
    demand: 'High demand',
  },
];

let requestIdCounter = 1;

function createRequestFromMock(base) {
  return {
    id: `req-${Date.now()}-${requestIdCounter++}`,
    status: 'pending',
    ...base,
    createdAt: new Date().toISOString(),
  };
}

export function HelperProvider({ children }) {
  const [helperStatus, setHelperStatus] = useState('Available'); // 'Available' | 'Busy'
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [jobHistory, setJobHistory] = useState([]);
  const [earnings, setEarnings] = useState(INITIAL_EARNINGS);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // Helper name could eventually come from auth; keep it mock for now
  const helperName = 'Alex Thomas';

  // Initial mock fetch
  useEffect(() => {
    const timeout = setTimeout(() => {
      const initial = MOCK_REQUESTS.slice(0, 2).map(createRequestFromMock);
      setIncomingRequests(initial);
      setLoadingRequests(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Real-time: add new mock request every 15s when Available
  useEffect(() => {
    const interval = setInterval(() => {
      if (helperStatus !== 'Available') return;
      const base =
        MOCK_REQUESTS[Math.floor(Math.random() * MOCK_REQUESTS.length)];
      const req = createRequestFromMock(base);
      setIncomingRequests((prev) => [req, ...prev]);
      pushNotification(`New ${req.serviceType} request from ${req.customerName}`);
    }, 15000);

    return () => clearInterval(interval);
  }, [helperStatus]);

  const pushNotification = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const notif = { id, message, type };
    setNotifications((prev) => [...prev, notif]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const acceptRequest = (id) => {
    if (helperStatus === 'Busy') return;
    setIncomingRequests((prev) => {
      const req = prev.find((r) => r.id === id);
      if (!req) return prev;
      setActiveJob({
        ...req,
        jobStatus: 'Pending',
      });
      setHelperStatus('Busy');
      return prev.filter((r) => r.id !== id);
    });
  };

  const rejectRequest = (id, reason = 'Rejected') => {
    setIncomingRequests((prev) => {
      const req = prev.find((r) => r.id === id);
      if (!req) return prev;

      setJobHistory((history) => [
        {
          id: req.id,
          customerName: req.customerName,
          serviceType: req.serviceType,
          amount: req.paymentAmount,
          status: reason,
          date: new Date().toLocaleString(),
        },
        ...history,
      ]);
      return prev.filter((r) => r.id !== id);
    });
    if (reason === 'Auto-rejected') {
      pushNotification('Request auto-rejected');
    } else {
      pushNotification('Request reassigned');
    }
  };

  const updateJobStatus = (nextStatus) => {
    setActiveJob((job) => (job ? { ...job, jobStatus: nextStatus } : job));
  };

  const completeJob = () => {
    if (!activeJob) return;

    const now = new Date();
    const completedJob = {
      id: activeJob.id,
      customerName: activeJob.customerName,
      serviceType: activeJob.serviceType,
      amount: activeJob.paymentAmount,
      status: 'Completed',
      date: now.toLocaleString(),
    };

    setJobHistory((history) => [completedJob, ...history]);
    setEarnings((e) => ({
      today: e.today + activeJob.paymentAmount,
      totalJobs: e.totalJobs + 1,
      weekly: e.weekly + activeJob.paymentAmount,
    }));

    setActiveJob(null);
    setHelperStatus('Available');
    pushNotification('Job completed');
  };

  const value = useMemo(
    () => ({
      helperName,
      helperStatus,
      setHelperStatus,
      incomingRequests,
      activeJob,
      jobHistory,
      earnings,
      loadingRequests,
      notifications,
      acceptRequest,
      rejectRequest,
      updateJobStatus,
      completeJob,
    }),
    [
      helperName,
      helperStatus,
      incomingRequests,
      activeJob,
      jobHistory,
      earnings,
      loadingRequests,
      notifications,
    ],
  );

  return (
    <HelperContext.Provider value={value}>{children}</HelperContext.Provider>
  );
}

export function useHelper() {
  const ctx = useContext(HelperContext);
  if (!ctx) {
    throw new Error('useHelper must be used within HelperProvider');
  }
  return ctx;
}

