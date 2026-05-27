import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AnalyticsSection from '../../components/dashboard/AnalyticsSection';
import RecentInvoices from '../../components/dashboard/RecentInvoices';
import Icon from '../../components/ui/Icon';
import { useInvoices } from '../../hooks/useInvoices';
import { formatCurrency } from '../../utils/helpers';

const isThisMonth = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('all');
  const { filteredInvoices, loading, fetchInvoices, openDrawer } = useInvoices();

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const displayInvoices = useMemo(
    () => (timeRange === 'this-month' ? filteredInvoices.filter((i) => isThisMonth(i.createdAt)) : filteredInvoices),
    [timeRange, filteredInvoices],
  );

  const pendingInvoices = displayInvoices.filter((i) => i.status === 'pending');
  const upcomingDue = pendingInvoices.slice(0, 3);

  return (
    <div className="space-y-lg">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h1 className="text-headline-lg font-bold text-on-surface">Executive Overview</h1>
          <p className="text-body-md text-on-surface-variant">Welcome back. Here&apos;s a look at your financial health.</p>
        </div>
        <div className="flex gap-sm">
          <button
            onClick={() => setTimeRange(timeRange === 'this-month' ? 'all' : 'this-month')}
            className={`flex items-center gap-xs px-md py-2 rounded-xl text-label-md transition-all ${
              timeRange === 'this-month'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-high'
            }`}
          >
            <Icon name="calendar_today" size={18} />
            {timeRange === 'this-month' ? 'This Month' : 'All Time'}
          </button>
        </div>
      </div>

      <AnalyticsSection invoices={displayInvoices} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
        <div className="bg-white p-md rounded-xl custom-shadow border border-outline-variant/30 flex flex-col">
          <h3 className="text-headline-sm font-bold mb-md">Invoice Status</h3>
          {(() => {
            const total = displayInvoices.length || 1;
            const paid = displayInvoices.filter((i) => i.status === 'paid').length;
            const pending = displayInvoices.filter((i) => i.status === 'pending').length;
            const overdue = displayInvoices.filter((i) => i.status === 'overdue').length;
            const sent = displayInvoices.filter((i) => i.status === 'sent').length;
            const paidPct = (paid / total) * 100;
            const pendingPct = (pending / total) * 100;
            const overduePct = (overdue / total) * 100;
            const sentPct = (sent / total) * 100;
            return (
              <div className="flex flex-row items-center gap-md">
                <div className="w-28 h-28 shrink-0 relative">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(
                        #4648D4 0% ${paidPct}%,
                        #6B38D4 ${paidPct}% ${paidPct + pendingPct}%,
                        #BA1A1A ${paidPct + pendingPct}% ${paidPct + pendingPct + overduePct}%,
                        #6063EE ${paidPct + pendingPct + overduePct}% 100%
                      )`,
                    }}
                  >
                    <div className="absolute inset-[6px] bg-white rounded-full flex flex-col items-center justify-center">
                      <span className="text-headline-sm font-bold text-on-surface">{total}</span>
                      <span className="text-label-md text-outline font-medium">Total</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-sm">
                  <div className="flex items-center justify-between px-sm py-xs rounded-lg bg-primary/5">
                    <div className="flex items-center gap-sm">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="text-label-md text-on-surface font-medium">Paid</span>
                    </div>
                      <span className="text-label-md font-bold text-on-surface">{paid}</span>
                  </div>
                  <div className="flex items-center justify-between px-sm py-xs rounded-lg bg-secondary/5">
                    <div className="flex items-center gap-sm">
                      <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                      <span className="text-label-md text-on-surface font-medium">Pending</span>
                    </div>
                      <span className="text-label-md font-bold text-on-surface">{pending}</span>
                  </div>
                  <div className="flex items-center justify-between px-sm py-xs rounded-lg bg-error/5">
                    <div className="flex items-center gap-sm">
                      <div className="w-2.5 h-2.5 rounded-full bg-error" />
                      <span className="text-label-md text-on-surface font-medium">Overdue</span>
                    </div>
                      <span className="text-label-md font-bold text-on-surface">{overdue}</span>
                  </div>
                  <div className="flex items-center justify-between px-sm py-xs rounded-lg bg-primary-container/10">
                    <div className="flex items-center gap-sm">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                      <span className="text-label-md text-on-surface font-medium">Sent</span>
                    </div>
                      <span className="text-label-md font-bold text-on-surface">{sent}</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="bg-white p-md rounded-xl custom-shadow border border-outline-variant/30 flex flex-col">
          <div className="flex items-center justify-between mb-md">
            <h3 className="text-headline-sm font-bold">Upcoming Due</h3>
            <button
              onClick={() => navigate('/invoices?status=pending')}
              className="text-primary text-label-md font-bold hover:underline"
            >
              View All
            </button>
          </div>
          <div className="flex flex-col flex-1 gap-sm">
            {upcomingDue.length === 0 ? (
              <p className="text-body-sm text-on-surface-variant text-center py-4">No pending invoices</p>
            ) : (
              upcomingDue.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-sm bg-surface-container-low rounded-xl border border-outline-variant/30 cursor-pointer hover:bg-surface-container transition-colors flex-1"
                  onClick={() => openDrawer(inv)}
                >
                  <div className="flex flex-col gap-xs">
                    <span className="text-label-md font-bold">{inv.clientName}</span>
                    <span className="text-label-sm text-outline">
                      Due {inv.dueDate ? `in ${Math.ceil((new Date(inv.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days` : 'N/A'}
                    </span>
                  </div>
                  <span className="text-body-sm font-bold text-on-surface">
                    {formatCurrency(inv.items.reduce((s, it) => s + it.quantity * it.rate, 0))}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl custom-shadow border border-outline-variant/30 overflow-hidden">
        <div className="p-lg flex items-center justify-between border-b border-outline-variant/30">
          <h3 className="text-headline-sm font-bold">Recent Invoices</h3>
          <button
            onClick={() => navigate('/invoices')}
            className="text-primary text-label-md font-bold hover:underline"
          >
            View All
          </button>
        </div>
        <RecentInvoices
          invoices={displayInvoices}
          loading={loading}
          onInvoiceClick={openDrawer}
        />
      </div>
    </div>
  );
};

export default Dashboard;
