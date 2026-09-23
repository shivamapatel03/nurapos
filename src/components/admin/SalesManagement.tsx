'use client';

import React, { useState, useMemo, useEffect } from 'react';

// Material Rounded Icons
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import AssignmentReturnRoundedIcon from '@mui/icons-material/AssignmentReturnRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import StoreRoundedIcon from '@mui/icons-material/StoreRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';

export interface OrderItemLine {
  id: string;
  name: string;
  variant?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SalesOrder {
  id: string; // e.g. ORD-9842
  timestamp: string;
  date: string;
  customerName: string;
  customerPhone?: string;
  cashierName: string;
  terminalId: string;
  items: OrderItemLine[];
  subtotal: number;
  discount: number;
  discountReason?: string;
  tax: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'Cash' | 'Wallet';
  paymentStatus: 'Success' | 'Failed' | 'Refunded';
  orderStatus: 'Completed' | 'In Progress' | 'Refunded' | 'Cancelled';
  saleNote?: string;
  paymentNote?: string;
}

export interface ReturnRecord {
  id: string; // e.g. RET-104
  orderId: string;
  timestamp: string;
  date: string;
  customerName: string;
  returnedItems: {
    name: string;
    quantity: number;
    unitPrice: number;
    refundTotal: number;
  }[];
  refundAmount: number;
  refundMethod: 'Original Payment' | 'Cash' | 'Store Credit';
  reason: 'Wrong Item Given' | 'Quality / Taste Issue' | 'Customer Changed Mind' | 'Defective Packaging' | 'Kitchen Cancellation';
  approvedBy: string;
  status: 'Refunded' | 'Pending Approval' | 'Rejected';
  notes?: string;
}

export interface PaymentTransaction {
  id: string; // e.g. TXN-89210
  orderId: string;
  timestamp: string;
  date: string;
  customerName: string;
  method: 'UPI' | 'Card' | 'Cash' | 'Wallet';
  amount: number;
  tenderedAmount?: number;
  changeGiven?: number;
  status: 'Success' | 'Failed' | 'Refunded' | 'Pending';
  gatewayRef?: string;
  terminalId: string;
  cardLast4?: string;
  upiHandle?: string;
}

export interface SalesManagementProps {
  activeSubTab?: 'orders' | 'returns' | 'payments';
  onSelectSubTab?: (tab: 'orders' | 'returns' | 'payments') => void;
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
    activeIcon: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    secondaryBadgeBg: string;
    secondaryBadgeText: string;
    tableHeaderBg: string;
    tableRowHover: string;
    popoverBg: string;
    popoverBorder: string;
    sidebarIsDark: boolean;
  };
}

// Initial Sample Orders
const INITIAL_ORDERS: SalesOrder[] = [
  {
    id: 'ORD-9842',
    timestamp: '14:20',
    date: '2026-09-20',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 97241 88920',
    cashierName: 'Priya Sharma',
    terminalId: 'POS-Ahmedabad-01',
    items: [
      { id: 'i1', name: 'Artisan Beef Smash Burger', variant: 'Double Patty', quantity: 2, unitPrice: 320, totalPrice: 640 },
      { id: 'i2', name: 'Truffle Parmesan French Fries', variant: 'Regular', quantity: 1, unitPrice: 150, totalPrice: 150 },
      { id: 'i3', name: 'Cappuccino Italiano', variant: 'Regular (8 oz)', quantity: 2, unitPrice: 180, totalPrice: 360 },
    ],
    subtotal: 1150,
    discount: 100,
    discountReason: 'Loyalty Club Promo',
    tax: 52.5,
    totalAmount: 1102.5,
    paymentMethod: 'UPI',
    paymentStatus: 'Success',
    orderStatus: 'Completed',
    saleNote: 'Patron requested extra napkins & sides.',
    paymentNote: 'UPI Ref UTR 429188201942',
  },
  {
    id: 'ORD-9841',
    timestamp: '13:45',
    date: '2026-09-20',
    customerName: 'Vikramaditya Shah',
    customerPhone: '+91 98250 11234',
    cashierName: 'Aarav Mehta',
    terminalId: 'POS-Ahmedabad-02',
    items: [
      { id: 'i4', name: 'Classic Margherita Pizza', variant: '12" Medium', quantity: 1, unitPrice: 480, totalPrice: 480 },
      { id: 'i5', name: 'Sparkling Natural Spring Water 750ml', quantity: 2, unitPrice: 95, totalPrice: 190 },
    ],
    subtotal: 670,
    discount: 0,
    tax: 33.5,
    totalAmount: 703.5,
    paymentMethod: 'Card',
    paymentStatus: 'Success',
    orderStatus: 'Completed',
    paymentNote: 'HDFC Card ending in 4219',
  },
  {
    id: 'ORD-9840',
    timestamp: '12:30',
    date: '2026-09-20',
    customerName: 'Rajesh Vora',
    customerPhone: '+91 98982 33410',
    cashierName: 'Rohan Patel',
    terminalId: 'POS-Ahmedabad-01',
    items: [
      { id: 'i6', name: 'Artisan Butter Croissant', quantity: 3, unitPrice: 120, totalPrice: 360 },
      { id: 'i7', name: 'Dark Chocolate Fudge Brownie', variant: 'Gift Box of 4', quantity: 1, unitPrice: 480, totalPrice: 480 },
    ],
    subtotal: 840,
    discount: 40,
    tax: 40.0,
    totalAmount: 840.0,
    paymentMethod: 'Cash',
    paymentStatus: 'Success',
    orderStatus: 'Completed',
    paymentNote: 'Cash tendered ₹1,000, change ₹160',
  },
  {
    id: 'ORD-9839',
    timestamp: '11:15',
    date: '2026-09-20',
    customerName: 'Meera Patel',
    customerPhone: '+91 99099 33211',
    cashierName: 'Priya Sharma',
    terminalId: 'POS-Ahmedabad-01',
    items: [
      { id: 'i8', name: 'Crispy Chicken Zinger Burger', quantity: 1, unitPrice: 240, totalPrice: 240 },
    ],
    subtotal: 240,
    discount: 0,
    tax: 12.0,
    totalAmount: 252.0,
    paymentMethod: 'UPI',
    paymentStatus: 'Refunded',
    orderStatus: 'Refunded',
    saleNote: 'Incorrect spice level delivered. Full refund given.',
  },
  {
    id: 'ORD-9838',
    timestamp: '10:45',
    date: '2026-09-20',
    customerName: 'Rohit Sharma',
    customerPhone: '+91 98240 77123',
    cashierName: 'Aarav Mehta',
    terminalId: 'POS-Ahmedabad-02',
    items: [
      { id: 'i9', name: 'Caramel Macchiato Blended', quantity: 2, unitPrice: 240, totalPrice: 480 },
    ],
    subtotal: 480,
    discount: 0,
    tax: 24.0,
    totalAmount: 504.0,
    paymentMethod: 'Card',
    paymentStatus: 'Failed',
    orderStatus: 'Cancelled',
    paymentNote: 'Card declined by issuing bank (insufficient funds)',
  },
  {
    id: 'ORD-9837',
    timestamp: '10:10',
    date: '2026-09-20',
    customerName: 'Pooja Bhatt',
    customerPhone: '+91 97129 44321',
    cashierName: 'Rohan Patel',
    terminalId: 'POS-Ahmedabad-01',
    items: [
      { id: 'i10', name: 'Classic Brioche Cheeseburger', quantity: 1, unitPrice: 220, totalPrice: 220 },
      { id: 'i11', name: 'Truffle Parmesan French Fries', variant: 'Regular', quantity: 1, unitPrice: 150, totalPrice: 150 },
    ],
    subtotal: 370,
    discount: 0,
    tax: 18.5,
    totalAmount: 388.5,
    paymentMethod: 'UPI',
    paymentStatus: 'Success',
    orderStatus: 'In Progress',
    saleNote: 'Kitchen ticket queued on station 2.',
  },
];

