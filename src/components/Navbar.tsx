'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Desktop dropdown state: 'solutions' | 'features' | null
  const [desktopDropdown, setDesktopDropdown] = useState<'solutions' | 'features' | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile expandable sub-sections
  const [isMobileSolutionsOpen, setIsMobileSolutionsOpen] = useState(false);
  const [isMobileFeaturesOpen, setIsMobileFeaturesOpen] = useState(false);

  const handleDropdownEnter = (type: 'solutions' | 'features') => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setDesktopDropdown(type);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDesktopDropdown(null);
    }, 160);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when full-screen mobile menu is open
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
      if (e.key === 'Escape') {
        if (isMenuOpen) setIsMenuOpen(false);
        setDesktopDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setDesktopDropdown(null);
  };

  return (
    <>
      <style>{`
        @keyframes navFadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .nav-link-item {
          color: #374151 !important;
          transition: color 0.15s ease !important;
        }
        .nav-link-item:hover {
          color: #000000 !important;
        }
        @media (max-width: 980px) {
          .desktop-nav-group {
            display: none !important;
          }
          .desktop-auth-group {
            display: none !important;
          }
          .mobile-burger-btn {
            display: flex !important;
          }
        }
      `}</style>

      {/* Permanently Fixed Navbar with 100% Solid White Background */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '64px',
          zIndex: 1000,
          backgroundColor: isMenuOpen ? 'transparent' : '#FFFFFF',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          borderBottom: isMenuOpen ? 'none' : '1px solid #E5E7EB',
          boxShadow: isScrolled && !isMenuOpen ? '0 2px 14px rgba(0, 0, 0, 0.05)' : 'none',
          transition: 'box-shadow 0.25s ease',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            width: '100%',
            height: '100%',
            margin: '0 auto',
            padding: '0 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          {/* Left: Brand Logo & Name */}
          <Link
            href="/"
            onClick={closeMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
              zIndex: 1002,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
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
                width={32}
                height={32}
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
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                color: isMenuOpen ? '#FFFFFF' : '#000000',
                transition: 'color 0.3s ease',
              }}
            >
              Nuradesk
            </span>
          </Link>

          {/* Middle: Desktop Navigation Links (Centered) */}
          <nav
            className="desktop-nav-group"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
              {/* Solutions Dropdown */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => handleDropdownEnter('solutions')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  onClick={() => setDesktopDropdown(desktopDropdown === 'solutions' ? null : 'solutions')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '0.4rem 0',
                    cursor: 'pointer',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: desktopDropdown === 'solutions' ? '#000000' : '#374151',
                    fontFamily: 'inherit',
                    transition: 'color 0.15s ease',
                    outline: 'none',
                  }}
                >
                  <span>Solutions</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transform: desktopDropdown === 'solutions' ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Solutions Dropdown Menu */}
                {desktopDropdown === 'solutions' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: '-12px',
                      width: '300px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      padding: '0.55rem',
                      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.1), 0 2px 10px rgba(0, 0, 0, 0.04)',
                      border: '1px solid #ECECEE',
                      zIndex: 1010,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                      animation: 'navFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <Link
                      href="#solutions"
                      onClick={() => setDesktopDropdown(null)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '9px',
                        textDecoration: 'none',
                        color: '#0A0A0A',
                        display: 'block',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F4F4F6'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Cafes &amp; Coffee Bars</div>
                      <div style={{ fontSize: '0.78rem', color: '#71717A', marginTop: '2px' }}>
                        Rapid drink modifiers, split checks &amp; barista dispatch
                      </div>
                    </Link>
                    <Link
                      href="#solutions"
                      onClick={() => setDesktopDropdown(null)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '9px',
                        textDecoration: 'none',
                        color: '#0A0A0A',
                        display: 'block',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F4F4F6'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Retail &amp; Boutiques</div>
                      <div style={{ fontSize: '0.78rem', color: '#71717A', marginTop: '2px' }}>
                        Barcode scanner lookups, size &amp; color variant matrix
                      </div>
                    </Link>
                    <Link
                      href="#solutions"
                      onClick={() => setDesktopDropdown(null)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '9px',
                        textDecoration: 'none',
                        color: '#0A0A0A',
                        display: 'block',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F4F4F6'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Bakeries &amp; Delis</div>
                      <div style={{ fontSize: '0.78rem', color: '#71717A', marginTop: '2px' }}>
                        Daily morning bake tracking &amp; weight-based pricing
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Features Dropdown */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => handleDropdownEnter('features')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  onClick={() => setDesktopDropdown(desktopDropdown === 'features' ? null : 'features')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '0.4rem 0',
                    cursor: 'pointer',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: desktopDropdown === 'features' ? '#000000' : '#374151',
                    fontFamily: 'inherit',
                    transition: 'color 0.15s ease',
                    outline: 'none',
                  }}
                >
                  <span>Features</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transform: desktopDropdown === 'features' ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Features Dropdown Menu */}
                {desktopDropdown === 'features' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: '-12px',
                      width: '300px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      padding: '0.55rem',
                      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.1), 0 2px 10px rgba(0, 0, 0, 0.04)',
                      border: '1px solid #ECECEE',
                      zIndex: 1010,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                      animation: 'navFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <Link
                      href="/pos-main"
                      onClick={() => setDesktopDropdown(null)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '9px',
                        textDecoration: 'none',
                        color: '#0A0A0A',
                        display: 'block',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F4F4F6'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>1.2s Fast POS Billing</div>
                      <div style={{ fontSize: '0.78rem', color: '#71717A', marginTop: '2px' }}>
                        Ultra-fast counter register with split payments
                      </div>
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setDesktopDropdown(null)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '9px',
                        textDecoration: 'none',
                        color: '#0A0A0A',
                        display: 'block',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F4F4F6'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Real-Time Inventory</div>
                      <div style={{ fontSize: '0.78rem', color: '#71717A', marginTop: '2px' }}>
                        Low-stock alerts, SKU matrices &amp; automatic decrement
                      </div>
                    </Link>
                    <Link
                      href="/manager"
                      onClick={() => setDesktopDropdown(null)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '9px',
                        textDecoration: 'none',
                        color: '#0A0A0A',
                        display: 'block',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F4F4F6'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Kitchen &amp; Barista Display</div>
                      <div style={{ fontSize: '0.78rem', color: '#71717A', marginTop: '2px' }}>
                        Wireless ticket routing and order status boards
                      </div>
                    </Link>
                    <Link
                      href="/manager"
                      onClick={() => setDesktopDropdown(null)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '9px',
                        textDecoration: 'none',
                        color: '#0A0A0A',
                        display: 'block',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F4F4F6'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Cash Drawer &amp; Shifts</div>
                      <div style={{ fontSize: '0.78rem', color: '#71717A', marginTop: '2px' }}>
                        Staff clock-ins and drawer audit reconciliation
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* How it Works */}
              <Link
                href="#workflow"
                className="nav-link-item"
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                How It Works
              </Link>

              {/* Pricing */}
              <Link
                href="#pricing"
                className="nav-link-item"
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Pricing
              </Link>

              {/* FAQ */}
              <Link
                href="#faq"
                className="nav-link-item"
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                FAQ
              </Link>
            </nav>

          {/* Right: Auth Buttons (Desktop) + Hamburger (Mobile) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 1002, flexShrink: 0 }}>
            <div className="desktop-auth-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link
                href="/signin"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.52rem 1.05rem',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D4D4D8',
                  color: '#18181B',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                  transition: 'background-color 0.15s ease, border-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F4F4F5';
                  e.currentTarget.style.borderColor = '#A1A1AA';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#D4D4D8';
                }}
              >
                Log in
              </Link>

              <Link
                href="/signup"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.52rem 1.15rem',
                  borderRadius: '8px',
                  backgroundColor: '#09090B',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                  border: 'none',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#27272A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#09090B';
                }}
              >
                Start Free Trial
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="mobile-burger-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              style={{
                display: 'none',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '40px',
                height: '40px',
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
              {/* Top Bar */}
              <span
                style={{
                  display: 'block',
                  width: '24px',
                  height: '2.5px',
                  backgroundColor: isMenuOpen ? '#FFFFFF' : '#000000',
                  borderRadius: '2px',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease',
                  transform: isMenuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                }}
              />
              {/* Middle Bar */}
              <span
                style={{
                  display: 'block',
                  width: '24px',
                  height: '2.5px',
                  backgroundColor: isMenuOpen ? '#FFFFFF' : '#000000',
                  borderRadius: '2px',
                  margin: '4.5px 0',
                  transition: 'opacity 0.2s ease, background-color 0.3s ease',
                  opacity: isMenuOpen ? 0 : 1,
                }}
              />
              {/* Bottom Bar */}
              <span
                style={{
                  display: 'block',
                  width: '24px',
                  height: '2.5px',
                  backgroundColor: isMenuOpen ? '#FFFFFF' : '#000000',
                  borderRadius: '2px',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease',
                  transform: isMenuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
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
          paddingTop: '5.25rem',
          paddingBottom: '2.5rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          boxSizing: 'border-box',
          overflowY: 'auto',
          transform: isMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
          opacity: isMenuOpen ? 1 : 0,
          visibility: isMenuOpen ? 'visible' : 'hidden',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, visibility 0.4s',
          fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
        }}
      >
        <div
          style={{
            maxWidth: '520px',
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* Main Navigation Links */}
          <nav
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.1rem',
            }}
          >
            {/* Mobile Solutions Accordion */}
            <div>
              <div
                onClick={() => setIsMobileSolutionsOpen(!isMobileSolutionsOpen)}
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  userSelect: 'none',
                }}
              >
                <span>Solutions</span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: isMobileSolutionsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
              {isMobileSolutionsOpen && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    paddingLeft: '1rem',
                    marginTop: '0.75rem',
                    borderLeft: '2px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Link href="#solutions" onClick={closeMenu} style={{ color: '#D4D4D8', textDecoration: 'none', fontSize: '0.98rem' }}>
                    Cafes &amp; Coffee Bars
                  </Link>
                  <Link href="#solutions" onClick={closeMenu} style={{ color: '#D4D4D8', textDecoration: 'none', fontSize: '0.98rem' }}>
                    Retail &amp; Boutiques
                  </Link>
                  <Link href="#solutions" onClick={closeMenu} style={{ color: '#D4D4D8', textDecoration: 'none', fontSize: '0.98rem' }}>
                    Bakeries &amp; Delis
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Features Accordion */}
            <div>
              <div
                onClick={() => setIsMobileFeaturesOpen(!isMobileFeaturesOpen)}
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  userSelect: 'none',
                }}
              >
                <span>Features</span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: isMobileFeaturesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
              {isMobileFeaturesOpen && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    paddingLeft: '1rem',
                    marginTop: '0.75rem',
                    borderLeft: '2px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Link href="/pos-main" onClick={closeMenu} style={{ color: '#D4D4D8', textDecoration: 'none', fontSize: '0.98rem' }}>
                    1.2s Fast POS Billing
                  </Link>
                  <Link href="/admin" onClick={closeMenu} style={{ color: '#D4D4D8', textDecoration: 'none', fontSize: '0.98rem' }}>
                    Real-Time Inventory &amp; Stock
                  </Link>
                  <Link href="/manager" onClick={closeMenu} style={{ color: '#D4D4D8', textDecoration: 'none', fontSize: '0.98rem' }}>
                    Kitchen &amp; Barista Screen
                  </Link>
                  <Link href="/manager" onClick={closeMenu} style={{ color: '#D4D4D8', textDecoration: 'none', fontSize: '0.98rem' }}>
                    Cash Drawer &amp; Shift Audit
                  </Link>
                </div>
              )}
            </div>

            {/* How It Works */}
            <Link
              href="#workflow"
              onClick={closeMenu}
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#FFFFFF',
                textDecoration: 'none',
                letterSpacing: '-0.02em',
              }}
            >
              How It Works
            </Link>

            {/* Pricing */}
            <Link
              href="#pricing"
              onClick={closeMenu}
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#FFFFFF',
                textDecoration: 'none',
                letterSpacing: '-0.02em',
              }}
            >
              Pricing
            </Link>

            {/* FAQ */}
            <Link
              href="#faq"
              onClick={closeMenu}
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#FFFFFF',
                textDecoration: 'none',
                letterSpacing: '-0.02em',
              }}
            >
              FAQ
            </Link>
          </nav>
        </div>

        {/* Bottom Actions: Log in & Start Free Trial */}
        <div
          style={{
            maxWidth: '520px',
            width: '100%',
            margin: '0 auto',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <Link
            href="/signin"
            onClick={closeMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.75rem',
              borderRadius: '9px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              fontSize: '0.95rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Log in
          </Link>

          <Link
            href="/signup"
            onClick={closeMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.8rem',
              borderRadius: '9px',
              backgroundColor: '#FFFFFF',
              color: '#000000',
              fontSize: '0.95rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </>
  );
}
