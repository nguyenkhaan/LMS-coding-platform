export type NotificationEventType =
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILURE'
  | 'TEACHER_APPROVAL'
  | 'TEACHER_REJECTION'
  | 'COURSE_APPROVAL'
  | 'COURSE_REJECTION'
  | 'JUDGE_RESULT'
  | 'AI_REPORT_READY'
  | 'PAYOUT_APPROVAL'
  | 'PAYOUT_REJECTION';

export type NotificationTargetType =
  | 'PAYMENT'
  | 'TEACHER'
  | 'COURSE'
  | 'JUDGE'
  | 'AI_REPORT'
  | 'PAYOUT';

export interface NotificationItem {
  id: string;
  eventType: NotificationEventType;
  title: string;
  message: string;
  targetType: NotificationTargetType;
  targetId: string;
  targetUrl: string;
  isRead: boolean;
  createdAt: string;
}
