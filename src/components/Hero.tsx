'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import heroBg from '../hero/herobackground.png';
import TextMotion from './TextMotion';

export default function Hero() {
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from -1 to 1 relative to viewport center
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouseOffset({ x, y });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSeeDemo = () => {
    if (previewContainerRef.current) {
      previewContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        paddingTop: 'calc(58px + 72px)',
        paddingBottom: 'clamp(3rem, 6vw, 5rem)',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes cloudFloatLeft {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-14px) rotate(1.2deg);
          }
        }

        @keyframes cloudFloatRight {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-18px) rotate(-1.5deg);
          }
        }
      `,
        }}
      />

      {/* Hero Background Image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <Image
          src={heroBg}
          alt="Hero background"
          fill
          priority
          quality={95}
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center top',
          }}
        />
      </div>

      {/* Parallax Cloud 1 (Left Side - Moved inward toward center) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 'clamp(35px, 6vw, 95px)',
          left: 'clamp(24px, 5.5vw, 120px)',
          width: 'clamp(220px, 26vw, 380px)',
          zIndex: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          transform: `translate3d(${mouseOffset.x * -16 - scrollY * 0.12}px, ${mouseOffset.y * -12 - scrollY * 0.28}px, 0)`,
          transition: 'transform 0.12s cubic-bezier(0.2, 0.8, 0.4, 1)',
          willChange: 'transform',
        }}
      >
        <div
          style={{
            animation: 'cloudFloatLeft 7s ease-in-out infinite',
            width: '100%',
          }}
        >
          <Image
            src="/hero/cloud1.png"
            alt="Left decorative cloud"
            width={1007}
            height={724}
            priority
            quality={90}
            sizes="(max-width: 900px) 220px, 380px"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.04))',
            }}
          />
        </div>
      </div>

      {/* Parallax Cloud 2 (Right Side - Reduced compact size) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 'clamp(45px, 7vw, 110px)',
          right: 'clamp(30px, 6vw, 150px)',
          width: 'clamp(170px, 20vw, 290px)',
          zIndex: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          transform: `translate3d(${mouseOffset.x * 20 + scrollY * 0.14}px, ${mouseOffset.y * 14 - scrollY * 0.32}px, 0)`,
          transition: 'transform 0.12s cubic-bezier(0.2, 0.8, 0.4, 1)',
          willChange: 'transform',
        }}
      >
        <div
          style={{
            animation: 'cloudFloatRight 8.5s ease-in-out infinite',
            width: '100%',
          }}
        >
          <Image
            src="/hero/cloud2.png"
            alt="Right decorative cloud"
            width={1116}
            height={724}
            priority
            quality={90}
            sizes="(max-width: 900px) 170px, 290px"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.05))',
            }}
          />
        </div>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '1216px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Headline */}
        <TextMotion
          as="h1"
          text="Sell Smarter. Manage Better. Grow Faster."
          duration={0.65}
          stagger={0.05}
          y={20}
          threshold={0}
          delay={0.1}
          style={{
            color: '#000000',
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: 'normal',
            margin: '0 auto',
            textAlign: 'center',
            letterSpacing: '-0.02em',
            maxWidth: '1100px',
          }}
        />

        {/* Buttons Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '32px',
            flexWrap: 'wrap',
          }}
        >
          {/* Get started button: width: 134px; height: 41px; border-radius: 4px; background: #000; */}
          <Link
            href="/signup"
            style={{
              width: '134px',
              height: '41px',
              borderRadius: '4px',
              backgroundColor: '#000000',
              color: '#FFFFFF',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              border: 'none',
              cursor: 'pointer',
              boxSizing: 'border-box',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            Get started
          </Link>

          {/* See demo button: transparent with crisp black border & text for high contrast */}
          <button
            type="button"
            onClick={handleSeeDemo}
            style={{
              width: '134px',
              height: '41px',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: '#000000',
              border: '1.5px solid #000000',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxSizing: 'border-box',
              transition: 'background-color 0.15s ease, opacity 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.06)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            See demo
          </button>
        </div>

        {/* Hero preview image: transparent cutout without white background container */}
        <div
          ref={previewContainerRef}
          style={{
            marginTop: '40px',
            width: '100%',
            maxWidth: '980px',
            position: 'relative',
            backgroundColor: 'transparent',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            src="/hero/hero.png"
            alt="Nuradesk POS Preview"
            width={1633}
            height={963}
            priority
            quality={95}
            sizes="(max-width: 980px) 100vw, 980px"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.08))',
            }}
          />
        </div>
      </div>
    </section>
  );
}
