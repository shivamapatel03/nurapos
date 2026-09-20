'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

export default function PosLoginScreen3() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<string>('Amit');

  const users = [
    {
      id: 'amit',
      name: 'Amit',
      role: 'Cashier',
      // Male silhouette matching screenshot
      avatar: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
    },
    {
      id: 'priya',
      name: 'Priya',
      role: 'Cashier',
      // Female silhouette with hair matching screenshot
      avatar: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C9.79 2 8 3.79 8 6c0 1.25.57 2.36 1.46 3.09C8.36 9.77 7.6 10.78 7.21 12H7c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h.18c.67 2.37 2.87 4 5.42 4s4.75-1.63 5.42-4H18c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-.21c-.39-1.22-1.15-2.23-2.25-2.91.89-.73 1.46-1.84 1.46-3.09 0-2.21-1.79-4-4-4zm-2 4c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-6 14v-1c0-2.21 3.58-4 8-4s8 1.79 8 4v1H4z" />
        </svg>
      ),
    },
  ];

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // Route to PIN screen (screen 2) for the chosen user
    router.push('/pos-login-2');
  };

  return (
    <div style={{
      height: '100vh',
      maxHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
      boxSizing: 'border-box',
    }}>
      {/* Top Header with "Need help" */}
      <header style={{
        height: '56px',
        padding: '0 2.5rem',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <Link
          href="#help"
          onClick={(e) => {
            e.preventDefault();
            alert('Nuradesk Terminal Support: support@nuradesk.com');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '15px',
            fontWeight: 600,
            color: '#000000',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          <HelpOutlineRoundedIcon sx={{ fontSize: 18 }} />
          <span>Need help</span>
        </Link>
      </header>

      {/* Centered POS Login Screen 3 Card */}
      <main style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        boxSizing: 'border-box',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E5E5',
          borderRadius: '1.25rem',
          padding: 'clamp(1.75rem, 3.5vh, 2.5rem)',
          boxSizing: 'border-box',
        }}>
          {/* Card Header: Brand Logo + Nuradesk on left, 'store logo' pill on right */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
          }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                position: 'relative',
                borderRadius: '9999px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Image
                  src="/logo.png"
                  alt="Nuradesk Logo"
                  width={42}
                  height={42}
                  priority
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span style={{
                fontSize: '24px',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                color: '#000000',
              }}>
                Nuradesk
              </span>
            </Link>

            {/* Store Logo Placeholder Badge */}
            <div style={{
              backgroundColor: '#E5E5E5',
              color: '#404040',
              padding: '0.35rem 0.95rem',
              borderRadius: '9999px',
              fontSize: '12.5px',
              fontWeight: 700,
              letterSpacing: '-0.01em',
            }}>
              store logo
            </div>
          </div>

          {/* Heading */}
          <h2 style={{
            textAlign: 'center',
            fontSize: '17px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#000000',
            marginBottom: '1.5rem',
          }}>
            Who&apos;s using this POS?
          </h2>

          <form onSubmit={handleContinue} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}>
            {/* Two User Cards Side by Side */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}>
              {users.map((user) => {
                const isSelected = selectedUser === user.name;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedUser(user.name)}
                    style={{
                      backgroundColor: '#EFEFEF',
                      border: isSelected ? '2px solid #000000' : '2px solid transparent',
                      borderRadius: '1.15rem',
                      padding: '1.25rem 0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.65rem',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s, background-color 0.15s, transform 0.1s',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    }}
                  >
                    <span style={{
                      fontSize: '15px',
                      fontWeight: 800,
                      color: '#000000',
                      letterSpacing: '-0.01em',
                    }}>
                      {user.name}
                    </span>

                    <div style={{
                      color: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {user.avatar}
                    </div>

                    <span style={{
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#000000',
                      letterSpacing: '-0.01em',
                    }}>
                      {user.role}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Continue Button with 3D tactile press look */}
            <div>
              <button
                type="submit"
                className="button-20-3d"
                role="button"
                style={{
                  width: '100%',
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  borderRadius: '1rem',
                }}
              >
                Continue
              </button>
            </div>

            {/* Use another account link */}
            <div style={{
              textAlign: 'center',
              marginTop: '-0.35rem',
            }}>
              <Link
                href="/pos-login"
                style={{
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: '#000000',
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                }}
              >
                Use another account
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
