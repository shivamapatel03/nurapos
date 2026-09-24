'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';

// Material Rounded Icons
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import WarehouseRoundedIcon from '@mui/icons-material/WarehouseRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

export interface StockItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  location: string;
  inStock: number;
  minThreshold: number;
  unitCost: number;
  retailPrice: number;
  image: string;
  supplier: string;
}

export interface StockAdjustment {
  id: string;
  itemId: string;
  itemName: string;
  sku: string;
  date: string;
  type: 'increase' | 'decrease';
  quantity: number;
  reason: 'Damage' | 'Expired' | 'Audit Count' | 'Internal Use' | 'Theft/Lost' | 'Supplier Restock';
  adjustedBy: string;
  notes?: string;
}

export interface POLineItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitCost: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  orderDate: string;
  expectedDate: string;
  items: POLineItem[];
  totalAmount: number;
  status: 'Received' | 'In Transit' | 'Pending Approval' | 'Draft';
  notes?: string;
}

interface InventoryManagementProps {
  activeSubTab: 'stock' | 'adjustment' | 'po';
  onSelectSubTab?: (tab: 'stock' | 'adjustment' | 'po') => void;
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

const INITIAL_STOCK: StockItem[] = [
  {
    id: 'stk-1',
    sku: 'SKU-BRG-001',
    name: 'Classic Burger Patty (Beef)',
    category: 'Burgers',
    location: 'Freezer Room A',
    inStock: 85,
    minThreshold: 30,
    unitCost: 110,
    retailPrice: 240,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80',
    supplier: 'Metro Wholesale Depot',
  },
  {
    id: 'stk-2',
    sku: 'SKU-BRG-002',
    name: 'Brioche Burger Buns (Pack 12)',
    category: 'Bakery',
    location: 'Dry Storage Shelf 1',
    inStock: 42,
    minThreshold: 20,
    unitCost: 65,
    retailPrice: 150,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&auto=format&fit=crop&q=80',
    supplier: 'Fresh Bakes Gujarat',
  },
  {
    id: 'stk-3',
    sku: 'SKU-DRK-001',
    name: 'Espresso Roast Beans 1kg',
    category: 'Beverages',
    location: 'Coffee Bar Pantry',
    inStock: 4,
    minThreshold: 10,
    unitCost: 650,
    retailPrice: 1250,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
    supplier: 'Coorg Estate Coffee Co.',
  },
  {
    id: 'stk-4',
    sku: 'SKU-DAI-001',
    name: 'Amul Cheddar Cheese Slices (1kg)',
    category: 'Dairy',
    location: 'Walk-in Chiller 2',
    inStock: 18,
    minThreshold: 12,
    unitCost: 380,
    retailPrice: 520,
    image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400&auto=format&fit=crop&q=80',
    supplier: 'Amul Dairy Cooperative',
  },
  {
    id: 'stk-5',
    sku: 'SKU-DRK-002',
    name: 'Whole Milk Pouches 1L',
    category: 'Dairy',
    location: 'Walk-in Chiller 1',
    inStock: 0,
    minThreshold: 25,
    unitCost: 58,
    retailPrice: 70,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    supplier: 'Amul Dairy Cooperative',
  },
  {
    id: 'stk-6',
    sku: 'SKU-APP-001',
    name: 'Nuradesk Staff T-Shirt (M/Black)',
    category: 'Apparel',
    location: 'Backstore Box C',
    inStock: 22,
    minThreshold: 10,
    unitCost: 320,
    retailPrice: 799,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80',
    supplier: 'Textile Hub Tirupur',
  },
  {
    id: 'stk-7',
    sku: 'SKU-PKG-001',
    name: 'Eco Paper Takeaway Bags (Pack 100)',
    category: 'Packaging',
    location: 'Warehouse Shelf 4',
    inStock: 15,
    minThreshold: 8,
    unitCost: 450,
    retailPrice: 650,
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&auto=format&fit=crop&q=80',
    supplier: 'GreenPack Solutions',
  },
  {
    id: 'stk-8',
    sku: 'SKU-SAU-001',
    name: 'Smokey BBQ Dip Sauce 500ml',
    category: 'Sauces',
    location: 'Dry Storage Shelf 3',
    inStock: 3,
    minThreshold: 10,
    unitCost: 140,
    retailPrice: 220,
    image: 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=400&auto=format&fit=crop&q=80',
    supplier: 'Culinary Flavors Ltd',
  },
];

const INITIAL_ADJUSTMENTS: StockAdjustment[] = [
  {
    id: 'ADJ-2026-018',
    itemId: 'stk-3',
    itemName: 'Espresso Roast Beans 1kg',
    sku: 'SKU-DRK-001',
    date: 'Today, 01:25 PM',
    type: 'decrease',
    quantity: 2,
    reason: 'Internal Use',
    adjustedBy: 'Amit Patel (Manager)',
    notes: 'Used for coffee tasting & barista staff training session',
  },
  {
    id: 'ADJ-2026-017',
    itemId: 'stk-5',
    itemName: 'Whole Milk Pouches 1L',
    sku: 'SKU-DRK-002',
    date: 'Today, 10:10 AM',
    type: 'decrease',
    quantity: 5,
    reason: 'Expired',
    adjustedBy: 'Rahul Sharma (Admin)',
    notes: 'Morning QC check: packaging seal compromise',
  },
  {
    id: 'ADJ-2026-016',
    itemId: 'stk-1',
    itemName: 'Classic Burger Patty (Beef)',
    sku: 'SKU-BRG-001',
    date: 'Yesterday, 06:40 PM',
    type: 'increase',
    quantity: 15,
    reason: 'Audit Count',
    adjustedBy: 'Rahul Sharma (Admin)',
    notes: 'Physical freezer count found 15 extra unpacked units',
  },
  {
    id: 'ADJ-2026-015',
    itemId: 'stk-2',
    itemName: 'Brioche Burger Buns (Pack 12)',
    sku: 'SKU-BRG-002',
    date: 'Sep 18, 2026',
    type: 'decrease',
    quantity: 3,
    reason: 'Damage',
    adjustedBy: 'Amit Patel (Manager)',
    notes: 'Delivery crate was damaged during unloading',
  },
];

const INITIAL_POS: PurchaseOrder[] = [
  {
    id: 'po-101',
    poNumber: 'PO-2026-088',
    supplier: 'Amul Dairy Cooperative',
    orderDate: 'Sep 19, 2026',
    expectedDate: 'Today, Sep 20',
    items: [
      { id: 'item-1', name: 'Whole Milk Pouches 1L', sku: 'SKU-DRK-002', quantity: 60, unitCost: 58 },
      { id: 'item-2', name: 'Amul Cheddar Cheese Slices (1kg)', sku: 'SKU-DAI-001', quantity: 20, unitCost: 380 },
    ],
    totalAmount: 11080,
    status: 'In Transit',
    notes: 'Urgent restocking for weekend peak footfall.',
  },
  {
    id: 'po-102',
    poNumber: 'PO-2026-087',
    supplier: 'Coorg Estate Coffee Co.',
    orderDate: 'Sep 18, 2026',
    expectedDate: 'Sep 22, 2026',
    items: [
      { id: 'item-3', name: 'Espresso Roast Beans 1kg', sku: 'SKU-DRK-001', quantity: 25, unitCost: 650 },
    ],
    totalAmount: 16250,
    status: 'Pending Approval',
    notes: 'Quarterly coffee bean procurement.',
  },
  {
    id: 'po-103',
    poNumber: 'PO-2026-086',
    supplier: 'Metro Wholesale Depot',
    orderDate: 'Sep 15, 2026',
    expectedDate: 'Sep 17, 2026',
    items: [
      { id: 'item-4', name: 'Classic Burger Patty (Beef)', sku: 'SKU-BRG-001', quantity: 100, unitCost: 110 },
      { id: 'item-5', name: 'Smokey BBQ Dip Sauce 500ml', sku: 'SKU-SAU-001', quantity: 40, unitCost: 140 },
    ],
    totalAmount: 16600,
    status: 'Received',
    notes: 'Delivered and verified by warehouse lead.',
  },
  {
    id: 'po-104',
    poNumber: 'PO-2026-085',
    supplier: 'GreenPack Solutions',
    orderDate: 'Sep 14, 2026',
    expectedDate: 'Sep 25, 2026',
    items: [
      { id: 'item-6', name: 'Eco Paper Takeaway Bags (Pack 100)', sku: 'SKU-PKG-001', quantity: 30, unitCost: 450 },
    ],
    totalAmount: 13500,
    status: 'Draft',
    notes: 'Q4 packaging order draft.',
  },
];

export default function InventoryManagement({
  activeSubTab,
  onSelectSubTab,
  theme,
}: InventoryManagementProps) {
  // Main Data States
  const [stockItems, setStockItems] = useState<StockItem[]>(INITIAL_STOCK);
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>(INITIAL_ADJUSTMENTS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_POS);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'in_stock' | 'low_stock' | 'out_of_stock'>('All');
  const [poStatusFilter, setPoStatusFilter] = useState<string>('All');

  // Modals
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState<StockItem | null>(null);
  const [adjustType, setAdjustType] = useState<'increase' | 'decrease'>('decrease');
  const [adjustQty, setAdjustQty] = useState<number>(1);
  const [adjustReason, setAdjustReason] = useState<StockAdjustment['reason']>('Damage');
  const [adjustNotes, setAdjustNotes] = useState('');

  // Delete Item Confirmation Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<StockItem | null>(null);

  const confirmDeleteItem = () => {
    if (!itemToDelete) return;
    setStockItems((prev) => prev.filter((item) => item.id !== itemToDelete.id));
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  // PO Modals
  const [showPoModal, setShowPoModal] = useState(false);
  const [viewingPo, setViewingPo] = useState<PurchaseOrder | null>(null);
  const [newPoSupplier, setNewPoSupplier] = useState('Amul Dairy Cooperative');
  const [newPoExpectedDate, setNewPoExpectedDate] = useState('2026-09-24');
  const [newPoItems, setNewPoItems] = useState<{ itemId: string; quantity: number }[]>([
    { itemId: 'stk-1', quantity: 50 },
  ]);
  const [newPoNotes, setNewPoNotes] = useState('');

  // Add Item Modal
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemSku, setNewItemSku] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Burgers');
  const [newItemLocation, setNewItemLocation] = useState('Storage Room A');
  const [newItemInStock, setNewItemInStock] = useState(20);
  const [newItemMinThreshold, setNewItemMinThreshold] = useState(10);
  const [newItemUnitCost, setNewItemUnitCost] = useState(100);
  const [newItemRetailPrice, setNewItemRetailPrice] = useState(199);
  const [newItemSupplier, setNewItemSupplier] = useState('Metro Wholesale Depot');

  // Categories extraction
  const categories = useMemo(() => {
    const set = new Set(stockItems.map((item) => item.category));
    return ['All', ...Array.from(set)];
  }, [stockItems]);

  // Stock Filter Calculation
  const filteredStock = useMemo(() => {
    return stockItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;

      let matchesStatus = true;
      if (statusFilter === 'out_of_stock') matchesStatus = item.inStock === 0;
      else if (statusFilter === 'low_stock') matchesStatus = item.inStock > 0 && item.inStock <= item.minThreshold;
      else if (statusFilter === 'in_stock') matchesStatus = item.inStock > item.minThreshold;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [stockItems, searchQuery, categoryFilter, statusFilter]);

  // Overall KPI Metrics
  const totalStockUnits = useMemo(() => stockItems.reduce((acc, curr) => acc + curr.inStock, 0), [stockItems]);
  const lowStockCount = useMemo(() => stockItems.filter((i) => i.inStock > 0 && i.inStock <= i.minThreshold).length, [stockItems]);
  const outOfStockCount = useMemo(() => stockItems.filter((i) => i.inStock === 0).length, [stockItems]);
  const totalValuation = useMemo(() => stockItems.reduce((acc, curr) => acc + curr.inStock * curr.unitCost, 0), [stockItems]);

  // Quick action: Open adjust modal for a specific stock item
  const openAdjustForItem = (item: StockItem) => {
    setSelectedStockItem(item);
    setAdjustQty(1);
    setAdjustType('decrease');
    setAdjustReason('Damage');
    setAdjustNotes('');
    setShowAdjustModal(true);
  };

  // Submit Stock Adjustment
  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockItem || adjustQty <= 0) return;

    const delta = adjustType === 'increase' ? adjustQty : -adjustQty;
    const newStockQty = Math.max(0, selectedStockItem.inStock + delta);

    // 1. Update stock
    setStockItems((prev) =>
      prev.map((i) => (i.id === selectedStockItem.id ? { ...i, inStock: newStockQty } : i))
    );

    // 2. Add adjustment record
    const newAdj: StockAdjustment = {
      id: `ADJ-2026-${String(adjustments.length + 19).padStart(3, '0')}`,
      itemId: selectedStockItem.id,
      itemName: selectedStockItem.name,
      sku: selectedStockItem.sku,
      date: 'Just now',
      type: adjustType,
      quantity: adjustQty,
      reason: adjustReason,
      adjustedBy: 'Rahul Sharma (Admin)',
      notes: adjustNotes || undefined,
    };
    setAdjustments([newAdj, ...adjustments]);
    setShowAdjustModal(false);
  };

