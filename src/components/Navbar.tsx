'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

export default function Navbar() {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E5E5E5',
      width: '100%',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo & Name */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
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
              width={38}
              height={38}
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>
          <span style={{
            fontSize: '1.35rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: '#000000',
          }}>
            Nuradesk
          </span>
          <span className="badge-rounded-outline" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
            POS
          </span>
        </Link>

        {/* Navigation Links */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '1.75rem',
        }} className="desktop-nav">
          <a href="#features" style={{
            fontSize: '0.9rem',
            fontWeight: 500,
            color: '#525252',
            transition: 'color 0.15s',
          }}>
            Features
          </a>
          <a href="#pos-demo" style={{
            fontSize: '0.9rem',
            fontWeight: 500,
            color: '#525252',
            transition: 'color 0.15s',
          }}>
            Terminal Demo
          </a>
          <a href="#inventory" style={{
            fontSize: '0.9rem',
            fontWeight: 500,
            color: '#525252',
            transition: 'color 0.15s',
          }}>
            Inventory
          </a>
          <a href="#architecture" style={{
            fontSize: '0.9rem',
            fontWeight: 500,
            color: '#525252',
            transition: 'color 0.15s',
          }}>
            .NET Backend Ready
          </a>
        </nav>

        {/* Action Buttons using .button-20 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Link
            href="/signin"
            className="button-20-secondary button-20-sm"
            role="button"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="button-20 button-20-sm button-20-3d"
            role="button"
          >
            <span>Sign Up</span>
            <ArrowForwardRoundedIcon sx={{ fontSize: 15 }} />
          </Link>
        </div>
      </div>
    </header>
  );
}
