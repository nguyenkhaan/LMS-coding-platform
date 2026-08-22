import React from 'react';
import { Card } from '@/components/ui/Card'; // Assuming a Card component exists, otherwise use a div

export const PaymentMethodSelection: React.FC = () => (
  <div className="self-stretch bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
    <div className="self-stretch px-6 py-5 border-b border-gray-200 inline-flex justify-start items-center">
      <div className="text-[20px] font-bold text-[#392C7D]">Payment method</div>
    </div>
    <div className="self-stretch p-6 flex flex-col gap-4">
      {/* VietQR */}
      <Card className="p-4 border-2 border-[#392C7D] bg-white rounded-xl flex items-center gap-4 cursor-pointer">
        <div className="w-5 h-5 rounded-full border-2 border-[#392C7D] flex items-center justify-center flex-shrink-0">
          <div className="w-2.5 h-2.5 bg-[#392C7D] rounded-full" />
        </div>
        <div>
          <div className="text-base font-semibold text-[#111827]">VietQR / PayOS QR</div>
          <div className="text-sm text-[#374151]">Scan with any Vietnamese banking app</div>
        </div>
      </Card>
      {/* Bank Transfer */}
      <Card className="p-4 border border-gray-200 bg-white rounded-xl flex items-center gap-4 cursor-pointer hover:border-gray-300 transition-colors">
        <div className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0 bg-white" />
        <div>
          <div className="text-base font-semibold text-[#111827]">Bank transfer</div>
          <div className="text-sm text-[#374151]">Auto-reconciled within 30 seconds</div>
        </div>
      </Card>
      {/* Card */}
      <Card className="p-4 border border-gray-200 bg-white rounded-xl flex items-center gap-4 cursor-pointer hover:border-gray-300 transition-colors">
        <div className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0 bg-white" />
        <div>
          <div className="text-base font-semibold text-[#111827]">Domestic &amp; international card</div>
          <div className="text-sm text-[#374151]">Visa, Mastercard, JCB, NAPAS</div>
        </div>
      </Card>
    </div>
  </div>
);
