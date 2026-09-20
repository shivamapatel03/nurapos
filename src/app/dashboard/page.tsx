'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { ThemeId, APP_THEMES } from '@/lib/themeConfig';

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
    inventory: true,
    reports: false,
    employees: false,
    customers: false,
    settings: false,
  });

  const [activeTabId, setActiveTabId] = useState('po');
  const [chartTimeframe, setChartTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

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
    {
      id: 'employees',
      label: 'Employees',
      icon: <PeopleAltRoundedIcon sx={{ fontSize: 20 }} />,
      subItems: [
        { id: 'emp_all', label: 'All Employees', icon: <PeopleAltRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'emp_cashiers', label: 'Cashiers', icon: <PointOfSaleRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'emp_managers', label: 'Managers', icon: <AdminPanelSettingsRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'emp_roles', label: 'Roles & Permissions', icon: <SecurityRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'emp_shifts', label: 'Shifts', icon: <ScheduleRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'emp_attendance', label: 'Attendance', icon: <EventAvailableRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'emp_performance', label: 'Employee Performance', icon: <TrendingUpRoundedIcon sx={{ fontSize: 16 }} /> },
      ],
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: <PersonOutlineRoundedIcon sx={{ fontSize: 20 }} />,
      subItems: [
        { id: 'cust_all', label: 'All Customers', icon: <PeopleAltRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'cust_history', label: 'Purchase History', icon: <ReceiptLongRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'cust_loyalty', label: 'Loyalty & Rewards', icon: <CardGiftcardRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'cust_groups', label: 'Customer Groups', icon: <GroupWorkRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'cust_feedback', label: 'Feedback & Reviews', icon: <RateReviewRoundedIcon sx={{ fontSize: 16 }} /> },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsRoundedIcon sx={{ fontSize: 20 }} />,
      subItems: [
        { id: 'set_store', label: 'Store Profile', icon: <StoreRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'set_business', label: 'Business Settings', icon: <TuneRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'set_tax', label: 'Tax & Invoicing', icon: <ReceiptLongRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'set_payments', label: 'Payments', icon: <PaymentsRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'set_hardware', label: 'Hardware', icon: <PrintRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'set_pos', label: 'POS Settings', icon: <PointOfSaleRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'set_notifications', label: 'Notifications', icon: <NotificationsNoneRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'set_users', label: 'Users & Permissions', icon: <SecurityRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'set_security', label: 'Security', icon: <LockRoundedIcon sx={{ fontSize: 16 }} /> },
        { id: 'set_appearance', label: 'Appearance', icon: <PaletteRoundedIcon sx={{ fontSize: 16 }} /> },
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

  // Dynamic Admin Theme State ('macos' | 'bw_dark' | 'bw_light' | 'blue_white' | 'classic_pos')
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>('bw_light');

  // Load saved theme on mount
  useEffect(() => {
    try {
      const saved = (localStorage.getItem('nuradesk_admin_theme') || localStorage.getItem('nuradesk_pos_theme')) as ThemeId | null;
      if (saved && APP_THEMES[saved]) {
        setCurrentThemeId(saved);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleSelectTheme = (id: ThemeId) => {
    setCurrentThemeId(id);
    try {
      localStorage.setItem('nuradesk_admin_theme', id);
      localStorage.setItem('nuradesk_pos_theme', id);
    } catch {
      // Ignore localStorage errors
    }
  };

  const theme = APP_THEMES[currentThemeId] || APP_THEMES.bw_light;

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
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.headerTextPrimary || theme.textPrimary,
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
            {isSidebarOpen ? (
              <MenuOpenRoundedIcon sx={{ fontSize: 21, color: theme.headerTextPrimary || theme.textPrimary }} />
            ) : (
              <MenuRoundedIcon sx={{ fontSize: 21, color: theme.headerTextPrimary || theme.textPrimary }} />
            )}
          </button>

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
        {/* Animated Collapsible Sidebar */}
        <aside style={{
          width: isSidebarOpen ? '236px' : '68px',
          minWidth: isSidebarOpen ? '236px' : '68px',
          backgroundColor: theme.bgSidebar,
          borderRight: `1px solid ${theme.sidebarBorder || theme.border}`,
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
                        const isCurrentlyExpanded = !!expandedMenus[item.id];
                        toggleMenu(item.id);
                        if (!isCurrentlyExpanded) {
                          if (item.id === 'sales' && !isSalesActive) {
                            setActiveTabId('orders');
                          }
                          if (item.id === 'inventory' && !isInventoryActive) {
                            setActiveTabId('stock');
                          }
                          if (item.id === 'catalog' && !isCatalogActive) {
                            setActiveTabId('products');
                          }
                          if (item.id === 'reports' && !isReportsActive) {
                            setActiveTabId('rep_sales');
                          }
                          if (item.id === 'employees' && !isEmployeesActive) {
                            setActiveTabId('emp_all');
                          }
                          if (item.id === 'customers' && !isCustomersActive) {
                            setActiveTabId('cust_all');
                          }
                          if (item.id === 'settings' && !isSettingsActive) {
                            setActiveTabId('set_store');
                          }
                        }
                      } else {
                        closeAllMenus();
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
                      border: isActive ? `1px solid ${theme.activeBg}` : '1px solid transparent',
                      backgroundColor: isActive ? theme.activeBg : 'transparent',
                      color: isActive ? theme.activeText : (theme.sidebarTextPrimary || theme.textPrimary),
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = theme.sidebarHoverBg || theme.hoverBg;
                        e.currentTarget.style.borderColor = theme.sidebarBorder || theme.border;
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
                        color: isActive ? theme.activeIcon : (theme.sidebarTextPrimary || theme.textPrimary),
                      }}>
                        {item.icon}
                      </span>
                      {isSidebarOpen && (
                        <span style={{
                          fontSize: '14px',
                          fontWeight: isActive ? 800 : 600,
                          letterSpacing: '-0.015em',
                          color: isActive ? theme.activeText : (theme.sidebarTextPrimary || theme.textPrimary),
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {item.label}
                        </span>
                      )}
                    </div>

                    {/* Submenu Accordion Chevron */}
                    {hasSubItems && isSidebarOpen && (
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: isActive ? theme.activeText : (theme.sidebarTextPrimary || theme.textPrimary),
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}>
                        <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18, color: isActive ? theme.activeText : (theme.sidebarTextPrimary || theme.textPrimary) }} />
                      </span>
                    )}
                  </button>

                  {/* Submenu List with Icons - Smooth CSS Grid Transition */}
                  {hasSubItems && isSidebarOpen && (
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
                            gap: '0.2rem',
                            paddingLeft: '0.85rem',
                            paddingTop: '0.35rem',
                            paddingBottom: '0.35rem',
                            borderLeft: `1px solid ${theme.sidebarBorder || theme.border}`,
                            marginLeft: '1.4rem',
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
                              gap: '0.65rem',
                              textAlign: 'left',
                              padding: '0.45rem 0.65rem',
                              borderRadius: '0.55rem',
                              border: isSubActive ? `1px solid ${theme.activeBg}` : '1px solid transparent',
                              backgroundColor: isSubActive ? theme.activeBg : 'transparent',
                              color: isSubActive ? theme.activeText : (theme.sidebarTextSecondary || theme.textSecondary),
                              fontSize: '13px',
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
                              color: isSubActive ? theme.activeIcon : (theme.sidebarTextSecondary || theme.textSecondary),
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

          {/* Bottom Sidebar Controls: Live POS Indicator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginTop: '1.25rem' }}>

            {/* Store Indicator Link */}
            <Link
              href="/pos-login"
              style={{ textDecoration: 'none', display: 'block' }}
            >
              {isSidebarOpen ? (
                <div
                  style={{
                    height: '44px',
                    backgroundColor: theme.sidebarHoverBg || theme.hoverBg,
                    border: `1px solid ${theme.sidebarBorder || theme.border}`,
                    borderRadius: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.55rem',
                    color: theme.sidebarTextPrimary || theme.textPrimary,
                    fontSize: '12.5px',
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
                    e.currentTarget.style.borderColor = theme.sidebarBorder || theme.border;
                    e.currentTarget.style.backgroundColor = theme.sidebarHoverBg || theme.hoverBg;
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
                    backgroundColor: theme.sidebarHoverBg || theme.hoverBg,
                    border: `1px solid ${theme.sidebarBorder || theme.border}`,
                    borderRadius: '0.75rem',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.sidebarTextPrimary || theme.textPrimary,
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
                    e.currentTarget.style.borderColor = theme.sidebarBorder || theme.border;
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
          </div>
        </aside>

        {/* Main Dashboard Content Area - Salt & Pepper */}
        <main style={{
          flex: 1,
          height: '100%',
          overflowY: 'auto',
          padding: 'clamp(1.5rem, 3vw, 2.5rem)',
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
            <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
              {/* Header Greeting in Salt & Pepper */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{
                fontSize: '25px',
                fontWeight: 800,
                color: theme.textPrimary,
                letterSpacing: '-0.04em',
                marginBottom: '0.35rem',
              }}>
                Good evening, Rahul 👋
              </h1>
              <p style={{
                fontSize: '14.5px',
                fontWeight: 500,
                color: theme.textSecondary,
                letterSpacing: '-0.01em',
                margin: 0,
              }}>
                Here&apos;s what&apos;s happening in your store today.
              </p>
            </div>

            {/* 4 Metric KPI Cards Grid - Salt & Pepper (#F5F5F7, #D4D4D4, #2B2B2B) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}>
              {/* Card 1: Sales */}
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
                    Sales
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

              {/* Card 3: Products */}
              <div
                style={{
                  backgroundColor: theme.bgCard,
                  border: `1px solid ${hoveredCard === 'products' ? theme.borderHover : theme.borderCard}`,
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
                  <span style={{ fontSize: '13px', fontWeight: 700, color: theme.textSecondary, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Products
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

              {/* Card 4: Staff */}
              <div
                style={{
                  backgroundColor: theme.bgCard,
                  border: `1px solid ${hoveredCard === 'staff' ? theme.borderHover : theme.borderCard}`,
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
                  <span style={{ fontSize: '13px', fontWeight: 700, color: theme.textSecondary, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Staff
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
                    12
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

                {/* Chart Filter Toggle (Salt & Pepper Segmented Pill) */}
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

              {/* Bar Chart Container Card - Salt & Pepper Card */}
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

                        {/* Bar Pillar (#B3B3B3 default, #2B2B2B active/hovered) */}
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

            {/* Recent Orders Section - Salt & Pepper Table Container */}
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
          )}
        </main>
      </div>
    </div>
  );
}
