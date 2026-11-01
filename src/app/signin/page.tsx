'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
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
      // POST /api/auth/login
      const res = await loginUser({ email: email.trim(), password });
      setIsSubmitted(true);
      setTimeout(() => {
        const dest = res.data && !res.data.posPinConfigured ? '/onboarding' : '/dashboard';
        window.location.replace(dest);
      }, 700);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Direct Unsplash image link for modern retail / cafe POS checkout
  const unsplashImageUrl = 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1200&auto=format&fit=crop';

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
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.92rem',
            fontWeight: 500,
            color: '#000000',
            textDecoration: 'none',
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
          {/* Left Column: Rounded Unsplash Image */}
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

          {/* Right Column: Signin Form */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: '430px',
            width: '100%',
            margin: '0 auto',
          }}>
            {/* Brand Header */}
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
                marginBottom: 'clamp(0.8rem, 1.5vh, 1.35rem)',
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

            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(1.75rem, 2.4vw, 2.25rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#000000',
              marginBottom: 'clamp(0.8rem, 1.5vh, 1.4rem)',
            }}>
              Welcome Back
            </h1>

            {/* Error Message */}
            {errorMessage && (
              <div style={{
                marginBottom: '1rem',
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

            {isSubmitted ? (
              <div style={{
                backgroundColor: '#FAFAFA',
                border: '1px solid #E5E7EB',
                borderRadius: '1.25rem',
                padding: '1.75rem',
                textAlign: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#ECFDF5',
                  border: '2px solid #A7F3D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 30, color: '#10B981' }} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem', color: '#000000' }}>
                  Authenticated!
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#525252', marginBottom: '1.25rem' }}>
                  Logged in to Nuradesk as <strong>{email}</strong>. Launching your workspace...
                </p>
                <Link href="/dashboard" className="button-20-3d" role="button" style={{ width: '100%', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                  Go to Dashboard &gt;&gt;
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{
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
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
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

                {/* Password Field */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#000000',
                    marginBottom: '0.35rem',
                  }}>
                    Password :
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      style={{
                        width: '100%',
                        height: '50px',
                        backgroundColor: '#F0F0F0',
                        border: '1px solid transparent',
                        borderRadius: '0.85rem',
                        padding: '0 3rem 0 1.25rem',
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
                    {password.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        title={showPassword ? 'Hide password' : 'Show password'}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#525252',
                          padding: '4px',
                          borderRadius: '0.35rem',
                          transition: 'color 0.15s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#000000'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#525252'; }}
                      >
                        {showPassword ? (
                          <VisibilityOffRoundedIcon sx={{ fontSize: 20 }} />
                        ) : (
                          <VisibilityRoundedIcon sx={{ fontSize: 20 }} />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Forget Password link (right-aligned) */}
                <div style={{ textAlign: 'right', marginTop: '-0.2rem' }}>
                  <Link
                    href="/forgot-password"
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#000000',
                      textDecoration: 'none',
                    }}
                  >
                    Forget Password?
                  </Link>
                </div>

                {/* Login Button using Button-20 with 3D tactile look & buffer loading */}
                <div style={{ marginTop: '0.5rem' }}>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="button-20-3d"
                    role="button"
                    style={{
                      width: '100%',
                      height: '50px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: '1rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.65rem',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.85 : 1,
                      outline: 'none',
                    }}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          style={{
                            width: '20px',
                            height: '20px',
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
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <span>Login</span>
                    )}
                  </button>
                </div>

                {/* Create an Account link */}
                <div style={{
                  textAlign: 'center',
                  marginTop: '0.6rem',
                  fontSize: '0.9rem',
                  color: '#000000',
                }}>
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/signup"
                    style={{
                      fontWeight: 700,
                      color: '#000000',
                      textDecoration: 'none',
                    }}
                  >
                    Create an Account
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
