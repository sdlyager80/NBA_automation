export interface BillingStatement {
  sys_id: string;
  policyNumber: string;
  insuredName: string;
  statementDate: string;
  periodStart: string;
  periodEnd: string;
  amountDue: number;
  amountPaid: number;
  balance: number;
  pdfUrl?: string;
}

export interface LapseNotice {
  sys_id: string;
  policyNumber: string;
  insuredName: string;
  agentName: string;
  funeralHomeName: string;
  gracePeriodEnd: string;
  pastDueAmount: number;
  daysLapsed: number;
  noticesSentCount: number;
  lastNoticeSentDate?: string;
  status: 'open' | 'notice_sent' | 'reinstated' | 'lapsed';
}

export interface ReinstatementRequest {
  sys_id: string;
  policyNumber: string;
  insuredName: string;
  requestDate: string;
  lapseDate: string;
  backPremiumAmount: number;
  reinstatementFee: number;
  totalRequired: number;
  status: 'pending' | 'approved' | 'denied';
}

export interface DataIntegrityRecord {
  sys_id: string;
  recordType: 'policy' | 'payment' | 'application' | 'agent';
  recordId: string;
  errorCode: string;
  errorMessage: string;
  affectedField: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'open' | 'resolved' | 'ignored';
  detectedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface FinancialTransaction {
  sys_id: string;
  transactionId: string;
  type: 'premium_received' | 'commission_paid' | 'refund' | 'remittance' | 'nsf_charge';
  policyNumber?: string;
  agentId?: string;
  amount: number;
  transactionDate: string;
  description: string;
  status: 'posted' | 'pending' | 'reversed';
  batchId?: string;
}
