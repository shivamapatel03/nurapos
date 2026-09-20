'use client';

import React, { useState, useMemo } from 'react';

// Material Rounded Icons
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded';
import GroupWorkRoundedIcon from '@mui/icons-material/GroupWorkRounded';
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
  activeSubTab?: 'cust_all' | 'cust_history' | 'cust_loyalty' | 'cust_groups' | 'cust_feedback';
  onSelectSubTab?: (tab: 'cust_all' | 'cust_history' | 'cust_loyalty' | 'cust_groups' | 'cust_feedback') => void;
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
const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-101',
    name: 'Vikramaditya Shah',
    phone: '+91 98250 11234',
    email: 'vikram.shah@enterprise.in',
    group: 'VIP Elite',
    loyaltyTier: 'Platinum VIP',
    totalOrders: 42,
    lifetimeSpend: 28450,
    pointsBalance: 1420,
    lastVisit: 'Yesterday, 19:30',
    joinedDate: '2023-03-10',
    favoriteItem: 'Artisan Beef Smash Burger',
    notes: 'Prefers window corner booth. Orders extra truffle dip.',
    birthday: '1988-11-14',
    avatarColor: '#1E293B',
  },
  {
    id: 'CUST-102',
    name: 'Ananya Deshmukh',
    phone: '+91 97241 88920',
    email: 'ananya.d@studioarch.com',
    group: 'VIP Elite',
    loyaltyTier: 'Platinum VIP',
    totalOrders: 36,
    lifetimeSpend: 23600,
    pointsBalance: 1180,
    lastVisit: 'Today, 14:20',
    joinedDate: '2023-05-18',
    favoriteItem: 'Cappuccino Italiano',
    notes: 'Prefers oat milk substitution. Daily afternoon patron.',
    birthday: '1992-06-25',
    avatarColor: '#0F766E',
  },
  {
    id: 'CUST-103',
    name: 'Dr. Siddharth Mehta',
    phone: '+91 98980 44512',
    email: 'siddharth.mehta@careclinic.org',
    group: 'Store Regulars',
    loyaltyTier: 'Gold',
    totalOrders: 31,
    lifetimeSpend: 21400,
    pointsBalance: 780,
    lastVisit: '3 days ago',
    joinedDate: '2023-09-01',
    favoriteItem: 'Classic Margherita Pizza',
    notes: 'Often orders for clinic staff lunch meetings.',
    birthday: '1980-04-12',
    avatarColor: '#1D4ED8',
  },
  {
    id: 'CUST-104',
    name: 'Meera Patel',
    phone: '+91 99099 33211',
    email: 'meera.patel@designworks.io',
    group: 'Store Regulars',
    loyaltyTier: 'Gold',
    totalOrders: 28,
    lifetimeSpend: 18900,
    pointsBalance: 640,
    lastVisit: 'Today, 12:45',
    joinedDate: '2024-01-15',
    favoriteItem: 'Truffle Parmesan Fries',
    notes: 'Regular lunch attendee with marketing colleagues.',
    birthday: '1995-08-30',
    avatarColor: '#B45309',
  },
  {
    id: 'CUST-105',
    name: 'Karanvir Singhania',
    phone: '+91 98240 77651',
    email: 'karan.singh@legaladvocates.in',
    group: 'Store Regulars',
    loyaltyTier: 'Silver',
    totalOrders: 25,
    lifetimeSpend: 17250,
    pointsBalance: 420,
    lastVisit: '5 days ago',
    joinedDate: '2024-02-20',
    favoriteItem: 'Dark Chocolate Brownie',
    notes: 'Evening dessert and espresso regular.',
    birthday: '1986-12-05',
    avatarColor: '#7C3AED',
  },
  {
    id: 'CUST-106',
    name: 'Pooja Bhatt',
    phone: '+91 98123 45678',
    email: 'pooja.bhatt@techstart.co',
    group: 'Store Regulars',
    loyaltyTier: 'Silver',
    totalOrders: 18,
    lifetimeSpend: 11400,
    pointsBalance: 320,
    lastVisit: 'Yesterday, 10:15',
    joinedDate: '2024-04-02',
    favoriteItem: 'Cold Brew Nitro Blend',
    notes: 'Freelancer, works with laptop on high tables.',
    birthday: '1997-03-21',
    avatarColor: '#BE185D',
  },
  {
    id: 'CUST-107',
    name: 'Rajesh Vora',
    phone: '+91 98450 67890',
    email: 'rajesh.vora@voratraders.com',
    group: 'New Patrons',
    loyaltyTier: 'Bronze',
    totalOrders: 2,
    lifetimeSpend: 1440,
    pointsBalance: 40,
    lastVisit: 'Today, 11:30',
    joinedDate: '2026-09-18',
    favoriteItem: 'Margherita Pizza 12"',
    notes: 'Discovered cafe through corporate lunch flyer.',
    birthday: '1975-09-08',
    avatarColor: '#4338CA',
  },
  {
    id: 'CUST-108',
    name: 'Nitin Kothari',
    phone: '+91 99111 88223',
    email: 'nitin.kothari@realtygroup.in',
    group: 'At-Risk',
    loyaltyTier: 'Silver',
    totalOrders: 12,
    lifetimeSpend: 8200,
    pointsBalance: 190,
    lastVisit: '48 days ago',
    joinedDate: '2023-11-10',
    favoriteItem: 'BBQ Pulled Chicken Sliders',
    notes: 'Lapsed patron. Trigger win-back SMS discount voucher.',
    birthday: '1984-01-19',
    avatarColor: '#047857',
  },
];

