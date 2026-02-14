import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

// Default map center (e.g. service location) - can be passed via state later
const DEFAULT_MAP_CENTER = { lat: 40.7128, lng: -74.006 };
const MAP_ZOOM = 15;

export default function CustomerHelperAssigned() {
  const { state } = useLocation();
  const [showMap, setShowMap] = useState(false);
  const { service, helper } = state || {};
  const h = helper || {
    name: 'John Smith',
    image: null,
    status: 'AVAILABLE',
    rating: 4.8,
    jobsCompleted: 245,
    mlScore: 92,
    distance: '2.3 miles',
    eta: '15 mins',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link
            to="/customer"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Back
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Success message */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Helper Assigned!</h1>
          <p className="text-gray-600 mt-1">Your helper is on the way.</p>
        </div>

        <Card className="shadow-lg">
          {/* Helper card */}
          <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-500 flex-shrink-0 overflow-hidden">
              {h.image ? (
                <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
              ) : (
                h.name.charAt(0)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  {h.status}
                </span>
                <h2 className="font-semibold text-gray-900 text-lg">{h.name}</h2>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <span className="inline-flex items-center gap-0.5 text-amber-500">★ {h.rating}</span>
                <span>{h.jobsCompleted} jobs completed</span>
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  ML Score: {h.mlScore}%
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="secondary"
                  className="!rounded-xl flex-1 !border-gray-300 !text-gray-700"
                >
                  📞 Call Helper
                </Button>
                <Button
                  variant="secondary"
                  className="!rounded-xl flex-1 !border-gray-300 !text-gray-700"
                >
                  💬 Message
                </Button>
              </div>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <span>📍 Distance {h.distance}</span>
                <span>🕐 ETA {h.eta}</span>
              </div>
            </div>
          </div>

          {/* Service details */}
          <div className="pt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Service Details</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  Service: {service?.name || 'Home Cleaning'}
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                IN PROGRESS
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="primary"
              fullWidth
              className="py-3 rounded-xl !bg-blue-600 hover:!bg-blue-700"
              onClick={() => setShowMap((v) => !v)}
            >
              {showMap ? 'Hide Map' : 'Track Helper'}
            </Button>
          </div>
        </Card>

        {/* Map section - shown when Track Helper is clicked */}
        {showMap && (
          <Card className="mt-6 shadow-lg p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Helper location</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Live location • ETA {h.eta}
              </p>
            </div>
            <div className="aspect-[4/3] w-full min-h-[280px] bg-gray-100">
              <iframe
                title="Helper location map"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${DEFAULT_MAP_CENTER.lng - 0.02}%2C${DEFAULT_MAP_CENTER.lat - 0.02}%2C${DEFAULT_MAP_CENTER.lng + 0.02}%2C${DEFAULT_MAP_CENTER.lat + 0.02}&layer=mapnik&marker=${DEFAULT_MAP_CENTER.lat}%2C${DEFAULT_MAP_CENTER.lng}`}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="p-3 bg-gray-50 text-center">
              <a
                href={`https://www.openstreetmap.org/?mlat=${DEFAULT_MAP_CENTER.lat}&mlon=${DEFAULT_MAP_CENTER.lng}#map=${MAP_ZOOM}/${DEFAULT_MAP_CENTER.lat}/${DEFAULT_MAP_CENTER.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Open in full screen →
              </a>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
