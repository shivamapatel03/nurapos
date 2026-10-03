'use client';

import React, { useState } from 'react';

export default function WorkflowSection() {
  // Interactive toggle state for Card 2 (Dynamic Pricing & Discounts)
  const [toggles, setToggles] = useState({
    flexiblePricing: true,
    promoOffers: true,
    customerDiscounts: true,
    businessHours: false,
  });

  const toggleItem = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Interactive view state for Card 3 (Digital Receipts & Order Tickets)
  const [ticketView, setTicketView] = useState<'receipt' | 'kitchen'>('receipt');

  return (
    <section
      id="workflows"
      style={{
        padding: '0 1.5rem clamp(4.5rem, 6vw, 6rem) 1.5rem',
        maxWidth: '1240px',
        margin: '0 auto',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Centered Main Section Heading */}
      <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
        <h2
          style={{
            fontSize: 'clamp(1.6rem, 3.2vw, 2.35rem)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 1.2,
            color: '#09090B',
            margin: 0,
            fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
          }}
        >
          Built for modern
          <br />
          retail &amp; checkout workflows.
        </h2>
      </div>

      {/* 3-Column Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem',
          alignItems: 'stretch',
        }}
      >
        {/* ======================================================== */}
        {/* CARD 1: Rapid Register Checkout                          */}
        {/* ======================================================== */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Visual Container */}
          <div
            style={{
              height: '310px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #FDE8E8 0%, #F5D0FE 45%, #E0E7FF 100%)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              boxShadow: '0 4px 20px -2px rgba(244, 114, 182, 0.1)',
            }}
          >
            {/* Fanned 3 Cards Stack showcasing checkout features */}
            <div
              style={{
                position: 'relative',
                width: '260px',
                height: '180px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Card 1 (Left: Split Payments) */}
              <div
                style={{
                  position: 'absolute',
                  width: '142px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '0.85rem 0.75rem',
                  boxShadow: '0 10px 25px -4px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  transform: 'rotate(-11deg) translate(-42px, 14px)',
                  zIndex: 1,
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.45rem',
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '9999px',
                      backgroundColor: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '7.5px', fontWeight: 800, color: '#2563EB' }}>SPLIT BILL</span>
                </div>
                <div
                  style={{
                    fontSize: '9.5px',
                    fontWeight: 700,
                    lineHeight: 1.3,
                    color: '#111827',
                    marginBottom: '0.75rem',
                  }}
                >
                  Table 04 • 50/50 Split ($14.50 / $14.50)
                </div>
                <div
                  style={{
                    width: '100%',
                    padding: '0.28rem 0',
                    textAlign: 'center',
                    borderRadius: '9999px',
                    backgroundColor: '#F3F4F6',
                    fontSize: '8px',
                    fontWeight: 700,
                    color: '#374151',
                  }}
                >
                  Split Payments
                </div>
              </div>

              {/* Card 2 (Middle: Barcode Scan & Quick Checkout) */}
              <div
                style={{
                  position: 'absolute',
                  width: '150px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '0.95rem 0.8rem',
                  boxShadow: '0 16px 32px -6px rgba(0, 0, 0, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  transform: 'rotate(-1deg) translate(0px, -2px)',
                  zIndex: 3,
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '9999px',
                      backgroundColor: '#ECFDF5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                      <line x1="7" y1="12" x2="17" y2="12" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '8px', fontWeight: 800, color: '#059669' }}>BARCODE READY</span>
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    lineHeight: 1.3,
                    color: '#111827',
                    marginBottom: '0.85rem',
                  }}
                >
                  #890124 • Espresso Roast x2 ($28.00)
                </div>
                <div
                  style={{
                    width: '100%',
                    padding: '0.35rem 0',
                    textAlign: 'center',
                    borderRadius: '9999px',
                    backgroundColor: '#111827',
                    fontSize: '9px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  Smooth Checkout
                </div>
              </div>

              {/* Card 3 (Right: Easy Order Editing) */}
              <div
                style={{
                  position: 'absolute',
                  width: '142px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '0.85rem 0.75rem',
                  boxShadow: '0 10px 25px -4px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  transform: 'rotate(9deg) translate(42px, 12px)',
                  zIndex: 2,
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.45rem',
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '9999px',
                      backgroundColor: '#FAF5FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '7.5px', fontWeight: 800, color: '#7C3AED' }}>ORDER EDIT</span>
                </div>
                <div
                  style={{
                    fontSize: '9.5px',
                    fontWeight: 700,
                    lineHeight: 1.3,
                    color: '#111827',
                    marginBottom: '0.75rem',
                  }}
                >
                  +Oat Milk • Line Discount (-$2.00)
                </div>
                <div
                  style={{
                    width: '100%',
                    padding: '0.28rem 0',
                    textAlign: 'center',
                    borderRadius: '9999px',
                    backgroundColor: '#F3F4F6',
                    fontSize: '8px',
                    fontWeight: 700,
                    color: '#374151',
                  }}
                >
                  Order Updated
                </div>
              </div>
            </div>
          </div>

          {/* Text Description */}
          <div style={{ marginTop: '1.25rem' }}>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: '#09090B',
                margin: 0,
                fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
              }}
            >
              Rapid Register Checkout
            </h3>
            <p
              style={{
                fontSize: '0.95rem',
                lineHeight: 1.5,
                color: '#4B5563',
                margin: '0.4rem 0 0 0',
              }}
            >
              Ring up products quickly with barcode scanning, easy order editing, split payments, and smooth checkout.
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 2: Dynamic Pricing & Discounts                      */}
        {/* ======================================================== */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Visual Container */}
          <div
            style={{
              height: '310px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #EDE9FE 0%, #E0E7FF 50%, #DBEAFE 100%)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem',
              boxSizing: 'border-box',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              boxShadow: '0 4px 20px -2px rgba(99, 102, 241, 0.1)',
            }}
          >
            {/* White Mockup Settings Card */}
            <div
              style={{
                width: '100%',
                maxWidth: '300px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                borderRadius: '16px',
                padding: '0.65rem 0.85rem',
                boxShadow: '0 14px 30px -6px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.95)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              {/* Row 1: Flexible pricing */}
              <div
                onClick={() => toggleItem('flexiblePricing')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.35rem',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  userSelect: 'none',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#111827' }}>Flexible product pricing</div>
                  <div style={{ fontSize: '9px', color: '#6B7280', marginTop: '1px' }}>Custom rates per product category</div>
                </div>
                {/* Toggle Pill */}
                <div
                  style={{
                    width: '32px',
                    height: '18px',
                    borderRadius: '9999px',
                    backgroundColor: toggles.flexiblePricing ? '#1E293B' : '#E2E8F0',
                    position: 'relative',
                    transition: 'background-color 0.25s ease',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '9999px',
                      backgroundColor: '#FFFFFF',
                      position: 'absolute',
                      top: '2px',
                      left: toggles.flexiblePricing ? '16px' : '2px',
                      transition: 'left 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                    }}
                  />
                </div>
              </div>

              {/* Row 2: Promotional offers */}
              <div
                onClick={() => toggleItem('promoOffers')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.35rem',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  userSelect: 'none',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#111827' }}>Promotional offers</div>
                  <div style={{ fontSize: '9px', color: '#6B7280', marginTop: '1px' }}>Bundle discounts &amp; seasonal deals</div>
                </div>
                <div
                  style={{
                    width: '32px',
                    height: '18px',
                    borderRadius: '9999px',
                    backgroundColor: toggles.promoOffers ? '#1E293B' : '#E2E8F0',
                    position: 'relative',
                    transition: 'background-color 0.25s ease',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '9999px',
                      backgroundColor: '#FFFFFF',
                      position: 'absolute',
                      top: '2px',
                      left: toggles.promoOffers ? '16px' : '2px',
                      transition: 'left 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                    }}
                  />
                </div>
              </div>

              {/* Row 3: Customer loyalty discounts */}
              <div
                onClick={() => toggleItem('customerDiscounts')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.35rem',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  userSelect: 'none',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#111827' }}>Customer discounts</div>
                  <div style={{ fontSize: '9px', color: '#6B7280', marginTop: '1px' }}>Automatic VIP member concessions</div>
                </div>
                <div
                  style={{
                    width: '32px',
                    height: '18px',
                    borderRadius: '9999px',
                    backgroundColor: toggles.customerDiscounts ? '#1E293B' : '#E2E8F0',
                    position: 'relative',
                    transition: 'background-color 0.25s ease',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '9999px',
                      backgroundColor: '#FFFFFF',
                      position: 'absolute',
                      top: '2px',
                      left: toggles.customerDiscounts ? '16px' : '2px',
                      transition: 'left 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                    }}
                  />
                </div>
              </div>

              {/* Row 4: Business hours rules */}
              <div
                onClick={() => toggleItem('businessHours')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.35rem',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  userSelect: 'none',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#111827' }}>Business hours pricing</div>
                  <div style={{ fontSize: '9px', color: '#6B7280', marginTop: '1px' }}>Happy hour timing &amp; weekend rates</div>
                </div>
                <div
                  style={{
                    width: '32px',
                    height: '18px',
                    borderRadius: '9999px',
                    backgroundColor: toggles.businessHours ? '#1E293B' : '#E2E8F0',
                    position: 'relative',
                    transition: 'background-color 0.25s ease',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '9999px',
                      backgroundColor: '#FFFFFF',
                      position: 'absolute',
                      top: '2px',
                      left: toggles.businessHours ? '16px' : '2px',
                      transition: 'left 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Text Description */}
          <div style={{ marginTop: '1.25rem' }}>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: '#09090B',
                margin: 0,
                fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
              }}
            >
              Dynamic Pricing &amp; Discounts
            </h3>
            <p
              style={{
                fontSize: '0.95rem',
                lineHeight: 1.5,
                color: '#4B5563',
                margin: '0.4rem 0 0 0',
              }}
            >
              Set up flexible pricing, promotional offers, and discounts to support different products, customers, and business hours.
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 3: Digital Receipts & Order Tickets                 */}
        {/* ======================================================== */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Visual Container */}
          <div
            style={{
              height: '310px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #E0E7FF 0%, #DBEAFE 50%, #CFFAFE 100%)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem',
              boxSizing: 'border-box',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              boxShadow: '0 4px 20px -2px rgba(56, 189, 248, 0.1)',
            }}
          >
            {/* Interactive Receipt / Ticket Card */}
            <div
              style={{
                width: '100%',
                maxWidth: '295px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '0.85rem 1rem',
                boxShadow: '0 16px 36px -6px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.95)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              {/* Tab Switcher: Customer Receipt vs Kitchen Order Ticket */}
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#F3F4F6',
                  borderRadius: '8px',
                  padding: '2px',
                  gap: '2px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setTicketView('receipt')}
                  style={{
                    flex: 1,
                    padding: '3px 0',
                    fontSize: '9.5px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: ticketView === 'receipt' ? '#FFFFFF' : 'transparent',
                    color: ticketView === 'receipt' ? '#111827' : '#6B7280',
                    boxShadow: ticketView === 'receipt' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Customer Receipt
                </button>
                <button
                  type="button"
                  onClick={() => setTicketView('kitchen')}
                  style={{
                    flex: 1,
                    padding: '3px 0',
                    fontSize: '9.5px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: ticketView === 'kitchen' ? '#FFFFFF' : 'transparent',
                    color: ticketView === 'kitchen' ? '#111827' : '#6B7280',
                    boxShadow: ticketView === 'kitchen' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Kitchen Ticket (KOT)
                </button>
              </div>

              {ticketView === 'receipt' ? (
                <>
                  {/* Receipt Header Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#111827',
                        fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
                      }}
                    >
                      Order #2841 • Register 01
                    </div>
                    <span
                      style={{
                        fontSize: '8px',
                        fontWeight: 700,
                        color: '#059669',
                        backgroundColor: '#ECFDF5',
                        padding: '1px 6px',
                        borderRadius: '9999px',
                      }}
                    >
                      PAID IN FULL
                    </span>
                  </div>

                  {/* Itemized Snapshot */}
                  <div
                    style={{
                      fontSize: '9.5px',
                      color: '#4B5563',
                      lineHeight: 1.4,
                      padding: '0.35rem 0.5rem',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>2x Cold Brew Blend</span>
                      <strong>$9.00</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>1x Artisan Croissant</span>
                      <strong>$4.50</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>1x Whole Bean 250g</span>
                      <strong>$15.00</strong>
                    </div>
                  </div>

                  {/* Total Box */}
                  <div
                    style={{
                      padding: '0.35rem 0.55rem',
                      borderRadius: '6px',
                      backgroundColor: '#111827',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontSize: '9px', color: '#D1D5DB', fontWeight: 600 }}>Total Charged:</span>
                    <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#FFFFFF' }}>$28.50</span>
                  </div>

                  {/* Printing / Digital Sharing Actions */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                    <div
                      style={{
                        flex: 1,
                        padding: '0.3rem 0',
                        textAlign: 'center',
                        borderRadius: '6px',
                        backgroundColor: '#F3F4F6',
                        fontSize: '8.5px',
                        fontWeight: 700,
                        color: '#374151',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 6 2 18 2 18 9" />
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                        <rect x="6" y="14" width="12" height="8" />
                      </svg>
                      Print (Thermal)
                    </div>
                    <div
                      style={{
                        flex: 1,
                        padding: '0.3rem 0',
                        textAlign: 'center',
                        borderRadius: '6px',
                        backgroundColor: '#EFF6FF',
                        fontSize: '8.5px',
                        fontWeight: 700,
                        color: '#2563EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                      Digital Share
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Kitchen Ticket Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#111827',
                        fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
                      }}
                    >
                      Ticket #2841 • Table 04
                    </div>
                    <span
                      style={{
                        fontSize: '8px',
                        fontWeight: 700,
                        color: '#DC2626',
                        backgroundColor: '#FEF2F2',
                        padding: '1px 6px',
                        borderRadius: '9999px',
                      }}
                    >
                      PREP NOW
                    </span>
                  </div>

                  {/* Kitchen Prep Notes */}
                  <div
                    style={{
                      fontSize: '9.5px',
                      color: '#4B5563',
                      lineHeight: 1.4,
                      padding: '0.35rem 0.5rem',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px',
                    }}
                  >
                    <div>
                      <strong style={{ color: '#111827' }}>2x Cold Brew</strong>
                      <span style={{ fontSize: '8.5px', color: '#6B7280', display: 'block' }}>Notes: Extra ice, oat milk on side</span>
                    </div>
                    <div>
                      <strong style={{ color: '#111827' }}>1x Artisan Croissant</strong>
                      <span style={{ fontSize: '8.5px', color: '#6B7280', display: 'block' }}>Notes: Warmed &amp; sliced</span>
                    </div>
                  </div>

                  {/* Station Tag */}
                  <div
                    style={{
                      padding: '0.35rem 0.55rem',
                      borderRadius: '6px',
                      backgroundColor: '#FEF3C7',
                      color: '#92400E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '9px',
                      fontWeight: 700,
                    }}
                  >
                    <span>Station: Barista &amp; Bakery</span>
                    <span>12:44 PM</span>
                  </div>

                  {/* Printing / Digital Dispatch Actions */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                    <div
                      style={{
                        flex: 1,
                        padding: '0.3rem 0',
                        textAlign: 'center',
                        borderRadius: '6px',
                        backgroundColor: '#F3F4F6',
                        fontSize: '8.5px',
                        fontWeight: 700,
                        color: '#374151',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 6 2 18 2 18 9" />
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                        <rect x="6" y="14" width="12" height="8" />
                      </svg>
                      Print Ticket
                    </div>
                    <div
                      style={{
                        flex: 1,
                        padding: '0.3rem 0',
                        textAlign: 'center',
                        borderRadius: '6px',
                        backgroundColor: '#ECFDF5',
                        fontSize: '8.5px',
                        fontWeight: 700,
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                      Send to KDS
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Text Description */}
          <div style={{ marginTop: '1.25rem' }}>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: '#09090B',
                margin: 0,
                fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
              }}
            >
              Digital Receipts &amp; Order Tickets
            </h3>
            <p
              style={{
                fontSize: '0.95rem',
                lineHeight: 1.5,
                color: '#4B5563',
                margin: '0.4rem 0 0 0',
              }}
            >
              Generate clear customer receipts and kitchen order tickets, with options for printing or digital sharing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
