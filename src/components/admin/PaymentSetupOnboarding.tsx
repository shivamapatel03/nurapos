'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Material Rounded Icons
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import StoreRoundedIcon from '@mui/icons-material/StoreRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';

// ============================================================================
// DATA TYPES
// ============================================================================
export type PaymentProvider = 'none' | 'razorpay' | 'cashfree';
export type ConnectionStatus = 'not_connected' | 'connecting' | 'connected' | 'error';

export interface PaymentSetupState {
  provider: PaymentProvider;
  status: ConnectionStatus;
  errorMessage?: string;
  methods: {
    cash: boolean;
    upi: boolean;
    card: boolean;
    dynamicQr: boolean;
  };
  settlementAccount: {
    bankName: string;
    maskedAccount: string;
    accountHolder: string;
    ifscPrefix: string;
  };
}

export interface TaxSetupState {
  isConfigured: boolean;
  gstin: string;
  legalBusinessName: string;
  defaultGstRate: string;
  invoicePrefix: string;
  startingInvoiceNumber: string;
  includeGstOnInvoices: boolean;
}

export interface PaymentSetupOnboardingProps {
  theme: {
    bgPage: string;
    bgCard: string;
    bgCardHover: string;
    border: string;
    borderCard: string;
    borderHover: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    hoverBg: string;
    activeBg: string;
    activeText: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    sidebarIsDark: boolean;
  };
  onComplete?: () => void;
  onBack?: () => void;
}

const STORAGE_KEY_PAYMENT = 'nuradesk_payment_setup_state';
const STORAGE_KEY_TAX = 'nuradesk_tax_setup_state';

const DEFAULT_PAYMENT_SETUP: PaymentSetupState = {
  provider: 'none',
  status: 'not_connected',
  methods: {
    cash: true,
    upi: false,
    card: false,
    dynamicQr: false,
  },
  settlementAccount: {
    bankName: 'HDFC Bank',
    maskedAccount: '•••• 4521',
    accountHolder: 'SP Hospitality & Retail LLP',
    ifscPrefix: 'HDFC0001824',
  },
};

const DEFAULT_TAX_SETUP: TaxSetupState = {
  isConfigured: false,
  gstin: '24AABCS1429B1Z5',
  legalBusinessName: 'SP Hospitality & Retail Private Limited',
  defaultGstRate: '5%',
  invoicePrefix: 'INV-',
  startingInvoiceNumber: '1001',
  includeGstOnInvoices: true,
};

