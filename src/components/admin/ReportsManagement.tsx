'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';

// Material Rounded Icons
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded';

export interface ReportsManagementProps {
  activeSubTab?: 'rep_sales' | 'rep_inventory' | 'rep_customers' | 'rep_performance';
  onSelectSubTab?: (tab: 'rep_sales' | 'rep_inventory' | 'rep_customers' | 'rep_performance') => void;
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
// REUSABLE ANIMATED SVG PIE / DONUT CHART COMPONENT
// ============================================================================
interface DonutSlice {
  label: string;
  value: number;
  formattedValue?: string;
  color: string;
  subtext?: string;
}

function AnimatedDonutChart({
  slices,
  totalLabel,
  totalValue,
  size = 220,
  innerRadiusRatio = 0.65,
  isRepresentation = false,
  theme,
}: {
  slices: DonutSlice[];
  totalLabel: string;
  totalValue: string;
  size?: number;
  innerRadiusRatio?: number;
  isRepresentation?: boolean;
  theme: any;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = useMemo(() => slices.reduce((sum, s) => sum + s.value, 0), [slices]);

  // Compute SVG arc paths
  const arcPaths = useMemo(() => {
    const center = size / 2;
    const radius = (size / 2) - 14;
    const innerRadius = radius * innerRadiusRatio;

    let currentAngle = -Math.PI / 2; // Start from top 12 o'clock

    return slices.map((slice, index) => {
      const sliceAngle = total > 0 ? (slice.value / total) * 2 * Math.PI : 0;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;

      const isHovered = hoveredIndex === index;
      const currentRadius = isHovered ? radius + 6 : radius;
      const currentInnerRadius = isHovered ? innerRadius - 2 : innerRadius;

      // Arc coordinates
      const x1 = center + currentRadius * Math.cos(startAngle);
      const y1 = center + currentRadius * Math.sin(startAngle);
      const x2 = center + currentRadius * Math.cos(endAngle);
      const y2 = center + currentRadius * Math.sin(endAngle);

      const x3 = center + currentInnerRadius * Math.cos(endAngle);
      const y3 = center + currentInnerRadius * Math.sin(endAngle);
      const x4 = center + currentInnerRadius * Math.cos(startAngle);
      const y4 = center + currentInnerRadius * Math.sin(startAngle);

      const largeArc = sliceAngle > Math.PI ? 1 : 0;

      // SVG path definition for donut arc
      const pathData = [
        `M ${x1} ${y1}`,
        `A ${currentRadius} ${currentRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${currentInnerRadius} ${currentInnerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
        'Z',
      ].join(' ');

      const percentage = total > 0 ? ((slice.value / total) * 100).toFixed(1) : '0';

      return {
        pathData,
        percentage,
        isHovered,
        slice,
      };
    });
  }, [slices, total, size, innerRadiusRatio, hoveredIndex]);

  const activeSlice = hoveredIndex !== null ? slices[hoveredIndex] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ overflow: 'visible' }}
        >
          <g>
            {arcPaths.map((item, index) => (
              <path
                key={item.slice.label}
                d={item.pathData}
                fill={item.slice.color}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: item.isHovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none',
                  opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.65,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </g>
        </svg>

        {/* Center Text Overlay */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          maxWidth: '120px',
        }}>
          {activeSlice ? (
            <>
              <div style={{ fontSize: '11px', fontWeight: 700, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {activeSlice.label}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em', marginTop: '1px' }}>
                {isRepresentation
                  ? (total > 0 ? `${((activeSlice.value / total) * 100).toFixed(1)}%` : '0%')
                  : (activeSlice.formattedValue || activeSlice.value)}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: activeSlice.color }}>
                {isRepresentation ? 'Share' : (total > 0 ? `${((activeSlice.value / total) * 100).toFixed(1)}%` : '0%')}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '11px', fontWeight: 700, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {totalLabel}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em', marginTop: '1px' }}>
                {totalValue}
              </div>
              <div style={{ fontSize: '10.5px', color: theme.textMuted }}>
                100% total
              </div>
            </>
          )}
        </div>
      </div>

      {/* Legend Rows */}
      <div style={{
        marginTop: '1.25rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.65rem 1.25rem',
        width: '100%',
      }}>
        {slices.map((slice, index) => {
          const isHovered = hoveredIndex === index;
          const percentage = total > 0 ? ((slice.value / total) * 100).toFixed(1) : '0';

          return (
            <div
              key={slice.label}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 8px',
                borderRadius: '0.45rem',
                backgroundColor: isHovered ? theme.hoverBg : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: slice.color,
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: '12px', fontWeight: isHovered ? 800 : 600, color: theme.textPrimary }}>
                  {slice.label}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textPrimary }}>
                  {percentage}%
                </span>
                {slice.formattedValue && (
                  <span style={{ fontSize: '10.5px', color: theme.textSecondary, marginLeft: '0.35rem' }}>
                    ({slice.formattedValue})
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// REUSABLE ANIMATED BAR CHART COMPONENT
// ============================================================================
interface BarDatum {
  label: string;
  value: number;
  secondaryValue?: number;
  formattedValue?: string;
  subLabel?: string;
  isToday?: boolean;
}

function AnimatedBarChart({
  data,
  height = 200,
  barColor = '#111827',
  activeBarColor = '#3B82F6',
  valuePrefix = '₹',
  isRepresentation = false,
  theme,
}: {
  data: BarDatum[];
  height?: number;
  barColor?: string;
  activeBarColor?: string;
  valuePrefix?: string;
  isRepresentation?: boolean;
  theme: any;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = useMemo(() => {
    const vals = data.map((d) => d.value);
    return Math.max(...vals, 1);
  }, [data]);

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: `${height}px`,
        gap: 'clamp(0.5rem, 1.5vw, 1.25rem)',
        borderBottom: `1px solid ${theme.border}`,
        paddingBottom: '8px',
        position: 'relative',
      }}>
        {data.map((item, index) => {
          const isHovered = hoveredIndex === index;
          const heightPercent = Math.max(10, (item.value / maxValue) * 100);

          return (
            <div
              key={index}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end',
                position: 'relative',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Floating Tooltip */}
              {isHovered && (
                <div style={{
                  position: 'absolute',
                  top: `calc(${100 - heightPercent}% - 42px)`,
                  backgroundColor: '#111827',
                  color: '#F9FAFB',
                  padding: '4px 9px',
                  borderRadius: '0.45rem',
                  fontSize: '11px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  zIndex: 20,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  pointerEvents: 'none',
                  animation: 'fadeIn 0.15s ease',
                  border: '1px solid #374151',
                }}>
                  {isRepresentation ? (
                    <div>{item.label} • Representative Volume</div>
                  ) : (
                    <>
                      <div>{item.label}: {item.formattedValue || `${valuePrefix}${item.value.toLocaleString('en-IN')}`}</div>
                      {item.secondaryValue !== undefined && (
                        <div style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 500 }}>
                          {item.secondaryValue} orders
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Bar Fill */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '36px',
                  height: `${heightPercent}%`,
                  backgroundColor: isHovered || item.isToday ? activeBarColor : barColor,
                  borderRadius: '0.45rem 0.45rem 2px 2px',
                  transition: 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* X-Axis Labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 'clamp(0.5rem, 1.5vw, 1.25rem)',
        marginTop: '0.65rem',
      }}>
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: '11.5px',
              fontWeight: hoveredIndex === index || item.isToday ? 700 : 500,
              color: hoveredIndex === index || item.isToday ? theme.textPrimary : theme.textSecondary,
              transition: 'color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN REPORTS MANAGEMENT COMPONENT
// ============================================================================
export default function ReportsManagement({
  activeSubTab = 'rep_sales',
  onSelectSubTab,
  theme,
}: ReportsManagementProps) {
  // Current tab (Sales, Inventory, Customers, Employee Performance)
  const [currentTab, setCurrentTab] = useState<'rep_sales' | 'rep_inventory' | 'rep_customers' | 'rep_performance'>(activeSubTab);

  React.useEffect(() => {
    if (activeSubTab) {
      setCurrentTab(activeSubTab);
    }
  }, [activeSubTab]);

  // Global Timeframe State (Daily, Weekly, Monthly)
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Print simulation
  const handlePrint = () => {
    window.print();
  };

  // ==========================================================================
  // DATASETS: 1. SALES REPORT (Visual Representation)
  // ==========================================================================
  const salesBarDataDaily: BarDatum[] = [
    { label: '08:00', value: 25 },
    { label: '10:00', value: 45 },
    { label: '12:00', value: 80 },
    { label: '14:00', value: 65 },
    { label: '16:00', value: 40 },
    { label: '18:00', value: 92 },
    { label: '20:00', value: 105 },
    { label: '22:00', value: 50, isToday: true },
  ];

  const salesBarDataWeekly: BarDatum[] = [
    { label: 'Mon', value: 45 },
    { label: 'Tue', value: 62 },
    { label: 'Wed', value: 78 },
    { label: 'Thu', value: 54 },
    { label: 'Fri', value: 95 },
    { label: 'Sat', value: 110 },
    { label: 'Sun', value: 85, isToday: true },
  ];

  const salesBarDataMonthly: BarDatum[] = [
    { label: 'Week 1', value: 60 },
    { label: 'Week 2', value: 78 },
    { label: 'Week 3', value: 92 },
    { label: 'Week 4', value: 110, isToday: true },
  ];

  const currentSalesBarData =
    timeframe === 'daily' ? salesBarDataDaily :
    timeframe === 'monthly' ? salesBarDataMonthly : salesBarDataWeekly;

  const paymentMethodSlices: DonutSlice[] = [
    { label: 'UPI / QR', value: 48, color: '#2563EB' },
    { label: 'Cash', value: 28, color: '#10B981' },
    { label: 'Card (EDC)', value: 18, color: '#F59E0B' },
    { label: 'Store Khata', value: 6, color: '#8B5CF6' },
  ];

  // ==========================================================================
  // DATASETS: 2. INVENTORY REPORT
  // ==========================================================================
  const inventoryCategorySlices: DonutSlice[] = [
    { label: 'Beverages & Coffee', value: 42, color: '#2563EB' },
    { label: 'Bakery & Pastries', value: 28, color: '#10B981' },
    { label: 'Gourmet Bistro', value: 20, color: '#F59E0B' },
    { label: 'Retail & Beans', value: 10, color: '#8B5CF6' },
  ];
  const inventoryStockMovementData: BarDatum[] = [
    { label: 'Mon', value: 40 },
    { label: 'Tue', value: 60 },
    { label: 'Wed', value: 75 },
    { label: 'Thu', value: 50 },
    { label: 'Fri', value: 85 },
    { label: 'Sat', value: 95 },
    { label: 'Sun', value: 65, isToday: true },
  ];
  const criticalLowStockList: { name: string; sku: string; currentStock: number; minStock: number; deficit: number; supplier: string }[] = [];
  const stockAdjustmentReasons: { reason: string; amount: number; percentage: number; color: string }[] = [];

  // ==========================================================================
  // DATASETS: 3. CUSTOMERS REPORT
  // ==========================================================================
  const customerAcquisitionSlices: DonutSlice[] = [
    { label: 'Repeat Patrons', value: 65, color: '#2563EB' },
    { label: 'New Walk-ins', value: 35, color: '#10B981' },
  ];
  const customerFrequencyData: BarDatum[] = [
    { label: '1 order', value: 85 },
    { label: '2-3 orders', value: 50 },
    { label: '4-6 orders', value: 30 },
    { label: '7-10 orders', value: 18 },
    { label: '10+ VIP', value: 12, isToday: true },
  ];
  const topCustomersList: { rank: number; name: string; phone: string; orders: number; totalSpend: number; aov: number; favorite: string; lastVisit: string }[] = [];
  const recentTransactions: { orderId: string; customer: string; items: string; amount: number; payment: string; time: string }[] = [];

  // ==========================================================================
  // DATASETS: 4. EMPLOYEE PERFORMANCE REPORT
  // ==========================================================================
  const employeeSalesData: { name: string; role: string; sales: number; orders: number; aov: number; shifts: number; speedSec: number; rating: number; discountsGiven: number }[] = [];

  const employeeDonutSlices: DonutSlice[] = [
    { label: 'Priya S.', value: 36, color: '#2563EB' },
    { label: 'Rahul V.', value: 28, color: '#10B981' },
    { label: 'Amit K.', value: 22, color: '#F59E0B' },
    { label: 'Sneha M.', value: 14, color: '#8B5CF6' },
  ];
  const employeeBarChartData: BarDatum[] = [
    { label: 'Priya S.', value: 92, isToday: true },
    { label: 'Rahul V.', value: 78 },
    { label: 'Amit K.', value: 85 },
    { label: 'Sneha M.', value: 64 },
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
      {/* 1. Header Section: Title, Timeframe Toggle & Export Action */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.75rem',
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 800,
            color: theme.textPrimary,
            letterSpacing: '-0.035em',
            margin: '0 0 0.25rem 0',
          }}>
            {currentTab === 'rep_sales' && 'Sales & Financial Reports'}
            {currentTab === 'rep_inventory' && 'Inventory Analytics & Audits'}
            {currentTab === 'rep_customers' && 'Customer Intelligence & Retention'}
            {currentTab === 'rep_performance' && 'Staff Performance & Efficiency'}
          </h1>
          <p style={{
            fontSize: '13.5px',
            color: theme.textSecondary,
            margin: 0,
            fontWeight: 500,
          }}>
            {currentTab === 'rep_sales' && 'Track gross revenues, net profit, payment methods breakdown & daily order volume.'}
            {currentTab === 'rep_inventory' && 'Monitor stock valuations, deficit warnings, inflow/outflow balance & shrinkage.'}
            {currentTab === 'rep_customers' && 'Analyze patron lifetime value, repeat frequency cohorts & VIP leaderboards.'}
            {currentTab === 'rep_performance' && 'Measure cashier sales volumes, speed of service, average tickets & shifts worked.'}
          </p>
        </div>

        {/* Header Controls: Timeframe Filter + Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Timeframe Segmented Switcher */}
          <div style={{
            position: 'relative',
            display: 'inline-flex',
            backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
            border: `1px solid ${theme.border}`,
            borderRadius: '0.65rem',
            padding: '3px',
            boxSizing: 'border-box',
          }}>
            {/* Smooth non-bouncy sliding pill indicator */}
            <div style={{
              position: 'absolute',
              top: '3px',
              bottom: '3px',
              left: '3px',
              width: 'calc((100% - 6px) / 3)',
              borderRadius: '0.45rem',
              backgroundColor: theme.activeBg,
              transform: `translateX(${timeframe === 'daily' ? '0%' : timeframe === 'weekly' ? '100%' : '200%'})`,
              transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
            }} />

            {(['daily', 'weekly', 'monthly'] as const).map((t) => {
              const isActive = timeframe === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimeframe(t)}
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    width: '74px',
                    padding: '5px 0',
                    borderRadius: '0.45rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: isActive ? theme.activeText : theme.textSecondary,
                    fontSize: '12px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'center',
                    transition: 'color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              );
            })}
          </div>

          {/* Export / Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            style={{
              height: '34px',
              padding: '0 0.85rem',
              borderRadius: '0.6rem',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.bgCard,
              color: theme.textPrimary,
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease',
            }}
          >
            <PrintRoundedIcon sx={{ fontSize: 16 }} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. SALES REPORT VIEW                                                 */}
      {/* ==================================================================== */}
      {currentTab === 'rep_sales' && (
        <>
          {/* Top Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}>
            {/* Gross Revenue */}
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
                Gross Revenue
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  ₹0
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  No data yet
                </span>
              </div>
            </div>

            {/* Total Orders */}
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
                Total Orders
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  0
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  tickets rung
                </span>
              </div>
            </div>

            {/* Average Order Value (AOV) */}
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
                Average Order Value
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  ₹0
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  per order
                </span>
              </div>
            </div>

            {/* Discounts & Refunds */}
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
                Discounts & Refunds
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  ₹0
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  no discounts / refunds
                </span>
              </div>
            </div>
          </div>

          {/* Charts Grid: Bar Chart (Sales Trend) + Pie Chart (Payment Methods) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.75rem',
          }}>
            {/* Animated Bar Chart: Revenue & Order Trajectory */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 2px 0' }}>
                    Sales & Volume Trajectory
                  </h3>
                  <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>
                    Comparing revenue growth over {timeframe} cycles.
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#16A34A',
                }}>
                  <TrendingUpRoundedIcon sx={{ fontSize: 16 }} />
                  <span>On Pace</span>
                </div>
              </div>

              {/* Bar Chart */}
              <AnimatedBarChart
                data={currentSalesBarData}
                height={190}
                barColor={(theme as any).sidebarIsDark ? '#27272A' : '#E2E8F0'}
                activeBarColor="#2563EB"
                isRepresentation={true}
                theme={theme}
              />
            </div>

            {/* Animated Donut / Pie Chart: Payment Methods Breakdown */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 2px 0' }}>
                    Payment Methods Distribution
                  </h3>
                  <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>
                    Real-time payment breakdown across register touchpoints.
                  </p>
                </div>
                <PieChartRoundedIcon sx={{ fontSize: 20, color: theme.textSecondary }} />
              </div>

              {/* Donut Chart */}
              <AnimatedDonutChart
                slices={paymentMethodSlices}
                totalLabel="Tender Mix"
                totalValue="100%"
                size={200}
                isRepresentation={true}
                theme={theme}
              />
            </div>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 2. INVENTORY REPORT VIEW                                             */}
      {/* ==================================================================== */}
      {currentTab === 'rep_inventory' && (
        <>
          {/* Top Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}>
            {/* Retail Valuation */}
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
                Inventory Retail Value
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  ₹0
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  current shelf price
                </span>
              </div>
            </div>

            {/* Cost Valuation */}
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
                Inventory Cost Asset
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  ₹0
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  cost asset
                </span>
              </div>
            </div>

            {/* Stock Health */}
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
                Catalog Health Rate
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  0%
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  no items tracked yet
                </span>
              </div>
            </div>

            {/* Inflow vs Outflow */}
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
                Today Inflow / Outflow
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  +0 / -0
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  no movement yet
                </span>
              </div>
            </div>
          </div>

          {/* Charts Grid: Inventory Valuation by Category (Donut) + Stock Movement (Bars) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.75rem',
          }}>
            {/* Category Valuation Donut Chart */}
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1.25rem',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 2px 0' }}>
                    Stock Asset Value by Category
                  </h3>
                  <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>
                    Capital allocation across food, beverage, and bakery.
                  </p>
                </div>
                <PieChartRoundedIcon sx={{ fontSize: 20, color: theme.textSecondary }} />
              </div>

              <AnimatedDonutChart
                slices={inventoryCategorySlices}
                totalLabel="Category Mix"
                totalValue="100%"
                size={200}
                isRepresentation={true}
                theme={theme}
              />
            </div>

            {/* Stock Movement Dynamics */}
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1.25rem',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 2px 0' }}>
                    Daily Stock Movement Dynamics
                  </h3>
                  <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>
                    Inflow units received via POs vs Outflow consumed.
                  </p>
                </div>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: theme.textSecondary }}>Units / Day</span>
              </div>

              <AnimatedBarChart
                data={inventoryStockMovementData}
                height={190}
                barColor="#0D9488"
                activeBarColor="#059669"
                isRepresentation={true}
                theme={theme}
              />
            </div>
          </div>

          {/* Low Stock Alert Table & Shrinkage Loss */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.5rem',
          }}>
            {/* Low-Stock Products Warning Table */}
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1.25rem',
              padding: '1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <WarningAmberRoundedIcon sx={{ fontSize: 18, color: '#D97706' }} />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                    Critical Low-Stock Warning
                  </h3>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#92400E', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '9999px' }}>
                  {criticalLowStockList.length} items
                </span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}`, textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem', fontWeight: 700, color: theme.textSecondary }}>Product</th>
                    <th style={{ padding: '0.5rem', fontWeight: 700, color: theme.textSecondary }}>Stock</th>
                    <th style={{ padding: '0.5rem', fontWeight: 700, color: theme.textSecondary }}>Min</th>
                    <th style={{ padding: '0.5rem', fontWeight: 700, color: theme.textSecondary, textAlign: 'right' }}>Deficit</th>
                  </tr>
                </thead>
                <tbody>
                  {criticalLowStockList.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: '1.5rem', textAlign: 'center', color: theme.textSecondary }}>
                        No low-stock alerts.
                      </td>
                    </tr>
                  )}
                  {criticalLowStockList.map((item) => (
                    <tr key={item.sku} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '0.6rem 0.5rem' }}>
                        <div style={{ fontWeight: 800, color: theme.textPrimary }}>{item.name}</div>
                        <div style={{ fontSize: '10.5px', color: theme.textSecondary, fontFamily: 'monospace' }}>{item.sku}</div>
                      </td>
                      <td style={{ padding: '0.6rem 0.5rem', color: '#DC2626', fontWeight: 800 }}>
                        {item.currentStock} units
                      </td>
                      <td style={{ padding: '0.6rem 0.5rem', color: theme.textSecondary }}>
                        {item.minStock} units
                      </td>
                      <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>
                        <span style={{
                          backgroundColor: '#FEE2E2',
                          color: '#991B1B',
                          padding: '2px 7px',
                          borderRadius: '0.35rem',
                          fontSize: '11px',
                          fontWeight: 800,
                        }}>
                          -{item.deficit}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Stock Adjustments & Shrinkage Breakdown */}
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1.25rem',
              padding: '1.25rem',
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 0.85rem 0' }}>
                Stock Adjustments & Loss Breakdown
              </h3>
              <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '0 0 1rem 0' }}>
                Audit variances, kitchen waste and supplier claims recorded this period.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {stockAdjustmentReasons.length === 0 ? (
                  <p style={{ fontSize: '13px', color: theme.textSecondary, textAlign: 'center', margin: '1rem 0' }}>
                    No stock adjustments recorded.
                  </p>
                ) : stockAdjustmentReasons.map((adj) => (
                  <div key={adj.reason}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 700, color: theme.textPrimary }}>{adj.reason}</span>
                      <span style={{ fontWeight: 800, color: theme.textPrimary }}>₹{adj.amount.toLocaleString('en-IN')} ({adj.percentage}%)</span>
                    </div>
                    <div style={{ height: '6px', width: '100%', backgroundColor: theme.hoverBg, borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${adj.percentage}%`, backgroundColor: adj.color, borderRadius: '9999px', transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 3. CUSTOMERS REPORT VIEW                                             */}
      {/* ==================================================================== */}
      {currentTab === 'rep_customers' && (
        <>
          {/* Top Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}>
            {/* Total Customers */}
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
                Total Customer Base
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  0
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  registered patrons
                </span>
              </div>
            </div>

            {/* New Customers */}
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
                New Customers ({timeframe})
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  +0
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  no new patrons yet
                </span>
              </div>
            </div>

            {/* Repeat Customer Rate */}
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
                Repeat Customer Rate
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  0.0%
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  loyalty re-orders
                </span>
              </div>
            </div>

            {/* Average Lifetime Value */}
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
                Avg Patron LTV
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  ₹0
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  cumulative spend
                </span>
              </div>
            </div>
          </div>

          {/* Charts Grid: New vs Repeat Donut + Order Frequency Bars */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.75rem',
          }}>
            {/* New vs Repeat Acquisition Donut */}
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1.25rem',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 2px 0' }}>
                    New vs. Repeat Retention
                  </h3>
                  <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>
                    Ratio of recurring patrons versus brand new walk-ins.
                  </p>
                </div>
                <PieChartRoundedIcon sx={{ fontSize: 20, color: theme.textSecondary }} />
              </div>

              <AnimatedDonutChart
                slices={customerAcquisitionSlices}
                totalLabel="Patron Mix"
                totalValue="100%"
                size={200}
                isRepresentation={true}
                theme={theme}
              />
            </div>

            {/* Customer Frequency & Cohort Distribution */}
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1.25rem',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 2px 0' }}>
                    Order Frequency Cohorts
                  </h3>
                  <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>
                    Distribution of patrons by lifetime completed orders.
                  </p>
                </div>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: theme.textSecondary }}>Patrons</span>
              </div>

              <AnimatedBarChart
                data={customerFrequencyData}
                height={190}
                barColor="#4F46E5"
                activeBarColor="#4338CA"
                isRepresentation={true}
                theme={theme}
              />
            </div>
          </div>

          {/* Top Spending VIP Customers Leaderboard */}
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
            borderRadius: '1.25rem',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 0.85rem 0' }}>
              Top VIP Customers Leaderboard
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border}`, textAlign: 'left', backgroundColor: theme.tableHeaderBg }}>
                  <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Rank</th>
                  <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Customer</th>
                  <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Orders</th>
                  <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Total Spent</th>
                  <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>AOV</th>
                  <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Favorite Item</th>
                  <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Last Visit</th>
                </tr>
              </thead>
              <tbody>
                {topCustomersList.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: theme.textSecondary }}>
                      No customer data yet.
                    </td>
                  </tr>
                )}
                {topCustomersList.map((c) => (
                  <tr key={c.phone} style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <td style={{ padding: '0.75rem 0.85rem' }}>
                      <span style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: c.rank === 1 ? '#FEF08A' : c.rank === 2 ? '#E2E8F0' : c.rank === 3 ? '#FED7AA' : theme.hoverBg,
                        color: '#111827',
                        fontWeight: 800,
                        fontSize: '11px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        #{c.rank}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem' }}>
                      <div style={{ fontWeight: 800, color: theme.textPrimary }}>{c.name}</div>
                      <div style={{ fontSize: '11px', color: theme.textSecondary }}>{c.phone}</div>
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: theme.textPrimary }}>
                      {c.orders} orders
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', fontWeight: 800, color: '#166534' }}>
                      ₹{c.totalSpend.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: theme.textSecondary }}>
                      ₹{c.aov}
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', color: theme.textPrimary }}>
                      {c.favorite}
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', textAlign: 'right', color: theme.textSecondary, fontSize: '12px' }}>
                      {c.lastVisit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 4. EMPLOYEE PERFORMANCE REPORT VIEW                                  */}
      {/* ==================================================================== */}
      {currentTab === 'rep_performance' && (
        <>
          {/* Top Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}>
            {/* Total Team Sales */}
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
                Total Team Sales
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  ₹0
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  across {employeeSalesData.length} staff
                </span>
              </div>
            </div>

            {/* Total Orders Handled */}
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
                Orders Processed
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  0
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  orders processed
                </span>
              </div>
            </div>

            {/* Avg Speed of Service */}
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
                Speed of Service
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  0s
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  avg checkout time
                </span>
              </div>
            </div>

            {/* Shifts Completed */}
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
                Shifts Completed
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  0
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  shifts completed
                </span>
              </div>
            </div>
          </div>

          {/* Charts Grid: Sales Contribution by Employee (Donut) + Employee Sales Bar Chart */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.75rem',
          }}>
            {/* Sales Share Donut */}
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1.25rem',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 2px 0' }}>
                    Sales Contribution by Staff
                  </h3>
                  <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>
                    Revenue proportion generated per crew member.
                  </p>
                </div>
                <PieChartRoundedIcon sx={{ fontSize: 20, color: theme.textSecondary }} />
              </div>

              <AnimatedDonutChart
                slices={employeeDonutSlices}
                totalLabel="Staff Share"
                totalValue="100%"
                size={200}
                isRepresentation={true}
                theme={theme}
              />
            </div>

            {/* Individual Sales Bar Chart */}
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1.25rem',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 2px 0' }}>
                    Individual Sales Comparison
                  </h3>
                  <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>
                    Gross revenue rung up per cashier.
                  </p>
                </div>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: theme.textSecondary }}>Revenue (₹)</span>
              </div>

              <AnimatedBarChart
                data={employeeBarChartData}
                height={190}
                barColor="#0284C7"
                activeBarColor="#0369A1"
                isRepresentation={true}
                theme={theme}
              />
            </div>
          </div>

          {/* Staff Performance Leaderboard Table */}
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
            borderRadius: '1.25rem',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 0.85rem 0' }}>
              Employee Performance & Integrity Ledger
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border}`, textAlign: 'left', backgroundColor: theme.tableHeaderBg }}>
                  <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Employee & Role</th>
                  <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Total Sales</th>
                  <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Orders Rung</th>
                  <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Avg Ticket</th>
                  <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Shifts Worked</th>
                  <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Speed</th>
                  <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Discounts Allowed</th>
                  <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {employeeSalesData.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: theme.textSecondary }}>
                      No staff performance data yet.
                    </td>
                  </tr>
                )}
                {employeeSalesData.map((emp) => (
                  <tr key={emp.name} style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <td style={{ padding: '0.75rem 0.85rem' }}>
                      <div style={{ fontWeight: 800, color: theme.textPrimary }}>{emp.name}</div>
                      <div style={{ fontSize: '11px', color: theme.textSecondary }}>{emp.role}</div>
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', fontWeight: 800, color: '#166534' }}>
                      ₹{emp.sales.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: theme.textPrimary }}>
                      {emp.orders} orders
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: theme.textSecondary }}>
                      ₹{emp.aov}
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', color: theme.textPrimary }}>
                      {emp.shifts} shifts
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem' }}>
                      <span style={{
                        padding: '2px 7px',
                        borderRadius: '0.35rem',
                        backgroundColor: emp.speedSec < 50 ? '#DCFCE7' : '#F3F4F6',
                        color: emp.speedSec < 50 ? '#166534' : theme.textPrimary,
                        fontWeight: 800,
                        fontSize: '11.5px',
                      }}>
                        {emp.speedSec}s / ticket
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', color: theme.textSecondary, fontWeight: 600 }}>
                      ₹{emp.discountsGiven.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        fontWeight: 800,
                        color: '#B45309',
                        backgroundColor: '#FEF3C7',
                        padding: '2px 7px',
                        borderRadius: '9999px',
                        fontSize: '11.5px',
                      }}>
                        <StarRoundedIcon sx={{ fontSize: 13, color: '#F59E0B' }} />
                        <span>{emp.rating}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
