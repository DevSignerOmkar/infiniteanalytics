import { useState, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react';
import Input from '../ui/Input';
import Icon from '../ui/Icon';
import InvoiceItemRow from './InvoiceItemRow';
import { generateId, calculateSubtotal, calculateTax, calculateTotal, getDefaultInvoice } from '../../utils/helpers';

const emptyItem = () => ({ id: generateId(), description: '', quantity: 1, rate: 0, type: 'service' });

const InvoiceForm = forwardRef(({ initialData, onSubmit, loading, onChange }, ref) => {
  const [form, setForm] = useState(() => ({
    ...getDefaultInvoice(),
    ...initialData,
    items: initialData?.items?.length ? initialData.items : [emptyItem()],
  }));

  const subtotal = calculateSubtotal(form.items);
  const tax = calculateTax(subtotal, form.taxRate);
  const total = calculateTotal(subtotal, tax);

  useEffect(() => {
    onChange?.({ subtotal, tax, total, taxRate: form.taxRate });
  }, [subtotal, tax, total, form.taxRate, onChange]);

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleItemChange = useCallback((index, field, value) => {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  }, []);

  const addItem = useCallback(() => {
    setForm((prev) => ({ ...prev, items: [...prev.items, emptyItem()] }));
  }, []);

  const removeItem = useCallback((index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSubmit({ ...form, subtotal, tax, total });
  }, [form, subtotal, tax, total, onSubmit]);

  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit({ preventDefault: () => {} }),
    getFormData: () => form,
  }), [handleSubmit, form]);

  return (
    <form onSubmit={handleSubmit} className="flex-grow max-w-4xl space-y-md print-area">
      <div className="flex justify-between items-center pb-md border-b border-outline-variant/30">
        <h1 className="text-headline-lg text-on-surface font-bold">
          {initialData?.id ? 'Edit Invoice' : 'Create Invoice'}
        </h1>
        <div className="text-right">
          <p className="text-label-sm text-outline uppercase tracking-wider">Invoice Number</p>
          <p className="text-title-md text-primary font-bold">{form.invoiceNumber || 'INV-NEW'}</p>
        </div>
      </div>

      <div className="space-y-sm">
        <div>
          <label className="text-body-md text-on-surface font-bold mb-xs block">Client</label>
          <div className="flex gap-sm">
            <div className="flex-1">
              <Input
                id="clientName"
                placeholder="Client name"
                value={form.clientName}
                onChange={(e) => handleChange('clientName', e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <Input
                id="clientEmail"
                type="email"
                placeholder="Client email"
                value={form.clientEmail}
                onChange={(e) => handleChange('clientEmail', e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-sm">
          <Input
            id="dueDate"
            label="Created"
            type="date"
            value={form.createdAt?.split('T')[0] || ''}
            onChange={(e) => handleChange('createdAt', new Date(e.target.value).toISOString())}
          />
          <Input
            id="dueDate2"
            label="Due Date"
            type="date"
            value={form.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            required
          />
          <Input
            id="taxRate"
            label="Tax %"
            type="number"
            min="0"
            max="100"
            step="0.1"
            placeholder="e.g. 10"
            value={form.taxRate}
            onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-sm overflow-hidden">
        <div className="px-md py-sm bg-surface-container-low border-b border-outline-variant/30">
          <h3 className="text-body-md text-on-surface uppercase tracking-widest font-bold">Line Items</h3>
        </div>
        <div className="p-md">
          <div className="hidden md:grid grid-cols-12 gap-md text-label-sm text-outline mb-sm px-sm">
            <div className="col-span-6">DESCRIPTION</div>
            <div className="col-span-2 text-center">QTY</div>
            <div className="col-span-2 text-right">RATE</div>
            <div className="col-span-2 text-right">TOTAL</div>
          </div>
          <div className="space-y-xs">
            {form.items.map((item, index) => (
              <InvoiceItemRow
                key={item.id}
                item={item}
                index={index}
                onChange={handleItemChange}
                onRemove={removeItem}
                isRemovable={form.items.length > 1}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-sm flex items-center gap-sm text-primary font-semibold hover:bg-primary-container/10 px-sm py-xs rounded-lg transition-all text-label-sm no-print"
          >
            <Icon name="add" size={14} />
            Add Line Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div>
          <label className="text-body-md text-on-surface font-bold mb-xs block">Notes</label>
          <textarea
            rows={2}
            className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-sm text-body-sm focus:border-primary transition-all outline-none resize-none"
            placeholder="Thanks for your business!"
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
        </div>
        <div>
          <label className="text-body-md text-on-surface font-bold mb-xs block">Payment Instructions</label>
          <textarea
            rows={2}
            className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-sm text-body-sm focus:border-primary transition-all outline-none resize-none"
            placeholder="Bank: FluxBank, Account: 123456789, SWIFT: FLUXUS"
            value={form.paymentInstructions}
            onChange={(e) => handleChange('paymentInstructions', e.target.value)}
          />
        </div>
      </div>
    </form>
  );
});

InvoiceForm.displayName = 'InvoiceForm';
export default InvoiceForm;