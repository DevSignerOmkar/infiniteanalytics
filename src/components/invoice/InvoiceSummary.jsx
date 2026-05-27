import { memo } from 'react';
import { formatCurrency } from '../../utils/helpers';

const InvoiceSummary = memo(({ subtotal, taxRate, tax, total }) => (
  <div className="space-y-md border-b border-outline-variant/30 pb-lg mb-lg">
    <div className="flex justify-between items-center text-body-md">
      <span className="text-on-surface-variant">Subtotal</span>
      <span className="font-medium text-on-surface">{formatCurrency(subtotal)}</span>
    </div>
    <div className="flex justify-between items-center text-body-md">
      <div className="flex items-center gap-xs">
        <span className="text-on-surface-variant">Tax</span>
        <span className="text-xs bg-surface-container-high px-2 py-0.5 rounded-full text-primary font-bold">{taxRate}%</span>
      </div>
      <span className="font-medium text-on-surface">{formatCurrency(tax)}</span>
    </div>
    <div className="flex justify-between items-end">
      <span className="text-label-md text-outline uppercase tracking-widest">Total Amount</span>
      <span className="text-headline-lg text-primary">{formatCurrency(total)}</span>
    </div>
  </div>
));

InvoiceSummary.displayName = 'InvoiceSummary';
export default InvoiceSummary;
