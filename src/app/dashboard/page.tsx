'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';

// Submenu Rounded Icons
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import AssignmentReturnRoundedIcon from '@mui/icons-material/AssignmentReturnRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
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
import OffersManagement from '@/components/admin/OffersManagement';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import TableRestaurantRoundedIcon from '@mui/icons-material/TableRestaurantRounded';
import { ThemeId, ThemeMode, APP_THEMES, getStoredThemeMode, setStoredThemeMode } from '@/lib/themeConfig';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { getOwnerSales, getCatalogProducts, BillRecord } from '@/lib/api-client';

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
  const { isAuthorized, handleLogout } = useAuthGuard();
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
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('today');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showWhatsNewModal, setShowWhatsNewModal] = useState(false);


  const isSettingsActive =
    activeTabId === 'settings' ||
    activeTabId === 'set_store' ||
    activeTabId === 'set_tables' ||
    activeTabId === 'set_hardware';

  const isCustomersActive =
    activeTabId === 'customers' ||
    activeTabId === 'cust_all' ||
    activeTabId === 'cust_history';

  const isEmployeesActive =
    activeTabId === 'employees' ||
    activeTabId === 'emp_all' ||
    activeTabId === 'emp_cashiers' ||
    activeTabId === 'emp_managers' ||
    activeTabId === 'emp_roles' ||
    activeTabId === 'emp_shifts';

  const isSalesActive =
    activeTabId === 'sales' ||
    activeTabId === 'orders' ||
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
    activeTabId === 'categories';

  const isReportsActive =
    activeTabId === 'reports' ||
    activeTabId === 'rep_sales' ||
    activeTabId === 'rep_inventory';

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
    { id: 'dashboard', label: 'Home', icon: <HomeOutlinedIcon sx={{ fontSize: 18 }} /> },
    {
      id: 'sales',
      label: 'Sales',
      icon: <PointOfSaleOutlinedIcon sx={{ fontSize: 18 }} />,
      subItems: [
        { id: 'orders', label: 'Orders', icon: <ReceiptLongRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'payments', label: 'Payments', icon: <PaymentsRoundedIcon sx={{ fontSize: 14 }} /> },
      ],
    },
    {
      id: 'catalog',
      label: 'Catalog',
      icon: <CategoryOutlinedIcon sx={{ fontSize: 18 }} />,
      subItems: [
        { id: 'products', label: 'Products', icon: <Inventory2RoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'add_product', label: 'Add Product', icon: <AddRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'categories', label: 'Categories', icon: <GridViewRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'offers', label: 'Offers & Discounts', icon: <LocalOfferOutlinedIcon sx={{ fontSize: 14 }} /> },
      ],
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <WarehouseOutlinedIcon sx={{ fontSize: 18 }} />,
      subItems: [
        { id: 'stock', label: 'Stock', icon: <LayersRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'adjustment', label: 'Stock Adjustment', icon: <TuneRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'po', label: 'Purchase Orders', icon: <LocalShippingRoundedIcon sx={{ fontSize: 14 }} /> },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <AssessmentOutlinedIcon sx={{ fontSize: 18 }} />,
      subItems: [
        { id: 'rep_sales', label: 'Sales', icon: <BarChartRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'rep_inventory', label: 'Inventory', icon: <LayersRoundedIcon sx={{ fontSize: 14 }} /> },
      ],
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: <PeopleAltOutlinedIcon sx={{ fontSize: 18 }} />,
      subItems: [
        { id: 'emp_all', label: 'All Employees', icon: <PeopleAltRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'emp_cashiers', label: 'Cashiers', icon: <PointOfSaleRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'emp_managers', label: 'Managers', icon: <AdminPanelSettingsRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'emp_roles', label: 'Roles & Permissions', icon: <SecurityRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'emp_shifts', label: 'Shifts', icon: <ScheduleRoundedIcon sx={{ fontSize: 14 }} /> },
      ],
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: <PersonOutlineRoundedIcon sx={{ fontSize: 18 }} />,
      subItems: [
        { id: 'cust_all', label: 'All Customers', icon: <PeopleAltRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'cust_history', label: 'Purchase History', icon: <ReceiptLongRoundedIcon sx={{ fontSize: 14 }} /> },
      ],
    },
    {
      id: 'terminal',
      label: 'Go to terminal',
      icon: <PointOfSaleOutlinedIcon sx={{ fontSize: 18 }} />,
      href: '/pos',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsOutlinedIcon sx={{ fontSize: 18 }} />,
      subItems: [
        { id: 'set_store', label: 'Store Profile', icon: <StoreRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'set_tables', label: 'Tables & Dining', icon: <TableRestaurantRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'set_hardware', label: 'Hardware', icon: <PrintRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'set_logout', label: 'Log Out', icon: <LogoutRoundedIcon sx={{ fontSize: 14 }} /> },
      ],
    },
  ];

  const normalizedSidebarSearch = sidebarSearch.trim().toLowerCase();
  const filteredNavItems = normalizedSidebarSearch
    ? navItems
        .map((item) => {
          const itemMatches = item.label.toLowerCase().includes(normalizedSidebarSearch);
          const matchingSubItems = item.subItems?.filter((subItem) => subItem.label.toLowerCase().includes(normalizedSidebarSearch));
          if (itemMatches) return item;
          if (matchingSubItems && matchingSubItems.length > 0) return { ...item, subItems: matchingSubItems };
          return null;
        })
        .filter((item): item is NavItem => item !== null)
    : navItems;


  // Dynamic greeting based on current local hour
  const [greeting, setGreeting] = useState('Welcome');
  const [merchantName, setMerchantName] = useState('');

  // Real-time dashboard KPI states from backend API
  const [todayRevenue, setTodayRevenue] = useState('₹0');
  const [todayOrdersCount, setTodayOrdersCount] = useState(0);
  const [activeProductsCount, setActiveProductsCount] = useState(0);
  const [liveSales, setLiveSales] = useState<BillRecord[]>([]);

  // Fetch real-time dashboard analytics from backend APIs
  const fetchDashboardAnalytics = useCallback(async () => {
    try {
      const storedName = localStorage.getItem('nuradesk_user_name') || localStorage.getItem('storeName') || '';
      if (storedName) {
        setMerchantName(storedName);
      }

      const [salesRes, prodRes] = await Promise.allSettled([
        getOwnerSales(),
        getCatalogProducts(),
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value.data) {
        const count = Array.isArray(prodRes.value.data)
          ? prodRes.value.data.filter((p: any) => p.status === 'ACTIVE' || p.isActive !== false).length
          : 0;
        setActiveProductsCount(count);
      }

      if (salesRes.status === 'fulfilled' && salesRes.value.data && Array.isArray(salesRes.value.data)) {
        const sales = salesRes.value.data;
        setLiveSales(sales);

        const todayStr = new Date().toISOString().split('T')[0];
        const todayBills = sales.filter((s: any) => {
          const sDate = s.createdAtUtc ? s.createdAtUtc.split('T')[0] : '';
          return sDate === todayStr;
        });

        setTodayOrdersCount(todayBills.length);
        const rev = todayBills.reduce((sum: number, s: any) => sum + (Number(s.totalAmount) || 0), 0);
        setTodayRevenue(`₹${Math.round(rev).toLocaleString('en-IN')}`);
      }
    } catch (e) {
      console.error('Failed to load dashboard analytics:', e);
    }
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    fetchDashboardAnalytics();
  }, [fetchDashboardAnalytics, activeTabId]);

  // Dynamic Orders Trend Calculation for the Bar Chart
  const ordersTrendData = useMemo(() => {
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    const now = new Date();
    const todayIndex = (now.getDay() + 6) % 7; // Convert Sun(0)..Sat(6) to Mon(0)..Sun(6)

    let relevant = liveSales;
    if (dateRange === 'today') {
      const todayStr = now.toISOString().split('T')[0];
      relevant = liveSales.filter(s => s.createdAtUtc && s.createdAtUtc.startsWith(todayStr));
    } else if (dateRange === 'week') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      relevant = liveSales.filter(s => s.createdAtUtc && new Date(s.createdAtUtc) >= sevenDaysAgo);
    } else if (dateRange === 'month') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      relevant = liveSales.filter(s => s.createdAtUtc && new Date(s.createdAtUtc) >= thirtyDaysAgo);
    }

    relevant.forEach((s) => {
      if (s.createdAtUtc) {
        const d = new Date(s.createdAtUtc);
        const idx = (d.getDay() + 6) % 7;
        counts[idx] += 1;
      }
    });

    const maxCount = Math.max(...counts, 1);
    const bars = counts.map((count, idx) => ({
      day: dayLabels[idx],
      count,
      height: count === 0 ? 8 : Math.max(14, Math.round((count / maxCount) * 100)),
      isToday: idx === todayIndex,
    }));

    return {
      bars,
      totalOrders: relevant.length,
    };
  }, [liveSales, dateRange]);

  // Dynamic Top-Selling Products Calculation
  const topSellingProducts = useMemo(() => {
    const now = new Date();
    let relevant = liveSales;

    if (dateRange === 'today') {
      const todayStr = now.toISOString().split('T')[0];
      relevant = liveSales.filter(s => s.createdAtUtc && s.createdAtUtc.startsWith(todayStr));
    } else if (dateRange === 'week') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      relevant = liveSales.filter(s => s.createdAtUtc && new Date(s.createdAtUtc) >= sevenDaysAgo);
    } else if (dateRange === 'month') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      relevant = liveSales.filter(s => s.createdAtUtc && new Date(s.createdAtUtc) >= thirtyDaysAgo);
    }

    const qtyMap: Record<string, { name: string; quantity: number }> = {};
    for (const sale of relevant) {
      for (const item of sale.items || []) {
        const name = item.productName || `Item #${item.productId}`;
        if (!qtyMap[name]) {
          qtyMap[name] = { name, quantity: 0 };
        }
        qtyMap[name].quantity += Number(item.quantity) || 1;
      }
    }

    return Object.values(qtyMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 3);
  }, [liveSales, dateRange]);

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

  if (isAuthorized !== true) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.bgPage,
        color: theme.textSecondary,
        fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: `3px solid ${theme.border}`,
            borderTopColor: theme.activeBg || '#111827',
            borderRadius: '50%',
            animation: 'nurapos-spin 0.7s linear infinite',
          }} />
          <style>{`
            @keyframes nurapos-spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.02em' }}>
            Securing session...
          </span>
        </div>
      </div>
    );
  }

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
        .sidebar-nav-btn .sidebar-chevron-arrow {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.18s ease, transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sidebar-nav-btn:hover .sidebar-chevron-arrow,
        .sidebar-nav-btn.is-expanded .sidebar-chevron-arrow {
          opacity: 1;
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
          width: '240px',
          minWidth: '240px',
          maxWidth: '240px',
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
              fontWeight: 750,
              letterSpacing: '-0.02em',
              color: theme.sidebarTextPrimary || theme.textPrimary,
            }}>
              Nuradesk
            </span>
          </Link>

          {/* Universal Sidebar Search */}
          <div style={{ position: 'relative', margin: '0.9rem 0 0.75rem' }}>
            <SearchRoundedIcon sx={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 17,
              color: theme.sidebarTextSecondary || theme.textSecondary,
              pointerEvents: 'none',
            }} />
            <input
              type="search"
              value={sidebarSearch}
              onChange={(event) => setSidebarSearch(event.target.value)}
              placeholder="Search menu"
              aria-label="Search dashboard menu"
              style={{
                width: '100%',
                height: '34px',
                padding: '0 0.65rem 0 2.1rem',
                borderRadius: '9999px',
                border: `1px solid ${theme.sidebarBorder || theme.border}`,
                backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#F8FAFC',
                color: theme.sidebarTextPrimary || theme.textPrimary,
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Navigation Links List — scrollable area */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
            {filteredNavItems.map((item) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedMenus[item.id] ?? false;
              // Only leaf navigation items (without sub-items) can be selected as a parent tab
              const isActive = !hasSubItems && activeTabId === item.id;

              return (
                <div key={item.id}>
                  <button
                    type="button"
                    className={`sidebar-nav-btn ${isExpanded ? 'is-expanded' : ''}`}
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
                        fontSize: '13.5px',
                        fontWeight: isActive ? 750 : 600,
                        letterSpacing: '0',
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
                      <span
                        className="sidebar-chevron-arrow"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          color: isActive ? theme.sidebarActiveText : (theme.sidebarTextPrimary || theme.textPrimary),
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      >
                        <KeyboardArrowDownRoundedIcon sx={{ fontSize: 16, color: isActive ? theme.sidebarActiveText : (theme.sidebarTextPrimary || theme.textPrimary) }} />
                      </span>
                    ) : item.href ? (
                      <span
                        className="sidebar-chevron-arrow"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          color: theme.sidebarTextSecondary || theme.textSecondary,
                        }}
                      >
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

                        if (sub.id === 'set_logout') {
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={handleLogout}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.55rem',
                                textAlign: 'left',
                                padding: '0.32rem 0.5rem',
                                borderRadius: '0.45rem',
                                border: 'none',
                                backgroundColor: 'transparent',
                                color: '#EF4444',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                transition: 'all 0.15s ease',
                                width: '100%',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#EF4444',
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
                        }

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
          overflow: (isSettingsActive || isCustomersActive || isEmployeesActive || isSalesActive || isReportsActive || isCatalogActive || isInventoryActive) ? 'auto' : 'hidden',
          padding: (isSettingsActive || isCustomersActive || isEmployeesActive || isSalesActive || isReportsActive || isInventoryActive) ? 'clamp(1.5rem, 3vw, 2.5rem)' : 0,
          backgroundColor: theme.bgPage,
          boxSizing: 'border-box',
        }}>
          {isSettingsActive ? (
            <SettingsManagement
              activeSubTab={
                activeTabId === 'set_tables' ? 'set_tables' :
                activeTabId === 'set_hardware' ? 'set_hardware' : 'set_store'
              }
              onSelectSubTab={(tab) => {
                setActiveTabId(tab);
                openSingleMenu('settings');
              }}
              theme={theme}
              currentThemeId={currentThemeId}
              onSelectTheme={handleSelectTheme}
              onLogout={handleLogout}
            />
          ) : isCustomersActive ? (
            <CustomersManagement
              activeSubTab={
                activeTabId === 'cust_history' ? 'cust_history' : 'cust_all'
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
                activeTabId === 'emp_shifts' ? 'emp_shifts' : 'emp_all'
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
                activeTabId === 'rep_inventory' ? 'rep_inventory' : 'rep_sales'
              }
              onSelectSubTab={(tab) => {
                setActiveTabId(tab);
                openSingleMenu('reports');
              }}
              theme={theme}
            />
          ) : activeTabId === 'offers' ? (
            <OffersManagement theme={theme} />
          ) : isCatalogActive ? (
            <ProductManagement
              activeSubTab={
                activeTabId === 'add_product' ? 'add_product' :
                activeTabId === 'categories' ? 'categories' : 'products'
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
              overflowY: 'auto',
              overflowX: 'hidden',
              flexDirection: 'column',
              backgroundColor: theme.bgPage,
            }}>
              {/* Middle Main Content Area (Scrollable) */}
              <div style={{
                width: '100%',
                flex: 'none',
                height: 'auto',
                overflow: 'visible',
                padding: 'clamp(1.25rem, 2.5vw, 2.25rem)',
                boxSizing: 'border-box',
                backgroundColor: theme.bgPage,
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
                          Store Setup · 3 Quick Steps
                        </span>
                      </div>
                    </div>

                    {/* 2 Setup Cards Grid - Compact Modern UI */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: '0.85rem',
                    }}>
                      {/* Card 1: Add your first product */}
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
                            <Inventory2RoundedIcon sx={{ fontSize: 18, color: theme.textSecondary }} />
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: theme.textSecondary,
                              backgroundColor: theme.hoverBg,
                              padding: '2px 8px',
                              borderRadius: '9999px',
                            }}>
                              Step 1
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
                              setActiveTabId('set_hardware');
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
                            <span>Hardware settings</span>
                          </button>
                        </div>
                      </div>

                      {/* Card 3: Set tables for cafe or restaurant */}
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
                              <TableRestaurantRoundedIcon sx={{ fontSize: 18, color: theme.textSecondary }} />
                            </div>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: theme.textSecondary,
                              backgroundColor: theme.hoverBg,
                              padding: '2px 8px',
                              borderRadius: '9999px',
                            }}>
                              Step 3
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
                            Set tables for cafe or restaurant
                          </h3>

                          {/* Description */}
                          <p style={{
                            fontSize: '12px',
                            color: theme.textSecondary,
                            lineHeight: 1.45,
                            margin: 0,
                            fontWeight: 450,
                          }}>
                            Configure floor layouts, seating capacity, table numbers, and order ticket tokens.
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
                            src="/dashimages/card3dash.png"
                            alt="Set tables for cafe or restaurant"
                            width={195}
                            height={130}
                            style={{
                              objectFit: 'contain',
                              maxHeight: '130px',
                              width: 'auto',
                              borderRadius: '0.6rem',
                            }}
                            priority
                          />
                        </div>

                        {/* Bottom Actions Row */}
                        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          
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
                width: '100%',
                minWidth: 0,
                maxWidth: 'none',
                height: 'auto',
                overflow: 'visible',
                backgroundColor: theme.sidebarIsDark ? theme.bgSidebar : '#FAFAFA',
                padding: '1.5rem 1.25rem',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '1rem',
                boxSizing: 'border-box',
                flexShrink: 0,
              }}>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <h2 style={{ margin: 0, color: theme.textPrimary, fontSize: '16px', fontWeight: 800, letterSpacing: '-0.02em' }}>
                    Today&apos;s overview
                  </h2>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.2rem', border: `1px solid ${theme.border}`, borderRadius: '9999px', backgroundColor: theme.bgCard }}>
                    {[
                      ['today', 'Today'],
                      ['week', 'This week'],
                      ['month', 'This month'],
                    ].map(([value, label]) => {
                      const isSelected = dateRange === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setDateRange(value as 'today' | 'week' | 'month')}
                          style={{
                            border: 'none',
                            borderRadius: '9999px',
                            padding: '0.35rem 0.7rem',
                            backgroundColor: isSelected ? theme.activeBg : 'transparent',
                            color: isSelected ? theme.activeText : theme.textSecondary,
                            fontSize: '11px',
                            fontWeight: 700,
                            fontFamily: 'inherit',
                            cursor: 'pointer',
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

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
                    flex: 1,
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
                    flex: 1,
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
                    flex: 1,
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

              {/* ========================================================
                  BENTO GRID: ORDERS, TOP PRODUCTS, LOW STOCK
                  ======================================================== */}
              <section style={{
                width: '100%',
                padding: '0 1.25rem 1.5rem',
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.6fr) minmax(260px, 1fr)',
                gap: '1rem',
                boxSizing: 'border-box',
              }}>
                {/* Orders trend */}
                <div style={{
                  minHeight: '250px',
                  padding: '1.25rem',
                  backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
                  border: `1px solid ${theme.borderCard}`,
                  borderRadius: '0.9rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  boxSizing: 'border-box',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: theme.textPrimary }}>Orders trend</h2>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '12px', color: theme.textSecondary }}>
                        {dateRange === 'today' ? 'Orders for today' : dateRange === 'week' ? 'Orders over the last 7 days' : 'Orders over the last 30 days'}
                      </p>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A', backgroundColor: 'rgba(22, 163, 74, 0.1)', borderRadius: '9999px', padding: '0.25rem 0.55rem' }}>
                      {ordersTrendData.totalOrders > 0 ? `+${ordersTrendData.totalOrders} Orders` : '0 Orders'}
                    </span>
                  </div>
                  <div style={{ height: '145px', display: 'flex', alignItems: 'flex-end', gap: '0.7rem', borderBottom: `1px solid ${theme.border}`, padding: '0 0.35rem' }}>
                    {ordersTrendData.bars.map((bar, index) => (
                      <div key={index} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: '0.45rem' }}>
                        <div
                          title={`${bar.day}: ${bar.count} order${bar.count === 1 ? '' : 's'}`}
                          style={{
                            width: '100%',
                            maxWidth: '32px',
                            height: `${bar.height}%`,
                            backgroundColor: bar.isToday ? theme.activeBg : theme.border,
                            borderRadius: '0.35rem 0.35rem 0 0',
                            transition: 'height 0.3s ease, background-color 0.2s ease',
                          }}
                        />
                        <span style={{ fontSize: '10px', color: bar.isToday ? theme.textPrimary : theme.textMuted, fontWeight: bar.isToday ? 700 : 400 }}>
                          {bar.day}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top-selling products */}
                <div style={{
                  minHeight: '250px',
                  padding: '1.25rem',
                  backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
                  border: `1px solid ${theme.borderCard}`,
                  borderRadius: '0.9rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  boxSizing: 'border-box',
                }}>
                  <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: theme.textPrimary }}>Top-selling products</h2>
                  <p style={{ margin: '0.25rem 0 1rem', fontSize: '12px', color: theme.textSecondary }}>
                    Best performers {dateRange === 'today' ? 'today' : dateRange === 'week' ? 'this week' : 'this month'}
                  </p>
                  {topSellingProducts.length > 0 ? (
                    topSellingProducts.map((p, index) => (
                      <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0', borderTop: index === 0 ? 'none' : `1px solid ${theme.border}` }}>
                        <span style={{ width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.45rem', backgroundColor: theme.hoverBg, color: theme.textSecondary, fontSize: '11px', fontWeight: 800 }}>{index + 1}</span>
                        <span style={{ flex: 1, fontSize: '12px', fontWeight: 700, color: theme.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                        <span style={{ fontSize: '11px', color: theme.textSecondary, fontWeight: 600 }}>{p.quantity} sold</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '2rem 0.5rem', textAlign: 'center', color: theme.textSecondary, fontSize: '12px' }}>
                      <p style={{ margin: 0, fontWeight: 600 }}>No sales recorded {dateRange === 'today' ? 'today' : dateRange === 'week' ? 'this week' : 'this month'}</p>
                      <p style={{ margin: '4px 0 0', fontSize: '11px', color: theme.textMuted }}>Orders rung up on POS will rank here live.</p>
                    </div>
                  )}
                </div>

              </section>
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
