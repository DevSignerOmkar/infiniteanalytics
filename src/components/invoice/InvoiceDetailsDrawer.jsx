import { useCallback } from 'react';
import Drawer from '../ui/Drawer';
import StatusBadge from '../ui/StatusBadge';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { formatCurrency, formatDate, calculateSubtotal, calculateTax, calculateTotal } from '../../utils/helpers';

const InvoiceDetailsDrawer = ({ invoice, isOpen, onClose, onMarkPaid, onDelete, onEdit, loading }) => {
  if (!invoice) return null;

  const subtotal = calculateSubtotal(invoice.items);
  const tax = calculateTax(subtotal, invoice.taxRate);
  const total = calculateTotal(subtotal, tax);

  const handlePdf = useCallback(() => {
    window.print();
  }, []);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`#${invoice.invoiceNumber}`}>
      <div className="print-area space-y-xl">
      <div className="no-print flex items-center justify-between p-lg bg-surface-container-low rounded-xl">
        <span className="text-label-sm uppercase text-outline font-bold">Current Status</span>
        <StatusBadge status={invoice.status} />
      </div>

      <div className="grid grid-cols-2 gap-xl">
        <div className="space-y-sm">
          <h4 className="text-label-sm uppercase text-outline font-bold">Bill To</h4>
          <div>
            <p className="text-body-md font-bold">{invoice.clientName}</p>
            <p className="text-body-sm text-primary font-medium mt-sm">{invoice.clientEmail}</p>
          </div>
        </div>
        <div className="space-y-sm text-right">
          <h4 className="text-label-sm uppercase text-outline font-bold">Payment Details</h4>
          <div>
            <p className="text-body-sm text-on-surface-variant">Created: {formatDate(invoice.createdAt)}</p>
            <p className="text-body-sm text-on-surface-variant">Due: {formatDate(invoice.dueDate)}</p>
          </div>
        </div>
      </div>

      <div className="border border-outline-variant rounded-xl overflow-hidden">
        <div className="bg-surface-container-low px-md py-sm border-b border-outline-variant">
          <h4 className="text-label-sm uppercase text-outline font-bold">Invoice Items</h4>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="px-md py-sm text-label-sm text-outline">Description</th>
              <th className="px-md py-sm text-label-sm text-outline text-right">Qty</th>
              <th className="px-md py-sm text-label-sm text-outline text-right">Price</th>
              <th className="px-md py-sm text-label-sm text-outline text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="px-md py-lg">
                  <p className="text-body-sm font-bold">{item.description || 'Untitled'}</p>
                </td>
                <td className="px-md py-lg text-right text-body-sm">{item.quantity}</td>
                <td className="px-md py-lg text-right text-body-sm">{formatCurrency(item.rate)}</td>
                <td className="px-md py-lg text-right text-body-sm font-bold">{formatCurrency(item.quantity * item.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-outline-variant px-md py-lg bg-surface-container-low/30">
          <div className="ml-auto w-64 space-y-2">
            <div className="flex justify-between text-body-sm text-on-surface-variant">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-body-sm text-on-surface-variant">
              <span>Tax ({invoice.taxRate}%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-outline-variant">
              <span className="text-headline-sm font-black">Total</span>
              <span className="text-headline-sm font-black text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {invoice.paymentInstructions && (
        <div className="p-lg bg-surface-container-low rounded-xl border border-outline-variant/30">
          <div className="flex gap-sm items-start">
            <Icon name="payments" className="text-outline" />
            <div className="space-y-xs">
              <h5 className="text-label-md font-bold text-on-surface">Payment Instructions</h5>
              <p className="text-body-sm text-on-surface-variant whitespace-pre-line">{invoice.paymentInstructions}</p>
            </div>
          </div>
        </div>
      )}
      </div>

      <div className="flex gap-md pt-lg border-t border-outline-variant">
        <Button variant="secondary" className="flex-1" onClick={handlePdf}>
          <Icon name="download" size={16} className="mr-1" />
          PDF
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => { onEdit?.(invoice.id); onClose(); }}
        >
          <Icon name="edit" size={16} className="mr-1" />
          Edit
        </Button>
        <Button variant="danger" className="flex-1" onClick={() => onDelete(invoice.id)} loading={loading}>
          <Icon name="delete" size={16} className="mr-1" />
          Delete
        </Button>
        <Button
          variant="success"
          className="flex-[2]"
          onClick={() => onMarkPaid(invoice.id)}
          loading={loading}
          disabled={invoice.status === 'paid'}
        >
          <Icon name="check_circle" size={16} className="mr-1" />
          Mark as Paid
        </Button>
      </div>
    </Drawer>
  );
};

export default InvoiceDetailsDrawer;
