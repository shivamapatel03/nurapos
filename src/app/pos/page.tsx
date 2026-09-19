'use client';

import React, { useState, useEffect } from 'react';
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
}

interface HeldSale {
  id: string;
  items: CartItem[];
  time: string;
  total: number;
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

  const clearCart = () => {
    setCart([]);
  };

  // Hold Sale
  const handleHoldSale = () => {
    if (cart.length === 0) return;
    const newHold: HeldSale = {
      id: `HELD-${Math.floor(100 + Math.random() * 900)}`,
      items: [...cart],
      time: 'Just now',
      total: calculateTotal(),
    };
    setHeldSales((prev) => [newHold, ...prev]);
    setCart([]);
  };

  const restoreHeldSale = (hold: HeldSale) => {
    setCart(hold.items);
    setHeldSales((prev) => prev.filter((h) => h.id !== hold.id));
    setActiveNav('new_sale');
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPct) / 100);
  const taxableAmount = subtotal - discountAmount;
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
    }, 1600);
  };

  return (
    <div style={{
      height: '100vh',
      maxHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: '#000000',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
      boxSizing: 'border-box',
    }}>
      {/* 1. TOP HEADER BAR */}
      <header style={{
        height: '62px',
        backgroundColor: '#000000',
        borderBottom: '1px solid #1F1F1F',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: 30,
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
              border: '1px solid #27272A',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#18181B';
              e.currentTarget.style.borderColor = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#27272A';
            }}
          >
            {isSidebarOpen ? (
              <MenuOpenRoundedIcon sx={{ fontSize: 21, color: '#FFFFFF' }} />
            ) : (
              <MenuRoundedIcon sx={{ fontSize: 21, color: '#FFFFFF' }} />
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
              backgroundColor: '#FFFFFF',
              padding: '2px',
              flexShrink: 0,
            }}>
              <Image
                src="/logo.png"
                alt="Nuradesk Logo"
                width={30}
                height={30}
                priority
                style={{ objectFit: 'contain' }}
              />
            </div>
            <span style={{
              fontSize: '21px',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: '#FFFFFF',
            }}>
              Nuradesk
            </span>
          </Link>

          {/* Store Logo Pill Badge (as in wireframe) */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: '#111113',
            border: '1px solid #27272A',
            borderRadius: '9999px',
            padding: '4px 12px',
            marginLeft: '0.25rem',
          }}>
            <StoreRoundedIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
              SP CAFE
            </span>
            <span style={{ fontSize: '11px', color: '#71717A' }}>•</span>
            <span style={{ fontSize: '11.5px', color: '#A1A1AA' }}>Ahmedabad</span>
          </div>
        </div>

        {/* Center: Live Time Digital Clock (as in wireframe) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#0A0A0A',
          border: '1px solid #242424',
          borderRadius: '0.65rem',
          padding: '5px 14px',
        }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#FFFFFF',
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
                padding: '4px 10px',
                borderRadius: '0.65rem',
                border: `1px solid ${showProfileMenu ? '#FFFFFF' : '#27272A'}`,
                backgroundColor: '#0A0A0A',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                color: '#000000',
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
                color: '#FFFFFF',
                letterSpacing: '-0.01em',
              }}>
                Amit Patel
              </span>
              <KeyboardArrowDownRoundedIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
            </div>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div style={{
                position: 'absolute',
                top: '44px',
                right: 0,
                width: '220px',
                backgroundColor: '#0A0A0A',
                border: '1px solid #2A2A2A',
                borderRadius: '0.85rem',
                boxShadow: '0 12px 36px rgba(0,0,0,0.85)',
                padding: '0.65rem',
                zIndex: 50,
              }}>
                <div style={{ padding: '0.4rem 0.55rem', borderBottom: '1px solid #1F1F1F', marginBottom: '0.45rem' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>Amit Patel</div>
                  <div style={{ fontSize: '11px', color: '#A1A1AA' }}>Cashier #01 • Shift Active</div>
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
                    color: '#FFFFFF',
                    borderRadius: '0.45rem',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#18181B'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <StoreRoundedIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
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
                    color: '#FFFFFF',
                    borderRadius: '0.45rem',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#18181B'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <GridViewRoundedIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
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
                    color: '#FFFFFF',
                    borderRadius: '0.45rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#18181B'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <ScheduleRoundedIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
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
          backgroundColor: '#000000',
          borderRight: '1px solid #1F1F1F',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: isSidebarOpen ? '1.25rem 0.75rem' : '1.25rem 0.5rem',
          flexShrink: 0,
          boxSizing: 'border-box',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1), padding 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowX: 'hidden',
          overflowY: 'auto',
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
                border: activeNav === 'new_sale' ? '1px solid #FFFFFF' : '1px solid transparent',
                backgroundColor: activeNav === 'new_sale' ? '#FFFFFF' : 'transparent',
                color: activeNav === 'new_sale' ? '#000000' : '#FFFFFF',
                fontSize: '14px',
                fontWeight: activeNav === 'new_sale' ? 800 : 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (activeNav !== 'new_sale') e.currentTarget.style.backgroundColor = '#18181B';
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
                border: activeNav === 'held_sales' ? '1px solid #FFFFFF' : '1px solid transparent',
                backgroundColor: activeNav === 'held_sales' ? '#FFFFFF' : 'transparent',
                color: activeNav === 'held_sales' ? '#000000' : '#FFFFFF',
                fontSize: '14px',
                fontWeight: activeNav === 'held_sales' ? 800 : 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (activeNav !== 'held_sales') e.currentTarget.style.backgroundColor = '#18181B';
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
                    backgroundColor: activeNav === 'held_sales' ? '#000000' : '#FFFFFF',
                  }} />
                )}
              </div>
              {isSidebarOpen && heldSales.length > 0 && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: activeNav === 'held_sales' ? '#000000' : '#27272A',
                  color: activeNav === 'held_sales' ? '#FFFFFF' : '#FFFFFF',
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
                border: activeNav === 'invoices' ? '1px solid #FFFFFF' : '1px solid transparent',
                backgroundColor: activeNav === 'invoices' ? '#FFFFFF' : 'transparent',
                color: activeNav === 'invoices' ? '#000000' : '#FFFFFF',
                fontSize: '14px',
                fontWeight: activeNav === 'invoices' ? 800 : 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (activeNav !== 'invoices') e.currentTarget.style.backgroundColor = '#18181B';
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
                border: activeNav === 'customers' ? '1px solid #FFFFFF' : '1px solid transparent',
                backgroundColor: activeNav === 'customers' ? '#FFFFFF' : 'transparent',
                color: activeNav === 'customers' ? '#000000' : '#FFFFFF',
                fontSize: '14px',
                fontWeight: activeNav === 'customers' ? 800 : 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (activeNav !== 'customers') e.currentTarget.style.backgroundColor = '#18181B';
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

          {/* Bottom Nav Items: End shift & Logout (as in wireframe) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid #1F1F1F', paddingTop: '1rem' }}>
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
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#18181B'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <ScheduleRoundedIcon sx={{ fontSize: 18, color: '#FFFFFF', flexShrink: 0 }} />
              {isSidebarOpen && (
                <span style={{ marginLeft: '0.65rem', whiteSpace: 'nowrap' }}>End shift</span>
              )}
            </button>

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
                color: '#A1A1AA',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#18181B';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#A1A1AA';
              }}
            >
              <LogoutRoundedIcon sx={{ fontSize: 18, color: 'inherit', flexShrink: 0 }} />
              {isSidebarOpen && (
                <span style={{ marginLeft: '0.65rem', whiteSpace: 'nowrap' }}>Logout</span>
              )}
            </Link>
          </div>
        </aside>

        {/* CENTER COLUMN: PRODUCT CATALOG & SEARCH */}
        <section style={{
          flex: 1,
          minWidth: 0,
          height: '100%',
          overflowY: 'auto',
          padding: '1.25rem 1.5rem',
          backgroundColor: '#000000',
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
              backgroundColor: '#0A0A0A',
              border: '1px solid #27272A',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 1.1rem',
              gap: '0.65rem',
              transition: 'border-color 0.15s ease',
            }}>
              <SearchRoundedIcon sx={{ fontSize: 20, color: '#A1A1AA' }} />
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
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#A1A1AA', cursor: 'pointer' }}
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
                backgroundColor: '#0A0A0A',
                border: '1px solid #27272A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FFFFFF';
                e.currentTarget.style.backgroundColor = '#18181B';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#27272A';
                e.currentTarget.style.backgroundColor = '#0A0A0A';
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
                    border: isSelected ? '1px solid #FFFFFF' : '1px solid #27272A',
                    backgroundColor: isSelected ? '#FFFFFF' : '#0A0A0A',
                    color: isSelected ? '#000000' : '#FFFFFF',
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
                      e.currentTarget.style.borderColor = '#FFFFFF';
                      e.currentTarget.style.backgroundColor = '#18181B';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#27272A';
                      e.currentTarget.style.backgroundColor = '#0A0A0A';
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
                      backgroundColor: '#0A0A0A',
                      border: countInCart > 0 ? '1px solid #FFFFFF' : '1px solid #242424',
                      borderRadius: '1rem',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#FFFFFF';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      if (countInCart === 0) e.currentTarget.style.borderColor = '#242424';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Product Image Pod */}
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '135px',
                      backgroundColor: '#121214',
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
                          backgroundColor: '#000000',
                          color: '#FFFFFF',
                          border: '1px solid #FFFFFF',
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
                          backgroundColor: '#FFFFFF',
                          color: '#000000',
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

                    {/* Product Details (as in wireframe: Title / Variant / Price) */}
                    <div style={{ padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span style={{ fontSize: '14.5px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.015em' }}>
                        {p.name}
                      </span>
                      <span style={{ fontSize: '12px', color: '#A1A1AA' }}>
                        {p.variant}
                      </span>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', marginTop: '0.35rem' }}>
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
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Held Sales ({heldSales.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveNav('new_sale')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'none',
                    border: '1px solid #27272A',
                    borderRadius: '0.55rem',
                    padding: '0.4rem 0.85rem',
                    color: '#FFFFFF',
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
                <div style={{ padding: '3rem', textAlign: 'center', color: '#A1A1AA', backgroundColor: '#0A0A0A', borderRadius: '1rem', border: '1px solid #242424' }}>
                  No sales currently on hold.
                </div>
              ) : (
                heldSales.map((h) => (
                  <div
                    key={h.id}
                    style={{
                      padding: '1.1rem 1.25rem',
                      backgroundColor: '#0A0A0A',
                      border: '1px solid #242424',
                      borderRadius: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
                        {h.id} • {h.items.length} items
                      </div>
                      <div style={{ fontSize: '12px', color: '#A1A1AA', marginTop: '0.2rem' }}>
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
                        backgroundColor: '#FFFFFF',
                        color: '#000000',
                        borderRadius: '0.65rem',
                        cursor: 'pointer',
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
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {activeNav === 'invoices' ? 'Recent Invoices' : 'Store Customer Directory'}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveNav('new_sale')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'none',
                    border: '1px solid #27272A',
                    borderRadius: '0.55rem',
                    padding: '0.4rem 0.85rem',
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
                  <span>Back to Sale</span>
                </button>
              </div>
              <div style={{ backgroundColor: '#0A0A0A', border: '1px solid #242424', borderRadius: '1rem', padding: '1.25rem' }}>
                <p style={{ color: '#A1A1AA', fontSize: '13.5px', margin: 0 }}>
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
          backgroundColor: '#070708',
          borderLeft: '1px solid #1F1F1F',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
          boxSizing: 'border-box',
        }}>
          {/* Ticket Header (Current Sale title as in wireframe) */}
          <div style={{
            padding: '1.1rem 1.25rem',
            borderBottom: '1px solid #1F1F1F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{
                fontSize: '17px',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                margin: 0,
              }}>
                Current Sale
              </h2>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                backgroundColor: '#1C1C1E',
                color: '#A1A1AA',
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
                  color: '#A1A1AA',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  borderRadius: '0.45rem',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#A1A1AA'; }}
              >
                <DeleteOutlineRoundedIcon sx={{ fontSize: 19 }} />
              </button>
            )}
          </div>

          {/* Customer Quick Selector */}
          <div style={{
            padding: '0.65rem 1.25rem',
            backgroundColor: '#0C0C0E',
            borderBottom: '1px solid #1F1F1F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '12px', color: '#A1A1AA' }}>Customer:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#FFFFFF' }}>{customerName}</span>
              <button
                type="button"
                onClick={() => {
                  const name = prompt('Enter customer name or phone:', customerName);
                  if (name) setCustomerName(name);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#A1A1AA',
                  cursor: 'pointer',
                  fontSize: '11px',
                  textDecoration: 'underline',
                }}
              >
                edit
              </button>
            </div>
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
                color: '#71717A',
                gap: '0.5rem',
              }}>
                <ReceiptLongRoundedIcon sx={{ fontSize: 36, color: '#27272A' }} />
                <span style={{ fontSize: '13.5px', fontWeight: 600 }}>Ticket is empty</span>
                <span style={{ fontSize: '12px', maxWidth: '200px' }}>Tap any product from the catalog to add items.</span>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.75rem',
                    backgroundColor: '#0F0F12',
                    borderRadius: '0.65rem',
                    border: '1px solid #1F1F24',
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1, paddingRight: '0.5rem' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#A1A1AA', marginTop: '1px' }}>
                      ₹{item.product.price} each
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      backgroundColor: '#18181B',
                      borderRadius: '0.45rem',
                      border: '1px solid #27272A',
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
                          color: '#FFFFFF',
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
                        color: '#FFFFFF',
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
                          color: '#FFFFFF',
                          cursor: 'pointer',
                        }}
                      >
                        <AddRoundedIcon sx={{ fontSize: 13 }} />
                      </button>
                    </div>

                    <div style={{ width: '60px', textAlign: 'right', fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                      ₹{item.product.price * item.quantity}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Ticket Summary & Checkout Footer */}
          <div style={{
            padding: '1.1rem 1.25rem',
            backgroundColor: '#09090B',
            borderTop: '1px solid #1F1F1F',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}>
            {/* Subtotal, Tax, Discount */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#A1A1AA' }}>
                <span>Subtotal</span>
                <span style={{ color: '#FFFFFF', fontWeight: 600 }}>₹{subtotal}</span>
              </div>
              {discountPct > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#22C55E' }}>
                  <span>Discount ({discountPct}%)</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#A1A1AA' }}>
                <span>Tax (GST 5%)</span>
                <span style={{ color: '#FFFFFF', fontWeight: 600 }}>₹{tax}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '18px',
                fontWeight: 800,
                color: '#FFFFFF',
                paddingTop: '0.45rem',
                borderTop: '1px solid #1F1F1F',
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
                  border: '1px solid #27272A',
                  backgroundColor: '#121214',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: cart.length === 0 ? 0.45 : 1,
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
                  border: discountPct > 0 ? '1px solid #FFFFFF' : '1px solid #27272A',
                  backgroundColor: discountPct > 0 ? '#FFFFFF' : '#121214',
                  color: discountPct > 0 ? '#000000' : '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: cart.length === 0 ? 0.45 : 1,
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
                backgroundColor: '#FFFFFF',
                color: '#000000',
                fontSize: '15px',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                boxShadow: '0 4px 0 #999999',
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
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: '#0A0A0A',
            border: '1px solid #27272A',
            borderRadius: '1.25rem',
            padding: '1.75rem',
            boxShadow: '0 24px 64px rgba(0,0,0,0.9)',
          }}>
            {paymentSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircleRoundedIcon sx={{ fontSize: 64, color: '#22C55E', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.35rem' }}>
                  Payment of ₹{total} Successful!
                </h3>
                <p style={{ fontSize: '13px', color: '#A1A1AA', margin: 0 }}>
                  Order #ORD-1025 completed • Receipt printing...
                </p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                      Complete Payment
                    </h3>
                    <p style={{ fontSize: '12.5px', color: '#A1A1AA', margin: '0.2rem 0 0 0' }}>
                      Total Due: ₹{total}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
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
                          border: isSelected ? '1px solid #FFFFFF' : '1px solid #27272A',
                          backgroundColor: isSelected ? '#FFFFFF' : '#141416',
                          color: isSelected ? '#000000' : '#FFFFFF',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.45rem',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: 700,
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
                    backgroundColor: '#121214',
                    border: '1px solid #222224',
                    borderRadius: '0.85rem',
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                  }}>
                    <div style={{
                      width: '120px',
                      height: '120px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '0.5rem',
                      margin: '0 auto 0.85rem auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <QrCode2RoundedIcon sx={{ fontSize: 100, color: '#000000' }} />
                    </div>
                    <span style={{ fontSize: '12.5px', color: '#A1A1AA' }}>
                      Scan dynamic UPI QR code on customer display
                    </span>
                  </div>
                )}

                {paymentMethod === 'cash' && (
                  <div style={{
                    padding: '1.25rem',
                    backgroundColor: '#121214',
                    border: '1px solid #222224',
                    borderRadius: '0.85rem',
                    marginBottom: '1.5rem',
                  }}>
                    <div style={{ fontSize: '13px', color: '#A1A1AA', marginBottom: '0.5rem' }}>
                      Cash Received:
                    </div>
                    <input
                      type="number"
                      defaultValue={total}
                      style={{
                        width: '100%',
                        height: '42px',
                        backgroundColor: '#0A0A0A',
                        border: '1px solid #27272A',
                        borderRadius: '0.55rem',
                        padding: '0 0.85rem',
                        color: '#FFFFFF',
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
                    backgroundColor: '#121214',
                    border: '1px solid #222224',
                    borderRadius: '0.85rem',
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                    color: '#A1A1AA',
                    fontSize: '13px',
                  }}>
                    Insert or tap debit/credit card on EDC terminal.
                  </div>
                )}

                {/* Submit Payment Button */}
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  className="button-20-3d"
                  style={{
                    width: '100%',
                    height: '46px',
                    borderRadius: '0.75rem',
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    fontSize: '14.5px',
                    fontWeight: 800,
                    boxShadow: '0 4px 0 #999999',
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
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '420px',
            backgroundColor: '#0A0A0A',
            border: '1px solid #27272A',
            borderRadius: '1.25rem',
            padding: '1.75rem',
            boxShadow: '0 24px 64px rgba(0,0,0,0.9)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                End Current Shift
              </h3>
              <button
                type="button"
                onClick={() => setShowEndShiftModal(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: '#141416', borderRadius: '0.65rem' }}>
                <span style={{ fontSize: '13px', color: '#A1A1AA' }}>Cashier</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>Amit Patel</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: '#141416', borderRadius: '0.65rem' }}>
                <span style={{ fontSize: '13px', color: '#A1A1AA' }}>Expected Drawer Cash</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>₹28,450</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: '#141416', borderRadius: '0.65rem' }}>
                <span style={{ fontSize: '13px', color: '#A1A1AA' }}>Total Sales in Shift</span>
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
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  fontSize: '13px',
                  fontWeight: 800,
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
                  border: '1px solid #27272A',
                  backgroundColor: '#141416',
                  color: '#FFFFFF',
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
    </div>
  );
}
