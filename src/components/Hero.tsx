'use client';

import React, { useRef } from 'react';
import Link from 'next/link';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  const handleSeeDemo = () => {
    if (videoContainerRef.current) {
      videoContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        paddingTop: 'calc(58px + 72px)',
        paddingBottom: 'clamp(3rem, 6vw, 5rem)',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1216px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Headline */}
        <h1
          style={{
            color: '#000000',
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: 'normal',
            margin: '0 auto',
            textAlign: 'center',
            letterSpacing: '-0.02em',
            maxWidth: '1100px',
          }}
        >
          Sell Smarter. Manage Better. Grow Faster.
        </h1>

        {/* Buttons Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '32px',
            flexWrap: 'wrap',
          }}
        >
          {/* Get started button: width: 134px; height: 41px; border-radius: 4px; background: #000; */}
          <Link
            href="/signup"
            style={{
              width: '134px',
              height: '41px',
              borderRadius: '4px',
              backgroundColor: '#000000',
              color: '#FFFFFF',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              border: 'none',
              cursor: 'pointer',
              boxSizing: 'border-box',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            Get started
          </Link>

          {/* See demo button: width: 134px; height: 41px; border-radius: 4px; */}
          <button
            type="button"
            onClick={handleSeeDemo}
            style={{
              width: '134px',
              height: '41px',
              borderRadius: '4px',
              backgroundColor: '#FFFFFF',
              color: '#000000',
              border: '1px solid #000000',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxSizing: 'border-box',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
          >
            See demo
          </button>
        </div>

        {/* Below video: width: 1216px; height: 496px;, border-radius: 22px; */}
        <div
          ref={videoContainerRef}
          style={{
            marginTop: '48px',
            width: '100%',
            maxWidth: '1216px',
            height: 'min(496px, 56.25vw)',
            aspectRatio: '1216 / 496',
            borderRadius: '22px',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: '#D9D9D9',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
          }}
        >
          <video
            ref={videoRef}
            src="/video/hero.mp4"
            poster="/hero/hero.png"
            autoPlay
            muted
            loop
            playsInline
            controls
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '22px',
              display: 'block',
            }}
          />
        </div>
      </div>
    </section>
  );
}
