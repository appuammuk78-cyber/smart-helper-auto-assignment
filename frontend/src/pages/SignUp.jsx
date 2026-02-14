import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addUser, isEmailTaken } from '../lib/userStore';
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

const MIN_PASSWORD_LENGTH = 6;

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit =
    selectedRole &&
    email.trim() &&
    password.trim() &&
    confirmPassword.trim() &&
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
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
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

    const taken = await isEmailTaken(email.trim());
    if (taken) {
      setError('This email is already registered. Please sign in.');
      setLoading(false);
      return;
    }

    await addUser({
      email: email.trim(),
      password,
      role: selectedRole,
      name,
    });
    login(email.trim(), selectedRole);
    setLoading(false);
    navigate(ROLE_REDIRECT[selectedRole], { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1"
          >
            ← Back to home
          </Link>
        </div>
        <Card className="shadow-xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Create an account
            </h1>
            <p className="mt-1 text-gray-500">
              Sign up to get started
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
              label="Full name"
              type="text"
              value={name}
              onChange={setName}
              placeholder="John Doe"
              autoComplete="name"
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
              autoComplete="new-password"
              error={error && error.includes('Password') && !error.includes('match') ? error : undefined}
            />

            <Input
              label="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(v) => {
                setConfirmPassword(v);
                setError('');
              }}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              error={error && error.includes('match') ? error : undefined}
            />

            {error && (error.includes('role') || error.includes('match')) && (
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
                  Creating account...
                </span>
              ) : (
                'Sign up'
              )}
            </Button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
                Sign in
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
