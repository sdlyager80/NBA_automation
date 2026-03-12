export type AgentLicenseStatus = 'active' | 'inactive' | 'pending' | 'suspended' | 'expired';
export type AppointmentStatus = 'active' | 'pending' | 'terminated';

export interface StateAppointment {
  id: string;
  state: string;
  stateCode: string;
  lineOfAuthority: string;
  licenseNumber: string;
  status: AppointmentStatus;
  effectiveDate: string;
  expirationDate: string;
  niprVerified: boolean;
  lastVerifiedDate: string;
}

export interface Agent {
  sys_id: string;
  agentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  npn: string;
  licenseStatus: AgentLicenseStatus;
  appointments: StateAppointment[];
  uplineAgentId?: string;
  uplineAgentName?: string;
  hireDate: string;
  associatedFuneralHomes: string[];
}
