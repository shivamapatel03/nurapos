'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

export default function PosStoreFoundPage() {
  const router = useRouter();

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

      {/* Centered Store Found Card */}
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
              marginBottom: '2rem',
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

          {/* Store Found State */}
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
          </div>
        </div>
      </main>
    </div>
  );
}
