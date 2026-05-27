import { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import InvoiceTable from '../../components/invoice/InvoiceTable';
import InvoiceDetailsDrawer from '../../components/invoice/InvoiceDetailsDrawer';
import { useInvoices } from '../../hooks/useInvoices';
import { formatCurrency, calculateSubtotal, calculateTax, calculateTotal } from '../../utils/helpers';

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Outstanding', value: 'pending' },
  { label: 'Late', value: 'overdue' },
  { label: 'Draft', value: 'draft' },
];

const sortOptions = ['Date', 'Amount', 'Client'];

const InvoiceManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('status') || 'all');
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('Date');
  const [sortOpen, setSortOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [emailModal, setEmailModal] = useState({ open: false, invoice: null });
  const [emailSending, setEmailSending] = useState(false);
  const [sentToast, setSentToast] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const {
    filteredInvoices,
    selectedInvoice,
    loading,
    drawerOpen,
    fetchInvoices,
    setFilter,
    setSearch,
    openDrawer,
    closeDrawer,
    markInvoicePaid,
    sendInvoice,
    deleteInvoice,
  } = useInvoices();

  const sortedInvoices = useMemo(() => {
    const list = [...filteredInvoices];
    switch (sortBy) {
      case 'Amount':
        return list.sort((a, b) => {
          const aTotal = calculateTotal(calculateSubtotal(a.items), calculateTax(calculateSubtotal(a.items), a.taxRate));
          const bTotal = calculateTotal(calculateSubtotal(b.items), calculateTax(calculateSubtotal(b.items), b.taxRate));
          return bTotal - aTotal;
        });
      case 'Client':
        return list.sort((a, b) => a.clientName.localeCompare(b.clientName));
      case 'Date':
      default:
        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [filteredInvoices, sortBy]);

  const handleSortSelect = useCallback((option) => {
    setSortBy(option);
    setSortOpen(false);
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  useEffect(() => {
    const status = searchParams.get('status') || 'all';
    setActiveTab(status);
    setFilter({ status });
  }, [searchParams, setFilter]);

  const handleTabChange = useCallback((value) => {
    setActiveTab(value);
    setFilter({ status: value });
    navigate(`/invoices${value === 'all' ? '' : `?status=${value}`}`, { replace: true });
  }, [setFilter, navigate]);

  const handleSearch = useCallback((e) => {
    const q = e.target.value;
    setSearchText(q);
    setSearch(q);
  }, [setSearch]);

  const handleMarkPaid = useCallback(async (id) => {
    try {
      await markInvoicePaid(id);
    } finally {
      fetchInvoices();
    }
  }, [markInvoicePaid, fetchInvoices]);

  const handleSend = useCallback(async (id) => {
    try {
      await sendInvoice(id);
    } finally {
      fetchInvoices();
    }
  }, [sendInvoice, fetchInvoices]);

  const handleDelete = useCallback(async (id) => {
    setDeleteConfirmId(null);
    try {
      await deleteInvoice(id);
    } finally {
      fetchInvoices();
    }
  }, [deleteInvoice, fetchInvoices]);

  const handleRequestDelete = useCallback((id) => {
    setDeleteConfirmId(id);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setDeleteConfirmId(null);
  }, []);

  const handleEdit = useCallback((id) => {
    navigate(`/edit/${id}`);
  }, [navigate]);

  const handleOpenEmail = useCallback((invoice) => {
    setEmailModal({ open: true, invoice });
  }, []);

  const handleSendEmail = useCallback(async () => {
    setEmailSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setEmailSending(false);
    setEmailModal({ open: false, invoice: null });
    setSentToast(true);
    setTimeout(() => setSentToast(false), 3000);
  }, []);

  return (
    <div className="space-y-xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <h2 className="text-headline-lg text-on-surface font-bold">Invoices</h2>
          <p className="text-body-md text-on-surface-variant">Manage and track your client billings</p>
        </div>
        <div className="flex flex-wrap gap-md">
          <div className="flex bg-surface-container-low p-1 rounded-xl border border-outline-variant">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`px-md py-sm rounded-lg text-label-md transition-all ${
                  activeTab === tab.value
                    ? 'bg-white shadow-sm text-primary font-bold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setSortOpen((prev) => !prev)}
              className="flex items-center gap-sm px-md py-sm bg-white border border-outline-variant rounded-xl text-label-md text-on-surface-variant hover:border-primary hover:text-primary transition-all"
            >
              <Icon name="filter_list" />
              Sort by: {sortBy}
              <Icon name={sortOpen ? 'expand_less' : 'expand_more'} size={16} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-outline-variant rounded-xl shadow-xl z-10 py-sm">
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSortSelect(opt)}
                    className={`w-full text-left px-md py-sm text-body-sm transition-all hover:bg-surface-container-low ${
                      sortBy === opt ? 'text-primary font-bold bg-primary-container/20' : 'text-on-surface-variant'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-md">
        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={20} />
        <input
          className="w-full bg-surface-container-low border border-outline-variant rounded-full py-sm pl-10 pr-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-body-sm transition-all"
          placeholder="Search invoices, clients..."
          value={searchText}
          onChange={handleSearch}
        />
      </div>

      <div className="bg-white rounded-xxl border border-outline-variant overflow-hidden custom-shadow">
        <InvoiceTable
          invoices={sortedInvoices}
          onRowClick={openDrawer}
          onSendEmail={handleOpenEmail}
          loading={loading}
        />
      </div>

      <InvoiceDetailsDrawer
        invoice={selectedInvoice}
        isOpen={drawerOpen}
        onClose={closeDrawer}
        onMarkPaid={handleMarkPaid}
        onSend={handleSend}
        onDelete={handleRequestDelete}
        onEdit={handleEdit}
        loading={loading}
      />

      <Modal isOpen={!!deleteConfirmId} onClose={handleCancelDelete} title="Delete Invoice" size="sm">
        <p className="text-body-md text-on-surface-variant mb-lg">
          Are you sure you want to delete{' '}
          <span className="font-bold text-on-surface">
            {selectedInvoice?.invoiceNumber || 'this invoice'}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex gap-md justify-end">
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(deleteConfirmId)}
          >
            Delete
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={emailModal.open}
        onClose={() => setEmailModal({ open: false, invoice: null })}
        title="Send Invoice via Email"
        size="lg"
        key={emailModal.invoice?.id || 'email'}
      >
        <div className="space-y-lg">
          <Input
            label="To"
            value={emailModal.invoice?.clientEmail || ''}
            onChange={() => {}}
          />
          <Input
            label="Subject"
            value={emailModal.invoice ? `Invoice #${emailModal.invoice.invoiceNumber} from FluxInvoice` : ''}
            onChange={() => {}}
          />
          <div className="space-y-1">
            <label className="block text-label-md text-on-surface font-bold mb-sm">Message</label>
            <textarea
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[160px] resize-y"
              defaultValue={(() => {
                const inv = emailModal.invoice;
                if (!inv) return '';
                const sub = calculateSubtotal(inv.items);
                const tax = calculateTax(sub, inv.taxRate);
                const total = formatCurrency(calculateTotal(sub, tax));
                const lineItems = inv.items.map((item) => {
                  const lineTotal = formatCurrency(item.quantity * item.rate);
                  return `  ${item.description || 'Untitled'} — ${item.quantity} × ${formatCurrency(item.rate)} = ${lineTotal}`;
                }).join('\n');
                return `Dear ${inv.clientName},

Please find below the details for invoice #${inv.invoiceNumber}:

${lineItems}

Subtotal: ${formatCurrency(sub)}
Tax (${inv.taxRate}%): ${formatCurrency(tax)}
Total: ${total}

Thank you for your business.

Best regards,
FluxInvoice Team`;
              })()}
            />
          </div>
          <div className="flex gap-md justify-end pt-md border-t border-outline-variant">
            <Button
              variant="secondary"
              onClick={() => setEmailModal({ open: false, invoice: null })}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSendEmail}
              loading={emailSending}
            >
              <Icon name="send" size={16} className="mr-1" />
              Send
            </Button>
          </div>
        </div>
      </Modal>

      {sentToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-md bg-primary text-on-primary px-lg py-md rounded-xl shadow-2xl animate-slide-up">
          <Icon name="check_circle" size={20} filled />
          <span className="text-body-md font-medium">Invoice sent successfully!</span>
        </div>
      )}
    </div>
  );
};

export default InvoiceManagement;
