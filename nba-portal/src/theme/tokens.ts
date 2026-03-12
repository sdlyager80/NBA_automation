// DXC Brand Colors
export const MIDNIGHT   = '#0E1020';   // Midnight Blue — base background
export const MIDNIGHT_LIGHT = '#161829'; // slightly lighter surface
export const MIDNIGHT_DARK  = '#090B15'; // deepest background / app bar
export const MIDNIGHT_SURFACE = '#1A1D30'; // card / panel surface

export const ROYAL      = '#004AAC';   // Royal — sidebar, panel headers
export const ROYAL_LIGHT = '#0055C4';  // hover / active state
export const ROYAL_DARK  = '#003A88';  // pressed / deep accent

export const TRUE_BLUE  = '#4995FF';   // True Blue — primary CTA / accent
export const TRUE_BLUE_DARK = '#2F7AE8'; // hover

export const GOLD       = '#FFAE41';   // Gold — warning / highlight
export const PEACH      = '#FFC982';   // Peach — soft accent / success badge
export const SKY        = '#A1E6FF';   // Sky — info tint / muted accent
export const MELON      = '#FF7E51';   // Melon — error / lapse / alert

export const BORDER       = '#1E2240';
export const BORDER_LIGHT = '#2A3060';

export const TEXT_PRIMARY   = '#FFFFFF';
export const TEXT_SECONDARY = '#A8B4D0';
export const TEXT_MUTED     = '#5C6A90';

export const SUCCESS = '#52C97A';
export const WARNING = GOLD;
export const ERROR   = MELON;
export const INFO    = SKY;

// Legacy aliases so existing code doesn't break
export const NAVY         = MIDNIGHT;
export const NAVY_LIGHT   = MIDNIGHT_LIGHT;
export const NAVY_DARK    = MIDNIGHT_DARK;
export const NAVY_SURFACE = MIDNIGHT_SURFACE;
export const CYAN         = TRUE_BLUE;
export const CYAN_DARK    = TRUE_BLUE_DARK;
export const CYAN_LIGHT   = '#6AAAFF';

export const STATUS_COLORS = {
  draft:            { bg: '#161829', text: '#A8B4D0', border: '#2A3060' },
  submitted:        { bg: '#0A1A3A', text: '#4995FF', border: '#1A3070' },
  pending_review:   { bg: '#1A1400', text: '#FFAE41', border: '#3A2E00' },
  pending_payment:  { bg: '#1A1200', text: '#FFC982', border: '#3A2800' },
  approved:         { bg: '#081A10', text: '#52C97A', border: '#103A20' },
  issued:           { bg: '#061510', text: '#52C97A', border: '#0D3018' },
  declined:         { bg: '#1A0808', text: '#FF7E51', border: '#3A1010' },
  withdrawn:        { bg: '#181818', text: '#6B7399', border: '#2A2A2A' },
  lapsed:           { bg: '#1A0E08', text: '#FF7E51', border: '#3A1A08' },
  active:           { bg: '#081A10', text: '#52C97A', border: '#103A20' },
  nigo:             { bg: '#1A1400', text: '#FFAE41', border: '#3A2E00' },
};
