'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';

// Material Rounded Icons
import WarehouseRoundedIcon from '@mui/icons-material/WarehouseRounded';
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
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import MoveToInboxRoundedIcon from '@mui/icons-material/MoveToInboxRounded';
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
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

const INITIAL_MANAGER_PRODUCTS: ManagerProduct[] = [
  {
    id: 'prod-1',
    name: 'Classic Burger Patty (Beef)',
    sku: 'SKU-BRG-001',
    barcode: '890103001001',
    category: 'Burgers',
    currentStock: 85,
    minStock: 30,
    unitPrice: 240,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80',
    location: 'Freezer Shelf A-1',
  },
  {
    id: 'prod-2',
    name: 'Brioche Burger Buns (Pack 12)',
    sku: 'SKU-BRG-002',
    barcode: '890103001002',
    category: 'Bakery',
    currentStock: 42,
    minStock: 20,
    unitPrice: 150,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&auto=format&fit=crop&q=80',
    location: 'Bakery Rack B',
  },
  {
    id: 'prod-3',
    name: 'Espresso Roast Beans 1kg',
    sku: 'SKU-DRK-001',
    barcode: '890103002001',
    category: 'Beverages',
    currentStock: 4,
    minStock: 10,
    unitPrice: 1250,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
    location: 'Espresso Bar Shelf',
  },
  {
    id: 'prod-4',
    name: 'Amul Cheddar Cheese Slices (1kg)',
    sku: 'SKU-DAI-001',
    barcode: '890103003001',
    category: 'Dairy',
    currentStock: 18,
    minStock: 12,
    unitPrice: 520,
    image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400&auto=format&fit=crop&q=80',
    location: 'Chiller Bin 2',
  },
  {
    id: 'prod-5',
    name: 'Whole Milk Pouches 1L',
    sku: 'SKU-DRK-002',
    barcode: '890103003002',
    category: 'Dairy',
    currentStock: 0,
    minStock: 25,
    unitPrice: 70,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    location: 'Chiller Bin 1',
  },
  {
    id: 'prod-6',
    name: 'Nuradesk Staff T-Shirt (M)',
    sku: 'SKU-APP-001',
    barcode: '890103004001',
    category: 'Apparel',
    currentStock: 22,
    minStock: 10,
    unitPrice: 799,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80',
    location: 'Staff Locker Unit',
  },
  {
    id: 'prod-7',
    name: 'Smokey BBQ Dip Sauce 500ml',
    sku: 'SKU-SAU-001',
    barcode: '890103005001',
    category: 'Sauces',
    currentStock: 3,
    minStock: 8,
    unitPrice: 220,
    image: 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=400&auto=format&fit=crop&q=80',
    location: 'Sauce Rack 1',
  },
  {
    id: 'prod-8',
    name: 'Eco Paper Takeaway Bags (100pk)',
    sku: 'SKU-PKG-001',
    barcode: '890103006001',
    category: 'Packaging',
    currentStock: 15,
    minStock: 10,
    unitPrice: 650,
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&auto=format&fit=crop&q=80',
    location: 'Packing Station C',
  },
];

