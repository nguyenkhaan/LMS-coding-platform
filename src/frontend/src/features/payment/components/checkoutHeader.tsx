import React from 'react';

interface CheckoutHeaderProps {
  title?: string;
}

export const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({ title = 'Checkout' }) => {
  return (
    <div className="w-full border-b border-gray-200 bg-white flex justify-center">
      <div className="w-full max-w-[1296px] px-6 py-6 flex items-center justify-between">
        <h1 className="text-[36px] font-extrabold text-[#392C7D] leading-none">{title}</h1>
      </div>
    </div>
  );
};
