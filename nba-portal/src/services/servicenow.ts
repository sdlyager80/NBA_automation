/**
 * ServiceNow Mock Client
 * Simulates ServiceNow Table API: GET/POST/PATCH /api/now/table/{tableName}
 * All calls use in-memory mock data with simulated latency.
 */
import { simulateDelay } from './mock/delay';
import {
  MOCK_APPLICATIONS,
  MOCK_POLICIES,
  MOCK_PAYMENTS,
  MOCK_AGENTS,
  MOCK_COMMISSIONS,
  MOCK_BILLING_STATEMENTS,
  MOCK_LAPSE_NOTICES,
  MOCK_DATA_INTEGRITY,
  MOCK_FINANCIAL_TRANSACTIONS,
  FUNERAL_HOMES,
} from './mock/mockData';
import type { Application } from '../types/application.types';

// In-memory mutable store
const store: Record<string, unknown[]> = {
  x_preneed_application:    [...MOCK_APPLICATIONS],
  x_preneed_policy:         [...MOCK_POLICIES],
  x_preneed_payment:        [...MOCK_PAYMENTS],
  x_preneed_agent:          [...MOCK_AGENTS],
  x_preneed_commission:     [...MOCK_COMMISSIONS],
  x_preneed_billing_stmt:   [...MOCK_BILLING_STATEMENTS],
  x_preneed_lapse_notice:   [...MOCK_LAPSE_NOTICES],
  x_preneed_data_integrity: [...MOCK_DATA_INTEGRITY],
  x_preneed_transaction:    [...MOCK_FINANCIAL_TRANSACTIONS],
  x_preneed_funeral_home:   [...FUNERAL_HOMES],
};

interface SNResponse<T> {
  result: T;
  status: 'success' | 'error';
  message?: string;
}

function generateSysId(): string {
  return `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateCaseNumber(): string {
  const num = Math.floor(Math.random() * 900) + 100;
  return `NB-2026-0${num}`;
}

function generatePolicyNumber(): string {
  const num = Math.floor(Math.random() * 900) + 100;
  return `PNP-2026-0${num}`;
}

export const snClient = {
  async getList<T>(table: string, query?: Record<string, string>): Promise<SNResponse<T[]>> {
    await simulateDelay();
    const records = (store[table] ?? []) as T[];
    if (!query || Object.keys(query).length === 0) {
      return { result: records, status: 'success' };
    }
    // Simple filter: match key=value pairs
    const filtered = records.filter((rec) => {
      return Object.entries(query).every(([k, v]) => {
        const recObj = rec as Record<string, unknown>;
        return String(recObj[k]) === v;
      });
    });
    return { result: filtered, status: 'success' };
  },

  async getRecord<T>(table: string, sysId: string): Promise<SNResponse<T | null>> {
    await simulateDelay();
    const records = (store[table] ?? []) as Array<{ sys_id: string }>;
    const found = records.find(r => r.sys_id === sysId);
    if (!found) return { result: null, status: 'error', message: 'Record not found' };
    return { result: found as T, status: 'success' };
  },

  async createRecord<T>(table: string, body: Partial<T>): Promise<SNResponse<T>> {
    await simulateDelay();
    const now = new Date().toISOString();
    const isApp = table === 'x_preneed_application';
    const newRecord = {
      sys_id: generateSysId(),
      ...(isApp ? { caseNumber: generateCaseNumber(), createdAt: now, updatedAt: now, policyNumber: generatePolicyNumber() } : {}),
      ...body,
    } as T;
    if (!store[table]) store[table] = [];
    store[table].push(newRecord);
    return { result: newRecord, status: 'success' };
  },

  async updateRecord<T>(table: string, sysId: string, body: Partial<T>): Promise<SNResponse<T>> {
    await simulateDelay(300);
    const records = store[table] ?? [];
    const idx = records.findIndex((r) => (r as { sys_id: string }).sys_id === sysId);
    if (idx === -1) return { result: {} as T, status: 'error', message: 'Record not found' };
    const updated = { ...(records[idx] as object), ...body, updatedAt: new Date().toISOString() } as T;
    store[table][idx] = updated;
    return { result: updated, status: 'success' };
  },

  // Specialized: submit application → creates policy record
  async submitApplication(applicationSysId: string): Promise<SNResponse<Application>> {
    await simulateDelay(2000);
    const apps = store['x_preneed_application'] as Application[];
    const idx = apps.findIndex(a => a.sys_id === applicationSysId);
    if (idx === -1) return { result: {} as Application, status: 'error', message: 'Application not found' };

    const updated = {
      ...apps[idx],
      status: 'submitted' as const,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store['x_preneed_application'][idx] = updated;
    return { result: updated, status: 'success' };
  },
};

export type { SNResponse };
