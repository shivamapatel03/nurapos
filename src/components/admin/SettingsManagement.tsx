'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Material Rounded Icons
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import StoreRoundedIcon from '@mui/icons-material/StoreRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import WifiRoundedIcon from '@mui/icons-material/WifiRounded';
import UsbRoundedIcon from '@mui/icons-material/UsbRounded';
import BluetoothRoundedIcon from '@mui/icons-material/BluetoothRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KitchenRoundedIcon from '@mui/icons-material/KitchenRounded';
import TableRestaurantRoundedIcon from '@mui/icons-material/TableRestaurantRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import ChairRoundedIcon from '@mui/icons-material/ChairRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { ThemeId, APP_THEMES } from '@/lib/themeConfig';
import { clearAuthSession } from '@/lib/auth';
import {
  logoutUser,
  getFranchises,
  getFranchiseById,
  createFranchise,
  updateFranchise,
  deleteFranchise,
  getStoreSettings,
  saveStoreSettings,
  getHardwareSettings,
  saveHardwareSettings,
} from '@/lib/api-client';
import {
  FranchiseResponse,
  CreateFranchiseRequest,
  UpdateFranchiseRequest,
} from '@/types/franchise';

// ============================================================================
// TYPES
// ============================================================================
export type SettingsSubTab =
  | 'set_store'
  | 'set_tables'
  | 'set_hardware';

export interface RestaurantTable {
  id: string;
  number: string;
  section: string;
  capacity: number;
  shape: 'square' | 'round' | 'rect';
  status: 'available' | 'occupied' | 'reserved';
  currentOrder?: string;
  orderTotal?: string;
  serverName?: string;
  guests?: number;
  notes?: string;
}

interface SettingsManagementProps {
  activeSubTab: SettingsSubTab;
  onSelectSubTab: (tab: SettingsSubTab) => void;
  theme: any;
  currentThemeId?: ThemeId;
  onSelectTheme?: (themeId: ThemeId) => void;
  onLogout?: () => void;
}

