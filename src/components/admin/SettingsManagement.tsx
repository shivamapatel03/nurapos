'use client';

import React, { useState } from 'react';
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
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
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
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import { ThemeId, APP_THEMES } from '@/lib/themeConfig';

// ============================================================================
// TYPES
// ============================================================================
export type SettingsSubTab =
  | 'set_store'
  | 'set_business'
  | 'set_tables'
  | 'set_tax'
  | 'set_payments'
  | 'set_hardware'
  | 'set_pos'
  | 'set_notifications'
  | 'set_users'
  | 'set_security'
  | 'set_appearance';

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

            {renderCardFooter('Store Identity & Branding')}
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

            {renderCardFooter('Location & Contact Information')}
          </div>

          {/* Card: Operating Hours */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
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
                          backgroundColor: sched.isOpen ? ((theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF') : theme.hoverBg,
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
                          backgroundColor: sched.isOpen ? ((theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF') : theme.hoverBg,
                          color: theme.textPrimary,
                          fontSize: '12.5px',
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className={sched.isOpen ? "button-20" : "button-20-secondary"}
                    role="button"
                    onClick={() => {
                      const updated = [...operatingHours];
                      updated[idx].isOpen = !updated[idx].isOpen;
                      setOperatingHours(updated);
                    }}
                    style={{
                      height: '32px',
                      padding: '0 0.85rem',
                      fontSize: '12px',
                      fontWeight: 700,
                      fontFamily: 'inherit',
                      minWidth: '70px',
                    }}
                  >
                    {sched.isOpen ? 'Open' : 'Closed'}
                  </button>
                </div>
              ))}
            </div>

            {renderCardFooter('Weekly Operating Hours')}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: BUSINESS SETTINGS */}
      {activeSubTab === 'set_business' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
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

            {renderCardFooter('Regional & Financial Parameters')}
          </div>

          {/* Multi-Outlet Management Card */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
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
              {renderToggle(isMultiOutletEnabled, () => setIsMultiOutletEnabled(!isMultiOutletEnabled))}
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

            {renderCardFooter('Multi-Store Branch Settings')}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TAX & INVOICING */}
      {activeSubTab === 'set_tax' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* GST & Invoice Format */}
          {/* GST & Invoice Format */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
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
                    className={pricingMode === 'inclusive' ? "button-20" : "button-20-secondary"}
                    role="button"
                    onClick={() => setPricingMode('inclusive')}
                    style={{
                      flex: 1,
                      height: '38px',
                      fontSize: '12px',
                      fontWeight: 700,
                      fontFamily: 'inherit',
                    }}
                  >
                    Tax Inclusive
                  </button>
                  <button
                    type="button"
                    className={pricingMode === 'exclusive' ? "button-20" : "button-20-secondary"}
                    role="button"
                    onClick={() => setPricingMode('exclusive')}
                    style={{
                      flex: 1,
                      height: '38px',
                      fontSize: '12px',
                      fontWeight: 700,
                      fontFamily: 'inherit',
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

            {renderCardFooter('GST & Invoice Settings')}
          </div>

          {/* Standard Tax Slabs Table */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
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
                className="button-20"
                role="button"
                onClick={() => showToast('New custom tax slab added.')}
                style={{
                  height: '32px',
                  padding: '0 0.85rem',
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
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
                      className="button-20-secondary"
                      role="button"
                      onClick={() => showToast(`Edit configuration for ${slab.name}`)}
                      style={{
                        height: '26px',
                        padding: '0 8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        fontFamily: 'inherit',
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {renderCardFooter('GST Tax Slabs')}
          </div>

          {/* Receipt Custom Header & Footer */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
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

            {renderCardFooter('Receipt Header & Footer')}
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
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
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
                    {renderToggle(isEnabled, () =>
                      setPaymentMethods((prev) => ({
                        ...prev,
                        [tender.key]: !(prev as any)[tender.key],
                      }))
                    )}
                  </div>
                );
              })}
            </div>

            {renderCardFooter('Tender Types')}
          </div>

          {/* Dynamic UPI & Merchant VPA */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
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
              {renderToggle(autoDynamicUpiQr, () => setAutoDynamicUpiQr(!autoDynamicUpiQr))}
            </div>

            {renderCardFooter('UPI Configuration')}
          </div>

          {/* Card POS & Auto Round-off */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
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
                    className="button-20-secondary"
                    role="button"
                    onClick={() => showToast('Terminal ping response: 18ms (Online)')}
                    style={{
                      height: '38px',
                      padding: '0 0.85rem',
                      fontSize: '12px',
                      fontWeight: 700,
                      fontFamily: 'inherit',
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
              {renderToggle(autoRoundOff, () => setAutoRoundOff(!autoRoundOff))}
            </div>

            {renderCardFooter('Card Terminal & Rules')}
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

            {renderCardFooter('Thermal Printer Settings')}
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

              {renderCardFooter('Barcode Scanner')}
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

              {renderCardFooter('Cash Drawer Settings')}
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
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
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
                  {renderToggle(item.state, item.toggle)}
                </div>
              ))}
            </div>

            {renderCardFooter('POS Terminal Rules')}
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

          {/* Card 2: Order Token & Ticket Number Setting */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <ConfirmationNumberRoundedIcon sx={{ fontSize: 22, color: theme.textPrimary }} />
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0, letterSpacing: '-0.01em' }}>
                  Order Token & Kitchen Ticket (KOT) Sequence Settings
                </h2>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                  Customize order ticket numbering, daily reset cycles, dine-in table prefixes, and kitchen print rules.
                </p>
              </div>
            </div>

            {/* Side-by-side Configuration & Live Thermal Ticket Preview */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
                alignItems: 'start',
              }}
            >
              {/* Left Column: Ticket Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                      Dine-In Ticket Prefix
                    </label>
                    <input
                      type="text"
                      value={ticketPrefix}
                      onChange={(e) => setTicketPrefix(e.target.value)}
                      placeholder="e.g. T- or KOT-"
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
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                      Takeaway / Pickup Prefix
                    </label>
                    <input
                      type="text"
                      value={takeawayPrefix}
                      onChange={(e) => setTakeawayPrefix(e.target.value)}
                      placeholder="e.g. TO- or Q-"
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
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                      Starting Ticket Number
                    </label>
                    <input
                      type="number"
                      value={ticketStartingNumber}
                      onChange={(e) => setTicketStartingNumber(e.target.value)}
                      min={1}
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
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                      Current Active Queue Token
                    </label>
                    <div style={{ display: 'flex', gap: '0.45rem' }}>
                      <input
                        type="number"
                        value={currentTicketNumber}
                        onChange={(e) => setCurrentTicketNumber(e.target.value)}
                        min={1}
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
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentTicketNumber(ticketStartingNumber);
                          showToast(`Token sequence reset to ${ticketStartingNumber}`);
                        }}
                        className="button-20-secondary"
                        title="Reset current sequence to starting number"
                        style={{
                          padding: '0 0.75rem',
                          fontSize: '11px',
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                          borderRadius: '0.55rem',
                          fontFamily: 'inherit',
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                      Sequence Reset Cycle
                    </label>
                    <select
                      value={ticketResetCycle}
                      onChange={(e) => setTicketResetCycle(e.target.value as any)}
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
                      <option value="daily">Daily Reset (Midnight 00:00)</option>
                      <option value="continuous">Continuous (Never reset)</option>
                      <option value="shift">Per Cashier Register Shift</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                      Token Zero-Padding
                    </label>
                    <select
                      value={ticketDigitsPadding}
                      onChange={(e) => setTicketDigitsPadding(e.target.value as any)}
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
                      <option value="3">3 Digits (e.g. #001)</option>
                      <option value="4">4 Digits (e.g. #0001)</option>
                      <option value="2">2 Digits (e.g. #01)</option>
                      <option value="none">No Padding (e.g. #1)</option>
                    </select>
                  </div>
                </div>

                {/* Print & Notification Toggles */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                  {[
                    {
                      title: 'Print Large Token # at top of Customer Bill',
                      desc: 'Prominently display token number so waiting customers know their queue position.',
                      state: printLargeTokenOnBill,
                      toggle: () => setPrintLargeTokenOnBill(!printLargeTokenOnBill),
                    },
                    {
                      title: 'Print Table Number on Kitchen Order Ticket (KOT)',
                      desc: 'Print table code and dining room section clearly on chef food preparation slip.',
                      state: printTableOnKot,
                      toggle: () => setPrintTableOnKot(!printTableOnKot),
                    },
                    {
                      title: 'Include Server / Waiter Name on KOT',
                      desc: 'Print server name on kitchen dispatch slips for swift table runner routing.',
                      state: printServerNameOnKot,
                      toggle: () => setPrintServerNameOnKot(!printServerNameOnKot),
                    },
                    {
                      title: 'Auto-Increment Token on Order Dispatch',
                      desc: 'Automatically advance to next ticket number whenever an order is printed or paid.',
                      state: autoIncrementOnDispatch,
                      toggle: () => setAutoIncrementOnDispatch(!autoIncrementOnDispatch),
                    },
                    {
                      title: 'Audio Chime on Ticket Dispatch',
                      desc: 'Play a notification chime on the cashier register when a ticket is generated.',
                      state: ticketSoundChime,
                      toggle: () => setTicketSoundChime(!ticketSoundChime),
                    },
                  ].map((rule, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 0.95rem',
                        borderRadius: '0.55rem',
                        backgroundColor: theme.bgPage,
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: theme.textPrimary }}>
                          {rule.title}
                        </div>
                        <div style={{ fontSize: '11.5px', color: theme.textSecondary }}>
                          {rule.desc}
                        </div>
                      </div>
                      {renderToggle(rule.state, rule.toggle)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Live KOT Thermal Ticket Preview */}
              <div
                style={{
                  backgroundColor: theme.bgPage,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Live Thermal KOT Ticket Preview
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      color: '#16A34A',
                      backgroundColor: 'rgba(22, 163, 74, 0.1)',
                      padding: '2px 7px',
                      borderRadius: '9999px',
                    }}
                  >
                    REALTIME 80mm
                  </span>
                </div>

                {/* Thermal Ticket Paper Effect */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#111827',
                    borderRadius: '0.5rem',
                    padding: '1.25rem',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    fontSize: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px dashed #D1D5DB',
                  }}
                >
                  <div style={{ textAlign: 'center', borderBottom: '1px dashed #9CA3AF', paddingBottom: '0.65rem', marginBottom: '0.65rem' }}>
                    <div style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '0.05em' }}>
                      *** KITCHEN ORDER TICKET ***
                    </div>
                    <div style={{ fontSize: '11px', color: '#4B5563', marginTop: '2px' }}>
                      {storeName || 'SP CAFE & Bistro'} · Main Floor
                    </div>
                  </div>

                  {/* Prominent Token Display */}
                  <div
                    style={{
                      textAlign: 'center',
                      backgroundColor: '#F3F4F6',
                      padding: '0.5rem',
                      borderRadius: '0.35rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.08em', color: '#4B5563' }}>
                      ORDER TOKEN NUMBER
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: '#111827', letterSpacing: '0.05em' }}>
                      {formatTicketNumber(currentTicketNumber, ticketPrefix, ticketDigitsPadding)}
                    </div>
                  </div>

                  {/* Table & Server Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11.5px', marginBottom: '0.65rem' }}>
                    {printTableOnKot && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700 }}>TABLE: T-04 (Indoor)</span>
                        <span>DINE-IN</span>
                      </div>
                    )}
                    {printServerNameOnKot && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                        <span>SERVER: Alex M.</span>
                        <span>GUESTS: 4 Covers</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280', fontSize: '10.5px' }}>
                      <span>TIME: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>RESET: {ticketResetCycle.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div style={{ borderTop: '1px dashed #9CA3AF', borderBottom: '1px dashed #9CA3AF', padding: '0.5rem 0', margin: '0.65rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '11px', marginBottom: '4px' }}>
                      <span>QTY  ITEM</span>
                      <span>NOTES</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginTop: '3px' }}>
                      <span>2x   Artisanal Flat White</span>
                      <span style={{ color: '#4B5563', fontSize: '10.5px' }}>Oat Milk</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginTop: '3px' }}>
                      <span>1x   Truffle Risotto</span>
                      <span style={{ color: '#4B5563', fontSize: '10.5px' }}>Less spicy</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginTop: '3px' }}>
                      <span>1x   Avocado Sourdough</span>
                      <span style={{ color: '#4B5563', fontSize: '10.5px' }}>Extra toast</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', fontSize: '10px', color: '#6B7280', marginTop: '0.5rem' }}>
                    *** END OF KOT #{formatTicketNumber(currentTicketNumber, ticketPrefix, ticketDigitsPadding)} ***
                  </div>
                </div>
              </div>
            </div>

            {renderCardFooter('Ticket & Token Settings')}
          </div>

          {/* Card 3: Dine-In Service Rules */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <TuneRoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                Dine-In Service & Floor Plan Policies
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                {
                  title: 'Auto-Release Table on Payment Settlement',
                  desc: 'Automatically release and mark table as Available immediately after cashier settles the final bill.',
                  state: autoReleaseTableOnBill,
                  toggle: () => setAutoReleaseTableOnBill(!autoReleaseTableOnBill),
                },
                {
                  title: 'Allow Table Merging',
                  desc: 'Enable combining multiple tables (e.g. T-01 + T-02) for large banquets or group dining reservations.',
                  state: allowTableMerging,
                  toggle: () => setAllowTableMerging(!allowTableMerging),
                },
                {
                  title: 'Enforce Guest / Cover Count Entry',
                  desc: 'Prompt cashier or waiter to input party size before assigning items to a table.',
                  state: enforceGuestCount,
                  toggle: () => setEnforceGuestCount(!enforceGuestCount),
                },
                {
                  title: 'QR Code At-Table Self Ordering',
                  desc: 'Allow guests to scan table QR code to view live menu, order food, and request assistance.',
                  state: enableQrOrdering,
                  toggle: () => setEnableQrOrdering(!enableQrOrdering),
                },
                {
                  title: 'Table Idle Alert (> 15 mins)',
                  desc: 'Highlight tables on POS if occupied without any active items or beverage service for over 15 minutes.',
                  state: tableIdleAlert,
                  toggle: () => setTableIdleAlert(!tableIdleAlert),
                },
              ].map((rule, idx) => (
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
                      {rule.title}
                    </div>
                    <div style={{ fontSize: '12px', color: theme.textSecondary }}>
                      {rule.desc}
                    </div>
                  </div>
                  {renderToggle(rule.state, rule.toggle)}
                </div>
              ))}
            </div>

            {renderCardFooter('Dine-In Policies')}
          </div>
        </div>
      )}

      {/* SUB-TAB 7: NOTIFICATIONS */}
      {activeSubTab === 'set_notifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                <NotificationsNoneRoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Automated Alerts & Dispatch Channels
                </h2>
              </div>
              <button
                type="button"
                className="button-20"
                role="button"
                onClick={() => showToast('Test notification sent to owner and manager.')}
                style={{
                  height: '32px',
                  padding: '0 0.85rem',
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
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
                  {renderToggle(notifyLowStock, () => setNotifyLowStock(!notifyLowStock))}
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
                      backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
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
                  {renderToggle(notifyEndOfDaySummary, () => setNotifyEndOfDaySummary(!notifyEndOfDaySummary))}
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
                      backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
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
                {renderToggle(notifyShiftDiscrepancy, () => setNotifyShiftDiscrepancy(!notifyShiftDiscrepancy))}
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
                {renderToggle(notifyOrderVoidRefund, () => setNotifyOrderVoidRefund(!notifyOrderVoidRefund))}
              </div>
            </div>

            {renderCardFooter('Notification Preferences')}
          </div>
        </div>
      )}

      {/* SUB-TAB 8: USERS & PERMISSIONS */}
      {activeSubTab === 'set_users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
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
                className="button-20"
                role="button"
                onClick={() => showToast('New role creator launched.')}
                style={{
                  height: '32px',
                  padding: '0 0.85rem',
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
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

            {renderCardFooter('User Permissions Matrix')}
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
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
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
                {renderToggle(enforceCashierPin, () => setEnforceCashierPin(!enforceCashierPin))}
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
                {renderToggle(twoFactorAuth, () => setTwoFactorAuth(!twoFactorAuth))}
              </div>
            </div>

            {renderCardFooter('Terminal Security & Lock Policies')}
          </div>

          {/* Security Audit Trail Log */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
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

          {/* Active Session & Account Sign Out */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <LogoutRoundedIcon sx={{ fontSize: 18, color: '#EF4444' }} />
                  <h2 style={{ fontSize: '16px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                    Active Session & Account
                  </h2>
                </div>
                <p style={{ fontSize: '13px', color: theme.textSecondary, margin: 0 }}>
                  Signed in as <strong>Administrator</strong> on this browser terminal.
                </p>
              </div>

              <Link
                href="/signin"
                className="button-20-secondary"
                style={{
                  height: '38px',
                  padding: '0 1.25rem',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#EF4444',
                  borderColor: (theme as any).sidebarIsDark ? '#7F1D1D' : '#FCA5A5',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxSizing: 'border-box',
                }}
              >
                <LogoutRoundedIcon sx={{ fontSize: 16 }} />
                <span>Log Out</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 10: APPEARANCE */}
      {activeSubTab === 'set_appearance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '640px' }}>
          <div
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              borderRadius: '0.85rem',
              border: `1px solid ${theme.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {(currentThemeId === 'dark' || currentThemeId === 'bw_dark' || currentThemeId === 'classic_pos') ? (
                <DarkModeRoundedIcon sx={{ fontSize: 20, color: theme.textPrimary }} />
              ) : (
                <LightModeRoundedIcon sx={{ fontSize: 20, color: '#EAB308' }} />
              )}
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: theme.textPrimary, margin: 0, letterSpacing: '-0.01em' }}>
                Dark Mode
              </h2>
            </div>

            {renderToggle(
              currentThemeId === 'dark' || currentThemeId === 'bw_dark' || currentThemeId === 'classic_pos',
              () => {
                const isDark = currentThemeId === 'dark' || currentThemeId === 'bw_dark' || currentThemeId === 'classic_pos';
                const target = isDark ? 'light' : 'dark';
                onSelectTheme?.(target);
                showToast(`Switched to ${target === 'dark' ? 'Dark Mode' : 'Light Mode'}.`);
              }
            )}
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

    </div>
  );
}
