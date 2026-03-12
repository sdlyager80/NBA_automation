import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { AuthProvider } from '../store/AuthContext';
import { AppProvider } from '../store/AppContext';

import DashboardPage from '../pages/dashboard/DashboardPage';
import QuoteManagerPage from '../pages/quote/QuoteManagerPage';
import NewApplicationPage from '../pages/new-application/NewApplicationPage';
import CasesPage from '../pages/cases/CasesPage';
import BillPayPage from '../pages/bill-pay/BillPayPage';
import BillViewPage from '../pages/bill-view/BillViewPage';
import PolicyUpdatePage from '../pages/policy-update/PolicyUpdatePage';
import BillingOperationsPage from '../pages/billing-operations/BillingOperationsPage';
import DataIntegrityPage from '../pages/data-integrity/DataIntegrityPage';
import FinancialServicesPage from '../pages/financial-services/FinancialServicesPage';
import ProducerServicesPage from '../pages/producer-services/ProducerServicesPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/quotes" element={<QuoteManagerPage />} />
              <Route path="/applications/new" element={<NewApplicationPage />} />
              <Route path="/cases/my" element={<CasesPage />} />
              <Route path="/cases" element={<CasesPage />} />
              <Route path="/bill-pay" element={<BillPayPage />} />
              <Route path="/bill-view" element={<BillViewPage />} />
              <Route path="/policy-update" element={<PolicyUpdatePage />} />
              <Route path="/billing-operations" element={<BillingOperationsPage />} />
              <Route path="/data-integrity" element={<DataIntegrityPage />} />
              <Route path="/financial-services" element={<FinancialServicesPage />} />
              <Route path="/producer-services" element={<ProducerServicesPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
