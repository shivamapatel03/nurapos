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
  // Pre-calculate exact 100% corner smoothing iOS squircle path (120x120, r=28, smoothing=1.0)
  const squirclePath = useMemo(() => {
    return getSvgPath({
      width: 120,
      height: 120,
      cornerRadius: 28,
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
        padding: 'clamp(3rem, 5.5vw, 4.75rem) 1.5rem',
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

        {/* Feature Cards Row: Billing, Reports, Inventory, Sales (Compact 120x120, No Shadow, 100% iOS Squircle) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            marginTop: 'clamp(2.25rem, 3.8vw, 3.25rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(14px, 2.4vw, 24px)',
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
              gap: '12px',
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',
                letterSpacing: '-0.015em',
              }}
            >
              Billing
            </span>
            <div
              style={{
                width: '120px',
                height: '120px',
                boxShadow: 'none',
                filter: 'none',
                cursor: 'default',
              }}
            >
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                style={{ width: '100%', height: '100%', display: 'block' }}
              >
                <path d={squirclePath} fill="#F96A38" />
                <rect x="24" y="30" width="72" height="11" rx="5.5" fill="white" />
                <rect x="24" y="47" width="72" height="11" rx="5.5" fill="white" />
                <rect x="24" y="64" width="72" height="11" rx="5.5" fill="white" />
                <rect x="24" y="81" width="45" height="11" rx="5.5" fill="white" />
              </svg>
            </div>
          </div>

          {/* 2. Reports */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '16px',
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
                width: '120px',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none',
                filter: 'none',
                cursor: 'default',
              }}
            >
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              >
                <path d={squirclePath} fill="#9E8EBD" />
              </svg>
              <Image
                src="/icons/report.png"
                alt="Reports"
                width={54}
                height={54}
                priority
                style={{
                  width: '54px',
                  height: '54px',
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
              gap: '12px',
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '16px',
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
                width: '120px',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none',
                filter: 'none',
                cursor: 'default',
              }}
            >
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              >
                <path d={squirclePath} fill="#4688F9" />
              </svg>
              <Image
                src="/icons/inventory.png"
                alt="Inventory"
                width={54}
                height={54}
                priority
                style={{
                  width: '54px',
                  height: '54px',
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
              gap: '12px',
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '16px',
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
                width: '120px',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none',
                filter: 'none',
                cursor: 'default',
              }}
            >
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              >
                <path d={squirclePath} fill="#64D38C" />
              </svg>
              <Image
                src="/icons/discount.png"
                alt="Sales"
                width={54}
                height={54}
                priority
                style={{
                  width: '54px',
                  height: '54px',
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
