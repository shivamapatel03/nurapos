'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OnboardingScreen6() {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push('/dashboard');
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

      {/* Main Centered Success Content */}
      <main style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem 2rem',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}>
        {/* Main Title */}
        <h1 style={{
          fontSize: 'clamp(22px, 2.4vw, 26px)',
          fontWeight: 800,
          color: '#000000',
          letterSpacing: '-0.03em',
          marginBottom: '2rem',
        }}>
          You&apos;re all set!
        </h1>

        {/* Structured Configuration Summary Card */}
        <div style={{
          width: '100%',
          maxWidth: '380px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E5E5',
          borderRadius: '1.15rem',
          padding: '1.5rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxSizing: 'border-box',
          marginBottom: '1.75rem',
          boxShadow: 'none',
        }}>
          {/* Business Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '14.5px',
          }}>
            <span style={{ color: '#555555', fontWeight: 600 }}>Business</span>
            <span style={{ color: '#000000', fontWeight: 800 }}>Nuradesk</span>
          </div>

          <div style={{ height: '1px', backgroundColor: '#F0F0F0', width: '100%' }} />

          {/* Store Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '14.5px',
          }}>
            <span style={{ color: '#555555', fontWeight: 600 }}>Store</span>
            <span style={{ color: '#000000', fontWeight: 800 }}>Nuradesk Ahmedabad</span>
          </div>

          <div style={{ height: '1px', backgroundColor: '#F0F0F0', width: '100%' }} />

          {/* Team Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '14.5px',
          }}>
            <span style={{ color: '#555555', fontWeight: 600 }}>Team</span>
            <span style={{ color: '#000000', fontWeight: 800 }}>2 employees</span>
          </div>

          <div style={{ height: '1px', backgroundColor: '#F0F0F0', width: '100%' }} />

          {/* Payment Methods Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '14.5px',
          }}>
            <span style={{ color: '#555555', fontWeight: 600 }}>Payment methods</span>
            <span style={{ color: '#000000', fontWeight: 800 }}>Cash · Card · UPI</span>
          </div>
        </div>

        {/* Subtitle */}
        <p style={{
          fontSize: '15px',
          fontWeight: 700,
          color: '#000000',
          letterSpacing: '-0.015em',
          marginBottom: '1.75rem',
        }}>
          Your Nuradesk store is ready.
        </p>

        {/* Go to Dashboard Button */}
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <button
            type="button"
            onClick={handleGoToDashboard}
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
            Go to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
