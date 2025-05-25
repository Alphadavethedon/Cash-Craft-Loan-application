import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck,
  Edit,
  Lock,
  Calendar,
  CreditCard,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Profile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { addNotification } = useNotification();
  
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('All fields are required');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      await updateUserProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
      
      setIsEditing(false);
      
      addNotification({
        title: 'Profile Updated',
        message: 'Your profile information has been updated successfully.',
        type: 'success'
      });
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your personal information and settings
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card bordered>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h2>
              
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  leftIcon={<Edit className="h-4 w-4" />}
                >
                  Edit
                </Button>
              )}
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="ml-3 text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}
            
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    leftIcon={<User className="h-5 w-5 text-gray-400" />}
                    required
                  />
                  
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
                    required
                  />
                  
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    leftIcon={<Phone className="h-5 w-5 text-gray-400" />}
                    required
                  />
                  
                  <div className="flex space-x-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isSubmitting}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex border-b border-gray-200 dark:border-gray-700 pb-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Full Name
                    </p>
                    <p className="text-base text-gray-900 dark:text-white">
                      {user?.name}
                    </p>
                  </div>
                </div>
                
                <div className="flex border-b border-gray-200 dark:border-gray-700 pb-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email Address
                    </p>
                    <p className="text-base text-gray-900 dark:text-white">
                      {user?.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex border-b border-gray-200 dark:border-gray-700 pb-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Phone Number
                    </p>
                    <p className="text-base text-gray-900 dark:text-white">
                      {user?.phone}
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Joined On
                    </p>
                    <p className="text-base text-gray-900 dark:text-white">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
          
          <Card bordered>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Security Settings</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                <div className="flex">
                  <Lock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Last changed 30 days ago
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                >
                  Change
                </Button>
              </div>
              
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                <div className="flex">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add an extra layer of security
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                >
                  Setup
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex">
                  <ShieldCheck className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Login Activity
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      View your recent login activity
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                >
                  View
                </Button>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card bordered className="bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Account Status</h2>
              {user?.kycVerified ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Unverified
                </span>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${
                  user?.kycVerified 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}>
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    ID Verification
                  </p>
                  <p className={`text-xs ${
                    user?.kycVerified 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {user?.kycVerified ? 'Verified' : 'Not verified'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${
                  user?.creditScore > 0 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}>
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Credit Score
                  </p>
                  <p className={`text-xs ${
                    user?.creditScore > 650 
                      ? 'text-green-600 dark:text-green-400' 
                      : user?.creditScore > 580 
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {user?.creditScore || 0} {' '}
                    ({user?.creditScore > 650 
                      ? 'Good' 
                      : user?.creditScore > 580 
                      ? 'Fair'
                      : 'Poor'})
                  </p>
                </div>
              </div>
            </div>
            
            {!user?.kycVerified && (
              <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800/30">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => window.location.href = '/kyc-verification'}
                >
                  Complete Verification
                </Button>
              </div>
            )}
          </Card>
          
          <Card bordered>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Email Notifications</span>
                  </div>
                </div>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" defaultChecked />
                    <div className="block bg-gray-300 dark:bg-gray-600 w-10 h-6 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                  </div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300">SMS Notifications</span>
                  </div>
                </div>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" defaultChecked />
                    <div className="block bg-gray-300 dark:bg-gray-600 w-10 h-6 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                  </div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex">
                  <ShieldCheck className="h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Security Alerts</span>
                  </div>
                </div>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" defaultChecked />
                    <div className="block bg-gray-300 dark:bg-gray-600 w-10 h-6 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                  </div>
                </label>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;