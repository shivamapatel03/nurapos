'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AppTheme } from '@/lib/themeConfig';

// Material Rounded Icons
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import CallSplitRoundedIcon from '@mui/icons-material/CallSplitRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

export interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    [key: string]: any;
  };
  quantity: number;
  [key: string]: any;
}

export type PaymentMethodId = 'upi' | 'cash' | 'card' | 'split';

export interface SplitPaymentAllocation {
  cash: number;
  upi: number;
  card: number;
}

export interface PaymentRecord {
  method: 'UPI / QR' | 'Cash' | 'Card';
  amount: number;
  reference?: string;
  tendered?: number;
  change?: number;
  status: 'Success';
}

export interface CompletedOrderSummary {
  id: string;
  orderNumber: string;
  date: string;
  timestamp: string;
  customerName: string;
  customerPhone?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  total: number;
  paymentMethod: string;
  payments: PaymentRecord[];
  paymentStatus: 'Success' | 'Partially Paid';
  status: 'Completed';
  orderType: 'dine_in' | 'takeaway' | 'delivery';
  tableNumber?: string;
  tableSection?: string;
  ticketNumber?: string;
  deliveryPlatform?: string;
  saleNote?: string;
  paymentNote?: string;
  cashChange?: number;
}

interface CompletePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: AppTheme;
  orderNumber: string;
  orderType: 'dine_in' | 'takeaway' | 'delivery';
  tableSection?: string;
  tableNumber?: string;
  ticketNumber?: string;
  deliveryPlatform?: string;
  customerName: string;
  customerPhone?: string;
  cart: any[];
  subtotal: number;
  discountAmount: number;
  tax: number;
  total: number;
  saleNote?: string;
  paymentNote: string;
  setPaymentNote: (val: string) => void;
  onCompleteOrder: (order: CompletedOrderSummary) => void;
  getItemUnitPrice: (item: any) => number;
  getItemLineTotal: (item: any) => number;
}


