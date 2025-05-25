import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  User, 
  Bot, 
  Zap,
  CornerUpRight,
  ChevronRight,
  MessageSquare,
  Copy,
  Check,
  HelpCircle
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface FAQ {
  question: string;
  answer: string;
}

const Support: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const faqs: FAQ[] = [
    {
      question: 'How do I apply for a loan?',
      answer: 'To apply for a loan, go to the dashboard and click on "Apply for Loan". Fill out the application form with the requested amount, purpose, and term length. Our AI will analyze your application and provide an instant decision in most cases.'
    },
    {
      question: 'How is my loan limit determined?',
      answer: 'Your loan limit is determined by our AI system based on several factors including your credit score, repayment history, income, and other financial indicators. As you successfully repay loans, your limit may increase over time.'
    },
    {
      question: 'What are the interest rates?',
      answer: 'Interest rates range from 12% to 20% depending on your credit score, loan amount, and term. The specific rate for your loan will be displayed before you confirm your application.'
    },
    {
      question: 'How do I make repayments?',
      answer: 'You can make repayments through M-PESA. Go to the loan details page and click "Make a Payment". Follow the instructions to complete your payment using your preferred method.'
    },
    {
      question: 'What happens if I pay late?',
      answer: 'Late payments may incur additional fees and negatively impact your credit score. If you anticipate difficulty making a payment, please contact our support team as soon as possible to discuss options.'
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (query: string): Message => {
    const lowerQuery = query.toLowerCase();
    
    // Check for different query types
    if (lowerQuery.includes('apply') || lowerQuery.includes('loan application') || lowerQuery.includes('get loan')) {
      return {
        id: Date.now().toString(),
        content: 'To apply for a loan, go to the Dashboard and click on the "Apply for Loan" button. Fill out the application form with your desired loan amount, purpose, and term. Our AI system will analyze your application and provide a decision quickly.',
        sender: 'ai',
        timestamp: new Date()
      };
    } else if (lowerQuery.includes('repay') || lowerQuery.includes('payment') || lowerQuery.includes('pay back')) {
      return {
        id: Date.now().toString(),
        content: 'You can repay your loan through M-PESA. Go to your loan details page, click on "Make a Payment", and follow the instructions. You can make partial payments or pay off the entire loan amount.',
        sender: 'ai',
        timestamp: new Date()
      };
    } else if (lowerQuery.includes('interest') || lowerQuery.includes('rate')) {
      return {
        id: Date.now().toString(),
        content: 'Our interest rates range from 12% to 20% depending on your credit score, loan amount, and term length. The specific interest rate for your loan will be displayed during the application process before you confirm.',
        sender: 'ai',
        timestamp: new Date()
      };
    } else if (lowerQuery.includes('kyc') || lowerQuery.includes('verify') || lowerQuery.includes('verification')) {
      return {
        id: Date.now().toString(),
        content: 'KYC (Know Your Customer) verification is required to ensure security and comply with regulations. You will need to provide your ID information and proof of address. This helps us verify your identity and protect against fraud.',
        sender: 'ai',
        timestamp: new Date()
      };
    } else if (lowerQuery.includes('late') || lowerQuery.includes('overdue') || lowerQuery.includes('miss payment')) {
      return {
        id: Date.now().toString(),
        content: 'If you miss a payment or pay late, you may incur late fees and it could negatively impact your credit score. If you anticipate difficulty making a payment, please contact our support team immediately to discuss your options.',
        sender: 'ai',
        timestamp: new Date()
      };
    } else if (lowerQuery.includes('credit score') || lowerQuery.includes('credit rating')) {
      return {
        id: Date.now().toString(),
        content: 'Your credit score is determined by our AI system based on your loan repayment history, financial behavior, and other factors. Consistently making timely repayments will improve your score over time, which can lead to higher loan limits and better rates.',
        sender: 'ai',
        timestamp: new Date()
      };
    } else if (lowerQuery.includes('contact') || lowerQuery.includes('human') || lowerQuery.includes('agent')) {
      return {
        id: Date.now().toString(),
        content: 'If you need to speak with a human agent, please call our customer service line at +254 712 345 678, available Monday to Friday from 8 AM to 6 PM. Alternatively, you can email us at support@cashcraft.com and we\'ll respond within 24 hours.',
        sender: 'ai',
        timestamp: new Date()
      };
    } else {
      return {
        id: Date.now().toString(),
        content: "I'm not sure I understand your question. Could you please rephrase or choose from one of our frequently asked questions below? You can ask about loan applications, repayments, interest rates, verification, or credit scores.",
        sender: 'ai',
        timestamp: new Date()
      };
    }
  };

  const handleFAQClick = (question: string) => {
    setInput(question);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: question,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Find the FAQ answer
    const faq = faqs.find(faq => faq.question === question);
    
    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now().toString(),
        content: faq ? faq.answer : "I'm not sure about that. Could you rephrase your question?",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      setInput('');
    }, 1000);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Support</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          How can we help you today?
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card bordered className="h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <Bot className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI Support Assistant</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ask me anything about your loans</p>
                </div>
              </div>
              <div className="flex items-center text-xs text-emerald-600 dark:text-emerald-400">
                <Zap className="h-4 w-4 mr-1" />
                <span>AI Powered</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500 ml-2' 
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 mr-2'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className="group relative">
                      <div className={`p-3 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-gray-800 dark:text-gray-100'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 inline-block">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      {message.sender === 'ai' && (
                        <button
                          onClick={() => copyToClipboard(message.id, message.content)}
                          className="absolute top-2 right-2 p-1 rounded-md bg-white dark:bg-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copiedId === message.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex max-w-[80%]">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 mr-2">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSubmit} className="mt-auto">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-800/40 transition-colors"
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card bordered>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-500" />
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <button
                  key={index}
                  onClick={() => handleFAQClick(faq.question)}
                  className="w-full text-left p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex justify-between items-center group"
                >
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 flex-shrink-0" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {faq.question}
                    </span>
                  </div>
                  <CornerUpRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </Card>
          
          <Card bordered>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Support</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">+254 712 345 678</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Monday - Friday, 8 AM - 6 PM
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Support</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">support@cashcraft.com</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  24/7 support with 24-hour response time
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <a
                  href="#"
                  className="flex items-center justify-between text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 text-sm font-medium"
                >
                  <span>Visit our Help Center</span>
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;