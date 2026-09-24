'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';

// Material Rounded Icons
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded';
import SellRoundedIcon from '@mui/icons-material/SellRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import BrandingWatermarkRoundedIcon from '@mui/icons-material/BrandingWatermarkRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import PercentRoundedIcon from '@mui/icons-material/PercentRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';

export interface ProductVariant {
  id: string;
  name: string; // e.g., "Regular", "Large", "Small", "Medium"
  sku: string;
  costPrice: number;
  sellingPrice: number;
  barcode?: string;
  inStock?: number;
  isActive: boolean;
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  category: string;
  brand?: string;
  sku: string;
  barcode: string;
  sellingPrice: number;
  costPrice: number;
  taxRate: number; // e.g. 0, 5, 12, 18, 28
  taxType: 'inclusive' | 'exclusive';
  image: string;
  hasVariants: boolean;
  variants: ProductVariant[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface BrandItem {
  id: string;
  name: string;
  description: string;
  origin: string;
}

interface ProductManagementProps {
  activeSubTab?: 'products' | 'categories' | 'brands';
  onSelectSubTab?: (tab: 'products' | 'categories' | 'brands') => void;
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

// Preset product image suggestions for easy selection in modal
const IMAGE_PRESETS = [
  { name: 'Smash Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80' },
  { name: 'Cheeseburger', url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=80' },
  { name: 'Coffee Cup', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80' },
  { name: 'Iced Latte', url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80' },
  { name: 'Croissant', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80' },
  { name: 'Brownie', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80' },
  { name: 'Pizza Margherita', url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=80' },
  { name: 'French Fries', url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80' },
  { name: 'Mineral Water', url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80' },
  { name: 'Cheesecake', url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=80' },
];

const INITIAL_CATEGORIES: CategoryItem[] = [];

const INITIAL_BRANDS: BrandItem[] = [];

const INITIAL_PRODUCTS: ProductItem[] = [];

export default function ProductManagement({
  activeSubTab = 'products',
  onSelectSubTab,
  theme,
}: ProductManagementProps) {
  // Navigation & Sub-Tabs
  const [currentSubTab, setCurrentSubTab] = useState<'products' | 'categories' | 'brands'>(activeSubTab);

  useEffect(() => {
    if (activeSubTab) {
      setCurrentSubTab(activeSubTab);
    }
  }, [activeSubTab]);

  const handleTabChange = (tab: 'products' | 'categories' | 'brands') => {
    setCurrentSubTab(tab);
    onSelectSubTab?.(tab);
  };

  // Main state
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [brands, setBrands] = useState<BrandItem[]>(INITIAL_BRANDS);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [variantFilter, setVariantFilter] = useState<'all' | 'variants' | 'single'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Selected products for bulk actions
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);

  // Category Modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatColor, setNewCatColor] = useState('#3B82F6');

  // Brand Modal
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandDesc, setNewBrandDesc] = useState('');
  const [newBrandOrigin, setNewBrandOrigin] = useState('');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Form State for Add / Edit Product
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]?.name || 'General');
  const [formBrand, setFormBrand] = useState(brands[0]?.name || '');
  const [formSku, setFormSku] = useState('');
  const [formBarcode, setFormBarcode] = useState('');
  const [formCostPrice, setFormCostPrice] = useState<number | ''>(100);
  const [formSellingPrice, setFormSellingPrice] = useState<number | ''>(200);
  const [formTaxRate, setFormTaxRate] = useState<number>(5);
  const [formTaxType, setFormTaxType] = useState<'inclusive' | 'exclusive'>('inclusive');
  const [formImage, setFormImage] = useState(IMAGE_PRESETS[0].url);
  const [formIsActive, setFormIsActive] = useState(true);

  // Variants in Form
  const [formHasVariants, setFormHasVariants] = useState(false);
  const [formVariantRows, setFormVariantRows] = useState<ProductVariant[]>([
    { id: 'v1', name: 'Regular', sku: 'SKU-REG', costPrice: 90, sellingPrice: 180, inStock: 50, isActive: true },
    { id: 'v2', name: 'Large', sku: 'SKU-LRG', costPrice: 130, sellingPrice: 250, inStock: 35, isActive: true },
  ]);

  // Open Add Product Modal
  const handleOpenAddProduct = () => {
    const randomSku = `SKU-PRD-${Math.floor(100 + Math.random() * 900)}`;
    const randomBarcode = `890${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    setEditingProduct(null);
    setFormName('');
    setFormDescription('');
    setFormCategory(categories[0]?.name || 'General');
    setFormBrand(brands[0]?.name || '');
    setFormSku(randomSku);
    setFormBarcode(randomBarcode);
    setFormCostPrice(100);
    setFormSellingPrice(220);
    setFormTaxRate(5);
    setFormTaxType('inclusive');
    setFormImage(IMAGE_PRESETS[0].url);
    setFormIsActive(true);
    setFormHasVariants(false);
    setFormVariantRows([
      { id: `var-${Date.now()}-1`, name: 'Regular', sku: `${randomSku}-REG`, costPrice: 100, sellingPrice: 220, inStock: 50, isActive: true },
      { id: `var-${Date.now()}-2`, name: 'Large', sku: `${randomSku}-LRG`, costPrice: 140, sellingPrice: 290, inStock: 30, isActive: true },
    ]);
    setShowProductModal(true);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod: ProductItem) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormDescription(prod.description);
    setFormCategory(prod.category);
    setFormBrand(prod.brand || brands[0]?.name || '');
    setFormSku(prod.sku);
    setFormBarcode(prod.barcode);
    setFormCostPrice(prod.costPrice);
    setFormSellingPrice(prod.sellingPrice);
    setFormTaxRate(prod.taxRate);
    setFormTaxType(prod.taxType);
    setFormImage(prod.image);
    setFormIsActive(prod.isActive);
    setFormHasVariants(prod.hasVariants);
    setFormVariantRows(
      prod.variants.length > 0
        ? [...prod.variants]
        : [
            { id: `var-${Date.now()}-1`, name: 'Regular', sku: `${prod.sku}-REG`, costPrice: prod.costPrice, sellingPrice: prod.sellingPrice, inStock: 50, isActive: true },
          ]
    );
    setShowProductModal(true);
  };

  // Toggle Single Product Active / Inactive
  const handleToggleActive = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextState = !p.isActive;
          showToast(`Product "${p.name}" is now ${nextState ? 'Active on POS' : 'Inactive / Hidden'}`);
          return { ...p, isActive: nextState };
        }
        return p;
      })
    );
  };

  // Quick Duplicate
  const handleDuplicateProduct = (prod: ProductItem) => {
    const copyId = `prod-${Date.now()}`;
    const copySku = `${prod.sku}-COPY`;
    const copyBarcode = `890${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const newProduct: ProductItem = {
      ...prod,
      id: copyId,
      name: `${prod.name} (Copy)`,
      sku: copySku,
      barcode: copyBarcode,
      createdAt: new Date().toISOString().split('T')[0],
      variants: prod.variants.map((v, i) => ({
        ...v,
        id: `var-${copyId}-${i}`,
        sku: `${v.sku}-COPY`,
      })),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Duplicated "${prod.name}" as "${newProduct.name}"`);
  };

  // Delete Product
  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
    setSelectedProductIds((prev) => prev.filter((id) => id !== productToDelete.id));
    showToast(`Deleted product "${productToDelete.name}" from catalog.`);
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const cost = typeof formCostPrice === 'number' ? formCostPrice : 0;
    const selling = typeof formSellingPrice === 'number' ? formSellingPrice : 0;

    if (editingProduct) {
      // Edit mode
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === editingProduct.id) {
            return {
              ...p,
              name: formName.trim(),
              description: formDescription.trim(),
              category: formCategory,
              brand: formBrand,
              sku: formSku.trim(),
              barcode: formBarcode.trim(),
              costPrice: cost,
              sellingPrice: selling,
              taxRate: formTaxRate,
              taxType: formTaxType,
              image: formImage || IMAGE_PRESETS[0].url,
              hasVariants: formHasVariants,
              variants: formHasVariants ? formVariantRows : [],
              isActive: formIsActive,
              updatedAt: new Date().toISOString().split('T')[0],
            };
          }
          return p;
        })
      );
      showToast(`Updated product "${formName.trim()}" successfully.`);
    } else {
      // Create mode
      const newProduct: ProductItem = {
        id: `prod-${Date.now()}`,
        name: formName.trim(),
        description: formDescription.trim(),
        category: formCategory,
        brand: formBrand,
        sku: formSku.trim() || `SKU-${Date.now()}`,
        barcode: formBarcode.trim() || `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        costPrice: cost,
        sellingPrice: selling,
        taxRate: formTaxRate,
        taxType: formTaxType,
        image: formImage || IMAGE_PRESETS[0].url,
        hasVariants: formHasVariants,
        variants: formHasVariants ? formVariantRows : [],
        isActive: formIsActive,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setProducts((prev) => [newProduct, ...prev]);
      showToast(`Created new product "${formName.trim()}".`);
    }

    setShowProductModal(false);
  };

  // Add a variant row in form
  const handleAddVariantRow = () => {
    const nextIdx = formVariantRows.length + 1;
    const baseSku = formSku || 'SKU-PRD';
    setFormVariantRows((prev) => [
      ...prev,
      {
        id: `var-${Date.now()}-${nextIdx}`,
        name: `Variant ${nextIdx}`,
        sku: `${baseSku}-V${nextIdx}`,
        costPrice: typeof formCostPrice === 'number' ? formCostPrice : 0,
        sellingPrice: typeof formSellingPrice === 'number' ? formSellingPrice : 0,
        inStock: 25,
        isActive: true,
      },
    ]);
  };

  // Remove variant row in form
  const handleRemoveVariantRow = (variantId: string) => {
    setFormVariantRows((prev) => prev.filter((v) => v.id !== variantId));
  };

  // Update variant row field
  const handleUpdateVariantRow = (variantId: string, field: keyof ProductVariant, val: any) => {
    setFormVariantRows((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, [field]: val } : v))
    );
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchBarcode = p.barcode.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchBrand = p.brand?.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchBarcode && !matchDesc && !matchCat && !matchBrand) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Status
      if (statusFilter === 'active' && !p.isActive) return false;
      if (statusFilter === 'inactive' && p.isActive) return false;

      // Variant
      if (variantFilter === 'variants' && !p.hasVariants) return false;
      if (variantFilter === 'single' && p.hasVariants) return false;

      return true;
    });
  }, [products, searchQuery, selectedCategory, statusFilter, variantFilter]);

  // Top Metrics
  const totalCount = products.length;
  const activeCount = products.filter((p) => p.isActive).length;
  const inactiveCount = products.filter((p) => !p.isActive).length;
  const withVariantsCount = products.filter((p) => p.hasVariants).length;
  const avgMargin = useMemo(() => {
    if (products.length === 0) return 0;
    const margins = products.map((p) => {
      if (p.sellingPrice <= 0) return 0;
      return ((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100;
    });
    return (margins.reduce((a, b) => a + b, 0) / products.length).toFixed(1);
  }, [products]);

  // Bulk Actions
  const handleToggleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    }
  };

  const handleBulkActivate = () => {
    setProducts((prev) =>
      prev.map((p) => (selectedProductIds.includes(p.id) ? { ...p, isActive: true } : p))
    );
    showToast(`Activated ${selectedProductIds.length} products on POS.`);
    setSelectedProductIds([]);
  };

  const handleBulkDeactivate = () => {
    setProducts((prev) =>
      prev.map((p) => (selectedProductIds.includes(p.id) ? { ...p, isActive: false } : p))
    );
    showToast(`Deactivated ${selectedProductIds.length} products from POS.`);
    setSelectedProductIds([]);
  };

  // Add Category Submit
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      description: newCatDesc.trim(),
      color: newCatColor,
    };
    setCategories((prev) => [...prev, newCat]);
    setNewCatName('');
    setNewCatDesc('');
    setShowCategoryModal(false);
    showToast(`Added category "${newCat.name}".`);
  };

  // Add Brand Submit
  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    const newBr: BrandItem = {
      id: `br-${Date.now()}`,
      name: newBrandName.trim(),
      description: newBrandDesc.trim(),
      origin: newBrandOrigin.trim() || 'India',
    };
    setBrands((prev) => [...prev, newBr]);
    setNewBrandName('');
    setNewBrandDesc('');
    setNewBrandOrigin('');
    setShowBrandModal(false);
    showToast(`Added brand "${newBr.name}".`);
  };

