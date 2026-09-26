'use client';

import React, { useState, useMemo } from 'react';

// Material Rounded Icons
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StoreRoundedIcon from '@mui/icons-material/StoreRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';

// ============================================================================
// DATA STRUCTURES
// ============================================================================
export interface Employee {
  id: string; // e.g. EMP-101
  name: string;
  role: 'Store Manager' | 'Shift Supervisor' | 'Senior Cashier' | 'Cashier' | 'Barista' | 'Kitchen Lead' | 'Inventory Clerk';
  department: 'Operations' | 'Front of House' | 'Kitchen' | 'Inventory & Store';
  email: string;
  phone: string;
  assignedTerminal?: string;
  basePay: string; // e.g. ₹28,000/mo
  status: 'Active' | 'On Leave' | 'Suspended';
  joinedDate: string;
  emergencyContact: string;
  pinSet: boolean;
  avatarColor: string;
}

export interface CashierAccount {
  id: string;
  employeeId: string;
  name: string;
  terminalId: string;
  pinMasked: string; // '****'
  maxDiscountPercent: number; // e.g. 15%
  canOpenDrawerNoSale: boolean;
  canReprintReceipts: boolean;
  shiftStatus: 'On Register' | 'On Break' | 'Off Duty';
  status: 'Active' | 'Locked' | 'Suspended';
}

export interface ManagerAccount {
  id: string;
  employeeId: string;
  name: string;
  title: 'Store Manager' | 'Shift Supervisor' | 'Assistant Store Manager';
  branch: string;
  approvalLimit: number;
  canApproveReturns: boolean;
  canPerformZReport: boolean;
  canModifyCatalog: boolean;
  canAccessAuditLogs: boolean;
  twoFactorEnabled: boolean;
  overridePinSet: boolean;
}

export interface ShiftRecord {
  id: string; // e.g. SH-2026-0920-1
  employeeId: string;
  employeeName: string;
  role: string;
  terminalId: string;
  date: string;
  clockIn: string;
  clockOut: string;
  openingFloat: number;
  expectedCash: number;
  actualCash: number;
  variance: number;
  totalTransactions: number;
  status: 'Closed' | 'Active / Open' | 'Discrepancy';
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  date: string;
  scheduledShift: string; // e.g. '08:00 - 16:30'
  clockInTime: string;
  clockOutTime: string;
  totalHours: number;
  overtimeHours: number;
  status: 'Present' | 'Late' | 'Half Day' | 'Absent' | 'On Leave';
  approvalStatus: 'Approved' | 'Pending Review' | 'Flagged';
}

export interface PerformanceRecord {
  employeeId: string;
  employeeName: string;
  role: string;
  totalSales: number;
  ordersCount: number;
  aov: number;
  shiftsWorked: number;
  speedSec: number;
  discountsAuthorized: number;
  refundsProcessed: number;
  rating: number; // 1.0 to 5.0
}

export interface EmployeesManagementProps {
  activeSubTab?: 'emp_all' | 'emp_cashiers' | 'emp_managers' | 'emp_roles' | 'emp_shifts' | 'emp_attendance' | 'emp_performance';
  onSelectSubTab?: (tab: 'emp_all' | 'emp_cashiers' | 'emp_managers' | 'emp_roles' | 'emp_shifts' | 'emp_attendance' | 'emp_performance') => void;
  isManagerView?: boolean;
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

// ============================================================================
// INITIAL SAMPLE DATA
// ============================================================================
const INITIAL_EMPLOYEES: Employee[] = [];

const INITIAL_CASHIERS: CashierAccount[] = [];

const INITIAL_MANAGERS: ManagerAccount[] = [];

const INITIAL_SHIFTS: ShiftRecord[] = [];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [];

const INITIAL_PERFORMANCE: PerformanceRecord[] = [];

interface RolePermissionDef {
  key: string;
  name: string;
  category: 'POS & Billing' | 'Returns & Refunds' | 'Inventory & Pricing' | 'Reports & Financials' | 'System & Security';
  description: string;
}

const PERMISSION_DEFINITIONS: RolePermissionDef[] = [
  // POS & Billing
  { key: 'pos_ring_sales', name: 'Ring POS Sales & Orders', category: 'POS & Billing', description: 'Create and tender sales transactions on registers' },
  { key: 'pos_custom_discount', name: 'Apply Custom Discounts', category: 'POS & Billing', description: 'Override line-item or order-level discount up to role limit' },
  { key: 'pos_void_items', name: 'Void Ordered Items', category: 'POS & Billing', description: 'Remove saved items from ticket before checkout' },
  { key: 'pos_reprint_receipts', name: 'Reprint Past Receipts', category: 'POS & Billing', description: 'Reprint digital customer receipts for completed orders' },
  { key: 'pos_open_drawer_no_sale', name: 'No-Sale Cash Drawer Kick', category: 'POS & Billing', description: 'Open cash drawer without tender transaction' },

  // Returns & Refunds
  { key: 'ret_authorize_return', name: 'Authorize Item Return', category: 'Returns & Refunds', description: 'Accept customer returns and restock items' },
  { key: 'ret_issue_cash_refund', name: 'Issue Direct Cash Refunds', category: 'Returns & Refunds', description: 'Disburse cash from register float for refunds' },
  { key: 'ret_override_no_receipt', name: 'Refund Without Receipt', category: 'Returns & Refunds', description: 'Authorize returns when original receipt is missing' },

  // Inventory & Pricing
  { key: 'inv_edit_selling_price', name: 'Modify Selling Prices', category: 'Inventory & Pricing', description: 'Change product retail prices and variant charges' },
  { key: 'inv_add_products', name: 'Create & Archive Products', category: 'Inventory & Pricing', description: 'Add new catalog items, categories, and barcodes' },
  { key: 'inv_adjust_stock', name: 'Adjust Stock & Log Wastage', category: 'Inventory & Pricing', description: 'Perform inventory audit corrections and write-offs' },
  { key: 'inv_receive_po', name: 'Accept PO Shipments', category: 'Inventory & Pricing', description: 'Receive purchase order inventory into store stock' },

  // Reports & Financials
  { key: 'rep_view_revenue', name: 'View Real-time Revenue', category: 'Reports & Financials', description: 'Access live sales graphs, day gross, and KPIs' },
  { key: 'rep_view_employee_perf', name: 'View Staff Performance', category: 'Reports & Financials', description: 'Inspect individual employee sales and speed metrics' },
  { key: 'rep_export_ledgers', name: 'Export Financial Ledgers', category: 'Reports & Financials', description: 'Download CSV and PDF reports for accounting' },
  { key: 'rep_run_z_report', name: 'Run End-of-Day Z-Report', category: 'Reports & Financials', description: 'Finalize register day book and settle payment terminals' },

  // System & Security
  { key: 'sys_reset_pins', name: 'Reset Cashier PINs', category: 'System & Security', description: 'Set temporary 4-digit security PINs for staff' },
  { key: 'sys_edit_settings', name: 'Manage Store Configuration', category: 'System & Security', description: 'Change taxes, receipt footers, and hardware settings' },
  { key: 'sys_view_audit_logs', name: 'Inspect Security Audit Trails', category: 'System & Security', description: 'Track login attempts, drawer kicks, and overrides' },
];

const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  // Store Manager operational role: No product creation, no pricing control, no tax/settings, no user/permission management
  'Store Manager': PERMISSION_DEFINITIONS.filter((p) =>
    p.key !== 'inv_edit_selling_price' && // ❌ No Pricing control
    p.key !== 'inv_add_products' && // ❌ No Product creation/editing
    p.key !== 'sys_edit_settings' && // ❌ No Tax settings & Payment gateway settings
    p.key !== 'sys_reset_pins' // ❌ No User/permission management
  ).map((p) => p.key),
  'Shift Supervisor': [
    'pos_ring_sales', 'pos_custom_discount', 'pos_void_items', 'pos_reprint_receipts', 'pos_open_drawer_no_sale',
    'ret_authorize_return', 'ret_issue_cash_refund',
    'inv_adjust_stock', 'inv_receive_po',
    'rep_view_revenue', 'rep_view_employee_perf', 'rep_run_z_report',
    'sys_view_audit_logs',
  ],
  'Senior Cashier': [
    'pos_ring_sales', 'pos_custom_discount', 'pos_void_items', 'pos_reprint_receipts', 'pos_open_drawer_no_sale',
    'ret_authorize_return',
    'inv_receive_po',
  ],
  'Cashier / Barista': [
    'pos_ring_sales', 'pos_reprint_receipts',
  ],
  'Inventory Clerk': [
    'inv_adjust_stock', 'inv_receive_po',
  ],
};

