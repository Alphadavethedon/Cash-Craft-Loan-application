import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  DollarSign, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Clock,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLoan } from '../contexts/LoanContext';
import { useNotification } from '../contexts/NotificationContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Loan } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { loans } = useLoan();
  const { addNotification } = useNotification();
  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
  const [pendingLoans, setPendingLoans] = useState<Loan[]>([]);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  useEffect(() => {
    if (loans.length > 0) {
      setActiveLoans(loans.filter(loan => loan.status === 'active'));
      setPendingLoans(loans.filter(loan => loan.status === 'pending'));
    } else {
      setActiveLoans([]);
      setPendingLoans([]);
    }
  }, [loans]);

  const calculateCreditUtilization = (): number => {
    const totalBorrowed = activeLoans.reduce((sum, loan) => sum + loan.amount, 0);
    // Assuming a credit limit based on credit score (this would come from backend in real app)
    const creditLimit = user ? (user.creditScore * 10) : 0;
    return creditLimit > 0 ? (totalBorrowed / creditLimit) * 100 : 0;
  };

  const dismissWelcome = () => {
    setShowWelcome(false);
    addNotification({
      title: 'Welcome message dismissed',
      message: 'You can always find help in the Support section.',
      type: 'info'
    });
  };

  const getLoanStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'repaid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <X className="h-5 w-5 text-red-500" />;
      case 'overdue':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.name}
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Link to="/apply">
            <Button 
              variant="primary" 
              rightIcon={<CreditCard className="h-4 w-4" />}
            >
              Apply for Loan
            </Button>
          </Link>
        </div>
      </div>
      
      {showWelcome && (
        <Card 
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
          bordered
        >
          <div className="flex justify-between items-start">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Welcome to LoanPlus</h3>
                <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                  Our AI-powered system will help you get the best loan terms based on your profile. 
                  Complete your profile information to improve your chances of approval.
                </p>
              </div>
            </div>
            <button
              className="flex-shrink-0 ml-4"
              onClick={dismissWelcome}
            >
              <X className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            </button>
          </div>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Credit Score */}
        <Card bordered>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Credit Score</h3>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.creditScore || 0}
                </p>
                <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  / 850
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-emerald-600 h-2.5 rounded-full" 
                style={{ width: `${(user?.creditScore || 0) / 850 * 100}%` }}
              ></div>
            </div>
          </div>
        </Card>
        
        {/* Credit Utilization */}
        <Card bordered>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Credit Utilization</h3>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {calculateCreditUtilization().toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  calculateCreditUtilization() > 70 
                    ? 'bg-red-600' 
                    : calculateCreditUtilization() > 30 
                    ? 'bg-yellow-600' 
                    : 'bg-green-600'
                }`}
                style={{ width: `${Math.min(calculateCreditUtilization(), 100)}%` }}
              ></div>
            </div>
          </div>
        </Card>
        
        {/* Available Credit */}
        <Card bordered>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Available Credit</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency((user?.creditScore || 0) * 10 - activeLoans.reduce((sum, loan) => sum + loan.amount, 0))}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-2">
            <Link to="/apply">
              <Button 
                variant="outline" 
                size="sm"
                fullWidth
                rightIcon={<ChevronRight className="h-4 w-4" />}
              >
                Apply for Loan
              </Button>
            </Link>
          </div>
        </Card>
      </div>
      
      {/* Active Loans */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Active Loans</h2>
        
        {activeLoans.length === 0 ? (
          <Card bordered className="bg-gray-50 dark:bg-gray-800/50">
            <div className="text-center py-6">
              <CreditCard className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No active loans</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Apply for a loan to get started</p>
              <Link to="/apply">
                <Button variant="primary">Apply Now</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeLoans.map((loan) => (
              <Card key={loan.id} bordered className="hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {formatCurrency(loan.amount)}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Due: {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {formatCurrency(loan.repaidAmount)} of {formatCurrency(loan.repaymentAmount)} repaid
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex space-x-2">
                    <Link to={`/loans/${loan.id}`}>
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        Details
                      </Button>
                    </Link>
                    <Link to={`/repay/${loan.id}`}>
                      <Button 
                        variant="primary" 
                        size="sm"
                      >
                        Repay
                      </Button>
                    </Link>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(loan.repaidAmount / loan.repaymentAmount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Pending Loans */}
      {pendingLoans.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pending Applications</h2>
          
          <div className="space-y-4">
            {pendingLoans.map((loan) => (
              <Card key={loan.id} bordered className="bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                      <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {formatCurrency(loan.amount)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Applied on: {new Date(loan.applicationDate).toLocaleDateString()}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-yellow-700 dark:text-yellow-500 font-medium">
                          Awaiting approval
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <Link to={`/loans/${loan.id}`}>
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Loan History */}
      {loans.filter(loan => loan.status === 'repaid' || loan.status === 'rejected').length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Loan History</h2>
          
          <Card bordered>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {loans
                .filter(loan => loan.status === 'repaid' || loan.status === 'rejected')
                .map((loan) => (
                  <div key={loan.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      {getLoanStatusIcon(loan.status)}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(loan.amount)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(loan.applicationDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        loan.status === 'repaid' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'
                      }`}>
                        {loan.status === 'repaid' ? 'Repaid' : 'Rejected'}
                      </span>
                      <Link to={`/loans/${loan.id}`}>
                        <button className="ml-3 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;