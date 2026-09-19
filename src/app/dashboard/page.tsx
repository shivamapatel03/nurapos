'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Material Rounded Icons
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import WarehouseRoundedIcon from '@mui/icons-material/WarehouseRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import StoreRoundedIcon from '@mui/icons-material/StoreRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

// Submenu Rounded Icons
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import AssignmentReturnRoundedIcon from '@mui/icons-material/AssignmentReturnRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import BrandingWatermarkRoundedIcon from '@mui/icons-material/BrandingWatermarkRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';

interface SubNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  subItems?: SubNavItem[];
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // Sidebar collapse/expand state with smooth animation
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Accordion state for expandable menu items
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    sales: true,
    catalog: false,
    inventory: false,
    reports: false,
  });

  const [activeTabId, setActiveTabId] = useState('dashboard');
  const [chartTimeframe, setChartTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardRoundedIcon sx={{ fontSize: 20 }} /> },
    {
      id: 'sales',
      label: 'Sales',
      icon: <PointOfSaleRoundedIcon sx={{ fontSize: 20 }} />,
      subItems: [
        { id: 'orders', label: 'Orders', icon: <ReceiptLongRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'returns', label: 'Returns', icon: <AssignmentReturnRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'payments', label: 'Payments', icon: <PaymentsRoundedIcon sx={{ fontSize: 16 }} /> },
      ],
    },
    {
      id: 'catalog',
      label: 'Catalog',
      icon: <CategoryRoundedIcon sx={{ fontSize: 20 }} />,
      subItems: [
        { id: 'products', label: 'Products', icon: <Inventory2RoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'categories', label: 'Categories', icon: <GridViewRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'brands', label: 'Brands', icon: <BrandingWatermarkRoundedIcon sx={{ fontSize: 16 }} /> },
      ],
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <WarehouseRoundedIcon sx={{ fontSize: 20 }} />,
      subItems: [
        { id: 'stock', label: 'Stock', icon: <LayersRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'adjustment', label: 'Stock Adjustment', icon: <TuneRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'po', label: 'Purchase Orders', icon: <LocalShippingRoundedIcon sx={{ fontSize: 16 }} /> },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <AssessmentRoundedIcon sx={{ fontSize: 20 }} />,
      subItems: [
        { id: 'rep_sales', label: 'Sales', icon: <BarChartRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'rep_inventory', label: 'Inventory', icon: <LayersRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'rep_customers', label: 'Customers', icon: <PersonOutlineRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'rep_performance', label: 'Employee Performance', icon: <BadgeRoundedIcon sx={{ fontSize: 16 }} /> },
      ],
    },
    { id: 'employees', label: 'Employees', icon: <PeopleAltRoundedIcon sx={{ fontSize: 20 }} /> },
    { id: 'customers', label: 'Customers', icon: <PersonOutlineRoundedIcon sx={{ fontSize: 20 }} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsRoundedIcon sx={{ fontSize: 20 }} /> },
  ];

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

  // Recent orders list
  const recentOrders = [
    { id: '#1024', customer: 'Rahul', amount: '₹2,499', status: 'PAID', time: '10 mins ago', items: 3 },
    { id: '#1023', customer: 'Amit', amount: '₹1,299', status: 'PAID', time: '25 mins ago', items: 2 },
    { id: '#1022', customer: 'Priya', amount: '₹850', status: 'PAID', time: '42 mins ago', items: 1 },
    { id: '#1021', customer: 'Sneha Patel', amount: '₹3,400', status: 'PAID', time: '1 hour ago', items: 4 },
    { id: '#1020', customer: 'Vikram Shah', amount: '₹1,120', status: 'PAID', time: '2 hours ago', items: 2 },
  ];

  // System notifications (Strictly monochrome)
  const notifications = [
    { id: '1', title: 'Daily Target Reached', desc: '₹48,250 in sales exceeded today’s projection.', time: '15m ago' },
    { id: '2', title: 'Low Stock Alert', desc: 'Espresso Blend 1kg is down to 4 units in SP CAFE.', time: '1h ago' },
    { id: '3', title: 'Register Shift Reconciled', desc: 'Shift #42 was closed and verified by Alex Vance.', time: '3h ago' },
  ];

  // PURE TOTALLY BLACK THEME (No Light/Dark modes, 100% Black canvas with pure White text & icons)
  const theme = {
    bgPage: '#000000',
    bgCard: '#0A0A0A',
    bgCardHover: '#141414',
    bgHeader: '#000000',
    bgSidebar: '#000000',
    border: '#1F1F1F',
    borderCard: '#242424',
    borderHover: '#FFFFFF',
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    hoverBg: '#18181B',
    activeBg: '#FFFFFF',
    activeText: '#000000',
    activeIcon: '#000000',
    badgeBg: '#FFFFFF',
    badgeText: '#000000',
    badgeBorder: '#FFFFFF',
    secondaryBadgeBg: '#18181B',
    secondaryBadgeText: '#FFFFFF',
    secondaryBadgeBorder: '#2E2E32',
    barDefault: '#262626',
    barActive: '#FFFFFF',
    barHover: '#FFFFFF',
    tableHeaderBg: '#0D0D0D',
    tableRowHover: '#141414',
    posBtnBg: '#FFFFFF',
    posBtnText: '#000000',
    posBtnBorder: '#FFFFFF',
    posBtnShadow: '#888888',
    livePosBg: '#0A0A0A',
    livePosBorder: '#2A2A2A',
    livePosText: '#FFFFFF',
    popoverBg: '#0A0A0A',
    popoverBorder: '#2A2A2A',
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
      {/* Top Header Bar - Totally Black */}
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
        {/* Left: Sidebar Toggle + Brand Logo */}
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
              color: '#FFFFFF',
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
              <MenuOpenRoundedIcon sx={{ fontSize: 21, color: '#FFFFFF' }} />
            ) : (
              <MenuRoundedIcon sx={{ fontSize: 21, color: '#FFFFFF' }} />
            )}
          </button>

          {/* Logo + Name in Pure White */}
          <Link
            href="/dashboard"
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
              backgroundColor: '#FFFFFF',
              padding: '2px',
              flexShrink: 0,
            }}>
              <Image
                src="/logo.png"
                alt="Nuradesk Logo"
                width={30}
                height={30}
                priority
                style={{ objectFit: 'contain' }}
              />
            </div>
            <span style={{
              fontSize: '21px',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: '#FFFFFF',
            }}>
              Nuradesk
            </span>
          </Link>
        </div>

        {/* Right Controls: Manager View + POS Terminal Button + Bell + Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Switch to Manager View Button */}
          <Link
            href="/manager"
            title="Switch to Store Manager Dashboard (Amit)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0 0.85rem',
              height: '34px',
              borderRadius: '0.65rem',
              backgroundColor: '#121214',
              border: '1px solid #27272A',
              color: '#D4D4D8',
              fontSize: '12.5px',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#FFFFFF';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#27272A';
              e.currentTarget.style.color = '#D4D4D8';
            }}
          >
            <span>Manager View</span>
            <ArrowOutwardRoundedIcon sx={{ fontSize: 13 }} />
          </Link>

          {/* POS Terminal Link 3D Tactile Button */}
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
              e.currentTarget.style.boxShadow = '0 1px 0 #888888';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 3px 0 #888888';
            }}
          >
            <span>POS Terminal</span>
            <ArrowOutwardRoundedIcon sx={{ fontSize: 15, color: '#000000' }} />
          </Link>

          {/* AI Assistant Icon Button (Future Integration) */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                setShowAiModal((prev) => !prev);
                setShowNotifications(false);
                setShowProfileMenu(false);
              }}
              title="Nuradesk AI Assistant (Future Integration)"
              aria-label="AI Assistant"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '0.55rem',
                border: `1px solid ${showAiModal ? '#FFFFFF' : theme.border}`,
                backgroundColor: showAiModal ? theme.hoverBg : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFFFFF',
                position: 'relative',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.hoverBg;
                e.currentTarget.style.borderColor = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                if (!showAiModal) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = theme.border;
                }
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
            </button>

            {/* AI Assistant Popover (Future Integration Preview) */}
            {showAiModal && (
              <div style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '320px',
                backgroundColor: theme.popoverBg,
                border: `1px solid ${theme.popoverBorder}`,
                borderRadius: '0.85rem',
                boxShadow: '0 12px 36px rgba(0,0,0,0.85)',
                padding: '1rem',
                zIndex: 50,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '0.65rem',
                  borderBottom: `1px solid ${theme.border}`,
                  marginBottom: '0.75rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <AutoAwesomeRoundedIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>Nuradesk AI</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      backgroundColor: '#FFFFFF',
                      color: '#000000',
                      padding: '2px 7px',
                      borderRadius: '9999px',
                    }}>
                      Coming Soon
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAiModal(false)}
                      style={{ background: 'none', border: 'none', color: '#A1A1AA', cursor: 'pointer', display: 'flex', padding: '2px' }}
                    >
                      <CloseRoundedIcon sx={{ fontSize: 16 }} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '12.5px', color: '#A1A1AA', lineHeight: 1.5, margin: '0 0 0.85rem 0' }}>
                  AI-powered retail intelligence and autonomous assistant ready for future integrations.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{
                    padding: '0.6rem 0.75rem',
                    backgroundColor: '#121214',
                    borderRadius: '0.55rem',
                    border: '1px solid #242424',
                    fontSize: '12px',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFFFFF', flexShrink: 0 }} />
                    <span>Smart Inventory & Restock Forecasting</span>
                  </div>
                  <div style={{
                    padding: '0.6rem 0.75rem',
                    backgroundColor: '#121214',
                    borderRadius: '0.55rem',
                    border: '1px solid #242424',
                    fontSize: '12px',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFFFFF', flexShrink: 0 }} />
                    <span>Real-time Sales Anomaly Detection</span>
                  </div>
                  <div style={{
                    padding: '0.6rem 0.75rem',
                    backgroundColor: '#121214',
                    borderRadius: '0.55rem',
                    border: '1px solid #242424',
                    fontSize: '12px',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFFFFF', flexShrink: 0 }} />
                    <span>Conversational Sales & Analytics Copilot</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notification Bell (Pure White Icon & White Indicator) */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                setShowNotifications((prev) => !prev);
                setShowProfileMenu(false);
                setShowAiModal(false);
              }}
              title="Store Notifications"
              aria-label="Notifications"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '0.55rem',
                border: `1px solid ${showNotifications ? '#FFFFFF' : theme.border}`,
                backgroundColor: showNotifications ? theme.hoverBg : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFFFFF',
                position: 'relative',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.hoverBg;
                e.currentTarget.style.borderColor = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                if (!showNotifications) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = theme.border;
                }
              }}
            >
              <NotificationsNoneRoundedIcon sx={{ fontSize: 21, color: '#FFFFFF' }} />
              {/* White Indicator Dot */}
              <span style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
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
                boxShadow: '0 12px 36px rgba(0,0,0,0.85)',
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
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                    Notifications
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                    }}
                  >
                    <CloseRoundedIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
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
                        <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#FFFFFF' }}>
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

          {/* User Profile Badge (White Text & Icons) */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => {
                setShowProfileMenu((prev) => !prev);
                setShowNotifications(false);
                setShowAiModal(false);
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
                border: `1px solid ${showProfileMenu ? '#FFFFFF' : theme.border}`,
                backgroundColor: theme.bgCard,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                if (!showProfileMenu) e.currentTarget.style.borderColor = theme.border;
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 800,
              }}>
                RS
              </div>
              <span style={{
                fontSize: '13.5px',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '-0.01em',
              }}>
                Rahul Sharma
              </span>
              <KeyboardArrowDownRoundedIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
            </div>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '240px',
                backgroundColor: theme.popoverBg,
                border: `1px solid ${theme.popoverBorder}`,
                borderRadius: '0.85rem',
                boxShadow: '0 12px 36px rgba(0,0,0,0.85)',
                padding: '0.65rem',
                zIndex: 50,
              }}>
                <div style={{ padding: '0.4rem 0.55rem', borderBottom: `1px solid ${theme.border}`, marginBottom: '0.45rem' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>Rahul Sharma</div>
                  <div style={{ fontSize: '11.5px', color: theme.textSecondary }}>Owner • SP CAFE</div>
                </div>
                <Link
                  href="/manager"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.55rem',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    borderRadius: '0.45rem',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.hoverBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <StoreRoundedIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
                  <span>Manager View (Ahmedabad)</span>
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
                    color: '#FFFFFF',
                    borderRadius: '0.45rem',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.hoverBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <StoreRoundedIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
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
                    color: '#FFFFFF',
                    borderRadius: '0.45rem',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.hoverBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <LogoutRoundedIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
                  <span>Log Out</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body Layout: Totally Black Animated Sidebar + Main Scrollable Area */}
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Animated Collapsible Sidebar - TOTALLY BLACK */}
        <aside style={{
          width: isSidebarOpen ? '236px' : '68px',
          minWidth: isSidebarOpen ? '236px' : '68px',
          backgroundColor: '#000000',
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
          {/* Navigation Links List */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {navItems.map((item) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedMenus[item.id] ?? false;
              // Only leaf navigation items (without sub-items) can be selected as a parent tab
              const isActive = !hasSubItems && activeTabId === item.id;

              return (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (hasSubItems) {
                        toggleMenu(item.id);
                      } else {
                        setActiveTabId(item.id);
                      }
                    }}
                    title={!isSidebarOpen ? item.label : undefined}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isSidebarOpen ? 'space-between' : 'center',
                      padding: isSidebarOpen ? '0.65rem 0.9rem' : '0.65rem 0',
                      borderRadius: '0.75rem',
                      border: isActive ? '1px solid #FFFFFF' : '1px solid transparent',
                      backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                      color: isActive ? '#000000' : '#FFFFFF',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#18181B';
                        e.currentTarget.style.borderColor = '#2A2A2A';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      minWidth: 0,
                    }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? '#000000' : '#FFFFFF',
                      }}>
                        {item.icon}
                      </span>
                      {isSidebarOpen && (
                        <span style={{
                          fontSize: '14px',
                          fontWeight: isActive ? 800 : 600,
                          letterSpacing: '-0.015em',
                          color: isActive ? '#000000' : '#FFFFFF',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {item.label}
                        </span>
                      )}
                    </div>

                    {/* Submenu Accordion Chevron in White */}
                    {hasSubItems && isSidebarOpen && (
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: isActive ? '#000000' : '#FFFFFF',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}>
                        <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18, color: isActive ? '#000000' : '#FFFFFF' }} />
                      </span>
                    )}
                  </button>

                  {/* Submenu List with Icons */}
                  {hasSubItems && isExpanded && isSidebarOpen && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                      paddingLeft: '0.85rem',
                      paddingTop: '0.35rem',
                      paddingBottom: '0.35rem',
                      borderLeft: '1px solid #262626',
                      marginLeft: '1.4rem',
                    }}>
                      {item.subItems?.map((sub) => {
                        const isSubActive = activeTabId === sub.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => setActiveTabId(sub.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.65rem',
                              textAlign: 'left',
                              padding: '0.45rem 0.65rem',
                              borderRadius: '0.55rem',
                              border: isSubActive ? '1px solid #FFFFFF' : '1px solid transparent',
                              backgroundColor: isSubActive ? '#FFFFFF' : 'transparent',
                              color: isSubActive ? '#000000' : '#FFFFFF',
                              fontSize: '13px',
                              fontWeight: isSubActive ? 800 : 500,
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              if (!isSubActive) {
                                e.currentTarget.style.backgroundColor = '#18181B';
                                e.currentTarget.style.color = '#FFFFFF';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSubActive) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#FFFFFF';
                              }
                            }}
                          >
                            <span style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: isSubActive ? '#000000' : '#FFFFFF',
                            }}>
                              {sub.icon}
                            </span>
                            <span style={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}>
                              {sub.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom Sidebar Store Indicator (Totally Black, Pure White Text & Green Live Pulse) */}
          <Link
            href="/pos-login"
            style={{ textDecoration: 'none', display: 'block', marginTop: '1.25rem' }}
          >
            {isSidebarOpen ? (
              <div
                style={{
                  height: '46px',
                  backgroundColor: '#0A0A0A',
                  border: '1px solid #27272A',
                  borderRadius: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 800,
                  letterSpacing: '-0.01em',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FFFFFF';
                  e.currentTarget.style.backgroundColor = '#141416';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#27272A';
                  e.currentTarget.style.backgroundColor = '#0A0A0A';
                }}
              >
                {/* Live Pulse Dot */}
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
                  backgroundColor: '#0A0A0A',
                  border: '1px solid #27272A',
                  borderRadius: '0.75rem',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#27272A';
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

        {/* Main Dashboard Content Area - TOTALLY BLACK */}
        <main style={{
          flex: 1,
          height: '100%',
          overflowY: 'auto',
          padding: 'clamp(1.5rem, 3vw, 2.5rem)',
          backgroundColor: '#000000',
          boxSizing: 'border-box',
        }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
            {/* Header Greeting in Pure White */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{
                fontSize: '25px',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.04em',
                marginBottom: '0.35rem',
              }}>
                Good evening, Rahul 👋
              </h1>
              <p style={{
                fontSize: '14.5px',
                fontWeight: 500,
                color: '#A1A1AA',
                letterSpacing: '-0.01em',
                margin: 0,
              }}>
                Here&apos;s what&apos;s happening in your store today.
              </p>
            </div>

            {/* 4 Metric KPI Cards Grid - Totally Black Cards, Pure White Text & Numbers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}>
              {/* Card 1: Sales */}
              <div
                style={{
                  backgroundColor: '#0A0A0A',
                  border: `1px solid ${hoveredCard === 'sales' ? '#FFFFFF' : '#242424'}`,
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
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#A1A1AA', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Sales
                  </span>
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: 800,
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    border: '1px solid #FFFFFF',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    letterSpacing: '0.02em',
                  }}>
                    +12.5%
                  </span>
                </div>
                <div style={{ marginTop: '0.9rem' }}>
                  <span style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.045em' }}>
                    ₹48,250
                  </span>
                </div>
              </div>

              {/* Card 2: Orders */}
              <div
                style={{
                  backgroundColor: '#0A0A0A',
                  border: `1px solid ${hoveredCard === 'orders' ? '#FFFFFF' : '#242424'}`,
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
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#A1A1AA', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Orders
                  </span>
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: 800,
                    backgroundColor: '#18181B',
                    color: '#FFFFFF',
                    border: '1px solid #2E2E32',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    letterSpacing: '0.02em',
                  }}>
                    +12.5%
                  </span>
                </div>
                <div style={{ marginTop: '0.9rem' }}>
                  <span style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.045em' }}>
                    128
                  </span>
                </div>
              </div>

              {/* Card 3: Products */}
              <div
                style={{
                  backgroundColor: '#0A0A0A',
                  border: `1px solid ${hoveredCard === 'products' ? '#FFFFFF' : '#242424'}`,
                  borderRadius: '1.15rem',
                  padding: '1.4rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '124px',
                  boxSizing: 'border-box',
                  transition: 'all 0.18s ease',
                  cursor: 'pointer',
                  transform: hoveredCard === 'products' ? 'translateY(-2px)' : 'translateY(0)',
                }}
                onMouseEnter={() => setHoveredCard('products')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#A1A1AA', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Products
                  </span>
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: 800,
                    backgroundColor: '#18181B',
                    color: '#FFFFFF',
                    border: '1px solid #2E2E32',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    letterSpacing: '0.02em',
                  }}>
                    +12.5%
                  </span>
                </div>
                <div style={{ marginTop: '0.9rem' }}>
                  <span style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.045em' }}>
                    843
                  </span>
                </div>
              </div>

              {/* Card 4: Staff */}
              <div
                style={{
                  backgroundColor: '#0A0A0A',
                  border: `1px solid ${hoveredCard === 'staff' ? '#FFFFFF' : '#242424'}`,
                  borderRadius: '1.15rem',
                  padding: '1.4rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '124px',
                  boxSizing: 'border-box',
                  transition: 'all 0.18s ease',
                  cursor: 'pointer',
                  transform: hoveredCard === 'staff' ? 'translateY(-2px)' : 'translateY(0)',
                }}
                onMouseEnter={() => setHoveredCard('staff')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#A1A1AA', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Staff
                  </span>
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: 800,
                    backgroundColor: '#18181B',
                    color: '#FFFFFF',
                    border: '1px solid #2E2E32',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    letterSpacing: '0.02em',
                  }}>
                    +12.5%
                  </span>
                </div>
                <div style={{ marginTop: '0.9rem' }}>
                  <span style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.045em' }}>
                    12
                  </span>
                </div>
              </div>
            </div>

            {/* Sales Overview Section with Interactive High-Contrast Monochrome Bar Chart */}
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
                  color: '#FFFFFF',
                  letterSpacing: '-0.03em',
                  margin: 0,
                }}>
                  Sales Overview
                </h2>

                {/* Chart Filter Toggle (High-contrast B&W segmented pill) */}
                <div style={{
                  display: 'inline-flex',
                  backgroundColor: '#0A0A0A',
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
                      backgroundColor: chartTimeframe === 'weekly' ? '#FFFFFF' : 'transparent',
                      color: chartTimeframe === 'weekly' ? '#000000' : '#A1A1AA',
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
                      backgroundColor: chartTimeframe === 'monthly' ? '#FFFFFF' : 'transparent',
                      color: chartTimeframe === 'monthly' ? '#000000' : '#A1A1AA',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Bar Chart Container Card - Totally Black Card, Crisp Hairline Border */}
              <div style={{
                backgroundColor: '#0A0A0A',
                border: '1px solid #242424',
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
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#A1A1AA' }}>
                      {chartTimeframe === 'weekly' ? 'Total Weekly Revenue' : 'Total Monthly Revenue'}
                    </span>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.04em', marginTop: '0.2rem' }}>
                      {chartTimeframe === 'weekly' ? '₹3,48,250' : '₹38,00,000'}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    backgroundColor: '#18181B',
                    border: '1px solid #2E2E32',
                    color: '#FFFFFF',
                    padding: '4px 11px',
                    borderRadius: '9999px',
                  }}>
                    <TrendingUpRoundedIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
                    <span>+14.8% vs last {chartTimeframe === 'weekly' ? 'week' : 'month'}</span>
                  </div>
                </div>

                {/* SVG & HTML Interactive Monochrome Bar Chart */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  height: '190px',
                  gap: 'clamp(0.75rem, 2vw, 1.75rem)',
                  borderBottom: '1px solid #222222',
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
                            backgroundColor: '#FFFFFF',
                            color: '#000000',
                            padding: '5px 10px',
                            borderRadius: '0.5rem',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            whiteSpace: 'nowrap',
                            zIndex: 10,
                            pointerEvents: 'none',
                            boxShadow: '0 4px 16px rgba(255,255,255,0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px',
                          }}>
                            <span>₹{item.sales.toLocaleString('en-IN')}</span>
                            <span style={{ fontSize: '10px', opacity: 0.75 }}>{item.orders} orders</span>
                          </div>
                        )}

                        {/* Bar Pillar */}
                        <div style={{
                          width: '100%',
                          maxWidth: '44px',
                          height: `${barHeightPct}%`,
                          backgroundColor: isHighlighted ? '#FFFFFF' : '#262626',
                          borderRadius: '6px 6px 0 0',
                          transition: 'height 0.3s ease, background-color 0.2s ease',
                          cursor: 'pointer',
                        }} />

                        {/* Day Label in Pure White */}
                        <span style={{
                          marginTop: '10px',
                          fontSize: '12.5px',
                          fontWeight: item.isToday ? 800 : 600,
                          color: '#FFFFFF',
                        }}>
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Orders Section - Totally Black Table Container */}
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
                  color: '#FFFFFF',
                  letterSpacing: '-0.03em',
                  margin: 0,
                }}>
                  Recent Orders
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTabId('orders');
                    setExpandedMenus((prev) => ({ ...prev, sales: true }));
                  }}
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#FFFFFF',
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
                backgroundColor: '#0A0A0A',
                border: '1px solid #242424',
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
                      <th style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: '#A1A1AA', fontSize: '11.5px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Order ID
                      </th>
                      <th style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: '#A1A1AA', fontSize: '11.5px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Customer
                      </th>
                      <th style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: '#A1A1AA', fontSize: '11.5px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Items
                      </th>
                      <th style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: '#A1A1AA', fontSize: '11.5px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Amount
                      </th>
                      <th style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: '#A1A1AA', fontSize: '11.5px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Status
                      </th>
                      <th style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: '#A1A1AA', fontSize: '11.5px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Time
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
                        <td style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace, inherit' }}>
                          {order.id}
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem', fontWeight: 600, color: '#FFFFFF' }}>
                          {order.customer}
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem', fontWeight: 500, color: '#A1A1AA' }}>
                          {order.items} items
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
                          {order.amount}
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            backgroundColor: '#FFFFFF',
                            color: '#000000',
                            fontSize: '11px',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                          }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem', fontSize: '13px', color: '#A1A1AA' }}>
                          {order.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
