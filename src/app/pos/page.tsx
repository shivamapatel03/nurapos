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
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';
import SellRoundedIcon from '@mui/icons-material/SellRounded';
import PriceChangeRoundedIcon from '@mui/icons-material/PriceChangeRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';

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
}

type PosThemeId = 'macos' | 'bw_dark' | 'bw_light' | 'blue_white' | 'classic_pos';

interface PosThemeConfig {
  id: PosThemeId;
  name: string;
  emoji: string;
  swatch: {
    page: string;
    sidebar: string;
    card: string;
    primary: string;
    text: string;
  };
  bgPage: string;
  bgSidebar: string;
  sidebarIsDark: boolean;
  sidebarTextPrimary: string;
  sidebarTextSecondary: string;
  sidebarHoverBg: string;
  sidebarBorder: string;
  bgHeader: string;
  headerIsDark: boolean;
  headerTextPrimary: string;
  headerBorder: string;
  bgCard: string;
  bgCardSubtle: string;
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
  secondaryBadgeBg: string;
  secondaryBadgeText: string;
  posBtnBg: string;
  posBtnText: string;
  posBtnShadow: string;
  popoverBg: string;
  popoverBorder: string;
}

const POS_THEMES: Record<PosThemeId, PosThemeConfig> = {
  macos: {
    id: 'macos',
    name: 'macOS',
    emoji: '🍎',
    swatch: {
      page: '#F5F5F7',
      sidebar: '#FFFFFF',
      card: '#FFFFFF',
      primary: '#007AFF',
      text: '#1D1D1F',
    },
    bgPage: '#F5F5F7',
    bgSidebar: '#FFFFFF',
    sidebarIsDark: false,
    sidebarTextPrimary: '#1D1D1F',
    sidebarTextSecondary: '#86868B',
    sidebarHoverBg: '#F2F2F7',
    sidebarBorder: '#E5E5EA',
    bgHeader: '#FFFFFF',
    headerIsDark: false,
    headerTextPrimary: '#1D1D1F',
    headerBorder: '#E5E5EA',
    bgCard: '#FFFFFF',
    bgCardSubtle: '#F2F2F7',
    border: '#E5E5EA',
    borderCard: '#E5E5EA',
    borderHover: '#007AFF',
    textPrimary: '#1D1D1F',
    textSecondary: '#86868B',
    textMuted: '#AEAEB2',
    hoverBg: '#EFEFF4',
    activeBg: '#007AFF',
    activeText: '#FFFFFF',
    activeIcon: '#FFFFFF',
    badgeBg: '#007AFF',
    badgeText: '#FFFFFF',
    secondaryBadgeBg: '#E5E5EA',
    secondaryBadgeText: '#1D1D1F',
    posBtnBg: '#007AFF',
    posBtnText: '#FFFFFF',
    posBtnShadow: '#0051A8',
    popoverBg: '#FFFFFF',
    popoverBorder: '#E5E5EA',
  },
  bw_dark: {
    id: 'bw_dark',
    name: 'B&W Dark',
    emoji: '🌚',
    swatch: {
      page: '#000000',
      sidebar: '#0A0A0A',
      card: '#141414',
      primary: '#FFFFFF',
      text: '#FFFFFF',
    },
    bgPage: '#000000',
    bgSidebar: '#0A0A0A',
    sidebarIsDark: true,
    sidebarTextPrimary: '#FFFFFF',
    sidebarTextSecondary: '#A1A1AA',
    sidebarHoverBg: '#18181B',
    sidebarBorder: '#262626',
    bgHeader: '#0A0A0A',
    headerIsDark: true,
    headerTextPrimary: '#FFFFFF',
    headerBorder: '#262626',
    bgCard: '#141414',
    bgCardSubtle: '#1C1C1E',
    border: '#262626',
    borderCard: '#262626',
    borderHover: '#FFFFFF',
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    hoverBg: '#1F1F23',
    activeBg: '#FFFFFF',
    activeText: '#000000',
    activeIcon: '#000000',
    badgeBg: '#FFFFFF',
    badgeText: '#000000',
    secondaryBadgeBg: '#262626',
    secondaryBadgeText: '#FFFFFF',
    posBtnBg: '#FFFFFF',
    posBtnText: '#000000',
    posBtnShadow: '#888888',
    popoverBg: '#141414',
    popoverBorder: '#262626',
  },
  bw_light: {
    id: 'bw_light',
    name: 'B&W Light',
    emoji: '⚪',
    swatch: {
      page: '#FFFFFF',
      sidebar: '#F5F5F5',
      card: '#FAFAFA',
      primary: '#000000',
      text: '#111111',
    },
    bgPage: '#FFFFFF',
    bgSidebar: '#F5F5F5',
    sidebarIsDark: false,
    sidebarTextPrimary: '#111111',
    sidebarTextSecondary: '#666666',
    sidebarHoverBg: '#EAEAEA',
    sidebarBorder: '#E0E0E0',
    bgHeader: '#FFFFFF',
    headerIsDark: false,
    headerTextPrimary: '#111111',
    headerBorder: '#E0E0E0',
    bgCard: '#FAFAFA',
    bgCardSubtle: '#F0F0F0',
    border: '#E0E0E0',
    borderCard: '#E0E0E0',
    borderHover: '#000000',
    textPrimary: '#111111',
    textSecondary: '#666666',
    textMuted: '#999999',
    hoverBg: '#EAEAEA',
    activeBg: '#000000',
    activeText: '#FFFFFF',
    activeIcon: '#FFFFFF',
    badgeBg: '#000000',
    badgeText: '#FFFFFF',
    secondaryBadgeBg: '#E0E0E0',
    secondaryBadgeText: '#111111',
    posBtnBg: '#000000',
    posBtnText: '#FFFFFF',
    posBtnShadow: '#444444',
    popoverBg: '#FFFFFF',
    popoverBorder: '#E0E0E0',
  },
  blue_white: {
    id: 'blue_white',
    name: 'Blue & White',
    emoji: '🔵',
    swatch: {
      page: '#F4F8FC',
      sidebar: '#FFFFFF',
      card: '#FFFFFF',
      primary: '#2563EB',
      text: '#111827',
    },
    bgPage: '#F4F8FC',
    bgSidebar: '#FFFFFF',
    sidebarIsDark: false,
    sidebarTextPrimary: '#111827',
    sidebarTextSecondary: '#4B5563',
    sidebarHoverBg: '#F0F7FF',
    sidebarBorder: '#DBEAFE',
    bgHeader: '#FFFFFF',
    headerIsDark: false,
    headerTextPrimary: '#111827',
    headerBorder: '#DBEAFE',
    bgCard: '#FFFFFF',
    bgCardSubtle: '#EFF6FF',
    border: '#DBEAFE',
    borderCard: '#DBEAFE',
    borderHover: '#2563EB',
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#9CA3AF',
    hoverBg: '#F0F7FF',
    activeBg: '#2563EB',
    activeText: '#FFFFFF',
    activeIcon: '#FFFFFF',
    badgeBg: '#2563EB',
    badgeText: '#FFFFFF',
    secondaryBadgeBg: '#DBEAFE',
    secondaryBadgeText: '#1E40AF',
    posBtnBg: '#2563EB',
    posBtnText: '#FFFFFF',
    posBtnShadow: '#1D4ED8',
    popoverBg: '#FFFFFF',
    popoverBorder: '#DBEAFE',
  },
  classic_pos: {
    id: 'classic_pos',
    name: 'Classic POS',
    emoji: '📋',
    swatch: {
      page: '#F3F4F6',
      sidebar: '#1F2937',
      card: '#FFFFFF',
      primary: '#2563EB',
      text: '#111827',
    },
    bgPage: '#F3F4F6',
    bgSidebar: '#1F2937',
    sidebarIsDark: true,
    sidebarTextPrimary: '#F9FAFB',
    sidebarTextSecondary: '#9CA3AF',
    sidebarHoverBg: '#374151',
    sidebarBorder: '#374151',
    bgHeader: '#FFFFFF',
    headerIsDark: false,
    headerTextPrimary: '#111827',
    headerBorder: '#E5E7EB',
    bgCard: '#FFFFFF',
    bgCardSubtle: '#F9FAFB',
    border: '#E5E7EB',
    borderCard: '#E5E7EB',
    borderHover: '#2563EB',
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#9CA3AF',
    hoverBg: '#F3F4F6',
    activeBg: '#2563EB',
    activeText: '#FFFFFF',
    activeIcon: '#FFFFFF',
    badgeBg: '#2563EB',
    badgeText: '#FFFFFF',
    secondaryBadgeBg: '#E5E7EB',
    secondaryBadgeText: '#1F2937',
    posBtnBg: '#2563EB',
    posBtnText: '#FFFFFF',
    posBtnShadow: '#1D4ED8',
    popoverBg: '#FFFFFF',
    popoverBorder: '#E5E7EB',
  },
};

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

  // Customer state
  const [customerName, setCustomerName] = useState('Guest Customer');
  const [discountPct, setDiscountPct] = useState(0);

  // Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('upi');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showEndShiftModal, setShowEndShiftModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
    };
    setHeldSales((prev) => [newHold, ...prev]);
    setCart([]);
    setSaleNote('');
    setPaymentNote('');
  };

  const restoreHeldSale = (hold: HeldSale) => {
    setCart(hold.items);
    if (hold.saleNote) setSaleNote(hold.saleNote);
    if (hold.paymentNote) setPaymentNote(hold.paymentNote);
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
    }, 1600);
  };

  // POS Dynamic Theme State: 'macos' | 'bw_dark' | 'bw_light' | 'blue_white' | 'classic_pos'
  const [currentThemeId, setCurrentThemeId] = useState<PosThemeId>('macos');
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setShowThemeDropdown(false);
      }
    }
    if (showThemeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showThemeDropdown]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nuradesk_pos_theme') as PosThemeId | null;
      if (saved && POS_THEMES[saved]) {
        setCurrentThemeId(saved);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleSelectTheme = (id: PosThemeId) => {
    setCurrentThemeId(id);
    try {
      localStorage.setItem('nuradesk_pos_theme', id);
    } catch {
      // Ignore localStorage errors
    }
  };

  const theme = POS_THEMES[currentThemeId] || POS_THEMES.macos;

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

          {/* Amit Patel Profile Dropdown */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setShowProfileMenu((prev) => !prev)}
              role="button"
              tabIndex={0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '0.55rem',
                border: 'none',
                backgroundColor: 'transparent',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.hoverBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
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
                AP
              </div>
              <span style={{
                fontSize: '13.5px',
                fontWeight: 700,
                color: theme.headerTextPrimary,
                letterSpacing: '-0.01em',
              }}>
                Amit Patel
              </span>
              <KeyboardArrowDownRoundedIcon sx={{ fontSize: 16, color: theme.headerTextPrimary }} />
            </div>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div style={{
                position: 'absolute',
                top: '44px',
                right: 0,
                width: '220px',
                backgroundColor: theme.popoverBg,
                border: `1px solid ${theme.popoverBorder}`,
                borderRadius: '0.85rem',
                boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
                padding: '0.65rem',
                zIndex: 50,
              }}>
                <div style={{ padding: '0.4rem 0.55rem', borderBottom: `1px solid ${theme.border}`, marginBottom: '0.45rem' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: theme.textPrimary }}>Amit Patel</div>
                  <div style={{ fontSize: '11px', color: theme.textSecondary }}>Cashier #01 • Shift Active</div>
                </div>
                <Link
                  href="/manager"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.55rem',
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
                  <span>Manager Dashboard</span>
                </Link>
                <Link
                  href="/dashboard"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.55rem',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: theme.textPrimary,
                    borderRadius: '0.45rem',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.hoverBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <GridViewRoundedIcon sx={{ fontSize: 16, color: theme.textPrimary }} />
                  <span>Admin Dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowEndShiftModal(true);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.55rem',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: theme.textPrimary,
                    borderRadius: '0.45rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.hoverBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <ScheduleRoundedIcon sx={{ fontSize: 16, color: theme.textPrimary }} />
                  <span>End Shift</span>
                </button>
              </div>
            )}
          </div>
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
                border: activeNav === 'new_sale' ? `1px solid ${theme.activeBg}` : '1px solid transparent',
                backgroundColor: activeNav === 'new_sale' ? theme.activeBg : 'transparent',
                color: activeNav === 'new_sale' ? theme.activeText : theme.sidebarTextPrimary,
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
                border: activeNav === 'held_sales' ? `1px solid ${theme.activeBg}` : '1px solid transparent',
                backgroundColor: activeNav === 'held_sales' ? theme.activeBg : 'transparent',
                color: activeNav === 'held_sales' ? theme.activeText : theme.sidebarTextPrimary,
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
                    backgroundColor: activeNav === 'held_sales' ? '#FFFFFF' : theme.activeBg,
                  }} />
                )}
              </div>
              {isSidebarOpen && heldSales.length > 0 && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: activeNav === 'held_sales' ? 'rgba(255,255,255,0.25)' : theme.secondaryBadgeBg,
                  color: activeNav === 'held_sales' ? '#FFFFFF' : theme.secondaryBadgeText,
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
                border: activeNav === 'invoices' ? `1px solid ${theme.activeBg}` : '1px solid transparent',
                backgroundColor: activeNav === 'invoices' ? theme.activeBg : 'transparent',
                color: activeNav === 'invoices' ? theme.activeText : theme.sidebarTextPrimary,
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
                border: activeNav === 'customers' ? `1px solid ${theme.activeBg}` : '1px solid transparent',
                backgroundColor: activeNav === 'customers' ? theme.activeBg : 'transparent',
                color: activeNav === 'customers' ? theme.activeText : theme.sidebarTextPrimary,
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

            {/* Theme switcher button & upward dropdown - LAST IN SIDEBAR */}
            <div ref={themeDropdownRef} style={{ position: 'relative', width: '100%' }}>
              {/* Upward Dropdown Menu */}
              {showThemeDropdown && (
                <>
                  <style>{`
                    @keyframes posThemeSlideUp {
                      0% {
                        opacity: 0;
                        transform: translateY(14px);
                      }
                      100% {
                        opacity: 1;
                        transform: translateY(0);
                      }
                    }
                  `}</style>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 'calc(100% + 8px)',
                      left: 0,
                      width: isSidebarOpen ? '100%' : '190px',
                      minWidth: isSidebarOpen ? undefined : '190px',
                      backgroundColor: theme.popoverBg,
                      border: `1px solid ${theme.popoverBorder}`,
                      borderRadius: '0.85rem',
                      boxShadow: '0 16px 40px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.1)',
                      padding: '0.45rem',
                      zIndex: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                      boxSizing: 'border-box',
                      animation: 'posThemeSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                      transformOrigin: 'bottom center',
                    }}
                  >
                    {/* Header */}
                    <div style={{
                      padding: '0.35rem 0.6rem 0.4rem',
                      borderBottom: `1px solid ${theme.border}`,
                      marginBottom: '0.2rem',
                    }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: theme.textSecondary,
                      }}>
                        Select Theme
                      </span>
                    </div>

                    {/* 5 Themes List */}
                    {(Object.keys(POS_THEMES) as PosThemeId[]).map((tid) => {
                      const t = POS_THEMES[tid];
                      const isCurrent = currentThemeId === tid;

                      return (
                        <button
                          key={tid}
                          type="button"
                          onClick={() => {
                            handleSelectTheme(tid);
                            setShowThemeDropdown(false);
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.55rem 0.75rem',
                            borderRadius: '0.55rem',
                            border: isCurrent ? `1px solid ${theme.borderHover}` : '1px solid transparent',
                            backgroundColor: isCurrent ? theme.sidebarHoverBg : 'transparent',
                            color: isCurrent ? theme.activeBg : theme.textPrimary,
                            fontSize: '13.5px',
                            fontWeight: isCurrent ? 800 : 500,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            textAlign: 'left',
                            transition: 'all 0.12s ease',
                            boxSizing: 'border-box',
                          }}
                          onMouseEnter={(e) => {
                            if (!isCurrent) e.currentTarget.style.backgroundColor = theme.hoverBg;
                          }}
                          onMouseLeave={(e) => {
                            if (!isCurrent) e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <span style={{ whiteSpace: 'nowrap' }}>{t.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Theme Trigger Button */}
              <button
                type="button"
                onClick={() => setShowThemeDropdown((prev) => !prev)}
                title={!isSidebarOpen ? `Theme: ${theme.name}` : undefined}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                  padding: isSidebarOpen ? '0.65rem 0.9rem' : '0.65rem 0',
                  borderRadius: '0.65rem',
                  border: showThemeDropdown ? `1px solid ${theme.borderHover}` : 'none',
                  backgroundColor: showThemeDropdown ? theme.sidebarHoverBg : 'transparent',
                  color: theme.sidebarTextPrimary,
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.sidebarHoverBg; }}
                onMouseLeave={(e) => {
                  if (!showThemeDropdown) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <PaletteRoundedIcon sx={{ fontSize: 18, color: 'inherit', flexShrink: 0 }} />
                {isSidebarOpen && (
                  <span style={{ marginLeft: '0.65rem', whiteSpace: 'nowrap' }}>Theme</span>
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
                      <div style={{ fontSize: '15px', fontWeight: 800, color: theme.textPrimary }}>
                        {h.id} • {h.items.length} items
                      </div>
                      <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '0.2rem' }}>
                        Held {h.time} • Total: ₹{h.total}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => restoreHeldSale(h)}
                      className="button-20-3d"
                      style={{
                        padding: '0.5rem 1.1rem',
                        fontSize: '13px',
                        fontWeight: 700,
                        backgroundColor: theme.activeBg,
                        color: theme.activeText,
                        borderRadius: '0.65rem',
                        cursor: 'pointer',
                        boxShadow: `0 3px 0 #18181B`,
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
          <div style={{
            padding: '1.1rem 1.25rem',
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{
                fontSize: '17px',
                fontWeight: 800,
                color: theme.textPrimary,
                letterSpacing: '-0.02em',
                margin: 0,
              }}>
                Current Sale
              </h2>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                backgroundColor: theme.bgCardSubtle,
                border: `1px solid ${theme.border}`,
                color: theme.textSecondary,
                padding: '2px 7px',
                borderRadius: '9999px',
              }}>
                #ORD-1025
              </span>
            </div>

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
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  borderRadius: '0.45rem',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = theme.textPrimary; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = theme.textMuted; }}
              >
                <DeleteOutlineRoundedIcon sx={{ fontSize: 19 }} />
              </button>
            )}
          </div>

          {/* Customer Quick Selector */}
          <div style={{
            padding: '0.65rem 1.25rem',
            backgroundColor: theme.bgCardSubtle,
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '12px', color: theme.textSecondary }}>Customer:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: theme.textPrimary }}>{customerName}</span>
              <button
                type="button"
                onClick={() => {
                  const name = prompt('Enter customer name or phone:', customerName);
                  if (name) setCustomerName(name);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.textSecondary,
                  cursor: 'pointer',
                  fontSize: '11px',
                  textDecoration: 'underline',
                }}
              >
                edit
              </button>
            </div>
          </div>

          {/* Quick Notes Bar: Sale Note & Payment Note */}
          <div style={{
            padding: '0.45rem 1.25rem',
            backgroundColor: theme.bgCard,
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            {/* Sale Note Pill Button */}
            <button
              type="button"
              onClick={() => setShowSaleNoteModal(true)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.65rem',
                borderRadius: '0.5rem',
                border: saleNote ? `1px solid ${theme.activeBg}` : `1px dashed ${theme.border}`,
                backgroundColor: saleNote ? theme.bgCardSubtle : 'transparent',
                color: saleNote ? theme.activeBg : theme.textSecondary,
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
              title={saleNote ? `Sale Note: ${saleNote}` : 'Add Sale Note'}
            >
              <NoteAltRoundedIcon sx={{ fontSize: 14, flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {saleNote ? `Note: ${saleNote}` : '+ Sale Note'}
              </span>
            </button>

            {/* Payment Note Pill Button */}
            <button
              type="button"
              onClick={() => setShowPaymentNoteModal(true)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.65rem',
                borderRadius: '0.5rem',
                border: paymentNote ? `1px solid ${theme.activeBg}` : `1px dashed ${theme.border}`,
                backgroundColor: paymentNote ? theme.bgCardSubtle : 'transparent',
                color: paymentNote ? theme.activeBg : theme.textSecondary,
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
              title={paymentNote ? `Payment Note: ${paymentNote}` : 'Add Payment Note'}
            >
              <PaymentsRoundedIcon sx={{ fontSize: 14, flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {paymentNote ? `Pay: ${paymentNote}` : '+ Pay Note'}
              </span>
            </button>
          </div>

          {/* Cart Items List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
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
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.75rem',
                      backgroundColor: theme.bgCardSubtle,
                      borderRadius: '0.65rem',
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

          {/* Ticket Summary & Checkout Footer */}
          <div style={{
            padding: '1.1rem 1.25rem',
            backgroundColor: theme.bgCard,
            borderTop: `1px solid ${theme.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}>
            {/* Subtotal, Tax, Discount */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: theme.textSecondary }}>
                <span>Subtotal</span>
                <span style={{ color: theme.textPrimary, fontWeight: 600 }}>₹{subtotal}</span>
              </div>
              {discountPct > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#22C55E' }}>
                  <span>Discount ({discountPct}%)</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: theme.textSecondary }}>
                <span>Tax (GST 5%)</span>
                <span style={{ color: theme.textPrimary, fontWeight: 600 }}>₹{tax}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '18px',
                fontWeight: 800,
                color: theme.textPrimary,
                paddingTop: '0.45rem',
                borderTop: `1px solid ${theme.border}`,
                marginTop: '0.2rem',
              }}>
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* Action Buttons: Hold Sale + 10% Discount */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={handleHoldSale}
                style={{
                  flex: 1,
                  height: '36px',
                  borderRadius: '0.55rem',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.bgCardSubtle,
                  color: theme.textPrimary,
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: cart.length === 0 ? 0.45 : 1,
                  transition: 'all 0.15s ease',
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
                  height: '36px',
                  borderRadius: '0.55rem',
                  border: discountPct > 0 ? `1px solid ${theme.activeBg}` : `1px solid ${theme.border}`,
                  backgroundColor: discountPct > 0 ? theme.activeBg : theme.bgCardSubtle,
                  color: discountPct > 0 ? theme.activeText : theme.textPrimary,
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: cart.length === 0 ? 0.45 : 1,
                  transition: 'all 0.15s ease',
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
              className="button-20-3d"
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '0.75rem',
                backgroundColor: theme.posBtnBg,
                color: theme.posBtnText,
                fontSize: '15px',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                boxShadow: `0 4px 0 ${theme.posBtnShadow}`,
                cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                opacity: cart.length === 0 ? 0.45 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <span>Charge ₹{total}</span>
              <ArrowOutwardRoundedIcon sx={{ fontSize: 18 }} />
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
                {(saleNote || paymentNote) && (
                  <div style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    gap: '4px',
                    textAlign: 'left',
                    backgroundColor: theme.bgCardSubtle,
                    padding: '0.5rem 0.85rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    fontSize: '11.5px',
                    marginTop: '0.5rem',
                  }}>
                    {saleNote && <div><strong>Sale Note:</strong> {saleNote}</div>}
                    {paymentNote && <div><strong>Pay Ref:</strong> {paymentNote}</div>}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                      Complete Payment
                    </h3>
                    <p style={{ fontSize: '12.5px', color: theme.textSecondary, margin: '0.2rem 0 0 0' }}>
                      Total Due: ₹{total}
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
                  className="button-20-3d"
                  style={{
                    width: '100%',
                    height: '46px',
                    borderRadius: '0.75rem',
                    backgroundColor: theme.posBtnBg,
                    color: theme.posBtnText,
                    fontSize: '14.5px',
                    fontWeight: 800,
                    boxShadow: `0 4px 0 ${theme.posBtnShadow}`,
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
                className="button-20-3d"
                style={{
                  flex: 1,
                  height: '42px',
                  borderRadius: '0.75rem',
                  backgroundColor: theme.posBtnBg,
                  color: theme.posBtnText,
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: `0 4px 0 ${theme.posBtnShadow}`,
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
                className="button-20-3d"
                style={{
                  flex: 1,
                  height: '42px',
                  borderRadius: '0.65rem',
                  backgroundColor: theme.posBtnBg,
                  color: theme.posBtnText,
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: `0 4px 0 ${theme.posBtnShadow}`,
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
                className="button-20-3d"
                style={{
                  flex: 1,
                  height: '40px',
                  borderRadius: '0.65rem',
                  backgroundColor: theme.posBtnBg,
                  color: theme.posBtnText,
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: `0 4px 0 ${theme.posBtnShadow}`,
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
                className="button-20-3d"
                style={{
                  flex: 1,
                  height: '40px',
                  borderRadius: '0.65rem',
                  backgroundColor: theme.posBtnBg,
                  color: theme.posBtnText,
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: `0 4px 0 ${theme.posBtnShadow}`,
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
