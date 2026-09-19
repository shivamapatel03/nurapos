'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import DialpadRoundedIcon from '@mui/icons-material/DialpadRounded';
import BackspaceRoundedIcon from '@mui/icons-material/BackspaceRounded';

export default function PosLoginScreen2() {
  const router = useRouter();
  const [selectedName, setSelectedName] = useState('Alex Vance (Cashier #01)');
  const [pin, setPin] = useState('');
  const [showKeypad, setShowKeypad] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const cashiers = [
    'Alex Vance (Cashier #01)',
    'Sarah Connor (Shift Lead)',
    'James Miller (Manager)',
    'Emma Watson (Barista)',
    'Guest Cashier',
  ];

  const handleKeypadPress = (digit: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + digit);
    }
  };

  const handleKeypadBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleKeypadClear = () => {
    setPin('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      alert('Please enter your cashier PIN.');
      return;
    }
    router.push('/start-shift');
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
          Need help
        </Link>
      </header>

      {/* Centered POS Login Screen 2 Card */}
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

            {/* Store Logo Placeholder Badge matching screenshot */}
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

          {isSuccess ? (
            <div style={{
              backgroundColor: '#FAFAFA',
              border: '1px solid #000000',
              borderRadius: '1rem',
              padding: '1.75rem',
              textAlign: 'center',
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Shift Started!
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '1.25rem' }}>
                Signed in as <strong>{selectedName}</strong>. Terminal register initialized.
              </p>
              <Link href="/" className="button-20 button-20-3d" role="button" style={{ width: '100%' }}>
                Open POS Register
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.15rem',
            }}>
              {/* Select Your name : */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#000000',
                  marginBottom: '0.35rem',
                }}>
                  Select Your name :
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedName}
                    onChange={(e) => setSelectedName(e.target.value)}
                    style={{
                      width: '100%',
                      height: '48px',
                      backgroundColor: '#F0F0F0',
                      border: '1px solid transparent',
                      borderRadius: '0.85rem',
                      padding: '0 2.5rem 0 1.25rem',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      fontWeight: 500,
                      color: '#000000',
                      outline: 'none',
                      appearance: 'none',
                      boxSizing: 'border-box',
                      boxShadow: 'none',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s, background-color 0.15s',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#000000';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.backgroundColor = '#F0F0F0';
                    }}
                  >
                    {cashiers.map((name, i) => (
                      <option key={i} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <span style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#000000',
                  }}>
                    <KeyboardArrowDownRoundedIcon sx={{ fontSize: 22 }} />
                  </span>
                </div>
              </div>

              {/* Enter your PIN (Centered Label & Input) */}
              <div>
                <label style={{
                  display: 'block',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#000000',
                  marginBottom: '0.35rem',
                }}>
                  Enter your PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  style={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: '#F0F0F0',
                    border: '1px solid transparent',
                    borderRadius: '0.85rem',
                    padding: '0 1.25rem',
                    fontSize: '20px',
                    textAlign: 'center',
                    fontFamily: 'inherit',
                    letterSpacing: '0.3em',
                    color: '#000000',
                    outline: 'none',
                    boxSizing: 'border-box',
                    boxShadow: 'none',
                    transition: 'border-color 0.15s, background-color 0.15s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#000000';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.backgroundColor = '#F0F0F0';
                  }}
                />

                {/* Open Keypad link (Right aligned) */}
                <div style={{ textAlign: 'right', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setShowKeypad(!showKeypad)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      color: '#000000',
                      fontFamily: 'inherit',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    <DialpadRoundedIcon sx={{ fontSize: 15 }} />
                    <span>{showKeypad ? 'Close Keypad' : 'Open Keypad'}</span>
                  </button>
                </div>
              </div>

              {/* Optional Touchscreen Keypad (For touchscreen registers) */}
              {showKeypad && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  padding: '10px',
                  backgroundColor: '#F8F8F8',
                  borderRadius: '1rem',
                  border: '1px solid #E5E5E5',
                }}>
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleKeypadPress(num)}
                      style={{
                        height: '42px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #000000',
                        borderRadius: '0.65rem',
                        fontSize: '16px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        color: '#000000',
                        boxShadow: '0 2px 0 #000000',
                      }}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleKeypadClear}
                    style={{
                      height: '42px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #000000',
                      borderRadius: '0.65rem',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: '#000000',
                    }}
                  >
                    C
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('0')}
                    style={{
                      height: '42px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #000000',
                      borderRadius: '0.65rem',
                      fontSize: '16px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: '#000000',
                      boxShadow: '0 2px 0 #000000',
                    }}
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleKeypadBackspace}
                    style={{
                      height: '42px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #000000',
                      borderRadius: '0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#000000',
                    }}
                  >
                    <BackspaceRoundedIcon sx={{ fontSize: 18 }} />
                  </button>
                </div>
              )}

              {/* Signin Button */}
              <div style={{ marginTop: '4px' }}>
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
                  Signin
                </button>
              </div>

              {/* Switch user link */}
              <div style={{
                textAlign: 'center',
                marginTop: '4px',
              }}>
                <Link
                  href="/pos-login-3"
                  style={{
                    fontSize: '13.5px',
                    fontWeight: 700,
                    color: '#000000',
                    textDecoration: 'none',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Switch user
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
