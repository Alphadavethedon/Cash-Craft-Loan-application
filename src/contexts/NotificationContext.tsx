import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Notification, NotificationContextType } from '../types';

// Create the Notification Context
const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  loading: false,
  addNotification: () => {},
  markAsRead: () => Promise.resolve(),
  markAllAsRead: () => Promise.resolve(),
  clearNotifications: () => {},
});

// Notification Provider Component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  // Load user's notifications on authentication change
  useEffect(() => {
    if (user) {
      loadUserNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  // Calculate unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Load user notifications from local storage
  const loadUserNotifications = () => {
    if (!user) return;
    
    try {
      const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      } else {
        // Add default welcome notification for new users
        const welcomeNotification: Notification = {
          id: Math.random().toString(36).substr(2, 9),
          userId: user.id,
          title: 'Welcome to Cashcraft Loans',
          message: 'Thank you for joining Cashcraft Loans. We\'re excited to help you with your financial needs!',
          type: 'info',
          read: false,
          createdAt: new Date().toISOString(),
        };
        setNotifications([welcomeNotification]);
        saveNotifications([welcomeNotification]);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  // Save notifications to local storage
  const saveNotifications = (updatedNotifications: Notification[]) => {
    if (!user) return;
    
    try {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  };

  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>) => {
    if (!user) return;
    
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      ...notification,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  // Mark a notification as read
  const markAsRead = async (notificationId: string): Promise<void> => {
    if (!user) return Promise.reject('User not authenticated');
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedNotifications = notifications.map(notification => {
        if (notification.id === notificationId) {
          return { ...notification, read: true };
        }
        return notification;
      });
      
      setNotifications(updatedNotifications);
      saveNotifications(updatedNotifications);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw new Error('Failed to update notification');
    } finally {
      setLoading(false);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async (): Promise<void> => {
    if (!user) return Promise.reject('User not authenticated');
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      
      setNotifications(updatedNotifications);
      saveNotifications(updatedNotifications);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw new Error('Failed to update notifications');
    } finally {
      setLoading(false);
    }
  };

  // Clear all notifications
  const clearNotifications = () => {
    if (!user) return;
    
    setNotifications([]);
    saveNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount,
      loading,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook for using Notification context
export const useNotification = () => useContext(NotificationContext);