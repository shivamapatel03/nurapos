export type ThemeMode = 'light' | 'dark';
export type ThemeId = 'light' | 'dark' | 'macos' | 'bw_dark' | 'bw_light' | 'blue_white' | 'classic_pos';

export interface ThemeSwatch {
  page: string;
  sidebar: string;
  card: string;
  primary: string;
  text: string;
}

export interface AppTheme {
  id: ThemeId;
  name: string;
  tag: string;
  description: string;
  swatch: ThemeSwatch;
  swatchColors: string[];
  // Surfaces
  bgPage: string;
  bgSidebar: string;
  sidebarIsDark: boolean;
  sidebarTextPrimary: string;
  sidebarTextSecondary: string;
  sidebarHoverBg: string;
  sidebarBorder: string;
  sidebarActiveBg: string;
  sidebarActiveText: string;
  sidebarActiveBorder: string;
  bgHeader: string;
  headerIsDark: boolean;
  headerTextPrimary: string;
  headerBorder: string;
  bgCard: string;
  bgCardHover: string;
  bgCardSubtle: string;
  // Borders
  border: string;
  borderCard: string;
  borderHover: string;
  // Typography
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  // Interactions
  hoverBg: string;
  activeBg: string;
  activeText: string;
  activeIcon: string;
  // Badges & Pills
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  secondaryBadgeBg: string;
  secondaryBadgeText: string;
  secondaryBadgeBorder: string;
  // Analytics / Charts
  barDefault: string;
  barActive: string;
  barHover: string;
  tableHeaderBg: string;
  tableRowHover: string;
  // POS CTA buttons
  posBtnBg: string;
  posBtnText: string;
  posBtnBorder: string;
  posBtnShadow: string;
  livePosBg: string;
  livePosBorder: string;
  livePosText: string;
  // Popovers & dropdowns
  popoverBg: string;
  popoverBorder: string;
}

export const LIGHT_THEME: AppTheme = {
  id: 'light',
  name: 'Light Mode',
  tag: 'Clean Minimal',
  description: 'Sidebar #fcfcfc, workspace #fafafa, and contrast button #191a19',
  swatch: {
    page: '#fafafa',
    sidebar: '#fcfcfc',
    card: '#ffffff',
    primary: '#191a19',
    text: '#191a19',
  },
  swatchColors: ['#fafafa', '#fcfcfc', '#ffffff', '#191a19'],
  bgPage: '#fafafa',
  bgSidebar: '#fcfcfc',
  sidebarIsDark: false,
  sidebarTextPrimary: '#191a19',
  sidebarTextSecondary: '#666666',
  sidebarHoverBg: '#f0f0f0',
  sidebarBorder: '#e8e8e8',
  sidebarActiveBg: '#f0f0f0',
  sidebarActiveText: '#191a19',
  sidebarActiveBorder: 'transparent',
  bgHeader: '#fcfcfc',
  headerIsDark: false,
  headerTextPrimary: '#191a19',
  headerBorder: '#e8e8e8',
  bgCard: '#ffffff',
  bgCardHover: '#f7f7f7',
  bgCardSubtle: '#f4f4f4',
  border: '#e8e8e8',
  borderCard: '#e8e8e8',
  borderHover: '#191a19',
  textPrimary: '#191a19',
  textSecondary: '#666666',
  textMuted: '#999999',
  hoverBg: '#f0f0f0',
  activeBg: '#191a19',
  activeText: '#ffffff',
  activeIcon: '#ffffff',
  badgeBg: '#191a19',
  badgeText: '#ffffff',
  badgeBorder: '#191a19',
  secondaryBadgeBg: '#f0f0f0',
  secondaryBadgeText: '#191a19',
  secondaryBadgeBorder: '#e8e8e8',
  barDefault: '#e0e0e0',
  barActive: '#191a19',
  barHover: '#333333',
  tableHeaderBg: '#f5f5f5',
  tableRowHover: '#f9f9f9',
  posBtnBg: '#191a19',
  posBtnText: '#ffffff',
  posBtnBorder: 'transparent',
  posBtnShadow: 'transparent',
  livePosBg: '#f0f0f0',
  livePosBorder: '#e8e8e8',
  livePosText: '#191a19',
  popoverBg: '#ffffff',
  popoverBorder: '#e8e8e8',
};

export const DARK_THEME: AppTheme = {
  id: 'dark',
  name: 'Dark Mode',
  tag: 'OLED Dark',
  description: 'Deep pitch charcoal surfaces, graphite borders, and crisp high-contrast white accents',
  swatch: {
    page: '#09090b',
    sidebar: '#121214',
    card: '#18181b',
    primary: '#ffffff',
    text: '#ffffff',
  },
  swatchColors: ['#09090b', '#121214', '#18181b', '#ffffff'],
  bgPage: '#09090b',
  bgSidebar: '#121214',
  sidebarIsDark: true,
  sidebarTextPrimary: '#ffffff',
  sidebarTextSecondary: '#a1a1aa',
  sidebarHoverBg: '#1e1e22',
  sidebarBorder: '#27272a',
  sidebarActiveBg: '#27272a',
  sidebarActiveText: '#ffffff',
  sidebarActiveBorder: 'transparent',
  bgHeader: '#121214',
  headerIsDark: true,
  headerTextPrimary: '#ffffff',
  headerBorder: '#27272a',
  bgCard: '#18181b',
  bgCardHover: '#222226',
  bgCardSubtle: '#1f1f23',
  border: '#27272a',
  borderCard: '#27272a',
  borderHover: '#3f3f46',
  textPrimary: '#ffffff',
  textSecondary: '#a1a1aa',
  textMuted: '#71717a',
  hoverBg: '#1e1e22',
  activeBg: '#ffffff',
  activeText: '#000000',
  activeIcon: '#000000',
  badgeBg: '#ffffff',
  badgeText: '#000000',
  badgeBorder: '#ffffff',
  secondaryBadgeBg: '#262626',
  secondaryBadgeText: '#ffffff',
  secondaryBadgeBorder: '#3f3f46',
  barDefault: '#3f3f46',
  barActive: '#ffffff',
  barHover: '#e4e4e7',
  tableHeaderBg: '#18181b',
  tableRowHover: '#1c1c1e',
  posBtnBg: '#ffffff',
  posBtnText: '#000000',
  posBtnBorder: 'transparent',
  posBtnShadow: 'transparent',
  livePosBg: '#262626',
  livePosBorder: '#3f3f46',
  livePosText: '#ffffff',
  popoverBg: '#18181b',
  popoverBorder: '#27272a',
};

export const APP_THEMES: Record<string, AppTheme> = {
  light: LIGHT_THEME,
  dark: DARK_THEME,
  // Backwards-compatibility aliases:
  bw_light: LIGHT_THEME,
  macos: LIGHT_THEME,
  blue_white: LIGHT_THEME,
  bw_dark: DARK_THEME,
  classic_pos: DARK_THEME,
};

export const THEME_STORAGE_KEY = 'nuradesk_theme_mode';

export function getStoredThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved =
      localStorage.getItem(THEME_STORAGE_KEY) ||
      localStorage.getItem('nuradesk_admin_theme') ||
      localStorage.getItem('nuradesk_pos_theme');
    if (saved === 'dark' || saved === 'bw_dark' || saved === 'classic_pos') {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
}

export function setStoredThemeMode(mode: ThemeMode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    localStorage.setItem('nuradesk_admin_theme', mode);
    localStorage.setItem('nuradesk_pos_theme', mode);
    window.dispatchEvent(new Event('nuradesk_theme_change'));
  } catch {
    // Ignore localStorage errors
  }
}
