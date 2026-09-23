'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Material Rounded Icons
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
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
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';

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
import InventoryManagement from '@/components/admin/InventoryManagement';
import ProductManagement from '@/components/admin/ProductManagement';
import ReportsManagement from '@/components/admin/ReportsManagement';
import SalesManagement from '@/components/admin/SalesManagement';
import EmployeesManagement from '@/components/admin/EmployeesManagement';
import CustomersManagement from '@/components/admin/CustomersManagement';
import SettingsManagement from '@/components/admin/SettingsManagement';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded';
import GroupWorkRoundedIcon from '@mui/icons-material/GroupWorkRounded';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import { ThemeId, ThemeMode, APP_THEMES, getStoredThemeMode, setStoredThemeMode } from '@/lib/themeConfig';

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

  // Accordion state for expandable menu items (only one menu open at a time)
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    sales: false,
    catalog: false,
    inventory: false,
    reports: false,
    employees: false,
    customers: false,
    settings: false,
  });

  const [activeTabId, setActiveTabId] = useState('dashboard');
  const [chartTimeframe, setChartTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showWhatsNewModal, setShowWhatsNewModal] = useState(false);

  const isSettingsActive =
    activeTabId === 'settings' ||
    activeTabId === 'set_store' ||
    activeTabId === 'set_business' ||
    activeTabId === 'set_tax' ||
    activeTabId === 'set_payments' ||
    activeTabId === 'set_hardware' ||
    activeTabId === 'set_pos' ||
    activeTabId === 'set_notifications' ||
    activeTabId === 'set_users' ||
    activeTabId === 'set_security' ||
    activeTabId === 'set_appearance';

  const isCustomersActive =
    activeTabId === 'customers' ||
    activeTabId === 'cust_all' ||
    activeTabId === 'cust_history' ||
    activeTabId === 'cust_loyalty' ||
    activeTabId === 'cust_groups' ||
    activeTabId === 'cust_feedback';

  const isEmployeesActive =
    activeTabId === 'employees' ||
    activeTabId === 'emp_all' ||
    activeTabId === 'emp_cashiers' ||
    activeTabId === 'emp_managers' ||
    activeTabId === 'emp_roles' ||
    activeTabId === 'emp_shifts' ||
    activeTabId === 'emp_attendance' ||
    activeTabId === 'emp_performance';

  const isSalesActive =
    activeTabId === 'sales' ||
    activeTabId === 'orders' ||
    activeTabId === 'returns' ||
    activeTabId === 'payments';

  const isInventoryActive =
    activeTabId === 'inventory' ||
    activeTabId === 'stock' ||
    activeTabId === 'adjustment' ||
    activeTabId === 'po';

  const isCatalogActive =
    activeTabId === 'catalog' ||
    activeTabId === 'products' ||
    activeTabId === 'categories' ||
    activeTabId === 'brands';

  const isReportsActive =
    activeTabId === 'reports' ||
    activeTabId === 'rep_sales' ||
    activeTabId === 'rep_inventory' ||
    activeTabId === 'rep_customers' ||
    activeTabId === 'rep_performance';

  // Accordion navigation helpers: only ONE menu expanded at a time
  const openSingleMenu = (menuId: string) => {
    setExpandedMenus({
      sales: menuId === 'sales',
      catalog: menuId === 'catalog',
      inventory: menuId === 'inventory',
      reports: menuId === 'reports',
      employees: menuId === 'employees',
      customers: menuId === 'customers',
      settings: menuId === 'settings',
    });
  };

  const closeAllMenus = () => {
    setExpandedMenus({
      sales: false,
      catalog: false,
      inventory: false,
      reports: false,
      employees: false,
      customers: false,
      settings: false,
    });
  };

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => {
      const isCurrentlyOpen = !!prev[menuId];
      if (isCurrentlyOpen) {
        // Toggle closed
        return {
          sales: false,
          catalog: false,
          inventory: false,
          reports: false,
          employees: false,
          customers: false,
          settings: false,
        };
      }
      // Open this menu and automatically close all other menus
      return {
        sales: menuId === 'sales',
        catalog: menuId === 'catalog',
        inventory: menuId === 'inventory',
        reports: menuId === 'reports',
        employees: menuId === 'employees',
        customers: menuId === 'customers',
        settings: menuId === 'settings',
      };
    });
  };

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Home', icon: <HomeRoundedIcon sx={{ fontSize: 18 }} /> },
    {
      id: 'sales',
      label: 'Sales',
      icon: <PointOfSaleRoundedIcon sx={{ fontSize: 18 }} />,
      subItems: [
        { id: 'orders', label: 'Orders', icon: <ReceiptLongRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'returns', label: 'Returns', icon: <AssignmentReturnRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'payments', label: 'Payments', icon: <PaymentsRoundedIcon sx={{ fontSize: 14 }} /> },
      ],
    },
    {
      id: 'catalog',
      label: 'Catalog',
      icon: <CategoryRoundedIcon sx={{ fontSize: 18 }} />,
      subItems: [
        { id: 'products', label: 'Products', icon: <Inventory2RoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'categories', label: 'Categories', icon: <GridViewRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'brands', label: 'Brands', icon: <BrandingWatermarkRoundedIcon sx={{ fontSize: 14 }} /> },
      ],
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <WarehouseRoundedIcon sx={{ fontSize: 18 }} />,
      subItems: [
        { id: 'stock', label: 'Stock', icon: <LayersRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'adjustment', label: 'Stock Adjustment', icon: <TuneRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'po', label: 'Purchase Orders', icon: <LocalShippingRoundedIcon sx={{ fontSize: 14 }} /> },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <AssessmentRoundedIcon sx={{ fontSize: 18 }} />,
      subItems: [
        { id: 'rep_sales', label: 'Sales', icon: <BarChartRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'rep_inventory', label: 'Inventory', icon: <LayersRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'rep_customers', label: 'Customers', icon: <PersonOutlineRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'rep_performance', label: 'Employee Performance', icon: <BadgeRoundedIcon sx={{ fontSize: 14 }} /> },
      ],
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: <PeopleAltRoundedIcon sx={{ fontSize: 18 }} />,
      subItems: [
        { id: 'emp_all', label: 'All Employees', icon: <PeopleAltRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'emp_cashiers', label: 'Cashiers', icon: <PointOfSaleRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'emp_managers', label: 'Managers', icon: <AdminPanelSettingsRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'emp_roles', label: 'Roles & Permissions', icon: <SecurityRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'emp_shifts', label: 'Shifts', icon: <ScheduleRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'emp_attendance', label: 'Attendance', icon: <EventAvailableRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'emp_performance', label: 'Employee Performance', icon: <TrendingUpRoundedIcon sx={{ fontSize: 14 }} /> },
      ],
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: <PersonOutlineRoundedIcon sx={{ fontSize: 18 }} />,
      subItems: [
        { id: 'cust_all', label: 'All Customers', icon: <PeopleAltRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'cust_history', label: 'Purchase History', icon: <ReceiptLongRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'cust_loyalty', label: 'Loyalty & Rewards', icon: <CardGiftcardRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'cust_groups', label: 'Customer Groups', icon: <GroupWorkRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'cust_feedback', label: 'Feedback & Reviews', icon: <RateReviewRoundedIcon sx={{ fontSize: 14 }} /> },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsRoundedIcon sx={{ fontSize: 18 }} />,
      subItems: [
        { id: 'set_store', label: 'Store Profile', icon: <StoreRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'set_business', label: 'Business Settings', icon: <TuneRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'set_tax', label: 'Tax & Invoicing', icon: <ReceiptLongRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'set_payments', label: 'Payments', icon: <PaymentsRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'set_hardware', label: 'Hardware', icon: <PrintRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'set_pos', label: 'POS Settings', icon: <PointOfSaleRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'set_notifications', label: 'Notifications', icon: <NotificationsNoneRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'set_users', label: 'Users & Permissions', icon: <SecurityRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'set_security', label: 'Security', icon: <LockRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'set_appearance', label: 'Appearance', icon: <PaletteRoundedIcon sx={{ fontSize: 14 }} /> },
      ],
    },
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

  // Dynamic Admin Dark / Light Mode State
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  // Load saved theme on mount and keep in sync across tabs / screens
  useEffect(() => {
    setThemeMode(getStoredThemeMode());
    const handleThemeSync = () => {
      setThemeMode(getStoredThemeMode());
    };
    window.addEventListener('storage', handleThemeSync);
    window.addEventListener('nuradesk_theme_change', handleThemeSync);
    return () => {
      window.removeEventListener('storage', handleThemeSync);
      window.removeEventListener('nuradesk_theme_change', handleThemeSync);
    };
  }, []);

  const handleSelectTheme = (id: ThemeId) => {
    const mode: ThemeMode = id === 'dark' || id === 'bw_dark' || id === 'classic_pos' ? 'dark' : 'light';
    setThemeMode(mode);
    setStoredThemeMode(mode);
  };

  const currentThemeId = themeMode;
  const theme = APP_THEMES[themeMode] || APP_THEMES.light;

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
      {/* Global CSS for Smooth Dropdown & Accordion Animations */}
      <style>{`
        @keyframes fadeInSlideDown {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      {/* Top Header Bar */}
      <header style={{
        height: '62px',
        backgroundColor: theme.bgHeader,
        borderBottom: `1px solid ${theme.headerBorder || theme.border}`,
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: 30,
        color: theme.headerTextPrimary || theme.textPrimary,
      }}>
        {/* Left: Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          {/* Logo + Name */}
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
              flexShrink: 0,
            }}>
              <Image
                src="/logo.png"
                alt="Nuradesk Logo"
                width={34}
                height={34}
                priority
                style={{
                  objectFit: 'contain',
                  filter: theme.headerIsDark ? 'invert(1)' : 'none',
                }}
              />
            </div>
            <span style={{
              fontSize: '21px',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: theme.headerTextPrimary || theme.textPrimary,
            }}>
              Nuradesk
            </span>
          </Link>
        </div>

        {/* Right Controls: Manager View + POS Terminal Button + Bell + Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
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
                border: 'none',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.15s ease',
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.hoverBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ fontSize: 20, color: theme.headerTextPrimary || theme.textPrimary }} />
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
                padding: '1rem',
                zIndex: 50,
                animation: 'fadeInSlideDown 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                transformOrigin: 'top right',
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
                    <AutoAwesomeRoundedIcon sx={{ fontSize: 18, color: theme.textPrimary }} />
                    <span style={{ fontSize: '13px', fontWeight: 800, color: theme.textPrimary }}>Nuradesk AI</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      backgroundColor: theme.badgeBg,
                      color: theme.badgeText,
                      padding: '2px 7px',
                      borderRadius: '9999px',
                    }}>
                      Coming Soon
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAiModal(false)}
                      style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', display: 'flex', padding: '2px' }}
                    >
                      <CloseRoundedIcon sx={{ fontSize: 16 }} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '12.5px', color: theme.textSecondary, lineHeight: 1.5, margin: '0 0 0.85rem 0' }}>
                  AI-powered retail intelligence and autonomous assistant ready for future integrations.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{
                    padding: '0.6rem 0.75rem',
                    backgroundColor: theme.bgCard,
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    fontSize: '12px',
                    color: theme.textPrimary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: theme.textPrimary, flexShrink: 0 }} />
                    <span>Smart Inventory & Restock Forecasting</span>
                  </div>
                  <div style={{
                    padding: '0.6rem 0.75rem',
                    backgroundColor: theme.bgCard,
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    fontSize: '12px',
                    color: theme.textPrimary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: theme.textPrimary, flexShrink: 0 }} />
                    <span>Real-time Sales Anomaly Detection</span>
                  </div>
                  <div style={{
                    padding: '0.6rem 0.75rem',
                    backgroundColor: theme.bgCard,
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    fontSize: '12px',
                    color: theme.textPrimary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: theme.textPrimary, flexShrink: 0 }} />
                    <span>Conversational Sales & Analytics Copilot</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notification Bell */}
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
                border: 'none',
                backgroundColor: showNotifications ? theme.hoverBg : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: theme.textPrimary,
                position: 'relative',
                transition: 'all 0.15s ease',
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.hoverBg;
              }}
              onMouseLeave={(e) => {
                if (!showNotifications) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <NotificationsNoneRoundedIcon sx={{ fontSize: 21, color: theme.headerTextPrimary || theme.textPrimary }} />
              {/* Notification Indicator Dot */}
              <span style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: theme.headerTextPrimary || theme.textPrimary,
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
                animation: 'fadeInSlideDown 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                transformOrigin: 'top right',
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
                    Notifications
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

          {/* User Profile Badge */}
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
                padding: '4px 8px',
                borderRadius: '0.65rem',
                border: 'none',
                backgroundColor: showProfileMenu ? theme.hoverBg : 'transparent',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.hoverBg;
              }}
              onMouseLeave={(e) => {
                if (!showProfileMenu) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
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
                RS
              </div>
              <span style={{
                fontSize: '13.5px',
                fontWeight: 700,
                color: theme.headerTextPrimary || theme.textPrimary,
                letterSpacing: '-0.01em',
              }}>
                Rahul Sharma
              </span>
              <KeyboardArrowDownRoundedIcon sx={{ fontSize: 16, color: theme.headerTextPrimary || theme.textPrimary }} />
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
                boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
                padding: '0.65rem',
                zIndex: 50,
                animation: 'fadeInSlideDown 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                transformOrigin: 'top right',
              }}>
                <div style={{ padding: '0.4rem 0.55rem', borderBottom: `1px solid ${theme.border}`, marginBottom: '0.45rem' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: theme.textPrimary }}>Rahul Sharma</div>
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
                    color: theme.textPrimary,
                    borderRadius: '0.45rem',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.hoverBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <StoreRoundedIcon sx={{ fontSize: 16, color: theme.textPrimary }} />
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

      {/* Main Body Layout: Salt & Pepper Sidebar + Main Scrollable Area */}
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Fixed Compact Sidebar */}
        <aside style={{
          width: '200px',
          minWidth: '200px',
          maxWidth: '200px',
          backgroundColor: theme.bgSidebar,
          borderRight: `1px solid ${theme.sidebarBorder || theme.border}`,
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: '0.65rem 0.55rem',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}>
          {/* Navigation Links List */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
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
                        closeAllMenus();
                        setActiveTabId(item.id);
                      }
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.42rem 0.6rem',
                      borderRadius: '0.55rem',
                      border: 'none',
                      backgroundColor: isActive ? theme.sidebarActiveBg : 'transparent',
                      color: isActive ? theme.sidebarActiveText : (theme.sidebarTextPrimary || theme.textPrimary),
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = theme.sidebarHoverBg || theme.hoverBg;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      minWidth: 0,
                    }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? theme.sidebarActiveText : (theme.sidebarTextPrimary || theme.textPrimary),
                      }}>
                        {item.icon}
                      </span>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: isActive ? 800 : 600,
                        letterSpacing: '-0.015em',
                        color: isActive ? theme.sidebarActiveText : (theme.sidebarTextPrimary || theme.textPrimary),
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {item.label}
                      </span>
                    </div>

                    {/* Submenu Accordion Chevron */}
                    {hasSubItems && (
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: isActive ? theme.sidebarActiveText : (theme.sidebarTextPrimary || theme.textPrimary),
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}>
                        <KeyboardArrowDownRoundedIcon sx={{ fontSize: 16, color: isActive ? theme.sidebarActiveText : (theme.sidebarTextPrimary || theme.textPrimary) }} />
                      </span>
                    )}
                  </button>

                  {/* Submenu List with Icons - Smooth CSS Grid Transition */}
                  {hasSubItems && (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateRows: isExpanded ? '1fr' : '0fr',
                        transition: 'grid-template-rows 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <div
                        style={{
                          overflow: 'hidden',
                          opacity: isExpanded ? 1 : 0,
                          transform: isExpanded ? 'translateY(0)' : 'translateY(-6px)',
                          transition: 'opacity 0.22s ease, transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.15rem',
                            paddingLeft: '0.65rem',
                            paddingTop: '0.25rem',
                            paddingBottom: '0.25rem',
                            borderLeft: `1px solid ${theme.sidebarBorder || theme.border}`,
                            marginLeft: '1.05rem',
                          }}
                        >
                      {item.subItems?.map((sub) => {
                        const isSubActive = activeTabId === sub.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => {
                              setActiveTabId(sub.id);
                              openSingleMenu(item.id);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.55rem',
                              textAlign: 'left',
                              padding: '0.32rem 0.5rem',
                              borderRadius: '0.45rem',
                              border: 'none',
                              backgroundColor: isSubActive ? theme.sidebarActiveBg : 'transparent',
                              color: isSubActive ? theme.sidebarActiveText : (theme.sidebarTextSecondary || theme.textSecondary),
                              fontSize: '12px',
                              fontWeight: isSubActive ? 800 : 500,
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              if (!isSubActive) {
                                e.currentTarget.style.backgroundColor = theme.sidebarHoverBg || theme.hoverBg;
                                e.currentTarget.style.color = theme.sidebarTextPrimary || theme.textPrimary;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSubActive) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = theme.sidebarTextSecondary || theme.textSecondary;
                              }
                            }}
                          >
                            <span style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: isSubActive ? theme.sidebarActiveText : (theme.sidebarTextSecondary || theme.textSecondary),
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
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom Sidebar Section (Subscription Card + What's New strictly last) */}
          <div style={{
            marginTop: 'auto',
            paddingTop: '0.65rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            flexShrink: 0,
          }}>
            {/* Subscription Card */}
            <div
              style={{
                padding: '0.55rem 0.6rem',
                backgroundColor: theme.sidebarHoverBg || theme.hoverBg,
                border: `1px solid ${theme.sidebarBorder || theme.border}`,
                borderRadius: '0.65rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
                boxSizing: 'border-box',
                transition: 'all 0.15s ease',
              }}
            >
              {/* Header: Plan & Days Remaining */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '11.5px',
                  fontWeight: 800,
                  color: theme.sidebarTextPrimary || theme.textPrimary,
                  lineHeight: 1.2,
                }}>
                  Pro Plan
                </span>

                <span style={{
                  fontSize: '9.5px',
                  fontWeight: 700,
                  color: theme.activeBg,
                  backgroundColor: theme.hoverBg,
                  border: `1px solid ${theme.border}`,
                  padding: '1px 5px',
                  borderRadius: '9999px',
                  whiteSpace: 'nowrap',
                }}>
                  7 days left
                </span>
              </div>

              {/* Progress bar */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '10px',
                  color: theme.sidebarTextSecondary || theme.textSecondary,
                  marginBottom: '3px',
                  fontWeight: 600,
                }}>
                  <span>Trial Remaining</span>
                  <span>7 / 14 Days</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  backgroundColor: theme.border,
                  borderRadius: '9999px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: '50%',
                    height: '100%',
                    backgroundColor: theme.activeBg,
                    borderRadius: '9999px',
                  }} />
                </div>
              </div>

              {/* Upgrade Button */}
              <button
                type="button"
                onClick={() => setShowUpgradeModal(true)}
                style={{
                  width: '100%',
                  height: '26px',
                  borderRadius: '0.45rem',
                  backgroundColor: theme.activeBg,
                  color: theme.activeText,
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  transition: 'opacity 0.15s ease',
                  padding: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                <span>Upgrade Plan</span>
                <ArrowOutwardRoundedIcon sx={{ fontSize: 11 }} />
              </button>
            </div>

            {/* What's New in Nuradesk (Last in Sidebar) */}
            <div
              style={{
                backgroundColor: theme.sidebarHoverBg || theme.hoverBg,
                border: `1px solid ${theme.sidebarBorder || theme.border}`,
                borderRadius: '0.65rem',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.15s ease',
                boxSizing: 'border-box',
              }}
            >
              {/* Thumbnail image with tag */}
              <div style={{ height: '46px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=600&auto=format&fit=crop"
                  alt="What's New in Nuradesk"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  left: '4px',
                  backgroundColor: 'rgba(25, 26, 25, 0.85)',
                  backdropFilter: 'blur(6px)',
                  color: '#FFFFFF',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  fontSize: '8px',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}>
                  v2.4 UPDATE
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '0.45rem 0.55rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AutoAwesomeRoundedIcon sx={{ fontSize: 11, color: '#F59E0B' }} />
                  <span style={{ fontSize: '10.5px', fontWeight: 800, color: theme.sidebarTextPrimary || theme.textPrimary }}>
                    What&apos;s New
                  </span>
                </div>
                <p style={{
                  fontSize: '9.5px',
                  color: theme.sidebarTextSecondary || theme.textSecondary,
                  margin: 0,
                  lineHeight: 1.25,
                }}>
                  UPI QR codes, split payments & thermal receipt print.
                </p>

                <button
                  type="button"
                  onClick={() => setShowWhatsNewModal(true)}
                  className="button-20"
                  style={{
                    width: '100%',
                    height: '24px',
                    fontSize: '10px',
                    fontWeight: 700,
                    borderRadius: '0.4rem',
                    padding: 0,
                    marginTop: '0.1rem',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.2rem',
                  }}
                >
                  <span>View Updates</span>
                  <ArrowOutwardRoundedIcon sx={{ fontSize: 10 }} />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Dashboard Content Area - Salt & Pepper */}
        <main style={{
          flex: 1,
          height: '100%',
          overflow: (isSettingsActive || isCustomersActive || isEmployeesActive || isSalesActive || isReportsActive || isCatalogActive || isInventoryActive) ? 'auto' : 'hidden',
          padding: (isSettingsActive || isCustomersActive || isEmployeesActive || isSalesActive || isReportsActive || isCatalogActive || isInventoryActive) ? 'clamp(1.5rem, 3vw, 2.5rem)' : 0,
          backgroundColor: theme.bgPage,
          boxSizing: 'border-box',
        }}>
          {isSettingsActive ? (
            <SettingsManagement
              activeSubTab={
                activeTabId === 'set_business' ? 'set_business' :
                activeTabId === 'set_tax' ? 'set_tax' :
                activeTabId === 'set_payments' ? 'set_payments' :
                activeTabId === 'set_hardware' ? 'set_hardware' :
                activeTabId === 'set_pos' ? 'set_pos' :
                activeTabId === 'set_notifications' ? 'set_notifications' :
                activeTabId === 'set_users' ? 'set_users' :
                activeTabId === 'set_security' ? 'set_security' :
                activeTabId === 'set_appearance' ? 'set_appearance' : 'set_store'
              }
              onSelectSubTab={(tab) => {
                setActiveTabId(tab);
                openSingleMenu('settings');
              }}
              theme={theme}
              currentThemeId={currentThemeId}
              onSelectTheme={handleSelectTheme}
            />
          ) : isCustomersActive ? (
            <CustomersManagement
              activeSubTab={
                activeTabId === 'cust_history' ? 'cust_history' :
                activeTabId === 'cust_loyalty' ? 'cust_loyalty' :
                activeTabId === 'cust_groups' ? 'cust_groups' :
                activeTabId === 'cust_feedback' ? 'cust_feedback' : 'cust_all'
              }
              onSelectSubTab={(tab) => {
                setActiveTabId(tab);
                openSingleMenu('customers');
              }}
              theme={theme}
            />
          ) : isEmployeesActive ? (
            <EmployeesManagement
              activeSubTab={
                activeTabId === 'emp_cashiers' ? 'emp_cashiers' :
                activeTabId === 'emp_managers' ? 'emp_managers' :
                activeTabId === 'emp_roles' ? 'emp_roles' :
                activeTabId === 'emp_shifts' ? 'emp_shifts' :
                activeTabId === 'emp_attendance' ? 'emp_attendance' :
                activeTabId === 'emp_performance' ? 'emp_performance' : 'emp_all'
              }
              onSelectSubTab={(tab) => {
                setActiveTabId(tab);
                openSingleMenu('employees');
              }}
              theme={theme}
            />
          ) : isSalesActive ? (
            <SalesManagement
              activeSubTab={
                activeTabId === 'returns' ? 'returns' :
                activeTabId === 'payments' ? 'payments' : 'orders'
              }
              onSelectSubTab={(tab) => {
                setActiveTabId(tab);
                openSingleMenu('sales');
              }}
              theme={theme}
            />
          ) : isReportsActive ? (
            <ReportsManagement
              activeSubTab={
                activeTabId === 'rep_inventory' ? 'rep_inventory' :
                activeTabId === 'rep_customers' ? 'rep_customers' :
                activeTabId === 'rep_performance' ? 'rep_performance' : 'rep_sales'
              }
              onSelectSubTab={(tab) => {
                setActiveTabId(tab);
                openSingleMenu('reports');
              }}
              theme={theme}
            />
          ) : isCatalogActive ? (
            <ProductManagement
              activeSubTab={
                activeTabId === 'categories' ? 'categories' :
                activeTabId === 'brands' ? 'brands' : 'products'
              }
              onSelectSubTab={(tab) => {
                setActiveTabId(tab);
                openSingleMenu('catalog');
              }}
              theme={theme}
            />
          ) : isInventoryActive ? (
            <InventoryManagement
              activeSubTab={
                activeTabId === 'adjustment' ? 'adjustment' :
                activeTabId === 'po' ? 'po' : 'stock'
              }
              onSelectSubTab={(tab) => {
                setActiveTabId(tab);
                openSingleMenu('inventory');
              }}
              theme={theme}
            />
          ) : (
            <div style={{
              display: 'flex',
              height: '100%',
              width: '100%',
              overflow: 'hidden',
            }}>
              {/* Middle Main Content Area (Scrollable) */}
              <div style={{
                flex: 1,
                height: '100%',
                overflowY: 'auto',
                padding: 'clamp(1.25rem, 2.5vw, 2.25rem)',
                boxSizing: 'border-box',
              }}>
                <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                  {/* Header Greeting */}
                  <div style={{ marginBottom: '1.75rem' }}>
                    <h1 style={{
                      fontSize: '24px',
                      fontWeight: 800,
                      color: theme.textPrimary,
                      letterSpacing: '-0.035em',
                      margin: '0 0 0.25rem 0',
                    }}>
                      Good evening, Rahul 👋
                    </h1>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: theme.textSecondary,
                      letterSpacing: '-0.01em',
                      margin: 0,
                    }}>
                      Manage your store setup, explore fresh features, and review sales.
                    </p>
                  </div>

                  {/* ========================================================
                      SECTION 1: 3-CARD SETUP / ONBOARDING GUIDE
                      ======================================================== */}
                  <div style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: theme.textSecondary,
                        }}>
                          Store Setup Guide
                        </span>
                        <span style={{
                          fontSize: '10.5px',
                          fontWeight: 800,
                          backgroundColor: theme.badgeBg,
                          color: theme.badgeText,
                          border: `1px solid ${theme.badgeBorder}`,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                        }}>
                          3 Steps
                        </span>
                      </div>
                    </div>

                    {/* 3 Setup Cards Grid - Modern Reference-Style UI */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '1.25rem',
                    }}>
                      {/* Card 1: Add your first product (UP NEXT) */}
                      <div
                        style={{
                          backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
                          border: `1px solid ${theme.borderCard}`,
                          borderRadius: '1.25rem',
                          padding: '1.6rem 1.45rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          minHeight: '215px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <div>
                          {/* Top Status Badge */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1.15rem' }}>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              color: '#16A34A',
                              backgroundColor: 'rgba(22, 163, 74, 0.1)',
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                            }}>
                              UP NEXT
                            </span>
                          </div>

                          {/* Headline */}
                          <h3 style={{
                            fontSize: '17px',
                            fontWeight: 800,
                            color: theme.textPrimary,
                            letterSpacing: '-0.025em',
                            margin: '0 0 0.5rem 0',
                            lineHeight: 1.3,
                          }}>
                            Add your first product
                          </h3>

                          {/* Description */}
                          <p style={{
                            fontSize: '13px',
                            color: theme.textSecondary,
                            lineHeight: 1.5,
                            margin: 0,
                            fontWeight: 450,
                          }}>
                            Create store items with prices, variants, categories, and barcodes to start selling.
                          </p>
                        </div>

                        {/* Bottom Action */}
                        <div style={{ marginTop: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTabId('products');
                              openSingleMenu('catalog');
                            }}
                            style={{
                              backgroundColor: theme.activeBg,
                              color: theme.activeText,
                              borderRadius: '9999px',
                              padding: '0.55rem 1.35rem',
                              fontSize: '13px',
                              fontWeight: 700,
                              border: 'none',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'opacity 0.15s ease',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                          >
                            <span>Add product</span>
                          </button>
                        </div>
                      </div>

                      {/* Card 2: Set up payments & tax */}
                      <div
                        style={{
                          backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
                          border: `1px solid ${theme.borderCard}`,
                          borderRadius: '1.25rem',
                          padding: '1.6rem 1.45rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          minHeight: '215px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <div>
                          {/* Top Icon */}
                          <div style={{ display: 'flex', alignItems: 'center', height: '22px', marginBottom: '1.15rem' }}>
                            <PaymentsRoundedIcon sx={{ fontSize: 22, color: theme.textSecondary }} />
                          </div>

                          {/* Headline */}
                          <h3 style={{
                            fontSize: '17px',
                            fontWeight: 800,
                            color: theme.textPrimary,
                            letterSpacing: '-0.025em',
                            margin: '0 0 0.5rem 0',
                            lineHeight: 1.3,
                          }}>
                            Set up payments & tax
                          </h3>

                          {/* Description */}
                          <p style={{
                            fontSize: '13px',
                            color: theme.textSecondary,
                            lineHeight: 1.5,
                            margin: 0,
                            fontWeight: 450,
                          }}>
                            Enable dynamic UPI QR codes, card payments, and configure GST tax rates.
                          </p>
                        </div>

                        {/* Bottom Actions Row */}
                        <div style={{ marginTop: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTabId('set_payments');
                              openSingleMenu('settings');
                            }}
                            style={{
                              backgroundColor: theme.sidebarIsDark ? theme.hoverBg : '#FFFFFF',
                              color: theme.textPrimary,
                              borderRadius: '9999px',
                              padding: '0.55rem 1.15rem',
                              fontSize: '13px',
                              fontWeight: 700,
                              border: `1px solid ${theme.border}`,
                              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'opacity 0.15s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                          >
                            <span>Configure payments</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveTabId('set_tax');
                              openSingleMenu('settings');
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: theme.textPrimary,
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              padding: '0.55rem 0.5rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              fontFamily: 'inherit',
                              transition: 'opacity 0.15s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.75'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                          >
                            <span>Tax & invoicing</span>
                          </button>
                        </div>
                      </div>

                      {/* Card 3: Start selling on POS */}
                      <div
                        style={{
                          backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
                          border: `1px solid ${theme.borderCard}`,
                          borderRadius: '1.25rem',
                          padding: '1.6rem 1.45rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          minHeight: '215px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <div>
                          {/* Top Icon */}
                          <div style={{ display: 'flex', alignItems: 'center', height: '22px', marginBottom: '1.15rem' }}>
                            <PointOfSaleRoundedIcon sx={{ fontSize: 22, color: theme.textSecondary }} />
                          </div>

                          {/* Headline */}
                          <h3 style={{
                            fontSize: '17px',
                            fontWeight: 800,
                            color: theme.textPrimary,
                            letterSpacing: '-0.025em',
                            margin: '0 0 0.5rem 0',
                            lineHeight: 1.3,
                          }}>
                            Start selling on POS
                          </h3>

                          {/* Description */}
                          <p style={{
                            fontSize: '13px',
                            color: theme.textSecondary,
                            lineHeight: 1.5,
                            margin: 0,
                            fontWeight: 450,
                          }}>
                            Open your high-speed cashier register, assign drawer floats, and ring up sales.
                          </p>
                        </div>

                        {/* Bottom Actions Row */}
                        <div style={{ marginTop: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                          <Link
                            href="/pos"
                            style={{
                              backgroundColor: theme.sidebarIsDark ? theme.hoverBg : '#FFFFFF',
                              color: theme.textPrimary,
                              borderRadius: '9999px',
                              padding: '0.55rem 1.15rem',
                              fontSize: '13px',
                              fontWeight: 700,
                              border: `1px solid ${theme.border}`,
                              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textDecoration: 'none',
                              transition: 'opacity 0.15s ease',
                              boxSizing: 'border-box',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                          >
                            <span>Open register</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveTabId('set_pos');
                              openSingleMenu('settings');
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: theme.textPrimary,
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              padding: '0.55rem 0.5rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              fontFamily: 'inherit',
                              transition: 'opacity 0.15s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.75'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                          >
                            <span>POS settings</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ========================================================
                      SECTION 3: SALES OVERVIEW (INTERACTIVE BAR CHART)
                      ======================================================== */}
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

                      {/* Chart Filter Toggle (Segmented Pill) */}
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
                          backgroundColor: theme.secondaryBadgeBg,
                          border: `1px solid ${theme.secondaryBadgeBorder}`,
                          color: theme.secondaryBadgeText,
                          padding: '4px 11px',
                          borderRadius: '9999px',
                        }}>
                          <TrendingUpRoundedIcon sx={{ fontSize: 16, color: theme.secondaryBadgeText }} />
                          <span>+14.8% vs last {chartTimeframe === 'weekly' ? 'week' : 'month'}</span>
                        </div>
                      </div>

                      {/* SVG & HTML Interactive Bar Chart */}
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

                              {/* Bar Pillar */}
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

                  {/* ========================================================
                      SECTION 4: RECENT ORDERS TABLE
                      ======================================================== */}
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
                        onClick={() => {
                          setActiveTabId('orders');
                          openSingleMenu('sales');
                        }}
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
                        <span>View all orders &gt;&gt;</span>
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
                              Order ID
                            </th>
                            <th style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11.5px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                              Customer
                            </th>
                            <th style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11.5px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                              Items
                            </th>
                            <th style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11.5px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                              Amount
                            </th>
                            <th style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11.5px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                              Status
                            </th>
                            <th style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11.5px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
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
                              <td style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: theme.textPrimary, fontFamily: 'monospace, inherit' }}>
                                {order.id}
                              </td>
                              <td style={{ padding: '0.9rem 1.25rem', fontWeight: 600, color: theme.textPrimary }}>
                                {order.customer}
                              </td>
                              <td style={{ padding: '0.9rem 1.25rem', fontWeight: 500, color: theme.textSecondary }}>
                                {order.items} items
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
                              <td style={{ padding: '0.9rem 1.25rem', fontSize: '13px', color: theme.textSecondary }}>
                                {order.time}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================
                  RIGHT-SIDE FIXED PANEL: SALES, ORDERS, PRODUCTS
                  ======================================================== */}
              <aside style={{
                width: '320px',
                minWidth: '320px',
                maxWidth: '340px',
                height: '100%',
                overflowY: 'auto',
                backgroundColor: theme.sidebarIsDark ? theme.bgSidebar : '#FAFAFA',
                borderLeft: `1px solid ${theme.border}`,
                padding: '1.5rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxSizing: 'border-box',
                flexShrink: 0,
              }}>

                {/* Card 1: Sales */}
                <div
                  style={{
                    backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '1rem',
                    padding: '1.4rem 1.35rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '110px',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setActiveTabId('sales');
                    openSingleMenu('sales');
                  }}
                >
                  <div style={{
                    fontSize: '14.5px',
                    fontWeight: 500,
                    color: theme.sidebarIsDark ? theme.textSecondary : '#6B7280',
                    letterSpacing: '-0.01em',
                  }}>
                    Sales
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginTop: '1.25rem',
                  }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: theme.textPrimary }}>
                      Today&apos;s revenue
                    </span>
                    <span style={{ fontSize: '15.5px', fontWeight: 700, color: theme.textPrimary }}>
                      ₹48,250
                    </span>
                  </div>
                </div>

                {/* Card 2: Orders */}
                <div
                  style={{
                    backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '1rem',
                    padding: '1.4rem 1.35rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '110px',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setActiveTabId('orders');
                    openSingleMenu('sales');
                  }}
                >
                  <div style={{
                    fontSize: '14.5px',
                    fontWeight: 500,
                    color: theme.sidebarIsDark ? theme.textSecondary : '#6B7280',
                    letterSpacing: '-0.01em',
                  }}>
                    Orders
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginTop: '1.25rem',
                  }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: theme.textPrimary }}>
                      Total orders
                    </span>
                    <span style={{ fontSize: '15.5px', fontWeight: 700, color: theme.textPrimary }}>
                      128
                    </span>
                  </div>
                </div>

                {/* Card 3: Products */}
                <div
                  style={{
                    backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '1rem',
                    padding: '1.4rem 1.35rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '110px',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setActiveTabId('products');
                    openSingleMenu('catalog');
                  }}
                >
                  <div style={{
                    fontSize: '14.5px',
                    fontWeight: 500,
                    color: theme.sidebarIsDark ? theme.textSecondary : '#6B7280',
                    letterSpacing: '-0.01em',
                  }}>
                    Products
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginTop: '1.25rem',
                  }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: theme.textPrimary }}>
                      Active on POS
                    </span>
                    <span style={{ fontSize: '15.5px', fontWeight: 700, color: theme.textPrimary }}>
                      10 items
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </main>
      </div>

      {/* Upgrade / Subscription Modal */}
      {showUpgradeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(5px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '500px',
            backgroundColor: theme.bgCard,
            borderRadius: '1.25rem',
            border: `1px solid ${theme.border}`,
            boxShadow: '0 24px 48px rgba(0,0,0,0.25)',
            overflow: 'hidden',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: `1px solid ${theme.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Nuradesk Pro Subscription
                </h3>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0, marginTop: '2px' }}>
                  7 days remaining on your 14-day free trial
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '0.45rem',
                  color: theme.textSecondary,
                }}
              >
                <CloseRoundedIcon sx={{ fontSize: 18 }} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Trial Progress Bar Box */}
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: '0.75rem',
                backgroundColor: theme.hoverBg,
                border: `1px solid ${theme.border}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: theme.textPrimary, marginBottom: '6px' }}>
                  <span>Trial Progress</span>
                  <span style={{ color: theme.activeBg }}>7 Days Left</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: theme.border,
                  borderRadius: '9999px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: '50%',
                    height: '100%',
                    backgroundColor: theme.activeBg,
                    borderRadius: '9999px',
                  }} />
                </div>
              </div>

              {/* Plan Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {/* Monthly */}
                <div style={{
                  padding: '1rem',
                  borderRadius: '0.85rem',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.bgPage,
                  cursor: 'pointer',
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase' }}>Monthly</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: theme.textPrimary, marginTop: '2px' }}>₹999<span style={{ fontSize: '12px', fontWeight: 600, color: theme.textSecondary }}>/mo</span></div>
                  <div style={{ fontSize: '11px', color: theme.textSecondary, marginTop: '4px' }}>Billed monthly per counter</div>
                </div>

                {/* Annual */}
                <div style={{
                  padding: '1rem',
                  borderRadius: '0.85rem',
                  border: `2px solid ${theme.activeBg}`,
                  backgroundColor: theme.hoverBg,
                  position: 'relative',
                  cursor: 'pointer',
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '8px',
                    fontSize: '9.5px',
                    fontWeight: 800,
                    backgroundColor: theme.activeBg,
                    color: theme.activeText,
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                  }}>
                    Save 20%
                  </span>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: theme.activeBg, textTransform: 'uppercase' }}>Annual (Best Value)</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: theme.textPrimary, marginTop: '2px' }}>₹799<span style={{ fontSize: '12px', fontWeight: 600, color: theme.textSecondary }}>/mo</span></div>
                  <div style={{ fontSize: '11px', color: theme.textSecondary, marginTop: '4px' }}>Billed annually per counter</div>
                </div>
              </div>

              {/* Features list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '12px', color: theme.textSecondary }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 16, color: '#10B981' }} />
                  <span>Unlimited POS Transactions & Central Menu Sync</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 16, color: '#10B981' }} />
                  <span>Live Stock Telemetry & Low Inventory Alerts</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 16, color: '#10B981' }} />
                  <span>24/7 Priority Support & Hardware Integrations</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: `1px solid ${theme.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.65rem',
            }}>
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.6rem',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: 'transparent',
                  color: theme.textPrimary,
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUpgradeModal(false);
                  alert('Thank you! Your trial has been extended to Nuradesk Annual Pro.');
                }}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.6rem',
                  border: 'none',
                  backgroundColor: theme.activeBg,
                  color: theme.activeText,
                  fontSize: '12.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Proceed to Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* What's New in Nuradesk Modal */}
      {showWhatsNewModal && (
        <div
          onClick={() => setShowWhatsNewModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.25rem',
            boxSizing: 'border-box',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              backgroundColor: theme.bgCard,
              borderRadius: '1.25rem',
              border: `1px solid ${theme.borderCard}`,
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              animation: 'fadeInSlideDown 0.22s ease-out',
            }}
          >
            {/* Modal Cover Image & Header */}
            <div style={{
              height: '140px',
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '1.25rem',
              boxSizing: 'border-box',
            }}>
              <img
                src="https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1000&auto=format&fit=crop"
                alt="What's New in Nuradesk"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.88) 100%)',
              }} />

              {/* Close Button on top-right */}
              <button
                type="button"
                onClick={() => setShowWhatsNewModal(false)}
                title="Close"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2,
                  transition: 'background-color 0.15s ease',
                  padding: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.75)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)'; }}
              >
                <CloseRoundedIcon sx={{ fontSize: 18 }} />
              </button>

              {/* Title & Tag in cover */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: 'rgba(245, 158, 11, 0.92)',
                  color: '#000000',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '9.5px',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem',
                }}>
                  <AutoAwesomeRoundedIcon sx={{ fontSize: 12 }} />
                  <span>v2.4 Release Notes</span>
                </div>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}>
                  What&apos;s New in Nuradesk
                </h2>
              </div>
            </div>

            {/* Modal Body: Feature items */}
            <div style={{
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              maxHeight: '360px',
              overflowY: 'auto',
            }}>
              {/* Feature 1 */}
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '0.65rem',
                  backgroundColor: theme.bgCardSubtle,
                  border: `1px solid ${theme.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.activeBg,
                  flexShrink: 0,
                }}>
                  <PaymentsRoundedIcon sx={{ fontSize: 19 }} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: theme.textPrimary }}>
                    Dynamic UPI QR Codes
                  </div>
                  <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '2px', lineHeight: 1.4 }}>
                    Generate order-specific QR codes on customer-facing screens. Payments are confirmed instantly via webhook without manual verification.
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '0.65rem',
                  backgroundColor: theme.bgCardSubtle,
                  border: `1px solid ${theme.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.activeBg,
                  flexShrink: 0,
                }}>
                  <PrintRoundedIcon sx={{ fontSize: 19 }} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: theme.textPrimary }}>
                    Thermal ESC/POS Printing
                  </div>
                  <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '2px', lineHeight: 1.4 }}>
                    Direct driver support for 58mm and 80mm thermal receipt printers with store logos, GST breakdown, and custom footer messages.
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '0.65rem',
                  backgroundColor: theme.bgCardSubtle,
                  border: `1px solid ${theme.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.activeBg,
                  flexShrink: 0,
                }}>
                  <PointOfSaleRoundedIcon sx={{ fontSize: 19 }} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: theme.textPrimary }}>
                    Cash Drawer & Shift Float Reconciliation
                  </div>
                  <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '2px', lineHeight: 1.4 }}>
                    Assign cash floats at register opening, track cash-in/cash-out adjustments, and produce automated end-of-shift Z-reports.
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '0.65rem',
                  backgroundColor: theme.bgCardSubtle,
                  border: `1px solid ${theme.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.activeBg,
                  flexShrink: 0,
                }}>
                  <TuneRoundedIcon sx={{ fontSize: 19 }} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: theme.textPrimary }}>
                    Offline Resilience & Automatic Sync
                  </div>
                  <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '2px', lineHeight: 1.4 }}>
                    Continue ringing up customers during network interruptions. Completed orders queue safely and sync automatically once reconnected.
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: `1px solid ${theme.border}`,
              backgroundColor: theme.bgCardSubtle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.65rem',
            }}>
              <button
                type="button"
                onClick={() => setShowWhatsNewModal(false)}
                style={{
                  padding: '0.5rem 1.1rem',
                  borderRadius: '0.6rem',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: 'transparent',
                  color: theme.textPrimary,
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Close
              </button>
              <Link
                href="/pos"
                onClick={() => setShowWhatsNewModal(false)}
                className="button-20"
                role="button"
                style={{
                  height: '34px',
                  padding: '0 1rem',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  borderRadius: '0.6rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  textDecoration: 'none',
                  border: 'none',
                }}
              >
                <span>Try in POS Register</span>
                <ArrowOutwardRoundedIcon sx={{ fontSize: 14 }} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
