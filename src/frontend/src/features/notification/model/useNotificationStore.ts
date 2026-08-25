import { create } from 'zustand';
import { NotificationItem } from '@/features/notification/types';

interface NotificationStore {
  notifications: NotificationItem[];
  unreadCount: () => number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'isRead' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    eventType: 'AI_REPORT_READY',
    title: 'AI Interview Report Ready',
    message: 'Your Technical System Design interview evaluation is ready with score 75/100.',
    targetType: 'AI_REPORT',
    targetId: 'session-001',
    targetUrl: '/interview/report/session-001',
    isRead: false,
    createdAt: '5 minutes ago'
  },
  {
    id: 'notif-2',
    eventType: 'JUDGE_RESULT',
    title: 'Judge Result: Accepted (100/100)',
    message: 'Your submission for OJ-001 (Two Sum) passed all 50 test cases.',
    targetType: 'JUDGE',
    targetId: 'oj-001',
    targetUrl: '/submissions',
    isRead: false,
    createdAt: '30 minutes ago'
  },
  {
    id: 'notif-3',
    eventType: 'PAYMENT_SUCCESS',
    title: 'Payment Successful',
    message: 'Enrolled in Python Foundations for Problem Solving via PayOS (#PAY-8921).',
    targetType: 'PAYMENT',
    targetId: 'pay-8921',
    targetUrl: '/student/courses',
    isRead: false,
    createdAt: '2 hours ago'
  },
  {
    id: 'notif-4',
    eventType: 'TEACHER_APPROVAL',
    title: 'Teacher Application Approved',
    message: 'Congratulations! Your instructor profile has been verified and approved.',
    targetType: 'TEACHER',
    targetId: 'tr-0001',
    targetUrl: '/admin/verifications',
    isRead: true,
    createdAt: '1 day ago'
  },
  {
    id: 'notif-5',
    eventType: 'COURSE_APPROVAL',
    title: 'Course Approved for Publishing',
    message: 'Course "Production React & TypeScript" is now live on the catalog.',
    targetType: 'COURSE',
    targetId: 'react-typescript',
    targetUrl: '/courses/react-typescript',
    isRead: true,
    createdAt: '2 days ago'
  },
  {
    id: 'notif-6',
    eventType: 'PAYOUT_APPROVAL',
    title: 'Payout Request Approved',
    message: 'Payout of 4.500.000 ₫ has been processed to your bank account.',
    targetType: 'PAYOUT',
    targetId: 'payout-441',
    targetUrl: '/dashboard',
    isRead: true,
    createdAt: '3 days ago'
  }
];

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: INITIAL_NOTIFICATIONS,

  unreadCount: () => get().notifications.filter((n) => !n.isRead).length,

  markAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true }))
    }));
  },

  addNotification: (item) => {
    const newNotif: NotificationItem = {
      ...item,
      id: 'notif-' + Date.now(),
      isRead: false,
      createdAt: 'Just now'
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications]
    }));
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    }));
  }
}));
