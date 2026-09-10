import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, CreditCard, AlertCircle, GraduationCap, XCircle, BookOpen, Terminal, Bot, DollarSign, ChevronRight } from 'lucide-react';
import { useNotificationStore } from '@/features/notification/model/useNotificationStore';
import { NotificationItem, NotificationEventType } from '../types.ts';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const unread = unreadCount();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const handleNotificationClick = (item: NotificationItem) => {
    markAsRead(item.id);
    setIsOpen(false);
    if (item.targetUrl) {
      navigate(item.targetUrl);
    }
  };

  const getEventIcon = (type: NotificationEventType) => {
    switch (type) {
      case 'PAYMENT_SUCCESS':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'PAYMENT_FAILURE':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case 'TEACHER_APPROVAL':
        return <GraduationCap className="w-4 h-4 text-indigo-900" />;
      case 'TEACHER_REJECTION':
        return <XCircle className="w-4 h-4 text-rose-500" />;
      case 'COURSE_APPROVAL':
        return <BookOpen className="w-4 h-4 text-sky-600" />;
      case 'COURSE_REJECTION':
        return <XCircle className="w-4 h-4 text-rose-500" />;
      case 'JUDGE_RESULT':
        return <Terminal className="w-4 h-4 text-emerald-600" />;
      case 'AI_REPORT_READY':
        return <Bot className="w-4 h-4 text-indigo-900" />;
      case 'PAYOUT_APPROVAL':
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case 'PAYOUT_REJECTION':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      default:
        return <Bell className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getEventBg = (type: NotificationEventType) => {
    switch (type) {
      case 'PAYMENT_SUCCESS':
      case 'JUDGE_RESULT':
      case 'PAYOUT_APPROVAL':
        return 'bg-emerald-50 border-emerald-200';
      case 'PAYMENT_FAILURE':
      case 'TEACHER_REJECTION':
      case 'COURSE_REJECTION':
      case 'PAYOUT_REJECTION':
        return 'bg-rose-50 border-rose-200';
      case 'AI_REPORT_READY':
      case 'TEACHER_APPROVAL':
        return 'bg-indigo-50 border-indigo-200';
      case 'COURSE_APPROVAL':
        return 'bg-sky-50 border-sky-200';
      default:
        return 'bg-slate-100 border-neutral-200';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-full border border-neutral-200 hover:bg-slate-50 transition-colors cursor-pointer relative"
        title="Notifications"
      >
        <Bell className="w-4 h-4 text-zinc-700" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs animate-pulse">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Notification Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-neutral-200 shadow-2xl z-50 overflow-hidden flex flex-col font-['Inter'] animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-neutral-200 flex justify-between items-center bg-slate-50/80">
            <div className="flex items-center gap-2">
              <h3 className="text-zinc-900 font-bold text-sm">Notifications</h3>
              {unread > 0 && (
                <span className="px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full text-[11px] font-bold">
                  {unread} new
                </span>
              )}
            </div>

            {unread > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-indigo-900 hover:text-indigo-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2 border-b border-neutral-100 flex items-center gap-2 bg-white">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-neutral-500 hover:bg-slate-100'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'unread'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-neutral-500 hover:bg-slate-100'
              }`}
            >
              Unread ({unread})
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-neutral-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2 text-neutral-400">
                <Bell className="w-8 h-8 stroke-1" />
                <span className="text-xs font-medium">No notifications in this view</span>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer group ${
                    !item.isRead ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  {/* Event Category Icon */}
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${getEventBg(item.eventType)}`}>
                    {getEventIcon(item.eventType)}
                  </div>

                  {/* Body & Navigation Target */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs font-semibold truncate ${!item.isRead ? 'text-zinc-900 font-bold' : 'text-zinc-700'}`}>
                        {item.title}
                      </h4>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5 leading-snug">
                      {item.message}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-400">
                      <span>{item.createdAt}</span>
                      <span className="text-indigo-900 font-semibold group-hover:underline flex items-center gap-0.5">
                        View details
                        <ChevronRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 border-t border-neutral-200 bg-slate-50 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/dashboard');
              }}
              className="text-xs font-semibold text-zinc-700 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              View Activity Center
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
