'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

type ResetStep = 'email' | 'code' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Step state: 'email' -> 'code' -> 'success'
  const [step, setStep] = useState<ResetStep>('email');

  // Form states
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Countdown timer for OTP resend
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step !== 'code' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  // Handle Step 1: Send Email
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setStep('code');
      setTimeLeft(30);
      setOtp(['', '', '', '']);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }, 500);
  };

  // Handle OTP Inputs
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = (e: React.MouseEvent) => {
    e.preventDefault();
    if (timeLeft > 0) return;
    setTimeLeft(30);
    setOtp(['', '', '', '']);
    setErrorMessage('');
    inputRefs.current[0]?.focus();
  };

  // Handle Step 2: Verify Code & Reset Password
  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join('');
    if (fullCode.length < 4) {
      setErrorMessage('Please enter the 4-digit verification code.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please check again.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
    }, 600);
  };

  // Modern retail / cafe POS checkout hero image matching signin and signup
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
      fontFamily: "var(--font-inter, 'Inter', sans-serif)",
      boxSizing: 'border-box',
    }}>
      {/* Top Header with "Need help" */}
      <header style={{
        height: '52px',
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
            fontSize: '0.95rem',
            fontWeight: 500,
            color: '#000000',
            textDecoration: 'none',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          Need help
        </Link>
      </header>

      {/* Main Split Layout: Fit to Desktop Viewport (No Scroll) */}
      <main style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 2.5rem 1.25rem 2.5rem',
        boxSizing: 'border-box',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1150px',
          height: '100%',
          maxHeight: 'calc(100vh - 68px)',
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 1.15fr) minmax(320px, 1fr)',
          gap: 'clamp(1.5rem, 3.5vw, 3.5rem)',
          alignItems: 'center',
        }}>
          {/* Left Column: Rounded Unsplash Image (Identical to Signin / Signup) */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            maxHeight: 'calc(100vh - 84px)',
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

          {/* Right Column: Form Area */}
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
                marginBottom: 'clamp(0.6rem, 1.2vh, 1.1rem)',
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
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
                  width={40}
                  height={40}
                  priority
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                color: '#000000',
              }}>
                Nuradesk
              </span>
            </Link>

            {/* Error Message banner */}
            {errorMessage && (
              <div style={{
                padding: '0.65rem 0.9rem',
                backgroundColor: '#FFF1F2',
                border: '1px solid #FFE4E6',
                borderRadius: '0.65rem',
                color: '#E11D48',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '0.85rem',
              }}>
                {errorMessage}
              </div>
            )}

            {/* =========================================================
                STEP 1: ENTER EMAIL SCREEN
                ========================================================= */}
            {step === 'email' && (
              <>
                {/* Title */}
                <h1 style={{
                  fontSize: 'clamp(1.75rem, 2.4vw, 2.25rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: '#000000',
                  marginBottom: '0.35rem',
                }}>
                  Forget Password
                </h1>

                {/* Subtitle */}
                <p style={{
                  fontSize: '0.9rem',
                  color: '#525252',
                  marginBottom: 'clamp(1rem, 2vh, 1.5rem)',
                  lineHeight: 1.5,
                }}>
                  Enter your email address and we will send you a 4-digit verification code to reset your password.
                </p>

                <form onSubmit={handleEmailSubmit} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(0.75rem, 1.5vh, 1.15rem)',
                }}>
                  {/* Email Field */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: '#000000',
                      marginBottom: '0.35rem',
                    }}>
                      Email :
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        height: '50px',
                        backgroundColor: '#F0F0F0',
                        border: '1px solid transparent',
                        borderRadius: '0.85rem',
                        padding: '0 1.25rem',
                        fontSize: '0.95rem',
                        fontFamily: 'inherit',
                        color: '#000000',
                        outline: 'none',
                        boxSizing: 'border-box',
                        boxShadow: 'none',
                        transition: 'border-color 0.15s, background-color 0.15s',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#000000';
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.backgroundColor = '#F0F0F0';
                      }}
                    />
                  </div>

                  {/* Send Code Button using Button-20-3d */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="button-20-3d"
                      role="button"
                      style={{
                        width: '100%',
                        height: '50px',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        borderRadius: '1rem',
                        cursor: isLoading ? 'wait' : 'pointer',
                        opacity: isLoading ? 0.8 : 1,
                      }}
                    >
                      {isLoading ? 'Sending Code...' : 'Send Reset Code'}
                    </button>
                  </div>

                  {/* Back to Login link */}
                  <div style={{
                    textAlign: 'center',
                    marginTop: '0.75rem',
                    fontSize: '0.88rem',
                    color: '#000000',
                  }}>
                    Remember your password?{' '}
                    <Link
                      href="/signin"
                      style={{
                        fontWeight: 700,
                        color: '#000000',
                        textDecoration: 'underline',
                      }}
                    >
                      Login
                    </Link>
                  </div>
                </form>
              </>
            )}

            {/* =========================================================
                STEP 2: ENTER CODE & NEW PASSWORD SCREEN
                ========================================================= */}
            {step === 'code' && (
              <>
                {/* Back to Email link */}
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setErrorMessage('');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'none',
                    border: 'none',
                    color: '#525252',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                    marginBottom: '0.75rem',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#000000'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#525252'; }}
                >
                  <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
                  <span>Change email</span>
                </button>

                {/* Title */}
                <h1 style={{
                  fontSize: 'clamp(1.65rem, 2.2vw, 2.1rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: '#000000',
                  marginBottom: '0.35rem',
                }}>
                  Enter Reset Code
                </h1>

                {/* Subtitle */}
                <p style={{
                  fontSize: '0.88rem',
                  color: '#525252',
                  marginBottom: 'clamp(0.85rem, 1.8vh, 1.25rem)',
                  lineHeight: 1.45,
                }}>
                  We sent a 4-digit verification code to <strong style={{ color: '#000000' }}>{email}</strong>
                </p>

                <form onSubmit={handleResetSubmit} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(0.65rem, 1.3vh, 0.95rem)',
                }}>
                  {/* 4 OTP Digit Bubbles */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#000000',
                      marginBottom: '0.45rem',
                    }}>
                      Verification Code :
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      justifyContent: 'space-between',
                      maxWidth: '300px',
                    }}>
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => { inputRefs.current[idx] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          style={{
                            width: '58px',
                            height: '58px',
                            borderRadius: '0.85rem',
                            backgroundColor: '#F0F0F0',
                            border: '1px solid transparent',
                            fontSize: '1.4rem',
                            fontWeight: 800,
                            textAlign: 'center',
                            color: '#000000',
                            outline: 'none',
                            transition: 'border-color 0.15s, background-color 0.15s',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#000000';
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.backgroundColor = '#F0F0F0';
                          }}
                        />
                      ))}
                    </div>

                    {/* Resend Countdown Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '0.45rem',
                      fontSize: '0.82rem',
                    }}>
                      <span style={{ color: '#737373' }}>
                        Didn&apos;t receive code?
                      </span>
                      {timeLeft > 0 ? (
                        <span style={{ color: '#000000', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                          Resend in {formatTimer(timeLeft)}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResend}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#000000',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontFamily: 'inherit',
                            padding: 0,
                          }}
                        >
                          Resend Code
                        </button>
                      )}
                    </div>
                  </div>

                  {/* New Password Field */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#000000',
                      marginBottom: '0.3rem',
                    }}>
                      New Password :
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{
                        width: '100%',
                        height: '46px',
                        backgroundColor: '#F0F0F0',
                        border: '1px solid transparent',
                        borderRadius: '0.85rem',
                        padding: '0 1.25rem',
                        fontSize: '0.92rem',
                        fontFamily: 'inherit',
                        color: '#000000',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.15s, background-color 0.15s',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#000000';
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.backgroundColor = '#F0F0F0';
                      }}
                    />
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#000000',
                      marginBottom: '0.3rem',
                    }}>
                      Confirm Password :
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{
                        width: '100%',
                        height: '46px',
                        backgroundColor: '#F0F0F0',
                        border: '1px solid transparent',
                        borderRadius: '0.85rem',
                        padding: '0 1.25rem',
                        fontSize: '0.92rem',
                        fontFamily: 'inherit',
                        color: '#000000',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.15s, background-color 0.15s',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#000000';
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.backgroundColor = '#F0F0F0';
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <div style={{ marginTop: '0.4rem' }}>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="button-20-3d"
                      role="button"
                      style={{
                        width: '100%',
                        height: '50px',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        borderRadius: '1rem',
                        cursor: isLoading ? 'wait' : 'pointer',
                        opacity: isLoading ? 0.8 : 1,
                      }}
                    >
                      {isLoading ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                  </div>

                  {/* Back to Login link */}
                  <div style={{
                    textAlign: 'center',
                    marginTop: '0.5rem',
                    fontSize: '0.88rem',
                    color: '#000000',
                  }}>
                    <Link
                      href="/signin"
                      style={{
                        fontWeight: 600,
                        color: '#525252',
                        textDecoration: 'none',
                      }}
                    >
                      Cancel and back to login
                    </Link>
                  </div>
                </form>
              </>
            )}

            {/* =========================================================
                STEP 3: SUCCESS CONFIRMATION SCREEN
                ========================================================= */}
            {step === 'success' && (
              <div style={{
                backgroundColor: '#FAFAFA',
                border: '1px solid #000000',
                borderRadius: '1.25rem',
                padding: '2rem 1.75rem',
                textAlign: 'center',
                boxSizing: 'border-box',
              }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.15rem auto',
                }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 32, color: '#FFFFFF' }} />
                </div>

                <h2 style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: '#000000',
                  marginBottom: '0.5rem',
                }}>
                  Password Reset!
                </h2>

                <p style={{
                  fontSize: '0.88rem',
                  color: '#525252',
                  lineHeight: 1.5,
                  marginBottom: '1.5rem',
                }}>
                  Your password has been successfully updated for <strong style={{ color: '#000000' }}>{email}</strong>. You can now sign in with your new password.
                </p>

                <Link
                  href="/signin"
                  className="button-20-3d"
                  role="button"
                  style={{
                    width: '100%',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    borderRadius: '0.85rem',
                  }}
                >
                  Proceed to Login &gt;&gt;
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
