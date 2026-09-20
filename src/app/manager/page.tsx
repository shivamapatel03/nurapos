'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Material Rounded Icons
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import WarehouseRoundedIcon from '@mui/icons-material/WarehouseRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import StoreRoundedIcon from '@mui/icons-material/StoreRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import ManagerInventoryScreen from '@/components/manager/ManagerInventoryScreen';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export default function ManagerDashboardPage() {
  const router = useRouter();

  // Sidebar collapse/expand state with smooth animation
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTabId, setActiveTabId] = useState('inventory');
  const [chartTimeframe, setChartTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);

  // Exact Navigation Items from Manager Dashboard Screenshot
  const mainNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardRoundedIcon sx={{ fontSize: 20 }} /> },
    { id: 'orders', label: 'Orders', icon: <ReceiptLongRoundedIcon sx={{ fontSize: 20 }} /> },
    { id: 'products', label: 'Products', icon: <Inventory2RoundedIcon sx={{ fontSize: 20 }} /> },
    { id: 'inventory', label: 'Inventory', icon: <WarehouseRoundedIcon sx={{ fontSize: 20 }} /> },
    { id: 'customers', label: 'Customers', icon: <PeopleAltRoundedIcon sx={{ fontSize: 20 }} /> },
    { id: 'employees', label: 'Employees', icon: <BadgeRoundedIcon sx={{ fontSize: 20 }} /> },
    { id: 'reports', label: 'Reports', icon: <AssessmentRoundedIcon sx={{ fontSize: 20 }} /> },
  ];

  // Item below horizontal line
  const shiftNavItem: NavItem = {
    id: 'shift',
    label: 'Shift',
    icon: <ScheduleRoundedIcon sx={{ fontSize: 20 }} />,
  };

  // Weekly bar chart data
  const weeklySalesData = [
    { day: 'Mon', sales: 38400, orders: 104 },
    { day: 'Tue', sales: 42100, orders: 112 },
    { day: 'Wed', sales: 35800, orders: 98 },
    { day: 'Thu', sales: 48250, orders: 128, isToday: true },
    { day: 'Fri', sales: 52400, orders: 142 },
    { day: 'Sat', sales: 68900, orders: 186 },
    { day: 'Sun', sales: 62400, orders: 165 },
  ];

  // Monthly bar chart data
  const monthlySalesData = [
    { day: 'Jan', sales: 420000, orders: 1120 },
    { day: 'Feb', sales: 480000, orders: 1240 },
    { day: 'Mar', sales: 510000, orders: 1350 },
    { day: 'Apr', sales: 460000, orders: 1210 },
    { day: 'May', sales: 580000, orders: 1540 },
    { day: 'Jun', sales: 640000, orders: 1720 },
    { day: 'Jul', sales: 710000, orders: 1890, isToday: true },
  ];

  const chartData = chartTimeframe === 'weekly' ? weeklySalesData : monthlySalesData;
  const maxSales = chartTimeframe === 'weekly' ? 75000 : 750000;

  // Recent orders list from screenshot
  const recentOrders = [
    { id: '#1024', customer: 'Rahul', amount: '₹2,499', status: 'Paid', time: '10 mins ago', items: 3 },
    { id: '#1023', customer: 'Amit', amount: '₹1,299', status: 'Paid', time: '25 mins ago', items: 2 },
    { id: '#1022', customer: 'Priya', amount: '₹850', status: 'Paid', time: '42 mins ago', items: 1 },
    { id: '#1021', customer: 'Sneha Patel', amount: '₹3,400', status: 'Paid', time: '1 hour ago', items: 4 },
    { id: '#1020', customer: 'Vikram Shah', amount: '₹1,120', status: 'Paid', time: '2 hours ago', items: 2 },
  ];

  // Manager store notifications
  const notifications = [
    { id: '1', title: 'Ahmedabad Shift Active', desc: 'Amit started morning shift at 08:00 AM.', time: '15m ago' },
    { id: '2', title: 'Daily Target Exceeded', desc: '₹48,250 sales reached today in SP CAFE.', time: '1h ago' },
    { id: '3', title: 'Stock Notice', desc: 'Espresso Blend 1kg has 4 bags remaining.', time: '2h ago' },
  ];

  // Salt and Pepper Theme Colors (#FFFFFF, #D4D4D4, #B3B3B3, #2B2B2B)
  const theme = {
    bgPage: '#FFFFFF',
    bgCard: '#F5F5F7',
    bgCardHover: '#EBEBED',
    bgHeader: '#FFFFFF',
    bgSidebar: '#FFFFFF',
    border: '#D4D4D4',
    borderCard: '#D4D4D4',
    borderHover: '#2B2B2B',
    textPrimary: '#2B2B2B',
    textSecondary: '#71717A',
    textMuted: '#B3B3B3',
    hoverBg: '#F0F0F0',
    activeBg: '#2B2B2B',
    activeText: '#FFFFFF',
    activeIcon: '#FFFFFF',
    badgeBg: '#2B2B2B',
    badgeText: '#FFFFFF',
    badgeBorder: '#2B2B2B',
    secondaryBadgeBg: '#D4D4D4',
    secondaryBadgeText: '#2B2B2B',
    secondaryBadgeBorder: '#D4D4D4',
    barDefault: '#B3B3B3',
    barActive: '#2B2B2B',
    tableHeaderBg: '#EBEBED',
    tableRowHover: '#FAFAFA',
    posBtnBg: '#2B2B2B',
    posBtnText: '#FFFFFF',
    posBtnBorder: '#2B2B2B',
    posBtnShadow: '#D4D4D4',
    livePosBg: '#D4D4D4',
    livePosBorder: '#D4D4D4',
    livePosText: '#2B2B2B',
    popoverBg: '#FFFFFF',
    popoverBorder: '#D4D4D4',
  };

  return (
    <div style={{
      height: '100vh',
      maxHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: theme.bgPage,
      color: theme.textPrimary,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
      boxSizing: 'border-box',
    }}>
      {/* Top Header Bar - Salt & Pepper */}
      <header style={{
        height: '62px',
        backgroundColor: theme.bgHeader,
        borderBottom: `1px solid ${theme.border}`,
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: 30,
      }}>
        {/* Left: Sidebar Toggle + Brand Logo + Manager Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-label="Toggle sidebar"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '0.55rem',
              backgroundColor: 'transparent',
              border: `1px solid ${theme.border}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.textPrimary,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.hoverBg;
              e.currentTarget.style.borderColor = theme.borderHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = theme.border;
            }}
          >
            {isSidebarOpen ? (
              <MenuOpenRoundedIcon sx={{ fontSize: 21, color: theme.textPrimary }} />
            ) : (
              <MenuRoundedIcon sx={{ fontSize: 21, color: theme.textPrimary }} />
            )}
          </button>

          {/* Logo + Brand + Manager Badge */}
          <Link
            href="/manager"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
            }}
          >
            <div style={{
              width: '34px',
              height: '34px',
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
                width={34}
                height={34}
                priority
                style={{ objectFit: 'contain' }}
              />
            </div>
            <span style={{
              fontSize: '21px',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: theme.textPrimary,
            }}>
              Nuradesk
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              backgroundColor: theme.secondaryBadgeBg,
              color: theme.secondaryBadgeText,
              border: `1px solid ${theme.secondaryBadgeBorder}`,
              padding: '2px 8px',
              borderRadius: '9999px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginLeft: '0.25rem',
            }}>
              Manager
            </span>
          </Link>
        </div>

        {/* Right Controls: Switch to Admin Dashboard + POS Terminal + Notifications + Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          {/* Switch to Admin View */}
          <Link
            href="/dashboard"
            title="Switch to Owner / Admin Dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0 0.85rem',
              height: '34px',
              borderRadius: '0.65rem',
              backgroundColor: theme.hoverBg,
              border: `1px solid ${theme.border}`,
              color: theme.textPrimary,
              fontSize: '12.5px',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.borderHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.border;
            }}
          >
            <AdminPanelSettingsRoundedIcon sx={{ fontSize: 16, color: theme.textPrimary }} />
            <span>Admin View</span>
          </Link>

          {/* POS Terminal 3D Button */}
          <Link
            href="/pos"
            role="button"
            style={{
              height: '35px',
              padding: '0 1.1rem',
              fontSize: '13px',
              fontWeight: 800,
              borderRadius: '0.65rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
              backgroundColor: theme.posBtnBg,
              color: theme.posBtnText,
              border: `1px solid ${theme.posBtnBorder}`,
              boxShadow: `0 3px 0 ${theme.posBtnShadow}`,
              transform: 'translateY(0)',
              transition: 'transform 0.1s ease, box-shadow 0.1s ease',
              cursor: 'pointer',
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(2px)';
              e.currentTarget.style.boxShadow = `0 1px 0 ${theme.posBtnShadow}`;
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 3px 0 ${theme.posBtnShadow}`;
            }}
          >
            <span>POS Terminal</span>
            <ArrowOutwardRoundedIcon sx={{ fontSize: 15, color: '#FFFFFF' }} />
          </Link>

          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                setShowNotifications((prev) => !prev);
                setShowProfileMenu(false);
              }}
              title="Store Notifications"
              aria-label="Notifications"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '0.55rem',
                border: `1px solid ${showNotifications ? theme.borderHover : theme.border}`,
                backgroundColor: showNotifications ? theme.hoverBg : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: theme.textPrimary,
                position: 'relative',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.hoverBg;
                e.currentTarget.style.borderColor = theme.borderHover;
              }}
              onMouseLeave={(e) => {
                if (!showNotifications) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = theme.border;
                }
              }}
            >
              <NotificationsNoneRoundedIcon sx={{ fontSize: 21, color: theme.textPrimary }} />
              <span style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: theme.textPrimary,
              }} />
            </button>

            {/* Notifications Dropdown Popover */}
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '320px',
                backgroundColor: theme.popoverBg,
                border: `1px solid ${theme.popoverBorder}`,
                borderRadius: '0.85rem',
                boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
                padding: '0.85rem',
                zIndex: 50,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '0.65rem',
                  borderBottom: `1px solid ${theme.border}`,
                  marginBottom: '0.65rem',
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: theme.textPrimary }}>
                    Store Notifications
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: theme.textPrimary,
                      cursor: 'pointer',
                      display: 'flex',
                    }}
                  >
                    <CloseRoundedIcon sx={{ fontSize: 16, color: theme.textPrimary }} />
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: '0.55rem 0.65rem',
                        borderRadius: '0.5rem',
                        backgroundColor: theme.hoverBg,
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 700, color: theme.textPrimary }}>
                          {n.title}
                        </span>
                        <span style={{ fontSize: '10.5px', color: theme.textMuted }}>
                          {n.time}
                        </span>
                      </div>
                      <p style={{ fontSize: '11.5px', color: theme.textSecondary, margin: '0.25rem 0 0 0', lineHeight: 1.35 }}>
                        {n.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge (Amit - Ahmedabad Store Manager) */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => {
                setShowProfileMenu((prev) => !prev);
                setShowNotifications(false);
              }}
              role="button"
              tabIndex={0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                padding: '4px 10px',
                borderRadius: '0.65rem',
                border: `1px solid ${showProfileMenu ? theme.borderHover : theme.border}`,
                backgroundColor: theme.hoverBg,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.borderHover;
              }}
              onMouseLeave={(e) => {
                if (!showProfileMenu) e.currentTarget.style.borderColor = theme.border;
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: theme.badgeBg,
                color: theme.badgeText,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 800,
              }}>
                AM
              </div>
              <span style={{
                fontSize: '13.5px',
                fontWeight: 700,
                color: theme.textPrimary,
                letterSpacing: '-0.01em',
              }}>
                Amit
              </span>
              <KeyboardArrowDownRoundedIcon sx={{ fontSize: 16, color: theme.textPrimary }} />
            </div>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '240px',
                backgroundColor: theme.popoverBg,
                border: `1px solid ${theme.popoverBorder}`,
                borderRadius: '0.85rem',
                boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
                padding: '0.65rem',
                zIndex: 50,
              }}>
                <div style={{ padding: '0.4rem 0.55rem', borderBottom: `1px solid ${theme.border}`, marginBottom: '0.45rem' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: theme.textPrimary }}>Amit</div>
                  <div style={{ fontSize: '11.5px', color: theme.textSecondary }}>Store Manager • Ahmedabad Store</div>
                </div>
                <Link
                  href="/dashboard"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.55rem',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: theme.textPrimary,
                    borderRadius: '0.45rem',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.hoverBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <AdminPanelSettingsRoundedIcon sx={{ fontSize: 16, color: theme.textPrimary }} />
                  <span>Go to Admin Dashboard</span>
                </Link>
                <Link
                  href="/start-shift"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.55rem',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: theme.textPrimary,
                    borderRadius: '0.45rem',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.hoverBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <StoreRoundedIcon sx={{ fontSize: 16, color: theme.textPrimary }} />
                  <span>Switch Store / Shift</span>
                </Link>
                <Link
                  href="/signin"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.55rem',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: theme.textPrimary,
                    borderRadius: '0.45rem',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.hoverBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <LogoutRoundedIcon sx={{ fontSize: 16, color: theme.textPrimary }} />
                  <span>Log Out</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body Layout: Salt & Pepper Sidebar + Content */}
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Animated Collapsible Sidebar (Exact Manager Nav List) */}
        <aside style={{
          width: isSidebarOpen ? '236px' : '68px',
          minWidth: isSidebarOpen ? '236px' : '68px',
          backgroundColor: theme.bgSidebar,
          borderRight: `1px solid ${theme.border}`,
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: isSidebarOpen ? '1.25rem 0.85rem' : '1.25rem 0.5rem',
          transition: 'width 0.28s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}>
          <div>
            {/* Main Menu List */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {mainNavItems.map((item) => {
                const isActive = activeTabId === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTabId(item.id)}
                    title={!isSidebarOpen ? item.label : undefined}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                      padding: isSidebarOpen ? '0.65rem 0.9rem' : '0.65rem 0',
                      borderRadius: '0.75rem',
                      border: isActive ? `1px solid ${theme.activeBg}` : '1px solid transparent',
                      backgroundColor: isActive ? theme.activeBg : 'transparent',
                      color: isActive ? theme.activeText : theme.textPrimary,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s ease',
                      gap: '0.8rem',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = theme.hoverBg;
                        e.currentTarget.style.borderColor = theme.border;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }
                    }}
                  >
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isActive ? theme.activeIcon : theme.textPrimary,
                    }}>
                      {item.icon}
                    </span>
                    {isSidebarOpen && (
                      <span style={{
                        fontSize: '14px',
                        fontWeight: isActive ? 800 : 600,
                        letterSpacing: '-0.015em',
                        color: isActive ? theme.activeText : theme.textPrimary,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {item.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Horizontal Divider Line */}
            <div style={{
              margin: '1rem 0.5rem',
              borderBottom: `1px solid ${theme.border}`,
            }} />

            {/* Shift Item below line */}
            <button
              type="button"
              onClick={() => {
                setActiveTabId('shift');
                setShowShiftModal(true);
              }}
              title={!isSidebarOpen ? shiftNavItem.label : undefined}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                padding: isSidebarOpen ? '0.65rem 0.9rem' : '0.65rem 0',
                borderRadius: '0.75rem',
                border: activeTabId === 'shift' ? `1px solid ${theme.activeBg}` : '1px solid transparent',
                backgroundColor: activeTabId === 'shift' ? theme.activeBg : 'transparent',
                color: activeTabId === 'shift' ? theme.activeText : theme.textPrimary,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
                gap: '0.8rem',
              }}
              onMouseEnter={(e) => {
                if (activeTabId !== 'shift') {
                  e.currentTarget.style.backgroundColor = theme.hoverBg;
                  e.currentTarget.style.borderColor = theme.border;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTabId !== 'shift') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: activeTabId === 'shift' ? theme.activeIcon : theme.textPrimary,
              }}>
                {shiftNavItem.icon}
              </span>
              {isSidebarOpen && (
                <span style={{
                  fontSize: '14px',
                  fontWeight: activeTabId === 'shift' ? 800 : 600,
                  letterSpacing: '-0.015em',
                  color: activeTabId === 'shift' ? '#000000' : '#FFFFFF',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {shiftNavItem.label}
                </span>
              )}
            </button>
          </div>

          {/* Bottom Store Indicator */}
          <Link
            href="/pos-login"
            style={{ textDecoration: 'none', display: 'block', marginTop: '1.25rem' }}
          >
            {isSidebarOpen ? (
              <div
                style={{
                  height: '46px',
                  backgroundColor: theme.hoverBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  color: theme.textPrimary,
                  fontSize: '13px',
                  fontWeight: 800,
                  letterSpacing: '-0.01em',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.borderHover;
                  e.currentTarget.style.backgroundColor = theme.bgCardHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.backgroundColor = theme.hoverBg;
                }}
              >
                <span style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#22C55E',
                  boxShadow: '0 0 8px #22C55E',
                  display: 'inline-block',
                }} />
                <span>SP CAFE — Live POS</span>
              </div>
            ) : (
              <div
                title="SP CAFE — Live POS"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: theme.hoverBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '0.75rem',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.textPrimary,
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.borderHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                }}
              >
                POS
                <span style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#22C55E',
                }} />
              </div>
            )}
          </Link>
        </aside>

        {/* Main Dashboard Content Area */}
        <main style={{
          flex: 1,
          height: '100%',
          overflowY: 'auto',
          padding: 'clamp(1.5rem, 3vw, 2.5rem)',
          backgroundColor: theme.bgPage,
          boxSizing: 'border-box',
        }}>
          {activeTabId === 'inventory' ? (
            <ManagerInventoryScreen theme={theme} />
          ) : (
            <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
              {/* Header Greeting - Exact text: Good evening, Amit 👋 \n Ahmedabad Store. */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{
                fontSize: '25px',
                fontWeight: 800,
                color: theme.textPrimary,
                letterSpacing: '-0.04em',
                marginBottom: '0.35rem',
              }}>
                Good evening, Amit 👋
              </h1>
              <p style={{
                fontSize: '15px',
                fontWeight: 600,
                color: theme.textSecondary,
                letterSpacing: '-0.01em',
                margin: 0,
              }}>
                Ahmedabad Store.
              </p>
            </div>

            {/* Exactly 3 KPI Cards: Today's Sales | Orders | Customers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}>
              {/* Card 1: Today's Sales */}
              <div
                style={{
                  backgroundColor: theme.bgCard,
                  border: `1px solid ${hoveredCard === 'sales' ? theme.borderHover : theme.borderCard}`,
                  borderRadius: '1.15rem',
                  padding: '1.4rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '124px',
                  boxSizing: 'border-box',
                  transition: 'all 0.18s ease',
                  cursor: 'pointer',
                  transform: hoveredCard === 'sales' ? 'translateY(-2px)' : 'translateY(0)',
                }}
                onMouseEnter={() => setHoveredCard('sales')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: theme.textSecondary, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Today&apos;s Sales
                  </span>
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: 800,
                    backgroundColor: theme.badgeBg,
                    color: theme.badgeText,
                    border: `1px solid ${theme.badgeBorder}`,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    letterSpacing: '0.02em',
                  }}>
                    +12.5%
                  </span>
                </div>
                <div style={{ marginTop: '0.9rem' }}>
                  <span style={{ fontSize: '32px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.045em' }}>
                    ₹48,250
                  </span>
                </div>
              </div>

              {/* Card 2: Orders */}
              <div
                style={{
                  backgroundColor: theme.bgCard,
                  border: `1px solid ${hoveredCard === 'orders' ? theme.borderHover : theme.borderCard}`,
                  borderRadius: '1.15rem',
                  padding: '1.4rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '124px',
                  boxSizing: 'border-box',
                  transition: 'all 0.18s ease',
                  cursor: 'pointer',
                  transform: hoveredCard === 'orders' ? 'translateY(-2px)' : 'translateY(0)',
                }}
                onMouseEnter={() => setHoveredCard('orders')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: theme.textSecondary, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Orders
                  </span>
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: 800,
                    backgroundColor: theme.secondaryBadgeBg,
                    color: theme.secondaryBadgeText,
                    border: `1px solid ${theme.secondaryBadgeBorder}`,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    letterSpacing: '0.02em',
                  }}>
                    +12.5%
                  </span>
                </div>
                <div style={{ marginTop: '0.9rem' }}>
                  <span style={{ fontSize: '32px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.045em' }}>
                    128
                  </span>
                </div>
              </div>

              {/* Card 3: Customers */}
              <div
                style={{
                  backgroundColor: theme.bgCard,
                  border: `1px solid ${hoveredCard === 'customers' ? theme.borderHover : theme.borderCard}`,
                  borderRadius: '1.15rem',
                  padding: '1.4rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '124px',
                  boxSizing: 'border-box',
                  transition: 'all 0.18s ease',
                  cursor: 'pointer',
                  transform: hoveredCard === 'customers' ? 'translateY(-2px)' : 'translateY(0)',
                }}
                onMouseEnter={() => setHoveredCard('customers')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: theme.textSecondary, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Customers
                  </span>
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: 800,
                    backgroundColor: theme.secondaryBadgeBg,
                    color: theme.secondaryBadgeText,
                    border: `1px solid ${theme.secondaryBadgeBorder}`,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    letterSpacing: '0.02em',
                  }}>
                    +12.5%
                  </span>
                </div>
                <div style={{ marginTop: '0.9rem' }}>
                  <span style={{ fontSize: '32px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.045em' }}>
                    843
                  </span>
                </div>
              </div>
            </div>

            {/* Sales Overview Section with Interactive Salt & Pepper Bar Chart */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}>
                <h2 style={{
                  fontSize: '19px',
                  fontWeight: 800,
                  color: theme.textPrimary,
                  letterSpacing: '-0.03em',
                  margin: 0,
                }}>
                  Sales Overview
                </h2>

                {/* Chart Filter Toggle */}
                <div style={{
                  display: 'inline-flex',
                  backgroundColor: theme.bgCard,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '0.65rem',
                  padding: '3px',
                }}>
                  <button
                    type="button"
                    onClick={() => setChartTimeframe('weekly')}
                    style={{
                      padding: '4px 14px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: chartTimeframe === 'weekly' ? theme.activeBg : 'transparent',
                      color: chartTimeframe === 'weekly' ? theme.activeText : theme.textSecondary,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Weekly
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartTimeframe('monthly')}
                    style={{
                      padding: '4px 14px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: chartTimeframe === 'monthly' ? theme.activeBg : 'transparent',
                      color: chartTimeframe === 'monthly' ? theme.activeText : theme.textSecondary,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Bar Chart Container Card */}
              <div style={{
                backgroundColor: theme.bgCard,
                border: `1px solid ${theme.borderCard}`,
                borderRadius: '1.25rem',
                padding: '1.75rem',
                boxSizing: 'border-box',
                position: 'relative',
              }}>
                {/* Bar Chart Header Stats */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.75rem',
                }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: theme.textSecondary }}>
                      {chartTimeframe === 'weekly' ? 'Total Weekly Revenue' : 'Total Monthly Revenue'}
                    </span>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.04em', marginTop: '0.2rem' }}>
                      {chartTimeframe === 'weekly' ? '₹3,48,250' : '₹38,00,000'}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    padding: '4px 11px',
                    borderRadius: '9999px',
                  }}>
                    <TrendingUpRoundedIcon sx={{ fontSize: 16, color: theme.textPrimary }} />
                    <span>+14.8% vs last {chartTimeframe === 'weekly' ? 'week' : 'month'}</span>
                  </div>
                </div>

                {/* SVG & HTML Interactive Salt & Pepper Bar Chart */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  height: '190px',
                  gap: 'clamp(0.75rem, 2vw, 1.75rem)',
                  borderBottom: `1px solid ${theme.border}`,
                  paddingBottom: '10px',
                  position: 'relative',
                }}>
                  {chartData.map((item, index) => {
                    const barHeightPct = (item.sales / maxSales) * 100;
                    const isHovered = hoveredBar === index;
                    const isHighlighted = item.isToday || isHovered;

                    return (
                      <div
                        key={item.day}
                        style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          height: '100%',
                          justifyContent: 'flex-end',
                          position: 'relative',
                        }}
                        onMouseEnter={() => setHoveredBar(index)}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        {/* Interactive Floating Tooltip */}
                        {isHovered && (
                          <div style={{
                            position: 'absolute',
                            bottom: `${Math.min(barHeightPct + 10, 88)}%`,
                            backgroundColor: theme.activeBg,
                            color: theme.activeText,
                            padding: '5px 10px',
                            borderRadius: '0.5rem',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            whiteSpace: 'nowrap',
                            zIndex: 10,
                            pointerEvents: 'none',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px',
                          }}>
                            <span>₹{item.sales.toLocaleString('en-IN')}</span>
                            <span style={{ fontSize: '10px', opacity: 0.75 }}>{item.orders} orders</span>
                          </div>
                        )}

                        {/* Bar Pillar (#B3B3B3 default, #2B2B2B active) */}
                        <div style={{
                          width: '100%',
                          maxWidth: '44px',
                          height: `${barHeightPct}%`,
                          backgroundColor: isHighlighted ? theme.barActive : theme.barDefault,
                          borderRadius: '6px 6px 0 0',
                          transition: 'height 0.3s ease, background-color 0.2s ease',
                          cursor: 'pointer',
                        }} />

                        {/* Day Label */}
                        <span style={{
                          marginTop: '10px',
                          fontSize: '12.5px',
                          fontWeight: item.isToday ? 800 : 600,
                          color: item.isToday ? theme.textPrimary : theme.textSecondary,
                        }}>
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Orders Section */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}>
                <h2 style={{
                  fontSize: '19px',
                  fontWeight: 800,
                  color: theme.textPrimary,
                  letterSpacing: '-0.03em',
                  margin: 0,
                }}>
                  Recent Orders
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTabId('orders')}
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: theme.textPrimary,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  View all orders &gt;&gt;
                </button>
              </div>

              {/* Table Container Card */}
              <div style={{
                backgroundColor: theme.bgCard,
                border: `1px solid ${theme.borderCard}`,
                borderRadius: '1.25rem',
                padding: '0.5rem',
                boxSizing: 'border-box',
                overflowX: 'auto',
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                  fontSize: '14px',
                }}>
                  <thead>
                    <tr style={{
                      borderBottom: `1px solid ${theme.border}`,
                      backgroundColor: theme.tableHeaderBg,
                      borderRadius: '0.75rem',
                    }}>
                      <th style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11.5px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Order
                      </th>
                      <th style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11.5px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Customer
                      </th>
                      <th style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11.5px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Amount
                      </th>
                      <th style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11.5px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, i) => (
                      <tr
                        key={order.id}
                        style={{
                          borderBottom: i < recentOrders.length - 1 ? `1px solid ${theme.border}` : 'none',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.tableRowHover; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <td style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: theme.textPrimary, fontFamily: 'monospace, inherit' }}>
                          {order.id}
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem', fontWeight: 600, color: theme.textPrimary }}>
                          {order.customer}
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: theme.textPrimary }}>
                          {order.amount}
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            backgroundColor: theme.badgeBg,
                            color: theme.badgeText,
                            fontSize: '11px',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                          }}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          )}
        </main>
      </div>

      {/* Shift Details Modal */}
      {showShiftModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '440px',
            backgroundColor: '#FFFFFF',
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            padding: '1.75rem',
            boxShadow: '0 20px 48px rgba(0,0,0,0.18)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ScheduleRoundedIcon sx={{ fontSize: 22, color: theme.textPrimary }} />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Active Shift Summary
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShiftModal(false)}
                style={{ background: 'none', border: 'none', color: theme.textPrimary, cursor: 'pointer' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: theme.bgCard, borderRadius: '0.65rem', border: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '13px', color: theme.textSecondary }}>Manager on Duty</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: theme.textPrimary }}>Amit (SP CAFE)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: theme.bgCard, borderRadius: '0.65rem', border: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '13px', color: theme.textSecondary }}>Shift Started</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: theme.textPrimary }}>Today, 08:00 AM</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: theme.bgCard, borderRadius: '0.65rem', border: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '13px', color: theme.textSecondary }}>Opening Cash Float</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: theme.textPrimary }}>₹5,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: theme.bgCard, borderRadius: '0.65rem', border: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '13px', color: theme.textSecondary }}>Current Cash in Drawer</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: theme.textPrimary }}>₹28,450</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link
                href="/start-shift"
                style={{
                  flex: 1,
                  height: '42px',
                  borderRadius: '0.75rem',
                  fontSize: '13px',
                  fontWeight: 700,
                  backgroundColor: theme.activeBg,
                  color: theme.activeText,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Reconcile & Close Shift
              </Link>
              <button
                type="button"
                onClick={() => setShowShiftModal(false)}
                style={{
                  padding: '0 1rem',
                  height: '42px',
                  borderRadius: '0.75rem',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.bgCard,
                  color: theme.textPrimary,
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
