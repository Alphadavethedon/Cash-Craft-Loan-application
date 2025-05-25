// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  kycVerified: boolean;
  role: 'user' | 'admin';
  creditScore: number;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  verifyKyc: (kycData: any) => Promise<void>;
}

// Loan Types
export interface LoanApplication {
  amount: number;
  term: number; // in days
  purpose: string;
}

export interface RepaymentSchedule {
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
}

export interface Loan {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  term: number; // in days
  purpose: string;
  interestRate: number;
  status: 'pending' | 'active' | 'repaid' | 'rejected' | 'overdue';
  aiScore: number;
  applicationDate: string;
  approvalDate: string | null;
  dueDate: string | null;
  repaymentAmount: number;
  repaymentSchedule: RepaymentSchedule[];
  repaidAmount: number;
}

export interface LoanContextType {
  loans: Loan[];
  loading: boolean;
  applyForLoan: (application: LoanApplication) => Promise<string>;
  getLoanById: (id: string) => Loan | null;
  repayLoan: (loanId: string, amount: number) => Promise<void>;
  getAllLoans: () => Promise<Loan[]>;
  approveLoan: (loanId: string) => Promise<void>;
  rejectLoan: (loanId: string) => Promise<void>;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => void;
}