const INITIAL_ORDERS: CustomerOrderRecord[] = [
  {
    id: 'ORD-9842',
    date: '2026-09-20',
    time: '14:20',
    customerId: 'CUST-102',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 97241 88920',
    items: [
      { name: 'Artisan Beef Smash Burger', quantity: 2, unitPrice: 320, totalPrice: 640 },
      { name: 'Truffle Parmesan French Fries', quantity: 1, unitPrice: 150, totalPrice: 150 },
      { name: 'Cappuccino Italiano', quantity: 2, unitPrice: 180, totalPrice: 360 },
    ],
    totalAmount: 1150,
    paymentMethod: 'UPI',
    loyaltyPointsEarned: 23,
    status: 'Completed',
  },
  {
    id: 'ORD-9841',
    date: '2026-09-20',
    time: '12:45',
    customerId: 'CUST-104',
    customerName: 'Meera Patel',
    customerPhone: '+91 99099 33211',
    items: [
      { name: 'Truffle Parmesan French Fries', quantity: 1, unitPrice: 150, totalPrice: 150 },
      { name: 'Artisan Beef Smash Burger', quantity: 1, unitPrice: 320, totalPrice: 320 },
    ],
    totalAmount: 470,
    paymentMethod: 'Card',
    loyaltyPointsEarned: 10,
    status: 'Completed',
  },
  {
    id: 'ORD-9840',
    date: '2026-09-20',
    time: '11:30',
    customerId: 'CUST-107',
    customerName: 'Rajesh Vora',
    customerPhone: '+91 98450 67890',
    items: [
      { name: 'Classic Margherita Pizza 12"', quantity: 3, unitPrice: 480, totalPrice: 1440 },
    ],
    totalAmount: 1440,
    paymentMethod: 'Cash',
    loyaltyPointsEarned: 14,
    status: 'Completed',
  },
  {
    id: 'ORD-9839',
    date: '2026-09-19',
    time: '19:30',
    customerId: 'CUST-101',
    customerName: 'Vikramaditya Shah',
    customerPhone: '+91 98250 11234',
    items: [
      { name: 'Artisan Beef Smash Burger', quantity: 2, unitPrice: 320, totalPrice: 640 },
      { name: 'Belgian Truffle Mousse Cake', quantity: 2, unitPrice: 220, totalPrice: 440 },
    ],
    totalAmount: 1080,
    paymentMethod: 'Card',
    loyaltyPointsEarned: 22,
    status: 'Completed',
  },
  {
    id: 'ORD-9838',
    date: '2026-09-19',
    time: '10:15',
    customerId: 'CUST-106',
    customerName: 'Pooja Bhatt',
    customerPhone: '+91 98123 45678',
    items: [
      { name: 'Cold Brew Nitro Blend', quantity: 1, unitPrice: 210, totalPrice: 210 },
      { name: 'Dark Chocolate Brownie', quantity: 1, unitPrice: 180, totalPrice: 180 },
    ],
    totalAmount: 390,
    paymentMethod: 'UPI',
    loyaltyPointsEarned: 8,
    status: 'Completed',
  },
];

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

