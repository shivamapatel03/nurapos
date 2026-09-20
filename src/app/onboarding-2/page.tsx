'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

interface CountryItem {
  name: string;
  code: string;
  dialCode: string;
}

const COUNTRIES: CountryItem[] = [
  { name: 'India', code: 'IN', dialCode: '+91' },
  { name: 'United States', code: 'US', dialCode: '+1' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44' },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971' },
  { name: 'Canada', code: 'CA', dialCode: '+1' },
  { name: 'Australia', code: 'AU', dialCode: '+61' },
  { name: 'Singapore', code: 'SG', dialCode: '+65' },
  { name: 'Germany', code: 'DE', dialCode: '+49' },
  { name: 'France', code: 'FR', dialCode: '+33' },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966' },
  { name: 'Qatar', code: 'QA', dialCode: '+974' },
  { name: 'Japan', code: 'JP', dialCode: '+81' },
  { name: 'Malaysia', code: 'MY', dialCode: '+60' },
  { name: 'South Africa', code: 'ZA', dialCode: '+27' },
  { name: 'Brazil', code: 'BR', dialCode: '+55' },
];

const BUSINESS_TYPES = [
  'Cafe',
  'Retail',
  'Restaurant & Dining',
  'Quick Service / Fast Food',
  'Bakery & Dessert',
  'Supermarket & Grocery',
  'Boutique & Clothing',
  'Bar & Lounge',
  'Salon & Spa',
  'Other',
];

export default function OnboardingScreen2() {
  const router = useRouter();

  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Cafe');
  const [selectedCountry, setSelectedCountry] = useState<CountryItem>(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showFlagDropdown, setShowFlagDropdown] = useState(false);
  const [flagSearch, setFlagSearch] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFlagDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountryChange = (country: CountryItem) => {
    setSelectedCountry(country);
    setShowFlagDropdown(false);
    setFlagSearch('');
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/onboarding-3');
  };

  const handleBack = () => {
    router.push('/onboarding');
  };

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(flagSearch.toLowerCase()) ||
      c.dialCode.includes(flagSearch) ||
      c.code.toLowerCase().includes(flagSearch.toLowerCase())
  );

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

      {/* Main Centered Business Setup Form */}
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
          Create your business
        </h1>

        <form onSubmit={handleContinue} style={{
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.15rem',
        }}>
          {/* Field 1: Business name */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 700,
              color: '#000000',
              marginBottom: '0.4rem',
              letterSpacing: '-0.01em',
            }}>
              Business name
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
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

          {/* Field 2: Business type dropdown */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 700,
              color: '#000000',
              marginBottom: '0.4rem',
              letterSpacing: '-0.01em',
            }}>
              Business type
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
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
                {BUSINESS_TYPES.map((type, i) => (
                  <option key={i} value={type}>
                    {type}
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

          {/* Field 3: Phone number with FlagsAPI real flag dropdown */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 700,
              color: '#000000',
              marginBottom: '0.4rem',
              letterSpacing: '-0.01em',
            }}>
              Phone number
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '46px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '0.65rem',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}>
              {/* Flag + Dial Code trigger */}
              <button
                type="button"
                onClick={() => setShowFlagDropdown((prev) => !prev)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0 0.65rem 0 0.85rem',
                  height: '100%',
                  background: 'none',
                  border: 'none',
                  borderRight: '1px solid #F0F0F0',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {/* Real Country Flag from FlagsAPI */}
                <Image
                  src={`https://flagsapi.com/${selectedCountry.code}/flat/64.png`}
                  alt={`${selectedCountry.name} Flag`}
                  width={22}
                  height={15}
                  unoptimized
                  style={{
                    objectFit: 'cover',
                    borderRadius: '2px',
                    boxShadow: '0 0 1px rgba(0,0,0,0.2)',
                  }}
                />
                <span style={{
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: '#000000',
                }}>
                  {selectedCountry.dialCode}
                </span>
                <KeyboardArrowDownRoundedIcon sx={{ fontSize: 16, color: '#000000' }} />
              </button>

              {/* Phone number digits input */}
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder=""
                style={{
                  flex: 1,
                  height: '100%',
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '0 0.85rem',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  fontWeight: 500,
                  color: '#000000',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Real Flag Dropdown Popover */}
            {showFlagDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '100%',
                maxHeight: '220px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #000000',
                borderRadius: '0.65rem',
                marginTop: '4px',
                overflowY: 'auto',
                zIndex: 50,
                boxShadow: 'none',
              }}>
                <div style={{ padding: '0.45rem' }}>
                  <input
                    type="text"
                    value={flagSearch}
                    onChange={(e) => setFlagSearch(e.target.value)}
                    placeholder="Search country..."
                    autoFocus
                    style={{
                      width: '100%',
                      height: '34px',
                      backgroundColor: '#F5F5F5',
                      border: '1px solid #E5E5E5',
                      borderRadius: '0.45rem',
                      padding: '0 0.65rem',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                {filteredCountries.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCountryChange(c)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: selectedCountry.code === c.code ? '#F0F0F0' : 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F5F5'; }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = selectedCountry.code === c.code ? '#F0F0F0' : 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Image
                        src={`https://flagsapi.com/${c.code}/flat/64.png`}
                        alt={`${c.name} Flag`}
                        width={22}
                        height={15}
                        unoptimized
                        style={{ objectFit: 'cover', borderRadius: '2px' }}
                      />
                      <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#000000' }}>
                        {c.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '13px', color: '#555555', fontWeight: 500 }}>
                      {c.dialCode}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Field 4: Country dropdown */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 700,
              color: '#000000',
              marginBottom: '0.4rem',
              letterSpacing: '-0.01em',
            }}>
              Country
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedCountry.name}
                onChange={(e) => {
                  const found = COUNTRIES.find((c) => c.name === e.target.value);
                  if (found) setSelectedCountry(found);
                }}
                style={{
                  width: '100%',
                  height: '46px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: '0.65rem',
                  padding: '0 2.5rem 0 1rem',
                  fontSize: '14.5px',
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
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
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
