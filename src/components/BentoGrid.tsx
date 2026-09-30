'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const SQUARE_IMAGES = [
  {
    id: 'cafe',
    title: 'Café & Roastery',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=500&q=80',
    openTransform: 'translate3d(-52px, 8px, 0) rotate(-18deg)',
    closedTransform: 'translate3d(0, 0, 0) rotate(0deg)',
    zIndex: 1,
  },
  {
    id: 'bakery',
    title: 'Artisan Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80',
    openTransform: 'translate3d(-26px, 2px, 0) rotate(-9deg)',
    closedTransform: 'translate3d(0, 0, 0) rotate(0deg)',
    zIndex: 2,
  },
  {
    id: 'food',
    title: 'Fresh Bistro',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=80',
    openTransform: 'translate3d(0px, -6px, 0) rotate(0deg) scale(1.03)',
    closedTransform: 'translate3d(0, 0, 0) rotate(0deg)',
    zIndex: 5,
  },
  {
    id: 'retail',
    title: 'Boutique Store',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=500&q=80',
    openTransform: 'translate3d(26px, 2px, 0) rotate(9deg)',
    closedTransform: 'translate3d(0, 0, 0) rotate(0deg)',
    zIndex: 2,
  },
  {
    id: 'dining',
    title: 'Bar & Lounge',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=80',
    openTransform: 'translate3d(52px, 8px, 0) rotate(18deg)',
    closedTransform: 'translate3d(0, 0, 0) rotate(0deg)',
    zIndex: 1,
  },
];

function BusyBusinessCardStack() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.88 && rect.bottom > 60;
      setIsOpen(inView);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '145px',
        margin: '0.85rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1000px',
        cursor: 'pointer',
      }}
      onClick={() => setIsOpen((prev) => !prev)}
      title="Click or scroll to fan images"
    >
      {SQUARE_IMAGES.map((item) => (
        <div
          key={item.id}
          style={{
            position: 'absolute',
            width: '105px',
            height: '105px',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid #E5E7EB',
            transform: isOpen ? item.openTransform : item.closedTransform,
            zIndex: item.zIndex,
            transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform',
            transformOrigin: 'bottom center',
          }}
        >
          {/* Square Image Only with subtle radius */}
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="105px"
            style={{
              objectFit: 'cover',
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function BentoGrid() {
  return (
    <section
      id="bento-features"
      style={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        width: '100%',
        paddingLeft: '1.25rem',
        paddingRight: '1.25rem',
        paddingTop: 0,
        paddingBottom: 'clamp(4.5rem, 6vw, 6rem)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
      }}
    >
      <style>{`
        .bento-top-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.85rem;
          width: 100%;
        }
        .bento-middle-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.85rem;
          width: 100%;
        }

        @media (min-width: 768px) {
          .bento-top-layout {
            grid-template-columns: 1fr 1.55fr;
          }
          .bento-middle-row {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      {/* Centered Compact Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '860px',
          margin: '0 auto',
        }}
      >
        {/* Top Bento Group: Left Tall Card + Right Stack */}
        <div className="bento-top-layout">
          {/* Card 1: Tall Card (Left) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '1.35rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '340px',
              border: '1px solid #E5E7EB',
              boxSizing: 'border-box',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em',
                  color: '#000000',
                  margin: 0,
                }}
              >
                Built For Busy 
                <br />
                Businesses
              </h3>
            </div>

            {/* 5 Cards Stack with Scroll-Triggered Fan Open Animation */}
            <BusyBusinessCardStack />

            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.45,
                color: '#4B5563',
                margin: 0,
                fontWeight: 500,
              }}
            >
              Everything your business needs, in one place.
            </p>
          </div>

          {/* Right Column: Card 2 (Wide Pink) + Cards 3 & 4 (Square Yellow & Green) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              justifyContent: 'space-between',
            }}
          >
            {/* Card 2: Wide Card (Top Right) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '1.25rem 1.35rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                alignItems: 'center',
                gap: '1rem',
                border: '1px solid #E5E7EB',
                boxSizing: 'border-box',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '150px',
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    lineHeight: 1.15,
                    letterSpacing: '-0.025em',
                    color: '#000000',
                    margin: '0 0 0.4rem 0',
                  }}
                >
                  Inventory in Control
                </h3>
                <p
                  style={{
                    fontSize: '0.82rem',
                    lineHeight: 1.45,
                    color: '#4B5563',
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  Track stock, monitor low inventory, and manage products from one place.
                </p>
              </div>

              {/* Inventory Image */}
              <div
                style={{
                  width: '100%',
                  height: '110px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <Image
                  src="/icons/inventory.webp"
                  alt="Inventory in Control"
                  width={110}
                  height={110}
                  style={{
                    maxHeight: '100%',
                    width: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08))',
                  }}
                />
              </div>
            </div>

            {/* Middle Row: Two Square-like Cards */}
            <div className="bento-middle-row">
              {/* Card 3: Card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '1.15rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid #E5E7EB',
                  boxSizing: 'border-box',
                  minHeight: '175px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      lineHeight: 1.15,
                      letterSpacing: '-0.025em',
                      color: '#000000',
                      margin: '0 0 0.35rem 0',
                    }}
                  >
                    Know Your Numbers
                  </h3>
                  <p
                    style={{
                      fontSize: '0.78rem',
                      lineHeight: 1.4,
                      color: '#4B5563',
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    View sales, orders, and business performance with clear reports.
                  </p>
                </div>

                {/* Sales Chart Image */}
                <div
                  style={{
                    width: '100%',
                    height: '85px',
                    marginTop: '0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <Image
                    src="/icons/sale.png"
                    alt="Know Your Numbers"
                    width={80}
                    height={80}
                    style={{
                      maxHeight: '100%',
                      width: 'auto',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.08))',
                    }}
                  />
                </div>
              </div>

              {/* Card 4: Card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '1.15rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid #E5E7EB',
                  boxSizing: 'border-box',
                  minHeight: '175px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      lineHeight: 1.15,
                      letterSpacing: '-0.025em',
                      color: '#000000',
                      margin: '0 0 0.35rem 0',
                    }}
                  >
                    Run Every Order Smoothly
                  </h3>
                  <p
                    style={{
                      fontSize: '0.78rem',
                      lineHeight: 1.4,
                      color: '#4B5563',
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    Manage dine-in, takeaway, delivery, and order progress in one workflow.
                  </p>
                </div>

                {/* Food Delivery Image */}
                <div
                  style={{
                    width: '100%',
                    height: '85px',
                    marginTop: '0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <Image
                    src="/icons/food.png"
                    alt="Run Every Order Smoothly"
                    width={80}
                    height={80}
                    style={{
                      maxHeight: '100%',
                      width: 'auto',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.08))',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
