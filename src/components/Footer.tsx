'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const PRODUCT_LINKS = [
  { label: 'POS Billing', href: '/pos-main' },
  { label: 'Orders', href: '/manager' },
  { label: 'Inventory', href: '/admin' },
  { label: 'Analytics', href: '/admin' },
  { label: 'Payments', href: '#pricing' },
];

const SOLUTION_LINKS = [
  { label: 'Cafés', href: '#solutions' },
  { label: 'Restaurants', href: '#solutions' },
  { label: 'Retail', href: '#solutions' },
  { label: 'Bakeries', href: '#solutions' },
  { label: 'QSR', href: '#solutions' },
];

const RESOURCE_LINKS = [
  { label: 'Help Center', href: '#help' },
  { label: 'Documentation', href: '#docs' },
  { label: 'Blog', href: '#blog' },
  { label: 'FAQs', href: '#faq' },
  { label: 'Support', href: '#support' },
];

const COMPANY_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
  { label: 'Careers', href: '#careers' },
  { label: 'Partners', href: '#partners' },
  { label: 'Pricing', href: '#pricing' },
];

const LEGAL_LINKS = [
  { label: 'PRIVACY', href: '#privacy' },
  { label: 'TERMS', href: '#terms' },
  { label: 'SECURITY', href: '#security' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        color: '#18181B',
        fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(2.5rem, 5vw, 4rem) 1.5rem',
        }}
      >
        {/* ================================================================= */}
        {/* 1. TOP SECTION: BRAND & GET STARTED                               */}
        {/* ================================================================= */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1.5rem',
            paddingBottom: 'clamp(2rem, 4vw, 2.75rem)',
          }}
        >
          {/* Left: Brand Identity & Subtitles */}
          <div>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                textDecoration: 'none',
                color: '#000000',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  position: 'relative',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Nuradesk"
                  width={30}
                  height={30}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  letterSpacing: '-0.035em',
                  color: '#09090B',
                }}
              >
                Nuradesk
              </span>
            </Link>

            <h3
              style={{
                fontSize: '1.05rem',
                fontWeight: 600,
                color: '#18181B',
                letterSpacing: '-0.02em',
                marginTop: '0.65rem',
              }}
            >
              Run your business. Not your software.
            </h3>

            <p
              style={{
                fontSize: '0.9rem',
                color: '#71717A',
                marginTop: '0.2rem',
                letterSpacing: '-0.01em',
              }}
            >
              Simple POS &amp; business management.
            </p>
          </div>

          {/* Right: Get Started CTA Button */}
          <div>
            <Link
              href="/signup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.45rem',
                borderRadius: '9999px',
                backgroundColor: '#09090B',
                backgroundImage: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0))',
                border: '1px solid #27272A',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                transition: 'background-color 0.15s ease, transform 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#27272A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#09090B';
              }}
            >
              <span>Get Started</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. MIDDLE SECTION: 4 COLUMNS (PRODUCT, SOLUTIONS, RESOURCES, CO)   */}
        {/* ================================================================= */}
        <div
          style={{
            borderTop: '1px solid #E5E7EB',
            borderBottom: '1px solid #E5E7EB',
            paddingTop: 'clamp(2rem, 3.5vw, 2.75rem)',
            paddingBottom: 'clamp(2rem, 3.5vw, 2.75rem)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 'clamp(1.75rem, 3vw, 3rem)',
            }}
          >
            {/* Column 1: PRODUCT */}
            <div>
              <h4
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#09090B',
                  marginBottom: '1rem',
                }}
              >
                PRODUCT
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {PRODUCT_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: '0.875rem',
                        color: '#71717A',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#09090B'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#71717A'; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: SOLUTIONS */}
            <div>
              <h4
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#09090B',
                  marginBottom: '1rem',
                }}
              >
                SOLUTIONS
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {SOLUTION_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: '0.875rem',
                        color: '#71717A',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#09090B'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#71717A'; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: RESOURCES */}
            <div>
              <h4
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#09090B',
                  marginBottom: '1rem',
                }}
              >
                RESOURCES
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {RESOURCE_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: '0.875rem',
                        color: '#71717A',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#09090B'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#71717A'; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: COMPANY */}
            <div>
              <h4
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#09090B',
                  marginBottom: '1rem',
                }}
              >
                COMPANY
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {COMPANY_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: '0.875rem',
                        color: '#71717A',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#09090B'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#71717A'; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. BOTTOM SECTION: LEGAL & COPYRIGHT / SOCIAL ICONS               */}
        {/* ================================================================= */}
        <div
          style={{
            paddingTop: 'clamp(1.75rem, 3vw, 2.25rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* Sub-row: PRIVACY, TERMS, SECURITY, CONTACT */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#71717A',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#09090B'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#71717A'; }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Sub-row: Copyright & Social Icons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <p
              style={{
                fontSize: '0.85rem',
                color: '#71717A',
                letterSpacing: '-0.01em',
              }}
            >
              © 2026 Nuradesk
            </p>

            {/* Social Icons */}
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
                  transition: 'color 0.15s ease, transform 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#09090B'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#71717A'; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
                  transition: 'color 0.15s ease, transform 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#09090B'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#71717A'; }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
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
                  transition: 'color 0.15s ease, transform 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#09090B'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#71717A'; }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{
                  color: '#71717A',
                  display: 'inline-flex',
                  alignItems: 'center',
                  transition: 'color 0.15s ease, transform 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#09090B'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#71717A'; }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
