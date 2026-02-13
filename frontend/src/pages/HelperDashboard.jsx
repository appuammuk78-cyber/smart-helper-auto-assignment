import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function HelperDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h1 className="text-xl font-bold text-gray-900">Helper Dashboard</h1>
          <p className="mt-1 text-gray-500">Logged in as {user?.email}</p>
          <Button variant="secondary" className="mt-4" onClick={() => logout()}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
