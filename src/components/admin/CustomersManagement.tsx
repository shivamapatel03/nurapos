'use client';

import React, { useState, useMemo } from 'react';

// Material Rounded Icons
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import LoyaltyRoundedIcon from '@mui/icons-material/LoyaltyRounded';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';

// ============================================================================
// DATA STRUCTURES
// ============================================================================
export interface CustomerOrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CustomerOrderRecord {
  id: string; // e.g. ORD-9842
  date: string;
  time: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: CustomerOrderItem[];
  totalAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'Cash' | 'Wallet';
  loyaltyPointsEarned: number;
  status: 'Completed' | 'Refunded';
}

export interface Customer {
  id: string; // e.g. CUST-101
  name: string;
  phone: string;
  email: string;
  group: 'VIP Elite' | 'Store Regulars' | 'New Patrons' | 'At-Risk';
  loyaltyTier: 'Platinum VIP' | 'Gold' | 'Silver' | 'Bronze';
  totalOrders: number;
  lifetimeSpend: number;
  pointsBalance: number;
  lastVisit: string;
  joinedDate: string;
  favoriteItem: string;
  notes?: string;
  birthday?: string;
  avatarColor: string;
}

export interface LoyaltyRewardVoucher {
  id: string;
  title: string;
  pointsCost: number;
  description: string;
  category: 'Discount' | 'Complimentary' | 'VIP Experience';
  minOrderValue?: number;
}

export interface CustomerFeedbackRecord {
  id: string; // e.g. REV-501
  customerId: string;
  customerName: string;
  customerPhone: string;
  rating: number; // 1 to 5
  date: string;
  orderId: string;
  category: 'Food Quality' | 'Service Speed' | 'Ambiance' | 'Order Accuracy';
  comment: string;
  status: 'Published' | 'Action Required' | 'Resolved';
  resolutionNotes?: string;
}

export interface CustomersManagementProps {
  activeSubTab?: 'cust_all' | 'cust_history' | 'cust_feedback';
  onSelectSubTab?: (tab: 'cust_all' | 'cust_history' | 'cust_feedback') => void;
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
  };
}

// ============================================================================
// INITIAL SAMPLE DATA
// ============================================================================
const INITIAL_CUSTOMERS: Customer[] = [];

const INITIAL_ORDERS: CustomerOrderRecord[] = [];

const REWARD_VOUCHERS: LoyaltyRewardVoucher[] = [
  {
    id: 'VOUCH-01',
    title: 'Flat ₹100 Off Bill',
    pointsCost: 200,
    description: 'Instant deduction applied at checkout counter on tickets above ₹500.',
    category: 'Discount',
    minOrderValue: 500,
  },
  {
    id: 'VOUCH-02',
    title: 'Complimentary Artisan Cappuccino',
    pointsCost: 350,
    description: 'Freshly brewed single origin Arabica coffee (Regular 8oz).',
    category: 'Complimentary',
  },
  {
    id: 'VOUCH-03',
    title: 'Free Truffle Fries Upgrade',
    pointsCost: 250,
    description: 'Upgrade any classic french fries to Truffle Parmesan seasoning.',
    category: 'Complimentary',
    minOrderValue: 400,
  },
  {
    id: 'VOUCH-04',
    title: 'Flat 20% Off Weekend Feast',
    pointsCost: 600,
    description: 'Exclusive 20% total bill discount on Saturday & Sunday orders.',
    category: 'VIP Experience',
    minOrderValue: 1200,
  },
];

const INITIAL_FEEDBACK: CustomerFeedbackRecord[] = [];

