'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getSvgPath } from 'figma-squircle';
import TextMotion from './TextMotion';

// Easily customize or edit the statement text here anytime
const STATEMENT_TEXT =
  'Everything your store needs to sell, manage, and scale — all in one place.';

interface EditorialStatementProps {
  text?: string;
}

export default function EditorialStatement({ text = STATEMENT_TEXT }: EditorialStatementProps) {
  // Pre-calculate exact 100% corner smoothing iOS squircle path (80x80, r=18, smoothing=1.0)
  const squirclePath = useMemo(() => {
    return getSvgPath({
      width: 80,
      height: 80,
      cornerRadius: 18,
      cornerSmoothing: 1, // 100% iOS continuous curvature
    });
  }, []);

  return (
    <section
      id="editorial-manifesto"
      style={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        width: '100%',
        padding: 'clamp(2.5rem, 4.5vw, 4rem) 1.5rem',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '860px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Animated Headline */}
        <div style={{ maxWidth: '820px', width: '100%' }}>
          <TextMotion
            as="h2"
            text={text}
            duration={0.6}
            stagger={0.04}
            y={18}
            threshold={0.25}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(1.5rem, 2.6vw, 2.25rem)',
              fontWeight: 600,
              lineHeight: 1.35,
              letterSpacing: '-0.025em',
              margin: 0,
              color: '#000000',
            }}
          />
        </div>

        {/* Feature Cards Row: Billing, Reports, Inventory, Sales (Compact 80x80, No Shadow, 100% iOS Squircle) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            marginTop: 'clamp(2rem, 3.5vw, 2.75rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(12px, 2.2vw, 22px)',
            flexWrap: 'wrap',
            width: '100%',
          }}
        >
          {/* 1. Billing */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                color: '#000000',
                letterSpacing: '-0.015em',
              }}
            >
              Billing
            </span>
            <div
              style={{
                width: '80px',
                height: '80px',
                boxShadow: 'none',
                filter: 'none',
                cursor: 'default',
              }}
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                style={{ width: '80px', height: '80px', display: 'block' }}
              >
                <path d={squirclePath} fill="#F96A38" />
                <rect x="16" y="20" width="48" height="7" rx="3.5" fill="white" />
                <rect x="16" y="31" width="48" height="7" rx="3.5" fill="white" />
                <rect x="16" y="42" width="48" height="7" rx="3.5" fill="white" />
                <rect x="16" y="53" width="30" height="7" rx="3.5" fill="white" />
              </svg>
            </div>
          </div>

          {/* 2. Reports */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                color: '#000000',
                letterSpacing: '-0.015em',
              }}
            >
              Reports
            </span>
            <div
              style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none',
                filter: 'none',
                cursor: 'default',
              }}
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              >
                <path d={squirclePath} fill="#9E8EBD" />
              </svg>
              <Image
                src="/icons/report.png"
                alt="Reports"
                width={36}
                height={36}
                priority
                style={{
                  width: '36px',
                  height: '36px',
                  objectFit: 'contain',
                  display: 'block',
                  position: 'relative',
                  zIndex: 1,
                }}
              />
            </div>
          </div>

          {/* 3. Inventory */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                color: '#000000',
                letterSpacing: '-0.015em',
              }}
            >
              Inventory
            </span>
            <div
              style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none',
                filter: 'none',
                cursor: 'default',
              }}
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              >
                <path d={squirclePath} fill="#4688F9" />
              </svg>
              <Image
                src="/icons/inventory.png"
                alt="Inventory"
                width={36}
                height={36}
                priority
                style={{
                  width: '36px',
                  height: '36px',
                  objectFit: 'contain',
                  display: 'block',
                  position: 'relative',
                  zIndex: 1,
                }}
              />
            </div>
          </div>

          {/* 4. Sales */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                color: '#000000',
                letterSpacing: '-0.015em',
              }}
            >
              Sales
            </span>
            <div
              style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none',
                filter: 'none',
                cursor: 'default',
              }}
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              >
                <path d={squirclePath} fill="#64D38C" />
              </svg>
              <Image
                src="/icons/discount.png"
                alt="Sales"
                width={36}
                height={36}
                priority
                style={{
                  width: '36px',
                  height: '36px',
                  objectFit: 'contain',
                  display: 'block',
                  position: 'relative',
                  zIndex: 1,
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