export default function PaymentSetupOnboarding({
  theme,
  onComplete,
  onBack,
}: PaymentSetupOnboardingProps) {
  // Stepper: 1: 'payments', 2: 'tax', 3: 'completed'
  const [currentStep, setCurrentStep] = useState<'payments' | 'tax' | 'completed'>('payments');

  // Payment Setup State
  const [paymentSetup, setPaymentSetup] = useState<PaymentSetupState>(DEFAULT_PAYMENT_SETUP);

  // Tax Setup State
  const [taxSetup, setTaxSetup] = useState<TaxSetupState>(DEFAULT_TAX_SETUP);

  // Connection Flow Modals
  const [connectingModal, setConnectingModal] = useState<'none' | 'razorpay' | 'cashfree'>('none');
  const [showManageModal, setShowManageModal] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);

  // Toast notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Load persistent state from localStorage
  useEffect(() => {
    try {
      const savedPayment = localStorage.getItem(STORAGE_KEY_PAYMENT);
      if (savedPayment) {
        setPaymentSetup(JSON.parse(savedPayment));
      }
      const savedTax = localStorage.getItem(STORAGE_KEY_TAX);
      if (savedTax) {
        setTaxSetup(JSON.parse(savedTax));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save changes to localStorage
  const updatePaymentSetup = (updated: PaymentSetupState) => {
    setPaymentSetup(updated);
    try {
      localStorage.setItem(STORAGE_KEY_PAYMENT, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const updateTaxSetup = (updated: TaxSetupState) => {
    setTaxSetup(updated);
    try {
      localStorage.setItem(STORAGE_KEY_TAX, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Handle Cash Toggle
  const handleToggleCash = () => {
    const nextVal = !paymentSetup.methods.cash;
    updatePaymentSetup({
      ...paymentSetup,
      methods: {
        ...paymentSetup.methods,
        cash: nextVal,
      },
    });
    showToast(nextVal ? 'Cash checkout enabled.' : 'Cash checkout paused.');
  };

  // Start connection flow
  const handleOpenConnectModal = (provider: 'razorpay' | 'cashfree') => {
    setConnectingModal(provider);
    updatePaymentSetup({
      ...paymentSetup,
      status: 'not_connected',
      errorMessage: undefined,
    });
  };

  // Execute Simulated OAuth Connection Flow
  const handleExecuteConnect = (provider: 'razorpay' | 'cashfree') => {
    updatePaymentSetup({
      ...paymentSetup,
      provider,
      status: 'connecting',
      errorMessage: undefined,
    });

    // Simulate OAuth redirection handshake
    setTimeout(() => {
      if (simulateFailure) {
        updatePaymentSetup({
          ...paymentSetup,
          provider,
          status: 'error',
          errorMessage: `Authorization handshake with ${provider === 'razorpay' ? 'Razorpay' : 'Cashfree'} timed out. Please retry.`,
        });
        setSimulateFailure(false);
      } else {
        updatePaymentSetup({
          provider,
          status: 'connected',
          errorMessage: undefined,
          methods: {
            cash: paymentSetup.methods.cash,
            upi: true,
            card: true,
            dynamicQr: true,
          },
          settlementAccount: {
            bankName: 'HDFC Bank',
            maskedAccount: '•••• 4521',
            accountHolder: 'SP Hospitality & Retail LLP',
            ifscPrefix: 'HDFC0001824',
          },
        });
        setConnectingModal('none');
        showToast(`Successfully connected your ${provider === 'razorpay' ? 'Razorpay' : 'Cashfree'} business account!`);
      }
    }, 1800);
  };

  // Disconnect provider
  const handleConfirmDisconnect = () => {
    const disconnectedProvider = paymentSetup.provider === 'razorpay' ? 'Razorpay' : 'Cashfree';
    updatePaymentSetup({
      provider: 'none',
      status: 'not_connected',
      errorMessage: undefined,
      methods: {
        cash: paymentSetup.methods.cash,
        upi: false,
        card: false,
        dynamicQr: false,
      },
      settlementAccount: {
        bankName: 'HDFC Bank',
        maskedAccount: '•••• 4521',
        accountHolder: 'SP Hospitality & Retail LLP',
        ifscPrefix: 'HDFC0001824',
      },
    });
    setShowDisconnectConfirm(false);
    showToast(`Disconnected ${disconnectedProvider} account.`);
  };

  // Save Tax & Invoicing configuration
  const handleSaveTax = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taxSetup.gstin.trim()) {
      showToast('Please enter your 15-character GSTIN number.');
      return;
    }
    const updated = {
      ...taxSetup,
      isConfigured: true,
    };
    updateTaxSetup(updated);
    setCurrentStep('completed');
    showToast('Tax & invoicing parameters saved successfully.');
  };

  const isPaymentsReady = paymentSetup.status === 'connected' && paymentSetup.methods.cash;

  return (
    <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', color: theme.textPrimary, paddingBottom: '3rem' }}>
      {/* Toast Notice */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.85rem 1.25rem',
            backgroundColor: '#111827',
            color: '#FFFFFF',
            borderRadius: '0.75rem',
            boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
            fontSize: '13.5px',
            fontWeight: 700,
            border: '1px solid #374151',
          }}
        >
          <CheckCircleRoundedIcon sx={{ fontSize: 18, color: '#10B981' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb & Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <span>Store Setup</span>
          <span>/</span>
          <span style={{ color: theme.textPrimary }}>Payments & Tax Onboarding</span>
        </div>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'none',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.bgCard,
              color: theme.textPrimary,
              borderRadius: '0.55rem',
              padding: '0.35rem 0.75rem',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <ArrowBackRoundedIcon sx={{ fontSize: 14 }} />
            <span>Back to Dashboard</span>
          </button>
        )}
      </div>

      {/* Main Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 0.35rem 0', letterSpacing: '-0.03em' }}>
          Set up payments & tax
        </h1>
        <p style={{ fontSize: '14px', color: theme.textSecondary, margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
          Connect your payment account and start accepting UPI and card payments from your POS.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
          border: `1px solid ${theme.border}`,
          borderRadius: '0.85rem',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.75rem',
          boxSizing: 'border-box',
        }}
      >
        {/* Step 1 */}
        <div
          onClick={() => setCurrentStep('payments')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            opacity: currentStep === 'payments' ? 1 : 0.75,
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: paymentSetup.status === 'connected' ? '#10B981' : currentStep === 'payments' ? theme.activeBg : theme.hoverBg,
              color: paymentSetup.status === 'connected' || currentStep === 'payments' ? '#FFFFFF' : theme.textSecondary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11.5px',
              fontWeight: 800,
            }}
          >
            {paymentSetup.status === 'connected' ? <CheckRoundedIcon sx={{ fontSize: 15 }} /> : '1'}
          </div>
          <span style={{ fontSize: '13px', fontWeight: currentStep === 'payments' ? 800 : 600, color: currentStep === 'payments' ? theme.textPrimary : theme.textSecondary }}>
            Connect Payments
          </span>
        </div>

        <div style={{ flex: 1, height: '1px', backgroundColor: theme.border }} />

        {/* Step 2 */}
        <div
          onClick={() => setCurrentStep('tax')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            opacity: currentStep === 'tax' ? 1 : 0.75,
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: taxSetup.isConfigured ? '#10B981' : currentStep === 'tax' ? theme.activeBg : theme.hoverBg,
              color: taxSetup.isConfigured || currentStep === 'tax' ? '#FFFFFF' : theme.textSecondary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11.5px',
              fontWeight: 800,
            }}
          >
            {taxSetup.isConfigured ? <CheckRoundedIcon sx={{ fontSize: 15 }} /> : '2'}
          </div>
          <span style={{ fontSize: '13px', fontWeight: currentStep === 'tax' ? 800 : 600, color: currentStep === 'tax' ? theme.textPrimary : theme.textSecondary }}>
            Tax & Invoicing
          </span>
        </div>

        <div style={{ flex: 1, height: '1px', backgroundColor: theme.border }} />

        {/* Step 3 */}
        <div
          onClick={() => {
            if (isPaymentsReady && taxSetup.isConfigured) setCurrentStep('completed');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: isPaymentsReady && taxSetup.isConfigured ? 'pointer' : 'default',
            opacity: currentStep === 'completed' ? 1 : 0.65,
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: currentStep === 'completed' ? '#10B981' : theme.hoverBg,
              color: currentStep === 'completed' ? '#FFFFFF' : theme.textSecondary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11.5px',
              fontWeight: 800,
            }}
          >
            {currentStep === 'completed' ? <CheckRoundedIcon sx={{ fontSize: 15 }} /> : '3'}
          </div>
          <span style={{ fontSize: '13px', fontWeight: currentStep === 'completed' ? 800 : 600, color: currentStep === 'completed' ? theme.textPrimary : theme.textSecondary }}>
            Ready to Sell
          </span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* VIEW 1: PAYMENTS ONBOARDING STEP                                     */}
      {/* ==================================================================== */}
      {currentStep === 'payments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Card: PAYMENTS Setup Container */}
          <div
            style={{
              backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.5rem',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.06em', color: theme.textSecondary, textTransform: 'uppercase' }}>
                  PAYMENTS
                </span>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: '0.2rem 0 0 0' }}>
                  Select Payment Providers
                </h2>
              </div>

              {paymentSetup.status === 'connected' && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: theme.sidebarIsDark ? '#064E3B' : '#ECFDF5',
                    color: '#059669',
                    border: '1px solid #10B981',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 800,
                  }}
                >
                  <CheckCircleRoundedIcon sx={{ fontSize: 15 }} />
                  <span>Account Connected</span>
                </div>
              )}
            </div>

            {/* Provider Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* 1. Cash Option */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.15rem 1.25rem',
                  borderRadius: '0.85rem',
                  backgroundColor: theme.bgPage,
                  border: `1px solid ${theme.border}`,
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '0.65rem',
                      backgroundColor: theme.sidebarIsDark ? theme.hoverBg : '#F3F4F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#10B981',
                      flexShrink: 0,
                    }}
                  >
                    <PaymentsRoundedIcon sx={{ fontSize: 22 }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: theme.textPrimary }}>
                        Cash
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: theme.sidebarIsDark ? '#14532D' : '#DCFCE7',
                          color: '#15803D',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                        }}
                      >
                        Always available
                      </span>
                    </div>
                    <p style={{ fontSize: '12.5px', color: theme.textSecondary, margin: '0.2rem 0 0 0' }}>
                      Accept physical paper currency and coins at your billing terminal. No setup required.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={paymentSetup.methods.cash}
                    onClick={handleToggleCash}
                    style={{
                      width: '44px',
                      height: '24px',
                      borderRadius: '9999px',
                      backgroundColor: paymentSetup.methods.cash ? theme.activeBg : '#9CA3AF',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      padding: 0,
                      transition: 'background-color 0.2s ease',
                      outline: 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        position: 'absolute',
                        top: '3px',
                        left: paymentSetup.methods.cash ? '23px' : '3px',
                        transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  </button>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: paymentSetup.methods.cash ? '#10B981' : theme.textSecondary, minWidth: '60px' }}>
                    {paymentSetup.methods.cash ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              {/* 2. Cashfree Option */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.15rem 1.25rem',
                  borderRadius: '0.85rem',
                  backgroundColor: theme.bgPage,
                  border: paymentSetup.provider === 'cashfree' && paymentSetup.status === 'connected' ? '1.5px solid #10B981' : `1px solid ${theme.border}`,
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '0.65rem',
                      backgroundColor: '#5A32A3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 900,
                      fontSize: '15px',
                      letterSpacing: '-0.02em',
                      flexShrink: 0,
                    }}
                  >
                    CF
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: theme.textPrimary }}>
                        Cashfree
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: theme.textSecondary }}>
                        UPI · Cards · QR
                      </span>
                    </div>
                    <p style={{ fontSize: '12.5px', color: theme.textSecondary, margin: '0.2rem 0 0 0' }}>
                      Connect your Cashfree business account to accept instant UPI & card payments.
                    </p>
                  </div>
                </div>

                <div>
                  {paymentSetup.provider === 'cashfree' && paymentSetup.status === 'connected' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '12.5px',
                          fontWeight: 800,
                          color: '#059669',
                          backgroundColor: theme.sidebarIsDark ? '#064E3B' : '#ECFDF5',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                        }}
                      >
                        <CheckRoundedIcon sx={{ fontSize: 16 }} />
                        <span>Connected</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowManageModal(true)}
                        style={{
                          height: '34px',
                          padding: '0 0.85rem',
                          borderRadius: '0.55rem',
                          border: `1px solid ${theme.border}`,
                          backgroundColor: theme.bgCard,
                          color: theme.textPrimary,
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Manage
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="button-20"
                      role="button"
                      onClick={() => handleOpenConnectModal('cashfree')}
                      disabled={paymentSetup.status === 'connected' && paymentSetup.provider !== 'cashfree'}
                      style={{
                        height: '36px',
                        padding: '0 1.25rem',
                        fontSize: '13px',
                        fontWeight: 700,
                        opacity: paymentSetup.status === 'connected' && paymentSetup.provider !== 'cashfree' ? 0.4 : 1,
                      }}
                    >
                      <span>Connect</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 3. Razorpay Option */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.15rem 1.25rem',
                  borderRadius: '0.85rem',
                  backgroundColor: theme.bgPage,
                  border: paymentSetup.provider === 'razorpay' && paymentSetup.status === 'connected' ? '1.5px solid #10B981' : `1px solid ${theme.border}`,
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '0.65rem',
                      backgroundColor: '#0C2340',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#3395FF',
                      fontWeight: 900,
                      fontSize: '18px',
                      flexShrink: 0,
                    }}
                  >
                    R
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: theme.textPrimary }}>
                        Razorpay
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: theme.textSecondary }}>
                        UPI · Cards · QR
                      </span>
                    </div>
                    <p style={{ fontSize: '12.5px', color: theme.textSecondary, margin: '0.2rem 0 0 0' }}>
                      Securely link your Razorpay merchant account for dynamic POS QR codes and cards.
                    </p>
                  </div>
                </div>

                <div>
                  {paymentSetup.provider === 'razorpay' && paymentSetup.status === 'connected' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '12.5px',
                          fontWeight: 800,
                          color: '#059669',
                          backgroundColor: theme.sidebarIsDark ? '#064E3B' : '#ECFDF5',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                        }}
                      >
                        <CheckRoundedIcon sx={{ fontSize: 16 }} />
                        <span>Connected</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowManageModal(true)}
                        style={{
                          height: '34px',
                          padding: '0 0.85rem',
                          borderRadius: '0.55rem',
                          border: `1px solid ${theme.border}`,
                          backgroundColor: theme.bgCard,
                          color: theme.textPrimary,
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Manage
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="button-20"
                      role="button"
                      onClick={() => handleOpenConnectModal('razorpay')}
                      disabled={paymentSetup.status === 'connected' && paymentSetup.provider !== 'razorpay'}
                      style={{
                        height: '36px',
                        padding: '0 1.25rem',
                        fontSize: '13px',
                        fontWeight: 700,
                        opacity: paymentSetup.status === 'connected' && paymentSetup.provider !== 'razorpay' ? 0.4 : 1,
                      }}
                    >
                      <span>Connect</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Connected Account Card details if a provider is linked */}
            {paymentSetup.status === 'connected' && (
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '1.2rem',
                  borderRadius: '0.75rem',
                  backgroundColor: theme.sidebarIsDark ? theme.hoverBg : '#F9FAFB',
                  border: `1px solid ${theme.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                    <AccountBalanceRoundedIcon sx={{ fontSize: 17, color: theme.textPrimary }} />
                    <span style={{ fontSize: '13px', fontWeight: 800, color: theme.textPrimary }}>
                      Settlement Bank Account
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: theme.textSecondary }}>
                    {paymentSetup.settlementAccount.bankName} • {paymentSetup.settlementAccount.maskedAccount} ({paymentSetup.settlementAccount.accountHolder})
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowManageModal(true)}
                    style={{
                      height: '32px',
                      padding: '0 0.85rem',
                      borderRadius: '0.5rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgCard,
                      color: theme.textPrimary,
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Manage
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDisconnectConfirm(true)}
                    style={{
                      height: '32px',
                      padding: '0 0.85rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #FCA5A5',
                      backgroundColor: 'transparent',
                      color: '#EF4444',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Connected Readiness Banner */}
          {isPaymentsReady && (
            <div
              style={{
                backgroundColor: theme.sidebarIsDark ? '#064E3B' : '#ECFDF5',
                border: '1.5px solid #10B981',
                borderRadius: '1rem',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 20, color: '#059669' }} />
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#065F46' }}>
                    Payments ready
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '12.5px', color: '#047857', fontWeight: 600 }}>
                  <span>✓ Cash enabled</span>
                  <span>✓ UPI enabled</span>
                  <span>✓ Cards enabled</span>
                  <span>✓ Dynamic QR enabled</span>
                  <span>• Provider: {paymentSetup.provider === 'razorpay' ? 'Razorpay' : 'Cashfree'}</span>
                </div>
              </div>

              <button
                type="button"
                className="button-20"
                role="button"
                onClick={() => setCurrentStep('tax')}
                style={{
                  height: '40px',
                  padding: '0 1.4rem',
                  fontSize: '13px',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>Continue to Tax & Invoicing</span>
                <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
              </button>
            </div>
          )}

          {/* Section 2: Tax & Invoicing Preview Section */}
          <div
            style={{
              backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.5rem',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.06em', color: theme.textSecondary, textTransform: 'uppercase' }}>
                  TAX & INVOICING
                </span>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: '0.2rem 0 0 0' }}>
                  Configure GST & Receipt Numbering
                </h2>
              </div>

              {taxSetup.isConfigured && (
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#059669',
                    backgroundColor: theme.sidebarIsDark ? '#064E3B' : '#ECFDF5',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                  }}
                >
                  Configured ✓
                </span>
              )}
            </div>

            <p style={{ fontSize: '13px', color: theme.textSecondary, margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
              Enter your legal business GSTIN number, default tax slabs, and thermal bill serial sequence.
            </p>

            <button
              type="button"
              className="button-20-secondary"
              role="button"
              onClick={() => setCurrentStep('tax')}
              style={{
                height: '38px',
                padding: '0 1.25rem',
                fontSize: '13px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <TuneRoundedIcon sx={{ fontSize: 16 }} />
              <span>Configure tax & invoicing</span>
            </button>
          </div>

          {/* Bottom Cancel / Later Action */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onBack}
              style={{
                background: 'none',
                border: 'none',
                color: theme.textSecondary,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '0.5rem 1rem',
                textDecoration: 'underline',
              }}
            >
              I&apos;ll do this later
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* VIEW 2: TAX & INVOICING SETUP FORM STEP                              */}
      {/* ==================================================================== */}
      {currentStep === 'tax' && (
        <form onSubmit={handleSaveTax} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.5rem',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <ReceiptLongRoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                Tax & Invoicing Configuration
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {/* GSTIN */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.4rem' }}>
                  GSTIN (15-Digit Goods & Services Tax Number) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  value={taxSetup.gstin}
                  onChange={(e) => setTaxSetup({ ...taxSetup, gstin: e.target.value.toUpperCase() })}
                  placeholder="24ABCDE1234F1Z5"
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem',
                    borderRadius: '0.6rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'monospace',
                  }}
                />
              </div>

              {/* Business Legal Name */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.4rem' }}>
                  Business Legal Registered Name *
                </label>
                <input
                  type="text"
                  required
                  value={taxSetup.legalBusinessName}
                  onChange={(e) => setTaxSetup({ ...taxSetup, legalBusinessName: e.target.value })}
                  placeholder="e.g. SP Hospitality & Retail Private Limited"
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem',
                    borderRadius: '0.6rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Default GST Rate */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.4rem' }}>
                  Default Store GST Rate Slab
                </label>
                <select
                  value={taxSetup.defaultGstRate}
                  onChange={(e) => setTaxSetup({ ...taxSetup, defaultGstRate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem',
                    borderRadius: '0.6rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                  }}
                >
                  <option value="5%">5% (Food & Beverage / Essential Goods)</option>
                  <option value="12%">12% (Packaged Foods & Standard Services)</option>
                  <option value="18%">18% (Standard Retail / Electronics / Dine-in)</option>
                  <option value="28%">28% (Luxury Items & Specialty Tobacco)</option>
                  <option value="0%">0% (Exempt & Non-taxable Goods)</option>
                </select>
              </div>

              {/* Invoice Prefix */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.4rem' }}>
                  Invoice Series Prefix
                </label>
                <input
                  type="text"
                  value={taxSetup.invoicePrefix}
                  onChange={(e) => setTaxSetup({ ...taxSetup, invoicePrefix: e.target.value })}
                  placeholder="INV- or SP-"
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem',
                    borderRadius: '0.6rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 700,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Starting Invoice Number */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.4rem' }}>
                  Starting Invoice Serial Number
                </label>
                <input
                  type="number"
                  value={taxSetup.startingInvoiceNumber}
                  onChange={(e) => setTaxSetup({ ...taxSetup, startingInvoiceNumber: e.target.value })}
                  placeholder="1001"
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem',
                    borderRadius: '0.6rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 700,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Checkbox: Include GST on Invoices */}
            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: `1px solid ${theme.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
              }}
              onClick={() => setTaxSetup({ ...taxSetup, includeGstOnInvoices: !taxSetup.includeGstOnInvoices })}
            >
              <input
                type="checkbox"
                checked={taxSetup.includeGstOnInvoices}
                onChange={() => {}}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: theme.activeBg }}
              />
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: theme.textPrimary }}>
                  Include GST breakdown on thermal receipts & customer invoices
                </div>
                <div style={{ fontSize: '12px', color: theme.textSecondary }}>
                  Prints CGST and SGST splits and seller GSTIN automatically on checkout printouts.
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              type="button"
              className="button-20-secondary"
              role="button"
              onClick={() => setCurrentStep('payments')}
              style={{
                height: '40px',
                padding: '0 1.25rem',
                fontSize: '13px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
              <span>Back to Payments</span>
            </button>

            <button
              type="submit"
              className="button-20"
              role="button"
              style={{
                height: '42px',
                padding: '0 1.6rem',
                fontSize: '13.5px',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>Save & Continue</span>
              <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
        </form>
      )}

      {/* ==================================================================== */}
      {/* VIEW 3: FINAL COMPLETED STATE                                        */}
      {/* ==================================================================== */}
      {currentStep === 'completed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Success Hero Card */}
          <div
            style={{
              backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: '2px solid #10B981',
              borderRadius: '1.25rem',
              padding: '2rem 1.75rem',
              textAlign: 'center',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: theme.sidebarIsDark ? '#064E3B' : '#ECFDF5',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <CheckCircleRoundedIcon sx={{ fontSize: 40 }} />
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 0.45rem 0', letterSpacing: '-0.02em' }}>
              ✓ Payments & tax are ready
            </h2>
            <p style={{ fontSize: '14.5px', color: theme.textSecondary, margin: '0 0 1.75rem 0', maxWidth: '520px', lineHeight: 1.5 }}>
              Your POS is ready to accept payments and issue GST invoices across all cash and digital counters.
            </p>

            {/* Summary Table Grid */}
            <div
              style={{
                width: '100%',
                maxWidth: '560px',
                backgroundColor: theme.bgPage,
                border: `1px solid ${theme.border}`,
                borderRadius: '0.85rem',
                padding: '1.25rem',
                textAlign: 'left',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginBottom: '1.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '13px', color: theme.textSecondary }}>Payment Provider</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#10B981' }}>
                  {paymentSetup.provider === 'razorpay' ? 'Razorpay' : paymentSetup.provider === 'cashfree' ? 'Cashfree' : 'Manual Standalone'} ✓
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '13px', color: theme.textSecondary }}>Cash Counter Tender</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#10B981' }}>
                  {paymentSetup.methods.cash ? 'Enabled ✓' : 'Disabled'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '13px', color: theme.textSecondary }}>UPI & QR Code</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#10B981' }}>
                  {paymentSetup.methods.upi ? 'Enabled ✓' : 'Disabled'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '13px', color: theme.textSecondary }}>Cards (Visa, Mastercard, RuPay)</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#10B981' }}>
                  {paymentSetup.methods.card ? 'Enabled ✓' : 'Disabled'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '13px', color: theme.textSecondary }}>Dynamic Checkout QR</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#10B981' }}>
                  {paymentSetup.methods.dynamicQr ? 'Enabled ✓' : 'Disabled'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '13px', color: theme.textSecondary }}>GST Status</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#10B981' }}>
                  Configured ({taxSetup.defaultGstRate} Default) ✓
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: theme.textSecondary }}>Settlement Account</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: theme.textPrimary }}>
                  {paymentSetup.settlementAccount.bankName} {paymentSetup.settlementAccount.maskedAccount}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                className="button-20"
                role="button"
                onClick={() => {
                  if (onComplete) onComplete();
                  else if (onBack) onBack();
                }}
                style={{
                  height: '42px',
                  padding: '0 1.85rem',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>Continue setup</span>
                <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
              </button>

              <Link
                href="/pos"
                className="button-20-secondary"
                role="button"
                style={{
                  height: '42px',
                  padding: '0 1.35rem',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxSizing: 'border-box',
                }}
              >
                <PointOfSaleRoundedIcon sx={{ fontSize: 17 }} />
                <span>Launch POS Register</span>
              </Link>

              <button
                type="button"
                onClick={() => setCurrentStep('payments')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.textSecondary,
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '0.5rem 0.85rem',
                  textDecoration: 'underline',
                }}
              >
                Edit configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: CONNECT RAZORPAY / CASHFREE (OAUTH STYLE SIMULATION)        */}
      {/* ==================================================================== */}
      {connectingModal !== 'none' && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              backgroundColor: theme.bgPage,
              border: `1px solid ${theme.border}`,
              borderRadius: '1.25rem',
              width: '100%',
              maxWidth: '480px',
              padding: '1.75rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
              boxSizing: 'border-box',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '0.6rem',
                    backgroundColor: connectingModal === 'razorpay' ? '#0C2340' : '#5A32A3',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '16px',
                  }}
                >
                  {connectingModal === 'razorpay' ? 'R' : 'CF'}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                    {connectingModal === 'razorpay' ? 'Connect Razorpay' : 'Connect Cashfree'}
                  </h3>
                  <div style={{ fontSize: '12px', color: theme.textSecondary }}>
                    Instant POS Partner Authorization
                  </div>
                </div>
              </div>

              {paymentSetup.status !== 'connecting' && (
                <button
                  type="button"
                  onClick={() => setConnectingModal('none')}
                  style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: 0 }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 20 }} />
                </button>
              )}
            </div>

            {/* Connecting State */}
            {paymentSetup.status === 'connecting' ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '3px solid #E5E7EB',
                    borderTopColor: theme.activeBg,
                    animation: 'spin 0.8s linear infinite',
                    marginBottom: '1.25rem',
                  }}
                />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 0.35rem 0' }}>
                  Connecting to {connectingModal === 'razorpay' ? 'Razorpay' : 'Cashfree'}...
                </h4>
                <p style={{ fontSize: '13px', color: theme.textSecondary, margin: 0, maxWidth: '340px', lineHeight: 1.45 }}>
                  Authorizing merchant credentials and linking webhook events for live POS dynamic QR codes.
                </p>
              </div>
            ) : paymentSetup.status === 'error' ? (
              /* Error State */
              <div style={{ padding: '1rem 0' }}>
                <div
                  style={{
                    padding: '1rem 1.15rem',
                    borderRadius: '0.75rem',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #F87171',
                    color: '#991B1B',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 800, fontSize: '14px', marginBottom: '0.2rem' }}>
                    <ErrorOutlineRoundedIcon sx={{ fontSize: 18, color: '#DC2626' }} />
                    <span>Unable to connect</span>
                  </div>
                  <div style={{ fontSize: '12.5px', lineHeight: 1.45 }}>
                    {paymentSetup.errorMessage || 'The authorization handshake timed out. Please check your connection.'}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => setConnectingModal('none')}
                    style={{
                      padding: '0.55rem 1rem',
                      borderRadius: '0.55rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: 'transparent',
                      color: theme.textPrimary,
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="button-20"
                    role="button"
                    onClick={() => handleExecuteConnect(connectingModal as any)}
                    style={{
                      height: '38px',
                      padding: '0 1.25rem',
                      fontSize: '13px',
                      fontWeight: 800,
                    }}
                  >
                    <span>Try again</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Normal Ready to Connect State */
              <div>
                <p style={{ fontSize: '13.5px', color: theme.textSecondary, margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
                  {connectingModal === 'razorpay'
                    ? 'Securely connect your Razorpay business account to your POS to accept UPI QR codes, debit cards, and netbanking.'
                    : 'Connect your Cashfree account to accept UPI and card payments through your POS with auto-reconciled bank settlements.'}
                </p>

                {/* Scope & Permissions Card */}
                <div
                  style={{
                    backgroundColor: theme.sidebarIsDark ? theme.hoverBg : '#F9FAFB',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '0.75rem',
                    padding: '0.95rem 1rem',
                    marginBottom: '1.25rem',
                    fontSize: '12.5px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 800, color: theme.textPrimary, marginBottom: '0.45rem' }}>
                    <SecurityRoundedIcon sx={{ fontSize: 16, color: '#10B981' }} />
                    <span>OAuth Partner Authorization</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.15rem', color: theme.textSecondary, lineHeight: 1.5 }}>
                    <li>Accept customer UPI QR codes on checkout</li>
                    <li>Accept POS card machine transactions</li>
                    <li>Direct settlement to registered store account</li>
                    <li style={{ color: theme.textPrimary, fontWeight: 700 }}>
                      No API keys, API secrets, or passwords needed
                    </li>
                  </ul>
                </div>

                {/* Primary CTA: Continue with Provider */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    type="button"
                    className="button-20"
                    role="button"
                    onClick={() => handleExecuteConnect(connectingModal as any)}
                    style={{
                      height: '42px',
                      width: '100%',
                      fontSize: '13.5px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span>Continue with {connectingModal === 'razorpay' ? 'Razorpay' : 'Cashfree'}</span>
                    <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
                  </button>

                  {/* Secondary Sign Up Prompt */}
                  <div style={{ textAlign: 'center', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '12.5px', color: theme.textSecondary }}>
                      Don&apos;t have a {connectingModal === 'razorpay' ? 'Razorpay' : 'Cashfree'} account?{' '}
                    </span>
                    <button
                      type="button"
                      onClick={() => showToast(`Redirecting to ${connectingModal === 'razorpay' ? 'Razorpay' : 'Cashfree'} registration...`)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: theme.activeBg || theme.textPrimary,
                        fontSize: '12.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        padding: 0,
                        textDecoration: 'underline',
                      }}
                    >
                      Create a {connectingModal === 'razorpay' ? 'Razorpay' : 'Cashfree'} account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: MANAGE PAYMENT ACCOUNT                                      */}
      {/* ==================================================================== */}
      {showManageModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              backgroundColor: theme.bgPage,
              border: `1px solid ${theme.border}`,
              borderRadius: '1.25rem',
              width: '100%',
              maxWidth: '460px',
              padding: '1.5rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Payment Account Details
                </h3>
                <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '2px' }}>
                  Connected via {paymentSetup.provider === 'razorpay' ? 'Razorpay' : 'Cashfree'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowManageModal(false)}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: 0 }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ color: theme.textSecondary }}>Connection Status</span>
                <span style={{ fontWeight: 800, color: '#10B981' }}>Active & Live ✓</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ color: theme.textSecondary }}>Merchant Legal Name</span>
                <span style={{ fontWeight: 700 }}>{paymentSetup.settlementAccount.accountHolder}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ color: theme.textSecondary }}>Settlement Bank</span>
                <span style={{ fontWeight: 800 }}>{paymentSetup.settlementAccount.bankName}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ color: theme.textSecondary }}>Account Number</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{paymentSetup.settlementAccount.maskedAccount}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ color: theme.textSecondary }}>Settlement Frequency</span>
                <span style={{ fontWeight: 700 }}>T+1 Automated Daily Settlement</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0' }}>
                <span style={{ color: theme.textSecondary }}>Webhook Status</span>
                <span style={{ fontWeight: 700, color: '#10B981' }}>Listening (Health: 100%)</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: `1px solid ${theme.border}` }}>
              <button
                type="button"
                onClick={() => {
                  setShowManageModal(false);
                  setShowDisconnectConfirm(true);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#EF4444',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Disconnect account
              </button>

              <button
                type="button"
                className="button-20"
                role="button"
                onClick={() => setShowManageModal(false)}
                style={{
                  height: '36px',
                  padding: '0 1.25rem',
                  fontSize: '12.5px',
                  fontWeight: 800,
                }}
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: DISCONNECT CONFIRMATION                                     */}
      {/* ==================================================================== */}
      {showDisconnectConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10001,
            padding: '1rem',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              backgroundColor: theme.bgPage,
              border: '1px solid #F87171',
              borderRadius: '1.25rem',
              width: '100%',
              maxWidth: '420px',
              padding: '1.5rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 20 }} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                Disconnect {paymentSetup.provider === 'razorpay' ? 'Razorpay' : 'Cashfree'}?
              </h3>
            </div>

            <p style={{ fontSize: '13px', color: theme.textSecondary, margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
              Dynamic UPI QR codes and card payments will be disabled on your POS billing terminal until you reconnect an account.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => setShowDisconnectConfirm(false)}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '0.55rem',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: 'transparent',
                  color: theme.textPrimary,
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Keep Connected
              </button>
              <button
                type="button"
                onClick={handleConfirmDisconnect}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '0.55rem',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
