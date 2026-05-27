export const INVOICE_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  OVERDUE: 'overdue',
  SENT: 'sent',
};

export const FILTER_OPTIONS = [
  { label: 'All Invoices', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Sent', value: 'sent' },
];

export const ITEM_TYPES = [
  { label: 'Service', value: 'service' },
  { label: 'Product', value: 'product' },
];

export const CURRENCY = 'USD';

export const STORAGE_KEYS = {
  INVOICES: 'invoicehub_invoices',
};
