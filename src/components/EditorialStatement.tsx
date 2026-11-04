'use client';

import React, { useState, useEffect, useRef } from 'react';

// Easily customize or edit the statement text here anytime
const STATEMENT_TEXT =
  "We believe commerce is more than a transaction. It's a place to serve with purpose, build your business, connect with your people, and make every sale count.";

interface EditorialStatementProps {
  text?: string;
}

export default function EditorialStatement({ text = STATEMENT_TEXT }: EditorialStatementProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const words = text.split(' ');

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Pin starts when rect.top hits the sticky offset
      const stickyTop = Math.min(windowHeight * 0.26, 180);
      const totalScrollable = rect.height - windowHeight + (windowHeight - stickyTop - 180);

      if (totalScrollable <= 0) return;

      const currentScroll = stickyTop - rect.top;
      const rawProgress = currentScroll / totalScrollable;
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));

      setScrollProgress(clampedProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="editorial-manifesto"
      style={{
        position: 'relative',
        height: '145vh', // Punchy, responsive track for hard scrolling
        backgroundColor: '#FFFFFF',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Sticky Container: Pins at optical center without massive dead space below */}
      <div
        style={{
          position: 'sticky',
          top: 'clamp(6rem, 26vh, 11rem)',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 1.5rem',
          boxSizing: 'border-box',
          backgroundColor: '#FFFFFF',
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
              lineHeight: 1.4,
              letterSpacing: '-0.02em',
              margin: 0,
              display: 'inline',
              userSelect: 'none',
            }}
          >
            {words.map((word, index) => {
              // Hard scrolling effect: each word snaps decisively from gray to black as user scrolls down
              const highlightEndPhase = 0.88;
              const step = highlightEndPhase / words.length;
              // Very tight threshold range so words snap punchily into black without soft blurry fading
              const rangePerWord = 0.012;
              const wordStart = index * step;
              const wordEnd = wordStart + rangePerWord;

              let wordOpacity = 0;
              if (scrollProgress >= wordEnd) {
                wordOpacity = 1;
              } else if (scrollProgress > wordStart) {
                wordOpacity = (scrollProgress - wordStart) / (wordEnd - wordStart);
              }

              return (
                <span
                  key={`${word}-${index}`}
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    marginRight: '0.24em',
                  }}
                >
                  {/* Base Layer: Muted Gray */}
                  <span
                    style={{
                      color: '#D4D4D8',
                    }}
                  >
                    {word}
                  </span>

                  {/* Highlight Layer: Crisp Deep Black */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      color: '#000000',
                      opacity: wordOpacity,
                      pointerEvents: 'none',
                      transition: 'opacity 0.04s cubic-bezier(0.2, 0, 0, 1)',
                    }}
                  >
                    {word}
                  </span>
                </span>
              );
            })}
          </h2>
        </div>
      </div>
    </section>
  );
}
