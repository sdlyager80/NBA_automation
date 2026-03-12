// ─── DXC Brand Palette ─────────────────────────────────────────────────────
export const MIDNIGHT        = '#0E1020';
export const MIDNIGHT_LIGHT  = '#161829';
export const MIDNIGHT_DARK   = '#090B15';
export const MIDNIGHT_SURFACE = '#1A1D30';

export const ROYAL      = '#004AAC';
export const ROYAL_LIGHT = '#1A5EC0';
export const ROYAL_DARK  = '#003A88';

export const TRUE_BLUE      = '#4995FF';
export const TRUE_BLUE_DARK = '#2F7AE8';
export const TRUE_BLUE_LIGHT = '#EBF3FF';

export const GOLD  = '#FFAE41';
export const PEACH = '#FFC982';
export const SKY   = '#A1E6FF';
export const MELON = '#FF7E51';

// ─── Light Theme Surfaces ───────────────────────────────────────────────────
export const BG_PAGE    = '#F4F6FA';   // page background
export const BG_CARD    = '#FFFFFF';   // card / paper
export const BG_SUBTLE  = '#F8F9FC';   // striped row, input bg

export const BORDER       = '#E2E8F2';
export const BORDER_LIGHT = '#EEF1F8';

export const TEXT_PRIMARY   = '#0E1020';
export const TEXT_SECONDARY = '#64748B';
export const TEXT_MUTED     = '#94A3B8';

export const SUCCESS = '#16A34A';
export const WARNING = '#D97706';
export const ERROR   = '#DC2626';
export const INFO    = ROYAL;

// ─── Legacy aliases (keeps existing component imports working) ───────────────
export const NAVY         = MIDNIGHT;
export const NAVY_LIGHT   = MIDNIGHT_LIGHT;
export const NAVY_DARK    = MIDNIGHT_DARK;
export const NAVY_SURFACE = MIDNIGHT_SURFACE;
export const CYAN         = TRUE_BLUE;
export const CYAN_DARK    = TRUE_BLUE_DARK;
export const CYAN_LIGHT   = '#6AAAFF';

// ─── Status Badge Colors (light-mode pastel) ────────────────────────────────
export const STATUS_COLORS = {
  draft:            { bg: '#F1F5F9', text: '#64748B', border: '#CBD5E1' },
  submitted:        { bg: '#EBF3FF', text: '#004AAC', border: '#BFDBFE' },
  pending_review:   { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
  pending_payment:  { bg: '#FFF7ED', text: '#C2410C', border: '#FDBA74' },
  approved:         { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
  issued:           { bg: '#F0FDF4', text: '#15803D', border: '#86EFAC' },
  declined:         { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
  withdrawn:        { bg: '#F8FAFC', text: '#94A3B8', border: '#E2E8F0' },
  lapsed:           { bg: '#FFF5F0', text: '#C2410C', border: '#FDBA74' },
  active:           { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
  nigo:             { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
};
