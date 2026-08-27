import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { TeacherSidebar } from '../components/teacherSidebar.tsx';
import { Clock, TrendingUp, Wallet, ChevronLeft, ChevronRight } from 'lucide-react';

// Types
interface WalletData {
  available_balance: number;
  pending_balance: number;
  total_revenue: number;
  this_month_earning: number;
  total_payout: number;
  currency: string;
}

interface LedgerEntry {
  id: string;
  date: string;
  course: string;
  student: string;
  amount: number;
  entry_type: 'revenue' | 'reserve' | 'release' | 'refund';
  status: 'Paid' | 'Pending' | 'Refunded';
}

// Mock wallet data representing backend/database values (aligned with seed.py values)
const MOCK_WALLET: WalletData = {
  available_balance: 24.90, // From seed: available_balance=Decimal("24.90")
  pending_balance: 5.00,    // From seed: pending_balance=Decimal("5.00")
  total_revenue: 1240.00,   // Aligned with Figma wireframe
  this_month_earning: 320.00, // Aligned with Figma wireframe
  total_payout: 890.00,     // Aligned with Figma wireframe
  currency: 'USD'
};

// Mock ledger representing both seed.py transactions and Figma wireframe entries
const MOCK_LEDGER: LedgerEntry[] = [
  // Seed entries
  { id: 'L1', date: '28 Jan 2026', course: 'Python Foundations for Problem Solving', student: 'Cloudian Student', amount: 29.90, entry_type: 'revenue', status: 'Paid' },
  { id: 'L2', date: '28 Jan 2026', course: 'Payout Request (Reserve)', student: '—', amount: -5.00, entry_type: 'reserve', status: 'Pending' },
  // Figma wireframe & realistic entries
  { id: 'L3', date: '22 Jan 2026', course: 'Data Structures & Algorithms Interview Prep', student: 'Patricia Sanders', amount: 52.00, entry_type: 'revenue', status: 'Paid' },
  { id: 'L4', date: '18 Jan 2026', course: 'Production React & TypeScript', student: 'Jenny Wilson', amount: 64.00, entry_type: 'revenue', status: 'Pending' },
  { id: 'L5', date: '16 Jan 2026', course: 'Python Foundations for Problem Solving', student: 'Ronald Richard', amount: 48.00, entry_type: 'revenue', status: 'Paid' },
  { id: 'L6', date: '12 Dec 2025', course: 'Production React & TypeScript', student: 'Bessie Cooper', amount: 64.00, entry_type: 'revenue', status: 'Paid' },
  { id: 'L7', date: '18 Dec 2025', course: 'Python Foundations for Problem Solving', student: 'Cody Fisher', amount: 48.00, entry_type: 'revenue', status: 'Paid' },
  { id: 'L8', date: '20 Dec 2025', course: 'Data Structures & Algorithms Prep', student: 'Kristin Watson', amount: -52.00, entry_type: 'refund', status: 'Refunded' },
  { id: 'L9', date: '05 Nov 2025', course: 'Production React & TypeScript', student: 'Albert Flores', amount: 108.00, entry_type: 'revenue', status: 'Paid' },
  { id: 'L10', date: '15 Nov 2025', course: 'Python Foundations for Problem Solving', student: 'Ronald Richard', amount: 48.00, entry_type: 'revenue', status: 'Paid' }
];

// SVG Line Chart component for Revenue overview
interface LineChartProps {
  data: number[];
  labels: string[];
}

