'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Desktop dropdown state: 'products' | 'solutions' | 'pricing' | 'resources' | null
  const [desktopDropdown, setDesktopDropdown] = useState<'products' | 'solutions' | 'pricing' | 'resources' | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile expandable sub-sections
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [isMobileSolutionsOpen, setIsMobileSolutionsOpen] = useState(false);

  const handleDropdownEnter = (type: 'products' | 'solutions' | 'pricing' | 'resources') => {
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
        .nav-link-btn {
          font-family: 'Inter', sans-serif !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          color: #000000 !important;
          background: transparent !important;
          border: none !important;
          cursor: pointer !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 4px !important;
          padding: 6px 0 !important;
          transition: opacity 0.15s ease !important;
          text-decoration: none !important;
          outline: none !important;
        }
        .nav-link-btn:hover {
          opacity: 0.65 !important;
        }
        @media (max-width: 900px) {
          .desktop-nav-group {
            display: none !important;
          }
          .mobile-burger-btn {
            display: flex !important;
          }
        }
      `}</style>

      {/* Fixed Navbar with Exact Height 58px */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '58px',
          zIndex: 1000,
          backgroundColor: isMenuOpen ? 'transparent' : isScrolled ? '#FFFFFF' : 'transparent',
          borderBottom: isMenuOpen ? 'none' : isScrolled ? '1px solid #F3F4F6' : '1px solid transparent',
          boxShadow: isScrolled && !isMenuOpen ? '0 1px 4px rgba(0, 0, 0, 0.04)' : 'none',
          backdropFilter: isScrolled && !isMenuOpen ? 'blur(8px)' : 'none',
          WebkitBackdropFilter: isScrolled && !isMenuOpen ? 'blur(8px)' : 'none',
          transition: 'background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            width: '100%',
            height: '100%',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          {/* Left: Brand Name */}
          <Link
            href="/"
            onClick={closeMenu}
            style={{
              textDecoration: 'none',
              zIndex: 1002,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: '20px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: isMenuOpen ? '#FFFFFF' : '#000000',
                fontFamily: "'Inter', sans-serif",
                transition: 'color 0.2s ease',
              }}
            >
              Nuradesk
            </span>
          </Link>

          {/* Middle: Desktop Navigation Links (Centered, Text 14, Inter Font) */}
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
            {/* Products Dropdown */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => handleDropdownEnter('products')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                className="nav-link-btn"
                onClick={() => setDesktopDropdown(desktopDropdown === 'products' ? null : 'products')}
              >
                <span>Products</span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: desktopDropdown === 'products' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {desktopDropdown === 'products' && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: '-12px',
                    width: '280px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '0.5rem',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
                    border: '1px solid #ECECEE',
                    zIndex: 1010,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    animation: 'navFadeIn 0.16s ease',
                  }}
                >
                  <Link
                    href="/pos-main"
                    onClick={() => setDesktopDropdown(null)}
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      color: '#000000',
                      display: 'block',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F4F4F6'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Fast POS Register</div>
                    <div style={{ fontSize: '12px', color: '#71717A', marginTop: '2px' }}>
                      1.2s split checks, card &amp; cash transactions
                    </div>
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setDesktopDropdown(null)}
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      color: '#000000',
                      display: 'block',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F4F4F6'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Real-Time Inventory</div>
                    <div style={{ fontSize: '12px', color: '#71717A', marginTop: '2px' }}>
                      Stock decrements, low-stock alerts, &amp; POs
                    </div>
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setDesktopDropdown(null)}
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      color: '#000000',
                      display: 'block',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F4F4F6'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Business Analytics</div>
                    <div style={{ fontSize: '12px', color: '#71717A', marginTop: '2px' }}>
                      Sales trends, profit margin charts, &amp; reports
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => handleDropdownEnter('solutions')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                className="nav-link-btn"
                onClick={() => setDesktopDropdown(desktopDropdown === 'solutions' ? null : 'solutions')}
              >
                <span>Solutions</span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: desktopDropdown === 'solutions' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {desktopDropdown === 'solutions' && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: '-12px',
                    width: '280px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '0.5rem',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
                    border: '1px solid #ECECEE',
                    zIndex: 1010,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    animation: 'navFadeIn 0.16s ease',
                  }}
                >
                  <Link
                    href="/pos-main"
                    onClick={() => setDesktopDropdown(null)}
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      color: '#000000',
                      display: 'block',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F4F4F6'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Cafes &amp; Coffee Bars</div>
                    <div style={{ fontSize: '12px', color: '#71717A', marginTop: '2px' }}>
                      Fast order modifiers &amp; split checks
                    </div>
                  </Link>
                  <Link
                    href="/pos-main"
                    onClick={() => setDesktopDropdown(null)}
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      color: '#000000',
                      display: 'block',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F4F4F6'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Retail &amp; Boutiques</div>
                    <div style={{ fontSize: '12px', color: '#71717A', marginTop: '2px' }}>
                      Barcode scanners &amp; inventory matrices
                    </div>
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setDesktopDropdown(null)}
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      color: '#000000',
                      display: 'block',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F4F4F6'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Bakeries &amp; Restaurants</div>
                    <div style={{ fontSize: '12px', color: '#71717A', marginTop: '2px' }}>
                      Table layouts, shifts, and kitchen tokens
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Pricing Dropdown / Link */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => handleDropdownEnter('pricing')}
              onMouseLeave={handleDropdownLeave}
            >
              <Link
                href="#pricing"
                className="nav-link-btn"
                onClick={() => setDesktopDropdown(null)}
              >
                <span>Pricing</span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </Link>
            </div>

            {/* Resources / FAQ Dropdown */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => handleDropdownEnter('resources')}
              onMouseLeave={handleDropdownLeave}
            >
              <Link
                href="#faq"
                className="nav-link-btn"
                onClick={() => setDesktopDropdown(null)}
              >
                <span>Resources</span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </Link>
            </div>
          </nav>

          {/* Right: Button width: 109px, height: 31px, border-radius: 4px, background: #000 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 1002, flexShrink: 0 }}>
            <Link
              href="/signup"
              style={{
                width: '109px',
                height: '31px',
                borderRadius: '4px',
                backgroundColor: '#000000',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                border: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box',
                transition: 'opacity 0.15s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              Create account
            </Link>

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
                width: '36px',
                height: '36px',
                backgroundColor: isMenuOpen ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                zIndex: 1002,
                padding: 0,
                outline: 'none',
                transition: 'background-color 0.2s ease',
              }}
            >
              <span
                style={{
                  display: 'block',
                  width: '20px',
                  height: '2px',
                  backgroundColor: isMenuOpen ? '#FFFFFF' : '#000000',
                  borderRadius: '1px',
                  transition: 'transform 0.25s ease, background-color 0.25s ease',
                  transform: isMenuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
                }}
              />
              <span
                style={{
                  display: 'block',
                  width: '20px',
                  height: '2px',
                  backgroundColor: isMenuOpen ? '#FFFFFF' : '#000000',
                  borderRadius: '1px',
                  margin: '4px 0',
                  transition: 'opacity 0.2s ease, background-color 0.25s ease',
                  opacity: isMenuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: 'block',
                  width: '20px',
                  height: '2px',
                  backgroundColor: isMenuOpen ? '#FFFFFF' : '#000000',
                  borderRadius: '1px',
                  transition: 'transform 0.25s ease, background-color 0.25s ease',
                  transform: isMenuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          backgroundColor: '#000000',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingTop: '4.75rem',
          paddingBottom: '2.5rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          boxSizing: 'border-box',
          overflowY: 'auto',
          transform: isMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
          opacity: isMenuOpen ? 1 : 0,
          visibility: isMenuOpen ? 'visible' : 'hidden',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, visibility 0.3s',
          fontFamily: "'Inter', sans-serif",
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
          <nav
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.1rem',
            }}
          >
            <div>
              <div
                onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>Products</span>
                <span style={{ transform: isMobileProductsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                  ⌄
                </span>
              </div>
              {isMobileProductsOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingLeft: '0.85rem', marginTop: '0.65rem' }}>
                  <Link href="/pos-main" onClick={closeMenu} style={{ color: '#D4D4D8', textDecoration: 'none', fontSize: '0.92rem' }}>
                    Fast POS Register
                  </Link>
                  <Link href="/dashboard" onClick={closeMenu} style={{ color: '#D4D4D8', textDecoration: 'none', fontSize: '0.92rem' }}>
                    Real-Time Inventory
                  </Link>
                </div>
              )}
            </div>

            <div>
              <div
                onClick={() => setIsMobileSolutionsOpen(!isMobileSolutionsOpen)}
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>Solutions</span>
                <span style={{ transform: isMobileSolutionsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                  ⌄
                </span>
              </div>
              {isMobileSolutionsOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingLeft: '0.85rem', marginTop: '0.65rem' }}>
                  <Link href="/pos-main" onClick={closeMenu} style={{ color: '#D4D4D8', textDecoration: 'none', fontSize: '0.92rem' }}>
                    Cafes &amp; Coffee Bars
                  </Link>
                  <Link href="/signup" onClick={closeMenu} style={{ color: '#D4D4D8', textDecoration: 'none', fontSize: '0.92rem' }}>
                    Retail &amp; Boutiques
                  </Link>
                </div>
              )}
            </div>

            <Link href="#pricing" onClick={closeMenu} style={{ fontSize: '1.15rem', fontWeight: 600, color: '#FFFFFF', textDecoration: 'none' }}>
              Pricing
            </Link>
            <Link href="#faq" onClick={closeMenu} style={{ fontSize: '1.15rem', fontWeight: 600, color: '#FFFFFF', textDecoration: 'none' }}>
              Resources &amp; FAQ
            </Link>
          </nav>

          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              href="/signup"
              onClick={closeMenu}
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '4px',
                backgroundColor: '#FFFFFF',
                color: '#000000',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              Create account
            </Link>
            <Link
              href="/signin"
              onClick={closeMenu}
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                border: '1px solid #444',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
