import type { PaymentMode } from './application.types';

export type ProductType = 'whole_life' | 'term_preneed' | 'guaranteed_issue' | 'preneed_plus';

export interface Product {
  sys_id: string;
  name: string;
  productCode: string;
  type: ProductType;
  description: string;
  minFaceAmount: number;
  maxFaceAmount: number;
  availablePaymentModes: PaymentMode[];
  statesApproved: string[];
  basePremiumPer1000: number;
  highlights: string[];
  popular?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    sys_id: 'prod-001',
    name: 'Serenity Plus Preneed',
    productCode: 'SPP-100',
    type: 'preneed_plus',
    description: 'Comprehensive preneed coverage with full goods & services flexibility. Most popular for traditional arrangements.',
    minFaceAmount: 5000,
    maxFaceAmount: 25000,
    availablePaymentModes: ['single_premium', 'monthly', 'quarterly', 'annual'],
    statesApproved: ['TX', 'LA', 'OK', 'AR', 'NM'],
    basePremiumPer1000: 18.0,
    highlights: ['Full goods & services coverage', 'Irrevocable assignment', 'Price guarantee', 'Portability'],
    popular: true,
  },
  {
    sys_id: 'prod-002',
    name: 'Essential Farewell',
    productCode: 'EFP-200',
    type: 'whole_life',
    description: 'Simplified preneed policy for essential services. Ideal for budget-conscious families.',
    minFaceAmount: 3000,
    maxFaceAmount: 15000,
    availablePaymentModes: ['single_premium', 'monthly', 'annual'],
    statesApproved: ['TX', 'LA', 'OK', 'AR'],
    basePremiumPer1000: 14.5,
    highlights: ['Simplified issue', 'No health questions', 'Fixed premiums', 'Guaranteed acceptance'],
  },
  {
    sys_id: 'prod-003',
    name: 'Heritage Memorial',
    productCode: 'HMP-300',
    type: 'preneed_plus',
    description: 'Premium preneed policy for comprehensive memorial arrangements. Highest coverage limits with enhanced benefits.',
    minFaceAmount: 10000,
    maxFaceAmount: 50000,
    availablePaymentModes: ['single_premium', 'monthly', 'quarterly', 'annual'],
    statesApproved: ['TX', 'LA', 'OK', 'AR', 'NM', 'CO'],
    basePremiumPer1000: 20.5,
    highlights: ['Highest coverage limit', 'Enhanced death benefit', 'Family discount available', 'Trust protection'],
  },
  {
    sys_id: 'prod-004',
    name: 'Assured Cremation',
    productCode: 'ACP-400',
    type: 'term_preneed',
    description: 'Designed specifically for cremation arrangements. Lower cost with full cremation service coverage.',
    minFaceAmount: 2500,
    maxFaceAmount: 12000,
    availablePaymentModes: ['single_premium', 'monthly'],
    statesApproved: ['TX', 'LA', 'OK'],
    basePremiumPer1000: 11.0,
    highlights: ['Cremation focused', 'Lowest premiums', 'No medical exam', 'Immediate coverage'],
  },
];
