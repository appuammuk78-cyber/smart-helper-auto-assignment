import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import ServiceCard from '../components/ServiceCard';
import LocationInput from '../components/LocationInput';
import TimeSelector from '../components/TimeSelector';

const SERVICES = [
  {
    id: 'electrician',
    icon: '⚡',
    title: 'Electrician',
    description: 'Wiring, repairs, and electrical installations by certified pros.',
  },
  {
    id: 'plumber',
    icon: '🔧',
    title: 'Plumber',
    description: 'Leaks, blockages, and plumbing fixes done right.',
  },
  {
    id: 'cleaner',
    icon: '🧹',
    title: 'Cleaner',
    description: 'Deep cleaning and regular home maintenance.',
  },
  {
    id: 'ac-repair',
    icon: '❄️',
    title: 'AC Repair',
    description: 'AC servicing, gas refill, and quick repairs.',
  },
  {
    id: 'carpenter',
    icon: '🪚',
    title: 'Carpenter',
    description: 'Furniture, fittings, and woodwork by skilled carpenters.',
  },
];

const AVAILABILITY_COUNT = 5;

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isCustomer = user?.role === 'customer';
  const [selectedService, setSelectedService] = useState(null);
  const [location, setLocation] = useState('');
  const [timeOption, setTimeOption] = useState('Now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [detectingLocation, setDetectingLocation] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const handleDetectLocation = () => {
    setDetectingLocation(true);
    setTimeout(() => {
      setLocation('Kochi, Kerala');
      setDetectingLocation(false);
    }, 1200);
  };

  const handleRequest = () => {
    const payload = {
      service: selectedService,
      location,
      timeOption,
      ...(timeOption === 'Schedule for later' && { scheduledDate }),
    };
    console.log('Request payload:', payload);
    navigate('/next');
  };

  const canSubmit = selectedService && location.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* 1. Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg tracking-tight">
                  Smart Helper
                </h1>
                <p className="text-xs text-gray-500">Fast • Smart • Reliable</p>
              </div>
            </Link>
          </div>
          <nav className="flex items-center gap-3">
            {isCustomer && (
              <Link
                to="/customer"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                My Dashboard
              </Link>
            )}
            {user ? (
              <Button variant="ghost" className="text-sm px-3 py-1.5" onClick={() => logout()}>
                Logout
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link to="/signup">
                  <Button variant="primary" className="text-sm px-3 py-1.5">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-8 pb-12">
        {/* 2. Hero */}
        <section
          className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg animate-fade-in"
          aria-label="Hero"
        >
          <div className="relative px-6 py-12 sm:py-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Get Help Instantly
            </h2>
            <p className="mt-2 text-blue-100 text-lg max-w-md mx-auto">
              Book trusted professionals near you in seconds
            </p>
            <div className="mt-6">
              <Button
                variant="secondary"
                className="!bg-white !text-blue-600 hover:!bg-blue-50 border-0 shadow-md"
                onClick={() =>
                  document
                    .getElementById('services')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Book Now
              </Button>
            </div>
          </div>
        </section>

        {/* 3. Service Selection */}
        <section id="services" aria-labelledby="services-heading">
          <h2 id="services-heading" className="text-xl font-semibold text-gray-900 mb-4">
            Choose a service
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="status" aria-label="Loading services">
              {[...Array(4)].map((_, i) => (
                <Card key={i} padding>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-200 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                      <div className="h-3 bg-gray-100 rounded w-full animate-pulse" />
                      <div className="h-3 bg-gray-100 rounded w-4/5 animate-pulse" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICES.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  selected={selectedService?.id === service.id}
                  onClick={() => setSelectedService(service)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 4. Location */}
        <section aria-labelledby="location-heading">
          <Card>
            <h2 id="location-heading" className="text-lg font-semibold text-gray-900 mb-4">
              Where do you need help?
            </h2>
            <LocationInput
              value={location}
              onChange={setLocation}
              onDetect={handleDetectLocation}
              detecting={detectingLocation}
              placeholder="e.g. Kochi, Kerala"
            />
          </Card>
        </section>

        {/* 5. Time Selection */}
        <section aria-labelledby="time-heading">
          <Card>
            <h2 id="time-heading" className="text-lg font-semibold text-gray-900 mb-4">
              When do you need the service?
            </h2>
            <TimeSelector
              value={timeOption}
              onChange={setTimeOption}
              scheduledDate={scheduledDate}
              onScheduledDateChange={setScheduledDate}
            />
          </Card>
        </section>

        {/* 6. Availability */}
        <section className="flex justify-center" aria-live="polite">
          <Badge variant="success" pulse>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            {AVAILABILITY_COUNT} helpers available nearby
          </Badge>
        </section>

        {/* 7. Request Button */}
        <section>
          <Button
            fullWidth
            variant="primary"
            disabled={!canSubmit}
            onClick={handleRequest}
            className="py-4 text-lg rounded-2xl"
          >
            Request Service
          </Button>
        </section>
      </main>
    </div>
  );
}
