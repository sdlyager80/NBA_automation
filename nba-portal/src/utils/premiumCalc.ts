import type { PaymentMode } from '../types/application.types';

// Simplified actuarial rate table (per $1,000 face amount, annual)
const BASE_RATES: Record<string, Record<string, number>> = {
  'prod-001': { '40-49': 14.5, '50-59': 18.0, '60-69': 24.5, '70-79': 34.0, '80+': 52.0 },
  'prod-002': { '40-49': 11.5, '50-59': 14.5, '60-69': 19.5, '70-79': 27.0, '80+': 42.0 },
  'prod-003': { '40-49': 16.5, '50-59': 20.5, '60-69': 28.0, '70-79': 39.0, '80+': 60.0 },
  'prod-004': { '40-49': 8.5,  '50-59': 11.0, '60-69': 15.0, '70-79': 21.0, '80+': 32.0 },
};

const MODAL_FACTORS: Record<PaymentMode, number> = {
  single_premium: 1.0,
  annual:         1.0,
  quarterly:      1.025,
  monthly:        1.078,
};

export const PAYMENT_PERIODS: Record<PaymentMode, number> = {
  single_premium: 1,
  annual:         5,
  quarterly:      20,
  monthly:        60,
};

function getAgeBand(age: number): string {
  if (age < 50) return '40-49';
  if (age < 60) return '50-59';
  if (age < 70) return '60-69';
  if (age < 80) return '70-79';
  return '80+';
}

export function calcAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

export function calcPremium(
  faceAmount: number,
  productId: string,
  dob: string,
  paymentMode: PaymentMode
): { annualPremium: number; modalPremium: number; totalPremium: number; paymentsRequired: number } {
  const age = calcAge(dob);
  const ageBand = getAgeBand(age);
  const rates = BASE_RATES[productId] ?? BASE_RATES['prod-001'];
  const ratePerThousand = rates[ageBand] ?? 18.0;

  const annualPremium = (faceAmount / 1000) * ratePerThousand;
  const modalFactor = MODAL_FACTORS[paymentMode];
  const periods = PAYMENT_PERIODS[paymentMode];

  let modalPremium: number;
  if (paymentMode === 'single_premium') {
    modalPremium = faceAmount; // Single premium = face amount for preneed
  } else if (paymentMode === 'annual') {
    modalPremium = annualPremium * modalFactor;
  } else if (paymentMode === 'quarterly') {
    modalPremium = (annualPremium / 4) * modalFactor;
  } else {
    // monthly
    modalPremium = (annualPremium / 12) * modalFactor;
  }

  const totalPremium = paymentMode === 'single_premium' ? faceAmount : modalPremium * periods;

  return {
    annualPremium: Math.round(annualPremium * 100) / 100,
    modalPremium: Math.round(modalPremium * 100) / 100,
    totalPremium: Math.round(totalPremium * 100) / 100,
    paymentsRequired: periods,
  };
}
