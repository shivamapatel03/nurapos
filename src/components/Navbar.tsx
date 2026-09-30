'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSolutionsExpanded, setIsSolutionsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when full-screen menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: isMenuOpen
            ? 'transparent'
            : isScrolled
            ? 'rgba(255, 255, 255, 0.96)'
            : '#FFFFFF',
          backdropFilter: isMenuOpen ? 'none' : 'blur(12px)',
          WebkitBackdropFilter: isMenuOpen ? 'none' : 'blur(12px)',
          borderBottom: isScrolled && !isMenuOpen ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid transparent',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
          width: '100%',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '1.15rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand Logo & Name */}
          <Link
            href="/"
            onClick={closeMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
              zIndex: 1002,
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                position: 'relative',
                borderRadius: '9999px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Image
                src="/logo.png"
                alt="Nuradesk Logo"
                width={34}
                height={34}
                priority
                style={{
                  objectFit: 'contain',
                  filter: isMenuOpen ? 'brightness(0) invert(1)' : 'none',
                  transition: 'filter 0.3s ease',
                }}
              />
            </div>
            <span
              style={{
                fontSize: '1.3rem',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                color: isMenuOpen ? '#FFFFFF' : '#000000',
                transition: 'color 0.3s ease',
                fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
              }}
            >
              Nuradesk
            </span>
          </Link>

          {/* Big & Dark Hamburger Menu Button (Morphs to Close Button 'X' when Open) */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '46px',
              height: '46px',
              backgroundColor: isMenuOpen ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              zIndex: 1002,
              padding: 0,
              outline: 'none',
              transition: 'background-color 0.2s ease',
            }}
          >
            {/* Top Bar: Big & Dark */}
            <span
              style={{
                display: 'block',
                width: '28px',
                height: '3px',
                backgroundColor: isMenuOpen ? '#FFFFFF' : '#000000',
                borderRadius: '3px',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease',
                transform: isMenuOpen ? 'translateY(8px) rotate(45deg)' : 'none',
              }}
            />
            {/* Middle Bar: Big & Dark */}
            <span
              style={{
                display: 'block',
                width: '28px',
                height: '3px',
                backgroundColor: isMenuOpen ? '#FFFFFF' : '#000000',
                borderRadius: '3px',
                margin: '5px 0',
                transition: 'opacity 0.2s ease, background-color 0.3s ease',
                opacity: isMenuOpen ? 0 : 1,
              }}
            />
            {/* Bottom Bar: Big & Dark */}
            <span
              style={{
                display: 'block',
                width: '28px',
                height: '3px',
                backgroundColor: isMenuOpen ? '#FFFFFF' : '#000000',
                borderRadius: '3px',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease',
                transform: isMenuOpen ? 'translateY(-8px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </header>

      {/* Big & Dark Full-Screen Dropdown Menu Overlay */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          backgroundColor: '#09090B',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingTop: '6.5rem',
          paddingBottom: '3rem',
          paddingLeft: 'clamp(1.5rem, 5vw, 3rem)',
          paddingRight: 'clamp(1.5rem, 5vw, 3rem)',
          boxSizing: 'border-box',
          overflowY: 'auto',
          transform: isMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
          opacity: isMenuOpen ? 1 : 0,
          visibility: isMenuOpen ? 'visible' : 'hidden',
          transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease, visibility 0.45s',
          fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
        }}
      >
        <div
          style={{
            maxWidth: '920px',
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          {/* Main Navigation Links */}
          <nav
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}
          >
            <Link
              href="#features"
              onClick={closeMenu}
              style={{
                fontSize: 'clamp(1.4rem, 3.2vw, 2rem)',
                fontWeight: 700,
                color: '#FFFFFF',
                textDecoration: 'none',
                letterSpacing: '-0.03em',
                transition: 'color 0.15s ease',
                display: 'inline-block',
                width: 'fit-content',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#9CA3AF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
            >
              Product
            </Link>

            {/* Solutions Expandable */}
            <div>
              <div
                onClick={() => setIsSolutionsExpanded(!isSolutionsExpanded)}
                style={{
                  fontSize: 'clamp(1.4rem, 3.2vw, 2rem)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '-0.03em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  width: 'fit-content',
                  userSelect: 'none',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#9CA3AF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
              >
                <span>Solutions</span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isSolutionsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>

              <div
                style={{
                  paddingLeft: '1.25rem',
                  marginTop: isSolutionsExpanded ? '0.65rem' : '0px',
                  marginBottom: isSolutionsExpanded ? '0.4rem' : '0px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  borderLeft: '2px solid rgba(255, 255, 255, 0.18)',
                  maxHeight: isSolutionsExpanded ? '220px' : '0px',
                  opacity: isSolutionsExpanded ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, margin 0.25s ease',
                }}
              >
                <Link
                  href="#pos"
                  onClick={closeMenu}
                  style={{ fontSize: '0.95rem', color: '#D4D4D8', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#D4D4D8'; }}
                >
                  Quick Retail Register
                </Link>
                <Link
                  href="#inventory"
                  onClick={closeMenu}
                  style={{ fontSize: '0.95rem', color: '#D4D4D8', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#D4D4D8'; }}
                >
                  Real-time Inventory
                </Link>
                <Link
                  href="#reports"
                  onClick={closeMenu}
                  style={{ fontSize: '0.95rem', color: '#D4D4D8', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#D4D4D8'; }}
                >
                  Reports &amp; Sales Analytics
                </Link>
                <Link
                  href="#orders"
                  onClick={closeMenu}
                  style={{ fontSize: '0.95rem', color: '#D4D4D8', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#D4D4D8'; }}
                >
                  Table &amp; Food Order Dispatch
                </Link>
              </div>
            </div>

            <Link
              href="#pricing"
              onClick={closeMenu}
              style={{
                fontSize: 'clamp(1.4rem, 3.2vw, 2rem)',
                fontWeight: 700,
                color: '#FFFFFF',
                textDecoration: 'none',
                letterSpacing: '-0.03em',
                transition: 'color 0.15s ease',
                display: 'inline-block',
                width: 'fit-content',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#9CA3AF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
            >
              Pricing
            </Link>

            <Link
              href="#faq"
              onClick={closeMenu}
              style={{
                fontSize: 'clamp(1.4rem, 3.2vw, 2rem)',
                fontWeight: 700,
                color: '#FFFFFF',
                textDecoration: 'none',
                letterSpacing: '-0.03em',
                transition: 'color 0.15s ease',
                display: 'inline-block',
                width: 'fit-content',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#9CA3AF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
            >
              FAQ
            </Link>

            <Link
              href="#support"
              onClick={closeMenu}
              style={{
                fontSize: 'clamp(1.4rem, 3.2vw, 2rem)',
                fontWeight: 700,
                color: '#FFFFFF',
                textDecoration: 'none',
                letterSpacing: '-0.03em',
                transition: 'color 0.15s ease',
                display: 'inline-block',
                width: 'fit-content',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#9CA3AF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
            >
              Support
            </Link>
          </nav>
        </div>

        {/* Bottom Actions: Sign In & Get Started Button */}
        <div
          style={{
            maxWidth: '920px',
            width: '100%',
            margin: '0 auto',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ fontSize: '15px', color: '#A1A1AA', fontWeight: 500 }}>
              Already using Nuradesk?
            </span>
            <Link
              href="/signin"
              onClick={closeMenu}
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#FFFFFF',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
              }}
            >
              Sign In
            </Link>
          </div>

          <Link
            href="/signup"
            onClick={closeMenu}
            className="button-20 button-20-white"
            role="button"
          >
            Get started
          </Link>
        </div>
      </div>
    </>
  );
}