// Initial Sample Returns
const INITIAL_RETURNS: ReturnRecord[] = [
  {
    id: 'RET-104',
    orderId: 'ORD-9839',
    timestamp: '11:22',
    date: '2026-09-20',
    customerName: 'Meera Patel',
    returnedItems: [
      { name: 'Crispy Chicken Zinger Burger', quantity: 1, unitPrice: 240, refundTotal: 252 },
    ],
    refundAmount: 252,
    refundMethod: 'Original Payment',
    reason: 'Wrong Item Given',
    approvedBy: 'Priya Sharma (Shift Supervisor)',
    status: 'Refunded',
    notes: 'Cashier accidentally punched Extra Spicy instead of Mild.',
  },
  {
    id: 'RET-103',
    orderId: 'ORD-9812',
    timestamp: '17:40',
    date: '2026-09-19',
    customerName: 'Sunita Roy',
    returnedItems: [
      { name: 'Artisan Butter Croissant', quantity: 2, unitPrice: 120, refundTotal: 240 },
    ],
    refundAmount: 240,
    refundMethod: 'Cash',
    reason: 'Quality / Taste Issue',
    approvedBy: 'Rahul Patel (Store Manager)',
    status: 'Refunded',
    notes: 'Pastry was slightly over-toasted in salamander.',
  },
  {
    id: 'RET-102',
    orderId: 'ORD-9788',
    timestamp: '14:15',
    date: '2026-09-18',
    customerName: 'Karanvir Singhania',
    returnedItems: [
      { name: 'Sparkling Natural Spring Water 750ml', quantity: 1, unitPrice: 95, refundTotal: 95 },
    ],
    refundAmount: 95,
    refundMethod: 'Store Credit',
    reason: 'Customer Changed Mind',
    approvedBy: 'Rahul Patel (Store Manager)',
    status: 'Refunded',
    notes: 'Exchanged for Iced Cold Brew.',
  },
];

// Initial Sample Payments
const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'TXN-89210',
    orderId: 'ORD-9842',
    timestamp: '14:21',
    date: '2026-09-20',
    customerName: 'Ananya Deshmukh',
    method: 'UPI',
    amount: 1102.5,
    status: 'Success',
    gatewayRef: 'UPI-RAZOR-42918820',
    terminalId: 'POS-Ahmedabad-01',
    upiHandle: 'ananya@oksbi',
  },
  {
    id: 'TXN-89209',
    orderId: 'ORD-9841',
    timestamp: '13:46',
    date: '2026-09-20',
    customerName: 'Vikramaditya Shah',
    method: 'Card',
    amount: 703.5,
    status: 'Success',
    gatewayRef: 'PINELABS-CARD-90124',
    terminalId: 'POS-Ahmedabad-02',
    cardLast4: '4219',
  },
  {
    id: 'TXN-89208',
    orderId: 'ORD-9840',
    timestamp: '12:31',
    date: '2026-09-20',
    customerName: 'Rajesh Vora',
    method: 'Cash',
    amount: 840.0,
    tenderedAmount: 1000.0,
    changeGiven: 160.0,
    status: 'Success',
    terminalId: 'POS-Ahmedabad-01',
  },
  {
    id: 'TXN-89207',
    orderId: 'ORD-9839',
    timestamp: '11:16',
    date: '2026-09-20',
    customerName: 'Meera Patel',
    method: 'UPI',
    amount: 252.0,
    status: 'Refunded',
    gatewayRef: 'UPI-REF-992014',
    terminalId: 'POS-Ahmedabad-01',
    upiHandle: 'meera@okaxis',
  },
  {
    id: 'TXN-89206',
    orderId: 'ORD-9838',
    timestamp: '10:46',
    date: '2026-09-20',
    customerName: 'Rohit Sharma',
    method: 'Card',
    amount: 504.0,
    status: 'Failed',
    gatewayRef: 'PAYTM-FAIL-33109',
    terminalId: 'POS-Ahmedabad-02',
    cardLast4: '8814',
  },
  {
    id: 'TXN-89205',
    orderId: 'ORD-9837',
    timestamp: '10:11',
    date: '2026-09-20',
    customerName: 'Pooja Bhatt',
    method: 'UPI',
    amount: 388.5,
    status: 'Success',
    gatewayRef: 'UPI-BHIM-110482',
    terminalId: 'POS-Ahmedabad-01',
    upiHandle: 'pooja@paytm',
  },
];

