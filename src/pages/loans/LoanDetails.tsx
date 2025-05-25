import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  X,
  Clock,
  TrendingUp,
  BadgeCheck
} from 'lucide-react';
import { useLoan } from '../../contexts/LoanContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Loan } from '../../types';

const LoanDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getLoanById, approveLoan, rejectLoan } = useLoan();
  const { user } = useAuth();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    if (id) {
      const loanData = getLoanById(id);
      if (loanData) {
        setLoan(loanData);
      }
    }
  }, [id, getLoanById]);

  const handleApproveLoan = async () => {
    if (!id) return;
    
    setIsProcessing(true);
    setError('');
    
    try {
      await approveLoan(id);
      // Refresh loan data
      const updatedLoan = getLoanById(id);
      setLoan(updatedLoan);
    } catch (error) {
      setError('Failed to approve loan. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectLoan = async () => {
    if (!id) return;
    
    setIsProcessing(true);
    setError('');
    
    try {
      await rejectLoan(id);
      // Refresh loan data
      const updatedLoan = getLoanById(id);
      setLoan(updatedLoan);
    } catch (error) {
      setError('Failed to reject loan. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'repaid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-5 w-5" />;
      case 'repaid':
        return <CheckCircle className="h-5 w-5" />;
      case 'rejected':
        return <X className="h-5 w-5" />;
      case 'overdue':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  if (!loan) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/dashboard" className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">Loan not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link to="/dashboard" className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        
        <div className={`px-3 py-1 rounded-full flex items-center ${getStatusColor(loan.status)}`}>
          {getStatusIcon(loan.status)}
          <span className="ml-1 text-sm font-medium capitalize">{loan.status}</span>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="ml-3 text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card bordered>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Loan Details</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID: {loan.id}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md">
                <div className="flex items-center mb-2">
                  <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Loan Amount</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(loan.amount)}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Loan Term</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loan.term} days
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Interest Rate:</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{loan.interestRate.toFixed(2)}%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Application Date:</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(loan.applicationDate).toLocaleDateString()}
                </span>
              </div>
              
              {loan.approvalDate && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Approval Date:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(loan.approvalDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {loan.dueDate && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Due Date:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(loan.dueDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {loan.status === 'active' && (
                <>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Repayment:</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(loan.repaymentAmount)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Repaid Amount:</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(loan.repaidAmount)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Remaining Balance:</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(loan.repaymentAmount - loan.repaidAmount)}
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-emerald-600 h-2.5 rounded-full" 
                        style={{ width: `${(loan.repaidAmount / loan.repaymentAmount) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {((loan.repaidAmount / loan.repaymentAmount) * 100).toFixed(0)}% repaid
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatCurrency(loan.repaymentAmount - loan.repaidAmount)} remaining
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
          
          <Card bordered>
            <div className="flex items-center mb-4">
              <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Loan Purpose</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              {loan.purpose}
            </p>
          </Card>
          
          {/* AI Score Analysis */}
          <Card bordered className="bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI Credit Analysis</h3>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  loan.aiScore > 650 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : loan.aiScore > 580 
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  <span className="text-xl font-bold">{loan.aiScore}</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Credit Score</p>
                  <p className={`text-sm ${
                    loan.aiScore > 650 
                      ? 'text-green-600 dark:text-green-400' 
                      : loan.aiScore > 580 
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {loan.aiScore > 650 
                      ? 'Good' 
                      : loan.aiScore > 580 
                      ? 'Fair'
                      : 'Poor'}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Approval Threshold
                </div>
                <div className="flex items-center mt-1">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${loan.aiScore > 580 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min((loan.aiScore / 850) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    580
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>
                Our AI-powered credit scoring system analyzes various factors including your loan amount, 
                purpose, repayment history, and other financial indicators to generate a score that helps 
                determine loan eligibility.
              </p>
            </div>
          </Card>
          
          {/* Admin Actions for Pending Loans */}
          {user?.role === 'admin' && loan.status === 'pending' && (
            <Card bordered className="bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800/30">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Admin Actions</h3>
              
              <div className="flex space-x-4">
                <Button
                  variant="success"
                  onClick={handleApproveLoan}
                  isLoading={isProcessing}
                  leftIcon={<CheckCircle className="h-5 w-5" />}
                >
                  Approve Loan
                </Button>
                
                <Button
                  variant="danger"
                  onClick={handleRejectLoan}
                  isLoading={isProcessing}
                  leftIcon={<X className="h-5 w-5" />}
                >
                  Reject Loan
                </Button>
              </div>
            </Card>
          )}
        </div>
        
        <div>
          {loan.status === 'active' && (
            <Card bordered className="sticky top-20">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <BadgeCheck className="h-5 w-5 text-emerald-500 mr-2" />
                Repayment
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Total Due:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(loan.repaymentAmount)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Paid So Far:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(loan.repaidAmount)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Remaining:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(loan.repaymentAmount - loan.repaidAmount)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Due Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link to={`/repay/${loan.id}`}>
                    <Button
                      variant="primary"
                      fullWidth
                      leftIcon={<DollarSign className="h-5 w-5" />}
                    >
                      Make a Payment
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}
          
          {loan.status === 'pending' && (
            <Card bordered className="sticky top-20 bg-yellow-50 dark:bg-yellow-900/10">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                Application Status
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                      <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="absolute top-8 left-1/2 w-0.5 h-8 -translate-x-1/2 bg-gray-300 dark:bg-gray-700"></div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Application Submitted</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(loan.applicationDate).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="relative">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="absolute top-8 left-1/2 w-0.5 h-8 -translate-x-1/2 bg-gray-300 dark:bg-gray-700"></div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">AI Scoring Complete</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Score: {loan.aiScore}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Approval</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Typically takes 1-2 hours
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}
          
          {(loan.status === 'rejected' || loan.status === 'repaid') && (
            <Card bordered className={`sticky top-20 ${
              loan.status === 'rejected' 
                ? 'bg-red-50 dark:bg-red-900/10' 
                : 'bg-green-50 dark:bg-green-900/10'
            }`}>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                {loan.status === 'rejected' ? (
                  <>
                    <X className="h-5 w-5 text-red-500 mr-2" />
                    Application Rejected
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Loan Fully Repaid
                  </>
                )}
              </h2>
              
              <div className="space-y-4">
                {loan.status === 'rejected' ? (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Unfortunately, your loan application was not approved at this time. 
                    Consider improving your credit score or applying for a smaller amount in the future.
                  </p>
                ) : (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Congratulations! You have successfully repaid this loan in full. 
                    This positive repayment history will help improve your credit score and 
                    increase your borrowing limit for future loans.
                  </p>
                )}
                
                <Link to="/apply">
                  <Button
                    variant={loan.status === 'rejected' ? "outline" : "primary"}
                    fullWidth
                  >
                    Apply for a New Loan
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;