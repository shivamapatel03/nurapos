'use client';

import React from 'react';
import TextMotion from './TextMotion';

// Easily customize or edit the statement text here anytime
const STATEMENT_TEXT =
  'Everything your store needs to sell, manage, and scale — all in one place.';

interface EditorialStatementProps {
  text?: string;
}

export default function EditorialStatement({ text = STATEMENT_TEXT }: EditorialStatementProps) {
  return (
    <section
      id="editorial-manifesto"
      style={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        width: '100%',
        padding: 'clamp(3.5rem, 6vw, 5.5rem) 1.5rem',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <TextMotion
          as="h2"
          text={text}
          duration={0.6}
          stagger={0.04}
          y={18}
          threshold={0.25}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(1.5rem, 2.6vw, 2.25rem)',
            fontWeight: 600,
            lineHeight: 1.35,
            letterSpacing: '-0.025em',
            margin: 0,
            color: '#000000',
          }}
        />
      </div>
    </section>
  );
}

