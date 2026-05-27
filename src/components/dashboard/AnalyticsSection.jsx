import { useMemo } from 'react';
import Icon from '../ui/Icon';
import { formatCurrency, calculateSubtotal, calculateTax, calculateTotal } from '../../utils/helpers';

const kpiCards = [
  {
    key: 'totalRevenue', label: 'Total Revenue', icon: 'payments', color: 'bg-primary/10 text-primary',
    trendIcon: 'trending_up', trendText: '+12.5% vs last mo.', trendColor: 'text-secondary',
    isCurrency: true, filled: true,
  },
  {
    key: 'paidCount', label: 'Paid Invoices', icon: 'check_circle', color: 'bg-green-500/10 text-green-600',
    trendIcon: 'trending_up', trendText: '84% completion rate', trendColor: 'text-green-600',
    filled: true,
  },
  {
    key: 'outstanding', label: 'Outstanding', icon: 'hourglass_empty', color: 'bg-secondary/10 text-secondary',
    trendIcon: 'schedule', trendText: 'pending items', trendColor: 'text-outline',
    isCurrency: true, filled: true,
  },
  {
    key: 'overdueAmount', label: 'Late Invoices', icon: 'warning', color: 'bg-error/10 text-error',
    trendIcon: 'error_outline', trendText: 'overdue by 7+ days', trendColor: 'text-error',
    isCurrency: true, filled: true,
  },
];

const AnalyticsSection = ({ invoices = [] }) => {
  const analytics = useMemo(() => {
    const paid = invoices.filter((i) => i.status === 'paid');
    const pending = invoices.filter((i) => i.status === 'pending');
    const overdue = invoices.filter((i) => i.status === 'overdue');

    const totalRevenue = paid.reduce((sum, inv) => {
      const sub = calculateSubtotal(inv.items);
      const tax = calculateTax(sub, inv.taxRate);
      return sum + calculateTotal(sub, tax);
    }, 0);

    const outstanding = [...pending, ...overdue].reduce((sum, inv) => {
      const sub = calculateSubtotal(inv.items);
      const tax = calculateTax(sub, inv.taxRate);
      return sum + calculateTotal(sub, tax);
    }, 0);

    return {
      totalRevenue,
      paidCount: paid.length,
      outstanding,
      overdueAmount: overdue.reduce((sum, inv) => {
        const sub = calculateSubtotal(inv.items);
        const tax = calculateTax(sub, inv.taxRate);
        return sum + calculateTotal(sub, tax);
      }, 0),
      pendingCount: pending.length,
      overdueCount: overdue.length,
    };
  }, [invoices]);

  const getTrendText = (card) => {
    if (card.key === 'outstanding') return `${analytics.pendingCount} pending items`;
    if (card.key === 'overdueAmount') return `${analytics.overdueCount} overdue by 7+ days`;
    return card.trendText;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
      {kpiCards.map((card) => {
        const val = analytics[card.key];
        return (
          <div
            key={card.key}
            className="bg-white pt-1.5 pb-3 px-md rounded-xl custom-shadow border border-outline-variant/30 hover:translate-y-[-1px] transition-transform duration-300"
          >
            <div className="flex items-center justify-between mb-0">
              <span className="text-label-sm text-outline font-medium uppercase tracking-wide">{card.label}</span>
              <div className={`p-1 rounded-lg ${card.color}`}>
                <Icon name={card.icon} size={14} filled={card.filled} />
              </div>
            </div>
            <span className="text-headline-sm font-bold text-on-surface">
              {card.isCurrency ? formatCurrency(val || 0) : val ?? 0}
            </span>
            <div className={`flex items-center gap-1 ${card.trendColor}`}>
              <Icon name={card.trendIcon} size={13} />
              <span className="text-[11px] leading-none">{getTrendText(card)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsSection;
