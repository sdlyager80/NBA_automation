import {
  Box, Card, CardContent, Typography, Grid, Button, TextField,
  IconButton, Alert, Chip, Divider, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useState, useEffect } from 'react';
import { useApplication } from '../../../store/ApplicationContext';
import { calcPremium } from '../../../utils/premiumCalc';
import { formatCurrency } from '../../../utils/formatters';
import type { ServiceLineItem } from '../../../types/application.types';
import { BORDER, CYAN, TEXT_SECONDARY, NAVY_SURFACE } from '../../../theme/tokens';

const DEFAULT_LINE_ITEMS: ServiceLineItem[] = [
  { id: 'li-1', category: 'professional_services', description: 'Professional Services Fee', quantity: 1, unitPrice: 2500, total: 2500 },
  { id: 'li-2', category: 'professional_services', description: 'Embalming & Preparation', quantity: 1, unitPrice: 1200, total: 1200 },
  { id: 'li-3', category: 'professional_services', description: 'Visitation / Viewing (2 hrs)', quantity: 1, unitPrice: 800, total: 800 },
  { id: 'li-4', category: 'professional_services', description: 'Funeral Ceremony', quantity: 1, unitPrice: 1500, total: 1500 },
  { id: 'li-5', category: 'cash_advance', description: 'Hearse Transportation', quantity: 1, unitPrice: 650, total: 650 },
  { id: 'li-6', category: 'merchandise', description: 'Casket — Oak Heritage Select', quantity: 1, unitPrice: 3850, total: 3850 },
  { id: 'li-7', category: 'merchandise', description: 'Outer Burial Container', quantity: 1, unitPrice: 1200, total: 1200 },
  { id: 'li-8', category: 'other', description: 'Memorial Package', quantity: 1, unitPrice: 450, total: 450 },
  { id: 'li-9', category: 'other', description: 'Floral Tribute Arrangement', quantity: 1, unitPrice: 350, total: 350 },
];

const PACKAGES = [
  { value: 'traditional', label: 'Traditional Service', desc: 'Full viewing, ceremony, and burial' },
  { value: 'cremation', label: 'Cremation Service', desc: 'Memorial service with cremation' },
  { value: 'direct_burial', label: 'Direct Burial', desc: 'Simplified arrangement' },
];

interface Props { onNext: () => void; onBack: () => void; }

