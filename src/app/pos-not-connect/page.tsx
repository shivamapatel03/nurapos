'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

function PosNotConnectedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [storeCode, setStoreCode] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isFound, setIsFound] = useState(false);

  useEffect(() => {
    if (searchParams.get('found') === 'true' || searchParams.get('found') === '1') {
      setIsFound(true);
    }
  }, [searchParams]);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeCode.trim()) return;
    setIsConnecting(true);

    // Simulate store lookup
    setTimeout(() => {
      setIsConnecting(false);
      setIsFound(true);
    }, 500);
  };

  const handleEmployeeLogin = () => {
    router.push('/pos-login');
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

      {/* Centered POS Connection / Store Found Card */}
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
          {/* Card Header: Brand Logo + Nuradesk */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              marginBottom: isFound ? '2rem' : '1.75rem',
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
              fontSize: '24px',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              color: '#000000',
            }}>
              Nuradesk
            </span>
          </Link>

          {isFound ? (
            /* Store Found State (Matches Figma Screenshot Exactly) */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* "Store Found" Subtitle */}
              <h2 style={{
                fontSize: '15.5px',
                fontWeight: 700,
                color: '#000000',
                letterSpacing: '-0.02em',
                marginBottom: '1.25rem',
                textAlign: 'center',
              }}>
                Store Found
              </h2>

              {/* Black Checkmark Circle Badge */}
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.35rem',
              }}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12.5L9.5 17L19 7.5"
                    stroke="#FFFFFF"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Store Logo Placeholder Box */}
              <div style={{
                width: '138px',
                height: '38px',
                backgroundColor: '#D9D9D9',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#262626',
                  letterSpacing: '-0.01em',
                }}>
                  store logo
                </span>
              </div>

              {/* Store Name */}
              <div style={{
                fontSize: '14.5px',
                fontWeight: 800,
                color: '#000000',
                letterSpacing: '-0.015em',
                textAlign: 'center',
                marginBottom: '1.75rem',
              }}>
                SP CAFE — Ahmedabad
              </div>

              {/* Employee Login Button */}
              <button
                type="button"
                onClick={handleEmployeeLogin}
                className="button-20-3d"
                role="button"
                style={{
                  width: '100%',
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  borderRadius: '1rem',
                  cursor: 'pointer',
                }}
              >
                Employee Login
              </button>

              {/* Switch/Change code link */}
              <button
                type="button"
                onClick={() => setIsFound(false)}
                style={{
                  marginTop: '1rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#737373',
                  cursor: 'pointer',
                  letterSpacing: '-0.01em',
                  padding: '4px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#000000'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#737373'; }}
              >
                Change business code
              </button>
            </div>
          ) : (
            /* POS Not Connected Input State */
            <>
              {/* Connection Status Icon (( ! )) */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '1rem',
              }}>
                <svg
                  width="54"
                  height="54"
                  viewBox="0 0 54 54"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ color: '#000000' }}
                >
                  {/* Outer Left Arc */}
                  <path
                    d="M12 17C9 20 7.5 23.5 7.5 27C7.5 30.5 9 34 12 37"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  {/* Center Circle */}
                  <circle
                    cx="27"
                    cy="27"
                    r="11"
                    stroke="currentColor"
                    strokeWidth="3.2"
                  />
                  {/* Exclamation Bar */}
                  <path
                    d="M27 21V28"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  {/* Exclamation Dot */}
                  <circle
                    cx="27"
                    cy="33"
                    r="1.6"
                    fill="currentColor"
                  />
                  {/* Outer Right Arc */}
                  <path
                    d="M42 17C45 20 46.5 23.5 46.5 27C46.5 30.5 45 34 42 37"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Notice Heading */}
              <p style={{
                textAlign: 'center',
                fontSize: '15px',
                fontWeight: 700,
                color: '#000000',
                letterSpacing: '-0.02em',
                lineHeight: 1.4,
                marginBottom: '1.75rem',
              }}>
                This POS isn&apos;t connected to a store yet.
              </p>

              <form onSubmit={handleConnect} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.15rem',
              }}>
                {/* Store / Business Code Field */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#000000',
                    marginBottom: '0.35rem',
                    letterSpacing: '-0.01em',
                  }}>
                    Store / Business Code
                  </label>
                  <input
                    type="text"
                    required
                    value={storeCode}
                    onChange={(e) => setStoreCode(e.target.value)}
                    placeholder=""
                    style={{
                      width: '100%',
                      height: '48px',
                      backgroundColor: '#F0F0F0',
                      border: '1px solid transparent',
                      borderRadius: '0.85rem',
                      padding: '0 1.25rem',
                      fontSize: '15px',
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

                {/* Connect POS Button */}
                <div style={{ marginTop: '0.25rem' }}>
                  <button
                    type="submit"
                    disabled={isConnecting}
                    className="button-20-3d"
                    role="button"
                    style={{
                      width: '100%',
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      borderRadius: '1rem',
                      cursor: 'pointer',
                    }}
                  >
                    {isConnecting ? 'Finding store...' : 'Connect POS'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function PosNotConnectedPage() {
  return (
    <Suspense fallback={null}>
      <PosNotConnectedContent />
    </Suspense>
  );
}
