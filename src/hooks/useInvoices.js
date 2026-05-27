import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  markInvoicePaid,
  sendInvoice,
  setFilter,
  setSearch,
  openDrawer,
  closeDrawer,
  selectFilteredInvoices,
} from '../store/slices/invoiceSlice';

export const useInvoices = () => {
  const dispatch = useDispatch();
  const { items, selectedInvoice, filters, loading, error, drawerOpen } =
    useSelector((state) => state.invoices);
  const filteredInvoices = useSelector(selectFilteredInvoices);

  const stableFetchInvoices = useCallback(() => dispatch(fetchInvoices()), [dispatch]);
  const stableCreateInvoice = useCallback((data) => dispatch(createInvoice(data)), [dispatch]);
  const stableUpdateInvoice = useCallback((id, updates) => dispatch(updateInvoice({ id, updates })), [dispatch]);
  const stableDeleteInvoice = useCallback((id) => dispatch(deleteInvoice(id)), [dispatch]);
  const stableMarkInvoicePaid = useCallback((id) => dispatch(markInvoicePaid(id)), [dispatch]);
  const stableSendInvoice = useCallback((id) => dispatch(sendInvoice(id)), [dispatch]);
  const stableSetFilter = useCallback((f) => dispatch(setFilter(f)), [dispatch]);
  const stableSetSearch = useCallback((q) => dispatch(setSearch(q)), [dispatch]);
  const stableOpenDrawer = useCallback((inv) => dispatch(openDrawer(inv)), [dispatch]);
  const stableCloseDrawer = useCallback(() => dispatch(closeDrawer()), [dispatch]);

  const analytics = useMemo(() => {
    const total = items.length;
    const paid = items.filter((i) => i.status === 'paid').length;
    const pending = items.filter((i) => i.status === 'pending').length;
    const overdue = items.filter((i) => i.status === 'overdue').length;
    const sent = items.filter((i) => i.status === 'sent').length;
    return { total, paid, pending, overdue, sent };
  }, [items]);

  return {
    invoices: items,
    filteredInvoices,
    selectedInvoice,
    filters,
    loading,
    error,
    drawerOpen,
    analytics,
    fetchInvoices: stableFetchInvoices,
    createInvoice: stableCreateInvoice,
    updateInvoice: stableUpdateInvoice,
    deleteInvoice: stableDeleteInvoice,
    markInvoicePaid: stableMarkInvoicePaid,
    sendInvoice: stableSendInvoice,
    setFilter: stableSetFilter,
    setSearch: stableSetSearch,
    openDrawer: stableOpenDrawer,
    closeDrawer: stableCloseDrawer,
  };
};