  // Submit New Stock Item
  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: StockItem = {
      id: `stk-${Date.now()}`,
      sku: newItemSku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newItemName,
      category: newItemCategory,
      location: newItemLocation,
      inStock: Number(newItemInStock),
      minThreshold: Number(newItemMinThreshold),
      unitCost: Number(newItemUnitCost),
      retailPrice: Number(newItemRetailPrice),
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80',
      supplier: newItemSupplier,
    };

    setStockItems([newItem, ...stockItems]);
    setShowAddItemModal(false);
    setNewItemName('');
    setNewItemSku('');
  };

  // Handle Receiving a Purchase Order
  const handleReceivePO = (po: PurchaseOrder) => {
    if (po.status === 'Received') return;

    // Update PO status
    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === po.id ? { ...p, status: 'Received' } : p))
    );

    // Increment stock items
    setStockItems((prevStock) => {
      return prevStock.map((stockItem) => {
        const poLine = po.items.find((item) => item.sku === stockItem.sku);
        if (poLine) {
          return { ...stockItem, inStock: stockItem.inStock + poLine.quantity };
        }
        return stockItem;
      });
    });

    // Add adjustments log
    po.items.forEach((line) => {
      const record: StockAdjustment = {
        id: `ADJ-2026-${Math.floor(100 + Math.random() * 900)}`,
        itemId: line.id,
        itemName: line.name,
        sku: line.sku,
        date: 'Just now',
        type: 'increase',
        quantity: line.quantity,
        reason: 'Supplier Restock',
        adjustedBy: 'Rahul Sharma (Admin)',
        notes: `PO Received: ${po.poNumber} from ${po.supplier}`,
      };
      setAdjustments((prev) => [record, ...prev]);
    });

    if (viewingPo && viewingPo.id === po.id) {
      setViewingPo({ ...viewingPo, status: 'Received' });
    }
  };

  // Create PO handler
  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const poItemsMapped: POLineItem[] = newPoItems.map((entry) => {
      const match = stockItems.find((s) => s.id === entry.itemId) || stockItems[0];
      return {
        id: match.id,
        name: match.name,
        sku: match.sku,
        quantity: entry.quantity,
        unitCost: match.unitCost,
      };
    });

    const total = poItemsMapped.reduce((acc, curr) => acc + curr.quantity * curr.unitCost, 0);

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-0${purchaseOrders.length + 89}`,
      supplier: newPoSupplier,
      orderDate: 'Today, Sep 20',
      expectedDate: newPoExpectedDate,
      items: poItemsMapped,
      totalAmount: total,
      status: 'In Transit',
      notes: newPoNotes,
    };

    setPurchaseOrders([newPO, ...purchaseOrders]);
    setShowPoModal(false);
  };

  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', width: '100%' }}>
      {/* 1. Header Section: Title & Warehouse Badge */}
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
            <span>Admin</span>
            <span>/</span>
            <span>Inventory</span>
            <span>/</span>
            <span style={{ color: theme.textPrimary }}>
              {activeSubTab === 'stock' ? 'Stock Levels' : activeSubTab === 'adjustment' ? 'Stock Adjustments' : 'Purchase Orders'}
            </span>
          </div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: 800,
            color: theme.textPrimary,
            letterSpacing: '-0.04em',
            margin: 0,
          }}>
            {activeSubTab === 'stock' ? 'Stock Levels' : activeSubTab === 'adjustment' ? 'Stock Adjustments' : 'Purchase Orders'}
          </h1>
        </div>

        {/* Warehouse status pill badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.55rem',
          backgroundColor: theme.bgCard,
          border: `1px solid ${theme.border}`,
          padding: '6px 14px',
          borderRadius: '9999px',
        }}>
          <WarehouseRoundedIcon sx={{ fontSize: 16, color: theme.textPrimary }} />
          <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textPrimary }}>
            SP CAFE Central Storage
          </span>
          <span style={{ fontSize: '11px', color: theme.textMuted }}>•</span>
          <span style={{ fontSize: '11.5px', color: '#22C55E', fontWeight: 700 }}>
            Live Sync
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. SUB-TAB 1: STOCK LEVELS                                   */}
      {/* ============================================================ */}
      {activeSubTab === 'stock' && (
        <div>
          {/* 4 Inventory KPI Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            {/* Card 1: Total SKUs */}
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.35rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: theme.textSecondary,
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Total Tracked SKUs
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {stockItems.length}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  items ({totalStockUnits} units)
                </span>
              </div>
            </div>

            {/* Card 2: Low Stock Warning */}
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.35rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: theme.textSecondary,
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Low Stock Alert
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {lowStockCount}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  items need restock
                </span>
              </div>
            </div>

            {/* Card 3: Out of Stock */}
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.35rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: theme.textSecondary,
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Out of Stock
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {outOfStockCount}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  zero inventory
                </span>
              </div>
            </div>

            {/* Card 4: Inventory Valuation */}
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.35rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: theme.textSecondary,
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Asset Valuation
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  ₹{totalValuation.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  cost basis
                </span>
              </div>
            </div>
          </div>

          {/* Search, Filter & Action Toolbar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.85rem',
            marginBottom: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: '280px' }}>
              {/* Search Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                backgroundColor: theme.bgCard,
                border: `1px solid ${theme.border}`,
                borderRadius: '0.65rem',
                padding: '0 0.85rem',
                height: '38px',
                flex: 1,
              }}>
                <SearchRoundedIcon sx={{ fontSize: 18, color: theme.textMuted }} />
                <input
                  type="text"
                  placeholder="Search item by name, SKU, or shelf..."
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

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
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
                <option value="All">All Statuses</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock (≤ min)</option>
                <option value="out_of_stock">Out of Stock (0)</option>
              </select>
            </div>

            {/* Quick Action Button: Add Item */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button
                type="button"
                className="button-20"
                role="button"
                onClick={() => setShowAddItemModal(true)}
                style={{
                  height: '38px',
                  padding: '0 1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <AddRoundedIcon sx={{ fontSize: 18 }} />
                <span>Add Item</span>
              </button>
            </div>
          </div>

          {/* Stock Table Container Card */}
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
                  backgroundColor: theme.tableHeaderBg,
                }}>
                  <th style={{ padding: '0.85rem 1.15rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Item & SKU
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Category
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Storage Bin
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Stock Level
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Unit Cost / Retail
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Total Value
                  </th>
                  <th style={{ padding: '0.85rem 1.15rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStock.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: theme.textSecondary }}>
                      No inventory items found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredStock.map((item, index) => {
                    const isOut = item.inStock === 0;
                    const isLow = item.inStock > 0 && item.inStock <= item.minThreshold;
                    const stockValuation = item.inStock * item.unitCost;

                    return (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: index < filteredStock.length - 1 ? `1px solid ${theme.border}` : 'none',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.tableRowHover; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        {/* Item + Thumbnail + SKU */}
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
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: theme.textPrimary, fontSize: '13.5px' }}>
                                {item.name}
                              </div>
                              <div style={{ fontSize: '11px', color: theme.textSecondary, fontFamily: 'monospace' }}>
                                {item.sku}
                              </div>
                            </div>
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
                            {item.category}
                          </span>
                        </td>

                        {/* Storage Bin */}
                        <td style={{ padding: '0.85rem 1rem', fontSize: '12.5px', color: theme.textSecondary, fontWeight: 500 }}>
                          {item.location}
                        </td>

                        {/* Stock Level & Status Badge */}
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{
                              fontSize: '14px',
                              fontWeight: 800,
                              color: isOut ? '#DC2626' : isLow ? '#D97706' : theme.textPrimary,
                            }}>
                              {item.inStock}
                            </span>
                            <span style={{ fontSize: '11px', color: theme.textMuted }}>
                              / min {item.minThreshold}
                            </span>
                          </div>
                          <div style={{ marginTop: '3px' }}>
                            {isOut ? (
                              <span style={{
                                fontSize: '10.5px',
                                fontWeight: 800,
                                backgroundColor: '#FEE2E2',
                                color: '#991B1B',
                                padding: '1px 6px',
                                borderRadius: '9999px',
                              }}>
                                OUT OF STOCK
                              </span>
                            ) : isLow ? (
                              <span style={{
                                fontSize: '10.5px',
                                fontWeight: 800,
                                backgroundColor: '#FEF3C7',
                                color: '#92400E',
                                padding: '1px 6px',
                                borderRadius: '9999px',
                              }}>
                                LOW STOCK
                              </span>
                            ) : (
                              <span style={{
                                fontSize: '10.5px',
                                fontWeight: 800,
                                backgroundColor: '#DCFCE7',
                                color: '#166534',
                                padding: '1px 6px',
                                borderRadius: '9999px',
                              }}>
                                IN STOCK
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Unit Cost / Retail */}
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: theme.textPrimary }}>
                            ₹{item.retailPrice}
                          </div>
                          <div style={{ fontSize: '11px', color: theme.textSecondary }}>
                            Cost: ₹{item.unitCost}
                          </div>
                        </td>

                        {/* Valuation */}
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textPrimary }}>
                          ₹{stockValuation.toLocaleString('en-IN')}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '0.85rem 1.15rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                            <button
                              type="button"
                              onClick={() => openAdjustForItem(item)}
                              title="Adjust stock quantity"
                              style={{
                                padding: '4px 9px',
                                borderRadius: '0.45rem',
                                border: `1px solid ${theme.border}`,
                                backgroundColor: theme.hoverBg,
                                color: theme.textPrimary,
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <TuneRoundedIcon sx={{ fontSize: 13 }} />
                              <span>Adjust</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setItemToDelete(item);
                                setShowDeleteModal(true);
                              }}
                              title={`Remove ${item.name}`}
                              style={{
                                padding: '4px 7px',
                                borderRadius: '0.45rem',
                                border: '1px solid #FECACA',
                                backgroundColor: '#FEF2F2',
                                color: '#DC2626',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#FEE2E2';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#FEF2F2';
                              }}
                            >
                              <DeleteOutlineRoundedIcon sx={{ fontSize: 15, color: '#DC2626' }} />
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

      {/* ============================================================ */}
      {/* 3. SUB-TAB 2: STOCK ADJUSTMENTS                              */}
      {/* ============================================================ */}
      {activeSubTab === 'adjustment' && (
        <div>
          {/* Top Bar for Adjustments */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 0.25rem 0' }}>
                Stock Adjustments & Waste Log
              </h2>
              <p style={{ fontSize: '13px', color: theme.textSecondary, margin: 0 }}>
                Audit trails for damaged stock, expirations, inventory reconciliation & tastings.
              </p>
            </div>

            <button
              type="button"
              className="button-20"
              role="button"
              onClick={() => {
                setSelectedStockItem(stockItems[0]);
                setAdjustQty(1);
                setAdjustType('decrease');
                setAdjustReason('Damage');
                setAdjustNotes('');
                setShowAdjustModal(true);
              }}
              style={{
                height: '38px',
                padding: '0 1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <TuneRoundedIcon sx={{ fontSize: 16 }} />
              <span>Record Adjustment</span>
            </button>
          </div>

          {/* Adjustments Table Container Card */}
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
                  backgroundColor: theme.tableHeaderBg,
                }}>
                  <th style={{ padding: '0.85rem 1.15rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Adjustment Ref
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Item & SKU
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Change
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Reason
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Adjusted By
                  </th>
                  <th style={{ padding: '0.85rem 1.15rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Notes / Memo
                  </th>
                </tr>
              </thead>
              <tbody>
                {adjustments.map((adj, index) => (
                  <tr
                    key={adj.id}
                    style={{
                      borderBottom: index < adjustments.length - 1 ? `1px solid ${theme.border}` : 'none',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.tableRowHover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {/* Ref + Date */}
                    <td style={{ padding: '0.85rem 1.15rem' }}>
                      <div style={{ fontWeight: 800, color: theme.textPrimary, fontFamily: 'monospace' }}>
                        {adj.id}
                      </div>
                      <div style={{ fontSize: '11.5px', color: theme.textSecondary }}>
                        {adj.date}
                      </div>
                    </td>

                    {/* Item */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: theme.textPrimary }}>
                        {adj.itemName}
                      </div>
                      <div style={{ fontSize: '11px', color: theme.textSecondary, fontFamily: 'monospace' }}>
                        {adj.sku}
                      </div>
                    </td>

                    {/* Change */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '0.45rem',
                        backgroundColor: adj.type === 'increase' ? '#DCFCE7' : '#FEE2E2',
                        color: adj.type === 'increase' ? '#166534' : '#991B1B',
                      }}>
                        {adj.type === 'increase' ? (
                          <ArrowUpwardRoundedIcon sx={{ fontSize: 13 }} />
                        ) : (
                          <ArrowDownwardRoundedIcon sx={{ fontSize: 13 }} />
                        )}
                        {adj.type === 'increase' ? `+${adj.quantity}` : `-${adj.quantity}`} units
                      </span>
                    </td>

                    {/* Reason Badge */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        fontSize: '11.5px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '0.45rem',
                        backgroundColor: theme.hoverBg,
                        color: theme.textPrimary,
                      }}>
                        {adj.reason}
                      </span>
                    </td>

                    {/* Adjusted By */}
                    <td style={{ padding: '0.85rem 1rem', fontSize: '12.5px', color: theme.textPrimary, fontWeight: 600 }}>
                      {adj.adjustedBy}
                    </td>

                    {/* Notes */}
                    <td style={{ padding: '0.85rem 1.15rem', fontSize: '12.5px', color: theme.textSecondary, maxWidth: '280px' }}>
                      {adj.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. SUB-TAB 3: PURCHASE ORDERS                                */}
      {/* ============================================================ */}
      {activeSubTab === 'po' && (
        <div>
          {/* PO Summary Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.35rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: theme.textSecondary,
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Active Purchase Orders
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {purchaseOrders.length}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  orders
                </span>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.35rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: theme.textSecondary,
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                In Transit Shipments
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {purchaseOrders.filter((p) => p.status === 'In Transit').length}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  en route
                </span>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.35rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: theme.textSecondary,
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Pending Approval
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {purchaseOrders.filter((p) => p.status === 'Pending Approval').length}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  awaiting review
                </span>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.35rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: theme.textSecondary,
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Total PO Spend
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  ₹{purchaseOrders.reduce((acc, p) => acc + p.totalAmount, 0).toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  committed
                </span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.85rem',
            marginBottom: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <select
                value={poStatusFilter}
                onChange={(e) => setPoStatusFilter(e.target.value)}
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
                <option value="All">All PO Statuses</option>
                <option value="In Transit">In Transit</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Received">Received</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <button
              type="button"
              className="button-20"
              role="button"
              onClick={() => setShowPoModal(true)}
              style={{
                height: '38px',
                padding: '0 1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <LocalShippingRoundedIcon sx={{ fontSize: 16 }} />
              <span>Create Purchase Order</span>
            </button>
          </div>

          {/* PO Table Container */}
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
                  backgroundColor: theme.tableHeaderBg,
                }}>
                  <th style={{ padding: '0.85rem 1.15rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    PO Number
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Supplier
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Ordered / Expected
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Items & Qty
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Total Amount
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
                {purchaseOrders
                  .filter((po) => poStatusFilter === 'All' || po.status === poStatusFilter)
                  .map((po, index) => {
                    const totalUnits = po.items.reduce((acc, i) => acc + i.quantity, 0);

                    return (
                      <tr
                        key={po.id}
                        style={{
                          borderBottom: index < purchaseOrders.length - 1 ? `1px solid ${theme.border}` : 'none',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.tableRowHover; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        {/* PO Number */}
                        <td style={{ padding: '0.85rem 1.15rem' }}>
                          <span style={{ fontWeight: 800, color: theme.textPrimary, fontFamily: 'monospace' }}>
                            {po.poNumber}
                          </span>
                        </td>

                        {/* Supplier */}
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: theme.textPrimary }}>
                          {po.supplier}
                        </td>

                        {/* Dates */}
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ fontSize: '12.5px', color: theme.textPrimary, fontWeight: 600 }}>
                            {po.orderDate}
                          </div>
                          <div style={{ fontSize: '11px', color: theme.textSecondary }}>
                            Exp: {po.expectedDate}
                          </div>
                        </td>

                        {/* Items */}
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: theme.textPrimary }}>
                            {po.items.length} items
                          </span>
                          <span style={{ fontSize: '11.5px', color: theme.textSecondary, marginLeft: '0.3rem' }}>
                            ({totalUnits} units)
                          </span>
                        </td>

                        {/* Amount */}
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textPrimary }}>
                          ₹{po.totalAmount.toLocaleString('en-IN')}
                        </td>

                        {/* Status */}
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            backgroundColor:
                              po.status === 'Received' ? '#DCFCE7' :
                              po.status === 'In Transit' ? '#DBEAFE' :
                              po.status === 'Pending Approval' ? '#FEF3C7' : '#F3F4F6',
                            color:
                              po.status === 'Received' ? '#166534' :
                              po.status === 'In Transit' ? '#1E40AF' :
                              po.status === 'Pending Approval' ? '#92400E' : '#374151',
                          }}>
                            {po.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '0.85rem 1.15rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <button
                              type="button"
                              onClick={() => setViewingPo(po)}
                              title="View details"
                              style={{
                                padding: '4px 8px',
                                borderRadius: '0.45rem',
                                border: `1px solid ${theme.border}`,
                                backgroundColor: theme.hoverBg,
                                color: theme.textPrimary,
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                              }}
                            >
                              <VisibilityRoundedIcon sx={{ fontSize: 13 }} />
                              <span>View</span>
                            </button>

                            {po.status !== 'Received' && (
                              <button
                                type="button"
                                onClick={() => handleReceivePO(po)}
                                title="Mark as received and add to stock"
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '0.45rem',
                                  border: '1px solid #166534',
                                  backgroundColor: '#DCFCE7',
                                  color: '#166534',
                                  fontSize: '12px',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  fontFamily: 'inherit',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                }}
                              >
                                <CheckRoundedIcon sx={{ fontSize: 13 }} />
                                <span>Receive</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. MODAL: ADJUST STOCK                                       */}
      {/* ============================================================ */}
      {showAdjustModal && selectedStockItem && (
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
                  Adjust Stock Quantity
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

            {/* Item Card Summary */}
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
                <Image src={selectedStockItem.image} alt={selectedStockItem.name} fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: theme.textPrimary }}>
                  {selectedStockItem.name}
                </div>
                <div style={{ fontSize: '11.5px', color: theme.textSecondary }}>
                  SKU: {selectedStockItem.sku} • Current: <strong>{selectedStockItem.inStock} units</strong>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveAdjustment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Type: Increase or Decrease */}
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

              {/* Quantity */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.4rem' }}>
                  Quantity to Adjust
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

              {/* Reason */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.4rem' }}>
                  Reason for Adjustment
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value as any)}
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
                  <option value="Damage">Damage (Dropped / Broken)</option>
                  <option value="Expired">Expired Stock</option>
                  <option value="Audit Count">Audit Discrepancy / Cycle Count</option>
                  <option value="Internal Use">Internal Kitchen Consumption / Tasting</option>
                  <option value="Theft/Lost">Theft / Unaccounted Loss</option>
                  <option value="Supplier Restock">Direct Supplier Restock (No PO)</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.4rem' }}>
                  Notes / Reference (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Damaged during delivery intake..."
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

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.65rem',
                marginTop: '0.5rem',
              }}>
                <button
                  type="button"
                  className="button-20-secondary"
                  role="button"
                  onClick={() => setShowAdjustModal(false)}
                  style={{
                    height: '38px',
                    padding: '0 1.15rem',
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
                  className="button-20"
                  role="button"
                  style={{
                    height: '38px',
                    padding: '0 1.25rem',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. MODAL: ADD NEW ITEM                                       */}
      {/* ============================================================ */}
      {showAddItemModal && (
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
            maxWidth: '520px',
            boxShadow: '0 20px 48px rgba(0,0,0,0.2)',
            padding: '1.5rem',
            boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AddRoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                  Add Inventory Item
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddItemModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleCreateNewItem} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                  Item Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Gourmet Fries Regular"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 0.85rem',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                    SKU Code
                  </label>
                  <input
                    type="text"
                    placeholder="SKU-FRS-001"
                    value={newItemSku}
                    onChange={(e) => setNewItemSku(e.target.value)}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 0.85rem',
                      borderRadius: '0.55rem',
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.border}`,
                      color: theme.textPrimary,
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                    Category
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 0.85rem',
                      borderRadius: '0.55rem',
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.border}`,
                      color: theme.textPrimary,
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  >
                    <option value="Burgers">Burgers</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Sauces">Sauces</option>
                    <option value="Apparel">Apparel</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                    Initial In-Stock Units
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newItemInStock}
                    onChange={(e) => setNewItemInStock(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 0.85rem',
                      borderRadius: '0.55rem',
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.border}`,
                      color: theme.textPrimary,
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                    Min Alert Threshold
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newItemMinThreshold}
                    onChange={(e) => setNewItemMinThreshold(parseInt(e.target.value) || 1)}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 0.85rem',
                      borderRadius: '0.55rem',
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.border}`,
                      color: theme.textPrimary,
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                    Unit Cost (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newItemUnitCost}
                    onChange={(e) => setNewItemUnitCost(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 0.85rem',
                      borderRadius: '0.55rem',
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.border}`,
                      color: theme.textPrimary,
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                    Retail Price (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newItemRetailPrice}
                    onChange={(e) => setNewItemRetailPrice(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 0.85rem',
                      borderRadius: '0.55rem',
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.border}`,
                      color: theme.textPrimary,
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                  Supplier / Vendor
                </label>
                <input
                  type="text"
                  value={newItemSupplier}
                  onChange={(e) => setNewItemSupplier(e.target.value)}
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 0.85rem',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="button-20-secondary"
                  role="button"
                  onClick={() => setShowAddItemModal(false)}
                  style={{
                    height: '38px',
                    padding: '0 1.15rem',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button-20"
                  role="button"
                  style={{
                    height: '38px',
                    padding: '0 1.25rem',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. MODAL: CREATE PURCHASE ORDER                              */}
      {/* ============================================================ */}
      {showPoModal && (
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
            maxWidth: '520px',
            boxShadow: '0 20px 48px rgba(0,0,0,0.2)',
            padding: '1.5rem',
            boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LocalShippingRoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                  New Purchase Order
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPoModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleCreatePO} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                  Supplier / Vendor
                </label>
                <select
                  value={newPoSupplier}
                  onChange={(e) => setNewPoSupplier(e.target.value)}
                  style={{
                    width: '100%',
                    height: '36px',
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
                  <option value="Amul Dairy Cooperative">Amul Dairy Cooperative</option>
                  <option value="Coorg Estate Coffee Co.">Coorg Estate Coffee Co.</option>
                  <option value="Metro Wholesale Depot">Metro Wholesale Depot</option>
                  <option value="Fresh Bakes Gujarat">Fresh Bakes Gujarat</option>
                  <option value="GreenPack Solutions">GreenPack Solutions</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={newPoExpectedDate}
                  onChange={(e) => setNewPoExpectedDate(e.target.value)}
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 0.85rem',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Items in PO */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.4rem' }}>
                  Item to Procure
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 90px', gap: '0.5rem', width: '100%', boxSizing: 'border-box' }}>
                  <select
                    value={newPoItems[0]?.itemId}
                    onChange={(e) => setNewPoItems([{ itemId: e.target.value, quantity: newPoItems[0]?.quantity || 10 }])}
                    style={{
                      width: '100%',
                      minWidth: 0,
                      height: '36px',
                      padding: '0 0.75rem',
                      borderRadius: '0.55rem',
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.border}`,
                      color: theme.textPrimary,
                      fontSize: '12.5px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                    }}
                  >
                    {stockItems.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.sku})</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min={1}
                    value={newPoItems[0]?.quantity}
                    onChange={(e) => setNewPoItems([{ itemId: newPoItems[0]?.itemId || stockItems[0].id, quantity: parseInt(e.target.value) || 1 }])}
                    placeholder="Qty"
                    style={{
                      width: '100%',
                      minWidth: 0,
                      height: '36px',
                      padding: '0 0.75rem',
                      borderRadius: '0.55rem',
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.border}`,
                      color: theme.textPrimary,
                      fontSize: '13px',
                      fontWeight: 800,
                      boxSizing: 'border-box',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                  Instructions / Notes
                </label>
                <textarea
                  rows={2}
                  value={newPoNotes}
                  onChange={(e) => setNewPoNotes(e.target.value)}
                  placeholder="e.g., Deliver during morning prep hours before 11 AM..."
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
                  className="button-20-secondary"
                  role="button"
                  onClick={() => setShowPoModal(false)}
                  style={{
                    height: '38px',
                    padding: '0 1.15rem',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button-20"
                  role="button"
                  style={{
                    height: '38px',
                    padding: '0 1.25rem',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Create & Send PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 8. MODAL: VIEW PURCHASE ORDER DETAILS                        */}
      {/* ============================================================ */}
      {viewingPo && (
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
            maxWidth: '560px',
            boxShadow: '0 20px 48px rgba(0,0,0,0.2)',
            padding: '1.5rem',
            boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: theme.textSecondary, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Purchase Order
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '2px 0 0 0', color: theme.textPrimary, fontFamily: 'monospace' }}>
                  {viewingPo.poNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingPo(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            {/* Meta Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.85rem',
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.border}`,
              borderRadius: '0.85rem',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '12.5px',
            }}>
              <div>
                <span style={{ color: theme.textSecondary }}>Supplier:</span>
                <div style={{ fontWeight: 800, color: theme.textPrimary }}>{viewingPo.supplier}</div>
              </div>
              <div>
                <span style={{ color: theme.textSecondary }}>Status:</span>
                <div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '9999px',
                    backgroundColor: viewingPo.status === 'Received' ? '#DCFCE7' : '#DBEAFE',
                    color: viewingPo.status === 'Received' ? '#166534' : '#1E40AF',
                  }}>
                    {viewingPo.status}
                  </span>
                </div>
              </div>
              <div>
                <span style={{ color: theme.textSecondary }}>Order Date:</span>
                <div style={{ fontWeight: 700, color: theme.textPrimary }}>{viewingPo.orderDate}</div>
              </div>
              <div>
                <span style={{ color: theme.textSecondary }}>Expected Date:</span>
                <div style={{ fontWeight: 700, color: theme.textPrimary }}>{viewingPo.expectedDate}</div>
              </div>
            </div>

            {/* Line items */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Ordered Line Items
              </div>
              <div style={{ border: `1px solid ${theme.border}`, borderRadius: '0.65rem', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead style={{ backgroundColor: theme.tableHeaderBg }}>
                    <tr>
                      <th style={{ padding: '0.6rem 0.85rem', textAlign: 'left', fontWeight: 800, color: theme.textSecondary, fontSize: '11px' }}>Item</th>
                      <th style={{ padding: '0.6rem 0.85rem', textAlign: 'center', fontWeight: 800, color: theme.textSecondary, fontSize: '11px' }}>Qty</th>
                      <th style={{ padding: '0.6rem 0.85rem', textAlign: 'right', fontWeight: 800, color: theme.textSecondary, fontSize: '11px' }}>Unit Cost</th>
                      <th style={{ padding: '0.6rem 0.85rem', textAlign: 'right', fontWeight: 800, color: theme.textSecondary, fontSize: '11px' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingPo.items.map((line, idx) => (
                      <tr key={idx} style={{ borderTop: `1px solid ${theme.border}` }}>
                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <div style={{ fontWeight: 700, color: theme.textPrimary }}>{line.name}</div>
                          <div style={{ fontSize: '10.5px', color: theme.textSecondary, fontFamily: 'monospace' }}>{line.sku}</div>
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center', fontWeight: 800, color: theme.textPrimary }}>
                          {line.quantity}
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right', color: theme.textSecondary }}>
                          ₹{line.unitCost}
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right', fontWeight: 800, color: theme.textPrimary }}>
                          ₹{(line.quantity * line.unitCost).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0',
              borderTop: `1px solid ${theme.border}`,
              marginBottom: '1rem',
            }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: theme.textPrimary }}>
                Total Order Value:
              </span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary }}>
                ₹{viewingPo.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
              <button
                type="button"
                className="button-20-secondary"
                role="button"
                onClick={() => setViewingPo(null)}
                style={{
                  height: '38px',
                  padding: '0 1.15rem',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>

              {viewingPo.status !== 'Received' && (
                <button
                  type="button"
                  className="button-20"
                  role="button"
                  onClick={() => handleReceivePO(viewingPo)}
                  style={{
                    height: '38px',
                    padding: '0 1.25rem',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <CheckRoundedIcon sx={{ fontSize: 16 }} />
                  <span>Receive & Add to Stock</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ============================================================ */}
      {/* 9. MODAL: CONFIRM DELETE ITEM                                */}
      {/* ============================================================ */}
      {showDeleteModal && itemToDelete && (
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
                Remove Inventory Item?
              </h3>
            </div>

            <p style={{ fontSize: '13.5px', color: theme.textSecondary, margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
              Are you sure you want to remove <strong>{itemToDelete.name}</strong> ({itemToDelete.sku}) from inventory? Current stock is <strong>{itemToDelete.inStock} units</strong>.
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.65rem',
            }}>
              <button
                type="button"
                className="button-20-secondary"
                role="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }}
                style={{
                  height: '38px',
                  padding: '0 1.15rem',
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
                onClick={confirmDeleteItem}
                style={{
                  height: '38px',
                  padding: '0 1.25rem',
                  borderRadius: '1rem',
                  border: '1px solid #DC2626',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
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
