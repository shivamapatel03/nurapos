'use client';

import React from 'react';

interface FullScreenBufferLoaderProps {
  text?: string;
  subtext?: string;
}

export default function FullScreenBufferLoader({
  text = 'Loading your dashboard...',
  subtext = 'Setting up your store workspace...',
}: FullScreenBufferLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#FFFFFF',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
        padding: '1.5rem',
        boxSizing: 'border-box',
        userSelect: 'none',
        animation: 'bufferFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      <style>{`
        @keyframes bufferFadeIn {
          from { opacity: 0; transform: scale(0.99); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bufferSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Simple Clean Circle Loader */}
      <div
        style={{
          width: '46px',
          height: '46px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          style={{
            width: '46px',
            height: '46px',
            animation: 'bufferSpin 0.85s linear infinite',
            transformOrigin: 'center center',
          }}
          viewBox="0 0 48 48"
          fill="none"
        >
          {/* Subtle track circle */}
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="#EDEDEF"
            strokeWidth="3.5"
          />
          {/* Active rotating arc circle */}
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="#000000"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="32 94"
          />
        </svg>
      </div>

      {/* Primary Status Text */}
      <p
        style={{
          marginTop: '1.35rem',
          marginBottom: 0,
          fontSize: '16.5px',
          fontWeight: 700,
          color: '#000000',
          letterSpacing: '-0.02em',
          textAlign: 'center',
          lineHeight: 1.3,
        }}
      >
        {text}
      </p>

      {/* Optional Secondary Context Note */}
      {subtext && (
        <p
          style={{
            marginTop: '0.4rem',
            marginBottom: 0,
            fontSize: '13.5px',
            fontWeight: 500,
            color: '#71717A',
            letterSpacing: '-0.01em',
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  );
}
