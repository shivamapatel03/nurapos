'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  role: string;
  phone: string;
}

const ROLES = [
  'Cashier',
  'Shift Lead',
  'Store Manager',
  'Barista',
  'Supervisor',
  'Admin',
];

export default function OnboardingScreen4() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', name: '', employeeId: '', role: 'Cashier', phone: '' },
  ]);

  const handleAddEmployee = () => {
    setEmployees((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: '',
        employeeId: '',
        role: 'Cashier',
        phone: '',
      },
    ]);
  };

  const handleRemoveEmployee = (id: string) => {
    if (employees.length > 1) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    }
  };

  const handleUpdateEmployee = (id: string, field: keyof Employee, value: string) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, [field]: value } : emp))
    );
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/onboarding-5');
  };

  const handleSkip = () => {
    router.push('/onboarding-5');
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

      {/* Main Centered Team Setup */}
      <main style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem 2rem',
        boxSizing: 'border-box',
      }}>
        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(20px, 2.2vw, 24px)',
          fontWeight: 800,
          color: '#000000',
          letterSpacing: '-0.03em',
          marginBottom: '2rem',
          textAlign: 'center',
        }}>
          Add your team
        </h1>

        <form onSubmit={handleContinue} style={{
          width: '100%',
          maxWidth: '780px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Team Members List Container */}
          <div style={{
            width: '100%',
            maxHeight: '260px',
            overflowY: 'auto',
            paddingRight: '4px',
          }}>
            {employees.map((emp, index) => (
              <div
                key={emp.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: employees.length > 1 ? 'repeat(4, 1fr) 40px' : 'repeat(4, 1fr)',
                  gap: '0.85rem',
                  marginBottom: '1rem',
                  width: '100%',
                  alignItems: 'end',
                }}
              >
                {/* Column 1: Enter name */}
                <div>
                  {index === 0 && (
                    <label style={{
                      display: 'block',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      color: '#000000',
                      marginBottom: '0.4rem',
                      letterSpacing: '-0.01em',
                    }}>
                      Enter name
                    </label>
                  )}
                  <input
                    type="text"
                    value={emp.name}
                    onChange={(e) => handleUpdateEmployee(emp.id, 'name', e.target.value)}
                    placeholder=""
                    style={{
                      width: '100%',
                      height: '46px',
                      backgroundColor: '#F0F0F0',
                      border: '1px solid transparent',
                      borderRadius: '0.65rem',
                      padding: '0 1rem',
                      fontSize: '14.5px',
                      fontFamily: 'inherit',
                      fontWeight: 500,
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

                {/* Column 2: Employee ID */}
                <div>
                  {index === 0 && (
                    <label style={{
                      display: 'block',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      color: '#000000',
                      marginBottom: '0.4rem',
                      letterSpacing: '-0.01em',
                    }}>
                      Employee ID
                    </label>
                  )}
                  <input
                    type="text"
                    value={emp.employeeId}
                    onChange={(e) => handleUpdateEmployee(emp.id, 'employeeId', e.target.value)}
                    placeholder=""
                    style={{
                      width: '100%',
                      height: '46px',
                      backgroundColor: '#F0F0F0',
                      border: '1px solid transparent',
                      borderRadius: '0.65rem',
                      padding: '0 1rem',
                      fontSize: '14.5px',
                      fontFamily: 'inherit',
                      fontWeight: 500,
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

                {/* Column 3: Role dropdown */}
                <div>
                  {index === 0 && (
                    <label style={{
                      display: 'block',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      color: '#000000',
                      marginBottom: '0.4rem',
                      letterSpacing: '-0.01em',
                    }}>
                      Role
                    </label>
                  )}
                  <div style={{ position: 'relative' }}>
                    <select
                      value={emp.role}
                      onChange={(e) => handleUpdateEmployee(emp.id, 'role', e.target.value)}
                      style={{
                        width: '100%',
                        height: '46px',
                        backgroundColor: '#F0F0F0',
                        border: '1px solid transparent',
                        borderRadius: '0.65rem',
                        padding: '0 2.25rem 0 1rem',
                        fontSize: '14.5px',
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
                      {ROLES.map((role, i) => (
                        <option key={i} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    <span style={{
                      position: 'absolute',
                      right: '10px',
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

                {/* Column 4: Phone */}
                <div>
                  {index === 0 && (
                    <label style={{
                      display: 'block',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      color: '#000000',
                      marginBottom: '0.4rem',
                      letterSpacing: '-0.01em',
                    }}>
                      Phone
                    </label>
                  )}
                  <input
                    type="tel"
                    value={emp.phone}
                    onChange={(e) => handleUpdateEmployee(emp.id, 'phone', e.target.value)}
                    placeholder=""
                    style={{
                      width: '100%',
                      height: '46px',
                      backgroundColor: '#F0F0F0',
                      border: '1px solid transparent',
                      borderRadius: '0.65rem',
                      padding: '0 1rem',
                      fontSize: '14.5px',
                      fontFamily: 'inherit',
                      fontWeight: 500,
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

                {/* Column 5: Remove row button (when multiple rows exist) */}
                {employees.length > 1 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '46px',
                  }}>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmployee(emp.id)}
                      title="Remove this employee"
                      aria-label="Remove employee"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '0.55rem',
                        backgroundColor: '#F5F5F5',
                        border: '1px solid #E5E5E5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#555555',
                        transition: 'background-color 0.15s, color 0.15s, border-color 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#000000';
                        e.currentTarget.style.color = '#FFFFFF';
                        e.currentTarget.style.borderColor = '#000000';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#F5F5F5';
                        e.currentTarget.style.color = '#555555';
                        e.currentTarget.style.borderColor = '#E5E5E5';
                      }}
                    >
                      <CloseRoundedIcon sx={{ fontSize: 18 }} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* + Add Employee Link Button aligned to right */}
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '0.35rem',
            marginBottom: '2.5rem',
          }}>
            <button
              type="button"
              onClick={handleAddEmployee}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: 700,
                color: '#000000',
                cursor: 'pointer',
                letterSpacing: '-0.01em',
                padding: '4px 0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              + Add Employee
            </button>
          </div>

          {/* Action Buttons (I'll do this later on top, Continue on bottom) */}
          <div style={{
            width: '100%',
            maxWidth: '360px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          }}>
            {/* Top Button: I'll do this later */}
            <button
              type="button"
              onClick={handleSkip}
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #000000',
                borderRadius: '0.85rem',
                fontSize: '15.5px',
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
              I&apos;ll do this later
            </button>

            {/* Bottom Button: Continue */}
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
          </div>
        </form>
      </main>
    </div>
  );
}