export default function CompletePaymentModal({
  isOpen,
  onClose,
  theme,
  orderNumber,
  orderType,
  tableSection,
  tableNumber,
  ticketNumber,
  deliveryPlatform,
  customerName,
  customerPhone,
  cart,
  subtotal,
  discountAmount,
  tax,
  total,
  saleNote,
  paymentNote,
  setPaymentNote,
  onCompleteOrder,
  getItemUnitPrice,
  getItemLineTotal,
}: CompletePaymentModalProps) {
  // Primary payment method selector
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('upi');

  // Cash state
  const [cashTendered, setCashTendered] = useState<string>(String(total));

  // UPI state
  const [upiStatus, setUpiStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');
  const [upiTxnRef, setUpiTxnRef] = useState<string>('');

  // Card state
  const [cardStatus, setCardStatus] = useState<'ready' | 'processing' | 'approved' | 'failed'>('ready');
  const [cardAuthRef, setCardAuthRef] = useState<string>('');

  // Split Payment state (amounts allocated to each tender)
  const [splitAllocations, setSplitAllocations] = useState<{
    cash: string;
    upi: string;
    card: string;
  }>({
    cash: '',
    upi: '',
    card: '',
  });

  // Split cash tendered
  const [splitCashTendered, setSplitCashTendered] = useState<string>('');

  // Order completion / receipt view state
  const [completedOrder, setCompletedOrder] = useState<CompletedOrderSummary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string>('');

  const prevIsOpenRef = useRef(false);

  // Reset and initialize when modal opens fresh
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setPaymentMethod('upi');
      setCashTendered(String(total));
      setUpiStatus('pending');
      const randomUpi = `UPI${Math.floor(100000 + Math.random() * 900000)}`;
      setUpiTxnRef(randomUpi);
      setCardStatus('ready');
      const randomAuth = `AUTH${Math.floor(10000 + Math.random() * 90000)}`;
      setCardAuthRef(randomAuth);
      setSplitAllocations({
        cash: '',
        upi: '',
        card: '',
      });
      setSplitCashTendered('');
      setCompletedOrder(null);
      setIsSubmitting(false);
      setCopyFeedback('');
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, total]);

  // Derived order context label
  const orderTypeLabel = useMemo(() => {
    if (orderType === 'dine_in') {
      return `Dine In (${tableSection || 'Main Hall'} • ${tableNumber || 'T-01'})`;
    }
    if (orderType === 'takeaway') {
      return `Takeaway (${ticketNumber || '#TK-01'})`;
    }
    return `Delivery (${deliveryPlatform || 'Direct'})`;
  }, [orderType, tableSection, tableNumber, ticketNumber, deliveryPlatform]);

  // Cash calculations
  const parsedCashTendered = parseFloat(cashTendered) || 0;
  const cashChange = Math.max(0, Math.round((parsedCashTendered - total) * 100) / 100);
  const isCashInsufficient = parsedCashTendered < total;

  // Split calculations
  const parsedSplitCash = Math.max(0, parseFloat(splitAllocations.cash) || 0);
  const parsedSplitUpi = Math.max(0, parseFloat(splitAllocations.upi) || 0);
  const parsedSplitCard = Math.max(0, parseFloat(splitAllocations.card) || 0);

  const splitAllocatedTotal = Math.round((parsedSplitCash + parsedSplitUpi + parsedSplitCard) * 100) / 100;
  const splitRemainingBalance = Math.round((total - splitAllocatedTotal) * 100) / 100;
  const isSplitBalanced = Math.abs(splitRemainingBalance) < 0.01;
  const isSplitOverallocated = splitRemainingBalance < -0.01;

  const parsedSplitCashTendered = parseFloat(splitCashTendered) || parsedSplitCash;
  const splitCashChange = Math.max(0, Math.round((parsedSplitCashTendered - parsedSplitCash) * 100) / 100);
  const isSplitCashInsufficient = parsedSplitCash > 0 && parsedSplitCashTendered < parsedSplitCash;

  // Split Fill helper
  const handleFillSplitRemaining = (tender: 'cash' | 'upi' | 'card') => {
    const currentVal = Math.max(0, parseFloat(splitAllocations[tender]) || 0);
    const available = Math.max(0, splitRemainingBalance + currentVal);
    const rounded = Math.round(available * 100) / 100;

    setSplitAllocations((prev) => ({
      ...prev,
      [tender]: rounded > 0 ? String(rounded) : '',
    }));

    if (tender === 'cash') {
      setSplitCashTendered(String(rounded));
    }
  };

  // Quick 50/50 Split Helper
  const handleSplitFiftyFifty = () => {
    const half = Math.round((total / 2) * 100) / 100;
    const remainder = Math.round((total - half) * 100) / 100;
    setSplitAllocations({
      cash: String(half),
      upi: String(remainder),
      card: '',
    });
    setSplitCashTendered(String(half));
  };

  // Quick Clear Split
  const handleResetSplit = () => {
    setSplitAllocations({
      cash: '',
      upi: '',
      card: '',
    });
    setSplitCashTendered('');
  };

  // Simulate UPI confirmation
  const handleSimulateUpiPay = () => {
    setUpiStatus('processing');
    setTimeout(() => {
      setUpiStatus('success');
    }, 600);
  };

  // Simulate Card terminal authorization
  const handleSimulateCardAuth = () => {
    setCardStatus('processing');
    setTimeout(() => {
      setCardStatus('approved');
    }, 700);
  };

  // Process and finalize payment
  const handleConfirmAndComplete = () => {
    if (isSubmitting) return;

    // Validation checks
    if (paymentMethod === 'cash' && isCashInsufficient) {
      alert(`Insufficient cash received. Short by ₹${(total - parsedCashTendered).toFixed(2)}`);
      return;
    }

    if (paymentMethod === 'split') {
      if (!isSplitBalanced) {
        if (splitRemainingBalance > 0) {
          alert(`Please allocate the remaining balance of ₹${splitRemainingBalance.toFixed(2)}.`);
        } else {
          alert(`Allocated amount exceeds total by ₹${Math.abs(splitRemainingBalance).toFixed(2)}.`);
        }
        return;
      }
      if (isSplitCashInsufficient) {
        alert(`Insufficient cash tendered for the cash portion. Short by ₹${(parsedSplitCash - parsedSplitCashTendered).toFixed(2)}.`);
        return;
      }
    }

    setIsSubmitting(true);

    // Build payment records array
    const paymentsList: PaymentRecord[] = [];

    if (paymentMethod === 'upi') {
      paymentsList.push({
        method: 'UPI / QR',
        amount: total,
        reference: upiTxnRef || `UPI${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'Success',
      });
    } else if (paymentMethod === 'cash') {
      paymentsList.push({
        method: 'Cash',
        amount: total,
        tendered: parsedCashTendered,
        change: cashChange,
        status: 'Success',
      });
    } else if (paymentMethod === 'card') {
      paymentsList.push({
        method: 'Card',
        amount: total,
        reference: cardAuthRef || `AUTH${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'Success',
      });
    } else if (paymentMethod === 'split') {
      if (parsedSplitCash > 0) {
        paymentsList.push({
          method: 'Cash',
          amount: parsedSplitCash,
          tendered: parsedSplitCashTendered,
          change: splitCashChange,
          status: 'Success',
        });
      }
      if (parsedSplitUpi > 0) {
        paymentsList.push({
          method: 'UPI / QR',
          amount: parsedSplitUpi,
          reference: upiTxnRef || `UPI${Math.floor(100000 + Math.random() * 900000)}`,
          status: 'Success',
        });
      }
      if (parsedSplitCard > 0) {
        paymentsList.push({
          method: 'Card',
          amount: parsedSplitCard,
          reference: cardAuthRef || `AUTH${Math.floor(10000 + Math.random() * 90000)}`,
          status: 'Success',
        });
      }
    }

    // Auto-compose payment reference notes if empty
    let autoRefNote = paymentNote.trim();
    if (!autoRefNote) {
      if (paymentMethod === 'upi') autoRefNote = `UPI: ${upiTxnRef}`;
      else if (paymentMethod === 'card') autoRefNote = `Card Auth: ${cardAuthRef}`;
      else if (paymentMethod === 'cash' && cashChange > 0) autoRefNote = `Cash Change: ₹${cashChange.toFixed(2)}`;
      else if (paymentMethod === 'split') {
        const parts = paymentsList.map((p) => `${p.method}: ₹${p.amount.toFixed(2)}`).join(' • ');
        autoRefNote = `Split: ${parts}`;
      }
    }

    const orderRecord: CompletedOrderSummary = {
      id: orderNumber.replace('#', ''),
      orderNumber,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      customerName: customerName.trim() || 'Guest Customer',
      customerPhone: customerPhone?.trim() || '',
      items: cart.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        price: getItemUnitPrice(i),
        quantity: i.quantity,
        total: getItemLineTotal(i),
      })),
      subtotal,
      discountAmount,
      taxAmount: tax,
      totalAmount: total,
      total,
      paymentMethod: paymentMethod === 'split' ? 'Split Payment' : paymentMethod.toUpperCase(),
      payments: paymentsList,
      paymentStatus: 'Success',
      status: 'Completed',
      orderType,
      tableNumber: orderType === 'dine_in' ? `${tableSection || 'Main Hall'} - ${tableNumber || 'T-01'}` : undefined,
      tableSection: orderType === 'dine_in' ? tableSection : undefined,
      ticketNumber: orderType === 'takeaway' ? ticketNumber : undefined,
      deliveryPlatform: orderType === 'delivery' ? deliveryPlatform : undefined,
      saleNote: saleNote?.trim() || undefined,
      paymentNote: autoRefNote || undefined,
      cashChange: paymentMethod === 'cash' ? cashChange : paymentMethod === 'split' ? splitCashChange : 0,
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('nuradesk_orders') || '[]');
      const updated = [orderRecord, ...existing];
      localStorage.setItem('nuradesk_orders', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to store order in localStorage', e);
    }

    // Set completed order to show receipt in popup
    setCompletedOrder(orderRecord);
    setIsSubmitting(false);

    // Notify parent
    onCompleteOrder(orderRecord);
  };

  // Copy receipt summary to clipboard
  const handleCopyReceipt = () => {
    if (!completedOrder) return;
    const lines = [
      `*** NURADESK POS RECEIPT ***`,
      `Order: ${completedOrder.orderNumber}`,
      `Date: ${completedOrder.date} ${new Date(completedOrder.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      `Customer: ${completedOrder.customerName}`,
      `Order Type: ${orderTypeLabel}`,
      `--------------------------------`,
      ...completedOrder.items.map((it) => `${it.name} x${it.quantity} = ₹${it.total.toFixed(2)}`),
      `--------------------------------`,
      `Subtotal: ₹${completedOrder.subtotal.toFixed(2)}`,
      completedOrder.discountAmount > 0 ? `Discount: -₹${completedOrder.discountAmount.toFixed(2)}` : null,
      `GST (5%): ₹${completedOrder.taxAmount.toFixed(2)}`,
      `TOTAL PAID: ₹${completedOrder.total.toFixed(2)}`,
      `Method: ${completedOrder.paymentMethod}`,
      ...completedOrder.payments.map((p) => ` - ${p.method}: ₹${p.amount.toFixed(2)} ${p.reference ? `(Ref: ${p.reference})` : ''}`),
      completedOrder.cashChange && completedOrder.cashChange > 0 ? `Change Returned: ₹${completedOrder.cashChange.toFixed(2)}` : null,
      `Status: COMPLETED`,
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(lines).then(() => {
      setCopyFeedback('Receipt copied to clipboard!');
      setTimeout(() => setCopyFeedback(''), 2500);
    });
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '510px',
          backgroundColor: theme.popoverBg,
          border: `1px solid ${theme.border}`,
          borderRadius: '1.25rem',
          padding: '1.5rem',
          boxShadow: 'none',
          boxSizing: 'border-box',
          maxHeight: '94vh',
          overflowY: 'auto',
          fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
        }}
      >
        {/* =================================================================== */}
        {/* 1. SUCCESS RECEIPT VIEW (Appears after successful payment)         */}
        {/* =================================================================== */}
        {completedOrder ? (
          <div>
            {/* Header: Success Badge */}
            <div style={{ textAlign: 'center', paddingBottom: '1rem' }}>
              <CheckCircleRoundedIcon sx={{ fontSize: 50, color: '#22C55E', marginBottom: '0.4rem' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 0.2rem 0' }}>
                Payment Successful!
              </h3>
              <p style={{ fontSize: '13px', color: theme.textSecondary, margin: 0 }}>
                {completedOrder.orderNumber} • ₹{completedOrder.total.toFixed(2)} Paid in Full
              </p>
            </div>

            {/* Receipt Card */}
            <div
              style={{
                backgroundColor: theme.bgCardSubtle,
                border: `1px solid ${theme.border}`,
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '1rem',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
              }}
            >
              {/* Order Info Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px dashed ${theme.border}`, paddingBottom: '0.6rem' }}>
                <div>
                  <div style={{ fontWeight: 700, color: theme.textPrimary }}>{completedOrder.customerName}</div>
                  <div style={{ color: theme.textSecondary, fontSize: '11px' }}>{orderTypeLabel}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: theme.textPrimary }}>
                    {new Date(completedOrder.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ color: theme.textSecondary, fontSize: '11px' }}>{completedOrder.date}</div>
                </div>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', borderBottom: `1px dashed ${theme.border}`, paddingBottom: '0.6rem' }}>
                <div style={{ fontWeight: 700, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Purchased Items ({completedOrder.items.length})
                </div>
                {completedOrder.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: theme.textPrimary }}>
                    <span>
                      {it.name} <span style={{ color: theme.textSecondary }}>x{it.quantity}</span>
                    </span>
                    <span style={{ fontWeight: 600 }}>₹{it.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', borderBottom: `1px dashed ${theme.border}`, paddingBottom: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: theme.textSecondary }}>
                  <span>Subtotal</span>
                  <span>₹{completedOrder.subtotal.toFixed(2)}</span>
                </div>
                {completedOrder.discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', fontWeight: 600 }}>
                    <span>Discount</span>
                    <span>-₹{completedOrder.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: theme.textSecondary }}>
                  <span>Taxes (5% GST)</span>
                  <span>₹{completedOrder.taxAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '14px', color: theme.textPrimary, paddingTop: '0.2rem' }}>
                  <span>Total Amount</span>
                  <span>₹{completedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Tenders Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ fontWeight: 700, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Payment Method Breakdown
                </div>
                {completedOrder.payments.map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: theme.textPrimary, fontWeight: 600 }}>
                    <span>
                      {p.method}
                      {p.reference && <span style={{ color: theme.textSecondary, fontWeight: 400, fontSize: '11px' }}> ({p.reference})</span>}
                    </span>
                    <span>₹{p.amount.toFixed(2)}</span>
                  </div>
                ))}
                {completedOrder.cashChange !== undefined && completedOrder.cashChange > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', fontWeight: 700, paddingTop: '0.15rem' }}>
                    <span>Change Returned:</span>
                    <span>₹{completedOrder.cashChange.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Receipt Actions */}
            {copyFeedback && (
              <div style={{ textAlign: 'center', color: '#16A34A', fontSize: '12px', fontWeight: 700, marginBottom: '0.65rem' }}>
                {copyFeedback}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={handleCopyReceipt}
                className="button-20-secondary"
                style={{
                  height: '42px',
                  borderRadius: '0.55rem',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.bgCard,
                  color: theme.textPrimary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                <ContentCopyRoundedIcon sx={{ fontSize: 16 }} />
                <span>Copy Receipt</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="button-20-secondary"
                style={{
                  height: '42px',
                  borderRadius: '0.55rem',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.bgCard,
                  color: theme.textPrimary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                <PrintRoundedIcon sx={{ fontSize: 17 }} />
                <span>Print Receipt</span>
              </button>
            </div>

            {/* Next Order / Done Button */}
            <button
              type="button"
              onClick={onClose}
              className="button-20"
              style={{
                width: '100%',
                height: '46px',
                marginTop: '0.75rem',
                borderRadius: '0.55rem',
                backgroundColor: theme.posBtnBg,
                color: theme.posBtnText,
                fontSize: '14.5px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <span>Start Next Order</span>
              <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
            </button>
          </div>
        ) : (
          /* =================================================================== */
          /* 2. MAIN PAYMENT FORM VIEW                                           */
          /* =================================================================== */
          <>
            {/* Header: Title + Close Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: theme.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>
                  Complete Payment
                </h3>
                <div style={{ fontSize: '12.5px', color: theme.textSecondary, marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span>Total Due: <strong style={{ color: theme.textPrimary }}>₹{total.toFixed(2)}</strong></span>
                  <span>•</span>
                  <span style={{ fontWeight: 700, color: theme.activeBg }}>{orderTypeLabel}</span>
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '0.15rem' }}>
                  Customer: <strong style={{ color: theme.textPrimary }}>{customerName}</strong> {customerPhone ? `(${customerPhone})` : ''}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close payment popup"
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.textPrimary,
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            {/* Financial Summary Card (Subtotal, Tax, Discounts, Balance) */}
            <div
              style={{
                backgroundColor: theme.bgCardSubtle,
                border: `1px solid ${theme.border}`,
                borderRadius: '0.75rem',
                padding: '0.75rem 0.95rem',
                marginBottom: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ color: theme.textSecondary }}>Order {orderNumber}</span>
                <span style={{ color: theme.textPrimary, fontWeight: 700 }}>
                  Subtotal: ₹{subtotal.toFixed(2)} {discountAmount > 0 && <span style={{ color: '#16A34A' }}>(-₹{discountAmount.toFixed(2)})</span>} + GST: ₹{tax.toFixed(2)}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: theme.textSecondary, fontSize: '11px' }}>Amount Due</span>
                <div style={{ fontSize: '18px', fontWeight: 900, color: theme.textPrimary, lineHeight: 1.1 }}>
                  ₹{total.toFixed(2)}
                </div>
              </div>
            </div>

            {/* 4-Item Payment Method Selector (UPI, Cash, Card, Split Payment) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.5rem',
                marginBottom: '1.25rem',
              }}
            >
              {[
                { id: 'upi', label: 'UPI / QR', icon: <QrCode2RoundedIcon sx={{ fontSize: 22 }} /> },
                { id: 'cash', label: 'Cash', icon: <PaymentsRoundedIcon sx={{ fontSize: 22 }} /> },
                { id: 'card', label: 'Card', icon: <CreditCardRoundedIcon sx={{ fontSize: 22 }} /> },
                { id: 'split', label: 'Split Pay', icon: <CallSplitRoundedIcon sx={{ fontSize: 22 }} /> },
              ].map((m) => {
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as PaymentMethodId)}
                    style={{
                      padding: '0.75rem 0.35rem',
                      borderRadius: '0.75rem',
                      border: isSelected ? `1px solid ${theme.activeBg}` : `1px solid ${theme.border}`,
                      backgroundColor: isSelected ? theme.activeBg : theme.bgCardSubtle,
                      color: isSelected ? theme.activeText : theme.textPrimary,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      transition: 'background-color 0.15s ease, border-color 0.15s ease',
                      outline: 'none',
                    }}
                  >
                    {m.icon}
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ================================================================= */}
            {/* PANEL 1: UPI / QR                                                */}
            {/* ================================================================= */}
            {paymentMethod === 'upi' && (
              <div
                style={{
                  padding: '1.15rem',
                  backgroundColor: theme.bgCardSubtle,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '0.85rem',
                  textAlign: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                {/* QR Code Graphic Frame */}
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '0.65rem',
                    margin: '0 auto 0.75rem auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <QrCode2RoundedIcon sx={{ fontSize: 96, color: '#000000' }} />
                </div>

                <div style={{ fontSize: '13px', fontWeight: 800, color: theme.textPrimary, marginBottom: '0.2rem' }}>
                  Pay ₹{total.toFixed(2)} via Dynamic UPI QR
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginBottom: '0.75rem' }}>
                  Scan with GPay, PhonePe, Paytm, or BHIM UPI
                </div>

                {/* Status Indicator & Simulated Verification */}
                {upiStatus === 'pending' && (
                  <button
                    type="button"
                    onClick={handleSimulateUpiPay}
                    className="button-20-secondary"
                    style={{
                      height: '34px',
                      padding: '0 0.85rem',
                      borderRadius: '0.5rem',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgCard,
                      color: theme.textPrimary,
                      cursor: 'pointer',
                    }}
                  >
                    Simulate Customer Scan &amp; Pay
                  </button>
                )}

                {upiStatus === 'processing' && (
                  <div style={{ fontSize: '12px', color: '#2563EB', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <span>Verifying UPI settlement with bank...</span>
                  </div>
                )}

                {upiStatus === 'success' && (
                  <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                    <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
                    <span>Payment Received • Ref: {upiTxnRef}</span>
                  </div>
                )}
              </div>
            )}

            {/* ================================================================= */}
            {/* PANEL 2: CASH                                                    */}
            {/* ================================================================= */}
            {paymentMethod === 'cash' && (
              <div
                style={{
                  padding: '1.15rem',
                  backgroundColor: theme.bgCardSubtle,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '0.85rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '12.5px', color: theme.textSecondary, fontWeight: 700 }}>
                    Cash Received:
                  </label>
                  <span style={{ fontSize: '12px', color: theme.textSecondary }}>
                    Amount Due: <strong style={{ color: theme.textPrimary }}>₹{total.toFixed(2)}</strong>
                  </span>
                </div>

                {/* Cash Input */}
                <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '0.85rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: theme.textSecondary,
                    }}
                  >
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    style={{
                      width: '100%',
                      height: '44px',
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '0.55rem',
                      padding: '0 0.85rem 0 2.2rem',
                      color: theme.textPrimary,
                      fontSize: '18px',
                      fontWeight: 800,
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Quick Tender Fast Presets */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setCashTendered(String(total))}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '0.45rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: parsedCashTendered === total ? theme.activeBg : theme.bgCard,
                      color: parsedCashTendered === total ? theme.activeText : theme.textPrimary,
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Exact (₹{total})
                  </button>
                  {[50, 100, 200, 500, 2000]
                    .filter((note) => note >= total || total - note < 50)
                    .slice(0, 4)
                    .map((note) => (
                      <button
                        key={note}
                        type="button"
                        onClick={() => setCashTendered(String(note))}
                        style={{
                          padding: '0.35rem 0.65rem',
                          borderRadius: '0.45rem',
                          border: `1px solid ${theme.border}`,
                          backgroundColor: parsedCashTendered === note ? theme.activeBg : theme.bgCard,
                          color: parsedCashTendered === note ? theme.activeText : theme.textPrimary,
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        ₹{note}
                      </button>
                    ))}
                </div>

                {/* Change or Shortage Display */}
                <div
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    backgroundColor: isCashInsufficient ? 'rgba(239, 68, 68, 0.08)' : 'rgba(34, 197, 94, 0.08)',
                    border: `1px solid ${isCashInsufficient ? '#EF4444' : '#22C55E'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12.5px',
                  }}
                >
                  <span style={{ fontWeight: 600, color: isCashInsufficient ? '#EF4444' : '#16A34A' }}>
                    {isCashInsufficient ? 'Short by Amount:' : 'Change to Return:'}
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: 900, color: isCashInsufficient ? '#EF4444' : '#16A34A' }}>
                    ₹{isCashInsufficient ? (total - parsedCashTendered).toFixed(2) : cashChange.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* PANEL 3: CARD                                                    */}
            {/* ================================================================= */}
            {paymentMethod === 'card' && (
              <div
                style={{
                  padding: '1.15rem',
                  backgroundColor: theme.bgCardSubtle,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '0.85rem',
                  textAlign: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'inline-flex', padding: '0.5rem', backgroundColor: theme.bgCard, borderRadius: '9999px', border: `1px solid ${theme.border}`, marginBottom: '0.5rem' }}>
                  <CreditCardRoundedIcon sx={{ fontSize: 28, color: theme.textPrimary }} />
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: theme.textPrimary, marginBottom: '0.2rem' }}>
                  EDC Smart Terminal • ₹{total.toFixed(2)}
                </div>
                <div style={{ fontSize: '12px', color: theme.textSecondary, marginBottom: '0.85rem' }}>
                  Insert, swipe, or tap debit/credit card on EDC terminal.
                </div>

                {cardStatus === 'ready' && (
                  <button
                    type="button"
                    onClick={handleSimulateCardAuth}
                    className="button-20-secondary"
                    style={{
                      height: '34px',
                      padding: '0 0.85rem',
                      borderRadius: '0.5rem',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgCard,
                      color: theme.textPrimary,
                      cursor: 'pointer',
                    }}
                  >
                    Send to Terminal (Simulate Auth)
                  </button>
                )}

                {cardStatus === 'processing' && (
                  <div style={{ fontSize: '12px', color: '#2563EB', fontWeight: 700 }}>
                    Awaiting card tap/PIN authorization...
                  </div>
                )}

                {cardStatus === 'approved' && (
                  <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                    <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
                    <span>Card Approved • Auth Code: {cardAuthRef}</span>
                  </div>
                )}
              </div>
            )}

            {/* ================================================================= */}
            {/* PANEL 4: SPLIT PAYMENT (Dedicated Multi-Tender Workspace)         */}
            {/* ================================================================= */}
            {paymentMethod === 'split' && (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: theme.bgCardSubtle,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '0.85rem',
                  marginBottom: '1.25rem',
                }}
              >
                {/* Split Balance Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '0.75rem',
                    borderBottom: `1px solid ${theme.border}`,
                    marginBottom: '0.75rem',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                      Split Balance Status
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: theme.textPrimary }}>
                      Allocated: ₹{splitAllocatedTotal.toFixed(2)} / ₹{total.toFixed(2)}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '0.5rem',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      backgroundColor: isSplitBalanced
                        ? 'rgba(34, 197, 94, 0.12)'
                        : isSplitOverallocated
                        ? 'rgba(239, 68, 68, 0.12)'
                        : 'rgba(245, 158, 11, 0.12)',
                      color: isSplitBalanced ? '#16A34A' : isSplitOverallocated ? '#EF4444' : '#D97706',
                      border: `1px solid ${isSplitBalanced ? '#22C55E' : isSplitOverallocated ? '#EF4444' : '#F59E0B'}`,
                    }}
                  >
                    {isSplitBalanced
                      ? '✓ Fully Settled'
                      : isSplitOverallocated
                      ? `Over ₹${Math.abs(splitRemainingBalance).toFixed(2)}`
                      : `₹${splitRemainingBalance.toFixed(2)} Remaining`}
                  </div>
                </div>

                {/* Quick Split Buttons */}
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.85rem' }}>
                  <button
                    type="button"
                    onClick={handleSplitFiftyFifty}
                    style={{
                      padding: '0.3rem 0.55rem',
                      borderRadius: '0.45rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgCard,
                      color: theme.textPrimary,
                      fontSize: '10.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    50/50 Cash + UPI
                  </button>
                  <button
                    type="button"
                    onClick={handleResetSplit}
                    style={{
                      padding: '0.3rem 0.55rem',
                      borderRadius: '0.45rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgCard,
                      color: theme.textSecondary,
                      fontSize: '10.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Reset
                  </button>
                </div>

                {/* Split Rows: Cash, UPI, Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {/* Row 1: Cash Allocation */}
                  <div
                    style={{
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '0.65rem',
                      padding: '0.55rem 0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <PaymentsRoundedIcon sx={{ fontSize: 16 }} />
                        <span>Cash Amount</span>
                      </span>
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <button
                          type="button"
                          onClick={() => handleFillSplitRemaining('cash')}
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 700,
                            padding: '0.2rem 0.45rem',
                            borderRadius: '4px',
                            border: `1px solid ${theme.border}`,
                            backgroundColor: theme.bgCardSubtle,
                            color: theme.textPrimary,
                            cursor: 'pointer',
                          }}
                        >
                          Fill Remaining
                        </button>
                        {splitAllocations.cash && (
                          <button
                            type="button"
                            onClick={() => setSplitAllocations((p) => ({ ...p, cash: '' }))}
                            style={{
                              fontSize: '10.5px',
                              fontWeight: 700,
                              padding: '0.2rem 0.45rem',
                              borderRadius: '4px',
                              border: `1px solid ${theme.border}`,
                              backgroundColor: theme.bgCardSubtle,
                              color: theme.textSecondary,
                              cursor: 'pointer',
                            }}
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        value={splitAllocations.cash}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSplitAllocations((p) => ({ ...p, cash: val }));
                          setSplitCashTendered(val);
                        }}
                        style={{
                          flex: 1,
                          height: '34px',
                          backgroundColor: theme.bgCardSubtle,
                          border: `1px solid ${theme.border}`,
                          borderRadius: '0.45rem',
                          padding: '0 0.65rem',
                          color: theme.textPrimary,
                          fontSize: '14px',
                          fontWeight: 700,
                          fontFamily: 'inherit',
                          outline: 'none',
                        }}
                      />
                      {parsedSplitCash > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '11px', color: theme.textSecondary }}>
                          <span>Tendered:</span>
                          <input
                            type="number"
                            step="0.01"
                            value={splitCashTendered}
                            onChange={(e) => setSplitCashTendered(e.target.value)}
                            placeholder={String(parsedSplitCash)}
                            style={{
                              width: '75px',
                              height: '32px',
                              backgroundColor: theme.bgCardSubtle,
                              border: `1px solid ${theme.border}`,
                              borderRadius: '0.45rem',
                              padding: '0 0.45rem',
                              color: theme.textPrimary,
                              fontSize: '12px',
                              fontWeight: 700,
                              fontFamily: 'inherit',
                              outline: 'none',
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {parsedSplitCash > 0 && splitCashChange > 0 && (
                      <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700, textAlign: 'right' }}>
                        Change to Return: ₹{splitCashChange.toFixed(2)}
                      </div>
                    )}
                  </div>

                  {/* Row 2: UPI / QR Allocation */}
                  <div
                    style={{
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '0.65rem',
                      padding: '0.55rem 0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <QrCode2RoundedIcon sx={{ fontSize: 16 }} />
                        <span>UPI / QR Amount</span>
                      </span>
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <button
                          type="button"
                          onClick={() => handleFillSplitRemaining('upi')}
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 700,
                            padding: '0.2rem 0.45rem',
                            borderRadius: '4px',
                            border: `1px solid ${theme.border}`,
                            backgroundColor: theme.bgCardSubtle,
                            color: theme.textPrimary,
                            cursor: 'pointer',
                          }}
                        >
                          Fill Remaining
                        </button>
                        {splitAllocations.upi && (
                          <button
                            type="button"
                            onClick={() => setSplitAllocations((p) => ({ ...p, upi: '' }))}
                            style={{
                              fontSize: '10.5px',
                              fontWeight: 700,
                              padding: '0.2rem 0.45rem',
                              borderRadius: '4px',
                              border: `1px solid ${theme.border}`,
                              backgroundColor: theme.bgCardSubtle,
                              color: theme.textSecondary,
                              cursor: 'pointer',
                            }}
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        value={splitAllocations.upi}
                        onChange={(e) => setSplitAllocations((p) => ({ ...p, upi: e.target.value }))}
                        style={{
                          flex: 1,
                          height: '34px',
                          backgroundColor: theme.bgCardSubtle,
                          border: `1px solid ${theme.border}`,
                          borderRadius: '0.45rem',
                          padding: '0 0.65rem',
                          color: theme.textPrimary,
                          fontSize: '14px',
                          fontWeight: 700,
                          fontFamily: 'inherit',
                          outline: 'none',
                        }}
                      />
                      {parsedSplitUpi > 0 && (
                        <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700 }}>
                          ✓ QR Ready
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Card Allocation */}
                  <div
                    style={{
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '0.65rem',
                      padding: '0.55rem 0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <CreditCardRoundedIcon sx={{ fontSize: 16 }} />
                        <span>Card Amount</span>
                      </span>
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <button
                          type="button"
                          onClick={() => handleFillSplitRemaining('card')}
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 700,
                            padding: '0.2rem 0.45rem',
                            borderRadius: '4px',
                            border: `1px solid ${theme.border}`,
                            backgroundColor: theme.bgCardSubtle,
                            color: theme.textPrimary,
                            cursor: 'pointer',
                          }}
                        >
                          Fill Remaining
                        </button>
                        {splitAllocations.card && (
                          <button
                            type="button"
                            onClick={() => setSplitAllocations((p) => ({ ...p, card: '' }))}
                            style={{
                              fontSize: '10.5px',
                              fontWeight: 700,
                              padding: '0.2rem 0.45rem',
                              borderRadius: '4px',
                              border: `1px solid ${theme.border}`,
                              backgroundColor: theme.bgCardSubtle,
                              color: theme.textSecondary,
                              cursor: 'pointer',
                            }}
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        value={splitAllocations.card}
                        onChange={(e) => setSplitAllocations((p) => ({ ...p, card: e.target.value }))}
                        style={{
                          flex: 1,
                          height: '34px',
                          backgroundColor: theme.bgCardSubtle,
                          border: `1px solid ${theme.border}`,
                          borderRadius: '0.45rem',
                          padding: '0 0.65rem',
                          color: theme.textPrimary,
                          fontSize: '14px',
                          fontWeight: 700,
                          fontFamily: 'inherit',
                          outline: 'none',
                        }}
                      />
                      {parsedSplitCard > 0 && (
                        <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 700 }}>
                          EDC Ready
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Note / Reference Input */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: theme.textSecondary }}>
                  Payment Note / Reference:
                </label>
                {paymentNote && (
                  <button
                    type="button"
                    onClick={() => setPaymentNote('')}
                    style={{ background: 'none', border: 'none', color: theme.textMuted, fontSize: '11px', cursor: 'pointer' }}
                  >
                    Clear
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="e.g. UPI txn ref, Cheque #, Split info..."
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                style={{
                  width: '100%',
                  height: '38px',
                  backgroundColor: theme.bgCard,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '0.55rem',
                  padding: '0 0.75rem',
                  color: theme.textPrimary,
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            {/* Primary Action Button (Using button-20 styling with no outer shadows) */}
            <button
              type="button"
              disabled={
                isSubmitting ||
                (paymentMethod === 'cash' && isCashInsufficient) ||
                (paymentMethod === 'split' && (!isSplitBalanced || isSplitCashInsufficient))
              }
              onClick={handleConfirmAndComplete}
              className="button-20"
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '6px',
                backgroundColor: theme.posBtnBg,
                color: theme.posBtnText,
                fontSize: '14.5px',
                fontWeight: 800,
                border: 'none',
                cursor:
                  isSubmitting ||
                  (paymentMethod === 'cash' && isCashInsufficient) ||
                  (paymentMethod === 'split' && (!isSplitBalanced || isSplitCashInsufficient))
                    ? 'not-allowed'
                    : 'pointer',
                opacity:
                  isSubmitting ||
                  (paymentMethod === 'cash' && isCashInsufficient) ||
                  (paymentMethod === 'split' && (!isSplitBalanced || isSplitCashInsufficient))
                    ? 0.5
                    : 1,
                boxShadow: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <span>
                {isSubmitting
                  ? 'Processing Order...'
                  : paymentMethod === 'split' && !isSplitBalanced
                  ? `Allocate ₹${Math.abs(splitRemainingBalance).toFixed(2)} to Complete`
                  : 'Confirm & Complete Order'}
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