export default function CustomersManagement({
  activeSubTab = 'cust_all',
  onSelectSubTab,
  theme,
}: CustomersManagementProps) {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<'cust_all' | 'cust_history' | 'cust_feedback'>(activeSubTab);

  React.useEffect(() => {
    if (activeSubTab) {
      setCurrentTab(activeSubTab);
    }
  }, [activeSubTab]);

  // Customers State
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [customerSearch, setCustomerSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('ALL');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  // Add Customer Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustGroup, setNewCustGroup] = useState<Customer['group']>('New Patrons');
  const [newCustBirthday, setNewCustBirthday] = useState('');
  const [newCustNotes, setNewCustNotes] = useState('');

  // Orders State
  const [orders] = useState<CustomerOrderRecord[]>(INITIAL_ORDERS);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('ALL');
  const [viewingReceiptOrder, setViewingReceiptOrder] = useState<CustomerOrderRecord | null>(null);

  // Points Adjustment State
  const [adjustPointsCustomer, setAdjustPointsCustomer] = useState<Customer | null>(null);
  const [pointsDelta, setPointsDelta] = useState<number>(100);
  const [pointsReason, setPointsReason] = useState('Loyalty Promotional Reward');
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Feedback State
  const [feedbacks, setFeedbacks] = useState<CustomerFeedbackRecord[]>(INITIAL_FEEDBACK);
  const [resolvingFeedback, setResolvingFeedback] = useState<CustomerFeedbackRecord | null>(null);
  const [resolutionActionText, setResolutionActionText] = useState('Offered ₹100 apology voucher and SMS apology.');

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.phone.includes(customerSearch) ||
        c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.id.toLowerCase().includes(customerSearch.toLowerCase());

      const matchGroup = groupFilter === 'ALL' || c.group === groupFilter;
      const matchTier = tierFilter === 'ALL' || c.loyaltyTier === tierFilter;

      return matchSearch && matchGroup && matchTier;
    });
  }, [customers, customerSearch, groupFilter, tierFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerPhone.includes(orderSearch);

      const matchPayment = orderPaymentFilter === 'ALL' || o.paymentMethod === orderPaymentFilter;

      return matchSearch && matchPayment;
    });
  }, [orders, orderSearch, orderPaymentFilter]);

  // Handle Add Customer
  const handleSaveNewCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) return;

    const newId = `CUST-${100 + customers.length + 1}`;
    const newCust: Customer = {
      id: newId,
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      email: newCustEmail.trim() || `${newCustName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      group: newCustGroup,
      loyaltyTier: 'Bronze',
      totalOrders: 1,
      lifetimeSpend: 0,
      pointsBalance: 50, // Welcome points
      lastVisit: 'Today (New)',
      joinedDate: '2026-09-20',
      favoriteItem: 'Pending first order',
      notes: newCustNotes.trim() || undefined,
      birthday: newCustBirthday.trim() || undefined,
      avatarColor: '#1E293B',
    };

    setCustomers((prev) => [newCust, ...prev]);
    setToastNotice(`Customer ${newCust.name} added with 50 Welcome Loyalty Points.`);
    setTimeout(() => setToastNotice(null), 3500);

    setNewCustName('');
    setNewCustPhone('');
    setNewCustEmail('');
    setNewCustBirthday('');
    setNewCustNotes('');
    setShowAddCustomerModal(false);
  };

  // Handle Adjust Points
  const handleConfirmPointsAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustPointsCustomer) return;

    setCustomers((prev) =>
      prev.map((c) =>
        c.id === adjustPointsCustomer.id
          ? { ...c, pointsBalance: Math.max(0, c.pointsBalance + pointsDelta) }
          : c
      )
    );

    setToastNotice(`Adjusted ${pointsDelta >= 0 ? `+${pointsDelta}` : pointsDelta} points for ${adjustPointsCustomer.name}.`);
    setTimeout(() => setToastNotice(null), 3500);
    setAdjustPointsCustomer(null);
  };

  // Handle Resolve Feedback
  const handleConfirmResolveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingFeedback) return;

    setFeedbacks((prev) =>
      prev.map((f) =>
        f.id === resolvingFeedback.id
          ? { ...f, status: 'Resolved', resolutionNotes: resolutionActionText }
          : f
      )
    );

    setToastNotice(`Complaint ${resolvingFeedback.id} marked as Resolved.`);
    setTimeout(() => setToastNotice(null), 3500);
    setResolvingFeedback(null);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', color: theme.textPrimary }}>
      {/* Toast Notice Banner */}
      {toastNotice && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.85rem 1.25rem',
          borderRadius: '0.75rem',
          backgroundColor: '#064E3B',
          color: '#ECFDF5',
          border: '1px solid #059669',
          marginBottom: '1.25rem',
          fontSize: '13.5px',
          fontWeight: 600,
        }}>
          <CheckCircleRoundedIcon sx={{ fontSize: 20, color: '#34D399' }} />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem',
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            margin: '0 0 0.35rem 0',
            color: theme.textPrimary,
          }}>
            Customers CRM
          </h1>
          <p style={{
            fontSize: '14px',
            color: theme.textSecondary,
            margin: 0,
            fontWeight: 500,
          }}>
            Patron profiles, purchase histories, and feedback reviews.
          </p>
        </div>

        {/* Global Action: Add Customer */}
        <button
          type="button"
          className="button-20"
          role="button"
          onClick={() => setShowAddCustomerModal(true)}
          style={{
            height: '38px',
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: 'inherit',
          }}
        >
          <AddRoundedIcon sx={{ fontSize: 17 }} />
          <span>Add Customer</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 1. ALL CUSTOMERS DIRECTORY                                           */}
      {/* ==================================================================== */}
      {currentTab === 'cust_all' && (
        <>
          {/* Top 4 KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}>
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Total Customers
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {customers.length}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Registered patron base
                </span>
              </div>
            </div>

            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Active Loyalty Members
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: '#166534', letterSpacing: '-0.03em' }}>
                  {customers.filter(c => c.loyaltyTier !== 'Bronze').length}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  {customers.length > 0 ? `${((customers.filter(c => c.loyaltyTier !== 'Bronze').length / customers.length) * 100).toFixed(1)}% loyalty participation` : '0% loyalty participation'}
                </span>
              </div>
            </div>

            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Avg Lifetime Value
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {customers.length > 0 ? `₹${Math.round(customers.reduce((acc, c) => acc + c.lifetimeSpend, 0) / customers.length).toLocaleString('en-IN')}` : '₹0'}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Average spend per patron
                </span>
              </div>
            </div>

            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                VIP Club Patrons
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: '#B45309', letterSpacing: '-0.03em' }}>
                  {customers.filter(c => c.group.includes('VIP')).length}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Generating 0% of sales
                </span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1.25rem',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '0.65rem',
              padding: '0 0.85rem',
              height: '38px',
              minWidth: '280px',
              flex: '1 1 300px',
            }}>
              <SearchRoundedIcon sx={{ fontSize: 18, color: theme.textSecondary }} />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Search customers by name, phone, email, or ID..."
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: theme.textPrimary,
                  fontSize: '13px',
                  outline: 'none',
                  width: '100%',
                }}
              />
              {customerSearch && (
                <button
                  type="button"
                  onClick={() => setCustomerSearch('')}
                  style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: 0 }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 16 }} />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                style={{
                  height: '38px',
                  borderRadius: '0.65rem',
                  backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
                  color: theme.textPrimary,
                  border: `1px solid ${theme.border}`,
                  padding: '0 0.85rem',
                  fontSize: '13px',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="ALL">All Groups</option>
                <option value="VIP Elite">VIP Elite</option>
                <option value="Store Regulars">Store Regulars</option>
                <option value="New Patrons">New Patrons</option>
                <option value="At-Risk">At-Risk</option>
              </select>

              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                style={{
                  height: '38px',
                  borderRadius: '0.65rem',
                  backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
                  color: theme.textPrimary,
                  border: `1px solid ${theme.border}`,
                  padding: '0 0.85rem',
                  fontSize: '13px',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="ALL">All Tiers</option>
                <option value="Platinum VIP">Platinum VIP</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Bronze">Bronze</option>
              </select>
            </div>
          </div>

          {/* Customers Directory Table */}
          <div style={{
            backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            overflow: 'hidden',
            marginBottom: '1.75rem',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}`, textAlign: 'left', backgroundColor: theme.tableHeaderBg }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Customer</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Group & Tier</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Orders</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Lifetime Spend</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Loyalty Points</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Last Visit</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((c) => (
                    <tr
                      key={c.id}
                      style={{ borderBottom: `1px solid ${theme.border}`, transition: 'background-color 0.15s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.tableRowHover; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: c.avatarColor,
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '12px',
                            flexShrink: 0,
                          }}>
                            {c.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: theme.textPrimary }}>{c.name}</div>
                            <div style={{ fontSize: '11px', color: theme.textSecondary }}>{c.phone} • {c.id}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{
                            padding: '2px 7px',
                            borderRadius: '9999px',
                            fontSize: '11px',
                            fontWeight: 800,
                            backgroundColor:
                              c.group === 'VIP Elite' ? '#FEF3C7' :
                              c.group === 'Store Regulars' ? '#DBEAFE' :
                              c.group === 'New Patrons' ? '#DCFCE7' : '#FEE2E2',
                            color:
                              c.group === 'VIP Elite' ? '#92400E' :
                              c.group === 'Store Regulars' ? '#1E40AF' :
                              c.group === 'New Patrons' ? '#166534' : '#991B1B',
                          }}>
                            {c.group}
                          </span>
                          <span style={{ fontSize: '11.5px', color: theme.textSecondary, fontWeight: 700 }}>
                            {c.loyaltyTier}
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: theme.textPrimary }}>
                        {c.totalOrders} orders
                      </td>

                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#166534' }}>
                        ₹{c.lifetimeSpend.toLocaleString('en-IN')}
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontWeight: 800,
                          color: '#B45309',
                          backgroundColor: '#FEF3C7',
                          padding: '2px 7px',
                          borderRadius: '0.35rem',
                          fontSize: '12px',
                        }}>
                          <StarsRoundedIcon sx={{ fontSize: 14, color: '#F59E0B' }} />
                          {c.pointsBalance} pts
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', color: theme.textSecondary, fontSize: '12px', fontWeight: 600 }}>
                        {c.lastVisit}
                      </td>

                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            type="button"
                            className="button-20-secondary"
                            role="button"
                            onClick={() => setSelectedCustomer(c)}
                            title="View Customer Profile"
                            style={{
                              padding: '0 8px',
                              height: '28px',
                              fontSize: '12px',
                              fontWeight: 700,
                              fontFamily: 'inherit',
                            }}
                          >
                            <VisibilityRoundedIcon sx={{ fontSize: 14 }} />
                            <span>Profile</span>
                          </button>
                          <button
                            type="button"
                            className="button-20-secondary"
                            role="button"
                            onClick={() => setAdjustPointsCustomer(c)}
                            title="Adjust Loyalty Points"
                            style={{
                              padding: '0 8px',
                              height: '28px',
                              fontSize: '12px',
                              fontWeight: 700,
                              fontFamily: 'inherit',
                            }}
                          >
                            <LoyaltyRoundedIcon sx={{ fontSize: 14 }} />
                            <span>Points</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: theme.textSecondary }}>
                        No customers match the current filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 2. PURCHASE HISTORY                                                  */}
      {/* ==================================================================== */}
      {currentTab === 'cust_history' && (
        <>
          {/* Top 4 KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}>
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Total Orders Rung
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {orders.length}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Store orders processed
                </span>
              </div>
            </div>

            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Aggregate Spend
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: '#166534', letterSpacing: '-0.03em' }}>
                  ₹{orders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Cumulative gross spend
                </span>
              </div>
            </div>

            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Avg Basket Size
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {orders.length > 0 ? `${(orders.reduce((acc, o) => acc + o.items.reduce((ia, i) => ia + i.quantity, 0), 0) / orders.length).toFixed(1)} Items` : '0 Items'}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  {orders.length > 0 ? `₹${Math.round(orders.reduce((acc, o) => acc + o.totalAmount, 0) / orders.length).toLocaleString('en-IN')} average ticket` : '₹0 average ticket'}
                </span>
              </div>
            </div>

            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Repeat Spend Ratio
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: '#166534', letterSpacing: '-0.03em' }}>
                  0.0%
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Revenue from returning guests
                </span>
              </div>
            </div>
          </div>

          {/* Orders Search & Filter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1.25rem',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '0.65rem',
              padding: '0 0.85rem',
              height: '38px',
              minWidth: '280px',
              flex: '1 1 300px',
            }}>
              <SearchRoundedIcon sx={{ fontSize: 18, color: theme.textSecondary }} />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search orders by order ref, patron name, or phone..."
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: theme.textPrimary,
                  fontSize: '13px',
                  outline: 'none',
                  width: '100%',
                }}
              />
            </div>

            <select
              value={orderPaymentFilter}
              onChange={(e) => setOrderPaymentFilter(e.target.value)}
              style={{
                height: '38px',
                borderRadius: '0.65rem',
                backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
                color: theme.textPrimary,
                border: `1px solid ${theme.border}`,
                padding: '0 0.85rem',
                fontSize: '13px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Payment Methods</option>
              <option value="UPI">UPI / QR</option>
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          {/* Purchase History Ledger */}
          <div style={{
            backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            overflow: 'hidden',
            marginBottom: '1.75rem',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}`, textAlign: 'left', backgroundColor: theme.tableHeaderBg }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Order ID & Date</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Customer</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Items Summary</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Amount</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Tender</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Points</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: theme.textPrimary }}>{o.id}</div>
                        <div style={{ fontSize: '11px', color: theme.textSecondary }}>{o.date} • {o.time}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: theme.textPrimary }}>{o.customerName}</div>
                        <div style={{ fontSize: '11px', color: theme.textSecondary }}>{o.customerPhone}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: theme.textPrimary, fontWeight: 600 }}>
                        {o.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#166534' }}>
                        ₹{o.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: theme.textPrimary }}>
                        {o.paymentMethod}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontWeight: 800, color: '#166534' }}>
                          +{o.loyaltyPointsEarned} pts
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <button
                          type="button"
                          className="button-20-secondary"
                          role="button"
                          onClick={() => setViewingReceiptOrder(o)}
                          style={{
                            padding: '0 10px',
                            height: '28px',
                            fontSize: '12px',
                            fontWeight: 700,
                            fontFamily: 'inherit',
                          }}
                        >
                          <VisibilityRoundedIcon sx={{ fontSize: 14 }} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: theme.textSecondary }}>
                        No purchase orders recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 3. FEEDBACK & REVIEWS                                                */}
      {/* ==================================================================== */}
      {currentTab === 'cust_feedback' && (
        <>
          {/* Top KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}>
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Average Rating
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: '#B45309', letterSpacing: '-0.03em' }}>
                  {feedbacks.length > 0 ? `${(feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)} / 5.0` : '— / 5.0'}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Across {feedbacks.length} verified patron reviews
                </span>
              </div>
            </div>

            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Positive Sentiment
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: '#166534', letterSpacing: '-0.03em' }}>
                  {feedbacks.length > 0 ? `${((feedbacks.filter(f => f.rating >= 4).length / feedbacks.length) * 100).toFixed(1)}%` : '0.0%'}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  4-star and 5-star ratings
                </span>
              </div>
            </div>

            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Pending Complaints
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: '#991B1B', letterSpacing: '-0.03em' }}>
                  {feedbacks.filter(f => f.status === 'Action Required').length} {feedbacks.filter(f => f.status === 'Action Required').length === 1 ? 'Issue' : 'Issues'}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Requires supervisor resolution
                </span>
              </div>
            </div>

            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Avg Resolution Time
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: '#166534', letterSpacing: '-0.03em' }}>
                  0.0 hrs
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Customer issue recovery speed
                </span>
              </div>
            </div>
          </div>

          {/* Feedback Ledger */}
          <div style={{
            backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            overflow: 'hidden',
            marginBottom: '1.75rem',
          }}>
            <div style={{ padding: '1.25rem', borderBottom: `1px solid ${theme.border}` }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                Customer Ratings, Reviews & Service Recovery
              </h3>
              <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                Patron feedback logged via QR receipts and store feedback tablets.
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}`, textAlign: 'left', backgroundColor: theme.tableHeaderBg }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Customer & Ref</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Rating</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Category</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Feedback Comment</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((f) => (
                    <tr key={f.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: theme.textPrimary }}>{f.customerName}</div>
                        <div style={{ fontSize: '11px', color: theme.textSecondary }}>{f.orderId} • {f.date}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarRoundedIcon
                              key={star}
                              sx={{
                                fontSize: 16,
                                color: star <= f.rating ? '#F59E0B' : '#E5E7EB',
                              }}
                            />
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: theme.textPrimary }}>
                        {f.category}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: theme.textPrimary, maxWidth: '340px' }}>
                        &ldquo;{f.comment}&rdquo;
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          backgroundColor:
                            f.status === 'Published' ? '#DCFCE7' :
                            f.status === 'Resolved' ? '#DBEAFE' : '#FEE2E2',
                          color:
                            f.status === 'Published' ? '#166534' :
                            f.status === 'Resolved' ? '#1E40AF' : '#991B1B',
                        }}>
                          {f.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        {f.status === 'Action Required' && (
                          <button
                            type="button"
                            className="button-20"
                            role="button"
                            onClick={() => setResolvingFeedback(f)}
                            style={{
                              padding: '0 12px',
                              height: '28px',
                              fontSize: '12px',
                              fontWeight: 700,
                              fontFamily: 'inherit',
                            }}
                          >
                            Resolve
                          </button>
                        )}
                        {f.status === 'Resolved' && (
                          <span style={{ fontSize: '11.5px', color: '#10B981', fontWeight: 700 }}>
                            Compensated
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {feedbacks.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: theme.textSecondary }}>
                        No customer feedback recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: ADD CUSTOMER MODAL                                          */}
      {/* ==================================================================== */}
      {showAddCustomerModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '520px',
            padding: '1.75rem',
            boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Add New Customer
                </h3>
                <p style={{ fontSize: '12.5px', color: theme.textSecondary, margin: '3px 0 0 0' }}>
                  Register patron details for loyalty points and personalized orders.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCustomerModal(false)}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: '4px' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSaveNewCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. Tanvi Parekh"
                  style={{
                    width: '100%',
                    height: '38px',
                    borderRadius: '0.55rem',
                    backgroundColor: (theme as any).sidebarIsDark ? theme.hoverBg : '#F9FAFB',
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    padding: '0 0.85rem',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                    PHONE NUMBER *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    style={{
                      width: '100%',
                      height: '38px',
                      borderRadius: '0.55rem',
                      backgroundColor: (theme as any).sidebarIsDark ? theme.hoverBg : '#F9FAFB',
                      border: `1px solid ${theme.border}`,
                      color: theme.textPrimary,
                      padding: '0 0.85rem',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={newCustEmail}
                    onChange={(e) => setNewCustEmail(e.target.value)}
                    placeholder="tanvi.p@gmail.com"
                    style={{
                      width: '100%',
                      height: '38px',
                      borderRadius: '0.55rem',
                      backgroundColor: (theme as any).sidebarIsDark ? theme.hoverBg : '#F9FAFB',
                      border: `1px solid ${theme.border}`,
                      color: theme.textPrimary,
                      padding: '0 0.85rem',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                    CUSTOMER GROUP
                  </label>
                  <select
                    value={newCustGroup}
                    onChange={(e) => setNewCustGroup(e.target.value as any)}
                    style={{
                      width: '100%',
                      height: '38px',
                      borderRadius: '0.55rem',
                      backgroundColor: (theme as any).sidebarIsDark ? theme.hoverBg : '#F9FAFB',
                      border: `1px solid ${theme.border}`,
                      color: theme.textPrimary,
                      padding: '0 0.75rem',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="New Patrons">New Patrons</option>
                    <option value="Store Regulars">Store Regulars</option>
                    <option value="VIP Elite">VIP Elite</option>
                    <option value="At-Risk">At-Risk</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                    BIRTHDAY (OPTIONAL)
                  </label>
                  <input
                    type="date"
                    value={newCustBirthday}
                    onChange={(e) => setNewCustBirthday(e.target.value)}
                    style={{
                      width: '100%',
                      height: '38px',
                      borderRadius: '0.55rem',
                      backgroundColor: (theme as any).sidebarIsDark ? theme.hoverBg : '#F9FAFB',
                      border: `1px solid ${theme.border}`,
                      color: theme.textPrimary,
                      padding: '0 0.75rem',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                  CUSTOMER PREFERENCE NOTES
                </label>
                <textarea
                  rows={2}
                  value={newCustNotes}
                  onChange={(e) => setNewCustNotes(e.target.value)}
                  placeholder="e.g. Prefers almond milk, allergic to peanuts."
                  style={{
                    width: '100%',
                    borderRadius: '0.55rem',
                    backgroundColor: (theme as any).sidebarIsDark ? theme.hoverBg : '#F9FAFB',
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    padding: '0.65rem 0.85rem',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="button-20-secondary"
                  role="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  style={{
                    height: '38px',
                    fontSize: '13px',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button-20"
                  role="button"
                  style={{
                    height: '38px',
                    fontSize: '13px',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                  }}
                >
                  Register Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: CUSTOMER DETAILS PROFILE DRAWER / MODAL                     */}
      {/* ==================================================================== */}
      {selectedCustomer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '1.75rem',
            boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: selectedCustomer.avatarColor,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '16px',
                }}>
                  {selectedCustomer.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                    {selectedCustomer.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '3px' }}>
                    <span style={{ fontSize: '11.5px', color: theme.textSecondary }}>{selectedCustomer.id}</span>
                    <span style={{
                      padding: '1px 6px',
                      borderRadius: '9999px',
                      fontSize: '10.5px',
                      fontWeight: 800,
                      backgroundColor: '#FEF3C7',
                      color: '#B45309',
                    }}>
                      {selectedCustomer.loyaltyTier}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: '4px' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            {/* Lifetime Metrics Summary */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              marginBottom: '1.25rem',
            }}>
              <div style={{ padding: '0.75rem', borderRadius: '0.65rem', backgroundColor: (theme as any).sidebarIsDark ? theme.hoverBg : '#F9FAFB', border: `1px solid ${theme.border}`, textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: theme.textSecondary, fontWeight: 700, textTransform: 'uppercase' }}>Orders</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, marginTop: '2px' }}>{selectedCustomer.totalOrders}</div>
              </div>
              <div style={{ padding: '0.75rem', borderRadius: '0.65rem', backgroundColor: (theme as any).sidebarIsDark ? theme.hoverBg : '#F9FAFB', border: `1px solid ${theme.border}`, textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: theme.textSecondary, fontWeight: 700, textTransform: 'uppercase' }}>Lifetime Spend</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#166534', marginTop: '2px' }}>₹{selectedCustomer.lifetimeSpend.toLocaleString('en-IN')}</div>
              </div>
              <div style={{ padding: '0.75rem', borderRadius: '0.65rem', backgroundColor: (theme as any).sidebarIsDark ? theme.hoverBg : '#F9FAFB', border: `1px solid ${theme.border}`, textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: theme.textSecondary, fontWeight: 700, textTransform: 'uppercase' }}>Loyalty Points</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#B45309', marginTop: '2px' }}>{selectedCustomer.pointsBalance}</div>
              </div>
            </div>

            {/* Profile & Contact Details */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.hoverBg : '#F9FAFB',
              border: `1px solid ${theme.border}`,
              borderRadius: '0.85rem',
              padding: '1rem 1.25rem',
              marginBottom: '1.25rem',
              fontSize: '13px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.textSecondary, fontWeight: 600 }}>Phone:</span>
                <span style={{ fontWeight: 800, color: theme.textPrimary }}>{selectedCustomer.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.textSecondary, fontWeight: 600 }}>Email:</span>
                <span style={{ fontWeight: 700, color: theme.textPrimary }}>{selectedCustomer.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.textSecondary, fontWeight: 600 }}>Customer Segment:</span>
                <span style={{ fontWeight: 800, color: theme.textPrimary }}>{selectedCustomer.group}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.textSecondary, fontWeight: 600 }}>Favorite Order:</span>
                <span style={{ fontWeight: 800, color: '#166534' }}>{selectedCustomer.favoriteItem}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.textSecondary, fontWeight: 600 }}>Member Since:</span>
                <span style={{ fontWeight: 700, color: theme.textPrimary }}>{selectedCustomer.joinedDate}</span>
              </div>
              {selectedCustomer.birthday && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: theme.textSecondary, fontWeight: 600 }}>Birthday:</span>
                  <span style={{ fontWeight: 700, color: theme.textPrimary }}>{selectedCustomer.birthday}</span>
                </div>
              )}
              {selectedCustomer.notes && (
                <div style={{ marginTop: '0.35rem', paddingTop: '0.5rem', borderTop: `1px solid ${theme.border}`, fontSize: '12px', color: theme.textSecondary, fontStyle: 'italic' }}>
                  &ldquo;{selectedCustomer.notes}&rdquo;
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="button-20"
                role="button"
                onClick={() => setSelectedCustomer(null)}
                style={{
                  height: '38px',
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                }}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: ADJUST LOYALTY POINTS MODAL                                 */}
      {/* ==================================================================== */}
      {adjustPointsCustomer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '440px',
            padding: '1.75rem',
            boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Adjust Loyalty Points
                </h3>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                  {adjustPointsCustomer.name} (Current: {adjustPointsCustomer.pointsBalance} pts)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAdjustPointsCustomer(null)}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: '4px' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleConfirmPointsAdjustment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.45rem' }}>
                  POINTS TO CREDIT / DEBIT (+ / -)
                </label>
                <input
                  type="number"
                  required
                  value={pointsDelta}
                  onChange={(e) => setPointsDelta(parseInt(e.target.value, 10) || 0)}
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '0.55rem',
                    backgroundColor: (theme as any).sidebarIsDark ? theme.hoverBg : '#F9FAFB',
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    padding: '0 0.85rem',
                    fontSize: '16px',
                    fontWeight: 800,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.45rem' }}>
                  REASON FOR ADJUSTMENT
                </label>
                <select
                  value={pointsReason}
                  onChange={(e) => setPointsReason(e.target.value)}
                  style={{
                    width: '100%',
                    height: '38px',
                    borderRadius: '0.55rem',
                    backgroundColor: (theme as any).sidebarIsDark ? theme.hoverBg : '#F9FAFB',
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    padding: '0 0.75rem',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="Loyalty Promotional Reward">Loyalty Promotional Reward</option>
                  <option value="Customer Satisfaction Compensation">Customer Satisfaction Compensation</option>
                  <option value="Special Birthday Perk">Special Birthday Perk</option>
                  <option value="Correction of Missed Points">Correction of Missed Points</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="button-20-secondary"
                  role="button"
                  onClick={() => setAdjustPointsCustomer(null)}
                  style={{
                    height: '38px',
                    fontSize: '13px',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button-20"
                  role="button"
                  style={{
                    height: '38px',
                    fontSize: '13px',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                  }}
                >
                  Confirm Points
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: VIEW DIGITAL RECEIPT MODAL                                  */}
      {/* ==================================================================== */}
      {viewingReceiptOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '480px',
            padding: '1.75rem',
            boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Order Receipt: {viewingReceiptOrder.id}
                </h3>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                  {viewingReceiptOrder.customerName} • {viewingReceiptOrder.date} {viewingReceiptOrder.time}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingReceiptOrder(null)}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: '4px' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.hoverBg : '#F9FAFB',
              border: `1px solid ${theme.border}`,
              borderRadius: '0.85rem',
              padding: '1rem',
              marginBottom: '1.25rem',
              fontSize: '13px',
            }}>
              <div style={{ fontWeight: 800, color: theme.textPrimary, marginBottom: '0.5rem' }}>
                Purchased Items
              </div>
              {viewingReceiptOrder.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: theme.textPrimary }}>{item.quantity}x {item.name}</span>
                  <span style={{ fontWeight: 700, color: theme.textPrimary }}>₹{item.totalPrice}</span>
                </div>
              ))}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.65rem',
                marginTop: '0.65rem',
                borderTop: `1px solid ${theme.border}`,
                fontWeight: 800,
                fontSize: '15px',
              }}>
                <span>Total Paid ({viewingReceiptOrder.paymentMethod})</span>
                <span style={{ color: '#166534' }}>₹{viewingReceiptOrder.totalAmount}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="button-20"
                role="button"
                onClick={() => setViewingReceiptOrder(null)}
                style={{
                  height: '38px',
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                }}
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 5: RESOLVE COMPLAINT MODAL                                     */}
      {/* ==================================================================== */}
      {resolvingFeedback && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '480px',
            padding: '1.75rem',
            boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Resolve Customer Complaint
                </h3>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                  {resolvingFeedback.customerName} • {resolvingFeedback.orderId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setResolvingFeedback(null)}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: '4px' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.hoverBg : '#F9FAFB',
              border: `1px solid ${theme.border}`,
              borderRadius: '0.65rem',
              padding: '0.85rem',
              marginBottom: '1rem',
              fontSize: '12.5px',
              color: theme.textPrimary,
            }}>
              <span style={{ fontWeight: 700 }}>Customer Feedback: </span>
              &ldquo;{resolvingFeedback.comment}&rdquo;
            </div>

            <form onSubmit={handleConfirmResolveFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.45rem' }}>
                  RESOLUTION & SERVICE RECOVERY ACTION
                </label>
                <textarea
                  rows={3}
                  required
                  value={resolutionActionText}
                  onChange={(e) => setResolutionActionText(e.target.value)}
                  style={{
                    width: '100%',
                    borderRadius: '0.55rem',
                    backgroundColor: (theme as any).sidebarIsDark ? theme.hoverBg : '#F9FAFB',
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    padding: '0.65rem 0.85rem',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="button-20-secondary"
                  role="button"
                  onClick={() => setResolvingFeedback(null)}
                  style={{
                    height: '38px',
                    fontSize: '13px',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button-20"
                  role="button"
                  style={{
                    height: '38px',
                    fontSize: '13px',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                  }}
                >
                  Mark as Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
