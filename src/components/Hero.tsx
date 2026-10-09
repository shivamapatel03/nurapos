'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [showDemoModal, setShowDemoModal] = useState(false);

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
        paddingTop: 'clamp(7rem, 13vw, 9.5rem)',
        paddingBottom: 'clamp(1rem, 2vw, 1.5rem)',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        boxSizing: 'border-box',
        fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1180px',
          margin: '0 auto',
        }}
      >
        {/* Main Headline */}
        <h1
          style={{
            margin: '0 auto 1.85rem auto',
            maxWidth: '100%',
            fontSize: 'clamp(1.65rem, 3.5vw, 3.15rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.04em',
            color: '#000000',
            textTransform: 'none',
          }}
        >
          Run Your Business. Not Your Busywork.
        </h1>

        {/* Call to Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: '0.85rem',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Link
              href="/signup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.9rem 2.4rem',
                borderRadius: '9999px',
                backgroundColor: '#191a19',
                backgroundImage: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0))',
                border: '1px solid #2a2a2a',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 700,
                textDecoration: 'none',
                letterSpacing: '-0.01em',
              }}
            >
              Get Started — It&apos;s Free
            </Link>
            <span
              style={{
                marginTop: '0.55rem',
                fontSize: '0.82rem',
                color: '#71717A',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                textAlign: 'center',
              }}
            >
              *no credit card required
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowDemoModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.9rem 2rem',
              borderRadius: '9999px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              color: '#111827',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              cursor: 'pointer',
              gap: '0.5rem',
              outline: 'none',
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Demo
          </button>
        </div>
      </div>

      {/* Video Demo Modal */}
      {showDemoModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowDemoModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            boxSizing: 'border-box',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '920px',
              backgroundColor: '#000000',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1.25rem',
                backgroundColor: 'rgba(20, 20, 20, 0.95)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 600 }}>
                Nuradesk Product Walkthrough
              </span>
              <button
                type="button"
                onClick={() => setShowDemoModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  fontSize: '20px',
                  lineHeight: 1,
                  padding: '4px 8px',
                  borderRadius: '6px',
                }}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <video
              src="/video/hero.mp4"
              controls
              autoPlay
              playsInline
              style={{
                width: '100%',
                display: 'block',
                maxHeight: '75vh',
                backgroundColor: '#000000',
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
