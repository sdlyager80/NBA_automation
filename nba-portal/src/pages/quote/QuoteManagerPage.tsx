import {
  Box, Card, CardContent, Typography, Grid, TextField, FormControl,
  InputLabel, Select, MenuItem, Button, Slider, Chip, Divider, Alert,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../../types/product.types';
import { calcPremium, PAYMENT_PERIODS } from '../../utils/premiumCalc';
import { formatCurrency } from '../../utils/formatters';
import PageHeader from '../../components/common/PageHeader';
import { BORDER, CYAN, TEXT_SECONDARY } from '../../theme/tokens';
import type { PaymentMode } from '../../types/application.types';

const STATES = ['TX', 'LA', 'OK', 'AR', 'NM', 'CO'];

export default function QuoteManagerPage() {
  const navigate = useNavigate();
  const [state, setState] = useState('TX');
  const [productId, setProductId] = useState(PRODUCTS[0].sys_id);
  const [dob, setDob] = useState('1958-06-15');
  const [faceAmount, setFaceAmount] = useState(12500);
  const [mode, setMode] = useState<PaymentMode>('monthly');
  const [calculated, setCalculated] = useState(false);

  const product = PRODUCTS.find(p => p.sys_id === productId)!;
  const availableProducts = PRODUCTS.filter(p => p.statesApproved.includes(state));

  const premiums = calculated
    ? {
        monthly: calcPremium(faceAmount, productId, dob, 'monthly'),
        quarterly: calcPremium(faceAmount, productId, dob, 'quarterly'),
        annual: calcPremium(faceAmount, productId, dob, 'annual'),
        single_premium: calcPremium(faceAmount, productId, dob, 'single_premium'),
      }
    : null;

  return (
    <>
      <PageHeader
        title="Quote Manager"
        subtitle="Generate preneed insurance quotes and compare payment options"
      />

      <Grid container spacing={2}>
        {/* Left: Quote Form */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ border: `1px solid ${BORDER}`, position: 'sticky', top: 72 }}>
            <CardContent>
              <Typography variant="overline" sx={{ mb: 2, display: 'block' }}>Quote Parameters</Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>State *</InputLabel>
                  <Select value={state} label="State *" onChange={e => { setState(e.target.value); setProductId(availableProducts[0]?.sys_id ?? ''); setCalculated(false); }}>
                    {STATES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Product *</InputLabel>
                  <Select value={productId} label="Product *" onChange={e => { setProductId(e.target.value); setCalculated(false); }}>
                    {availableProducts.map(p => <MenuItem key={p.sys_id} value={p.sys_id}>{p.name}</MenuItem>)}
                  </Select>
                </FormControl>

                <TextField
                  label="Insured Date of Birth *"
                  type="date"
                  size="small"
                  fullWidth
                  value={dob}
                  onChange={e => { setDob(e.target.value); setCalculated(false); }}
                  InputLabelProps={{ shrink: true }}
                />

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: TEXT_SECONDARY, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Coverage Amount</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: CYAN }}>{formatCurrency(faceAmount, 0)}</Typography>
                  </Box>
                  <Slider
                    value={faceAmount}
                    onChange={(_, v) => { setFaceAmount(v as number); setCalculated(false); }}
                    min={product.minFaceAmount}
                    max={product.maxFaceAmount}
                    step={500}
                    sx={{ color: CYAN }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{formatCurrency(product.minFaceAmount, 0)}</Typography>
                    <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{formatCurrency(product.maxFaceAmount, 0)}</Typography>
                  </Box>
                </Box>

                <FormControl fullWidth size="small">
                  <InputLabel>Payment Mode</InputLabel>
                  <Select value={mode} label="Payment Mode" onChange={e => setMode(e.target.value as PaymentMode)}>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="annual">Annual</MenuItem>
                    <MenuItem value="single_premium">Single Premium</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained" color="secondary" fullWidth
                  startIcon={<CalculateIcon />}
                  onClick={() => setCalculated(true)}
                >
                  Calculate Premium
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Center/Right: Results */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Product Cards */}
          <Typography variant="overline" sx={{ mb: 1.5, display: 'block' }}>Available Products — {state}</Typography>
          <Grid container spacing={1.5} sx={{ mb: 3 }}>
            {availableProducts.map(p => (
              <Grid size={{ xs: 12, sm: 6 }} key={p.sys_id}>
                <Box
                  onClick={() => { setProductId(p.sys_id); setCalculated(false); }}
                  sx={{
                    border: `2px solid ${productId === p.sys_id ? CYAN : BORDER}`,
                    borderRadius: 2, p: 2, cursor: 'pointer',
                    bgcolor: productId === p.sys_id ? 'rgba(0,174,239,0.06)' : 'transparent',
                    transition: 'all 0.12s', '&:hover': { borderColor: CYAN },
                    position: 'relative',
                  }}
                >
                  {p.popular && <Chip label="Most Popular" size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,174,239,0.15)', color: CYAN, border: `1px solid ${CYAN}`, fontSize: '0.6rem', fontWeight: 700 }} />}
                  <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{p.name}</Typography>
                  <Typography variant="caption" sx={{ color: CYAN, fontWeight: 600, display: 'block', mb: 0.5 }}>{p.productCode}</Typography>
                  <Typography variant="caption" sx={{ color: TEXT_SECONDARY, lineHeight: 1.4, display: 'block', mb: 1 }}>{p.description}</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {p.highlights.slice(0, 3).map(h => (
                      <Chip key={h} label={h} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.04)', fontSize: '0.6rem', border: `1px solid ${BORDER}` }} />
                    ))}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Quote Result */}
          {calculated && premiums && (
            <Card sx={{ border: `1px solid rgba(0,174,239,0.3)`, bgcolor: 'rgba(0,174,239,0.04)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="overline" sx={{ color: CYAN }}>Premium Estimate — {product.name}</Typography>
                  <Chip label={`Coverage: ${formatCurrency(faceAmount, 0)}`} size="small" sx={{ bgcolor: 'rgba(0,174,239,0.15)', color: CYAN, border: `1px solid ${CYAN}` }} />
                </Box>

                <Grid container spacing={2} sx={{ mb: 3, textAlign: 'center' }}>
                  {([
                    { key: 'single_premium', label: 'Single Premium', value: formatCurrency(faceAmount, 0), sub: 'One-time · No interest', tag: 'Best Value' },
                    { key: 'monthly', label: 'Monthly', value: `${formatCurrency(premiums.monthly.modalPremium)}/mo`, sub: `${PAYMENT_PERIODS.monthly} payments · Total: ${formatCurrency(premiums.monthly.totalPremium)}`, tag: '★ Most Popular' },
                    { key: 'quarterly', label: 'Quarterly', value: `${formatCurrency(premiums.quarterly.modalPremium)}/qtr`, sub: `${PAYMENT_PERIODS.quarterly} payments · Total: ${formatCurrency(premiums.quarterly.totalPremium)}`, tag: '' },
                    { key: 'annual', label: 'Annual', value: `${formatCurrency(premiums.annual.modalPremium)}/yr`, sub: `${PAYMENT_PERIODS.annual} payments · Total: ${formatCurrency(premiums.annual.totalPremium)}`, tag: '' },
                  ] as Array<{ key: string; label: string; value: string; sub: string; tag: string }>).map((opt, i) => (
                    <Grid size={{ xs: 6, sm: 3 }} key={opt.key}
                      sx={{ borderLeft: i > 0 ? `1px solid rgba(0,174,239,0.2)` : 'none', cursor: 'pointer' }}
                      onClick={() => setMode(opt.key as PaymentMode)}
                    >
                      <Box sx={{ p: 1, borderRadius: 1, bgcolor: mode === opt.key ? 'rgba(0,174,239,0.1)' : 'transparent', border: mode === opt.key ? `1px solid rgba(0,174,239,0.3)` : '1px solid transparent', transition: 'all 0.12s' }}>
                        {opt.tag && <Typography variant="caption" sx={{ color: CYAN, fontWeight: 700, fontSize: '0.62rem', display: 'block', mb: 0.25 }}>{opt.tag}</Typography>}
                        <Typography variant="caption" sx={{ color: TEXT_SECONDARY, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, fontSize: '0.65rem', display: 'block' }}>{opt.label}</Typography>
                        <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color: CYAN, my: 0.25 }}>{opt.value}</Typography>
                        <Typography variant="caption" sx={{ color: TEXT_SECONDARY, fontSize: '0.7rem' }}>{opt.sub}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ mb: 2 }} />

                <Alert severity="success" sx={{ mb: 2, fontSize: '0.8rem' }}>
                  This quote is valid for 30 days. Convert to application to lock in pricing.
                </Alert>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button variant="contained" color="secondary" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/applications/new')}>
                    Convert to Application
                  </Button>
                  <Button variant="outlined" sx={{ color: TEXT_SECONDARY, borderColor: BORDER }}>Save Quote</Button>
                  <Button variant="outlined" sx={{ color: TEXT_SECONDARY, borderColor: BORDER }}>Print / Email</Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {!calculated && (
            <Box sx={{ textAlign: 'center', py: 6, color: TEXT_SECONDARY }}>
              <Typography sx={{ fontSize: '2rem', mb: 1 }}>📊</Typography>
              <Typography sx={{ fontWeight: 600 }}>Set parameters and click Calculate Premium</Typography>
              <Typography variant="caption">Premium estimates update based on age, coverage amount, and payment mode.</Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </>
  );
}
