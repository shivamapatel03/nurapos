'use client';

import React, { useState } from 'react';

// Material Rounded Icons
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
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
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
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KitchenRoundedIcon from '@mui/icons-material/KitchenRounded';
import TableRestaurantRoundedIcon from '@mui/icons-material/TableRestaurantRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { ThemeId, APP_THEMES } from '@/lib/themeConfig';

// ============================================================================
// TYPES
// ============================================================================
export type SettingsSubTab =
  | 'set_store'
  | 'set_business'
  | 'set_tax'
  | 'set_payments'
  | 'set_hardware'
  | 'set_pos'
  | 'set_notifications'
  | 'set_users'
  | 'set_security'
  | 'set_appearance';

interface SettingsManagementProps {
  activeSubTab: SettingsSubTab;
  onSelectSubTab: (tab: SettingsSubTab) => void;
  theme: any;
  currentThemeId?: ThemeId;
  onSelectTheme?: (themeId: ThemeId) => void;
}

export default function SettingsManagement({
  activeSubTab,
  onSelectSubTab,
  theme,
  currentThemeId = 'bw_light',
  onSelectTheme,
}: SettingsManagementProps) {
  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

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
  const [operatingHours, setOperatingHours] = useState([
    { day: 'Monday', open: '08:00', close: '23:00', isOpen: true },
    { day: 'Tuesday', open: '08:00', close: '23:00', isOpen: true },
    { day: 'Wednesday', open: '08:00', close: '23:00', isOpen: true },
    { day: 'Thursday', open: '08:00', close: '23:00', isOpen: true },
    { day: 'Friday', open: '08:00', close: '00:00', isOpen: true },
    { day: 'Saturday', open: '08:00', close: '00:00', isOpen: true },
    { day: 'Sunday', open: '08:00', close: '23:30', isOpen: true },
  ]);

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

  // 10. APPEARANCE STATE
  const [uiScaling, setUiScaling] = useState<'Compact' | 'Standard' | 'Touch-Optimized'>('Standard');
  const [soundScheme, setSoundScheme] = useState<'Subtle Click' | 'Mechanical Register' | 'Muted'>('Subtle Click');
  const [receiptTemplate, setReceiptTemplate] = useState<'Classic Minimal' | 'Modern Detailed' | 'Compact Slip'>('Modern Detailed');


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

      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '1.25rem 1.5rem',
          backgroundColor: theme.bgCard,
          borderRadius: '1rem',
          border: `1px solid ${theme.border}`,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: theme.textPrimary,
              margin: '0 0 0.25rem 0',
              letterSpacing: '-0.02em',
            }}
          >
            Settings & System Configuration
          </h1>
          <p style={{ fontSize: '13px', color: theme.textSecondary, margin: 0 }}>
            Configure store metadata, billing parameters, connected peripherals, security policies, and interface customization.
          </p>
        </div>

        <button
          type="button"
          onClick={() => showToast('All system settings saved successfully.')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            borderRadius: '0.65rem',
            backgroundColor: theme.activeBg,
            color: theme.activeText,
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <SaveRoundedIcon sx={{ fontSize: 18 }} />
          <span>Save Changes</span>
        </button>
      </div>

      {/* SUB-TAB 1: STORE PROFILE */}
      {activeSubTab === 'set_store' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Card: Basic Info & Branding */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: theme.bgCard,
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
          </div>

          {/* Card: Address & Contact Details */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: theme.bgCard,
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
          </div>

          {/* Card: Operating Hours */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: theme.bgCard,
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <ScheduleRoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                Weekly Operating Hours
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {operatingHours.map((sched, idx) => (
                <div
                  key={sched.day}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 1rem',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.bgPage,
                    border: `1px solid ${theme.border}`,
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ width: '120px', fontSize: '13.5px', fontWeight: 700, color: theme.textPrimary }}>
                    {sched.day}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ fontSize: '12px', color: theme.textSecondary }}>Opens:</span>
                      <input
                        type="time"
                        value={sched.open}
                        disabled={!sched.isOpen}
                        onChange={(e) => {
                          const updated = [...operatingHours];
                          updated[idx].open = e.target.value;
                          setOperatingHours(updated);
                        }}
                        style={{
                          padding: '0.35rem 0.55rem',
                          borderRadius: '0.45rem',
                          border: `1px solid ${theme.border}`,
                          backgroundColor: sched.isOpen ? theme.bgCard : theme.hoverBg,
                          color: theme.textPrimary,
                          fontSize: '12.5px',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ fontSize: '12px', color: theme.textSecondary }}>Closes:</span>
                      <input
                        type="time"
                        value={sched.close}
                        disabled={!sched.isOpen}
                        onChange={(e) => {
                          const updated = [...operatingHours];
                          updated[idx].close = e.target.value;
                          setOperatingHours(updated);
                        }}
                        style={{
                          padding: '0.35rem 0.55rem',
                          borderRadius: '0.45rem',
                          border: `1px solid ${theme.border}`,
                          backgroundColor: sched.isOpen ? theme.bgCard : theme.hoverBg,
                          color: theme.textPrimary,
                          fontSize: '12.5px',
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...operatingHours];
                      updated[idx].isOpen = !updated[idx].isOpen;
                      setOperatingHours(updated);
                    }}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '0.45rem',
                      backgroundColor: sched.isOpen ? theme.badgeBg : theme.hoverBg,
                      color: sched.isOpen ? theme.badgeText : theme.textSecondary,
                      border: `1px solid ${theme.border}`,
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {sched.isOpen ? 'Open' : 'Closed'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: BUSINESS SETTINGS */}
      {activeSubTab === 'set_business' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: theme.bgCard,
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <TuneRoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                Regional & Financial Parameters
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Base Currency
                </label>
                <select
                  value={currencyCode}
                  onChange={(e) => {
                    setCurrencyCode(e.target.value);
                    if (e.target.value === 'INR') setCurrencySymbol('₹');
                    if (e.target.value === 'USD') setCurrencySymbol('$');
                    if (e.target.value === 'EUR') setCurrencySymbol('€');
                    if (e.target.value === 'GBP') setCurrencySymbol('£');
                  }}
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
                  <option value="INR">Indian Rupee (₹ INR)</option>
                  <option value="USD">US Dollar ($ USD)</option>
                  <option value="EUR">Euro (€ EUR)</option>
                  <option value="GBP">British Pound (£ GBP)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
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
                  <option value="Asia/Kolkata (GMT+5:30)">Asia/Kolkata (IST - GMT+5:30)</option>
                  <option value="Asia/Dubai (GMT+4:00)">Asia/Dubai (GST - GMT+4:00)</option>
                  <option value="Europe/London (GMT+0:00)">Europe/London (BST/GMT)</option>
                  <option value="America/New_York (GMT-5:00)">America/New_York (EST)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Financial Year Cycle Starts
                </label>
                <select
                  value={financialYearStart}
                  onChange={(e) => setFinancialYearStart(e.target.value)}
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
                  <option value="April">April (India Standard FY 2026-27)</option>
                  <option value="January">January (Calendar Year)</option>
                  <option value="July">July (Mid-Year Cycle)</option>
                  <option value="October">October (Q4 Cycle)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Business Vertical
                </label>
                <select
                  value={businessVertical}
                  onChange={(e) => setBusinessVertical(e.target.value)}
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
                  <option value="Cafe & Bistro">Cafe & Bistro</option>
                  <option value="Quick Service Restaurant">Quick Service Restaurant (QSR)</option>
                  <option value="Bakery & Confectionery">Bakery & Confectionery</option>
                  <option value="Retail & Grocery">Retail & Grocery Store</option>
                  <option value="Fine Dining">Fine Dining Restaurant</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Inventory Valuation Method
                </label>
                <select
                  value={inventoryValuation}
                  onChange={(e) => setInventoryValuation(e.target.value as any)}
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
                  <option value="FIFO">First In, First Out (FIFO)</option>
                  <option value="Weighted Average">Weighted Average Cost (WAC)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Multi-Outlet Management Card */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: theme.bgCard,
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 0.25rem 0' }}>
                  Multi-Store / Multi-Branch System
                </h2>
                <p style={{ fontSize: '12.5px', color: theme.textSecondary, margin: 0 }}>
                  Synchronize central inventory catalogs while maintaining branch-specific registers, pricing, and shift ledgers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMultiOutletEnabled(!isMultiOutletEnabled)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '0.55rem',
                  backgroundColor: isMultiOutletEnabled ? theme.activeBg : theme.hoverBg,
                  color: isMultiOutletEnabled ? theme.activeText : theme.textSecondary,
                  border: `1px solid ${theme.border}`,
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {isMultiOutletEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {isMultiOutletEnabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.bgPage,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: theme.textPrimary }}>
                      SP CAFE - CG Road (Headquarters)
                    </div>
                    <div style={{ fontSize: '12px', color: theme.textSecondary }}>
                      STR-AHM-01 • 4 Active Registers • Primary Hub
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      backgroundColor: theme.badgeBg,
                      color: theme.badgeText,
                    }}
                  >
                    Current Active Branch
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.bgPage,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: theme.textPrimary }}>
                      SP CAFE - Bodakdev (Satellite)
                    </div>
                    <div style={{ fontSize: '12px', color: theme.textSecondary }}>
                      STR-AHM-02 • 2 Active Registers • Sync Active
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      backgroundColor: theme.hoverBg,
                      color: theme.textPrimary,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    Online
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.bgPage,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: theme.textPrimary }}>
                      SP CAFE - Prahlad Nagar (Upcoming)
                    </div>
                    <div style={{ fontSize: '12px', color: theme.textSecondary }}>
                      STR-AHM-03 • Setup in Progress
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      backgroundColor: theme.hoverBg,
                      color: theme.textSecondary,
                    }}
                  >
                    Pending Setup
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TAX & INVOICING */}
      {activeSubTab === 'set_tax' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* GST & Invoice Format */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: theme.bgCard,
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <ReceiptLongRoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                GST Identification & Invoice Numbering
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  GSTIN / Tax ID
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
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
                  Pricing Calculation Mode
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', height: '38px' }}>
                  <button
                    type="button"
                    onClick={() => setPricingMode('inclusive')}
                    style={{
                      flex: 1,
                      borderRadius: '0.45rem',
                      border: `1px solid ${pricingMode === 'inclusive' ? theme.activeBg : theme.border}`,
                      backgroundColor: pricingMode === 'inclusive' ? theme.activeBg : theme.bgPage,
                      color: pricingMode === 'inclusive' ? theme.activeText : theme.textPrimary,
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Tax Inclusive
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricingMode('exclusive')}
                    style={{
                      flex: 1,
                      borderRadius: '0.45rem',
                      border: `1px solid ${pricingMode === 'exclusive' ? theme.activeBg : theme.border}`,
                      backgroundColor: pricingMode === 'exclusive' ? theme.activeBg : theme.bgPage,
                      color: pricingMode === 'exclusive' ? theme.activeText : theme.textPrimary,
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Tax Exclusive
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Invoice Serial Prefix
                </label>
                <input
                  type="text"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value)}
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
                  Next Invoice Sequence
                </label>
                <input
                  type="text"
                  value={nextInvoiceNumber}
                  onChange={(e) => setNextInvoiceNumber(e.target.value)}
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
                  Default F&B SAC Code
                </label>
                <input
                  type="text"
                  value={defaultHsnFnb}
                  onChange={(e) => setDefaultHsnFnb(e.target.value)}
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
                  Default Goods HSN Code
                </label>
                <input
                  type="text"
                  value={defaultHsnGoods}
                  onChange={(e) => setDefaultHsnGoods(e.target.value)}
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
          </div>

          {/* Standard Tax Slabs Table */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: theme.bgCard,
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                Standard GST Rate Slabs
              </h2>
              <button
                type="button"
                onClick={() => showToast('New custom tax slab added.')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '0.45rem',
                  backgroundColor: theme.activeBg,
                  color: theme.activeText,
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <AddRoundedIcon sx={{ fontSize: 16 }} />
                <span>Add Tax Slab</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {taxSlabs.map((slab) => (
                <div
                  key={slab.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.bgPage,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: theme.textPrimary }}>
                      {slab.name}
                    </div>
                    <div style={{ fontSize: '12px', color: theme.textSecondary }}>
                      {slab.desc}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: theme.textPrimary }}>
                      {slab.rate}%
                    </span>
                    <button
                      type="button"
                      style={{
                        padding: '4px 8px',
                        borderRadius: '0.35rem',
                        backgroundColor: 'transparent',
                        border: `1px solid ${theme.border}`,
                        color: theme.textSecondary,
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Receipt Custom Header & Footer */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: theme.bgCard,
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 1.25rem 0' }}>
              Thermal Receipt Header & Footer Text
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Receipt Header Title
                </label>
                <input
                  type="text"
                  value={receiptHeader}
                  onChange={(e) => setReceiptHeader(e.target.value)}
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
                  Receipt Footer & FSSAI Disclosure
                </label>
                <textarea
                  rows={2}
                  value={receiptFooter}
                  onChange={(e) => setReceiptFooter(e.target.value)}
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
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: PAYMENTS */}
      {activeSubTab === 'set_payments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Active Tender Methods */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: theme.bgCard,
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <PaymentsRoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                Enabled Checkout Tender Types
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
              {[
                { key: 'cash', label: 'Cash Payment', desc: 'Accept physical cash at register till', icon: <MonetizationOnRoundedIcon sx={{ fontSize: 18 }} /> },
                { key: 'upi', label: 'Dynamic UPI QR', desc: 'Auto-generated QR code per transaction', icon: <QrCode2RoundedIcon sx={{ fontSize: 18 }} /> },
                { key: 'card', label: 'Card Terminal (EDC)', desc: 'Integrated swipe & chip card machine', icon: <CreditCardRoundedIcon sx={{ fontSize: 18 }} /> },
                { key: 'khata', label: 'Store Credit / Khata', desc: 'Postpaid credit ledger for VIP patrons', icon: <ReceiptLongRoundedIcon sx={{ fontSize: 18 }} /> },
              ].map((tender) => {
                const isEnabled = (paymentMethods as any)[tender.key];
                return (
                  <div
                    key={tender.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      borderRadius: '0.65rem',
                      backgroundColor: theme.bgPage,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ color: theme.textPrimary }}>{tender.icon}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: theme.textPrimary }}>
                          {tender.label}
                        </div>
                        <div style={{ fontSize: '11.5px', color: theme.textSecondary }}>
                          {tender.desc}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPaymentMethods((prev) => ({
                          ...prev,
                          [tender.key]: !(prev as any)[tender.key],
                        }))
                      }
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '0.45rem',
                        backgroundColor: isEnabled ? theme.badgeBg : theme.hoverBg,
                        color: isEnabled ? theme.badgeText : theme.textSecondary,
                        border: `1px solid ${theme.border}`,
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {isEnabled ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic UPI & Merchant VPA */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: theme.bgCard,
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <QrCode2RoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                Dynamic UPI Merchant Configuration
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Merchant VPA / UPI ID
                </label>
                <input
                  type="text"
                  value={upiVpa}
                  onChange={(e) => setUpiVpa(e.target.value)}
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
                  Merchant Legal Registered Name
                </label>
                <input
                  type="text"
                  value={upiMerchantName}
                  onChange={(e) => setUpiMerchantName(e.target.value)}
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

            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: theme.textPrimary }}>
                Auto-generate bill-amount embedded dynamic QR code on checkout screen
              </span>
              <button
                type="button"
                onClick={() => setAutoDynamicUpiQr(!autoDynamicUpiQr)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '0.45rem',
                  backgroundColor: autoDynamicUpiQr ? theme.activeBg : theme.hoverBg,
                  color: autoDynamicUpiQr ? theme.activeText : theme.textSecondary,
                  border: `1px solid ${theme.border}`,
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {autoDynamicUpiQr ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Card POS & Auto Round-off */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: theme.bgCard,
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <CreditCardRoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                Integrated Card Machine & Checkout Rules
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Card EDC Terminal Hardware
                </label>
                <select
                  value={cardTerminalModel}
                  onChange={(e) => setCardTerminalModel(e.target.value)}
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
                  <option value="PineLabs Plutus Smart Android EDC">PineLabs Plutus Smart Android EDC</option>
                  <option value="Mswipe WisePOS Plus">Mswipe WisePOS Plus</option>
                  <option value="Paytm All-In-One Smart POS">Paytm All-In-One Smart POS</option>
                  <option value="Razorpay POS Terminal">Razorpay POS Terminal</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Terminal Network Address / Port
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={cardTerminalIp}
                    onChange={(e) => setCardTerminalIp(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.65rem 0.85rem',
                      borderRadius: '0.55rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgPage,
                      color: theme.textPrimary,
                      fontSize: '13px',
                      fontWeight: 600,
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => showToast('Terminal ping response: 18ms (Online)')}
                    style={{
                      padding: '0 0.85rem',
                      borderRadius: '0.55rem',
                      backgroundColor: theme.hoverBg,
                      color: theme.textPrimary,
                      border: `1px solid ${theme.border}`,
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Test Ping
                  </button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: theme.textPrimary }}>
                  Auto Round-off Cash Totals
                </div>
                <div style={{ fontSize: '12px', color: theme.textSecondary }}>
                  Round fractional bill totals to nearest ₹1.00 (e.g. ₹249.75 to ₹250.00)
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoRoundOff(!autoRoundOff)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '0.45rem',
                  backgroundColor: autoRoundOff ? theme.activeBg : theme.hoverBg,
                  color: autoRoundOff ? theme.activeText : theme.textSecondary,
                  border: `1px solid ${theme.border}`,
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {autoRoundOff ? 'Enabled' : 'Disabled'}
              </button>
            </div>
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
              backgroundColor: theme.bgCard,
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
                onClick={() => showToast('Test ticket dispatched to thermal printer.')}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: '0.55rem',
                  backgroundColor: theme.activeBg,
                  color: theme.activeText,
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
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
                <button
                  type="button"
                  onClick={() => setAutoCutter(!autoCutter)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '0.45rem',
                    backgroundColor: autoCutter ? theme.activeBg : theme.hoverBg,
                    color: autoCutter ? theme.activeText : theme.textSecondary,
                    border: `1px solid ${theme.border}`,
                    fontSize: '11.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {autoCutter ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>

          {/* Barcode Scanner & Cash Drawer */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Barcode Scanner */}
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: theme.bgCard,
                borderRadius: '0.85rem',
                border: `1px solid ${theme.border}`,
              }}
            >
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
                    onClick={() => setScannerBeep(!scannerBeep)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '0.45rem',
                      backgroundColor: scannerBeep ? theme.activeBg : theme.hoverBg,
                      color: scannerBeep ? theme.activeText : theme.textSecondary,
                      border: `1px solid ${theme.border}`,
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {scannerBeep ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            </div>

            {/* Cash Drawer */}
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: theme.bgCard,
                borderRadius: '0.85rem',
                border: `1px solid ${theme.border}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Electronic Cash Drawer
                </h2>
                <button
                  type="button"
                  onClick={() => showToast('RJ11 drawer kick pulse sent.')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '0.45rem',
                    backgroundColor: theme.hoverBg,
                    color: theme.textPrimary,
                    border: `1px solid ${theme.border}`,
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
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
                  <button
                    type="button"
                    onClick={() => setCashDrawerPulseOnCash(!cashDrawerPulseOnCash)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '0.45rem',
                      backgroundColor: cashDrawerPulseOnCash ? theme.activeBg : theme.hoverBg,
                      color: cashDrawerPulseOnCash ? theme.activeText : theme.textSecondary,
                      border: `1px solid ${theme.border}`,
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {cashDrawerPulseOnCash ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: POS SETTINGS */}
      {activeSubTab === 'set_pos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: theme.bgCard,
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <PointOfSaleRoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                Point of Sale Terminal Workflow Rules
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                {
                  title: 'Express / Quick Billing Mode',
                  desc: 'Skip customer phone & loyalty lookup for instant checkout during rush hours.',
                  state: expressBillingMode,
                  toggle: () => setExpressBillingMode(!expressBillingMode),
                },
                {
                  title: 'Auto-Print Receipt on Settlement',
                  desc: 'Immediately send customer receipt to thermal printer when payment is verified.',
                  state: autoPrintReceipt,
                  toggle: () => setAutoPrintReceipt(!autoPrintReceipt),
                },
                {
                  title: 'Kitchen Display System (KDS) & KOT Auto-Dispatch',
                  desc: 'Automatically route food tickets to chef KDS screen upon order placement.',
                  state: kdsAutoDispatch,
                  toggle: () => setKdsAutoDispatch(!kdsAutoDispatch),
                },
                {
                  title: 'Audio Sound Effects',
                  desc: 'Play crisp audio cues on product barcode scan, item remove, and checkout.',
                  state: audioFeedback,
                  toggle: () => setAudioFeedback(!audioFeedback),
                },
                {
                  title: 'Dine-In Table Floor Plan Management',
                  desc: 'Enable table assignment, table shifting, and running tab management on POS.',
                  state: tableManagementEnabled,
                  toggle: () => setTableManagementEnabled(!tableManagementEnabled),
                },
                {
                  title: 'Block Sale of Out-of-Stock Items',
                  desc: 'Strictly prevent cashiers from adding items with 0 inventory count to order.',
                  state: blockOutOfStockSales,
                  toggle: () => setBlockOutOfStockSales(!blockOutOfStockSales),
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.bgPage,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: theme.textPrimary }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '12px', color: theme.textSecondary }}>
                      {item.desc}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={item.toggle}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '0.45rem',
                      backgroundColor: item.state ? theme.activeBg : theme.hoverBg,
                      color: item.state ? theme.activeText : theme.textSecondary,
                      border: `1px solid ${theme.border}`,
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {item.state ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: NOTIFICATIONS */}
      {activeSubTab === 'set_notifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: theme.bgCard,
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <NotificationsNoneRoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Automated Alerts & Dispatch Channels
                </h2>
              </div>
              <button
                type="button"
                onClick={() => showToast('Test notification sent to owner and manager.')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '0.45rem',
                  backgroundColor: theme.activeBg,
                  color: theme.activeText,
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <SendRoundedIcon sx={{ fontSize: 14 }} />
                <span>Send Test Notification</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Low Stock Alert */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '0.55rem',
                  backgroundColor: theme.bgPage,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: theme.textPrimary }}>
                      Low Stock Inventory Alerts
                    </div>
                    <div style={{ fontSize: '12px', color: theme.textSecondary }}>
                      Notify immediately when ingredients or merchandise fall below reorder threshold.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifyLowStock(!notifyLowStock)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '0.45rem',
                      backgroundColor: notifyLowStock ? theme.activeBg : theme.hoverBg,
                      color: notifyLowStock ? theme.activeText : theme.textSecondary,
                      border: `1px solid ${theme.border}`,
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {notifyLowStock ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                {notifyLowStock && (
                  <input
                    type="email"
                    value={notifyLowStockEmail}
                    onChange={(e) => setNotifyLowStockEmail(e.target.value)}
                    style={{
                      width: '100%',
                      maxWidth: '380px',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.45rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgCard,
                      color: theme.textPrimary,
                      fontSize: '12.5px',
                    }}
                  />
                )}
              </div>

              {/* End of Day Report */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '0.55rem',
                  backgroundColor: theme.bgPage,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: theme.textPrimary }}>
                      End-of-Day Daily Sales Summary
                    </div>
                    <div style={{ fontSize: '12px', color: theme.textSecondary }}>
                      Automated executive summary dispatched daily at 11:30 PM with revenue, order count, and payment tenders.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifyEndOfDaySummary(!notifyEndOfDaySummary)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '0.45rem',
                      backgroundColor: notifyEndOfDaySummary ? theme.activeBg : theme.hoverBg,
                      color: notifyEndOfDaySummary ? theme.activeText : theme.textSecondary,
                      border: `1px solid ${theme.border}`,
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {notifyEndOfDaySummary ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                {notifyEndOfDaySummary && (
                  <input
                    type="email"
                    value={notifyEndOfDayEmail}
                    onChange={(e) => setNotifyEndOfDayEmail(e.target.value)}
                    style={{
                      width: '100%',
                      maxWidth: '380px',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.45rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgCard,
                      color: theme.textPrimary,
                      fontSize: '12.5px',
                    }}
                  />
                )}
              </div>

              {/* Shift Cash Discrepancy */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: '0.55rem',
                  backgroundColor: theme.bgPage,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: theme.textPrimary }}>
                    Cashier Shift Closing Discrepancy Warning
                  </div>
                  <div style={{ fontSize: '12px', color: theme.textSecondary }}>
                    Alert manager if actual till cash deviates from expected balance by more than ₹{discrepancyThreshold}.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyShiftDiscrepancy(!notifyShiftDiscrepancy)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '0.45rem',
                    backgroundColor: notifyShiftDiscrepancy ? theme.activeBg : theme.hoverBg,
                    color: notifyShiftDiscrepancy ? theme.activeText : theme.textSecondary,
                    border: `1px solid ${theme.border}`,
                    fontSize: '11.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {notifyShiftDiscrepancy ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Void & Refund Alert */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: '0.55rem',
                  backgroundColor: theme.bgPage,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: theme.textPrimary }}>
                    Instant Order Void & Refund Alert
                  </div>
                  <div style={{ fontSize: '12px', color: theme.textSecondary }}>
                    Immediately send push alert when a cashier cancels a settled invoice or applies a discount over 15%.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyOrderVoidRefund(!notifyOrderVoidRefund)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '0.45rem',
                    backgroundColor: notifyOrderVoidRefund ? theme.activeBg : theme.hoverBg,
                    color: notifyOrderVoidRefund ? theme.activeText : theme.textSecondary,
                    border: `1px solid ${theme.border}`,
                    fontSize: '11.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {notifyOrderVoidRefund ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 8: USERS & PERMISSIONS */}
      {activeSubTab === 'set_users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: theme.bgCard,
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 0.25rem 0' }}>
                  Role-Based Access Control (RBAC)
                </h2>
                <p style={{ fontSize: '12.5px', color: theme.textSecondary, margin: 0 }}>
                  Define fine-grained operational permissions across manager, cashier, and staff roles.
                </p>
              </div>
              <button
                type="button"
                onClick={() => showToast('New role creator launched.')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '0.45rem',
                  backgroundColor: theme.activeBg,
                  color: theme.activeText,
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <AddRoundedIcon sx={{ fontSize: 16 }} />
                <span>Create Custom Role</span>
              </button>
            </div>

            {/* Permissions Matrix Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.bgPage }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 800, color: theme.textPrimary }}>
                      Operational Permission
                    </th>
                    {roles.map((r) => (
                      <th
                        key={r.id}
                        style={{ textAlign: 'center', padding: '0.75rem 1rem', fontWeight: 800, color: theme.textPrimary }}
                      >
                        <div>{r.name}</div>
                        <div style={{ fontSize: '11px', fontWeight: 500, color: theme.textSecondary }}>
                          {r.usersCount} users
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: 'discounts', label: 'Apply Custom Discounts' },
                    { key: 'voidOrder', label: 'Void / Cancel Settled Orders' },
                    { key: 'viewProfit', label: 'View Cost & Profit Margins' },
                    { key: 'editInventory', label: 'Adjust & Receive Stock' },
                    { key: 'accessSettings', label: 'Access System Settings' },
                    { key: 'kickDrawer', label: 'Manual Cash Drawer Open' },
                  ].map((perm) => (
                    <tr
                      key={perm.key}
                      style={{
                        borderBottom: `1px solid ${theme.border}`,
                        backgroundColor: 'transparent',
                      }}
                    >
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: theme.textPrimary }}>
                        {perm.label}
                      </td>
                      {roles.map((r) => {
                        const hasPerm = permissionsMatrix[r.id]?.[perm.key] ?? false;
                        const isSuperAdmin = r.id === 'r1';
                        return (
                          <td key={r.id} style={{ textAlign: 'center', padding: '0.85rem 1rem' }}>
                            <button
                              type="button"
                              disabled={isSuperAdmin}
                              onClick={() => {
                                setPermissionsMatrix((prev) => ({
                                  ...prev,
                                  [r.id]: {
                                    ...prev[r.id],
                                    [perm.key]: !prev[r.id]?.[perm.key],
                                  },
                                }));
                              }}
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '0.35rem',
                                border: `1px solid ${hasPerm ? theme.activeBg : theme.border}`,
                                backgroundColor: hasPerm ? theme.activeBg : theme.hoverBg,
                                color: hasPerm ? theme.activeText : theme.textSecondary,
                                cursor: isSuperAdmin ? 'default' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {hasPerm ? (
                                <CheckRoundedIcon sx={{ fontSize: 16 }} />
                              ) : (
                                <CloseRoundedIcon sx={{ fontSize: 14 }} />
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 9: SECURITY */}
      {activeSubTab === 'set_security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Terminal & Authentication Security */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: theme.bgCard,
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <LockRoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                Terminal Lock & Authentication Policies
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Register Inactivity Auto-Lock
                </label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
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
                  <option value="1">1 Minute (Strict High Security)</option>
                  <option value="5">5 Minutes</option>
                  <option value="15">15 Minutes (Recommended)</option>
                  <option value="30">30 Minutes</option>
                  <option value="0">Never (Always Unlocked)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                  Store Wi-Fi Subnet Whitelisting
                </label>
                <input
                  type="text"
                  value={whitelistedSubnet}
                  onChange={(e) => setWhitelistedSubnet(e.target.value)}
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

            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.55rem',
                  backgroundColor: theme.bgPage,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: theme.textPrimary }}>
                    Cashier 4-Digit Quick-Switch PIN Requirement
                  </div>
                  <div style={{ fontSize: '11.5px', color: theme.textSecondary }}>
                    Prompt cashier for PIN when starting a new transaction or switching active registers.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEnforceCashierPin(!enforceCashierPin)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '0.45rem',
                    backgroundColor: enforceCashierPin ? theme.activeBg : theme.hoverBg,
                    color: enforceCashierPin ? theme.activeText : theme.textSecondary,
                    border: `1px solid ${theme.border}`,
                    fontSize: '11.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {enforceCashierPin ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.55rem',
                  backgroundColor: theme.bgPage,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: theme.textPrimary }}>
                    Two-Factor Authentication (2FA) for Managers & Admins
                  </div>
                  <div style={{ fontSize: '11.5px', color: theme.textSecondary }}>
                    Require TOTP authenticator code when logging into dashboard from new devices.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '0.45rem',
                    backgroundColor: twoFactorAuth ? theme.activeBg : theme.hoverBg,
                    color: twoFactorAuth ? theme.activeText : theme.textSecondary,
                    border: `1px solid ${theme.border}`,
                    fontSize: '11.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {twoFactorAuth ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>

          {/* Security Audit Trail Log */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: theme.bgCard,
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: '0 0 1rem 0' }}>
              Security Audit Trail (Last 24 Hours)
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 1rem',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.bgPage,
                    border: `1px solid ${theme.border}`,
                    fontSize: '12.5px',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span style={{ color: theme.textSecondary, fontFamily: 'monospace', fontSize: '12px' }}>
                      {log.timestamp}
                    </span>
                    <span style={{ fontWeight: 700, color: theme.textPrimary }}>
                      {log.user}
                    </span>
                    <span style={{ color: theme.textSecondary }}>
                      — {log.action}
                    </span>
                  </div>
                  <div style={{ color: theme.textSecondary, fontSize: '11.5px', fontFamily: 'monospace' }}>
                    IP: {log.ip}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 10: APPEARANCE */}
      {activeSubTab === 'set_appearance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Main Themes Container */}
          <div
            style={{
              padding: '1.75rem',
              backgroundColor: theme.bgCard,
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '0.65rem',
                  backgroundColor: theme.hoverBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <PaletteRoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>
                    Theme & Appearance
                  </h2>
                  <p style={{ fontSize: '12.5px', color: theme.textSecondary, margin: '2px 0 0' }}>
                    Select a color palette theme for the Admin Dashboard and Live POS. Themes persist automatically across your browser session.
                  </p>
                </div>
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '12px',
                fontWeight: 700,
                color: theme.activeBg,
                backgroundColor: theme.hoverBg,
                border: `1px solid ${theme.border}`,
                padding: '4px 10px',
                borderRadius: '9999px',
              }}>
                <CheckCircleRoundedIcon sx={{ fontSize: 15 }} />
                <span>Active: {APP_THEMES[currentThemeId]?.name || currentThemeId}</span>
              </div>
            </div>

            {/* 5 Themes Grid - Simple & Clean */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
              marginTop: '1.25rem',
            }}>
              {(Object.keys(APP_THEMES) as ThemeId[]).map((tid) => {
                const th = APP_THEMES[tid];
                const isCurrent = currentThemeId === tid;

                return (
                  <div
                    key={tid}
                    onClick={() => {
                      onSelectTheme?.(tid);
                      showToast(`Switched theme to ${th.name}.`);
                    }}
                    style={{
                      padding: '0.85rem',
                      borderRadius: '0.75rem',
                      backgroundColor: isCurrent ? theme.hoverBg : theme.bgPage,
                      border: isCurrent ? `2px solid ${theme.activeBg}` : `1px solid ${theme.border}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      boxShadow: isCurrent ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isCurrent) {
                        e.currentTarget.style.borderColor = theme.borderHover || theme.textPrimary;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCurrent) {
                        e.currentTarget.style.borderColor = theme.border;
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {/* Visual UI Preview Thumbnail */}
                    <div style={{
                      width: '100%',
                      height: '56px',
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      display: 'flex',
                      border: `1px solid ${th.border}`,
                      backgroundColor: th.swatch.page,
                    }}>
                      {/* Mini Sidebar */}
                      <div style={{
                        width: '32%',
                        backgroundColor: th.swatch.sidebar,
                        borderRight: `1px solid ${th.border}`,
                        padding: '6px 5px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '3px',
                      }}>
                        <div style={{ width: '65%', height: '4px', borderRadius: '2px', backgroundColor: th.swatch.primary }} />
                        <div style={{ width: '85%', height: '3px', borderRadius: '2px', backgroundColor: th.textSecondary, opacity: 0.35 }} />
                        <div style={{ width: '70%', height: '3px', borderRadius: '2px', backgroundColor: th.textSecondary, opacity: 0.35 }} />
                      </div>

                      {/* Mini Page Content */}
                      <div style={{
                        flex: 1,
                        padding: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        backgroundColor: th.swatch.page,
                      }}>
                        <div style={{
                          height: '20px',
                          borderRadius: '3px',
                          backgroundColor: th.swatch.card,
                          border: `1px solid ${th.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 5px',
                          justifyContent: 'space-between',
                        }}>
                          <div style={{ width: '40%', height: '3px', borderRadius: '1.5px', backgroundColor: th.textSecondary, opacity: 0.4 }} />
                          <div style={{ width: '12px', height: '8px', borderRadius: '2px', backgroundColor: th.swatch.primary }} />
                        </div>
                        <div style={{
                          height: '14px',
                          borderRadius: '3px',
                          backgroundColor: th.swatch.card,
                          border: `1px solid ${th.border}`,
                        }} />
                      </div>
                    </div>

                    {/* Label & Active Radio Indicator */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: isCurrent ? `5px solid ${theme.activeBg}` : `2px solid ${theme.border}`,
                          backgroundColor: isCurrent ? theme.bgCard : 'transparent',
                          transition: 'all 0.15s ease',
                          boxSizing: 'border-box',
                          flexShrink: 0,
                        }} />
                        <span style={{ fontSize: '13px', fontWeight: isCurrent ? 800 : 600, color: theme.textPrimary }}>
                          {th.name}
                        </span>
                      </div>

                      <span style={{
                        fontSize: '10.5px',
                        fontWeight: 600,
                        color: theme.textSecondary,
                        backgroundColor: theme.hoverBg,
                        padding: '2px 7px',
                        borderRadius: '9999px',
                      }}>
                        {th.sidebarIsDark ? 'Dark' : 'Light'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Secondary Preferences: Touch Target Density & Thermal Receipt Template */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}>
            {/* POS UI Scaling */}
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: theme.bgCard,
                borderRadius: '0.85rem',
                border: `1px solid ${theme.border}`,
              }}
            >
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: theme.textPrimary, marginBottom: '0.25rem' }}>
                POS Screen Density & Touch Target Size
              </label>
              <p style={{ fontSize: '11.5px', color: theme.textSecondary, margin: '0 0 1rem 0' }}>
                Adjust button sizing and grid spacing for hardware touch monitors or compact displays.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { name: 'Compact', desc: 'Dense grids, optimized for mouse & keyboard operations' },
                  { name: 'Standard', desc: 'Balanced layout suitable for all desktop screens' },
                  { name: 'Touch-Optimized', desc: 'Large tap targets designed for 10"-15" touch monitors' },
                ].map((scale) => {
                  const isSelected = uiScaling === scale.name;
                  return (
                    <div
                      key={scale.name}
                      onClick={() => {
                        setUiScaling(scale.name as any);
                        showToast(`Touch scaling updated to ${scale.name}.`);
                      }}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.55rem',
                        backgroundColor: isSelected ? theme.activeBg : theme.bgPage,
                        color: isSelected ? theme.activeText : theme.textPrimary,
                        border: `1px solid ${isSelected ? theme.activeBg : theme.border}`,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 800 }}>{scale.name}</div>
                      <div style={{ fontSize: '11.5px', color: isSelected ? theme.activeText : theme.textSecondary, opacity: 0.85 }}>
                        {scale.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Receipt Thermal Template */}
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: theme.bgCard,
                borderRadius: '0.85rem',
                border: `1px solid ${theme.border}`,
              }}
            >
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: theme.textPrimary, marginBottom: '0.25rem' }}>
                Receipt Thermal Template
              </label>
              <p style={{ fontSize: '11.5px', color: theme.textSecondary, margin: '0 0 1rem 0' }}>
                Configure printed receipt typography, layout density, and QR tax formatting.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { name: 'Modern Detailed', desc: 'Itemized lines, full tax breakdown, and QR footer' },
                  { name: 'Classic Minimal', desc: 'Clean, fast printing with basic total & tender summary' },
                  { name: 'Compact Slip', desc: 'Ultra-condensed paper-saver mode for quick counter items' },
                ].map((rc) => {
                  const isSelected = receiptTemplate === rc.name;
                  return (
                    <div
                      key={rc.name}
                      onClick={() => {
                        setReceiptTemplate(rc.name as any);
                        showToast(`Receipt template updated to ${rc.name}.`);
                      }}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.55rem',
                        backgroundColor: isSelected ? theme.activeBg : theme.bgPage,
                        color: isSelected ? theme.activeText : theme.textPrimary,
                        border: `1px solid ${isSelected ? theme.activeBg : theme.border}`,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 800 }}>{rc.name}</div>
                      <div style={{ fontSize: '11.5px', color: isSelected ? theme.activeText : theme.textSecondary, opacity: 0.85 }}>
                        {rc.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
