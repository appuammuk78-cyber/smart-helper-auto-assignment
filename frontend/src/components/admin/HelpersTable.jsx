import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function HelpersTable({
  helpers,
  onChangeStatus,
  onSuspend,
  onViewProfile,
  onViewPerformance,
}) {
  const getStatusBadge = (status) => {
    if (status === 'Available')
      return (
        <Badge variant="success" pulse>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Available
        </Badge>
      );
    if (status === 'Busy')
      return (
        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
          Busy
        </span>
      );
    return (
      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5" />
        Offline
      </span>
    );
  };

  const columns = [
    {
      header: 'Helper ID',
      accessor: 'id',
      render: (row) => (
        <span className="font-mono text-xs text-gray-600">{row.id}</span>
      ),
    },
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Current Job',
      accessor: 'currentJob',
      render: (row) =>
        row.currentJob ? (
          <span className="font-mono text-xs text-blue-600">{row.currentJob}</span>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      header: 'Rating',
      accessor: 'rating',
      render: (row) => (
        <span className="inline-flex items-center gap-1">
          <span className="font-medium">{row.rating}</span>
          <span className="text-yellow-500">★</span>
        </span>
      ),
    },
    {
      header: 'Earnings Today',
      accessor: 'earningsToday',
      render: (row) => `₹${row.earningsToday}`,
    },
    {
      header: 'Location',
      accessor: 'location',
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <select
            value={row.status}
            onChange={(e) => onChangeStatus(row.id, e.target.value)}
            className="text-xs px-2 py-1 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="Offline">Offline</option>
          </select>
          <Button
            variant="ghost"
            className="text-xs px-2 py-1"
            onClick={() => onViewProfile(row)}
          >
            Profile
          </Button>
          <Button
            variant="ghost"
            className="text-xs px-2 py-1"
            onClick={() => onViewPerformance(row)}
          >
            Performance
          </Button>
          <Button
            variant="ghost"
            className="text-xs px-2 py-1 !text-red-600"
            onClick={() => onSuspend(row.id)}
          >
            Suspend
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card className="shadow-lg p-0 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <p className="text-xs text-gray-500">
          {helpers.length} helpers total • {helpers.filter((h) => h.status !== 'Offline').length} online
        </p>
      </div>
      <Table columns={columns} data={helpers} />
    </Card>
  );
}
