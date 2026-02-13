import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HelperProvider, useHelper } from '../../context/HelperContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import RequestCard from '../../components/helper/RequestCard';
import StatusToggle from '../../components/helper/StatusToggle';
import EarningsCard from '../../components/helper/EarningsCard';

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
  } = useHelper();

  const [showEarningsModal, setShowEarningsModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCompleteJob = () => {
    completeJob();
    setShowEarningsModal(true);
  };

  const handleAdvanceJob = () => {
    if (!activeJob) return;
    const flow = ['Pending', 'On The Way', 'In Progress', 'Completed'];
    const index = flow.indexOf(activeJob.jobStatus);
    if (index === -1 || index === flow.length - 1) return;
    const next = flow[index + 1];
    if (next === 'Completed') {
      handleCompleteJob();
    } else {
      updateJobStatus(next);
    }
  };

  const isAvailable = helperStatus === 'Available';

  const jobStatusLabel = activeJob?.jobStatus || 'No active job';
  const jobStatusColor =
    activeJob?.jobStatus === 'Pending'
      ? 'bg-amber-100 text-amber-800'
      : activeJob?.jobStatus === 'On The Way'
      ? 'bg-blue-100 text-blue-800'
      : activeJob?.jobStatus === 'In Progress'
      ? 'bg-emerald-100 text-emerald-800'
      : activeJob?.jobStatus === 'Completed'
      ? 'bg-gray-100 text-gray-700'
      : 'bg-gray-100 text-gray-700';

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Top Nav */}
        <header className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-semibold text-lg">
                H
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  Smart Helper
                </p>
                <p className="text-xs text-gray-500">
                  Logged in as{' '}
                  <span className="font-medium">
                    {helperName || user?.email}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusToggle
                status={helperStatus}
                onToggle={() =>
                  setHelperStatus(
                    helperStatus === 'Available' ? 'Busy' : 'Available',
                  )
                }
              />
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-sm px-3 py-1.5"
              >
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          {/* Top row: Incoming + Earnings */}
          <section className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Incoming Requests
                </h2>
                <Badge variant="primary">
                  Live • {incomingRequests.length} waiting
                </Badge>
              </div>

              {loadingRequests ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((k) => (
                    <Card key={k} className="shadow-lg">
                      <div className="animate-pulse space-y-3">
                        <div className="flex justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                            <div className="h-3 bg-gray-100 rounded w-2/3" />
                            <div className="h-3 bg-gray-100 rounded w-1/3" />
                          </div>
                          <div className="w-20 h-6 bg-gray-100 rounded-full" />
                        </div>
                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : incomingRequests.length === 0 ? (
                <Card className="shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <span className="text-lg">📡</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        No live requests
                      </p>
                      <p className="text-sm text-gray-500">
                        Stay online and we’ll route new jobs to you in real
                        time.
                      </p>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="space-y-3">
                  {incomingRequests.map((req) => (
                    <RequestCard
                      key={req.id}
                      request={req}
                      onAccept={acceptRequest}
                      onReject={(id) => rejectRequest(id, 'Rejected')}
                      onAutoReject={(id) => rejectRequest(id, 'Auto-rejected')}
                      disableAccept={!isAvailable}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Earnings overview */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Earnings Overview
              </h2>
              <div className="space-y-3">
                <EarningsCard
                  title="Today's Earnings"
                  value={`₹${earnings.today.toFixed(0)}`}
                  subtitle="Updated in real time as you complete jobs"
                />
                <EarningsCard
                  title="Total Jobs Completed"
                  value={earnings.totalJobs}
                />
                <EarningsCard
                  title="This Week"
                  value={`₹${earnings.weekly.toFixed(0)}`}
                />
              </div>
            </div>
          </section>

          {/* Active job & history */}
          <section className="grid gap-6 lg:grid-cols-3">
            {/* Active job */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Active Job
                </h2>
              </div>
              <Card className="shadow-lg min-h-[160px] flex flex-col justify-center">
                {!activeJob ? (
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-lg">🕒</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        You’re currently {helperStatus}
                      </p>
                      <p className="text-sm text-gray-500">
                        Accept a new request to start a job.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {activeJob.customerName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activeJob.serviceType} •{' '}
                          {activeJob.distanceKm.toFixed(1)} km away
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${jobStatusColor}`}
                      >
                        {jobStatusLabel}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Payment: ₹{activeJob.paymentAmount}
                    </p>
                    <p className="text-sm text-gray-500">
                      Location: {activeJob.location}
                    </p>
                    <div className="flex gap-3 pt-1">
                      <Button
                        type="button"
                        variant="primary"
                        className="flex-1 py-2"
                        onClick={handleAdvanceJob}
                      >
                        {activeJob.jobStatus === 'Pending'
                          ? 'Start Job'
                          : activeJob.jobStatus === 'On The Way'
                          ? 'Mark In Progress'
                          : activeJob.jobStatus === 'In Progress'
                          ? 'Complete Job'
                          : 'Job Completed'}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* History */}
            <div className="lg:col-span-2 space-y-4 overflow-x-auto">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Request History
                </h2>
              </div>
              <Card className="shadow-lg p-0 overflow-hidden">
                <div className="min-w-full overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-left text-gray-500">
                      <tr>
                        <th className="px-4 py-2 font-medium">Customer</th>
                        <th className="px-4 py-2 font-medium">Service</th>
                        <th className="px-4 py-2 font-medium">Date</th>
                        <th className="px-4 py-2 font-medium">Amount</th>
                        <th className="px-4 py-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobHistory.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-6 text-center text-gray-500"
                          >
                            No history yet. Completed, cancelled, and rejected
                            jobs will appear here.
                          </td>
                        </tr>
                      ) : (
                        jobHistory.slice(0, 8).map((job) => (
                          <tr
                            key={job.id}
                            className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-2 text-gray-900">
                              {job.customerName}
                            </td>
                            <td className="px-4 py-2 text-gray-500">
                              {job.serviceType}
                            </td>
                            <td className="px-4 py-2 text-gray-500">
                              {job.date}
                            </td>
                            <td className="px-4 py-2 text-gray-900">
                              ₹{job.amount}
                            </td>
                            <td className="px-4 py-2">
                              <span
                                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  job.status === 'Completed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : job.status === 'Cancelled'
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {job.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </section>
        </main>
      </div>

      <Modal
        open={showEarningsModal}
        title="Job Completed"
        onClose={() => setShowEarningsModal(false)}
      >
        <p className="text-sm text-gray-600">
          Great job! Your earnings summary has been updated.
        </p>
        <div className="mt-3 space-y-1 text-sm text-gray-700">
          <p>
            <span className="font-medium">Today:</span> ₹
            {earnings.today.toFixed(0)}
          </p>
          <p>
            <span className="font-medium">Total jobs completed:</span>{' '}
            {earnings.totalJobs}
          </p>
        </div>
      </Modal>

      <ToastContainer notifications={notifications} />
    </>
  );
}

export default function Dashboard() {
  return (
    <HelperProvider>
      <DashboardInner />
    </HelperProvider>
  );
}

