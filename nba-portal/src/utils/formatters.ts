export const formatCurrency = (amount: number, decimals = 2): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(amount);

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatDateShort = (dateStr: string): string => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const maskSSN = (ssn: string): string => {
  if (!ssn) return '';
  const digits = ssn.replace(/\D/g, '');
  if (digits.length >= 4) return `***-**-${digits.slice(-4)}`;
  return ssn;
};

export const maskAccountNumber = (acct: string): string => {
  if (!acct) return '';
  const digits = acct.replace(/\D/g, '');
  if (digits.length >= 4) return `****${digits.slice(-4)}`;
  return acct;
};

export const formatPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  return phone;
};

export const formatPercent = (val: number): string => `${(val * 100).toFixed(1)}%`;

export const formatAddress = (a: { street1: string; street2?: string; city: string; state: string; zip: string }): string => {
  const parts = [a.street1, a.street2, `${a.city}, ${a.state} ${a.zip}`].filter(Boolean);
  return parts.join(', ');
};

export const getInitials = (name: string): string =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
