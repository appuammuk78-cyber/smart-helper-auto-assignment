import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import CountdownTimer from '../ui/CountdownTimer';

export default function RequestCard({
  request,
  onAccept,
  onReject,
  onAutoReject,
  disableAccept,
}) {
  return (
    <Card className="shadow-lg animate-fade-in">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="font-semibold text-gray-900">
            {request.customerName}
          </h3>
          <p className="text-sm text-gray-500">
            {request.serviceType} • {request.distanceKm.toFixed(1)} km away
          </p>
          <p className="mt-1 text-sm text-gray-500">
            ETA {request.etaMinutes} min • ₹{request.paymentAmount}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant="primary">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            {request.mlScore}
          </Badge>
          <Badge variant="success" className="mt-1">
            {request.demand}
          </Badge>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-500 space-y-1.5">
        <p>📍 {request.location}</p>
        <p>🕒 {request.requestedTime}</p>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <CountdownTimer
          initialSeconds={10}
          onExpire={() => onAutoReject(request.id)}
        />
        <div className="flex gap-3">
          <Button
            variant="primary"
            className="flex-1 py-2"
            onClick={() => onAccept(request.id)}
            disabled={disableAccept}
          >
            Accept
          </Button>
          <Button
            variant="ghost"
            className="flex-1 py-2 !text-red-600 hover:!bg-red-50"
            onClick={() => onReject(request.id)}
          >
            Reject
          </Button>
        </div>
      </div>
    </Card>
  );
}

