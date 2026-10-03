'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface AccordionItem {
  id: string;
  title: string;
  description: string;
  link: string;
}

const ACCORDION_ITEMS: AccordionItem[] = [
  {
    id: 'pos-billing',
    title: 'Smart POS Billing',
    description:
      'Fast, intuitive register checkout with instant barcode lookups, item modifiers, custom discounts, and split payments engineered for zero queue friction.',
    link: '/pos-main',
  },
  {
    id: 'inventory-management',
    title: 'Inventory Management',
    description:
      'Automated real-time stock sync across all registers. Receive low-stock alerts, track unit costs, manage purchase orders, and prevent stockouts effortlessly.',
    link: '/admin',
  },
  {
    id: 'sales-analytics',
    title: 'Sales & Analytics',
    description:
      'Live revenue dashboards, shift reconciliation reports, hourly peak traffic insights, and exportable financial summaries to help you make data-driven decisions.',
    link: '/admin',
  },
  {
    id: 'customer-management',
    title: 'Customer Management',
    description:
      'Build lasting customer loyalty with purchase histories, digital receipts, automated reward points, and targeted promotional outreach directly from checkout.',
    link: '/admin',
  },
  {
    id: 'team-operations',
    title: 'Team & Operations',
    description:
      'Manage staff permissions, shift clock-in and clock-out tracking, cashier drawer reconciliation, and terminal audit logs with complete accountability.',
    link: '/manager',
  },
];

export default function FeatureAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleRow = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="features-accordion"
      style={{
        backgroundColor: '#FFFFFF',
        color: '#0A0A0A',
        padding: '0 1.5rem clamp(4.5rem, 6vw, 6rem) 1.5rem',
        maxWidth: '680px',
        width: '100%',
        margin: '0 auto',
        fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .feature-accordion-heading {
          font-size: 38px;
          line-height: 1.15;
          font-weight: 550;
          letter-spacing: -0.035em;
          color: #0A0A0A;
          margin: 0 auto;
          max-width: 600px;
        }

        @media (min-width: 769px) {
          .feature-accordion-heading {
            font-size: 56px;
            line-height: 1.1;
          }
        }

        .feature-accordion-row {
          border-top: 1px solid #E5E7EB;
          transition: border-color 250ms ease;
        }

        .feature-accordion-row:last-child {
          border-bottom: 1px solid #E5E7EB;
        }
      `}</style>

      {/* Main Heading with generous whitespace and centered alignment */}
      <div
        style={{
          marginBottom: 'clamp(2rem, 4vw, 3.25rem)',
          textAlign: 'center',
        }}
      >
        <h2 className="feature-accordion-heading">
          One platform.
          <br />
          Every part of your business.
        </h2>
      </div>

      {/* 5 Horizontal Accordion Rows */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        {ACCORDION_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={item.id} className="feature-accordion-row">
              {/* Row Header (Clickable) */}
              <button
                type="button"
                onClick={() => toggleRow(index)}
                aria-expanded={isOpen}
                aria-controls={`accordion-content-${item.id}`}
                id={`accordion-trigger-${item.id}`}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: 'clamp(1rem, 1.5vw, 1.25rem) 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                  outline: 'none',
                  gap: '1rem',
                  userSelect: 'none',
                }}
              >
                {/* Title (18px, bold, black) */}
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: '#0A0A0A',
                    transition: 'color 250ms ease',
                  }}
                >
                  {item.title}
                </span>

                {/* Plus (+) / Minus (−) Morphing & Rotating Icon */}
                <div
                  style={{
                    position: 'relative',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), color 250ms ease',
                    color: isOpen ? '#1B4EF5' : '#71717A',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  {/* Horizontal Bar (Always visible) */}
                  <span
                    style={{
                      position: 'absolute',
                      width: '14px',
                      height: '2px',
                      backgroundColor: 'currentColor',
                      borderRadius: '1px',
                    }}
                  />

                  {/* Vertical Bar (Morphs/scales away when open to form a minus) */}
                  <span
                    style={{
                      position: 'absolute',
                      width: '2px',
                      height: '14px',
                      backgroundColor: 'currentColor',
                      borderRadius: '1px',
                      transform: isOpen ? 'scaleY(0)' : 'scaleY(1)',
                      transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </div>
              </button>

              {/* Accordion Content with smooth 250-350ms height expand/collapse & upward/downward fade-slide */}
              <div
                id={`accordion-content-${item.id}`}
                role="region"
                aria-labelledby={`accordion-trigger-${item.id}`}
                style={{
                  display: 'grid',
                  gridTemplateRows: isOpen ? '1fr' : '0fr',
                  transition: 'grid-template-rows 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div
                  style={{
                    overflow: 'hidden',
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateY(0)' : 'translateY(-6px)',
                    transition: 'opacity 250ms ease, transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div
                    style={{
                      paddingTop: '0.2rem',
                      paddingBottom: 'clamp(1.15rem, 2vw, 1.5rem)',
                      maxWidth: '740px',
                    }}
                  >
                    {/* Description: 16px, regular */}
                    <p
                      style={{
                        fontSize: '16px',
                        fontWeight: 400,
                        lineHeight: 1.6,
                        color: '#52525B',
                        margin: 0,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {item.description}
                    </p>

                    {/* "Learn more" link: 15px bold with subtle hover */}
                    <div style={{ marginTop: '0.85rem' }}>
                      <Link
                        href={item.link}
                        style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          color: '#1B4EF5',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          letterSpacing: '-0.01em',
                          transition: 'gap 0.2s ease, opacity 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.gap = '0.55rem';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.gap = '0.35rem';
                        }}
                      >
                        <span>Learn more</span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