export default function Step2PlanServices({ onNext, onBack }: Props) {
  const { step1, step2, setStep2 } = useApplication();
  const [items, setItems] = useState<ServiceLineItem[]>(step2.serviceLineItems.length ? step2.serviceLineItems : DEFAULT_LINE_ITEMS);
  const [pkg, setPkg] = useState<'traditional' | 'cremation' | 'direct_burial'>(step2.packageType);

  const faceAmount = items.reduce((sum, i) => sum + i.total, 0);

  useEffect(() => {
    const premiums = step1.product && step2.packageType !== 'direct_burial'
      ? calcPremium(faceAmount, step1.product.sys_id, '1958-06-15', step1.paymentMode)
      : { annualPremium: 0, modalPremium: 0, totalPremium: 0, paymentsRequired: 60 };
    setStep2({ serviceLineItems: items, faceAmount, annualPremium: premiums.annualPremium, modalPremium: premiums.modalPremium, packageType: pkg });
  }, [items, pkg]);

  const updateItem = (id: string, field: keyof ServiceLineItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        updated.total = updated.quantity * updated.unitPrice;
      }
      return updated;
    }));
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const addItem = () => {
    const newItem: ServiceLineItem = {
      id: `li-${Date.now()}`,
      category: 'other',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setItems(prev => [...prev, newItem]);
  };

  const premiums = step1.product
    ? calcPremium(faceAmount, step1.product.sys_id, '1958-06-15', step1.paymentMode)
    : { annualPremium: 0, modalPremium: 0, totalPremium: 0, paymentsRequired: 60 };

  const paymentModeLabels = { single_premium: 'Single Premium', monthly: 'Monthly (60 mo)', quarterly: 'Quarterly (20 qtr)', annual: 'Annual (5 yr)' };

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="overline" sx={{ mb: 2, display: 'block' }}>
            {step1.product?.name} — Goods & Services Builder
          </Typography>
          <Alert severity="info" sx={{ mb: 2, fontSize: '0.8rem' }}>
            Coverage amount is <strong>auto-calculated</strong> based on your goods and services selections. Premium estimates update in real time.
          </Alert>

          {/* Package Type */}
          <Typography variant="caption" sx={{ color: TEXT_SECONDARY, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, display: 'block', mb: 1 }}>Package Type</Typography>
          <Grid container spacing={1.5} sx={{ mb: 3 }}>
            {PACKAGES.map(p => (
              <Grid size={{ xs: 12, sm: 4 }} key={p.value}>
                <Box
                  onClick={() => setPkg(p.value as typeof pkg)}
                  sx={{
                    border: `2px solid ${pkg === p.value ? CYAN : BORDER}`,
                    borderRadius: 1.5, p: 1.5, cursor: 'pointer',
                    bgcolor: pkg === p.value ? 'rgba(0,174,239,0.06)' : 'transparent',
                    transition: 'all 0.12s', '&:hover': { borderColor: CYAN },
                  }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{p.label}</Typography>
                  <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{p.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Line Items Table */}
          <Typography variant="overline" sx={{ mb: 1.5, display: 'block' }}>Line-Item Goods & Services</Typography>
          <Box sx={{ border: `1px solid ${BORDER}`, borderRadius: 1.5, overflow: 'hidden' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 70px 110px 110px 36px', gap: 0, bgcolor: 'rgba(0,0,0,0.2)', px: 1.5, py: 1 }}>
              {['Item', 'Qty', 'Unit Price', 'Subtotal', ''].map(h => (
                <Typography key={h} variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: TEXT_SECONDARY, fontSize: '0.65rem' }}>{h}</Typography>
              ))}
            </Box>
            {items.map((item, i) => (
              <Box key={item.id} sx={{ display: 'grid', gridTemplateColumns: '1fr 70px 110px 110px 36px', gap: 0, px: 1.5, py: 0.75, borderTop: `1px solid ${BORDER}`, alignItems: 'center' }}>
                <TextField
                  value={item.description}
                  onChange={e => updateItem(item.id, 'description', e.target.value)}
                  size="small"
                  variant="standard"
                  sx={{ '& input': { fontSize: '0.82rem' } }}
                />
                <TextField
                  value={item.quantity}
                  onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))}
                  size="small" type="number"
                  variant="standard"
                  sx={{ '& input': { fontSize: '0.82rem', textAlign: 'center' } }}
                />
                <TextField
                  value={item.unitPrice}
                  onChange={e => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                  size="small" type="number"
                  variant="standard"
                  sx={{ '& input': { fontSize: '0.82rem' } }}
                />
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>{formatCurrency(item.total)}</Typography>
                <IconButton size="small" onClick={() => removeItem(item.id)} sx={{ color: TEXT_SECONDARY, '&:hover': { color: '#EF5350' } }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1.5, py: 1.5, borderTop: `2px solid ${CYAN}`, mt: 0.5 }}>
              <Typography sx={{ fontWeight: 700 }}>Insurance-Funded Coverage Total</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: CYAN }}>{formatCurrency(faceAmount)}</Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 1.5 }}>
            <Button size="small" startIcon={<AddIcon />} onClick={addItem} sx={{ color: TEXT_SECONDARY }}>Add Line Item</Button>
          </Box>
        </CardContent>
      </Card>

      {/* Premium Estimate */}
      <Card sx={{ mb: 2, border: `1px solid rgba(0,174,239,0.3)`, bgcolor: 'rgba(0,174,239,0.04)' }}>
        <CardContent>
          <Typography variant="overline" sx={{ color: CYAN, mb: 2, display: 'block' }}>Premium Estimate — Compare Payment Options</Typography>
          <Grid container spacing={2} sx={{ textAlign: 'center' }}>
            {([
              { mode: 'single_premium', label: 'Single Premium', value: formatCurrency(faceAmount), sub: 'One-time · No interest', highlight: false },
              { mode: 'monthly', label: '★ Monthly (60 mo)', value: `${formatCurrency(premiums.modalPremium)}/mo`, sub: `Total: ${formatCurrency(premiums.totalPremium)} · Paid-up 2031`, highlight: true },
              { mode: 'quarterly', label: 'Quarterly (20 qtrs)', value: `${formatCurrency(calcPremium(faceAmount, step1.product?.sys_id ?? 'prod-001', '1958-06-15', 'quarterly').modalPremium)}/qtr`, sub: 'Paid-up 2031', highlight: false },
              { mode: 'annual', label: 'Annual (5 yr)', value: `${formatCurrency(calcPremium(faceAmount, step1.product?.sys_id ?? 'prod-001', '1958-06-15', 'annual').modalPremium)}/yr`, sub: 'Paid-up 2031', highlight: false },
            ] as Array<{ mode: string; label: string; value: string; sub: string; highlight: boolean }>).map((opt, i) => (
              <Grid size={{ xs: 6, sm: 3 }} key={opt.mode}
                sx={{ borderLeft: i > 0 ? `1px solid rgba(0,174,239,0.2)` : 'none' }}
              >
                <Typography variant="caption" sx={{ color: opt.highlight ? CYAN : TEXT_SECONDARY, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, fontSize: '0.65rem' }}>
                  {opt.label}
                </Typography>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: CYAN, my: 0.5 }}>{opt.value}</Typography>
                <Typography variant="caption" sx={{ color: TEXT_SECONDARY, fontSize: '0.7rem' }}>{opt.sub}</Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>← Back</Button>
        <Button variant="contained" color="secondary" onClick={onNext} disabled={faceAmount === 0}>Continue →</Button>
      </Box>
    </Box>
  );
}
