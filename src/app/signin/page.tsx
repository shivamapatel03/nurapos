'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { loginUser } from '@/lib/api-client';
import { isAuthenticated } from '@/lib/auth';

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-dismiss error toast after 6 seconds
  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(''), 6000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  // If already authenticated with valid token, redirect straight to dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      window.location.replace('/dashboard');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter your email and password.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await loginUser({ email: email.trim(), password });
      setIsSubmitted(true);
      setTimeout(() => {
        const dest = res.data && !res.data.posPinConfigured ? '/onboarding' : '/dashboard';
        window.location.replace(dest);
      }, 600);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const unsplashImageUrl = 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1200&auto=format&fit=crop';

  return (
    <div
      style={{
        height: '100vh',
        maxHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .notched-field-group {
          position: relative;
          width: 100%;
        }

        .notched-field-group .notched-label {
          position: absolute;
          left: 10px;
          top: -8px;
          background-color: #FFFFFF;
          padding: 0 5px;
          font-size: 12px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          color: #71717A;
          line-height: 1;
          z-index: 2;
          pointer-events: none;
        }

        .notched-field-group:focus-within .notched-label {
          color: #000000;
          font-weight: 600;
        }

        .notched-field-group input {
          width: 100%;
          height: 44px;
          background-color: #FFFFFF;
          border: 1.5px solid #D4D4D8;
          border-radius: 4px;
          padding: 0 12px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          color: #000000;
          outline: none;
          box-sizing: border-box;
          box-shadow: none;
        }

        .notched-field-group input::placeholder {
          color: #A1A1AA;
          font-size: 13.5px;
        }

        .notched-field-group input:focus {
          border-color: #000000;
        }

        /* Prevent browser autofill yellow/blue background */
        .notched-field-group input:-webkit-autofill,
        .notched-field-group input:-webkit-autofill:hover,
        .notched-field-group input:-webkit-autofill:focus,
        .notched-field-group input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #FFFFFF inset !important;
          box-shadow: 0 0 0 1000px #FFFFFF inset !important;
          -webkit-text-fill-color: #000000 !important;
          caret-color: #000000 !important;
          border-color: #D4D4D8 !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        .notched-field-group input:-webkit-autofill:focus {
          border-color: #000000 !important;
          border-width: 1.5px !important;
        }

        .auth-submit-btn {
          width: 100%;
          height: 44px;
          background-color: #000000;
          color: #FFFFFF;
          border: 1px solid #000000;
          border-radius: 4px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: background-color 0.15s ease, opacity 0.15s ease;
          outline: none;
        }

        .auth-submit-btn:hover:not(:disabled) {
          background-color: #1F1F23;
          border-color: #1F1F23;
        }

        .auth-submit-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }
      `}</style>

      {/* Top Header with "Need help" */}
      <header
        style={{
          height: '52px',
          padding: '0 2.5rem',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
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
            fontSize: '13px',
            fontWeight: 500,
            color: '#000000',
            textDecoration: 'none',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <HelpOutlineRoundedIcon sx={{ fontSize: 17 }} />
          <span>Need help</span>
        </Link>
      </header>

      {/* Main Split Layout */}
      <main
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 2.5rem 1.5rem 2.5rem',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1150px',
            height: '100%',
            maxHeight: 'calc(100vh - 68px)',
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 1.15fr) minmax(320px, 1fr)',
            gap: 'clamp(1.5rem, 3.5vw, 3.5rem)',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Rounded Unsplash Image */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '560px',
              maxHeight: 'calc(100vh - 84px)',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: '#F5F5F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={unsplashImageUrl}
              alt="Nuradesk POS Terminal"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                borderRadius: '12px',
              }}
            />
          </div>

          {/* Right Column: Signin Form */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              maxWidth: '430px',
              width: '100%',
              margin: '0 auto',
            }}
          >
            {/* Title & Subtitle */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: 600,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.2,
                  color: '#000000',
                  margin: '0 0 0.35rem 0',
                }}
              >
                Welcome Back
              </h1>
              <p
                style={{
                  fontSize: '14px',
                  color: '#71717A',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  margin: 0,
                  lineHeight: 1.45,
                }}
              >
                Enter your credentials to access your store register.
              </p>
            </div>

            {isSubmitted ? (
              <div
                style={{
                  backgroundColor: '#FAFAFA',
                  border: '1px solid #E5E7EB',
                  borderRadius: '4px',
                  padding: '1.75rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '4px',
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem auto',
                  }}
                >
                  <CheckCircleRoundedIcon sx={{ fontSize: 26, color: '#10B981' }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '0.4rem', color: '#000000' }}>
                  Authenticated!
                </h3>
                <p style={{ fontSize: '13.5px', color: '#52525B', marginBottom: '1.25rem' }}>
                  Logged in to Nuradesk as <strong>{email}</strong>. Launching your workspace...
                </p>
                <Link
                  href="/dashboard"
                  className="auth-submit-btn"
                  style={{ textDecoration: 'none' }}
                >
                  Go to Dashboard &gt;&gt;
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.35rem',
                }}
              >
                {/* Email Field with Notched Outline Label */}
                <div className={`notched-field-group ${errorMessage ? 'is-error' : ''}`}>
                  <label className="notched-label">Email</label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                  />
                </div>

                {/* Password Field with Notched Outline Label */}
                <div className="notched-field-group">
                  <label className="notched-label">Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    style={{ paddingRight: '38px' }}
                  />
                  {password.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#71717A',
                        padding: '4px',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#000000';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#71717A';
                      }}
                    >
                      {showPassword ? (
                        <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <VisibilityRoundedIcon sx={{ fontSize: 18 }} />
                      )}
                    </button>
                  )}
                </div>

                {/* Forget Password link (right-aligned) */}
                <div style={{ textAlign: 'right', marginTop: '-0.35rem' }}>
                  <Link
                    href="/forgot-password"
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#000000',
                      textDecoration: 'none',
                    }}
                  >
                    Forget Password?
                  </Link>
                </div>

                {/* Login Button (Square with 4px border-radius, black background) */}
                <div style={{ marginTop: '0.25rem' }}>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="auth-submit-btn"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          style={{
                            width: '16px',
                            height: '16px',
                            animation: 'spin 0.75s linear infinite',
                            flexShrink: 0,
                          }}
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeOpacity="0.25"
                          />
                          <path
                            d="M12 2a10 10 0 0 1 10 10"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>
                </div>

                {/* Switch to Signup link */}
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '0.2rem',
                    fontSize: '13px',
                    color: '#71717A',
                  }}
                >
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/signup"
                    style={{
                      fontWeight: 600,
                      color: '#000000',
                      textDecoration: 'none',
                    }}
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Bottom-Right Error Toast (prevents form layout shift or screen cropping) */}
      {errorMessage && (
        <div
          role="alert"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 99999,
            maxWidth: '380px',
            width: 'calc(100vw - 48px)',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderLeft: '4px solid #DC2626',
            borderRadius: '4px',
            padding: '12px 14px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontFamily: "'Inter', sans-serif",
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <ErrorOutlineRoundedIcon sx={{ fontSize: 18, color: '#DC2626', flexShrink: 0 }} />
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#000000',
                lineHeight: 1.4,
                letterSpacing: '-0.01em',
              }}
            >
              {errorMessage}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            aria-label="Close error notification"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#71717A',
              flexShrink: 0,
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      )}
    </div>
  );
}
