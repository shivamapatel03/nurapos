'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Does Nuradesk work offline when the internet goes down?',
    answer:
      'Yes, 100%. If your Wi-Fi or mobile data drops, Nuradesk automatically shifts into offline mode. You can continue ringing up sales, adding modifiers, printing kitchen slips, and recording payments without interruption. When connectivity returns, all transactions sync silently in the background.',
  },
  {
    question: 'Can I use my existing thermal receipt printer and barcode scanner?',
    answer:
      'Absolutely. Nuradesk requires zero proprietary hardware lock-in. It pairs seamlessly with standard ESC/POS thermal printers (USB, Bluetooth, and Ethernet/LAN), automatic cash drawers (RJ11), and standard 1D/2D handheld or hands-free barcode scanners.',
  },
  {
    question: 'How does the 1-month free trial work?',
    answer:
      'You get 30 full days of unrestricted access to all POS billing features, catalog management, shift reports, and multi-user accounts. There are zero hidden fees, zero contracts, and no credit card is required to get started.',
  },
  {
    question: 'Can I manage multiple outlets or franchises from one account?',
    answer:
      'Yes. Store owners can manage menus, track live inventory across multiple branches, compare hourly sales figures, and assign granular staff roles from a unified central dashboard.',
  },
  {
    question: 'What devices can I run Nuradesk on?',
    answer:
      'Nuradesk runs smoothly on any device equipped with a modern web browser. This includes Android tablets, iPads, Sunmi/Pax dedicated POS hardware, as well as Windows, Mac, or Linux laptops and desktop terminals.',
  },
  {
    question: 'Is my store’s sales, payment, and customer data secure?',
    answer:
      'All communications are encrypted using enterprise-grade TLS/HTTPS. Your sales receipts and customer records are safely stored with automated cloud backups, ensuring you never lose transactional history even if a physical tablet breaks.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      style={{
        backgroundColor: '#FFFFFF',
        color: '#0A0A0A',
        padding: 'clamp(4rem, 7vw, 6rem) 1.5rem',
        maxWidth: '920px',
        margin: '0 auto',
        fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 3.5vw, 3rem)' }}>
        <h2
          style={{
            fontSize: 'clamp(1.85rem, 3.8vw, 2.75rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.035em',
            color: '#0A0A0A',
            margin: 0,
          }}
        >
          Everything you need to know.
        </h2>
      </div>

      {/* Accordion List (No shadow, no lines) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              style={{
                backgroundColor: isOpen ? '#F4F4F6' : '#F9F9FA',
                borderRadius: '1.25rem',
                border: 'none',
                boxShadow: 'none',
                overflow: 'hidden',
                transition: 'background-color 0.25s ease',
              }}
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                aria-expanded={isOpen}
                style={{
                  width: '100%',
                  padding: '1.35rem 1.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: '#0A0A0A',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              >
                <span>{faq.question}</span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30px',
                    height: '30px',
                    borderRadius: '9999px',
                    backgroundColor: isOpen ? '#191a19' : '#E4E4E7',
                    color: isOpen ? '#FFFFFF' : '#18181B',
                    flexShrink: 0,
                    transition: 'background-color 0.25s ease',
                  }}
                  aria-hidden="true"
                >
                  <svg
                    width="13"
                    height="13"
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

              {/* Smooth Down Accordion Slide Animation */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateRows: isOpen ? '1fr' : '0fr',
                  transition: 'grid-template-rows 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div
                  style={{
                    overflow: 'hidden',
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
                    transition: 'opacity 0.25s ease, transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div
                    style={{
                      padding: '0 1.6rem 1.45rem 1.6rem',
                      color: '#52525B',
                      fontSize: '0.96rem',
                      lineHeight: 1.65,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Helpful Support Footer Card (No shadow, no lines) */}
      <div
        style={{
          marginTop: '2.5rem',
          textAlign: 'center',
          padding: '1.5rem',
          backgroundColor: '#F9F9FA',
          borderRadius: '1.25rem',
          border: 'none',
          boxShadow: 'none',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.95rem', color: '#52525B', fontWeight: 500 }}>
          Still have questions?{' '}
          <Link
            href="/signup"
            style={{
              color: '#0A0A0A',
              fontWeight: 700,
              textDecoration: 'none',
              marginLeft: '0.35rem',
            }}
          >
            Chat with an onboarding specialist →
          </Link>
        </p>
      </div>
    </section>
  );
}
