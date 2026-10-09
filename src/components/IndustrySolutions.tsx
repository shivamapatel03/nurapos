'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Industry {
  id: string;
  name: string;
  badge: string;
  headline: string;
  description: string;
  image: string;
  highlights: string[];
}

const INDUSTRIES: Industry[] = [
  {
    id: 'cafes',
    name: 'Cafes & Coffee Bars',
    badge: '1.2s Fast Order Entry',
    headline: 'Bust morning queues with rapid modifiers & split checks.',
    description:
      'Engineered for high-volume coffee bars and espresso counters. Tap custom milk modifications, handle split bills in two clicks, and beam drink tickets straight to barista screens.',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85',
    highlights: [
      'Instant beverage modifiers (Oat, Almond, Extra Shot)',
      'Digital kitchen & barista display dispatch',
      'Multi-tender split payments (Cash + UPI + Card)',
    ],
  },
  {
    id: 'retail',
    name: 'Retail & Boutiques',
    badge: 'Barcode & SKU Matrix',
    headline: 'Track size & color variants with effortless barcode scanning.',
    description:
      'Designed for lifestyle stores, apparel boutiques, and specialty retailers. Connect any USB or Bluetooth barcode scanner for instantaneous line item lookups and automatic stock count decrements.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85',
    highlights: [
      'Full size, color & fit variant matrices',
      'Plug-and-play handheld & desktop barcode guns',
      'Multi-terminal real-time inventory synchronization',
    ],
  },
  {
    id: 'bakeries',
    name: 'Bakeries & Delis',
    badge: 'Fresh Batch Tracking',
    headline: 'Manage fresh daily batches and weight-based pricing with ease.',
    description:
      'Tailored for artisan sourdough bakeries, patisseries, and deli counters. Keep track of daily morning bake runs, integrate weighing scales directly, and eliminate unsold end-of-day waste.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
    highlights: [
      'Daily morning batch tracking & shelf-life counts',
      'Fractional & weighted item scale integration',
      'One-tap rapid discount clearance at end of day',
    ],
  },
];

export default function IndustrySolutions() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [lastSelectedId, setLastSelectedId] = useState<string>('cafes');

  const toggleIndustry = (id: string) => {
    setActiveId((prev) => {
      if (prev === id) {
        return null;
      }
      setLastSelectedId(id);
      return id;
    });
  };

  const displayImageId = activeId || lastSelectedId;

  return (
    <section
      id="solutions"
      style={{
        backgroundColor: '#FFFFFF',
        color: '#0A0A0A',
        padding: 'clamp(2.5rem, 4vw, 3.75rem) 1.5rem',
        maxWidth: '1080px',
        margin: '0 auto',
        fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        @media (max-width: 880px) {
          .industry-split-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .industry-sticky-image {
            min-height: 220px !important;
            height: 220px !important;
            order: -1;
            margin-bottom: 1rem;
          }
        }
      `}</style>

      {/* Header Title (No lines, no shadows) */}
      <div style={{ maxWidth: '720px', marginBottom: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
        <h2
          style={{
            fontSize: 'clamp(1.45rem, 2.8vw, 2.1rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.03em',
            color: '#0A0A0A',
            margin: 0,
          }}
        >
          Built for every counter. Tailored for your craft.
        </h2>
      </div>

      {/* Split Layout: Left Accordion List + Right Smooth Image Preview */}
      <div
        className="industry-split-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
          gap: 'clamp(1.5rem, 3vw, 2.25rem)',
          alignItems: 'start',
        }}
      >
        {/* Left Side: Three Industry Dropdowns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {INDUSTRIES.map((ind) => {
            const isOpen = activeId === ind.id;

            return (
              <div
                key={ind.id}
                style={{
                  backgroundColor: isOpen ? '#F4F4F6' : '#F9F9FA',
                  borderRadius: '1.15rem',
                  border: 'none',
                  boxShadow: 'none',
                  overflow: 'hidden',
                  transition: 'background-color 0.25s ease',
                }}
              >
                {/* Clickable Header Button */}
                <button
                  type="button"
                  onClick={() => toggleIndustry(ind.id)}
                  aria-expanded={isOpen}
                  aria-label={isOpen ? `Close ${ind.name}` : `Open ${ind.name}`}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#0A0A0A',
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                >
                  <span
                    style={{
                      fontSize: 'clamp(0.95rem, 1.6vw, 1.08rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      color: isOpen ? '#000000' : '#27272A',
                    }}
                  >
                    {ind.name}
                  </span>

                  {/* Razor-sharp centered rotating vector plus/cross */}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '9999px',
                      backgroundColor: isOpen ? '#191a19' : '#E4E4E7',
                      color: isOpen ? '#FFFFFF' : '#18181B',
                      flexShrink: 0,
                      transition: 'background-color 0.25s ease',
                    }}
                    aria-hidden="true"
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transformOrigin: '50% 50%',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        transition: 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>

                {/* Smooth Down Dropdown Animation with Features */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div
                    style={{
                      overflow: 'hidden',
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? 'translateY(0)' : 'translateY(-6px)',
                      transition: 'opacity 0.25s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <div style={{ padding: '0 1.25rem 1.25rem 1.25rem' }}>
                      {/* Sub-headline & Badge */}
                      <p
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          lineHeight: 1.4,
                          color: '#0A0A0A',
                          margin: '0 0 0.45rem 0',
                          letterSpacing: '-0.015em',
                        }}
                      >
                        {ind.headline}
                      </p>

                      {/* Description text */}
                      <p
                        style={{
                          fontSize: '0.86rem',
                          lineHeight: 1.55,
                          color: '#52525B',
                          margin: '0 0 0.85rem 0',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {ind.description}
                      </p>

                      {/* Feature Checklist */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {ind.highlights.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                            <span
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '9999px',
                                backgroundColor: '#191a19',
                                color: '#FFFFFF',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
                              ✓
                            </span>
                            <span style={{ fontSize: '0.84rem', color: '#27272A', fontWeight: 600 }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Smooth Crossfading Image Card (No shadow, no lines) */}
        <div
          className="industry-sticky-image"
          style={{
            position: 'relative',
            width: '100%',
            height: '360px',
            borderRadius: '1.25rem',
            overflow: 'hidden',
            backgroundColor: '#F4F4F6',
            border: 'none',
            boxShadow: 'none',
          }}
        >
          {INDUSTRIES.map((ind) => {
            const isCurrent = displayImageId === ind.id;
            return (
              <div
                key={ind.id}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: isCurrent ? 1 : 0,
                  transform: isCurrent ? 'scale(1)' : 'scale(1.03)',
                  transition: 'opacity 0.45s ease, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
                  pointerEvents: isCurrent ? 'auto' : 'none',
                }}
              >
                <Image
                  src={ind.image}
                  alt={ind.name}
                  fill
                  sizes="(max-width: 880px) 100vw, 50vw"
                  style={{
                    objectFit: 'cover',
                  }}
                  priority={ind.id === 'cafes'}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
