import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function ManualAssignModal({
  open,
  request,
  helpers,
  onAssign,
  onClose,
}) {
  const [selectedHelper, setSelectedHelper] = useState('');

  if (!request) return null;

  const availableHelpers = helpers.filter((h) => h.status === 'Available');

  const handleAssign = () => {
    if (selectedHelper) {
      onAssign(request.id, selectedHelper);
      setSelectedHelper('');
      onClose();
    }
  };

  return (
    <Modal open={open} title="Manual Assignment" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Request Details</p>
          <div className="mt-2 p-3 bg-gray-50 rounded-xl space-y-1 text-sm">
            <p>
              <span className="font-medium">ID:</span> {request.id}
            </p>
            <p>
              <span className="font-medium">Customer:</span> {request.customerName}
            </p>
            <p>
              <span className="font-medium">Service:</span> {request.serviceType}
            </p>
            <p>
              <span className="font-medium">ML Score:</span>{' '}
              <Badge variant="primary">{request.mlScore}</Badge>
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Helper
          </label>
          {availableHelpers.length === 0 ? (
            <p className="text-sm text-gray-500 p-3 bg-amber-50 rounded-xl">
              No available helpers at the moment
            </p>
          ) : (
            <select
              value={selectedHelper}
              onChange={(e) => setSelectedHelper(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a helper...</option>
              {availableHelpers.map((helper) => (
                <option key={helper.id} value={helper.id}>
                  {helper.name} • Rating: {helper.rating} • Location: {helper.location}
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedHelper && (
          <div className="p-3 bg-blue-50 rounded-xl">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Selected:</span>{' '}
              {helpers.find((h) => h.id === selectedHelper)?.name}
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            variant="primary"
            fullWidth
            onClick={handleAssign}
            disabled={!selectedHelper}
          >
            Confirm Assignment
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
