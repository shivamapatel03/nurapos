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
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
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
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import { ThemeId, ThemeMode, APP_THEMES, getStoredThemeMode, setStoredThemeMode } from '@/lib/themeConfig';

interface SubNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
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
    announcements: false,
  });

  const [activeTabId, setActiveTabId] = useState('dashboard');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
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
    activeTabId === 'add_product' ||
    activeTabId === 'categories' ||
    activeTabId === 'brands';

  const isReportsActive =
    activeTabId === 'reports' ||
    activeTabId === 'rep_sales' ||
    activeTabId === 'rep_inventory' ||
    activeTabId === 'rep_customers' ||
    activeTabId === 'rep_performance';

  const isAnnouncementsActive = activeTabId === 'announcements';

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
      news: menuId === 'announcements',
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
      announcements: false,
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
          announcements: false,
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
        announcements: menuId === 'announcements',
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
        { id: 'add_product', label: 'Add Product', icon: <AddRoundedIcon sx={{ fontSize: 14 }} /> },
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
        { id: 'cust_feedback', label: 'Feedback & Reviews', icon: <RateReviewRoundedIcon sx={{ fontSize: 14 }} /> },
      ],
    },
    {
      id: 'terminal',
      label: 'Go to terminal',
      icon: <PointOfSaleRoundedIcon sx={{ fontSize: 18 }} />,
      href: '/pos',
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
        { id: 'set_logout', label: 'Log Out', icon: <LogoutRoundedIcon sx={{ fontSize: 14 }} />, href: '/signin' },
      ],
    },
    {
      id: 'announcements',
      label: 'announcements',
      icon: <CampaignRoundedIcon sx={{ fontSize: 18 }} />,
    },
  ];


  // Dynamic greeting based on current local hour
  const [greeting, setGreeting] = useState('Welcome');
  const [merchantName, setMerchantName] = useState('');

  // Real-time dashboard KPI states (defaults to zero / empty when no mock data)
  const [todayRevenue, setTodayRevenue] = useState('₹0');
  const [todayOrdersCount, setTodayOrdersCount] = useState(0);
  const [activeProductsCount, setActiveProductsCount] = useState(0);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    try {
      const storedName = localStorage.getItem('nuradesk_user_name') || localStorage.getItem('storeName') || '';
      if (storedName) {
        setMerchantName(storedName);
      }

      // Check real stored products
      const savedProducts = localStorage.getItem('nuradesk_products');
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed)) {
          setActiveProductsCount(parsed.filter((p: any) => p.isActive !== false).length);
        }
      }

      // Check real stored orders
      const savedOrders = localStorage.getItem('nuradesk_orders');
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) {
          const todayStr = new Date().toISOString().split('T')[0];
          const todayOrders = parsed.filter((o: any) => o.date === todayStr || o.timestamp?.startsWith(todayStr));
          setTodayOrdersCount(todayOrders.length);
          const rev = todayOrders.reduce((sum: number, o: any) => sum + (Number(o.totalAmount || o.total) || 0), 0);
          setTodayRevenue(`₹${rev.toLocaleString('en-IN')}`);
        }
      }
    } catch (e) {}
  }, [activeTabId]);

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

      {/* Main Body Layout: Sidebar + Main Scrollable Area */}
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
          overflowY: 'hidden',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: '0.65rem 0.55rem',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}>
          {/* Brand Logo & Name inside Left Sidebar */}
          <Link
            href="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              textDecoration: 'none',
              padding: '0.45rem 0.55rem 0.75rem 0.55rem',
              marginBottom: '0.45rem',
              borderBottom: `1px solid ${theme.sidebarBorder || theme.border}`,
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
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
                width={28}
                height={28}
                priority
                style={{
                  objectFit: 'contain',
                  filter: theme.sidebarIsDark ? 'invert(1)' : 'none',
                }}
              />
            </div>
            <span style={{
              fontSize: '17px',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              color: theme.sidebarTextPrimary || theme.textPrimary,
            }}>
              Nuradesk
            </span>
          </Link>

          {/* Navigation Links List — scrollable area */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
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
                      if (item.href) {
                        router.push(item.href);
                        return;
                      }
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

                    {/* Submenu Accordion Chevron or Link Arrow */}
                    {hasSubItems ? (
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: isActive ? theme.sidebarActiveText : (theme.sidebarTextPrimary || theme.textPrimary),
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}>
                        <KeyboardArrowDownRoundedIcon sx={{ fontSize: 16, color: isActive ? theme.sidebarActiveText : (theme.sidebarTextPrimary || theme.textPrimary) }} />
                      </span>
                    ) : item.href ? (
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: theme.sidebarTextSecondary || theme.textSecondary,
                        opacity: 0.7,
                      }}>
                        <ArrowOutwardRoundedIcon sx={{ fontSize: 13 }} />
                      </span>
                    ) : null}
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

                        if (sub.href) {
                          return (
                            <Link
                              key={sub.id}
                              href={sub.href}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.55rem',
                                textAlign: 'left',
                                padding: '0.32rem 0.5rem',
                                borderRadius: '0.45rem',
                                border: 'none',
                                textDecoration: 'none',
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
                            </Link>
                          );
                        }

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

          {/* Bottom Sidebar Section — sticky, never scrolls */}
          <div style={{
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
                backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
                border: `1px solid ${(theme as any).sidebarIsDark ? theme.border : '#E5E7EB'}`,
                borderRadius: '0.65rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
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
                  color: theme.sidebarTextPrimary || theme.textPrimary,
                  backgroundColor: (theme as any).sidebarIsDark ? theme.hoverBg : '#F3F4F6',
                  border: `1px solid ${(theme as any).sidebarIsDark ? theme.border : '#E5E7EB'}`,
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
                  backgroundColor: (theme as any).sidebarIsDark ? theme.border : '#E5E7EB',
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
                <span>Upgrade Plan</span>
                <ArrowOutwardRoundedIcon sx={{ fontSize: 10 }} />
              </button>
            </div>


          </div>
        </aside>

        {/* Main Dashboard Content Area - Salt & Pepper */}
        <main style={{
          flex: 1,
          height: '100%',
          overflow: (isSettingsActive || isCustomersActive || isEmployeesActive || isSalesActive || isReportsActive || isCatalogActive || isInventoryActive || isAnnouncementsActive) ? 'auto' : 'hidden',
          padding: (isSettingsActive || isCustomersActive || isEmployeesActive || isSalesActive || isReportsActive || isInventoryActive || isAnnouncementsActive) ? 'clamp(1.5rem, 3vw, 2.5rem)' : 0,
          backgroundColor: theme.bgPage,
          boxSizing: 'border-box',
        }}>
          {isAnnouncementsActive ? (
            <div style={{ maxWidth: '860px', margin: '0 auto' }}>
              {/* News Page Header */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <AutoAwesomeRoundedIcon sx={{ fontSize: 22, color: '#F59E0B' }} />
                  <h1 style={{ fontSize: '22px', fontWeight: 800, color: theme.textPrimary, margin: 0, letterSpacing: '-0.03em' }}>
                    Announcements
                  </h1>
                </div>
                <p style={{ fontSize: '14px', color: theme.textSecondary, margin: 0, fontWeight: 500 }}>
                  Stay up to date with the latest features, updates and improvements.
                </p>
              </div>

              {/* Release cards */}
              {[
                {
                  version: 'v2.4.0',
                  date: 'September 2026',
                  badge: 'Latest',
                  badgeColor: '#10B981',
                  title: 'UPI QR, Split Payments & Thermal Receipts',
                  img: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=800&auto=format&fit=crop',
                  items: [
                    'UPI QR code generation at checkout for seamless digital payments.',
                    'Split payment support — split bills across cash, card & UPI.',
                    'Thermal receipt printing with custom logo & GST breakdown.',
                    'Improved POS speed with offline-first transaction caching.',
                  ],
                },
                {
                  version: 'v2.3.0',
                  date: 'August 2026',
                  badge: 'Previous',
                  badgeColor: '#6B7280',
                  title: 'Employee Shifts & Attendance Tracking',
                  img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop',
                  items: [
                    'Shift scheduling for all store roles with weekly view.',
                    'Attendance clock-in/clock-out with biometric PIN option.',
                    'Employee performance dashboard with daily sales targets.',
                    'Role-based permissions for manager vs. cashier access.',
                  ],
                },
                {
                  version: 'v2.2.0',
                  date: 'July 2026',
                  badge: 'Previous',
                  badgeColor: '#6B7280',
                  title: 'Loyalty Program & Customer Groups',
                  img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop',
                  items: [
                    'Points-based loyalty program with configurable rewards.',
                    'Customer groups for targeted promotions and discounts.',
                    'Feedback & review collection at checkout.',
                    'Purchase history with exportable CSV reports.',
                  ],
                },
              ].map((release) => (
                <div
                  key={release.version}
                  style={{
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    marginBottom: '1.25rem',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Image banner */}
                  <div style={{ height: '140px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={release.img}
                      alt={release.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{
                      position: 'absolute', top: '10px', left: '12px',
                      backgroundColor: release.badgeColor,
                      color: '#fff', fontSize: '10px', fontWeight: 800,
                      padding: '2px 8px', borderRadius: '9999px', letterSpacing: '0.04em', textTransform: 'uppercase',
                    }}>
                      {release.badge}
                    </div>
                  </div>
                  {/* Body */}
                  <div style={{ padding: '1.1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: theme.textSecondary }}>{release.version}</span>
                      <span style={{ fontSize: '11px', color: theme.textSecondary }}>·</span>
                      <span style={{ fontSize: '11px', color: theme.textSecondary }}>{release.date}</span>
                    </div>
                    <h2 style={{ fontSize: '15px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 0.75rem 0', letterSpacing: '-0.02em' }}>
                      {release.title}
                    </h2>
                    <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {release.items.map((item, i) => (
                        <li key={i} style={{ fontSize: '13px', color: theme.textSecondary, lineHeight: 1.5 }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : isSettingsActive ? (
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
                activeTabId === 'add_product' ? 'add_product' :
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
                      {greeting}{merchantName ? `, ${merchantName}` : ''} 👋
                    </h1>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: theme.textSecondary,
                      letterSpacing: '-0.01em',
                      margin: 0,
                    }}>
                      Set up your business. Run it smarter.
                    </p>
                  </div>

                  {/* ========================================================
                      SECTION 1: 3-CARD SETUP / ONBOARDING GUIDE
                      ======================================================== */}
                  <div style={{ marginBottom: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          fontSize: '12.5px',
                          fontWeight: 800,
                          letterSpacing: '-0.01em',
                          color: theme.textPrimary,
                        }}>
                          Store Setup · 2 Simple Steps
                        </span>
                      </div>
                    </div>

                    {/* 2 Setup Cards Grid - Compact Modern UI */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: '0.85rem',
                    }}>
                      {/* Card 1: Add your first product (UP NEXT) */}
                      <div
                        style={{
                          backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
                          border: `1px solid ${theme.borderCard}`,
                          borderRadius: '0.9rem',
                          padding: '1.15rem 1.15rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          minHeight: '170px',
                          boxSizing: 'border-box',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                      >
                        <div>
                          {/* Top Status Badge */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              color: '#16A34A',
                              backgroundColor: 'rgba(22, 163, 74, 0.1)',
                              padding: '2px 7px',
                              borderRadius: '9999px',
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase',
                            }}>
                              UP NEXT
                            </span>
                          </div>

                          {/* Headline */}
                          <h3 style={{
                            fontSize: '15px',
                            fontWeight: 800,
                            color: theme.textPrimary,
                            letterSpacing: '-0.02em',
                            margin: '0 0 0.35rem 0',
                            lineHeight: 1.25,
                          }}>
                            Add your first product
                          </h3>

                          {/* Description */}
                          <p style={{
                            fontSize: '12px',
                            color: theme.textSecondary,
                            lineHeight: 1.45,
                            margin: 0,
                            fontWeight: 450,
                          }}>
                            Create store items with prices, variants, categories, and barcodes to start selling.
                          </p>
                        </div>

                        {/* Middle Illustration */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0.5rem 0',
                          margin: '0.35rem 0',
                        }}>
                          <Image
                            src="/dashimages/card1dash.png"
                            alt="Add first product"
                            width={130}
                            height={130}
                            style={{
                              objectFit: 'contain',
                              maxHeight: '130px',
                              width: 'auto',
                              borderRadius: '0.6rem',
                              mixBlendMode: theme.sidebarIsDark ? 'normal' : 'multiply',
                            }}
                            priority
                          />
                        </div>

                        {/* Bottom Action */}
                        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTabId('add_product');
                              openSingleMenu('catalog');
                            }}
                            className="button-20"
                            style={{
                              borderRadius: '9999px',
                              padding: '0.45rem 1.15rem',
                              fontSize: '12px',
                              fontWeight: 700,
                              fontFamily: 'inherit',
                            }}
                          >
                            <span>Add product</span>
                          </button>
                        </div>
                      </div>

                      {/* Card 2: Start selling on POS */}
                      <div
                        style={{
                          backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
                          border: `1px solid ${theme.borderCard}`,
                          borderRadius: '0.9rem',
                          padding: '1.15rem 1.15rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          minHeight: '170px',
                          boxSizing: 'border-box',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                      >
                        <div>
                          {/* Top Icon & Status Badge */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '20px', marginBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <PointOfSaleRoundedIcon sx={{ fontSize: 18, color: theme.textSecondary }} />
                            </div>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: theme.textSecondary,
                              backgroundColor: theme.hoverBg,
                              padding: '2px 8px',
                              borderRadius: '9999px',
                            }}>
                              Step 2
                            </span>
                          </div>

                          {/* Headline */}
                          <h3 style={{
                            fontSize: '15px',
                            fontWeight: 800,
                            color: theme.textPrimary,
                            letterSpacing: '-0.02em',
                            margin: '0 0 0.35rem 0',
                            lineHeight: 1.25,
                          }}>
                            Start selling on POS
                          </h3>

                          {/* Description */}
                          <p style={{
                            fontSize: '12px',
                            color: theme.textSecondary,
                            lineHeight: 1.45,
                            margin: 0,
                            fontWeight: 450,
                          }}>
                            Open your high-speed cashier register, assign drawer floats, and ring up sales.
                          </p>
                        </div>

                        {/* Middle Illustration */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0.5rem 0',
                          margin: '0.35rem 0',
                        }}>
                          <Image
                            src="/dashimages/card2dash.png"
                            alt="Start selling on POS"
                            width={195}
                            height={130}
                            style={{
                              objectFit: 'contain',
                              maxHeight: '130px',
                              width: 'auto',
                              borderRadius: '0.6rem',
                              mixBlendMode: theme.sidebarIsDark ? 'normal' : 'multiply',
                            }}
                            priority
                          />
                        </div>

                        {/* Bottom Actions Row */}
                        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <Link
                            href="/pos"
                            style={{
                              backgroundColor: theme.sidebarIsDark ? theme.hoverBg : '#FFFFFF',
                              color: theme.textPrimary,
                              borderRadius: '9999px',
                              padding: '0.45rem 0.95rem',
                              fontSize: '12px',
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
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              padding: '0.45rem 0.45rem',
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
                      {todayRevenue}
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
                      Today&apos;s orders
                    </span>
                    <span style={{ fontSize: '15.5px', fontWeight: 700, color: theme.textPrimary }}>
                      {todayOrdersCount}
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
                      {activeProductsCount} {activeProductsCount === 1 ? 'item' : 'items'}
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
                className="button-20-secondary"
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '12.5px',
                  fontWeight: 700,
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
                className="button-20"
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '9999px',
                  fontSize: '12.5px',
                  fontWeight: 800,
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
                  Announcements
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
