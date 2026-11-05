'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded';
import { AppTheme, ThemeMode, APP_THEMES, getStoredThemeMode, setStoredThemeMode } from '@/lib/themeConfig';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import ActionMenu, {
  ActionCashRegisterIcon,
  ActionHeldSalesIcon,
  ActionInvoicesIcon,
  ActionCustomersIcon,
  ActionEndShiftIcon,
  ActionDarkModeIcon,
} from '@/components/pos/ActionMenu';
import CompletePaymentModal from '@/components/pos/CompletePaymentModal';
import {
  getOwnerSales,
  getActiveShift,
  recordCashMovement,
  closeShift,
  getCustomers,
  createCustomer,
  getDiningTables,
  updateTableStatus,
  getCatalogCategories,
  getCatalogProducts,
  getOffers,
} from '@/lib/api-client';
import { getPosSession } from '@/lib/auth';
import { RegisterShift, ShiftCloseResponse } from '@/types/shift';
import { Customer } from '@/types/customer';
import { DiningTable } from '@/types/table';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';
import SellRoundedIcon from '@mui/icons-material/SellRounded';
import PriceChangeRoundedIcon from '@mui/icons-material/PriceChangeRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import LunchDiningRoundedIcon from '@mui/icons-material/LunchDiningRounded';
import LocalCafeRoundedIcon from '@mui/icons-material/LocalCafeRounded';
import BakeryDiningRoundedIcon from '@mui/icons-material/BakeryDiningRounded';
import CheckroomRoundedIcon from '@mui/icons-material/CheckroomRounded';
import TakeoutDiningRoundedIcon from '@mui/icons-material/TakeoutDiningRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import TableBarRoundedIcon from '@mui/icons-material/TableBarRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import DeliveryDiningRoundedIcon from '@mui/icons-material/DeliveryDiningRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import KitchenRoundedIcon from '@mui/icons-material/KitchenRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import ChairRoundedIcon from '@mui/icons-material/ChairRounded';

const TABLE_SECTIONS: Record<string, string[]> = {
  'Main Hall': ['T-01', 'T-02', 'T-03', 'T-04', 'T-05', 'T-06'],
  'AC Hall': ['AC-01', 'AC-02', 'AC-03', 'AC-04'],
  'Garden': ['G-01', 'G-02', 'G-03', 'G-04'],
  'Rooftop': ['R-01', 'R-02', 'R-03'],
};

const DEFAULT_DINING_TABLES: DiningTable[] = [
  // Main Hall (6 Tables)
  { id: 1, franchiseId: 1, tableNumber: 'T-01', section: 'Main Hall', capacity: 4, status: 'VACANT' },
  { id: 2, franchiseId: 1, tableNumber: 'T-02', section: 'Main Hall', capacity: 2, status: 'OCCUPIED', activeOrderId: '#ORD-1001' },
  { id: 3, franchiseId: 1, tableNumber: 'T-03', section: 'Main Hall', capacity: 4, status: 'VACANT' },
  { id: 4, franchiseId: 1, tableNumber: 'T-04', section: 'Main Hall', capacity: 6, status: 'RESERVED' },
  { id: 5, franchiseId: 1, tableNumber: 'T-05', section: 'Main Hall', capacity: 4, status: 'VACANT' },
  { id: 6, franchiseId: 1, tableNumber: 'T-06', section: 'Main Hall', capacity: 8, status: 'BILLED', activeOrderId: '#ORD-1002' },

  // AC Hall (4 Tables)
  { id: 7, franchiseId: 1, tableNumber: 'AC-01', section: 'AC Hall', capacity: 4, status: 'VACANT' },
  { id: 8, franchiseId: 1, tableNumber: 'AC-02', section: 'AC Hall', capacity: 4, status: 'OCCUPIED', activeOrderId: '#ORD-0998' },
  { id: 9, franchiseId: 1, tableNumber: 'AC-03', section: 'AC Hall', capacity: 2, status: 'VACANT' },
  { id: 10, franchiseId: 1, tableNumber: 'AC-04', section: 'AC Hall', capacity: 6, status: 'VACANT' },

  // Garden (4 Tables)
  { id: 11, franchiseId: 1, tableNumber: 'G-01', section: 'Garden', capacity: 4, status: 'VACANT' },
  { id: 12, franchiseId: 1, tableNumber: 'G-02', section: 'Garden', capacity: 6, status: 'VACANT' },
  { id: 13, franchiseId: 1, tableNumber: 'G-03', section: 'Garden', capacity: 4, status: 'OCCUPIED', activeOrderId: '#ORD-1000' },
  { id: 14, franchiseId: 1, tableNumber: 'G-04', section: 'Garden', capacity: 2, status: 'VACANT' },

  // Rooftop (3 Tables)
  { id: 15, franchiseId: 1, tableNumber: 'R-01', section: 'Rooftop', capacity: 4, status: 'VACANT' },
  { id: 16, franchiseId: 1, tableNumber: 'R-02', section: 'Rooftop', capacity: 4, status: 'VACANT' },
  { id: 17, franchiseId: 1, tableNumber: 'R-03', section: 'Rooftop', capacity: 8, status: 'RESERVED' },
];

interface Product {
  id: string;
  name: string;
  variant: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  isOffer?: boolean;
  offerBadge?: string;
}

interface StoreOffer {
  id: string;
  title: string;
  code?: string;
  badgeText: string;
  discountType: 'percentage' | 'fixed_amount' | 'promo_price';
  discountValue: number;
  appliesTo: 'all' | 'category' | 'products';
  targetCategories?: string[];
  targetProductIds?: string[];
  minSubtotal?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
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
  orderType?: 'dine_in' | 'takeaway' | 'delivery';
  tableNumber?: string;
  tableSection?: string;
  ticketNumber?: string;
  deliveryPlatform?: string;
  customerName?: string;
  customerPhone?: string;
}

const DEFAULT_STORE_PRODUCTS: Product[] = [
  {
    id: 'demo-1',
    name: 'Artisan Espresso',
    variant: 'Single Origin',
    price: 150,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'demo-2',
    name: 'Iced Vanilla Latte',
    variant: 'Grande 16oz',
    price: 220,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'demo-3',
    name: 'Matcha Green Tea',
    variant: 'Cold Whisked',
    price: 240,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'demo-4',
    name: 'Butter Croissant',
    variant: 'Fresh Baked',
    price: 120,
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'demo-5',
    name: 'Blueberry Danish',
    variant: 'Flaky Pastry',
    price: 160,
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'demo-6',
    name: 'Avocado Sourdough Toast',
    variant: 'Organic Sourdough',
    price: 280,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'demo-7',
    name: 'Classic Club Sandwich',
    variant: 'Toasted Multi-Grain',
    price: 260,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'demo-8',
    name: 'Ceramic Nuradesk Mug',
    variant: 'Matte Black 12oz',
    price: 450,
    category: 'Retail',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80',
  },
];

