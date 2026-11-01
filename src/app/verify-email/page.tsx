'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { verifyEmail, resendVerification } from '@/lib/api-client';
import { saveAuthSession } from '@/lib/auth';
import { AuthSession, VerifyEmailRequest } from '@/types/auth';
import PosPinModal from '@/components/auth/PosPinModal';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>('');
  const [verificationId, setVerificationId] = useState<string>('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [verifiedSession, setVerifiedSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [infoMessage, setInfoMessage] = useState<string>('');
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Retrieve email and verificationId from searchParams or sessionStorage
  useEffect(() => {
    const qEmail = searchParams?.get('email');
    const qVId = searchParams?.get('verificationId');

    const sEmail = typeof window !== 'undefined' ? sessionStorage.getItem('nurapos_signup_email') : null;
    const sVId = typeof window !== 'undefined' ? sessionStorage.getItem('nurapos_verification_id') : null;

    const resolvedEmail = qEmail || sEmail || 'your email';
    setEmail(resolvedEmail);
    if (qVId || sVId) {
      setVerificationId(qVId || sVId || '');
    }
  }, [searchParams]);

  // 30 second countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (errorMessage) setErrorMessage('');

    // Auto focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (timeLeft > 0 || isResending) return;

    if (!email || email === 'your email') {
      setErrorMessage('Please return to signup and provide a valid email.');
      return;
    }

    setIsResending(true);
    setErrorMessage('');
    setInfoMessage('');

    try {
      await resendVerification(email);
      setTimeLeft(30);
      setOtp(['', '', '', '']);
      setInfoMessage(`A fresh verification code has been sent to ${email}`);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to resend code. Please try again shortly.');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 4) {
      setErrorMessage('Please enter the full 4-digit code.');
      return;
    }

    setErrorMessage('');
    setInfoMessage('');
    setIsLoading(true);

    try {
      const payload: VerifyEmailRequest = {
        email,
        code,
      };
      if (verificationId) {
        payload.verificationId = verificationId;
      }

      // POST /api/auth/verify-email
      const res = await verifyEmail(payload);

      // Save JWT session to localStorage & cookies
      if (res.data?.session) {
        saveAuthSession(res.data.session);
        setVerifiedSession(res.data.session);
      }

      setIsVerified(true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Verification failed. Please check the code.');
    } finally {
      setIsLoading(false);
    }
  };

  const unsplashImageUrl = 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1200&auto=format&fit=crop';

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      height: '100vh',
      maxHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
      boxSizing: 'border-box',
    }}>
      {/* Top Header with "Need help" */}
      <header style={{
        height: '56px',
        padding: '0 2.5rem',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <Link
          href="#help"
          onClick={(e) => {
            e.preventDefault();
            alert('Nuradesk Support: support@nuradesk.com');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '15px',
            fontWeight: 600,
            color: '#000000',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          <HelpOutlineRoundedIcon sx={{ fontSize: 18 }} />
          <span>Need help</span>
        </Link>
      </header>

      {/* Main Split Layout */}
      <main style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 2.5rem 1.5rem 2.5rem',
        boxSizing: 'border-box',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1150px',
          height: '100%',
          maxHeight: 'calc(100vh - 72px)',
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 1.15fr) minmax(320px, 1fr)',
          gap: 'clamp(1.5rem, 3.5vw, 4rem)',
          alignItems: 'center',
        }}>
          {/* Left Column: Unsplash Image */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            maxHeight: 'calc(100vh - 88px)',
            borderRadius: '1.5rem',
            overflow: 'hidden',
            backgroundColor: '#F5F5F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={unsplashImageUrl}
              alt="Nuradesk POS Terminal"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                borderRadius: '1.5rem',
              }}
            />
          </div>

          {/* Right Column: Verification Form */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: '430px',
            width: '100%',
            margin: '0 auto',
          }}>
            {/* Brand Header: Logo + Nuradesk */}
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
                marginBottom: '1rem',
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                position: 'relative',
                borderRadius: '9999px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Image
                  src="/logo.png"
                  alt="Nuradesk Logo"
                  width={42}
                  height={42}
                  priority
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span style={{
                fontSize: '26px',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                color: '#000000',
              }}>
                Nuradesk
              </span>
            </Link>

            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(28px, 2.5vw, 34px)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.15,
              color: '#000000',
              marginBottom: '8px',
            }}>
              Verify your email
            </h1>

            {/* Subtitle with dynamic email */}
            <p style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#000000',
              marginBottom: '20px',
              lineHeight: 1.5,
              letterSpacing: '-0.01em',
            }}>
              We&apos;ve sent a verification code to{' '}
              <strong style={{ fontWeight: 800, wordBreak: 'break-all' }}>
                {email || 'your email'}
              </strong>
            </p>

            {/* Error Message */}
            {errorMessage && (
              <div style={{
                marginBottom: '14px',
                padding: '0.55rem 0.75rem',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: '0.75rem',
                color: '#B91C1C',
                fontSize: '0.82rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 18, flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Info / Resent Message */}
            {infoMessage && (
              <div style={{
                marginBottom: '14px',
                padding: '0.55rem 0.75rem',
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '0.75rem',
                color: '#15803D',
                fontSize: '0.82rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}>
                <CheckCircleRoundedIcon sx={{ fontSize: 18, flexShrink: 0 }} />
                <span>{infoMessage}</span>
              </div>
            )}

            {isVerified ? (
              <div style={{
                backgroundColor: '#FAFAFA',
                border: '1px solid #E5E7EB',
                borderRadius: '1.25rem',
                padding: '1.75rem',
                textAlign: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#ECFDF5',
                  border: '2px solid #A7F3D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 32, color: '#10B981' }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem', color: '#000000' }}>
                  Email Verified!
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#4B5563', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  Your register account is active and verified. JWT authentication tokens have been securely saved.
                </p>

                {/* Session details summary */}
                {verifiedSession && (
                  <div style={{
                    marginBottom: '1.25rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '0.75rem',
                    border: '1px solid #F0F0F0',
                    fontSize: '0.8rem',
                    textAlign: 'left',
                    color: '#374151',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>User ID:</span>
                      <strong style={{ color: '#000000' }}>#{verifiedSession.userId}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>Email:</span>
                      <strong style={{ color: '#000000', wordBreak: 'break-all' }}>{verifiedSession.email}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#6B7280' }}>POS PIN:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          backgroundColor: verifiedSession.posPinConfigured ? '#ECFDF5' : '#FEF3C7',
                          color: verifiedSession.posPinConfigured ? '#047857' : '#B45309',
                        }}>
                          {verifiedSession.posPinConfigured ? 'Configured' : 'Setup Required'}
                        </span>
                        {!verifiedSession.posPinConfigured && (
                          <button
                            type="button"
                            onClick={() => setShowPinModal(true)}
                            style={{
                              background: '#000000',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Set PIN
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <Link
                    href="/onboarding"
                    className="button-20-3d"
                    role="button"
                    style={{
                      width: '100%',
                      height: '46px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      borderRadius: '0.85rem',
                    }}
                  >
                    Continue to Onboarding &gt;&gt;
                  </Link>
                  <Link
                    href="/dashboard"
                    className="button-20-secondary"
                    role="button"
                    style={{
                      width: '100%',
                      height: '42px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      borderRadius: '0.85rem',
                    }}
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleVerify} style={{
                display: 'flex',
                flexDirection: 'column',
              }}>
                {/* 4 OTP Digit Bubbles */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '14px',
                  marginBottom: '18px',
                }}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        backgroundColor: '#EFEFEF',
                        border: '1px solid transparent',
                        textAlign: 'center',
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#000000',
                        outline: 'none',
                        boxShadow: 'none',
                        fontFamily: 'inherit',
                        transition: 'border-color 0.15s, background-color 0.15s',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#000000';
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.backgroundColor = '#EFEFEF';
                      }}
                    />
                  ))}
                </div>

                {/* Timing remaining */}
                <div style={{
                  textAlign: 'right',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#000000',
                  marginBottom: '10px',
                  letterSpacing: '-0.01em',
                }}>
                  Timing remaining {formatTimer(timeLeft)}
                </div>

                {/* Login Button with 3D tactile effect */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="button-20-3d"
                    role="button"
                    style={{
                      width: '100%',
                      height: '50px',
                      fontSize: '16px',
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      borderRadius: '1rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.85 : 1,
                    }}
                  >
                    {isLoading ? 'Verifying...' : 'Login'}
                  </button>
                </div>

                {/* Resend Link */}
                <div style={{
                  textAlign: 'center',
                  marginTop: '18px',
                  fontSize: '13.5px',
                  color: '#000000',
                  letterSpacing: '-0.01em',
                }}>
                  Don&apos;t receive code yet?{' '}
                  <a
                    href="#resend"
                    onClick={handleResend}
                    style={{
                      fontWeight: 800,
                      color: '#000000',
                      textDecoration: 'none',
                      opacity: timeLeft > 0 || isResending ? 0.45 : 1,
                      cursor: timeLeft > 0 || isResending ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isResending ? 'Sending...' : 'Send Again'}
                  </a>
                </div>

                {/* Change email link */}
                <div style={{
                  textAlign: 'center',
                  marginTop: '8px',
                  fontSize: '13.5px',
                }}>
                  <Link
                    href="/signup"
                    style={{
                      fontWeight: 800,
                      color: '#000000',
                      textDecoration: 'none',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Change email
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <PosPinModal
        isOpen={showPinModal}
        mode="setup"
        onClose={() => setShowPinModal(false)}
        onSuccess={() => {
          if (verifiedSession) {
            setVerifiedSession({ ...verifiedSession, posPinConfigured: true });
          }
        }}
      />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }} />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