const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    id: 'MOV-1052',
    productId: 'prod-1',
    productName: 'Classic Burger Patty (Beef)',
    sku: 'SKU-BRG-001',
    date: 'Today, 01:45 PM',
    type: 'received',
    quantityChange: 50,
    balanceAfter: 85,
    reason: 'Stock Received from Metro Wholesale Depot',
    managedBy: 'Amit Patel (Manager)',
    refCode: 'PO-2026-086',
  },
  {
    id: 'MOV-1051',
    productId: 'prod-3',
    productName: 'Espresso Roast Beans 1kg',
    sku: 'SKU-DRK-001',
    date: 'Today, 11:20 AM',
    type: 'internal',
    quantityChange: -2,
    balanceAfter: 4,
    reason: 'Barista staff training & cupping tasting',
    managedBy: 'Amit Patel (Manager)',
    refCode: 'INTERNAL-09',
  },
  {
    id: 'MOV-1050',
    productId: 'prod-5',
    productName: 'Whole Milk Pouches 1L',
    sku: 'SKU-DRK-002',
    date: 'Today, 09:15 AM',
    type: 'damage',
    quantityChange: -5,
    balanceAfter: 0,
    reason: 'Compromised seal during delivery unloading',
    managedBy: 'Amit Patel (Manager)',
    refCode: 'QC-DAM-14',
  },
  {
    id: 'MOV-1049',
    productId: 'prod-4',
    productName: 'Amul Cheddar Cheese Slices (1kg)',
    sku: 'SKU-DAI-001',
    date: 'Yesterday, 05:30 PM',
    type: 'received',
    quantityChange: 10,
    balanceAfter: 18,
    reason: 'Daily Dairy Intake delivery',
    managedBy: 'Amit Patel (Manager)',
    refCode: 'PO-2026-084',
  },
  {
    id: 'MOV-1048',
    productId: 'prod-7',
    productName: 'Smokey BBQ Dip Sauce 500ml',
    sku: 'SKU-SAU-001',
    date: 'Sep 18, 2026',
    type: 'adjusted',
    quantityChange: -2,
    balanceAfter: 3,
    reason: 'Inventory Audit Discrepancy Correction',
    managedBy: 'Amit Patel (Manager)',
    refCode: 'AUDIT-SEP-3',
  },
];