export default function EmployeesManagement({
  activeSubTab = 'emp_all',
  onSelectSubTab,
  isManagerView = false,
  theme,
}: EmployeesManagementProps) {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<'emp_all' | 'emp_cashiers' | 'emp_managers' | 'emp_roles' | 'emp_shifts' | 'emp_attendance' | 'emp_performance'>(activeSubTab);

  // Sync with prop changes from sidebar navigation
  React.useEffect(() => {
    if (activeSubTab) {
      setCurrentTab(activeSubTab);
    }
  }, [activeSubTab]);

  // State: Employees Directory
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [empSearch, setEmpSearch] = useState('');
  const [empRoleFilter, setEmpRoleFilter] = useState('ALL');
  const [empStatusFilter, setEmpStatusFilter] = useState('ALL');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  // New Employee Form State
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRole, setNewEmpRole] = useState<Employee['role']>('Cashier');
  const [newEmpDept, setNewEmpDept] = useState<Employee['department']>('Front of House');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpPhone, setNewEmpPhone] = useState('');
  const [newEmpTerminal, setNewEmpTerminal] = useState('POS-Ahmedabad-01');
  const [newEmpBasePay, setNewEmpBasePay] = useState('₹22,000/mo');
  const [newEmpEmergency, setNewEmpEmergency] = useState('');
  const [newEmpPin, setNewEmpPin] = useState('1234');

  // State: Cashiers
  const [cashiers, setCashiers] = useState<CashierAccount[]>(INITIAL_CASHIERS);
  const [resetPinCashier, setResetPinCashier] = useState<CashierAccount | null>(null);
  const [newPinValue, setNewPinValue] = useState('');
  const [pinSuccessNotice, setPinSuccessNotice] = useState<string | null>(null);

  // State: Managers
  const [managers] = useState<ManagerAccount[]>(INITIAL_MANAGERS);
  const [editingManager, setEditingManager] = useState<ManagerAccount | null>(null);

  // State: Roles & Permissions
  const [selectedRoleName, setSelectedRoleName] = useState<string>('Store Manager');
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>(DEFAULT_ROLE_PERMISSIONS);
  const [permissionSavedNotice, setPermissionSavedNotice] = useState(false);

  // State: Shifts
  const [shifts] = useState<ShiftRecord[]>(INITIAL_SHIFTS);
  const [shiftFilterStatus, setShiftFilterStatus] = useState('ALL');
  const [viewingShift, setViewingShift] = useState<ShiftRecord | null>(null);

  // State: Attendance
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [adjustingAttendance, setAdjustingAttendance] = useState<AttendanceRecord | null>(null);
  const [adjustedClockIn, setAdjustedClockIn] = useState('');
  const [adjustedClockOut, setAdjustedClockOut] = useState('');

  // State: Performance
  const [performanceRecords] = useState<PerformanceRecord[]>(INITIAL_PERFORMANCE);

  // Filtered Employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.name.toLowerCase().includes(empSearch.toLowerCase()) ||
        emp.id.toLowerCase().includes(empSearch.toLowerCase()) ||
        emp.phone.includes(empSearch) ||
        emp.email.toLowerCase().includes(empSearch.toLowerCase()) ||
        emp.role.toLowerCase().includes(empSearch.toLowerCase());

      const matchRole = empRoleFilter === 'ALL' || emp.role === empRoleFilter;
      const matchStatus = empStatusFilter === 'ALL' || emp.status === empStatusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [employees, empSearch, empRoleFilter, empStatusFilter]);

  // Handle Add Employee
  const handleSaveNewEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim()) return;

    const newId = `EMP-${100 + employees.length + 1}`;
    const newEmp: Employee = {
      id: newId,
      name: newEmpName.trim(),
      role: newEmpRole,
      department: newEmpDept,
      email: newEmpEmail.trim() || `${newEmpName.toLowerCase().replace(/\s+/g, '.')}@nuradesk.pos`,
      phone: newEmpPhone.trim() || '+91 98000 00000',
      assignedTerminal: newEmpTerminal,
      basePay: newEmpBasePay.trim(),
      status: 'Active',
      joinedDate: '2026-09-20',
      emergencyContact: newEmpEmergency.trim() || 'Not specified',
      pinSet: Boolean(newEmpPin.trim()),
      avatarColor: '#1E293B',
    };

    setEmployees((prev) => [newEmp, ...prev]);

    if (newEmpRole === 'Cashier' || newEmpRole === 'Senior Cashier') {
      const newCashier: CashierAccount = {
        id: `CSH-0${cashiers.length + 1}`,
        employeeId: newId,
        name: newEmp.name,
        terminalId: newEmpTerminal,
        pinMasked: '****',
        maxDiscountPercent: newEmpRole === 'Senior Cashier' ? 15 : 10,
        canOpenDrawerNoSale: false,
        canReprintReceipts: true,
        shiftStatus: 'Off Duty',
        status: 'Active',
      };
      setCashiers((prev) => [newCashier, ...prev]);
    }

    setNewEmpName('');
    setNewEmpEmail('');
    setNewEmpPhone('');
    setNewEmpEmergency('');
    setShowAddEmployeeModal(false);
  };

  // Toggle permission for a role
  const handleTogglePermission = (permissionKey: string) => {
    setRolePermissions((prev) => {
      const currentList = prev[selectedRoleName] || [];
      const hasPermission = currentList.includes(permissionKey);
      const updatedList = hasPermission
        ? currentList.filter((k) => k !== permissionKey)
        : [...currentList, permissionKey];
      return {
        ...prev,
        [selectedRoleName]: updatedList,
      };
    });
  };

  // Save Role Permissions action
  const handleSaveRolePermissions = () => {
    setPermissionSavedNotice(true);
    setTimeout(() => {
      setPermissionSavedNotice(false);
    }, 3000);
  };

  // Handle Reset PIN
  const handleConfirmPinReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPinCashier || !newPinValue.trim()) return;

    setPinSuccessNotice(`PIN for ${resetPinCashier.name} successfully updated to new 4-digit credential.`);
    setResetPinCashier(null);
    setNewPinValue('');
    setTimeout(() => {
      setPinSuccessNotice(null);
    }, 4000);
  };

  // Handle Adjust Attendance Punch
  const handleConfirmAdjustAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingAttendance) return;

    setAttendance((prev) =>
      prev.map((att) =>
        att.id === adjustingAttendance.id
          ? {
              ...att,
              clockInTime: adjustedClockIn || att.clockInTime,
              clockOutTime: adjustedClockOut || att.clockOutTime,
              status: 'Present',
              approvalStatus: 'Approved',
            }
          : att
      )
    );
    setAdjustingAttendance(null);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', color: theme.textPrimary }}>
      {/* Toast Notice Banner */}
      {pinSuccessNotice && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.85rem 1.25rem',
          borderRadius: '0.75rem',
          backgroundColor: '#064E3B',
          color: '#ECFDF5',
          border: '1px solid #059669',
          marginBottom: '1.25rem',
          fontSize: '13.5px',
          fontWeight: 600,
        }}>
          <CheckCircleRoundedIcon sx={{ fontSize: 20, color: '#34D399' }} />
          <span>{pinSuccessNotice}</span>
        </div>
      )}

      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem',
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            margin: '0 0 0.35rem 0',
            color: theme.textPrimary,
          }}>
            Employees & Access Control
          </h1>
          <p style={{
            fontSize: '14px',
            color: theme.textSecondary,
            margin: 0,
            fontWeight: 500,
          }}>
            Staff directory, cashier PIN credentials, manager permissions, shifts, attendance, and performance analytics.
          </p>
        </div>

        {/* Global Action: Add Employee (Hidden for Manager role) */}
        {!isManagerView && (
          <button
            type="button"
            className="button-20"
            role="button"
            onClick={() => setShowAddEmployeeModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0 1.15rem',
              height: '38px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <AddRoundedIcon sx={{ fontSize: 18 }} />
            <span>Add Employee</span>
          </button>
        )}
      </div>

      {/* ==================================================================== */}
      {/* 1. ALL EMPLOYEES VIEW                                                */}
      {/* ==================================================================== */}
      {currentTab === 'emp_all' && (
        <>
          {/* Top 4 KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}>
            {/* Total Employees */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Total Employees
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {employees.length}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Across 4 store departments
                </span>
              </div>
            </div>

            {/* Active on Floor */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Active on Floor
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {employees.filter((e) => e.status === 'Active').length}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Ready to serve patrons
                </span>
              </div>
            </div>

            {/* On Scheduled Leave */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                On Scheduled Leave
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {employees.filter((e) => e.status === 'On Leave').length}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Approved medical & personal time
                </span>
              </div>
            </div>

            {/* Open Positions */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Open Positions
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  0
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  No active job openings
                </span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1.25rem',
          }}>
            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.border}`,
              borderRadius: '0.65rem',
              padding: '0 0.85rem',
              height: '38px',
              minWidth: '280px',
              flex: '1 1 300px',
            }}>
              <SearchRoundedIcon sx={{ fontSize: 18, color: theme.textSecondary }} />
              <input
                type="text"
                value={empSearch}
                onChange={(e) => setEmpSearch(e.target.value)}
                placeholder="Search staff by name, role, phone, or ID..."
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: theme.textPrimary,
                  fontSize: '13px',
                  outline: 'none',
                  width: '100%',
                }}
              />
              {empSearch && (
                <button
                  type="button"
                  onClick={() => setEmpSearch('')}
                  style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: 0 }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 16 }} />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <select
                value={empRoleFilter}
                onChange={(e) => setEmpRoleFilter(e.target.value)}
                style={{
                  height: '38px',
                  borderRadius: '0.65rem',
                  backgroundColor: theme.bgCard,
                  color: theme.textPrimary,
                  border: `1px solid ${theme.border}`,
                  padding: '0 0.85rem',
                  fontSize: '13px',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="ALL">All Roles</option>
                <option value="Store Manager">Store Manager</option>
                <option value="Shift Supervisor">Shift Supervisor</option>
                <option value="Senior Cashier">Senior Cashier</option>
                <option value="Cashier">Cashier</option>
                <option value="Barista">Barista</option>
                <option value="Kitchen Lead">Kitchen Lead</option>
                <option value="Inventory Clerk">Inventory Clerk</option>
              </select>

              <select
                value={empStatusFilter}
                onChange={(e) => setEmpStatusFilter(e.target.value)}
                style={{
                  height: '38px',
                  borderRadius: '0.65rem',
                  backgroundColor: theme.bgCard,
                  color: theme.textPrimary,
                  border: `1px solid ${theme.border}`,
                  padding: '0 0.85rem',
                  fontSize: '13px',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="ALL">All Status</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Employees Directory Table */}
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
            borderRadius: '1.25rem',
            overflow: 'hidden',
            marginBottom: '1.75rem',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}`, textAlign: 'left', backgroundColor: theme.tableHeaderBg }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Employee</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Role & Department</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Contact</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Assigned Station</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Compensation</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      style={{ borderBottom: `1px solid ${theme.border}`, transition: 'background-color 0.15s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.tableRowHover; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {/* Name & ID */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: emp.avatarColor,
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '12px',
                            flexShrink: 0,
                          }}>
                            {emp.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: theme.textPrimary }}>{emp.name}</div>
                            <div style={{ fontSize: '11px', color: theme.textSecondary }}>{emp.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role & Dept */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: theme.textPrimary }}>{emp.role}</div>
                        <div style={{ fontSize: '11px', color: theme.textSecondary }}>{emp.department}</div>
                      </td>

                      {/* Contact */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ color: theme.textPrimary, fontWeight: 600 }}>{emp.phone}</div>
                        <div style={{ fontSize: '11px', color: theme.textSecondary }}>{emp.email}</div>
                      </td>

                      {/* Station */}
                      <td style={{ padding: '0.85rem 1rem', color: theme.textPrimary, fontWeight: 600 }}>
                        {emp.assignedTerminal || 'Floater'}
                      </td>

                      {/* Base Pay */}
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: theme.textPrimary }}>
                        {emp.basePay}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          backgroundColor:
                            emp.status === 'Active' ? '#DCFCE7' :
                            emp.status === 'On Leave' ? '#FEF3C7' : '#FEE2E2',
                          color:
                            emp.status === 'Active' ? '#166534' :
                            emp.status === 'On Leave' ? '#92400E' : '#991B1B',
                        }}>
                          {emp.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedEmployee(emp)}
                          title="View Staff Profile"
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '0.45rem',
                            border: `1px solid ${theme.border}`,
                            backgroundColor: 'transparent',
                            color: theme.textPrimary,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <VisibilityRoundedIcon sx={{ fontSize: 16 }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: theme.textSecondary }}>
                        No employees match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 2. CASHIERS & PINS VIEW                                              */}
      {/* ==================================================================== */}
      {currentTab === 'emp_cashiers' && (
        <>
          {/* Top KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}>
            {/* Registered Cashiers */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Registered Cashiers
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {cashiers.length}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Assigned POS accounts
                </span>
              </div>
            </div>

            {/* Active Registers */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Active Registers
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {cashiers.length > 0 ? `${new Set(cashiers.map((c) => c.terminalId)).size} Terminals` : '0 Terminals'}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  {cashiers.length > 0 ? 'Assigned POS registers' : 'No terminals online'}
                </span>
              </div>
            </div>

            {/* PIN Security Status */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                PIN Security Status
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {cashiers.length > 0 ? '100% Set' : '0% Set'}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  {cashiers.length > 0 ? `All ${cashiers.length} cashiers encrypted` : 'No cashiers configured'}
                </span>
              </div>
            </div>

            {/* Avg Service Speed */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Avg Service Speed
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  0s / Order
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Checkout velocity benchmark
                </span>
              </div>
            </div>
          </div>

          {/* Cashiers Table */}
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
            borderRadius: '1.25rem',
            overflow: 'hidden',
            marginBottom: '1.75rem',
          }}>
            <div style={{
              padding: '1.25rem',
              borderBottom: `1px solid ${theme.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                  Cashier Registers & 4-Digit Security PINs
                </h3>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                  Manage cashier login credentials, drawer kick overrides, and discount limits.
                </p>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}`, textAlign: 'left', backgroundColor: theme.tableHeaderBg }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Cashier Account</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Assigned Terminal</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Login PIN</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Max Discount Limit</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>No-Sale Drawer Kick</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Shift Status</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cashiers.map((c) => (
                    <tr key={c.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: theme.textPrimary }}>{c.name}</div>
                        <div style={{ fontSize: '11px', color: theme.textSecondary }}>{c.id} • {c.employeeId}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: theme.textPrimary }}>
                        {c.terminalId}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          fontFamily: 'monospace',
                          letterSpacing: '0.2em',
                          fontSize: '14px',
                          padding: '2px 8px',
                          borderRadius: '0.35rem',
                          backgroundColor: theme.hoverBg,
                          border: `1px solid ${theme.border}`,
                          color: theme.textPrimary,
                        }}>
                          {c.pinMasked}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: theme.textPrimary }}>
                        Up to {c.maxDiscountPercent}%
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          backgroundColor: c.canOpenDrawerNoSale ? '#DCFCE7' : '#F3F4F6',
                          color: c.canOpenDrawerNoSale ? '#166534' : theme.textSecondary,
                        }}>
                          {c.canOpenDrawerNoSale ? 'Allowed' : 'Restricted'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          backgroundColor:
                            c.shiftStatus === 'On Register' ? '#DCFCE7' :
                            c.shiftStatus === 'On Break' ? '#FEF3C7' : theme.hoverBg,
                          color:
                            c.shiftStatus === 'On Register' ? '#166534' :
                            c.shiftStatus === 'On Break' ? '#92400E' : theme.textSecondary,
                        }}>
                          {c.shiftStatus}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <button
                          type="button"
                          className="button-20-secondary"
                          role="button"
                          onClick={() => setResetPinCashier(c)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '4px 10px',
                            height: '28px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          <LockResetRoundedIcon sx={{ fontSize: 15 }} />
                          <span>Reset PIN</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cashiers.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: theme.textSecondary }}>
                        No cashier accounts configured yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 3. MANAGERS VIEW                                                     */}
      {/* ==================================================================== */}
      {currentTab === 'emp_managers' && (
        <>
          {/* Top KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}>
            {/* Store Managers */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Store Managers
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {managers.filter((m) => m.title === 'Store Manager').length}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Full store administration
                </span>
              </div>
            </div>

            {/* Shift Supervisors */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Shift Supervisors
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {managers.filter((m) => m.title === 'Shift Supervisor').length}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Floor override authority
                </span>
              </div>
            </div>

            {/* Assigned Store */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Assigned Store
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '22px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.02em' }}>
                  Primary Store
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Terminal Zone
                </span>
              </div>
            </div>

            {/* Security 2FA Status */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Security 2FA Status
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  Enabled
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Required for refund overrides
                </span>
              </div>
            </div>
          </div>

          {/* Managers Table */}
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
            borderRadius: '1.25rem',
            overflow: 'hidden',
            marginBottom: '1.75rem',
          }}>
            <div style={{ padding: '1.25rem', borderBottom: `1px solid ${theme.border}` }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                Privileged Manager & Supervisor Accounts
              </h3>
              <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                Authority thresholds, manager PIN overrides, and Z-report settlement powers.
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}`, textAlign: 'left', backgroundColor: theme.tableHeaderBg }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Manager</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Title</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Branch Location</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Refund Approval Limit</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Z-Report Power</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>2FA Security</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map((m) => (
                    <tr key={m.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: theme.textPrimary }}>{m.name}</div>
                        <div style={{ fontSize: '11px', color: theme.textSecondary }}>{m.id} • {m.employeeId}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: theme.textPrimary }}>
                        {m.title}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: theme.textSecondary, fontWeight: 600 }}>
                        {m.branch}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#166534' }}>
                        Up to ₹{m.approvalLimit.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          backgroundColor: m.canPerformZReport ? '#DCFCE7' : '#F3F4F6',
                          color: m.canPerformZReport ? '#166534' : theme.textSecondary,
                        }}>
                          {m.canPerformZReport ? 'Authorized' : 'Disabled'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          backgroundColor: m.twoFactorEnabled ? '#DCFCE7' : '#FEE2E2',
                          color: m.twoFactorEnabled ? '#166534' : '#991B1B',
                        }}>
                          {m.twoFactorEnabled ? 'Active 2FA' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <button
                          type="button"
                          className="button-20-secondary"
                          role="button"
                          onClick={() => setEditingManager(m)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '4px 10px',
                            height: '28px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          <EditRoundedIcon sx={{ fontSize: 14 }} />
                          <span>Edit Privileges</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {managers.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: theme.textSecondary }}>
                        No manager accounts configured yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 4. ROLES & PERMISSIONS VIEW                                          */}
      {/* ==================================================================== */}
      {currentTab === 'emp_roles' && (
        <>
          {/* Role Selector Header */}
          <div style={{
            backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                  Role-Based Access Control (RBAC) Matrix
                </h3>
                <p style={{ fontSize: '12.5px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                  Configure granular capability permissions for each store staff tier.
                </p>
              </div>

              {/* Save Confirmation Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {permissionSavedNotice && (
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircleRoundedIcon sx={{ fontSize: 16 }} /> Saved successfully!
                  </span>
                )}
                <button
                  type="button"
                  className="button-20"
                  role="button"
                  onClick={handleSaveRolePermissions}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0 1.25rem',
                    height: '38px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <AssignmentTurnedInRoundedIcon sx={{ fontSize: 18 }} />
                  <span>Save Role Changes</span>
                </button>
              </div>
            </div>

            {/* Role Tabs Pill List */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', alignItems: 'center' }}>
              {Object.keys(rolePermissions).map((roleName) => {
                const isSelected = selectedRoleName === roleName;
                return (
                  <button
                    key={roleName}
                    type="button"
                    className={isSelected ? "button-20" : "button-20-secondary"}
                    role="button"
                    onClick={() => setSelectedRoleName(roleName)}
                    style={{
                      height: '38px',
                      padding: '0 1.25rem',
                      fontSize: '13px',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{roleName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Permissions Matrix by Category */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {(['POS & Billing', 'Returns & Refunds', 'Inventory & Pricing', 'Reports & Financials', 'System & Security'] as const).map((category) => {
              const categoryPermissions = PERMISSION_DEFINITIONS.filter((p) => p.category === category);
              const activeList = rolePermissions[selectedRoleName] || [];

              return (
                <div
                  key={category}
                  style={{
                    backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#F9FAFB',
                    border: `1px solid ${(theme as any).sidebarIsDark ? theme.borderCard : theme.border}`,
                    borderRadius: '1.25rem',
                    padding: '1.25rem 1.5rem',
                  }}
                >
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    color: theme.textPrimary,
                    margin: '0 0 1rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    <SecurityRoundedIcon sx={{ fontSize: 18, color: theme.textSecondary }} />
                    <span>{category}</span>
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.85rem' }}>
                    {categoryPermissions.map((perm) => {
                      const isEnabled = activeList.includes(perm.key);
                      return (
                        <div
                          key={perm.key}
                          onClick={() => handleTogglePermission(perm.key)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            padding: '0.85rem 1rem',
                            borderRadius: '0.75rem',
                            border: `1px solid ${(theme as any).sidebarIsDark ? (isEnabled ? theme.borderHover : theme.border) : '#E5E7EB'}`,
                            backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: (theme as any).sidebarIsDark ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.03)',
                          }}
                        >
                          <div style={{ paddingRight: '0.75rem' }}>
                            <div style={{ fontSize: '13px', fontWeight: 800, color: theme.textPrimary }}>
                              {perm.name}
                            </div>
                            <div style={{ fontSize: '11.5px', color: theme.textSecondary, marginTop: '2px', lineHeight: 1.4 }}>
                              {perm.description}
                            </div>
                          </div>

                          {/* Switch Indicator */}
                          <div style={{
                            width: '40px',
                            height: '22px',
                            borderRadius: '9999px',
                            backgroundColor: isEnabled ? '#10B981' : ((theme as any).sidebarIsDark ? '#4B5563' : '#E5E7EB'),
                            position: 'relative',
                            transition: 'background-color 0.2s ease',
                            flexShrink: 0,
                            marginTop: '2px',
                          }}>
                            <div style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              backgroundColor: '#FFFFFF',
                              position: 'absolute',
                              top: '3px',
                              left: isEnabled ? '21px' : '3px',
                              transition: 'left 0.2s ease',
                              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.15)',
                            }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 5. SHIFTS VIEW                                                       */}
      {/* ==================================================================== */}
      {currentTab === 'emp_shifts' && (
        <>
          {/* Top KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}>
            {/* Completed Shifts */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Completed Shifts
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {shifts.filter((s) => s.status === 'Closed').length}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  {shifts.filter((s) => s.status === 'Closed').length * 8} total store hours
                </span>
              </div>
            </div>

            {/* Open Active Shifts */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Open Active Shifts
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {shifts.filter((s) => s.status === 'Active / Open').length} On Floor
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  {shifts.filter((s) => s.status === 'Active / Open').length > 0 ? 'Registers live' : 'No active shifts'}
                </span>
              </div>
            </div>

            {/* Net Cash Variance */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Net Cash Variance
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {shifts.length > 0 ? `₹${shifts.reduce((acc, s) => acc + (s.variance || 0), 0).toFixed(2)}` : '₹0.00'}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Drawer precision benchmark
                </span>
              </div>
            </div>

            {/* Reconciliation Rate */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Reconciliation Rate
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {shifts.length > 0 ? `${((shifts.filter((s) => s.status === 'Closed').length / shifts.length) * 100).toFixed(0)}%` : '0%'}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Sign-off by manager
                </span>
              </div>
            </div>
          </div>

          {/* Shifts Table */}
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
            borderRadius: '1.25rem',
            overflow: 'hidden',
            marginBottom: '1.75rem',
          }}>
            <div style={{
              padding: '1.25rem',
              borderBottom: `1px solid ${theme.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                  Staff Shift History & Drawer Reconciliation
                </h3>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                  Audit register opening floats, counted cash, over/short variances, and manager sign-offs.
                </p>
              </div>

              {/* Status Filter */}
              <select
                value={shiftFilterStatus}
                onChange={(e) => setShiftFilterStatus(e.target.value)}
                style={{
                  height: '36px',
                  borderRadius: '0.55rem',
                  backgroundColor: theme.hoverBg,
                  color: theme.textPrimary,
                  border: `1px solid ${theme.border}`,
                  padding: '0 0.85rem',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="ALL">All Shift Statuses</option>
                <option value="Closed">Closed</option>
                <option value="Active / Open">Active / Open</option>
                <option value="Discrepancy">Discrepancy</option>
              </select>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}`, textAlign: 'left', backgroundColor: theme.tableHeaderBg }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Shift ID & Date</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Staff & Terminal</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Hours (In / Out)</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Float Start</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Counted Cash</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Variance</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Audit</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts
                    .filter((s) => shiftFilterStatus === 'ALL' || s.status === shiftFilterStatus)
                    .map((s) => (
                      <tr key={s.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: 800, color: theme.textPrimary }}>{s.id}</div>
                          <div style={{ fontSize: '11px', color: theme.textSecondary }}>{s.date}</div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: 800, color: theme.textPrimary }}>{s.employeeName}</div>
                          <div style={{ fontSize: '11px', color: theme.textSecondary }}>{s.role} • {s.terminalId}</div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: theme.textPrimary }}>
                          {s.clockIn} - {s.clockOut}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: theme.textSecondary }}>
                          ₹{s.openingFloat.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textPrimary }}>
                          ₹{s.actualCash.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{
                            fontWeight: 800,
                            color: s.variance === 0 ? '#166534' : '#DC2626',
                          }}>
                            {s.variance === 0 ? '₹0.00' : `-₹${Math.abs(s.variance)}`}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            backgroundColor:
                              s.status === 'Closed' ? '#DCFCE7' :
                              s.status === 'Active / Open' ? '#DBEAFE' : '#FEE2E2',
                            color:
                              s.status === 'Closed' ? '#166534' :
                              s.status === 'Active / Open' ? '#1E40AF' : '#991B1B',
                          }}>
                            {s.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <button
                            type="button"
                            className="button-20-secondary"
                            role="button"
                            onClick={() => setViewingShift(s)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '4px 10px',
                              height: '28px',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                            }}
                          >
                            <VisibilityRoundedIcon sx={{ fontSize: 14 }} />
                            <span>Audit</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  {shifts.filter((s) => shiftFilterStatus === 'ALL' || s.status === shiftFilterStatus).length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: theme.textSecondary }}>
                        No shift records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 6. ATTENDANCE VIEW                                                   */}
      {/* ==================================================================== */}
      {currentTab === 'emp_attendance' && (
        <>
          {/* Top KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}>
            {/* Today Attendance */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Today Attendance
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {attendance.length > 0 ? `${((attendance.filter((a) => a.status === 'Present').length / attendance.length) * 100).toFixed(0)}%` : '0%'}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  {attendance.filter((a) => a.status === 'Present').length} on duty
                </span>
              </div>
            </div>

            {/* Punctuality Rate */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Punctuality Rate
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {attendance.length > 0 ? `${((attendance.filter((a) => a.status === 'Present').length / attendance.length) * 100).toFixed(0)}% On-Time` : '0% On-Time'}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  {attendance.filter((a) => a.status === 'Late').length} late clock-in logged
                </span>
              </div>
            </div>

            {/* Weekly Overtime */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Weekly Overtime
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {attendance.reduce((acc, a) => acc + (a.overtimeHours || 0), 0)} hrs
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Approved supervisor hours
                </span>
              </div>
            </div>

            {/* Active Leaves */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Active Leaves
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {employees.filter((e) => e.status === 'On Leave').length} Staff
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  {employees.filter((e) => e.status === 'On Leave').length > 0 ? 'On approved leave' : 'No staff on leave'}
                </span>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
            borderRadius: '1.25rem',
            overflow: 'hidden',
            marginBottom: '1.75rem',
          }}>
            <div style={{ padding: '1.25rem', borderBottom: `1px solid ${theme.border}` }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                Daily Timecard & Attendance Records
              </h3>
              <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                Working hours, scheduled vs. actual clock punch times, and manager approvals.
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}`, textAlign: 'left', backgroundColor: theme.tableHeaderBg }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Employee</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Date</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Scheduled Shift</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Clock In</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Clock Out</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Hours Worked</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((att) => (
                    <tr key={att.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: theme.textPrimary }}>{att.employeeName}</div>
                        <div style={{ fontSize: '11px', color: theme.textSecondary }}>{att.role}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: theme.textSecondary, fontWeight: 600 }}>
                        {att.date}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: theme.textPrimary, fontWeight: 600 }}>
                        {att.scheduledShift}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: theme.textPrimary }}>
                        {att.clockInTime}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: theme.textPrimary }}>
                        {att.clockOutTime}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: theme.textPrimary }}>
                        {att.totalHours} hrs {att.overtimeHours > 0 && <span style={{ fontSize: '11px', color: '#B45309' }}>(+{att.overtimeHours} OT)</span>}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          backgroundColor:
                            att.status === 'Present' ? '#DCFCE7' :
                            att.status === 'Late' ? '#FEF3C7' :
                            att.status === 'On Leave' ? '#E0E7FF' : '#FEE2E2',
                          color:
                            att.status === 'Present' ? '#166534' :
                            att.status === 'Late' ? '#92400E' :
                            att.status === 'On Leave' ? '#3730A3' : '#991B1B',
                        }}>
                          {att.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <button
                          type="button"
                          className="button-20-secondary"
                          role="button"
                          onClick={() => {
                            setAdjustingAttendance(att);
                            setAdjustedClockIn(att.clockInTime !== '—' ? att.clockInTime : '08:00');
                            setAdjustedClockOut(att.clockOutTime !== '—' ? att.clockOutTime : '16:00');
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '4px 10px',
                            height: '28px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          <EditRoundedIcon sx={{ fontSize: 14 }} />
                          <span>Adjust</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {attendance.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: theme.textSecondary }}>
                        No attendance logs recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 7. EMPLOYEE PERFORMANCE VIEW                                         */}
      {/* ==================================================================== */}
      {currentTab === 'emp_performance' && (
        <>
          {/* Top KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}>
            {/* Total Team Sales */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Total Team Sales
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {performanceRecords.reduce((acc, p) => acc + p.totalSales, 0) > 0 ? '₹' + performanceRecords.reduce((acc, p) => acc + p.totalSales, 0).toLocaleString('en-IN') : '₹0'}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  {performanceRecords.length > 0 ? `Across ${performanceRecords.length} cashiers` : 'No sales recorded'}
                </span>
              </div>
            </div>

            {/* Orders Processed */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Orders Processed
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {performanceRecords.reduce((acc, p) => acc + p.ordersCount, 0)}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  {performanceRecords.length > 0 ? `Avg ~${Math.round(performanceRecords.reduce((acc, p) => acc + p.ordersCount, 0) / performanceRecords.length)} orders / cashier` : 'No orders handled'}
                </span>
              </div>
            </div>

            {/* Speed of Service */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Speed of Service
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  {performanceRecords.length > 0 ? `${(performanceRecords.reduce((acc, p) => acc + p.speedSec, 0) / performanceRecords.length).toFixed(0)}s` : '0s'}
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Avg checkout duration
                </span>
              </div>
            </div>

            {/* Refund Discrepancy Rate */}
            <div style={{
              backgroundColor: (theme as any).sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.border}`,
              borderRadius: '1rem',
              padding: '1.35rem 1.4rem',
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: (theme as any).sidebarIsDark ? theme.textSecondary : '#6B7280',
                letterSpacing: '-0.01em',
                marginBottom: '0.65rem',
              }}>
                Refund Discrepancy Rate
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
                  0.0%
                </span>
                <span style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: 500 }}>
                  Cashier integrity score
                </span>
              </div>
            </div>
          </div>

          {/* Performance Table */}
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.borderCard}`,
            borderRadius: '1.25rem',
            overflow: 'hidden',
            marginBottom: '1.75rem',
          }}>
            <div style={{ padding: '1.25rem', borderBottom: `1px solid ${theme.border}` }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                Cashier Performance, Orders & Refund Integrity
              </h3>
              <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                Tracking sales rung, average order ticket size, checkout speed, and discounts authorized.
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}`, textAlign: 'left', backgroundColor: theme.tableHeaderBg }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Employee</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Total Sales</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Orders Handled</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>AOV</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Shifts</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Service Speed</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Discounts Given</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase' }}>Refunds Done</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceRecords.map((perf) => (
                    <tr key={perf.employeeId} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: theme.textPrimary }}>{perf.employeeName}</div>
                        <div style={{ fontSize: '11px', color: theme.textSecondary }}>{perf.role}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#166534' }}>
                        ₹{perf.totalSales.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: theme.textPrimary }}>
                        {perf.ordersCount} orders
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: theme.textSecondary }}>
                        ₹{perf.aov}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: theme.textPrimary }}>
                        {perf.shiftsWorked}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          padding: '2px 7px',
                          borderRadius: '0.35rem',
                          backgroundColor: perf.speedSec < 50 ? '#DCFCE7' : '#F3F4F6',
                          color: perf.speedSec < 50 ? '#166534' : theme.textPrimary,
                          fontWeight: 800,
                          fontSize: '11.5px',
                        }}>
                          {perf.speedSec}s
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: theme.textSecondary, fontWeight: 600 }}>
                        ₹{perf.discountsAuthorized.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: theme.textSecondary, fontWeight: 600 }}>
                        ₹{perf.refundsProcessed.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          fontWeight: 800,
                          color: '#B45309',
                          backgroundColor: '#FEF3C7',
                          padding: '2px 7px',
                          borderRadius: '0.35rem',
                          fontSize: '12px',
                        }}>
                          <StarRoundedIcon sx={{ fontSize: 13, color: '#F59E0B' }} />
                          {perf.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {performanceRecords.length === 0 && (
                    <tr>
                      <td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: theme.textSecondary }}>
                        No performance records logged yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: ADD EMPLOYEE MODAL                                          */}
      {/* ==================================================================== */}
      {showAddEmployeeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '1.75rem',
            boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Add New Employee
                </h3>
                <p style={{ fontSize: '12.5px', color: theme.textSecondary, margin: '3px 0 0 0' }}>
                  Register staff details, assign store role, terminal station, and initial PIN.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddEmployeeModal(false)}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: '4px' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSaveNewEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  placeholder="e.g. Maya Verma"
                  style={{
                    width: '100%',
                    height: '38px',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.hoverBg,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    padding: '0 0.85rem',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                    ROLE *
                  </label>
                  <select
                    value={newEmpRole}
                    onChange={(e) => setNewEmpRole(e.target.value as any)}
                    style={{
                      width: '100%',
                      height: '38px',
                      borderRadius: '0.55rem',
                      backgroundColor: theme.hoverBg,
                      border: `1px solid ${theme.border}`,
                      color: theme.textPrimary,
                      padding: '0 0.75rem',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Cashier">Cashier</option>
                    <option value="Senior Cashier">Senior Cashier</option>
                    <option value="Barista">Barista</option>
                    <option value="Shift Supervisor">Shift Supervisor</option>
                    <option value="Store Manager">Store Manager</option>
                    <option value="Kitchen Lead">Kitchen Lead</option>
                    <option value="Inventory Clerk">Inventory Clerk</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                    DEPARTMENT *
                  </label>
                  <select
                    value={newEmpDept}
                    onChange={(e) => setNewEmpDept(e.target.value as any)}
                    style={{
                      width: '100%',
                      height: '38px',
                      borderRadius: '0.55rem',
                      backgroundColor: theme.hoverBg,
                      border: `1px solid ${theme.border}`,
                      color: theme.textPrimary,
                      padding: '0 0.75rem',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Front of House">Front of House</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Operations">Operations</option>
                    <option value="Inventory & Store">Inventory & Store</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                    PHONE NUMBER
                  </label>
                  <input
                    type="text"
                    value={newEmpPhone}
                    onChange={(e) => setNewEmpPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    style={{
                      width: '100%',
                      height: '38px',
                      borderRadius: '0.55rem',
                      backgroundColor: theme.hoverBg,
                      border: `1px solid ${theme.border}`,
                      color: theme.textPrimary,
                      padding: '0 0.85rem',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                    ASSIGNED TERMINAL
                  </label>
                  <select
                    value={newEmpTerminal}
                    onChange={(e) => setNewEmpTerminal(e.target.value)}
                    style={{
                      width: '100%',
                      height: '38px',
                      borderRadius: '0.55rem',
                      backgroundColor: theme.hoverBg,
                      border: `1px solid ${theme.border}`,
                      color: theme.textPrimary,
                      padding: '0 0.75rem',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="POS-Ahmedabad-01">POS-Ahmedabad-01 (Main)</option>
                    <option value="POS-Ahmedabad-02">POS-Ahmedabad-02 (Barista)</option>
                    <option value="POS-Ahmedabad-03">POS-Ahmedabad-03 (Express)</option>
                    <option value="KDS-Kitchen-01">KDS-Kitchen-01</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                    INITIAL 4-DIGIT PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={newEmpPin}
                    onChange={(e) => setNewEmpPin(e.target.value)}
                    placeholder="1234"
                    style={{
                      width: '100%',
                      height: '38px',
                      borderRadius: '0.55rem',
                      backgroundColor: theme.hoverBg,
                      border: `1px solid ${theme.border}`,
                      color: theme.textPrimary,
                      padding: '0 0.85rem',
                      fontSize: '14px',
                      letterSpacing: '0.2em',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                    BASE PAY
                  </label>
                  <input
                    type="text"
                    value={newEmpBasePay}
                    onChange={(e) => setNewEmpBasePay(e.target.value)}
                    placeholder="e.g. ₹24,000/mo"
                    style={{
                      width: '100%',
                      height: '38px',
                      borderRadius: '0.55rem',
                      backgroundColor: theme.hoverBg,
                      border: `1px solid ${theme.border}`,
                      color: theme.textPrimary,
                      padding: '0 0.85rem',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                  EMERGENCY CONTACT
                </label>
                <input
                  type="text"
                  value={newEmpEmergency}
                  onChange={(e) => setNewEmpEmergency(e.target.value)}
                  placeholder="e.g. +91 98980 12345 (Parent)"
                  style={{
                    width: '100%',
                    height: '38px',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.hoverBg,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    padding: '0 0.85rem',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  className="button-20-secondary"
                  role="button"
                  onClick={() => setShowAddEmployeeModal(false)}
                  style={{
                    padding: '0 1rem',
                    height: '38px',
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
                    padding: '0 1.25rem',
                    height: '38px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: VIEW EMPLOYEE PROFILE MODAL                                 */}
      {/* ==================================================================== */}
      {selectedEmployee && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '520px',
            padding: '1.75rem',
            boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: selectedEmployee.avatarColor,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '16px',
                }}>
                  {selectedEmployee.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                    {selectedEmployee.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                    {selectedEmployee.role} • {selectedEmployee.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEmployee(null)}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: '4px' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              backgroundColor: theme.hoverBg,
              borderRadius: '0.85rem',
              padding: '1rem 1.25rem',
              marginBottom: '1.25rem',
              fontSize: '13px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.textSecondary, fontWeight: 600 }}>Department:</span>
                <span style={{ fontWeight: 800, color: theme.textPrimary }}>{selectedEmployee.department}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.textSecondary, fontWeight: 600 }}>Phone:</span>
                <span style={{ fontWeight: 700, color: theme.textPrimary }}>{selectedEmployee.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.textSecondary, fontWeight: 600 }}>Email:</span>
                <span style={{ fontWeight: 700, color: theme.textPrimary }}>{selectedEmployee.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.textSecondary, fontWeight: 600 }}>Assigned Terminal:</span>
                <span style={{ fontWeight: 800, color: theme.textPrimary }}>{selectedEmployee.assignedTerminal || 'Floater'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.textSecondary, fontWeight: 600 }}>Compensation:</span>
                <span style={{ fontWeight: 800, color: theme.textPrimary }}>{selectedEmployee.basePay}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.textSecondary, fontWeight: 600 }}>Emergency Contact:</span>
                <span style={{ fontWeight: 700, color: theme.textPrimary }}>{selectedEmployee.emergencyContact}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.textSecondary, fontWeight: 600 }}>Status:</span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: selectedEmployee.status === 'Active' ? '#DCFCE7' : '#FEF3C7',
                  color: selectedEmployee.status === 'Active' ? '#166534' : '#92400E',
                }}>
                  {selectedEmployee.status}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="button-20"
                role="button"
                onClick={() => setSelectedEmployee(null)}
                style={{
                  padding: '0 1.25rem',
                  height: '38px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: RESET CASHIER PIN MODAL                                     */}
      {/* ==================================================================== */}
      {resetPinCashier && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '440px',
            padding: '1.75rem',
            boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Reset Cashier PIN
                </h3>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                  Set a new 4-digit numeric login PIN for {resetPinCashier.name}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setResetPinCashier(null)}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: '4px' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleConfirmPinReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.45rem' }}>
                  NEW 4-DIGIT PIN *
                </label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  autoFocus
                  value={newPinValue}
                  onChange={(e) => setNewPinValue(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  style={{
                    width: '100%',
                    height: '44px',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.hoverBg,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    padding: '0 1rem',
                    fontSize: '18px',
                    letterSpacing: '0.3em',
                    textAlign: 'center',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <p style={{ fontSize: '11.5px', color: theme.textSecondary, margin: 0, lineHeight: 1.4 }}>
                This PIN will instantly update on Terminal {resetPinCashier.terminalId}. The cashier must input this PIN for order processing and drawer kicks.
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="button-20-secondary"
                  role="button"
                  onClick={() => setResetPinCashier(null)}
                  style={{
                    padding: '0 1rem',
                    height: '38px',
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
                  disabled={newPinValue.length !== 4}
                  style={{
                    padding: '0 1.25rem',
                    height: '38px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: newPinValue.length === 4 ? 'pointer' : 'not-allowed',
                    opacity: newPinValue.length === 4 ? 1 : 0.5,
                    fontFamily: 'inherit',
                  }}
                >
                  Update PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: EDIT MANAGER PRIVILEGES MODAL                               */}
      {/* ==================================================================== */}
      {editingManager && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '480px',
            padding: '1.75rem',
            boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Manager Privileges: {editingManager.name}
                </h3>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                  Adjust refund approval limits and settlement rights.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingManager(null)}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: '4px' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.45rem' }}>
                  SINGLE REFUND APPROVAL LIMIT (₹)
                </label>
                <input
                  type="number"
                  defaultValue={editingManager.approvalLimit}
                  style={{
                    width: '100%',
                    height: '38px',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.hoverBg,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    padding: '0 0.85rem',
                    fontSize: '14px',
                    fontWeight: 700,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 0.85rem',
                borderRadius: '0.55rem',
                backgroundColor: theme.hoverBg,
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: theme.textPrimary }}>Can Run End-of-Day Z-Report</div>
                  <div style={{ fontSize: '11px', color: theme.textSecondary }}>Finalize and settle register cash drawers</div>
                </div>
                <input type="checkbox" defaultChecked={editingManager.canPerformZReport} style={{ width: '18px', height: '18px' }} />
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 0.85rem',
                borderRadius: '0.55rem',
                backgroundColor: theme.hoverBg,
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: theme.textPrimary }}>Require 2-Factor Authentication</div>
                  <div style={{ fontSize: '11px', color: theme.textSecondary }}>OTP on mobile for overrides</div>
                </div>
                <input type="checkbox" defaultChecked={editingManager.twoFactorEnabled} style={{ width: '18px', height: '18px' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  className="button-20-secondary"
                  role="button"
                  onClick={() => setEditingManager(null)}
                  style={{
                    padding: '0 1rem',
                    height: '38px',
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
                  className="button-20"
                  role="button"
                  onClick={() => setEditingManager(null)}
                  style={{
                    padding: '0 1.25rem',
                    height: '38px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Save Privileges
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 5: AUDIT SHIFT REPORT MODAL                                    */}
      {/* ==================================================================== */}
      {viewingShift && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '520px',
            padding: '1.75rem',
            boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Shift Audit: {viewingShift.id}
                </h3>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                  {viewingShift.employeeName} ({viewingShift.role}) • {viewingShift.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingShift(null)}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: '4px' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              backgroundColor: theme.hoverBg,
              borderRadius: '0.85rem',
              padding: '1rem 1.25rem',
              marginBottom: '1.25rem',
              fontSize: '13px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.textSecondary, fontWeight: 600 }}>Terminal:</span>
                <span style={{ fontWeight: 800, color: theme.textPrimary }}>{viewingShift.terminalId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.textSecondary, fontWeight: 600 }}>Operating Hours:</span>
                <span style={{ fontWeight: 700, color: theme.textPrimary }}>{viewingShift.clockIn} to {viewingShift.clockOut}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.textSecondary, fontWeight: 600 }}>Opening Float (Starting Drawer):</span>
                <span style={{ fontWeight: 800, color: theme.textPrimary }}>₹{viewingShift.openingFloat.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.textSecondary, fontWeight: 600 }}>Expected Drawer Cash:</span>
                <span style={{ fontWeight: 800, color: theme.textPrimary }}>₹{viewingShift.expectedCash.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.textSecondary, fontWeight: 600 }}>Actual Counted Cash:</span>
                <span style={{ fontWeight: 800, color: '#166534' }}>₹{viewingShift.actualCash.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.45rem', borderTop: `1px solid ${theme.border}` }}>
                <span style={{ color: theme.textSecondary, fontWeight: 700 }}>Discrepancy / Variance:</span>
                <span style={{
                  fontWeight: 800,
                  color: viewingShift.variance === 0 ? '#166534' : '#DC2626',
                }}>
                  {viewingShift.variance === 0 ? '₹0.00 (Perfect Match)' : `-₹${Math.abs(viewingShift.variance)}.00`}
                </span>
              </div>
              {viewingShift.notes && (
                <div style={{ marginTop: '0.5rem', fontSize: '12px', color: theme.textSecondary, fontStyle: 'italic' }}>
                  &ldquo;{viewingShift.notes}&rdquo;
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="button-20"
                role="button"
                onClick={() => setViewingShift(null)}
                style={{
                  padding: '0 1.25rem',
                  height: '38px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 6: ADJUST ATTENDANCE PUNCH MODAL                               */}
      {/* ==================================================================== */}
      {adjustingAttendance && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '440px',
            padding: '1.75rem',
            boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Adjust Attendance Punch
                </h3>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                  {adjustingAttendance.employeeName} • {adjustingAttendance.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAdjustingAttendance(null)}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: '4px' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleConfirmAdjustAttendance} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.45rem' }}>
                  ACTUAL CLOCK IN TIME
                </label>
                <input
                  type="time"
                  required
                  value={adjustedClockIn}
                  onChange={(e) => setAdjustedClockIn(e.target.value)}
                  style={{
                    width: '100%',
                    height: '38px',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.hoverBg,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    padding: '0 0.85rem',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.45rem' }}>
                  ACTUAL CLOCK OUT TIME
                </label>
                <input
                  type="time"
                  required
                  value={adjustedClockOut}
                  onChange={(e) => setAdjustedClockOut(e.target.value)}
                  style={{
                    width: '100%',
                    height: '38px',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.hoverBg,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    padding: '0 0.85rem',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="button-20-secondary"
                  role="button"
                  onClick={() => setAdjustingAttendance(null)}
                  style={{
                    padding: '0 1rem',
                    height: '38px',
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
                    padding: '0 1.25rem',
                    height: '38px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Save Timecard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
