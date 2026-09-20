'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  const handleResend = (e: React.MouseEvent) => {
    e.preventDefault();
    setTimeLeft(30);
    setOtp(['', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerified(true);
  };

  // Direct Unsplash image link for modern retail / cafe POS checkout
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

      {/* Main Split Layout: Fit to Desktop Viewport (No Scroll) */}
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
          {/* Left Column: Rounded Unsplash Image */}
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

            {/* Subtitle */}
            <p style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#000000',
              marginBottom: '26px',
              lineHeight: 1.5,
              letterSpacing: '-0.01em',
            }}>
              We&apos;ve sent a verification link to <strong style={{ fontWeight: 800 }}>xyz@gmail.com</strong>
            </p>

            {isVerified ? (
              <div style={{
                backgroundColor: '#FAFAFA',
                border: '1px solid #000000',
                borderRadius: '1rem',
                padding: '1.75rem',
                textAlign: 'center',
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Email Verified!
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '1.25rem' }}>
                  Your register account is active and verified.
                </p>
                <Link href="/onboarding" className="button-20-3d" role="button" style={{ width: '100%', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                  Continue to Onboarding &gt;&gt;
                </Link>
              </div>
            ) : (
              <form onSubmit={handleVerify} style={{
                display: 'flex',
                flexDirection: 'column',
              }}>
                {/* 4 OTP Digit Bubbles matching screenshot exactly */}
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

                {/* Timing remaining (right-aligned with button) */}
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
                    className="button-20-3d"
                    role="button"
                    style={{
                      width: '100%',
                      height: '50px',
                      fontSize: '16px',
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      borderRadius: '1rem',
                    }}
                  >
                    Login
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
                    }}
                  >
                    Send Again
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
    </div>
  );
}
