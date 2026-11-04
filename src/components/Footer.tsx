'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const BRAND_NAME = 'Nuradesk';

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'POS Billing', href: '/pos-main' },
      { label: 'Inventory Management', href: '/dashboard' },
      { label: 'Sales & Analytics', href: '/dashboard' },
      { label: 'Floor & Table Layouts', href: '/pos-main' },
      { label: 'Pricing Plans', href: '#pricing' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Cafés & Coffee Bars', href: '#features-accordion' },
      { label: 'Retail & Boutiques', href: '#features-accordion' },
      { label: 'Bakeries & Delis', href: '#features-accordion' },
      { label: 'Quick Service Food', href: '#features-accordion' },
      { label: 'Multi-Outlet Stores', href: '#features-accordion' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Frequently Asked Questions', href: '#faq' },
      { label: 'Hardware Compatibility', href: '#faq' },
      { label: 'Free Trial Setup', href: '/signup' },
      { label: 'Cashier Terminal Login', href: '/pos-login' },
      { label: 'Store Owner Portal', href: '/signin' },
    ],
  },
];

export default function Footer() {
  const signatureRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    const node = signatureRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Reset so user can re-trigger on subsequent scroll
          setIsVisible(false);
          setTypedText('');
          setIsTypingDone(false);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    // Allow wheel to start rolling up from below before typing begins
    timeoutId = setTimeout(() => {
      let charIdx = 1;
      setTypedText(BRAND_NAME.slice(0, 1));

      intervalId = setInterval(() => {
        if (charIdx <= BRAND_NAME.length) {
          setTypedText(BRAND_NAME.slice(0, charIdx));
          charIdx++;
        } else {
          setIsTypingDone(true);
          clearInterval(intervalId);
        }
      }, 75);
    }, 350);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [isVisible]);

  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        color: '#000000',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid #E5E7EB',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(3.5rem, 6vw, 5rem) 1.5rem 2rem 1.5rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Top Grid: Brand Column + Navigation Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'clamp(2.5rem, 4vw, 4rem)',
            paddingBottom: 'clamp(3rem, 5vw, 4.5rem)',
          }}
        >
          {/* Brand & Description Column */}
          <div style={{ maxWidth: '340px' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                textDecoration: 'none',
                color: '#000000',
                marginBottom: '0.85rem',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  position: 'relative',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Nuradesk Logo"
                  width={28}
                  height={28}
                  style={{
                    objectFit: 'contain',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  letterSpacing: '-0.025em',
                  color: '#000000',
                }}
              >
                Nuradesk
              </span>
            </Link>

            <p
              style={{
                fontSize: '13px',
                lineHeight: 1.55,
                color: '#71717A',
                margin: 0,
                maxWidth: '310px',
                letterSpacing: '-0.01em',
              }}
            >
              Next-generation point of sale and store management.
            </p>
          </div>

          {/* Navigation Columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: '#000000',
                  margin: '0 0 1.25rem 0',
                }}
              >
                {col.title}
              </h4>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: '14px',
                        color: '#71717A',
                        textDecoration: 'none',
                        letterSpacing: '-0.01em',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#000000';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#71717A';
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Sub-bar: Copyright, Legal & Social */}
        <div
          style={{
            borderTop: '1px solid #E5E7EB',
            paddingTop: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
          }}
        >
          {/* Left: Copyright */}
          <div
            style={{
              fontSize: '13px',
              color: '#71717A',
              letterSpacing: '-0.01em',
            }}
          >
            © {new Date().getFullYear()} Nuradesk. All rights reserved.
          </div>

          {/* Center: Legal Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            {[
              { label: 'Privacy', href: '#' },
              { label: 'Terms', href: '#' },
              { label: 'Security', href: '#' },
              { label: 'Support', href: '#faq' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  fontSize: '13px',
                  color: '#71717A',
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#000000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#71717A';
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right: Social Icons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.1rem',
            }}
          >
            {/* X / Twitter */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (formerly Twitter)"
              style={{
                color: '#71717A',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#71717A';
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{
                color: '#71717A',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#71717A';
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              style={{
                color: '#71717A',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#71717A';
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Modern Signature Typography with Rolling Wheel Logo + Typewriter Effect */}
      <div
        ref={signatureRef}
        aria-label="Nuradesk"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(10px, 2.5vw, 28px)',
          userSelect: 'none',
          pointerEvents: 'none',
          fontSize: 'clamp(48px, 12vw, 140px)',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          color: '#000000',
          paddingTop: '1.5rem',
          paddingBottom: '0.5rem',
          overflow: 'hidden',
        }}
      >
        {/* Rolling Wheel Logo */}
        <div
          style={{
            width: 'clamp(44px, 10vw, 115px)',
            height: 'clamp(44px, 10vw, 115px)',
            flexShrink: 0,
            position: 'relative',
            transform: isVisible
              ? 'translateY(0) rotate(0deg)'
              : 'translateY(120px) rotate(-360deg)',
            opacity: isVisible ? 1 : 0,
            transition: isVisible
              ? 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease-out'
              : 'none',
            willChange: 'transform, opacity',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            src="/logo.png"
            alt="Nuradesk Logo Mark"
            width={120}
            height={120}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

        {/* Typewriter Text Container */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            lineHeight: 0.9,
          }}
        >
          <span>{typedText || '\u00A0'}</span>
          <span
            style={{
              display: 'inline-block',
              width: 'clamp(3px, 0.6vw, 6px)',
              height: '0.82em',
              backgroundColor: '#000000',
              marginLeft: 'clamp(2px, 0.4vw, 6px)',
              verticalAlign: 'baseline',
              opacity: isVisible ? 1 : 0,
              animation: isVisible ? 'footerCursorBlink 0.8s infinite' : 'none',
              borderRadius: '2px',
            }}
          />
        </div>
      </div>
    </footer>
  );
}
