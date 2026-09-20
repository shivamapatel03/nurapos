export type ThemeId = 'macos' | 'bw_dark' | 'bw_light' | 'blue_white' | 'classic_pos';

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

export const APP_THEMES: Record<ThemeId, AppTheme> = {
  macos: {
    id: 'macos',
    name: 'macOS Light',
    tag: 'Apple Cupertino',
    description: 'Clean Cupertino aesthetic with vibrant blue accents & crisp neutral surfaces',
    swatch: {
      page: '#F5F5F7',
      sidebar: '#FFFFFF',
      card: '#FFFFFF',
      primary: '#007AFF',
      text: '#1D1D1F',
    },
    swatchColors: ['#F5F5F7', '#FFFFFF', '#007AFF', '#1D1D1F'],
    bgPage: '#F5F5F7',
    bgSidebar: '#FFFFFF',
    sidebarIsDark: false,
    sidebarTextPrimary: '#1D1D1F',
    sidebarTextSecondary: '#86868B',
    sidebarHoverBg: '#F2F2F7',
    sidebarBorder: '#E5E5EA',
    bgHeader: '#FFFFFF',
    headerIsDark: false,
    headerTextPrimary: '#1D1D1F',
    headerBorder: '#E5E5EA',
    bgCard: '#FFFFFF',
    bgCardHover: '#F8F8FA',
    bgCardSubtle: '#F2F2F7',
    border: '#E5E5EA',
    borderCard: '#E5E5EA',
    borderHover: '#007AFF',
    textPrimary: '#1D1D1F',
    textSecondary: '#86868B',
    textMuted: '#AEAEB2',
    hoverBg: '#EFEFF4',
    activeBg: '#007AFF',
    activeText: '#FFFFFF',
    activeIcon: '#FFFFFF',
    badgeBg: '#007AFF',
    badgeText: '#FFFFFF',
    badgeBorder: '#007AFF',
    secondaryBadgeBg: '#E5E5EA',
    secondaryBadgeText: '#1D1D1F',
    secondaryBadgeBorder: '#D1D1D6',
    barDefault: '#D1D1D6',
    barActive: '#007AFF',
    barHover: '#0051A8',
    tableHeaderBg: '#F5F5F7',
    tableRowHover: '#F9F9FB',
    posBtnBg: '#007AFF',
    posBtnText: '#FFFFFF',
    posBtnBorder: '#007AFF',
    posBtnShadow: '#0051A8',
    livePosBg: '#E5E5EA',
    livePosBorder: '#D1D1D6',
    livePosText: '#1D1D1F',
    popoverBg: '#FFFFFF',
    popoverBorder: '#E5E5EA',
  },
  bw_dark: {
    id: 'bw_dark',
    name: 'B&W Dark',
    tag: 'OLED Charcoal',
    description: 'Deep pitch black surfaces, graphite borders & high-contrast crisp white typography',
    swatch: {
      page: '#000000',
      sidebar: '#0A0A0A',
      card: '#141414',
      primary: '#FFFFFF',
      text: '#FFFFFF',
    },
    swatchColors: ['#000000', '#141414', '#262626', '#FFFFFF'],
    bgPage: '#000000',
    bgSidebar: '#0A0A0A',
    sidebarIsDark: true,
    sidebarTextPrimary: '#FFFFFF',
    sidebarTextSecondary: '#A1A1AA',
    sidebarHoverBg: '#18181B',
    sidebarBorder: '#262626',
    bgHeader: '#0A0A0A',
    headerIsDark: true,
    headerTextPrimary: '#FFFFFF',
    headerBorder: '#262626',
    bgCard: '#141414',
    bgCardHover: '#1C1C1E',
    bgCardSubtle: '#18181B',
    border: '#262626',
    borderCard: '#262626',
    borderHover: '#52525B',
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    hoverBg: '#1F1F23',
    activeBg: '#FFFFFF',
    activeText: '#000000',
    activeIcon: '#000000',
    badgeBg: '#FFFFFF',
    badgeText: '#000000',
    badgeBorder: '#FFFFFF',
    secondaryBadgeBg: '#262626',
    secondaryBadgeText: '#FFFFFF',
    secondaryBadgeBorder: '#3F3F46',
    barDefault: '#3F3F46',
    barActive: '#FFFFFF',
    barHover: '#E4E4E7',
    tableHeaderBg: '#18181B',
    tableRowHover: '#1C1C1E',
    posBtnBg: '#FFFFFF',
    posBtnText: '#000000',
    posBtnBorder: '#FFFFFF',
    posBtnShadow: '#52525B',
    livePosBg: '#262626',
    livePosBorder: '#3F3F46',
    livePosText: '#FFFFFF',
    popoverBg: '#141414',
    popoverBorder: '#262626',
  },
  bw_light: {
    id: 'bw_light',
    name: 'B&W Light (Salt & Pepper)',
    tag: 'Monochrome Classic',
    description: 'Minimalist monochromatic aesthetic with platinum cards and carbon charcoal accents',
    swatch: {
      page: '#FFFFFF',
      sidebar: '#FFFFFF',
      card: '#F5F5F7',
      primary: '#2B2B2B',
      text: '#2B2B2B',
    },
    swatchColors: ['#FFFFFF', '#F5F5F7', '#D4D4D4', '#2B2B2B'],
    bgPage: '#FFFFFF',
    bgSidebar: '#FFFFFF',
    sidebarIsDark: false,
    sidebarTextPrimary: '#2B2B2B',
    sidebarTextSecondary: '#71717A',
    sidebarHoverBg: '#F0F0F0',
    sidebarBorder: '#D4D4D4',
    bgHeader: '#FFFFFF',
    headerIsDark: false,
    headerTextPrimary: '#2B2B2B',
    headerBorder: '#D4D4D4',
    bgCard: '#F5F5F7',
    bgCardHover: '#EBEBED',
    bgCardSubtle: '#F0F0F0',
    border: '#D4D4D4',
    borderCard: '#D4D4D4',
    borderHover: '#2B2B2B',
    textPrimary: '#2B2B2B',
    textSecondary: '#71717A',
    textMuted: '#B3B3B3',
    hoverBg: '#F0F0F0',
    activeBg: '#2B2B2B',
    activeText: '#FFFFFF',
    activeIcon: '#FFFFFF',
    badgeBg: '#2B2B2B',
    badgeText: '#FFFFFF',
    badgeBorder: '#2B2B2B',
    secondaryBadgeBg: '#D4D4D4',
    secondaryBadgeText: '#2B2B2B',
    secondaryBadgeBorder: '#D4D4D4',
    barDefault: '#B3B3B3',
    barActive: '#2B2B2B',
    barHover: '#18181B',
    tableHeaderBg: '#F5F5F7',
    tableRowHover: '#FAFAFA',
    posBtnBg: '#2B2B2B',
    posBtnText: '#FFFFFF',
    posBtnBorder: '#2B2B2B',
    posBtnShadow: '#D4D4D4',
    livePosBg: '#D4D4D4',
    livePosBorder: '#D4D4D4',
    livePosText: '#2B2B2B',
    popoverBg: '#FFFFFF',
    popoverBorder: '#D4D4D4',
  },
  blue_white: {
    id: 'blue_white',
    name: 'Blue & White',
    tag: 'Corporate Modern',
    description: 'Crisp royal blue brand accents with fresh ice-tinted background highlights',
    swatch: {
      page: '#F4F8FC',
      sidebar: '#FFFFFF',
      card: '#FFFFFF',
      primary: '#2563EB',
      text: '#111827',
    },
    swatchColors: ['#F4F8FC', '#FFFFFF', '#DBEAFE', '#2563EB'],
    bgPage: '#F4F8FC',
    bgSidebar: '#FFFFFF',
    sidebarIsDark: false,
    sidebarTextPrimary: '#111827',
    sidebarTextSecondary: '#4B5563',
    sidebarHoverBg: '#F0F7FF',
    sidebarBorder: '#DBEAFE',
    bgHeader: '#FFFFFF',
    headerIsDark: false,
    headerTextPrimary: '#111827',
    headerBorder: '#DBEAFE',
    bgCard: '#FFFFFF',
    bgCardHover: '#F0F7FF',
    bgCardSubtle: '#EFF6FF',
    border: '#DBEAFE',
    borderCard: '#DBEAFE',
    borderHover: '#2563EB',
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#9CA3AF',
    hoverBg: '#F0F7FF',
    activeBg: '#2563EB',
    activeText: '#FFFFFF',
    activeIcon: '#FFFFFF',
    badgeBg: '#2563EB',
    badgeText: '#FFFFFF',
    badgeBorder: '#2563EB',
    secondaryBadgeBg: '#DBEAFE',
    secondaryBadgeText: '#1E40AF',
    secondaryBadgeBorder: '#BFDBFE',
    barDefault: '#BFDBFE',
    barActive: '#2563EB',
    barHover: '#1D4ED8',
    tableHeaderBg: '#EFF6FF',
    tableRowHover: '#F8FAFC',
    posBtnBg: '#2563EB',
    posBtnText: '#FFFFFF',
    posBtnBorder: '#2563EB',
    posBtnShadow: '#1D4ED8',
    livePosBg: '#DBEAFE',
    livePosBorder: '#BFDBFE',
    livePosText: '#1E40AF',
    popoverBg: '#FFFFFF',
    popoverBorder: '#DBEAFE',
  },
  classic_pos: {
    id: 'classic_pos',
    name: 'Classic POS',
    tag: 'Enterprise Dual',
    description: 'Command-center dark charcoal sidebar paired with a high-efficiency light workspace',
    swatch: {
      page: '#F3F4F6',
      sidebar: '#1F2937',
      card: '#FFFFFF',
      primary: '#2563EB',
      text: '#111827',
    },
    swatchColors: ['#1F2937', '#F3F4F6', '#FFFFFF', '#2563EB'],
    bgPage: '#F3F4F6',
    bgSidebar: '#1F2937',
    sidebarIsDark: true,
    sidebarTextPrimary: '#F9FAFB',
    sidebarTextSecondary: '#9CA3AF',
    sidebarHoverBg: '#374151',
    sidebarBorder: '#374151',
    bgHeader: '#FFFFFF',
    headerIsDark: false,
    headerTextPrimary: '#111827',
    headerBorder: '#E5E7EB',
    bgCard: '#FFFFFF',
    bgCardHover: '#F9FAFB',
    bgCardSubtle: '#F9FAFB',
    border: '#E5E7EB',
    borderCard: '#E5E7EB',
    borderHover: '#2563EB',
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#9CA3AF',
    hoverBg: '#F3F4F6',
    activeBg: '#2563EB',
    activeText: '#FFFFFF',
    activeIcon: '#FFFFFF',
    badgeBg: '#2563EB',
    badgeText: '#FFFFFF',
    badgeBorder: '#2563EB',
    secondaryBadgeBg: '#E5E7EB',
    secondaryBadgeText: '#1F2937',
    secondaryBadgeBorder: '#D1D5DB',
    barDefault: '#D1D5DB',
    barActive: '#2563EB',
    barHover: '#1D4ED8',
    tableHeaderBg: '#F9FAFB',
    tableRowHover: '#F3F4F6',
    posBtnBg: '#2563EB',
    posBtnText: '#FFFFFF',
    posBtnBorder: '#2563EB',
    posBtnShadow: '#1D4ED8',
    livePosBg: '#E5E7EB',
    livePosBorder: '#D1D5DB',
    livePosText: '#1F2937',
    popoverBg: '#FFFFFF',
    popoverBorder: '#E5E7EB',
  },
};
