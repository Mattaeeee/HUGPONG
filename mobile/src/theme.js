// ─── HUGPONG Design System ─────────────────────────────────────
// Inspired by enterprise habit-tracker & finance app aesthetics
// Optimised for outdoor/farm readability — high contrast, bold hierarchy
// Palette: olive · sage · forest green · warm amber · slate
// ────────────────────────────────────────────────────────────────

// ── Color Palette ──────────────────────────────────────────────
export const PALETTE = {
  // Forest greens
  forest900: '#162D0F',
  forest800: '#1E3D14',
  forest700: '#2D5A1E',
  forest600: '#3B7228',
  forest500: '#4A8A32',
  forest400: '#6BA04E',
  forest300: '#8FB870',
  forest200: '#C0D9A8',
  forest100: '#E4EED8',
  forest50:  '#F2F7EE',

  // Sage / olive
  sage500: '#5C7A4A',
  sage400: '#7A9B62',
  sage300: '#A0B888',
  sage200: '#C8D8B8',
  sage100: '#EDF2E8',

  // Amber / harvest
  amber600: '#A85E00',
  amber500: '#C97A00',
  amber400: '#E8920A',
  amber300: '#F5A623',
  amber200: '#FAC96A',
  amber100: '#FEF0D0',
  amber50:  '#FFFBF0',

  // Steel blue / info
  steel600: '#0F4C75',
  steel500: '#1A6B9A',
  steel400: '#2E86C1',
  steel300: '#5BA5D8',
  steel200: '#A8D4EF',
  steel100: '#DFF0FB',
  steel50:  '#F0F8FF',

  // Danger / crimson
  crimson600: '#8B1A1A',
  crimson500: '#B22222',
  crimson400: '#D9534F',
  crimson300: '#E87870',
  crimson100: '#FDECEA',
  crimson50:  '#FFF5F5',

  // Success
  emerald600: '#1A5C1A',
  emerald500: '#267326',
  emerald400: '#339933',
  emerald300: '#5CB85C',
  emerald100: '#E8F5E8',
  emerald50:  '#F2FBF2',

  // Neutrals
  neutral950: '#0D1008',
  neutral900: '#1A200E',
  neutral800: '#2C3422',
  neutral700: '#455038',
  neutral600: '#5E6D50',
  neutral500: '#7A8A6A',
  neutral400: '#9EAE8E',
  neutral300: '#C0CCB0',
  neutral200: '#DCE8CC',
  neutral100: '#EDF3E5',
  neutral50:  '#F7F9F4',
  white:      '#FFFFFF',
};

// ── Semantic Colors ─────────────────────────────────────────────
export const COLORS = {
  // Brand
  primary:        PALETTE.forest700,      // #2D5A1E — main green
  primaryLight:   PALETTE.forest500,      // #4A8A32 — lighter green
  primaryMuted:   PALETTE.forest400,      // #6BA04E — muted green
  primaryBg:      PALETTE.forest50,       // #F2F7EE — green tint bg
  primaryBorder:  PALETTE.forest200,      // #C0D9A8 — green border

  // Accent — harvest amber
  accent:         PALETTE.amber400,       // #E8920A
  accentLight:    PALETTE.amber300,       // #F5A623
  accentBg:       PALETTE.amber50,        // #FFFBF0

  // Status
  success:        PALETTE.emerald500,     // #267326
  successLight:   PALETTE.emerald100,     // #E8F5E8
  danger:         PALETTE.crimson400,     // #D9534F
  dangerBg:       PALETTE.crimson50,      // #FFF5F5
  warning:        PALETTE.amber400,       // #E8920A
  warningBg:      PALETTE.amber100,       // #FEF0D0
  blue:           PALETTE.steel500,       // #1A6B9A
  blueBg:         PALETTE.steel100,       // #DFF0FB
  conflict:       '#7B4FA6',              // purple — conflict state

  // Backgrounds
  background:     PALETTE.neutral50,      // #F7F9F4 — warm off-white
  surface:        PALETTE.white,          // #FFFFFF
  surfaceRaised:  PALETTE.white,
  overlay:        'rgba(22,45,15,0.5)',    // forest-tinted modal overlay

  // Typography
  text:           PALETTE.neutral900,     // #1A200E — near-black, green-tinted
  textSecondary:  PALETTE.neutral700,     // #455038 — secondary
  textMuted:      PALETTE.neutral500,     // #7A8A6A — muted/caption
  textDisabled:   PALETTE.neutral400,     // #9EAE8E — disabled
  textInverse:    PALETTE.white,

  // Borders & Dividers
  border:         PALETTE.neutral200,     // #DCE8CC
  borderStrong:   PALETTE.neutral300,     // #C0CCB0
  divider:        PALETTE.neutral100,     // #EDF3E5

  // Nav bar
  tabBar:         PALETTE.white,
  tabBarBorder:   PALETTE.neutral200,

  // Carry-forwards for backward compat
  inProgress:     PALETTE.steel500,
  inProgressBg:   PALETTE.steel100,
};

