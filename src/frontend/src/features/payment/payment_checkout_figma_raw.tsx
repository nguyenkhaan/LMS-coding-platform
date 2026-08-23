import React, { useState } from 'react';
import { toast } from 'sonner';

export const PaymentCheckoutFigmaRaw: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<'vietqr' | 'bank' | 'card'>('vietqr');

  const handleSelect = (method: 'vietqr' | 'bank' | 'card') => {
    if (method !== 'vietqr') {
      toast.error("Only VietQR / PayOS QR is supported by the backend.");
      return;
    }
    setSelectedMethod(method);
  };

  return (
    <div className="w-[1600px] h-[1915px] relative bg-white overflow-hidden">
      <div className="w-[1600px] left-0 top-[1506px] absolute bg-indigo-900 border-t border-neutral-200 inline-flex flex-col justify-start items-start">
    <div className="w-[1600px] flex flex-col justify-center items-center">
      <div className="self-stretch px-80 py-12 relative bg-white flex flex-col justify-start items-center gap-2.5 overflow-hidden">
        <div className="w-[1296px] inline-flex justify-start items-start gap-24">
          <div className="self-stretch inline-flex flex-col justify-start items-start gap-5">
            <img className="w-44 h-11" src="https://placehold.co/182x42" />
            <div className="w-80 h-24 justify-start text-neutral-500 text-base font-normal leading-6">Platform designed to help organizations, educators, and learners manage, deliver, and track learning and training activities.</div>
            <div className="self-stretch inline-flex justify-start items-start gap-6">
              <div className="flex-1 flex justify-start items-center gap-4">
                <div className="w-36 h-10 relative bg-neutral-700 rounded-lg overflow-hidden">
                  <div className="w-5 h-6 left-[17.23px] top-[7.37px] absolute bg-white" />
                  <div className="w-20 h-4 left-[46.05px] top-[18.64px] absolute bg-white" />
                  <div className="w-20 h-1.5 left-[47.28px] top-[7.70px] absolute bg-white" />
                </div>
                <div className="w-36 h-10 relative bg-neutral-700 rounded-lg overflow-hidden">
                  <div className="w-9 h-1.5 left-[46.55px] top-[8.76px] absolute bg-white" />
                  <div className="w-20 h-4 left-[46.27px] top-[17.91px] absolute bg-white" />
                  <div className="w-3 h-6 left-[17.23px] top-[9.30px] absolute bg-linear-153 from-sky-500 via-sky-500 via 1% to-cyan-400" />
                  <div className="w-2.5 h-2 left-[29.05px] top-[16.72px] absolute bg-gradient-to-l from-yellow-400 via-yellow-500 via 41% to-amber-500" />
                  <div className="w-4 h-3 left-[17.66px] top-[20.56px] absolute bg-linear-128 from-red-500 to-pink-700" />
                  <div className="w-4 h-3 left-[17.66px] top-[9.01px] absolute bg-linear-52 from-green-500 via-green-500 via 7% to-emerald-500" />
                </div>
              </div>
            </div>
          </div>
          <div className="h-56 inline-flex flex-col justify-center items-start gap-3.5">
            <div className="justify-start text-zinc-900 text-xl font-bold leading-8">For Instructor</div>
            <div className="w-32 flex-1 justify-start text-neutral-500 text-base font-normal leading-8">Search Mentors
            <br/>Login
            <br/>Register
            <br/>Booking
            <br/>Students Dashboard</div>
          </div>
          <div className="size- inline-flex flex-col justify-center items-start gap-3.5">
            <div className="justify-start text-zinc-900 text-xl font-bold leading-8">For Student</div>
            <div className="justify-start text-neutral-500 text-base font-normal leading-10">Appointments
            <br/>Chat
            <br/>Login
            <br/>Register
            <br/>Instructor Dashboard</div>
          </div>
          <div className="flex-1 h-60 inline-flex flex-col justify-start items-start gap-6">
            <div className="self-stretch flex flex-col justify-center items-start gap-4">
              <div className="justify-start text-zinc-900 text-xl font-bold leading-8">Newsletter</div>
              <div className="self-stretch h-10 pl-4 pr-1.5 py-1.5 bg-white rounded-[45px] outline outline-1 outline-offset-[-1px] outline-neutral-200 inline-flex justify-start items-center gap-3.5">
                <div className="flex-1 h-7 justify-center text-zinc-400 text-sm font-normal leading-6">Enter your email address</div>
                <div data-colour="Primary" data-icon="Left" data-size="Small" data-state="Fill" className="size- px-2 py-1.5 bg-indigo-900 rounded-[40px] flex justify-center items-center gap-1">
                  <div className="size-2 relative">
                    <div className="size-1.5 left-[1.04px] top-[1.04px] absolute outline outline-1 outline-offset-[-0.50px] outline-white" />
                    <div className="w-[1.19px] h-[1.20px] left-[3.37px] top-[3.35px] absolute outline outline-1 outline-offset-[-0.50px] outline-white" />
                    <div className="size-2 left-0 top-0 absolute opacity-0" />
                  </div>
                  <div className="text-center justify-start text-white text-xs font-medium leading-4">Subscribe</div>
                </div>
              </div>
            </div>
            <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-4">
              <div className="size- inline-flex justify-start items-center gap-2">
                <div className="size-6 relative">
                  <div className="w-4 h-5 left-[3.12px] top-[1.75px] absolute opacity-40 bg-indigo-900" />
                  <div className="size-1.5 left-[8.85px] top-[7.16px] absolute bg-indigo-900" />
                  <div className="size-6 left-0 top-0 absolute opacity-0" />
                </div>
                <div className="justify-start text-neutral-500 text-base font-normal leading-6">3556 Beech Street, San Francisco, <br/>California, CA 94108</div>
              </div>
              <div className="size- inline-flex justify-center items-center gap-2">
                <div className="size-6 relative">
                  <div className="size-1.5 left-[17.25px] top-[1.25px] absolute bg-rose-500" />
                  <div className="size-5 left-[2px] top-[2px] absolute opacity-40 bg-rose-500" />
                  <div className="size-0.5 left-[11px] top-[10px] absolute bg-rose-500" />
                  <div className="size-0.5 left-[15px] top-[10px] absolute bg-rose-500" />
                  <div className="size-0.5 left-[7px] top-[10px] absolute bg-rose-500" />
                  <div className="size-6 left-0 top-0 absolute opacity-0" />
                </div>
                <div className="justify-start text-neutral-500 text-base font-normal leading-6">dreamslms@example.com</div>
              </div>
              <div className="size- inline-flex justify-center items-center gap-2">
                <div className="size-6 relative">
                  <div className="size-[5.15px] left-[13.25px] top-[5.60px] absolute bg-orange-400" />
                  <div className="size-2 left-[13.26px] top-[2px] absolute bg-orange-400" />
                  <div className="w-2.5 h-4 left-[2px] top-[2px] absolute opacity-40 bg-orange-400" />
                  <div className="w-3 h-2 left-[9.60px] top-[14.04px] absolute bg-orange-400" />
                  <div className="size-6 left-0 top-0 absolute opacity-0" />
                </div>
                <div className="justify-start text-neutral-500 text-base font-normal leading-6">+19 123-456-7890</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="w-[1600px] px-80 py-1 bg-indigo-900 flex flex-col justify-center items-center gap-2.5 overflow-hidden">
      <div className="w-[1296px] inline-flex justify-start items-center gap-[717px]">
        <div className="flex-1 p-2.5 flex justify-start items-center gap-2.5">
          <div className="justify-start text-white text-base font-normal leading-6">© 2025 DreamsLMS. All rights reserved.</div>
        </div>
        <div className="size- flex justify-start items-center gap-3.5">
          <div className="justify-start text-white text-base font-normal leading-6">Terms &amp; Conditions</div>
          <div className="w-3 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-white"></div>
          <div className="justify-start text-white text-base font-normal leading-6">Privacy Policy</div>
        </div>
      </div>
    </div>
  </div>
  <div className="w-[1600px] px-2.5 py-10 left-0 top-[106px] absolute inline-flex flex-col justify-center items-center gap-2.5">
    <div className="w-[1600px] h-40 left-0 top-0 absolute bg-gradient-to-r from-red-100 via-sky-100 to-blue-100" />
    <div className="size- flex flex-col justify-start items-center">
      <div className="justify-start text-zinc-900 text-4xl font-bold leading-[56px]">CheckOut</div>
    </div>
  </div>
  <div data-property-1="Before Sign in" className="w-[1600px] left-0 top-0 absolute inline-flex flex-col justify-start items-start">
    <div className="self-stretch px-[470px] py-2 bg-gray-900 inline-flex justify-center items-center gap-2">
      <div className="w-[1296px] flex justify-center items-center gap-4">
        <div className="flex-1 flex justify-start items-center gap-4">
          <div className="size- flex justify-start items-center gap-2">
            <div className="size-3.5 relative">
              <div className="w-2.5 h-3 left-[1.82px] top-[1.02px] absolute bg-neutral-500" />
              <div className="size-3.5 left-0 top-0 absolute opacity-0" />
              <div className="size-3.5 left-[14px] top-[14px] absolute origin-top-left -rotate-180 opacity-0" />
            </div>
            <div className="justify-start text-white text-sm font-medium leading-6">1442 Crosswind Drive Madisonville</div>
          </div>
          <div className="size- flex justify-start items-center gap-2">
            <div className="size-3.5 relative">
              <div className="size-[3px] left-[7.73px] top-[3.27px] absolute bg-neutral-500" />
              <div className="size-[5.10px] left-[7.73px] top-[1.17px] absolute bg-neutral-500" />
              <div className="w-1.5 h-2 left-[1.17px] top-[1.17px] absolute bg-neutral-500" />
              <div className="w-2 h-1 left-[5.60px] top-[8.19px] absolute bg-neutral-500" />
              <div className="size-3.5 left-[14px] top-[14px] absolute origin-top-left -rotate-180 opacity-0" />
            </div>
            <div className="justify-start text-white text-sm font-medium leading-6">+1 45887 77874</div>
          </div>
        </div>
        <div className="size- flex justify-start items-center gap-6">
          <div className="size- flex justify-start items-center gap-4">
            <div className="size- flex justify-start items-center gap-0.5">
              <div className="size-3.5 bg-zinc-300 rounded-full" />
              <img className="size-5" src="https://placehold.co/20x20" />
              <div className="justify-start text-white text-sm font-normal leading-6">ENG</div>
              <div className="size-3.5 relative">
                <div className="w-2.5 h-1 left-[2.38px] top-[5.22px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-neutral-200" />
                <div className="size-3.5 left-[14px] top-[14px] absolute origin-top-left -rotate-180 opacity-0" />
              </div>
            </div>
            <div className="size- flex justify-start items-center gap-0.5">
              <div className="justify-start text-white text-sm font-normal leading-6">USD</div>
              <div className="size-3.5 relative">
                <div className="w-2.5 h-1 left-[2.38px] top-[5.22px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-neutral-200" />
                <div className="size-3.5 left-[14px] top-[14px] absolute origin-top-left -rotate-180 opacity-0" />
              </div>
            </div>
          </div>
          <div className="size- flex justify-start items-center gap-2">
            <div className="size-3.5 bg-neutral-200" />
            <div className="w-1.5 h-2.5 bg-gray-900" />
            <div className="size-3.5 bg-neutral-200" />
            <div className="size-2 bg-gray-900" />
            <div className="size-1 bg-gray-900" />
            <div className="size-px bg-gray-900" />
            <div className="size-3.5 bg-neutral-200" />
            <div className="size-2 bg-gray-900" />
            <div className="size-3.5 bg-neutral-200" />
            <div className="w-2 h-1.5 bg-gray-900" />
            <div className="size-3.5 bg-neutral-200" />
            <div className="w-0.5 h-2 bg-gray-900" />
            <div className="w-[5.14px] h-1.5 bg-gray-900" />
          </div>
        </div>
      </div>
    </div>
    <div className="self-stretch px-36 py-3.5 bg-white outline outline-1 outline-offset-[-1px] outline-slate-100 flex flex-col justify-center items-center gap-2">
      <div className="w-[1296px] inline-flex justify-between items-center">
        <div className="w-40 h-9 bg-indigo-900" />
        <div className="size- flex justify-start items-center gap-7">
          <div className="size- flex justify-center items-center gap-1">
            <div className="justify-start text-zinc-900 text-sm font-medium leading-6">Home</div>
            <div className="size-4 relative overflow-hidden">
              <div className="w-2 h-[4.75px] left-[4.20px] top-[6.20px] absolute bg-neutral-500" />
            </div>
          </div>
          <div className="size- flex justify-center items-center gap-1">
            <div className="justify-start text-zinc-900 text-sm font-medium leading-6">Courses</div>
            <div className="size-4 relative overflow-hidden">
              <div className="w-2 h-[4.75px] left-[4.20px] top-[6.20px] absolute bg-neutral-500" />
            </div>
          </div>
          <div className="size- flex justify-center items-center gap-1">
            <div className="justify-start text-zinc-900 text-sm font-medium leading-6">Instructors</div>
            <div className="size-4 relative overflow-hidden">
              <div className="w-2 h-[4.75px] left-[4.20px] top-[6.20px] absolute bg-neutral-500" />
            </div>
          </div>
          <div className="size- flex justify-center items-center gap-1">
            <div className="justify-start text-zinc-900 text-sm font-medium leading-6">Pages</div>
            <div className="size-4 relative overflow-hidden">
              <div className="w-2 h-[4.75px] left-[4.20px] top-[6.20px] absolute bg-neutral-500" />
            </div>
          </div>
          <div className="size- flex justify-center items-center gap-1">
            <div className="justify-start text-zinc-900 text-sm font-medium leading-6">Blog</div>
            <div className="size-4 relative overflow-hidden">
              <div className="w-2 h-[4.75px] left-[4.20px] top-[6.20px] absolute bg-neutral-500" />
            </div>
          </div>
          <div className="w-20 flex justify-center items-center gap-2.5">
            <div className="flex-1 justify-start text-zinc-900 text-sm font-medium leading-6">Contact us</div>
          </div>
        </div>
        <div className="size- flex justify-start items-center gap-6">
          <div className="size- flex justify-start items-center gap-3">
            <div className="size- p-2.5 rounded-[40px] outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-2.5">
              <div className="size-4 relative">
                <div className="size-2.5 left-[3.33px] top-[3.33px] absolute bg-gray-800" />
                <div className="size-3.5 left-[0.67px] top-[0.67px] absolute bg-gray-800" />
                <div className="size-4 left-[16px] top-[16px] absolute origin-top-left -rotate-180 opacity-0" />
              </div>
            </div>
            <div className="size- p-2.5 relative rounded-[40px] outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-2.5">
              <div className="size-4 relative">
                <div className="size-4 left-0 top-0 absolute opacity-0" />
                <div className="size-0.5 left-[9.67px] top-[12.67px] absolute bg-gray-800" />
                <div className="size-0.5 left-[4.33px] top-[12.67px] absolute bg-gray-800" />
                <div className="w-3.5 h-1 left-[0.83px] top-[0.83px] absolute bg-gray-800" />
                <div className="w-3 h-1.5 left-[2.67px] top-[5.83px] absolute bg-gray-800" />
              </div>
              <div className="w-3.5 px-1 left-[23px] top-[-3px] absolute bg-green-500 rounded-[50px] inline-flex flex-col justify-center items-center gap-2.5">
                <div className="self-stretch text-center justify-start text-white text-[10px] font-bold leading-4">1</div>
              </div>
            </div>
          </div>
          <div className="size- flex justify-start items-center gap-3">
            <div className="size- px-4 py-1.5 bg-neutral-200 rounded-[40px] flex justify-center items-center gap-2">
              <div className="size-3 relative">
                <div className="size-3 left-0 top-0 absolute opacity-0 bg-zinc-900" />
                <div className="w-[2.44px] h-[1.55px] left-[5.28px] top-[4.20px] absolute bg-gray-800" />
                <div className="size-[1.19px] left-[5.90px] top-[6.99px] absolute bg-gray-800" />
                <div className="size-2.5 left-[1.08px] top-[1.08px] absolute bg-gray-800" />
              </div>
              <div className="text-center justify-start text-zinc-900 text-sm font-medium font-['Archivo'] leading-6">Sign In</div>
            </div>
            <div data-colour="Secondary" data-icon="Left" data-size="Medium" data-state="Fill" className="size- px-4 py-1.5 bg-rose-500 rounded-[40px] flex justify-center items-center gap-2">
              <div className="size-2.5 relative">
                <div className="size-2.5 left-0 top-0 absolute opacity-0 border border-white" />
                <div className="size-1 left-[2.92px] top-[0.83px] absolute bg-white" />
                <div className="w-2 h-[3.33px] left-[1.21px] top-[5.83px] absolute bg-white" />
              </div>
              <div className="text-center justify-start text-white text-sm font-medium leading-6">Register</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="w-[1176.49px] max-w-[1176.49px] left-[178px] top-[397px] absolute inline-flex justify-start items-start gap-7">
    <div className="flex-1 inline-flex flex-col justify-start items-start gap-7">
      <div className="self-stretch bg-sidebar rounded-2xl shadow-[0px_9.191304206848145px_27.57391357421875px_0px_rgba(17,28,64,0.06)] shadow-[0px_1.148913025856018px_2.297826051712036px_0px_rgba(17,28,64,0.06)] outline outline-1 outline-offset-[-1.15px] outline-input flex flex-col justify-start items-start">
        <div className="self-stretch px-6 py-5 border-b-1 border-input inline-flex justify-start items-center flex-wrap content-center">
          <div className="size- inline-flex flex-col justify-start items-start">
            <div className="justify-center text-popover-foreground text-lg font-semibold font-['Plus_Jakarta_Sans'] leading-7">Billing information</div>
          </div>
        </div>
        <div className="self-stretch h-52 p-6 inline-flex flex-col justify-start items-start">
          <div className="self-stretch pt-1.5 inline-flex flex-col justify-start items-start gap-1.5">
            <div className="justify-center text-popover-foreground text-base font-medium font-['Plus_Jakarta_Sans'] leading-4">Full name</div>
            <div className="self-stretch h-10 px-3.5 py-2.5 bg-color-white--0_2% rounded-xl shadow-[0px_1.148913025856018px_2.297826051712036px_-1.148913025856018px_rgba(0,0,0,0.10)] shadow-[0px_1.148913025856018px_3.4467391967773438px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1.15px] outline-input inline-flex justify-start items-start overflow-hidden">
              <div className="self-stretch pr-60 inline-flex flex-col justify-start items-start overflow-hidden">
                <div className="justify-center text-popover-foreground text-base font-normal font-['Plus_Jakarta_Sans']">Trần Minh</div>
              </div>
            </div>
          </div>
          <div className="self-stretch pt-1.5 inline-flex flex-col justify-start items-start gap-1.5">
            <div className="justify-center text-popover-foreground text-base font-medium font-['Plus_Jakarta_Sans'] leading-4">Email</div>
            <div className="self-stretch h-10 px-3.5 py-2.5 bg-color-white--0_2% rounded-xl shadow-[0px_1.148913025856018px_2.297826051712036px_-1.148913025856018px_rgba(0,0,0,0.10)] shadow-[0px_1.148913025856018px_3.4467391967773438px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1.15px] outline-input inline-flex justify-start items-start overflow-hidden">
              <div className="self-stretch pr-28 inline-flex flex-col justify-start items-start overflow-hidden">
                <div className="justify-center text-popover-foreground text-base font-normal font-['Plus_Jakarta_Sans']">minh.tran@example.com</div>
              </div>
            </div>
          </div>
          <div className="self-stretch pt-1.5 inline-flex flex-col justify-start items-start gap-1.5">
            <div className="justify-center text-popover-foreground text-base font-medium font-['Plus_Jakarta_Sans'] leading-4">Phone number</div>
            <div className="self-stretch h-10 px-3.5 py-2.5 bg-color-white--0_2% rounded-xl shadow-[0px_1.148913025856018px_2.297826051712036px_-1.148913025856018px_rgba(0,0,0,0.10)] shadow-[0px_1.148913025856018px_3.4467391967773438px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1.15px] outline-input inline-flex justify-start items-start overflow-hidden">
              <div className="self-stretch pr-44 inline-flex flex-col justify-start items-start overflow-hidden">
                <div className="justify-center text-popover-foreground text-base font-normal font-['Plus_Jakarta_Sans']">+84 912 345 678</div>
              </div>
            </div>
          </div>
          <div className="self-stretch pt-1.5 inline-flex flex-col justify-start items-start gap-1.5">
            <div className="justify-center text-popover-foreground text-base font-medium font-['Plus_Jakarta_Sans'] leading-4">Tax code (optional)</div>
            <div className="self-stretch h-10 relative bg-color-white--0_2% rounded-xl shadow-[0px_1.148913025856018px_2.297826051712036px_-1.148913025856018px_rgba(0,0,0,0.10)] shadow-[0px_1.148913025856018px_3.4467391967773438px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1.15px] outline-input overflow-hidden">
              <div className="h-5 pr-36 left-[14.94px] top-[10.34px] absolute inline-flex flex-col justify-start items-start overflow-hidden">
                <div className="justify-center text-muted-foreground text-base font-normal font-['Plus_Jakarta_Sans']">For company invoices</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch bg-sidebar rounded-2xl shadow-[0px_9.191304206848145px_27.57391357421875px_0px_rgba(17,28,64,0.06)] shadow-[0px_1.148913025856018px_2.297826051712036px_0px_rgba(17,28,64,0.06)] outline outline-1 outline-offset-[-1.15px] outline-input flex flex-col justify-start items-start">
        <div className="self-stretch px-6 py-5 border-b-1 border-input inline-flex justify-between items-center flex-wrap content-center">
          <div className="size- inline-flex flex-col justify-start items-start gap-0.5">
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="justify-center text-popover-foreground text-lg font-semibold font-['Plus_Jakarta_Sans'] leading-7">Payment method</div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="justify-center text-muted-foreground text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">Processed securely by PayOS</div>
            </div>
          </div>
          <div className="size- flex justify-start items-center gap-1.5">
            <div data-variant="13" className="size-5 relative overflow-hidden">
              <div className="w-3 h-4 left-[3.06px] top-[1.53px] absolute outline outline-[1.53px] outline-offset-[-0.77px] outline-chart-3" />
              <div className="w-1 h-[3.06px] left-[6.89px] top-[7.66px] absolute outline outline-[1.53px] outline-offset-[-0.77px] outline-chart-3" />
            </div>
            <div className="justify-center text-chart-3 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">PCI-DSS</div>
          </div>
        </div>
        <div className="self-stretch p-6 flex flex-col justify-start items-start gap-6">
          <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
            <div className="self-stretch pb-3.5 flex flex-col justify-start items-start">
              <div 
                onClick={() => handleSelect('vietqr')}
                className={`self-stretch p-5 rounded-xl outline outline-1 outline-offset-[-1.15px] inline-flex justify-start items-center gap-5 cursor-pointer transition-all ${
                  selectedMethod === 'vietqr' ? 'bg-sidebar-accent outline-sidebar-primary' : 'bg-sidebar outline-input'
                }`}
              >
                <div className="size-5 relative rounded-full outline outline-1 outline-offset-[-1.15px] outline-sidebar-primary inline-flex flex-col justify-start items-start">
                  <div className="size-5 left-0 top-0 absolute bg-color-white--0_2% rounded-full shadow-[0px_1.148913025856018px_2.297826051712036px_-1.148913025856018px_rgba(0,0,0,0.10)] shadow-[0px_1.148913025856018px_3.4467391967773438px_0px_rgba(0,0,0,0.10)]" />
                  <div className="self-stretch inline-flex justify-center items-center">
                    <div data-variant="14" className="size-4 relative overflow-hidden">
                      <div className="size-3.5 left-[1.34px] top-[1.34px] absolute bg-sidebar-primary outline outline-[1.34px] outline-offset-[-0.67px] outline-sidebar-primary" />
                    </div>
                  </div>
                </div>
                <div data-variant="15" className="size-6 relative overflow-hidden">
                  <div className="size-[4.79px] left-[2.87px] top-[2.87px] absolute outline outline-2 outline-offset-[-0.96px] outline-sidebar-primary" />
                  <div className="size-[4.79px] left-[15.32px] top-[2.87px] absolute outline outline-2 outline-offset-[-0.96px] outline-sidebar-primary" />
                  <div className="size-[4.79px] left-[2.87px] top-[15.32px] absolute outline outline-2 outline-offset-[-0.96px] outline-sidebar-primary" />
                  <div className="size-[4.79px] left-[15.32px] top-[15.32px] absolute outline outline-2 outline-offset-[-0.96px] outline-sidebar-primary" />
                  <div className="w-0 h-[0.01px] left-[20.11px] top-[20.11px] absolute outline outline-2 outline-offset-[-0.96px] outline-sidebar-primary" />
                  <div className="size-[4.79px] left-[6.70px] top-[6.70px] absolute outline outline-2 outline-offset-[-0.96px] outline-sidebar-primary" />
                  <div className="w-[0.01px] h-0 left-[2.87px] top-[11.49px] absolute outline outline-2 outline-offset-[-0.96px] outline-sidebar-primary" />
                  <div className="w-[0.01px] h-0 left-[11.49px] top-[2.87px] absolute outline outline-2 outline-offset-[-0.96px] outline-sidebar-primary" />
                  <div className="w-0 h-[0.01px] left-[11.49px] top-[15.32px] absolute outline outline-2 outline-offset-[-0.96px] outline-sidebar-primary" />
                  <div className="w-px h-0 left-[15.32px] top-[11.49px] absolute outline outline-2 outline-offset-[-0.96px] outline-sidebar-primary" />
                  <div className="w-0 h-[0.01px] left-[20.11px] top-[11.49px] absolute outline outline-2 outline-offset-[-0.96px] outline-sidebar-primary" />
                  <div className="w-0 h-px left-[11.49px] top-[19.15px] absolute outline outline-2 outline-offset-[-0.96px] outline-sidebar-primary" />
                </div>
                <div className="size- inline-flex flex-col justify-start items-start">
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="justify-center text-popover-foreground text-base font-semibold font-['Plus_Jakarta_Sans'] leading-6">VietQR / PayOS QR</div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="justify-center text-muted-foreground text-sm font-medium font-['Plus_Jakarta_Sans'] leading-5">Scan with any Vietnamese banking app</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch pb-3.5 flex flex-col justify-start items-start">
              <div 
                onClick={() => handleSelect('bank')}
                className="self-stretch pl-4 pr-96 py-5 rounded-xl outline outline-1 outline-offset-[-1.15px] outline-input inline-flex justify-start items-center gap-4 cursor-not-allowed opacity-60 bg-slate-50/50"
              >
                <div className="size-5 rounded-full outline outline-1 outline-offset-[-1.15px] outline-sidebar-primary inline-flex flex-col justify-center items-start">
                  <div className="size-5 bg-color-white--0_2% rounded-full shadow-[0px_1.148913025856018px_2.297826051712036px_-1.148913025856018px_rgba(0,0,0,0.10)] shadow-[0px_1.148913025856018px_3.4467391967773438px_0px_rgba(0,0,0,0.10)]" />
                </div>
                <div data-variant="16" className="size-6 relative overflow-hidden">
                  <div className="w-0 h-2 left-[10.05px] top-[11.06px] absolute outline outline-2 outline-offset-[-1.01px] outline-sidebar-primary" />
                  <div className="w-5 h-[5.03px] left-[2.99px] top-[2.01px] absolute outline outline-2 outline-offset-[-1.01px] outline-sidebar-primary" />
                  <div className="w-0 h-2 left-[14.07px] top-[11.06px] absolute outline outline-2 outline-offset-[-1.01px] outline-sidebar-primary" />
                  <div className="w-0 h-2 left-[18.10px] top-[11.06px] absolute outline outline-2 outline-offset-[-1.01px] outline-sidebar-primary" />
                  <div className="w-5 h-0 left-[3.02px] top-[22.12px] absolute outline outline-2 outline-offset-[-1.01px] outline-sidebar-primary" />
                  <div className="w-0 h-2 left-[6.03px] top-[11.06px] absolute outline outline-2 outline-offset-[-1.01px] outline-sidebar-primary" />
                </div>
                <div className="size- inline-flex flex-col justify-start items-start">
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="justify-center text-popover-foreground text-base font-semibold font-['Plus_Jakarta_Sans'] leading-6">Bank transfer</div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="justify-center text-muted-foreground text-sm font-medium font-['Plus_Jakarta_Sans'] leading-5">Auto-reconciled within 30 seconds (Unsupported)</div>
                  </div>
                </div>
              </div>
            </div>
            <div 
              onClick={() => handleSelect('card')}
              className="self-stretch pl-4 pr-96 py-5 rounded-xl outline outline-1 outline-offset-[-1.15px] outline-input inline-flex justify-start items-center gap-4 cursor-not-allowed opacity-60 bg-slate-50/50"
            >
              <div className="size-5 rounded-full outline outline-1 outline-offset-[-1.15px] outline-sidebar-primary inline-flex flex-col justify-center items-start">
                <div className="size-5 bg-color-white--0_2% rounded-full shadow-[0px_1.148913025856018px_2.297826051712036px_-1.148913025856018px_rgba(0,0,0,0.10)] shadow-[0px_1.148913025856018px_3.4467391967773438px_0px_rgba(0,0,0,0.10)]" />
              </div>
              <div data-variant="17" className="size-6 relative overflow-hidden">
                <div className="w-5 h-3.5 left-[2.01px] top-[5.03px] absolute outline outline-2 outline-offset-[-1.01px] outline-sidebar-primary" />
                <div className="w-5 h-0 left-[2.01px] top-[10.05px] absolute outline outline-2 outline-offset-[-1.01px] outline-sidebar-primary" />
              </div>
              <div className="size- inline-flex flex-col justify-start items-start">
                <div className="self-stretch flex flex-col justify-start items-start">
                  <div className="justify-center text-popover-foreground text-base font-semibold font-['Plus_Jakarta_Sans'] leading-6">Domestic &amp; international card</div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start">
                  <div className="justify-center text-muted-foreground text-sm font-medium font-['Plus_Jakarta_Sans'] leading-5">Visa, Mastercard, JCB, NAPAS (Unsupported)</div>
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch p-7 bg-muted rounded-xl outline outline-1 outline-offset-[-1.15px] outline-input flex flex-col justify-start items-center gap-3.5">
            <div className="size-44 py-9 bg-sidebar rounded-xl flex flex-col justify-start items-center">
              <div data-variant="18" className="size-28 relative overflow-hidden">
                <div className="size-6 left-[13.79px] top-[13.79px] absolute outline outline-8 outline-offset-[-4.60px] outline-sidebar-primary" />
                <div className="size-6 left-[73.53px] top-[13.79px] absolute outline outline-8 outline-offset-[-4.60px] outline-sidebar-primary" />
                <div className="size-6 left-[13.79px] top-[73.53px] absolute outline outline-8 outline-offset-[-4.60px] outline-sidebar-primary" />
                <div className="size-6 left-[73.53px] top-[73.53px] absolute outline outline-8 outline-offset-[-4.60px] outline-sidebar-primary" />
                <div className="w-0 h-[0.05px] left-[96.51px] top-[96.51px] absolute outline outline-8 outline-offset-[-4.60px] outline-sidebar-primary" />
                <div className="size-6 left-[32.17px] top-[32.17px] absolute outline outline-8 outline-offset-[-4.60px] outline-sidebar-primary" />
                <div className="w-[0.05px] h-0 left-[13.79px] top-[55.15px] absolute outline outline-8 outline-offset-[-4.60px] outline-sidebar-primary" />
                <div className="w-[0.05px] h-0 left-[55.15px] top-[13.79px] absolute outline outline-8 outline-offset-[-4.60px] outline-sidebar-primary" />
                <div className="w-0 h-[0.05px] left-[55.15px] top-[73.53px] absolute outline outline-8 outline-offset-[-4.60px] outline-sidebar-primary" />
                <div className="w-1 h-0 left-[73.53px] top-[55.15px] absolute outline outline-8 outline-offset-[-4.60px] outline-sidebar-primary" />
                <div className="w-0 h-[0.05px] left-[96.51px] top-[55.15px] absolute outline outline-8 outline-offset-[-4.60px] outline-sidebar-primary" />
                <div className="w-0 h-1 left-[55.15px] top-[91.91px] absolute outline outline-8 outline-offset-[-4.60px] outline-sidebar-primary" />
              </div>
            </div>
            <div className="text-center justify-center text-popover-foreground text-base font-semibold font-['Plus_Jakarta_Sans'] leading-6">Scan to pay 2.701.080 ₫</div>
            <div className="text-center justify-center text-muted-foreground text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">Order #CD-240804-1182 · QR expires in 14:52</div>
          </div>
        </div>
      </div>
    </div>
    <div className="w-96 p-7 bg-sidebar rounded-2xl shadow-[0px_9.191304206848145px_27.57391357421875px_0px_rgba(17,28,64,0.06)] shadow-[0px_1.148913025856018px_2.297826051712036px_0px_rgba(17,28,64,0.06)] outline outline-1 outline-offset-[-1.15px] outline-input inline-flex flex-col justify-start items-start gap-3.5">
      <div className="self-stretch flex flex-col justify-start items-start">
        <div className="self-stretch justify-center text-popover-foreground text-lg font-semibold font-['Plus_Jakarta_Sans'] leading-7">Order summary</div>
      </div>
      <div className="self-stretch pt-1 pb-2.5 flex flex-col justify-start items-start gap-5">
        <div className="self-stretch inline-flex justify-start items-start gap-3.5">
          <div className="size-16 bg-sidebar-primary rounded-xl" />
          <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start">
            <div className="self-stretch flex flex-col justify-start items-start overflow-hidden">
              <div className="self-stretch justify-center text-popover-foreground text-base font-medium font-['Plus_Jakarta_Sans'] leading-6">Data Structures &amp; Algorithms Interview Prep</div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-muted-foreground text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">Nguyễn Thu Hà</div>
            </div>
          </div>
          <div className="self-stretch inline-flex flex-col justify-start items-start">
            <div className="justify-center text-popover-foreground text-base font-semibold font-['Plus_Jakarta_Sans'] leading-6">$118</div>
          </div>
        </div>
      </div>
      <div className="self-stretch h-px bg-input" />
      <div className="self-stretch py-2.5 inline-flex justify-start items-start gap-2.5">
        <div className="flex-1 h-10 relative bg-color-white--0_2% rounded-xl shadow-[0px_1.148913025856018px_2.297826051712036px_-1.148913025856018px_rgba(0,0,0,0.10)] shadow-[0px_1.148913025856018px_3.4467391967773438px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1.15px] outline-input overflow-hidden">
          <div className="h-5 pr-24 left-[14.94px] top-[10.34px] absolute inline-flex flex-col justify-start items-start overflow-hidden">
            <div className="justify-center text-muted-foreground text-base font-normal font-['Plus_Jakarta_Sans']">Discount code</div>
          </div>
        </div>
        <div className="h-10 px-5 py-2.5 relative bg-background rounded-xl outline outline-1 outline-offset-[-1.15px] outline-input flex justify-center items-center gap-2.5">
          <div className="w-28 h-10 left-0 top-0 absolute bg-color-white--0_2% rounded-xl shadow-[0px_1.148913025856018px_2.297826051712036px_-1.148913025856018px_rgba(0,0,0,0.10)] shadow-[0px_1.148913025856018px_3.4467391967773438px_0px_rgba(0,0,0,0.10)]" />
          <div data-variant="19" className="size-5 relative overflow-hidden">
            <div className="size-4 left-[1.53px] top-[1.53px] absolute outline outline-[1.53px] outline-offset-[-0.77px] outline-popover-foreground" />
            <div className="size-[0.77px] left-[5.36px] top-[5.36px] absolute bg-popover-foreground outline outline-[1.53px] outline-offset-[-0.77px] outline-popover-foreground" />
          </div>
          <div className="text-center justify-center text-popover-foreground text-base font-medium font-['Plus_Jakarta_Sans'] leading-6">Apply</div>
        </div>
      </div>
      <div className="self-stretch h-px bg-input" />
      <div className="self-stretch py-2.5 flex flex-col justify-start items-start gap-2.5">
        <div className="self-stretch inline-flex justify-between items-start">
          <div className="self-stretch inline-flex flex-col justify-start items-start">
            <div className="justify-center text-muted-foreground text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">Subtotal</div>
          </div>
          <div className="self-stretch inline-flex flex-col justify-start items-start">
            <div className="justify-center text-popover-foreground text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">$118</div>
          </div>
        </div>
        <div className="self-stretch pt-0.5 inline-flex justify-between items-start">
          <div className="self-stretch inline-flex flex-col justify-start items-start">
            <div className="justify-center text-muted-foreground text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">Discount (SUMMER20)</div>
          </div>
          <div className="self-stretch inline-flex flex-col justify-start items-start">
            <div className="justify-center text-chart-3 text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">-$8</div>
          </div>
        </div>
        <div className="self-stretch py-0.5 inline-flex justify-between items-start">
          <div className="self-stretch inline-flex flex-col justify-start items-start">
            <div className="justify-center text-muted-foreground text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">VAT (8%)</div>
          </div>
          <div className="self-stretch inline-flex flex-col justify-start items-start">
            <div className="justify-center text-popover-foreground text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">$9.44</div>
          </div>
        </div>
        <div className="self-stretch h-px bg-input" />
        <div className="self-stretch inline-flex justify-between items-start">
          <div className="self-stretch inline-flex flex-col justify-start items-start">
            <div className="justify-center text-popover-foreground text-lg font-bold font-['Plus_Jakarta_Sans'] leading-7">Total</div>
          </div>
          <div className="self-stretch inline-flex flex-col justify-start items-start">
            <div className="justify-center text-sidebar-primary text-lg font-bold font-['Plus_Jakarta_Sans'] leading-7">$119.44</div>
          </div>
        </div>
      </div>
      <div className="self-stretch h-11 px-9 relative bg-Colors-Secondary-400 rounded-xl inline-flex justify-center items-center gap-2.5">
        <div className="w-96 h-11 left-0 top-0 absolute bg-color-white--0_2% rounded-xl shadow-[0px_1.148913025856018px_2.297826051712036px_-1.148913025856018px_rgba(0,0,0,0.10)] shadow-[0px_1.148913025856018px_3.4467391967773438px_0px_rgba(0,0,0,0.10)]" />
        <div data-variant="20" className="size-5 relative overflow-hidden">
          <div className="w-3.5 h-2 left-[2.30px] top-[8.43px] absolute outline outline-[1.53px] outline-offset-[-0.77px] outline-sidebar-primary-foreground" />
          <div className="w-2 h-1.5 left-[5.36px] top-[1.53px] absolute outline outline-[1.53px] outline-offset-[-0.77px] outline-sidebar-primary-foreground" />
        </div>
        <div className="text-center justify-center text-sidebar-primary-foreground text-base font-bold font-['Plus_Jakarta_Sans'] leading-6">Pay with PayOS</div>
      </div>
      <div className="self-stretch flex flex-col justify-start items-center">
        <div className="text-center justify-center text-muted-foreground text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">By paying you agree to the Terms and the 7-day refund<br/>policy.</div>
      </div>
    </div>
  </div>
  <div className="w-[1656px] px-6 py-5 left-0 top-[266px] absolute bg-sidebar border-b border-input inline-flex flex-col justify-start items-start">
    <div className="self-stretch inline-flex justify-start items-center flex-wrap content-center">
      <div className="size- inline-flex flex-col justify-start items-start gap-1">
        <div className="self-stretch flex flex-col justify-start items-start">
          <div className="justify-center text-popover-foreground text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-8">Checkout</div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default PaymentCheckoutFigmaRaw;