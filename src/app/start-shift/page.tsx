'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

export default function StartShiftPage() {
  const router = useRouter();
  const stores = [
    'SP CAFE — Ahmedabad',
    'SP CAFE — Mumbai (Bandra)',
    'SP CAFE — Bangalore (Indiranagar)',
    'SP CAFE — Delhi (Connaught Place)',
    'SP CAFE — Pune (Koregaon Park)',
  ];
  const [storeName, setStoreName] = useState(stores[0]);
  const [openingCash, setOpeningCash] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleStartShift = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/pos');
      }, 1200);
    }, 600);
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
          Need help
        </Link>
      </header>

      {/* Centered Start Shift Card */}
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
          {/* Card Header: Brand Logo + Nuradesk on left, 'store logo' pill on right */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
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

            {/* Store Logo Placeholder Badge */}
            <div style={{
              backgroundColor: '#D9D9D9',
              color: '#333333',
              padding: '0.35rem 0.95rem',
              borderRadius: '9999px',
              fontSize: '12.5px',
              fontWeight: 700,
              letterSpacing: '-0.01em',
            }}>
              store logo
            </div>
          </div>

          {/* Greeting: Good morning, Amit */}
          <h2 style={{
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#000000',
            marginBottom: '1.5rem',
            marginTop: '0.25rem',
          }}>
            Good morning, Amit
          </h2>

          {isSuccess ? (
            <div style={{
              backgroundColor: '#FAFAFA',
              border: '1px solid #000000',
              borderRadius: '1rem',
              padding: '1.5rem',
              textAlign: 'center',
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                Shift Started!
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#525252' }}>
                Cash drawer initialized with {openingCash ? `$${openingCash}` : '$0.00'}. Launching terminal...
              </p>
            </div>
          ) : (
            <form onSubmit={handleStartShift} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.15rem',
            }}>
              {/* Store Dropdown Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#000000',
                  marginBottom: '0.4rem',
                  letterSpacing: '-0.01em',
                }}>
                  Store
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    style={{
                      width: '100%',
                      height: '48px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #000000',
                      borderRadius: '9999px',
                      padding: '0 2.5rem 0 1.25rem',
                      fontSize: '15px',
                      fontFamily: 'inherit',
                      fontWeight: 600,
                      color: '#000000',
                      outline: 'none',
                      appearance: 'none',
                      boxSizing: 'border-box',
                      boxShadow: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {stores.map((s, i) => (
                      <option key={i} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <span style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#000000',
                  }}>
                    <KeyboardArrowDownRoundedIcon sx={{ fontSize: 24 }} />
                  </span>
                </div>
              </div>

              {/* Opening cash Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#000000',
                  marginBottom: '0.4rem',
                  letterSpacing: '-0.01em',
                }}>
                  Opening cash
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={openingCash}
                  onChange={(e) => setOpeningCash(e.target.value)}
                  placeholder=""
                  style={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: '#F0F0F0',
                    border: '1px solid transparent',
                    borderRadius: '9999px',
                    padding: '0 1.25rem',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    fontWeight: 600,
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
                {/* Helper text */}
                <p style={{
                  fontSize: '11.5px',
                  fontWeight: 500,
                  color: '#555555',
                  marginTop: '0.35rem',
                  marginBottom: 0,
                  letterSpacing: '-0.01em',
                }}>
                  This is the amount currently in the cash drawer.
                </p>
              </div>

              {/* Start Shift Button */}
              <div style={{ marginTop: '0.35rem' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="button-20-3d"
                  role="button"
                  style={{
                    width: '100%',
                    height: '48px',
                    fontSize: '15px',
                    fontWeight: 800,
                    letterSpacing: '0.02em',
                    borderRadius: '1rem',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  {isSubmitting ? 'STARTING SHIFT...' : 'START SHIFT'}
                </button>
              </div>

              {/* Switch user link */}
              <div style={{
                textAlign: 'center',
                marginTop: '0.25rem',
              }}>
                <Link
                  href="/pos-login-3"
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#000000',
                    textDecoration: 'none',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Switch user
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
