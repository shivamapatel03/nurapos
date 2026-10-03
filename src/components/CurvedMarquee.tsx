'use client';

import React from 'react';
import Image from 'next/image';

interface MarqueeCard {
  id: number;
  name: string;
  image: string;
}

const MARQUEE_ITEMS: MarqueeCard[] = [
  {
    id: 1,
    name: 'Artisan Roastery',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    name: 'Sourdough & Co.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    name: 'Atelier Mode',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    name: 'Greenhouse Bistro',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    name: 'Velvet & Rye',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 6,
    name: 'Matcha Studio',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 7,
    name: 'Fiori Botanica',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 8,
    name: 'Forno Napoletano',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 9,
    name: 'Daily Grind Cafe',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 10,
    name: 'Vinyl & Books',
    image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=600&q=80',
  },
];

export default function CurvedMarquee() {
  // Duplicate array for seamless infinite looping
  const duplicatedItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section
      id="curved-marquee"
      style={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        width: '100%',
        paddingTop: 'clamp(2rem, 3.5vw, 2.75rem)',
        paddingBottom: 'clamp(4rem, 5vw, 5.5rem)',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes slowMarqueeScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .marquee-perspective-stage {
          position: relative;
          width: 100%;
          overflow: hidden;
          perspective: 1000px;
          perspective-origin: center 30%;
          mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
          padding: 0.75rem 0 1.25rem 0;
        }

        .marquee-track-curved {
          display: flex;
          width: max-content;
          gap: 1.25rem;
          transform: rotateX(8deg) scaleY(0.97);
          transform-style: preserve-3d;
          animation: slowMarqueeScroll 85s linear infinite;
          will-change: transform;
        }

        .marquee-perspective-stage:hover .marquee-track-curved {
          animation-play-state: paused;
        }

        .marquee-card-item {
          position: relative;
          flex-shrink: 0;
          width: clamp(200px, 17vw, 250px);
          height: clamp(200px, 17vw, 250px);
          aspect-ratio: 1 / 1;
          border-radius: 18px;
          overflow: hidden;
          background-color: #F4F4F5;
          border: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: none;
          user-select: none;
        }

        /* Strictly NO hover shadow, NO zoom, NO scale */
        .marquee-card-item:hover {
          box-shadow: none !important;
          transform: none !important;
        }

        .marquee-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: none !important;
          transform: none !important;
        }

        .marquee-card-item:hover .marquee-card-image {
          transform: none !important;
          filter: none !important;
        }
      `}</style>

      {/* 3D Perspective Curved Viewport */}
      <div className="marquee-perspective-stage">
        <div className="marquee-track-curved">
          {duplicatedItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="marquee-card-item">
              <Image
                src={item.image}
                alt={item.name}
                width={500}
                height={500}
                className="marquee-card-image"
                loading="lazy"
                sizes="(max-width: 768px) 200px, 250px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
