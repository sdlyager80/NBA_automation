import type { UserRole } from '../types/user.types';

export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/':                    ['agent', 'customer', 'back_office', 'finance', 'producer_services', 'admin'],
  '/quotes':              ['agent', 'admin'],
  '/applications/new':    ['agent', 'admin'],
  '/cases/my':            ['agent', 'admin'],
  '/cases':               ['back_office', 'admin'],
  '/bill-pay':            ['agent', 'customer', 'back_office', 'admin'],
  '/bill-view':           ['agent', 'customer', 'back_office', 'admin'],
  '/policy-update':       ['agent', 'customer', 'back_office', 'admin'],
  '/billing-operations':  ['back_office', 'finance', 'admin'],
  '/data-integrity':      ['back_office', 'admin'],
  '/financial-services':  ['finance', 'admin'],
  '/producer-services':   ['agent', 'producer_services', 'admin'],
};

export const NAV_ITEMS: Array<{
  path: string;
  label: string;
  icon: string;
  roles: UserRole[];
  group: string;
}> = [
  { path: '/',                   label: 'Dashboard',            icon: 'Dashboard',            roles: ['agent', 'customer', 'back_office', 'finance', 'producer_services', 'admin'], group: 'main' },
  { path: '/quotes',             label: 'Quote Manager',        icon: 'RequestQuote',         roles: ['agent', 'admin'],                                                           group: 'sales' },
  { path: '/applications/new',   label: 'New Application',      icon: 'AddCircleOutline',     roles: ['agent', 'admin'],                                                           group: 'sales' },
  { path: '/cases/my',           label: 'My Cases',             icon: 'FolderSpecial',        roles: ['agent', 'admin'],                                                           group: 'sales' },
  { path: '/cases',              label: 'All Cases',            icon: 'FolderOpen',           roles: ['back_office', 'admin'],                                                      group: 'operations' },
  { path: '/bill-pay',           label: 'Bill Pay',             icon: 'Payment',              roles: ['agent', 'customer', 'back_office', 'admin'],                                group: 'billing' },
  { path: '/bill-view',          label: 'Bill View',            icon: 'Receipt',              roles: ['agent', 'customer', 'back_office', 'admin'],                                group: 'billing' },
  { path: '/policy-update',      label: 'Policy Update',        icon: 'EditNote',             roles: ['agent', 'customer', 'back_office', 'admin'],                                group: 'billing' },
  { path: '/billing-operations', label: 'Billing Operations',   icon: 'AccountBalance',       roles: ['back_office', 'finance', 'admin'],                                          group: 'operations' },
  { path: '/data-integrity',     label: 'Data Integrity',       icon: 'VerifiedUser',         roles: ['back_office', 'admin'],                                                      group: 'operations' },
  { path: '/financial-services', label: 'Financial Services',   icon: 'TrendingUp',           roles: ['finance', 'admin'],                                                          group: 'finance' },
  { path: '/producer-services',  label: 'Producer Services',    icon: 'BadgeOutlined',        roles: ['agent', 'producer_services', 'admin'],                                      group: 'producer' },
];

export const hasAccess = (role: UserRole, path: string): boolean => {
  const allowedRoles = ROUTE_PERMISSIONS[path];
  if (!allowedRoles) return role === 'admin';
  return allowedRoles.includes(role);
};
