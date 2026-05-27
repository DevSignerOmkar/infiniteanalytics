export const generateId = () =>
  `inv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);

export const formatDate = (dateStr) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr));

export const getDaysOverdue = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = Math.floor((now - due) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

export const isOverdue = (dueDate, status) => {
  if (status === 'paid') return false;
  return new Date(dueDate) < new Date();
};

export const calculateItemTotal = (quantity, rate) =>
  Number((quantity * rate).toFixed(2));

export const calculateSubtotal = (items) =>
  Number(items.reduce((sum, item) => sum + calculateItemTotal(item.quantity, item.rate), 0).toFixed(2));

export const calculateTax = (subtotal, taxRate = 0) =>
  Number((subtotal * (taxRate / 100)).toFixed(2));

export const calculateTotal = (subtotal, tax) =>
  Number((subtotal + tax).toFixed(2));

export const getDefaultInvoice = () => ({
  id: '',
  invoiceNumber: '',
  clientName: '',
  clientEmail: '',
  items: [
    { id: generateId(), description: '', quantity: 1, rate: 0, type: 'service' },
  ],
  notes: '',
  paymentInstructions: '',
  dueDate: '',
  status: 'pending',
  createdAt: '',
  taxRate: 0,
});
