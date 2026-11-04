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

const TABLE_SECTIONS: Record<string, string[]> = {
  'Main Hall': ['T-01', 'T-02', 'T-03', 'T-04', 'T-05', 'T-06'],
  'AC Hall': ['AC-01', 'AC-02', 'AC-03', 'AC-04'],
  'Garden': ['G-01', 'G-02', 'G-03', 'G-04'],
  'Rooftop': ['R-01', 'R-02', 'R-03'],
};

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





export default function PosMainScreen() {
  const { isAuthorized, handleLogout } = useAuthGuard();
  const router = useRouter();

  // Navigation state
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

  // Customer state & Order Type state
  const [customerName, setCustomerName] = useState('Guest Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway' | 'delivery'>('dine_in');
  const [tableSection, setTableSection] = useState('Main Hall');
  const [tableNumber, setTableNumber] = useState('T-01');
  const [ticketNumber, setTicketNumber] = useState('#TK-01');
  const [deliveryPlatform, setDeliveryPlatform] = useState('Direct');
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [discountPct, setDiscountPct] = useState(0);

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

  // Dining Tables State
  const [diningTables, setDiningTables] = useState<DiningTable[]>([]);
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

  // Group filtered products by category for category-wise display
  const groupedByCategory = useMemo(() => {
    const map = new Map<string, Product[]>();
    filteredProducts.forEach((p) => {
      const cat = p.category || 'General';
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(p);
    });

    const groups: { category: string; items: Product[] }[] = [];
    map.forEach((items, category) => {
      groups.push({ category, items });
    });
    return groups;
  }, [filteredProducts]);

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
      tableSection: orderType === 'dine_in' ? tableSection : undefined,
      ticketNumber: orderType === 'takeaway' ? ticketNumber : undefined,
      deliveryPlatform: orderType === 'delivery' ? deliveryPlatform : undefined,
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
    if (hold.tableSection) setTableSection(hold.tableSection);
    if (hold.ticketNumber) setTicketNumber(hold.ticketNumber);
    if (hold.deliveryPlatform) setDeliveryPlatform(hold.deliveryPlatform);
    if (hold.customerName) setCustomerName(hold.customerName);
    if (hold.customerPhone) setCustomerPhone(hold.customerPhone);
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
    } catch (e) {}

    setTimeout(() => {
      setPaymentSuccess(false);
      setShowPaymentModal(false);
      setCart([]);
      setSaleNote('');
      setPaymentNote('');
      setCustomerName('Guest Customer');
      setCustomerPhone('');
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
                <ActionMenu
                  primaryColor="#007DCC"
                  secondaryColor="#FFB900"
                  items={[
                    {
                      id: 'new_sale',
                      label: 'New sale',
                      icon: <img src="/icons/newsale.png" alt="New sale" style={{ width: 28, height: 28, objectFit: 'contain', display: 'block' }} />,
                      onClick: () => {
                        setActiveNav('new_sale');
                        setIsAppsMenuOpen(false);
                      },
                    },
                    {
                      id: 'held_sales',
                      label: 'Held sales',
                      badge: heldSales.length > 0 ? heldSales.length : undefined,
                      icon: <img src="/icons/4dot.png" alt="Held sales" style={{ width: 28, height: 28, objectFit: 'contain', display: 'block' }} />,
                      onClick: () => {
                        setActiveNav('held_sales');
                        setIsAppsMenuOpen(false);
                      },
                    },
                    {
                      id: 'invoices',
                      label: 'Invoices',
                      icon: <img src="/icons/invoice.png" alt="Invoices" style={{ width: 28, height: 28, objectFit: 'contain', display: 'block' }} />,
                      onClick: () => {
                        setActiveNav('invoices');
                        setIsAppsMenuOpen(false);
                      },
                    },
                    {
                      id: 'customers',
                      label: 'Customers',
                      icon: <img src="/icons/customers.png" alt="Customers" style={{ width: 28, height: 28, objectFit: 'contain', display: 'block' }} />,
                      onClick: () => {
                        setActiveNav('customers');
                        setIsAppsMenuOpen(false);
                      },
                    },
                    {
                      id: 'cash_movement',
                      label: 'Cash in / out',
                      icon: <AccountBalanceWalletRoundedIcon sx={{ fontSize: 24, color: theme.posBtnBg }} />,
                      onClick: () => {
                        setShowCashMovementModal(true);
                        setIsAppsMenuOpen(false);
                      },
                    },
                    {
                      id: 'end_shift',
                      label: 'End shift',
                      icon: <img src="/icons/shifts.png" alt="End shift" style={{ width: 28, height: 28, objectFit: 'contain', display: 'block' }} />,
                      onClick: () => {
                        setShowEndShiftModal(true);
                        setIsAppsMenuOpen(false);
                      },
                    },
                    {
                      id: 'dark_mode',
                      label: themeMode === 'light' ? 'Dark mode' : 'Light mode',
                      icon: <ActionDarkModeIcon size={26} primaryColor="#007DCC" secondaryColor="#FFB900" isDarkMode={themeMode === 'dark'} />,
                      onClick: handleToggleTheme,
                    },
                  ]}
                  activeItem={activeNav}
                  isDarkMode={themeMode === 'dark'}
                />

                {/* Divider & Logout */}
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
                      padding: '7px 10px',
                      borderRadius: '10px',
                      backgroundColor: 'transparent',
                      color: '#EF4444',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      transition: 'all 0.15s ease',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <img src="/icons/logout.png" alt="Logout" style={{ width: 18, height: 18, objectFit: 'contain', display: 'block', opacity: 0.85 }} />
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

          {/* Category Filter: Horizontal Scrollable Pill Tabs */}
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
            ) : selectedCategory === 'All' && !searchQuery.trim() ? (
              /* CATEGORY-WISE GROUPED VIEW WHEN ALL ITEMS SELECTED */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '1.5rem' }}>
                {groupedByCategory.map((group) => (
                  <div key={group.category} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: `1px solid ${theme.border}`,
                      paddingBottom: '0.45rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', color: theme.textSecondary }}>
                          {getCategoryIcon(group.category)}
                        </span>
                        <h3 style={{
                          fontSize: '14.5px',
                          fontWeight: 800,
                          color: theme.textPrimary,
                          letterSpacing: '-0.015em',
                          margin: 0,
                        }}>
                          {group.category}
                        </h3>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: theme.textSecondary,
                          backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#F1F5F9',
                          padding: '1px 7px',
                          borderRadius: '999px',
                          border: `1px solid ${theme.border}`,
                        }}>
                          {group.items.length}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(group.category)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: theme.textSecondary,
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: '2px 6px',
                        }}
                      >
                        View all →
                      </button>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                      gap: '1rem',
                    }}>
                      {group.items.map((p) => {
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
                  </div>
                ))}
              </div>
            ) : (
              /* FILTERED SINGLE CATEGORY OR SEARCH VIEW */
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
                {orderNumber}
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

          {/* Order Type Buttons & Context Bar */}
          <div style={{
            padding: '0.65rem 0.95rem 0.55rem',
            backgroundColor: theme.bgCard,
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            {/* Simple Selection Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', width: '100%' }}>
              {/* Dine In Button */}
              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  padding: '0.48rem 0.65rem',
                  borderRadius: '0.55rem',
                  border: orderType === 'dine_in' ? `1px solid ${theme.activeBg}` : `1px solid ${theme.border}`,
                  backgroundColor: orderType === 'dine_in' ? theme.activeBg : theme.bgCard,
                  color: orderType === 'dine_in' ? theme.activeText : theme.textSecondary,
                  fontSize: '12.5px',
                  fontWeight: orderType === 'dine_in' ? 800 : 600,
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: 'none',
                  transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
                  fontFamily: 'inherit',
                  userSelect: 'none',
                }}
              >
                <RestaurantRoundedIcon sx={{ fontSize: 16 }} />
                <span>Dine In</span>
              </button>

              {/* Takeaway Button */}
              <button
                type="button"
                onClick={() => setOrderType('takeaway')}
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  padding: '0.48rem 0.65rem',
                  borderRadius: '0.55rem',
                  border: orderType === 'takeaway' ? `1px solid ${theme.activeBg}` : `1px solid ${theme.border}`,
                  backgroundColor: orderType === 'takeaway' ? theme.activeBg : theme.bgCard,
                  color: orderType === 'takeaway' ? theme.activeText : theme.textSecondary,
                  fontSize: '12.5px',
                  fontWeight: orderType === 'takeaway' ? 800 : 600,
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: 'none',
                  transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
                  fontFamily: 'inherit',
                  userSelect: 'none',
                }}
              >
                <TakeoutDiningRoundedIcon sx={{ fontSize: 16 }} />
                <span>Takeaway</span>
              </button>

              {/* Delivery Button */}
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  padding: '0.48rem 0.65rem',
                  borderRadius: '0.55rem',
                  border: orderType === 'delivery' ? `1px solid ${theme.activeBg}` : `1px solid ${theme.border}`,
                  backgroundColor: orderType === 'delivery' ? theme.activeBg : theme.bgCard,
                  color: orderType === 'delivery' ? theme.activeText : theme.textSecondary,
                  fontSize: '12.5px',
                  fontWeight: orderType === 'delivery' ? 800 : 600,
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: 'none',
                  transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
                  fontFamily: 'inherit',
                  userSelect: 'none',
                }}
              >
                <DeliveryDiningRoundedIcon sx={{ fontSize: 16 }} />
                <span>Delivery</span>
              </button>
            </div>

            {/* Context Section (Table with Section / Takeaway Ticket Number System / Delivery Mode) */}
            {orderType === 'dine_in' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <TableBarRoundedIcon sx={{ fontSize: 14, color: theme.activeBg }} />
                
                {/* Table Section Dropdown */}
                <select
                  value={tableSection}
                  onChange={(e) => {
                    const newSec = e.target.value;
                    setTableSection(newSec);
                    const tables = dynamicSections[newSec] || ['T-01'];
                    if (!tables.includes(tableNumber)) {
                      setTableNumber(tables[0]);
                    }
                  }}
                  title="Table Section"
                  style={{
                    height: '26px',
                    padding: '0 6px',
                    borderRadius: '5px',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgCard,
                    color: theme.textPrimary,
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: 'none',
                    fontFamily: 'inherit',
                  }}
                >
                  {Object.keys(dynamicSections).map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>

                {/* Table Number Dropdown */}
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  title="Table Number"
                  style={{
                    height: '26px',
                    padding: '0 6px',
                    borderRadius: '5px',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgCard,
                    color: theme.activeBg,
                    fontSize: '11.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: 'none',
                    fontFamily: 'inherit',
                  }}
                >
                  {(dynamicSections[tableSection] || ['T-01', 'T-02']).map((tbl) => {
                    const tblObj = diningTables.find((t) => t.tableNumber === tbl);
                    const statusText = tblObj ? ` (${tblObj.status})` : '';
                    return (
                      <option key={tbl} value={tbl}>{tbl}{statusText}</option>
                    );
                  })}
                </select>
              </div>
            )}

            {orderType === 'takeaway' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <ConfirmationNumberRoundedIcon sx={{ fontSize: 13, color: theme.activeBg }} />
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: theme.textSecondary }}>Ticket:</span>
                <input
                  type="text"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  title="Takeaway Ticket / Token Number"
                  style={{
                    width: '60px',
                    height: '24px',
                    padding: '0 4px',
                    borderRadius: '5px',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgCard,
                    color: theme.activeBg,
                    fontSize: '11px',
                    fontWeight: 800,
                    textAlign: 'center',
                    outline: 'none',
                    boxShadow: 'none',
                    fontFamily: 'monospace',
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const num = parseInt(ticketNumber.replace(/\D/g, '') || '0') + 1;
                    setTicketNumber(`TK-${String(num).padStart(2, '0')}`);
                  }}
                  title="Next Ticket Number (+1)"
                  style={{
                    height: '24px',
                    padding: '0 5px',
                    borderRadius: '5px',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgCard,
                    color: theme.textSecondary,
                    cursor: 'pointer',
                    fontSize: '10px',
                    fontWeight: 700,
                    boxShadow: 'none',
                  }}
                >
                  +1
                </button>
              </div>
            )}

            {orderType === 'delivery' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <DeliveryDiningRoundedIcon sx={{ fontSize: 14, color: theme.activeBg }} />
                <select
                  value={deliveryPlatform}
                  onChange={(e) => setDeliveryPlatform(e.target.value)}
                  title="Delivery Partner / Platform"
                  style={{
                    height: '24px',
                    padding: '0 6px',
                    borderRadius: '5px',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgCard,
                    color: theme.activeBg,
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: 'none',
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

              {/* Loyalty badge if customer has points */}
              {customerLoyaltyPoints > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  backgroundColor: 'rgba(234, 179, 8, 0.14)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  color: '#CA8A04',
                  fontSize: '10.5px',
                  fontWeight: 800,
                  flexShrink: 0,
                }}>
                  <StarRoundedIcon sx={{ fontSize: 13 }} />
                  <span>{customerLoyaltyPoints} Pts</span>
                </div>
              )}

              {/* Actions: Reset & Frequent */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                {(customerName !== 'Guest Customer' || customerPhone) && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerName('Guest Customer');
                      setCustomerPhone('');
                      setSelectedCustomerId(null);
                      setCustomerLoyaltyPoints(0);
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
                  onClick={() => setShowAddCustomerModal(true)}
                  title="Add new customer"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: theme.posBtnBg,
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '4px',
                  }}
                >
                  <PersonAddAltRoundedIcon sx={{ fontSize: 14 }} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowCustomerPicker((prev) => !prev);
                    if (!showCustomerPicker) fetchCustomersData();
                  }}
                  title="Select customer from database"
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
                  <PeopleAltRoundedIcon sx={{ fontSize: 14 }} />
                </button>
              </div>
            </div>

            {/* Customers Popover (API 40: GET /api/customers) */}
            {showCustomerPicker && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: '0.85rem',
                right: '0.85rem',
                backgroundColor: theme.bgCard,
                border: `1px solid ${theme.border}`,
                borderRadius: '0.65rem',
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                zIndex: 50,
                maxHeight: '260px',
                overflowY: 'auto',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: theme.textSecondary,
                  borderBottom: `1px solid ${theme.border}`,
                  paddingBottom: '4px',
                }}>
                  <span>Customer Directory</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomerPicker(false);
                        setShowAddCustomerModal(true);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: theme.posBtnBg,
                        fontSize: '10.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      + Add New
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomerPicker(false)}
                      style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: 0 }}
                    >
                      <CloseRoundedIcon sx={{ fontSize: 13 }} />
                    </button>
                  </div>
                </div>

                {/* Filter / Search input */}
                <input
                  type="text"
                  placeholder="Filter by name or phone..."
                  onChange={(e) => fetchCustomersData(e.target.value)}
                  style={{
                    height: '26px',
                    padding: '0 6px',
                    borderRadius: '4px',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgCardSubtle,
                    color: theme.textPrimary,
                    fontSize: '11px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                {isSearchingCustomers ? (
                  <div style={{ padding: '0.65rem 0.5rem', fontSize: '11px', color: theme.textSecondary, textAlign: 'center' }}>
                    Searching customers...
                  </div>
                ) : customersList.length === 0 ? (
                  <div style={{ padding: '0.65rem 0.5rem', fontSize: '11px', color: theme.textSecondary, textAlign: 'center' }}>
                    No registered customers found.
                  </div>
                ) : (
                  customersList.map((cust) => (
                    <div
                      key={cust.id}
                      onClick={() => {
                        setCustomerName(cust.name);
                        setCustomerPhone(cust.phone);
                        setSelectedCustomerId(cust.id);
                        setCustomerLoyaltyPoints(cust.loyaltyPoints || 0);
                        setShowCustomerPicker(false);
                      }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.4rem 0.5rem',
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
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: theme.textPrimary }}>
                          {cust.name}
                        </span>
                        <span style={{ fontSize: '10px', color: theme.textSecondary }}>
                          {cust.phone}
                        </span>
                      </div>
                      {cust.loyaltyPoints > 0 && (
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          color: '#CA8A04',
                          backgroundColor: 'rgba(234, 179, 8, 0.12)',
                          padding: '2px 5px',
                          borderRadius: '4px',
                        }}>
                          ⭐ {cust.loyaltyPoints} Pts
                        </span>
                      )}
                    </div>
                  ))
                )}
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
            gap: '0.35rem',
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
              <>
                {cart.map((item) => {
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
                        padding: '0.4rem 0.5rem',
                        borderRadius: '0.6rem',
                        border: `1px solid ${theme.border}`,
                        backgroundColor: theme.bgCardSubtle,
                      }}
                    >
                      {/* Product Thumbnail */}
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        backgroundColor: theme.bgCard,
                        border: `1px solid ${theme.border}`,
                      }}>
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', padding: '4px', backgroundColor: theme.bgCard }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                          }}>🍽️</div>
                        )}
                      </div>

                      {/* Name + Variant */}
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
                            backgroundColor: 'rgba(34, 197, 94, 0.15)',
                            color: '#16A34A',
                            padding: '1px 5px',
                            borderRadius: '4px',
                          }}>
                            {item.discountPct ? `${item.discountPct}% OFF` : `-₹${item.discountAmount}`}
                          </span>
                        )}
                        {item.itemNote && (
                          <div style={{ fontSize: '10px', color: theme.activeBg, marginTop: '2px' }}>ðŸ“ {item.itemNote}</div>
                        )}
                      </div>

                      {/* Qty Stepper */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          backgroundColor: theme.bgCard,
                          border: `1px solid ${theme.border}`,
                          borderRadius: '7px',
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
                        width: '48px',
                        textAlign: 'right',
                        fontSize: '13px',
                        fontWeight: 800,
                        color: theme.textPrimary,
                        flexShrink: 0,
                      }}>
                        ₹{lineTotal}
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, -item.quantity); }}
                        style={{
                          background: 'none', border: 'none',
                          color: '#EF4444', cursor: 'pointer',
                          padding: '2px', display: 'flex', alignItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                      </button>
                    </div>
                  );
                })}


              </>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: theme.textSecondary }}>
                <span>Subtotal</span>
                <span style={{ color: theme.textPrimary, fontWeight: 600 }}>₹{subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: theme.textSecondary, alignItems: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                  Discount{' '}
                  {discountPct > 0 ? (
                    <>
                      <span style={{ color: '#16A34A', fontWeight: 700 }}>({discountPct}%)</span>
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
                          border: '1px solid rgba(22, 163, 74, 0.45)',
                          background: 'rgba(22, 163, 74, 0.08)',
                          color: '#16A34A',
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
                    >Add Discount</button>
                  )}
                </span>
                <span style={{ color: discountPct > 0 ? '#16A34A' : theme.textSecondary, fontWeight: 600 }}>
                  {discountPct > 0 ? `-₹${manualDiscount}` : '₹0'}
                </span>
              </div>
              {promoDiscountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#059669' }}>
                  <span>Promo ({appliedPromoCode})</span>
                  <span style={{ fontWeight: 700 }}>-₹{promoDiscountAmount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: theme.textSecondary }}>
                <span>Tax (GST 5%)</span>
                <span style={{ color: theme.textPrimary, fontWeight: 600 }}>₹{tax}</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                fontSize: '16px', fontWeight: 800, color: theme.textPrimary,
                paddingTop: '0.3rem', borderTop: `1px dashed ${theme.border}`, marginTop: '0.1rem',
              }}>
                <span>Total Amount</span>
                <span style={{ fontSize: '19px', fontWeight: 900, color: theme.textPrimary }}>₹{total}</span>
              </div>
            </div>

            {/* Promo Code Input / Applied Badge */}
            <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#F8FAFC',
                  borderRadius: '0.5rem',
                  border: `1px solid ${theme.border}`,
                  padding: '2px 8px',
                  height: '31px',
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
                  height: '31px',
                  padding: '0 10px',
                  borderRadius: '0.5rem',
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

            {/* Action Buttons: Hold Sale */}
            <div style={{ display: 'flex', gap: '0.45rem' }}>
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={handleHoldSale}
                style={{
                  flex: 1, height: '31px',
                  borderRadius: '0.5rem',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.bgCardSubtle,
                  color: theme.textPrimary,
                  fontSize: '11px', fontWeight: 700,
                  cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: cart.length === 0 ? 0.45 : 1,
                  transition: 'all 0.15s ease', fontFamily: 'inherit',
                }}
              >
                Hold Sale
              </button>
            </div>

            {/* Primary Payment Button (Charge ₹Total) */}
            <button
              type="button"
              role="button"
              className="button-20"
              disabled={cart.length === 0}
              onClick={() => setShowPaymentModal(true)}
              style={{
                width: '100%',
                height: '44px',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                opacity: cart.length === 0 ? 0.45 : 1,
              }}
            >
              <span>Charge ₹{total}</span>
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
            setCustomerName('Guest Customer');
            setCustomerPhone('');
            setSelectedCustomerId(null);
            setCustomerLoyaltyPoints(0);
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

            // Update dining table status to OCCUPIED if dine_in
            if (orderType === 'dine_in') {
              const currentTbl = diningTables.find((t) => t.tableNumber === tableNumber);
              if (currentTbl) {
                handleUpdateTableStatus(currentTbl.id, 'OCCUPIED', orderNumber);
              }
            }
          } catch (e) {}

          // Clear cart so next order starts clean
          setCart([]);
          setSaleNote('');
          setPaymentNote('');
          setCustomerName('Guest Customer');
          setCustomerPhone('');
          setSelectedCustomerId(null);
          setCustomerLoyaltyPoints(0);
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

      {/* QUICK ADD CUSTOMER MODAL (API 41: POST /api/customers) */}
      {showAddCustomerModal && (
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
            boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PersonAddAltRoundedIcon sx={{ fontSize: 22, color: theme.posBtnBg }} />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Quick Add Customer
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddCustomerModal(false);
                  setAddCustomerError(null);
                }}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            {addCustomerError && (
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
                {addCustomerError}
              </div>
            )}

            <form onSubmit={handleCreateCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '6px' }}>
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
                    height: '42px',
                    padding: '0 0.85rem',
                    borderRadius: '0.65rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgCardSubtle,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    fontWeight: 600,
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '6px' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 0.85rem',
                    borderRadius: '0.65rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgCardSubtle,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    fontWeight: 600,
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '6px' }}>
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={newCustomerEmail}
                  onChange={(e) => setNewCustomerEmail(e.target.value)}
                  placeholder="rahul@example.com"
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

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '6px' }}>
                  Delivery / Billing Address (Optional)
                </label>
                <input
                  type="text"
                  value={newCustomerAddress}
                  onChange={(e) => setNewCustomerAddress(e.target.value)}
                  placeholder="Flat 402, Sunshine Apts"
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
                  disabled={isCreatingCustomer}
                  style={{
                    flex: 1,
                    height: '42px',
                    borderRadius: '0.75rem',
                    backgroundColor: theme.posBtnBg,
                    color: theme.posBtnText,
                    fontSize: '13px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: isCreatingCustomer ? 'not-allowed' : 'pointer',
                    opacity: isCreatingCustomer ? 0.7 : 1,
                  }}
                >
                  {isCreatingCustomer ? 'Registering...' : 'Register Customer'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
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