export default function ManagerInventoryScreen({ theme }: ManagerInventoryScreenProps) {
  // State
  const [products, setProducts] = useState<ManagerProduct[]>(INITIAL_MANAGER_PRODUCTS);
  const [movements, setMovements] = useState<StockMovement[]>(INITIAL_MOVEMENTS);

  // Active View Tab inside inventory: 'list' (Product List) or 'history' (Stock Movement History)
  const [activeView, setActiveView] = useState<'list' | 'history'>('list');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'low_stock' | 'out_of_stock' | 'in_stock'>('All');

  // Modals
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetProduct, setTargetProduct] = useState<ManagerProduct | null>(null);

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
      const matchesSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.barcode.includes(searchQuery);

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

  // 4 Top Metrics
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
    setTargetProduct(prod || products[0]);
    setAddQty(10);
    setAddSource('Supplier Delivery');
    setAddRefCode(`GRN-${Math.floor(1000 + Math.random() * 9000)}`);
    setShowAddStockModal(true);
  };

  const handleOpenAdjust = (prod?: ManagerProduct) => {
    setTargetProduct(prod || products[0]);
    setAdjustQty(1);
    setAdjustType('decrease');
    setAdjustReason('Damage / Spoilage');
    setAdjustNotes('');
    setShowAdjustModal(true);
  };

  const handleOpenDelete = (prod: ManagerProduct) => {
    setTargetProduct(prod);
    setShowDeleteModal(true);
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
  };

  const confirmDeleteProduct = () => {
    if (!targetProduct) return;
    setProducts((prev) => prev.filter((p) => p.id !== targetProduct.id));
    setShowDeleteModal(false);
    setTargetProduct(null);
  };

  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', width: '100%' }}>
      {/* 1. Header Section */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem',
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '12px',
            fontWeight: 700,
            color: theme.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.35rem',
          }}>
            <span>Manager</span>
            <span>/</span>
            <span>Store Operations</span>
            <span>/</span>
            <span style={{ color: theme.textPrimary }}>Inventory</span>
          </div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: 800,
            color: theme.textPrimary,
            letterSpacing: '-0.04em',
            margin: 0,
          }}>
            Store Inventory Management
          </h1>
        </div>

        {/* Manager Header Actions: Add Stock & Stock Adjustment Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={() => handleOpenAdjust()}
            style={{
              height: '38px',
              padding: '0 1rem',
              borderRadius: '0.65rem',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.bgCard,
              color: theme.textPrimary,
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
            }}
          >
            <TuneRoundedIcon sx={{ fontSize: 16 }} />
            <span>Stock Adjustment</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAddStock()}
            style={{
              height: '38px',
              padding: '0 1.15rem',
              borderRadius: '0.65rem',
              border: `1px solid ${theme.activeBg}`,
              backgroundColor: theme.activeBg,
              color: theme.activeText,
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
            }}
          >
            <AddRoundedIcon sx={{ fontSize: 18 }} />
            <span>Add Stock</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Metric KPI Cards Grid (Matching User Requirements) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.75rem',
      }}>
        {/* Card 1: Total Products */}
        <div style={{
          backgroundColor: theme.bgCard,
          border: `1px solid ${theme.borderCard}`,
          borderRadius: '1.15rem',
          padding: '1.25rem 1.4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Products
            </span>
            <Inventory2RoundedIcon sx={{ fontSize: 20, color: theme.textSecondary }} />
          </div>
          <div style={{ marginTop: '0.85rem' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.04em' }}>
              {totalProductsCount}
            </span>
            <span style={{ fontSize: '12.5px', color: theme.textSecondary, marginLeft: '0.4rem', fontWeight: 600 }}>
              catalog items
            </span>
          </div>
        </div>

        {/* Card 2: Low Stock */}
        <div style={{
          backgroundColor: lowStockItems.length > 0 ? '#FEF3C7' : theme.bgCard,
          border: `1px solid ${lowStockItems.length > 0 ? '#F59E0B' : theme.borderCard}`,
          borderRadius: '1.15rem',
          padding: '1.25rem 1.4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: lowStockItems.length > 0 ? '#92400E' : theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Low Stock
            </span>
            <WarningAmberRoundedIcon sx={{ fontSize: 20, color: lowStockItems.length > 0 ? '#D97706' : theme.textSecondary }} />
          </div>
          <div style={{ marginTop: '0.85rem' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: lowStockItems.length > 0 ? '#92400E' : theme.textPrimary, letterSpacing: '-0.04em' }}>
              {lowStockItems.length}
            </span>
            <span style={{ fontSize: '12px', color: lowStockItems.length > 0 ? '#B45309' : theme.textSecondary, marginLeft: '0.4rem', fontWeight: 700 }}>
              below min threshold
            </span>
          </div>
        </div>

        {/* Card 3: Out of Stock */}
        <div style={{
          backgroundColor: outOfStockItems.length > 0 ? '#FEE2E2' : theme.bgCard,
          border: `1px solid ${outOfStockItems.length > 0 ? '#EF4444' : theme.borderCard}`,
          borderRadius: '1.15rem',
          padding: '1.25rem 1.4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: outOfStockItems.length > 0 ? '#991B1B' : theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Out of Stock
            </span>
            <ErrorOutlineRoundedIcon sx={{ fontSize: 20, color: outOfStockItems.length > 0 ? '#DC2626' : theme.textSecondary }} />
          </div>
          <div style={{ marginTop: '0.85rem' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: outOfStockItems.length > 0 ? '#991B1B' : theme.textPrimary, letterSpacing: '-0.04em' }}>
              {outOfStockItems.length}
            </span>
            <span style={{ fontSize: '12px', color: outOfStockItems.length > 0 ? '#B91C1C' : theme.textSecondary, marginLeft: '0.4rem', fontWeight: 700 }}>
              needs urgent restock
            </span>
          </div>
        </div>

        {/* Card 4: Stock Received */}
        <div style={{
          backgroundColor: theme.bgCard,
          border: `1px solid ${theme.borderCard}`,
          borderRadius: '1.15rem',
          padding: '1.25rem 1.4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Stock Received
            </span>
            <MoveToInboxRoundedIcon sx={{ fontSize: 20, color: theme.textSecondary }} />
          </div>
          <div style={{ marginTop: '0.85rem' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.04em' }}>
              +{stockReceivedUnitsToday}
            </span>
            <span style={{ fontSize: '12.5px', color: '#166534', marginLeft: '0.4rem', fontWeight: 700 }}>
              units received
            </span>
          </div>
        </div>
      </div>

      {/* 3. Low Stock Alerts Banner (Shown when items are critical) */}
      {lowStockItems.length > 0 && (
        <div style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FCD34D',
          borderRadius: '1rem',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <WarningAmberRoundedIcon sx={{ fontSize: 20, color: '#D97706' }} />
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#92400E' }}>
                Low Stock Alerts ({lowStockItems.length} items require attention)
              </span>
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#B45309' }}>
              Ahmedabad Store Floor Alert
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #FDE68A',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                }}
              >
                <span style={{ fontWeight: 700, color: '#92400E' }}>{item.name}:</span>
                <span style={{ fontWeight: 800, color: '#DC2626' }}>{item.currentStock} left</span>
                <span style={{ color: '#9CA3AF', fontSize: '11px' }}>(min: {item.minStock})</span>
                <button
                  type="button"
                  onClick={() => handleOpenAddStock(item)}
                  style={{
                    border: 'none',
                    background: '#FEF3C7',
                    color: '#92400E',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  + Restock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Section Toggle & Search / Filter Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem',
        marginBottom: '1rem',
      }}>
        {/* View Switcher Tabs: Product List / Stock Movement History */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            type="button"
            onClick={() => setActiveView('list')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.65rem',
              border: activeView === 'list' ? `1px solid ${theme.activeBg}` : `1px solid ${theme.border}`,
              backgroundColor: activeView === 'list' ? theme.activeBg : theme.bgCard,
              color: activeView === 'list' ? theme.activeText : theme.textPrimary,
              fontSize: '13px',
              fontWeight: activeView === 'list' ? 800 : 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Product List</span>
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
            onClick={() => setActiveView('history')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.65rem',
              border: activeView === 'history' ? `1px solid ${theme.activeBg}` : `1px solid ${theme.border}`,
              backgroundColor: activeView === 'history' ? theme.activeBg : theme.bgCard,
              color: activeView === 'history' ? theme.activeText : theme.textPrimary,
              fontSize: '13px',
              fontWeight: activeView === 'history' ? 800 : 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Stock Movement History</span>
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

        {/* Search & Category Filter Controls (Shown in Product List view) */}
        {activeView === 'list' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, justifyContent: 'flex-end', minWidth: '320px' }}>
            {/* Search Products Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.border}`,
              borderRadius: '0.65rem',
              padding: '0 0.85rem',
              height: '38px',
              minWidth: '220px',
              flex: 1,
              maxWidth: '360px',
            }}>
              <SearchRoundedIcon sx={{ fontSize: 18, color: theme.textMuted }} />
              <input
                type="text"
                placeholder="Search products, SKU, barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '13px',
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
                  <CloseRoundedIcon sx={{ fontSize: 15, color: theme.textSecondary }} />
                </button>
              )}
            </div>

            {/* Category Filter Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                height: '38px',
                padding: '0 0.85rem',
                borderRadius: '0.65rem',
                backgroundColor: theme.bgCard,
                border: `1px solid ${theme.border}`,
                color: theme.textPrimary,
                fontSize: '12.5px',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              style={{
                height: '38px',
                padding: '0 0.85rem',
                borderRadius: '0.65rem',
                backgroundColor: theme.bgCard,
                border: `1px solid ${theme.border}`,
                color: theme.textPrimary,
                fontSize: '12.5px',
                fontWeight: 700,
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

      {/* 5. PRODUCT LIST TABLE VIEW */}
      {activeView === 'list' && (
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
            fontSize: '13.5px',
          }}>
            <thead>
              <tr style={{
                borderBottom: `1px solid ${theme.border}`,
                backgroundColor: '#EBEBED',
              }}>
                <th style={{ padding: '0.85rem 1.15rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Product Name
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  SKU / Barcode
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Category
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Current Stock
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Minimum Stock
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Status
                </th>
                <th style={{ padding: '0.85rem 1.15rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: theme.textSecondary }}>
                    No products found matching your search and category filters.
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
                      {/* Product Name + Image */}
                      <td style={{ padding: '0.85rem 1.15rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            position: 'relative',
                            borderRadius: '0.5rem',
                            overflow: 'hidden',
                            backgroundColor: '#E5E7EB',
                            flexShrink: 0,
                          }}>
                            <Image src={prod.image} alt={prod.name} fill style={{ objectFit: 'cover' }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: theme.textPrimary, fontSize: '13.5px' }}>
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
                        <div style={{ fontWeight: 700, color: theme.textPrimary, fontFamily: 'monospace', fontSize: '12.5px' }}>
                          {prod.sku}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '11px', color: theme.textSecondary, fontFamily: 'monospace' }}>
                          <QrCodeRoundedIcon sx={{ fontSize: 12, color: theme.textMuted }} />
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{
                            fontSize: '15px',
                            fontWeight: 800,
                            color: isOut ? '#DC2626' : isLow ? '#D97706' : theme.textPrimary,
                          }}>
                            {prod.currentStock}
                          </span>
                          <span style={{ fontSize: '11.5px', color: theme.textSecondary }}>units</span>
                        </div>
                      </td>

                      {/* Minimum Stock */}
                      <td style={{ padding: '0.85rem 1rem', fontSize: '13px', color: theme.textSecondary, fontWeight: 600 }}>
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
                            padding: '3px 8px',
                            borderRadius: '9999px',
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#DC2626' }} />
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
                            padding: '3px 8px',
                            borderRadius: '9999px',
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D97706' }} />
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
                            padding: '3px 8px',
                            borderRadius: '9999px',
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                            <span>IN STOCK</span>
                          </span>
                        )}
                      </td>

                      {/* Actions: Add Stock, Stock Adjustment, Delete */}
                      <td style={{ padding: '0.85rem 1.15rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenAddStock(prod)}
                            title="Add incoming stock"
                            style={{
                              padding: '4px 8px',
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
                              padding: '4px 8px',
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
                            }}
                          >
                            <TuneRoundedIcon sx={{ fontSize: 13 }} />
                            <span>Adjust</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenDelete(prod)}
                            title={`Delete ${prod.name}`}
                            style={{
                              padding: '4px 6px',
                              borderRadius: '0.45rem',
                              border: '1px solid #FECACA',
                              backgroundColor: '#FEF2F2',
                              color: '#DC2626',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <DeleteOutlineRoundedIcon sx={{ fontSize: 14, color: '#DC2626' }} />
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
      )}

      {/* 6. STOCK MOVEMENT HISTORY TABLE VIEW */}
      {activeView === 'history' && (
        <div style={{
          backgroundColor: theme.bgCard,
          border: `1px solid ${theme.borderCard}`,
          borderRadius: '1.25rem',
          padding: '0.5rem',
          boxSizing: 'border-box',
          overflowX: 'auto',
        }}>
          <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${theme.border}` }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
              Recent Stock Movements & Audits
            </h3>
            <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
              Chronological log of all restocks, damages, cycle counts & internal movements in Ahmedabad store.
            </p>
          </div>

          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '13px',
          }}>
            <thead>
              <tr style={{
                borderBottom: `1px solid ${theme.border}`,
                backgroundColor: '#EBEBED',
              }}>
                <th style={{ padding: '0.85rem 1.15rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Log Ref & Time
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Product
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Type
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Quantity Change
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Reason / Notes
                </th>
                <th style={{ padding: '0.85rem 1.15rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Manager
                </th>
              </tr>
            </thead>
            <tbody>
              {movements.map((mov, idx) => (
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
                    <div style={{ fontSize: '10.5px', color: theme.textSecondary, fontFamily: 'monospace' }}>
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
                    <div style={{ fontSize: '10.5px', color: theme.textSecondary }}>
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. MODAL: ADD STOCK                                          */}
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
                  Add Incoming Stock
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

            {/* Target product pill */}
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
      {/* 8. MODAL: STOCK ADJUSTMENT                                   */}
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
                  }}
                >
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 9. MODAL: DELETE PRODUCT CONFIRMATION                        */}
      {/* ============================================================ */}
      {showDeleteModal && targetProduct && (
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
            maxWidth: '430px',
            boxShadow: '0 20px 48px rgba(0,0,0,0.2)',
            padding: '1.5rem',
            boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <DeleteOutlineRoundedIcon sx={{ fontSize: 22, color: '#DC2626' }} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                Remove Product from Store?
              </h3>
            </div>

            <p style={{ fontSize: '13.5px', color: theme.textSecondary, margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
              Are you sure you want to remove <strong>{targetProduct.name}</strong> ({targetProduct.sku})? Currently tracking <strong>{targetProduct.currentStock} units</strong>.
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.65rem',
            }}>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setTargetProduct(null);
                }}
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
                type="button"
                onClick={confirmDeleteProduct}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '0.55rem',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                <span>Yes, Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
