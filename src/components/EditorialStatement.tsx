'use client';

import React from 'react';

// Easily customize or edit the statement text here anytime
const STATEMENT_TEXT =
  "We believe commerce is more than a transaction. It's a place to serve with purpose, build your business, connect with your people, and make every sale count.";

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
        padding: 'clamp(4.5rem, 8.5vw, 7.5rem) 1.5rem',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '880px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(1.35rem, 2.4vw, 2.1rem)',
            fontWeight: 600,
            lineHeight: 1.45,
            letterSpacing: '-0.02em',
            margin: 0,
            color: '#000000',
          }}
        >
          {text}
        </h2>
      </div>
    </section>
  );
}
