'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import heroBg from '../hero/herobackground.png';

export default function Hero() {
  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  const handleSeeDemo = () => {
    if (previewContainerRef.current) {
      previewContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        overflow: 'hidden',
      }}
    >
      {/* Hero Background Image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <Image
          src={heroBg}
          alt="Hero background"
          fill
          priority
          quality={95}
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center top',
          }}
        />
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '1216px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
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

          {/* See demo button: transparent with crisp black border & text for high contrast */}
          <button
            type="button"
            onClick={handleSeeDemo}
            style={{
              width: '134px',
              height: '41px',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: '#000000',
              border: '1.5px solid #000000',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxSizing: 'border-box',
              transition: 'background-color 0.15s ease, opacity 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.06)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            See demo
          </button>
        </div>

        {/* Hero preview image: transparent cutout without white background container */}
        <div
          ref={previewContainerRef}
          style={{
            marginTop: '40px',
            width: '100%',
            maxWidth: '980px',
            position: 'relative',
            backgroundColor: 'transparent',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            src="/hero/hero.png"
            alt="Nuradesk POS Preview"
            width={1633}
            height={963}
            priority
            quality={95}
            sizes="(max-width: 980px) 100vw, 980px"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.08))',
            }}
          />
        </div>
      </div>
    </section>
  );
}
