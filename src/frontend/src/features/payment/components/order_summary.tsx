import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCourseStore } from '@/stores/useCourseStore';

export const OrderSummary: React.FC = () => {
  const [discountCode, setDiscountCode] = useState('');
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { courses } = useCourseStore();

  const activeCourse = courses.find((c) => c.id === courseId || c.slug === courseId);
  const handleApply = () => alert(`Apply ${discountCode}`);

  const courseTitle = activeCourse ? activeCourse.title : "Data Structures & Algorithms Interview Prep";
  const coursePrice = activeCourse ? activeCourse.price : 118;
  const discount = activeCourse ? 0 : 8;
  const vat = parseFloat((coursePrice * 0.08).toFixed(2));
  const total = parseFloat((coursePrice - discount + vat).toFixed(2));

  const handlePayment = () => {
    const identifier = activeCourse ? activeCourse.id : 'dsa-interview-prep';
    navigate(`/payment-result?status=success&courseId=${identifier}`);
  };

  return (
    <div className="self-stretch bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
      <div className="self-stretch px-6 py-5 border-b border-gray-200 inline-flex justify-start items-center">
        <div className="text-[20px] font-bold text-[#392C7D]">Order summary</div>
      </div>
      <div className="self-stretch p-6 flex flex-col gap-4">
        {/* Course detail row */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
          <div className="w-16 h-16 bg-[#EEF2F6] rounded-xl flex-shrink-0 flex items-center justify-center border border-gray-100">
            <span className="text-[#392C7D] font-bold text-xs">LMS</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[#111827] text-sm leading-snug">{courseTitle}</div>
            <div className="text-xs text-[#374151] mt-1">{activeCourse ? activeCourse.field : "Nguyễn Thu Hà"}</div>
          </div>
          <div className="font-semibold text-[16px] text-[#111827] flex-shrink-0 pl-2">
            ${coursePrice}
          </div>
        </div>

        {/* Pricing calculations */}
        <div className="flex flex-col gap-3 py-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#374151]">Subtotal</span>
            <span className="font-medium text-[#111827]">${coursePrice}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[#374151]">Discount (SUMMER20)</span>
              <span className="font-medium text-[#FF4667]">-$${discount}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-[#374151]">VAT (8%)</span>
            <span className="font-medium text-[#111827]">${vat}</span>
          </div>
        </div>

        {/* Total block */}
        <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-1">
          <span className="text-base font-bold text-[#111827]">Total</span>
          <span className="text-[#392C7D] font-extrabold text-xl">${total}</span>
        </div>

        {/* Promo code input row */}
        <div className="flex gap-2 items-center">
          <Input 
            value={discountCode} 
            onChange={e => setDiscountCode(e.target.value)} 
            placeholder="Discount code" 
            className="flex-1 bg-white border-gray-200 text-[#111827] placeholder:text-[#6B7280] h-10" 
          />
          <Button 
            size="md" 
            variant="primary" 
            onClick={handleApply} 
            className="h-10 px-4 bg-[#392C7D] hover:opacity-90 text-white rounded-xl font-semibold text-sm flex-shrink-0"
          >
            Apply
          </Button>
        </div>

        {/* Submit payment CTA */}
        <Button 
          size="lg" 
          variant="primary" 
          onClick={handlePayment}
          className="w-full bg-[#FF4667] hover:bg-[#e03d5b] text-white h-12 rounded-xl font-bold text-sm tracking-wide transition-colors cursor-pointer"
        >
          Pay with PayOS
        </Button>

        {/* Disclaimer footer */}
        <div className="text-center text-xs text-[#6B7280] leading-relaxed">
          By paying you agree to the Terms and the 7‑day refund policy.
        </div>
      </div>
    </div>
  );
};
