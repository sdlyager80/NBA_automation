import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { FuneralHome, ServiceLineItem, Insured, OwnerPayor, Beneficiary, PaymentSetup, PaymentMode } from '../types/application.types';
import type { Product } from '../types/product.types';

interface Step1State {
  funeralHome: FuneralHome | null;
  product: Product | null;
  paymentMode: PaymentMode;
}

interface Step2State {
  serviceLineItems: ServiceLineItem[];
  faceAmount: number;
  annualPremium: number;
  modalPremium: number;
  packageType: 'traditional' | 'cremation' | 'direct_burial';
}

interface Step3State {
  insured: Partial<Insured>;
  ownerPayor: OwnerPayor;
  beneficiaries: Beneficiary[];
  disclosuresAcknowledged: boolean;
  replacementAnswers: { question1: boolean; question2: boolean };
}

interface ApplicationContextType {
  step1: Step1State;
  step2: Step2State;
  step3: Step3State;
  paymentSetup: PaymentSetup;
  signatureData: string;
  currentStep: number;
  submittedCaseNumber: string;

  setStep1: (data: Partial<Step1State>) => void;
  setStep2: (data: Partial<Step2State>) => void;
  setStep3: (data: Partial<Step3State>) => void;
  setPaymentSetup: (data: PaymentSetup) => void;
  setSignatureData: (sig: string) => void;
  setCurrentStep: (step: number) => void;
  setSubmittedCaseNumber: (cn: string) => void;
  resetWizard: () => void;
}

const defaultStep1: Step1State = { funeralHome: null, product: null, paymentMode: 'monthly' };
const defaultStep2: Step2State = { serviceLineItems: [], faceAmount: 0, annualPremium: 0, modalPremium: 0, packageType: 'traditional' };
const defaultStep3: Step3State = {
  insured: { gender: 'F', maritalStatus: 'single', address: { street1: '', city: '', state: 'TX', zip: '' }, healthQuestions: { hasExistingPolicy: false, wasPreviouslyDeclined: false } },
  ownerPayor: { sameAsInsured: true },
  beneficiaries: [],
  disclosuresAcknowledged: false,
  replacementAnswers: { question1: false, question2: false },
};
const defaultPaymentSetup: PaymentSetup = { mode: 'enter_now', paymentMode: 'monthly', paymentType: 'ach', accountType: 'checking', draftDay: '1st' };

const ApplicationContext = createContext<ApplicationContextType | null>(null);

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [step1, setStep1State] = useState<Step1State>(defaultStep1);
  const [step2, setStep2State] = useState<Step2State>(defaultStep2);
  const [step3, setStep3State] = useState<Step3State>(defaultStep3);
  const [paymentSetup, setPaymentSetupState] = useState<PaymentSetup>(defaultPaymentSetup);
  const [signatureData, setSignatureData] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [submittedCaseNumber, setSubmittedCaseNumber] = useState('');

  const setStep1 = useCallback((data: Partial<Step1State>) => setStep1State(prev => ({ ...prev, ...data })), []);
  const setStep2 = useCallback((data: Partial<Step2State>) => setStep2State(prev => ({ ...prev, ...data })), []);
  const setStep3 = useCallback((data: Partial<Step3State>) => setStep3State(prev => ({ ...prev, ...data })), []);
  const setPaymentSetup = useCallback((data: PaymentSetup) => setPaymentSetupState(data), []);

  const resetWizard = useCallback(() => {
    setStep1State(defaultStep1);
    setStep2State(defaultStep2);
    setStep3State(defaultStep3);
    setPaymentSetupState(defaultPaymentSetup);
    setSignatureData('');
    setCurrentStep(0);
    setSubmittedCaseNumber('');
  }, []);

  return (
    <ApplicationContext.Provider value={{
      step1, step2, step3, paymentSetup, signatureData, currentStep, submittedCaseNumber,
      setStep1, setStep2, setStep3, setPaymentSetup, setSignatureData, setCurrentStep, setSubmittedCaseNumber,
      resetWizard,
    }}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication(): ApplicationContextType {
  const ctx = useContext(ApplicationContext);
  if (!ctx) throw new Error('useApplication must be used within ApplicationProvider');
  return ctx;
}
