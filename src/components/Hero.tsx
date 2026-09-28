'use client';

import React, { useEffect, useState } from 'react';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section style={{
      minHeight: '100svh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0B2636',
      color: '#FFFFFF',
      textAlign: 'center',
    }}>
      <video autoPlay loop muted playsInline aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `translateY(${scrollY * 0.12}px) scale(1.08)` }}>
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(6, 24, 36, 0.58)' }} />

      <div className="landing-hero-content landing-reveal" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '920px', padding: '7rem 1.5rem 4rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.35rem 0.75rem', marginBottom: '1.25rem', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.16)', color: '#E7F1F6', fontSize: '11px', fontWeight: 700 }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#B9E4D0' }} />
          Built for busy stores
        </div>
        <h1 style={{ maxWidth: '820px', margin: '0 auto 1.25rem', color: '#F7FAFC', fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 'clamp(3rem, 8vw, 6.5rem)', fontWeight: 400, lineHeight: 0.98, letterSpacing: '-0.045em' }}>
          Run every sale with clarity
        </h1>
        <p style={{ maxWidth: '520px', margin: '0 auto 2rem', color: '#D4E0E6', fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', lineHeight: 1.55 }}>
          Nuradesk brings checkout, inventory, staff, and store insights into one calm workspace.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <a href="/signup" className="button-20" role="button" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 1.15rem', borderRadius: '9999px', backgroundColor: '#F4F7F8', color: '#12222B', fontSize: '13px', fontWeight: 800 }}>
            Start free trial
            <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
          </a>
          <a href="#features" className="button-20-secondary" role="button" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.75rem 1.15rem', borderRadius: '9999px', backgroundColor: 'rgba(205,225,235,0.25)', border: '1px solid rgba(235,246,250,0.3)', color: '#F4F7F8', fontSize: '13px', fontWeight: 700 }}>
            See the POS in action
          </a>
        </div>
      </div>
    </section>
  );
}
