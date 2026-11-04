'use client';

import React, { useMemo } from 'react';
import { motion, Variants } from 'framer-motion';

export interface TextMotionProps {
  /** The text string to animate. Can include '\n' for explicit line breaks. */
  text: string;
  /** HTML tag to render as the parent container. Defaults to 'div'. */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  /** Additional CSS class names */
  className?: string;
  /** Inline styles applied to the container */
  style?: React.CSSProperties;
  /** Initial delay before animation begins in seconds (default: 0) */
  delay?: number;
  /** Duration of each word animation in seconds (default: 0.6) */
  duration?: number;
  /** Stagger delay between successive words in seconds (default: 0.04) */
  stagger?: number;
  /** Vertical start distance in px (default: 18, matching Framer TextMotion 'fade' preset) */
  y?: number;
  /** Optional initial blur in px (default: 0) */
  blur?: number;
  /** Viewport threshold to trigger animation (0.0 to 1.0, default: 0.2) */
  threshold?: number;
  /** Whether the animation should trigger only once (default: true) */
  once?: boolean;
}

export default function TextMotion({
  text,
  as = 'div',
  className,
  style,
  delay = 0,
  duration = 0.6,
  stagger = 0.04,
  y = 18,
  blur = 0,
  threshold = 0.2,
  once = true,
}: TextMotionProps) {
  // Normalize lines and words
  const parsedLines = useMemo(() => {
    if (!text) return [];
    const lines = text.split('\n');
    let runningWordIndex = 0;

    return lines.map((line) => {
      // Split words while preserving non-breaking spaces
      const rawWords = line.trim().length > 0 ? line.trim().split(/\s+/) : [];
      const words = rawWords.map((word) => {
        const item = {
          text: word,
          index: runningWordIndex,
        };
        runningWordIndex += 1;
        return item;
      });
      return { words };
    });
  }, [text]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: stagger,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y,
      filter: blur > 0 ? `blur(${blur}px)` : 'blur(0px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration,
        ease: [0.25, 0.1, 0.25, 1], // Smooth cubic-bezier from Framer TextMotion
      },
    },
  };

  const MotionComponent = motion[as] as typeof motion.div;

  return (
    <MotionComponent
      className={className}
      style={{
        ...style,
        display: style?.display || (as === 'span' ? 'inline-block' : 'block'),
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={containerVariants}
      aria-label={text}
    >
      {parsedLines.map((line, lineIdx) => {
        const isMultiLine = parsedLines.length > 1;

        const content = line.words.map((word, wordIdx) => (
          <motion.span
            key={`${lineIdx}-${wordIdx}-${word.text}`}
            aria-hidden="true"
            variants={wordVariants}
            style={{
              display: 'inline-block',
              marginRight: wordIdx < line.words.length - 1 ? '0.28em' : 0,
              willChange: 'transform, opacity',
            }}
          >
            {word.text}
          </motion.span>
        ));

        if (isMultiLine) {
          return (
            <span
              key={lineIdx}
              style={{
                display: 'block',
              }}
            >
              {content}
            </span>
          );
        }

        return (
          <React.Fragment key={lineIdx}>
            {content}
          </React.Fragment>
        );
      })}
    </MotionComponent>
  );
}

