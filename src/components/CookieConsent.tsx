'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'nuradesk_cookie_consent';

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) {
        // Small delay so it appears smoothly after the initial hero load
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } catch {
      // Graceful fallback if localStorage is disabled or restricted
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {}
    setIsOpen(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'declined');
    } catch {}
    setIsOpen(false);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="region"
          aria-label="Cookie consent banner"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96, transition: { duration: 0.2 } }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            bottom: 'clamp(16px, 3vw, 24px)',
            right: 'clamp(16px, 3vw, 24px)',
            zIndex: 9999,
            maxWidth: '390px',
            width: 'calc(100vw - 32px)',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow:
              '0 20px 40px -15px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.04)',
            padding: '18px 20px',
            boxSizing: 'border-box',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {/* Top content row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
            }}
          >
            {/* Cookie Icon (Only cookie PNG, no container background) */}
            <div
              style={{
                width: 48,
                height: 48,
                minWidth: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                backgroundColor: 'transparent',
              }}
            >
              <Image
                src="/icons/cookie.png"
                alt="Cookie icon"
                width={48}
                height={48}
                priority
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.08))',
                }}
              />
            </div>

            {/* Text description */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  marginBottom: '4px',
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#0A0A0A',
                    margin: 0,
                    letterSpacing: '-0.01em',
                  }}
                >
                  We use cookies
                </h3>

                {/* Dismiss button (X) */}
                <button
                  type="button"
                  onClick={handleDecline}
                  aria-label="Dismiss cookie notice"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '2px',
                    margin: '-4px -4px 0 0',
                    cursor: 'pointer',
                    color: '#9CA3AF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    transition: 'color 0.15s ease, background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#111827';
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#9CA3AF';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px',
                  lineHeight: 1.45,
                  color: '#6B7280',
                  margin: 0,
                }}
              >
                We use cookies to enhance your experience, analyze site usage, and improve our services.
              </p>
            </div>
          </div>

          {/* Action buttons row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '16px',
            }}
          >
            <button
              type="button"
              onClick={handleDecline}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                fontWeight: 500,
                color: '#4B5563',
                backgroundColor: 'transparent',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '7px 14px',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.color = '#111827';
                e.currentTarget.style.borderColor = '#D1D5DB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#4B5563';
                e.currentTarget.style.borderColor = '#E5E7EB';
              }}
            >
              Decline
            </button>

            <button
              type="button"
              onClick={handleAccept}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                fontWeight: 500,
                color: '#FFFFFF',
                backgroundColor: '#000000',
                border: '1px solid #000000',
                borderRadius: '8px',
                padding: '7px 18px',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                transition: 'background-color 0.15s ease, opacity 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#27272A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
              }}
            >
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

