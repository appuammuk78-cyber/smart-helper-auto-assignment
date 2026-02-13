import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminProvider, useAdmin } from '../../context/AdminContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import Modal from '../../components/ui/Modal';
import RequestsTable from '../../components/admin/RequestsTable';
import HelpersTable from '../../components/admin/HelpersTable';
import ManualAssignModal from '../../components/admin/ManualAssignModal';
import AnalyticsChart from '../../components/admin/AnalyticsChart';
import SystemMetrics from '../../components/admin/SystemMetrics';

const SIDEBAR_TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'requests', label: 'Live Requests', icon: '📋' },
  { id: 'helpers', label: 'Live Helpers', icon: '👥' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'manual-assign', label: 'Manual Assignment', icon: '✋' },
  { id: 'fraud', label: 'Fraud Detection', icon: '🛡️' },
  { id: 'logs', label: 'System Logs', icon: '📝' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

function ToastContainer({ notifications }) {
  if (!notifications?.length) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg animate-fade-in"
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}

function DashboardInner() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
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
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [manualAssignModalOpen, setManualAssignModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewDetailsModal, setViewDetailsModal] = useState(null);

  const adminName = 'Admin User';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleManualAssign = (request) => {
    setSelectedRequest(request);
    setManualAssignModalOpen(true);
  };

  const handleViewDetails = (request) => {
    setViewDetailsModal(request);
  };

  const mockHourlyData = [
    { label: '00:00', value: 12 },
    { label: '04:00', value: 8 },
    { label: '08:00', value: 45 },
    { label: '12:00', value: 78 },
    { label: '16:00', value: 92 },
    { label: '20:00', value: 65 },
  ];

  const mockServiceData = [
    { label: 'AC Repair', value: 45 },
    { label: 'Electrical', value: 32 },
    { label: 'Cleaning', value: 28 },
    { label: 'Plumbing', value: 22 },
    { label: 'Carpentry', value: 15 },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-30
            w-64 bg-white border-r border-gray-200
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  A
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Admin Panel</p>
                  <p className="text-xs text-gray-500">Smart Helper</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {SIDEBAR_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                    transition-colors text-left
                    ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-0">
          {/* Top Nav */}
          <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                  <span className="text-xl">☰</span>
                </button>
                <h1 className="text-lg font-semibold text-gray-900">
                  {SIDEBAR_TABS.find((t) => t.id === activeTab)?.label || 'Dashboard'}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3">
                  <Badge variant="success" pulse>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Online
                  </Badge>
                  <span className="text-sm text-gray-600">{adminName}</span>
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                  <span className="text-xl">🔔</span>
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
                <Button variant="ghost" onClick={handleLogout} className="text-sm">
                  Logout
                </Button>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="Total Active Requests"
                    value={metrics.totalActiveRequests}
                    icon="📋"
                  />
                  <StatCard
                    title="Total Online Helpers"
                    value={metrics.totalOnlineHelpers}
                    icon="👥"
                  />
                  <StatCard
                    title="Completed Today"
                    value={metrics.completedToday}
                    icon="✅"
                  />
                  <StatCard
                    title="Cancelled Today"
                    value={metrics.cancelledToday}
                    icon="❌"
                  />
                  <StatCard
                    title="Revenue Today"
                    value={`₹${metrics.revenueToday.toLocaleString()}`}
                    icon="💰"
                  />
                  <StatCard
                    title="Avg Response Time"
                    value={metrics.avgResponseTime}
                    icon="⏱️"
                  />
                  <StatCard
                    title="System Uptime"
                    value={metrics.systemUptime}
                    icon="🟢"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <AnalyticsChart
                      title="Requests per Hour"
                      data={mockHourlyData}
                    />
                  </div>
                  <SystemMetrics metrics={metrics} />
                </div>

                <Card className="shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Service Demand Breakdown
                  </h3>
                  <AnalyticsChart title="" data={mockServiceData} />
                </Card>
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="space-y-6">
                <RequestsTable
                  requests={requests}
                  onCancel={cancelRequest}
                  onForceComplete={forceComplete}
                  onManualAssign={handleManualAssign}
                  onViewDetails={handleViewDetails}
                />
              </div>
            )}

            {activeTab === 'helpers' && (
              <div className="space-y-6">
                <HelpersTable
                  helpers={helpers}
                  onChangeStatus={changeHelperStatus}
                  onSuspend={suspendHelper}
                  onViewProfile={(h) => alert(`Profile: ${h.name}`)}
                  onViewPerformance={(h) => alert(`Performance: ${h.name}`)}
                />
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AnalyticsChart title="Requests per Hour" data={mockHourlyData} />
                  <AnalyticsChart title="Revenue Trend" data={mockHourlyData} />
                </div>
                <Card className="shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Peak Demand Prediction
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    ML-based prediction for next 24 hours
                  </p>
                  <AnalyticsChart title="" data={mockHourlyData} />
                </Card>
              </div>
            )}

            {activeTab === 'manual-assign' && (
              <div className="space-y-6">
                <Card className="shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Manual Assignment
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Select a pending request from the Live Requests tab and click "Assign" to manually assign a helper.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setActiveTab('requests')}
                  >
                    Go to Live Requests
                  </Button>
                </Card>
              </div>
            )}

            {activeTab === 'fraud' && (
              <div className="space-y-6">
                <Card className="shadow-lg p-0 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-red-50">
                    <h3 className="text-lg font-semibold text-red-900">
                      Fraud Detection Alerts
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      {fraudAlerts.length} high-risk requests flagged
                    </p>
                  </div>
                  <div className="p-4">
                    {fraudAlerts.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        No fraud alerts at this time
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {fraudAlerts.map((alert) => {
                          const request = requests.find((r) => r.id === alert.requestId);
                          if (!request) return null;
                          return (
                            <div
                              key={alert.requestId}
                              className="p-4 border border-red-200 rounded-xl bg-red-50"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="default" className="bg-red-100 text-red-800">
                                      ⚠️ {alert.riskLevel} Risk
                                    </Badge>
                                    <span className="text-sm font-mono text-gray-600">
                                      {alert.requestId}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Customer:</span>{' '}
                                    {alert.customerName}
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Service:</span>{' '}
                                    {request.serviceType}
                                  </p>
                                  <p className="text-sm text-red-700 mt-1">
                                    <span className="font-medium">Reason:</span> {alert.reason}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="primary"
                                    className="!bg-emerald-600 hover:!bg-emerald-700"
                                    onClick={() => allowFraudRequest(alert.requestId)}
                                  >
                                    Allow
                                  </Button>
                                  <Button
                                    variant="primary"
                                    className="!bg-red-600 hover:!bg-red-700"
                                    onClick={() => blockFraudRequest(alert.requestId)}
                                  >
                                    Block
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="space-y-6">
                <Card className="shadow-lg p-0 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">System Logs</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Timestamp
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Event Type
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Actor
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Description
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {logs.slice(0, 50).map((log) => (
                          <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-xs text-gray-600">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-900">
                              {log.eventType}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-600">{log.actor}</td>
                            <td className="px-4 py-3 text-xs text-gray-600">
                              {log.description}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                  log.status === 'Success'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : log.status === 'Warning'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card className="shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">Auto-Assignment</p>
                        <p className="text-sm text-gray-500">
                          Automatically assign requests to helpers
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemSettings.autoAssignment}
                          onChange={(e) =>
                            updateSettings('autoAssignment', e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">Demand Surge Mode</p>
                        <p className="text-sm text-gray-500">
                          Enable surge pricing during peak hours
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemSettings.demandSurge}
                          onChange={(e) => updateSettings('demandSurge', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">Maintenance Mode</p>
                        <p className="text-sm text-gray-500">
                          Temporarily disable the platform
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemSettings.maintenanceMode}
                          onChange={(e) =>
                            updateSettings('maintenanceMode', e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">Notifications</p>
                        <p className="text-sm text-gray-500">
                          Enable system notifications
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemSettings.notifications}
                          onChange={(e) => updateSettings('notifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <ManualAssignModal
        open={manualAssignModalOpen}
        request={selectedRequest}
        helpers={helpers}
        onAssign={manualAssign}
        onClose={() => {
          setManualAssignModalOpen(false);
          setSelectedRequest(null);
        }}
      />

      <Modal
        open={!!viewDetailsModal}
        title="Request Details"
        onClose={() => setViewDetailsModal(null)}
      >
        {viewDetailsModal && (
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">ID:</span> {viewDetailsModal.id}
            </div>
            <div>
              <span className="font-medium">Customer:</span>{' '}
              {viewDetailsModal.customerName}
            </div>
            <div>
              <span className="font-medium">Service:</span>{' '}
              {viewDetailsModal.serviceType}
            </div>
            <div>
              <span className="font-medium">Status:</span> {viewDetailsModal.status}
            </div>
            <div>
              <span className="font-medium">Payment:</span> ₹
              {viewDetailsModal.paymentAmount}
            </div>
            <div>
              <span className="font-medium">ML Score:</span>{' '}
              {viewDetailsModal.mlScore}
            </div>
            <div>
              <span className="font-medium">Fraud Risk:</span>{' '}
              {viewDetailsModal.fraudRisk}
            </div>
          </div>
        )}
      </Modal>

      <ToastContainer notifications={notifications} />

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}

export default function Dashboard() {
  return (
    <AdminProvider>
      <DashboardInner />
    </AdminProvider>
  );
}
