import React from 'react';
import { Input } from '@/components/ui/input';

export const BillingInfoForm: React.FC = () => (
  <div className="self-stretch bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
    <div className="self-stretch px-6 py-5 border-b border-gray-200 inline-flex justify-start items-center flex-wrap">
      <div className="text-[20px] font-bold text-primary">Billing information</div>
    </div>
    <div className="self-stretch p-6 flex flex-col gap-6">
      <Input maxLength={100} label="Full name" placeholder="Trần Minh" className="bg-white border-gray-200 text-zinc-900 placeholder:text-neutral-500 h-10" />
      <Input maxLength={100} label="Email" placeholder="minh.tran@example.com" className="bg-white border-gray-200 text-zinc-900 placeholder:text-neutral-500 h-10" />
      <Input maxLength={20} label="Phone number" placeholder="+84 912 345 678" className="bg-white border-gray-200 text-zinc-900 placeholder:text-neutral-500 h-10" />
      <Input maxLength={30} label="Tax code (optional)" placeholder="For company invoices" className="bg-white border-gray-200 text-zinc-900 placeholder:text-neutral-500 h-10" />
    </div>
  </div>
);
