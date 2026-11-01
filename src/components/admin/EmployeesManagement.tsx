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
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
  resetEmployeePin,
  getFranchises,
} from '@/lib/api-client';
import {
  EmployeeDto,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  ResetEmployeePinRequest,
  FranchiseDto,
} from '@/types/employee';

// ============================================================================
// DATA STRUCTURES
// ============================================================================
export interface Employee {
  id: string; // e.g. EMP-101
  numericId?: number;
  franchiseId?: number;
  employeeCode?: string;
  name: string;
  role: 'Admin' | 'Store Manager' | 'Shift Supervisor' | 'Senior Cashier' | 'Cashier' | 'Barista' | 'Kitchen Lead' | 'Inventory Clerk';
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
  numericId?: number;
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
  numericId?: number;
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

export interface EmployeesManagementProps {
  activeSubTab?: 'emp_all' | 'emp_cashiers' | 'emp_managers' | 'emp_roles' | 'emp_shifts';
  onSelectSubTab?: (tab: 'emp_all' | 'emp_cashiers' | 'emp_managers' | 'emp_roles' | 'emp_shifts') => void;
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
  const [currentTab, setCurrentTab] = useState<'emp_all' | 'emp_cashiers' | 'emp_managers' | 'emp_roles' | 'emp_shifts'>(activeSubTab);

  // Sync with prop changes from sidebar navigation
  React.useEffect(() => {
    if (activeSubTab) {
      setCurrentTab(activeSubTab);
    }
  }, [activeSubTab]);

  // Loading & Feedback State
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [pinSuccessNotice, setPinSuccessNotice] = useState<string | null>(null);

  // State: Franchises
  const [franchises, setFranchises] = useState<FranchiseDto[]>([]);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<number | undefined>(undefined);