const LineChart: React.FC<LineChartProps> = ({ data, labels }) => {
  const max = Math.max(...data, 100);
  const min = 0;
  const range = max - min;
  const height = 180;
  const width = 600;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 20;

  // Calculate points
  const points = data.map((val, idx) => {
    const x = paddingLeft + (idx * (width - paddingLeft - paddingRight)) / (data.length - 1 || 1);
    const y = height - paddingBottom - ((val - min) * (height - paddingTop - paddingBottom)) / range;
    return { x, y };
  });

  const pathD = points.reduce(
    (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const areaD =
    firstPoint && lastPoint
      ? `${pathD} L ${lastPoint.x} ${height - paddingBottom} L ${firstPoint.x} ${height - paddingBottom} Z`
      : '';

  return (
    <div className="w-full overflow-x-auto">
      <svg className="w-full h-[220px] min-w-[500px]" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#392C7D" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#392C7D" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = paddingTop + ratio * (height - paddingTop - paddingBottom);
          const val = max - ratio * range;
          return (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#F3F4F6"
                strokeWidth={1}
              />
              <text
                x={paddingLeft - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-[#6B7280] text-[9px] font-semibold"
              >
                ${Math.round(val)}
              </text>
            </g>
          );
        })}

        {/* Area under line */}
        {areaD && <path d={areaD} fill="url(#revenueGrad)" />}

        {/* Main Line path */}
        {pathD && (
          <path d={pathD} fill="none" stroke="#392C7D" strokeWidth={2.5} strokeLinecap="round" />
        )}

        {/* Data points */}
        {points.map((pt, idx) => (
          <g key={idx} className="group">
            <circle
              cx={pt.x}
              cy={pt.y}
              r={3.5}
              className="fill-white stroke-[#392C7D] stroke-2 hover:r-5 cursor-pointer transition-all"
            />
            <title>{`$${data[idx]}`}</title>
          </g>
        ))}

        {/* Labels under X axis */}
        {labels.map((lbl, idx) => {
          const x = paddingLeft + (idx * (width - paddingLeft - paddingRight)) / (labels.length - 1 || 1);
          return (
            <text
              key={idx}
              x={x}
              y={height - 4}
              textAnchor="middle"
              className="fill-[#6B7280] text-[9px] font-medium"
            >
              {lbl}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export const TeacherEarningsPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'this_month' | 'last_3_months' | 'all_time'>('this_month');
  const [currentPage, setCurrentPage] = useState(1);

  const displayName = user?.fullName || 'Edythe Andrew';
  const avatarUrl = user?.avatarUrl || 'https://placehold.co/96x96';

  // Period-dependent metrics and chart data
  const getMetrics = () => {
    switch (period) {
      case 'last_3_months':
        return {
          totalRevenue: 3820,
          thisPeriodEarning: 1240,
          payout: 2520,
          availableBalance: MOCK_WALLET.available_balance + 1000,
          pendingBalance: MOCK_WALLET.pending_balance + 300,
          chartData: [850, 1100, 950, 1380, 1200, 1240],
          chartLabels: ['Nov 1', 'Nov 15', 'Dec 1', 'Dec 15', 'Jan 1', 'Jan 15']
        };
      case 'all_time':
        return {
          totalRevenue: 12450,
          thisPeriodEarning: 12450,
          payout: 8790,
          availableBalance: MOCK_WALLET.available_balance + 3000,
          pendingBalance: MOCK_WALLET.pending_balance + 660,
          chartData: [600, 750, 890, 850, 1020, 1100, 1050, 1200, 1150, 1300, 1250, 1380],
          chartLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        };
      case 'this_month':
      default:
        return {
          totalRevenue: MOCK_WALLET.total_revenue,
          thisPeriodEarning: MOCK_WALLET.this_month_earning,
          payout: MOCK_WALLET.total_payout,
          availableBalance: MOCK_WALLET.available_balance,
          pendingBalance: MOCK_WALLET.pending_balance,
          chartData: [120, 180, 150, 240, 290, 320],
          chartLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6']
        };
    }
  };

  const metrics = getMetrics();

  // Dynamic ledger entries based on selected period
  const getFilteredLedger = () => {
    if (period === 'this_month') {
      return MOCK_LEDGER.filter(item => item.date.includes('Jan 2026'));
    } else if (period === 'last_3_months') {
      return MOCK_LEDGER.filter(item => item.date.includes('Jan 2026') || item.date.includes('Dec 2025') || item.date.includes('Nov 2025'));
    }
    return MOCK_LEDGER;
  };

  const filteredLedger = getFilteredLedger();
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredLedger.length / itemsPerPage) || 1;
  const paginatedLedger = filteredLedger.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriod(e.target.value as 'this_month' | 'last_3_months' | 'all_time');
    setCurrentPage(1);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">

        {/* Page title banner */}
        <div className="w-full bg-gradient-to-r from-[#392C7D] to-purple-600 py-8 flex flex-col items-center justify-center gap-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Earnings</h1>
          <p className="text-[13px] font-medium text-white/70">Dashboard &rsaquo; Earnings</p>
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
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 bg-white text-indigo-900 text-sm font-semibold rounded-full hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
              >
                Switch to Student
              </button>
            </div>
            <div className="absolute w-[400px] h-[400px] bg-white/5 rounded-full -right-24 -top-24 pointer-events-none" />
            <div className="absolute w-[200px] h-[200px] bg-white/5 rounded-full left-[40%] -bottom-12 pointer-events-none" />
          </div>
        </div>

        {/* Body content */}
        <div className="w-full max-w-[1340px] mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar */}
          <TeacherSidebar activePath="/teacher/earnings" />

          {/* Main content area */}
          <div className="flex-1 w-full flex flex-col gap-6 min-w-0">
            
            {/* Header & period selector toolbar */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="text-[20px] font-bold text-[#392C7D]">Earnings & Wallet Overview</h2>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-[#6B7280] font-medium">Filter Period:</span>
                <select
                  value={period}
                  onChange={handlePeriodChange}
                  className="px-3.5 py-1.5 border border-gray-200 rounded-xl text-[13px] font-semibold text-[#374151] focus:outline-none focus:border-[#392C7D] cursor-pointer bg-white"
                >
                  <option value="this_month">This Month</option>
                  <option value="last_3_months">Last 3 Months</option>
                  <option value="all_time">All Time</option>
                </select>
              </div>
            </div>

            {/* Wallet & Balance KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              {/* Total Revenue card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4 hover:border-indigo-100 transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-[#392C7D]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">Total Revenue</span>
                  <h3 className="text-[20px] font-bold text-[#111827] mt-0.5">${metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                  <p className="text-[11px] text-[#374151] font-medium mt-0.5">Earning: ${metrics.thisPeriodEarning.toLocaleString('en-US', { minimumFractionDigits: 2 })} this period</p>
                </div>
              </div>

              {/* Available Balance card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4 hover:border-emerald-100 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Wallet className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">Available Balance</span>
                  <h3 className="text-[20px] font-bold text-emerald-700 mt-0.5">${metrics.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                  <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Ready for payout withdrawal</p>
                </div>
              </div>

              {/* Pending / Reserved Balance card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4 hover:border-amber-100 transition-all">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">Pending Balance</span>
                  <h3 className="text-[20px] font-bold text-amber-700 mt-0.5">${metrics.pendingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                  <p className="text-[11px] text-amber-600 font-medium mt-0.5">Includes ${MOCK_WALLET.pending_balance.toFixed(2)} payout requested</p>
                </div>
              </div>

            </div>

            {/* Revenue Overview chart card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
              <div>
                <h3 className="text-[16px] font-bold text-[#111827]">Revenue Overview</h3>
                <p className="text-[13px] text-[#6B7280] mt-0.5">Visual overview of course sales and payouts over time</p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <LineChart data={metrics.chartData} labels={metrics.chartLabels} />
              </div>
            </div>

            {/* Wallet Ledger Table card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-bold text-[#111827]">Wallet Ledger</h3>
                  <p className="text-[13px] text-[#6B7280] mt-0.5">Immutable record of payouts, revenues and refunds</p>
                </div>
              </div>
              
              {/* Table list */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-gray-100 text-[12px] font-bold text-[#111827] uppercase tracking-wider">
                      <th className="px-6 py-3.5">Date</th>
                      <th className="px-6 py-3.5">Course / Transaction</th>
                      <th className="px-6 py-3.5">Student</th>
                      <th className="px-6 py-3.5 text-right">Amount</th>
                      <th className="px-6 py-3.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[14px]">
                    {paginatedLedger.map((entry) => {
                      const isNegative = entry.amount < 0;
                      return (
                        <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-[#6B7280] font-medium whitespace-nowrap">
                            {entry.date}
                          </td>
                          <td className="px-6 py-4 text-[#111827] font-semibold max-w-[280px] truncate">
                            {entry.course}
                          </td>
                          <td className="px-6 py-4 text-[#374151] font-medium">
                            {entry.student}
                          </td>
                          <td className={`px-6 py-4 text-right font-bold whitespace-nowrap ${isNegative ? 'text-rose-600' : 'text-[#392C7D]'}`}>
                            {isNegative ? '-' : ''}${Math.abs(entry.amount).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                                entry.status === 'Paid'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : entry.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                  : 'bg-rose-50 text-rose-700 border border-rose-100'
                              }`}
                            >
                              {entry.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {paginatedLedger.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-[#6B7280]">
                          No wallet activities found for this period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-slate-50/50 border-t border-gray-100 flex items-center justify-between gap-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl border border-gray-200 text-[12px] font-semibold text-[#374151] bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Previous
                  </button>
                  <span className="text-[12px] font-bold text-[#6B7280]">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl border border-gray-200 text-[12px] font-semibold text-[#374151] bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

        </div>
  );
};

export default TeacherEarningsPage;
