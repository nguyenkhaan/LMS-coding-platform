import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';
import { CheckoutHeader } from './components/checkout_header';
import { Button } from '@/components/ui/button';

export const PaymentResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Status can be success, pending, failed/cancelled
  const status = searchParams.get('status') || 'success';

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center">
      <CheckoutHeader title="Payment Result" />
      
      <div className="w-full max-w-[1340px] mx-auto px-4 py-12 flex flex-col items-center">
        {/* Main Result Card */}
        <div className="w-full max-w-[640px] bg-white rounded-3xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          {/* Accent border at the top based on status */}
          <div className={`h-2.5 w-full ${
            status === 'success' ? 'bg-emerald-500' :
            status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
          }`} />

          {/* Status info */}
          <div className="p-8 flex flex-col items-center text-center">
            {/* Centered Status Icon */}
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
              status === 'success' ? 'bg-emerald-50' :
              status === 'pending' ? 'bg-amber-50' : 'bg-rose-50'
            }`}>
              {status === 'success' && <CheckCircle2 className="w-12 h-12 text-emerald-500" />}
              {status === 'pending' && <Clock className="w-12 h-12 text-amber-500" />}
              {(status === 'failed' || status === 'cancelled') && <XCircle className="w-12 h-12 text-rose-500" />}
            </div>

            {/* Status Badge */}
            <div className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border ${
              status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {status === 'success' && 'Completed'}
              {status === 'pending' && 'Pending'}
              {(status === 'failed' || status === 'cancelled') && 'Cancelled'}
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight leading-tight mb-3">
              {status === 'success' && 'Payment successful'}
              {status === 'pending' && 'Payment pending'}
              {(status === 'failed' || status === 'cancelled') && 'Payment failed'}
            </h2>

            {/* Description */}
            <p className="text-sm text-[#374151] max-w-md leading-relaxed">
              {status === 'success' && 'Your payment has been confirmed by the payment provider. Enrollment is now active and you can start the course immediately.'}
              {status === 'pending' && 'We are waiting for confirmation from your bank or payment provider. This usually takes less than 30 seconds.'}
              {(status === 'failed' || status === 'cancelled') && 'The payment session was cancelled or failed. No charges were made. You can try checkout again.'}
            </p>
          </div>

          {/* Details list */}
          <div className="px-8 pb-6 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-bold text-[#392C7D] uppercase tracking-wider mb-4">Transaction Details</h3>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between py-2 border-b border-gray-50 text-sm">
                <span className="text-[#374151] font-medium">Course</span>
                <span className="font-semibold text-[#111827] text-right max-w-[65%]">Data Structures &amp; Algorithms Interview Prep</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50 text-sm">
                <span className="text-[#374151] font-medium">Amount paid</span>
                <span className="font-semibold text-[#111827]">$119.44 USD</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50 text-sm">
                <span className="text-[#374151] font-medium">Transaction code</span>
                <span className="font-semibold text-[#111827] font-mono text-xs">TXN-2026-0815-CMP</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50 text-sm">
                <span className="text-[#374151] font-medium">Payment reference</span>
                <span className="font-semibold text-[#111827] font-mono text-xs">PAYOS-7741903</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50 text-sm">
                <span className="text-[#374151] font-medium">Created</span>
                <span className="font-semibold text-[#111827]">Aug 15, 2026, 04:41 PM</span>
              </div>
              {status === 'success' && (
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-[#374151] font-medium">Completed</span>
                  <span className="font-semibold text-[#111827]">Aug 15, 2026, 04:45 PM</span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-8 py-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 bg-slate-50/50 justify-center">
            {status === 'success' && (
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate('/learn/data-structures-algorithms')}
                className="flex-1 bg-[#FF4667] hover:bg-[#e03d5b] text-white h-12 rounded-xl font-bold text-sm tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                Start learning
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
            {status === 'pending' && (
              <Button
                size="lg"
                variant="primary"
                onClick={() => window.location.reload()}
                className="flex-1 bg-[#392C7D] hover:bg-[#2d2263] text-white h-12 rounded-xl font-bold text-sm tracking-wide transition-all cursor-pointer animate-pulse"
              >
                Refresh status
              </Button>
            )}
            {(status === 'failed' || status === 'cancelled') && (
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate('/checkout/1')}
                className="flex-1 bg-[#392C7D] hover:bg-[#2d2263] text-white h-12 rounded-xl font-bold text-sm tracking-wide transition-all cursor-pointer"
              >
                Try checkout again
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/student/dashboard')}
              className="flex-1 h-12 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-[#374151] font-bold text-sm transition-all cursor-pointer"
            >
              Go to my courses
            </Button>
          </div>
        </div>

        {/* Disclaimer footer */}
        <p className="text-center text-xs text-[#6B7280] max-w-lg mt-6 leading-relaxed">
          Amounts shown are the snapshot recorded on this transaction and may differ from the current course price. Enrollment is granted only after the payment provider confirms the transaction.
        </p>
      </div>
    </div>
  );
};

export default PaymentResultPage;