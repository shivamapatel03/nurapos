'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PosPreview from '../components/PosPreview';
import FeatureGrid from '../components/FeatureGrid';
import Footer from '../components/Footer';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import SyncAltRoundedIcon from '@mui/icons-material/SyncAltRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Live Interactive Terminal Demo */}
      <PosPreview />

      {/* Core POS Features */}
      <FeatureGrid />

      {/* Future .NET Backend Architecture Section */}
      <section id="architecture" style={{
        padding: '4rem 1.5rem 5rem 1.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
        borderTop: '1px solid #E5E5E5',
      }}>
        <div style={{
          backgroundColor: '#000000',
          color: '#FFFFFF',
          borderRadius: '1.5rem',
          padding: 'clamp(2rem, 4vw, 3.5rem)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ display: 'inline-flex', marginBottom: '1rem' }}>
              <span style={{
                backgroundColor: '#FFFFFF',
                color: '#000000',
                padding: '0.3rem 0.8rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Future-Ready Infrastructure
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}>
              Engineered to Pair Seamlessly with .NET Core
            </h2>

            <p style={{
              color: '#A3A3A3',
              fontSize: '1rem',
              lineHeight: 1.6,
              marginBottom: '1.75rem',
            }}>
              Nuradesk is structured with decoupled API contracts, DTO types, and clean HTTP service abstractions. When you deploy your .NET backend, the frontend connects instantly without restructuring.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                className="button-20-secondary"
                role="button"
                onClick={() => alert('API contracts and models are prepared in src/types/pos.ts and src/lib/api-client.ts')}
              >
                Inspect API Contracts
              </button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1rem',
          }}>
            <div style={{
              backgroundColor: '#171717',
              border: '1px solid #333333',
              borderRadius: '1rem',
              padding: '1.25rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
            }}>
              <DnsRoundedIcon sx={{ fontSize: 26, color: '#FFFFFF' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF' }}>
                  ASP.NET Core REST API
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#A3A3A3', marginTop: '0.2rem' }}>
                  High throughput endpoints for orders, payments, and transactional ledger.
                </p>
              </div>
            </div>

            <div style={{
              backgroundColor: '#171717',
              border: '1px solid #333333',
              borderRadius: '1rem',
              padding: '1.25rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
            }}>
              <CodeRoundedIcon sx={{ fontSize: 26, color: '#FFFFFF' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF' }}>
                  Strong TypeScript & C# DTO Parity
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#A3A3A3', marginTop: '0.2rem' }}>
                  Data interfaces defined in <code style={{ color: '#FFFFFF' }}>src/types/pos.ts</code> mirror C# record models.
                </p>
              </div>
            </div>

            <div style={{
              backgroundColor: '#171717',
              border: '1px solid #333333',
              borderRadius: '1rem',
              padding: '1.25rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
            }}>
              <SyncAltRoundedIcon sx={{ fontSize: 26, color: '#FFFFFF' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF' }}>
                  Real-Time SignalR Ready
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#A3A3A3', marginTop: '0.2rem' }}>
                  Hooks in place for live register broadcasting and kitchen display updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
