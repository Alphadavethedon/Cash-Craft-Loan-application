import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Download,
  RefreshCw,
  X,
  Clock
} from 'lucide-react';
import { useLoan } from '../../contexts/LoanContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Loan } from '../../types';

const AdminDashboard: React.FC = () => {
  const { getAllLoans, approveLoan, rejectLoan } = useLoan();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingLoanId, setProcessingLoanId] = useState<string | null>(null);
  
  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    filterLoans();
  }, [loans, searchTerm, statusFilter]);

  const fetchLoans = async () => {
    setIsLoading(true);
    try {
      const allLoans = await getAllLoans();
      setLoans(allLoans);
    } catch (error) {
      console.error('Failed to fetch loans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLoans = () => {
    let filtered = [...loans];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(loan => loan.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(loan => 
        loan.id.toLowerCase().includes(term) ||
        loan.userName.toLowerCase().includes(term) ||
        loan.purpose.toLowerCase().includes(term)
      );
    }
    
    setFilteredLoans(filtered);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    fetchLoans();
  };

  const handleApproveLoan = async (loanId: string) => {
    setIsProcessing(true);
    setProcessingLoanId(loanId);
    
    try {
      await approveLoan(loanId);
      // Update the loans list
      const updatedLoans = loans.map(loan => {
        if (loan.id === loanId) {
          return {
            ...loan,
            status: 'active',
            approvalDate: new Date().toISOString(),
          };
        }
        return loan;
      });
      setLoans(updatedLoans);
    } catch (error) {
      console.error('Failed to approve loan:', error);
    } finally {
      setIsProcessing(false);
      setProcessingLoanId(null);
    }
  };

  const handleRejectLoan = async (loanId: string) => {
    setIsProcessing(true);
    setProcessingLoanId(loanId);
    
    try {
      await rejectLoan(loanId);
      // Update the loans list
      const updatedLoans = loans.map(loan => {
        if (loan.id === loanId) {
          return {
            ...loan,
            status: 'rejected',
          };
        }
        return loan;
      });
      setLoans(updatedLoans);
    } catch (error) {
      console.error('Failed to reject loan:', error);
    } finally {
      setIsProcessing(false);
      setProcessingLoanId(null);
    }
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
        return <Clock className="h-4 w-4" />;
      case 'repaid':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const calculateTotalLoans = (): number => {
    return loans.reduce((sum, loan) => sum + loan.amount, 0);
  };

  const calculateActiveLoans = (): number => {
    return loans.filter(loan => loan.status === 'active').length;
  };

  const calculatePendingLoans = (): number => {
    return loans.filter(loan => loan.status === 'pending').length;
  };

  const calculateRepaidLoans = (): number => {
    return loans.filter(loan => loan.status === 'repaid').length;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage loan applications and monitor system performance
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card bordered>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <CreditCard className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Loans</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(calculateTotalLoans())}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {loans.length} loans issued
              </p>
            </div>
          </div>
        </Card>
        
        <Card bordered>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Active Loans</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {calculateActiveLoans()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Currently active
              </p>
            </div>
          </div>
        </Card>
        
        <Card bordered>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Pending</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {calculatePendingLoans()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Awaiting approval
              </p>
            </div>
          </div>
        </Card>
        
        <Card bordered>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Repaid</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {calculateRepaidLoans()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Fully repaid loans
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <Card bordered className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
            Loan Applications
          </h2>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search loans..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full sm:w-auto focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="relative">
              <button
                className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                <Filter className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span>Status: {statusFilter === 'all' ? 'All' : statusFilter}</span>
                <ChevronDown className="h-4 w-4 ml-2 text-gray-500 dark:text-gray-400" />
              </button>
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 hidden group-focus:block">
                <div className="py-1">
                  <button
                    onClick={() => handleStatusFilterChange('all')}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleStatusFilterChange('pending')}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusFilterChange('active')}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    Active
                  </button>
                  <button
                    onClick={() => handleStatusFilterChange('repaid')}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    Repaid
                  </button>
                  <button
                    onClick={() => handleStatusFilterChange('rejected')}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    Rejected
                  </button>
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Refresh
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Loan ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      AI Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredLoans.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No loans found
                      </td>
                    </tr>
                  ) : (
                    filteredLoans.map((loan) => (
                      <tr key={loan.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {loan.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {loan.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {formatCurrency(loan.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                            {getStatusIcon(loan.status)}
                            <span className="ml-1 capitalize">{loan.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {formatDate(loan.applicationDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                              loan.aiScore > 650 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                : loan.aiScore > 580 
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            }`}>
                              {loan.aiScore}
                            </div>
                            <div className="ml-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  loan.aiScore > 650 
                                    ? 'bg-green-500' 
                                    : loan.aiScore > 580 
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${(loan.aiScore / 850) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link to={`/loans/${loan.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                View
                              </Button>
                            </Link>
                            
                            {loan.status === 'pending' && (
                              <>
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleApproveLoan(loan.id)}
                                  isLoading={isProcessing && processingLoanId === loan.id}
                                  disabled={isProcessing}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleRejectLoan(loan.id)}
                                  isLoading={isProcessing && processingLoanId === loan.id}
                                  disabled={isProcessing}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            
                            <button className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center mt-6 px-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-medium">{filteredLoans.length}</span> of <span className="font-medium">{loans.length}</span> loans
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={true}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={true}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;