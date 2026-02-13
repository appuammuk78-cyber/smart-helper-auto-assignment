import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function SystemMetrics({ metrics }) {
  return (
    <Card className="shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">System Uptime</span>
          <Badge variant="success">{metrics.systemUptime}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Avg Response Time</span>
          <span className="text-sm font-medium text-gray-900">
            {metrics.avgResponseTime}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Active Requests</span>
          <span className="text-sm font-medium text-gray-900">
            {metrics.totalActiveRequests}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Online Helpers</span>
          <span className="text-sm font-medium text-gray-900">
            {metrics.totalOnlineHelpers}
          </span>
        </div>
      </div>
    </Card>
  );
}
