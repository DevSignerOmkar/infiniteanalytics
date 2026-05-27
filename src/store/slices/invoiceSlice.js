import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { invoiceService } from '../../services/invoiceService';
import { isOverdue } from '../../utils/helpers';

export const fetchInvoices = createAsyncThunk('invoices/fetchAll', async () => {
  return invoiceService.fetchInvoices();
});

export const createInvoice = createAsyncThunk('invoices/create', async (invoice) => {
  return invoiceService.createInvoice(invoice);
});

export const updateInvoice = createAsyncThunk('invoices/update', async ({ id, updates }) => {
  return invoiceService.updateInvoice(id, updates);
});

export const deleteInvoice = createAsyncThunk('invoices/delete', async (id) => {
  await invoiceService.deleteInvoice(id);
  return id;
});

export const markInvoicePaid = createAsyncThunk('invoices/markPaid', async (id) => {
  return invoiceService.markAsPaid(id);
});

export const sendInvoice = createAsyncThunk('invoices/send', async (id) => {
  return invoiceService.sendInvoice(id);
});

const initialState = {
  items: [],
  selectedInvoice: null,
  filters: { status: 'all', search: '' },
  loading: false,
  error: null,
  drawerOpen: false,
};

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearch(state, action) {
      state.filters.search = action.payload;
    },
    openDrawer(state, action) {
      state.selectedInvoice = action.payload;
      state.drawerOpen = true;
    },
    closeDrawer(state) {
      state.drawerOpen = false;
      state.selectedInvoice = null;
    },
    clearSelectedInvoice(state) {
      state.selectedInvoice = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    };

    builder
      .addCase(fetchInvoices.pending, handlePending)
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInvoices.rejected, handleRejected)

      .addCase(createInvoice.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      .addCase(updateInvoice.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.selectedInvoice?.id === action.payload.id) {
          state.selectedInvoice = action.payload;
        }
      })

      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
        if (state.selectedInvoice?.id === action.payload) {
          state.selectedInvoice = null;
          state.drawerOpen = false;
        }
      })

      .addCase(markInvoicePaid.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.selectedInvoice?.id === action.payload.id) {
          state.selectedInvoice = action.payload;
        }
      })

      .addCase(sendInvoice.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.selectedInvoice?.id === action.payload.id) {
          state.selectedInvoice = action.payload;
        }
      });
  },
});

export const {
  setFilter,
  setSearch,
  openDrawer,
  closeDrawer,
  clearSelectedInvoice,
} = invoiceSlice.actions;

export const selectFilteredInvoices = (state) => {
  const { items, filters } = state.invoices;
  return items
    .map((inv) => ({
      ...inv,
      status: isOverdue(inv.dueDate, inv.status) ? 'overdue' : inv.status,
    }))
    .filter((inv) => {
      if (filters.status !== 'all' && inv.status !== filters.status) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          inv.invoiceNumber?.toLowerCase().includes(q) ||
          inv.clientName?.toLowerCase().includes(q) ||
          inv.clientEmail?.toLowerCase().includes(q)
        );
      }
      return true;
    });
};

export default invoiceSlice.reducer;
