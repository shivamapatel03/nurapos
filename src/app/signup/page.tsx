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
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isAcceptingTerms, setIsAcceptingTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Auto-dismiss form error toast after 6 seconds
  useEffect(() => {
    if (!formError) return;
    const timer = setTimeout(() => setFormError(null), 6000);
    return () => clearTimeout(timer);
  }, [formError]);

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

  const handleAcceptTerms = () => {
    if (isAcceptingTerms) return;
    setIsAcceptingTerms(true);
    setTimeout(() => {
      setIsAcceptingTerms(false);
      setAgreeTerms(true);
      setShowTermsModal(false);
      if (formError) setFormError(null);
    }, 400);
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
      const res = await signupUser(payload);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('nurapos_signup_email', payload.email);
        if (res.data?.verificationId) {
          sessionStorage.setItem('nurapos_verification_id', res.data.verificationId);
        }
        if (res.data?.expiresAtUtc) {
          sessionStorage.setItem('nurapos_verification_expires', res.data.expiresAtUtc);
        }
      }

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
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .notched-field-group {
          position: relative;
          width: 100%;
        }

        .notched-field-group .notched-label {
          position: absolute;
          left: 10px;
          top: -8px;
          background-color: #FFFFFF;
          padding: 0 5px;
          font-size: 12px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          color: #71717A;
          line-height: 1;
          z-index: 2;
          pointer-events: none;
        }

        .notched-field-group:focus-within .notched-label {
          color: #000000;
          font-weight: 600;
        }

        .notched-field-group input {
          width: 100%;
          height: 44px;
          background-color: #FFFFFF;
          border: 1.5px solid #D4D4D8;
          border-radius: 4px;
          padding: 0 12px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          color: #000000;
          outline: none;
          box-sizing: border-box;
          box-shadow: none;
        }

        .notched-field-group input::placeholder {
          color: #A1A1AA;
          font-size: 13.5px;
        }

        .notched-field-group input:focus {
          border-color: #000000;
        }

        /* Prevent browser autofill yellow/blue background */
        .notched-field-group input:-webkit-autofill,
        .notched-field-group input:-webkit-autofill:hover,
        .notched-field-group input:-webkit-autofill:focus,
        .notched-field-group input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #FFFFFF inset !important;
          box-shadow: 0 0 0 1000px #FFFFFF inset !important;
          -webkit-text-fill-color: #000000 !important;
          caret-color: #000000 !important;
          border-color: #D4D4D8 !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        .notched-field-group input:-webkit-autofill:focus {
          border-color: #000000 !important;
          border-width: 1.5px !important;
        }

        .notched-field-group.is-error input {
          border-color: #DC2626 !important;
        }

        .notched-field-group.is-error .notched-label {
          color: #DC2626 !important;
        }

        .notched-field-group.is-success input {
          border-color: #16A34A !important;
        }

        .notched-field-group.is-success .notched-label {
          color: #16A34A !important;
        }

        .auth-submit-btn {
          width: 100%;
          height: 44px;
          background-color: #000000;
          color: #FFFFFF;
          border: 1px solid #000000;
          border-radius: 4px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: background-color 0.15s ease, opacity 0.15s ease;
          outline: none;
        }

        .auth-submit-btn:hover:not(:disabled) {
          background-color: #1F1F23;
          border-color: #1F1F23;
        }

        .auth-submit-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }
      `}</style>

      {/* Top Header with "Need help" */}
      <header
        style={{
          height: '52px',
          padding: '0 2.5rem',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
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
            fontSize: '13px',
            fontWeight: 500,
            color: '#000000',
            textDecoration: 'none',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <HelpOutlineRoundedIcon sx={{ fontSize: 17 }} />
          <span>Need help</span>
        </Link>
      </header>

      {/* Main Split Layout: Fit to Desktop Viewport */}
      <main
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 2.5rem 1.5rem 2.5rem',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1150px',
            height: '100%',
            maxHeight: 'calc(100vh - 68px)',
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 1.15fr) minmax(320px, 1fr)',
            gap: 'clamp(1.5rem, 3.5vw, 3.5rem)',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Image with square corners & little radius */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '560px',
              maxHeight: 'calc(100vh - 84px)',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: '#F5F5F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={unsplashImageUrl}
              alt="Nuradesk POS in action"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                borderRadius: '12px',
              }}
            />
          </div>

          {/* Right Column: Signup Form */}
          <div
            style={{
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
            }}
          >
            {/* Title & Subtitle */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: 600,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.2,
                  color: '#000000',
                  margin: '0 0 0.35rem 0',
                }}
              >
                Create Account
              </h1>
              <p
                style={{
                  fontSize: '14px',
                  color: '#71717A',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  margin: 0,
                  lineHeight: 1.45,
                }}
              >
                Sign up to start your 30-day free trial.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.35rem',
              }}
            >
              {/* Full Name Field with Notched Outline Label */}
              <div className="notched-field-group">
                <label className="notched-label">Enter Full Name</label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (formError) setFormError(null);
                  }}
                />
              </div>

              {/* Email Field with Notched Outline Label */}
              <div className={`notched-field-group ${formError?.toLowerCase().includes('email') ? 'is-error' : ''}`}>
                <label className="notched-label">Email</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formError) setFormError(null);
                  }}
                />
              </div>

              {/* Password Field with Notched Outline Label */}
              <div>
                <div className="notched-field-group">
                  <label className="notched-label">Create Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Create your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    style={{ paddingRight: '38px' }}
                  />
                  {password.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#71717A',
                        padding: '4px',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#000000';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#71717A';
                      }}
                    >
                      {showPassword ? (
                        <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <VisibilityRoundedIcon sx={{ fontSize: 18 }} />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Confirm Password Field with Notched Outline Label */}
              <div
                className={`notched-field-group ${
                  confirmPassword.length > 0 && confirmPassword !== password
                    ? 'is-error'
                    : confirmPassword.length > 0 && confirmPassword === password
                    ? 'is-success'
                    : ''
                }`}
              >
                <label className="notched-label">Confirm Password</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  style={{ paddingRight: '38px' }}
                />
                {confirmPassword.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#71717A',
                      padding: '4px',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#000000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#71717A';
                    }}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <VisibilityRoundedIcon sx={{ fontSize: 18 }} />
                    )}
                  </button>
                )}
              </div>

              {/* Terms and Privacy Checkbox */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  marginTop: '0.1rem',
                }}
              >
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
                    width: '15px',
                    height: '15px',
                    accentColor: '#000000',
                    cursor: 'pointer',
                    borderRadius: '2px',
                  }}
                />
                <label
                  htmlFor="terms-checkbox"
                  style={{
                    fontSize: '12.5px',
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
                      fontWeight: 600,
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      color: '#000000',
                    }}
                  >
                    Terms &amp; Privacy Policy
                  </span>
                </label>
              </div>

              {/* Submit Button (Square with 4px border-radius, black background) */}
              <div style={{ marginTop: '0.35rem' }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="auth-submit-btn"
                >
                  {isLoading ? (
                    <>
                      <svg
                        style={{
                          width: '16px',
                          height: '16px',
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
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '0.2rem',
                  fontSize: '13px',
                  color: '#71717A',
                }}
              >
                Already Have an Account?{' '}
                <Link
                  href="/signin"
                  style={{
                    fontWeight: 600,
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
              borderRadius: '6px',
              width: '100%',
              maxWidth: '440px',
              padding: '2rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxSizing: 'border-box',
              border: '1px solid #E5E7EB',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
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
                top: '0.75rem',
                right: '0.75rem',
                background: '#F4F4F5',
                border: 'none',
                cursor: 'pointer',
                width: '30px',
                height: '30px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#333333',
                transition: 'background 0.15s',
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 17 }} />
            </button>

            {/* Email Icon with Checkmark */}
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '4px',
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                marginBottom: '1rem',
              }}
            >
              <EmailRoundedIcon sx={{ fontSize: 32, color: '#16A34A' }} />
            </div>

            {/* Modal Heading */}
            <h3
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '20px',
                fontWeight: 600,
                color: '#000000',
                letterSpacing: '-0.025em',
              }}
            >
              Verification Code Sent!
            </h3>

            {/* Modal Body */}
            <p
              style={{
                margin: '0 0 1.5rem 0',
                fontSize: '14px',
                color: '#4B5563',
                lineHeight: 1.55,
              }}
            >
              A verification code has been sent to{' '}
              <strong style={{ color: '#000000', fontWeight: 600, wordBreak: 'break-all' }}>
                {verificationPopup.email}
              </strong>
              . Please enter the code to complete your registration.
            </p>

            {/* Action button */}
            <button
              type="button"
              onClick={() => goToVerifyEmail(verificationPopup.email, verificationPopup.verificationId)}
              className="auth-submit-btn"
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
              borderRadius: '6px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxSizing: 'border-box',
              border: '1px solid #E5E7EB',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.15rem 1.4rem',
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
                    fontSize: '17px',
                    fontWeight: 600,
                    color: '#000000',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Terms &amp; Privacy Policy
                </h3>
                <p
                  style={{
                    margin: '0.15rem 0 0 0',
                    fontSize: '13px',
                    color: '#71717A',
                  }}
                >
                  Terms and privacy policy for Nuradesk
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
                  width: '30px',
                  height: '30px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#333333',
                  transition: 'background 0.15s',
                }}
              >
                <CloseRoundedIcon sx={{ fontSize: 17 }} />
              </button>
            </div>

            {/* Modal Body / Scrollable Content */}
            <div
              style={{
                padding: '1.25rem 1.4rem',
                overflowY: 'auto',
                fontSize: '13.5px',
                color: '#374151',
                lineHeight: 1.6,
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div>
                <h4 style={{ margin: '0 0 0.35rem 0', color: '#000000', fontSize: '14px', fontWeight: 600 }}>
                  1. Acceptance of Terms
                </h4>
                <p style={{ margin: 0, color: '#52525B' }}>
                  By checking the agreement box or using the Nuradesk platform, you acknowledge and accept these terms governing access, billing, and system operations for your business.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.35rem 0', color: '#000000', fontSize: '14px', fontWeight: 600 }}>
                  2. Store &amp; Customer Data Privacy
                </h4>
                <p style={{ margin: 0, color: '#52525B' }}>
                  Your business data belongs to you. Nuradesk secures your catalog items, sales history, and customer details with enterprise encryption and never resells your commercial information.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.35rem 0', color: '#000000', fontSize: '14px', fontWeight: 600 }}>
                  3. Offline Mode &amp; Local Storage
                </h4>
                <p style={{ margin: 0, color: '#52525B' }}>
                  When working offline, transactions and register records are cached on your browser and hardware device. You agree to sync your local cache to the cloud periodically to maintain accurate fiscal records.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.35rem 0', color: '#000000', fontSize: '14px', fontWeight: 600 }}>
                  4. Free Trial &amp; Subscription Terms
                </h4>
                <p style={{ margin: 0, color: '#52525B' }}>
                  All new signups receive full platform capabilities during their 30-day trial without needing credit card verification. You may cancel, modify, or export your store data at any point without fees.
                </p>
              </div>
            </div>

            {/* Modal Footer with Decline and Accept buttons (Square with 4px border-radius) */}
            <div
              style={{
                padding: '0.85rem 1.4rem',
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
                style={{
                  height: '38px',
                  padding: '0 1.25rem',
                  fontSize: '13px',
                  fontWeight: 500,
                  borderRadius: '4px',
                  border: '1px solid #D4D4D8',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  cursor: isAcceptingTerms ? 'not-allowed' : 'pointer',
                  opacity: isAcceptingTerms ? 0.6 : 1,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Decline
              </button>
              <button
                type="button"
                disabled={isAcceptingTerms}
                onClick={handleAcceptTerms}
                style={{
                  height: '38px',
                  minWidth: '96px',
                  padding: '0 1.4rem',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: '1px solid #000000',
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  cursor: isAcceptingTerms ? 'not-allowed' : 'pointer',
                  opacity: isAcceptingTerms ? 0.9 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {isAcceptingTerms ? 'Accepting...' : 'Accept'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Bottom-Right Error Toast (prevents form layout shift or screen cropping) */}
      {formError && (
        <div
          role="alert"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 99999,
            maxWidth: '380px',
            width: 'calc(100vw - 48px)',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderLeft: '4px solid #DC2626',
            borderRadius: '4px',
            padding: '12px 14px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontFamily: "'Inter', sans-serif",
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <ErrorOutlineRoundedIcon sx={{ fontSize: 18, color: '#DC2626', flexShrink: 0 }} />
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#000000',
                lineHeight: 1.4,
                letterSpacing: '-0.01em',
              }}
            >
              {formError}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setFormError(null)}
            aria-label="Close notification"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#71717A',
              flexShrink: 0,
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      )}
    </div>
  );
}
