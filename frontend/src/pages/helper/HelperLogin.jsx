import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateLogin } from '../../lib/userStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';

export default function HelperLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = email.trim() && password.trim() && !loading;

  const validate = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || !canSubmit) return;

    setLoading(true);
    setError('');

    const isValid = await validateLogin(email.trim(), password, 'helper');
    if (!isValid) {
      setError('Invalid email or password.');
      setLoading(false);
      return;
    }

    login(email.trim(), 'helper');
    setLoading(false);
    navigate('/helper/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[#F5F7FA]">
      <div className="w-full max-w-md">
        <div
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Helper Login
            </h1>
            <p className="mt-1.5 text-gray-500 text-sm">
              Sign in to start accepting jobs
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(v) => {
                setEmail(v);
                setError('');
              }}
              placeholder="helper@example.com"
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

            {error && !error.includes('Email') && !error.includes('Password') && (
              <p className="text-sm text-red-600 text-center" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              fullWidth
              disabled={!canSubmit}
              className="py-3 rounded-xl !bg-indigo-600 hover:!bg-indigo-700"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader size="sm" className="flex-shrink-0" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Back to Home
            </Link>
          </div>

          <p className="mt-4 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
