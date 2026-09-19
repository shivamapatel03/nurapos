'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const CITIES = [
  'Surat',
  'Ahmedabad',
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Jaipur',
  'Chandigarh',
  'Indore',
  'Vadodara',
  'Rajkot',
  'Other',
];

export default function OnboardingScreen3() {
  const router = useRouter();

  const [storeName, setStoreName] = useState('');
  const [storeCode, setStoreCode] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [city, setCity] = useState('Surat');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/onboarding-4');
  };

  const handleBack = () => {
    router.push('/onboarding-2');
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
      {/* Top Header */}
      <header style={{
        height: '72px',
        padding: '0 clamp(1.5rem, 4vw, 3rem)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        {/* Brand Logo + Name */}
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

        {/* Need Help Link */}
        <Link
          href="#help"
          onClick={(e) => {
            e.preventDefault();
            alert('Nuradesk Onboarding Support: support@nuradesk.com');
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

      {/* Main Centered Store Setup Form */}
      <main style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        boxSizing: 'border-box',
      }}>
        {/* Form Title */}
        <h1 style={{
          fontSize: 'clamp(20px, 2.2vw, 24px)',
          fontWeight: 800,
          color: '#000000',
          letterSpacing: '-0.03em',
          marginBottom: '1.75rem',
          textAlign: 'center',
        }}>
          Set up your first store
        </h1>

        <form onSubmit={handleContinue} style={{
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.15rem',
        }}>
          {/* Field 1: Store name */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 700,
              color: '#000000',
              marginBottom: '0.4rem',
              letterSpacing: '-0.01em',
            }}>
              Store name
            </label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder=""
              style={{
                width: '100%',
                height: '46px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: '0.65rem',
                padding: '0 1rem',
                fontSize: '15px',
                fontFamily: 'inherit',
                fontWeight: 500,
                color: '#000000',
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#000000'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; }}
            />
          </div>

          {/* Field 2: Store code */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 700,
              color: '#000000',
              marginBottom: '0.4rem',
              letterSpacing: '-0.01em',
            }}>
              Store code
            </label>
            <input
              type="text"
              required
              value={storeCode}
              onChange={(e) => setStoreCode(e.target.value)}
              placeholder=""
              style={{
                width: '100%',
                height: '46px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: '0.65rem',
                padding: '0 1rem',
                fontSize: '15px',
                fontFamily: 'inherit',
                fontWeight: 500,
                color: '#000000',
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#000000'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; }}
            />
          </div>

          {/* Field 3: Store address */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 700,
              color: '#000000',
              marginBottom: '0.4rem',
              letterSpacing: '-0.01em',
            }}>
              Store address
            </label>
            <input
              type="text"
              required
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              placeholder=""
              style={{
                width: '100%',
                height: '46px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: '0.65rem',
                padding: '0 1rem',
                fontSize: '15px',
                fontFamily: 'inherit',
                fontWeight: 500,
                color: '#000000',
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#000000'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; }}
            />
          </div>

          {/* Field 4: City dropdown */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 700,
              color: '#000000',
              marginBottom: '0.4rem',
              letterSpacing: '-0.01em',
            }}>
              City
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{
                  width: '100%',
                  height: '46px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: '0.65rem',
                  padding: '0 2.5rem 0 1rem',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  fontWeight: 500,
                  color: '#000000',
                  outline: 'none',
                  appearance: 'none',
                  boxSizing: 'border-box',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#000000'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; }}
              >
                {CITIES.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <span style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                color: '#000000',
              }}>
                <KeyboardArrowDownRoundedIcon sx={{ fontSize: 20 }} />
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            marginTop: '0.5rem',
          }}>
            {/* Continue Button */}
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
                borderRadius: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Continue
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={handleBack}
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #000000',
                borderRadius: '0.85rem',
                fontSize: '16px',
                fontWeight: 700,
                color: '#000000',
                letterSpacing: '-0.01em',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F5F5'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
            >
              Back
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