export default function SettingsManagement({
  activeSubTab,
  onSelectSubTab,
  theme,
  currentThemeId = 'bw_light',
  onSelectTheme,
  onLogout,
}: SettingsManagementProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSettingsLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    if (onLogout) {
      onLogout();
      return;
    }
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuthSession();
      if (typeof window !== 'undefined') {
        window.location.replace('/signin');
      }
    }
  };

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // ============================================================================
  // FRANCHISE OUTLETS STATE & HANDLERS (PHASE 3 BATCH 2)
  // ============================================================================
  const [franchises, setFranchises] = useState<FranchiseResponse[]>([]);
  const [isLoadingFranchises, setIsLoadingFranchises] = useState<boolean>(true);
  const [franchiseError, setFranchiseError] = useState<string | null>(null);
  const [activeFranchiseId, setActiveFranchiseId] = useState<number | null>(null);

  // Add Franchise Modal State
  const [showAddFranchiseModal, setShowAddFranchiseModal] = useState<boolean>(false);
  const [isSubmittingAddFranchise, setIsSubmittingAddFranchise] = useState<boolean>(false);
  const [addFranchiseForm, setAddFranchiseForm] = useState<CreateFranchiseRequest>({
    franchiseName: '',
    ownerName: '',
    contact: '',
    city: '',
    address: '',
  });
  const [addFranchiseErrors, setAddFranchiseErrors] = useState<Record<string, string>>({});

  // Edit Franchise Modal State
  const [editingFranchise, setEditingFranchise] = useState<FranchiseResponse | null>(null);
  const [isLoadingEditDetails, setIsLoadingEditDetails] = useState<boolean>(false);
  const [isSubmittingEditFranchise, setIsSubmittingEditFranchise] = useState<boolean>(false);
  const [editFranchiseForm, setEditFranchiseForm] = useState<UpdateFranchiseRequest>({
    franchiseName: '',
    ownerName: '',
    contact: '',
    city: '',
    address: '',
    status: 'ACTIVE',
  });
  const [editFranchiseErrors, setEditFranchiseErrors] = useState<Record<string, string>>({});

  // Delete Franchise Modal State
  const [deletingFranchise, setDeletingFranchise] = useState<FranchiseResponse | null>(null);
  const [isDeletingFranchise, setIsDeletingFranchise] = useState<boolean>(false);
  const [deleteConflictError, setDeleteConflictError] = useState<string | null>(null);

  // Load Franchises (API 1: GET /api/franchises)
  const fetchFranchisesList = async () => {
    setIsLoadingFranchises(true);
    setFranchiseError(null);
    try {
      const res = await getFranchises();
      if (res.data) {
        setFranchises(res.data);
        if (!activeFranchiseId && res.data.length > 0) {
          setActiveFranchiseId(res.data[0].franchiseId);
        }
      }
      try {
        const storeRes = await getStoreSettings();
        if (storeRes?.data?.storeName) setStoreName(storeRes.data.storeName);
      } catch {
        // ignore
      }
      try {
        const hwRes = await getHardwareSettings();
        if (hwRes?.data?.printerIp) setPrinterIp(hwRes.data.printerIp);
      } catch {
        // ignore
      }
    } catch (err: any) {
      console.error('Failed to fetch franchises:', err);
      setFranchiseError(err.message || 'Failed to fetch franchises');
    } finally {
      setIsLoadingFranchises(false);
    }
  };

  useEffect(() => {
    fetchFranchisesList();
  }, []);

  // Open Edit Franchise (API 2: GET /api/franchises/{id})
  const handleOpenEditFranchise = async (franchise: FranchiseResponse) => {
    setEditingFranchise(franchise);
    setEditFranchiseErrors({});
    setIsLoadingEditDetails(true);
    setEditFranchiseForm({
      franchiseName: franchise.franchiseName,
      ownerName: franchise.ownerName || '',
      contact: franchise.contact || '',
      city: franchise.city || '',
      address: franchise.address || '',
      status: (franchise.status as 'ACTIVE' | 'INACTIVE') || 'ACTIVE',
    });

    try {
      const fresh = await getFranchiseById(franchise.franchiseId);
      if (fresh.data) {
        setEditFranchiseForm({
          franchiseName: fresh.data.franchiseName,
          ownerName: fresh.data.ownerName || '',
          contact: fresh.data.contact || '',
          city: fresh.data.city || '',
          address: fresh.data.address || '',
          status: (fresh.data.status as 'ACTIVE' | 'INACTIVE') || 'ACTIVE',
        });
      }
    } catch (err) {
      console.warn('Could not fetch latest franchise details, using cached card info:', err);
    } finally {
      setIsLoadingEditDetails(false);
    }
  };

  // Submit Add Franchise (API 3: POST /api/franchises)
  const handleAddFranchise = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!addFranchiseForm.franchiseName.trim()) {
      errors.franchiseName = 'Franchise name is required.';
    } else if (addFranchiseForm.franchiseName.trim().length < 2 || addFranchiseForm.franchiseName.trim().length > 100) {
      errors.franchiseName = 'Franchise name must be between 2 and 100 characters.';
    }

    if (addFranchiseForm.contact && addFranchiseForm.contact.trim()) {
      if (!/^[0-9]{10,15}$/.test(addFranchiseForm.contact.trim())) {
        errors.contact = 'Contact must contain 10 to 15 numeric digits.';
      }
    }

    if (addFranchiseForm.ownerName && addFranchiseForm.ownerName.trim().length > 100) {
      errors.ownerName = 'Owner name cannot exceed 100 characters.';
    }

    if (addFranchiseForm.city && addFranchiseForm.city.trim().length > 50) {
      errors.city = 'City cannot exceed 50 characters.';
    }

    if (addFranchiseForm.address && addFranchiseForm.address.trim().length > 500) {
      errors.address = 'Address cannot exceed 500 characters.';
    }

    if (Object.keys(errors).length > 0) {
      setAddFranchiseErrors(errors);
      return;
    }

    setIsSubmittingAddFranchise(true);
    setAddFranchiseErrors({});

    try {
      const res = await createFranchise({
        franchiseName: addFranchiseForm.franchiseName.trim(),
        ownerName: addFranchiseForm.ownerName?.trim() || undefined,
        contact: addFranchiseForm.contact?.trim() || undefined,
        city: addFranchiseForm.city?.trim() || undefined,
        address: addFranchiseForm.address?.trim() || undefined,
      });

      showToast(`Outlet "${res.data?.franchiseName || addFranchiseForm.franchiseName}" created successfully!`);
      setShowAddFranchiseModal(false);
      setAddFranchiseForm({
        franchiseName: '',
        ownerName: '',
        contact: '',
        city: '',
        address: '',
      });
      await fetchFranchisesList();
    } catch (err: any) {
      console.error('Create franchise failed:', err);
      setAddFranchiseErrors({
        submit: err.message || 'Failed to create franchise outlet. Please try again.',
      });
    } finally {
      setIsSubmittingAddFranchise(false);
    }
  };

  // Submit Update Franchise (API 4: PUT /api/franchises/{id})
  const handleUpdateFranchise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFranchise) return;
    const errors: Record<string, string> = {};

    if (!editFranchiseForm.franchiseName.trim()) {
      errors.franchiseName = 'Franchise name is required.';
    } else if (editFranchiseForm.franchiseName.trim().length < 2 || editFranchiseForm.franchiseName.trim().length > 100) {
      errors.franchiseName = 'Franchise name must be between 2 and 100 characters.';
    }

    if (editFranchiseForm.contact && editFranchiseForm.contact.trim()) {
      if (!/^[0-9]{10,15}$/.test(editFranchiseForm.contact.trim())) {
        errors.contact = 'Contact must contain 10 to 15 numeric digits.';
      }
    }

    if (editFranchiseForm.ownerName && editFranchiseForm.ownerName.trim().length > 100) {
      errors.ownerName = 'Owner name cannot exceed 100 characters.';
    }

    if (editFranchiseForm.city && editFranchiseForm.city.trim().length > 50) {
      errors.city = 'City cannot exceed 50 characters.';
    }

    if (editFranchiseForm.address && editFranchiseForm.address.trim().length > 500) {
      errors.address = 'Address cannot exceed 500 characters.';
    }

    if (Object.keys(errors).length > 0) {
      setEditFranchiseErrors(errors);
      return;
    }

    setIsSubmittingEditFranchise(true);
    setEditFranchiseErrors({});

    try {
      const res = await updateFranchise(editingFranchise.franchiseId, {
        franchiseName: editFranchiseForm.franchiseName.trim(),
        ownerName: editFranchiseForm.ownerName?.trim() || undefined,
        contact: editFranchiseForm.contact?.trim() || undefined,
        city: editFranchiseForm.city?.trim() || undefined,
        address: editFranchiseForm.address?.trim() || undefined,
        status: editFranchiseForm.status,
      });

      showToast(`Outlet "${res.data?.franchiseName || editFranchiseForm.franchiseName}" updated successfully!`);
      setEditingFranchise(null);
      await fetchFranchisesList();
    } catch (err: any) {
      console.error('Update franchise failed:', err);
      setEditFranchiseErrors({
        submit: err.message || 'Failed to update franchise outlet. Please try again.',
      });
    } finally {
      setIsSubmittingEditFranchise(false);
    }
  };

  // Submit Delete Franchise (API 5: DELETE /api/franchises/{id})
  const handleDeleteFranchise = async () => {
    if (!deletingFranchise) return;
    setIsDeletingFranchise(true);
    setDeleteConflictError(null);

    try {
      await deleteFranchise(deletingFranchise.franchiseId);
      showToast(`Outlet "${deletingFranchise.franchiseName}" deleted successfully.`);
      if (activeFranchiseId === deletingFranchise.franchiseId) {
        setActiveFranchiseId(null);
      }
      setDeletingFranchise(null);
      await fetchFranchisesList();
    } catch (err: any) {
      console.error('Delete franchise failed:', err);
      const isConflict =
        err.statusCode === 409 ||
        err.message?.includes('already being used') ||
        err.message?.includes('foreign key');
      setDeleteConflictError(
        isConflict
          ? 'This franchise cannot be deleted because it is already being used by other records (such as active employees, sales orders, or inventory items).'
          : (err.message || 'Failed to delete franchise outlet.')
      );
    } finally {
      setIsDeletingFranchise(false);
    }
  };

  // Modern animated Toggle Switch component
  const renderToggle = (checked: boolean, onToggle: () => void) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      style={{
        width: '42px',
        height: '24px',
        borderRadius: '9999px',
        backgroundColor: checked
          ? theme.activeBg
          : (theme.headerIsDark ? '#3F3F46' : '#D1D5DB'),
        position: 'relative',
        transition: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0,
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        outline: 'none',
        display: 'inline-block',
      }}
    >
      <div
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          backgroundColor: checked ? theme.activeText : '#FFFFFF',
          position: 'absolute',
          top: '3px',
          left: checked ? '21px' : '3px',
          transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
        }}
      />
    </button>
  );

  // Dedicated Save Button Footer for each settings component card

  // Save Store Profile (wired to PUT /api/settings/store)
  const handleSaveStoreProfile = async () => {
    try {
      const res = await saveStoreSettings({
        storeName: storeName || '',
        storeCode: storeCode || '',
        currencyCode: 'INR',
        currencySymbol: '₹',
        defaultTaxRate: 5,
        taxInclusive: true,
        roundingRule: 'none',
        address: [storeAddressStreet, storeCity, storeState, storePincode].filter(Boolean).join(', '),
        phone: storePhone || '',
        email: storeEmail || '',
        website: storeWebsite || '',
      });
      if (res?.data) {
        showToast('Store Profile saved successfully!');
      } else {
        showToast('Store Profile updated.');
      }
    } catch (err: any) {
      console.error('Failed to save store settings:', err);
      showToast('Error saving Store Profile');
    }
  };

  // Save Hardware Settings (wired to PUT /api/settings/hardware)
  const handleSaveHardware = async () => {
    try {
      const res = await saveHardwareSettings({
        printerIp: printerIp || '192.168.1.200:9100',
        printerHost: printerIp || '192.168.1.200',
        printerPort: 9100,
        paperWidth: paperWidth === '80mm' ? 80 : 58,
        characterWidth: paperWidth === '80mm' ? 48 : 32,
        autoKickDrawer: cashDrawerPulseOnCash,
        cashDrawerKickCode: '27,112,0,25,250',
        scannerContinuousRead: true,
        customerDisplayEnabled: false,
      });
      if (res?.data) {
        showToast('Hardware settings saved successfully!');
      } else {
        showToast('Hardware settings updated.');
      }
    } catch (err: any) {
      console.error('Failed to save hardware settings:', err);
      showToast('Error saving Hardware settings');
    }
  };

  const renderCardFooter = (sectionName: string, onSaveCustom?: () => void) => (
    <div
      style={{
        marginTop: '1.25rem',
        paddingTop: '1rem',
        borderTop: `1px solid ${theme.border}`,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
    >
      <button
        type="button"
        className="button-20"
        role="button"
        onClick={() => {
          if (onSaveCustom) {
            onSaveCustom();
          } else {
            showToast(`${sectionName} saved successfully!`);
          }
        }}
        style={{
          height: '34px',
          padding: '0 1rem',
          fontSize: '12.5px',
          fontWeight: 700,
          fontFamily: 'inherit',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}
      >
        <CheckRoundedIcon sx={{ fontSize: 16 }} />
        <span>Save Changes</span>
      </button>
    </div>
  );

  // 1. STORE PROFILE STATE
  const [storeName, setStoreName] = useState('SP CAFE & Bistro');
  const [storeCode, setStoreCode] = useState('STR-AHM-01');
  const [storeTagline, setStoreTagline] = useState('Artisanal Coffee & Gourmet Bistro Experience');
  const [storeOutletType, setStoreOutletType] = useState('Flagship Cafe & Bakery');
  const [storePhone, setStorePhone] = useState('+91 98765 43210');
  const [storeEmail, setStoreEmail] = useState('billing@spcafe.in');
  const [supportEmail, setSupportEmail] = useState('support@spcafe.in');
  const [storeWebsite, setStoreWebsite] = useState('https://spcafe.in');
  const [storeAddressStreet, setStoreAddressStreet] = useState('Plot 42, CG Road, Navrangpura');
  const [storeCity, setStoreCity] = useState('Ahmedabad');
  const [storeState, setStoreState] = useState('Gujarat');
  const [storePincode, setStorePincode] = useState('380009');
  
  // 2. BUSINESS SETTINGS STATE
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [currencyCode, setCurrencyCode] = useState('INR');
  const [currencyPosition, setCurrencyPosition] = useState<'before' | 'after'>('before');
  const [timezone, setTimezone] = useState('Asia/Kolkata (GMT+5:30)');
  const [financialYearStart, setFinancialYearStart] = useState('April');
  const [businessVertical, setBusinessVertical] = useState('Cafe & Bistro');
  const [isMultiOutletEnabled, setIsMultiOutletEnabled] = useState(true);
  const [inventoryValuation, setInventoryValuation] = useState<'FIFO' | 'Weighted Average'>('FIFO');

  // 3. TAX & INVOICING STATE
  const [gstin, setGstin] = useState('24AAAAA0000A1Z5');
  const [pricingMode, setPricingMode] = useState<'inclusive' | 'exclusive'>('inclusive');
  const [invoicePrefix, setInvoicePrefix] = useState('INV-2026-');
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState('00482');
  const [receiptHeader, setReceiptHeader] = useState('SP CAFE & BISTRO • AHMEDABAD');
  const [receiptFooter, setReceiptFooter] = useState(
    'Thank you for dining with us! Follow us on IG @spcafe.ahmedabad • FSSAI Lic No: 10722026000123'
  );
  const [defaultHsnFnb, setDefaultHsnFnb] = useState('996331');
  const [defaultHsnGoods, setDefaultHsnGoods] = useState('090121');
  const [taxSlabs, setTaxSlabs] = useState([
    { id: '1', name: 'GST 0%', rate: 0, desc: 'Fresh Produce & Exempt' },
    { id: '2', name: 'GST 5%', rate: 5, desc: 'F&B Cafe & Restaurant Billing (Default)' },
    { id: '3', name: 'GST 12%', rate: 12, desc: 'Packaged Foods & Dairy' },
    { id: '4', name: 'GST 18%', rate: 18, desc: 'Merchandise & Coffee Beans' },
    { id: '5', name: 'GST 28%', rate: 28, desc: 'Luxury Confectionery' },
  ]);

  // 4. PAYMENTS STATE
  const [paymentMethods, setPaymentMethods] = useState({
    cash: true,
    upi: true,
    card: true,
    khata: true,
    wallets: false,
  });
  const [upiVpa, setUpiVpa] = useState('spcafe.pos@icicibank');
  const [upiMerchantName, setUpiMerchantName] = useState('SP CAFE HOSPITALITY LLP');
  const [autoDynamicUpiQr, setAutoDynamicUpiQr] = useState(true);
  const [cardTerminalModel, setCardTerminalModel] = useState('PineLabs Plutus Smart Android EDC');
  const [cardTerminalIp, setCardTerminalIp] = useState('192.168.1.145:8080');
  const [cardSurchargeEnabled, setCardSurchargeEnabled] = useState(false);
  const [cardSurchargePercent, setCardSurchargePercent] = useState('1.5');
  const [autoRoundOff, setAutoRoundOff] = useState(true);

  // 5. HARDWARE STATE
  const [printerInterface, setPrinterInterface] = useState<'LAN' | 'USB' | 'Bluetooth'>('LAN');
  const [printerIp, setPrinterIp] = useState('192.168.1.200:9100');
  const [paperWidth, setPaperWidth] = useState<'80mm' | '58mm'>('80mm');
  const [autoCutter, setAutoCutter] = useState(true);
  const [printKdsKot, setPrintKdsKot] = useState(true);
  const [scannerInterface, setScannerInterface] = useState<'USB HID' | 'Bluetooth Wedge'>('USB HID');
  const [scannerBeep, setScannerBeep] = useState(true);
  const [scannerContinuous, setScannerContinuous] = useState(false);
  const [cashDrawerPulseOnCash, setCashDrawerPulseOnCash] = useState(true);
  const [scalePort, setScalePort] = useState('COM3');
  const [scaleBaudRate, setScaleBaudRate] = useState('9600');

  // 6. POS SETTINGS STATE
  const [expressBillingMode, setExpressBillingMode] = useState(false);
  const [autoPrintReceipt, setAutoPrintReceipt] = useState(true);
  const [kdsAutoDispatch, setKdsAutoDispatch] = useState(true);
  const [audioFeedback, setAudioFeedback] = useState(true);
  const [tableManagementEnabled, setTableManagementEnabled] = useState(true);
  const [blockOutOfStockSales, setBlockOutOfStockSales] = useState(true);
  const [managerPinDiscountThreshold, setManagerPinDiscountThreshold] = useState('15');

  // 7. NOTIFICATIONS STATE
  const [notifyLowStock, setNotifyLowStock] = useState(true);
  const [notifyLowStockEmail, setNotifyLowStockEmail] = useState('manager.ahmedabad@spcafe.in');
  const [notifyEndOfDaySummary, setNotifyEndOfDaySummary] = useState(true);
  const [notifyEndOfDayEmail, setNotifyEndOfDayEmail] = useState('owner@spcafe.in');
  const [notifyShiftDiscrepancy, setNotifyShiftDiscrepancy] = useState(true);
  const [discrepancyThreshold, setDiscrepancyThreshold] = useState('100');
  const [notifyOrderVoidRefund, setNotifyOrderVoidRefund] = useState(true);

  // 8. USERS & PERMISSIONS STATE
  const [roles, setRoles] = useState([
    { id: 'r1', name: 'Owner / Super Admin', usersCount: 1, isSystem: true },
    { id: 'r2', name: 'Store Manager', usersCount: 3, isSystem: false },
    { id: 'r3', name: 'Cashier / Counter Staff', usersCount: 6, isSystem: false },
    { id: 'r4', name: 'Inventory Clerk', usersCount: 2, isSystem: false },
  ]);
  const [permissionsMatrix, setPermissionsMatrix] = useState<Record<string, Record<string, boolean>>>({
    r1: { discounts: true, voidOrder: true, viewProfit: true, editInventory: true, accessSettings: true, kickDrawer: true },
    r2: { discounts: true, voidOrder: true, viewProfit: true, editInventory: true, accessSettings: false, kickDrawer: true },
    r3: { discounts: false, voidOrder: false, viewProfit: false, editInventory: false, accessSettings: false, kickDrawer: true },
    r4: { discounts: false, voidOrder: false, viewProfit: false, editInventory: true, accessSettings: false, kickDrawer: false },
  });

  // 9. SECURITY STATE
  const [sessionTimeout, setSessionTimeout] = useState('15');
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [enforceCashierPin, setEnforceCashierPin] = useState(true);
  const [ipWhitelisting, setIpWhitelisting] = useState(true);
  const [whitelistedSubnet, setWhitelistedSubnet] = useState('192.168.1.0/24');
  const [auditLogs] = useState([
    { id: 'sec-1', timestamp: '2026-09-20 16:45', user: 'Rahul Sharma (Owner)', action: 'Updated Tax Slabs', ip: '192.168.1.102' },
    { id: 'sec-2', timestamp: '2026-09-20 14:12', user: 'Alex Vance (Manager)', action: 'Cash Drawer Manual Open', ip: '192.168.1.110' },
    { id: 'sec-3', timestamp: '2026-09-20 12:30', user: 'Priya Patel (Cashier)', action: 'Shift #42 Login Verified', ip: '192.168.1.105' },
    { id: 'sec-4', timestamp: '2026-09-19 21:15', user: 'Alex Vance (Manager)', action: 'Void Order #9812 Approved', ip: '192.168.1.110' },
  ]);

  // 10. TABLE SETTING & DINE-IN STATE
  const [tableSectionFilter, setTableSectionFilter] = useState('All');
  const [sections, setSections] = useState<string[]>([
    'Main Dining (Indoor)',
    'Patio / Outdoor',
    'Rooftop Terrace',
    'Bar & High Tops',
  ]);

  const [tables, setTables] = useState<RestaurantTable[]>([]);

  // Modal State for Table Add/Edit
  const [showTableModal, setShowTableModal] = useState(false);
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const [tableFormNumber, setTableFormNumber] = useState('');
  const [tableFormSection, setTableFormSection] = useState('Main Dining (Indoor)');
  const [tableFormCapacity, setTableFormCapacity] = useState(4);
  const [tableFormShape, setTableFormShape] = useState<'square' | 'round' | 'rect'>('square');
  const [tableFormStatus, setTableFormStatus] = useState<'available' | 'occupied' | 'reserved'>('available');
  const [tableFormNotes, setTableFormNotes] = useState('');

  // Add Section Modal State
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');

  // Dine-In Rules Toggles
  const [autoReleaseTableOnBill, setAutoReleaseTableOnBill] = useState(true);
  const [allowTableMerging, setAllowTableMerging] = useState(true);
  const [enforceGuestCount, setEnforceGuestCount] = useState(true);
  const [enableQrOrdering, setEnableQrOrdering] = useState(true);
  const [tableIdleAlert, setTableIdleAlert] = useState(true);

  // 11. TICKET NUMBER & KOT SETTING STATE
  const [ticketPrefix, setTicketPrefix] = useState('T-');
  const [takeawayPrefix, setTakeawayPrefix] = useState('TO-');
  const [ticketStartingNumber, setTicketStartingNumber] = useState('101');
  const [currentTicketNumber, setCurrentTicketNumber] = useState('142');
  const [ticketResetCycle, setTicketResetCycle] = useState<'daily' | 'continuous' | 'shift'>('daily');
  const [ticketDigitsPadding, setTicketDigitsPadding] = useState<'3' | '2' | '4' | 'none'>('3');
  const [separateTakeawaySequence, setSeparateTakeawaySequence] = useState(true);
  const [printLargeTokenOnBill, setPrintLargeTokenOnBill] = useState(true);
  const [printTableOnKot, setPrintTableOnKot] = useState(true);
  const [printServerNameOnKot, setPrintServerNameOnKot] = useState(true);
  const [autoIncrementOnDispatch, setAutoIncrementOnDispatch] = useState(true);
  const [ticketSoundChime, setTicketSoundChime] = useState(true);

  // Helper: Format Ticket Number
  const formatTicketNumber = (numStr: string, prefixStr: string, padStr: string) => {
    const n = parseInt(numStr, 10) || 1;
    let formatted = String(n);
    if (padStr === '2') formatted = String(n).padStart(2, '0');
    else if (padStr === '3') formatted = String(n).padStart(3, '0');
    else if (padStr === '4') formatted = String(n).padStart(4, '0');
    return `${prefixStr}${formatted}`;
  };

  const handleOpenAddTable = () => {
    setEditingTableId(null);
    const nextNum = `T-${String(tables.length + 1).padStart(2, '0')}`;
    setTableFormNumber(nextNum);
    setTableFormSection(tableSectionFilter !== 'All' ? tableSectionFilter : sections[0] || 'Main Dining (Indoor)');
    setTableFormCapacity(4);
    setTableFormShape('square');
    setTableFormStatus('available');
    setTableFormNotes('');
    setShowTableModal(true);
  };

  const handleOpenEditTable = (tbl: RestaurantTable) => {
    setEditingTableId(tbl.id);
    setTableFormNumber(tbl.number);
    setTableFormSection(tbl.section);
    setTableFormCapacity(tbl.capacity);
    setTableFormShape(tbl.shape);
    setTableFormStatus(tbl.status);
    setTableFormNotes(tbl.notes || '');
    setShowTableModal(true);
  };

  const handleSaveTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableFormNumber.trim()) {
      showToast('Please enter a table number / code.');
      return;
    }
    if (editingTableId) {
      setTables((prev) =>
        prev.map((t) =>
          t.id === editingTableId
            ? {
                ...t,
                number: tableFormNumber.trim(),
                section: tableFormSection,
                capacity: tableFormCapacity,
                shape: tableFormShape,
                status: tableFormStatus,
                notes: tableFormNotes.trim() || undefined,
              }
            : t
        )
      );
      showToast(`Table ${tableFormNumber} updated successfully!`);
    } else {
      const newTbl: RestaurantTable = {
        id: `tbl-${Date.now()}`,
        number: tableFormNumber.trim(),
        section: tableFormSection,
        capacity: tableFormCapacity,
        shape: tableFormShape,
        status: tableFormStatus,
        notes: tableFormNotes.trim() || undefined,
      };
      setTables((prev) => [...prev, newTbl]);
      showToast(`Table ${tableFormNumber} created successfully!`);
    }
    setShowTableModal(false);
  };

  const handleDeleteTable = (id: string, num: string) => {
    if (window.confirm(`Are you sure you want to delete Table ${num}?`)) {
      setTables((prev) => prev.filter((t) => t.id !== id));
      showToast(`Table ${num} deleted.`);
    }
  };

  const handleToggleTableStatus = (id: string) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus: RestaurantTable['status'] =
            t.status === 'available' ? 'occupied' : t.status === 'occupied' ? 'reserved' : 'available';
          return {
            ...t,
            status: nextStatus,
            currentOrder: nextStatus === 'occupied' ? (t.currentOrder || `#${Math.floor(100 + Math.random() * 50)}`) : undefined,
            orderTotal: nextStatus === 'occupied' ? (t.orderTotal || `₹${Math.floor(400 + Math.random() * 1500)}`) : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    if (sections.includes(newSectionName.trim())) {
      showToast('Section already exists.');
      return;
    }
    const createdSection = newSectionName.trim();
    setSections((prev) => [...prev, createdSection]);
    setTableSectionFilter(createdSection);
    setNewSectionName('');
    setShowAddSectionModal(false);
    showToast(`Section "${createdSection}" added.`);
  };



  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.75rem 1.25rem',
            backgroundColor: theme.textPrimary,
            color: theme.bgPage,
            borderRadius: '0.75rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            fontSize: '13.5px',
            fontWeight: 700,
          }}
        >
          <CheckCircleRoundedIcon sx={{ fontSize: 18, color: '#22C55E' }} />
          <span>{toastMessage}</span>
        </div>
      )}


      {/* SUB-TAB 1: STORE PROFILE */}
      {activeSubTab === 'set_store' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Card: Franchise Outlets Directory (Phase 3 Batch 2) */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '0.65rem',
                    backgroundColor: theme.activeBg,
                    color: theme.activeText,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ApartmentRoundedIcon sx={{ fontSize: 22 }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                      Franchise Outlets & Store Branches
                    </h2>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: theme.badgeBg,
                        color: theme.badgeText,
                      }}
                    >
                      {franchises.length} {franchises.length === 1 ? 'Outlet' : 'Outlets'}
                    </span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                    Provision branch locations, manage store contact info, and designate active registers.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={fetchFranchisesList}
                  disabled={isLoadingFranchises}
                  className="button-20-secondary"
                  style={{
                    height: '34px',
                    padding: '0 0.85rem',
                    fontSize: '12px',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <RefreshRoundedIcon
                    sx={{
                      fontSize: 16,
                      animation: isLoadingFranchises ? 'spin 1s linear infinite' : 'none',
                    }}
                  />
                  <span>Refresh</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAddFranchiseForm({
                      franchiseName: '',
                      ownerName: '',
                      contact: '',
                      city: '',
                      address: '',
                    });
                    setAddFranchiseErrors({});
                    setShowAddFranchiseModal(true);
                  }}
                  className="button-20"
                  style={{
                    height: '34px',
                    padding: '0 1rem',
                    fontSize: '12px',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <AddRoundedIcon sx={{ fontSize: 16 }} />
                  <span>Add Franchise Outlet</span>
                </button>
              </div>
            </div>

            {/* Error Alert */}
            {franchiseError && (
              <div
                style={{
                  marginBottom: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.55rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#DC2626',
                  fontSize: '12.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{franchiseError}</span>
                <button
                  type="button"
                  onClick={fetchFranchisesList}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#DC2626',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {isLoadingFranchises ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[1, 2].map((n) => (
                  <div
                    key={n}
                    style={{
                      height: '78px',
                      borderRadius: '0.65rem',
                      backgroundColor: theme.hoverBg,
                      opacity: 0.6,
                      animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                  />
                ))}
              </div>
            ) : franchises.length === 0 ? (
              /* Empty State */
              <div
                style={{
                  padding: '2.5rem 1rem',
                  textAlign: 'center',
                  borderRadius: '0.65rem',
                  backgroundColor: theme.bgPage,
                  border: `1px dashed ${theme.border}`,
                }}
              >
                <StoreRoundedIcon sx={{ fontSize: 36, color: theme.textSecondary, opacity: 0.5, marginBottom: '0.5rem' }} />
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: theme.textPrimary, margin: '0 0 0.25rem 0' }}>
                  No Franchise Outlets Registered
                </h3>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '0 0 1rem 0' }}>
                  Provision your primary outlet or multi-city branches to configure registers and track sales.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAddFranchiseForm({
                      franchiseName: '',
                      ownerName: '',
                      contact: '',
                      city: '',
                      address: '',
                    });
                    setAddFranchiseErrors({});
                    setShowAddFranchiseModal(true);
                  }}
                  className="button-20"
                  style={{
                    height: '32px',
                    padding: '0 0.95rem',
                    fontSize: '12px',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                  }}
                >
                  + Add First Outlet
                </button>
              </div>
            ) : (
              /* Outlet Grid / Cards */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {franchises.map((f) => {
                  const isSelected = activeFranchiseId === f.franchiseId;
                  const isActive = f.status === 'ACTIVE';

                  return (
                    <div
                      key={f.franchiseId}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        padding: '1.15rem',
                        borderRadius: '0.65rem',
                        backgroundColor: theme.bgPage,
                        border: `1px solid ${isSelected ? theme.activeBg : theme.border}`,
                        boxShadow: isSelected ? '0 0 0 1px ' + theme.activeBg : 'none',
                        transition: 'border-color 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <span
                            style={{
                              padding: '0.3rem 0.6rem',
                              borderRadius: '0.45rem',
                              backgroundColor: (theme as any).sidebarIsDark ? '#27272A' : '#E4E4E7',
                              color: theme.textSecondary,
                              fontSize: '11px',
                              fontWeight: 800,
                              fontFamily: 'monospace',
                              border: `1px solid ${theme.border}`,
                            }}
                          >
                            ID #{f.franchiseId}
                          </span>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '14.5px', fontWeight: 800, color: theme.textPrimary }}>
                                {f.franchiseName}
                              </span>
                              {isSelected && (
                                <span
                                  style={{
                                    fontSize: '10.5px',
                                    fontWeight: 800,
                                    padding: '2px 7px',
                                    borderRadius: '4px',
                                    backgroundColor: theme.activeBg,
                                    color: theme.activeText,
                                  }}
                                >
                                  Active Branch
                                </span>
                              )}
                              <span
                                style={{
                                  fontSize: '10.5px',
                                  fontWeight: 800,
                                  padding: '2px 8px',
                                  borderRadius: '9999px',
                                  backgroundColor: isActive ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                                  color: isActive ? '#16A34A' : '#DC2626',
                                  border: `1px solid ${isActive ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                                }}
                              >
                                {f.status}
                              </span>
                            </div>
                            {f.ownerName && (
                              <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '2px' }}>
                                Manager: <strong>{f.ownerName}</strong>
                              </div>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {!isSelected && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveFranchiseId(f.franchiseId);
                                showToast(`Active store set to "${f.franchiseName}".`);
                              }}
                              className="button-20-secondary"
                              style={{
                                height: '30px',
                                padding: '0 0.75rem',
                                fontSize: '11.5px',
                                fontWeight: 700,
                                fontFamily: 'inherit',
                              }}
                            >
                              Set Active
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleOpenEditFranchise(f)}
                            className="button-20-secondary"
                            style={{
                              height: '30px',
                              padding: '0 0.75rem',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              fontFamily: 'inherit',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <EditRoundedIcon sx={{ fontSize: 14 }} />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setDeletingFranchise(f);
                              setDeleteConflictError(null);
                            }}
                            style={{
                              height: '30px',
                              padding: '0 0.75rem',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              fontFamily: 'inherit',
                              backgroundColor: 'transparent',
                              color: '#DC2626',
                              border: '1px solid rgba(220, 38, 38, 0.3)',
                              borderRadius: '0.45rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <DeleteOutlineRoundedIcon sx={{ fontSize: 14 }} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Outlet Meta Info */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                          gap: '0.65rem',
                          paddingTop: '0.65rem',
                          borderTop: `1px solid ${theme.border}`,
                        }}
                      >
                        <div>
                          <span style={{ fontSize: '11px', color: theme.textSecondary, display: 'block' }}>City</span>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: theme.textPrimary }}>
                            {f.city || 'Not specified'}
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: '11px', color: theme.textSecondary, display: 'block' }}>Address</span>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: theme.textPrimary }}>
                            {f.address || 'Not specified'}
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: '11px', color: theme.textSecondary, display: 'block' }}>Contact Phone</span>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: theme.textPrimary }}>
                            {f.contact || 'No phone recorded'}
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: '11px', color: theme.textSecondary, display: 'block' }}>Provisioned On</span>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: theme.textPrimary }}>
                            {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Card: Basic Info & Branding */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <StoreRoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                Store Identity & Branding
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Store Name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Store ID / Outlet Code
                </label>
                <input
                  type="text"
                  value={storeCode}
                  onChange={(e) => setStoreCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Outlet Type
                </label>
                <input
                  type="text"
                  value={storeOutletType}
                  onChange={(e) => setStoreOutletType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Tagline / Brand Slogan
                </label>
                <input
                  type="text"
                  value={storeTagline}
                  onChange={(e) => setStoreTagline(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {renderCardFooter('Store Identity & Branding', handleSaveStoreProfile)}
          </div>

          {/* Card: Address & Contact Details */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <LocationOnRoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                Location & Contact Information
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Street Address
                </label>
                <input
                  type="text"
                  value={storeAddressStreet}
                  onChange={(e) => setStoreAddressStreet(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  City
                </label>
                <input
                  type="text"
                  value={storeCity}
                  onChange={(e) => setStoreCity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  State
                </label>
                <input
                  type="text"
                  value={storeState}
                  onChange={(e) => setStoreState(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Postal / Pin Code
                </label>
                <input
                  type="text"
                  value={storePincode}
                  onChange={(e) => setStorePincode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Business Phone
                </label>
                <input
                  type="text"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Invoicing Email
                </label>
                <input
                  type="email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Official Website
                </label>
                <input
                  type="text"
                  value={storeWebsite}
                  onChange={(e) => setStoreWebsite(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {renderCardFooter('Location & Contact Information', handleSaveStoreProfile)}
          </div>

          
        </div>
      )}

      {/* SUB-TAB 5: HARDWARE */}
      {activeSubTab === 'set_hardware' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Thermal Printer Settings */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PrintRoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Thermal Receipt & KOT Printer
                </h2>
              </div>

              <button
                type="button"
                className="button-20"
                role="button"
                onClick={() => showToast('Test ticket dispatched to thermal printer.')}
                style={{
                  height: '32px',
                  padding: '0 0.95rem',
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                }}
              >
                Test Print Receipt
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Connection Interface
                </label>
                <select
                  value={printerInterface}
                  onChange={(e) => setPrinterInterface(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                >
                  <option value="LAN">Ethernet Network IP (Recommended)</option>
                  <option value="USB">Direct USB Cable</option>
                  <option value="Bluetooth">Wireless Bluetooth</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Printer IP Address / Port
                </label>
                <input
                  type="text"
                  value={printerIp}
                  onChange={(e) => setPrinterIp(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Thermal Paper Width
                </label>
                <select
                  value={paperWidth}
                  onChange={(e) => setPaperWidth(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                >
                  <option value="80mm">80mm (Standard Full Width)</option>
                  <option value="58mm">58mm (Compact Portable)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: theme.textPrimary }}>Auto Paper Cutter</div>
                  <div style={{ fontSize: '11.5px', color: theme.textSecondary }}>Cut paper after ticket completes</div>
                </div>
                {renderToggle(autoCutter, () => setAutoCutter(!autoCutter))}
              </div>
            </div>

            {renderCardFooter('Thermal Printer Settings', handleSaveHardware)}
          </div>

          {/* Barcode Scanner & Cash Drawer */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Barcode Scanner */}
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
                borderRadius: '0.85rem',
                border: `1px solid ${theme.border}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 1rem 0' }}>
                  Barcode Scanner
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                      Scanner Protocol
                    </label>
                    <select
                      value={scannerInterface}
                      onChange={(e) => setScannerInterface(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '0.55rem',
                        border: `1px solid ${theme.border}`,
                        backgroundColor: theme.bgPage,
                        color: theme.textPrimary,
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      <option value="USB HID">USB HID Keyboard Emulation</option>
                      <option value="Bluetooth Wedge">Bluetooth Wireless Scanner</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: theme.textPrimary }}>
                      Audio Beep Confirmation on Scan
                    </span>
                    <button
                      type="button"
                      className={scannerBeep ? "button-20" : "button-20-secondary"}
                      role="button"
                      onClick={() => setScannerBeep(!scannerBeep)}
                      style={{
                        height: '28px',
                        padding: '0 0.75rem',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        fontFamily: 'inherit',
                        minWidth: '50px',
                      }}
                    >
                      {scannerBeep ? 'On' : 'Off'}
                    </button>
                  </div>
                </div>
              </div>

              {renderCardFooter('Barcode Scanner', handleSaveHardware)}
            </div>

            {/* Cash Drawer */}
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
                borderRadius: '0.85rem',
                border: `1px solid ${theme.border}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                    Electronic Cash Drawer
                  </h2>
                  <button
                    type="button"
                    className="button-20-secondary"
                    role="button"
                    onClick={() => showToast('RJ11 drawer kick pulse sent.')}
                    style={{
                      height: '28px',
                      padding: '0 0.75rem',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      fontFamily: 'inherit',
                    }}
                  >
                    Manual Kick Test
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ fontSize: '12.5px', color: theme.textSecondary }}>
                    Connected via standard RJ11/RJ12 drawer port on thermal printer.
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: theme.textPrimary }}>
                      Kick drawer automatically on cash sale
                    </span>
                    {renderToggle(cashDrawerPulseOnCash, () => setCashDrawerPulseOnCash(!cashDrawerPulseOnCash))}
                  </div>
                </div>
              </div>

              {renderCardFooter('Cash Drawer Settings', handleSaveHardware)}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: TABLES & DINE-IN SETTINGS */}
      {activeSubTab === 'set_tables' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Card 1: Floor Plan & Tables Setup */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <TableRestaurantRoundedIcon sx={{ fontSize: 22, color: theme.textPrimary }} />
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0, letterSpacing: '-0.01em' }}>
                    Floor Plan & Dine-In Tables
                  </h2>
                  <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                    Configure dining sections, seating capacities, table numbers, and real-time floor availability.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddSectionModal(true)}
                  className="button-20-secondary"
                  style={{
                    borderRadius: '9999px',
                    padding: '0.45rem 0.95rem',
                    fontSize: '12px',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <AddRoundedIcon sx={{ fontSize: 16 }} />
                  <span>New Section</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenAddTable}
                  className="button-20"
                  style={{
                    borderRadius: '9999px',
                    padding: '0.45rem 1.15rem',
                    fontSize: '12px',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <AddRoundedIcon sx={{ fontSize: 16 }} />
                  <span>Add Table</span>
                </button>
              </div>
            </div>

            {/* KPI Stats Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1.25rem',
                padding: '0.85rem 1rem',
                borderRadius: '0.65rem',
                backgroundColor: theme.bgPage,
                border: `1px solid ${theme.border}`,
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Tables
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, marginTop: '2px' }}>
                  {tables.length} Tables
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Capacity
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, marginTop: '2px' }}>
                  {tables.reduce((sum, t) => sum + t.capacity, 0)} Seats
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#16A34A', display: 'inline-block' }} />
                  Available
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#16A34A', marginTop: '2px' }}>
                  {tables.filter((t) => t.status === 'available').length} Tables
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#D97706', display: 'inline-block' }} />
                  Occupied
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, marginTop: '2px' }}>
                  {tables.filter((t) => t.status === 'occupied').length} Tables
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#8B5CF6', display: 'inline-block' }} />
                  Reserved
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, marginTop: '2px' }}>
                  {tables.filter((t) => t.status === 'reserved').length} Tables
                </div>
              </div>
            </div>

            {/* Section Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '4px' }}>
              <button
                type="button"
                onClick={() => setTableSectionFilter('All')}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: `1px solid ${tableSectionFilter === 'All' ? theme.activeBg : theme.border}`,
                  backgroundColor: tableSectionFilter === 'All' ? theme.activeBg : 'transparent',
                  color: tableSectionFilter === 'All' ? theme.activeText : theme.textPrimary,
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                All Tables ({tables.length})
              </button>

              {sections.map((sec) => {
                const count = tables.filter((t) => t.section === sec).length;
                const isSelected = tableSectionFilter === sec;
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setTableSectionFilter(sec)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: `1px solid ${isSelected ? theme.activeBg : theme.border}`,
                      backgroundColor: isSelected ? theme.activeBg : 'transparent',
                      color: isSelected ? theme.activeText : theme.textPrimary,
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {sec} ({count})
                  </button>
                );
              })}
            </div>

            {/* Table Grid Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                gap: '0.85rem',
              }}
            >
              {tables.filter((t) => tableSectionFilter === 'All' || t.section === tableSectionFilter).length === 0 ? (
                <div
                  style={{
                    gridColumn: '1 / -1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3.5rem 1.5rem',
                    borderRadius: '0.75rem',
                    backgroundColor: theme.bgPage,
                    border: `1px dashed ${theme.border}`,
                    textAlign: 'center',
                  }}
                >
                  <TableRestaurantRoundedIcon sx={{ fontSize: 36, color: theme.textSecondary, marginBottom: '0.75rem' }} />
                  <div style={{ fontSize: '15px', fontWeight: 800, color: theme.textPrimary, marginBottom: '0.35rem', letterSpacing: '-0.01em' }}>
                    {tableSectionFilter === 'All' ? 'No Dining Tables Added Yet' : `No tables in ${tableSectionFilter}`}
                  </div>
                  <p style={{ fontSize: '12.5px', color: theme.textSecondary, margin: '0 0 1.25rem 0', maxWidth: '380px', lineHeight: 1.5 }}>
                    {tableSectionFilter === 'All'
                      ? 'Add your cafe or restaurant tables to set up floor plans, seating capacities, and dine-in billing.'
                      : `You have no tables assigned to this section yet. Add a table to get started.`}
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenAddTable}
                    className="button-20"
                    style={{
                      borderRadius: '9999px',
                      padding: '0.5rem 1.35rem',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      fontFamily: 'inherit',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <AddRoundedIcon sx={{ fontSize: 16 }} />
                    <span>Add First Table</span>
                  </button>
                </div>
              ) : (
                tables
                  .filter((t) => tableSectionFilter === 'All' || t.section === tableSectionFilter)
                  .map((table) => {
                    const isAvailable = table.status === 'available';
                    const isOccupied = table.status === 'occupied';
                    const isReserved = table.status === 'reserved';

                    const statusColor = isAvailable ? '#16A34A' : isOccupied ? '#D97706' : '#8B5CF6';
                    const statusBg = isAvailable
                      ? 'rgba(22, 163, 74, 0.1)'
                      : isOccupied
                      ? 'rgba(217, 119, 6, 0.1)'
                      : 'rgba(139, 92, 246, 0.1)';

                    return (
                      <div
                        key={table.id}
                        style={{
                          backgroundColor: theme.bgPage,
                          border: `1px solid ${theme.border}`,
                          borderRadius: '0.75rem',
                          padding: '1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        }}
                      >
                        {/* Top Row: Table Name, Shape Badge & Capacity */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <span
                              style={{
                                fontSize: '15px',
                                fontWeight: 800,
                                color: theme.textPrimary,
                                letterSpacing: '-0.01em',
                              }}
                            >
                              {table.number}
                            </span>
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                backgroundColor: theme.hoverBg,
                                color: theme.textSecondary,
                              }}
                            >
                              {table.shape}
                            </span>
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              fontSize: '11px',
                              fontWeight: 700,
                              color: theme.textSecondary,
                              backgroundColor: theme.hoverBg,
                              padding: '2px 7px',
                              borderRadius: '9999px',
                            }}
                          >
                            <ChairRoundedIcon sx={{ fontSize: 13, color: theme.textSecondary }} />
                            <span>{table.capacity}p</span>
                          </div>
                        </div>

                        {/* Middle: Status & Info */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                            <span
                              onClick={() => handleToggleTableStatus(table.id)}
                              title="Click to toggle status (Available / Occupied / Reserved)"
                              style={{
                                fontSize: '11px',
                                fontWeight: 800,
                                color: statusColor,
                                backgroundColor: statusBg,
                                padding: '3px 8px',
                                borderRadius: '9999px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                userSelect: 'none',
                              }}
                            >
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusColor, display: 'inline-block' }} />
                              {table.status.toUpperCase()}
                            </span>

                            <span style={{ fontSize: '11px', color: theme.textSecondary, fontWeight: 500 }}>
                              {table.section.split(' ')[0]}
                            </span>
                          </div>

                          {isOccupied && (
                            <div style={{ fontSize: '11px', color: theme.textPrimary, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                              <span>Order {table.currentOrder}</span>
                              <span style={{ fontWeight: 800 }}>{table.orderTotal}</span>
                            </div>
                          )}

                          {isReserved && table.notes && (
                            <div style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 600, marginTop: '4px' }}>
                              {table.notes}
                            </div>
                          )}
                        </div>

                        {/* Bottom Row Actions */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '0.5rem',
                            borderTop: `1px solid ${theme.border}`,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleToggleTableStatus(table.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: theme.textSecondary,
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              padding: '2px 4px',
                              fontFamily: 'inherit',
                            }}
                          >
                            Switch Status
                          </button>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditTable(table)}
                              title="Edit table"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: theme.textSecondary,
                                cursor: 'pointer',
                                padding: '3px',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '4px',
                              }}
                            >
                              <EditRoundedIcon sx={{ fontSize: 16 }} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteTable(table.id, table.number)}
                              title="Delete table"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#EF4444',
                                cursor: 'pointer',
                                padding: '3px',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '4px',
                              }}
                            >
                              <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}

            </div>

            {renderCardFooter('Tables & Floor Plan')}
          </div>
      </div>
      )}

      

      {/* ==================================================================== */}
      {/* MODAL: ADD / EDIT RESTAURANT TABLE                                   */}
      {/* ==================================================================== */}
      {showTableModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1.25rem',
              width: '100%',
              maxWidth: '520px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
              boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
              boxSizing: 'border-box',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, margin: 0, letterSpacing: '-0.01em' }}>
                  {editingTableId ? 'Edit Dining Table' : 'Add New Dining Table'}
                </h3>
                <p style={{ fontSize: '12.5px', color: theme.textSecondary, margin: '3px 0 0 0' }}>
                  Configure table code, dining section, seating capacity, and table layout.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: '4px' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveTable} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                    TABLE NUMBER / CODE *
                  </label>
                  <input
                    type="text"
                    required
                    value={tableFormNumber}
                    onChange={(e) => setTableFormNumber(e.target.value)}
                    placeholder="e.g. T-07"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '0.55rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgPage,
                      color: theme.textPrimary,
                      fontSize: '13.5px',
                      fontWeight: 700,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                    FLOOR SECTION *
                  </label>
                  <select
                    value={tableFormSection}
                    onChange={(e) => setTableFormSection(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '0.55rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgPage,
                      color: theme.textPrimary,
                      fontSize: '13px',
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    {sections.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seating Capacity Selection */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                  SEATING CAPACITY ({tableFormCapacity} GUESTS)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {[2, 4, 6, 8, 10, 12].map((cap) => (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => setTableFormCapacity(cap)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '0.5rem',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: `1px solid ${tableFormCapacity === cap ? theme.activeBg : theme.border}`,
                        backgroundColor: tableFormCapacity === cap ? theme.activeBg : theme.bgPage,
                        color: tableFormCapacity === cap ? theme.activeText : theme.textPrimary,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {cap} Seats
                    </button>
                  ))}
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={tableFormCapacity}
                    onChange={(e) => setTableFormCapacity(parseInt(e.target.value, 10) || 1)}
                    style={{
                      width: '70px',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '0.5rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgPage,
                      color: theme.textPrimary,
                      fontSize: '12px',
                      fontWeight: 700,
                      outline: 'none',
                      textAlign: 'center',
                    }}
                  />
                </div>
              </div>

              {/* Table Shape & Layout */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                  TABLE SHAPE
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {[
                    { shape: 'square' as const, label: 'Square' },
                    { shape: 'round' as const, label: 'Round' },
                    { shape: 'rect' as const, label: 'Rectangle' },
                  ].map((s) => (
                    <button
                      key={s.shape}
                      type="button"
                      onClick={() => setTableFormShape(s.shape)}
                      style={{
                        padding: '0.65rem',
                        borderRadius: '0.55rem',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: `1px solid ${tableFormShape === s.shape ? theme.activeBg : theme.border}`,
                        backgroundColor: tableFormShape === s.shape ? theme.activeBg : theme.bgPage,
                        color: tableFormShape === s.shape ? theme.activeText : theme.textPrimary,
                        textAlign: 'center',
                        textTransform: 'capitalize',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table Status */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                  STATUS
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {[
                    { val: 'available' as const, label: 'Available', color: '#16A34A' },
                    { val: 'occupied' as const, label: 'Occupied', color: '#D97706' },
                    { val: 'reserved' as const, label: 'Reserved', color: '#8B5CF6' },
                  ].map((st) => (
                    <button
                      key={st.val}
                      type="button"
                      onClick={() => setTableFormStatus(st.val)}
                      style={{
                        padding: '0.55rem',
                        borderRadius: '0.55rem',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: `1px solid ${tableFormStatus === st.val ? st.color : theme.border}`,
                        backgroundColor: tableFormStatus === st.val ? `${st.color}15` : theme.bgPage,
                        color: tableFormStatus === st.val ? st.color : theme.textPrimary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: st.color, display: 'inline-block' }} />
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes / Special Instructions */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                  TABLE NOTES / SPECIAL ATTRIBUTES (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={tableFormNotes}
                  onChange={(e) => setTableFormNotes(e.target.value)}
                  placeholder="e.g. Window view booth, near bar counter, plug point available"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    fontWeight: 500,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem', paddingTop: '1rem', borderTop: `1px solid ${theme.border}` }}>
                <button
                  type="button"
                  onClick={() => setShowTableModal(false)}
                  className="button-20-secondary"
                  style={{
                    borderRadius: '9999px',
                    padding: '0.55rem 1.15rem',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button-20"
                  style={{
                    borderRadius: '9999px',
                    padding: '0.55rem 1.35rem',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                  }}
                >
                  {editingTableId ? 'Save Table Changes' : 'Create Table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: ADD SECTION                                                   */}
      {/* ==================================================================== */}
      {showAddSectionModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1.25rem',
              width: '100%',
              maxWidth: '420px',
              padding: '1.5rem',
              boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                Add New Dining Section
              </h3>
              <button
                type="button"
                onClick={() => setShowAddSectionModal(false)}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: '4px' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 18 }} />
              </button>
            </div>

            <form onSubmit={handleAddSection} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                  SECTION NAME *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="e.g. Garden Terrace, VIP Lounge, Mezzanine"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddSectionModal(false)}
                  className="button-20-secondary"
                  style={{
                    borderRadius: '9999px',
                    padding: '0.45rem 1rem',
                    fontSize: '12px',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button-20"
                  style={{
                    borderRadius: '9999px',
                    padding: '0.45rem 1.15rem',
                    fontSize: '12px',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                  }}
                >
                  Add Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD FRANCHISE OUTLET (API: POST /api/franchises)                 */}
      {/* ========================================================================= */}
      {showAddFranchiseModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              borderRadius: '1rem',
              border: `1px solid ${theme.border}`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: `1px solid ${theme.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '0.5rem',
                    backgroundColor: theme.activeBg,
                    color: theme.activeText,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <StoreRoundedIcon sx={{ fontSize: 20 }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15.5px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                    Add Franchise Outlet
                  </h3>
                  <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                    Register a new store branch for POS register provisioning
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddFranchiseModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.textSecondary,
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddFranchise} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {addFranchiseErrors.submit && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.55rem',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#DC2626',
                    fontSize: '12.5px',
                    fontWeight: 600,
                  }}
                >
                  {addFranchiseErrors.submit}
                </div>
              )}

              {/* Franchise Name (Required, 2-100 chars) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  OUTLET / FRANCHISE NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nuradesk Cafe - Bodakdev Hub"
                  value={addFranchiseForm.franchiseName}
                  onChange={(e) => {
                    setAddFranchiseForm({ ...addFranchiseForm, franchiseName: e.target.value });
                    if (addFranchiseErrors.franchiseName) {
                      setAddFranchiseErrors({ ...addFranchiseErrors, franchiseName: '' });
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${addFranchiseErrors.franchiseName ? '#DC2626' : theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                {addFranchiseErrors.franchiseName && (
                  <span style={{ fontSize: '11px', color: '#DC2626', marginTop: '3px', display: 'block' }}>
                    {addFranchiseErrors.franchiseName}
                  </span>
                )}
              </div>

              {/* Manager & Contact */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                    MANAGER / OWNER NAME
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={addFranchiseForm.ownerName || ''}
                    onChange={(e) => setAddFranchiseForm({ ...addFranchiseForm, ownerName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '0.55rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgPage,
                      color: theme.textPrimary,
                      fontSize: '13.5px',
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                    CONTACT PHONE (10-15 DIGITS)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={addFranchiseForm.contact || ''}
                    onChange={(e) => {
                      setAddFranchiseForm({ ...addFranchiseForm, contact: e.target.value });
                      if (addFranchiseErrors.contact) {
                        setAddFranchiseErrors({ ...addFranchiseErrors, contact: '' });
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '0.55rem',
                      border: `1px solid ${addFranchiseErrors.contact ? '#DC2626' : theme.border}`,
                      backgroundColor: theme.bgPage,
                      color: theme.textPrimary,
                      fontSize: '13.5px',
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  {addFranchiseErrors.contact && (
                    <span style={{ fontSize: '11px', color: '#DC2626', marginTop: '3px', display: 'block' }}>
                      {addFranchiseErrors.contact}
                    </span>
                  )}
                </div>
              </div>

              {/* City */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  CITY / REGION
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ahmedabad"
                  value={addFranchiseForm.city || ''}
                  onChange={(e) => setAddFranchiseForm({ ...addFranchiseForm, city: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Street Address */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  STREET ADDRESS
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Shop 4B, Alpha Commercial Complex, SG Highway"
                  value={addFranchiseForm.address || ''}
                  onChange={(e) => setAddFranchiseForm({ ...addFranchiseForm, address: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.55rem',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgPage,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Modal Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  marginTop: '0.75rem',
                  paddingTop: '1rem',
                  borderTop: `1px solid ${theme.border}`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowAddFranchiseModal(false)}
                  disabled={isSubmittingAddFranchise}
                  className="button-20-secondary"
                  style={{
                    padding: '0.5rem 1.15rem',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                    borderRadius: '9999px',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingAddFranchise}
                  className="button-20"
                  style={{
                    padding: '0.5rem 1.35rem',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  {isSubmittingAddFranchise ? (
                    <span>Provisioning...</span>
                  ) : (
                    <>
                      <CheckRoundedIcon sx={{ fontSize: 16 }} />
                      <span>Provision Outlet</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* MODAL 2: EDIT FRANCHISE OUTLET (API: GET/PUT /api/franchises/{id})         */}
      {/* ========================================================================= */}
      {editingFranchise && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              borderRadius: '1rem',
              border: `1px solid ${theme.border}`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: `1px solid ${theme.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '0.5rem',
                    backgroundColor: theme.activeBg,
                    color: theme.activeText,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <EditRoundedIcon sx={{ fontSize: 18 }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15.5px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                    Edit Franchise Outlet
                  </h3>
                  <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                    Branch ID: #{editingFranchise.franchiseId} • {editingFranchise.franchiseName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingFranchise(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.textSecondary,
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            {/* Modal Form */}
            {isLoadingEditDetails ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: theme.textSecondary, fontSize: '13px' }}>
                Fetching latest branch records from server...
              </div>
            ) : (
              <form onSubmit={handleUpdateFranchise} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {editFranchiseErrors.submit && (
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '0.55rem',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      color: '#DC2626',
                      fontSize: '12.5px',
                      fontWeight: 600,
                    }}
                  >
                    {editFranchiseErrors.submit}
                  </div>
                )}

                {/* Franchise Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                    OUTLET / FRANCHISE NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFranchiseForm.franchiseName}
                    onChange={(e) => {
                      setEditFranchiseForm({ ...editFranchiseForm, franchiseName: e.target.value });
                      if (editFranchiseErrors.franchiseName) {
                        setEditFranchiseErrors({ ...editFranchiseErrors, franchiseName: '' });
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '0.55rem',
                      border: `1px solid ${editFranchiseErrors.franchiseName ? '#DC2626' : theme.border}`,
                      backgroundColor: theme.bgPage,
                      color: theme.textPrimary,
                      fontSize: '13.5px',
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  {editFranchiseErrors.franchiseName && (
                    <span style={{ fontSize: '11px', color: '#DC2626', marginTop: '3px', display: 'block' }}>
                      {editFranchiseErrors.franchiseName}
                    </span>
                  )}
                </div>

                {/* Manager & Contact */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                      MANAGER / OWNER NAME
                    </label>
                    <input
                      type="text"
                      value={editFranchiseForm.ownerName || ''}
                      onChange={(e) => setEditFranchiseForm({ ...editFranchiseForm, ownerName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '0.55rem',
                        border: `1px solid ${theme.border}`,
                        backgroundColor: theme.bgPage,
                        color: theme.textPrimary,
                        fontSize: '13.5px',
                        fontWeight: 600,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                      CONTACT PHONE (10-15 DIGITS)
                    </label>
                    <input
                      type="tel"
                      value={editFranchiseForm.contact || ''}
                      onChange={(e) => {
                        setEditFranchiseForm({ ...editFranchiseForm, contact: e.target.value });
                        if (editFranchiseErrors.contact) {
                          setEditFranchiseErrors({ ...editFranchiseErrors, contact: '' });
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '0.55rem',
                        border: `1px solid ${editFranchiseErrors.contact ? '#DC2626' : theme.border}`,
                        backgroundColor: theme.bgPage,
                        color: theme.textPrimary,
                        fontSize: '13.5px',
                        fontWeight: 600,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    {editFranchiseErrors.contact && (
                      <span style={{ fontSize: '11px', color: '#DC2626', marginTop: '3px', display: 'block' }}>
                        {editFranchiseErrors.contact}
                      </span>
                    )}
                  </div>
                </div>

                {/* City & Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                      CITY / REGION
                    </label>
                    <input
                      type="text"
                      value={editFranchiseForm.city || ''}
                      onChange={(e) => setEditFranchiseForm({ ...editFranchiseForm, city: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '0.55rem',
                        border: `1px solid ${theme.border}`,
                        backgroundColor: theme.bgPage,
                        color: theme.textPrimary,
                        fontSize: '13.5px',
                        fontWeight: 600,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                      STATUS *
                    </label>
                    <select
                      value={editFranchiseForm.status}
                      onChange={(e) =>
                        setEditFranchiseForm({
                          ...editFranchiseForm,
                          status: e.target.value as 'ACTIVE' | 'INACTIVE',
                        })
                      }
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '0.55rem',
                        border: `1px solid ${theme.border}`,
                        backgroundColor: theme.bgPage,
                        color: theme.textPrimary,
                        fontSize: '13.5px',
                        fontWeight: 700,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                    STREET ADDRESS
                  </label>
                  <textarea
                    rows={2}
                    value={editFranchiseForm.address || ''}
                    onChange={(e) => setEditFranchiseForm({ ...editFranchiseForm, address: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '0.55rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgPage,
                      color: theme.textPrimary,
                      fontSize: '13px',
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* Modal Buttons */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '0.75rem',
                    marginTop: '0.75rem',
                    paddingTop: '1rem',
                    borderTop: `1px solid ${theme.border}`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setEditingFranchise(null)}
                    disabled={isSubmittingEditFranchise}
                    className="button-20-secondary"
                    style={{
                      padding: '0.5rem 1.15rem',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      fontFamily: 'inherit',
                      borderRadius: '9999px',
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmittingEditFranchise}
                    className="button-20"
                    style={{
                      padding: '0.5rem 1.35rem',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      fontFamily: 'inherit',
                      borderRadius: '9999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    {isSubmittingEditFranchise ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <CheckRoundedIcon sx={{ fontSize: 16 }} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* MODAL 3: DELETE FRANCHISE CONFIRMATION (API: DELETE /api/franchises/{id}) */}
      {/* ========================================================================= */}
      {deletingFranchise && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              borderRadius: '1rem',
              border: `1px solid ${theme.border}`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
              overflow: 'hidden',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <WarningAmberRoundedIcon sx={{ fontSize: 24 }} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Delete Franchise Outlet?
                </h3>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                  Branch ID #{deletingFranchise.franchiseId} • {deletingFranchise.franchiseName}
                </p>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: theme.textSecondary, lineHeight: 1.5, margin: '0 0 1rem 0' }}>
              Are you sure you want to permanently delete outlet <strong>"{deletingFranchise.franchiseName}"</strong>?
              This action cannot be undone.
            </p>

            {/* Conflict Alert (409 Foreign Key in use) */}
            {deleteConflictError && (
              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '0.65rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#DC2626',
                  fontSize: '12.5px',
                  lineHeight: 1.45,
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                }}
              >
                <WarningAmberRoundedIcon sx={{ fontSize: 18, marginTop: '2px', flexShrink: 0 }} />
                <span>{deleteConflictError}</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => {
                  setDeletingFranchise(null);
                  setDeleteConflictError(null);
                }}
                disabled={isDeletingFranchise}
                className="button-20-secondary"
                style={{
                  padding: '0.5rem 1.15rem',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  borderRadius: '9999px',
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteFranchise}
                disabled={isDeletingFranchise}
                style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  fontFamily: 'inherit',
                  borderRadius: '9999px',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: isDeletingFranchise ? 'not-allowed' : 'pointer',
                  opacity: isDeletingFranchise ? 0.7 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                {isDeletingFranchise ? 'Deleting...' : 'Delete Outlet'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
