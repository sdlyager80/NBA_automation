export type PaymentStatus = 'pending' | 'processed' | 'failed' | 'reversed' | 'nsf';
export type PaymentSource = 'portal' | 'mail' | 'ach' | 'lockbox' | 'phone';
export type PaymentMethodType = 'credit_card' | 'ach' | 'check' | 'debit_card';

export interface Payment {
  sys_id: string;
  receiptNumber: string;
  policyNumber: string;
  insuredName: string;
  amount: number;
  paymentDate: string;
  dueDate: string;
  periodCovered: string;
  status: PaymentStatus;
  source: PaymentSource;
  paymentMethod: PaymentMethodType;
  accountLast4?: string;
  processedBy?: string;
  notes?: string;
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending:   'Pending',
  processed: 'Processed',
  failed:    'Failed',
  reversed:  'Reversed',
  nsf:       'NSF',
};
