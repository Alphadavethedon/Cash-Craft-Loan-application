import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  Calendar, 
  FileText, 
  AlertCircle,
  TrendingUp,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLoan } from '../../contexts/LoanContext';
import { useNotification } from '../../contexts/NotificationContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const LoanApplication: React.FC = () => {
  const [amount, setAmount] = useState<number>(5000);
  const [term, setTerm] = useState<number>(30);
  const [purpose, setPurpose] = useState<string>('');
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [aiScoreLoading, setAiScoreLoading] = useState<boolean>(false);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<{
    score: number;
    approval: boolean;
    factors: Array<{ name: string; impact: 'positive' | 'negative' | 'neutral'; value: number }>;
    recommendation: string;
  } | null>(null);
  
  const { user } = useAuth();
  const { applyForLoan } = useLoan();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseInt(e.target.value);
    if (!isNaN(newAmount)) {
      setAmount(Math.max(1000, Math.min(50000, newAmount)));
    }
  };

  const handleTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = parseInt(e.target.value);
    if (!isNaN(newTerm)) {
      setTerm(Math.max(7, Math.min(90, newTerm)));
    }
  };

  const calculateInterestRate = () => {
    // Base rate of 12%
    let rate = 12;
    
    // Adjust based on amount (higher amounts get slightly lower rates)
    if (amount > 20000) {
      rate -= 1;
    } else if (amount < 5000) {
      rate += 1;
    }
    
    // Adjust based on term (longer terms get slightly higher rates)
    if (term > 60) {
      rate += 2;
    } else if (term > 30) {
      rate += 1;
    }
    
    // Adjust based on credit score if available
    if (user?.creditScore) {
      if (user.creditScore > 700) {
        rate -= 2;
      } else if (user.creditScore > 600) {
        rate -= 1;
      } else if (user.creditScore < 500) {
        rate += 2;
      }
    }
    
    return rate;
  };

  const calculateMonthlyPayment = () => {
    const interestRate = calculateInterestRate() / 100;
    const totalInterest = amount * interestRate * (term / 30); // Adjust for term in days
    const totalPayment = amount + totalInterest;
    return totalPayment;
  };

  const runAiScoring = async () => {
    if (!purpose || purpose.length < 10) {
      setError('Please enter a detailed loan purpose for AI analysis');
      return;
    }
    
    setAiScoreLoading(true);
    setError('');
    
    try {
      // Simulate AI scoring delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock AI scoring logic based on inputs
      const baseScore = 550 + Math.floor(Math.random() * 200);
      
      // Adjust score based on amount (higher amounts are riskier)
      const amountFactor = amount > 30000 ? -30 : amount > 15000 ? -10 : 20;
      
      // Adjust score based on term (longer terms are riskier)
      const termFactor = term > 60 ? -20 : term > 30 ? -5 : 15;
      
      // Adjust score based on purpose (simplistic analysis)
      const purposeLower = purpose.toLowerCase();
      const purposeFactor = 
        purposeLower.includes('business') || purposeLower.includes('invest') ? 40 :
        purposeLower.includes('emergency') || purposeLower.includes('medical') ? 20 :
        purposeLower.includes('education') ? 30 :
        purposeLower.includes('debt') || purposeLower.includes('pay off') ? -15 :
        0;
      
      // Adjust score based on user credit score if available
      const creditScoreFactor = user?.creditScore ? (user.creditScore - 600) / 5 : 0;
      
      // Calculate final score
      const finalScore = Math.max(300, Math.min(850, 
        baseScore + amountFactor + termFactor + purposeFactor + creditScoreFactor
      ));
      
      // Determine approval likelihood
      const approval = finalScore > 580;
      
      // Create analysis
      const analysis = {
        score: Math.round(finalScore),
        approval,
        factors: [
          { 
            name: 'Loan Amount', 
            impact: amount > 30000 ? 'negative' : amount > 15000 ? 'neutral' : 'positive', 
            value: amountFactor 
          },
          { 
            name: 'Loan Term', 
            impact: term > 60 ? 'negative' : term > 30 ? 'neutral' : 'positive', 
            value: termFactor 
          },
          { 
            name: 'Loan Purpose', 
            impact: purposeFactor > 0 ? 'positive' : purposeFactor < 0 ? 'negative' : 'neutral', 
            value: purposeFactor 
          },
          { 
            name: 'Credit History', 
            impact: creditScoreFactor > 0 ? 'positive' : creditScoreFactor < 0 ? 'negative' : 'neutral', 
            value: Math.round(creditScoreFactor) 
          }
        ],
        recommendation: approval 
          ? 'Based on our analysis, your loan application has a good chance of approval.'
          : 'Based on our analysis, your loan application may need adjustments to improve approval chances.'
      };
      
      setAiScore(finalScore);
      setAiAnalysis(analysis);
    } catch (error) {
      setError('Failed to run AI scoring. Please try again.');
    } finally {
      setAiScoreLoading(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }
    
    if (!purpose) {
      setError('Please enter a loan purpose');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const loanId = await applyForLoan({
        amount,
        term,
        purpose
      });
      
      // Add notification for loan application
      addNotification({
        title: 'Loan Application Submitted',
        message: `Your loan application for KES ${amount.toLocaleString()} has been submitted successfully.`,
        type: 'success'
      });
      
      // Navigate to loan details page
      navigate(`/loans/${loanId}`);
    } catch (error) {
      setError('Failed to submit loan application. Please try again.');
    } finally {
      setIsSubmitting(false);
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Apply for a Loan</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Fill out the form below to apply for a loan
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="ml-3 text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card bordered>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Loan Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Loan Amount (KES)
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="1000"
                    max="50000"
                    value={amount}
                    onChange={handleAmountChange}
                    className="block w-full pl-10 pr-12 py-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="5000"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">KES</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>KES 1,000</span>
                  <span>KES 50,000</span>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Loan Term (Days)
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="7"
                    max="90"
                    value={term}
                    onChange={handleTermChange}
                    className="block w-full pl-10 pr-12 py-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="30"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">days</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <input
                  type="range"
                  min="7"
                  max="90"
                  value={term}
                  onChange={handleTermChange}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>7 days</span>
                  <span>90 days</span>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Loan Purpose
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    rows={4}
                    className="block w-full pl-10 py-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="Please describe why you need this loan..."
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Be specific about how you plan to use the funds. This helps our AI make better recommendations.
                </p>
              </div>
              
              <div className="mt-6 flex items-center">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  I agree to the{' '}
                  <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300">
                    terms and conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300">
                    privacy policy
                  </a>
                </label>
              </div>
            </div>
          </Card>
          
          <div className="space-y-4">
            {!aiScore && !aiScoreLoading && (
              <Button
                variant="secondary"
                onClick={runAiScoring}
                leftIcon={<TrendingUp className="h-5 w-5" />}
                fullWidth
              >
                Run AI Credit Analysis
              </Button>
            )}
            
            {aiScoreLoading && (
              <Card bordered className="bg-blue-50 dark:bg-blue-900/20">
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-blue-700 dark:text-blue-400 text-center">
                    Our AI is analyzing your application...
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-500 text-center mt-2">
                    This usually takes about 30 seconds
                  </p>
                </div>
              </Card>
            )}
            
            {aiAnalysis && (
              <Card bordered className={aiAnalysis.approval ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${
                        aiAnalysis.approval 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {aiAnalysis.approval ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <AlertCircle className="h-6 w-6" />
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          AI Credit Analysis
                        </h3>
                        <p className={`text-sm ${
                          aiAnalysis.approval 
                            ? 'text-green-700 dark:text-green-400'
                            : 'text-yellow-700 dark:text-yellow-400'
                        }`}>
                          {aiAnalysis.approval ? 'Favorable' : 'Conditional'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {aiAnalysis.score}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Credit Score
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Key Factors
                    </h4>
                    <div className="space-y-2">
                      {aiAnalysis.factors.map((factor, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            {factor.impact === 'positive' ? (
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            ) : factor.impact === 'negative' ? (
                              <XCircle className="h-4 w-4 text-red-500 mr-2" />
                            ) : (
                              <div className="h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
                            )}
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {factor.name}
                            </span>
                          </div>
                          <span className={`text-sm ${
                            factor.impact === 'positive' 
                              ? 'text-green-600 dark:text-green-400'
                              : factor.impact === 'negative'
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {factor.value > 0 ? '+' : ''}{factor.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <p>{aiAnalysis.recommendation}</p>
                  </div>
                </div>
              </Card>
            )}
            
            <Button
              variant="primary"
              fullWidth
              onClick={handleSubmitApplication}
              isLoading={isSubmitting}
              disabled={!purpose || !agreeToTerms}
            >
              Submit Application
            </Button>
          </div>
        </div>
        
        <div>
          <Card bordered className="sticky top-20">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Loan Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Loan Amount:</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(amount)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Loan Term:</span>
                <span className="font-medium text-gray-900 dark:text-white">{term} days</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Interest Rate:</span>
                <span className="font-medium text-gray-900 dark:text-white">{calculateInterestRate()}%</span>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Total Repayment:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(calculateMonthlyPayment())}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Due Date:</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {new Date(Date.now() + term * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Important Note</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Actual loan terms may vary based on our assessment of your application. 
                  Early repayment is allowed without any penalties.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;