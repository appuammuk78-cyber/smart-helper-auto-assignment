import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function CustomerBook() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const service = state?.service || {
    id: 'home-cleaning',
    name: 'Home Cleaning',
    icon: '🧹',
    description: 'Professional home cleaning services',
    startingPrice: 50,
  };

  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const serviceFee = service.startingPrice ?? 50;
  const total = serviceFee;

  const handleFindHelper = (e) => {
    e.preventDefault();
    navigate('/customer/assigned', {
      state: {
        service,
        address: address || 'Enter service location',
        date: date || 'dd-mm-yyyy',
        time: time || '--:--',
        helper: {
          name: 'John Smith',
          image: null,
          status: 'AVAILABLE',
          rating: 4.8,
          jobsCompleted: 245,
          mlScore: 92,
          distance: '2.3 miles',
          eta: '15 mins',
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link
            to="/customer"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
          >
            ← Back
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card className="shadow-lg">
          {/* Service summary */}
          <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-3xl flex-shrink-0">
              {service.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
              <p className="text-gray-500 mt-0.5">{service.description}</p>
            </div>
          </div>

          <form onSubmit={handleFindHelper} className="pt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <span className="inline-flex items-center gap-1.5">📍 Service Address</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter service location"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="inline-flex items-center gap-1.5">📅 Date</span>
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="dd-mm-yyyy"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="inline-flex items-center gap-1.5">🕐 Time</span>
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="--:--"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific requirements?"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Pricing */}
            <div className="py-4 space-y-2 border-t border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Service Fee</span>
                <span>${serviceFee}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 text-lg">
                <span>Total</span>
                <span className="text-blue-600">${total}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="py-3 rounded-xl !bg-blue-600 hover:!bg-blue-700"
            >
              Find Helper
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
