'use client';

import React, { useState, useRef, useEffect } from 'react';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import BackspaceRoundedIcon from '@mui/icons-material/BackspaceRounded';
import DialpadRoundedIcon from '@mui/icons-material/DialpadRounded';
import { setupPosPin, verifyPosPin } from '@/lib/api-client';
import { PosPinTokenResponse } from '@/types/auth';

interface PosPinModalProps {
  isOpen: boolean;
  mode?: 'setup' | 'verify';
  onClose: () => void;
  onSuccess?: (tokenResponse?: PosPinTokenResponse) => void;
  onSwitchMode?: (newMode: 'setup' | 'verify') => void;
}

export default function PosPinModal({
  isOpen,
  mode = 'verify',
  onClose,
  onSuccess,
  onSwitchMode,
}: PosPinModalProps) {
  const [currentMode, setCurrentMode] = useState<'setup' | 'verify'>(mode);
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [focusedInput, setFocusedInput] = useState<'pin' | 'confirm'>('pin');

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setCurrentMode(mode);
    setPin(['', '', '', '']);
    setConfirmPin(['', '', '', '']);
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [mode, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        pinRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen, currentMode]);

  if (!isOpen) return null;

  const handleDigitChange = (
    index: number,
    value: string,
    target: 'pin' | 'confirm'
  ) => {
    const char = value.slice(-1);
    if (char && !/^\d$/.test(char)) return;

    setErrorMessage(null);

    if (target === 'pin') {
      const next = [...pin];
      next[index] = char;
      setPin(next);

      if (char && index < 3) {
        pinRefs.current[index + 1]?.focus();
      } else if (char && index === 3 && currentMode === 'setup') {
        confirmRefs.current[0]?.focus();
        setFocusedInput('confirm');
      } else if (char && index === 3 && currentMode === 'verify') {
        const fullPin = next.join('');
        if (fullPin.length === 4) {
          executeVerify(fullPin);
        }
      }
    } else {
      const next = [...confirmPin];
      next[index] = char;
      setConfirmPin(next);

      if (char && index < 3) {
        confirmRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    target: 'pin' | 'confirm'
  ) => {
    if (e.key === 'Backspace') {
      if (target === 'pin') {
        if (!pin[index] && index > 0) {
          pinRefs.current[index - 1]?.focus();
        }
      } else {
        if (!confirmPin[index] && index > 0) {
          confirmRefs.current[index - 1]?.focus();
        } else if (!confirmPin[index] && index === 0) {
          pinRefs.current[3]?.focus();
          setFocusedInput('pin');
        }
      }
    }
  };

  const handleKeypadPress = (digit: string) => {
    setErrorMessage(null);
    if (currentMode === 'verify') {
      const emptyIndex = pin.findIndex((d) => d === '');
      if (emptyIndex !== -1) {
        handleDigitChange(emptyIndex, digit, 'pin');
      }
    } else {
      if (focusedInput === 'pin') {
        const emptyIndex = pin.findIndex((d) => d === '');
        if (emptyIndex !== -1) {
          handleDigitChange(emptyIndex, digit, 'pin');
        }
      } else {
        const emptyIndex = confirmPin.findIndex((d) => d === '');
        if (emptyIndex !== -1) {
          handleDigitChange(emptyIndex, digit, 'confirm');
        }
      }
    }
  };

  const handleKeypadBackspace = () => {
    setErrorMessage(null);
    if (currentMode === 'verify') {
      for (let i = 3; i >= 0; i--) {
        if (pin[i]) {
          const next = [...pin];
          next[i] = '';
          setPin(next);
          pinRefs.current[i]?.focus();
          return;
        }
      }
    } else {
      if (focusedInput === 'confirm') {
        for (let i = 3; i >= 0; i--) {
          if (confirmPin[i]) {
            const next = [...confirmPin];
            next[i] = '';
            setConfirmPin(next);
            confirmRefs.current[i]?.focus();
            return;
          }
        }
        setFocusedInput('pin');
        pinRefs.current[3]?.focus();
      } else {
        for (let i = 3; i >= 0; i--) {
          if (pin[i]) {
            const next = [...pin];
            next[i] = '';
            setPin(next);
            pinRefs.current[i]?.focus();
            return;
          }
        }
      }
    }
  };

  const handleKeypadClear = () => {
    setPin(['', '', '', '']);
    setConfirmPin(['', '', '', '']);
    setErrorMessage(null);
    pinRefs.current[0]?.focus();
    setFocusedInput('pin');
  };

  const executeVerify = async (fullPin: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await verifyPosPin(fullPin);
      setSuccessMessage(res.message || 'POS PIN verified successfully.');
      setTimeout(() => {
        onSuccess?.(res.data);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid POS PIN. Please try again.');
      setPin(['', '', '', '']);
      pinRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const executeSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPin = pin.join('');
    const fullConfirm = confirmPin.join('');

    if (fullPin.length !== 4) {
      setErrorMessage('Please enter a complete 4-digit POS PIN.');
      return;
    }
    if (fullConfirm.length !== 4) {
      setErrorMessage('Please confirm your 4-digit POS PIN.');
      return;
    }
    if (fullPin !== fullConfirm) {
      setErrorMessage('PINs do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await setupPosPin(fullPin);
      setSuccessMessage(
        res.message || 'POS PIN configured. You can now verify your PIN.'
      );
      setTimeout(() => {
        setCurrentMode('verify');
        setPin(['', '', '', '']);
        setConfirmPin(['', '', '', '']);
        setSuccessMessage(null);
        if (onSwitchMode) onSwitchMode('verify');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to configure POS PIN.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        boxSizing: 'border-box',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          backgroundColor: '#FFFFFF',
          borderRadius: '1.5rem',
          border: '1px solid #E5E7EB',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '2rem 1.75rem',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#F3F4F6',
            color: '#4B5563',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E5E7EB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F3F4F6';
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 18 }} />
        </button>

        {/* Lock Icon Badge */}
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '1rem',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          }}
        >
          {successMessage ? (
            <CheckCircleRoundedIcon sx={{ fontSize: 30, color: '#10B981' }} />
          ) : (
            <LockRoundedIcon sx={{ fontSize: 28 }} />
          )}
        </div>

        {/* Heading */}
        <h2
          style={{
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#000000',
            margin: '0 0 0.35rem 0',
          }}
        >
          {currentMode === 'setup' ? 'Configure Owner POS PIN' : 'Enter 4-Digit POS PIN'}
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '13.5px',
            fontWeight: 500,
            color: '#6B7280',
            margin: '0 0 1.5rem 0',
            lineHeight: 1.45,
            maxWidth: '340px',
          }}
        >
          {currentMode === 'setup'
            ? 'Set a 4-digit security PIN to unlock terminals, cash drawers, and manager functions.'
            : 'Enter your 4-digit franchise owner PIN to unlock POS registers.'}
        </p>

        {/* Alert Messages */}
        {errorMessage && (
          <div
            style={{
              width: '100%',
              padding: '0.6rem 0.85rem',
              borderRadius: '0.75rem',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#B91C1C',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
              textAlign: 'left',
            }}
          >
            <ErrorOutlineRoundedIcon sx={{ fontSize: 18, flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            style={{
              width: '100%',
              padding: '0.6rem 0.85rem',
              borderRadius: '0.75rem',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#047857',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
              textAlign: 'left',
            }}
          >
            <CheckCircleRoundedIcon sx={{ fontSize: 18, flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Mode Forms */}
        {currentMode === 'setup' ? (
          <form onSubmit={executeSetup} style={{ width: '100%' }}>
            {/* New PIN label + bubbles */}
            <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  color: '#111827',
                  marginBottom: '0.4rem',
                }}
              >
                New 4-Digit PIN
              </label>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                {pin.map((digit, idx) => (
                  <input
                    key={`setup-pin-${idx}`}
                    ref={(el) => {
                      pinRefs.current[idx] = el;
                    }}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onFocus={() => setFocusedInput('pin')}
                    onChange={(e) => handleDigitChange(idx, e.target.value, 'pin')}
                    onKeyDown={(e) => handleKeyDown(idx, e, 'pin')}
                    style={{
                      width: '48px',
                      height: '52px',
                      borderRadius: '0.85rem',
                      border: '1.5px solid #E5E7EB',
                      backgroundColor: '#F9FAFB',
                      textAlign: 'center',
                      fontSize: '22px',
                      fontWeight: 800,
                      color: '#000000',
                      outline: 'none',
                      transition: 'all 0.15s ease',
                    }}
                    onFocusCapture={(e) => {
                      e.currentTarget.style.borderColor = '#000000';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                    onBlurCapture={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Confirm PIN label + bubbles */}
            <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  color: '#111827',
                  marginBottom: '0.4rem',
                }}
              >
                Confirm 4-Digit PIN
              </label>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                {confirmPin.map((digit, idx) => (
                  <input
                    key={`confirm-pin-${idx}`}
                    ref={(el) => {
                      confirmRefs.current[idx] = el;
                    }}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onFocus={() => setFocusedInput('confirm')}
                    onChange={(e) =>
                      handleDigitChange(idx, e.target.value, 'confirm')
                    }
                    onKeyDown={(e) => handleKeyDown(idx, e, 'confirm')}
                    style={{
                      width: '48px',
                      height: '52px',
                      borderRadius: '0.85rem',
                      border: '1.5px solid #E5E7EB',
                      backgroundColor: '#F9FAFB',
                      textAlign: 'center',
                      fontSize: '22px',
                      fontWeight: 800,
                      color: '#000000',
                      outline: 'none',
                      transition: 'all 0.15s ease',
                    }}
                    onFocusCapture={(e) => {
                      e.currentTarget.style.borderColor = '#000000';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                    onBlurCapture={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Save PIN Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="button-20-3d"
              role="button"
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '0.85rem',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
              }}
            >
              {isLoading ? 'Saving PIN...' : 'Save & Configure PIN'}
            </button>

            <button
              type="button"
              onClick={() => setCurrentMode('verify')}
              style={{
                background: 'none',
                border: 'none',
                color: '#6B7280',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Already configured? Verify PIN instead
            </button>
          </form>
        ) : (
          <div style={{ width: '100%' }}>
            {/* 4 Digit Verify Bubbles */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '14px',
                marginBottom: '1.5rem',
              }}
            >
              {pin.map((digit, idx) => (
                <input
                  key={`verify-pin-${idx}`}
                  ref={(el) => {
                    pinRefs.current[idx] = el;
                  }}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value, 'pin')}
                  onKeyDown={(e) => handleKeyDown(idx, e, 'pin')}
                  style={{
                    width: '54px',
                    height: '58px',
                    borderRadius: '1rem',
                    border: '2px solid #E5E7EB',
                    backgroundColor: digit ? '#F3F4F6' : '#FFFFFF',
                    textAlign: 'center',
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#000000',
                    outline: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onFocusCapture={(e) => {
                    e.currentTarget.style.borderColor = '#000000';
                  }}
                  onBlurCapture={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }}
                />
              ))}
            </div>

            {/* Numeric Keypad for fast touch/mouse input */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                width: '100%',
                maxWidth: '280px',
                margin: '0 auto 1.25rem auto',
              }}
            >
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  disabled={isLoading}
                  style={{
                    height: '46px',
                    borderRadius: '0.75rem',
                    backgroundColor: '#F3F4F6',
                    border: '1px solid #E5E7EB',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#111827',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.96)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5E7EB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                  }}
                >
                  {digit}
                </button>
              ))}

              <button
                type="button"
                onClick={handleKeypadClear}
                disabled={isLoading}
                style={{
                  height: '46px',
                  borderRadius: '0.75rem',
                  backgroundColor: '#F3F4F6',
                  border: '1px solid #E5E7EB',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#6B7280',
                  cursor: 'pointer',
                }}
              >
                CLEAR
              </button>

              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                disabled={isLoading}
                style={{
                  height: '46px',
                  borderRadius: '0.75rem',
                  backgroundColor: '#F3F4F6',
                  border: '1px solid #E5E7EB',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#111827',
                  cursor: 'pointer',
                }}
              >
                0
              </button>

              <button
                type="button"
                onClick={handleKeypadBackspace}
                disabled={isLoading}
                style={{
                  height: '46px',
                  borderRadius: '0.75rem',
                  backgroundColor: '#F3F4F6',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4B5563',
                  cursor: 'pointer',
                }}
              >
                <BackspaceRoundedIcon sx={{ fontSize: 18 }} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setCurrentMode('setup')}
              style={{
                background: 'none',
                border: 'none',
                color: '#6B7280',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Need to setup or change your 4-digit PIN?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
