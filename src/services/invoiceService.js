import { STORAGE_KEYS } from '../constants';
import { generateId, isOverdue } from '../utils/helpers';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const getAll = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveAll = (invoices) => {
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
};

export const invoiceService = {
  async fetchInvoices() {
    await delay();
    const invoices = getAll().map((inv) => ({
      ...inv,
      status: isOverdue(inv.dueDate, inv.status) ? 'overdue' : inv.status,
    }));
    saveAll(invoices);
    return [...invoices];
  },

  async getInvoiceById(id) {
    await delay();
    const invoices = getAll();
    return invoices.find((inv) => inv.id === id) || null;
  },

  async createInvoice(invoice) {
    await delay();
    const invoices = getAll();
    const now = new Date().toISOString();
    const newInvoice = {
      ...invoice,
      id: generateId(),
      invoiceNumber: `INV-${String(invoices.length + 1).padStart(4, '0')}`,
      createdAt: now,
      status: invoice.status || 'pending',
    };
    saveAll([newInvoice, ...invoices]);
    return newInvoice;
  },

  async updateInvoice(id, updates) {
    await delay();
    const invoices = getAll();
    const index = invoices.findIndex((inv) => inv.id === id);
    if (index === -1) throw new Error('Invoice not found');
    const updated = { ...invoices[index], ...updates };
    updated.status = isOverdue(updated.dueDate, updated.status)
      ? 'overdue'
      : updated.status;
    invoices[index] = updated;
    saveAll(invoices);
    return updated;
  },

  async deleteInvoice(id) {
    await delay();
    const invoices = getAll().filter((inv) => inv.id !== id);
    saveAll(invoices);
  },

  async markAsPaid(id) {
    return invoiceService.updateInvoice(id, { status: 'paid' });
  },

  async sendInvoice(id) {
    await delay();
    const invoices = getAll();
    const index = invoices.findIndex((inv) => inv.id === id);
    if (index === -1) throw new Error('Invoice not found');
    invoices[index] = { ...invoices[index], status: 'sent' };
    saveAll(invoices);
    return invoices[index];
  },
};
