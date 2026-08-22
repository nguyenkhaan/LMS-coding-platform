import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { FigmaHeader } from '../courses/components/figma_header';
import { FigmaFooter } from '../courses/components/figma_footer';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  User,
  BookOpen,
  DollarSign,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  Wallet,
  X,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

// Types
interface WalletData {
  available_balance: number;
  pending_balance: number;
  total_earned: number;
  currency: string;
}

interface PayoutRequest {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  settlement_reference: string;
  failure_reason: string;
}

// Initial mock data from database seed.py
const INITIAL_WALLET: WalletData = {
  available_balance: 24.90, // From seed disponible
  pending_balance: 5.00,    // From seed pending request
  total_earned: 1240.00,    // From wireframe/mock
  currency: 'USD'
};

const INITIAL_PAYOUTS: PayoutRequest[] = [
  {
    id: 'PR-001',
    date: '28 Jan 2026',
    amount: 5.00,
    currency: 'USD',
    status: 'PENDING',
    settlement_reference: '—',
    failure_reason: '—'
  },
  {
    id: 'PR-002',
    date: '14 Jan 2026',
    amount: 120.00,
    currency: 'USD',
    status: 'APPROVED',
    settlement_reference: 'STL-99128',
    failure_reason: '—'
  },
  {
    id: 'PR-003',
    date: '30 Dec 2025',
    amount: 250.00,
    currency: 'USD',
    status: 'APPROVED',
    settlement_reference: 'STL-88241',
    failure_reason: '—'
  },
  {
    id: 'PR-004',
    date: '12 Nov 2025',
    amount: 80.00,
    currency: 'USD',
    status: 'REJECTED',
    settlement_reference: '—',
    failure_reason: 'Incorrect verification details (resubmit requested)'
  }
];

