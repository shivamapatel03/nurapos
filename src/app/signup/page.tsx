'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { SignupFormData } from '@/types/auth';
import { signupUser } from '@/lib/api-client';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isAcceptingTerms, setIsAcceptingTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Verification code sent popup modal state
  const [verificationPopup, setVerificationPopup] = useState<{
    email: string;
    verificationId?: string;
    expiresAtUtc?: string;
    message?: string;
  } | null>(null);
  const [redirectSeconds, setRedirectSeconds] = useState<number>(4);

  // Auto redirect countdown when popup is shown
  useEffect(() => {
    if (!verificationPopup) return;
    setRedirectSeconds(4);
    const timer = setInterval(() => {
      setRedirectSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          goToVerifyEmail(verificationPopup.email, verificationPopup.verificationId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [verificationPopup]);

  const goToVerifyEmail = (targetEmail: string, vId?: string) => {
    const params = new URLSearchParams({ email: targetEmail });
    if (vId) params.set('verificationId', vId);
    router.push(`/verify-email?${params.toString()}`);
  };

  // Password validation criteria
  const passwordRules = [
    {
      id: 'min_length',
      label: 'Min 6 characters',
      valid: password.length >= 6,
    },
    {
      id: 'uppercase',
      label: 'Uppercase letter (A-Z)',
      valid: /[A-Z]/.test(password),
    },
    {
      id: 'lowercase',
      label: 'Lowercase letter (a-z)',
      valid: /[a-z]/.test(password),
    },
    {
      id: 'special',
      label: 'Special symbol (!@#$...)',
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const allRulesValid = passwordRules.every((rule) => rule.valid);
  const validRulesCount = passwordRules.filter((rule) => rule.valid).length;

  const getStrengthLabel = () => {
    if (!password) return '';
    if (validRulesCount <= 1) return 'Weak';
    if (validRulesCount === 2) return 'Fair';
    if (validRulesCount === 3) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (validRulesCount <= 1) return '#DC2626';
    if (validRulesCount === 2) return '#D97706';
    if (validRulesCount === 3) return '#2563EB';
    return '#16A34A';
  };

  const handleAcceptTerms = () => {
    if (isAcceptingTerms) return;
    setIsAcceptingTerms(true);
    setTimeout(() => {
      setIsAcceptingTerms(false);
      setAgreeTerms(true);
      setShowTermsModal(false);
      if (formError) setFormError(null);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (!allRulesValid) {
      setFormError('Password must meet all 4 criteria (uppercase, lowercase, min 6 characters, and special symbol).');
      return;
    }

    if (!confirmPassword) {
      setFormError('Please confirm your password.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please verify both fields.');
      return;
    }

    if (!agreeTerms) {
      setFormError(null);
      setShowTermsModal(true);
      return;
    }

    setFormError(null);
    if (isLoading) return;
    setIsLoading(true);

    const payload: SignupFormData = {
      name: fullName.trim(),
      email: email.trim(),
      password,
      confirmPassword,
    };

    try {
      // POST /api/auth/signup to backend (http://localhost:5076/api/auth/signup)
      const res = await signupUser(payload);

      // Persist signup email & verification info for verify-email screen
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('nurapos_signup_email', payload.email);
        if (res.data?.verificationId) {
          sessionStorage.setItem('nurapos_verification_id', res.data.verificationId);
        }
        if (res.data?.expiresAtUtc) {
          sessionStorage.setItem('nurapos_verification_expires', res.data.expiresAtUtc);
        }
      }

      // Display the verification code popup modal
      setVerificationPopup({
        email: payload.email,
        verificationId: res.data?.verificationId,
        expiresAtUtc: res.data?.expiresAtUtc,
        message: res.message || 'Verification code sent.',
      });
    } catch (err: any) {
      console.error('Signup error:', err);
      const errorMsg =
        err?.message ||
        'Failed to connect to the authentication service. Please check your backend at http://localhost:5076';
      setFormError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const unsplashImageUrl = 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1200&auto=format&fit=crop';

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      overflowX: 'hidden',
      backgroundColor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "var(--font-inter, 'Inter', sans-serif)",
      boxSizing: 'border-box',
    }}>
      {/* Top Header with "Need help" */}
      <header style={{
        height: '52px',
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
            alert('Nuradesk Support: support@nuradesk.com');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.92rem',
            fontWeight: 500,
            color: '#000000',
            textDecoration: 'none',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          <HelpOutlineRoundedIcon sx={{ fontSize: 18 }} />
          <span>Need help</span>
        </Link>
      </header>

      {/* Main Split Layout: Fit to Desktop Viewport */}
      <main style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 2.5rem 1.25rem 2.5rem',
        boxSizing: 'border-box',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1150px',
          height: '100%',
          maxHeight: 'calc(100vh - 68px)',
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 1.15fr) minmax(320px, 1fr)',
          gap: 'clamp(1.5rem, 3.5vw, 3.5rem)',
          alignItems: 'center',
        }}>
          {/* Left Column: Rounded Unsplash Image */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            maxHeight: 'calc(100vh - 84px)',
            borderRadius: '1.5rem',
            overflow: 'hidden',
            backgroundColor: '#F5F5F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={unsplashImageUrl}
              alt="Nuradesk POS in action"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                borderRadius: '1.5rem',
              }}
            />
          </div>

          {/* Right Column: Signup Form */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: '430px',
            width: '100%',
            margin: '0 auto',
            maxHeight: 'calc(100vh - 74px)',
            overflowY: 'auto',
            padding: '0.25rem 0.25rem 0.25rem 0',
            boxSizing: 'border-box',
          }}>
            {/* Brand Header */}
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
                marginBottom: 'clamp(0.4rem, 0.9vh, 0.85rem)',
              }}
            >
              <div style={{
                width: '38px',
                height: '38px',
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
                  width={38}
                  height={38}
                  priority
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span style={{
                fontSize: '1.55rem',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                color: '#000000',
              }}>
                Nuradesk
              </span>
            </Link>

            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(1.45rem, 2vw, 1.85rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#000000',
              marginBottom: 'clamp(0.5rem, 1vh, 0.9rem)',
            }}>
              Create Account
            </h1>

            {/* Error message banner */}
            {formError && (
              <div style={{
                marginBottom: '0.65rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: '0.75rem',
                color: '#B91C1C',
                fontSize: '0.8rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 16, flexShrink: 0 }} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(0.4rem, 0.9vh, 0.7rem)',
            }}>
              {/* Full Name Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: '#000000',
                  marginBottom: '0.2rem',
                }}>
                  Enter Full Name :
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  style={{
                    width: '100%',
                    height: '42px',
                    backgroundColor: '#F0F0F0',
                    border: '1px solid transparent',
                    borderRadius: '0.85rem',
                    padding: '0 1rem',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
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
              </div>

              {/* Email Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: '#000000',
                  marginBottom: '0.2rem',
                }}>
                  Email :
                </label>
                <input
                  type="email"
                  required
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  style={{
                    width: '100%',
                    height: '42px',
                    backgroundColor: '#F0F0F0',
                    border: '1px solid transparent',
                    borderRadius: '0.85rem',
                    padding: '0 1rem',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
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
              </div>

              {/* Password Field */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.2rem',
                }}>
                  <label style={{
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: '#000000',
                  }}>
                    Create Password :
                  </label>
                  {password.length > 0 && (
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: getStrengthColor(),
                    }}>
                      {getStrengthLabel()}
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Create your password"
                    value={password}
                    onFocus={(e) => {
                      setPasswordFocused(true);
                      e.currentTarget.style.borderColor = '#000000';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.backgroundColor = '#F0F0F0';
                    }}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    style={{
                      width: '100%',
                      height: '42px',
                      backgroundColor: '#F0F0F0',
                      border: '1px solid transparent',
                      borderRadius: '0.85rem',
                      padding: '0 2.8rem 0 1rem',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      color: '#000000',
                      outline: 'none',
                      boxSizing: 'border-box',
                      boxShadow: 'none',
                      transition: 'border-color 0.15s, background-color 0.15s',
                    }}
                  />
                  {password.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#525252',
                        padding: '4px',
                        borderRadius: '0.35rem',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#000000'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#525252'; }}
                    >
                      {showPassword ? (
                        <VisibilityOffRoundedIcon sx={{ fontSize: 20 }} />
                      ) : (
                        <VisibilityRoundedIcon sx={{ fontSize: 20 }} />
                      )}
                    </button>
                  )}
                </div>

                {/* Password Validation Checklist & Strength Indicator */}
                {(passwordFocused || password.length > 0) && (
                  <div style={{
                    marginTop: '0.35rem',
                    padding: '0.5rem 0.65rem',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '0.75rem',
                    border: '1px solid #E2E8F0',
                  }}>
                    {/* 4-bar indicator */}
                    <div style={{
                      display: 'flex',
                      gap: '4px',
                      marginBottom: '0.45rem',
                      width: '100%',
                    }}>
                      {[0, 1, 2, 3].map((index) => {
                        const isFilled = password.length > 0 && validRulesCount > index;
                        let barColor = '#E2E8F0';
                        if (isFilled) {
                          if (validRulesCount <= 1) barColor = '#EF4444';
                          else if (validRulesCount === 2) barColor = '#F59E0B';
                          else if (validRulesCount === 3) barColor = '#3B82F6';
                          else barColor = '#10B981';
                        }
                        return (
                          <div
                            key={index}
                            style={{
                              flex: 1,
                              height: '3px',
                              borderRadius: '9999px',
                              backgroundColor: barColor,
                              transition: 'background-color 0.25s ease',
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* Criteria 2x2 grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.25rem 0.45rem',
                    }}>
                      {passwordRules.map((rule) => {
                        const isMet = rule.valid;
                        return (
                          <div
                            key={rule.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              fontSize: '0.73rem',
                              fontWeight: isMet ? 600 : 500,
                              color: isMet ? '#15803D' : '#64748B',
                              transition: 'color 0.15s ease',
                            }}
                          >
                            {isMet ? (
                              <CheckRoundedIcon sx={{ fontSize: 13, color: '#16A34A', flexShrink: 0 }} />
                            ) : (
                              <span style={{
                                width: '13px',
                                height: '13px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}>
                                <span style={{
                                  width: '4px',
                                  height: '4px',
                                  borderRadius: '50%',
                                  backgroundColor: '#94A3B8',
                                }} />
                              </span>
                            )}
                            <span>{rule.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.2rem',
                }}>
                  <label style={{
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: '#000000',
                  }}>
                    Confirm Password :
                  </label>
                  {confirmPassword.length > 0 && (
                    <span style={{
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      color: confirmPassword === password ? '#16A34A' : '#DC2626',
                    }}>
                      {confirmPassword === password ? (
                        <>
                          <CheckRoundedIcon sx={{ fontSize: 13 }} />
                          <span>Passwords match</span>
                        </>
                      ) : (
                        <span>Passwords do not match</span>
                      )}
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    style={{
                      width: '100%',
                      height: '42px',
                      backgroundColor: '#F0F0F0',
                      border: confirmPassword.length > 0 && confirmPassword !== password
                        ? '1px solid #DC2626'
                        : confirmPassword.length > 0 && confirmPassword === password
                          ? '1px solid #16A34A'
                          : '1px solid transparent',
                      borderRadius: '0.85rem',
                      padding: '0 2.8rem 0 1rem',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      color: '#000000',
                      outline: 'none',
                      boxSizing: 'border-box',
                      boxShadow: 'none',
                      transition: 'border-color 0.15s, background-color 0.15s',
                    }}
                    onFocus={(e) => {
                      if (confirmPassword.length > 0 && confirmPassword !== password) {
                        e.currentTarget.style.borderColor = '#DC2626';
                      } else if (confirmPassword.length > 0 && confirmPassword === password) {
                        e.currentTarget.style.borderColor = '#16A34A';
                      } else {
                        e.currentTarget.style.borderColor = '#000000';
                      }
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                    onBlur={(e) => {
                      if (confirmPassword.length > 0 && confirmPassword !== password) {
                        e.currentTarget.style.borderColor = '#DC2626';
                      } else if (confirmPassword.length > 0 && confirmPassword === password) {
                        e.currentTarget.style.borderColor = '#16A34A';
                      } else {
                        e.currentTarget.style.borderColor = 'transparent';
                      }
                      e.currentTarget.style.backgroundColor = '#F0F0F0';
                    }}
                  />
                  {confirmPassword.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#525252',
                        padding: '4px',
                        borderRadius: '0.35rem',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#000000'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#525252'; }}
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffRoundedIcon sx={{ fontSize: 20 }} />
                      ) : (
                        <VisibilityRoundedIcon sx={{ fontSize: 20 }} />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Terms and Privacy Checkbox */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                marginTop: '0.1rem',
              }}>
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setShowTermsModal(true);
                    } else {
                      setAgreeTerms(false);
                    }
                  }}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#000000',
                    cursor: 'pointer',
                    boxShadow: 'none',
                  }}
                />
                <label
                  htmlFor="terms-checkbox"
                  style={{
                    fontSize: '0.8rem',
                    color: '#000000',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  I agree to{' '}
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowTermsModal(true);
                    }}
                    style={{
                      fontWeight: 800,
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      color: '#000000',
                    }}
                  >
                    Terms &amp; Privacy Policy
                  </span>
                </label>
              </div>

              {/* Submit Button using user .button-20 with 3D tactile look & buffer loading */}
              <div style={{ marginTop: '0.2rem' }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="button-20-3d"
                  role="button"
                  style={{
                    width: '100%',
                    height: '44px',
                    fontSize: '0.96rem',
                    fontWeight: 600,
                    borderRadius: '0.9rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.55rem',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.85 : 1,
                    outline: 'none',
                  }}
                >
                  {isLoading ? (
                    <>
                      <svg
                        style={{
                          width: '18px',
                          height: '18px',
                          animation: 'spin 0.75s linear infinite',
                          flexShrink: 0,
                        }}
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeOpacity="0.25"
                        />
                        <path
                          d="M12 2a10 10 0 0 1 10 10"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </div>

              {/* Already Have an Account link */}
              <div style={{
                textAlign: 'center',
                marginTop: '0.25rem',
                fontSize: '0.84rem',
                color: '#000000',
              }}>
                Already Have an Account?{' '}
                <Link
                  href="/signin"
                  style={{
                    fontWeight: 700,
                    color: '#000000',
                    textDecoration: 'none',
                  }}
                >
                  Signin
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Verification Code Sent Popup Modal */}
      {verificationPopup && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(5px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            boxSizing: 'border-box',
          }}
          onClick={() => goToVerifyEmail(verificationPopup.email, verificationPopup.verificationId)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '1.5rem',
              width: '100%',
              maxWidth: '460px',
              padding: '2.25rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxSizing: 'border-box',
              border: '1px solid #E5E7EB',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => goToVerifyEmail(verificationPopup.email, verificationPopup.verificationId)}
              aria-label="Close and continue to verification"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#F4F4F5',
                border: 'none',
                cursor: 'pointer',
                width: '32px',
                height: '32px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#333333',
                transition: 'background 0.15s',
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </button>

            {/* Email Icon with Checkmark */}
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: '#F0FDF4',
                border: '2px solid #BBF7D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                marginBottom: '1.25rem',
              }}
            >
              <EmailRoundedIcon sx={{ fontSize: 38, color: '#16A34A' }} />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircleRoundedIcon sx={{ fontSize: 22, color: '#16A34A' }} />
              </div>
            </div>

            {/* Modal Heading */}
            <h3
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#000000',
                letterSpacing: '-0.025em',
              }}
            >
              Verification Code Sent!
            </h3>

            {/* Modal Body with highlighted target email */}
            <p
              style={{
                margin: '0 0 1.5rem 0',
                fontSize: '0.92rem',
                color: '#4B5563',
                lineHeight: 1.6,
              }}
            >
              A 4-digit verification code has been sent to{' '}
              <strong style={{ color: '#000000', fontWeight: 800, wordBreak: 'break-all' }}>
                {verificationPopup.email}
              </strong>
              . Please enter the code to complete your registration.
            </p>

            {/* Action button */}
            <button
              type="button"
              onClick={() => goToVerifyEmail(verificationPopup.email, verificationPopup.verificationId)}
              className="button-20-3d"
              role="button"
              style={{
                width: '100%',
                height: '48px',
                fontSize: '0.96rem',
                fontWeight: 700,
                borderRadius: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <span>Continue to Verification ({redirectSeconds}s)</span>
            </button>
          </div>
        </div>
      )}

      {/* Terms & Privacy Policy Popup Modal */}
      {showTermsModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            boxSizing: 'border-box',
          }}
          onClick={() => setShowTermsModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '1.25rem',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxSizing: 'border-box',
              border: '1px solid #E5E7EB',
              boxShadow: 'none',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #F0F0F2',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#000000',
                    letterSpacing: '-0.025em',
                  }}
                >
                  Terms &amp; Privacy Policy
                </h3>
                <p
                  style={{
                    margin: '0.2rem 0 0 0',
                    fontSize: '0.82rem',
                    color: '#666666',
                    fontWeight: 500,
                  }}
                >
                  Temporary terms and privacy policy for Nuradesk
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                aria-label="Close"
                style={{
                  background: '#F4F4F5',
                  border: 'none',
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#333333',
                  transition: 'background 0.15s',
                }}
              >
                <CloseRoundedIcon sx={{ fontSize: 18 }} />
              </button>
            </div>

            {/* Modal Body / Scrollable Content */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                overflowY: 'auto',
                fontSize: '0.86rem',
                color: '#374151',
                lineHeight: 1.6,
                display: 'flex',
                flexDirection: 'column',
                gap: '1.1rem',
              }}
            >
              <div>
                <h4 style={{ margin: '0 0 0.35rem 0', color: '#000000', fontSize: '0.92rem', fontWeight: 700 }}>
                  1. Acceptance of Terms
                </h4>
                <p style={{ margin: 0, color: '#4B5563' }}>
                  By checking the agreement box or using the Nuradesk platform, you acknowledge and accept these terms governing access, billing, and system operations for your business.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.35rem 0', color: '#000000', fontSize: '0.92rem', fontWeight: 700 }}>
                  2. Store &amp; Customer Data Privacy
                </h4>
                <p style={{ margin: 0, color: '#4B5563' }}>
                  Your business data belongs to you. Nuradesk secures your catalog items, sales history, and customer details with enterprise encryption and never resells your commercial information to third-party advertisers.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.35rem 0', color: '#000000', fontSize: '0.92rem', fontWeight: 700 }}>
                  3. Offline Mode &amp; Local Storage
                </h4>
                <p style={{ margin: 0, color: '#4B5563' }}>
                  When working offline, transactions and register records are cached on your browser and hardware device. You agree to sync your local cache to the cloud periodically to maintain accurate fiscal records.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.35rem 0', color: '#000000', fontSize: '0.92rem', fontWeight: 700 }}>
                  4. Free Trial &amp; Subscription Terms
                </h4>
                <p style={{ margin: 0, color: '#4B5563' }}>
                  All new signups receive full platform capabilities during their 30-day trial without needing credit card verification. You may cancel, modify, or export your store data at any point without fees.
                </p>
              </div>
            </div>

            {/* Modal Footer with Decline and Accept buttons using button-20 CSS */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid #F0F0F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                backgroundColor: '#FAFAFB',
              }}
            >
              <button
                type="button"
                disabled={isAcceptingTerms}
                onClick={() => {
                  setAgreeTerms(false);
                  setShowTermsModal(false);
                }}
                className="button-20-secondary"
                role="button"
                style={{
                  height: '42px',
                  padding: '0 1.4rem',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  borderRadius: '0.75rem',
                  cursor: isAcceptingTerms ? 'not-allowed' : 'pointer',
                  opacity: isAcceptingTerms ? 0.6 : 1,
                }}
              >
                Decline
              </button>
              <button
                type="button"
                disabled={isAcceptingTerms}
                onClick={handleAcceptTerms}
                className="button-20"
                role="button"
                style={{
                  height: '42px',
                  minWidth: '96px',
                  padding: '0 1.6rem',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  borderRadius: '0.75rem',
                  cursor: isAcceptingTerms ? 'not-allowed' : 'pointer',
                  opacity: isAcceptingTerms ? 0.9 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                }}
              >
                {isAcceptingTerms ? (
                  <svg
                    style={{
                      width: '18px',
                      height: '18px',
                      animation: 'spin 0.75s linear infinite',
                      flexShrink: 0,
                    }}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="rgba(255, 255, 255, 0.3)"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="16 45"
                    />
                  </svg>
                ) : (
                  'Accept'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
