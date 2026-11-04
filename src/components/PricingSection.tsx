'use client';

import React from 'react';
import Link from 'next/link';
import TextMotion from './TextMotion';

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
        fontFamily: "'Inter', sans-serif",
        boxSizing: 'border-box',
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .pricing-heading {
          font-family: Inter, sans-serif;
          font-size: 24px;
          line-height: 1.25;
          font-weight: 600;
          letter-spacing: -0.025em;
          color: #0A0A0A;
          margin: 0 0 0.5rem 0;
        }

        @media (min-width: 769px) {
          .pricing-heading {
            font-size: 30px;
            line-height: 1.22;
          }
        }

        .pricing-card-btn {
          width: 100%;
          height: 40px;
          border-radius: 4px;
          background-color: #000000;
          color: #FFFFFF;
          font-family: Inter, sans-serif;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          letter-spacing: -0.01em;
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          border: 1px solid #000000;
          transition: background-color 0.2s ease, opacity 0.2s ease;
        }

        .pricing-card-btn:hover {
          background-color: #1F1F23;
          border-color: #1F1F23;
        }

        .pricing-card-btn .pricing-btn-arrow {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-block;
        }

        .pricing-card-btn:hover .pricing-btn-arrow {
          transform: translateX(4px);
        }
      `,
        }}
      />

      {/* Section Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: 'clamp(2.5rem, 4vw, 3.5rem)',
        }}
      >
        <TextMotion
          as="h2"
          className="pricing-heading"
          text="Simple pricing. Zero hidden fees."
          duration={0.6}
          stagger={0.04}
          y={18}
          threshold={0.25}
        />
        <TextMotion
          as="p"
          text="Choose the right plan for your business. Start free today and scale whenever you are ready."
          duration={0.6}
          stagger={0.025}
          y={14}
          delay={0.16}
          threshold={0.25}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '15px',
            color: '#71717A',
            maxWidth: '520px',
            margin: '0 auto',
            lineHeight: 1.55,
          }}
        />
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
              border: tier.isPopular ? '1px solid #18181B' : '1px solid #E5E7EB',
              borderRadius: '10px',
              padding: '2.25rem 1.75rem',
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
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '-0.01em',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '4px',
                  backgroundColor: tier.isPopular ? '#000000' : '#F4F4F5',
                  color: tier.isPopular ? '#FFFFFF' : '#18181B',
                }}
              >
                {tier.badge}
              </span>
            </div>

            {/* Plan Title (Inter Semi-Bold 600) */}
            <h3
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '18px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: '#0A0A0A',
                marginBottom: '0.5rem',
              }}
            >
              {tier.name}
            </h3>

            {/* Price (Reduced size & semi-bold) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: '0.35rem',
                margin: '0.35rem 0 1.5rem 0',
              }}
            >
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '34px',
                  fontWeight: 600,
                  letterSpacing: '-0.03em',
                  color: '#0A0A0A',
                  lineHeight: 1,
                }}
              >
                {tier.price}
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#71717A',
                  letterSpacing: '-0.01em',
                }}
              >
                {tier.period}
              </span>
            </div>

            {/* CTA Square Button with small radius (no blue, sleek black) */}
            <Link
              href={tier.buttonHref}
              className="pricing-card-btn"
            >
              <span>{tier.buttonText}</span>
              <svg
                className="pricing-btn-arrow"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
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
                fontFamily: "'Inter', sans-serif",
                fontSize: '13.5px',
                fontWeight: 400,
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
