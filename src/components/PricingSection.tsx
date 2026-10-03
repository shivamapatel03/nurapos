'use client';

import React from 'react';
import Link from 'next/link';

interface PricingTier {
  id: string;
  name: string;
  badge: string;
  price: string;
  period: string;
  subheadline: string;
  buttonText: string;
  buttonHref: string;
  isPopular?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    badge: '1 Month Free Trial',
    price: '₹0',
    period: '/ 1st month',
    subheadline:
      'Test all essential register checkout, catalog setup, and shift workflows with zero risk or commitment.',
    buttonText: 'Start Free Trial',
    buttonHref: '/signup',
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: 'Most Popular',
    price: '₹349',
    period: '/ month',
    subheadline:
      'Access all standard POS billing features, real-time inventory synchronization, and digital receipt printing.',
    buttonText: 'Get Pro Access',
    buttonHref: '/signup',
    isPopular: true,
  },
  {
    id: 'super',
    name: 'Super',
    badge: 'Best Value',
    price: '₹3,999',
    period: '/ year',
    subheadline:
      'Full annual access with multi-terminal support, advanced revenue analytics, and priority customer care.',
    buttonText: 'Get Super Access',
    buttonHref: '/signup',
  },
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      style={{
        backgroundColor: '#FFFFFF',
        color: '#0A0A0A',
        padding: '0 1.5rem clamp(4.5rem, 6vw, 6rem) 1.5rem',
        maxWidth: '1180px',
        margin: '0 auto',
        fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .pricing-btn-link .pricing-btn-arrow {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-block;
        }
        .pricing-btn-link:hover .pricing-btn-arrow {
          transform: translateX(5px);
        }
      `}</style>
      {/* Section Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: 'clamp(2.5rem, 4vw, 3.5rem)',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 1.2,
            color: '#0A0A0A',
            margin: '0 0 0.5rem 0',
          }}
        >
          Simple pricing. Zero hidden fees.
        </h2>
        <p
          style={{
            fontSize: '1rem',
            color: '#71717A',
            maxWidth: '520px',
            margin: '0 auto',
            lineHeight: 1.55,
          }}
        >
          Choose the right plan for your business. Start free today and scale whenever you are ready.
        </p>
      </div>

      {/* 3 Pricing Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.75rem',
          alignItems: 'stretch',
        }}
      >
        {PRICING_TIERS.map((tier) => (
          <div
            key={tier.id}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '1.5rem',
              padding: '2.5rem 1.85rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              boxSizing: 'border-box',
            }}
          >
            {/* Top Badge */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  backgroundColor: '#F4F4F5',
                  color: '#18181B',
                }}
              >
                {tier.badge}
              </span>
            </div>

            {/* Plan Title */}
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: '#0A0A0A',
                marginBottom: '0.65rem',
              }}
            >
              {tier.name}
            </h3>

            {/* Big Price (matching user reference mockup) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: '0.35rem',
                margin: '0.5rem 0 1.75rem 0',
              }}
            >
              <span
                style={{
                  fontSize: 'clamp(2.5rem, 4vw, 3.15rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  color: '#0A0A0A',
                  lineHeight: 1,
                }}
              >
                {tier.price}
              </span>
              <span
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: '#71717A',
                  letterSpacing: '-0.01em',
                }}
              >
                {tier.period}
              </span>
            </div>

            {/* CTA Pill Button (using button-20 CSS with smooth animated arrow) */}
            <Link
              href={tier.buttonHref}
              className="button-20 pricing-btn-link"
              style={{
                width: '100%',
                padding: '0.8rem 1.5rem',
                borderRadius: '9999px',
                fontSize: '0.95rem',
                fontWeight: 600,
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                boxSizing: 'border-box',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
              }}
            >
              <span>{tier.buttonText}</span>
              <svg
                className="pricing-btn-arrow"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>

            {/* Subheadline description directly below button */}
            <p
              style={{
                fontSize: '0.88rem',
                lineHeight: 1.55,
                color: '#52525B',
                marginTop: '1.25rem',
                maxWidth: '260px',
                letterSpacing: '-0.01em',
              }}
            >
              {tier.subheadline}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
