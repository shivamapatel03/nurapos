'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { getEmployees, posLookupEmployee } from '@/lib/api-client';
import { getAuthSession } from '@/lib/auth';
import { EmployeeDto } from '@/types/employee';

export default function PosLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadRoster() {
      try {
        // Try to read local cache first for instant response
        const cached = localStorage.getItem('nurapos_registered_employees');
        if (cached) {
          try {
            setEmployees(JSON.parse(cached));
          } catch {
            // ignore
          }
        }
        const res = await getEmployees();
        if (isMounted && res.data) {
          const activeOnly = res.data.filter((e) => e.isActive);
          setEmployees(activeOnly);
          localStorage.setItem('nurapos_registered_employees', JSON.stringify(activeOnly));
        }
      } catch (err) {
        console.warn('Could not prefetch staff roster:', err);
      }
    }
    loadRoster();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const idVal = identifier.trim();
    if (!idVal) {
      setErrorMessage('Please enter your Employee ID or Email.');
      return;
    }
    setErrorMessage(null);
    if (isLoading) return;
    setIsLoading(true);

    try {
      // 1. Primary Check: Call public real API posLookupEmployee
      try {
        const lookupRes = await posLookupEmployee(idVal);
        if (lookupRes?.data) {
          const emp = lookupRes.data;
          localStorage.setItem('nurapos_selected_employee_id', String(emp.id));
          localStorage.setItem('nurapos_selected_employee_name', emp.name);
          localStorage.setItem('nurapos_selected_employee_role', emp.role);
          localStorage.setItem('nurapos_selected_employee_code', emp.employeeCode);
          localStorage.setItem('nurapos_selected_franchise_id', String(emp.franchiseId));
          router.push('/pos-login-2');
          return;
        }
      } catch {
        // Proceed to fallback verification
      }

      // 2. Secondary Check: Check cached registered employees in localStorage
      let roster = employees;
      if (roster.length === 0) {
        try {
          const cached = localStorage.getItem('nurapos_registered_employees');
          if (cached) {
            roster = JSON.parse(cached);
          }
        } catch {
          // ignore
        }
      }

      const matchedEmp = roster.find(
        (emp: any) =>
          (emp.employeeCode && emp.employeeCode.toLowerCase() === idVal.toLowerCase()) ||
          (emp.email && emp.email.toLowerCase() === idVal.toLowerCase()) ||
          String(emp.id) === idVal ||
          String(emp.numericId) === idVal
      );

      if (matchedEmp) {
        // MATCH FOUND: Store employee session context and proceed to Screen 2
        const resolvedEmpId = (matchedEmp as any).numericId || matchedEmp.id;
        localStorage.setItem('nurapos_selected_employee_id', String(resolvedEmpId));
        localStorage.setItem('nurapos_selected_employee_name', matchedEmp.name);
        localStorage.setItem('nurapos_selected_employee_role', matchedEmp.role);
        localStorage.setItem('nurapos_selected_employee_code', matchedEmp.employeeCode || String(matchedEmp.id));
        if (matchedEmp.franchiseId) {
          localStorage.setItem('nurapos_selected_franchise_id', String(matchedEmp.franchiseId));
        }
        router.push('/pos-login-2');
        return;
      }

      // 3. Tertiary Check: Owner email or 'owner' / 'admin'
      const currentSession = getAuthSession();
      const ownerEmail = currentSession?.email || localStorage.getItem('nurapos_user_email') || '';
      const isOwner =
        (ownerEmail && ownerEmail.toLowerCase() === idVal.toLowerCase()) ||
        idVal.toLowerCase() === 'owner' ||
        idVal.toLowerCase() === 'admin';

      if (isOwner) {
        const ownerName = localStorage.getItem('nuradesk_user_name') || ownerEmail.split('@')[0] || 'Store Owner';
        localStorage.setItem('nurapos_selected_employee_id', 'owner');
        localStorage.setItem('nurapos_selected_employee_name', ownerName);
        localStorage.setItem('nurapos_selected_employee_role', 'Franchise Owner');
        localStorage.removeItem('nurapos_selected_employee_code');
        router.push('/pos-login-2');
        return;
      }

      // 4. Neither employee nor owner found: Show validation error
      setErrorMessage(`Employee ID or Email "${idVal}" does not exist. Please check your credentials.`);
    } finally {
      setIsLoading(false);
    }
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
        width: '100%',
        boxSizing: 'border-box',
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
            fontSize: '0.92rem',
            fontWeight: 500,
            color: '#000000',
            textDecoration: 'none',
            transition: 'opacity 0.15s',
            marginLeft: 'auto',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          <HelpOutlineRoundedIcon sx={{ fontSize: 18 }} />
          <span>Need help</span>
        </Link>
      </header>

      {/* Centered POS Login Card */}
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
          {/* Brand Header: Logo + Nuradesk */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
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
                width={40}
                height={40}
                priority
                style={{ objectFit: 'contain' }}
              />
            </div>
            <span style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: '#000000',
            }}>
              Nuradesk
            </span>
          </Link>

          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(1.35rem, 2vw, 1.65rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#000000',
            marginBottom: '1.5rem',
            lineHeight: 1.25,
          }}>
            Sign in to your POS account
          </h1>

          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.15rem',
          }}>
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

            {/* Employee ID / Email Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#000000',
                marginBottom: '0.35rem',
              }}>
                Employee ID / Email :
              </label>
              <input
                type="text"
                required
                placeholder=""
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: '#F0F0F0',
                  border: '1px solid transparent',
                  borderRadius: '0.85rem',
                  padding: '0 1.25rem',
                  fontSize: '0.95rem',
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

            {/* Continue Button */}
            <div style={{ marginTop: '0.25rem' }}>
              <button
                type="submit"
                disabled={isLoading}
                className="button-20-3d"
                role="button"
                style={{
                  width: '100%',
                  height: '48px',
                  fontSize: '1rem',
                  fontWeight: 600,
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
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
