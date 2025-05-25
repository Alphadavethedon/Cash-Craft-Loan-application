import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, CreditCard, User, LifeBuoy, Bell, Menu, X, LogOut, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import NotificationPanel from '../components/notifications/NotificationPanel';

const MainLayout: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotification();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex-shrink-0 flex items-center">
                <CreditCard className="h-8 w-8 text-emerald-600 dark:text-emerald-500" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Cashcraft Loans</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              
              {/* Notifications */}
              <button 
                onClick={toggleNotifications}
                className="relative p-2 rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                {menuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="sm:hidden bg-white dark:bg-gray-800 shadow-md">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/dashboard"
                className={`block px-4 py-2 text-base font-medium ${
                  isActive('/dashboard')
                    ? 'text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/apply"
                className={`block px-4 py-2 text-base font-medium ${
                  isActive('/apply')
                    ? 'text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Apply for Loan
              </Link>
              <Link
                to="/profile"
                className={`block px-4 py-2 text-base font-medium ${
                  isActive('/profile')
                    ? 'text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                My Profile
              </Link>
              <Link
                to="/support"
                className={`block px-4 py-2 text-base font-medium ${
                  isActive('/support')
                    ? 'text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Support
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        )}
        
        {/* Notifications panel */}
        {notificationsOpen && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-20">
            <NotificationPanel onClose={() => setNotificationsOpen(false)} />
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

      {/* Footer Navigation (Mobile) */}
      <footer className="sm:hidden bg-white dark:bg-gray-800 shadow-lg fixed bottom-0 w-full border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-4 h-16">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center justify-center ${
              isActive('/dashboard')
                ? 'text-emerald-600 dark:text-emerald-500'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            to="/apply"
            className={`flex flex-col items-center justify-center ${
              isActive('/apply')
                ? 'text-emerald-600 dark:text-emerald-500'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <span className="text-xs mt-1">Apply</span>
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center ${
              isActive('/profile')
                ? 'text-emerald-600 dark:text-emerald-500'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
          <Link
            to="/support"
            className={`flex flex-col items-center justify-center ${
              isActive('/support')
                ? 'text-emerald-600 dark:text-emerald-500'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <LifeBuoy className="h-5 w-5" />
            <span className="text-xs mt-1">Support</span>
          </Link>
        </div>
      </footer>

      {/* Sidebar Navigation (Desktop) */}
      <div className="hidden sm:block fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg pt-16">
        <div className="px-4 py-6">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>
          <nav className="space-y-1">
            <Link
              to="/dashboard"
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/dashboard')
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link
              to="/apply"
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/apply')
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <CreditCard className="mr-3 h-5 w-5" />
              Apply for Loan
            </Link>
            <Link
              to="/profile"
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/profile')
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <User className="mr-3 h-5 w-5" />
              My Profile
            </Link>
            <Link
              to="/support"
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/support')
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <LifeBuoy className="mr-3 h-5 w-5" />
              Support
            </Link>
          </nav>
        </div>
        <div className="absolute bottom-0 w-full border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;