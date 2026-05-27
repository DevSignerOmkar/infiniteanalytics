import Table from '../ui/Table';
import StatusBadge from '../ui/StatusBadge';
import Icon from '../ui/Icon';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { calculateSubtotal, calculateTax, calculateTotal } from '../../utils/helpers';

const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

const avatarColors = [
  'bg-secondary-container/20 text-secondary',
  'bg-primary-container/20 text-primary',
  'bg-tertiary-container/20 text-tertiary',
  'bg-surface-container-highest text-outline',
  'bg-secondary-fixed text-secondary',
  'bg-primary-fixed text-primary',
];

const InvoiceTable = ({ invoices, onRowClick, onSendEmail, loading }) => {
  const columns = [
    {
      key: 'invoiceNumber', label: 'Invoice ID', className: 'w-40',
      render: (val) => <span className="text-label-md font-bold text-primary">#{val}</span>,
    },
    {
      key: 'clientName', label: 'Client',
      render: (_, row) => {
        const colorIdx = row.invoiceNumber?.length % avatarColors.length || 0;
        return (
          <div className="flex items-center gap-md">
            <div className={`w-8 h-8 rounded-full ${avatarColors[colorIdx]} flex items-center justify-center font-bold text-label-sm`}>
              {getInitials(row.clientName)}
            </div>
            <span className="text-body-md font-medium">{row.clientName}</span>
          </div>
        );
      },
    },
    {
      key: 'total', label: 'Amount',
      render: (_, row) => {
        const sub = calculateSubtotal(row.items);
        const tax = calculateTax(sub, row.taxRate);
        return <span className="text-body-md font-bold">{formatCurrency(calculateTotal(sub, tax))}</span>;
      },
    },
    {
      key: 'dueDate', label: 'Due Date',
      render: (val, row) => {
        const isLate = row.status !== 'paid' && val && new Date(val) < new Date();
        return (
          <span className={`text-body-sm ${isLate ? 'text-error font-medium' : 'text-on-surface-variant'}`}>
            {val ? formatDate(val) : '-'}
          </span>
        );
      },
    },
    {
      key: 'status', label: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'createdAt', label: 'Created',
      render: (val) => <span className="text-body-sm text-outline">{val ? formatDate(val) : '-'}</span>,
    },
    {
      key: '_share', label: 'Share', className: 'w-20',
      render: (_, row) => (
        <button
          onClick={(e) => { e.stopPropagation(); onSendEmail?.(row); }}
          className="p-1.5 text-outline hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
          title="Send via Email"
        >
          <Icon name="mail" size={18} />
        </button>
      ),
    },
    {
      key: '_action', label: '', className: 'w-16',
      render: () => (
        <div className="text-right">
          <Icon name="chevron_right" className="text-outline group-hover:text-primary transition-colors" />
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={invoices}
      onRowClick={onRowClick}
      emptyMessage={loading ? 'Loading invoices...' : 'No invoices found'}
    />
  );
};

export default InvoiceTable;
