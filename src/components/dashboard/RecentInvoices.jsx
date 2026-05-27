import InvoiceTable from '../invoice/InvoiceTable';
import EmptyState from '../ui/EmptyState';
import { useNavigate } from 'react-router-dom';

const RecentInvoices = ({ invoices = [], loading, onInvoiceClick }) => {
  const navigate = useNavigate();

  if (!invoices.length && !loading) {
    return (
      <EmptyState
        title="No invoices yet"
        description="Create your first invoice to get started"
        actionLabel="Create Invoice"
        onAction={() => navigate('/create')}
      />
    );
  }

  return (
    <InvoiceTable
      invoices={invoices.slice(0, 5)}
      onRowClick={onInvoiceClick}
      loading={loading}
    />
  );
};

export default RecentInvoices;
