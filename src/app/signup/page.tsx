'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('Please agree to the Terms & Privacy Policy to continue.');
      return;
    }
    router.push('/verify-email');
  };

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
              alt="Nuradesk POS in action"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                borderRadius: '1.5rem',
              }}
            />
          </div>

          {/* Right Column: Signup Form */}
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
                marginBottom: 'clamp(0.6rem, 1.2vh, 1.25rem)',
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
              fontSize: 'clamp(1.6rem, 2.2vw, 2.1rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#000000',
              marginBottom: 'clamp(0.75rem, 1.5vh, 1.35rem)',
            }}>
              Create Account
            </h1>

            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(0.55rem, 1.2vh, 0.95rem)',
            }}>
              {/* Full Name Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#000000',
                  marginBottom: '0.25rem',
                }}>
                  Enter Full Name :
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    height: '46px',
                    backgroundColor: '#F0F0F0',
                    border: '1px solid transparent',
                    borderRadius: '0.85rem',
                    padding: '0 1rem',
                    fontSize: '0.92rem',
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

              {/* Email Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#000000',
                  marginBottom: '0.25rem',
                }}>
                  Email :
                </label>
                <input
                  type="email"
                  required
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    height: '46px',
                    backgroundColor: '#F0F0F0',
                    border: '1px solid transparent',
                    borderRadius: '0.85rem',
                    padding: '0 1rem',
                    fontSize: '0.92rem',
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
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#000000',
                  marginBottom: '0.25rem',
                }}>
                  Create Password :
                </label>
                <input
                  type="password"
                  required
                  placeholder="Create your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    height: '46px',
                    backgroundColor: '#F0F0F0',
                    border: '1px solid transparent',
                    borderRadius: '0.85rem',
                    padding: '0 1rem',
                    fontSize: '0.92rem',
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

              {/* Terms and Privacy Checkbox */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                marginTop: '0.15rem',
              }}>
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{
                    width: '17px',
                    height: '17px',
                    accentColor: '#000000',
                    cursor: 'pointer',
                    boxShadow: 'none',
                  }}
                />
                <label
                  htmlFor="terms-checkbox"
                  style={{
                    fontSize: '0.82rem',
                    color: '#000000',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  I agree to <strong>Terms & Privacy Policy</strong>
                </label>
              </div>

              {/* Submit Button using user .button-20 with 3D tactile look */}
              <div style={{ marginTop: '0.35rem' }}>
                <button
                  type="submit"
                  className="button-20-3d"
                  role="button"
                  style={{
                    width: '100%',
                    height: '48px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: '1rem',
                  }}
                >
                  Create Account
                </button>
              </div>

              {/* Already Have an Account link */}
              <div style={{
                textAlign: 'center',
                marginTop: '0.35rem',
                fontSize: '0.85rem',
                color: '#000000',
              }}>
                Already Have an Account?{' '}
                <Link
                  href="/signin"
                  style={{
                    fontWeight: 700,
                    color: '#000000',
                    textDecoration: 'none',
                  }}
                >
                  Signin
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
