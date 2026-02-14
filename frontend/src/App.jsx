import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Home from './pages/Home';
import Next from './pages/Next';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerBook from './pages/customer/CustomerBook';
import CustomerHelperAssigned from './pages/customer/CustomerHelperAssigned';
import AdminDashboard from './pages/admin/Dashboard';
import HelperDashboard from './pages/helper/Dashboard';
import HelperLogin from './pages/helper/HelperLogin';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/next" element={<Next />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/helper/login" element={<HelperLogin />} />
          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRole="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/book"
            element={
              <ProtectedRoute allowedRole="customer">
                <CustomerBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/assigned"
            element={
              <ProtectedRoute allowedRole="customer">
                <CustomerHelperAssigned />
              </ProtectedRoute>
            }
          />
          <Route
            path="/helper/dashboard"
            element={
              <ProtectedRoute allowedRole="helper">
                <HelperDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
