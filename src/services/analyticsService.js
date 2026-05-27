import { STORAGE_KEYS } from '../constants';
import { isOverdue, calculateSubtotal, calculateTax, calculateTotal } from '../utils/helpers';

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

const getAll = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const analyticsService = {
  async getAnalytics() {
    await delay();
    const invoices = getAll();
    const updatedInvoices = invoices.map((inv) => ({
      ...inv,
      status: isOverdue(inv.dueDate, inv.status) ? 'overdue' : inv.status,
    }));

    const totalInvoices = updatedInvoices.length;
    const paidInvoices = updatedInvoices.filter((i) => i.status === 'paid');
    const pendingInvoices = updatedInvoices.filter((i) => i.status === 'pending');
    const overdueInvoices = updatedInvoices.filter((i) => i.status === 'overdue');
    const sentInvoices = updatedInvoices.filter((i) => i.status === 'sent');

    const totalRevenue = paidInvoices.reduce((sum, inv) => {
      const sub = calculateSubtotal(inv.items);
      const tax = calculateTax(sub, inv.taxRate);
      return sum + calculateTotal(sub, tax);
    }, 0);

    const outstanding = [...pendingInvoices, ...overdueInvoices].reduce((sum, inv) => {
      const sub = calculateSubtotal(inv.items);
      const tax = calculateTax(sub, inv.taxRate);
      return sum + calculateTotal(sub, tax);
    }, 0);

    return {
      totalInvoices,
      totalRevenue,
      outstanding,
      paidCount: paidInvoices.length,
      pendingCount: pendingInvoices.length,
      overdueCount: overdueInvoices.length,
      sentCount: sentInvoices.length,
      paidPercentage: totalInvoices ? ((paidInvoices.length / totalInvoices) * 100).toFixed(1) : 0,
    };
  },
};
