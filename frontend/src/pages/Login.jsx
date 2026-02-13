import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import RoleSelector from '../components/ui/RoleSelector';

const ROLE_REDIRECT = {
  customer: '/customer',
  helper: '/helper/dashboard',
  admin: '/admin',
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit =
    selectedRole &&
    email.trim() &&
    password.trim() &&
    !loading;

  const validate = () => {
    if (!selectedRole) {
      setError('Please select a role.');
      return false;
    }
    if (!email.trim()) {
      setError('Email is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!password.trim()) {
      setError('Password is required.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate() || !canSubmit) return;

    setLoading(true);
    setError('');

    setTimeout(() => {
      login(email.trim(), selectedRole);
      setLoading(false);
      navigate(ROLE_REDIRECT[selectedRole], { replace: true });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <Card className="shadow-xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome Back
            </h1>
            <p className="mt-1 text-gray-500">
              Sign in to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <RoleSelector
              value={selectedRole}
              onChange={(role) => {
                setSelectedRole(role);
                setError('');
              }}
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(v) => {
                setEmail(v);
                setError('');
              }}
              placeholder="you@example.com"
              required
              autoComplete="email"
              error={error && (error.includes('Email') || error.includes('valid')) ? error : undefined}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(v) => {
                setPassword(v);
                setError('');
              }}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              error={error && error.includes('Password') ? error : undefined}
            />

            {error && error.includes('role') && (
              <p className="text-sm text-red-600 text-center" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              fullWidth
              disabled={!canSubmit}
              className="py-3"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader size="sm" className="flex-shrink-0" />
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
