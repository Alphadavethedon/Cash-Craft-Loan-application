import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Loan, LoanContextType, LoanApplication as LoanApplicationType } from '../types';

// Create the Loan Context
const LoanContext = createContext<LoanContextType>({
  loans: [],
  loading: false,
  applyForLoan: () => Promise.resolve(''),
  getLoanById: () => null,
  repayLoan: () => Promise.resolve(),
  getAllLoans: () => Promise.resolve([]),
  approveLoan: () => Promise.resolve(),
  rejectLoan: () => Promise.resolve(),
});

// Loan Provider Component
export const LoanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  // Load user's loans on authentication change
  useEffect(() => {
    if (user) {
      loadUserLoans();
    } else {
      setLoans([]);
    }
  }, [user]);

  // Load user loans from local storage (simulating database)
  const loadUserLoans = () => {
    try {
      const savedLoans = localStorage.getItem('user_loans');
      if (savedLoans) {
        const allLoans = JSON.parse(savedLoans);
        // Filter loans for current user
        const userLoans = user?.role === 'admin' 
          ? allLoans 
          : allLoans.filter((loan: Loan) => loan.userId === user?.id);
        setLoans(userLoans);
      }
    } catch (error) {
      console.error('Failed to load loans:', error);
    }
  };

  // Save loans to local storage
  const saveLoans = (updatedLoans: Loan[]) => {
    try {
      localStorage.setItem('user_loans', JSON.stringify(updatedLoans));
    } catch (error) {
      console.error('Failed to save loans:', error);
    }
  };

  // Apply for a new loan
  const applyForLoan = async (application: LoanApplicationType): Promise<string> => {
    if (!user) return Promise.reject('User not authenticated');
    
    setLoading(true);
    
    try {
      // Simulate API call and AI-based scoring
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a credit score using "AI" (simulated)
      const aiCreditScore = Math.floor(Math.random() * 300) + 400; // Score between 400-700
      
      // Create new loan with pending status
      const newLoan: Loan = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        userName: user.name,
        amount: application.amount,
        term: application.term,
        purpose: application.purpose,
        interestRate: 12 + (Math.random() * 8), // Random interest rate between 12-20%
        status: 'pending',
        aiScore: aiCreditScore,
        applicationDate: new Date().toISOString(),
        approvalDate: null,
        dueDate: null,
        repaymentAmount: 0, // Will be calculated if approved
        repaymentSchedule: [],
        repaidAmount: 0,
      };
      
      // Update state and local storage
      const updatedLoans = [...loans, newLoan];
      setLoans(updatedLoans);
      saveLoans(updatedLoans);
      
      return newLoan.id;
    } catch (error) {
      console.error('Loan application failed:', error);
      throw new Error('Failed to submit loan application');
    } finally {
      setLoading(false);
    }
  };

  // Get loan by ID
  const getLoanById = (id: string): Loan | null => {
    return loans.find(loan => loan.id === id) || null;
  };

  // Make a loan repayment
  const repayLoan = async (loanId: string, amount: number): Promise<void> => {
    if (!user) return Promise.reject('User not authenticated');
    
    setLoading(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Find and update the loan
      const updatedLoans = loans.map(loan => {
        if (loan.id === loanId) {
          const newRepaidAmount = loan.repaidAmount + amount;
          const isFullyRepaid = newRepaidAmount >= loan.repaymentAmount;
          
          return {
            ...loan,
            repaidAmount: newRepaidAmount,
            status: isFullyRepaid ? 'repaid' : 'active',
          };
        }
        return loan;
      });
      
      setLoans(updatedLoans);
      saveLoans(updatedLoans);
    } catch (error) {
      console.error('Repayment failed:', error);
      throw new Error('Failed to process repayment');
    } finally {
      setLoading(false);
    }
  };

  // Get all loans (admin function)
  const getAllLoans = async (): Promise<Loan[]> => {
    if (!user || user.role !== 'admin') {
      return Promise.reject('Unauthorized');
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get all loans from storage
      const savedLoans = localStorage.getItem('user_loans');
      if (savedLoans) {
        return JSON.parse(savedLoans);
      }
      return [];
    } catch (error) {
      console.error('Failed to get all loans:', error);
      throw new Error('Failed to fetch loans');
    } finally {
      setLoading(false);
    }
  };

  // Approve a loan (admin function)
  const approveLoan = async (loanId: string): Promise<void> => {
    if (!user || user.role !== 'admin') {
      return Promise.reject('Unauthorized');
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate due date (30 days from now for this example)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      
      // Update the loan
      const updatedLoans = loans.map(loan => {
        if (loan.id === loanId) {
          // Calculate repayment amount with interest
          const principal = loan.amount;
          const interest = principal * (loan.interestRate / 100);
          const repaymentAmount = principal + interest;
          
          return {
            ...loan,
            status: 'active',
            approvalDate: new Date().toISOString(),
            dueDate: dueDate.toISOString(),
            repaymentAmount,
            repaymentSchedule: [
              {
                dueDate: dueDate.toISOString(),
                amount: repaymentAmount,
                status: 'pending'
              }
            ]
          };
        }
        return loan;
      });
      
      setLoans(updatedLoans);
      saveLoans(updatedLoans);
    } catch (error) {
      console.error('Loan approval failed:', error);
      throw new Error('Failed to approve loan');
    } finally {
      setLoading(false);
    }
  };

  // Reject a loan (admin function)
  const rejectLoan = async (loanId: string): Promise<void> => {
    if (!user || user.role !== 'admin') {
      return Promise.reject('Unauthorized');
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the loan
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
      saveLoans(updatedLoans);
    } catch (error) {
      console.error('Loan rejection failed:', error);
      throw new Error('Failed to reject loan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoanContext.Provider value={{ 
      loans, 
      loading,
      applyForLoan,
      getLoanById,
      repayLoan,
      getAllLoans,
      approveLoan,
      rejectLoan
    }}>
      {children}
    </LoanContext.Provider>
  );
};

// Hook for using Loan context
export const useLoan = () => useContext(LoanContext);