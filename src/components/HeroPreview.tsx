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
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 'clamp(4rem, 6vw, 5.5rem)',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Image
          src="/hero/hero.png"
          alt="Nuradesk Point of Sale System on modern tablet display"
          width={1536}
          height={1024}
          priority
          quality={100}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      </div>
    </section>
  );
}
