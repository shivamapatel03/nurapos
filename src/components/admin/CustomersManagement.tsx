'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { getCustomers, createCustomer, getOwnerSales } from '@/lib/api-client';
import type { Customer as ApiCustomer } from '@/types/customer';

// Material Rounded Icons
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
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
  status: 'Completed' | 'Refunded';
}

export interface Customer {
  id: string; // e.g. CUST-101
  name: string;
  phone: string;
  email: string;
  group: 'VIP Elite' | 'Store Regulars' | 'New Patrons' | 'At-Risk';
  totalOrders: number;
  lifetimeSpend: number;
  lastVisit: string;
  joinedDate: string;
  favoriteItem: string;
  notes?: string;
  birthday?: string;
  avatarColor: string;
}

export interface CustomersManagementProps {
  activeSubTab?: 'cust_all' | 'cust_history';
  onSelectSubTab?: (tab: 'cust_all' | 'cust_history') => void;
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


export default function CustomersManagement({
  activeSubTab = 'cust_all',
  onSelectSubTab,
  theme,
}: CustomersManagementProps) {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<'cust_all' | 'cust_history'>(activeSubTab);

  React.useEffect(() => {
    if (activeSubTab) {
      setCurrentTab(activeSubTab);
    }
  }, [activeSubTab]);

  // Customers State
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  // Add Customer Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustGroup, setNewCustGroup] = useState<Customer['group']>('New Patrons');
  const [newCustBirthday, setNewCustBirthday] = useState('');
  const [newCustNotes, setNewCustNotes] = useState('');
  const [isSubmittingCustomer, setIsSubmittingCustomer] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<CustomerOrderRecord[]>(INITIAL_ORDERS);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Live Fetch Customers from Backend API
  const fetchCustomers = useCallback(async () => {
    try {
      setCustomersLoading(true);
      const res = await getCustomers();
      if (res.data && Array.isArray(res.data)) {
        const colors = ['#1E293B', '#2563EB', '#059669', '#D97706', '#7C3AED'];
        const mapped: Customer[] = res.data.map((c: ApiCustomer, idx: number) => {
          let grp: Customer['group'] = 'New Patrons';
          if (c.totalSpent >= 5000 || c.totalVisits >= 10) {
            grp = 'VIP Elite';
          } else if (c.totalVisits >= 3) {
            grp = 'Store Regulars';
          }
          const dtStr = c.createdAtUtc ? new Date(c.createdAtUtc).toLocaleDateString() : 'Recent';
          return {
            id: `CUST-${c.id}`,
            name: c.name || 'Valued Guest',
            phone: c.phone || '',
            email: c.email || '',
            group: grp,
            totalOrders: c.totalVisits || 0,
            lifetimeSpend: Number(c.totalSpent) || 0,
            lastVisit: c.totalVisits > 0 ? `${c.totalVisits} visits` : 'Recent',
            joinedDate: dtStr,
            favoriteItem: `${c.loyaltyPoints || 0} Pts`,
            notes: c.address || undefined,
            avatarColor: colors[Math.abs(c.id || idx) % colors.length],
          };
        });
        setCustomers(mapped);
      }
    } catch (err) {
      console.error('Error fetching live customers:', err);
    } finally {
      setCustomersLoading(false);
    }
  }, []);

  // Live Fetch Orders from Backend Sales Ledger for Purchase History
  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const res = await getOwnerSales();
      if (res.data && Array.isArray(res.data)) {
        const mapped: CustomerOrderRecord[] = res.data.map((s: any) => {
          const dt = s.createdAtUtc ? new Date(s.createdAtUtc) : new Date();
          const rawMethod = (s.paymentMethod || 'Cash').toUpperCase();
          const paymentMethod: CustomerOrderRecord['paymentMethod'] =
            rawMethod.includes('UPI') ? 'UPI' :
            rawMethod.includes('CARD') ? 'Card' :
            rawMethod.includes('WALLET') ? 'Wallet' : 'Cash';

          return {
            id: s.billNumber || `ORD-${s.id}`,
            date: dt.toLocaleDateString(),
            time: dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            customerId: `CUST-${s.id}`,
            customerName: s.customerName || 'In-Store Guest',
            customerPhone: s.customerPhone || 'Counter Sale',
            items: (s.items || []).map((item: any) => ({
              name: item.productName || `Item #${item.productId}`,
              quantity: Number(item.quantity) || 1,
              unitPrice: Number(item.unitPrice) || 0,
              totalPrice: Number(item.totalPrice) || 0,
            })),
            totalAmount: Number(s.totalAmount) || 0,
            paymentMethod,
            status: 'Completed',
          };
        });
        setOrders(mapped);
      }
    } catch (err) {
      console.error('Error fetching live purchase history:', err);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
    fetchOrders();
  }, [fetchCustomers, fetchOrders]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('ALL');
  const [viewingReceiptOrder, setViewingReceiptOrder] = useState<CustomerOrderRecord | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const [resolutionActionText, setResolutionActionText] = useState('Offered compensation and apology.');

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.phone.includes(customerSearch) ||
        c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.id.toLowerCase().includes(customerSearch.toLowerCase());

      const matchGroup = groupFilter === 'ALL' || c.group === groupFilter;

      return matchSearch && matchGroup;
    });
  }, [customers, customerSearch, groupFilter]);

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

  // Handle Add Customer via Backend API
  const handleSaveNewCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) return;

    try {
      setIsSubmittingCustomer(true);
      await createCustomer({
        name: newCustName.trim(),
        phone: newCustPhone.trim(),
        email: newCustEmail.trim() || undefined,
        address: newCustNotes.trim() || undefined,
      });

      setToastNotice(`Customer ${newCustName.trim()} registered successfully.`);
      setTimeout(() => setToastNotice(null), 3500);

      setNewCustName('');
      setNewCustPhone('');
      setNewCustEmail('');
      setNewCustBirthday('');
      setNewCustNotes('');
      setShowAddCustomerModal(false);

      await fetchCustomers();
    } catch (err: any) {
      console.error('Failed to create customer:', err);
      setToastNotice(err.message || 'Failed to create customer. Phone number may already be registered.');
      setTimeout(() => setToastNotice(null), 4000);
    } finally {
      setIsSubmittingCustomer(false);
    }
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
            Patron profiles and purchase histories.
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
                Repeat Customers
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: '#166534', letterSpacing: '-0.03em' }}>
                  {customers.filter(c => c.totalOrders > 1).length}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  {customers.length > 0 ? `${((customers.filter(c => c.totalOrders > 1).length / customers.length) * 100).toFixed(1)}% repeat rate` : '0% repeat rate'}
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
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Group</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Orders</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Lifetime Spend</th>
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
                      </td>

                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: theme.textPrimary }}>
                        {c.totalOrders} orders
                      </td>

                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#166534' }}>
                        ₹{c.lifetimeSpend.toLocaleString('en-IN')}
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
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: theme.textSecondary }}>
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
                      <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: theme.textSecondary }}>
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
                  Register patron details for store membership and personalized orders.
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
                  disabled={isSubmittingCustomer}
                  className="button-20"
                  role="button"
                  style={{
                    height: '38px',
                    fontSize: '13px',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                    opacity: isSubmittingCustomer ? 0.7 : 1,
                  }}
                >
                  {isSubmittingCustomer ? 'Registering...' : 'Register Customer'}
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
              gridTemplateColumns: 'repeat(2, 1fr)',
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
      )}    </div>
  );
}
