'use client';

import React from 'react';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import PauseCircleRoundedIcon from '@mui/icons-material/PauseCircleRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';

export interface ActionIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

/**
 * 1. Cash Register (New sale) - Material Rounded
 */
export function ActionCashRegisterIcon({
  size = 24,
  className,
  style,
}: ActionIconProps) {
  return (
    <PointOfSaleRoundedIcon
      className={className}
      style={{
        fontSize: `${size}px`,
        display: 'block',
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

/**
 * 2. Pause Inside Circle (Held sales) - Material Rounded
 */
export function ActionHeldSalesIcon({
  size = 24,
  className,
  style,
}: ActionIconProps) {
  return (
    <PauseCircleRoundedIcon
      className={className}
      style={{
        fontSize: `${size}px`,
        display: 'block',
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

/**
 * 3. Receipt (Invoices) - Material Rounded
 */
export function ActionInvoicesIcon({
  size = 24,
  className,
  style,
}: ActionIconProps) {
  return (
    <ReceiptLongRoundedIcon
      className={className}
      style={{
        fontSize: `${size}px`,
        display: 'block',
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

/**
 * 4. Multiple Users (Customers) - Material Rounded
 */
export function ActionCustomersIcon({
  size = 24,
  className,
  style,
}: ActionIconProps) {
  return (
    <PeopleAltRoundedIcon
      className={className}
      style={{
        fontSize: `${size}px`,
        display: 'block',
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

/**
 * 5. Clock (End shift) - Material Rounded
 */
export function ActionEndShiftIcon({
  size = 24,
  className,
  style,
}: ActionIconProps) {
  return (
    <ScheduleRoundedIcon
      className={className}
      style={{
        fontSize: `${size}px`,
        display: 'block',
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

/**
 * 6. Dark / Light Mode - Material Rounded
 */
export function ActionDarkModeIcon({
  size = 24,
  isDarkMode = false,
  className,
  style,
}: ActionIconProps & { isDarkMode?: boolean }) {
  if (isDarkMode) {
    return (
      <LightModeRoundedIcon
        className={className}
        style={{
          fontSize: `${size}px`,
          display: 'block',
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

  return (
    <DarkModeRoundedIcon
      className={className}
      style={{
        fontSize: `${size}px`,
        display: 'block',
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

export type DuotoneIconProps = ActionIconProps;

/**
 * Interface for individual menu item definition
 */
export interface ActionMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode | number | string;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

/**
 * Props for individual AppAction tile
 */
export interface AppActionProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  badge?: React.ReactNode | number | string;
  onClick?: () => void;
  ariaLabel?: string;
  isDarkMode?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * AppAction component:
 * - Clean neutral styling without color tints
 * - Material library rounded icons
 */
export function AppAction({
  id,
  label,
  icon,
  active = false,
  disabled = false,
  badge,
  onClick,
  ariaLabel,
  isDarkMode = false,
  className,
  style,
}: AppActionProps) {
  // Clean neutral tokens without colors
  const selectedBg = isDarkMode ? 'rgba(255, 255, 255, 0.09)' : 'rgba(0, 0, 0, 0.05)';
  const textColor = isDarkMode ? '#A1A1AA' : '#52525B';
  const activeTextColor = isDarkMode ? '#FFFFFF' : '#18181B';

  return (
    <button
      type="button"
      id={`action-item-${id}`}
      aria-label={ariaLabel || label}
      aria-pressed={active}
      disabled={disabled}
      onClick={() => {
        if (!disabled && onClick) {
          onClick();
        }
      }}
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 8px 8px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: active ? (isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)') : 'transparent',
        color: active ? activeTextColor : textColor,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        fontFamily: "var(--font-heading, 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif)",
        outline: 'none',
        userSelect: 'none',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        ...style,
      }}
    >
      {/* Icon Area with neutral badge */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '26px',
          height: '26px',
          color: 'currentColor',
        }}
      >
        {icon}
        {badge !== undefined && badge !== null && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-8px',
              minWidth: '16px',
              height: '16px',
              borderRadius: '9999px',
              backgroundColor: isDarkMode ? '#3F3F46' : '#18181B',
              color: '#FFFFFF',
              fontSize: '10px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              lineHeight: 1,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Label directly below icon */}
      <span
        style={{
          marginTop: '8px',
          fontSize: '13px',
          fontWeight: active ? 700 : 500,
          color: 'inherit',
          letterSpacing: '-0.01em',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          lineHeight: 1.25,
        }}
      >
        {label}
      </span>
    </button>
  );
}

/**
 * Props for ActionMenu component
 */
export interface ActionMenuProps {
  items: ActionMenuItem[];
  activeItem?: string;
  onSelectItem?: (id: string) => void;
  isDarkMode?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ActionMenu:
 * - 3 equal-width columns × 2 rows grid
 * - Uses Material Rounded icons with neutral/monochrome styling
 */
export function ActionMenu({
  items,
  activeItem,
  onSelectItem,
  isDarkMode = false,
  className,
  style,
}: ActionMenuProps) {
  // Default fallback Material Rounded icons if item doesn't provide its own
  const getDefaultIcon = (id: string) => {
    switch (id) {
      case 'new-sale':
      case 'new_sale':
        return <PointOfSaleRoundedIcon style={{ fontSize: 24 }} />;
      case 'held-sales':
      case 'held_sales':
        return <PauseCircleRoundedIcon style={{ fontSize: 24 }} />;
      case 'invoices':
        return <ReceiptLongRoundedIcon style={{ fontSize: 24 }} />;
      case 'customers':
        return <PeopleAltRoundedIcon style={{ fontSize: 24 }} />;
      case 'end-shift':
      case 'end_shift':
        return <ScheduleRoundedIcon style={{ fontSize: 24 }} />;
      case 'dark-mode':
      case 'dark_mode':
        return isDarkMode ? (
          <LightModeRoundedIcon style={{ fontSize: 24 }} />
        ) : (
          <DarkModeRoundedIcon style={{ fontSize: 24 }} />
        );
      default:
        return <PointOfSaleRoundedIcon style={{ fontSize: 24 }} />;
    }
  };

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        columnGap: '8px',
        rowGap: '10px',
        width: '100%',
        boxSizing: 'border-box',
        alignItems: 'stretch',
        ...style,
      }}
    >
      {items.map((item) => {
        const isActive = activeItem === item.id;
        const icon = item.icon || getDefaultIcon(item.id);

        return (
          <AppAction
            key={item.id}
            id={item.id}
            label={item.label}
            icon={icon}
            active={isActive}
            disabled={item.disabled}
            badge={item.badge}
            ariaLabel={item.ariaLabel}
            isDarkMode={isDarkMode}
            onClick={() => {
              if (item.onClick) {
                item.onClick();
              }
              if (onSelectItem) {
                onSelectItem(item.id);
              }
            }}
          />
        );
      })}
    </div>
  );
}

export default ActionMenu;