  // Live profit margin calculation in form
  const formCostNum = typeof formCostPrice === 'number' ? formCostPrice : 0;
  const formSellNum = typeof formSellingPrice === 'number' ? formSellingPrice : 0;
  const formProfit = formSellNum - formCostNum;
  const formMarginPercent = formSellNum > 0 ? ((formProfit / formSellNum) * 100).toFixed(1) : '0';

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#111827',
          color: '#F9FAFB',
          padding: '0.85rem 1.25rem',
          borderRadius: '0.85rem',
          boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          zIndex: 9999,
          fontSize: '13px',
          fontWeight: 700,
          border: '1px solid #374151',
          animation: 'fadeIn 0.2s ease',
        }}>
          <CheckCircleRoundedIcon sx={{ fontSize: 18, color: '#10B981' }} />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0 }}
          >
            <CloseRoundedIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      )}

      {/* 1. Header Section: Title, SubTabs & Primary "+ Add Product" Button */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
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
            Product Management
          </h1>
          <p style={{
            fontSize: '13.5px',
            color: theme.textSecondary,
            margin: 0,
            fontWeight: 500,
          }}>
            Manage store catalog, prices, taxes, barcodes, multi-size variants & POS register visibility.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Primary Action Button based on subTab */}
          {currentSubTab === 'products' && (
            <button
              type="button"
              className="button-20"
              role="button"
              onClick={handleOpenAddProduct}
              style={{
                height: '38px',
                padding: '0 1.15rem',
                fontSize: '13px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <AddRoundedIcon sx={{ fontSize: 18 }} />
              <span>Add Product</span>
            </button>
          )}

          {currentSubTab === 'categories' && (
            <button
              type="button"
              className="button-20"
              role="button"
              onClick={() => setShowCategoryModal(true)}
              style={{
                height: '38px',
                padding: '0 1.15rem',
                fontSize: '13px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <AddRoundedIcon sx={{ fontSize: 18 }} />
              <span>New Category</span>
            </button>
          )}

          {currentSubTab === 'brands' && (
            <button
              type="button"
              className="button-20"
              role="button"
              onClick={() => setShowBrandModal(true)}
              style={{
                height: '38px',
                padding: '0 1.15rem',
                fontSize: '13px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <AddRoundedIcon sx={{ fontSize: 18 }} />
              <span>New Brand</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SUBTAB 1: PRODUCTS                                            */}
      {/* ============================================================ */}
      {currentSubTab === 'products' && (
        <>
          {/* Top 5 Metric KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            {/* Total Catalog */}
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
                Total Catalog
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {totalCount}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  items
                </span>
              </div>
            </div>

            {/* Active on POS */}
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
                Active on POS
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {activeCount}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  ready to sell
                </span>
              </div>
            </div>

            {/* Inactive / Draft */}
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
                Inactive / Draft
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {inactiveCount}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  hidden from cashier
                </span>
              </div>
            </div>

            {/* Multi-Variant Items */}
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
                Multi-Variant Items
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {withVariantsCount}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  sized & colored
                </span>
              </div>
            </div>

            {/* Average Margin */}
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
                Average Margin
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {avgMargin}%
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  gross margin
                </span>
              </div>
            </div>
          </div>

          {/* Search, Filters & View Mode Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
            borderRadius: '0.85rem',
            padding: '0.65rem 0.85rem',
          }}>
            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: theme.bgPage,
              border: `1px solid ${theme.border}`,
              borderRadius: '0.6rem',
              padding: '0 0.75rem',
              height: '36px',
              minWidth: '260px',
              flex: 1,
              maxWidth: '380px',
            }}>
              <SearchRoundedIcon sx={{ fontSize: 17, color: theme.textSecondary }} />
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
                  <CloseRoundedIcon sx={{ fontSize: 14, color: theme.textSecondary }} />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  height: '36px',
                  padding: '0 0.75rem',
                  borderRadius: '0.6rem',
                  backgroundColor: theme.bgPage,
                  border: `1px solid ${theme.border}`,
                  color: theme.textPrimary,
                  fontSize: '12.5px',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                style={{
                  height: '36px',
                  padding: '0 0.75rem',
                  borderRadius: '0.6rem',
                  backgroundColor: theme.bgPage,
                  border: `1px solid ${theme.border}`,
                  color: theme.textPrimary,
                  fontSize: '12.5px',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active on POS</option>
                <option value="inactive">Inactive / Draft</option>
              </select>

              {/* Variant Filter */}
              <select
                value={variantFilter}
                onChange={(e) => setVariantFilter(e.target.value as any)}
                style={{
                  height: '36px',
                  padding: '0 0.75rem',
                  borderRadius: '0.6rem',
                  backgroundColor: theme.bgPage,
                  border: `1px solid ${theme.border}`,
                  color: theme.textPrimary,
                  fontSize: '12.5px',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <option value="all">All Variant Types</option>
                <option value="variants">Has Variants</option>
                <option value="single">Single Item</option>
              </select>

              {/* View Toggle (Table / Grid) */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: theme.bgPage,
                border: `1px solid ${theme.border}`,
                borderRadius: '0.6rem',
                padding: '2px',
              }}>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  title="Table View"
                  style={{
                    padding: '4px 7px',
                    borderRadius: '0.45rem',
                    border: 'none',
                    backgroundColor: viewMode === 'table' ? theme.activeBg : 'transparent',
                    color: viewMode === 'table' ? theme.activeText : theme.textPrimary,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ViewListRoundedIcon sx={{ fontSize: 17 }} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  title="Grid Cards View"
                  style={{
                    padding: '4px 7px',
                    borderRadius: '0.45rem',
                    border: 'none',
                    backgroundColor: viewMode === 'grid' ? theme.activeBg : 'transparent',
                    color: viewMode === 'grid' ? theme.activeText : theme.textPrimary,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <GridViewRoundedIcon sx={{ fontSize: 17 }} />
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Action Banner (when items selected) */}
          {selectedProductIds.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#1E293B',
              color: '#FFFFFF',
              borderRadius: '0.75rem',
              padding: '0.65rem 1rem',
              marginBottom: '1rem',
              fontSize: '13px',
              fontWeight: 700,
            }}>
              <span>{selectedProductIds.length} product(s) selected</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleBulkActivate}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '0.45rem',
                    border: '1px solid #10B981',
                    backgroundColor: '#064E3B',
                    color: '#A7F3D0',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Set Active
                </button>
                <button
                  type="button"
                  onClick={handleBulkDeactivate}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '0.45rem',
                    border: '1px solid #64748B',
                    backgroundColor: '#334155',
                    color: '#F1F5F9',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Set Inactive
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProductIds([])}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '0.45rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#94A3B8',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* View 1: TABLE VIEW */}
          {viewMode === 'table' ? (
            <div style={{
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: theme.tableHeaderBg, borderBottom: `1px solid ${theme.border}` }}>
                    <th style={{ padding: '0.85rem 1rem', width: '38px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={selectedProductIds.length > 0 && selectedProductIds.length === filteredProducts.length}
                        onChange={handleToggleSelectAll}
                        style={{ cursor: 'pointer' }}
                      />
                    </th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Product & Details
                    </th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Category & Tax
                    </th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Cost Price
                    </th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Selling Price
                    </th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Variants
                    </th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'center' }}>
                      Status
                    </th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'right' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '3.5rem 1rem', textAlign: 'center' }}>
                        <Inventory2RoundedIcon sx={{ fontSize: 42, color: theme.textSecondary, opacity: 0.4, marginBottom: '0.5rem' }} />
                        <div style={{ fontSize: '14px', fontWeight: 700, color: theme.textPrimary }}>No products found</div>
                        <div style={{ fontSize: '12.5px', color: theme.textSecondary, marginTop: '0.2rem' }}>
                          Try adjusting your search filters or click &quot;Add Product&quot; to create a new item.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((prod, idx) => {
                      const isSelected = selectedProductIds.includes(prod.id);
                      const profit = prod.sellingPrice - prod.costPrice;
                      const marginPercent = prod.sellingPrice > 0 ? ((profit / prod.sellingPrice) * 100).toFixed(0) : '0';

                      return (
                        <tr
                          key={prod.id}
                          style={{
                            borderBottom: idx < filteredProducts.length - 1 ? `1px solid ${theme.border}` : 'none',
                            backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.04)' : 'transparent',
                            transition: 'background-color 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = theme.tableRowHover;
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          {/* Checkbox */}
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                setSelectedProductIds((prev) =>
                                  prev.includes(prod.id) ? prev.filter((id) => id !== prod.id) : [...prev, prod.id]
                                );
                              }}
                              style={{ cursor: 'pointer' }}
                            />
                          </td>

                          {/* Product Image & Name & SKU */}
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                              <div style={{
                                width: '44px',
                                height: '44px',
                                position: 'relative',
                                borderRadius: '0.55rem',
                                overflow: 'hidden',
                                backgroundColor: '#E5E7EB',
                                flexShrink: 0,
                                border: `1px solid ${theme.border}`,
                              }}>
                                <Image
                                  src={prod.image}
                                  alt={prod.name}
                                  fill
                                  sizes="44px"
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>

                              <div>
                                <div style={{ fontWeight: 800, color: theme.textPrimary, fontSize: '13.5px' }}>
                                  {prod.name}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '2px' }}>
                                  <span style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    fontFamily: 'monospace',
                                    color: theme.textSecondary,
                                    backgroundColor: theme.hoverBg,
                                    padding: '1px 5px',
                                    borderRadius: '0.3rem',
                                  }}>
                                    {prod.sku}
                                  </span>
                                  <span style={{
                                    fontSize: '11px',
                                    fontFamily: 'monospace',
                                    color: theme.textMuted,
                                  }}>
                                    {prod.barcode}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Category & Tax */}
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '3px' }}>
                              <span style={{
                                fontSize: '11.5px',
                                fontWeight: 700,
                                color: theme.textPrimary,
                                backgroundColor: theme.hoverBg,
                                padding: '2px 8px',
                                borderRadius: '0.4rem',
                                border: `1px solid ${theme.border}`,
                                width: 'fit-content',
                              }}>
                                {prod.category}
                              </span>
                              <span style={{ fontSize: '11px', color: theme.textSecondary }}>
                                Tax: {prod.taxRate}% ({prod.taxType})
                              </span>
                            </div>
                          </td>

                          {/* Cost Price */}
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ fontWeight: 700, color: theme.textSecondary, fontSize: '13px' }}>
                              ₹{prod.costPrice.toLocaleString('en-IN')}
                            </div>
                          </td>

                          {/* Selling Price & Margin */}
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{ fontWeight: 800, color: theme.textPrimary, fontSize: '14px' }}>
                                ₹{prod.sellingPrice.toLocaleString('en-IN')}
                              </span>
                              <span style={{
                                fontSize: '10.5px',
                                fontWeight: 800,
                                color: '#166534',
                                backgroundColor: '#DCFCE7',
                                padding: '1px 5px',
                                borderRadius: '0.3rem',
                              }}>
                                +{marginPercent}%
                              </span>
                            </div>
                          </td>

                          {/* Variants Column */}
                          <td style={{ padding: '0.85rem 1rem' }}>
                            {prod.hasVariants ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  color: '#1E40AF',
                                  backgroundColor: '#DBEAFE',
                                  padding: '2px 7px',
                                  borderRadius: '0.35rem',
                                  width: 'fit-content',
                                }}>
                                  {prod.variants.length} Variants
                                </span>
                                <span style={{ fontSize: '10.5px', color: theme.textSecondary, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {prod.variants.map((v) => v.name).join(', ')}
                                </span>
                              </div>
                            ) : (
                              <span style={{ fontSize: '11.5px', color: theme.textMuted }}>Single Item</span>
                            )}
                          </td>

                          {/* Active / Inactive Status Toggle */}
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleActive(prod.id)}
                              title={prod.isActive ? 'Click to make inactive' : 'Click to make active on POS'}
                              style={{
                                border: 'none',
                                background: prod.isActive ? '#DCFCE7' : '#F3F4F6',
                                color: prod.isActive ? '#166534' : '#6B7280',
                                padding: '3px 9px',
                                borderRadius: '9999px',
                                fontSize: '11px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <span style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: prod.isActive ? '#16A34A' : '#9CA3AF',
                              }} />
                              <span>{prod.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                            </button>
                          </td>

                          {/* Actions Column */}
                          <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenEditProduct(prod)}
                                title="Edit product"
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '0.45rem',
                                  border: `1px solid ${theme.border}`,
                                  backgroundColor: theme.hoverBg,
                                  color: theme.textPrimary,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  fontSize: '11.5px',
                                  fontWeight: 700,
                                }}
                              >
                                <EditRoundedIcon sx={{ fontSize: 13 }} />
                                <span>Edit</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDuplicateProduct(prod)}
                                title="Duplicate product"
                                style={{
                                  padding: '4px 6px',
                                  borderRadius: '0.45rem',
                                  border: `1px solid ${theme.border}`,
                                  backgroundColor: 'transparent',
                                  color: theme.textSecondary,
                                  cursor: 'pointer',
                                }}
                              >
                                <ContentCopyRoundedIcon sx={{ fontSize: 13 }} />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setProductToDelete(prod);
                                  setShowDeleteModal(true);
                                }}
                                title="Delete product"
                                style={{
                                  padding: '4px 6px',
                                  borderRadius: '0.45rem',
                                  border: '1px solid #FECACA',
                                  backgroundColor: '#FEF2F2',
                                  color: '#DC2626',
                                  cursor: 'pointer',
                                }}
                              >
                                <DeleteOutlineRoundedIcon sx={{ fontSize: 14 }} />
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
          ) : (
            /* View 2: GRID CARDS VIEW */
            filteredProducts.length === 0 ? (
              <div style={{
                backgroundColor: theme.bgCard,
                border: `1px solid ${theme.borderCard}`,
                borderRadius: '1rem',
                padding: '3.5rem 1rem',
                textAlign: 'center',
              }}>
                <Inventory2RoundedIcon sx={{ fontSize: 42, color: theme.textSecondary, opacity: 0.4, marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '14px', fontWeight: 700, color: theme.textPrimary }}>No products found</div>
                <div style={{ fontSize: '12.5px', color: theme.textSecondary, marginTop: '0.2rem' }}>
                  Try adjusting your search filters or click &quot;Add Product&quot; to create a new item.
                </div>
              </div>
            ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}>
              {filteredProducts.map((prod) => {
                const profit = prod.sellingPrice - prod.costPrice;
                const marginPercent = prod.sellingPrice > 0 ? ((profit / prod.sellingPrice) * 100).toFixed(0) : '0';

                return (
                  <div
                    key={prod.id}
                    style={{
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.borderCard}`,
                      borderRadius: '1rem',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Card Image Banner */}
                    <div style={{
                      position: 'relative',
                      height: '160px',
                      backgroundColor: '#E5E7EB',
                      overflow: 'hidden',
                    }}>
                      <Image
                        src={prod.image}
                        alt={prod.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        style={{ objectFit: 'cover' }}
                      />

                      {/* Top Badges */}
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        right: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                        <span style={{
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          color: '#111827',
                          padding: '2px 8px',
                          borderRadius: '0.4rem',
                          fontSize: '11px',
                          fontWeight: 800,
                          backdropFilter: 'blur(4px)',
                        }}>
                          {prod.category}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleActive(prod.id)}
                          style={{
                            border: 'none',
                            backgroundColor: prod.isActive ? '#10B981' : '#6B7280',
                            color: '#FFFFFF',
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            fontSize: '10.5px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                          {prod.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ fontSize: '14.5px', fontWeight: 800, color: theme.textPrimary, marginBottom: '0.25rem' }}>
                        {prod.name}
                      </div>
                      <p style={{
                        fontSize: '12px',
                        color: theme.textSecondary,
                        margin: '0 0 0.75rem 0',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {prod.description}
                      </p>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 'auto',
                        paddingTop: '0.75rem',
                        borderTop: `1px solid ${theme.border}`,
                      }}>
                        <div>
                          <div style={{ fontSize: '11px', color: theme.textSecondary }}>Selling Price</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary }}>
                              ₹{prod.sellingPrice}
                            </span>
                            <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#166534', backgroundColor: '#DCFCE7', padding: '1px 5px', borderRadius: '0.3rem' }}>
                              +{marginPercent}%
                            </span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '11px', color: theme.textSecondary }}>Cost Price</div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: theme.textSecondary }}>
                            ₹{prod.costPrice}
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEditProduct(prod)}
                          style={{
                            flex: 1,
                            padding: '0.45rem',
                            borderRadius: '0.5rem',
                            border: `1px solid ${theme.border}`,
                            backgroundColor: theme.hoverBg,
                            color: theme.textPrimary,
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <EditRoundedIcon sx={{ fontSize: 14 }} />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setProductToDelete(prod);
                            setShowDeleteModal(true);
                          }}
                          style={{
                            padding: '0.45rem 0.65rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #FECACA',
                            backgroundColor: '#FEF2F2',
                            color: '#DC2626',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <DeleteOutlineRoundedIcon sx={{ fontSize: 15 }} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )
          )}
        </>
      )}

      {/* ============================================================ */}
      {/* SUBTAB 2: CATEGORIES                                         */}
      {/* ============================================================ */}
      {currentSubTab === 'categories' && (
        categories.length === 0 ? (
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
            borderRadius: '1rem',
            padding: '3.5rem 1rem',
            textAlign: 'center',
          }}>
            <CategoryRoundedIcon sx={{ fontSize: 42, color: theme.textSecondary, opacity: 0.4, marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '14px', fontWeight: 700, color: theme.textPrimary }}>No categories defined</div>
            <div style={{ fontSize: '12.5px', color: theme.textSecondary, marginTop: '0.2rem' }}>
              Click &quot;Add Category&quot; to create your first category.
            </div>
          </div>
        ) : (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}>
              {categories.map((cat) => {
                const productCount = products.filter((p) => p.category === cat.name).length;

                return (
                  <div
                    key={cat.id}
                    style={{
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.borderCard}`,
                      borderRadius: '1rem',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          color: '#FFFFFF',
                          backgroundColor: cat.color,
                          padding: '3px 8px',
                          borderRadius: '0.4rem',
                        }}>
                          <GridViewRoundedIcon sx={{ fontSize: 13 }} />
                          <span>Category</span>
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary }}>
                          {productCount} items
                        </span>
                      </div>

                      <h3 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 0.35rem 0' }}>
                        {cat.name}
                      </h3>
                      <p style={{ fontSize: '12.5px', color: theme.textSecondary, margin: 0, lineHeight: 1.4 }}>
                        {cat.description}
                      </p>
                    </div>

                    <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          handleTabChange('products');
                        }}
                        style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: '0.5rem',
                          border: `1px solid ${theme.border}`,
                          backgroundColor: theme.hoverBg,
                          color: theme.textPrimary,
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        View Products ({productCount})
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}

      {/* ============================================================ */}
      {/* SUBTAB 3: BRANDS                                             */}
      {/* ============================================================ */}
      {currentSubTab === 'brands' && (
        brands.length === 0 ? (
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
            borderRadius: '1rem',
            padding: '3.5rem 1rem',
            textAlign: 'center',
          }}>
            <BrandingWatermarkRoundedIcon sx={{ fontSize: 42, color: theme.textSecondary, opacity: 0.4, marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '14px', fontWeight: 700, color: theme.textPrimary }}>No brands defined</div>
            <div style={{ fontSize: '12.5px', color: theme.textSecondary, marginTop: '0.2rem' }}>
              Click &quot;Add Brand&quot; to create your first brand.
            </div>
          </div>
        ) : (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}>
              {brands.map((brand) => {
                const productCount = products.filter((p) => p.brand === brand.name).length;

                return (
                  <div
                    key={brand.id}
                    style={{
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.borderCard}`,
                      borderRadius: '1rem',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: theme.textSecondary,
                          backgroundColor: theme.hoverBg,
                          padding: '2px 8px',
                          borderRadius: '0.35rem',
                        }}>
                          Origin: {brand.origin}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary }}>
                          {productCount} items
                        </span>
                      </div>

                      <h3 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 0.35rem 0' }}>
                        {brand.name}
                      </h3>
                      <p style={{ fontSize: '12.5px', color: theme.textSecondary, margin: 0, lineHeight: 1.4 }}>
                        {brand.description}
                      </p>
                    </div>

                    <div style={{ marginTop: '1.25rem' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery(brand.name);
                          handleTabChange('products');
                        }}
                        style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: '0.5rem',
                          border: `1px solid ${theme.border}`,
                          backgroundColor: theme.hoverBg,
                          color: theme.textPrimary,
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Filter by Brand
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT PRODUCT                                    */}
      {/* ============================================================ */}
      {showProductModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem',
          boxSizing: 'border-box',
        }}>
          <div style={{
            backgroundColor: theme.bgPage,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '740px',
            maxHeight: '90vh',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: `1px solid ${theme.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: theme.bgCard,
            }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 2px 0', color: theme.textPrimary }}>
                  {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
                </h3>
                <div style={{ fontSize: '12.5px', color: theme.textSecondary }}>
                  Configure product details, pricing, taxes, barcodes and variants.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: theme.textSecondary,
                  padding: '4px',
                  borderRadius: '0.4rem',
                }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* 1. Basic Information Section */}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
                    1. Basic Information
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    {/* Name */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Artisan Truffle Burger"
                        style={{
                          width: '100%',
                          height: '38px',
                          padding: '0 0.85rem',
                          borderRadius: '0.6rem',
                          backgroundColor: theme.bgCard,
                          border: `1px solid ${theme.border}`,
                          color: theme.textPrimary,
                          fontSize: '13.5px',
                          fontWeight: 700,
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                        Category *
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        style={{
                          width: '100%',
                          height: '38px',
                          padding: '0 0.75rem',
                          borderRadius: '0.6rem',
                          backgroundColor: theme.bgCard,
                          border: `1px solid ${theme.border}`,
                          color: theme.textPrimary,
                          fontSize: '13px',
                          fontWeight: 700,
                          boxSizing: 'border-box',
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {categories.length === 0 ? (
                          <option value="General">General</option>
                        ) : (
                          categories.map((c) => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))
                        )}
                      </select>
                    </div>

                    {/* Brand */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                        Brand
                      </label>
                      <select
                        value={formBrand}
                        onChange={(e) => setFormBrand(e.target.value)}
                        style={{
                          width: '100%',
                          height: '38px',
                          padding: '0 0.75rem',
                          borderRadius: '0.6rem',
                          backgroundColor: theme.bgCard,
                          border: `1px solid ${theme.border}`,
                          color: theme.textPrimary,
                          fontSize: '13px',
                          fontWeight: 700,
                          boxSizing: 'border-box',
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="">None / Unbranded</option>
                        {brands.map((b) => (
                          <option key={b.id} value={b.name}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                      Product Description
                    </label>
                    <textarea
                      rows={2}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Brief culinary or retail description shown on receipts, menus, and product info..."
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '0.6rem',
                        backgroundColor: theme.bgCard,
                        border: `1px solid ${theme.border}`,
                        color: theme.textPrimary,
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                </div>

                {/* 2. Barcode & SKU Identification Section */}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
                    2. SKU & Barcode Identification
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {/* SKU */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: theme.textSecondary }}>
                          SKU Code *
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormSku(`SKU-${formCategory.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`)}
                          style={{
                            border: 'none',
                            background: 'none',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#2563EB',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          Auto-generate
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={formSku}
                        onChange={(e) => setFormSku(e.target.value)}
                        placeholder="e.g. SKU-BRG-101"
                        style={{
                          width: '100%',
                          height: '38px',
                          padding: '0 0.85rem',
                          borderRadius: '0.6rem',
                          backgroundColor: theme.bgCard,
                          border: `1px solid ${theme.border}`,
                          color: theme.textPrimary,
                          fontSize: '13px',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>

                    {/* Barcode */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: theme.textSecondary }}>
                          Barcode / EAN-13 *
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormBarcode(`890${Math.floor(1000000000 + Math.random() * 9000000000)}`)}
                          style={{
                            border: 'none',
                            background: 'none',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#2563EB',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          Generate Barcode
                        </button>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          required
                          value={formBarcode}
                          onChange={(e) => setFormBarcode(e.target.value)}
                          placeholder="e.g. 8901234567890"
                          style={{
                            width: '100%',
                            height: '38px',
                            padding: '0 2.2rem 0 0.85rem',
                            borderRadius: '0.6rem',
                            backgroundColor: theme.bgCard,
                            border: `1px solid ${theme.border}`,
                            color: theme.textPrimary,
                            fontSize: '13px',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            boxSizing: 'border-box',
                            outline: 'none',
                          }}
                        />
                        <QrCodeRoundedIcon sx={{ fontSize: 18, color: theme.textSecondary, position: 'absolute', right: '10px', top: '10px' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Pricing, Cost & Tax Section */}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
                    3. Pricing, Cost & Tax
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    gap: '0.75rem',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.borderCard}`,
                    borderRadius: '0.85rem',
                    padding: '0.85rem',
                  }}>
                    {/* Cost Price */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                        Cost Price (₹) *
                      </label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={formCostPrice}
                        onChange={(e) => setFormCostPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        style={{
                          width: '100%',
                          height: '36px',
                          padding: '0 0.75rem',
                          borderRadius: '0.55rem',
                          backgroundColor: theme.bgPage,
                          border: `1px solid ${theme.border}`,
                          color: theme.textPrimary,
                          fontSize: '14px',
                          fontWeight: 800,
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>

                    {/* Selling Price */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                        Selling Price (₹) *
                      </label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={formSellingPrice}
                        onChange={(e) => setFormSellingPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        style={{
                          width: '100%',
                          height: '36px',
                          padding: '0 0.75rem',
                          borderRadius: '0.55rem',
                          backgroundColor: theme.bgPage,
                          border: `1px solid ${theme.border}`,
                          color: theme.textPrimary,
                          fontSize: '14px',
                          fontWeight: 800,
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>

                    {/* Tax Rate */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                        GST / Tax Rate
                      </label>
                      <select
                        value={formTaxRate}
                        onChange={(e) => setFormTaxRate(parseInt(e.target.value) || 0)}
                        style={{
                          width: '100%',
                          height: '36px',
                          padding: '0 0.75rem',
                          borderRadius: '0.55rem',
                          backgroundColor: theme.bgPage,
                          border: `1px solid ${theme.border}`,
                          color: theme.textPrimary,
                          fontSize: '13px',
                          fontWeight: 700,
                          boxSizing: 'border-box',
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value={0}>0% (Tax Exempt)</option>
                        <option value={5}>5% (Standard Food GST)</option>
                        <option value={12}>12% (Packaged Food)</option>
                        <option value={18}>18% (Standard GST)</option>
                        <option value={28}>28% (Luxury / Aerated)</option>
                      </select>
                    </div>

                    {/* Tax Type */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                        Tax Treatment
                      </label>
                      <select
                        value={formTaxType}
                        onChange={(e) => setFormTaxType(e.target.value as any)}
                        style={{
                          width: '100%',
                          height: '36px',
                          padding: '0 0.75rem',
                          borderRadius: '0.55rem',
                          backgroundColor: theme.bgPage,
                          border: `1px solid ${theme.border}`,
                          color: theme.textPrimary,
                          fontSize: '13px',
                          fontWeight: 700,
                          boxSizing: 'border-box',
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="inclusive">Price Includes Tax</option>
                        <option value="exclusive">Add Tax at Checkout</option>
                      </select>
                    </div>
                  </div>

                  {/* Calculated Profit & Margin Bar */}
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '0.55rem',
                    backgroundColor: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                  }}>
                    <span style={{ color: '#166534', fontWeight: 700 }}>
                      Unit Gross Profit: <strong>₹{formProfit.toFixed(2)}</strong>
                    </span>
                    <span style={{
                      backgroundColor: '#16A34A',
                      color: '#FFFFFF',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontWeight: 800,
                    }}>
                      Profit Margin: {formMarginPercent}%
                    </span>
                  </div>
                </div>

                {/* 4. Product Image & Preset Selector Section */}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
                    4. Product Image
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    {/* Image Preview Box */}
                    <div style={{
                      width: '84px',
                      height: '84px',
                      position: 'relative',
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                      backgroundColor: '#E5E7EB',
                      border: `1px solid ${theme.border}`,
                      flexShrink: 0,
                    }}>
                      <Image
                        src={formImage || IMAGE_PRESETS[0].url}
                        alt="Product preview"
                        fill
                        sizes="84px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        style={{
                          width: '100%',
                          height: '36px',
                          padding: '0 0.85rem',
                          borderRadius: '0.6rem',
                          backgroundColor: theme.bgCard,
                          border: `1px solid ${theme.border}`,
                          color: theme.textPrimary,
                          fontSize: '13px',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />

                      {/* Quick Presets Picker */}
                      <div style={{ marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: theme.textSecondary, marginRight: '0.4rem' }}>
                          Presets:
                        </span>
                        <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '4px' }}>
                          {IMAGE_PRESETS.map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => setFormImage(preset.url)}
                              style={{
                                padding: '2px 7px',
                                borderRadius: '0.35rem',
                                border: formImage === preset.url ? '1px solid #2563EB' : `1px solid ${theme.border}`,
                                backgroundColor: formImage === preset.url ? '#EFF6FF' : theme.hoverBg,
                                color: formImage === preset.url ? '#1D4ED8' : theme.textPrimary,
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Variants Builder (Size, Color, etc.) */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.65rem',
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      5. Product Variants (Size, Color, etc.)
                    </div>

                    {/* Enable Variants Toggle */}
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formHasVariants}
                        onChange={(e) => setFormHasVariants(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: theme.textPrimary }}>
                        This product has multiple variants
                      </span>
                    </label>
                  </div>

                  {formHasVariants && (
                    <div style={{
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.borderCard}`,
                      borderRadius: '0.85rem',
                      padding: '0.85rem',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                        <span style={{ fontSize: '12px', color: theme.textSecondary, fontWeight: 600 }}>
                          Configure variant names, specific SKUs, and pricing:
                        </span>
                        <button
                          type="button"
                          onClick={handleAddVariantRow}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '0.4rem',
                            border: `1px solid ${theme.border}`,
                            backgroundColor: theme.hoverBg,
                            color: theme.textPrimary,
                            fontSize: '11.5px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <AddRoundedIcon sx={{ fontSize: 14 }} />
                          <span>Add Variant</span>
                        </button>
                      </div>

                      {/* Variant Rows Table */}
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                            <th style={{ padding: '0.4rem', textAlign: 'left', fontWeight: 700, color: theme.textSecondary }}>Variant Name</th>
                            <th style={{ padding: '0.4rem', textAlign: 'left', fontWeight: 700, color: theme.textSecondary }}>SKU</th>
                            <th style={{ padding: '0.4rem', textAlign: 'left', fontWeight: 700, color: theme.textSecondary }}>Cost (₹)</th>
                            <th style={{ padding: '0.4rem', textAlign: 'left', fontWeight: 700, color: theme.textSecondary }}>Selling (₹)</th>
                            <th style={{ padding: '0.4rem', textAlign: 'center', fontWeight: 700, color: theme.textSecondary }}>Active</th>
                            <th style={{ padding: '0.4rem', textAlign: 'right', fontWeight: 700, color: theme.textSecondary }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formVariantRows.map((v) => (
                            <tr key={v.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                              <td style={{ padding: '0.4rem' }}>
                                <input
                                  type="text"
                                  value={v.name}
                                  onChange={(e) => handleUpdateVariantRow(v.id, 'name', e.target.value)}
                                  placeholder="e.g. Regular / Large"
                                  style={{
                                    width: '100%',
                                    height: '30px',
                                    padding: '0 0.5rem',
                                    borderRadius: '0.35rem',
                                    backgroundColor: theme.bgPage,
                                    border: `1px solid ${theme.border}`,
                                    color: theme.textPrimary,
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    boxSizing: 'border-box',
                                  }}
                                />
                              </td>
                              <td style={{ padding: '0.4rem' }}>
                                <input
                                  type="text"
                                  value={v.sku}
                                  onChange={(e) => handleUpdateVariantRow(v.id, 'sku', e.target.value)}
                                  style={{
                                    width: '100%',
                                    height: '30px',
                                    padding: '0 0.5rem',
                                    borderRadius: '0.35rem',
                                    backgroundColor: theme.bgPage,
                                    border: `1px solid ${theme.border}`,
                                    color: theme.textPrimary,
                                    fontSize: '12px',
                                    fontFamily: 'monospace',
                                    boxSizing: 'border-box',
                                  }}
                                />
                              </td>
                              <td style={{ padding: '0.4rem', width: '90px' }}>
                                <input
                                  type="number"
                                  min={0}
                                  value={v.costPrice}
                                  onChange={(e) => handleUpdateVariantRow(v.id, 'costPrice', parseFloat(e.target.value) || 0)}
                                  style={{
                                    width: '100%',
                                    height: '30px',
                                    padding: '0 0.5rem',
                                    borderRadius: '0.35rem',
                                    backgroundColor: theme.bgPage,
                                    border: `1px solid ${theme.border}`,
                                    color: theme.textPrimary,
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    boxSizing: 'border-box',
                                  }}
                                />
                              </td>
                              <td style={{ padding: '0.4rem', width: '90px' }}>
                                <input
                                  type="number"
                                  min={0}
                                  value={v.sellingPrice}
                                  onChange={(e) => handleUpdateVariantRow(v.id, 'sellingPrice', parseFloat(e.target.value) || 0)}
                                  style={{
                                    width: '100%',
                                    height: '30px',
                                    padding: '0 0.5rem',
                                    borderRadius: '0.35rem',
                                    backgroundColor: theme.bgPage,
                                    border: `1px solid ${theme.border}`,
                                    color: theme.textPrimary,
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    boxSizing: 'border-box',
                                  }}
                                />
                              </td>
                              <td style={{ padding: '0.4rem', textAlign: 'center' }}>
                                <input
                                  type="checkbox"
                                  checked={v.isActive}
                                  onChange={(e) => handleUpdateVariantRow(v.id, 'isActive', e.target.checked)}
                                  style={{ cursor: 'pointer' }}
                                />
                              </td>
                              <td style={{ padding: '0.4rem', textAlign: 'right' }}>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVariantRow(v.id)}
                                  disabled={formVariantRows.length <= 1}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: formVariantRows.length <= 1 ? '#D1D5DB' : '#DC2626',
                                    cursor: formVariantRows.length <= 1 ? 'not-allowed' : 'pointer',
                                  }}
                                >
                                  <CloseRoundedIcon sx={{ fontSize: 16 }} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 6. Product Active / Inactive Switch Section */}
                <div style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '0.85rem',
                  backgroundColor: formIsActive ? '#F0FDF4' : '#F3F4F6',
                  border: `1px solid ${formIsActive ? '#BBF7D0' : '#E5E7EB'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      color: formIsActive ? '#166534' : '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}>
                      <span>Product Status:</span>
                      <span>{formIsActive ? 'Active (Live on POS)' : 'Inactive (Draft / Hidden)'}</span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: formIsActive ? '#15803D' : '#6B7280', marginTop: '2px' }}>
                      {formIsActive
                        ? 'This product is visible to cashiers and can be added to sales tickets and carts.'
                        : 'This product is hidden from POS registers and cannot be rung up.'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFormIsActive((prev) => !prev)}
                    style={{
                      height: '32px',
                      padding: '0 0.85rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: formIsActive ? '#16A34A' : '#6B7280',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {formIsActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>

              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '1rem 1.5rem',
                borderTop: `1px solid ${theme.border}`,
                backgroundColor: theme.bgCard,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
              }}>
                <button
                  type="button"
                  className="button-20-secondary"
                  role="button"
                  onClick={() => setShowProductModal(false)}
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
                    padding: '0 1.35rem',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: DELETE PRODUCT CONFIRMATION                           */}
      {/* ============================================================ */}
      {showDeleteModal && productToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: theme.bgPage,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '440px',
            padding: '1.5rem',
            boxShadow: '0 20px 48px rgba(0,0,0,0.25)',
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#DC2626', margin: '0 0 0.5rem 0' }}>
              Delete Product?
            </h3>
            <p style={{ fontSize: '13px', color: theme.textSecondary, margin: '0 0 1rem 0', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong>{productToDelete.name}</strong> ({productToDelete.sku})?
              This will remove the product from the catalog and the POS cash register.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
              <button
                type="button"
                className="button-20-secondary"
                role="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
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
                type="button"
                onClick={handleConfirmDelete}
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
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD CATEGORY                                          */}
      {/* ============================================================ */}
      {showCategoryModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: theme.bgPage,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '440px',
            padding: '1.5rem',
            boxShadow: '0 20px 48px rgba(0,0,0,0.25)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                Add New Category
              </h3>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Pasta & Risotto"
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 0.85rem',
                    borderRadius: '0.6rem',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 700,
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                  Description
                </label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="e.g. Handcrafted Italian pastas and rich risottos"
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 0.85rem',
                    borderRadius: '0.6rem',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                  Badge Color
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {['#EF4444', '#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4', '#111827'].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewCatColor(col)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: col,
                        border: newCatColor === col ? '2px solid #000000' : '2px solid transparent',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="button-20-secondary"
                  role="button"
                  onClick={() => setShowCategoryModal(false)}
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD BRAND                                             */}
      {/* ============================================================ */}
      {showBrandModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: theme.bgPage,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '440px',
            padding: '1.5rem',
            boxShadow: '0 20px 48px rgba(0,0,0,0.25)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                Add New Brand
              </h3>
              <button
                type="button"
                onClick={() => setShowBrandModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSaveBrand} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="e.g. San Pellegrino"
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 0.85rem',
                    borderRadius: '0.6rem',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 700,
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                  Description
                </label>
                <input
                  type="text"
                  value={newBrandDesc}
                  onChange={(e) => setNewBrandDesc(e.target.value)}
                  placeholder="e.g. Sparkling mineral water and citrus sodas"
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 0.85rem',
                    borderRadius: '0.6rem',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.3rem' }}>
                  Origin Location
                </label>
                <input
                  type="text"
                  value={newBrandOrigin}
                  onChange={(e) => setNewBrandOrigin(e.target.value)}
                  placeholder="e.g. San Pellegrino Terme, Italy"
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 0.85rem',
                    borderRadius: '0.6rem',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="button-20-secondary"
                  role="button"
                  onClick={() => setShowBrandModal(false)}
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
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
