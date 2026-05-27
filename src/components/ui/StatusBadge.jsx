const statusConfig = {
  paid: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', label: 'Paid' },
  pending: { bg: 'bg-primary-fixed text-primary', text: 'text-primary', dot: 'bg-primary', label: 'Outstanding' },
  overdue: { bg: 'bg-error-container/40', text: 'text-error', dot: 'bg-error', label: 'Late' },
  sent: { bg: 'bg-secondary-fixed', text: 'text-secondary', dot: 'bg-secondary', label: 'Sent' },
  draft: { bg: 'bg-surface-container-high', text: 'text-on-surface-variant', dot: 'bg-outline', label: 'Draft' },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span className={`px-sm py-1 rounded-full text-label-sm font-bold flex items-center gap-xs w-fit ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
