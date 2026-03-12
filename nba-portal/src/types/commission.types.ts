export type CommissionType = 'first_year' | 'renewal' | 'override' | 'bonus';
export type CommissionStatus = 'earned' | 'pending' | 'paid' | 'charged_back';

export interface Commission {
  sys_id: string;
  agentId: string;
  agentName: string;
  policyNumber: string;
  insuredName: string;
  saleDate: string;
  faceAmount: number;
  premiumAmount: number;
  commissionType: CommissionType;
  commissionRate: number;
  commissionAmount: number;
  status: CommissionStatus;
  paidDate?: string;
  statementId?: string;
  productName: string;
}

export const COMMISSION_TYPE_LABELS: Record<CommissionType, string> = {
  first_year: 'First Year',
  renewal:    'Renewal',
  override:   'Override',
  bonus:      'Bonus',
};

export const COMMISSION_STATUS_LABELS: Record<CommissionStatus, string> = {
  earned:       'Earned',
  pending:      'Pending',
  paid:         'Paid',
  charged_back: 'Charged Back',
};
