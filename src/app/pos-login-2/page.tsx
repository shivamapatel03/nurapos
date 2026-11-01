'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import DialpadRoundedIcon from '@mui/icons-material/DialpadRounded';
import BackspaceRoundedIcon from '@mui/icons-material/BackspaceRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import {
  posPinLogin,
  getEmployees,
  verifyPosPin,
  registerTerminal,
  getFranchises,
  openShift,
  createEmployee,
} from '@/lib/api-client';
import { savePosSession, getAuthSession } from '@/lib/auth';
import { EmployeeDto } from '@/types/employee';
import { FranchiseResponse } from '@/types/franchise';
import PosPinModal from '@/components/auth/PosPinModal';

export default function PosLoginScreen2() {
  const router = useRouter();
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [franchises, setFranchises] = useState<FranchiseResponse[]>([]);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<number | null>(null);

  // Authenticated employee / user context
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('owner');
  const [selectedName, setSelectedName] = useState('Store Owner');
  const [selectedRole, setSelectedRole] = useState('Owner');

  // Form inputs
  const [openingCash, setOpeningCash] = useState('500');
  const [pin, setPin] = useState('');
  const [showKeypad, setShowKeypad] = useState(false);

  // State flags
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinModalMode, setPinModalMode] = useState<'setup' | 'verify'>('setup');

  // Load employee context from Screen 1 and fetch store branches
  useEffect(() => {
    let isMounted = true;

    // 1. Read context passed from Screen 1 (/pos-login)
    const storedEmpId = localStorage.getItem('nurapos_selected_employee_id');
    const storedEmpName = localStorage.getItem('nurapos_selected_employee_name');
    const storedEmpRole = localStorage.getItem('nurapos_selected_employee_role');
    const storedFranchiseId = localStorage.getItem('nurapos_selected_franchise_id');

    if (storedEmpId) {
      setSelectedEmployeeId(storedEmpId);
    }
    if (storedEmpName) {
      setSelectedName(storedEmpName);
    } else {
      const storedOwner = localStorage.getItem('nuradesk_user_name');
      const session = getAuthSession();
      setSelectedName(storedOwner || (session?.email ? session.email.split('@')[0] : 'Store Owner'));
    }
    if (storedEmpRole) {
      setSelectedRole(storedEmpRole);
    }

    if (storedFranchiseId) {
      setSelectedFranchiseId(Number(storedFranchiseId));
    }

    // 2. Fetch real store branches / franchises from API
    async function initData() {
      try {
        const [franchiseRes, empRes] = await Promise.allSettled([
          getFranchises(),
          getEmployees(),
        ]);

        if (!isMounted) return;

        if (franchiseRes.status === 'fulfilled' && franchiseRes.value.data && franchiseRes.value.data.length > 0) {
          const list = franchiseRes.value.data;
          setFranchises(list);
          if (!storedFranchiseId) {
            setSelectedFranchiseId(list[0].franchiseId);
          }
        }

        if (empRes.status === 'fulfilled' && empRes.value.data) {
          const activeOnly = empRes.value.data.filter((e) => e.isActive);
          setEmployees(activeOnly);

          // If no employee context was found in localStorage, try to infer from session
          if (!storedEmpId) {
            const session = getAuthSession();
            const userEmail = session?.email || localStorage.getItem('nurapos_user_email') || '';
            const matchingEmp = activeOnly.find(
              (e) => e.email && userEmail && e.email.toLowerCase() === userEmail.toLowerCase()
            );
            if (matchingEmp) {
              setSelectedEmployeeId(String(matchingEmp.id));
              setSelectedName(matchingEmp.name);
              setSelectedRole(matchingEmp.role);
              if (!storedFranchiseId) setSelectedFranchiseId(matchingEmp.franchiseId);
            }
          }
        }
      } catch (err) {
        console.warn('Could not initialize branches or employees:', err);
      }
    }

    initData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleKeypadPress = (digit: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + digit);
      setErrorMessage(null);
    }
  };

  const handleKeypadBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  };

  const handleKeypadClear = () => {
    setPin('');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate 4-digit PIN
    if (!pin) {
      setErrorMessage('Please enter your 4-digit POS PIN.');
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      setErrorMessage('POS PIN must contain exactly four numeric digits.');
      return;
    }

    // Validate opening cash
    const floatNum = parseFloat(openingCash);
    if (isNaN(floatNum) || floatNum < 0) {
      setErrorMessage('Please enter a valid opening cash amount (0 or higher).');
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const targetFranchiseId = selectedFranchiseId || (franchises[0]?.franchiseId ?? 1);
      const terminalId = `TRM-F${targetFranchiseId}`;

      // 1. Ensure terminal exists for this specific branch
      try {
        await registerTerminal({
          franchiseId: targetFranchiseId,
          terminalCode: terminalId,
          deviceName: `Primary POS Terminal (Branch ${targetFranchiseId})`,
        });
      } catch {
        // Ignore if already registered
      }

      let effectiveCashierId = selectedEmployeeId !== 'owner' ? Number(selectedEmployeeId) : 1;

      // 2. Authenticate 4-Digit PIN with real backend API
      if (selectedEmployeeId !== 'owner') {
        const pinRes = await posPinLogin({
          terminalId,
          employeeId: effectiveCashierId,
          pin,
        });

        if (pinRes.data) {
          savePosSession({
            posSessionToken: pinRes.data.posSessionToken,
            employee: pinRes.data.employee,
            shiftRequired: false,
            terminalId,
            franchiseId: targetFranchiseId,
          });
        }
      } else {
        // Owner verification
        await verifyPosPin(pin);
      }

      // 3. Satisfy DB foreign key: ensure an active cashier exists for this franchise
      try {
        const empRes = await getEmployees(targetFranchiseId);
        const activeEmps = (empRes.data || []).filter((emp) => emp.isActive);
        if (selectedEmployeeId !== 'owner') {
          const matched = activeEmps.find((emp) => emp.id === effectiveCashierId);
          if (!matched && activeEmps.length > 0) {
            effectiveCashierId = activeEmps[0].id;
          }
        } else {
          if (activeEmps.length > 0) {
            effectiveCashierId = activeEmps[0].id;
          } else {
            const created = await createEmployee({
              franchiseId: targetFranchiseId,
              employeeCode: `EMP-F${targetFranchiseId}-01`,
              name: selectedName || 'Store Cashier',
              role: 'Cashier',
              initialPin: pin,
            });
            if (created.data) {
              effectiveCashierId = created.data.id;
            }
          }
        }
      } catch (empCheckErr) {
        console.warn('Could not verify cashier for franchise shift:', empCheckErr);
      }

      // 4. Open shift using real API with opening cash float
      try {
        await openShift({
          terminalId,
          franchiseId: targetFranchiseId,
          openingFloat: floatNum,
          cashierId: effectiveCashierId,
        });
      } catch (shiftErr: any) {
        // 409 or already open shifts are permitted, continue to register
        if (shiftErr.statusCode !== 409 && !shiftErr.message?.includes('already exists')) {
          console.warn('Shift open notice:', shiftErr);
        }
      }

      localStorage.setItem('nurapos_terminal_id', terminalId);
      localStorage.setItem('nurapos_franchise_id', String(targetFranchiseId));

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/pos');
      }, 600);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Invalid POS PIN. Please try again or reconfigure your PIN.'
      );
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      maxHeight: '100vh',
      width: '100vw',
      overflowY: 'auto',
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

      {/* Centered POS Login Screen 2 Card */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem 1.5rem',
        boxSizing: 'border-box',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E5E5',
          borderRadius: '1.25rem',
          padding: 'clamp(1.5rem, 3vh, 2.25rem)',
          boxSizing: 'border-box',
          margin: 'auto 0',
        }}>
          {/* Card Header: Brand Logo + Nuradesk on left, 'store logo' pill on right */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
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
              <CheckCircleRoundedIcon sx={{ fontSize: 48, color: '#10B981', marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#000000' }}>
                Shift Started!
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '1.25rem' }}>
                Signed in as <strong>{selectedName}</strong>. Terminal register initialized. Launching POS...
              </p>
              <Link href="/pos" className="button-20 button-20-3d" role="button" style={{ width: '100%' }}>
                Open POS Register
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              {/* 1. Logged In Employee Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#000000',
                  marginBottom: '0.35rem',
                }}>
                  Employee Name :
                </label>
                <div style={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.85rem',
                  padding: '0 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                }}>
                  <span style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#000000',
                    letterSpacing: '-0.01em',
                  }}>
                    {selectedName}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                  }}>
                    {selectedRole}
                  </span>
                </div>
              </div>

              {/* 2. Select Store Branch */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#000000',
                  marginBottom: '0.35rem',
                }}>
                  Store Branch :
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedFranchiseId !== null ? String(selectedFranchiseId) : ''}
                    onChange={(e) => setSelectedFranchiseId(Number(e.target.value))}
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
                    {franchises.length === 0 ? (
                      <option value="1">Primary Store Branch (Main)</option>
                    ) : (
                      franchises.map((f) => (
                        <option key={f.franchiseId} value={String(f.franchiseId)}>
                          {f.franchiseName} ({f.city || 'Branch'})
                        </option>
                      ))
                    )}
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

              {/* 3. Opening Cash Input */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#000000',
                  marginBottom: '0.35rem',
                }}>
                  Opening cash ($) :
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={openingCash}
                  onChange={(e) => setOpeningCash(e.target.value)}
                  placeholder="500"
                  style={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: '#F0F0F0',
                    border: '1px solid transparent',
                    borderRadius: '0.85rem',
                    padding: '0 1.25rem',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    fontWeight: 600,
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

              {/* Error Message */}
              {errorMessage && (
                <div style={{
                  padding: '0.6rem 0.8rem',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '0.75rem',
                  color: '#B91C1C',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  textAlign: 'left',
                }}>
                  <ErrorOutlineRoundedIcon sx={{ fontSize: 18, flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 4. Enter your 4-Digit POS PIN */}
              <div>
                <label style={{
                  display: 'block',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#000000',
                  marginBottom: '0.35rem',
                }}>
                  Enter your 4-Digit POS PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  required
                  value={pin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setPin(val);
                    setErrorMessage(null);
                  }}
                  placeholder="••••"
                  style={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: '#F0F0F0',
                    border: '1px solid transparent',
                    borderRadius: '0.85rem',
                    padding: '0 1.25rem',
                    fontSize: '22px',
                    textAlign: 'center',
                    fontFamily: 'inherit',
                    letterSpacing: '0.35em',
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

              {/* Signin & Open POS Button with buffer loading */}
              <div style={{ marginTop: '4px' }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="button-20-3d"
                  role="button"
                  style={{
                    width: '100%',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    borderRadius: '1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.55rem',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.85 : 1,
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
                          strokeLinecap="round"
                          strokeDasharray="31.4 31.4"
                        />
                        <path
                          d="M12 2a10 10 0 0 1 10 10"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span>Authenticating & Opening Shift...</span>
                    </>
                  ) : (
                    <span>Signin</span>
                  )}
                </button>
              </div>

              {/* Switch user & Setup PIN links */}
              <div style={{
                textAlign: 'center',
                marginTop: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                alignItems: 'center',
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
                  Switch user
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setPinModalMode('setup');
                    setShowPinModal(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#4B5563',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Configure or Reset Owner POS PIN
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* POS PIN Modal for Owner Setup / Verification */}
      <PosPinModal
        isOpen={showPinModal}
        mode={pinModalMode}
        onClose={() => setShowPinModal(false)}
        onSuccess={() => {
          setIsSuccess(true);
          setTimeout(() => {
            router.push('/pos');
          }, 800);
        }}
      />
    </div>
  );
}
