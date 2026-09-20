'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

export default function PosLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/pos-login-3');
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
            alert('Nuradesk Terminal Support: support@nuradesk.com');
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

      {/* Centered POS Login Card */}
      <main style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        boxSizing: 'border-box',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E5E5',
          borderRadius: '1.25rem',
          padding: 'clamp(1.75rem, 3.5vh, 2.5rem)',
          boxSizing: 'border-box',
        }}>
          {/* Brand Header: Logo + Nuradesk */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              marginBottom: '1.25rem',
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

          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(1.35rem, 2vw, 1.65rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#000000',
            marginBottom: '1.5rem',
            lineHeight: 1.25,
          }}>
            Sign in to your POS account
          </h1>

          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
              {/* Employee ID / Email Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#000000',
                  marginBottom: '0.35rem',
                }}>
                  Employee ID / Email :
                </label>
                <input
                  type="text"
                  required
                  placeholder=""
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  style={{
                    width: '100%',
                    height: '48px',
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
                  fontSize: '0.9rem',
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
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      height: '48px',
                      backgroundColor: '#F0F0F0',
                      border: '1px solid transparent',
                      borderRadius: '0.85rem',
                      padding: '0 2.8rem 0 1.25rem',
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
                        right: '10px',
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

              {/* Remember this device & Forget Password row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.82rem',
                marginTop: '0.1rem',
              }}>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                  userSelect: 'none',
                  color: '#000000',
                  fontWeight: 500,
                }}>
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: '#000000',
                      cursor: 'pointer',
                      boxShadow: 'none',
                    }}
                  />
                  <span>Remember this device</span>
                </label>

                <Link
                  href="/forgot-password"
                  style={{
                    fontWeight: 600,
                    color: '#000000',
                    textDecoration: 'none',
                  }}
                >
                  Forget Password?
                </Link>
              </div>

              {/* Signin Button: user button-20 with 3D tactile press */}
              <div style={{ marginTop: '0.5rem' }}>
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
                  Continue
                </button>
              </div>
            </form>
        </div>
      </main>
    </div>
  );
}
