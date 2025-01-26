import React, { useState } from 'react';
import { AlertTriangle, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EmailVerificationBanner() {
  const { user, sendVerificationEmail } = useAuth();
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!user || user.emailVerified) return null;

  const handleResend = async () => {
    try {
      setSending(true);
      setError('');
      await sendVerificationEmail();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to send verification email. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-yellow-500 bg-opacity-10 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <span className="text-yellow-500">
            Please verify your email address to access all features.
          </span>
        </div>
        <div className="flex items-center gap-3">
          {error && <span className="text-red-500 text-sm">{error}</span>}
          {success && (
            <span className="text-green-500 text-sm">
              Verification email sent successfully!
            </span>
          )}
          <button
            onClick={handleResend}
            disabled={sending}
            className="flex items-center gap-2 bg-yellow-500 text-black px-3 py-1 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            <Mail className="w-4 h-4" />
            {sending ? 'Sending...' : 'Resend Email'}
          </button>
        </div>
      </div>
    </div>
  );
}