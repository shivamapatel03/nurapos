'use client';

import React from 'react';
import Image from 'next/image';

export default function HeroPreview() {
  return (
    <section
      id="product-preview"
      style={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        width: '100%',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        paddingTop: 0,
        paddingBottom: 'clamp(4.5rem, 6vw, 6rem)',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1180px',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '-1.5rem',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1100px',
            transition: 'transform 0.4s ease, filter 0.4s ease',
          }}
        >
          <Image
            src="/hero/hero.png"
            alt="Nuradesk Point of Sale System on modern desktop display"
            width={1536}
            height={1024}
            priority
            quality={95}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'contain',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>
    </section>
  );
}
