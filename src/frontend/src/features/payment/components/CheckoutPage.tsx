import React from 'react';
import { CheckoutHeader } from './CheckoutHeader';
import { BillingInfoForm } from './BillingInfoForm';
import { PaymentMethodSelection } from './PaymentMethodSelection';
import { OrderSummary } from './OrderSummary';

const CheckoutPage: React.FC = () => (
  <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center">
    <CheckoutHeader />
    <div className="w-full max-w-[1340px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 w-full flex flex-col gap-8">
        <BillingInfoForm />
        <PaymentMethodSelection />
      </div>
      <div className="w-full lg:w-96 flex-shrink-0">
        <OrderSummary />
      </div>
    </div>
  </div>
);

export default CheckoutPage;