export default function SalesManagement({
  activeSubTab = 'orders',
  onSelectSubTab,
  theme,
}: SalesManagementProps) {
  // Sync tab with sidebar prop
  const [currentTab, setCurrentTab] = useState<'orders' | 'returns' | 'payments'>(activeSubTab);

  useEffect(() => {
    if (activeSubTab) {
      setCurrentTab(activeSubTab);
    }
  }, [activeSubTab]);

  // Main State
  const [orders, setOrders] = useState<SalesOrder[]>(INITIAL_ORDERS);
  const [returns, setReturns] = useState<ReturnRecord[]>(INITIAL_RETURNS);
  const [payments, setPayments] = useState<PaymentTransaction[]>(INITIAL_PAYMENTS);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'Completed' | 'In Progress' | 'Refunded' | 'Cancelled'>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');

  // Modals state
  const [viewingOrder, setViewingOrder] = useState<SalesOrder | null>(null);
  const [viewingPayment, setViewingPayment] = useState<PaymentTransaction | null>(null);
  const [showProcessReturnModal, setShowProcessReturnModal] = useState(false);
  const [returnTargetOrder, setReturnTargetOrder] = useState<SalesOrder | null>(null);
  const [returnReasonSelect, setReturnReasonSelect] = useState<ReturnRecord['reason']>('Wrong Item Given');
  const [returnRefundMethod, setReturnRefundMethod] = useState<ReturnRecord['refundMethod']>('Original Payment');
  const [returnNotes, setReturnNotes] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = ord.id.toLowerCase().includes(q);
        const matchCust = ord.customerName.toLowerCase().includes(q);
        const matchPhone = ord.customerPhone?.toLowerCase().includes(q);
        const matchCashier = ord.cashierName.toLowerCase().includes(q);
        const matchItem = ord.items.some((i) => i.name.toLowerCase().includes(q));
        if (!matchId && !matchCust && !matchPhone && !matchCashier && !matchItem) return false;
      }
      if (orderStatusFilter !== 'all' && ord.orderStatus !== orderStatusFilter) return false;
      if (paymentMethodFilter !== 'all' && ord.paymentMethod !== paymentMethodFilter) return false;
      return true;
    });
  }, [orders, searchQuery, orderStatusFilter, paymentMethodFilter]);

  // Filtered Returns
  const filteredReturns = useMemo(() => {
    return returns.filter((ret) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = ret.id.toLowerCase().includes(q);
        const matchOrder = ret.orderId.toLowerCase().includes(q);
        const matchCust = ret.customerName.toLowerCase().includes(q);
        const matchReason = ret.reason.toLowerCase().includes(q);
        if (!matchId && !matchOrder && !matchCust && !matchReason) return false;
      }
      return true;
    });
  }, [returns, searchQuery]);

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((txn) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = txn.id.toLowerCase().includes(q);
        const matchOrder = txn.orderId.toLowerCase().includes(q);
        const matchCust = txn.customerName.toLowerCase().includes(q);
        const matchGateway = txn.gatewayRef?.toLowerCase().includes(q);
        if (!matchId && !matchOrder && !matchCust && !matchGateway) return false;
      }
      if (paymentMethodFilter !== 'all' && txn.method !== paymentMethodFilter) return false;
      if (paymentStatusFilter !== 'all' && txn.status !== paymentStatusFilter) return false;
      return true;
    });
  }, [payments, searchQuery, paymentMethodFilter, paymentStatusFilter]);

  // Top KPIs for Orders
  const totalOrdersCount = orders.length;
  const totalGrossRevenue = useMemo(() => orders.filter((o) => o.orderStatus === 'Completed').reduce((acc, o) => acc + o.totalAmount, 0), [orders]);
  const avgOrderValue = totalOrdersCount > 0 ? (totalGrossRevenue / orders.filter((o) => o.orderStatus === 'Completed').length || 1).toFixed(0) : 0;

  // Top KPIs for Returns
  const totalRefundAmount = useMemo(() => returns.reduce((acc, r) => acc + r.refundAmount, 0), [returns]);

  // Top KPIs for Payments
  const totalCollected = useMemo(() => payments.filter((p) => p.status === 'Success').reduce((acc, p) => acc + p.amount, 0), [payments]);
  const upiCollected = useMemo(() => payments.filter((p) => p.status === 'Success' && p.method === 'UPI').reduce((acc, p) => acc + p.amount, 0), [payments]);
  const cardCollected = useMemo(() => payments.filter((p) => p.status === 'Success' && p.method === 'Card').reduce((acc, p) => acc + p.amount, 0), [payments]);
  const cashCollected = useMemo(() => payments.filter((p) => p.status === 'Success' && p.method === 'Cash').reduce((acc, p) => acc + p.amount, 0), [payments]);
  const failedOrRefunded = useMemo(() => payments.filter((p) => p.status === 'Failed' || p.status === 'Refunded').reduce((acc, p) => acc + p.amount, 0), [payments]);

  // Open Return Modal from an order
  const handleInitiateReturn = (ord: SalesOrder) => {
    setReturnTargetOrder(ord);
    setReturnReasonSelect('Wrong Item Given');
    setReturnRefundMethod('Original Payment');
    setReturnNotes('');
    setShowProcessReturnModal(true);
  };

  // Submit Process Return
  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnTargetOrder) return;

    const newReturnRecord: ReturnRecord = {
      id: `RET-${Math.floor(100 + Math.random() * 900)}`,
      orderId: returnTargetOrder.id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      customerName: returnTargetOrder.customerName,
      returnedItems: returnTargetOrder.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        refundTotal: i.totalPrice,
      })),
      refundAmount: returnTargetOrder.totalAmount,
      refundMethod: returnRefundMethod,
      reason: returnReasonSelect,
      approvedBy: 'Rahul Patel (Store Manager)',
      status: 'Refunded',
      notes: returnNotes.trim() || 'Processed via Admin Sales Returns portal.',
    };

    // Update order status
    setOrders((prev) =>
      prev.map((o) => (o.id === returnTargetOrder.id ? { ...o, orderStatus: 'Refunded', paymentStatus: 'Refunded' } : o))
    );

    // Update payments list
    setPayments((prev) => [
      {
        id: `TXN-REF-${Math.floor(10000 + Math.random() * 90000)}`,
        orderId: returnTargetOrder.id,
        timestamp: newReturnRecord.timestamp,
        date: newReturnRecord.date,
        customerName: returnTargetOrder.customerName,
        method: returnTargetOrder.paymentMethod,
        amount: returnTargetOrder.totalAmount,
        status: 'Refunded',
        gatewayRef: `REFUND-${returnTargetOrder.id}`,
        terminalId: returnTargetOrder.terminalId,
      },
      ...prev,
    ]);

    setReturns((prev) => [newReturnRecord, ...prev]);
    setShowProcessReturnModal(false);
    setReturnTargetOrder(null);
    showToast(`Refund of ₹${newReturnRecord.refundAmount} issued for ${returnTargetOrder.id}.`);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#111827',
          color: '#F9FAFB',
          padding: '0.85rem 1.25rem',
          borderRadius: '0.85rem',
          boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          zIndex: 9999,
          fontSize: '13px',
          fontWeight: 700,
          border: '1px solid #374151',
          animation: 'fadeIn 0.2s ease',
        }}>
          <CheckCircleRoundedIcon sx={{ fontSize: 18, color: '#10B981' }} />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0 }}
          >
            <CloseRoundedIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      )}

      {/* Header Section: Title & Subtitle */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 800,
            color: theme.textPrimary,
            letterSpacing: '-0.035em',
            margin: '0 0 0.25rem 0',
          }}>
            {currentTab === 'orders' && 'Sales Orders Management'}
            {currentTab === 'returns' && 'Returns & Refunds Ledger'}
            {currentTab === 'payments' && 'Payments & Tender Transactions'}
          </h1>
          <p style={{
            fontSize: '13.5px',
            color: theme.textSecondary,
            margin: 0,
            fontWeight: 500,
          }}>
            {currentTab === 'orders' && 'Track live customer order tickets, line items, order statuses, discounts and print receipts.'}
            {currentTab === 'returns' && 'Review return requests, process customer refunds, and analyze return reason trends.'}
            {currentTab === 'payments' && 'Monitor Cash, UPI, and Card transactions, tender change, and failed or refunded payments.'}
          </p>
        </div>

        {/* Global Print / Refresh Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={() => window.print()}
            style={{
              height: '36px',
              padding: '0 0.95rem',
              borderRadius: '0.65rem',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.bgCard,
              color: theme.textPrimary,
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
            }}
          >
            <PrintRoundedIcon sx={{ fontSize: 16 }} />
            <span>Print Ledger</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. ORDERS VIEW                                                       */}
      {/* ==================================================================== */}
      {currentTab === 'orders' && (
        <>
          {/* Top KPI Card: Total Orders Only */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 340px))',
            gap: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            {/* Total Orders */}
            <div style={{
              backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: theme.sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Total Orders
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {totalOrdersCount}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  tickets rung
                </span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
            borderRadius: '0.85rem',
            padding: '0.65rem 0.85rem',
          }}>
            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: theme.bgPage,
              border: `1px solid ${theme.border}`,
              borderRadius: '0.6rem',
              padding: '0 0.75rem',
              height: '36px',
              minWidth: '260px',
              flex: 1,
              maxWidth: '380px',
            }}>
              <SearchRoundedIcon sx={{ fontSize: 17, color: theme.textSecondary }} />
              <input
                type="text"
                placeholder="Search Order ID, customer, phone, item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '13px',
                  color: theme.textPrimary,
                  width: '100%',
                  fontFamily: 'inherit',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 14, color: theme.textSecondary }} />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {/* Order Status Filter */}
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                style={{
                  height: '36px',
                  padding: '0 0.75rem',
                  borderRadius: '0.6rem',
                  backgroundColor: theme.bgPage,
                  border: `1px solid ${theme.border}`,
                  color: theme.textPrimary,
                  fontSize: '12.5px',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <option value="all">All Order Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Refunded">Refunded</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {/* Payment Method Filter */}
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                style={{
                  height: '36px',
                  padding: '0 0.75rem',
                  borderRadius: '0.6rem',
                  backgroundColor: theme.bgPage,
                  border: `1px solid ${theme.border}`,
                  color: theme.textPrimary,
                  fontSize: '12.5px',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <option value="all">All Payment Methods</option>
                <option value="UPI">UPI / QR Code</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Cash">Cash Tender</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: theme.tableHeaderBg, borderBottom: `1px solid ${theme.border}` }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Order ID
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Customer
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Total
                  </th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'right' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '3rem 1rem', textAlign: 'center', color: theme.textSecondary }}>
                      No orders match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord, idx) => (
                    <tr
                      key={ord.id}
                      onClick={() => setViewingOrder(ord)}
                      style={{
                        borderBottom: idx < filteredOrders.length - 1 ? `1px solid ${theme.border}` : 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.tableRowHover; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {/* Order ID */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: theme.textPrimary, fontFamily: 'monospace', fontSize: '13.5px' }}>
                          {ord.id}
                        </div>
                        <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '2px' }}>
                          {ord.date} • {ord.timestamp}
                        </div>
                      </td>

                      {/* Customer */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: theme.textPrimary }}>
                          {ord.customerName}
                        </div>
                        <div style={{ fontSize: '11px', color: theme.textSecondary }}>
                          {ord.customerPhone || 'Counter Walk-in'}
                        </div>
                      </td>

                      {/* Total */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: theme.textPrimary, fontSize: '14px' }}>
                          ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </div>
                        {ord.discount > 0 && (
                          <div style={{ fontSize: '10.5px', color: '#166534', fontWeight: 700 }}>
                            -₹{ord.discount} off
                          </div>
                        )}
                      </td>

                      {/* Status (in last) */}
                      <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 9px',
                          borderRadius: '9999px',
                          backgroundColor:
                            ord.orderStatus === 'Completed' ? '#DCFCE7' :
                            ord.orderStatus === 'In Progress' ? '#FEF3C7' :
                            ord.orderStatus === 'Refunded' ? '#FEE2E2' : '#F3F4F6',
                          color:
                            ord.orderStatus === 'Completed' ? '#166534' :
                            ord.orderStatus === 'In Progress' ? '#92400E' :
                            ord.orderStatus === 'Refunded' ? '#991B1B' : '#4B5563',
                        }}>
                          <span style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            backgroundColor:
                              ord.orderStatus === 'Completed' ? '#16A34A' :
                              ord.orderStatus === 'In Progress' ? '#D97706' :
                              ord.orderStatus === 'Refunded' ? '#DC2626' : '#6B7280',
                          }} />
                          <span>{ord.orderStatus.toUpperCase()}</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 2. RETURNS VIEW                                                      */}
      {/* ==================================================================== */}
      {currentTab === 'returns' && (
        <>
          {/* Top KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            {/* Returns Count */}
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Returns Rung
                </span>
                <AssignmentReturnRoundedIcon sx={{ fontSize: 18, color: '#DC2626' }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.04em' }}>
                  {returns.length}
                </span>
                <span style={{ fontSize: '12px', color: theme.textSecondary, marginLeft: '0.35rem', fontWeight: 600 }}>
                  return tickets
                </span>
              </div>
            </div>

            {/* Total Refund Value */}
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Refund Capital
                </span>
                <AttachMoneyRoundedIcon sx={{ fontSize: 18, color: '#DC2626' }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: '#991B1B', letterSpacing: '-0.04em' }}>
                  ₹{totalRefundAmount.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '12px', color: '#B91C1C', marginLeft: '0.35rem', fontWeight: 700 }}>
                  disbursed back
                </span>
              </div>
            </div>

            {/* Return Rate % */}
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Store Return Rate
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#166534', backgroundColor: '#DCFCE7', padding: '2px 7px', borderRadius: '9999px' }}>
                  Healthy &lt; 2%
                </span>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.04em' }}>
                  1.4%
                </span>
                <span style={{ fontSize: '12px', color: theme.textSecondary, marginLeft: '0.35rem', fontWeight: 600 }}>
                  of gross transactions
                </span>
              </div>
            </div>

            {/* Primary Reason */}
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Top Return Reason
                </span>
                <WarningAmberRoundedIcon sx={{ fontSize: 18, color: '#D97706' }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary }}>
                  Wrong Item Given
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '2px' }}>
                  48% of refund instances
                </div>
              </div>
            </div>
          </div>

          {/* Return Reasons Breakdown Progress Cards */}
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
            borderRadius: '1.25rem',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 0.85rem 0' }}>
              Return Reason Categorization & Frequency
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {[
                { reason: 'Wrong Item Given', count: 4, percent: 45, color: '#EF4444' },
                { reason: 'Quality / Taste Issue', count: 2, percent: 25, color: '#F59E0B' },
                { reason: 'Customer Changed Mind', count: 2, percent: 20, color: '#3B82F6' },
                { reason: 'Kitchen Cancellation', count: 1, percent: 10, color: '#10B981' },
              ].map((r) => (
                <div key={r.reason} style={{ padding: '0.75rem 0.9rem', backgroundColor: theme.hoverBg, borderRadius: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>
                    <span style={{ color: theme.textPrimary }}>{r.reason}</span>
                    <span style={{ color: theme.textSecondary }}>{r.count} tickets ({r.percent}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', backgroundColor: theme.border, borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${r.percent}%`, height: '100%', backgroundColor: r.color, borderRadius: '9999px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Returns Ledger Table */}
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: theme.tableHeaderBg, borderBottom: `1px solid ${theme.border}` }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>
                    Return ID & Date
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>
                    Order ID
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>
                    Customer
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>
                    Returned Items
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>
                    Refund Total
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>
                    Reason
                  </th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>
                    Authorized By
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReturns.map((ret, idx) => (
                  <tr
                    key={ret.id}
                    style={{
                      borderBottom: idx < filteredReturns.length - 1 ? `1px solid ${theme.border}` : 'none',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.tableRowHover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 800, color: '#DC2626', fontFamily: 'monospace' }}>
                        {ret.id}
                      </div>
                      <div style={{ fontSize: '11.5px', color: theme.textSecondary }}>
                        {ret.date} • {ret.timestamp}
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: theme.textPrimary }}>
                      {ret.orderId}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: theme.textPrimary }}>
                      {ret.customerName}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', fontSize: '12px', color: theme.textPrimary }}>
                      {ret.returnedItems.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 800, color: '#991B1B', fontSize: '13.5px' }}>
                        ₹{ret.refundAmount.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '10.5px', color: theme.textSecondary }}>
                        via {ret.refundMethod}
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        backgroundColor: '#FEE2E2',
                        color: '#991B1B',
                        padding: '2px 8px',
                        borderRadius: '0.35rem',
                      }}>
                        {ret.reason}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right', fontSize: '12px', color: theme.textSecondary }}>
                      {ret.approvedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 3. PAYMENTS VIEW                                                     */}
      {/* ==================================================================== */}
      {currentTab === 'payments' && (
        <>
          {/* Top KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            {/* Total Collected */}
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Collected
                </span>
                <PaymentsRoundedIcon sx={{ fontSize: 18, color: '#10B981' }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: '#166534', letterSpacing: '-0.04em' }}>
                  ₹{totalCollected.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '12px', color: '#15803D', marginLeft: '0.35rem', fontWeight: 700 }}>
                  reconciled
                </span>
              </div>
            </div>

            {/* UPI Payments */}
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  UPI / QR Payments
                </span>
                <QrCodeRoundedIcon sx={{ fontSize: 18, color: '#3B82F6' }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  ₹{upiCollected.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '12px', color: theme.textSecondary, marginLeft: '0.35rem', fontWeight: 600 }}>
                  instant settling
                </span>
              </div>
            </div>

            {/* Card Payments */}
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Card Payments
                </span>
                <CreditCardRoundedIcon sx={{ fontSize: 18, color: '#6366F1' }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  ₹{cardCollected.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '12px', color: theme.textSecondary, marginLeft: '0.35rem', fontWeight: 600 }}>
                  POS terminal
                </span>
              </div>
            </div>

            {/* Cash Payments */}
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Cash Tendered
                </span>
                <AttachMoneyRoundedIcon sx={{ fontSize: 18, color: '#F59E0B' }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  ₹{cashCollected.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '12px', color: theme.textSecondary, marginLeft: '0.35rem', fontWeight: 600 }}>
                  in register till
                </span>
              </div>
            </div>

            {/* Failed / Refunded */}
            <div style={{
              backgroundColor: failedOrRefunded > 0 ? '#FEF2F2' : theme.bgCard,
              border: `1px solid ${failedOrRefunded > 0 ? '#FECACA' : theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: failedOrRefunded > 0 ? '#991B1B' : theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Failed / Refunded
                </span>
                <CancelRoundedIcon sx={{ fontSize: 18, color: failedOrRefunded > 0 ? '#DC2626' : theme.textSecondary }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: failedOrRefunded > 0 ? '#991B1B' : theme.textPrimary, letterSpacing: '-0.03em' }}>
                  ₹{failedOrRefunded.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '12px', color: theme.textSecondary, marginLeft: '0.35rem', fontWeight: 600 }}>
                  voided / returned
                </span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
            borderRadius: '0.85rem',
            padding: '0.65rem 0.85rem',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: theme.bgPage,
              border: `1px solid ${theme.border}`,
              borderRadius: '0.6rem',
              padding: '0 0.75rem',
              height: '36px',
              minWidth: '260px',
              flex: 1,
              maxWidth: '380px',
            }}>
              <SearchRoundedIcon sx={{ fontSize: 17, color: theme.textSecondary }} />
              <input
                type="text"
                placeholder="Search Txn Ref, Order ID, customer, UTR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '13px',
                  color: theme.textPrimary,
                  width: '100%',
                  fontFamily: 'inherit',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 14, color: theme.textSecondary }} />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                style={{
                  height: '36px',
                  padding: '0 0.75rem',
                  borderRadius: '0.6rem',
                  backgroundColor: theme.bgPage,
                  border: `1px solid ${theme.border}`,
                  color: theme.textPrimary,
                  fontSize: '12.5px',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <option value="all">All Payment Modes</option>
                <option value="UPI">UPI / QR Code</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Cash">Cash in Drawer</option>
              </select>

              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                style={{
                  height: '36px',
                  padding: '0 0.75rem',
                  borderRadius: '0.6rem',
                  backgroundColor: theme.bgPage,
                  border: `1px solid ${theme.border}`,
                  color: theme.textPrimary,
                  fontSize: '12.5px',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <option value="all">All Payment Statuses</option>
                <option value="Success">Successful (Captured)</option>
                <option value="Failed">Failed (Declined)</option>
                <option value="Refunded">Refunded (Reversed)</option>
              </select>
            </div>
          </div>

          {/* Payments Table */}
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: theme.tableHeaderBg, borderBottom: `1px solid ${theme.border}` }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>
                    Transaction Ref
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>
                    Order ID
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>
                    Customer
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>
                    Tender Mode
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>
                    Amount (₹)
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase', textAlign: 'center' }}>
                    Status
                  </th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((txn, idx) => (
                  <tr
                    key={txn.id}
                    style={{
                      borderBottom: idx < filteredPayments.length - 1 ? `1px solid ${theme.border}` : 'none',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.tableRowHover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 800, color: theme.textPrimary, fontFamily: 'monospace' }}>
                        {txn.id}
                      </div>
                      <div style={{ fontSize: '11px', color: theme.textSecondary }}>
                        {txn.date} • {txn.timestamp}
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: theme.textPrimary }}>
                      {txn.orderId}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: theme.textPrimary }}>
                      {txn.customerName}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        backgroundColor: theme.hoverBg,
                        padding: '3px 8px',
                        borderRadius: '0.4rem',
                        border: `1px solid ${theme.border}`,
                      }}>
                        {txn.method === 'UPI' && <QrCodeRoundedIcon sx={{ fontSize: 13 }} />}
                        {txn.method === 'Card' && <CreditCardRoundedIcon sx={{ fontSize: 13 }} />}
                        {txn.method === 'Cash' && <AttachMoneyRoundedIcon sx={{ fontSize: 13 }} />}
                        <span>{txn.method}</span>
                      </span>
                      {txn.cardLast4 && (
                        <span style={{ fontSize: '11px', color: theme.textSecondary, marginLeft: '0.35rem' }}>
                          •••• {txn.cardLast4}
                        </span>
                      )}
                      {txn.upiHandle && (
                        <span style={{ fontSize: '11px', color: theme.textSecondary, marginLeft: '0.35rem' }}>
                          ({txn.upiHandle})
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 800, color: theme.textPrimary, fontSize: '14px' }}>
                        ₹{txn.amount.toLocaleString('en-IN')}
                      </div>
                      {txn.changeGiven !== undefined && txn.changeGiven > 0 && (
                        <div style={{ fontSize: '10.5px', color: theme.textSecondary }}>
                          Tendered: ₹{txn.tenderedAmount} (Change: ₹{txn.changeGiven})
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 9px',
                        borderRadius: '9999px',
                        backgroundColor:
                          txn.status === 'Success' ? '#DCFCE7' :
                          txn.status === 'Refunded' ? '#FEF3C7' : '#FEE2E2',
                        color:
                          txn.status === 'Success' ? '#166534' :
                          txn.status === 'Refunded' ? '#92400E' : '#991B1B',
                      }}>
                        <span style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor:
                            txn.status === 'Success' ? '#16A34A' :
                            txn.status === 'Refunded' ? '#D97706' : '#DC2626',
                        }} />
                        <span>{txn.status.toUpperCase()}</span>
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => setViewingPayment(txn)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '0.45rem',
                          border: `1px solid ${theme.border}`,
                          backgroundColor: theme.hoverBg,
                          color: theme.textPrimary,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '11.5px',
                          fontWeight: 700,
                        }}
                      >
                        <VisibilityRoundedIcon sx={{ fontSize: 13 }} />
                        <span>Audit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: ORDER DETAILS / RECEIPT DRAWER                              */}
      {/* ==================================================================== */}
      {viewingOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: theme.bgPage,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '520px',
            maxHeight: '90vh',
            boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: `1px solid ${theme.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: theme.bgCard,
            }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 2px 0', color: theme.textPrimary }}>
                  Order Details: {viewingOrder.id}
                </h3>
                <div style={{ fontSize: '12px', color: theme.textSecondary }}>
                  {viewingOrder.date} at {viewingOrder.timestamp} • {viewingOrder.terminalId}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            {/* Modal Body / Digital Receipt */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Customer & Cashier Pill */}
              <div style={{
                backgroundColor: theme.bgCard,
                border: `1px solid ${theme.border}`,
                borderRadius: '0.75rem',
                padding: '0.85rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12.5px',
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: theme.textSecondary, fontWeight: 700, textTransform: 'uppercase' }}>Customer</div>
                  <div style={{ fontWeight: 800, color: theme.textPrimary, marginTop: '2px' }}>{viewingOrder.customerName}</div>
                  <div style={{ fontSize: '11.5px', color: theme.textSecondary }}>{viewingOrder.customerPhone || 'Counter Guest'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: theme.textSecondary, fontWeight: 700, textTransform: 'uppercase' }}>Cashier Staff</div>
                  <div style={{ fontWeight: 800, color: theme.textPrimary, marginTop: '2px' }}>{viewingOrder.cashierName}</div>
                  <div style={{ fontSize: '11.5px', color: theme.textSecondary }}>Terminal #1</div>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                  Purchased Items
                </div>
                <div style={{ border: `1px solid ${theme.border}`, borderRadius: '0.75rem', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                    <thead>
                      <tr style={{ backgroundColor: theme.hoverBg, borderBottom: `1px solid ${theme.border}` }}>
                        <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 700, color: theme.textSecondary }}>Item</th>
                        <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center', fontWeight: 700, color: theme.textSecondary }}>Qty</th>
                        <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 700, color: theme.textSecondary }}>Price</th>
                        <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 700, color: theme.textSecondary }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingOrder.items.map((item) => (
                        <tr key={item.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                          <td style={{ padding: '0.65rem 0.75rem' }}>
                            <div style={{ fontWeight: 800, color: theme.textPrimary }}>{item.name}</div>
                            {item.variant && (
                              <div style={{ fontSize: '11px', color: theme.textSecondary }}>{item.variant}</div>
                            )}
                          </td>
                          <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center', fontWeight: 700 }}>
                            {item.quantity}
                          </td>
                          <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', color: theme.textSecondary }}>
                            ₹{item.unitPrice}
                          </td>
                          <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 800, color: theme.textPrimary }}>
                            ₹{item.totalPrice}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Calculation Summary */}
              <div style={{
                backgroundColor: theme.bgCard,
                border: `1px solid ${theme.border}`,
                borderRadius: '0.75rem',
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
                fontSize: '13px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: theme.textSecondary }}>
                  <span>Subtotal</span>
                  <span>₹{viewingOrder.subtotal.toFixed(2)}</span>
                </div>
                {viewingOrder.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#166534', fontWeight: 700 }}>
                    <span>Discount ({viewingOrder.discountReason || 'Promo'})</span>
                    <span>-₹{viewingOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: theme.textSecondary }}>
                  <span>GST (CGST + SGST)</span>
                  <span>+₹{viewingOrder.tax.toFixed(2)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 800,
                  fontSize: '16px',
                  color: theme.textPrimary,
                  borderTop: `1px solid ${theme.border}`,
                  paddingTop: '0.5rem',
                  marginTop: '0.2rem',
                }}>
                  <span>Total Paid</span>
                  <span>₹{viewingOrder.totalAmount.toFixed(2)}</span>
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '2px' }}>
                  Paid via <strong>{viewingOrder.paymentMethod}</strong> • Status: <strong>{viewingOrder.paymentStatus}</strong>
                </div>
              </div>

              {/* Notes */}
              {(viewingOrder.saleNote || viewingOrder.paymentNote) && (
                <div style={{ fontSize: '12px', color: theme.textSecondary, backgroundColor: theme.hoverBg, padding: '0.65rem 0.85rem', borderRadius: '0.55rem' }}>
                  {viewingOrder.saleNote && <div><strong>Note:</strong> {viewingOrder.saleNote}</div>}
                  {viewingOrder.paymentNote && <div style={{ marginTop: '2px' }}><strong>Payment Memo:</strong> {viewingOrder.paymentNote}</div>}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: `1px solid ${theme.border}`,
              backgroundColor: theme.bgCard,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                {viewingOrder.orderStatus === 'Completed' && (
                  <button
                    type="button"
                    onClick={() => {
                      const ord = viewingOrder;
                      setViewingOrder(null);
                      handleInitiateReturn(ord);
                    }}
                    style={{
                      padding: '0.5rem 0.85rem',
                      borderRadius: '0.55rem',
                      border: '1px solid #FECACA',
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Initiate Refund / Return
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.hoverBg,
                    color: theme.textPrimary,
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <PrintRoundedIcon sx={{ fontSize: 16 }} />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingOrder(null)}
                  style={{
                    padding: '0.55rem 1.15rem',
                    borderRadius: '0.55rem',
                    border: 'none',
                    backgroundColor: theme.activeBg,
                    color: theme.activeText,
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: PROCESS RETURN / REFUND MODAL                              */}
      {/* ==================================================================== */}
      {showProcessReturnModal && returnTargetOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: theme.bgPage,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '500px',
            padding: '1.5rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#DC2626', margin: 0 }}>
                  Process Order Return & Refund
                </h3>
                <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '2px' }}>
                  Target Order: <strong>{returnTargetOrder.id}</strong> • {returnTargetOrder.customerName}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProcessReturnModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSubmitReturn} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Order Items to Return */}
              <div style={{
                backgroundColor: theme.bgCard,
                border: `1px solid ${theme.border}`,
                borderRadius: '0.75rem',
                padding: '0.75rem',
                fontSize: '12px',
              }}>
                <div style={{ fontWeight: 700, color: theme.textSecondary, marginBottom: '0.4rem' }}>
                  Items Being Refunded (Full Ticket):
                </div>
                {returnTargetOrder.items.map((it) => (
                  <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                    <span style={{ fontWeight: 700, color: theme.textPrimary }}>{it.quantity}x {it.name}</span>
                    <span style={{ color: theme.textSecondary }}>₹{it.totalPrice}</span>
                  </div>
                ))}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: `1px solid ${theme.border}`,
                  paddingTop: '0.4rem',
                  marginTop: '0.4rem',
                  fontWeight: 800,
                  fontSize: '13px',
                }}>
                  <span>Total Refund Amount:</span>
                  <span style={{ color: '#DC2626' }}>₹{returnTargetOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                  Return Reason *
                </label>
                <select
                  value={returnReasonSelect}
                  onChange={(e) => setReturnReasonSelect(e.target.value as any)}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 0.85rem',
                    borderRadius: '0.6rem',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    fontWeight: 700,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="Wrong Item Given">Wrong Item Given by Kitchen / Cashier</option>
                  <option value="Quality / Taste Issue">Quality / Food Preparation Issue</option>
                  <option value="Customer Changed Mind">Customer Changed Mind / Refused</option>
                  <option value="Defective Packaging">Defective Packaging / Spillage</option>
                  <option value="Kitchen Cancellation">Kitchen Out of Stock / Cancelled</option>
                </select>
              </div>

              {/* Refund Method */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                  Refund Payout Method *
                </label>
                <select
                  value={returnRefundMethod}
                  onChange={(e) => setReturnRefundMethod(e.target.value as any)}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 0.85rem',
                    borderRadius: '0.6rem',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    fontWeight: 700,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="Original Payment">Original Payment Method ({returnTargetOrder.paymentMethod})</option>
                  <option value="Cash">Cash Payout at Counter</option>
                  <option value="Store Credit">Store Credit Voucher</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                  Manager Authorization Notes
                </label>
                <textarea
                  rows={2}
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  placeholder="Optional notes regarding reason, customer feedback, or cashier mistake..."
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '0.6rem',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    fontSize: '12.5px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowProcessReturnModal(false)}
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
                  type="submit"
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
                  Authorize Refund (₹{returnTargetOrder.totalAmount})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: PAYMENT TRANSACTION AUDIT MODAL                             */}
      {/* ==================================================================== */}
      {viewingPayment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: theme.bgPage,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '440px',
            padding: '1.5rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Payment Audit Metadata
                </h3>
                <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '2px' }}>
                  Ref: <strong style={{ fontFamily: 'monospace' }}>{viewingPayment.id}</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingPayment(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ color: theme.textSecondary }}>Order Reference</span>
                <span style={{ fontWeight: 800, fontFamily: 'monospace' }}>{viewingPayment.orderId}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ color: theme.textSecondary }}>Customer</span>
                <span style={{ fontWeight: 700 }}>{viewingPayment.customerName}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ color: theme.textSecondary }}>Tender Method</span>
                <span style={{ fontWeight: 700 }}>{viewingPayment.method}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ color: theme.textSecondary }}>Amount Settled</span>
                <span style={{ fontWeight: 800, fontSize: '15px' }}>₹{viewingPayment.amount.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ color: theme.textSecondary }}>Gateway / UTR</span>
                <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{viewingPayment.gatewayRef || 'Manual Till Record'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ color: theme.textSecondary }}>POS Register Terminal</span>
                <span>{viewingPayment.terminalId}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0' }}>
                <span style={{ color: theme.textSecondary }}>Payment Status</span>
                <span style={{
                  fontWeight: 800,
                  color: viewingPayment.status === 'Success' ? '#166534' : '#DC2626',
                }}>
                  {viewingPayment.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setViewingPayment(null)}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '0.55rem',
                  border: 'none',
                  backgroundColor: theme.activeBg,
                  color: theme.activeText,
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
