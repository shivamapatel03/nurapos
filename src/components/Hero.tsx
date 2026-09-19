'use client';

import React from 'react';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

export default function Hero() {
  return (
    <section style={{
      padding: '4.5rem 1.5rem 3rem 1.5rem',
      maxWidth: '1200px',
      margin: '0 auto',
      textAlign: 'center',
    }}>
      {/* Top Pill / Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        <span className="badge-rounded-outline" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.9rem',
          fontSize: '0.8rem',
          borderRadius: '9999px',
        }}>
          <BoltRoundedIcon sx={{ fontSize: 16 }} />
          <span>Nuradesk v1.0 • Modern POS Architecture</span>
        </span>
      </div>

      {/* Main Headline */}
      <h1 style={{
        fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
        fontWeight: 800,
        lineHeight: 1.1,
        letterSpacing: '-0.04em',
        color: '#000000',
        maxWidth: '900px',
        margin: '0 auto 1.25rem auto',
      }}>
        Next-Generation Point of Sale for Seamless Transactions
      </h1>

      {/* Subheadline */}
      <p style={{
        fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
        color: '#525252',
        maxWidth: '680px',
        margin: '0 auto 2.25rem auto',
        lineHeight: 1.6,
        fontWeight: 400,
      }}>
        Nuradesk is built for lightning-fast register operations, live stock tracking, and clean checkout workflows. Built on Next.js and ready to scale with a robust .NET backend.
      </p>

      {/* Action Buttons using .button-20 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        marginBottom: '3rem',
      }}>
        <a href="#pos-demo" className="button-20" role="button">
          <TerminalRoundedIcon sx={{ fontSize: 20 }} />
          <span>Launch POS Terminal</span>
        </a>

        <a href="#features" className="button-20-secondary" role="button">
          <StorageRoundedIcon sx={{ fontSize: 20 }} />
          <span>Explore Capabilities</span>
        </a>
      </div>

      {/* Quick Value Metrics (Flat, rounded, no shadows, no gradients) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        maxWidth: '960px',
        margin: '0 auto',
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E5E5',
          borderRadius: '1rem',
          padding: '1.25rem 1rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#000000', letterSpacing: '-0.03em' }}>
            &lt; 150ms
          </div>
          <div style={{ fontSize: '0.85rem', color: '#737373', marginTop: '0.25rem' }}>
            Barcode Scan & Cart Add
          </div>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E5E5',
          borderRadius: '1rem',
          padding: '1.25rem 1rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#000000', letterSpacing: '-0.03em' }}>
            .NET Ready
          </div>
          <div style={{ fontSize: '0.85rem', color: '#737373', marginTop: '0.25rem' }}>
            C# Web API Architecture
          </div>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E5E5',
          borderRadius: '1rem',
          padding: '1.25rem 1rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#000000', letterSpacing: '-0.03em' }}>
            100% Offline
          </div>
          <div style={{ fontSize: '0.85rem', color: '#737373', marginTop: '0.25rem' }}>
            Local Cache & Sync Queue
          </div>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E5E5',
          borderRadius: '1rem',
          padding: '1.25rem 1rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#000000', letterSpacing: '-0.03em' }}>
            Pure B&W
          </div>
          <div style={{ fontSize: '0.85rem', color: '#737373', marginTop: '0.25rem' }}>
            Minimal, High Contrast UI
          </div>
        </div>
      </div>
    </section>
  );
}
