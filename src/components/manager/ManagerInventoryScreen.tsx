'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';

// Material Rounded Icons
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MoveToInboxRoundedIcon from '@mui/icons-material/MoveToInboxRounded';
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';

export interface ManagerProduct {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  currentStock: number;
  minStock: number;
  unitPrice: number;
  image: string;
  location: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  date: string;
  type: 'received' | 'adjusted' | 'damage' | 'pos_sale' | 'internal';
  quantityChange: number;
  balanceAfter: number;
  reason: string;
  managedBy: string;
  refCode?: string;
}

interface ManagerInventoryScreenProps {
  activeSubTab?: 'inv_overview' | 'inv_low' | 'inv_adjustments' | 'inv_movement';
  onSelectSubTab?: (tab: string) => void;
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
    sidebarIsDark?: boolean;
  };
}

const INITIAL_MANAGER_PRODUCTS: ManagerProduct[] = [];

const INITIAL_MOVEMENTS: StockMovement[] = [];

export default function ManagerInventoryScreen({ activeSubTab, onSelectSubTab, theme }: ManagerInventoryScreenProps) {
  // State
  const [products, setProducts] = useState<ManagerProduct[]>(INITIAL_MANAGER_PRODUCTS);
  const [movements, setMovements] = useState<StockMovement[]>(INITIAL_MOVEMENTS);

  // Active View Tab: 'list' (Product Inventory) or 'history' (Stock Movement History)
  const [activeView, setActiveView] = useState<'list' | 'history'>('list');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'low_stock' | 'out_of_stock' | 'in_stock'>('All');

  // Modals (Strictly limited to intake & audit write-offs; NO product creation or deletion)
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [targetProduct, setTargetProduct] = useState<ManagerProduct | null>(null);

  // Feedback banner
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Sync with activeSubTab from sidebar
  useEffect(() => {
    if (activeSubTab === 'inv_movement') {
      setActiveView('history');
    } else if (activeSubTab === 'inv_low') {
      setActiveView('list');
      setStatusFilter('low_stock');
    } else if (activeSubTab === 'inv_adjustments') {
      setActiveView('list');
      handleOpenAdjust();
    } else if (activeSubTab === 'inv_overview') {
      setActiveView('list');
      setStatusFilter('All');
    }
  }, [activeSubTab]);

  // Add Stock Form
  const [addQty, setAddQty] = useState<number>(10);
  const [addSource, setAddSource] = useState('Supplier Delivery');
  const [addRefCode, setAddRefCode] = useState('GRN-2026-');

  // Adjustment Form
  const [adjustType, setAdjustType] = useState<'increase' | 'decrease'>('decrease');
  const [adjustQty, setAdjustQty] = useState<number>(1);
  const [adjustReason, setAdjustReason] = useState('Damage / Spoilage');
  const [adjustNotes, setAdjustNotes] = useState('');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        prod.name.toLowerCase().includes(q) ||
        prod.sku.toLowerCase().includes(q) ||
        prod.barcode.includes(q);

      const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;

      let matchesStatus = true;
      if (statusFilter === 'low_stock') {
        matchesStatus = prod.currentStock > 0 && prod.currentStock <= prod.minStock;
      } else if (statusFilter === 'out_of_stock') {
        matchesStatus = prod.currentStock === 0;
      } else if (statusFilter === 'in_stock') {
        matchesStatus = prod.currentStock > prod.minStock;
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, statusFilter]);

  // Top Metrics
  const totalProductsCount = products.length;
  const lowStockItems = useMemo(() => products.filter((p) => p.currentStock > 0 && p.currentStock <= p.minStock), [products]);
  const outOfStockItems = useMemo(() => products.filter((p) => p.currentStock === 0), [products]);
  const stockReceivedUnitsToday = useMemo(() => {
    return movements
      .filter((m) => m.type === 'received')
      .reduce((acc, curr) => acc + curr.quantityChange, 0);
  }, [movements]);

  // Handlers
  const handleOpenAddStock = (prod?: ManagerProduct) => {
    const target = prod || products[0];
    if (!target) {
      setFeedbackNotice('No products exist in inventory catalog to restock.');
      setTimeout(() => setFeedbackNotice(null), 3500);
      return;
    }
    setTargetProduct(target);
    setAddQty(10);
    setAddSource('Supplier Delivery');
    setAddRefCode(`GRN-${Math.floor(1000 + Math.random() * 9000)}`);
    setShowAddStockModal(true);
  };

  const handleOpenAdjust = (prod?: ManagerProduct) => {
    const target = prod || products[0];
    if (!target) {
      setFeedbackNotice('No products exist in inventory catalog to adjust.');
      setTimeout(() => setFeedbackNotice(null), 3500);
      return;
    }
    setTargetProduct(target);
    setAdjustQty(1);
    setAdjustType('decrease');
    setAdjustReason('Damage / Spoilage');
    setAdjustNotes('');
    setShowAdjustModal(true);
  };

  const submitAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProduct || addQty <= 0) return;

    const newStock = targetProduct.currentStock + addQty;

    setProducts((prev) =>
      prev.map((p) => (p.id === targetProduct.id ? { ...p, currentStock: newStock } : p))
    );

    const movement: StockMovement = {
      id: `MOV-${Math.floor(1050 + Math.random() * 900)}`,
      productId: targetProduct.id,
      productName: targetProduct.name,
      sku: targetProduct.sku,
      date: 'Just now',
      type: 'received',
      quantityChange: addQty,
      balanceAfter: newStock,
      reason: `Stock Received (${addSource})`,
      managedBy: 'Amit Patel (Manager)',
      refCode: addRefCode,
    };

    setMovements([movement, ...movements]);
    setShowAddStockModal(false);
    setFeedbackNotice(`Successfully added +${addQty} units to "${targetProduct.name}".`);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  const submitAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProduct || adjustQty <= 0) return;

    const delta = adjustType === 'increase' ? adjustQty : -adjustQty;
    const newStock = Math.max(0, targetProduct.currentStock + delta);

    setProducts((prev) =>
      prev.map((p) => (p.id === targetProduct.id ? { ...p, currentStock: newStock } : p))
    );

    const movement: StockMovement = {
      id: `MOV-${Math.floor(1050 + Math.random() * 900)}`,
      productId: targetProduct.id,
      productName: targetProduct.name,
      sku: targetProduct.sku,
      date: 'Just now',
      type: adjustType === 'increase' ? 'adjusted' : 'damage',
      quantityChange: delta,
      balanceAfter: newStock,
      reason: `${adjustReason}${adjustNotes ? ` — ${adjustNotes}` : ''}`,
      managedBy: 'Amit Patel (Manager)',
      refCode: 'ADJ-MNGR',
    };

    setMovements([movement, ...movements]);
    setShowAdjustModal(false);
    setFeedbackNotice(`Stock adjustment recorded (${delta > 0 ? `+${delta}` : delta} units) for "${targetProduct.name}".`);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', color: theme.textPrimary }}>
      {/* Toast Feedback */}
      {feedbackNotice && (
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
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* 1. Header Section - Clean and matching other dashboard views */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 800,
            color: theme.textPrimary,
            letterSpacing: '-0.035em',
            margin: '0 0 0.25rem 0',
          }}>
            {activeView === 'history' ? 'Stock Movement History' : 'Store Inventory Management'}
          </h1>
          <p style={{
            fontSize: '13.5px',
            color: theme.textSecondary,
            margin: 0,
            fontWeight: 500,
          }}>
            {activeView === 'history'
              ? 'Real-time audit log of stock deliveries, damage write-offs, and shrinkage adjustments.'
              : 'Track store product stocks, check threshold limits, and log deliveries.'}
          </p>
        </div>

        {/* Manager Actions: Stock Adjustment & Add Stock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="button"
            className="button-20-secondary"
            role="button"
            onClick={() => handleOpenAdjust()}
            style={{
              height: '38px',
              padding: '0 1rem',
              borderRadius: '0.65rem',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.bgCard,
              color: theme.textPrimary,
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontFamily: 'inherit',
            }}
          >
            <TuneRoundedIcon sx={{ fontSize: 16 }} />
            <span>Stock Adjustment</span>
          </button>

          <button
            type="button"
            className="button-20"
            role="button"
            onClick={() => handleOpenAddStock()}
            style={{
              height: '38px',
              padding: '0 1.15rem',
              borderRadius: '0.65rem',
              backgroundColor: theme.activeBg,
              color: theme.activeText,
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              border: 'none',
              fontFamily: 'inherit',
            }}
          >
            <AddRoundedIcon sx={{ fontSize: 18 }} />
            <span>Add Stock</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Metric KPI Cards - Clean, elegant & consistent with all screens */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.5rem',
      }}>
        {/* Card 1: Total Products */}
        <div style={{
          backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
          border: `1px solid ${theme.border}`,
          borderRadius: '1rem',
          padding: '1.35rem 1.4rem',
          boxSizing: 'border-box',
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 500,
            color: theme.sidebarIsDark ? theme.textSecondary : '#6B7280',
            letterSpacing: '-0.01em',
            marginBottom: '0.65rem',
          }}>
            Total Products
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
              {totalProductsCount}
            </span>
            <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
              catalog items
            </span>
          </div>
        </div>

        {/* Card 2: Low Stock */}
        <div style={{
          backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
          border: `1px solid ${theme.border}`,
          borderRadius: '1rem',
          padding: '1.35rem 1.4rem',
          boxSizing: 'border-box',
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 500,
            color: theme.sidebarIsDark ? theme.textSecondary : '#6B7280',
            letterSpacing: '-0.01em',
            marginBottom: '0.65rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span>Low Stock</span>
            {lowStockItems.length > 0 && (
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#92400E',
                backgroundColor: '#FEF3C7',
                padding: '2px 7px',
                borderRadius: '9999px',
              }}>
                Attention
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, color: lowStockItems.length > 0 ? '#D97706' : theme.textPrimary, letterSpacing: '-0.03em' }}>
              {lowStockItems.length}
            </span>
            <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
              below min threshold
            </span>
          </div>
        </div>

        {/* Card 3: Out of Stock */}
        <div style={{
          backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
          border: `1px solid ${theme.border}`,
          borderRadius: '1rem',
          padding: '1.35rem 1.4rem',
          boxSizing: 'border-box',
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 500,
            color: theme.sidebarIsDark ? theme.textSecondary : '#6B7280',
            letterSpacing: '-0.01em',
            marginBottom: '0.65rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span>Out of Stock</span>
            {outOfStockItems.length > 0 && (
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#991B1B',
                backgroundColor: '#FEE2E2',
                padding: '2px 7px',
                borderRadius: '9999px',
              }}>
                Urgent
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, color: outOfStockItems.length > 0 ? '#DC2626' : theme.textPrimary, letterSpacing: '-0.03em' }}>
              {outOfStockItems.length}
            </span>
            <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
              needs urgent restock
            </span>
          </div>
        </div>

        {/* Card 4: Stock Received */}
        <div style={{
          backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
          border: `1px solid ${theme.border}`,
          borderRadius: '1rem',
          padding: '1.35rem 1.4rem',
          boxSizing: 'border-box',
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 500,
            color: theme.sidebarIsDark ? theme.textSecondary : '#6B7280',
            letterSpacing: '-0.01em',
            marginBottom: '0.65rem',
          }}>
            Stock Received Today
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
              +{stockReceivedUnitsToday}
            </span>
            <span style={{ fontSize: '13px', color: '#166534', fontWeight: 600 }}>
              units received
            </span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        marginBottom: '1rem',
        backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
        border: `1px solid ${theme.border}`,
        borderRadius: '0.85rem',
        padding: '0.65rem 0.85rem',
      }}>
        {/* View Switcher Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            type="button"
            onClick={() => {
              setActiveView('list');
              if (onSelectSubTab) onSelectSubTab('inv_overview');
            }}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '0.55rem',
              border: 'none',
              backgroundColor: activeView === 'list' ? theme.activeBg : 'transparent',
              color: activeView === 'list' ? theme.activeText : theme.textPrimary,
              fontSize: '12.5px',
              fontWeight: activeView === 'list' ? 800 : 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Products</span>
            <span style={{
              fontSize: '11px',
              padding: '1px 6px',
              borderRadius: '9999px',
              backgroundColor: activeView === 'list' ? 'rgba(255,255,255,0.2)' : theme.hoverBg,
              fontWeight: 800,
            }}>
              {products.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveView('history');
              if (onSelectSubTab) onSelectSubTab('inv_movement');
            }}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '0.55rem',
              border: 'none',
              backgroundColor: activeView === 'history' ? theme.activeBg : 'transparent',
              color: activeView === 'history' ? theme.activeText : theme.textPrimary,
              fontSize: '12.5px',
              fontWeight: activeView === 'history' ? 800 : 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Movement History</span>
            <span style={{
              fontSize: '11px',
              padding: '1px 6px',
              borderRadius: '9999px',
              backgroundColor: activeView === 'history' ? 'rgba(255,255,255,0.2)' : theme.hoverBg,
              fontWeight: 800,
            }}>
              {movements.length}
            </span>
          </button>
        </div>

        {/* Search & Filters */}
        {activeView === 'list' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: theme.bgPage,
              border: `1px solid ${theme.border}`,
              borderRadius: '0.55rem',
              padding: '0 0.75rem',
              height: '34px',
              minWidth: '220px',
              maxWidth: '320px',
              flex: 1,
            }}>
              <SearchRoundedIcon sx={{ fontSize: 17, color: theme.textMuted }} />
              <input
                type="text"
                placeholder="Search products, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '12.5px',
                  color: theme.textPrimary,
                  width: '100%',
                  fontFamily: 'inherit',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 14, color: theme.textSecondary }} />
                </button>
              )}
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                height: '34px',
                padding: '0 0.75rem',
                borderRadius: '0.55rem',
                backgroundColor: theme.bgPage,
                border: `1px solid ${theme.border}`,
                color: theme.textPrimary,
                fontSize: '12px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              style={{
                height: '34px',
                padding: '0 0.75rem',
                borderRadius: '0.55rem',
                backgroundColor: theme.bgPage,
                border: `1px solid ${theme.border}`,
                color: theme.textPrimary,
                fontSize: '12px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <option value="All">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        )}
      </div>

      {/* 4. PRODUCT LIST TABLE */}
      {activeView === 'list' && (
        <div style={{
          backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
          border: `1px solid ${theme.border}`,
          borderRadius: '1rem',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}>
          <div style={{ overflowX: 'auto' }}>
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
                  <th style={{ padding: '0.85rem 1.15rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Product Name
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    SKU / Barcode
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Category
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Current Stock
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Min Threshold
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Status
                  </th>
                  <th style={{ padding: '0.85rem 1.15rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase', textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '3rem 1.5rem', textAlign: 'center', color: theme.textSecondary }}>
                      {products.length === 0
                        ? 'No products in inventory catalog yet.'
                        : 'No inventory items found matching your filters.'}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod, index) => {
                    const isOut = prod.currentStock === 0;
                    const isLow = prod.currentStock > 0 && prod.currentStock <= prod.minStock;

                    return (
                      <tr
                        key={prod.id}
                        style={{
                          borderBottom: index < filteredProducts.length - 1 ? `1px solid ${theme.border}` : 'none',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.tableRowHover; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        {/* Product Name + Location */}
                        <td style={{ padding: '0.85rem 1.15rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              position: 'relative',
                              borderRadius: '0.5rem',
                              overflow: 'hidden',
                              backgroundColor: '#E5E7EB',
                              flexShrink: 0,
                            }}>
                              <Image src={prod.image} alt={prod.name} fill style={{ objectFit: 'cover' }} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: theme.textPrimary, fontSize: '13px' }}>
                                {prod.name}
                              </div>
                              <div style={{ fontSize: '11px', color: theme.textSecondary }}>
                                {prod.location}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* SKU / Barcode */}
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: 700, color: theme.textPrimary, fontFamily: 'monospace', fontSize: '12px' }}>
                            {prod.sku}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '11px', color: theme.textSecondary, fontFamily: 'monospace' }}>
                            <QrCodeRoundedIcon sx={{ fontSize: 11, color: theme.textMuted }} />
                            <span>{prod.barcode}</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{
                            fontSize: '11.5px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '0.45rem',
                            backgroundColor: theme.hoverBg,
                            color: theme.textPrimary,
                          }}>
                            {prod.category}
                          </span>
                        </td>

                        {/* Current Stock */}
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{
                              fontSize: '14.5px',
                              fontWeight: 800,
                              color: isOut ? '#DC2626' : isLow ? '#D97706' : theme.textPrimary,
                            }}>
                              {prod.currentStock}
                            </span>
                            <span style={{ fontSize: '11px', color: theme.textSecondary }}>units</span>
                          </div>
                        </td>

                        {/* Min Stock */}
                        <td style={{ padding: '0.85rem 1rem', fontSize: '12.5px', color: theme.textSecondary, fontWeight: 600 }}>
                          {prod.minStock} units
                        </td>

                        {/* Status */}
                        <td style={{ padding: '0.85rem 1rem' }}>
                          {isOut ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '11px',
                              fontWeight: 800,
                              backgroundColor: '#FEE2E2',
                              color: '#991B1B',
                              padding: '2px 7px',
                              borderRadius: '9999px',
                            }}>
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#DC2626' }} />
                              <span>OUT OF STOCK</span>
                            </span>
                          ) : isLow ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '11px',
                              fontWeight: 800,
                              backgroundColor: '#FEF3C7',
                              color: '#92400E',
                              padding: '2px 7px',
                              borderRadius: '9999px',
                            }}>
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#D97706' }} />
                              <span>LOW STOCK</span>
                            </span>
                          ) : (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '11px',
                              fontWeight: 800,
                              backgroundColor: '#DCFCE7',
                              color: '#166534',
                              padding: '2px 7px',
                              borderRadius: '9999px',
                            }}>
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                              <span>IN STOCK</span>
                            </span>
                          )}
                        </td>

                        {/* Allowed Actions ONLY: Add Stock & Stock Adjustment (No Product Editing/Deleting) */}
                        <td style={{ padding: '0.85rem 1.15rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenAddStock(prod)}
                              title="Add incoming stock"
                              style={{
                                padding: '4px 9px',
                                borderRadius: '0.45rem',
                                border: `1px solid ${theme.border}`,
                                backgroundColor: theme.hoverBg,
                                color: theme.textPrimary,
                                fontSize: '11.5px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontFamily: 'inherit',
                              }}
                            >
                              <AddRoundedIcon sx={{ fontSize: 13 }} />
                              <span>Add</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenAdjust(prod)}
                              title="Stock adjustment"
                              style={{
                                padding: '4px 9px',
                                borderRadius: '0.45rem',
                                border: `1px solid ${theme.border}`,
                                backgroundColor: theme.hoverBg,
                                color: theme.textPrimary,
                                fontSize: '11.5px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontFamily: 'inherit',
                              }}
                            >
                              <TuneRoundedIcon sx={{ fontSize: 13 }} />
                              <span>Adjust</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. STOCK MOVEMENT HISTORY TABLE */}
      {activeView === 'history' && (
        <div style={{
          backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
          border: `1px solid ${theme.border}`,
          borderRadius: '1rem',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}>
          <div style={{ overflowX: 'auto' }}>
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
                  <th style={{ padding: '0.85rem 1.15rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Log Ref & Time
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Product
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Type
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Quantity Change
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Reason / Notes
                  </th>
                  <th style={{ padding: '0.85rem 1.15rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Recorded By
                  </th>
                </tr>
              </thead>
              <tbody>
                {movements.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '3rem 1.5rem', textAlign: 'center', color: theme.textSecondary }}>
                      No stock movement logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  movements.map((mov, idx) => (
                  <tr
                    key={mov.id}
                    style={{
                      borderBottom: idx < movements.length - 1 ? `1px solid ${theme.border}` : 'none',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.tableRowHover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <td style={{ padding: '0.85rem 1.15rem' }}>
                      <div style={{ fontWeight: 800, color: theme.textPrimary, fontFamily: 'monospace' }}>
                        {mov.id}
                      </div>
                      <div style={{ fontSize: '11px', color: theme.textSecondary }}>
                        {mov.date}
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: theme.textPrimary }}>
                        {mov.productName}
                      </div>
                      <div style={{ fontSize: '11px', color: theme.textSecondary, fontFamily: 'monospace' }}>
                        {mov.sku}
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: '0.4rem',
                        backgroundColor:
                          mov.type === 'received' ? '#DCFCE7' :
                          mov.type === 'damage' ? '#FEE2E2' : '#F3F4F6',
                        color:
                          mov.type === 'received' ? '#166534' :
                          mov.type === 'damage' ? '#991B1B' : '#374151',
                      }}>
                        {mov.type === 'received' ? 'Stock Received' :
                         mov.type === 'damage' ? 'Damaged / Spoilage' : 'Adjustment'}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 800,
                        color: mov.quantityChange > 0 ? '#166534' : '#991B1B',
                      }}>
                        {mov.quantityChange > 0 ? `+${mov.quantityChange}` : mov.quantityChange} units
                      </span>
                      <div style={{ fontSize: '11px', color: theme.textSecondary }}>
                        Balance: {mov.balanceAfter}
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', color: theme.textPrimary, fontSize: '12.5px' }}>
                      <div>{mov.reason}</div>
                      {mov.refCode && (
                        <div style={{ fontSize: '10.5px', color: theme.textSecondary, fontFamily: 'monospace' }}>
                          Ref: {mov.refCode}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '0.85rem 1.15rem', color: theme.textSecondary, fontSize: '12px', fontWeight: 600 }}>
                      {mov.managedBy}
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. MODAL: ADD STOCK (Delivery intake only - NO price inputs) */}
      {/* ============================================================ */}
      {showAddStockModal && targetProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: theme.bgPage,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '460px',
            boxShadow: '0 20px 48px rgba(0,0,0,0.2)',
            padding: '1.5rem',
            boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MoveToInboxRoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                  Receive Incoming Stock
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStockModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            {/* Target product summary */}
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.border}`,
              borderRadius: '0.85rem',
              padding: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.25rem',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                position: 'relative',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                backgroundColor: '#E5E7EB',
                flexShrink: 0,
              }}>
                <Image src={targetProduct.image} alt={targetProduct.name} fill style={{ objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: theme.textPrimary }}>
                  {targetProduct.name}
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary }}>
                  SKU: {targetProduct.sku} • Current: <strong>{targetProduct.currentStock} units</strong>
                </div>
              </div>
            </div>

            <form onSubmit={submitAddStock} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Quantity Received (Units)
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={addQty}
                  onChange={(e) => setAddQty(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 0.85rem',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    fontSize: '14px',
                    fontWeight: 800,
                    boxSizing: 'border-box',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Intake Source
                </label>
                <select
                  value={addSource}
                  onChange={(e) => setAddSource(e.target.value)}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 0.85rem',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    fontWeight: 700,
                    boxSizing: 'border-box',
                    outline: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="Supplier Delivery">Supplier Delivery Intake</option>
                  <option value="Central Warehouse Transfer">Central Warehouse Transfer</option>
                  <option value="Direct Store Restock">Direct Store Restock</option>
                  <option value="Customer Return to Stock">Customer Return to Stock</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Reference / GRN Code (Optional)
                </label>
                <input
                  type="text"
                  value={addRefCode}
                  onChange={(e) => setAddRefCode(e.target.value)}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 0.85rem',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddStockModal(false)}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: 'transparent',
                    color: theme.textPrimary,
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '0.55rem',
                    border: 'none',
                    backgroundColor: theme.activeBg,
                    color: theme.activeText,
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Confirm & Receive Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. MODAL: STOCK ADJUSTMENT (Audit write-offs - NO price edit) */}
      {/* ============================================================ */}
      {showAdjustModal && targetProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: theme.bgPage,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '460px',
            boxShadow: '0 20px 48px rgba(0,0,0,0.2)',
            padding: '1.5rem',
            boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TuneRoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                  Record Stock Adjustment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdjustModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.border}`,
              borderRadius: '0.85rem',
              padding: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.25rem',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                position: 'relative',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                backgroundColor: '#E5E7EB',
                flexShrink: 0,
              }}>
                <Image src={targetProduct.image} alt={targetProduct.name} fill style={{ objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: theme.textPrimary }}>
                  {targetProduct.name}
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary }}>
                  SKU: {targetProduct.sku} • Current: <strong>{targetProduct.currentStock} units</strong>
                </div>
              </div>
            </div>

            <form onSubmit={submitAdjustment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.4rem' }}>
                  Adjustment Direction
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => setAdjustType('decrease')}
                    style={{
                      padding: '0.65rem',
                      borderRadius: '0.55rem',
                      border: adjustType === 'decrease' ? '2px solid #EF4444' : `1px solid ${theme.border}`,
                      backgroundColor: adjustType === 'decrease' ? '#FEE2E2' : theme.bgCard,
                      color: adjustType === 'decrease' ? '#991B1B' : theme.textPrimary,
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      fontFamily: 'inherit',
                    }}
                  >
                    <ArrowDownwardRoundedIcon sx={{ fontSize: 16 }} />
                    <span>Reduce Stock (-)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustType('increase')}
                    style={{
                      padding: '0.65rem',
                      borderRadius: '0.55rem',
                      border: adjustType === 'increase' ? '2px solid #22C55E' : `1px solid ${theme.border}`,
                      backgroundColor: adjustType === 'increase' ? '#DCFCE7' : theme.bgCard,
                      color: adjustType === 'increase' ? '#166534' : theme.textPrimary,
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      fontFamily: 'inherit',
                    }}
                  >
                    <ArrowUpwardRoundedIcon sx={{ fontSize: 16 }} />
                    <span>Increase Stock (+)</span>
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 0.85rem',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    fontSize: '14px',
                    fontWeight: 800,
                    boxSizing: 'border-box',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Reason for Adjustment
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 0.85rem',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    fontWeight: 700,
                    boxSizing: 'border-box',
                    outline: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="Damage / Spoilage">Damage / Spoilage in Kitchen</option>
                  <option value="Expired Products">Expired Products</option>
                  <option value="Audit Count Correction">Physical Inventory Count Correction</option>
                  <option value="Tasting & Staff Training">Tasting & Staff Training Consumption</option>
                  <option value="Theft or Missing">Unaccounted Discrepancy / Missing</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Manager Remarks (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional context or notes..."
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: 'transparent',
                    color: theme.textPrimary,
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '0.55rem',
                    border: 'none',
                    backgroundColor: theme.activeBg,
                    color: theme.activeText,
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
