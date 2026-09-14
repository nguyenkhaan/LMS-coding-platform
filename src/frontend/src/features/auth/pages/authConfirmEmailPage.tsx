import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { authApiServices } from '@/services/api/client';

export const ConfirmEmailPage: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'missing'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Extract token from URL query string (?token=...) or hash fragment (#token=...)
    const getTokenFromUrl = (): string | null => {
      const queryToken = searchParams.get('token');
      if (queryToken) return queryToken;

      if (location.hash) {
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const hashToken = hashParams.get('token');
        if (hashToken) return hashToken;
      }

      return null;
    };

    const token = getTokenFromUrl();

    if (!token) {
      setStatus('missing');
      setMessage('Invalid verification link. No confirmation token found in the URL.');
      return;
    }

    let isMounted = true;

    const confirmEmail = async () => {
      try {
        const res = await authApiServices.confirmEmailChange(token);
        if (isMounted) {
          setStatus('success');
          setMessage(res.message || 'Your email address has been updated successfully.');
          toast.success('Email address updated successfully!');
        }
      } catch (err: unknown) {
        if (isMounted) {
          setStatus('error');
          let errorMsg = 'Unable to confirm email change. Please request a new verification link.';
          if (err && typeof err === 'object' && 'response' in err) {
            const httpStatus = (err as { response?: { status?: number } }).response?.status;
            if (httpStatus === 400) {
              errorMsg = 'This email verification link is invalid or has expired.';
            } else if (httpStatus === 409) {
              errorMsg = 'This email address is already in use by another account.';
            } else if (httpStatus === 422) {
              errorMsg = 'The verification token format is invalid.';
            }
          }
          setMessage(errorMsg);
          toast.error(errorMsg);
        }
      }
    };

    confirmEmail();

    return () => {
      isMounted = false;
    };
  }, [location.hash, searchParams]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-neutral-900">Verifying Email Change</h1>
          <p className="text-sm text-neutral-500">Please wait while we confirm your new email address...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-6 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Email Changed Successfully</h1>
          <p className="text-sm text-neutral-600 leading-relaxed max-w-sm">
            {message}
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full mt-2">
          <Link
            to="/login"
            className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Sign In to Your Account</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-6 text-center">
      <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Verification Failed</h1>
        <p className="text-sm text-rose-600 leading-relaxed max-w-sm bg-rose-50 p-3 rounded-xl border border-rose-200">
          {message}
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full mt-2">
        <Link
          to="/login"
          className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
