import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export const PaymentMethodSelection: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<'vietqr' | 'bank' | 'card'>('vietqr');

  const handleSelect = (method: 'vietqr' | 'bank' | 'card') => {
    if (method !== 'vietqr') {
      toast.error("Only VietQR / PayOS QR is supported by the backend.");
      return;
    }
    setSelectedMethod(method);
  };

  return (
    <div className="self-stretch bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col font-['Inter']">
      <div className="self-stretch px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <div className="text-[20px] font-bold text-[#392C7D]">Payment method</div>
        <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          Backend Limitation: PayOS Only
        </span>
      </div>
      <div className="self-stretch p-6 flex flex-col gap-4">
        {/* VietQR */}
        <Card 
          onClick={() => handleSelect('vietqr')}
          className={`p-4 border-2 rounded-xl flex items-center gap-4 cursor-pointer transition-all ${
            selectedMethod === 'vietqr' ? 'border-[#392C7D] bg-indigo-50/10' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="w-5 h-5 rounded-full border-2 border-[#392C7D] flex items-center justify-center flex-shrink-0">
            <div className="w-2.5 h-2.5 bg-[#392C7D] rounded-full" />
          </div>
          <div>
            <div className="text-base font-semibold text-[#111827]">VietQR / PayOS QR</div>
            <div className="text-sm text-[#374151]">Scan with any Vietnamese banking app</div>
          </div>
          <span className="ml-auto text-[11px] font-bold text-[#392C7D] bg-indigo-50 px-2 py-0.5 rounded-md">
            Active
          </span>
        </Card>

        {/* Bank Transfer */}
        <Card 
          onClick={() => handleSelect('bank')}
          className="p-4 border border-gray-200 bg-slate-50/50 opacity-65 rounded-xl flex items-center gap-4 cursor-not-allowed hover:border-gray-200 transition-colors"
        >
          <div className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0 bg-white" />
          <div className="flex-1">
            <div className="text-base font-semibold text-neutral-400">Bank transfer</div>
            <div className="text-sm text-neutral-400">Auto-reconciled within 30 seconds</div>
          </div>
          <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
            Unsupported (Backend Limitation)
          </span>
        </Card>

        {/* Card */}
        <Card 
          onClick={() => handleSelect('card')}
          className="p-4 border border-gray-200 bg-slate-50/50 opacity-65 rounded-xl flex items-center gap-4 cursor-not-allowed hover:border-gray-200 transition-colors"
        >
          <div className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0 bg-white" />
          <div className="flex-1">
            <div className="text-base font-semibold text-neutral-400">Domestic &amp; international card</div>
            <div className="text-sm text-neutral-400">Visa, Mastercard, JCB, NAPAS</div>
          </div>
          <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
            Unsupported (Backend Limitation)
          </span>
        </Card>
      </div>
    </div>
  );
};