function getDefaultImageForCategory(catName: string): string {
  const lower = (catName || '').toLowerCase();
  if (lower.includes('beverage') || lower.includes('drink') || lower.includes('coffee') || lower.includes('tea')) {
    return 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=80';
  }
  if (lower.includes('bake') || lower.includes('pastry') || lower.includes('cake') || lower.includes('bread') || lower.includes('croissant')) {
    return 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80';
  }
  if (lower.includes('food') || lower.includes('snack') || lower.includes('meal') || lower.includes('lunch') || lower.includes('burger')) {
    return 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80';
  }
  if (lower.includes('retail') || lower.includes('merch') || lower.includes('mug')) {
    return 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80';
}

function getCategoryIcon(catName: string) {
  const lower = (catName || '').toLowerCase();
  if (lower.includes('beverage') || lower.includes('drink') || lower.includes('coffee') || lower.includes('tea')) {
    return <LocalCafeRoundedIcon sx={{ fontSize: 18 }} />;
  }
  if (lower.includes('bake') || lower.includes('pastry') || lower.includes('cake') || lower.includes('bread')) {
    return <BakeryDiningRoundedIcon sx={{ fontSize: 18 }} />;
  }
  if (lower.includes('food') || lower.includes('meal') || lower.includes('snack') || lower.includes('lunch') || lower.includes('burger')) {
    return <LunchDiningRoundedIcon sx={{ fontSize: 18 }} />;
  }
  if (lower.includes('retail') || lower.includes('merch') || lower.includes('cloth')) {
    return <CheckroomRoundedIcon sx={{ fontSize: 18 }} />;
  }
  return <CategoryRoundedIcon sx={{ fontSize: 18 }} />;
}






const DEFAULT_STORE_INVOICES = [
  {
    id: 'inv-101',
    orderNumber: '#INV-1048',
    date: new Date().toISOString().split('T')[0],
    timestamp: '11:45 AM',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    items: [
      { name: 'Artisan Espresso', quantity: 2, price: 150, total: 300 },
      { name: 'Butter Croissant', quantity: 1, price: 120, total: 120 },
    ],
    totalAmount: 441,
    paymentMethod: 'UPI / QR',
    status: 'Completed',
    orderType: 'dine_in',
    tableNumber: 'Main Hall • T-01',
  },
  {
    id: 'inv-102',
    orderNumber: '#INV-1047',
    date: new Date().toISOString().split('T')[0],
    timestamp: '11:15 AM',
    customerName: 'Guest Customer',
    items: [
      { name: 'Iced Vanilla Latte', quantity: 1, price: 220, total: 220 },
      { name: 'Blueberry Danish', quantity: 1, price: 160, total: 160 },
    ],
    totalAmount: 399,
    paymentMethod: 'CASH',
    status: 'Completed',
    orderType: 'takeaway',
    ticketNumber: 'TK-12',
  },
  {
    id: 'inv-103',
    orderNumber: '#INV-1046',
    date: new Date().toISOString().split('T')[0],
    timestamp: '10:30 AM',
    customerName: 'Priya Patel',
    customerPhone: '+91 98234 56789',
    items: [
      { name: 'Avocado Sourdough Toast', quantity: 1, price: 280, total: 280 },
      { name: 'Matcha Green Tea', quantity: 1, price: 240, total: 240 },
    ],
    totalAmount: 546,
    paymentMethod: 'CARD',
    status: 'Completed',
    orderType: 'dine_in',
    tableNumber: 'Balcony • T-04',
  },
];

const DEFAULT_STORE_CUSTOMERS: Customer[] = [
  {
    id: 1,
    ownerId: 1,
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    address: 'Vastrapur, Ahmedabad',
    loyaltyPoints: 240,
    totalSpent: 4850,
    totalVisits: 8,
    createdAtUtc: new Date().toISOString(),
  },
  {
    id: 2,
    ownerId: 1,
    name: 'Priya Patel',
    phone: '+91 98234 56789',
    email: 'priya.patel@example.com',
    address: 'Navrangpura, Ahmedabad',
    loyaltyPoints: 120,
    totalSpent: 2600,
    totalVisits: 5,
    createdAtUtc: new Date().toISOString(),
  },
  {
    id: 3,
    ownerId: 1,
    name: 'Aman Verma',
    phone: '+91 97123 45678',
    email: 'aman.verma@example.com',
    address: 'Bodakdev, Ahmedabad',
    loyaltyPoints: 350,
    totalSpent: 7200,
    totalVisits: 12,
    createdAtUtc: new Date().toISOString(),
  },
  {
    id: 4,
    ownerId: 1,
    name: 'Sneha Mehta',
    phone: '+91 99887 76655',
    email: 'sneha.mehta@example.com',
    address: 'Satellite, Ahmedabad',
    loyaltyPoints: 80,
    totalSpent: 1400,
    totalVisits: 3,
    createdAtUtc: new Date().toISOString(),
  },
];

export default function PosMainScreen() {
  const { isAuthorized, handleLogout } = useAuthGuard();
  const router = useRouter();

  // Navigation state
  
  // Held Sales, Invoices & Customer Search + Ghost Skeleton Loading
  const [heldSearchQuery, setHeldSearchQuery] = useState('');
  const [isLoadingHeldSales, setIsLoadingHeldSales] = useState(false);

  const [invoicesList, setInvoicesList] = useState<any[]>(DEFAULT_STORE_INVOICES);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');

  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  const [activeNav, setActiveNav] = useState<'new_sale' | 'held_sales' | 'invoices' | 'customers'>('new_sale');

  // 9-Dot Quick Launcher Popup state & ref
  const [isAppsMenuOpen, setIsAppsMenuOpen] = useState(false);
  const appsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (appsMenuRef.current && !appsMenuRef.current.contains(event.target as Node)) {
        setIsAppsMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAppsMenuOpen(false);
      }
    };
    if (isAppsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAppsMenuOpen]);

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

  // Cart / Current Sale state (starts empty)
  const [cart, setCart] = useState<CartItem[]>([]);

  // Held sales list (starts empty)
  const [heldSales, setHeldSales] = useState<HeldSale[]>([]);

  // Customer state (Empty by default: Customer is Mandatory for sales)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway' | 'delivery'>('dine_in');
  const [tableSection, setTableSection] = useState('Main Hall');
  const [tableNumber, setTableNumber] = useState('T-01');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [tableNote, setTableNote] = useState<string>('');
  const [ticketNumber, setTicketNumber] = useState('#TK-01');
  const [deliveryPlatform, setDeliveryPlatform] = useState('Direct');
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [discountPct, setDiscountPct] = useState(0);

  // Dine In Advanced Features State
  const [showFloorPlanModal, setShowFloorPlanModal] = useState<boolean>(false);
  const [showKotModal, setShowKotModal] = useState<boolean>(false);
  const [showTransferTableModal, setShowTransferTableModal] = useState<boolean>(false);
  const [kotGeneratedCount, setKotGeneratedCount] = useState<number>(0);
  const [floorPlanFilter, setFloorPlanFilter] = useState<string>('All');
  const [floorPlanStatusFilter, setFloorPlanStatusFilter] = useState<string>('ALL');

  // Customer Modal Tab: 'new' | 'existing'
  const [customerModalTab, setCustomerModalTab] = useState<'new' | 'existing'>('new');
  const [customerSearchInModal, setCustomerSearchInModal] = useState<string>('');

  // Frequent customers list (loaded dynamically from store database)
  const [frequentCustomers, setFrequentCustomers] = useState<{ name: string; phone: string }[]>([]);

  // Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('upi');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showEndShiftModal, setShowEndShiftModal] = useState(false);

  // ============================================================================
  // REGISTER SHIFT STATE & OPERATIONS (PHASE 4 BATCH 1)
  // ============================================================================
  const [activeShift, setActiveShift] = useState<RegisterShift | null>(null);
  const [isLoadingShift, setIsLoadingShift] = useState<boolean>(true);
  const [currentCashierName, setCurrentCashierName] = useState<string>('Staff');

  // Cash Movement (Pay In / Pay Out) Modal
  const [showCashMovementModal, setShowCashMovementModal] = useState<boolean>(false);
  const [cashMovementType, setCashMovementType] = useState<'PAY_IN' | 'PAY_OUT'>('PAY_IN');
  const [cashMovementAmount, setCashMovementAmount] = useState<string>('');
  const [cashMovementReason, setCashMovementReason] = useState<string>('');
  const [isSubmittingCashMovement, setIsSubmittingCashMovement] = useState<boolean>(false);
  const [cashMovementError, setCashMovementError] = useState<string | null>(null);

  // Close Shift & Reconciliation State
  const [closingCashActual, setClosingCashActual] = useState<string>('');
  const [closingNotes, setClosingNotes] = useState<string>('');
  const [isSubmittingCloseShift, setIsSubmittingCloseShift] = useState<boolean>(false);
  const [closeShiftError, setCloseShiftError] = useState<string | null>(null);
  const [closeShiftResult, setCloseShiftResult] = useState<ShiftCloseResponse | null>(null);

  // Fetch Active Shift (API 37: GET /api/shifts/active)
  const fetchActiveShiftData = async () => {
    setIsLoadingShift(true);
    try {
      const res = await getActiveShift('TRM-01');
      if (res.data) {
        setActiveShift(res.data);
      } else {
        setActiveShift(null);
      }
    } catch (err) {
      console.warn('Could not fetch active register shift:', err);
      setActiveShift(null);
    } finally {
      setIsLoadingShift(false);
    }
  };

  useEffect(() => {
    fetchActiveShiftData();
    fetchCustomersData();
    fetchTablesData();
    const pos = getPosSession();
    if (pos && pos.employee) {
      setCurrentCashierName(pos.employee.name);
    }
  }, []);

  useEffect(() => {
    if (activeShift?.franchiseId) {
      fetchTablesData(activeShift.franchiseId);
    }
  }, [activeShift?.franchiseId]);

  // Handle Cash Movement (API 38: POST /api/shifts/cash-movement)
  const handleRecordCashMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift) {
      setCashMovementError('No active open shift found for this terminal.');
      return;
    }
    const amt = parseFloat(cashMovementAmount);
    if (isNaN(amt) || amt <= 0) {
      setCashMovementError('Please enter a valid cash amount greater than zero.');
      return;
    }
    if (!cashMovementReason.trim()) {
      setCashMovementError('Please provide a reason for this cash movement.');
      return;
    }

    setIsSubmittingCashMovement(true);
    setCashMovementError(null);

    try {
      await recordCashMovement({
        shiftId: activeShift.shiftId,
        type: cashMovementType,
        amount: amt,
        reason: cashMovementReason.trim(),
      });
      setShowCashMovementModal(false);
      setCashMovementAmount('');
      setCashMovementReason('');
      await fetchActiveShiftData();
    } catch (err: any) {
      setCashMovementError(err.message || 'Failed to record cash movement.');
    } finally {
      setIsSubmittingCashMovement(false);
    }
  };

  // Handle Close Shift (API 39: POST /api/shifts/close)
  const handleCloseShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift) {
      setCloseShiftError('No active open shift to close.');
      return;
    }
    const countNum = parseFloat(closingCashActual);
    if (isNaN(countNum) || countNum < 0) {
      setCloseShiftError('Please enter the actual counted cash amount in the drawer (0 or higher).');
      return;
    }

    setIsSubmittingCloseShift(true);
    setCloseShiftError(null);

    try {
      const res = await closeShift({
        shiftId: activeShift.shiftId,
        closingCashActual: countNum,
        notes: closingNotes.trim() || undefined,
      });

      if (res.data) {
        setCloseShiftResult(res.data);
      }
    } catch (err: any) {
      setCloseShiftError(err.message || 'Failed to close shift. Please try again.');
    } finally {
      setIsSubmittingCloseShift(false);
    }
  };

  // ============================================================================
  // CUSTOMER & DINING TABLE OPERATIONS (PHASE 4 BATCH 2)
  // ============================================================================
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [customerLoyaltyPoints, setCustomerLoyaltyPoints] = useState<number>(0);
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [isSearchingCustomers, setIsSearchingCustomers] = useState<boolean>(false);

  // Quick Customer Registration Modal State
  const [showAddCustomerModal, setShowAddCustomerModal] = useState<boolean>(false);
  const [newCustomerName, setNewCustomerName] = useState<string>('');
  const [newCustomerPhone, setNewCustomerPhone] = useState<string>('');
  const [newCustomerEmail, setNewCustomerEmail] = useState<string>('');
  const [newCustomerAddress, setNewCustomerAddress] = useState<string>('');
  const [isCreatingCustomer, setIsCreatingCustomer] = useState<boolean>(false);
  const [addCustomerError, setAddCustomerError] = useState<string | null>(null);

  // Dining Tables State (Seeded with DEFAULT_DINING_TABLES fallback)
  const [diningTables, setDiningTables] = useState<DiningTable[]>(DEFAULT_DINING_TABLES);
  const [isLoadingTables, setIsLoadingTables] = useState<boolean>(false);

  // Fetch Customers (API 40: GET /api/customers)
  const fetchCustomersData = async (query?: string) => {
    setIsSearchingCustomers(true);
    try {
      const res = await getCustomers(query);
      if (res.data && Array.isArray(res.data)) {
        setCustomersList(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch customers from backend:', err);
    } finally {
      setIsSearchingCustomers(false);
    }
  };

  // Quick-register Customer at POS (API 41: POST /api/customers)
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim() || newCustomerName.trim().length < 2) {
      setAddCustomerError('Customer name must be at least 2 characters.');
      return;
    }
    if (!newCustomerPhone.trim()) {
      setAddCustomerError('Customer phone number is required.');
      return;
    }

    setIsCreatingCustomer(true);
    setAddCustomerError(null);

    try {
      const res = await createCustomer({
        name: newCustomerName.trim(),
        phone: newCustomerPhone.trim(),
        email: newCustomerEmail.trim() || undefined,
        address: newCustomerAddress.trim() || undefined,
      });

      if (res.data) {
        const created = res.data;
        setCustomersList((prev) => [created, ...prev]);
        setSelectedCustomerId(created.id);
        setCustomerName(created.name);
        setCustomerPhone(created.phone);
        setCustomerLoyaltyPoints(created.loyaltyPoints || 0);
        setShowAddCustomerModal(false);
        setNewCustomerName('');
        setNewCustomerPhone('');
        setNewCustomerEmail('');
        setNewCustomerAddress('');
      }
    } catch (err: any) {
      setAddCustomerError(err.message || 'Failed to create customer. Phone number may already be registered.');
    } finally {
      setIsCreatingCustomer(false);
    }
  };

  // Load Invoices with Ghost Shimmer
  const loadInvoices = async () => {
    setIsLoadingInvoices(true);
    try {
      let localOrders: any[] = [];
      try {
        const stored = localStorage.getItem('nuradesk_orders');
        if (stored) localOrders = JSON.parse(stored);
      } catch (e) {
        console.warn('Error reading nuradesk_orders', e);
      }

      let backendOrders: any[] = [];
      try {
        const res = await getOwnerSales();
        if (res?.data && Array.isArray(res.data)) {
          backendOrders = res.data.map((b) => ({
            id: b.id,
            orderNumber: b.billNumber || `#INV-${b.id}`,
            date: b.createdAtUtc ? b.createdAtUtc.split('T')[0] : new Date().toISOString().split('T')[0],
            timestamp: b.createdAtUtc ? new Date(b.createdAtUtc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today',
            customerName: 'Customer',
            items: b.items || [],
            totalAmount: b.totalAmount,
            paymentMethod: b.paymentMethod || 'CASH',
            status: 'Completed',
          }));
        }
      } catch (err) {
        // Backend offline or no owner sales yet, use local
      }

      const combined = [...localOrders];
      backendOrders.forEach((bo) => {
        if (!combined.some((co) => co.orderNumber === bo.orderNumber || co.id === bo.id)) {
          combined.push(bo);
        }
      });

      if (combined.length === 0) {
        setInvoicesList(DEFAULT_STORE_INVOICES);
      } else {
        setInvoicesList(combined);
      }
    } finally {
      setTimeout(() => setIsLoadingInvoices(false), 300);
    }
  };

  // Load Customers with Ghost Shimmer
  const loadCustomers = async () => {
    setIsLoadingCustomers(true);
    try {
      await fetchCustomersData();
    } finally {
      setTimeout(() => setIsLoadingCustomers(false), 300);
    }
  };

  // Trigger ghost skeleton loading on view switch
  useEffect(() => {
    if (activeNav === 'invoices') {
      loadInvoices();
    } else if (activeNav === 'customers') {
      loadCustomers();
    } else if (activeNav === 'held_sales') {
      setIsLoadingHeldSales(true);
      const timer = setTimeout(() => setIsLoadingHeldSales(false), 300);
      return () => clearTimeout(timer);
    }
  }, [activeNav]);

  // Real search filter for Held Sales
  const filteredHeldSales = useMemo(() => {
    const q = heldSearchQuery.toLowerCase().trim();
    if (!q) return heldSales;
    return heldSales.filter((h) => {
      const idMatch = h.id.toLowerCase().includes(q);
      const custMatch = h.customerName ? h.customerName.toLowerCase().includes(q) : false;
      const tableMatch = h.tableNumber ? h.tableNumber.toLowerCase().includes(q) : false;
      const ticketMatch = h.ticketNumber ? h.ticketNumber.toLowerCase().includes(q) : false;
      const itemsMatch = h.items.some((item) => item.product.name.toLowerCase().includes(q));
      return idMatch || custMatch || tableMatch || ticketMatch || itemsMatch;
    });
  }, [heldSales, heldSearchQuery]);

  // Real search filter for Invoices
  const filteredInvoices = useMemo(() => {
    const q = invoiceSearchQuery.toLowerCase().trim();
    if (!q) return invoicesList;
    return invoicesList.filter((inv) => {
      const numMatch = (inv.orderNumber || inv.billNumber || String(inv.id)).toLowerCase().includes(q);
      const custMatch = inv.customerName ? inv.customerName.toLowerCase().includes(q) : false;
      const phoneMatch = inv.customerPhone ? inv.customerPhone.toLowerCase().includes(q) : false;
      const methodMatch = inv.paymentMethod ? inv.paymentMethod.toLowerCase().includes(q) : false;
      const dateMatch = (inv.date || inv.timestamp || '').toLowerCase().includes(q);
      const itemsMatch = Array.isArray(inv.items) && inv.items.some((item: any) =>
        (item.name || item.productName || '').toLowerCase().includes(q)
      );
      return numMatch || custMatch || phoneMatch || methodMatch || dateMatch || itemsMatch;
    });
  }, [invoicesList, invoiceSearchQuery]);

  // Real search filter for Customers
  const effectiveCustomers = customersList.length > 0 ? customersList : DEFAULT_STORE_CUSTOMERS;
  const filteredCustomers = useMemo(() => {
    const q = customerSearchQuery.toLowerCase().trim();
    if (!q) return effectiveCustomers;
    return effectiveCustomers.filter((cust) => {
      const nameMatch = cust.name ? cust.name.toLowerCase().includes(q) : false;
      const phoneMatch = cust.phone ? cust.phone.toLowerCase().includes(q) : false;
      const emailMatch = cust.email ? cust.email.toLowerCase().includes(q) : false;
      return nameMatch || phoneMatch || emailMatch;
    });
  }, [effectiveCustomers, customerSearchQuery]);

  // Reusable Ghost Shimmer Skeleton Loader
  const renderGhostSkeletonCards = (count = 3) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          style={{
            padding: '1.2rem 1.25rem',
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: '0.85rem',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: theme.sidebarIsDark
                ? 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.06) 50%, transparent 100%)'
                : 'linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.05) 50%, transparent 100%)',
              animation: 'posGhostShimmer 1.4s infinite',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{
              width: `${120 + (idx % 3) * 40}px`,
              height: '16px',
              borderRadius: '6px',
              backgroundColor: theme.sidebarIsDark ? '#27272A' : '#E4E4E7',
            }} />
            <div style={{
              width: '70px',
              height: '18px',
              borderRadius: '999px',
              backgroundColor: theme.sidebarIsDark ? '#27272A' : '#E4E4E7',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{
              width: `${180 + (idx % 2) * 50}px`,
              height: '12px',
              borderRadius: '4px',
              backgroundColor: theme.sidebarIsDark ? '#27272A' : '#E4E4E7',
            }} />
            <div style={{
              width: '90px',
              height: '22px',
              borderRadius: '6px',
              backgroundColor: theme.sidebarIsDark ? '#27272A' : '#E4E4E7',
            }} />
          </div>
        </div>
      ))}
    </div>
  );



  // Fetch Dining Tables for Outlet (API 43: GET /api/tables)
  const fetchTablesData = async (franchiseId?: number) => {
    setIsLoadingTables(true);
    try {
      const res = await getDiningTables(franchiseId);
      if (res.data && Array.isArray(res.data)) {
        setDiningTables(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch dining tables from backend:', err);
    } finally {
      setIsLoadingTables(false);
    }
  };

  // Update Dining Table Status (API 44: PUT /api/tables/{id}/status)
  const handleUpdateTableStatus = async (
    tableId: number,
    status: 'VACANT' | 'OCCUPIED' | 'RESERVED' | 'BILLED',
    orderId?: string
  ) => {
    try {
      await updateTableStatus(tableId, { status, activeOrderId: orderId });
      setDiningTables((prev) =>
        prev.map((t) => (t.id === tableId ? { ...t, status, activeOrderId: orderId || t.activeOrderId } : t))
      );
    } catch (err) {
      console.warn('Could not update table status:', err);
    }
  };

  // Dynamic dining sections mapping from backend tables
  const dynamicSections = useMemo(() => {
    if (diningTables.length === 0) return TABLE_SECTIONS;
    const map: Record<string, string[]> = {};
    diningTables.forEach((t) => {
      const sec = t.section || 'General';
      if (!map[sec]) map[sec] = [];
      map[sec].push(t.tableNumber);
    });
    return map;
  }, [diningTables]);

  // Product Catalog (loaded dynamically from store inventory/catalog)
  const [products, setProducts] = useState<Product[]>(DEFAULT_STORE_PRODUCTS);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [storeOffers, setStoreOffers] = useState<StoreOffer[]>([]);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('');
  const [promoDiscountAmount, setPromoDiscountAmount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string>('');

  // Dynamic order sequence number
  const [orderNumber, setOrderNumber] = useState<string>('#ORD-1001');

  // Mandatory Customer Verification: Sales cannot be considered without customer details
  const isCustomerValid = useMemo(() => {
    return Boolean(
      customerName &&
      customerName.trim().length >= 2 &&
      customerName.trim().toLowerCase() !== 'guest customer' &&
      customerPhone &&
      customerPhone.trim().length >= 7
    );
  }, [customerName, customerPhone]);

  // Active Selected Dining Table Object with safe fallback
  const currentTableObj = useMemo(() => {
    return diningTables.find((t) => t.tableNumber === tableNumber && t.section === tableSection) ||
           diningTables.find((t) => t.tableNumber === tableNumber) ||
           { id: 1, franchiseId: 1, tableNumber, section: tableSection, capacity: 4, status: 'VACANT' };
  }, [diningTables, tableNumber, tableSection]);

  // Dining Floor Statistics
  const floorStats = useMemo(() => {
    const total = diningTables.length;
    const vacant = diningTables.filter((t) => t.status === 'VACANT').length;
    const occupied = diningTables.filter((t) => t.status === 'OCCUPIED').length;
    const reserved = diningTables.filter((t) => t.status === 'RESERVED').length;
    const billed = diningTables.filter((t) => t.status === 'BILLED').length;
    return { total, vacant, occupied, reserved, billed };
  }, [diningTables]);

  // Select Table from Floor Plan
  const handleSelectTable = (tbl: DiningTable) => {
    setTableSection(tbl.section);
    setTableNumber(tbl.tableNumber);
    setShowFloorPlanModal(false);
  };

  // Transfer Table order to another vacant table
  const handleTransferTable = (targetTable: DiningTable) => {
    const currentTbl = diningTables.find((t) => t.tableNumber === tableNumber && t.section === tableSection);
    if (currentTbl) {
      handleUpdateTableStatus(currentTbl.id, 'VACANT', undefined);
    }
    handleUpdateTableStatus(targetTable.id, 'OCCUPIED', orderNumber);
    setTableSection(targetTable.section);
    setTableNumber(targetTable.tableNumber);
    setShowTransferTableModal(false);
  };

  // Kitchen Order Ticket (KOT)
  const handleSendKot = () => {
    if (cart.length === 0) return;
    setShowKotModal(true);
  };

  const handlePrintConfirmKot = () => {
    setKotGeneratedCount((prev) => prev + 1);
    const currentTbl = diningTables.find((t) => t.tableNumber === tableNumber && t.section === tableSection);
    if (currentTbl) {
      handleUpdateTableStatus(currentTbl.id, 'OCCUPIED', orderNumber);
    }
    setShowKotModal(false);
  };

  // Primary Checkout Trigger: strictly enforces customer presence
  const handleInitiateCharge = () => {
    if (cart.length === 0) return;
    if (!isCustomerValid) {
      setAddCustomerError('Customer details (Full Name & Phone) are mandatory before checking out a sale.');
      setShowAddCustomerModal(true);
      return;
    }
    setShowPaymentModal(true);
  };

  // Load real store data from backend API & localStorage on mount
  useEffect(() => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Load offers first so products can calculate promotional pricing
      const savedOffers = localStorage.getItem('nuradesk_offers');
      let loadedOffers: StoreOffer[] = [];
      if (savedOffers) {
        const parsedOffers = JSON.parse(savedOffers);
        if (Array.isArray(parsedOffers)) {
          loadedOffers = parsedOffers
            .filter((o: any) => !['offer-1', 'offer-2', 'offer-3'].includes(o.id))
            .filter(
              (o: any) => o.isActive && o.startDate <= today && o.endDate >= today
            );
          setStoreOffers(loadedOffers);
        }
      }

      const autoOffers = loadedOffers.filter((o) => !o.code);

      // Check localStorage for offline/cached products first
      const savedProducts = localStorage.getItem('nuradesk_products');
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mapped: Product[] = parsed
            .filter((p: any) => p.isActive !== false)
            .map((p: any) => {
              const basePrice = Number(p.sellingPrice) || 0;
              const prodId = String(p.id);
              const prodCat = p.category || 'General';

              const matchingOffer = autoOffers.find((offer) => {
                if (offer.appliesTo === 'all') return true;
                if (offer.appliesTo === 'category' && offer.targetCategories?.includes(prodCat)) return true;
                if (offer.appliesTo === 'products' && offer.targetProductIds?.includes(prodId)) return true;
                return false;
              });

              if (matchingOffer) {
                let discountedPrice = basePrice;
                if (matchingOffer.discountType === 'percentage') {
                  discountedPrice = Math.max(0, basePrice * (1 - matchingOffer.discountValue / 100));
                } else if (matchingOffer.discountType === 'fixed_amount') {
                  discountedPrice = Math.max(0, basePrice - matchingOffer.discountValue);
                } else if (matchingOffer.discountType === 'promo_price') {
                  discountedPrice = matchingOffer.discountValue;
                }
                discountedPrice = Math.round(discountedPrice * 100) / 100;

                return {
                  id: prodId,
                  name: p.name,
                  variant: p.hasVariants && p.variants?.[0]?.name ? p.variants[0].name : (p.brand || 'Standard'),
                  price: discountedPrice,
                  originalPrice: basePrice > discountedPrice ? basePrice : undefined,
                  category: prodCat,
                  image: (p as any).image || getDefaultImageForCategory(prodCat),
                  isOffer: true,
                  offerBadge: matchingOffer.badgeText || 'OFFER',
                };
              }

              return {
                id: prodId,
                name: p.name,
                variant: p.hasVariants && p.variants?.[0]?.name ? p.variants[0].name : (p.brand || 'Standard'),
                price: basePrice,
                category: prodCat,
                image: (p as any).image || getDefaultImageForCategory(prodCat),
                isOffer: Boolean(p.isOffer),
                offerBadge: 'OFFER',
              };
            });
          setProducts(mapped);
        }
      }

      // Check localStorage for cached categories
      const savedCats = localStorage.getItem('nuradesk_categories');
      if (savedCats) {
        const parsed = JSON.parse(savedCats);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed.map((c: any) => ({ id: String(c.id), name: c.name })));
        }
      }

      // Live Fetch: Get categories and products in parallel from backend API
      setIsLoadingProducts(true);
      Promise.all([
        getCatalogCategories().catch(() => null),
        getCatalogProducts().catch(() => null),
      ])
        .then(([catRes, prodRes]) => {
          const categoryMap = new Map<number, string>();
          const loadedCats: Array<{ id: string; name: string }> = [];

          if (catRes?.data && Array.isArray(catRes.data) && catRes.data.length > 0) {
            catRes.data.forEach((c) => {
              categoryMap.set(Number(c.id), c.name);
              loadedCats.push({ id: String(c.id), name: c.name });
            });
            setCategories(loadedCats);
            try {
              localStorage.setItem('nuradesk_categories', JSON.stringify(catRes.data));
            } catch {}
          }

          if (prodRes?.data && Array.isArray(prodRes.data) && prodRes.data.length > 0) {
            const apiProducts: Product[] = prodRes.data
              .filter((p) => p.status !== 'INACTIVE')
              .map((p) => {
                const basePrice = Number(p.sellingPrice) || 0;
                const prodId = String(p.id);
                const resolvedCat = (p.categoryId ? categoryMap.get(p.categoryId) : undefined)
                  || p.categoryName
                  || (p as any).category
                  || 'General';

                const matchingOffer = autoOffers.find((offer) => {
                  if (offer.appliesTo === 'all') return true;
                  if (offer.appliesTo === 'category' && offer.targetCategories?.includes(resolvedCat)) return true;
                  if (offer.appliesTo === 'products' && offer.targetProductIds?.includes(prodId)) return true;
                  return false;
                });

                if (matchingOffer) {
                  let discountedPrice = basePrice;
                  if (matchingOffer.discountType === 'percentage') {
                    discountedPrice = Math.max(0, basePrice * (1 - matchingOffer.discountValue / 100));
                  } else if (matchingOffer.discountType === 'fixed_amount') {
                    discountedPrice = Math.max(0, basePrice - matchingOffer.discountValue);
                  } else if (matchingOffer.discountType === 'promo_price') {
                    discountedPrice = matchingOffer.discountValue;
                  }
                  discountedPrice = Math.round(discountedPrice * 100) / 100;

                  return {
                    id: prodId,
                    name: p.name,
                    variant: p.unit || 'Standard',
                    price: discountedPrice,
                    originalPrice: basePrice > discountedPrice ? basePrice : undefined,
                    category: resolvedCat,
                    image: (p as any).image || getDefaultImageForCategory(resolvedCat),
                    isOffer: true,
                    offerBadge: matchingOffer.badgeText || 'OFFER',
                  };
                }

                return {
                  id: prodId,
                  name: p.name,
                  variant: p.unit || 'Standard',
                  price: basePrice,
                  category: resolvedCat,
                  image: (p as any).image || getDefaultImageForCategory(resolvedCat),
                  isOffer: false,
                };
              });

            setProducts(apiProducts);
            try {
              localStorage.setItem('nuradesk_products', JSON.stringify(prodRes.data));
            } catch {}
          } else {
            // Keep default products if no database products returned
            setProducts((prev) => (prev.length > 0 ? prev : DEFAULT_STORE_PRODUCTS));
          }
        })
        .catch(() => {})
        .finally(() => {
          setIsLoadingProducts(false);
        });

      const savedCustomers = localStorage.getItem('nuradesk_customers');
      if (savedCustomers) {
        const parsedCust = JSON.parse(savedCustomers);
        if (Array.isArray(parsedCust) && parsedCust.length > 0) {
          setFrequentCustomers(parsedCust.map((c: any) => ({ name: c.name, phone: c.phone })));
        }
      }

      const savedHolds = localStorage.getItem('nuradesk_held_sales');
      if (savedHolds) {
        const parsedHolds = JSON.parse(savedHolds);
        if (Array.isArray(parsedHolds)) {
          setHeldSales(parsedHolds);
        }
      }

      const savedOrders = localStorage.getItem('nuradesk_orders');
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        if (Array.isArray(parsedOrders)) {
          setOrderNumber(`#ORD-${1000 + parsedOrders.length + 1}`);
        }
      }
    } catch (e) {}
  }, []);

  // Sync held sales to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nuradesk_held_sales', JSON.stringify(heldSales));
    } catch (e) {}
  }, [heldSales]);

  // Dynamic categories list: "All Items", plus all categories from backend & products
  const categoriesList = useMemo(() => {
    const catMap = new Map<string, number>();

    // Count products per category
    products.forEach((p) => {
      const cat = p.category || 'General';
      catMap.set(cat, (catMap.get(cat) || 0) + 1);
    });

    // Also include any categories fetched from backend that might not have products yet
    categories.forEach((c) => {
      if (c.name && !catMap.has(c.name)) {
        catMap.set(c.name, 0);
      }
    });

    // Also include any categories saved in localStorage
    try {
      const savedCats = localStorage.getItem('nuradesk_categories');
      if (savedCats) {
        const parsed = JSON.parse(savedCats);
        if (Array.isArray(parsed)) {
          parsed.forEach((c: any) => {
            if (c.name && !catMap.has(c.name)) {
              catMap.set(c.name, 0);
            }
          });
        }
      }
    } catch (e) {}

    const list = [
      {
        id: 'All',
        name: 'All Items',
        count: products.length,
        icon: <RestaurantRoundedIcon sx={{ fontSize: 18 }} />,
      },
    ];

    catMap.forEach((count, catName) => {
      list.push({
        id: catName,
        name: catName,
        count,
        icon: getCategoryIcon(catName),
      });
    });

    return list;
  }, [products, categories]);

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : p.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.variant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));

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
    setCustomerName('');
    setCustomerPhone('');
    setSelectedCustomerId(null);
    setCustomerLoyaltyPoints(0);
    setKotGeneratedCount(0);
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
      tableSection: orderType === 'dine_in' ? tableSection : undefined,
      ticketNumber: orderType === 'takeaway' ? ticketNumber : undefined,
      deliveryPlatform: orderType === 'delivery' ? deliveryPlatform : undefined,
      customerName,
      customerPhone: customerPhone.trim() || undefined,
    };
    if (orderType === 'dine_in') {
      const currentTbl = diningTables.find((t) => t.tableNumber === tableNumber && t.section === tableSection);
      if (currentTbl) {
        handleUpdateTableStatus(currentTbl.id, 'OCCUPIED', newHold.id);
      }
    }
    setHeldSales((prev) => [newHold, ...prev]);
    setCart([]);
    setSaleNote('');
    setPaymentNote('');
    setCustomerName('');
    setCustomerPhone('');
    setSelectedCustomerId(null);
    setCustomerLoyaltyPoints(0);
    setKotGeneratedCount(0);
  };

  const restoreHeldSale = (hold: HeldSale) => {
    setCart(hold.items);
    if (hold.saleNote) setSaleNote(hold.saleNote);
    if (hold.paymentNote) setPaymentNote(hold.paymentNote);
    if (hold.orderType) setOrderType(hold.orderType);
    if (hold.tableNumber) setTableNumber(hold.tableNumber);
    if (hold.tableSection) setTableSection(hold.tableSection);
    if (hold.ticketNumber) setTicketNumber(hold.ticketNumber);
    if (hold.deliveryPlatform) setDeliveryPlatform(hold.deliveryPlatform);
    if (hold.customerName) setCustomerName(hold.customerName);
    if (hold.customerPhone) setCustomerPhone(hold.customerPhone);
    if (hold.orderType === 'dine_in' && hold.tableNumber) {
      const currentTbl = diningTables.find((t) => t.tableNumber === hold.tableNumber);
      if (currentTbl) {
        handleUpdateTableStatus(currentTbl.id, 'OCCUPIED', hold.id);
      }
    }
    setHeldSales((prev) => prev.filter((h) => h.id !== hold.id));
    setActiveNav('new_sale');
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + getItemLineTotal(item), 0);
  const manualDiscount = Math.round((subtotal * discountPct) / 100);
  const discountAmount = manualDiscount + promoDiscountAmount;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(taxableAmount * 0.05); // 5% GST
  const total = taxableAmount + tax;

  const handleApplyCouponCode = (code: string) => {
    if (!code.trim()) {
      setAppliedPromoCode('');
      setPromoDiscountAmount(0);
      setPromoMessage('');
      return;
    }
    const cleanCode = code.trim().toUpperCase();
    const matched = storeOffers.find((o) => o.code?.toUpperCase() === cleanCode);

    if (!matched) {
      setPromoMessage('Invalid coupon code');
      setPromoDiscountAmount(0);
      return;
    }

    if (matched.minSubtotal && subtotal < matched.minSubtotal) {
      setPromoMessage(`Min order of ₹${matched.minSubtotal} required for ${cleanCode}`);
      setPromoDiscountAmount(0);
      return;
    }

    let calculatedDiscount = 0;
    if (matched.discountType === 'percentage') {
      calculatedDiscount = (subtotal * matched.discountValue) / 100;
      if (matched.maxDiscount && calculatedDiscount > matched.maxDiscount) {
        calculatedDiscount = matched.maxDiscount;
      }
    } else if (matched.discountType === 'fixed_amount') {
      calculatedDiscount = Math.min(subtotal, matched.discountValue);
    }

    calculatedDiscount = Math.round(calculatedDiscount);
    setAppliedPromoCode(cleanCode);
    setPromoDiscountAmount(calculatedDiscount);
    setPromoMessage(`Offer applied! Saved ₹${calculatedDiscount}`);
  };

  function calculateTotal() {
    return total;
  }

  const handleProcessPayment = () => {
    setPaymentSuccess(true);

    try {
      const newOrder = {
        id: orderNumber.replace('#', ''),
        orderNumber,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        customerName: customerName.trim() || 'Guest Customer',
        customerPhone: customerPhone.trim() || '',
        items: cart.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          price: getItemUnitPrice(i),
          quantity: i.quantity,
          total: getItemLineTotal(i),
        })),
        subtotal,
        discountAmount,
        taxAmount: tax,
        totalAmount: total,
        total,
        paymentMethod,
        orderType,
        tableNumber: orderType === 'dine_in' ? `${tableSection} - ${tableNumber}` : undefined,
        tableSection: orderType === 'dine_in' ? tableSection : undefined,
        ticketNumber: orderType === 'takeaway' ? ticketNumber : undefined,
        deliveryPlatform: orderType === 'delivery' ? deliveryPlatform : undefined,
        status: 'Completed',
      };
      const existing = JSON.parse(localStorage.getItem('nuradesk_orders') || '[]');
      const updatedOrders = [newOrder, ...existing];
      localStorage.setItem('nuradesk_orders', JSON.stringify(updatedOrders));
      setOrderNumber(`#ORD-${1000 + updatedOrders.length + 1}`);

      // Auto-increment takeaway ticket number for the next takeaway customer
      if (orderType === 'takeaway') {
        const nextNum = parseInt(ticketNumber.replace(/\D/g, '') || '0') + 1;
        setTicketNumber(`TK-${String(nextNum).padStart(2, '0')}`);
      }
      // Free the dining table upon completing the sale
      if (orderType === 'dine_in') {
        const currentTbl = diningTables.find((t) => t.tableNumber === tableNumber && t.section === tableSection);
        if (currentTbl) {
          handleUpdateTableStatus(currentTbl.id, 'VACANT', undefined);
        }
      }
    } catch (e) {}

    setTimeout(() => {
      setPaymentSuccess(false);
      setShowPaymentModal(false);
      setCart([]);
      setSaleNote('');
      setPaymentNote('');
      setCustomerName('');
      setCustomerPhone('');
      setSelectedCustomerId(null);
      setCustomerLoyaltyPoints(0);
      setKotGeneratedCount(0);
      setOrderType('dine_in');
      setTableSection('Main Hall');
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
            @keyframes posGhostShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

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
      flexDirection: 'row',
      fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
      boxSizing: 'border-box',
    }}>
      {/* LEFT COLUMN: TOP HEADER + PRODUCT CATALOG */}
      <div style={{
        flex: 1,
        minWidth: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
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
        {/* Left: 9-Dot Quick Launcher + Nuradesk Logo + Store Logo Pill Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* 9-Dot Quick Launcher Button & Anchored Popup */}
          <div ref={appsMenuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsAppsMenuOpen((prev) => !prev)}
              title="Quick Menu (Held orders, Invoices, Customers, End shift, Dark mode)"
              aria-label="Nine dot quick menu"
              aria-expanded={isAppsMenuOpen}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '0.55rem',
                backgroundColor: isAppsMenuOpen ? theme.hoverBg : 'transparent',
                border: isAppsMenuOpen ? `1px solid ${theme.border}` : '1px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.headerTextPrimary,
                transition: 'all 0.15s ease',
                flexShrink: 0,
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isAppsMenuOpen) e.currentTarget.style.backgroundColor = theme.hoverBg;
              }}
              onMouseLeave={(e) => {
                if (!isAppsMenuOpen) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <AppsRoundedIcon sx={{ fontSize: 22 }} />
              {heldSales.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: theme.textSecondary,
                  }}
                />
              )}
            </button>

            {/* Anchored Popup: Action Menu Container */}
            {isAppsMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '280px',
                  backgroundColor: theme.bgCard,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '14px',
                  boxShadow: themeMode === 'dark'
                    ? '0 16px 36px -4px rgba(0, 0, 0, 0.6), 0 4px 12px -2px rgba(0, 0, 0, 0.4)'
                    : '0 12px 32px -4px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
                  padding: '10px',
                  zIndex: 9999,
                  display: 'flex',
                  flexDirection: 'column',
                  animation: 'posPopupEnter 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  transformOrigin: 'top left',
                }}
              >
                {/* Cashier Info in Popup */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '8px 10px 10px 10px',
                    borderBottom: `1px solid ${theme.border}`,
                    marginBottom: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: theme.sidebarIsDark ? '#27272A' : '#F4F4F5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '13px',
                      color: theme.textPrimary,
                      border: `1px solid ${theme.border}`,
                      flexShrink: 0,
                    }}
                  >
                    {currentCashierName.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: theme.textPrimary,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {currentCashierName}
                    </span>
                    <span style={{ fontSize: '11px', color: theme.textSecondary, fontWeight: 500 }}>
                      Active Cashier
                    </span>
                  </div>
                </div>

                <ActionMenu
                  primaryColor="#007DCC"
                  secondaryColor="#FFB900"
                  items={[
                    {
                      id: 'new_sale',
                      label: 'New sale',
                      icon: <ActionCashRegisterIcon size={22} />,
                      onClick: () => {
                        setActiveNav('new_sale');
                        setIsAppsMenuOpen(false);
                      },
                    },
                    {
                      id: 'held_sales',
                      label: 'Held sales',
                      badge: heldSales.length > 0 ? heldSales.length : undefined,
                      icon: <ActionHeldSalesIcon size={22} />,
                      onClick: () => {
                        setActiveNav('held_sales');
                        setIsAppsMenuOpen(false);
                      },
                    },
                    {
                      id: 'invoices',
                      label: 'Invoices',
                      icon: <ActionInvoicesIcon size={22} />,
                      onClick: () => {
                        setActiveNav('invoices');
                        setIsAppsMenuOpen(false);
                      },
                    },
                    {
                      id: 'customers',
                      label: 'Customers',
                      badge: effectiveCustomers.length > 0 ? effectiveCustomers.length : undefined,
                      icon: <ActionCustomersIcon size={22} />,
                      onClick: () => {
                        setActiveNav('customers');
                        setIsAppsMenuOpen(false);
                      },
                    },
                    {
                      id: 'cash_movement',
                      label: 'Cash in / out',
                      icon: <AccountBalanceWalletRoundedIcon sx={{ fontSize: 22, color: 'currentColor' }} />,
                      onClick: () => {
                        setShowCashMovementModal(true);
                        setIsAppsMenuOpen(false);
                      },
                    },
                    {
                      id: 'end_shift',
                      label: 'End shift',
                      icon: <ActionEndShiftIcon size={22} />,
                      onClick: () => {
                        setShowEndShiftModal(true);
                        setIsAppsMenuOpen(false);
                      },
                    },
                    {
                      id: 'dark_mode',
                      label: themeMode === 'light' ? 'Dark mode' : 'Light mode',
                      icon: <ActionDarkModeIcon size={22} isDarkMode={themeMode === 'dark'} />,
                      onClick: handleToggleTheme,
                    },
                  ]}
                  activeItem={activeNav}
                  isDarkMode={themeMode === 'dark'}
                />

                {/* Divider & Solid Black Logout Button */}
                <div
                  style={{
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: `1px solid ${theme.border}`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsAppsMenuOpen(false);
                      handleLogout();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      backgroundColor: '#000000',
                      color: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      transition: 'opacity 0.15s ease',
                      width: '100%',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.85';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    <LogoutRoundedIcon sx={{ fontSize: 17, color: '#FFFFFF' }} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

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

        </div>

        {/* Center: Live Time Digital Clock & Active Shift Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          {isLoadingShift ? (
            <div style={{
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: '9999px',
              backgroundColor: theme.bgCardSubtle,
              border: `1px solid ${theme.border}`,
              color: theme.textSecondary,
            }}>
              Checking Shift...
            </div>
          ) : activeShift ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#16A34A',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22C55E', display: 'inline-block' }} />
              <span>Shift #{activeShift.shiftId} ({activeShift.terminalId}) • Float: ₹{activeShift.openingFloat.toFixed(2)}</span>
            </div>
          ) : (
            <Link
              href="/start-shift"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(234, 179, 8, 0.12)',
                border: '1px solid rgba(234, 179, 8, 0.4)',
                color: '#CA8A04',
                textDecoration: 'none',
              }}
            >
              <WarningAmberRoundedIcon sx={{ fontSize: 14 }} />
              <span>No Shift Active • Open Shift</span>
            </Link>
          )}

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

      </header>

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
          {/* Top Search Bar with Barcode Scanner Icon (Only in New Sale / Catalog view) */}
          {activeNav === 'new_sale' && (
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
          )}

          {/* Category Filter: Horizontal Scrollable Pill Tabs */}
          {activeNav === 'new_sale' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              overflowX: 'auto',
              marginBottom: '1.1rem',
              paddingBottom: '4px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            } as React.CSSProperties}
          >
            {categoriesList.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    flexShrink: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.52rem 0.9rem',
                    minHeight: '36px',
                    height: 'auto',
                    borderRadius: '999px',
                    border: isSelected
                      ? `1.5px solid ${theme.sidebarIsDark ? '#FFFFFF' : '#191a19'}`
                      : `1px solid ${theme.border}`,
                    backgroundColor: isSelected
                      ? (theme.sidebarIsDark ? '#272827' : '#191a19')
                      : 'transparent',
                    color: isSelected ? '#FFFFFF' : theme.textPrimary,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '13px',
                    fontWeight: isSelected ? 700 : 500,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    boxShadow: 'none',
                    transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                  }}
                >
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: isSelected ? '#FFFFFF' : theme.textSecondary,
                    fontSize: '16px',
                    lineHeight: 1,
                  }}>
                    {cat.icon}
                  </span>
                  {cat.name}
                </button>
              );
            })}
          </div>
          )}

          {/* Products Section Heading */}
          {activeNav === 'new_sale' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.65rem',
              padding: '0 2px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: theme.textPrimary,
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}>
                  {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                </h2>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: theme.textSecondary,
                  backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#F1F5F9',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: `1px solid ${theme.border}`,
                }}>
                  {filteredProducts.length} items
                </span>
              </div>
            </div>
          )}

          {/* Main Product Grid or Held Sales / Invoices Views */}
          {activeNav === 'new_sale' ? (
            filteredProducts.length === 0 ? (
              <div style={{
                padding: '3.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: 'transparent',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                margin: '0.5rem 0',
              }}>
                <RestaurantRoundedIcon sx={{ fontSize: 44, color: theme.textMuted, opacity: 0.35 }} />
                <div style={{ fontSize: '15px', fontWeight: 800, color: theme.textPrimary }}>
                  {products.length === 0 ? 'No products in catalog' : 'No matching products'}
                </div>
                <div style={{ fontSize: '12.5px', color: theme.textSecondary, maxWidth: '340px', lineHeight: 1.4 }}>
                  {products.length === 0
                    ? 'Your product catalog is currently empty. Add products in Product Management to begin ringing up sales.'
                    : 'Try selecting another category or clearing your search query.'}
                </div>
              </div>
            ) : (
              /* PRODUCT CATALOG GRID */
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
                        boxShadow: 'none',
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
                          style={{
                            objectFit: 'contain',
                            objectPosition: 'center',
                            padding: '0.65rem',
                            backgroundColor: theme.bgCardSubtle,
                          }}
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
                            backgroundColor: '#F59E0B',
                            color: '#FFFFFF',
                            borderRadius: '9999px',
                            padding: '2px 8px',
                            fontSize: '10px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                          }}>
                            {p.offerBadge || 'Offer'}
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div style={{ padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1, justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              color: theme.textSecondary,
                              backgroundColor: theme.sidebarIsDark ? theme.bgCardSubtle : '#F1F5F9',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              letterSpacing: '0.02em',
                              textTransform: 'uppercase',
                            }}>
                              {p.category || 'General'}
                            </span>
                          </div>
                          <span style={{ fontSize: '14.5px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.015em', display: 'block' }}>
                            {p.name}
                          </span>
                          <span style={{ fontSize: '12px', color: theme.textSecondary, display: 'block' }}>
                            {p.variant}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', marginTop: '0.45rem' }}>
                          <span style={{ fontSize: '16px', fontWeight: 800, color: p.isOffer ? '#059669' : theme.textPrimary }}>
                            ₹{p.price}
                          </span>
                          {p.isOffer && p.originalPrice && p.originalPrice > p.price && (
                            <span style={{ fontSize: '12px', color: theme.textSecondary, textDecoration: 'line-through' }}>
                              ₹{p.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : activeNav === 'held_sales' ? (
            /* Held Sales List View with Real Search & Ghost Skeleton */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>
                    Held Sales ({filteredHeldSales.length})
                  </h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: theme.textSecondary }}>
                    Resume active suspended sales or park a new order.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {/* Real Search Bar */}
                  <div style={{ position: 'relative', width: '260px' }}>
                    <SearchRoundedIcon sx={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: 18,
                      color: theme.textSecondary,
                    }} />
                    <input
                      type="text"
                      placeholder="Search held sales..."
                      value={heldSearchQuery}
                      onChange={(e) => setHeldSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        height: '36px',
                        padding: '0 28px 0 32px',
                        backgroundColor: theme.bgCard,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '0.55rem',
                        color: theme.textPrimary,
                        fontSize: '12.5px',
                        outline: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                    {heldSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setHeldSearchQuery('')}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: theme.textSecondary,
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                        }}
                      >
                        <CloseRoundedIcon sx={{ fontSize: 15 }} />
                      </button>
                    )}
                  </div>

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
                      padding: '0.45rem 0.85rem',
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
              </div>

              {isLoadingHeldSales ? (
                renderGhostSkeletonCards(3)
              ) : filteredHeldSales.length === 0 ? (
                <div style={{
                  padding: '3rem 1.5rem',
                  textAlign: 'center',
                  color: theme.textMuted,
                  backgroundColor: theme.bgCardSubtle,
                  borderRadius: '1rem',
                  border: `1px solid ${theme.border}`,
                }}>
                  <PauseCircleOutlineRoundedIcon sx={{ fontSize: 40, opacity: 0.35, marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '14.5px', fontWeight: 700, color: theme.textPrimary }}>
                    {heldSearchQuery ? `No held sales matching "${heldSearchQuery}"` : 'No sales currently on hold'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: theme.textSecondary, marginTop: '4px' }}>
                    {heldSearchQuery ? 'Try clearing your search query' : 'Park sales from the ticket sidebar to resume them later.'}
                  </div>
                </div>
              ) : (
                filteredHeldSales.map((h) => (
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
                      gap: '1rem',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14.5px', fontWeight: 800, color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
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
                            {h.orderType === 'dine_in'
                              ? `Dine In (${h.tableSection ? h.tableSection + ' • ' : ''}${h.tableNumber || 'Table'})`
                              : h.orderType === 'takeaway'
                              ? `Takeaway (${h.ticketNumber || 'Ticket'})`
                              : `Delivery (${h.deliveryPlatform || 'Direct'})`}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '0.2rem' }}>
                        {h.customerName && h.customerName !== 'Guest Customer' ? `${h.customerName} • ` : ''}Held {h.time} • Total: ₹{h.total}
                      </div>
                      <div style={{ fontSize: '11px', color: theme.textSecondary, marginTop: '0.25rem', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {h.items.map((i) => `${i.product.name} ×${i.quantity}`).join(', ')}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setHeldSales((prev) => prev.filter((item) => item.id !== h.id))}
                        title="Discard held sale"
                        style={{
                          background: 'none',
                          border: `1px solid ${theme.border}`,
                          borderRadius: '0.55rem',
                          color: '#EF4444',
                          cursor: 'pointer',
                          padding: '0.45rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                      </button>
                      <button
                        type="button"
                        onClick={() => restoreHeldSale(h)}
                        className="button-20"
                        style={{
                          padding: '0.5rem 1.1rem',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          backgroundColor: theme.posBtnBg,
                          color: theme.posBtnText,
                          borderRadius: '0.65rem',
                          cursor: 'pointer',
                          border: 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Resume Sale
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : activeNav === 'invoices' ? (
            /* Invoices List View with Real Search & Ghost Skeleton */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>
                    Recent Invoices ({filteredInvoices.length})
                  </h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: theme.textSecondary }}>
                    Completed sales bills with payment breakdown and timestamps.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {/* Real Search Bar */}
                  <div style={{ position: 'relative', width: '260px' }}>
                    <SearchRoundedIcon sx={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: 18,
                      color: theme.textSecondary,
                    }} />
                    <input
                      type="text"
                      placeholder="Search invoices by #, customer, pay mode..."
                      value={invoiceSearchQuery}
                      onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        height: '36px',
                        padding: '0 28px 0 32px',
                        backgroundColor: theme.bgCard,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '0.55rem',
                        color: theme.textPrimary,
                        fontSize: '12.5px',
                        outline: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                    {invoiceSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setInvoiceSearchQuery('')}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: theme.textSecondary,
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                        }}
                      >
                        <CloseRoundedIcon sx={{ fontSize: 15 }} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={loadInvoices}
                    title="Refresh Invoices"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '36px',
                      height: '36px',
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '0.55rem',
                      color: theme.textSecondary,
                      cursor: 'pointer',
                    }}
                  >
                    <RestartAltRoundedIcon sx={{ fontSize: 18 }} />
                  </button>

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
                      padding: '0.45rem 0.85rem',
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
              </div>

              {isLoadingInvoices ? (
                renderGhostSkeletonCards(4)
              ) : filteredInvoices.length === 0 ? (
                <div style={{
                  padding: '3rem 1.5rem',
                  textAlign: 'center',
                  color: theme.textMuted,
                  backgroundColor: theme.bgCardSubtle,
                  borderRadius: '1rem',
                  border: `1px solid ${theme.border}`,
                }}>
                  <ReceiptLongRoundedIcon sx={{ fontSize: 40, opacity: 0.35, marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '14.5px', fontWeight: 700, color: theme.textPrimary }}>
                    {invoiceSearchQuery ? `No invoices matching "${invoiceSearchQuery}"` : 'No invoices recorded today'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: theme.textSecondary, marginTop: '4px' }}>
                    {invoiceSearchQuery ? 'Try searching by bill #, customer name or payment type' : 'Ring up sales in the register to see completed invoices.'}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {filteredInvoices.map((inv, idx) => {
                    const billNo = inv.orderNumber || inv.billNumber || `#INV-${inv.id || idx + 1}`;
                    const itemsCount = Array.isArray(inv.items) ? inv.items.reduce((s: number, i: any) => s + (i.quantity || 1), 0) : 0;
                    const itemsSummary = Array.isArray(inv.items)
                      ? inv.items.map((i: any) => `${i.name || i.productName || 'Item'} ×${i.quantity || 1}`).join(', ')
                      : '';
                    const totalAmt = inv.totalAmount || inv.total || 0;
                    const payMethod = inv.paymentMethod || 'CASH';

                    return (
                      <div
                        key={inv.id || inv.orderNumber || idx}
                        style={{
                          padding: '1.1rem 1.25rem',
                          backgroundColor: theme.bgCard,
                          border: `1px solid ${theme.border}`,
                          borderRadius: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          transition: 'border-color 0.15s ease',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '14.5px', fontWeight: 800, color: theme.textPrimary }}>
                              {billNo}
                            </span>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: '9999px',
                              backgroundColor: 'rgba(34, 197, 94, 0.12)',
                              color: '#16A34A',
                              border: '1px solid rgba(34, 197, 94, 0.3)',
                            }}>
                              Paid
                            </span>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: '9999px',
                              backgroundColor: theme.bgCardSubtle,
                              color: theme.textSecondary,
                              border: `1px solid ${theme.border}`,
                            }}>
                              {payMethod}
                            </span>
                            {inv.orderType && (
                              <span style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '2px 7px',
                                borderRadius: '9999px',
                                backgroundColor: theme.bgCardSubtle,
                                color: theme.activeBg,
                                border: `1px solid ${theme.border}`,
                              }}>
                                {inv.orderType === 'dine_in' ? 'Dine In' : inv.orderType === 'takeaway' ? 'Takeaway' : 'Delivery'}
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize: '12.5px', color: theme.textSecondary, marginTop: '0.25rem' }}>
                            {inv.customerName && inv.customerName !== 'Guest Customer' ? `${inv.customerName} • ` : ''}
                            {inv.date || 'Today'} {inv.timestamp ? `at ${inv.timestamp}` : ''} • {itemsCount} items
                          </div>

                          {itemsSummary && (
                            <div style={{
                              fontSize: '11.5px',
                              color: theme.textSecondary,
                              opacity: 0.8,
                              marginTop: '0.25rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {itemsSummary}
                            </div>
                          )}
                        </div>

                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary }}>
                            ₹{Number(totalAmt).toFixed(2)}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              alert(`Invoice ${billNo}\nCustomer: ${inv.customerName || 'Guest'}\nItems: ${itemsSummary}\nTotal: ₹${totalAmt}\nPayment: ${payMethod}`);
                            }}
                            style={{
                              marginTop: '0.35rem',
                              fontSize: '11.5px',
                              fontWeight: 600,
                              color: theme.textSecondary,
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '2px 6px',
                              textDecoration: 'underline',
                            }}
                          >
                            View Receipt
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Customers Directory View with Real Search & Ghost Skeleton */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>
                    Customer Directory ({filteredCustomers.length})
                  </h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: theme.textSecondary }}>
                    Search customer loyalty records or add a new customer to this store.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {/* Real Search Bar */}
                  <div style={{ position: 'relative', width: '260px' }}>
                    <SearchRoundedIcon sx={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: 18,
                      color: theme.textSecondary,
                    }} />
                    <input
                      type="text"
                      placeholder="Search by name, phone, email..."
                      value={customerSearchQuery}
                      onChange={(e) => setCustomerSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        height: '36px',
                        padding: '0 28px 0 32px',
                        backgroundColor: theme.bgCard,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '0.55rem',
                        color: theme.textPrimary,
                        fontSize: '12.5px',
                        outline: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                    {customerSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setCustomerSearchQuery('')}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: theme.textSecondary,
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                        }}
                      >
                        <CloseRoundedIcon sx={{ fontSize: 15 }} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddCustomerModal(true)}
                    className="button-20"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.45rem 0.85rem',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      backgroundColor: theme.posBtnBg,
                      color: theme.posBtnText,
                      borderRadius: '0.55rem',
                      cursor: 'pointer',
                      border: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <PersonAddAltRoundedIcon sx={{ fontSize: 16 }} />
                    <span>+ Add Customer</span>
                  </button>

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
                      padding: '0.45rem 0.85rem',
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
              </div>

              {isLoadingCustomers ? (
                renderGhostSkeletonCards(4)
              ) : filteredCustomers.length === 0 ? (
                <div style={{
                  padding: '3rem 1.5rem',
                  textAlign: 'center',
                  color: theme.textMuted,
                  backgroundColor: theme.bgCardSubtle,
                  borderRadius: '1rem',
                  border: `1px solid ${theme.border}`,
                }}>
                  <PeopleAltRoundedIcon sx={{ fontSize: 40, opacity: 0.35, marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '14.5px', fontWeight: 700, color: theme.textPrimary }}>
                    {customerSearchQuery ? `No customers matching "${customerSearchQuery}"` : 'No customers registered yet'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: theme.textSecondary, marginTop: '4px' }}>
                    Click "+ Add Customer" above to register a new loyalty member.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
                  {filteredCustomers.map((cust) => (
                    <div
                      key={cust.id}
                      style={{
                        padding: '1.1rem 1.25rem',
                        backgroundColor: theme.bgCard,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '0.85rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.85rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: theme.sidebarIsDark ? '#27272A' : '#F1F5F9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '15px',
                          fontWeight: 800,
                          color: theme.activeBg,
                          border: `1px solid ${theme.border}`,
                          flexShrink: 0,
                        }}>
                          {cust.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: '14.5px', fontWeight: 800, color: theme.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {cust.name}
                          </div>
                          <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '2px' }}>
                            {cust.phone}
                          </div>
                          {cust.email && (
                            <div style={{ fontSize: '11px', color: theme.textSecondary, opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {cust.email}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '0.65rem',
                        borderTop: `1px solid ${theme.border}`,
                      }}>
                        <div style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: 'rgba(234, 179, 8, 0.12)',
                          color: '#CA8A04',
                          border: '1px solid rgba(234, 179, 8, 0.3)',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                        }}>
                          ★ {cust.loyaltyPoints || 0} Points
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setCustomerName(cust.name);
                            setCustomerPhone(cust.phone);
                            setSelectedCustomerId(cust.id);
                            setCustomerLoyaltyPoints(cust.loyaltyPoints || 0);
                            setActiveNav('new_sale');
                          }}
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            backgroundColor: theme.activeBg,
                            color: theme.activeText,
                            borderRadius: '0.45rem',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          Select for Sale
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* RIGHT COLUMN: CURRENT SALE TICKET / CHECKOUT (FULL HEIGHT TO TOP) */}
      <aside style={{
        width: '420px',
        height: '100%',
        backgroundColor: theme.bgCard,
        borderLeft: `1px solid ${theme.border}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        boxSizing: 'border-box',
      }}>
        {/* Ticket Header (Aligned with left header height of 62px) */}
        <div style={{
          height: '62px',
          padding: '0 1rem',
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.bgCard,
          flexShrink: 0,
          boxSizing: 'border-box',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: cart.length > 0 ? '#10B981' : theme.textMuted,
              boxShadow: cart.length > 0 ? '0 0 8px rgba(16, 185, 129, 0.6)' : 'none',
              flexShrink: 0,
            }} />
            <h2 style={{
              fontSize: '15.5px',
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
              {orderNumber}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {/* Dine-In KOT Badge (if KOT generated) */}
            {orderType === 'dine_in' && kotGeneratedCount > 0 && (
              <button
                type="button"
                onClick={handleSendKot}
                title="View Kitchen Order Ticket"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  padding: '3px 7px',
                  borderRadius: '0.45rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#059669',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <KitchenRoundedIcon sx={{ fontSize: 13 }} />
                <span>KOT ({kotGeneratedCount})</span>
              </button>
            )}

            {/* Sale Note Button */}
            <button
              type="button"
              onClick={() => setShowSaleNoteModal(true)}
              title={saleNote ? `Sale Note: ${saleNote}` : 'Add Sale Note'}
              style={{
                background: saleNote ? theme.hoverBg : 'transparent',
                border: saleNote ? `1px solid ${theme.activeBg}` : `1px solid ${theme.border}`,
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
                border: paymentNote ? `1px solid ${theme.activeBg}` : `1px solid ${theme.border}`,
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
                  border: `1px solid ${theme.border}`,
                  color: theme.textMuted,
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '0.45rem',
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '2px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = '#EF4444'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = theme.textMuted; e.currentTarget.style.borderColor = theme.border; }}
              >
                <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
              </button>
            )}
          </div>
        </div>

        {/* Order Type Buttons & Context Bar */}
        <div style={{
          padding: '0.65rem 0.95rem 0.55rem',
          backgroundColor: theme.bgCard,
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.55rem',
        }}>
          {/* iOS-Style Modern Segmented Control */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '3px',
            padding: '3px',
            borderRadius: '0.65rem',
            backgroundColor: theme.sidebarIsDark ? '#1C1D21' : '#F1F5F9',
            border: `1px solid ${theme.border}`,
          }}>
            {/* Dine In Button */}
            <button
              type="button"
              onClick={() => setOrderType('dine_in')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.42rem 0.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: orderType === 'dine_in'
                  ? (theme.sidebarIsDark ? '#2E2F38' : '#FFFFFF')
                  : 'transparent',
                color: orderType === 'dine_in'
                  ? (theme.sidebarIsDark ? '#FFFFFF' : '#000000')
                  : theme.textSecondary,
                fontSize: '12px',
                fontWeight: orderType === 'dine_in' ? 800 : 600,
                cursor: 'pointer',
                outline: 'none',
                boxShadow: orderType === 'dine_in' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit',
                userSelect: 'none',
              }}
            >
              <RestaurantRoundedIcon sx={{ fontSize: 15 }} />
              <span>Dine In</span>
            </button>

            {/* Takeaway Button */}
            <button
              type="button"
              onClick={() => setOrderType('takeaway')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.42rem 0.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: orderType === 'takeaway'
                  ? (theme.sidebarIsDark ? '#2E2F38' : '#FFFFFF')
                  : 'transparent',
                color: orderType === 'takeaway'
                  ? (theme.sidebarIsDark ? '#FFFFFF' : '#000000')
                  : theme.textSecondary,
                fontSize: '12px',
                fontWeight: orderType === 'takeaway' ? 800 : 600,
                cursor: 'pointer',
                outline: 'none',
                boxShadow: orderType === 'takeaway' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit',
                userSelect: 'none',
              }}
            >
              <TakeoutDiningRoundedIcon sx={{ fontSize: 15 }} />
              <span>Takeaway</span>
            </button>

            {/* Delivery Button */}
            <button
              type="button"
              onClick={() => setOrderType('delivery')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.42rem 0.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: orderType === 'delivery'
                  ? (theme.sidebarIsDark ? '#2E2F38' : '#FFFFFF')
                  : 'transparent',
                color: orderType === 'delivery'
                  ? (theme.sidebarIsDark ? '#FFFFFF' : '#000000')
                  : theme.textSecondary,
                fontSize: '12px',
                fontWeight: orderType === 'delivery' ? 800 : 600,
                cursor: 'pointer',
                outline: 'none',
                boxShadow: orderType === 'delivery' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit',
                userSelect: 'none',
              }}
            >
              <DeliveryDiningRoundedIcon sx={{ fontSize: 15 }} />
              <span>Delivery</span>
            </button>
          </div>

          {/* DINE IN ADVANCED MANAGEMENT CARD */}
          {orderType === 'dine_in' && (
            <div style={{
              backgroundColor: theme.sidebarIsDark ? '#18191E' : '#F8FAFC',
              border: `1px solid ${theme.border}`,
              borderRadius: '0.75rem',
              padding: '0.6rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}>
              {/* Row 1: Table & Floor plan selector */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '7px',
                    backgroundColor: theme.sidebarIsDark ? '#27272A' : '#EFF6FF',
                    color: theme.activeBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <TableBarRoundedIcon sx={{ fontSize: 17 }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: theme.textPrimary, whiteSpace: 'nowrap' }}>
                        {tableSection} • {tableNumber}
                      </span>
                      <span style={{
                        fontSize: '9.5px',
                        fontWeight: 800,
                        padding: '1px 5px',
                        borderRadius: '999px',
                        backgroundColor: currentTableObj.status === 'OCCUPIED' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)',
                        color: currentTableObj.status === 'OCCUPIED' ? '#DC2626' : '#16A34A',
                        border: `1px solid ${currentTableObj.status === 'OCCUPIED' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(34, 197, 94, 0.25)'}`,
                      }}>
                        ● {currentTableObj.status || 'VACANT'}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: theme.textSecondary, marginTop: '1px' }}>
                      {currentTableObj.capacity || 4} Seats Capacity
                    </div>
                  </div>
                </div>

                {/* Floor Plan Button */}
                <button
                  type="button"
                  onClick={() => setShowFloorPlanModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.35rem 0.65rem',
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '0.5rem',
                    color: theme.activeBg,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  <MapRoundedIcon sx={{ fontSize: 14 }} />
                  <span>Floor Plan</span>
                </button>
              </div>

              {/* Row 2: Guests / Covers Stepper + KOT & Transfer Table actions */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.45rem',
                borderTop: `1px solid ${theme.border}`,
                gap: '0.45rem',
              }}>
                {/* Guests Stepper */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <GroupsRoundedIcon sx={{ fontSize: 15, color: theme.textSecondary }} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: theme.textSecondary }}>Guests:</span>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '5px',
                    padding: '1px 2px',
                  }}>
                    <button
                      type="button"
                      onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                      style={{
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: theme.textSecondary,
                        padding: 0,
                      }}
                    >
                      <RemoveRoundedIcon sx={{ fontSize: 11 }} />
                    </button>
                    <span style={{ width: '16px', textAlign: 'center', fontSize: '11px', fontWeight: 800, color: theme.textPrimary }}>
                      {guestCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuestCount((g) => Math.min(20, g + 1))}
                      style={{
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: theme.textSecondary,
                        padding: 0,
                      }}
                    >
                      <AddRoundedIcon sx={{ fontSize: 11 }} />
                    </button>
                  </div>
                </div>

                {/* Dine In Actions: KOT & Move Table */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    type="button"
                    disabled={cart.length === 0}
                    onClick={handleSendKot}
                    title="Send Kitchen Order Ticket"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.3rem 0.55rem',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: cart.length > 0 ? (kotGeneratedCount > 0 ? '#10B981' : '#000000') : theme.bgCard,
                      color: cart.length > 0 ? '#FFFFFF' : theme.textMuted,
                      border: `1px solid ${cart.length > 0 ? 'transparent' : theme.border}`,
                      borderRadius: '0.45rem',
                      cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                      opacity: cart.length === 0 ? 0.6 : 1,
                      fontFamily: 'inherit',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <KitchenRoundedIcon sx={{ fontSize: 13 }} />
                    <span>{kotGeneratedCount > 0 ? `KOT (${kotGeneratedCount})` : 'Send KOT'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowTransferTableModal(true)}
                    title="Move order to another table"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      padding: '0.3rem 0.45rem',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '0.45rem',
                      color: theme.textSecondary,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <SwapHorizRoundedIcon sx={{ fontSize: 14 }} />
                    <span>Move</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAKEAWAY TOKEN CARD */}
          {orderType === 'takeaway' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: theme.sidebarIsDark ? '#18191E' : '#F8FAFC',
              border: `1px solid ${theme.border}`,
              borderRadius: '0.75rem',
              padding: '0.5rem 0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ConfirmationNumberRoundedIcon sx={{ fontSize: 16, color: theme.activeBg }} />
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: theme.textSecondary }}>Takeaway Token:</span>
                <input
                  type="text"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  title="Takeaway Ticket / Token Number"
                  style={{
                    width: '72px',
                    height: '26px',
                    padding: '0 4px',
                    borderRadius: '5px',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgCard,
                    color: theme.textPrimary,
                    fontSize: '12px',
                    fontWeight: 800,
                    textAlign: 'center',
                    outline: 'none',
                    fontFamily: 'monospace',
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  const num = parseInt(ticketNumber.replace(/\D/g, '') || '0') + 1;
                  setTicketNumber(`TK-${String(num).padStart(2, '0')}`);
                }}
                title="Next Ticket Number (+1)"
                style={{
                  height: '26px',
                  padding: '0 8px',
                  borderRadius: '5px',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.bgCard,
                  color: theme.textPrimary,
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                +1 Next
              </button>
            </div>
          )}

          {/* DELIVERY PARTNER CARD */}
          {orderType === 'delivery' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: theme.sidebarIsDark ? '#18191E' : '#F8FAFC',
              border: `1px solid ${theme.border}`,
              borderRadius: '0.75rem',
              padding: '0.5rem 0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <DeliveryDiningRoundedIcon sx={{ fontSize: 16, color: theme.activeBg }} />
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: theme.textSecondary }}>Platform:</span>
              </div>
              <select
                value={deliveryPlatform}
                onChange={(e) => setDeliveryPlatform(e.target.value)}
                style={{
                  height: '28px',
                  padding: '0 8px',
                  borderRadius: '5px',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.bgCard,
                  color: theme.textPrimary,
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              >
                <option value="Direct">Direct Delivery</option>
                <option value="Zomato">Zomato</option>
                <option value="Swiggy">Swiggy</option>
                <option value="UberEats">UberEats</option>
              </select>
            </div>
          )}
        </div>

        {/* MANDATORY CUSTOMER SECTION */}
        <div style={{
          padding: '0.55rem 0.95rem',
          backgroundColor: theme.bgCard,
          borderBottom: `1px solid ${theme.border}`,
        }}>
          {!isCustomerValid ? (
            /* Unverified: Mandatory Customer Alert Box */
            <div style={{
              padding: '0.65rem 0.75rem',
              borderRadius: '0.65rem',
              backgroundColor: theme.sidebarIsDark ? 'rgba(234, 179, 8, 0.1)' : '#FEF9C3',
              border: `1px solid ${theme.sidebarIsDark ? 'rgba(234, 179, 8, 0.3)' : '#FDE047'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                <PersonAddAltRoundedIcon sx={{ fontSize: 18, color: '#CA8A04', flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 800, color: theme.sidebarIsDark ? '#FACC15' : '#854D0E' }}>
                    Customer Mandatory
                  </div>
                  <div style={{ fontSize: '10.5px', color: theme.sidebarIsDark ? '#D4D4D8' : '#713F12', opacity: 0.9 }}>
                    Name & phone required for sale
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAddCustomerError(null);
                  setShowAddCustomerModal(true);
                }}
                style={{
                  padding: '0.38rem 0.75rem',
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '0.45rem',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  fontFamily: 'inherit',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              >
                + Add Customer
              </button>
            </div>
          ) : (
            /* Verified Customer Chip */
            <div style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '0.65rem',
              backgroundColor: theme.sidebarIsDark ? 'rgba(34, 197, 94, 0.08)' : '#F0FDF4',
              border: `1px solid ${theme.sidebarIsDark ? 'rgba(34, 197, 94, 0.25)' : '#BBF7D0'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 800,
                  flexShrink: 0,
                }}>
                  {customerName.charAt(0).toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: '12.5px',
                    fontWeight: 800,
                    color: theme.textPrimary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {customerName}
                    </span>
                    <CheckCircleRoundedIcon sx={{ fontSize: 14, color: '#16A34A' }} />
                  </div>
                  <div style={{ fontSize: '10.5px', color: theme.textSecondary }}>
                    {customerPhone}
                    {customerLoyaltyPoints > 0 && (
                      <span style={{ marginLeft: '6px', color: '#CA8A04', fontWeight: 800 }}>
                        • ★ {customerLoyaltyPoints} Pts
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => {
                    setAddCustomerError(null);
                    setShowAddCustomerModal(true);
                  }}
                  style={{
                    padding: '2px 7px',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    backgroundColor: 'transparent',
                    color: theme.activeBg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomerName('');
                    setCustomerPhone('');
                    setSelectedCustomerId(null);
                    setCustomerLoyaltyPoints(0);
                  }}
                  title="Remove Customer"
                  style={{
                    padding: '2px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: theme.textMuted,
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 15 }} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.65rem 0.95rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
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
              <ReceiptLongRoundedIcon sx={{ fontSize: 38, color: theme.border }} />
              <span style={{ fontSize: '14px', fontWeight: 700, color: theme.textSecondary }}>Ticket is empty</span>
              <span style={{ fontSize: '12px', maxWidth: '210px', color: theme.textMuted }}>
                Tap any product from the catalog to add items to this sale.
              </span>
            </div>
          ) : (
            cart.map((item) => {
              const hasCustomPrice = item.customPrice !== undefined && item.customPrice !== item.product.price;
              const discAmt = getItemDiscountAmount(item);
              const lineTotal = getItemLineTotal(item);

              return (
                <div
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.45rem 0.55rem',
                    borderRadius: '0.65rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgCardSubtle,
                  }}
                >
                  {/* Thumbnail / Emoji */}
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '7px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                  }}>
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '3px' }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '17px',
                      }}>🍽️</div>
                    )}
                  </div>

                  {/* Name + Price + Discount */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: theme.textPrimary,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: '11px', color: theme.textSecondary, marginTop: '1px' }}>
                      {hasCustomPrice ? (
                        <><s style={{ opacity: 0.5 }}>₹{item.product.price}</s> <strong style={{ color: theme.activeBg }}>₹{item.customPrice}</strong></>
                      ) : (
                        item.product.variant || `₹${item.product.price}`
                      )}
                    </div>
                    {discAmt > 0 && (
                      <span style={{
                        fontSize: '9.5px',
                        fontWeight: 800,
                        backgroundColor: 'rgba(239, 68, 68, 0.12)',
                        color: '#DC2626',
                        padding: '1px 5px',
                        borderRadius: '4px',
                      }}>
                        {item.discountPct ? `${item.discountPct}% OFF` : `-₹${item.discountAmount}`}
                      </span>
                    )}
                    {item.itemNote && (
                      <div style={{ fontSize: '10px', color: theme.activeBg, marginTop: '2px' }}>
                        📝 {item.itemNote}
                      </div>
                    )}
                  </div>

                  {/* Quantity Stepper */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '6px',
                      padding: '1px 2px',
                      flexShrink: 0,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, -1)}
                      style={{
                        width: '20px', height: '20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'none', border: 'none',
                        color: theme.textSecondary, cursor: 'pointer', padding: 0,
                      }}
                    >
                      <RemoveRoundedIcon sx={{ fontSize: 12 }} />
                    </button>
                    <span style={{
                      width: '20px', textAlign: 'center',
                      fontSize: '12px', fontWeight: 800, color: theme.textPrimary,
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, 1)}
                      style={{
                        width: '20px', height: '20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'none', border: 'none',
                        color: theme.textSecondary, cursor: 'pointer', padding: 0,
                      }}
                    >
                      <AddRoundedIcon sx={{ fontSize: 12 }} />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div style={{
                    width: '52px',
                    textAlign: 'right',
                    fontSize: '13px',
                    fontWeight: 800,
                    color: theme.textPrimary,
                    flexShrink: 0,
                  }}>
                    ₹{lineTotal}
                  </div>

                  {/* Delete Item */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, -item.quantity); }}
                    title="Remove Item"
                    style={{
                      background: 'none', border: 'none',
                      color: theme.textMuted, cursor: 'pointer',
                      padding: '2px', display: 'flex', alignItems: 'center',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#EF4444'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = theme.textMuted; }}
                  >
                    <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Ticket Summary & Checkout Footer */}
        <div style={{
          padding: '0.65rem 0.95rem 0.85rem',
          backgroundColor: theme.bgCard,
          borderTop: `1px solid ${theme.border}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
        }}>
          {/* Subtotal, Discount, Tax */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: theme.textSecondary }}>
              <span>Subtotal</span>
              <span style={{ color: theme.textPrimary, fontWeight: 700 }}>₹{subtotal}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: theme.textSecondary, alignItems: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                Discount{' '}
                {discountPct > 0 ? (
                  <>
                    <span style={{ color: '#DC2626', fontWeight: 700 }}>({discountPct}%)</span>
                    <button
                      type="button"
                      aria-label="Remove discount"
                      onClick={() => setDiscountPct(0)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '15px',
                        height: '15px',
                        borderRadius: '50%',
                        border: '1px solid rgba(220, 38, 38, 0.45)',
                        background: 'rgba(220, 38, 38, 0.08)',
                        color: '#DC2626',
                        cursor: 'pointer',
                        padding: 0,
                        lineHeight: 1,
                      }}
                    >
                      <CloseRoundedIcon sx={{ fontSize: 11 }} />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDiscountPct(10)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: theme.activeBg, fontSize: '11px', fontWeight: 700,
                      fontFamily: 'inherit', padding: 0,
                    }}
                  >
                    + Add Discount
                  </button>
                )}
              </span>
              <span style={{ color: discountPct > 0 ? '#DC2626' : theme.textSecondary, fontWeight: 700 }}>
                {discountPct > 0 ? `-₹${manualDiscount}` : '₹0'}
              </span>
            </div>

            {promoDiscountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#DC2626' }}>
                <span>Promo ({appliedPromoCode})</span>
                <span style={{ fontWeight: 700 }}>-₹{promoDiscountAmount}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: theme.textSecondary }}>
              <span>Tax (GST 5%)</span>
              <span style={{ color: theme.textPrimary, fontWeight: 700 }}>₹{tax}</span>
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              fontSize: '15px', fontWeight: 800, color: theme.textPrimary,
              paddingTop: '0.4rem', borderTop: `1px dashed ${theme.border}`, marginTop: '0.15rem',
            }}>
              <span>Total Amount</span>
              <span style={{ fontSize: '20px', fontWeight: 900, color: theme.textPrimary, letterSpacing: '-0.02em' }}>
                ₹{total}
              </span>
            </div>
          </div>

          {/* Promo Code Input */}
          <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#F8FAFC',
                borderRadius: '0.55rem',
                border: `1px solid ${theme.border}`,
                padding: '2px 8px',
                height: '32px',
                boxSizing: 'border-box',
              }}
            >
              <LocalOfferRoundedIcon sx={{ fontSize: 13, color: theme.textSecondary }} />
              <input
                type="text"
                placeholder="Promo / Coupon code"
                value={appliedPromoCode}
                onChange={(e) => setAppliedPromoCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleApplyCouponCode(appliedPromoCode);
                  }
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: theme.textPrimary,
                  width: '100%',
                }}
              />
              {appliedPromoCode && (
                <button
                  type="button"
                  onClick={() => handleApplyCouponCode('')}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: theme.textSecondary, padding: 0, display: 'flex' }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 13 }} />
                </button>
              )}
            </div>
            <button
              type="button"
              disabled={cart.length === 0 || !appliedPromoCode}
              onClick={() => handleApplyCouponCode(appliedPromoCode)}
              style={{
                height: '32px',
                padding: '0 10px',
                borderRadius: '0.55rem',
                border: `1px solid ${theme.border}`,
                backgroundColor: promoDiscountAmount > 0 ? '#10B981' : (theme.sidebarIsDark ? theme.bgCard : '#F1F5F9'),
                color: promoDiscountAmount > 0 ? '#FFFFFF' : theme.textPrimary,
                fontSize: '11px',
                fontWeight: 700,
                cursor: cart.length === 0 || !appliedPromoCode ? 'not-allowed' : 'pointer',
                opacity: cart.length === 0 || !appliedPromoCode ? 0.5 : 1,
                fontFamily: 'inherit',
              }}
            >
              {promoDiscountAmount > 0 ? 'Applied' : 'Apply'}
            </button>
          </div>
          {promoMessage && (
            <div
              style={{
                fontSize: '10.5px',
                fontWeight: 600,
                color: promoDiscountAmount > 0 ? '#059669' : '#DC2626',
                padding: '0 2px',
              }}
            >
              {promoMessage}
            </div>
          )}

          {/* Action Row: Hold Sale & Dine-in KOT */}
          <div style={{ display: 'flex', gap: '0.45rem' }}>
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={handleHoldSale}
              style={{
                flex: 1,
                height: '34px',
                borderRadius: '0.55rem',
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.bgCardSubtle,
                color: theme.textPrimary,
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                opacity: cart.length === 0 ? 0.45 : 1,
                transition: 'all 0.15s ease',
                fontFamily: 'inherit',
              }}
            >
              Hold Sale
            </button>
            {orderType === 'dine_in' && (
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={handleSendKot}
                style={{
                  flex: 1,
                  height: '34px',
                  borderRadius: '0.55rem',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.bgCardSubtle,
                  color: cart.length > 0 ? theme.activeBg : theme.textMuted,
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: cart.length === 0 ? 0.45 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                  fontFamily: 'inherit',
                }}
              >
                <KitchenRoundedIcon sx={{ fontSize: 15 }} />
                <span>Send KOT</span>
              </button>
            )}
          </div>

          {/* Primary Checkout CTA (Customer Mandatory Enforced) */}
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={handleInitiateCharge}
            style={{
              width: '100%',
              height: '46px',
              borderRadius: '0.65rem',
              fontSize: '14.5px',
              fontWeight: 800,
              letterSpacing: '-0.01em',
              cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
              opacity: cart.length === 0 ? 0.45 : 1,
              border: 'none',
              backgroundColor: !isCustomerValid && cart.length > 0 ? '#CA8A04' : '#000000',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontFamily: 'inherit',
              boxShadow: cart.length > 0 ? '0 4px 12px rgba(0,0,0,0.18)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {!isCustomerValid && cart.length > 0 ? (
              <>
                <PersonAddAltRoundedIcon sx={{ fontSize: 18 }} />
                <span>Add Customer to Charge ₹{total}</span>
              </>
            ) : (
              <>
                <span>Charge ₹{total}</span>
                <ArrowOutwardRoundedIcon sx={{ fontSize: 16 }} />
              </>
            )}
          </button>
        </div>
      </aside>

      {/* COMPLETE PAYMENT MODAL */}
      <CompletePaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          if (cart.length === 0) {
            setSaleNote('');
            setPaymentNote('');
            setCustomerName('');
            setCustomerPhone('');
            setSelectedCustomerId(null);
            setCustomerLoyaltyPoints(0);
            setKotGeneratedCount(0);
            setOrderType('dine_in');
            setTableSection('Main Hall');
            setTableNumber('T-01');
          }
        }}
        theme={theme}
        orderNumber={orderNumber}
        orderType={orderType}
        tableSection={tableSection}
        tableNumber={tableNumber}
        ticketNumber={ticketNumber}
        deliveryPlatform={deliveryPlatform}
        customerName={customerName}
        customerPhone={customerPhone}
        customerId={selectedCustomerId}
        customerLoyaltyPoints={customerLoyaltyPoints}
        onLoyaltyRedeemed={(discAmt, remPts) => {
          setCustomerLoyaltyPoints(remPts);
        }}
        cart={cart}
        subtotal={subtotal}
        discountAmount={discountAmount}
        tax={tax}
        total={total}
        saleNote={saleNote}
        paymentNote={paymentNote}
        setPaymentNote={setPaymentNote}
        onCompleteOrder={() => {
          try {
            const existing = JSON.parse(localStorage.getItem('nuradesk_orders') || '[]');
            setOrderNumber(`#ORD-${1000 + existing.length + 1}`);

            // Auto-increment takeaway ticket number for the next takeaway customer
            if (orderType === 'takeaway') {
              const nextNum = parseInt(ticketNumber.replace(/\D/g, '') || '0') + 1;
              setTicketNumber(`TK-${String(nextNum).padStart(2, '0')}`);
            }

            // Free the dining table (mark as VACANT) upon successful checkout
            if (orderType === 'dine_in') {
              const currentTbl = diningTables.find((t) => t.tableNumber === tableNumber && t.section === tableSection);
              if (currentTbl) {
                handleUpdateTableStatus(currentTbl.id, 'VACANT', undefined);
              }
            }
          } catch (e) {}

          // Clear cart so next order starts clean with mandatory customer requirement
          setCart([]);
          setSaleNote('');
          setPaymentNote('');
          setCustomerName('');
          setCustomerPhone('');
          setSelectedCustomerId(null);
          setCustomerLoyaltyPoints(0);
          setKotGeneratedCount(0);
          setOrderType('dine_in');
          setTableSection('Main Hall');
          setTableNumber('T-01');
        }}
        getItemUnitPrice={getItemUnitPrice}
        getItemLineTotal={getItemLineTotal}
      />


      {/* CASH DRAWER MOVEMENT MODAL (PAY_IN / PAY_OUT) */}
      {showCashMovementModal && (
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
            maxWidth: '440px',
            backgroundColor: theme.popoverBg,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            padding: '1.75rem',
            boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AccountBalanceWalletRoundedIcon sx={{ fontSize: 22, color: theme.posBtnBg }} />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Cash Movement (Drawer In / Out)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCashMovementModal(false);
                  setCashMovementError(null);
                }}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            {cashMovementError && (
              <div style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#EF4444',
                fontSize: '12px',
                fontWeight: 600,
              }}>
                {cashMovementError}
              </div>
            )}

            {!activeShift ? (
              <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: theme.textSecondary, marginBottom: '1rem' }}>
                  No active register shift is open. You must open a shift before recording cash movements.
                </p>
                <Link
                  href="/start-shift"
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    borderRadius: '0.65rem',
                    backgroundColor: theme.posBtnBg,
                    color: theme.posBtnText,
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Open Shift Now
                </Link>
              </div>
            ) : (
              <form onSubmit={handleRecordCashMovement} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Movement Type Toggle */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '6px' }}>
                    Movement Type
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setCashMovementType('PAY_IN')}
                      style={{
                        height: '40px',
                        borderRadius: '0.65rem',
                        border: cashMovementType === 'PAY_IN' ? '2px solid #22C55E' : `1px solid ${theme.border}`,
                        backgroundColor: cashMovementType === 'PAY_IN' ? 'rgba(34, 197, 94, 0.1)' : theme.bgCardSubtle,
                        color: cashMovementType === 'PAY_IN' ? '#16A34A' : theme.textPrimary,
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      + Cash In (Deposit)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashMovementType('PAY_OUT')}
                      style={{
                        height: '40px',
                        borderRadius: '0.65rem',
                        border: cashMovementType === 'PAY_OUT' ? '2px solid #EF4444' : `1px solid ${theme.border}`,
                        backgroundColor: cashMovementType === 'PAY_OUT' ? 'rgba(239, 68, 68, 0.1)' : theme.bgCardSubtle,
                        color: cashMovementType === 'PAY_OUT' ? '#EF4444' : theme.textPrimary,
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      - Cash Out (Payout)
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '6px' }}>
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={cashMovementAmount}
                    onChange={(e) => setCashMovementAmount(e.target.value)}
                    placeholder="e.g. 500.00"
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 0.85rem',
                      borderRadius: '0.65rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgCardSubtle,
                      color: theme.textPrimary,
                      fontSize: '14px',
                      fontWeight: 700,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Reason */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '6px' }}>
                    Reason / Description
                  </label>
                  <input
                    type="text"
                    required
                    value={cashMovementReason}
                    onChange={(e) => setCashMovementReason(e.target.value)}
                    placeholder="e.g. Petty cash for milk supplies"
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 0.85rem',
                      borderRadius: '0.65rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgCardSubtle,
                      color: theme.textPrimary,
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="submit"
                    disabled={isSubmittingCashMovement}
                    style={{
                      flex: 1,
                      height: '42px',
                      borderRadius: '0.75rem',
                      backgroundColor: theme.posBtnBg,
                      color: theme.posBtnText,
                      fontSize: '13px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: isSubmittingCashMovement ? 'not-allowed' : 'pointer',
                      opacity: isSubmittingCashMovement ? 0.7 : 1,
                    }}
                  >
                    {isSubmittingCashMovement ? 'Recording...' : 'Record Movement'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCashMovementModal(false)}
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
              </form>
            )}
          </div>
        </div>
      )}

      {/* END SHIFT MODAL & RECONCILIATION */}
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
            maxWidth: closeShiftResult ? '480px' : '420px',
            backgroundColor: theme.popoverBg,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            padding: '1.75rem',
            boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                {closeShiftResult ? 'Shift Closed — Z-Report' : 'End Register Shift'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowEndShiftModal(false);
                  setCloseShiftError(null);
                  if (closeShiftResult) {
                    setCloseShiftResult(null);
                    router.push('/pos-login-2');
                  }
                }}
                style={{ background: 'none', border: 'none', color: theme.textPrimary, cursor: 'pointer' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            {closeShiftError && (
              <div style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#EF4444',
                fontSize: '12px',
                fontWeight: 600,
              }}>
                {closeShiftError}
              </div>
            )}

            {closeShiftResult ? (
              /* Z-Report Reconciliation View */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  backgroundColor: theme.bgCardSubtle,
                  border: `1px solid ${theme.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: theme.textSecondary }}>Shift ID</span>
                    <span style={{ fontWeight: 700, color: theme.textPrimary }}>#{closeShiftResult.shiftId} ({activeShift?.terminalId || 'TRM-01'})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: theme.textSecondary }}>Cashier</span>
                    <span style={{ fontWeight: 700, color: theme.textPrimary }}>{currentCashierName}</span>
                  </div>
                  {activeShift?.openingFloat !== undefined && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: theme.textSecondary }}>Opening Float</span>
                      <span style={{ fontWeight: 700, color: theme.textPrimary }}>₹{activeShift.openingFloat.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: theme.textSecondary }}>Total Sales Recorded</span>
                    <span style={{ fontWeight: 800, color: '#22C55E' }}>₹{closeShiftResult.totalSales.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: theme.textSecondary }}>Cash / Card / UPI</span>
                    <span style={{ fontWeight: 700, color: theme.textPrimary }}>
                      ₹{closeShiftResult.cashTotal.toFixed(2)} / ₹{closeShiftResult.cardTotal.toFixed(2)} / ₹{closeShiftResult.upiTotal.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ height: '1px', backgroundColor: theme.border, margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: theme.textSecondary }}>Expected Drawer Cash</span>
                    <span style={{ fontWeight: 800, color: theme.textPrimary }}>₹{closeShiftResult.expectedCash.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: theme.textSecondary }}>Actual Drawer Cash</span>
                    <span style={{ fontWeight: 800, color: theme.textPrimary }}>₹{closeShiftResult.actualCash.toFixed(2)}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '14px',
                    fontWeight: 800,
                    padding: '6px 8px',
                    borderRadius: '0.5rem',
                    backgroundColor: closeShiftResult.cashDifference === 0
                      ? 'rgba(34, 197, 94, 0.1)'
                      : closeShiftResult.cashDifference > 0
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(239, 68, 68, 0.1)',
                    color: closeShiftResult.cashDifference === 0
                      ? '#16A34A'
                      : closeShiftResult.cashDifference > 0
                        ? '#2563EB'
                        : '#DC2626',
                  }}>
                    <span>Discrepancy (Diff)</span>
                    <span>
                      {closeShiftResult.cashDifference > 0 ? `+₹${closeShiftResult.cashDifference.toFixed(2)} (Surplus)` : closeShiftResult.cashDifference < 0 ? `-₹${Math.abs(closeShiftResult.cashDifference).toFixed(2)} (Short)` : '₹0.00 (Balanced)'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEndShiftModal(false);
                      setCloseShiftResult(null);
                      setActiveShift(null);
                      router.push('/pos-login-2');
                    }}
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
                    Done & Log Out to Cashier Switch
                  </button>
                </div>
              </div>
            ) : !activeShift ? (
              <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: theme.textSecondary, marginBottom: '1.25rem' }}>
                  There is currently no active open shift for this register.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <Link
                    href="/start-shift"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '0.65rem',
                      backgroundColor: theme.posBtnBg,
                      color: theme.posBtnText,
                      fontSize: '13px',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Open New Shift
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowEndShiftModal(false)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '0.65rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgCardSubtle,
                      color: theme.textPrimary,
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Close Shift Form */
              <form onSubmit={handleCloseShift} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: theme.bgCardSubtle, borderRadius: '0.65rem', border: `1px solid ${theme.border}` }}>
                    <span style={{ fontSize: '13px', color: theme.textSecondary }}>Shift ID / Terminal</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: theme.textPrimary }}>#{activeShift.shiftId} ({activeShift.terminalId})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: theme.bgCardSubtle, borderRadius: '0.65rem', border: `1px solid ${theme.border}` }}>
                    <span style={{ fontSize: '13px', color: theme.textSecondary }}>Cashier</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: theme.textPrimary }}>{activeShift.cashierName || currentCashierName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: theme.bgCardSubtle, borderRadius: '0.65rem', border: `1px solid ${theme.border}` }}>
                    <span style={{ fontSize: '13px', color: theme.textSecondary }}>Opening Float</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: theme.textPrimary }}>₹{activeShift.openingFloat.toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '6px' }}>
                    Actual Cash Count in Drawer (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={closingCashActual}
                    onChange={(e) => setClosingCashActual(e.target.value)}
                    placeholder="Enter total physical cash counted"
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 0.85rem',
                      borderRadius: '0.65rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgCardSubtle,
                      color: theme.textPrimary,
                      fontSize: '14px',
                      fontWeight: 700,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '6px' }}>
                    Closing Shift Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={closingNotes}
                    onChange={(e) => setClosingNotes(e.target.value)}
                    placeholder="Any handover comments, cash discrepancies or drawer notes..."
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.85rem',
                      borderRadius: '0.65rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgCardSubtle,
                      color: theme.textPrimary,
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      resize: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="submit"
                    disabled={isSubmittingCloseShift}
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
                      cursor: isSubmittingCloseShift ? 'not-allowed' : 'pointer',
                      opacity: isSubmittingCloseShift ? 0.7 : 1,
                    }}
                  >
                    {isSubmittingCloseShift ? 'Reconciling...' : 'Reconcile & Close Shift'}
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
              </form>
            )}
          </div>
        </div>
      )}

      {/* INTERACTIVE FLOOR & TABLE PLAN MODAL */}
      {showFloorPlanModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '1.5rem',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '780px',
            maxHeight: '90vh',
            backgroundColor: theme.popoverBg,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            padding: '1.5rem',
            boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            overflow: 'hidden',
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TableBarRoundedIcon sx={{ fontSize: 24, color: theme.activeBg }} />
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>
                    Floor Plan & Dining Tables
                  </h3>
                </div>
                <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: theme.textSecondary }}>
                  Select a table to seat guests, transfer active tickets, or view occupancy status.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowFloorPlanModal(false)}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: '4px' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 22 }} />
              </button>
            </div>

            {/* Quick Stats Strip */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '2px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '4px 10px',
                borderRadius: '999px',
                backgroundColor: theme.sidebarIsDark ? '#27272A' : '#F1F5F9',
                fontSize: '11.5px',
                fontWeight: 700,
                color: theme.textPrimary,
              }}>
                <span>Total: {floorStats.total}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '4px 10px',
                borderRadius: '999px',
                backgroundColor: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#16A34A',
              }}>
                <span>● Available: {floorStats.vacant}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '4px 10px',
                borderRadius: '999px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#DC2626',
              }}>
                <span>● Occupied: {floorStats.occupied}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '4px 10px',
                borderRadius: '999px',
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#2563EB',
              }}>
                <span>● Reserved: {floorStats.reserved}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '4px 10px',
                borderRadius: '999px',
                backgroundColor: 'rgba(168, 85, 247, 0.12)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#9333EA',
              }}>
                <span>● Billed: {floorStats.billed}</span>
              </div>
            </div>

            {/* Filter Controls: Sections & Status */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              {/* Floor Section Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflowX: 'auto' }}>
                {['All', ...Object.keys(TABLE_SECTIONS)].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setFloorPlanFilter(sec)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '0.5rem',
                      fontSize: '11.5px',
                      fontWeight: floorPlanFilter === sec ? 800 : 600,
                      backgroundColor: floorPlanFilter === sec ? theme.activeBg : theme.bgCardSubtle,
                      color: floorPlanFilter === sec ? theme.activeText : theme.textSecondary,
                      border: `1px solid ${floorPlanFilter === sec ? 'transparent' : theme.border}`,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {sec}
                  </button>
                ))}
              </div>

              {/* Status Filter Dropdown */}
              <select
                value={floorPlanStatusFilter}
                onChange={(e) => setFloorPlanStatusFilter(e.target.value)}
                style={{
                  height: '30px',
                  padding: '0 8px',
                  borderRadius: '0.45rem',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.bgCard,
                  color: theme.textPrimary,
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="VACANT">Available Only</option>
                <option value="OCCUPIED">Occupied Only</option>
                <option value="RESERVED">Reserved Only</option>
                <option value="BILLED">Billed Only</option>
              </select>
            </div>

            {/* Interactive Tables Grid */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '0.75rem',
              padding: '0.25rem 2px',
            }}>
              {diningTables
                .filter((t) => floorPlanFilter === 'All' || t.section === floorPlanFilter)
                .filter((t) => floorPlanStatusFilter === 'ALL' || t.status === floorPlanStatusFilter)
                .map((tbl) => {
                  const isCurrent = tbl.tableNumber === tableNumber && tbl.section === tableSection;
                  const isOccupied = tbl.status === 'OCCUPIED';
                  const isReserved = tbl.status === 'RESERVED';
                  const isBilled = tbl.status === 'BILLED';

                  let statusColor = '#16A34A';
                  let statusBg = 'rgba(34, 197, 94, 0.1)';
                  if (isOccupied) {
                    statusColor = '#DC2626';
                    statusBg = 'rgba(239, 68, 68, 0.1)';
                  } else if (isReserved) {
                    statusColor = '#2563EB';
                    statusBg = 'rgba(59, 130, 246, 0.1)';
                  } else if (isBilled) {
                    statusColor = '#9333EA';
                    statusBg = 'rgba(168, 85, 247, 0.1)';
                  }

                  return (
                    <div
                      key={tbl.id}
                      onClick={() => handleSelectTable(tbl)}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '0.85rem',
                        backgroundColor: theme.bgCard,
                        border: isCurrent
                          ? `2px solid ${theme.activeBg}`
                          : `1px solid ${theme.border}`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.65rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isCurrent ? '0 0 0 3px rgba(0, 125, 204, 0.15)' : 'none',
                        position: 'relative',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 900, color: theme.textPrimary, letterSpacing: '-0.02em' }}>
                            {tbl.tableNumber}
                          </div>
                          <div style={{ fontSize: '11px', color: theme.textSecondary, marginTop: '1px' }}>
                            {tbl.section}
                          </div>
                        </div>

                        <span style={{
                          fontSize: '9.5px',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '999px',
                          backgroundColor: statusBg,
                          color: statusColor,
                          border: `1px solid ${statusColor}33`,
                        }}>
                          ● {tbl.status || 'VACANT'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: theme.textSecondary }}>
                        <span>🪑 {tbl.capacity || 4} Seats</span>
                        {isCurrent ? (
                          <span style={{ fontWeight: 800, color: theme.activeBg }}>Active</span>
                        ) : tbl.activeOrderId ? (
                          <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{tbl.activeOrderId}</span>
                        ) : (
                          <span style={{ color: '#16A34A', fontWeight: 700 }}>Select →</span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Modal Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              borderTop: `1px solid ${theme.border}`,
            }}>
              <div style={{ fontSize: '11.5px', color: theme.textSecondary }}>
                Currently Selected: <strong style={{ color: theme.textPrimary }}>{tableSection} • {tableNumber}</strong> ({currentTableObj.capacity || 4} Seats)
              </div>

              <button
                type="button"
                onClick={() => setShowFloorPlanModal(false)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '0.55rem',
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Confirm Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KITCHEN ORDER TICKET (KOT) PREVIEW & DISPATCH MODAL */}
      {showKotModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '1.5rem',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '380px',
            backgroundColor: '#FFFFFF',
            color: '#18181B',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            fontFamily: 'monospace',
          }}>
            {/* Ticket Header */}
            <div style={{ textAlign: 'center', borderBottom: '1px dashed #A1A1AA', paddingBottom: '0.75rem' }}>
              <div style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '0.05em' }}>
                KITCHEN ORDER TICKET
              </div>
              <div style={{ fontSize: '11px', color: '#71717A', marginTop: '2px' }}>
                {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Table & Server Info */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem',
              fontSize: '12px',
              borderBottom: '1px dashed #A1A1AA',
              paddingBottom: '0.65rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 800 }}>Table: {tableSection} - {tableNumber}</span>
                <span style={{ fontWeight: 800 }}>Covers: {guestCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#52525B', fontSize: '11px' }}>
                <span>KOT #{100 + kotGeneratedCount + 1}</span>
                <span>Server: {currentCashierName}</span>
              </div>
              <div style={{ color: '#52525B', fontSize: '11px' }}>
                Order #{orderNumber}
                {customerName && ` • Cust: ${customerName}`}
              </div>
            </div>

            {/* Items List */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.55rem',
              maxHeight: '260px',
              overflowY: 'auto',
              padding: '0.25rem 0',
            }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '13px' }}>
                  <div style={{ flex: 1, minWidth: 0, paddingRight: '0.5rem' }}>
                    <span style={{ fontWeight: 800 }}>{item.quantity}x</span>{' '}
                    <span>{item.product.name}</span>
                    {item.itemNote && (
                      <div style={{ fontSize: '10.5px', color: '#DC2626', fontWeight: 700, marginTop: '1px' }}>
                        ** {item.itemNote}
                      </div>
                    )}
                  </div>
                  <span style={{ fontWeight: 700, color: '#52525B' }}>
                    {item.product.variant || ''}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{
              borderTop: '1px dashed #A1A1AA',
              paddingTop: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem',
              fontFamily: 'sans-serif',
            }}>
              <button
                type="button"
                onClick={handlePrintConfirmKot}
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '0.65rem',
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                }}
              >
                <PrintRoundedIcon sx={{ fontSize: 17 }} />
                <span>Print & Dispatch to Kitchen</span>
              </button>

              <button
                type="button"
                onClick={() => setShowKotModal(false)}
                style={{
                  width: '100%',
                  height: '34px',
                  borderRadius: '0.55rem',
                  backgroundColor: '#F4F4F5',
                  color: '#52525B',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRANSFER TABLE MODAL */}
      {showTransferTableModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '1.5rem',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: theme.popoverBg,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            padding: '1.5rem',
            boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SwapHorizRoundedIcon sx={{ fontSize: 22, color: theme.activeBg }} />
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Transfer Table Order
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTransferTableModal(false)}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div style={{
              padding: '0.75rem',
              borderRadius: '0.65rem',
              backgroundColor: theme.sidebarIsDark ? '#1C1D21' : '#F1F5F9',
              fontSize: '12px',
              color: theme.textSecondary,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span>Current Table:</span>
              <strong style={{ color: theme.textPrimary, fontSize: '13px' }}>{tableSection} • {tableNumber}</strong>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '6px' }}>
                Select Available Vacant Table:
              </label>
              <div style={{
                maxHeight: '220px',
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.5rem',
              }}>
                {diningTables
                  .filter((t) => t.status === 'VACANT' && !(t.tableNumber === tableNumber && t.section === tableSection))
                  .map((vacantTbl) => (
                    <button
                      key={vacantTbl.id}
                      type="button"
                      onClick={() => handleTransferTable(vacantTbl)}
                      style={{
                        padding: '0.65rem',
                        borderRadius: '0.65rem',
                        border: `1px solid ${theme.border}`,
                        backgroundColor: theme.bgCard,
                        color: theme.textPrimary,
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'inherit',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: 800 }}>{vacantTbl.tableNumber}</span>
                      <span style={{ fontSize: '10.5px', color: theme.textSecondary }}>{vacantTbl.section} • {vacantTbl.capacity || 4} seats</span>
                    </button>
                  ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTransferTableModal(false)}
              style={{
                height: '38px',
                borderRadius: '0.65rem',
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.bgCardSubtle,
                color: theme.textPrimary,
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MANDATORY CUSTOMER MODAL (NEW REGISTRATION + SELECT EXISTING) */}
      {showAddCustomerModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '1.5rem',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: theme.popoverBg,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            padding: '1.5rem',
            boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PersonAddAltRoundedIcon sx={{ fontSize: 22, color: theme.activeBg }} />
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>
                    Customer Details (Mandatory)
                  </h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: theme.textSecondary }}>
                    A verified customer is required to consider and checkout this sale.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddCustomerModal(false);
                  setAddCustomerError(null);
                }}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: '4px' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            {/* Tab Switcher: New Customer vs Select Existing */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '3px',
              padding: '3px',
              borderRadius: '0.65rem',
              backgroundColor: theme.sidebarIsDark ? '#1C1D21' : '#F1F5F9',
              border: `1px solid ${theme.border}`,
            }}>
              <button
                type="button"
                onClick={() => setCustomerModalTab('new')}
                style={{
                  padding: '0.42rem 0.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: customerModalTab === 'new'
                    ? (theme.sidebarIsDark ? '#2E2F38' : '#FFFFFF')
                    : 'transparent',
                  color: customerModalTab === 'new'
                    ? (theme.sidebarIsDark ? '#FFFFFF' : '#000000')
                    : theme.textSecondary,
                  fontSize: '12px',
                  fontWeight: customerModalTab === 'new' ? 800 : 600,
                  cursor: 'pointer',
                  boxShadow: customerModalTab === 'new' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  fontFamily: 'inherit',
                }}
              >
                + New Customer
              </button>

              <button
                type="button"
                onClick={() => setCustomerModalTab('existing')}
                style={{
                  padding: '0.42rem 0.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: customerModalTab === 'existing'
                    ? (theme.sidebarIsDark ? '#2E2F38' : '#FFFFFF')
                    : 'transparent',
                  color: customerModalTab === 'existing'
                    ? (theme.sidebarIsDark ? '#FFFFFF' : '#000000')
                    : theme.textSecondary,
                  fontSize: '12px',
                  fontWeight: customerModalTab === 'existing' ? 800 : 600,
                  cursor: 'pointer',
                  boxShadow: customerModalTab === 'existing' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  fontFamily: 'inherit',
                }}
              >
                Select Existing
              </button>
            </div>

            {addCustomerError && (
              <div style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '0.65rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#EF4444',
                fontSize: '12px',
                fontWeight: 600,
              }}>
                {addCustomerError}
              </div>
            )}

            {customerModalTab === 'new' ? (
              /* TAB 1: QUICK NEW CUSTOMER REGISTRATION FORM */
              <form onSubmit={handleCreateCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: theme.textSecondary, marginBottom: '5px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 0.85rem',
                      borderRadius: '0.6rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgCardSubtle,
                      color: theme.textPrimary,
                      fontSize: '13px',
                      fontWeight: 600,
                      boxSizing: 'border-box',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: theme.textSecondary, marginBottom: '5px' }}>
                    Phone Number * (10 Digits)
                  </label>
                  <input
                    type="tel"
                    required
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 0.85rem',
                      borderRadius: '0.6rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgCardSubtle,
                      color: theme.textPrimary,
                      fontSize: '13px',
                      fontWeight: 600,
                      boxSizing: 'border-box',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: theme.textSecondary, marginBottom: '5px' }}>
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                    placeholder="rahul@example.com"
                    style={{
                      width: '100%',
                      height: '38px',
                      padding: '0 0.85rem',
                      borderRadius: '0.6rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgCardSubtle,
                      color: theme.textPrimary,
                      fontSize: '12.5px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: theme.textSecondary, marginBottom: '5px' }}>
                    Address / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={newCustomerAddress}
                    onChange={(e) => setNewCustomerAddress(e.target.value)}
                    placeholder="e.g. Block A, Apartment 302"
                    style={{
                      width: '100%',
                      height: '38px',
                      padding: '0 0.85rem',
                      borderRadius: '0.6rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgCardSubtle,
                      color: theme.textPrimary,
                      fontSize: '12.5px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.4rem' }}>
                  <button
                    type="submit"
                    disabled={isCreatingCustomer}
                    style={{
                      flex: 1,
                      height: '42px',
                      borderRadius: '0.65rem',
                      backgroundColor: '#000000',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: isCreatingCustomer ? 'not-allowed' : 'pointer',
                      opacity: isCreatingCustomer ? 0.7 : 1,
                      fontFamily: 'inherit',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    }}
                  >
                    {isCreatingCustomer ? 'Registering...' : 'Register & Assign to Sale'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCustomerModal(false)}
                    style={{
                      padding: '0 1rem',
                      height: '42px',
                      borderRadius: '0.65rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgCardSubtle,
                      color: theme.textPrimary,
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* TAB 2: SELECT FROM EXISTING CUSTOMERS */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ position: 'relative' }}>
                  <SearchRoundedIcon sx={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 18,
                    color: theme.textSecondary,
                  }} />
                  <input
                    type="text"
                    placeholder="Search customer by name, phone..."
                    value={customerSearchInModal}
                    onChange={(e) => setCustomerSearchInModal(e.target.value)}
                    style={{
                      width: '100%',
                      height: '38px',
                      padding: '0 10px 0 34px',
                      borderRadius: '0.55rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgCardSubtle,
                      color: theme.textPrimary,
                      fontSize: '12.5px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{
                  maxHeight: '280px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                }}>
                  {effectiveCustomers
                    .filter((c) => {
                      const q = customerSearchInModal.toLowerCase().trim();
                      if (!q) return true;
                      return (
                        c.name.toLowerCase().includes(q) ||
                        c.phone.toLowerCase().includes(q) ||
                        (c.email && c.email.toLowerCase().includes(q))
                      );
                    })
                    .map((c) => (
                      <div
                        key={c.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 0.75rem',
                          borderRadius: '0.65rem',
                          border: `1px solid ${theme.border}`,
                          backgroundColor: theme.bgCard,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: theme.sidebarIsDark ? '#27272A' : '#EFF6FF',
                            color: theme.activeBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 800,
                            flexShrink: 0,
                          }}>
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '13px', fontWeight: 800, color: theme.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {c.name}
                            </div>
                            <div style={{ fontSize: '11px', color: theme.textSecondary }}>
                              {c.phone} {c.loyaltyPoints > 0 ? `• ★ ${c.loyaltyPoints} Pts` : ''}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setCustomerName(c.name);
                            setCustomerPhone(c.phone);
                            setSelectedCustomerId(c.id);
                            setCustomerLoyaltyPoints(c.loyaltyPoints || 0);
                            setShowAddCustomerModal(false);
                            setAddCustomerError(null);
                          }}
                          style={{
                            padding: '0.35rem 0.65rem',
                            backgroundColor: theme.activeBg,
                            color: theme.activeText,
                            border: 'none',
                            borderRadius: '0.45rem',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            fontFamily: 'inherit',
                          }}
                        >
                          Select
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
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
                    {disc > 0 && <span style={{ color: '#DC2626', fontWeight: 600 }}> - ₹{disc} discount</span>}
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
