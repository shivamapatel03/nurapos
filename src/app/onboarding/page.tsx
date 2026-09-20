'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

export default function OnboardingScreen1() {
  const router = useRouter();

  // Temporary direct Unsplash image for store setup onboarding
  const unsplashImageUrl = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop';

  const handleGetStarted = () => {
    router.push('/onboarding-2');
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

      {/* Main Centered Onboarding Content */}
      <main style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}>
        {/* Welcome Heading */}
        <h1 style={{
          fontSize: 'clamp(20px, 2.2vw, 24px)',
          fontWeight: 800,
          color: '#000000',
          letterSpacing: '-0.03em',
          marginBottom: '0.5rem',
          lineHeight: 1.2,
        }}>
          Welcome to Nuradesk
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: 'clamp(15px, 1.4vw, 17px)',
          fontWeight: 700,
          color: '#000000',
          letterSpacing: '-0.015em',
          marginBottom: '2rem',
          lineHeight: 1.4,
          maxWidth: '480px',
        }}>
          Let&apos;s set up your store in a few simple steps.
        </p>

        {/* Temporary Unsplash Image Container */}
        <div style={{
          width: '190px',
          height: '190px',
          borderRadius: '1.25rem',
          overflow: 'hidden',
          backgroundColor: '#E5E5E5',
          position: 'relative',
          marginBottom: '2rem',
          border: '1px solid #EAEAEA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Image
            src={unsplashImageUrl}
            alt="Store Onboarding"
            fill
            sizes="190px"
            priority
            style={{
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Get Started Button */}
        <div style={{ width: '100%', maxWidth: '340px' }}>
          <button
            type="button"
            onClick={handleGetStarted}
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
            }}
          >
            Get Started &gt;&gt;
          </button>
        </div>

        {/* Duration Note */}
        <p style={{
          fontSize: '13.5px',
          fontWeight: 600,
          color: '#000000',
          letterSpacing: '-0.01em',
          marginTop: '0.85rem',
          marginBottom: 0,
        }}>
          Takes about 5 min
        </p>
      </main>
    </div>
  );
}
