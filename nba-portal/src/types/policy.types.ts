import type { PaymentMode } from './application.types';

export type PolicyStatus = 'active' | 'lapsed' | 'surrendered' | 'paid_up' | 'death_claim' | 'pending';

export interface Policy {
  sys_id: string;
  policyNumber: string;
  status: PolicyStatus;
  applicationSysId: string;
  insuredFirstName: string;
  insuredLastName: string;
  insuredDob: string;
  productName: string;
  productCode: string;
  faceAmount: number;
  issueDate: string;
  effectiveDate: string;
  nextDueDate: string;
  modalPremium: number;
  annualPremium: number;
  paymentMode: PaymentMode;
  agentId: string;
  agentName: string;
  funeralHomeName: string;
  funeralHomeId: string;
  beneficiaryName: string;
  beneficiaryType: string;
  paidToDate: string;
  totalPaid: number;
  paymentsRemaining: number;
  paidUpDate?: string;
  surrenderValue?: number;
  autoPayEnrolled: boolean;
  paymentMethodLast4?: string;
}

export const POLICY_STATUS_LABELS: Record<PolicyStatus, string> = {
  active:      'Active',
  lapsed:      'Lapsed',
  surrendered: 'Surrendered',
  paid_up:     'Paid-Up',
  death_claim: 'Death Claim',
  pending:     'Pending Issuance',
};
