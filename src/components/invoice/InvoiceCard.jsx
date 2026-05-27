import { memo } from 'react';
import StatusBadge from '../ui/StatusBadge';
import { formatCurrency, formatDate, isOverdue, calculateSubtotal, calculateTax, calculateTotal } from '../../utils/helpers';

const InvoiceCard = memo(({ invoice, onClick }) => {
  const subtotal = calculateSubtotal(invoice.items);
  const tax = calculateTax(subtotal, invoice.taxRate);
  const total = calculateTotal(subtotal, tax);
  const overdue = isOverdue(invoice.dueDate, invoice.status);

  return (
    <div
      onClick={() => onClick(invoice)}
      className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 flex flex-col gap-sm hover:translate-y-[-2px] transition-transform duration-300 cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <span className="text-label-md text-outline">{invoice.clientName}</span>
        <StatusBadge status={overdue ? 'overdue' : invoice.status} />
      </div>
      <div className="flex flex-col">
        <span className="text-headline-md font-bold text-on-surface">{formatCurrency(total)}</span>
        <span className="text-label-sm text-outline mt-1">{invoice.invoiceNumber} &middot; {formatDate(invoice.createdAt)}</span>
      </div>
    </div>
  );
});

InvoiceCard.displayName = 'InvoiceCard';
export default InvoiceCard;
