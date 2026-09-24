'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Material Rounded Icons
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import PauseCircleOutlineRoundedIcon from '@mui/icons-material/PauseCircleOutlineRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import StoreRoundedIcon from '@mui/icons-material/StoreRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import { AppTheme, ThemeMode, APP_THEMES, getStoredThemeMode, setStoredThemeMode } from '@/lib/themeConfig';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';
import SellRoundedIcon from '@mui/icons-material/SellRounded';
import PriceChangeRoundedIcon from '@mui/icons-material/PriceChangeRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import TakeoutDiningRoundedIcon from '@mui/icons-material/TakeoutDiningRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import TableBarRoundedIcon from '@mui/icons-material/TableBarRounded';

interface Product {
  id: string;
  name: string;
  variant: string;
  price: number;
  category: string;
  image: string;
  isOffer?: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
  customPrice?: number;
  discountPct?: number;
  discountAmount?: number;
  itemNote?: string;
}

interface HeldSale {
  id: string;
  items: CartItem[];
  time: string;
  total: number;
  saleNote?: string;
  paymentNote?: string;
  orderType?: 'dine_in' | 'takeaway';
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
}





export default function PosMainScreen() {
  const router = useRouter();

  // Navigation and Sidebar state
  const [activeNav, setActiveNav] = useState<'new_sale' | 'held_sales' | 'invoices' | 'customers'>('new_sale');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Real-time Live Clock
  const [liveTime, setLiveTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
      setLiveTime(`${dateStr} • ${timeStr}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Category and Search
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart / Current Sale state
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: {
        id: '1',
        name: 'T-Shirt',
        variant: 'Classic',
        price: 799,
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
      },
      quantity: 1,
    },
  ]);

  // Held sales list
  const [heldSales, setHeldSales] = useState<HeldSale[]>([
    {
      id: 'HELD-101',
      items: [
        {
          product: {
            id: '2',
            name: 'Double Cheeseburger',
            variant: 'Single Combo',
            price: 280,
            category: 'Burgers',
            image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=80',
          },
          quantity: 2,
        },
      ],
      time: '12 mins ago',
      total: 588,
    },
  ]);

  // Customer state & Order Type state
  const [customerName, setCustomerName] = useState('Guest Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [tableNumber, setTableNumber] = useState('T-01');
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [discountPct, setDiscountPct] = useState(0);

  // Frequent customers list for quick selection
  const frequentCustomers = [
    { name: 'Rahul Sharma', phone: '+91 98765 43210' },
    { name: 'Priya Mehta', phone: '+91 98123 45678' },
    { name: 'Amit Patel', phone: '+91 97654 32109' },
    { name: 'Sneha Rao', phone: '+91 99887 76655' },
    { name: 'Vikram Singh', phone: '+91 98220 11223' },
  ];

  // Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('upi');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showEndShiftModal, setShowEndShiftModal] = useState(false);

  // Product Catalog
  const products: Product[] = [
    {
      id: '1',
      name: 'T-Shirt',
      variant: 'Classic',
      price: 799,
      category: 'Apparel',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
      isOffer: true,
    },
    {
      id: '2',
      name: 'Classic Burger',
      variant: 'Gourmet Beef',
      price: 240,
      category: 'Burgers',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: '3',
      name: 'Double Cheeseburger',
      variant: 'Double Patty',
      price: 320,
      category: 'Burgers',
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=80',
      isOffer: true,
    },
    {
      id: '4',
      name: 'Cold Brew Coffee',
      variant: '16oz Steeped',
      price: 180,
      category: 'Beverages',
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: '5',
      name: 'Cappuccino',
      variant: 'Hot / Arabica',
      price: 160,
      category: 'Beverages',
      image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: '6',
      name: 'Butter Croissant',
      variant: 'French Flaky',
      price: 120,
      category: 'Bakery',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: '7',
      name: 'Peri Peri Fries',
      variant: 'Large Crispy',
      price: 140,
      category: 'Burgers',
      image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: '8',
      name: 'Matcha Iced Latte',
      variant: 'Oat Milk',
      price: 220,
      category: 'Beverages',
      image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=80',
      isOffer: true,
    },
    {
      id: '9',
      name: 'Nuradesk Hoodie',
      variant: 'Heavyweight Black',
      price: 1499,
      category: 'Apparel',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
    },
  ];

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Offer'
        ? p.isOffer
        : p.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.variant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Cart operations
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Notes & Item Editing State
  const [saleNote, setSaleNote] = useState<string>('');
  const [paymentNote, setPaymentNote] = useState<string>('');
  const [showSaleNoteModal, setShowSaleNoteModal] = useState(false);
  const [showPaymentNoteModal, setShowPaymentNoteModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  // Item Editor Form state
  const [itemFormPrice, setItemFormPrice] = useState<number>(0);
  const [itemFormDiscountType, setItemFormDiscountType] = useState<'pct' | 'fixed'>('pct');
  const [itemFormDiscountVal, setItemFormDiscountVal] = useState<number>(0);
  const [itemFormNote, setItemFormNote] = useState<string>('');
  const [itemFormQuantity, setItemFormQuantity] = useState<number>(1);

  // Item-level calculation helpers
  const getItemUnitPrice = (item: CartItem): number => {
    return item.customPrice !== undefined ? item.customPrice : item.product.price;
  };

  const getItemDiscountAmount = (item: CartItem): number => {
    const unitPrice = getItemUnitPrice(item);
    const gross = unitPrice * item.quantity;
    if (item.discountAmount !== undefined) {
      return item.discountAmount;
    }
    if (item.discountPct && item.discountPct > 0) {
      return Math.round((gross * item.discountPct) / 100);
    }
    return 0;
  };

  const getItemLineTotal = (item: CartItem): number => {
    const unitPrice = getItemUnitPrice(item);
    const gross = unitPrice * item.quantity;
    const disc = getItemDiscountAmount(item);
    return Math.max(0, gross - disc);
  };

  const openItemEditor = (item: CartItem) => {
    setEditingItem(item);
    setItemFormPrice(item.customPrice !== undefined ? item.customPrice : item.product.price);
    if (item.discountAmount !== undefined && item.discountAmount > 0) {
      setItemFormDiscountType('fixed');
      setItemFormDiscountVal(item.discountAmount);
    } else if (item.discountPct && item.discountPct > 0) {
      setItemFormDiscountType('pct');
      setItemFormDiscountVal(item.discountPct);
    } else {
      setItemFormDiscountType('pct');
      setItemFormDiscountVal(0);
    }
    setItemFormNote(item.itemNote || '');
    setItemFormQuantity(item.quantity);
  };

  const saveItemEditor = () => {
    if (!editingItem) return;
    setCart((prev) =>
      prev.map((it) => {
        if (it.product.id === editingItem.product.id) {
          const isCustom = itemFormPrice !== it.product.price;
          const isPct = itemFormDiscountType === 'pct';
          return {
            ...it,
            quantity: Math.max(1, itemFormQuantity),
            customPrice: isCustom ? itemFormPrice : undefined,
            discountPct: isPct && itemFormDiscountVal > 0 ? itemFormDiscountVal : undefined,
            discountAmount: !isPct && itemFormDiscountVal > 0 ? itemFormDiscountVal : undefined,
            itemNote: itemFormNote.trim() || undefined,
          };
        }
        return it;
      })
    );
    setEditingItem(null);
  };

  const clearCart = () => {
    setCart([]);
    setSaleNote('');
    setPaymentNote('');
    setCustomerName('Guest Customer');
    setCustomerPhone('');
  };

  // Hold Sale
  const handleHoldSale = () => {
    if (cart.length === 0) return;
    const newHold: HeldSale = {
      id: `HELD-${Math.floor(100 + Math.random() * 900)}`,
      items: [...cart],
      time: 'Just now',
      total: calculateTotal(),
      saleNote: saleNote.trim() || undefined,
      paymentNote: paymentNote.trim() || undefined,
      orderType,
      tableNumber: orderType === 'dine_in' ? tableNumber : undefined,
      customerName,
      customerPhone: customerPhone.trim() || undefined,
    };
    setHeldSales((prev) => [newHold, ...prev]);
    setCart([]);
    setSaleNote('');
    setPaymentNote('');
    setCustomerName('Guest Customer');
    setCustomerPhone('');
  };

  const restoreHeldSale = (hold: HeldSale) => {
    setCart(hold.items);
    if (hold.saleNote) setSaleNote(hold.saleNote);
    if (hold.paymentNote) setPaymentNote(hold.paymentNote);
    if (hold.orderType) setOrderType(hold.orderType);
    if (hold.tableNumber) setTableNumber(hold.tableNumber);
    if (hold.customerName) setCustomerName(hold.customerName);
    if (hold.customerPhone) setCustomerPhone(hold.customerPhone);
    setHeldSales((prev) => prev.filter((h) => h.id !== hold.id));
    setActiveNav('new_sale');
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + getItemLineTotal(item), 0);
  const discountAmount = Math.round((subtotal * discountPct) / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(taxableAmount * 0.05); // 5% GST
  const total = taxableAmount + tax;

  function calculateTotal() {
    return total;
  }

  const handleProcessPayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setShowPaymentModal(false);
      setCart([]);
      setSaleNote('');
      setPaymentNote('');
      setCustomerName('Guest Customer');
      setCustomerPhone('');
      setOrderType('dine_in');
      setTableNumber('T-01');
    }, 1600);
  };

  // POS Dynamic Dark / Light Mode State
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
    const nextMode: ThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextMode);
    setStoredThemeMode(nextMode);
  };

  const theme: AppTheme = APP_THEMES[themeMode] || APP_THEMES.light;

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
      {/* 1. TOP HEADER BAR */}
      <header style={{
        height: '62px',
        backgroundColor: theme.bgHeader,
        borderBottom: `1px solid ${theme.headerBorder}`,
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: 30,
        color: theme.headerTextPrimary,
      }}>
        {/* Left: Sidebar Toggle + Nuradesk Logo + Store Logo Pill Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Sidebar Open/Close Toggle Button */}
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
              color: theme.headerTextPrimary,
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.hoverBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {isSidebarOpen ? (
              <MenuOpenRoundedIcon sx={{ fontSize: 21, color: theme.headerTextPrimary }} />
            ) : (
              <MenuRoundedIcon sx={{ fontSize: 21, color: theme.headerTextPrimary }} />
            )}
          </button>

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
              color: theme.headerTextPrimary,
            }}>
              Nuradesk
            </span>
          </Link>

          {/* Store Logo Pill Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: theme.bgCardSubtle,
            border: `1px solid ${theme.border}`,
            borderRadius: '9999px',
            padding: '4px 12px',
            marginLeft: '0.25rem',
          }}>
            <StoreRoundedIcon sx={{ fontSize: 16, color: theme.headerTextPrimary }} />
            <span style={{ fontSize: '12px', fontWeight: 800, color: theme.headerTextPrimary, letterSpacing: '-0.01em' }}>
              SP CAFE
            </span>
            <span style={{ fontSize: '11px', color: theme.border }}>•</span>
            <span style={{ fontSize: '11.5px', color: theme.textSecondary }}>Ahmedabad</span>
          </div>
        </div>

        {/* Center: Live Time Digital Clock */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 700,
            color: theme.headerTextPrimary,
            letterSpacing: '0.02em',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {liveTime || 'Live Time'}
          </span>
        </div>

        {/* Right: Cashier Name + Active Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Active Live Indicator */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '4px 10px',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            borderRadius: '9999px',
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#22C55E',
              boxShadow: '0 0 8px #22C55E',
            }} />
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#22C55E' }}>
              Active
            </span>
          </div>

          {/* Cashier Name Only */}
          <span style={{
            fontSize: '13px',
            fontWeight: 700,
            color: theme.headerTextPrimary,
            letterSpacing: '-0.01em',
          }}>
            Amit Patel
          </span>
        </div>
      </header>

      {/* 2. MAIN BODY: 3-COLUMN LAYOUT (Sidebar + Product Catalog + Current Sale Ticket) */}
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        overflow: 'hidden',
      }}>
        {/* LEFT COLUMN: POS NAVIGATION SIDEBAR */}
        <aside style={{
          width: isSidebarOpen ? '200px' : '68px',
          minWidth: isSidebarOpen ? '200px' : '68px',
          backgroundColor: theme.bgSidebar,
          borderRight: `1px solid ${theme.sidebarBorder}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: isSidebarOpen ? '1.25rem 0.75rem' : '1.25rem 0.5rem',
          flexShrink: 0,
          boxSizing: 'border-box',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1), padding 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'visible',
          zIndex: 40,
          position: 'relative',
        }}>
          {/* Top Nav Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {/* New sale button */}
            <button
              type="button"
              onClick={() => setActiveNav('new_sale')}
              title={!isSidebarOpen ? 'New sale' : undefined}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                padding: isSidebarOpen ? '0.7rem 0.9rem' : '0.7rem 0',
                borderRadius: '0.65rem',
                border: 'none',
                backgroundColor: activeNav === 'new_sale' ? theme.sidebarActiveBg : 'transparent',
                color: activeNav === 'new_sale' ? theme.sidebarActiveText : theme.sidebarTextPrimary,
                fontSize: '14px',
                fontWeight: activeNav === 'new_sale' ? 800 : 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (activeNav !== 'new_sale') e.currentTarget.style.backgroundColor = theme.sidebarHoverBg;
              }}
              onMouseLeave={(e) => {
                if (activeNav !== 'new_sale') e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <PointOfSaleRoundedIcon sx={{ fontSize: 20, color: 'inherit', flexShrink: 0 }} />
              {isSidebarOpen && (
                <span style={{ marginLeft: '0.65rem', whiteSpace: 'nowrap' }}>New sale</span>
              )}
            </button>

            {/* Held sales button */}
            <button
              type="button"
              onClick={() => setActiveNav('held_sales')}
              title={!isSidebarOpen ? `Held sales (${heldSales.length})` : undefined}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarOpen ? 'space-between' : 'center',
                padding: isSidebarOpen ? '0.7rem 0.9rem' : '0.7rem 0',
                borderRadius: '0.65rem',
                border: 'none',
                backgroundColor: activeNav === 'held_sales' ? theme.sidebarActiveBg : 'transparent',
                color: activeNav === 'held_sales' ? theme.sidebarActiveText : theme.sidebarTextPrimary,
                fontSize: '14px',
                fontWeight: activeNav === 'held_sales' ? 800 : 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (activeNav !== 'held_sales') e.currentTarget.style.backgroundColor = theme.sidebarHoverBg;
              }}
              onMouseLeave={(e) => {
                if (activeNav !== 'held_sales') e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <PauseCircleOutlineRoundedIcon sx={{ fontSize: 20, color: 'inherit', flexShrink: 0 }} />
                {isSidebarOpen && (
                  <span style={{ marginLeft: '0.65rem', whiteSpace: 'nowrap' }}>Held sales</span>
                )}
                {!isSidebarOpen && heldSales.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-4px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: activeNav === 'held_sales' ? theme.sidebarActiveText : theme.activeBg,
                  }} />
                )}
              </div>
              {isSidebarOpen && heldSales.length > 0 && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: activeNav === 'held_sales' ? (theme.sidebarIsDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.08)') : theme.secondaryBadgeBg,
                  color: activeNav === 'held_sales' ? theme.sidebarActiveText : theme.secondaryBadgeText,
                  padding: '1px 6px',
                  borderRadius: '9999px',
                }}>
                  {heldSales.length}
                </span>
              )}
            </button>

            {/* Invoices list */}
            <button
              type="button"
              onClick={() => setActiveNav('invoices')}
              title={!isSidebarOpen ? 'Invoices list' : undefined}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                padding: isSidebarOpen ? '0.7rem 0.9rem' : '0.7rem 0',
                borderRadius: '0.65rem',
                border: 'none',
                backgroundColor: activeNav === 'invoices' ? theme.sidebarActiveBg : 'transparent',
                color: activeNav === 'invoices' ? theme.sidebarActiveText : theme.sidebarTextPrimary,
                fontSize: '14px',
                fontWeight: activeNav === 'invoices' ? 800 : 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (activeNav !== 'invoices') e.currentTarget.style.backgroundColor = theme.sidebarHoverBg;
              }}
              onMouseLeave={(e) => {
                if (activeNav !== 'invoices') e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ReceiptLongRoundedIcon sx={{ fontSize: 20, color: 'inherit', flexShrink: 0 }} />
              {isSidebarOpen && (
                <span style={{ marginLeft: '0.65rem', whiteSpace: 'nowrap' }}>Invoices list</span>
              )}
            </button>

            {/* Customer List */}
            <button
              type="button"
              onClick={() => setActiveNav('customers')}
              title={!isSidebarOpen ? 'Customer List' : undefined}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                padding: isSidebarOpen ? '0.7rem 0.9rem' : '0.7rem 0',
                borderRadius: '0.65rem',
                border: 'none',
                backgroundColor: activeNav === 'customers' ? theme.sidebarActiveBg : 'transparent',
                color: activeNav === 'customers' ? theme.sidebarActiveText : theme.sidebarTextPrimary,
                fontSize: '14px',
                fontWeight: activeNav === 'customers' ? 800 : 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (activeNav !== 'customers') e.currentTarget.style.backgroundColor = theme.sidebarHoverBg;
              }}
              onMouseLeave={(e) => {
                if (activeNav !== 'customers') e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <PeopleAltRoundedIcon sx={{ fontSize: 20, color: 'inherit', flexShrink: 0 }} />
              {isSidebarOpen && (
                <span style={{ marginLeft: '0.65rem', whiteSpace: 'nowrap' }}>Customer List</span>
              )}
            </button>
          </nav>

          {/* Bottom Nav Items: End shift, Logout & Theme */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            borderTop: `1px solid ${theme.sidebarBorder}`,
            paddingTop: '0.85rem',
          }}>
            {/* End shift button */}
            <button
              type="button"
              onClick={() => setShowEndShiftModal(true)}
              title={!isSidebarOpen ? 'End shift' : undefined}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                padding: isSidebarOpen ? '0.65rem 0.9rem' : '0.65rem 0',
                borderRadius: '0.65rem',
                border: 'none',
                backgroundColor: 'transparent',
                color: theme.sidebarTextPrimary,
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.sidebarHoverBg; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <ScheduleRoundedIcon sx={{ fontSize: 18, color: 'inherit', flexShrink: 0 }} />
              {isSidebarOpen && (
                <span style={{ marginLeft: '0.65rem', whiteSpace: 'nowrap' }}>End shift</span>
              )}
            </button>

            {/* Logout link */}
            <Link
              href="/pos-login"
              title={!isSidebarOpen ? 'Logout' : undefined}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                padding: isSidebarOpen ? '0.65rem 0.9rem' : '0.65rem 0',
                borderRadius: '0.65rem',
                color: theme.sidebarTextSecondary,
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.sidebarHoverBg;
                e.currentTarget.style.color = theme.sidebarTextPrimary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme.sidebarTextSecondary;
              }}
            >
              <LogoutRoundedIcon sx={{ fontSize: 18, color: 'inherit', flexShrink: 0 }} />
              {isSidebarOpen && (
                <span style={{ marginLeft: '0.65rem', whiteSpace: 'nowrap' }}>Logout</span>
              )}
            </Link>

            {/* Dark / Light Mode Toggle in POS Sidebar */}
            <div style={{ position: 'relative', width: '100%' }}>
              <button
                type="button"
                onClick={handleToggleTheme}
                title={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                aria-label={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isSidebarOpen ? 'space-between' : 'center',
                  padding: isSidebarOpen ? '0.65rem 0.85rem' : '0.65rem 0',
                  borderRadius: '0.65rem',
                  border: 'none',
                  backgroundColor: theme.hoverBg,
                  color: theme.sidebarTextPrimary,
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s ease',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.sidebarIsDark ? '#27272a' : '#e8e8e8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.hoverBg;
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {themeMode === 'light' ? (
                    <DarkModeRoundedIcon sx={{ fontSize: 18, color: theme.sidebarTextPrimary, flexShrink: 0 }} />
                  ) : (
                    <LightModeRoundedIcon sx={{ fontSize: 18, color: '#FACC15', flexShrink: 0 }} />
                  )}
                  {isSidebarOpen && (
                    <span style={{ whiteSpace: 'nowrap', fontWeight: 700, fontSize: '13px' }}>
                      {themeMode === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  )}
                </div>

                {/* Animated Switch Toggle Slider when sidebar is expanded */}
                {isSidebarOpen && (
                  <div
                    style={{
                      width: '36px',
                      height: '20px',
                      borderRadius: '9999px',
                      backgroundColor: themeMode === 'dark' ? '#22C55E' : (theme.sidebarIsDark ? '#3F3F46' : '#D1D5DB'),
                      position: 'relative',
                      transition: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        position: 'absolute',
                        top: '3px',
                        left: themeMode === 'dark' ? '19px' : '3px',
                        transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
                      }}
                    />
                  </div>
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: PRODUCT CATALOG & SEARCH */}
        <section style={{
          flex: 1,
          minWidth: 0,
          height: '100%',
          overflowY: 'auto',
          padding: '1.25rem 1.5rem',
          backgroundColor: theme.bgPage,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {/* Top Search Bar with Barcode Scanner Icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexShrink: 0,
          }}>
            <div style={{
              flex: 1,
              height: '46px',
              backgroundColor: theme.bgCardSubtle,
              border: `1px solid ${theme.border}`,
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 1.1rem',
              gap: '0.65rem',
              transition: 'border-color 0.15s ease',
            }}>
              <SearchRoundedIcon sx={{ fontSize: 20, color: theme.textMuted }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, variant or category..."
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: theme.textPrimary,
                  fontSize: '14px',
                  fontFamily: 'inherit',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer' }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 16 }} />
                </button>
              )}
            </div>

            {/* Barcode Scanner Quick Icon Button */}
            <button
              type="button"
              title="Barcode Scanner Mode"
              onClick={() => alert('Barcode Scanner Mode active. Ready for hardware scanner inputs.')}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '9999px',
                backgroundColor: theme.bgCardSubtle,
                border: `1px solid ${theme.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.textPrimary,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.borderHover;
                e.currentTarget.style.backgroundColor = theme.hoverBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.border;
                e.currentTarget.style.backgroundColor = theme.bgCardSubtle;
              }}
            >
              <QrCodeScannerRoundedIcon sx={{ fontSize: 20 }} />
            </button>
          </div>

          {/* Category Filter Pills: All | Burgers | Beverages | Bakery | Apparel | Offer */}
          <div
            className="no-scrollbar"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              overflowX: 'auto',
              overflowY: 'hidden',
              flexShrink: 0,
              minHeight: '44px',
              padding: '4px 2px 6px 2px',
              boxSizing: 'border-box',
            }}
          >
            {['All', 'Burgers', 'Beverages', 'Bakery', 'Apparel', 'Offer'].map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    flexShrink: 0,
                    height: '36px',
                    padding: '0 1.25rem',
                    borderRadius: '9999px',
                    border: isSelected ? `1px solid ${theme.activeBg}` : `1px solid ${theme.border}`,
                    backgroundColor: isSelected ? theme.activeBg : theme.bgCard,
                    color: isSelected ? theme.activeText : theme.textPrimary,
                    fontSize: '13px',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    lineHeight: 1,
                    transition: 'all 0.15s ease',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = theme.borderHover;
                      e.currentTarget.style.backgroundColor = theme.hoverBg;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = theme.border;
                      e.currentTarget.style.backgroundColor = theme.bgCard;
                    }
                  }}
                >
                  {cat === 'Offer' && <LocalOfferRoundedIcon sx={{ fontSize: 14 }} />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Main Product Grid or Held Sales / Invoices Views */}
          {activeNav === 'new_sale' ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '1rem',
              paddingBottom: '1.5rem',
            }}>
              {filteredProducts.map((p) => {
                const countInCart = cart.find((c) => c.product.id === p.id)?.quantity || 0;

                return (
                  <div
                    key={p.id}
                    onClick={() => addToCart(p)}
                    role="button"
                    tabIndex={0}
                    style={{
                      backgroundColor: theme.bgCard,
                      border: countInCart > 0 ? `2px solid ${theme.activeBg}` : `1px solid ${theme.borderCard}`,
                      borderRadius: '1rem',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = theme.borderHover;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      if (countInCart === 0) e.currentTarget.style.borderColor = theme.borderCard;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Product Image Pod */}
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '135px',
                      backgroundColor: theme.bgCardSubtle,
                    }}>
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 240px"
                        style={{ objectFit: 'cover' }}
                      />
                      {/* Quantity in Cart Badge */}
                      {countInCart > 0 && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          backgroundColor: theme.badgeBg,
                          color: theme.badgeText,
                          border: `1px solid ${theme.border}`,
                          borderRadius: '9999px',
                          padding: '2px 8px',
                          fontSize: '11.5px',
                          fontWeight: 800,
                        }}>
                          {countInCart}x
                        </div>
                      )}
                      {p.isOffer && (
                        <div style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: '8px',
                          backgroundColor: theme.activeBg,
                          color: theme.activeText,
                          borderRadius: '9999px',
                          padding: '2px 7px',
                          fontSize: '10px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                        }}>
                          Offer
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div style={{ padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span style={{ fontSize: '14.5px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.015em' }}>
                        {p.name}
                      </span>
                      <span style={{ fontSize: '12px', color: theme.textSecondary }}>
                        {p.variant}
                      </span>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, marginTop: '0.35rem' }}>
                        ₹{p.price}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : activeNav === 'held_sales' ? (
            /* Held Sales List View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Held Sales ({heldSales.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveNav('new_sale')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '0.55rem',
                    padding: '0.4rem 0.85rem',
                    color: theme.textPrimary,
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
                  <span>Back to Catalog</span>
                </button>
              </div>

              {heldSales.length === 0 ? (
                <div style={{
                  padding: '3rem',
                  textAlign: 'center',
                  color: theme.textMuted,
                  backgroundColor: theme.bgCardSubtle,
                  borderRadius: '1rem',
                  border: `1px solid ${theme.border}`,
                }}>
                  No sales currently on hold.
                </div>
              ) : (
                heldSales.map((h) => (
                  <div
                    key={h.id}
                    style={{
                      padding: '1.1rem 1.25rem',
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                        <span>{h.id} • {h.items.length} items</span>
                        {h.orderType && (
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '9999px',
                            backgroundColor: theme.bgCardSubtle,
                            border: `1px solid ${theme.border}`,
                            color: theme.activeBg,
                          }}>
                            {h.orderType === 'dine_in' ? `Dine In (${h.tableNumber || 'Table'})` : 'Takeaway'}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '0.2rem' }}>
                        {h.customerName && h.customerName !== 'Guest Customer' ? `${h.customerName} • ` : ''}Held {h.time} • Total: ₹{h.total}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => restoreHeldSale(h)}
                      className="button-20"
                      style={{
                        padding: '0.5rem 1.1rem',
                        fontSize: '13px',
                        fontWeight: 700,
                        backgroundColor: theme.posBtnBg,
                        color: theme.posBtnText,
                        borderRadius: '0.65rem',
                        cursor: 'pointer',
                        border: 'none',
                      }}
                    >
                      Resume Sale
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Invoices / Customers View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  {activeNav === 'invoices' ? 'Recent Invoices' : 'Store Customer Directory'}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveNav('new_sale')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '0.55rem',
                    padding: '0.4rem 0.85rem',
                    color: theme.textPrimary,
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
                  <span>Back to Sale</span>
                </button>
              </div>
              <div style={{ backgroundColor: theme.bgCardSubtle, border: `1px solid ${theme.border}`, borderRadius: '1rem', padding: '1.25rem' }}>
                <p style={{ color: theme.textSecondary, fontSize: '13.5px', margin: 0 }}>
                  {activeNav === 'invoices'
                    ? 'Showing all paid invoices for SP CAFE Ahmedabad shift today.'
                    : 'Customer database with loyalty points and contact information.'}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: CURRENT SALE TICKET / CHECKOUT */}
        <aside style={{
          width: '360px',
          backgroundColor: theme.bgCard,
          borderLeft: `1px solid ${theme.border}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
          boxSizing: 'border-box',
        }}>
          {/* Ticket Header */}
          {/* Ticket Header (Compact 40px) */}
          <div style={{
            padding: '0.65rem 0.95rem',
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.bgCard,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <h2 style={{
                fontSize: '15px',
                fontWeight: 800,
                color: theme.textPrimary,
                letterSpacing: '-0.02em',
                margin: 0,
              }}>
                Current Sale
              </h2>
              <span style={{
                fontSize: '10.5px',
                fontWeight: 800,
                backgroundColor: theme.bgCardSubtle,
                border: `1px solid ${theme.border}`,
                color: theme.textSecondary,
                padding: '1px 6px',
                borderRadius: '9999px',
              }}>
                #ORD-1025
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {/* Sale Note Button */}
              <button
                type="button"
                onClick={() => setShowSaleNoteModal(true)}
                title={saleNote ? `Sale Note: ${saleNote}` : 'Add Sale Note'}
                style={{
                  background: saleNote ? theme.hoverBg : 'transparent',
                  border: saleNote ? `1px solid ${theme.activeBg}` : 'none',
                  color: saleNote ? theme.activeBg : theme.textSecondary,
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '0.45rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                }}
              >
                <NoteAltRoundedIcon sx={{ fontSize: 15 }} />
                {saleNote && <span style={{ maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Note</span>}
              </button>

              {/* Pay Note Button */}
              <button
                type="button"
                onClick={() => setShowPaymentNoteModal(true)}
                title={paymentNote ? `Pay Note: ${paymentNote}` : 'Add Payment Note'}
                style={{
                  background: paymentNote ? theme.hoverBg : 'transparent',
                  border: paymentNote ? `1px solid ${theme.activeBg}` : 'none',
                  color: paymentNote ? theme.activeBg : theme.textSecondary,
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '0.45rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                }}
              >
                <PaymentsRoundedIcon sx={{ fontSize: 15 }} />
                {paymentNote && <span style={{ maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Pay</span>}
              </button>

              {/* Clear Cart Button */}
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  title="Clear Ticket"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: theme.textMuted,
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '0.45rem',
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '2px',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#EF4444'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = theme.textMuted; }}
                >
                  <DeleteOutlineRoundedIcon sx={{ fontSize: 17 }} />
                </button>
              )}
            </div>
          </div>

          {/* Order Type & Table Row (Compact 32px) */}
          <div style={{
            padding: '0.35rem 0.85rem',
            backgroundColor: theme.bgCardSubtle,
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}>
            {/* Segmented Pill for Dine In / Takeaway with Smooth Swap Animation */}
            <div style={{
              position: 'relative',
              display: 'flex',
              backgroundColor: theme.bgCard,
              padding: '2px',
              borderRadius: '9999px',
              border: `1px solid ${theme.border}`,
              flex: 1,
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}>
              {/* Smooth Animated Sliding Indicator */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '2px',
                  bottom: '2px',
                  left: '2px',
                  width: 'calc(50% - 2px)',
                  backgroundColor: theme.activeBg,
                  borderRadius: '9999px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.16)',
                  transform: orderType === 'dine_in' ? 'translateX(0%)' : 'translateX(100%)',
                  transition: 'transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1.1)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />

              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  padding: '0.28rem 0.45rem',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: orderType === 'dine_in' ? theme.activeText : theme.textSecondary,
                  fontSize: '11px',
                  fontWeight: orderType === 'dine_in' ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'color 0.22s ease',
                  fontFamily: 'inherit',
                  outline: 'none',
                  userSelect: 'none',
                }}
              >
                <RestaurantRoundedIcon sx={{
                  fontSize: 13,
                  transition: 'transform 0.22s ease',
                  transform: orderType === 'dine_in' ? 'scale(1.08)' : 'scale(1)',
                }} />
                <span>Dine In</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('takeaway')}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  padding: '0.28rem 0.45rem',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: orderType === 'takeaway' ? theme.activeText : theme.textSecondary,
                  fontSize: '11px',
                  fontWeight: orderType === 'takeaway' ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'color 0.22s ease',
                  fontFamily: 'inherit',
                  outline: 'none',
                  userSelect: 'none',
                }}
              >
                <TakeoutDiningRoundedIcon sx={{
                  fontSize: 13,
                  transition: 'transform 0.22s ease',
                  transform: orderType === 'takeaway' ? 'scale(1.08)' : 'scale(1)',
                }} />
                <span>Takeaway</span>
              </button>
            </div>

            {/* Table Dropdown for Dine-In / Token for Takeaway */}
            {orderType === 'dine_in' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <TableBarRoundedIcon sx={{ fontSize: 13, color: theme.activeBg }} />
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  style={{
                    height: '24px',
                    padding: '0 4px',
                    borderRadius: '5px',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgCard,
                    color: theme.activeBg,
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="T-01">T-01</option>
                  <option value="T-02">T-02</option>
                  <option value="T-03">T-03</option>
                  <option value="T-04">T-04</option>
                  <option value="T-05">T-05</option>
                  <option value="T-06">T-06</option>
                  <option value="T-07">T-07</option>
                  <option value="T-08">T-08</option>
                </select>
              </div>
            ) : (
              <span style={{
                fontSize: '10.5px',
                fontWeight: 800,
                color: theme.activeBg,
                backgroundColor: theme.hoverBg,
                padding: '2px 7px',
                borderRadius: '5px',
                border: `1px solid ${theme.border}`,
                whiteSpace: 'nowrap',
              }}>
                #TK-28
              </span>
            )}
          </div>

          {/* Customer Bar: Name & Phone (Single Line 32px) */}
          <div style={{
            padding: '0.35rem 0.85rem',
            backgroundColor: theme.bgCard,
            borderBottom: `1px solid ${theme.border}`,
            position: 'relative',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: theme.bgCardSubtle,
              border: `1px solid ${theme.border}`,
              borderRadius: '0.5rem',
              height: '28px',
              padding: '0 0.4rem',
              gap: '0.35rem',
              boxSizing: 'border-box',
            }}>
              {/* Customer Name input */}
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, gap: '0.25rem' }}>
                <PersonOutlineRoundedIcon sx={{ fontSize: 13, color: theme.textSecondary, flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Guest Customer"
                  value={customerName === 'Guest Customer' ? '' : customerName}
                  onChange={(e) => setCustomerName(e.target.value ? e.target.value : 'Guest Customer')}
                  style={{
                    width: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: theme.textPrimary,
                    fontSize: '11px',
                    fontWeight: 700,
                    outline: 'none',
                    fontFamily: 'inherit',
                    padding: 0,
                  }}
                />
              </div>

              {/* Divider */}
              <div style={{ width: '1px', height: '14px', backgroundColor: theme.border, flexShrink: 0 }} />

              {/* Customer Phone input */}
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, gap: '0.25rem' }}>
                <PhoneRoundedIcon sx={{ fontSize: 12, color: theme.textSecondary, flexShrink: 0 }} />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: theme.textPrimary,
                    fontSize: '11px',
                    fontWeight: 700,
                    outline: 'none',
                    fontFamily: 'inherit',
                    padding: 0,
                  }}
                />
              </div>

              {/* Actions: Reset & Frequent */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', flexShrink: 0 }}>
                {(customerName !== 'Guest Customer' || customerPhone) && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerName('Guest Customer');
                      setCustomerPhone('');
                    }}
                    title="Reset to Guest"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: theme.textMuted,
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <CloseRoundedIcon sx={{ fontSize: 12 }} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowCustomerPicker((prev) => !prev)}
                  title="Select frequent customer"
                  style={{
                    background: showCustomerPicker ? theme.hoverBg : 'none',
                    border: 'none',
                    color: theme.activeBg,
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '4px',
                  }}
                >
                  <PeopleAltRoundedIcon sx={{ fontSize: 13 }} />
                </button>
              </div>
            </div>

            {/* Frequent Customers Popover */}
            {showCustomerPicker && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: '0.85rem',
                right: '0.85rem',
                backgroundColor: theme.bgCard,
                border: `1px solid ${theme.border}`,
                borderRadius: '0.65rem',
                padding: '0.45rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                zIndex: 50,
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: theme.textSecondary,
                  padding: '2px 4px',
                  borderBottom: `1px solid ${theme.border}`,
                  paddingBottom: '4px',
                  marginBottom: '2px',
                }}>
                  <span>Frequent Customers</span>
                  <button
                    type="button"
                    onClick={() => setShowCustomerPicker(false)}
                    style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: 0 }}
                  >
                    <CloseRoundedIcon sx={{ fontSize: 13 }} />
                  </button>
                </div>
                {frequentCustomers.map((cust) => (
                  <div
                    key={cust.phone}
                    onClick={() => {
                      setCustomerName(cust.name);
                      setCustomerPhone(cust.phone);
                      setShowCustomerPicker(false);
                    }}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.35rem 0.5rem',
                      borderRadius: '0.45rem',
                      cursor: 'pointer',
                      backgroundColor: customerPhone === cust.phone ? theme.hoverBg : 'transparent',
                      transition: 'background-color 0.1s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.hoverBg; }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = customerPhone === cust.phone ? theme.hoverBg : 'transparent';
                    }}
                  >
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: theme.textPrimary }}>
                      {cust.name}
                    </span>
                    <span style={{ fontSize: '10.5px', color: theme.textSecondary, fontFamily: 'monospace, inherit' }}>
                      {cust.phone}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0.5rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
          }}>
            {cart.length === 0 ? (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: theme.textMuted,
                gap: '0.5rem',
              }}>
                <ReceiptLongRoundedIcon sx={{ fontSize: 36, color: theme.border }} />
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: theme.textSecondary }}>Ticket is empty</span>
                <span style={{ fontSize: '12px', maxWidth: '200px', color: theme.textMuted }}>Tap any product from the catalog to add items.</span>
              </div>
            ) : (
              cart.map((item) => {
                const hasCustomPrice = item.customPrice !== undefined && item.customPrice !== item.product.price;
                const discAmt = getItemDiscountAmount(item);
                const lineTotal = getItemLineTotal(item);

                return (
                  <div
                    key={item.product.id}
                    onClick={() => openItemEditor(item)}
                    role="button"
                    tabIndex={0}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.65rem',
                      backgroundColor: theme.bgCardSubtle,
                      borderRadius: '0.6rem',
                      border: `1px solid ${theme.border}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.borderHover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; }}
                  >
                    <div style={{ minWidth: 0, flex: 1, paddingRight: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{
                          fontSize: '13.5px',
                          fontWeight: 800,
                          color: theme.textPrimary,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {item.product.name}
                        </span>
                        <EditRoundedIcon sx={{ fontSize: 13, color: theme.textSecondary, opacity: 0.6 }} />
                      </div>

                      {/* Pricing & Discount Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px', flexWrap: 'wrap' }}>
                        {hasCustomPrice ? (
                          <span style={{ fontSize: '11px', color: theme.textSecondary }}>
                            <s style={{ opacity: 0.5 }}>₹{item.product.price}</s>{' '}
                            <strong style={{ color: theme.activeBg }}>₹{item.customPrice}</strong> each
                          </span>
                        ) : (
                          <span style={{ fontSize: '11px', color: theme.textSecondary }}>
                            ₹{item.product.price} each
                          </span>
                        )}

                        {discAmt > 0 && (
                          <span style={{
                            fontSize: '9.5px',
                            fontWeight: 800,
                            backgroundColor: 'rgba(34, 197, 94, 0.15)',
                            color: '#16A34A',
                            padding: '1px 5px',
                            borderRadius: '4px',
                          }}>
                            {item.discountPct ? `${item.discountPct}% OFF` : `-₹${item.discountAmount}`}
                          </span>
                        )}
                      </div>

                      {/* Item Note */}
                      {item.itemNote && (
                        <div style={{
                          marginTop: '3px',
                          fontSize: '10.5px',
                          color: theme.activeBg,
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}>
                          <span>📝 {item.itemNote}</span>
                        </div>
                      )}
                    </div>

                    {/* Quantity Stepper & Line Total */}
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        backgroundColor: theme.bgCard,
                        borderRadius: '0.45rem',
                        border: `1px solid ${theme.border}`,
                        padding: '2px',
                      }}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, -1)}
                          style={{
                            width: '22px',
                            height: '22px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'none',
                            border: 'none',
                            color: theme.textPrimary,
                            cursor: 'pointer',
                          }}
                        >
                          <RemoveRoundedIcon sx={{ fontSize: 13 }} />
                        </button>
                        <span style={{
                          width: '22px',
                          textAlign: 'center',
                          fontSize: '12px',
                          fontWeight: 800,
                          color: theme.textPrimary,
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, 1)}
                          style={{
                            width: '22px',
                            height: '22px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'none',
                            border: 'none',
                            color: theme.textPrimary,
                            cursor: 'pointer',
                          }}
                        >
                          <AddRoundedIcon sx={{ fontSize: 13 }} />
                        </button>
                      </div>

                      <div style={{
                        width: '60px',
                        textAlign: 'right',
                        fontSize: '14px',
                        fontWeight: 800,
                        color: theme.textPrimary,
                      }}>
                        ₹{lineTotal}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Ticket Summary & Checkout Footer (Ultra-Sleek & Compact) */}
          <div style={{
            padding: '0.65rem 0.85rem',
            backgroundColor: theme.bgCard,
            borderTop: `1px solid ${theme.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
          }}>
            {/* Subtotal, Tax, Discount */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: theme.textSecondary }}>
                <span>Subtotal</span>
                <span style={{ color: theme.textPrimary, fontWeight: 600 }}>₹{subtotal}</span>
              </div>
              {discountPct > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#22C55E' }}>
                  <span>Discount ({discountPct}%)</span>
                  <span style={{ fontWeight: 700 }}>-₹{discountAmount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: theme.textSecondary }}>
                <span>Tax (GST 5%)</span>
                <span style={{ color: theme.textPrimary, fontWeight: 600 }}>₹{tax}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                fontSize: '16px',
                fontWeight: 800,
                color: theme.textPrimary,
                paddingTop: '0.3rem',
                borderTop: `1px dashed ${theme.border}`,
                marginTop: '0.1rem',
              }}>
                <span>Total Amount</span>
                <span style={{ fontSize: '19px', fontWeight: 900, color: theme.textPrimary }}>₹{total}</span>
              </div>
            </div>

            {/* Action Buttons: Hold Sale + 10% Discount */}
            <div style={{ display: 'flex', gap: '0.45rem' }}>
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={handleHoldSale}
                style={{
                  flex: 1,
                  height: '31px',
                  borderRadius: '0.5rem',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.bgCardSubtle,
                  color: theme.textPrimary,
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: cart.length === 0 ? 0.45 : 1,
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit',
                }}
              >
                Hold Sale
              </button>
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => setDiscountPct(discountPct === 0 ? 10 : 0)}
                style={{
                  flex: 1,
                  height: '31px',
                  borderRadius: '0.5rem',
                  border: discountPct > 0 ? `1px solid ${theme.activeBg}` : `1px solid ${theme.border}`,
                  backgroundColor: discountPct > 0 ? theme.activeBg : theme.bgCardSubtle,
                  color: discountPct > 0 ? theme.activeText : theme.textPrimary,
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: cart.length === 0 ? 0.45 : 1,
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit',
                }}
              >
                {discountPct > 0 ? '10% Applied' : 'Add 10% Off'}
              </button>
            </div>

            {/* Primary Payment Button (Charge ₹Total) */}
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => setShowPaymentModal(true)}
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '0.75rem',
                backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
                color: theme.sidebarIsDark ? '#FFFFFF' : '#191a19',
                fontSize: '14px',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                border: `1px solid ${theme.sidebarIsDark ? theme.border : '#e2e8f0'}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                opacity: cart.length === 0 ? 0.45 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (cart.length > 0) e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                if (cart.length > 0) e.currentTarget.style.opacity = '1';
              }}
            >
              <span>Charge ₹{total}</span>
            </button>
          </div>
        </aside>
      </div>

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: theme.popoverBg,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            padding: '1.75rem',
            boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          }}>
            {paymentSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircleRoundedIcon sx={{ fontSize: 64, color: '#22C55E', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: theme.textPrimary, marginBottom: '0.35rem' }}>
                  Payment of ₹{total} Successful!
                </h3>
                <p style={{ fontSize: '13px', color: theme.textSecondary, margin: '0 0 0.5rem 0' }}>
                  Order #ORD-1025 completed • Receipt printing...
                </p>
                <div style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  gap: '5px',
                  textAlign: 'left',
                  backgroundColor: theme.bgCardSubtle,
                  padding: '0.65rem 0.95rem',
                  borderRadius: '0.65rem',
                  border: `1px solid ${theme.border}`,
                  fontSize: '12px',
                  marginTop: '0.5rem',
                }}>
                  <div><strong>Order Type:</strong> {orderType === 'dine_in' ? `Dine In (${tableNumber})` : 'Takeaway'}</div>
                  <div><strong>Customer:</strong> {customerName} {customerPhone ? `(${customerPhone})` : ''}</div>
                  {saleNote && <div><strong>Sale Note:</strong> {saleNote}</div>}
                  {paymentNote && <div><strong>Pay Ref:</strong> {paymentNote}</div>}
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                      Complete Payment
                    </h3>
                    <p style={{ fontSize: '12.5px', color: theme.textSecondary, margin: '0.2rem 0 0 0' }}>
                      Total Due: ₹{total} • <strong style={{ color: theme.activeBg }}>{orderType === 'dine_in' ? `Dine In (${tableNumber})` : 'Takeaway'}</strong>
                    </p>
                    <p style={{ fontSize: '11.5px', color: theme.textSecondary, margin: '0.15rem 0 0 0' }}>
                      Customer: <strong style={{ color: theme.textPrimary }}>{customerName}</strong> {customerPhone ? `(${customerPhone})` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    style={{ background: 'none', border: 'none', color: theme.textPrimary, cursor: 'pointer' }}
                  >
                    <CloseRoundedIcon sx={{ fontSize: 20 }} />
                  </button>
                </div>

                {/* Payment Method Selector */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem', marginBottom: '1.5rem' }}>
                  {[
                    { id: 'upi', label: 'UPI / QR', icon: <QrCode2RoundedIcon sx={{ fontSize: 22 }} /> },
                    { id: 'cash', label: 'Cash', icon: <PaymentsRoundedIcon sx={{ fontSize: 22 }} /> },
                    { id: 'card', label: 'Card', icon: <CreditCardRoundedIcon sx={{ fontSize: 22 }} /> },
                  ].map((m) => {
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        style={{
                          padding: '0.85rem 0.5rem',
                          borderRadius: '0.75rem',
                          border: isSelected ? `1px solid ${theme.activeBg}` : `1px solid ${theme.border}`,
                          backgroundColor: isSelected ? theme.activeBg : theme.bgCardSubtle,
                          color: isSelected ? theme.activeText : theme.textPrimary,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.45rem',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: 700,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {m.icon}
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {paymentMethod === 'upi' && (
                  <div style={{
                    padding: '1.25rem',
                    backgroundColor: theme.bgCardSubtle,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '0.85rem',
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                  }}>
                    <div style={{
                      width: '120px',
                      height: '120px',
                      backgroundColor: '#FFFFFF',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '0.5rem',
                      margin: '0 auto 0.85rem auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <QrCode2RoundedIcon sx={{ fontSize: 100, color: '#000000' }} />
                    </div>
                    <span style={{ fontSize: '12.5px', color: theme.textSecondary }}>
                      Scan dynamic UPI QR code on customer display
                    </span>
                  </div>
                )}

                {paymentMethod === 'cash' && (
                  <div style={{
                    padding: '1.25rem',
                    backgroundColor: theme.bgCardSubtle,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '0.85rem',
                    marginBottom: '1.5rem',
                  }}>
                    <div style={{ fontSize: '13px', color: theme.textSecondary, marginBottom: '0.5rem' }}>
                      Cash Received:
                    </div>
                    <input
                      type="number"
                      defaultValue={total}
                      style={{
                        width: '100%',
                        height: '42px',
                        backgroundColor: theme.bgCard,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '0.55rem',
                        padding: '0 0.85rem',
                        color: theme.textPrimary,
                        fontSize: '18px',
                        fontWeight: 800,
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div style={{
                    padding: '1.25rem',
                    backgroundColor: theme.bgCardSubtle,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '0.85rem',
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                    color: theme.textSecondary,
                    fontSize: '13px',
                  }}>
                    Insert or tap debit/credit card on EDC terminal.
                  </div>
                )}

                {/* Notes in Payment Modal */}
                <div style={{
                  marginBottom: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}>
                  {saleNote && (
                    <div style={{
                      padding: '0.55rem 0.75rem',
                      backgroundColor: theme.bgCardSubtle,
                      borderRadius: '0.55rem',
                      border: `1px solid ${theme.border}`,
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}>
                      <span style={{ color: theme.textSecondary, fontWeight: 700 }}>Sale Note:</span>
                      <span style={{ color: theme.textPrimary }}>{saleNote}</span>
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: theme.textSecondary }}>
                        Payment Note / Reference:
                      </label>
                      {paymentNote && (
                        <button
                          type="button"
                          onClick={() => setPaymentNote('')}
                          style={{ background: 'none', border: 'none', color: theme.textMuted, fontSize: '11px', cursor: 'pointer' }}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. UPI txn ref, Cheque #, Split info..."
                      value={paymentNote}
                      onChange={(e) => setPaymentNote(e.target.value)}
                      style={{
                        width: '100%',
                        height: '38px',
                        backgroundColor: theme.bgCard,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '0.55rem',
                        padding: '0 0.75rem',
                        color: theme.textPrimary,
                        fontSize: '13px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Submit Payment Button */}
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  className="button-20"
                  style={{
                    width: '100%',
                    height: '46px',
                    borderRadius: '0.75rem',
                    backgroundColor: theme.posBtnBg,
                    color: theme.posBtnText,
                    fontSize: '14.5px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Confirm & Complete Order
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* END SHIFT MODAL */}
      {showEndShiftModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '420px',
            backgroundColor: theme.popoverBg,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            padding: '1.75rem',
            boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                End Current Shift
              </h3>
              <button
                type="button"
                onClick={() => setShowEndShiftModal(false)}
                style={{ background: 'none', border: 'none', color: theme.textPrimary, cursor: 'pointer' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: theme.bgCardSubtle, borderRadius: '0.65rem', border: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '13px', color: theme.textSecondary }}>Cashier</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: theme.textPrimary }}>Amit Patel</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: theme.bgCardSubtle, borderRadius: '0.65rem', border: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '13px', color: theme.textSecondary }}>Expected Drawer Cash</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: theme.textPrimary }}>₹28,450</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: theme.bgCardSubtle, borderRadius: '0.65rem', border: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '13px', color: theme.textSecondary }}>Total Sales in Shift</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#22C55E' }}>₹48,250</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  alert('Shift reconciled successfully. Printing Z-Report...');
                  router.push('/pos-login');
                }}
                className="button-20"
                style={{
                  flex: 1,
                  height: '42px',
                  borderRadius: '0.75rem',
                  backgroundColor: theme.posBtnBg,
                  color: theme.posBtnText,
                  fontSize: '13px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Reconcile & Close Shift
              </button>
              <button
                type="button"
                onClick={() => setShowEndShiftModal(false)}
                style={{
                  padding: '0 1rem',
                  height: '42px',
                  borderRadius: '0.75rem',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.bgCardSubtle,
                  color: theme.textPrimary,
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ITEM EDITOR MODAL */}
      {editingItem && (
        <div
          onClick={() => setEditingItem(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 140,
            padding: '1.25rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '450px',
              backgroundColor: theme.popoverBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '1.25rem',
              padding: '1.5rem',
              boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxSizing: 'border-box',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  position: 'relative',
                  width: '46px',
                  height: '46px',
                  borderRadius: '0.65rem',
                  overflow: 'hidden',
                  flexShrink: 0,
                  backgroundColor: theme.bgCardSubtle,
                }}>
                  <Image
                    src={editingItem.product.image}
                    alt={editingItem.product.name}
                    fill
                    unoptimized
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                    {editingItem.product.name}
                  </h3>
                  <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '2px' }}>
                    {editingItem.product.variant} • Base Price: ₹{editingItem.product.price}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.textSecondary,
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '0.45rem',
                }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            {/* Price & Quantity Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {/* Unit Price */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: theme.textSecondary }}>
                    Unit Price (₹)
                  </label>
                  {itemFormPrice !== editingItem.product.price && (
                    <button
                      type="button"
                      onClick={() => setItemFormPrice(editingItem.product.price)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: theme.activeBg,
                        fontSize: '11px',
                        cursor: 'pointer',
                        padding: 0,
                        textDecoration: 'underline',
                      }}
                    >
                      Reset
                    </button>
                  )}
                </div>
                <input
                  type="number"
                  min="0"
                  value={itemFormPrice}
                  onChange={(e) => setItemFormPrice(Math.max(0, Number(e.target.value) || 0))}
                  style={{
                    height: '38px',
                    borderRadius: '0.55rem',
                    border: itemFormPrice !== editingItem.product.price ? `1.5px solid ${theme.activeBg}` : `1px solid ${theme.border}`,
                    backgroundColor: theme.bgCard,
                    color: theme.textPrimary,
                    fontSize: '14px',
                    fontWeight: 700,
                    padding: '0 0.75rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Quantity Stepper */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: theme.textSecondary }}>
                  Quantity
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '38px',
                  borderRadius: '0.55rem',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.bgCard,
                  padding: '2px',
                  boxSizing: 'border-box',
                }}>
                  <button
                    type="button"
                    onClick={() => setItemFormQuantity((q) => Math.max(1, q - 1))}
                    style={{
                      flex: 1,
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'none',
                      border: 'none',
                      color: theme.textPrimary,
                      cursor: 'pointer',
                    }}
                  >
                    <RemoveRoundedIcon sx={{ fontSize: 16 }} />
                  </button>
                  <span style={{
                    width: '32px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: theme.textPrimary,
                  }}>
                    {itemFormQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setItemFormQuantity((q) => q + 1)}
                    style={{
                      flex: 1,
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'none',
                      border: 'none',
                      color: theme.textPrimary,
                      cursor: 'pointer',
                    }}
                  >
                    <AddRoundedIcon sx={{ fontSize: 16 }} />
                  </button>
                </div>
              </div>
            </div>

            {/* Item Discount Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: theme.textSecondary }}>
                  Item Discount
                </label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setItemFormDiscountType('pct');
                      setItemFormDiscountVal(0);
                    }}
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '4px',
                      border: itemFormDiscountType === 'pct' ? `1px solid ${theme.activeBg}` : `1px solid ${theme.border}`,
                      backgroundColor: itemFormDiscountType === 'pct' ? theme.activeBg : 'transparent',
                      color: itemFormDiscountType === 'pct' ? theme.activeText : theme.textSecondary,
                      cursor: 'pointer',
                    }}
                  >
                    %
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setItemFormDiscountType('fixed');
                      setItemFormDiscountVal(0);
                    }}
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '4px',
                      border: itemFormDiscountType === 'fixed' ? `1px solid ${theme.activeBg}` : `1px solid ${theme.border}`,
                      backgroundColor: itemFormDiscountType === 'fixed' ? theme.activeBg : 'transparent',
                      color: itemFormDiscountType === 'fixed' ? theme.activeText : theme.textSecondary,
                      cursor: 'pointer',
                    }}
                  >
                    ₹
                  </button>
                </div>
              </div>

              {/* Quick % chips if percentage */}
              {itemFormDiscountType === 'pct' ? (
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {[0, 5, 10, 15, 20, 25].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setItemFormDiscountVal(pct)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '0.45rem',
                        border: itemFormDiscountVal === pct ? `1px solid ${theme.activeBg}` : `1px solid ${theme.border}`,
                        backgroundColor: itemFormDiscountVal === pct ? theme.activeBg : theme.bgCard,
                        color: itemFormDiscountVal === pct ? theme.activeText : theme.textPrimary,
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {pct === 0 ? 'None' : `${pct}%`}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="number"
                  min="0"
                  placeholder="Discount in ₹"
                  value={itemFormDiscountVal || ''}
                  onChange={(e) => setItemFormDiscountVal(Math.max(0, Number(e.target.value) || 0))}
                  style={{
                    height: '38px',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgCard,
                    color: theme.textPrimary,
                    fontSize: '14px',
                    fontWeight: 700,
                    padding: '0 0.75rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              )}
            </div>

            {/* Item Note / Custom Instructions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: theme.textSecondary }}>
                Item Note / Special Instructions
              </label>
              <input
                type="text"
                placeholder="e.g. Less spicy, No onion, Extra sauce..."
                value={itemFormNote}
                onChange={(e) => setItemFormNote(e.target.value)}
                style={{
                  height: '38px',
                  borderRadius: '0.55rem',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.bgCard,
                  color: theme.textPrimary,
                  fontSize: '13px',
                  padding: '0 0.75rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
              {/* Quick note suggestions */}
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {['No onion', 'Less spicy', 'Extra cheese', 'Extra sauce', 'Pack separately', 'Hot'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setItemFormNote((prev) => (prev ? `${prev}, ${preset}` : preset));
                    }}
                    style={{
                      padding: '2px 7px',
                      borderRadius: '9999px',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgCardSubtle,
                      color: theme.textSecondary,
                      fontSize: '10.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    +{preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Line Total Preview */}
            {(() => {
              const gross = itemFormPrice * itemFormQuantity;
              const disc = itemFormDiscountType === 'pct'
                ? Math.round((gross * itemFormDiscountVal) / 100)
                : itemFormDiscountVal;
              const net = Math.max(0, gross - disc);

              return (
                <div style={{
                  padding: '0.65rem 0.85rem',
                  backgroundColor: theme.bgCardSubtle,
                  borderRadius: '0.65rem',
                  border: `1px solid ${theme.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{ fontSize: '12px', color: theme.textSecondary }}>
                    <span>₹{itemFormPrice} × {itemFormQuantity}</span>
                    {disc > 0 && <span style={{ color: '#22C55E' }}> - ₹{disc} discount</span>}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary }}>
                    ₹{net}
                  </div>
                </div>
              );
            })()}

            {/* Footer Buttons */}
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => {
                  removeFromCart(editingItem.product.id);
                  setEditingItem(null);
                }}
                style={{
                  padding: '0 0.85rem',
                  height: '42px',
                  borderRadius: '0.65rem',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: 'transparent',
                  color: '#EF4444',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
              <button
                type="button"
                onClick={saveItemEditor}
                className="button-20"
                style={{
                  flex: 1,
                  height: '42px',
                  borderRadius: '0.65rem',
                  backgroundColor: theme.posBtnBg,
                  color: theme.posBtnText,
                  fontSize: '13.5px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SALE NOTE MODAL */}
      {showSaleNoteModal && (
        <div
          onClick={() => setShowSaleNoteModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 140,
            padding: '1.25rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: theme.popoverBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '1.25rem',
              padding: '1.5rem',
              boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <NoteAltRoundedIcon sx={{ fontSize: 20, color: theme.activeBg }} />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Order / Sale Note
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSaleNoteModal(false)}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '-0.3rem 0 0 0' }}>
              Add special instructions for kitchen preparation, packing, or customer receipt.
            </p>

            {/* Quick preset chips */}
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {['Takeaway Order', 'Urgent / Priority', 'Pack Cutlery', 'Allergy Alert', 'Customer Self-Pickup', 'Gift Packaging'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setSaleNote((prev) => (prev ? `${prev}, ${chip}` : chip));
                  }}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgCardSubtle,
                    color: theme.textSecondary,
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  +{chip}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="Type order or sale note here..."
              value={saleNote}
              onChange={(e) => setSaleNote(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: theme.bgCard,
                border: `1px solid ${theme.border}`,
                borderRadius: '0.65rem',
                padding: '0.65rem 0.75rem',
                color: theme.textPrimary,
                fontSize: '13px',
                fontFamily: 'inherit',
                resize: 'none',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              {saleNote && (
                <button
                  type="button"
                  onClick={() => {
                    setSaleNote('');
                    setShowSaleNoteModal(false);
                  }}
                  style={{
                    padding: '0 0.85rem',
                    height: '40px',
                    borderRadius: '0.65rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: 'transparent',
                    color: '#EF4444',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowSaleNoteModal(false)}
                className="button-20"
                style={{
                  flex: 1,
                  height: '40px',
                  borderRadius: '0.65rem',
                  backgroundColor: theme.posBtnBg,
                  color: theme.posBtnText,
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT NOTE MODAL */}
      {showPaymentNoteModal && (
        <div
          onClick={() => setShowPaymentNoteModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 140,
            padding: '1.25rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: theme.popoverBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '1.25rem',
              padding: '1.5rem',
              boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <PaymentsRoundedIcon sx={{ fontSize: 20, color: theme.activeBg }} />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Payment Note / Reference
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentNoteModal(false)}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '-0.3rem 0 0 0' }}>
              Record transaction ID, UPI reference, cheque number, or staff payment approval.
            </p>

            {/* Quick preset chips */}
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {['UPI Ref: ', 'Split: 50% Cash / 50% UPI', 'Cheque #', 'Manager Approved', 'Pending Confirmation', 'Card Last 4: '].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setPaymentNote((prev) => (prev ? `${prev} | ${chip}` : chip));
                  }}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgCardSubtle,
                    color: theme.textSecondary,
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  +{chip}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="e.g. GPay UPI Ref #892019, Cheque 40291..."
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: theme.bgCard,
                border: `1px solid ${theme.border}`,
                borderRadius: '0.65rem',
                padding: '0.65rem 0.75rem',
                color: theme.textPrimary,
                fontSize: '13px',
                fontFamily: 'inherit',
                resize: 'none',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              {paymentNote && (
                <button
                  type="button"
                  onClick={() => {
                    setPaymentNote('');
                    setShowPaymentNoteModal(false);
                  }}
                  style={{
                    padding: '0 0.85rem',
                    height: '40px',
                    borderRadius: '0.65rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: 'transparent',
                    color: '#EF4444',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowPaymentNoteModal(false)}
                className="button-20"
                style={{
                  flex: 1,
                  height: '40px',
                  borderRadius: '0.65rem',
                  backgroundColor: theme.posBtnBg,
                  color: theme.posBtnText,
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
