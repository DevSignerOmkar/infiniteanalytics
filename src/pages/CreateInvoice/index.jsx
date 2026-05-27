import { useCallback, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InvoiceForm from '../../components/invoice/InvoiceForm';
import InvoiceSummary from '../../components/invoice/InvoiceSummary';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import { useInvoices } from '../../hooks/useInvoices';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { invoices, createInvoice, updateInvoice, loading } = useInvoices();
  const formRef = useRef(null);
  const [summary, setSummary] = useState({ subtotal: 0, tax: 0, total: 0, taxRate: 0 });

  const existingInvoice = id ? invoices.find((inv) => inv.id === id) : null;

  const handleSubmit = useCallback(async (data) => {
    if (existingInvoice) {
      await updateInvoice(existingInvoice.id, data);
    } else {
      await createInvoice(data);
    }
    navigate('/invoices');
  }, [existingInvoice, createInvoice, updateInvoice, navigate]);

  const handleSend = useCallback(() => {
    formRef.current?.submit();
  }, []);

  const handleFormChange = useCallback((values) => {
    setSummary(values);
  }, []);

  const handleDraft = useCallback(() => {
    const data = formRef.current?.getFormData();
    if (data) {
      localStorage.setItem('draft_invoice', JSON.stringify(data));
      navigate('/invoices');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col lg:flex-row gap-lg">
      <InvoiceForm
        ref={formRef}
        initialData={existingInvoice}
        onSubmit={handleSubmit}
        loading={loading}
        onChange={handleFormChange}
      />

      <aside className="w-full lg:w-[380px]">
        <div className="sticky top-24 space-y-lg">
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-lg shadow-md">
            <h3 className="text-headline-sm text-on-surface mb-lg font-bold">Summary</h3>
            <InvoiceSummary
              subtotal={summary.subtotal}
              taxRate={summary.taxRate}
              tax={summary.tax}
              total={summary.total}
            />
            <div className="space-y-md">
              <Button className="w-full" onClick={handleSend} loading={loading}>
                <Icon name="send" className="mr-1" />
                Send Invoice
              </Button>
              <Button variant="secondary" className="w-full" type="button" onClick={handleDraft}>
                <Icon name="save" size={14} className="mr-1" />
                Save Draft
              </Button>
            </div>
          </div>

          <div className="bg-secondary-container/5 border border-secondary/10 rounded-xl p-md flex items-start gap-md">
            <Icon name="lightbulb" className="text-secondary shrink-0" filled />
            <p className="text-label-sm text-on-surface-variant leading-relaxed">
              FluxInvoice Pro tip: Invoices sent before 10 AM are paid 15% faster on average.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CreateInvoice;