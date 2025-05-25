import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoanProvider } from './contexts/LoanContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import KycVerification from './pages/auth/KycVerification';

// Main App Pages
import Dashboard from './pages/Dashboard';
import LoanApplication from './pages/loans/LoanApplication';
import LoanDetails from './pages/loans/LoanDetails';
import RepayLoan from './pages/loans/RepayLoan';
import Profile from './pages/Profile';
import Support from './pages/Support';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <LoanProvider>
            <Router>
              <Routes>
                {/* Auth Routes */}
                <Route path="/" element={<AuthLayout />}>
                  <Route index element={<Login />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="kyc-verification" element={
                    <ProtectedRoute>
                      <KycVerification />
                    </ProtectedRoute>
                  } />
                </Route>
                
                {/* Main App Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="apply" element={<LoanApplication />} />
                  <Route path="loans/:id" element={<LoanDetails />} />
                  <Route path="repay/:id" element={<RepayLoan />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="support" element={<Support />} />
                </Route>
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </LoanProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;