// ── Typography Scale ────────────────────────────────────────────
// Bold hierarchy for outdoor readability
export const TYPE = {
  // Display
  displayLg: { fontSize: 34, fontWeight: '800', letterSpacing: -0.8, lineHeight: 40 },
  displayMd: { fontSize: 28, fontWeight: '800', letterSpacing: -0.6, lineHeight: 34 },
  displaySm: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4, lineHeight: 28 },

  // Headings
  h1: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3, lineHeight: 26 },
  h2: { fontSize: 17, fontWeight: '700', letterSpacing: -0.2, lineHeight: 22 },
  h3: { fontSize: 15, fontWeight: '700', letterSpacing: -0.1, lineHeight: 20 },

  // Body
  bodyLg: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyMd: { fontSize: 14, fontWeight: '400', lineHeight: 22 },
  bodySm: { fontSize: 13, fontWeight: '400', lineHeight: 20 },

  // Labels & UI
  labelLg: { fontSize: 14, fontWeight: '600', letterSpacing: 0.1 },
  labelMd: { fontSize: 13, fontWeight: '600', letterSpacing: 0.1 },
  labelSm: { fontSize: 12, fontWeight: '600', letterSpacing: 0.2 },
  labelXs: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3 },

  // Caption
  caption: { fontSize: 11, fontWeight: '400', lineHeight: 16 },
  captionBold: { fontSize: 11, fontWeight: '700', lineHeight: 16 },

  // Overline / tag
  overline: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },

  // Number / Data
  dataXl: { fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  dataMd: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  dataSm: { fontSize: 18, fontWeight: '700', letterSpacing: -0.2 },
};

// Keep FONTS for backward compat
export const FONTS = {
  regular: { fontWeight: '400' },
  medium: { fontWeight: '500' },
  semiBold: { fontWeight: '600' },
  bold: { fontWeight: '700' },
  extraBold: { fontWeight: '800' },
};

// ── Spacing — 8pt Grid ──────────────────────────────────────────
export const SPACING = {
  xs:  4,   // 4px  — icon gap
  sm:  8,   // 8px  — tight padding
  md:  12,  // 12px — compact elements
  lg:  16,  // 16px — standard padding (most common)
  xl:  20,  // 20px — generous padding
  xxl: 24,  // 24px — section gap
  '3xl': 32,
  '4xl': 40,
  '5xl': 56,
};

// ── Border Radii ─────────────────────────────────────────────────
export const RADIUS = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  '2xl': 24,
  full: 999,
};

// ── Elevation / Shadow System ────────────────────────────────────
// Level 1 = resting card  Level 2 = raised  Level 3 = floating (FAB/modal)
export const SHADOW = {
  // Subtle resting state — card on background
  card: {
    shadowColor: PALETTE.forest900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  // Elevated — dropdown, active state
  raised: {
    shadowColor: PALETTE.forest900,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },
  // Floating — FAB, sheet handle, bottom nav
  float: {
    shadowColor: PALETTE.forest900,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 10,
  },
  // Modal / overlay surfaces
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
  },
};

// ── Touch / Hit-slop ─────────────────────────────────────────────
// Large targets for outdoor/gloved-hand use
export const TOUCH = {
  minHeight: 48,        // WCAG AA minimum
  minWidth: 48,
  farmSafe: 56,         // Larger for field use
  hitSlop: { top: 8, bottom: 8, left: 8, right: 8 },
};

// ── Z-Index Scale ─────────────────────────────────────────────────
export const Z = {
  base:    0,
  card:    10,
  sticky:  100,
  overlay: 200,
  modal:   300,
  toast:   400,
};

// ── Animation Configs ─────────────────────────────────────────────
export const ANIM = {
  spring: { tension: 68, friction: 12 },
  springFast: { tension: 100, friction: 14 },
  fade: { duration: 200 },
  slide: { duration: 250 },
};

// ── Shared Component Tokens ───────────────────────────────────────
// Pre-built style objects for commonly repeated patterns
export const TOKEN = {
  // Card base
  card: {
    backgroundColor: PALETTE.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...{
      shadowColor: PALETTE.forest900,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
  },

  // Pill badge
  badge: (bg, color) => ({
    backgroundColor: bg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  }),

  // Icon circle
  iconCircle: (size = 40, bg) => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: bg || PALETTE.forest50,
    justifyContent: 'center',
    alignItems: 'center',
  }),

  // Row separator
  dividerRow: {
    borderTopWidth: 1,
    borderTopColor: PALETTE.neutral100,
  },

  // Section header text
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: PALETTE.neutral900,
    marginBottom: 12,
  },
};