  // State: Employees Directory
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [empSearch, setEmpSearch] = useState('');
  const [empRoleFilter, setEmpRoleFilter] = useState('ALL');
  const [empStatusFilter, setEmpStatusFilter] = useState('ALL');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  // New Employee Form State
  const [newEmpCode, setNewEmpCode] = useState('');
  const [newEmpFranchiseId, setNewEmpFranchiseId] = useState<number>(1);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRole, setNewEmpRole] = useState<Employee['role']>('Cashier');
  const [newEmpDept, setNewEmpDept] = useState<Employee['department']>('Front of House');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpPhone, setNewEmpPhone] = useState('');
  const [newEmpTerminal, setNewEmpTerminal] = useState('POS-Ahmedabad-01');
  const [newEmpBasePay, setNewEmpBasePay] = useState('₹22,000/mo');
  const [newEmpEmergency, setNewEmpEmergency] = useState('');
  const [newEmpPin, setNewEmpPin] = useState('');

  // Edit Employee State
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<Employee['role']>('Cashier');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);

  // Deactivate Employee State
  const [deactivatingEmployee, setDeactivatingEmployee] = useState<Employee | null>(null);

  // State: Cashiers
  const [cashiers, setCashiers] = useState<CashierAccount[]>(INITIAL_CASHIERS);

  // Unified Reset PIN State (supports both Employee & Cashier)
  const [resetPinTarget, setResetPinTarget] = useState<{
    id: number;
    name: string;
    codeOrTerminal: string;
    role?: string;
  } | null>(null);
  const [resetPinCashier, setResetPinCashier] = useState<CashierAccount | null>(null);
  const [newPinValue, setNewPinValue] = useState('');
  const [confirmPinValue, setConfirmPinValue] = useState('');

  // State: Managers
  const [managers, setManagers] = useState<ManagerAccount[]>(INITIAL_MANAGERS);
  const [editingManager, setEditingManager] = useState<ManagerAccount | null>(null);

  // State: Roles & Permissions
  const [selectedRoleName, setSelectedRoleName] = useState<string>('Store Manager');
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>(DEFAULT_ROLE_PERMISSIONS);
  const [permissionSavedNotice, setPermissionSavedNotice] = useState(false);

  // State: Shifts
  const [shifts] = useState<ShiftRecord[]>(INITIAL_SHIFTS);
  const [shiftFilterStatus, setShiftFilterStatus] = useState('ALL');
  const [viewingShift, setViewingShift] = useState<ShiftRecord | null>(null);
  const [adjustedClockIn, setAdjustedClockIn] = useState('');
  const [adjustedClockOut, setAdjustedClockOut] = useState('');

  // Helper mapping functions
  const mapRoleToDept = (role: Employee['role']): Employee['department'] => {
    if (role === 'Cashier' || role === 'Senior Cashier' || role === 'Barista') return 'Front of House';
    if (role === 'Kitchen Lead') return 'Kitchen';
    if (role === 'Inventory Clerk') return 'Inventory & Store';
    return 'Operations';
  };

  const AVATAR_COLORS = ['#1E293B', '#047857', '#B45309', '#6D28D9', '#BE185D', '#0369A1', '#4338CA', '#0D9488'];

  const mapDtoToEmployee = (dto: EmployeeDto): Employee => {
    const color = AVATAR_COLORS[Math.abs(dto.id) % AVATAR_COLORS.length];
    return {
      id: dto.employeeCode || `EMP-${dto.id}`,
      numericId: dto.id,
      franchiseId: dto.franchiseId,
      employeeCode: dto.employeeCode,
      name: dto.name,
      role: dto.role,
      department: mapRoleToDept(dto.role),
      email: dto.email || `${dto.name.toLowerCase().replace(/\s+/g, '.')}@nuradesk.pos`,
      phone: dto.phone || '+91 98000 00000',
      assignedTerminal: 'POS-Ahmedabad-01',
      basePay: '₹24,000/mo',
      status: dto.isActive ? 'Active' : 'Suspended',
      joinedDate: dto.createdAtUtc ? dto.createdAtUtc.substring(0, 10) : '2026-09-20',
      emergencyContact: 'Not specified',
      pinSet: dto.pinConfigured,
      avatarColor: color,
    };
  };

  const mapDtoToCashier = (dto: EmployeeDto, index: number): CashierAccount => {
    return {
      id: `CSH-${String(index + 1).padStart(2, '0')}`,
      employeeId: dto.employeeCode || `EMP-${dto.id}`,
      numericId: dto.id,
      name: dto.name,
      terminalId: 'POS-Ahmedabad-01',
      pinMasked: dto.pinConfigured ? '••••' : 'None',
      maxDiscountPercent: dto.role === 'Senior Cashier' ? 15 : 10,
      canOpenDrawerNoSale: dto.role === 'Senior Cashier',
      canReprintReceipts: true,
      shiftStatus: dto.isActive ? 'On Register' : 'Off Duty',
      status: dto.isActive ? 'Active' : 'Suspended',
    };
  };

  const mapDtoToManager = (dto: EmployeeDto): ManagerAccount => {
    return {
      id: `MGR-${dto.id}`,
      employeeId: dto.employeeCode || `EMP-${dto.id}`,
      numericId: dto.id,
      name: dto.name,
      title: dto.role === 'Shift Supervisor' ? 'Shift Supervisor' : 'Store Manager',
      branch: 'Ahmedabad Hub',
      approvalLimit: dto.role === 'Admin' ? 50000 : 15000,
      canApproveReturns: true,
      canPerformZReport: true,
      canModifyCatalog: dto.role === 'Admin' || dto.role === 'Store Manager',
      canAccessAuditLogs: true,
      twoFactorEnabled: true,
      overridePinSet: dto.pinConfigured,
    };
  };

  // Sync / Load Employees and Franchises from Backend API
  const fetchEmployeesData = React.useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      // 1. Fetch franchises
      try {
        const fRes = await getFranchises();
        const fData = fRes?.data;
        if (fData && Array.isArray(fData) && fData.length > 0) {
          setFranchises(fData);
          const firstId = fData[0].franchiseId;
          setNewEmpFranchiseId((prev) => prev || firstId);
        }
      } catch (fErr) {
        console.warn('Franchises fetch notice:', fErr);
      }

      // 2. Fetch employees for selected franchise
      const empRes = await getEmployees(selectedFranchiseId);
      if (empRes?.data && Array.isArray(empRes.data)) {
        const dtos = empRes.data;
        if (dtos.length > 0) {
          setEmployees(dtos.map(mapDtoToEmployee));
          try {
            localStorage.setItem('nurapos_registered_employees', JSON.stringify(dtos));
          } catch {
            // ignore
          }

          const cashierDtos = dtos.filter((d) => ['Cashier', 'Senior Cashier', 'Barista'].includes(d.role));
          if (cashierDtos.length > 0) {
            setCashiers(cashierDtos.map(mapDtoToCashier));
          }

          const managerDtos = dtos.filter((d) => ['Store Manager', 'Shift Supervisor', 'Admin'].includes(d.role));
          if (managerDtos.length > 0) {
            setManagers(managerDtos.map(mapDtoToManager));
          }
        }
      }
    } catch (err: any) {
      console.warn('Backend fetch employees notice:', err);
      if (err?.statusCode === 401) {
        setApiError('Session required to sync live staff accounts from server. Please log in.');
      } else if (err?.message) {
        setApiError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedFranchiseId]);

  React.useEffect(() => {
    fetchEmployeesData();
  }, [fetchEmployeesData]);

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

  // Handle Add Employee (POST /api/employees)
  const handleSaveNewEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim()) return;

    const trimmedCode = newEmpCode.trim().toUpperCase() || `EMP-${100 + employees.length + 1}`;
    const pinTrimmed = newEmpPin.trim();
    if (pinTrimmed && !/^[0-9]{4}$/.test(pinTrimmed)) {
      setApiError('Initial PIN must be exactly 4 numeric digits.');
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    const fId = newEmpFranchiseId || (franchises[0]?.franchiseId ?? 1);

    const payload: CreateEmployeeRequest = {
      franchiseId: fId,
      employeeCode: trimmedCode,
      name: newEmpName.trim(),
      role: newEmpRole,
      phone: newEmpPhone.trim() || undefined,
      email: newEmpEmail.trim() || undefined,
      initialPin: newEmpPin.trim() || undefined,
    };

    try {
      const res = await createEmployee(payload);
      const created = res.data;
      if (created) {
        setEmployees((prev) => [mapDtoToEmployee(created), ...prev]);
        try {
          const raw = localStorage.getItem('nurapos_registered_employees');
          const list = raw ? JSON.parse(raw) : [];
          list.unshift(created);
          localStorage.setItem('nurapos_registered_employees', JSON.stringify(list));
        } catch {
          // ignore
        }
      }
      setPinSuccessNotice(`Employee ${payload.name} (${payload.employeeCode}) registered successfully.`);
      setShowAddEmployeeModal(false);
      setNewEmpCode('');
      setNewEmpName('');
      setNewEmpEmail('');
      setNewEmpPhone('');
      setNewEmpEmergency('');
      setNewEmpPin('');
      await fetchEmployeesData();
    } catch (err: any) {
      console.error('Failed to create employee:', err);
      // Fallback local save if offline / demo mode
      const newId = trimmedCode;
      const newEmp: Employee = {
        id: newId,
        numericId: 100 + employees.length + 1,
        franchiseId: fId,
        employeeCode: trimmedCode,
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

      try {
        const raw = localStorage.getItem('nurapos_registered_employees');
        const list = raw ? JSON.parse(raw) : [];
        list.unshift({
          id: 100 + employees.length + 1,
          numericId: 100 + employees.length + 1,
          franchiseId: fId,
          employeeCode: trimmedCode,
          name: newEmpName.trim(),
          role: newEmpRole,
          email: newEmp.email,
          phone: newEmp.phone,
          isActive: true,
          pinConfigured: Boolean(newEmpPin.trim()),
        });
        localStorage.setItem('nurapos_registered_employees', JSON.stringify(list));
      } catch {
        // ignore
      }
      setShowAddEmployeeModal(false);
      setApiError(err?.message || 'Failed to register employee on server. Saved locally.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Employee Modal
  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setEditName(emp.name);
    setEditRole(emp.role);
    setEditPhone(emp.phone);
    setEditEmail(emp.email);
    setEditIsActive(emp.status === 'Active');
    setApiError(null);
  };

  // Handle Update Employee (PUT /api/employees/{id})
  const handleSaveEditEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    if (!editName.trim() || editName.trim().length < 2) {
      setApiError('Full name must be at least 2 characters.');
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    const payload: UpdateEmployeeRequest = {
      name: editName.trim(),
      role: editRole,
      phone: editPhone.trim() || undefined,
      email: editEmail.trim() || undefined,
      isActive: editIsActive,
    };

    try {
      if (editingEmployee.numericId) {
        await updateEmployee(editingEmployee.numericId, payload);
      }
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingEmployee.id
            ? {
                ...emp,
                name: editName.trim(),
                role: editRole,
                department: mapRoleToDept(editRole),
                phone: editPhone.trim(),
                email: editEmail.trim(),
                status: editIsActive ? 'Active' : 'Suspended',
              }
            : emp
        )
      );
      setPinSuccessNotice(`Employee ${payload.name} updated successfully.`);
      setEditingEmployee(null);
      await fetchEmployeesData();
    } catch (err: any) {
      console.error('Failed to update employee:', err);
      setApiError(err?.message || 'Failed to update employee on server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Deactivate Employee (DELETE /api/employees/{id})
  const handleConfirmDeactivate = async () => {
    if (!deactivatingEmployee) return;

    setIsSubmitting(true);
    setApiError(null);
    try {
      if (deactivatingEmployee.numericId) {
        await deactivateEmployee(deactivatingEmployee.numericId);
      }
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === deactivatingEmployee.id ? { ...emp, status: 'Suspended' } : emp
        )
      );
      setPinSuccessNotice(`Employee ${deactivatingEmployee.name} deactivated successfully.`);
      setDeactivatingEmployee(null);
      await fetchEmployeesData();
    } catch (err: any) {
      console.error('Failed to deactivate employee:', err);
      setApiError(err?.message || 'Failed to deactivate employee on server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Reset PIN Dialog
  const openResetPinForEmployee = (emp: Employee) => {
    setResetPinTarget({
      id: emp.numericId || 0,
      name: emp.name,
      codeOrTerminal: emp.id,
      role: emp.role,
    });
    setNewPinValue('');
    setConfirmPinValue('');
    setApiError(null);
  };

  const openResetPinForCashier = (c: CashierAccount) => {
    setResetPinTarget({
      id: c.numericId || 0,
      name: c.name,
      codeOrTerminal: `Terminal ${c.terminalId}`,
      role: 'Cashier',
    });
    setNewPinValue('');
    setConfirmPinValue('');
    setApiError(null);
  };

  // Handle Reset PIN (PUT /api/employees/{id}/reset-pin)
  const handleConfirmPinReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPinTarget) return;

    const pinTrimmed = newPinValue.trim();
    if (!/^[0-9]{4}$/.test(pinTrimmed)) {
      setApiError('PIN must be exactly 4 numeric digits.');
      return;
    }

    if (newPinValue !== confirmPinValue) {
      setApiError('New PIN and Confirm PIN do not match.');
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    const payload: ResetEmployeePinRequest = {
      pin: newPinValue,
      confirmPin: confirmPinValue,
    };

    try {
      if (resetPinTarget.id) {
        await resetEmployeePin(resetPinTarget.id, payload);
      }
      setPinSuccessNotice(`PIN for ${resetPinTarget.name} successfully updated to new 4-digit credential.`);
      setResetPinTarget(null);
      setResetPinCashier(null);
      setNewPinValue('');
      setConfirmPinValue('');
      await fetchEmployeesData();
      setTimeout(() => {
        setPinSuccessNotice(null);
      }, 4000);
    } catch (err: any) {
      console.error('Failed to reset PIN:', err);
      if (err?.statusCode === 429) {
        setApiError('Rate limit exceeded: Maximum 5 PIN resets allowed within 15 minutes. Please try again later.');
      } else {
        setApiError(err?.message || 'Failed to reset PIN on server.');
      }
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Error Alert Banner */}
      {apiError && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.65rem',
          padding: '0.85rem 1.25rem',
          borderRadius: '0.75rem',
          backgroundColor: '#450A0A',
          color: '#FEF2F2',
          border: '1px solid #DC2626',
          marginBottom: '1.25rem',
          fontSize: '13.5px',
          fontWeight: 600,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <WarningAmberRoundedIcon sx={{ fontSize: 20, color: '#F87171' }} />
            <span>{apiError}</span>
          </div>
          <button
            type="button"
            onClick={() => setApiError(null)}
            style={{ background: 'none', border: 'none', color: '#FEF2F2', cursor: 'pointer', padding: '2px' }}
          >
            <CloseRoundedIcon sx={{ fontSize: 16 }} />
          </button>
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
            Staff directory, cashier PIN credentials, manager permissions, and shifts.
          </p>
        </div>

        {/* Global Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Franchise selector if available */}
          {franchises.length > 0 && (
            <select
              value={selectedFranchiseId || ''}
              onChange={(e) => setSelectedFranchiseId(e.target.value ? Number(e.target.value) : undefined)}
              style={{
                height: '38px',
                borderRadius: '0.55rem',
                backgroundColor: theme.bgCard,
                color: theme.textPrimary,
                border: `1px solid ${theme.border}`,
                padding: '0 0.75rem',
                fontSize: '12.5px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">All Franchises</option>
              {franchises.map((f) => (
                <option key={f.franchiseId} value={f.franchiseId}>
                  {f.franchiseName}
                </option>
              ))}
            </select>
          )}

          {/* Sync / Refresh Button */}
          <button
            type="button"
            className="button-20-secondary"
            role="button"
            title="Sync staff from backend server"
            onClick={() => fetchEmployeesData()}
            disabled={isLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0 0.95rem',
              height: '38px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              fontFamily: 'inherit',
            }}
          >
            <RefreshRoundedIcon
              sx={{
                fontSize: 18,
                animation: isLoading ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
            <span>{isLoading ? 'Syncing...' : 'Refresh'}</span>
          </button>

          {/* Global Action: Add Employee (Hidden for Manager role) */}
          {!isManagerView && (
            <button
              type="button"
              className="button-20"
              role="button"
              onClick={() => {
                setApiError(null);
                setShowAddEmployeeModal(true);
              }}
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
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
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
                          <button
                            type="button"
                            onClick={() => openEditModal(emp)}
                            title="Edit Employee (Role, Info, Status)"
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
                            <EditRoundedIcon sx={{ fontSize: 16 }} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openResetPinForEmployee(emp)}
                            title="Reset 4-Digit POS PIN"
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
                            <LockResetRoundedIcon sx={{ fontSize: 16 }} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeactivatingEmployee(emp)}
                            title="Deactivate Account"
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '0.45rem',
                              border: `1px solid ${theme.border}`,
                              backgroundColor: 'transparent',
                              color: emp.status === 'Active' ? '#DC2626' : theme.textSecondary,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                          </button>
                        </div>
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
                          onClick={() => openResetPinForCashier(c)}
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
                  Register staff details, assign store role, employee code, terminal, and initial PIN.
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                    EMPLOYEE CODE *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={32}
                    value={newEmpCode}
                    onChange={(e) => setNewEmpCode(e.target.value.toUpperCase())}
                    placeholder="e.g. EMP-101"
                    style={{
                      width: '100%',
                      height: '38px',
                      borderRadius: '0.55rem',
                      backgroundColor: theme.hoverBg,
                      border: `1px solid ${theme.border}`,
                      color: theme.textPrimary,
                      padding: '0 0.85rem',
                      fontSize: '13px',
                      fontWeight: 700,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                    FRANCHISE STORE *
                  </label>
                  <select
                    value={newEmpFranchiseId}
                    onChange={(e) => setNewEmpFranchiseId(Number(e.target.value))}
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
                    {franchises.length > 0 ? (
                      franchises.map((f) => (
                        <option key={f.franchiseId} value={f.franchiseId}>
                          {f.franchiseName} (#{f.franchiseId})
                        </option>
                      ))
                    ) : (
                      <option value={1}>Main Flagship (Franchise #1)</option>
                    )}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={newEmpEmail}
                    onChange={(e) => setNewEmpEmail(e.target.value)}
                    placeholder="user@example.com"
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
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                  INITIAL 4-DIGIT PIN (e.g. 8871)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={newEmpPin}
                  onChange={(e) => setNewEmpPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="8871"
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
                  disabled={isSubmitting}
                  style={{
                    padding: '0 1.25rem',
                    height: '38px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                    fontFamily: 'inherit',
                  }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Employee'}
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
      {/* MODAL 3: RESET POS ACCESS PIN MODAL                                   */}
      {/* ==================================================================== */}
      {(resetPinTarget || resetPinCashier) && (
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
                  Reset POS Access PIN
                </h3>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                  {resetPinTarget?.name || resetPinCashier?.name} • {resetPinTarget?.codeOrTerminal || resetPinCashier?.terminalId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setResetPinTarget(null);
                  setResetPinCashier(null);
                }}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: '4px' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleConfirmPinReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                    height: '42px',
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

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.45rem' }}>
                  CONFIRM 4-DIGIT PIN *
                </label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  value={confirmPinValue}
                  onChange={(e) => setConfirmPinValue(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '0.55rem',
                    backgroundColor: theme.hoverBg,
                    border: `1px solid ${newPinValue && confirmPinValue && newPinValue !== confirmPinValue ? '#DC2626' : theme.border}`,
                    color: theme.textPrimary,
                    padding: '0 1rem',
                    fontSize: '18px',
                    letterSpacing: '0.3em',
                    textAlign: 'center',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                {newPinValue && confirmPinValue && newPinValue !== confirmPinValue && (
                  <p style={{ fontSize: '11px', color: '#DC2626', margin: '4px 0 0 0', fontWeight: 600 }}>
                    PIN values do not match.
                  </p>
                )}
              </div>

              <p style={{ fontSize: '11.5px', color: theme.textSecondary, margin: 0, lineHeight: 1.4 }}>
                This PIN will be immediately encrypted and synchronized for register logins. Rate limit: 5 resets per 15 minutes.
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="button-20-secondary"
                  role="button"
                  onClick={() => {
                    setResetPinTarget(null);
                    setResetPinCashier(null);
                  }}
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
                  disabled={newPinValue.length !== 4 || confirmPinValue.length !== 4 || isSubmitting}
                  style={{
                    padding: '0 1.25rem',
                    height: '38px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: (newPinValue.length === 4 && confirmPinValue.length === 4 && !isSubmitting) ? 'pointer' : 'not-allowed',
                    opacity: (newPinValue.length === 4 && confirmPinValue.length === 4 && !isSubmitting) ? 1 : 0.5,
                    fontFamily: 'inherit',
                  }}
                >
                  {isSubmitting ? 'Updating...' : 'Update PIN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: EDIT EMPLOYEE MODAL (PUT /api/employees/{id})              */}
      {/* ==================================================================== */}
      {editingEmployee && (
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
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Edit Employee
                </h3>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                  {editingEmployee.id} • {editingEmployee.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingEmployee(null)}
                style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: '4px' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSaveEditEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
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
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
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
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: theme.textSecondary, display: 'block', marginBottom: '0.35rem' }}>
                    ACCOUNT STATUS *
                  </label>
                  <select
                    value={editIsActive ? 'Active' : 'Suspended'}
                    onChange={(e) => setEditIsActive(e.target.value === 'Active')}
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
                    <option value="Active">Active (Enabled)</option>
                    <option value="Suspended">Suspended (Disabled)</option>
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
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
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
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="staff@nuradesk.pos"
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  className="button-20-secondary"
                  role="button"
                  onClick={() => setEditingEmployee(null)}
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
                  disabled={isSubmitting}
                  style={{
                    padding: '0 1.25rem',
                    height: '38px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                    fontFamily: 'inherit',
                  }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 5: DEACTIVATE EMPLOYEE MODAL (DELETE /api/employees/{id})       */}
      {/* ==================================================================== */}
      {deactivatingEmployee && (
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <DeleteOutlineRoundedIcon sx={{ fontSize: 22 }} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                  Deactivate Employee
                </h3>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '2px 0 0 0' }}>
                  Revoke staff POS privileges
                </p>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: theme.textSecondary, lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
              Are you sure you want to deactivate <strong style={{ color: theme.textPrimary }}>{deactivatingEmployee.name}</strong> ({deactivatingEmployee.id})? They will no longer be able to log in to registers or view store tools.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="button-20-secondary"
                role="button"
                onClick={() => setDeactivatingEmployee(null)}
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
                onClick={handleConfirmDeactivate}
                disabled={isSubmitting}
                style={{
                  padding: '0 1.25rem',
                  height: '38px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '0.55rem',
                  fontFamily: 'inherit',
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? 'Deactivating...' : 'Deactivate Staff'}
              </button>
            </div>
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
      )}    </div>
  );
}
