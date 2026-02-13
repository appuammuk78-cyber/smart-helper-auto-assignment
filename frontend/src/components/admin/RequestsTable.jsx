import { useState } from 'react';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function RequestsTable({
  requests,
  onCancel,
  onForceComplete,
  onManualAssign,
  onViewDetails,
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.id.toLowerCase().includes(search.toLowerCase()) ||
      req.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const matchesService = serviceFilter === 'All' || req.serviceType === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  const getStatusBadge = (status) => {
    const variants = {
      Pending: { variant: 'default', className: 'bg-amber-100 text-amber-800' },
      Assigned: { variant: 'primary', className: 'bg-blue-100 text-blue-800' },
      Completed: { variant: 'success', className: 'bg-emerald-100 text-emerald-800' },
      Cancelled: { variant: 'default', className: 'bg-gray-100 text-gray-700' },
    };
    const config = variants[status] || variants.Pending;
    return (
      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {status}
      </span>
    );
  };

  const getFraudBadge = (risk) => {
    if (risk === 'High')
      return (
        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          ⚠️ High Risk
        </span>
      );
    if (risk === 'Medium')
      return (
        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          Medium Risk
        </span>
      );
    return (
      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
        Low Risk
      </span>
    );
  };

  const columns = [
    {
      header: 'Request ID',
      accessor: 'id',
      render: (row) => (
        <span className="font-mono text-xs text-gray-600">{row.id}</span>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customerName',
    },
    {
      header: 'Service',
      accessor: 'serviceType',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Assigned Helper',
      accessor: 'assignedHelper',
      render: (row) => row.assignedHelper || <span className="text-gray-400">—</span>,
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      render: (row) =>
        new Date(row.createdAt).toLocaleString('en-IN', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      header: 'ETA',
      accessor: 'eta',
      render: (row) => `${row.eta} min`,
    },
    {
      header: 'ML Score',
      accessor: 'mlScore',
      render: (row) => (
        <Badge variant="primary" className="text-xs">
          {row.mlScore}
        </Badge>
      ),
    },
    {
      header: 'Fraud Risk',
      accessor: 'fraudRisk',
      render: (row) => getFraudBadge(row.fraudRisk),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="text-xs px-2 py-1"
            onClick={() => onViewDetails(row)}
          >
            View
          </Button>
          {row.status === 'Pending' && (
            <Button
              variant="ghost"
              className="text-xs px-2 py-1 !text-blue-600"
              onClick={() => onManualAssign(row)}
            >
              Assign
            </Button>
          )}
          {row.status !== 'Completed' && row.status !== 'Cancelled' && (
            <>
              <Button
                variant="ghost"
                className="text-xs px-2 py-1 !text-red-600"
                onClick={() => onCancel(row.id)}
              >
                Cancel
              </Button>
              <Button
                variant="ghost"
                className="text-xs px-2 py-1 !text-emerald-600"
                onClick={() => onForceComplete(row.id)}
              >
                Complete
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const uniqueServices = [...new Set(requests.map((r) => r.serviceType))];
  const uniqueStatuses = ['All', 'Pending', 'Assigned', 'Completed', 'Cancelled'];

  return (
    <Card className="shadow-lg p-0 overflow-hidden">
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by ID or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {uniqueStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Services</option>
            {uniqueServices.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-gray-500">
          Showing {filteredRequests.length} of {requests.length} requests
        </p>
      </div>
      <Table columns={columns} data={filteredRequests} />
    </Card>
  );
}
