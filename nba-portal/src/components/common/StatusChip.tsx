import { Chip, type ChipProps } from '@mui/material';
import { STATUS_COLORS } from '../../theme/tokens';
import { APPLICATION_STATUS_LABELS, type ApplicationStatus } from '../../types/application.types';
import { POLICY_STATUS_LABELS, type PolicyStatus } from '../../types/policy.types';
import { PAYMENT_STATUS_LABELS, type PaymentStatus } from '../../types/payment.types';
import { COMMISSION_STATUS_LABELS, type CommissionStatus } from '../../types/commission.types';

type AnyStatus = ApplicationStatus | PolicyStatus | PaymentStatus | CommissionStatus;

const ALL_LABELS: Record<string, string> = {
  ...APPLICATION_STATUS_LABELS,
  ...POLICY_STATUS_LABELS,
  ...PAYMENT_STATUS_LABELS,
  ...COMMISSION_STATUS_LABELS,
};

interface StatusChipProps extends Omit<ChipProps, 'label'> {
  status: AnyStatus | string;
  label?: string;
}

export default function StatusChip({ status, label, size = 'small', ...rest }: StatusChipProps) {
  const colors = STATUS_COLORS[status as keyof typeof STATUS_COLORS] ?? STATUS_COLORS['draft'];
  const displayLabel = label ?? ALL_LABELS[status] ?? status;

  return (
    <Chip
      label={displayLabel}
      size={size}
      {...rest}
      sx={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        fontWeight: 700,
        fontSize: '0.68rem',
        letterSpacing: '0.03em',
        ...rest.sx,
      }}
    />
  );
}
