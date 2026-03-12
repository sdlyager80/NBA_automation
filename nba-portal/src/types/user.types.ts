export type UserRole =
  | 'agent'
  | 'customer'
  | 'back_office'
  | 'finance'
  | 'producer_services'
  | 'admin';

export interface User {
  sys_id: string;
  name: string;
  email: string;
  role: UserRole;
  agentId?: string;
  policyNumbers?: string[];
  avatarInitials: string;
  avatarColor: string;
}

export const PERSONAS: User[] = [
  { sys_id: 'u001', name: 'Susan Mitchell',  email: 'susan@eternalrest.com',  role: 'agent',             agentId: 'AGT-0042', avatarInitials: 'SM', avatarColor: '#FF9800' },
  { sys_id: 'u002', name: 'Anna Rodriguez',  email: 'anna@personal.com',      role: 'customer',          policyNumbers: ['POL-10021'], avatarInitials: 'AR', avatarColor: '#00AEEF' },
  { sys_id: 'u003', name: 'Marcus Webb',     email: 'marcus@insurer.com',     role: 'back_office',       avatarInitials: 'MW', avatarColor: '#9C27B0' },
  { sys_id: 'u004', name: 'Priya Nair',      email: 'priya@insurer.com',      role: 'finance',           avatarInitials: 'PN', avatarColor: '#4CAF50' },
  { sys_id: 'u005', name: 'Derek Holloway',  email: 'derek@insurer.com',      role: 'producer_services', avatarInitials: 'DH', avatarColor: '#E91E63' },
  { sys_id: 'u006', name: 'Admin User',      email: 'admin@insurer.com',      role: 'admin',             avatarInitials: 'AU', avatarColor: '#607D8B' },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  agent:             'Selling Agent',
  customer:          'Policy Holder',
  back_office:       'Back Office Operations',
  finance:           'Financial Services',
  producer_services: 'Producer Services',
  admin:             'Administrator',
};
