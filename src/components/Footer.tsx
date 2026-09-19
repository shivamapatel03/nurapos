'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #000000',
      backgroundColor: '#FFFFFF',
      padding: '3rem 1.5rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}>
          {/* Brand & Tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              position: 'relative',
              borderRadius: '9999px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Image
                src="/logo.png"
                alt="Nuradesk Logo"
                width={32}
                height={32}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#000000' }}>
              Nuradesk
            </span>
            <span style={{ fontSize: '0.85rem', color: '#737373', marginLeft: '0.5rem' }}>
              • Modern POS System
            </span>
          </div>

          {/* Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#000000',
              borderRadius: '50%',
              display: 'inline-block',
            }}></span>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#000000' }}>
              System: Ready for .NET Core Backend
            </span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          borderTop: '1px solid #E5E5E5',
          paddingTop: '1.5rem',
          fontSize: '0.85rem',
          color: '#737373',
        }}>
          <p>© {new Date().getFullYear()} Nuradesk. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Clean Architecture</span>
            <span>Next.js App Router</span>
            <span>Zero Shadows • Zero Gradients</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
