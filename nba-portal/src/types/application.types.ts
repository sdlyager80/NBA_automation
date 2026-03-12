export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'pending_review'
  | 'pending_payment'
  | 'approved'
  | 'issued'
  | 'nigo'
  | 'declined'
  | 'withdrawn';

export type PaymentMode = 'single_premium' | 'monthly' | 'quarterly' | 'annual';

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
}

export interface FuneralHome {
  sys_id: string;
  name: string;
  licenseNumber: string;
  address: Address;
  contactName: string;
  phone: string;
  availableProductIds: string[];
}

export interface Insured {
  firstName: string;
  lastName: string;
  dob: string;
  ssn: string;
  gender: 'M' | 'F' | 'N';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  address: Address;
  phone: string;
  email: string;
  healthQuestions: {
    hasExistingPolicy: boolean;
    wasPreviouslyDeclined: boolean;
  };
}

export interface OwnerPayor {
  sameAsInsured: boolean;
  firstName?: string;
  lastName?: string;
  dob?: string;
  ssn?: string;
  address?: Address;
  relationship?: string;
  phone?: string;
  email?: string;
}

export interface Beneficiary {
  id: string;
  type: 'primary' | 'contingent';
  firstName: string;
  lastName: string;
  relationship: string;
  percentage: number;
  dob?: string;
}

export interface ServiceLineItem {
  id: string;
  category: 'professional_services' | 'merchandise' | 'cash_advance' | 'other';
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type PaymentSetupMode = 'enter_now' | 'send_later' | 'self_service';

export interface PaymentSetup {
  mode: PaymentSetupMode;
  paymentMode?: PaymentMode;
  // ACH
  bankAccountHolder?: string;
  bankName?: string;
  routingNumber?: string;
  accountNumber?: string;
  accountType?: 'checking' | 'savings';
  draftDay?: '1st' | '15th';
  // Card
  cardHolder?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  billingZip?: string;
  paymentType?: 'credit_card' | 'ach' | 'check' | 'debit_card';
  // Send Later
  sendToEmail?: string;
  sendToPhone?: string;
  // Self Service
  accessToken?: string;
}

export interface Application {
  sys_id: string;
  caseNumber: string;
  status: ApplicationStatus;
  agentId: string;
  agentName: string;
  funeralHome: FuneralHome;
  productId: string;
  productName: string;
  packageType: 'traditional' | 'cremation' | 'direct_burial';
  serviceLineItems: ServiceLineItem[];
  faceAmount: number;
  annualPremium: number;
  modalPremium: number;
  paymentMode: PaymentMode;
  insured: Insured;
  ownerPayor: OwnerPayor;
  beneficiaries: Beneficiary[];
  disclosuresAcknowledged: boolean;
  replacementQuestionAnswers: { question1: boolean; question2: boolean };
  paymentSetup: PaymentSetup;
  signatureData?: string;
  submittedAt?: string;
  issuedAt?: string;
  policyNumber?: string;
  nigoReason?: string;
  createdAt: string;
  updatedAt: string;
}

export const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  single_premium: 'Single Premium',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annual: 'Annual',
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  pending_review: 'In Review',
  pending_payment: 'Payment Pending',
  approved: 'Approved – Active',
  issued: 'Issued',
  nigo: 'NIGO',
  declined: 'Declined',
  withdrawn: 'Withdrawn',
};