// Sidebar NavItem Props
interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={
      active
        ? 'flex items-center gap-3 px-3 py-2 rounded-xl text-[#FF4667] font-semibold bg-rose-50/60 text-sm'
        : 'flex items-center gap-3 py-1.5 px-2 rounded-lg text-[#6B7280] hover:text-[#FF4667] hover:bg-slate-50 transition-all text-sm'
    }
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export const TeacherWalletPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // State Management
  const [wallet, setWallet] = useState<WalletData>(INITIAL_WALLET);
  const [payouts, setPayouts] = useState<PayoutRequest[]>(INITIAL_PAYOUTS);
  const [amount, setAmount] = useState<string>('');

  const displayName = user?.fullName || 'Edythe Andrew';
  const avatarUrl = user?.avatarUrl || 'https://placehold.co/96x96';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if a pending payout request already exists (as per duplicate request rule)
  const hasPendingRequest = payouts.some(p => p.status === 'PENDING');
  const minPayout = 5.00; // Standard USD minimum payout limit

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Please enter a valid payout amount.');
      return;
    }

    if (numericAmount < minPayout) {
      toast.error(`Minimum payout amount is $${minPayout.toFixed(2)} USD.`);
      return;
    }

    if (numericAmount > wallet.available_balance) {
      toast.error('Insufficient available balance to complete this request.');
      return;
    }

    if (hasPendingRequest) {
      toast.error('You already have a pending payout request. Please wait for admin review.');
      return;
    }

    // Process local submission
    const newRequest: PayoutRequest = {
      id: `PR-00${payouts.length + 1}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      amount: numericAmount,
      currency: 'USD',
      status: 'PENDING',
      settlement_reference: '—',
      failure_reason: '—'
    };

    setPayouts([newRequest, ...payouts]);
    setWallet(prev => ({
      ...prev,
      available_balance: prev.available_balance - numericAmount,
      pending_balance: prev.pending_balance + numericAmount
    }));
    setAmount('');
    toast.success(`Payout request of $${numericAmount.toFixed(2)} submitted successfully!`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">

        {/* Page title banner */}
        <div className="w-full bg-gradient-to-r from-[#392C7D] to-purple-600 py-8 flex flex-col items-center justify-center gap-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Payout & Wallet</h1>
          <p className="text-[13px] font-medium text-white/70">Dashboard &rsaquo; Wallet & Payout</p>
        </div>

        {/* Profile hero banner */}
        <div className="w-full max-w-[1340px] mx-auto px-4 pt-8">
          <div className="w-full bg-gradient-to-r from-cyan-700 to-blue-700 rounded-2xl overflow-hidden relative p-8 flex items-center justify-between text-white shadow-sm">
            <div className="flex items-center gap-6 relative z-10">
              <img
                className="w-24 h-24 rounded-full border-4 border-white/20 object-cover bg-white"
                src={avatarUrl}
                alt={displayName}
              />
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-white tracking-tight">{displayName}</h2>
                <p className="text-neutral-200 text-sm font-medium">Teacher</p>
              </div>
            </div>
            <div className="flex gap-4 relative z-10">
              <button className="px-5 py-2.5 bg-white text-zinc-900 text-sm font-semibold rounded-full hover:bg-slate-100 transition-all cursor-pointer">
                Become a Student
              </button>
              <button
                onClick={() => navigate('/teacher/dashboard')}
                className="px-5 py-2.5 bg-[#FF4667] text-white text-sm font-semibold rounded-full hover:bg-[#e03d5b] transition-all cursor-pointer"
              >
                Teacher Dashboard
              </button>
            </div>
            <div className="absolute w-[400px] h-[400px] bg-white/5 rounded-full -right-24 -top-24 pointer-events-none" />
            <div className="absolute w-[200px] h-[200px] bg-white/5 rounded-full left-[40%] -bottom-12 pointer-events-none" />
          </div>
        </div>

        {/* Body content */}
        <div className="w-full max-w-[1340px] mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-6 shadow-sm">
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Main Menu</h3>
                <div className="flex flex-col gap-2">
                  <NavItem to="/teacher/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
                  <NavItem to="/teacher/profile" icon={<User className="w-4 h-4" />} label="My Profile" />
                  <NavItem to="/teacher/course-builder" icon={<BookOpen className="w-4 h-4" />} label="My Courses" />
                  <NavItem to="/teacher/course-enrollment" icon={<BookOpen className="w-4 h-4" />} label="Course Enrollment" />
                  <NavItem to="/teacher/students" icon={<Users className="w-4 h-4" />} label="Students" />
                  <NavItem to="/teacher/earnings" icon={<DollarSign className="w-4 h-4" />} label="Earnings" />
                  <NavItem to="/teacher/wallet" icon={<Wallet className="w-4 h-4" />} label="Payout & Wallet" active />
                  <NavItem to="/teacher/messages" icon={<MessageSquare className="w-4 h-4" />} label="Messages" />
                </div>
              </div>
              <div className="border-t border-gray-100 pt-6 flex flex-col gap-4">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Account Settings</h3>
                <div className="flex flex-col gap-2">
                  <NavItem to="/teacher/settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 py-1.5 px-2 rounded-lg text-[#6B7280] hover:text-rose-500 hover:bg-rose-50/50 transition-all text-sm text-left w-full cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 w-full flex flex-col gap-6 min-w-0">
            
            {/* Balance cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              {/* Available balance */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Wallet className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">Available Balance</span>
                  <h3 className="text-[22px] font-bold text-emerald-700 mt-0.5">${wallet.available_balance.toFixed(2)}</h3>
                  <p className="text-[11px] text-emerald-600 font-medium mt-0.5">USD Available for Payout</p>
                </div>
              </div>

              {/* Pending balance */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">Pending Balance</span>
                  <h3 className="text-[22px] font-bold text-amber-700 mt-0.5">${wallet.pending_balance.toFixed(2)}</h3>
                  <p className="text-[11px] text-amber-600 font-medium mt-0.5">Awaiting Admin Approval</p>
                </div>
              </div>

              {/* Total Earned */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-[#392C7D]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">Total Earned</span>
                  <h3 className="text-[22px] font-bold text-[#392C7D] mt-0.5">${wallet.total_earned.toFixed(2)}</h3>
                  <p className="text-[11px] text-[#392C7D] font-medium mt-0.5">Lifetime Gross Revenue</p>
                </div>
              </div>

            </div>

            {/* Split row: Form and Payout Rules */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* Request Payout Form */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-5">
                <div>
                  <h3 className="text-[16px] font-bold text-[#111827]">Request Payout</h3>
                  <p className="text-[13px] text-[#6B7280] mt-0.5">Withdraw funds from your available balance.</p>
                </div>
                
                <form onSubmit={handleRequestPayout} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="amount" className="text-[13px] font-semibold text-[#374151]">
                      Amount to request (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-[#6B7280] font-semibold">$</span>
                      <input
                        type="number"
                        id="amount"
                        step="0.01"
                        min="5.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        disabled={wallet.available_balance < minPayout || hasPendingRequest}
                        className="w-full pl-7 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#392C7D] focus:ring-1 focus:ring-[#392C7D]/20 text-[14px] font-medium transition-all bg-white disabled:bg-slate-50 disabled:text-[#9CA3AF]"
                      />
                    </div>
                    {wallet.available_balance < minPayout && (
                      <p className="text-[12px] text-rose-600 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        Withdrawal disabled: available balance must be at least $5.00 USD.
                      </p>
                    )}
                    {hasPendingRequest && (
                      <p className="text-[12px] text-amber-600 font-medium flex items-center gap-1 mt-1">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        Withdrawal locked: you already have an active pending request.
                      </p>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={wallet.available_balance < minPayout || hasPendingRequest || !amount}
                    className="w-full py-2.5 bg-[#FF4667] text-white text-[14px] font-semibold rounded-xl hover:bg-[#e03d5b] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                  >
                    Request Payout
                  </button>
                </form>
              </div>

              {/* Payout Rules */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
                <div>
                  <h3 className="text-[16px] font-bold text-[#111827]">Payout Policies</h3>
                  <p className="text-[13px] text-[#6B7280] mt-0.5">Platform terms & guidelines</p>
                </div>

                <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
                  
                  {/* Minimum policy */}
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#392C7D] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[13px] font-semibold text-[#111827]">Minimum Payout Amount</p>
                      <p className="text-[12px] text-[#6B7280]">Requests must be at least $5.00 USD.</p>
                    </div>
                  </div>

                  {/* Split policy */}
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#392C7D] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[13px] font-semibold text-[#111827]">Revenue Split Policy</p>
                      <p className="text-[12px] text-[#6B7280]">80% goes to the teacher, 20% platform share.</p>
                    </div>
                  </div>

                  {/* Review policy */}
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#392C7D] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[13px] font-semibold text-[#111827]">Admin Verification</p>
                      <p className="text-[12px] text-[#6B7280]">All requests require review and approval.</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Payout Requests History List */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-[16px] font-bold text-[#111827]">Payout History</h3>
                <p className="text-[13px] text-[#6B7280] mt-0.5">Historical records of payout requests and status logs</p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-gray-100 text-[12px] font-bold text-[#111827] uppercase tracking-wider">
                      <th className="px-6 py-3.5">Request ID</th>
                      <th className="px-6 py-3.5">Submission Date</th>
                      <th className="px-6 py-3.5 text-right">Amount</th>
                      <th className="px-6 py-3.5 text-center">Status</th>
                      <th className="px-6 py-3.5">Reference / Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[14px]">
                    {payouts.map((request) => (
                      <tr key={request.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-indigo-900 whitespace-nowrap">
                          {request.id}
                        </td>
                        <td className="px-6 py-4 text-[#6B7280] font-medium whitespace-nowrap">
                          {request.date}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-[#111827] whitespace-nowrap">
                          ${request.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                              request.status === 'APPROVED'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : request.status === 'PENDING'
                                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                : 'bg-rose-50 text-rose-700 border border-rose-100'
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#374151] font-medium max-w-[300px] truncate">
                          {request.status === 'APPROVED' && (
                            <span className="font-semibold text-emerald-600">Ref: {request.settlement_reference}</span>
                          )}
                          {request.status === 'REJECTED' && (
                            <span className="text-rose-600 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              {request.failure_reason}
                            </span>
                          )}
                          {request.status === 'PENDING' && (
                            <span className="text-slate-400 italic">Awaiting settlement review</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {payouts.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-[#6B7280]">
                          No payout requests initiated yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

        </div>
  );
};

export default TeacherWalletPage;
