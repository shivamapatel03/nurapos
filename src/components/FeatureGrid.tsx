'use client';

import React from 'react';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import IntegrationInstructionsRoundedIcon from '@mui/icons-material/IntegrationInstructionsRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';

const FEATURES = [
  {
    icon: PointOfSaleRoundedIcon,
    tag: 'Checkout Engine',
    title: 'Rapid Register Workflow',
    description: 'Designed for high transaction speed with instant barcode lookups, custom item modifications, and quick split bill calculations.',
  },
  {
    icon: Inventory2RoundedIcon,
    tag: 'Stock Management',
    title: 'Real-Time Inventory Sync',
    description: 'Every sale automatically decrements stock count. Instant threshold alerts ensure you never run out of popular SKUs.',
  },
  {
    icon: BarChartRoundedIcon,
    tag: 'Reporting',
    title: 'Sales & Shift Analytics',
    description: 'Track daily turnover, payment method distribution, and cashier performance with clean monochrome charts.',
  },
  {
    icon: IntegrationInstructionsRoundedIcon,
    tag: 'Backend Architecture',
    title: '.NET Core Backend Ready',
    description: 'Strongly typed API endpoints and contracts structured for enterprise ASP.NET Web API integration and high availability.',
  },
  {
    icon: StorefrontRoundedIcon,
    tag: 'Scalability',
    title: 'Multi-Register & Store',
    description: 'Easily connect multiple register terminals across different outlets with synchronized product catalogs and unified reporting.',
  },
  {
    icon: PrintRoundedIcon,
    tag: 'Hardware',
    title: 'Receipt & Peripherals',
    description: 'Direct support for ESC/POS thermal printers, magnetic stripe readers, barcode guns, and automated cash drawers.',
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" style={{
      padding: '4rem 1.5rem',
      maxWidth: '1200px',
      margin: '0 auto',
      borderTop: '1px solid #E5E5E5',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', marginBottom: '0.75rem' }}>
          <span className="badge-rounded-outline">Platform Capabilities</span>
        </div>
        <h2 style={{
          fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: '#000000',
        }}>
          Engineered for Daily Retail & Hospitality
        </h2>
        <p style={{
          color: '#525252',
          marginTop: '0.5rem',
          fontSize: '1rem',
          maxWidth: '560px',
          margin: '0.5rem auto 0 auto',
        }}>
          Every module in Nuradesk is crafted to eliminate friction at checkout and simplify day-to-day management.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
      }}>
        {FEATURES.map((item, index) => {
          const IconComp = item.icon;
          return (
            <div
              key={index}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: '1.25rem',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s ease-in-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E5E5';
              }}
            >
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem',
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '0.75rem',
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <IconComp sx={{ fontSize: 22 }} />
                  </div>
                  <span className="badge-rounded-outline" style={{ fontSize: '0.7rem' }}>
                    {item.tag}
                  </span>
                </div>

                <h3 style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#000000',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.02em',
                }}>
                  {item.title}
                </h3>

                <p style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: '#525252',
                }}>
                  {item.description}
                </p>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #F0F0F0' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#000000' }}>
                  Nuradesk Core →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
