import {
  Box, Card, CardContent, Typography, Grid, TextField, RadioGroup,
  FormControlLabel, Radio, FormControl, InputLabel, Select, MenuItem,
  Button, Alert, Divider, Chip,
} from '@mui/material';
import { useState } from 'react';
import { useApplication } from '../../../store/ApplicationContext';
import { formatCurrency } from '../../../utils/formatters';
import type { PaymentSetupMode } from '../../../types/application.types';
import type { PaymentMethodType } from '../../../types/payment.types';
import { BORDER, CYAN, TEXT_SECONDARY } from '../../../theme/tokens';

interface Props { onNext: () => void; onBack: () => void; }

const PAYMENT_MODES = [
  { value: 'enter_now', label: '💳 Enter Payment Now', desc: 'Capture payment method during this submission' },
  { value: 'send_later', label: '📨 Send to Customer Later', desc: 'Email or text a secure payment link after approval' },
  { value: 'self_service', label: '🖥️ Customer Self-Service', desc: 'Customer registers for portal and completes payment' },
];

export default function Step4PaymentSetup({ onNext, onBack }: Props) {
  const { step2, paymentSetup, setPaymentSetup } = useApplication();
  const [mode, setMode] = useState<PaymentSetupMode>(paymentSetup.mode);
  const [payType, setPayType] = useState<PaymentMethodType>(paymentSetup.paymentType ?? 'ach');
  const [validated, setValidated] = useState(false);

  const modalPremium = step2.modalPremium;
  const faceAmount = step2.faceAmount;

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="overline" sx={{ mb: 2, display: 'block' }}>Payment Setup</Typography>
          <Alert severity="info" sx={{ mb: 2, fontSize: '0.8rem' }}>
            You can capture payment now <strong>or</strong> send a secure payment link to the customer after approval.
          </Alert>

          {/* Mode selector */}
          <Grid container spacing={1.5} sx={{ mb: 3 }}>
            {PAYMENT_MODES.map(pm => (
              <Grid size={{ xs: 12, sm: 4 }} key={pm.value}>
                <Box
                  onClick={() => setMode(pm.value as PaymentSetupMode)}
                  sx={{
                    border: `2px solid ${mode === pm.value ? CYAN : BORDER}`,
                    borderRadius: 1.5, p: 2, cursor: 'pointer',
                    bgcolor: mode === pm.value ? 'rgba(0,174,239,0.06)' : 'transparent',
                    transition: 'all 0.12s', '&:hover': { borderColor: CYAN },
                    position: 'relative',
                  }}
                >
                  {mode === pm.value && (
                    <Box sx={{ position: 'absolute', top: 8, right: 10, width: 18, height: 18, borderRadius: '50%', bgcolor: CYAN, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography sx={{ fontSize: '0.6rem', color: '#1B1F3A', fontWeight: 700 }}>✓</Typography>
                    </Box>
                  )}
                  <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 0.25 }}>{pm.label}</Typography>
                  <Typography variant="caption" sx={{ color: TEXT_SECONDARY, lineHeight: 1.4 }}>{pm.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Enter Now fields */}
          {mode === 'enter_now' && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Payment Method *</InputLabel>
                    <Select value={payType} label="Payment Method *" onChange={e => setPayType(e.target.value as PaymentMethodType)}>
                      <MenuItem value="ach">EFT / ACH — Recurring Bank Draft</MenuItem>
                      <MenuItem value="debit_card">Debit Card</MenuItem>
                      <MenuItem value="credit_card">Credit Card</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Payment Schedule *</InputLabel>
                    <Select defaultValue="monthly" label="Payment Schedule *">
                      <MenuItem value="monthly">Monthly — {formatCurrency(modalPremium)}/mo × 60 months</MenuItem>
                      <MenuItem value="single_premium">Single Premium — {formatCurrency(faceAmount)}</MenuItem>
                      <MenuItem value="quarterly">Quarterly — {formatCurrency(modalPremium * 3)}/qtr × 20</MenuItem>
                      <MenuItem value="annual">Annual — {formatCurrency(modalPremium * 12)}/yr × 5</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {payType === 'ach' && (
                <Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="overline" sx={{ mb: 1.5, display: 'block' }}>Bank Account Details (EFT/ACH)</Typography>
                  <Grid container spacing={2}>
                    <Grid size={6}><TextField fullWidth label="Account Holder Name *" size="small" defaultValue="Anna Rodriguez" /></Grid>
                    <Grid size={6}><TextField fullWidth label="Bank Name" size="small" defaultValue="Wells Fargo" /></Grid>
                    <Grid size={6}><TextField fullWidth label="Routing Number *" size="small" defaultValue="111000025" /></Grid>
                    <Grid size={6}><TextField fullWidth label="Account Number *" size="small" defaultValue="****4782" /></Grid>
                    <Grid size={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Account Type</InputLabel>
                        <Select defaultValue="checking" label="Account Type">
                          <MenuItem value="checking">Checking</MenuItem>
                          <MenuItem value="savings">Savings</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Draft Day Preference</InputLabel>
                        <Select defaultValue="1st" label="Draft Day Preference">
                          <MenuItem value="1st">1st of the month</MenuItem>
                          <MenuItem value="15th">15th of the month</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Button variant="outlined" color="secondary" size="small" onClick={() => setValidated(true)}>
                      ✓ Validate Payment Method
                    </Button>
                    {validated && (
                      <Chip label="✅ Payment Validated — ACH account verified" size="small" sx={{ bgcolor: '#0f2a15', color: '#66BB6A', border: '1px solid #1a4a22', fontSize: '0.7rem' }} />
                    )}
                  </Box>

                  {/* Installment Summary */}
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1.5, border: `1px solid ${BORDER}` }}>
                    <Typography variant="overline" sx={{ mb: 1.5, display: 'block' }}>Installment Summary</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '4px 12px', fontSize: '0.82rem' }}>
                      {[
                        ['Initial Payment', `${formatCurrency(modalPremium)} — drafts Apr 1, 2026`],
                        ['Recurring Amount', `${formatCurrency(modalPremium)} / month`],
                        ['Total Payments', '60 monthly installments'],
                        ['Paid-Up Date', 'March 1, 2031'],
                        ['Total Premium', formatCurrency(modalPremium * 60)],
                      ].map(([k, v]) => (
                        <>
                          <Typography key={`k-${k}`} sx={{ fontSize: '0.78rem', color: TEXT_SECONDARY }}>{k}</Typography>
                          <Typography key={`v-${k}`} sx={{ fontSize: '0.82rem', fontWeight: k === 'Total Premium' ? 700 : 500, color: k === 'Total Premium' ? CYAN : 'inherit' }}>{v}</Typography>
                        </>
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}

              {payType === 'credit_card' && (
                <Box>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid size={6}><TextField fullWidth label="Cardholder Name *" size="small" /></Grid>
                    <Grid size={6}><TextField fullWidth label="Card Number *" size="small" placeholder="•••• •••• •••• ••••" /></Grid>
                    <Grid size={4}><TextField fullWidth label="Expiration *" size="small" placeholder="MM/YY" /></Grid>
                    <Grid size={4}><TextField fullWidth label="CVV *" size="small" placeholder="•••" /></Grid>
                    <Grid size={4}><TextField fullWidth label="Billing ZIP *" size="small" /></Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          )}

          {/* Send Later */}
          {mode === 'send_later' && (
            <Box sx={{ p: 2, bgcolor: 'rgba(255,152,0,0.06)', borderRadius: 1.5, border: `1px solid rgba(255,152,0,0.3)` }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFB74D', mb: 0.5 }}>Payment Deferred</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#FFB74D', lineHeight: 1.5 }}>
                Payment will not be captured at submission. Once the policy reaches <strong>Approved – Active</strong> status, you can send a secure payment link via email or text from your dashboard.
              </Typography>
            </Box>
          )}

          {/* Self Service */}
          {mode === 'self_service' && (
            <Box sx={{ p: 2, bgcolor: 'rgba(0,174,239,0.05)', borderRadius: 1.5, border: `1px solid rgba(0,174,239,0.2)` }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: CYAN, mb: 0.5 }}>Customer Self-Service Payment</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: CYAN, lineHeight: 1.5 }}>
                Upon policy approval, the customer will receive an email invitation to create a secure portal account. From there, they can select a payment plan, enter payment details, and enroll in auto-pay at their convenience.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>← Back</Button>
        <Button variant="contained" color="secondary" onClick={onNext}>Continue →</Button>
      </Box>
    </Box>
  );
}
