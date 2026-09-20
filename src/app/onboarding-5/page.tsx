'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

export default function OnboardingScreen5() {
  const router = useRouter();

  // Payment methods state
  const [payments, setPayments] = useState<{
    cash: boolean;
    card: boolean;
    upi: boolean;
  }>({
    cash: true,
    card: true,
    upi: true,
  });

  // Hardware state
  const [hasCashDrawer, setHasCashDrawer] = useState<'yes' | 'no'>('yes');
  const [printerStatus, setPrinterStatus] = useState<'connected' | 'later'>('later');

  const togglePayment = (key: keyof typeof payments) => {
    setPayments((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/onboarding-6');
  };

  const handleBack = () => {
    router.push('/onboarding-4');
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
      {/* Top Header */}
      <header style={{
        height: '72px',
        padding: '0 clamp(1.5rem, 4vw, 3rem)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        {/* Brand Logo + Name */}
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

        {/* Need Help Link */}
        <Link
          href="#help"
          onClick={(e) => {
            e.preventDefault();
            alert('Nuradesk Onboarding Support: support@nuradesk.com');
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

      {/* Main Centered POS Setup */}
      <main style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem 2rem',
        boxSizing: 'border-box',
      }}>
        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(20px, 2.2vw, 24px)',
          fontWeight: 800,
          color: '#000000',
          letterSpacing: '-0.03em',
          marginBottom: '1.75rem',
          textAlign: 'center',
        }}>
          Set up your POS
        </h1>

        <form onSubmit={handleContinue} style={{
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Section 1: How will you accept payments? */}
          <div style={{ marginBottom: '1.4rem' }}>
            <label style={{
              display: 'block',
              fontSize: '14.5px',
              fontWeight: 700,
              color: '#000000',
              marginBottom: '0.75rem',
              letterSpacing: '-0.015em',
            }}>
              How will you accept payments?
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {/* Cash Checkbox */}
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  cursor: 'pointer',
                  userSelect: 'none',
                  fontSize: '14.5px',
                  fontWeight: 600,
                  color: '#000000',
                }}
              >
                <div
                  onClick={() => togglePayment('cash')}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '5px',
                    backgroundColor: payments.cash ? '#000000' : '#FFFFFF',
                    border: payments.cash ? '2px solid #000000' : '2px solid #D0D0D0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    boxSizing: 'border-box',
                    flexShrink: 0,
                  }}
                >
                  {payments.cash && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 12.5L9 17.5L20 6.5" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span>Cash</span>
              </label>

              {/* Card Checkbox */}
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  cursor: 'pointer',
                  userSelect: 'none',
                  fontSize: '14.5px',
                  fontWeight: 600,
                  color: '#000000',
                }}
              >
                <div
                  onClick={() => togglePayment('card')}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '5px',
                    backgroundColor: payments.card ? '#000000' : '#FFFFFF',
                    border: payments.card ? '2px solid #000000' : '2px solid #D0D0D0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    boxSizing: 'border-box',
                    flexShrink: 0,
                  }}
                >
                  {payments.card && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 12.5L9 17.5L20 6.5" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span>Card</span>
              </label>

              {/* UPI Checkbox */}
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  cursor: 'pointer',
                  userSelect: 'none',
                  fontSize: '14.5px',
                  fontWeight: 600,
                  color: '#000000',
                }}
              >
                <div
                  onClick={() => togglePayment('upi')}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '5px',
                    backgroundColor: payments.upi ? '#000000' : '#FFFFFF',
                    border: payments.upi ? '2px solid #000000' : '2px solid #D0D0D0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    boxSizing: 'border-box',
                    flexShrink: 0,
                  }}
                >
                  {payments.upi && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 12.5L9 17.5L20 6.5" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span>UPI</span>
              </label>
            </div>
          </div>

          {/* Section 2: Cash drawer */}
          <div style={{ marginBottom: '1.4rem' }}>
            <label style={{
              display: 'block',
              fontSize: '14.5px',
              fontWeight: 700,
              color: '#000000',
              marginBottom: '0.65rem',
              letterSpacing: '-0.015em',
            }}>
              Cash drawer
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
              {/* Yes Radio */}
              <label
                onClick={() => setHasCashDrawer('yes')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  cursor: 'pointer',
                  userSelect: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#000000',
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: hasCashDrawer === 'yes' ? '2px solid #000000' : '2px solid #D0D0D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}>
                  {hasCashDrawer === 'yes' && (
                    <div style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      backgroundColor: '#000000',
                    }} />
                  )}
                </div>
                <span>Yes</span>
              </label>

              {/* No Radio */}
              <label
                onClick={() => setHasCashDrawer('no')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  cursor: 'pointer',
                  userSelect: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#000000',
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: hasCashDrawer === 'no' ? '2px solid #000000' : '2px solid #D0D0D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}>
                  {hasCashDrawer === 'no' && (
                    <div style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      backgroundColor: '#000000',
                    }} />
                  )}
                </div>
                <span>No</span>
              </label>
            </div>
          </div>

          {/* Section 3: Receipt printer */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '14.5px',
              fontWeight: 700,
              color: '#000000',
              marginBottom: '0.65rem',
              letterSpacing: '-0.015em',
            }}>
              Receipt printer
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
              {/* Connected Radio */}
              <label
                onClick={() => setPrinterStatus('connected')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  cursor: 'pointer',
                  userSelect: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#000000',
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: printerStatus === 'connected' ? '2px solid #000000' : '2px solid #D0D0D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}>
                  {printerStatus === 'connected' && (
                    <div style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      backgroundColor: '#000000',
                    }} />
                  )}
                </div>
                <span>Connected</span>
              </label>

              {/* I'll set this up later Radio */}
              <label
                onClick={() => setPrinterStatus('later')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  cursor: 'pointer',
                  userSelect: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#000000',
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: printerStatus === 'later' ? '2px solid #000000' : '2px solid #D0D0D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}>
                  {printerStatus === 'later' && (
                    <div style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      backgroundColor: '#000000',
                    }} />
                  )}
                </div>
                <span>I&apos;ll set this up later</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          }}>
            {/* Continue Button */}
            <button
              type="submit"
              className="button-20-3d"
              role="button"
              style={{
                width: '100%',
                height: '48px',
                fontSize: '16px',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                borderRadius: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Continue
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={handleBack}
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #000000',
                borderRadius: '0.85rem',
                fontSize: '16px',
                fontWeight: 700,
                color: '#000000',
                letterSpacing: '-0.01em',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F5F5'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
            >
              Back
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