const INITIAL_FEEDBACK: CustomerFeedbackRecord[] = [
  {
    id: 'REV-501',
    customerId: 'CUST-101',
    customerName: 'Vikramaditya Shah',
    customerPhone: '+91 98250 11234',
    rating: 5,
    date: '2026-09-19',
    orderId: 'ORD-9839',
    category: 'Food Quality',
    comment: 'The smash burger patties were remarkably juicy and properly seared. Outstanding consistent taste!',
    status: 'Published',
  },
  {
    id: 'REV-502',
    customerId: 'CUST-102',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 97241 88920',
    rating: 5,
    date: '2026-09-20',
    orderId: 'ORD-9842',
    category: 'Service Speed',
    comment: 'Prepared exactly to my preference with oat milk under 4 minutes. Love the rapid digital checkout!',
    status: 'Published',
  },
  {
    id: 'REV-503',
    customerId: 'CUST-107',
    customerName: 'Rajesh Vora',
    customerPhone: '+91 98450 67890',
    rating: 4,
    date: '2026-09-20',
    orderId: 'ORD-9840',
    category: 'Ambiance',
    comment: 'Delicious pizzas for the office team. Only feedback is music volume was slightly high during lunch.',
    status: 'Published',
  },
  {
    id: 'REV-504',
    customerId: 'CUST-108',
    customerName: 'Nitin Kothari',
    customerPhone: '+91 99111 88223',
    rating: 2,
    date: '2026-08-04',
    orderId: 'ORD-9610',
    category: 'Order Accuracy',
    comment: 'Requested BBQ chicken slider without pickles, but pickles were added. Staff replaced it after a 10 min delay.',
    status: 'Action Required',
  },
];

