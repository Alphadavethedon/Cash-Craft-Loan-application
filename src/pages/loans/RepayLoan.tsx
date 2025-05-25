import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  DollarSign, 
  CreditCard, 
  Calendar, 
  CheckCircle,
  Smartphone,
  AlertTriangle
} from 'lucide-react';
import { useLoan } from '../../contexts/LoanContext';
import { useNotification } from '../../contexts/NotificationContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { Loan } from '../../types';

const RepayLoan: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getLoanById, repayLoan } = useLoan();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  
  const [loan, setLoan] = useState<Loan | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [mpesaCode, setMpesaCode] = useState<string>('');
  
  useEffect(() => {
    if (id) {
      const loanData = getLoanById(id);
      if (loanData) {
        setLoan(loanData);
        // Default to remaining balance
        if (loanData.repaymentAmount && loanData.repaidAmount) {
          setPaymentAmount(loanData.repaymentAmount - loanData.repaidAmount);
        }
      }
    }
  }, [id, getLoanById]);

  const handlePaymentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    if (!isNaN(amount)) {
      if (loan) {
        const remainingBalance = loan.repaymentAmount - loan.repaidAmount;
        setPaymentAmount(Math.min(amount, remainingBalance));
      } else {
        setPaymentAmount(amount);
      }
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleMpesaCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMpesaCode(e.target.value.toUpperCase());
  };

  const handleContinue = () => {
    if (!paymentAmount || paymentAmount <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }
    
    if (paymentMethod === 'mpesa' && !phoneNumber) {
      setError('Please enter your M-PESA phone number');
      return;
    }
    
    setError('');
    setShowConfirmation(true);
  };

  const handleBack = () => {
    setShowConfirmation(false);
    setIsSuccess(false);
    setError('');
  };

  const handleConfirmPayment = async () => {
    if (!id || !loan) return;
    
    if (paymentMethod === 'mpesa' && !mpesaCode) {
      setError('Please enter the M-PESA confirmation code');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await repayLoan(id, paymentAmount);
      
      // Update loan data
      const updatedLoan = getLoanById(id);
      setLoan(updatedLoan);
      
      // Add notification
      addNotification({
        title: 'Payment Successful',
        message: `Your payment of KES ${paymentAmount.toLocaleString()} has been received.`,
        type: 'success'
      });
      
      setIsSuccess(true);
    } catch (error) {
      setError('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewLoan = () => {
    navigate(`/loans/${id}`);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!loan) {
    return (
      <div className="max-w-3xl mx-auto">
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

  const renderPaymentForm = () => {
    return (
      <Card bordered>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Make a Payment</h2>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="ml-3 text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Payment Amount (KES)
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                min="1"
                max={loan.repaymentAmount - loan.repaidAmount}
                value={paymentAmount}
                onChange={handlePaymentAmountChange}
                className="block w-full pl-10 pr-12 py-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="Enter amount"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 sm:text-sm">KES</span>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <button
                type="button"
                className="text-xs text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
                onClick={() => setPaymentAmount(Math.min(1000, loan.repaymentAmount - loan.repaidAmount))}
              >
                KES 1,000
              </button>
              <button
                type="button"
                className="text-xs text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
                onClick={() => setPaymentAmount(Math.min(5000, loan.repaymentAmount - loan.repaidAmount))}
              >
                KES 5,000
              </button>
              <button
                type="button"
                className="text-xs text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
                onClick={() => setPaymentAmount(loan.repaymentAmount - loan.repaidAmount)}
              >
                Full Amount ({formatCurrency(loan.repaymentAmount - loan.repaidAmount)})
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Payment Method
            </label>
            <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className={`border rounded-md p-4 flex items-center cursor-pointer ${
                  paymentMethod === 'mpesa'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                onClick={() => setPaymentMethod('mpesa')}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  paymentMethod === 'mpesa'
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}>
                  <Smartphone className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    paymentMethod === 'mpesa'
                      ? 'text-emerald-900 dark:text-emerald-100'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    M-PESA
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Pay with mobile money
                  </p>
                </div>
                <div className="ml-auto">
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'mpesa'
                      ? 'border-emerald-500 bg-emerald-500 dark:bg-emerald-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {paymentMethod === 'mpesa' && (
                      <CheckCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
              </div>
              
              <div
                className={`border rounded-md p-4 flex items-center cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  paymentMethod === 'card'
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}>
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    paymentMethod === 'card'
                      ? 'text-emerald-900 dark:text-emerald-100'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    Card
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Pay with credit/debit card
                  </p>
                </div>
                <div className="ml-auto">
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'card'
                      ? 'border-emerald-500 bg-emerald-500 dark:bg-emerald-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {paymentMethod === 'card' && (
                      <CheckCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {paymentMethod === 'mpesa' && (
            <div>
              <Input
                id="phone"
                type="tel"
                label="M-PESA Phone Number"
                placeholder="+254 7XX XXX XXX"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                leftIcon={<Smartphone className="h-5 w-5 text-gray-400" />}
                helperText="Enter the phone number registered with M-PESA"
                required
              />
            </div>
          )}
          
          {paymentMethod === 'card' && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-md">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Card payments are currently unavailable. Please use M-PESA for payments.
              </p>
            </div>
          )}
          
          <div className="pt-4">
            <Button
              variant="primary"
              fullWidth
              onClick={handleContinue}
              disabled={paymentMethod === 'card' || !paymentAmount || paymentAmount <= 0}
            >
              Continue
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  const renderConfirmation = () => {
    return (
      <Card bordered>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Confirm Payment</h2>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="ml-3 text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}
        
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Payment Summary</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Loan ID:</span>
                <span className="text-sm text-gray-900 dark:text-white">{loan.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Payment Amount:</span>
                <span className="text-sm text-gray-900 dark:text-white">{formatCurrency(paymentAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Payment Method:</span>
                <span className="text-sm text-gray-900 dark:text-white capitalize">{paymentMethod}</span>
              </div>
              {paymentMethod === 'mpesa' && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Phone Number:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{phoneNumber}</span>
                </div>
              )}
            </div>
          </div>
          
          {paymentMethod === 'mpesa' && (
            <div className="border border-blue-200 dark:border-blue-800/30 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
              <h3 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-3">M-PESA Instructions</h3>
              
              <ol className="list-decimal pl-5 space-y-2 text-sm text-blue-700 dark:text-blue-400">
                <li>Go to M-PESA on your phone</li>
                <li>Select "Lipa na M-PESA"</li>
                <li>Select "Pay Bill"</li>
                <li>Enter Business Number: <span className="font-medium">522522</span></li>
                <li>Enter Account Number: <span className="font-medium">{loan.id}</span></li>
                <li>Enter Amount: <span className="font-medium">{paymentAmount}</span></li>
                <li>Enter your M-PESA PIN and confirm</li>
                <li>Enter the confirmation code below</li>
              </ol>
              
              <div className="mt-4">
                <Input
                  id="mpesaCode"
                  type="text"
                  label="M-PESA Confirmation Code"
                  placeholder="e.g., QA12345678"
                  value={mpesaCode}
                  onChange={handleMpesaCodeChange}
                  required
                />
              </div>
            </div>
          )}
          
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleConfirmPayment}
              isLoading={isProcessing}
              disabled={paymentMethod === 'mpesa' && !mpesaCode}
            >
              Confirm Payment
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  const renderSuccess = () => {
    return (
      <Card bordered className="bg-green-50 dark:bg-green-900/10">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
            <CheckCircle className="h-8 w-8" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful
          </h2>
          
          <p className="text-green-700 dark:text-green-400 mb-6">
            Your payment of {formatCurrency(paymentAmount)} has been received.
          </p>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md mb-6">
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Amount Paid:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(paymentAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Payment Method:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Date:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Confirmation Code:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{mpesaCode || 'N/A'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-700 dark:text-gray-300">Remaining Balance:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatCurrency(loan.repaymentAmount - loan.repaidAmount - paymentAmount)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              variant="primary"
              fullWidth
              onClick={handleViewLoan}
            >
              View Loan Details
            </Button>
            
            <Link to="/dashboard">
              <Button
                variant="outline"
                fullWidth
              >
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center mb-6">
        <Link to={`/loans/${id}`} className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Loan Details
        </Link>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loan Amount</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(loan.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Outstanding Balance</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(loan.repaymentAmount - loan.repaidAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
      
      {isSuccess ? renderSuccess() : (showConfirmation ? renderConfirmation() : renderPaymentForm())}
    </div>
  );
};

export default RepayLoan;