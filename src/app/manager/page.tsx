'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Material Rounded Icons
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import AssignmentReturnRoundedIcon from '@mui/icons-material/AssignmentReturnRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import WarehouseRoundedIcon from '@mui/icons-material/WarehouseRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';

// Management Views
import ManagerInventoryScreen from '@/components/manager/ManagerInventoryScreen';
import SalesManagement from '@/components/admin/SalesManagement';
import CustomersManagement from '@/components/admin/CustomersManagement';
import EmployeesManagement from '@/components/admin/EmployeesManagement';
import ReportsManagement from '@/components/admin/ReportsManagement';
import { AppTheme, ThemeMode, ThemeId, APP_THEMES, getStoredThemeMode, setStoredThemeMode } from '@/lib/themeConfig';

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

export default function ManagerDashboardPage() {
  const router = useRouter();

  // Active Tab & Menu Expansion State
  const [activeTabId, setActiveTabId] = useState('dashboard');
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    orders: false,
    inventory: false,
    customers: false,
    employees: false,
    reports: false,
  });

  const [chartTimeframe, setChartTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showShiftModal, setShowShiftModal] = useState(false);

  // Dynamic Manager Dark / Light Mode State
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

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

  const handleToggleTheme = () => {
    const nextMode: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
    setStoredThemeMode(nextMode);
  };

  const theme: AppTheme = APP_THEMES[themeMode] || APP_THEMES.light;

  // Accordion navigation helpers: only ONE menu expanded at a time
  const openSingleMenu = (menuId: string) => {
    setExpandedMenus({
      orders: menuId === 'orders',
      inventory: menuId === 'inventory',
      customers: menuId === 'customers',
      employees: menuId === 'employees',
      reports: menuId === 'reports',
    });
  };

  const closeAllMenus = () => {
    setExpandedMenus({
      orders: false,
      inventory: false,
      customers: false,
      employees: false,
      reports: false,
    });
  };

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => {
      const isCurrentlyOpen = !!prev[menuId];
      if (isCurrentlyOpen) {
        return {
          orders: false,
          inventory: false,
          customers: false,
          employees: false,
          reports: false,
        };
      }
      return {
        orders: menuId === 'orders',
        inventory: menuId === 'inventory',
        customers: menuId === 'customers',
        employees: menuId === 'employees',
        reports: menuId === 'reports',
      };
    });
  };

  // Nav Items configured per user specification:
  // Orders (All Orders, Returns, Payments)
  // Inventory (Unified single-page view, no submenus)
  // Customers (All Customers, Purchase History)
  // Employees (Staff, Shifts, Attendance, Performance)
  // Reports (Sales, Inventory, Employee Performance)
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: <HomeRoundedIcon sx={{ fontSize: 18 }} />,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <ReceiptLongRoundedIcon sx={{ fontSize: 18 }} />,
      subItems: [
        { id: 'orders_all', label: 'All Orders', icon: <ReceiptLongRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'orders_returns', label: 'Returns', icon: <AssignmentReturnRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'orders_payments', label: 'Payments', icon: <CreditCardRoundedIcon sx={{ fontSize: 14 }} /> },
      ],
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <WarehouseRoundedIcon sx={{ fontSize: 18 }} />,
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: <PeopleAltRoundedIcon sx={{ fontSize: 18 }} />,
      subItems: [
        { id: 'cust_all', label: 'All Customers', icon: <PeopleAltRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'cust_history', label: 'Purchase History', icon: <ReceiptLongRoundedIcon sx={{ fontSize: 14 }} /> },
      ],
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: <BadgeRoundedIcon sx={{ fontSize: 18 }} />,
      subItems: [
        { id: 'emp_staff', label: 'Staff', icon: <PeopleAltRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'emp_shifts', label: 'Shifts', icon: <ScheduleRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'emp_attendance', label: 'Attendance', icon: <EventAvailableRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'emp_performance', label: 'Performance', icon: <TrendingUpRoundedIcon sx={{ fontSize: 14 }} /> },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <AssessmentRoundedIcon sx={{ fontSize: 18 }} />,
      subItems: [
        { id: 'rep_sales', label: 'Sales', icon: <BarChartRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'rep_inventory', label: 'Inventory', icon: <LayersRoundedIcon sx={{ fontSize: 14 }} /> },
        { id: 'rep_performance', label: 'Employee Performance', icon: <BadgeRoundedIcon sx={{ fontSize: 14 }} /> },
      ],
    },
    {
      id: 'terminal',
      label: 'Go to terminal',
      icon: <PointOfSaleRoundedIcon sx={{ fontSize: 18 }} />,
      href: '/pos',
    },
  ];

  // Active section detectors
  const isOrdersActive =
    activeTabId === 'orders' ||
    activeTabId === 'orders_all' ||
    activeTabId === 'orders_returns' ||
    activeTabId === 'orders_payments';

  const isInventoryActive = activeTabId === 'inventory';

  const isCustomersActive =
    activeTabId === 'customers' ||
    activeTabId === 'cust_all' ||
    activeTabId === 'cust_history';

  const isEmployeesActive =
    activeTabId === 'employees' ||
    activeTabId === 'emp_staff' ||
    activeTabId === 'emp_shifts' ||
    activeTabId === 'emp_attendance' ||
    activeTabId === 'emp_performance';

  const isReportsActive =
    activeTabId === 'reports' ||
    activeTabId === 'rep_sales' ||
    activeTabId === 'rep_inventory' ||
    activeTabId === 'rep_performance';

  const isDashboardActive = activeTabId === 'dashboard';

  // Weekly bar chart data for overview dashboard
  const weeklySalesData = [
    { day: 'Mon', sales: 0, orders: 0 },
    { day: 'Tue', sales: 0, orders: 0 },
    { day: 'Wed', sales: 0, orders: 0 },
    { day: 'Thu', sales: 0, orders: 0 },
    { day: 'Fri', sales: 0, orders: 0 },
    { day: 'Sat', sales: 0, orders: 0 },
    { day: 'Sun', sales: 0, orders: 0, isToday: true },
  ];
  const monthlySalesData = [
    { day: 'W1', sales: 0, orders: 0 },
    { day: 'W2', sales: 0, orders: 0 },
    { day: 'W3', sales: 0, orders: 0 },
    { day: 'W4', sales: 0, orders: 0, isToday: true },
  ];

  const chartData = chartTimeframe === 'weekly' ? weeklySalesData : monthlySalesData;
  const maxSales = Math.max(...chartData.map((d) => d.sales), 1);

  // Recent orders list
  const recentOrders: { id: string; customer: string; amount: string; status: string; time: string; items: number }[] = [];

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
      {/* Global CSS for Smooth Dropdown & Accordion Animations matching Dashboard */}
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

      {/* Main Body Layout: Compact Sidebar + Main Scrollable Area */}
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Fixed Compact Sidebar matching Dashboard Screen exactly */}
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
            href="/manager"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flex: 1, minWidth: 0 }}>
              <span style={{
                fontSize: '17px',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                color: theme.sidebarTextPrimary || theme.textPrimary,
              }}>
                Nuradesk
              </span>
              <span style={{
                fontSize: '9.5px',
                fontWeight: 800,
                backgroundColor: (theme as any).sidebarIsDark ? theme.hoverBg : '#E2E8F0',
                color: (theme as any).sidebarIsDark ? '#FFFFFF' : '#334155',
                padding: '1px 5px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}>
                Mgr
              </span>
            </div>
          </Link>

          {/* Navigation Links List — scrollable area */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
            {navItems.map((item) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedMenus[item.id] ?? false;
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

          {/* Bottom Sidebar Section — Manager Shift Card */}
          <div style={{
            paddingTop: '0.65rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            flexShrink: 0,
          }}>
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
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#16A34A',
                    boxShadow: '0 0 6px #16A34A',
                    display: 'inline-block',
                  }} />
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: theme.sidebarTextPrimary || theme.textPrimary,
                  }}>
                    Active Shift
                  </span>
                </div>
                <span style={{
                  fontSize: '9.5px',
                  fontWeight: 700,
                  color: theme.textSecondary,
                }}>
                  08:00 AM
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowShiftModal(true)}
                className="button-20"
                style={{
                  width: '100%',
                  height: '24px',
                  fontSize: '10px',
                  fontWeight: 700,
                  borderRadius: '0.4rem',
                  padding: 0,
                  border: 'none',
                }}
              >
                <span>Reconcile Shift</span>
              </button>
            </div>

            {/* Sidebar Utility Footer: Theme Toggle & Logout */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.2rem 0.2rem 0 0.2rem',
            }}>
              <button
                type="button"
                onClick={handleToggleTheme}
                title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} mode`}
                style={{
                  height: '26px',
                  padding: '0 0.45rem',
                  borderRadius: '0.4rem',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: 'transparent',
                  color: theme.sidebarTextPrimary || theme.textPrimary,
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {themeMode === 'dark' ? (
                  <LightModeRoundedIcon sx={{ fontSize: 13, color: '#EAB308' }} />
                ) : (
                  <DarkModeRoundedIcon sx={{ fontSize: 13 }} />
                )}
                <span>{themeMode === 'dark' ? 'Light' : 'Dark'}</span>
              </button>

              <Link
                href="/signin"
                title="Log out of manager session"
                style={{
                  height: '26px',
                  padding: '0 0.45rem',
                  borderRadius: '0.4rem',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: 'transparent',
                  color: theme.textSecondary,
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  textDecoration: 'none',
                  fontFamily: 'inherit',
                }}
              >
                <LogoutRoundedIcon sx={{ fontSize: 13 }} />
                <span>Log out</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Dashboard Content Area (Topbar removed) */}
        <div style={{
          flex: 1,
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.bgPage,
          boxSizing: 'border-box',
        }}>
          {/* Scrollable View Area */}
          <main style={{
            flex: 1,
            height: '100%',
            overflowY: 'auto',
            padding: (isOrdersActive || isCustomersActive || isEmployeesActive || isReportsActive || isInventoryActive)
              ? 'clamp(1.25rem, 2.5vw, 2.25rem)'
              : 0,
            backgroundColor: theme.bgPage,
            boxSizing: 'border-box',
          }}>
            {/* ORDERS VIEW */}
            {isOrdersActive && (
              <SalesManagement
                activeSubTab={
                  activeTabId === 'orders_returns' ? 'returns' :
                  activeTabId === 'orders_payments' ? 'payments' : 'orders'
                }
                onSelectSubTab={(tab) => {
                  const mapped = tab === 'returns' ? 'orders_returns' : tab === 'payments' ? 'orders_payments' : 'orders_all';
                  setActiveTabId(mapped);
                  openSingleMenu('orders');
                }}
                theme={theme}
              />
            )}

            {/* INVENTORY VIEW - ONE UNIFIED PAGE */}
            {isInventoryActive && (
              <ManagerInventoryScreen
                theme={theme}
              />
            )}

            {/* CUSTOMERS VIEW (Loyalty removed) */}
            {isCustomersActive && (
              <CustomersManagement
                activeSubTab={
                  activeTabId === 'cust_history' ? 'cust_history' : 'cust_all'
                }
                onSelectSubTab={(tab) => {
                  const mapped = tab === 'cust_history' ? 'cust_history' : 'cust_all';
                  setActiveTabId(mapped);
                  openSingleMenu('customers');
                }}
                theme={theme}
              />
            )}

            {/* EMPLOYEES VIEW */}
            {isEmployeesActive && (
              <EmployeesManagement
                isManagerView={true}
                activeSubTab={
                  activeTabId === 'emp_shifts' ? 'emp_shifts' :
                  activeTabId === 'emp_attendance' ? 'emp_attendance' :
                  activeTabId === 'emp_performance' ? 'emp_performance' : 'emp_all'
                }
                onSelectSubTab={(tab) => {
                  const mapped =
                    tab === 'emp_shifts' ? 'emp_shifts' :
                    tab === 'emp_attendance' ? 'emp_attendance' :
                    tab === 'emp_performance' ? 'emp_performance' : 'emp_staff';
                  setActiveTabId(mapped);
                  openSingleMenu('employees');
                }}
                theme={theme}
              />
            )}

            {/* REPORTS VIEW */}
            {isReportsActive && (
              <ReportsManagement
                activeSubTab={
                  activeTabId === 'rep_inventory' ? 'rep_inventory' :
                  activeTabId === 'rep_performance' ? 'rep_performance' : 'rep_sales'
                }
                onSelectSubTab={(tab) => {
                  setActiveTabId(tab);
                  openSingleMenu('reports');
                }}
                theme={theme}
              />
            )}

            {/* OVERVIEW DASHBOARD VIEW */}
            {isDashboardActive && (
              <div style={{
                maxWidth: '1180px',
                margin: '0 auto',
                padding: 'clamp(1.25rem, 2.5vw, 2.25rem)',
              }}>
                {/* Header Greeting */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <h1 style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: theme.textPrimary,
                    letterSpacing: '-0.035em',
                    marginBottom: '0.25rem',
                  }}>
                    {(() => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; })()}, Amit 👋
                  </h1>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: theme.textSecondary,
                    letterSpacing: '-0.01em',
                    margin: 0,
                  }}>
                    Store Manager Overview & Live Operations.
                  </p>
                </div>

                {/* 3 KPI Cards: Today's Sales | Orders | Customers */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '1.75rem',
                }}>
                  {/* Card 1: Today's Sales */}
                  <div
                    style={{
                      backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
                      border: `1px solid ${hoveredCard === 'sales' ? theme.borderHover : theme.borderCard}`,
                      borderRadius: '1rem',
                      padding: '1.3rem 1.4rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '120px',
                      boxSizing: 'border-box',
                      transition: 'all 0.18s ease',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      transform: hoveredCard === 'sales' ? 'translateY(-2px)' : 'translateY(0)',
                    }}
                    onMouseEnter={() => setHoveredCard('sales')}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => { setActiveTabId('rep_sales'); openSingleMenu('reports'); }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        Today&apos;s Revenue
                      </span>
                      <TrendingUpRoundedIcon sx={{ fontSize: 16, color: '#16A34A' }} />
                    </div>
                    <div style={{ marginTop: '0.75rem' }}>
                      <span style={{ fontSize: '30px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.04em' }}>
                        ₹0
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Orders */}
                  <div
                    style={{
                      backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
                      border: `1px solid ${hoveredCard === 'orders' ? theme.borderHover : theme.borderCard}`,
                      borderRadius: '1rem',
                      padding: '1.3rem 1.4rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '120px',
                      boxSizing: 'border-box',
                      transition: 'all 0.18s ease',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      transform: hoveredCard === 'orders' ? 'translateY(-2px)' : 'translateY(0)',
                    }}
                    onMouseEnter={() => setHoveredCard('orders')}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => { setActiveTabId('orders_all'); openSingleMenu('orders'); }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        Total Orders Today
                      </span>
                      <ReceiptLongRoundedIcon sx={{ fontSize: 16, color: theme.textSecondary }} />
                    </div>
                    <div style={{ marginTop: '0.75rem' }}>
                      <span style={{ fontSize: '30px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.04em' }}>
                        0
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Customers */}
                  <div
                    style={{
                      backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
                      border: `1px solid ${hoveredCard === 'customers' ? theme.borderHover : theme.borderCard}`,
                      borderRadius: '1rem',
                      padding: '1.3rem 1.4rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '120px',
                      boxSizing: 'border-box',
                      transition: 'all 0.18s ease',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      transform: hoveredCard === 'customers' ? 'translateY(-2px)' : 'translateY(0)',
                    }}
                    onMouseEnter={() => setHoveredCard('customers')}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => { setActiveTabId('cust_all'); openSingleMenu('customers'); }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        Active Customers
                      </span>
                      <PeopleAltRoundedIcon sx={{ fontSize: 16, color: theme.textSecondary }} />
                    </div>
                    <div style={{ marginTop: '0.75rem' }}>
                      <span style={{ fontSize: '30px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.04em' }}>
                        0
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sales Overview Section with Interactive Bar Chart */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.85rem',
                  }}>
                    <h2 style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      color: theme.textPrimary,
                      letterSpacing: '-0.025em',
                      margin: 0,
                    }}>
                      Sales Overview
                    </h2>

                    {/* Chart Filter Toggle */}
                    <div style={{
                      display: 'inline-flex',
                      backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#F3F4F6',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '0.65rem',
                      padding: '3px',
                    }}>
                      <button
                        type="button"
                        onClick={() => setChartTimeframe('weekly')}
                        style={{
                          padding: '3px 12px',
                          fontSize: '12px',
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
                          padding: '3px 12px',
                          fontSize: '12px',
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
                    backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
                    border: `1px solid ${theme.borderCard}`,
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxSizing: 'border-box',
                    position: 'relative',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1.5rem',
                    }}>
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: theme.textSecondary }}>
                          {chartTimeframe === 'weekly' ? 'Total Weekly Gross' : 'Total Monthly Gross'}
                        </span>
                        <div style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.035em', marginTop: '0.2rem' }}>
                          ₹{chartData.reduce((acc, curr) => acc + curr.sales, 0).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        backgroundColor: (theme as any).sidebarIsDark ? theme.hoverBg : '#F0FDF4',
                        border: `1px solid ${theme.border}`,
                        color: '#16A34A',
                        padding: '3px 10px',
                        borderRadius: '9999px',
                      }}>
                        <TrendingUpRoundedIcon sx={{ fontSize: 15 }} />
                        <span>0.0% vs previous period</span>
                      </div>
                    </div>

                    {/* Bar Chart */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      height: '180px',
                      gap: 'clamp(0.75rem, 2vw, 1.75rem)',
                      borderBottom: `1px solid ${theme.border}`,
                      paddingBottom: '8px',
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
                                bottom: `${Math.min(barHeightPct + 12, 88)}%`,
                                backgroundColor: theme.activeBg,
                                color: theme.activeText,
                                padding: '4px 8px',
                                borderRadius: '0.45rem',
                                fontSize: '11px',
                                fontWeight: 800,
                                whiteSpace: 'nowrap',
                                zIndex: 10,
                                pointerEvents: 'none',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1px',
                              }}>
                                <span>₹{item.sales.toLocaleString('en-IN')}</span>
                                <span style={{ fontSize: '9.5px', opacity: 0.8 }}>{item.orders} orders</span>
                              </div>
                            )}

                            {/* Bar Pillar */}
                            <div style={{
                              width: '100%',
                              maxWidth: '40px',
                              height: `${barHeightPct}%`,
                              backgroundColor: isHighlighted ? theme.activeBg : (theme as any).sidebarIsDark ? '#334155' : '#D1D5DB',
                              borderRadius: '5px 5px 0 0',
                              transition: 'height 0.3s ease, background-color 0.2s ease',
                              cursor: 'pointer',
                            }} />

                            {/* Day Label */}
                            <span style={{
                              marginTop: '8px',
                              fontSize: '11.5px',
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
                    marginBottom: '0.85rem',
                  }}>
                    <h2 style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      color: theme.textPrimary,
                      letterSpacing: '-0.025em',
                      margin: 0,
                    }}>
                      Recent Orders
                    </h2>
                    <button
                      type="button"
                      onClick={() => { setActiveTabId('orders_all'); openSingleMenu('orders'); }}
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: theme.textPrimary,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      View all orders →
                    </button>
                  </div>

                  {/* Table Container Card */}
                  <div style={{
                    backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
                    border: `1px solid ${theme.borderCard}`,
                    borderRadius: '1rem',
                    padding: '0.35rem',
                    boxSizing: 'border-box',
                    overflowX: 'auto',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      textAlign: 'left',
                      fontSize: '13px',
                    }}>
                      <thead>
                        <tr style={{
                          borderBottom: `1px solid ${theme.border}`,
                          backgroundColor: theme.tableHeaderBg,
                        }}>
                          <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            Order ID
                          </th>
                          <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            Customer
                          </th>
                          <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            Items
                          </th>
                          <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            Amount
                          </th>
                          <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            Time
                          </th>
                          <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ padding: '2.5rem 1rem', textAlign: 'center', color: theme.textSecondary }}>
                              No orders recorded today yet.
                            </td>
                          </tr>
                        ) : (
                          recentOrders.map((order, i) => (
                            <tr
                              key={order.id}
                              style={{
                                borderBottom: i < recentOrders.length - 1 ? `1px solid ${theme.border}` : 'none',
                                transition: 'background-color 0.15s ease',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.tableRowHover; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                              <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textPrimary, fontFamily: 'monospace, inherit' }}>
                                {order.id}
                              </td>
                              <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: theme.textPrimary }}>
                                {order.customer}
                              </td>
                              <td style={{ padding: '0.75rem 1rem', color: theme.textSecondary }}>
                                {order.items} items
                              </td>
                              <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textPrimary }}>
                                {order.amount}
                              </td>
                              <td style={{ padding: '0.75rem 1rem', color: theme.textSecondary, fontSize: '12px' }}>
                                {order.time}
                              </td>
                              <td style={{ padding: '0.75rem 1rem' }}>
                                <span style={{
                                  display: 'inline-block',
                                  padding: '2px 8px',
                                  borderRadius: '9999px',
                                  backgroundColor: '#DCFCE7',
                                  color: '#166534',
                                  fontSize: '10.5px',
                                  fontWeight: 800,
                                  letterSpacing: '0.03em',
                                }}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Shift Details Modal */}
      {showShiftModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '440px',
            backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
            border: `1px solid ${theme.border}`,
            borderRadius: '1.15rem',
            padding: '1.5rem',
            boxShadow: '0 20px 48px rgba(0,0,0,0.22)',
            boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ScheduleRoundedIcon sx={{ fontSize: 22, color: theme.textPrimary }} />
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Active Shift Summary
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShiftModal(false)}
                style={{ background: 'none', border: 'none', color: theme.textPrimary, cursor: 'pointer', display: 'flex' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 18 }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: theme.bgPage, borderRadius: '0.55rem', border: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '12.5px', color: theme.textSecondary }}>Store Manager</span>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: theme.textPrimary }}>Amit Patel (Store Mgr)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: theme.bgPage, borderRadius: '0.55rem', border: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '12.5px', color: theme.textSecondary }}>Shift Started</span>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: theme.textPrimary }}>Today, 08:00 AM</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: theme.bgPage, borderRadius: '0.55rem', border: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '12.5px', color: theme.textSecondary }}>Opening Float</span>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: theme.textPrimary }}>₹0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: theme.bgPage, borderRadius: '0.55rem', border: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '12.5px', color: theme.textSecondary }}>Total Shift Tender</span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: theme.textPrimary }}>₹0</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <Link
                href="/start-shift"
                className="button-20"
                style={{
                  flex: 1,
                  height: '38px',
                  borderRadius: '0.65rem',
                  fontSize: '12.5px',
                  fontWeight: 700,
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
                className="button-20-secondary"
                style={{
                  padding: '0 1.15rem',
                  height: '38px',
                  borderRadius: '0.65rem',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
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
