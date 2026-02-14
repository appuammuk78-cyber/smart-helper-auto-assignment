import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

// Use local /peep/ images if present; otherwise use these placeholder photos
const POPULAR_SERVICES = [
  {
    id: 'home-cleaning',
    name: 'Home Cleaning',
    icon: '🧹',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80',
    description: 'Professional home cleaning services',
    rating: 4.8,
    startingPrice: 50,
  },
  {
    id: 'repair',
    name: 'Repair Services',
    icon: '🔧',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80',
    description: 'Expert repair and maintenance',
    rating: 4.8,
    startingPrice: 75,
  },
  {
    id: 'moving',
    name: 'Moving Help',
    icon: '📦',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&q=80',
    description: 'Professional moving assistance',
    rating: 4.8,
    startingPrice: 100,
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: '🔩',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=500&q=80',
    description: 'Licensed plumbing services',
    rating: 4.8,
    startingPrice: 80,
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Choose Service',
    description: 'Select from our range of services that fit your needs.',
  },
  {
    step: 2,
    title: 'Get Matched',
    description: 'We connect you with a vetted helper in your area.',
  },
  {
    step: 3,
    title: 'Track & Complete',
    description: 'Follow progress and complete your booking with ease.',
  },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [location, setLocation] = useState('New York, NY');
  const [imageErrors, setImageErrors] = useState(new Set());

  const handleServiceClick = (service) => {
    navigate('/customer/book', { state: { service } });
  };

  const handleImageError = (id) => {
    setImageErrors((prev) => new Set(prev).add(id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            ← Back to home
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 truncate max-w-[140px] sm:max-w-none">
              {user?.email}
            </span>
            <Button variant="ghost" className="text-sm" onClick={() => logout()}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Greeting + Location */}
        <section className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
            {getGreeting()}
          </h1>
          <p className="text-gray-600 mb-6">What service do you need today?</p>
          <div className="relative max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              📍
            </span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </section>

        {/* Popular Services */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_SERVICES.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => handleServiceClick(service)}
                className="text-left bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
              >
                <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform overflow-hidden">
                  {service.image && !imageErrors.has(service.id) ? (
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(service.id)}
                    />
                  ) : (
                    <span>{service.icon}</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-2xl mb-2">{service.icon}</div>
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-amber-500 text-sm">
                      ★ {service.rating}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      ${service.startingPrice}
                      <span className="text-gray-500 font-normal"> Starting price</span>
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <Card key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