export default function CustomersManagement({
  activeSubTab = 'cust_all',
  onSelectSubTab,
  theme,
}: CustomersManagementProps) {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<'cust_all' | 'cust_history' | 'cust_loyalty' | 'cust_groups' | 'cust_feedback'>(activeSubTab);

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
            Customers & Loyalty CRM
          </h1>
          <p style={{
            fontSize: '14px',
            color: theme.textSecondary,
            margin: 0,
            fontWeight: 500,
          }}>
            Patron profiles, purchase histories, loyalty membership tiers, customer segmentation, and feedback reviews.
          </p>
        </div>

        {/* Global Action: Add Customer */}
        <button
          type="button"
          onClick={() => setShowAddCustomerModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0 1.15rem',
            height: '40px',
            borderRadius: '0.65rem',
            backgroundColor: theme.textPrimary,
            color: theme.bgPage,
            border: 'none',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <AddRoundedIcon sx={{ fontSize: 18 }} />
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
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Customers
                </span>
                <PeopleAltRoundedIcon sx={{ fontSize: 18, color: theme.textSecondary }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.04em' }}>
                  3,420
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '2px' }}>
                  Registered patron base
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Active Loyalty Members
                </span>
                <CardGiftcardRoundedIcon sx={{ fontSize: 18, color: '#10B981' }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#166534', letterSpacing: '-0.04em' }}>
                  2,343
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '2px' }}>
                  68.5% loyalty participation
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Avg Lifetime Value (LTV)
                </span>
                <AttachMoneyRoundedIcon sx={{ fontSize: 18, color: theme.textSecondary }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.04em' }}>
                  ₹4,850
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '2px' }}>
                  Average spend per patron
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  VIP Club Patrons
                </span>
                <StarsRoundedIcon sx={{ fontSize: 18, color: '#F59E0B' }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#B45309', letterSpacing: '-0.04em' }}>
                  274
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '2px' }}>
                  Generating 28.4% of sales
                </div>
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
              backgroundColor: theme.bgCard,
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
                  backgroundColor: theme.bgCard,
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
                  backgroundColor: theme.bgCard,
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
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
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
                            onClick={() => setSelectedCustomer(c)}
                            title="View Customer Profile"
                            style={{
                              padding: '4px 8px',
                              borderRadius: '0.45rem',
                              border: `1px solid ${theme.border}`,
                              backgroundColor: theme.hoverBg,
                              color: theme.textPrimary,
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <VisibilityRoundedIcon sx={{ fontSize: 14 }} />
                            <span>Profile</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdjustPointsCustomer(c)}
                            title="Adjust Loyalty Points"
                            style={{
                              padding: '4px 8px',
                              borderRadius: '0.45rem',
                              border: `1px solid ${theme.border}`,
                              backgroundColor: 'transparent',
                              color: theme.textPrimary,
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
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
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Orders Rung
                </span>
                <ReceiptLongRoundedIcon sx={{ fontSize: 18, color: theme.textSecondary }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.04em' }}>
                  12,840
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '2px' }}>
                  Store orders processed
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Aggregate Spend
                </span>
                <AttachMoneyRoundedIcon sx={{ fontSize: 18, color: '#10B981' }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#166534', letterSpacing: '-0.04em' }}>
                  ₹62.45L
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '2px' }}>
                  Cumulative gross spend
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Avg Basket Size
                </span>
                <ShoppingBagRoundedIcon sx={{ fontSize: 18, color: theme.textSecondary }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.04em' }}>
                  2.8 Items
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '2px' }}>
                  ₹486 average ticket
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Repeat Spend Ratio
                </span>
                <TrendingUpRoundedIcon sx={{ fontSize: 18, color: '#10B981' }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#166534', letterSpacing: '-0.04em' }}>
                  72.0%
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '2px' }}>
                  Revenue from returning guests
                </div>
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
              backgroundColor: theme.bgCard,
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
                backgroundColor: theme.bgCard,
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
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
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
                          onClick={() => setViewingReceiptOrder(o)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '4px 10px',
                            borderRadius: '0.45rem',
                            border: `1px solid ${theme.border}`,
                            backgroundColor: theme.hoverBg,
                            color: theme.textPrimary,
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          <VisibilityRoundedIcon sx={{ fontSize: 14 }} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 3. LOYALTY & REWARDS                                                 */}
      {/* ==================================================================== */}
      {currentTab === 'cust_loyalty' && (
        <>
          {/* Top KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}>
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Points in Circulation
                </span>
                <StarsRoundedIcon sx={{ fontSize: 18, color: '#F59E0B' }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.04em' }}>
                  1,84,200
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '2px' }}>
                  Active unredeemed customer balance
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Rewards Claimed
                </span>
                <CardGiftcardRoundedIcon sx={{ fontSize: 18, color: '#10B981' }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#166534', letterSpacing: '-0.04em' }}>
                  ₹1,24,500
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '2px' }}>
                  Value redeemed by patrons
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Conversion Multiplier
                </span>
                <TrendingUpRoundedIcon sx={{ fontSize: 18, color: '#0284C7' }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.04em' }}>
                  4.8x
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '2px' }}>
                  Higher repeat frequency with points
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Redemption Rate
                </span>
                <CheckCircleRoundedIcon sx={{ fontSize: 18, color: '#10B981' }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#166534', letterSpacing: '-0.04em' }}>
                  34.2%
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '2px' }}>
                  Patrons active in rewards catalog
                </div>
              </div>
            </div>
          </div>

          {/* Membership Tier Benchmark Cards */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 1rem 0', color: theme.textPrimary }}>
              Loyalty Membership Tiers & Benefit Structure
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div style={{
                backgroundColor: theme.bgCard,
                border: `1px solid ${theme.borderCard}`,
                borderRadius: '1rem',
                padding: '1.25rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#92400E', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '0.35rem' }}>
                    BRONZE
                  </span>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: theme.textSecondary }}>0 - 499 pts</span>
                </div>
                <div style={{ marginTop: '0.85rem', fontSize: '13px', color: theme.textPrimary, lineHeight: 1.5 }}>
                  <div>• 1 pt per ₹100 spent</div>
                  <div>• Birthday greeting bonus</div>
                  <div>• Standard digital receipts</div>
                </div>
              </div>

              <div style={{
                backgroundColor: theme.bgCard,
                border: `1px solid ${theme.borderCard}`,
                borderRadius: '1rem',
                padding: '1.25rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#1E40AF', backgroundColor: '#DBEAFE', padding: '2px 8px', borderRadius: '0.35rem' }}>
                    SILVER
                  </span>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: theme.textSecondary }}>500 - 1,499 pts</span>
                </div>
                <div style={{ marginTop: '0.85rem', fontSize: '13px', color: theme.textPrimary, lineHeight: 1.5 }}>
                  <div>• 1.25 pts per ₹100 spent</div>
                  <div>• Free beverage on birthday</div>
                  <div>• Monthly exclusive menu invite</div>
                </div>
              </div>

              <div style={{
                backgroundColor: theme.bgCard,
                border: `1px solid ${theme.borderCard}`,
                borderRadius: '1rem',
                padding: '1.25rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#B45309', backgroundColor: '#FED7AA', padding: '2px 8px', borderRadius: '0.35rem' }}>
                    GOLD
                  </span>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: theme.textSecondary }}>1,500 - 3,999 pts</span>
                </div>
                <div style={{ marginTop: '0.85rem', fontSize: '13px', color: theme.textPrimary, lineHeight: 1.5 }}>
                  <div>• 1.5 pts per ₹100 spent</div>
                  <div>• 5% automatic counter discount</div>
                  <div>• Priority rush hour prep</div>
                </div>
              </div>

              <div style={{
                backgroundColor: theme.bgCard,
                border: `1px solid ${theme.borderCard}`,
                borderRadius: '1rem',
                padding: '1.25rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', backgroundColor: '#1E293B', padding: '2px 8px', borderRadius: '0.35rem' }}>
                    PLATINUM VIP
                  </span>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: theme.textSecondary }}>4,000+ pts</span>
                </div>
                <div style={{ marginTop: '0.85rem', fontSize: '13px', color: theme.textPrimary, lineHeight: 1.5 }}>
                  <div>• 2 pts per ₹100 spent</div>
                  <div>• 10% automatic counter discount</div>
                  <div>• Free Chef tasting treat on visit</div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Rewards Voucher Catalog */}
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
            borderRadius: '1.25rem',
            padding: '1.5rem',
            marginBottom: '1.75rem',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 1rem 0', color: theme.textPrimary }}>
              Active Rewards & Voucher Catalog
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {REWARD_VOUCHERS.map((v) => (
                <div
                  key={v.id}
                  style={{
                    backgroundColor: theme.hoverBg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '0.85rem',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase' }}>
                        {v.category}
                      </span>
                      <span style={{
                        padding: '2px 7px',
                        borderRadius: '0.35rem',
                        backgroundColor: '#FEF3C7',
                        color: '#B45309',
                        fontWeight: 800,
                        fontSize: '11.5px',
                      }}>
                        {v.pointsCost} PTS
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: theme.textPrimary, marginBottom: '0.35rem' }}>
                      {v.title}
                    </div>
                    <div style={{ fontSize: '12px', color: theme.textSecondary, lineHeight: 1.4 }}>
                      {v.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 4. CUSTOMER GROUPS                                                   */}
      {/* ==================================================================== */}
      {currentTab === 'cust_groups' && (
        <>
          {/* Segmentation Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}>
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#92400E', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '0.35rem' }}>
                  VIP ELITE
                </span>
                <StarsRoundedIcon sx={{ fontSize: 18, color: '#F59E0B' }} />
              </div>
              <div style={{ marginTop: '0.85rem' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: theme.textPrimary }}>
                  274 Members
                </div>
                <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '2px' }}>
                  Avg ₹28,450 spend • 4.2 visits/mo
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#1E40AF', backgroundColor: '#DBEAFE', padding: '2px 8px', borderRadius: '0.35rem' }}>
                  STORE REGULARS
                </span>
                <PeopleAltRoundedIcon sx={{ fontSize: 18, color: '#3B82F6' }} />
              </div>
              <div style={{ marginTop: '0.85rem' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: theme.textPrimary }}>
                  1,436 Members
                </div>
                <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '2px' }}>
                  Avg ₹6,200 spend • 2.1 visits/mo
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#166534', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '0.35rem' }}>
                  NEW PATRONS
                </span>
                <PersonOutlineRoundedIcon sx={{ fontSize: 18, color: '#10B981' }} />
              </div>
              <div style={{ marginTop: '0.85rem' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: theme.textPrimary }}>
                  1,077 Members
                </div>
                <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '2px' }}>
                  First order in last 30 days
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#991B1B', backgroundColor: '#FEE2E2', padding: '2px 8px', borderRadius: '0.35rem' }}>
                  AT-RISK / LAPSED
                </span>
                <WarningAmberRoundedIcon sx={{ fontSize: 18, color: '#EF4444' }} />
              </div>
              <div style={{ marginTop: '0.85rem' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: theme.textPrimary }}>
                  633 Members
                </div>
                <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '2px' }}>
                  No visit in 45+ days
                </div>
              </div>
            </div>
          </div>

          {/* Customer Group Directory */}
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
            borderRadius: '1.25rem',
            overflow: 'hidden',
            marginBottom: '1.75rem',
          }}>
            <div style={{ padding: '1.25rem', borderBottom: `1px solid ${theme.border}` }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                Segmented Patron Roster
              </h3>
              <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                View members belonging to each behavioral segment and loyalty bracket.
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}`, textAlign: 'left', backgroundColor: theme.tableHeaderBg }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Customer</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Current Group</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Orders Rung</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Lifetime Spend</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Favorite Dish</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: theme.textPrimary }}>{c.name}</div>
                        <div style={{ fontSize: '11px', color: theme.textSecondary }}>{c.phone}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          padding: '2px 8px',
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
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: theme.textPrimary }}>
                        {c.totalOrders}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#166534' }}>
                        ₹{c.lifetimeSpend.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: theme.textPrimary, fontWeight: 600 }}>
                        {c.favoriteItem}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedCustomer(c)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '0.45rem',
                            border: `1px solid ${theme.border}`,
                            backgroundColor: theme.hoverBg,
                            color: theme.textPrimary,
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 5. FEEDBACK & REVIEWS                                                */}
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
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Average Rating
                </span>
                <StarRoundedIcon sx={{ fontSize: 18, color: '#F59E0B' }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#B45309', letterSpacing: '-0.04em' }}>
                  4.8 / 5.0
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '2px' }}>
                  Across 1,840 verified patron reviews
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Positive Sentiment
                </span>
                <CheckCircleRoundedIcon sx={{ fontSize: 18, color: '#10B981' }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#166534', letterSpacing: '-0.04em' }}>
                  92.4%
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '2px' }}>
                  4-star and 5-star ratings
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Pending Complaints
                </span>
                <WarningAmberRoundedIcon sx={{ fontSize: 18, color: '#EF4444' }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#991B1B', letterSpacing: '-0.04em' }}>
                  1 Issue
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '2px' }}>
                  Requires supervisor resolution
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Avg Resolution Time
                </span>
                <CheckRoundedIcon sx={{ fontSize: 18, color: '#10B981' }} />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#166534', letterSpacing: '-0.04em' }}>
                  1.4 hrs
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '2px' }}>
                  Customer issue recovery speed
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Ledger */}
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
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
                            onClick={() => setResolvingFeedback(f)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '0.45rem',
                              border: 'none',
                              backgroundColor: '#DC2626',
                              color: '#FFFFFF',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
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
            backgroundColor: theme.bgCard,
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
                    backgroundColor: theme.hoverBg,
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
                      backgroundColor: theme.hoverBg,
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
                      backgroundColor: theme.hoverBg,
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
                      backgroundColor: theme.hoverBg,
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
                      backgroundColor: theme.hoverBg,
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
                    backgroundColor: theme.hoverBg,
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
                  onClick={() => setShowAddCustomerModal(false)}
                  style={{
                    padding: '0 1rem',
                    height: '38px',
                    borderRadius: '0.55rem',
                    backgroundColor: 'transparent',
                    border: `1px solid ${theme.border}`,
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
                    padding: '0 1.25rem',
                    height: '38px',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.textPrimary,
                    color: theme.bgPage,
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
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
            backgroundColor: theme.bgCard,
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
              <div style={{ padding: '0.75rem', borderRadius: '0.65rem', backgroundColor: theme.hoverBg, textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: theme.textSecondary, fontWeight: 700, textTransform: 'uppercase' }}>Orders</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, marginTop: '2px' }}>{selectedCustomer.totalOrders}</div>
              </div>
              <div style={{ padding: '0.75rem', borderRadius: '0.65rem', backgroundColor: theme.hoverBg, textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: theme.textSecondary, fontWeight: 700, textTransform: 'uppercase' }}>Lifetime Spend</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#166534', marginTop: '2px' }}>₹{selectedCustomer.lifetimeSpend.toLocaleString('en-IN')}</div>
              </div>
              <div style={{ padding: '0.75rem', borderRadius: '0.65rem', backgroundColor: theme.hoverBg, textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: theme.textSecondary, fontWeight: 700, textTransform: 'uppercase' }}>Loyalty Points</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#B45309', marginTop: '2px' }}>{selectedCustomer.pointsBalance}</div>
              </div>
            </div>

            {/* Profile & Contact Details */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              backgroundColor: theme.hoverBg,
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
                onClick={() => setSelectedCustomer(null)}
                style={{
                  padding: '0 1.25rem',
                  height: '36px',
                  borderRadius: '0.55rem',
                  backgroundColor: theme.textPrimary,
                  color: theme.bgPage,
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
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
            backgroundColor: theme.bgCard,
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
                    backgroundColor: theme.hoverBg,
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
                    backgroundColor: theme.hoverBg,
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
                  onClick={() => setAdjustPointsCustomer(null)}
                  style={{
                    padding: '0 1rem',
                    height: '38px',
                    borderRadius: '0.55rem',
                    backgroundColor: 'transparent',
                    border: `1px solid ${theme.border}`,
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
                    padding: '0 1.25rem',
                    height: '38px',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.textPrimary,
                    color: theme.bgPage,
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
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
            backgroundColor: theme.bgCard,
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
              backgroundColor: theme.hoverBg,
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
                onClick={() => setViewingReceiptOrder(null)}
                style={{
                  padding: '0 1.25rem',
                  height: '36px',
                  borderRadius: '0.55rem',
                  backgroundColor: theme.textPrimary,
                  color: theme.bgPage,
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
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
            backgroundColor: theme.bgCard,
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
              backgroundColor: theme.hoverBg,
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
                    backgroundColor: theme.hoverBg,
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
                  onClick={() => setResolvingFeedback(null)}
                  style={{
                    padding: '0 1rem',
                    height: '38px',
                    borderRadius: '0.55rem',
                    backgroundColor: 'transparent',
                    border: `1px solid ${theme.border}`,
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
                    padding: '0 1.25rem',
                    height: '38px',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.textPrimary,
                    color: theme.bgPage,
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
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
