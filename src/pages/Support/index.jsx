import { useState } from 'react';
import Icon from '../../components/ui/Icon';

const faqs = [
  {
    q: 'How to create an invoice?',
    a: 'Navigate to the Create Invoice page from the sidebar. Fill in your client details, add line items with descriptions, quantities, and rates. You can set a tax rate and due date before generating the invoice. Once ready, click "Save Invoice" to save it or "Save & Send" to email it directly to your client.',
  },
  {
    q: 'How long do payment processing times take?',
    a: 'Payments are typically processed within 1-3 business days. Bank transfers may take 2-5 business days depending on your financial institution. Credit card payments via our integrated payment gateway are usually reflected instantly in your account balance.',
  },
  {
    q: 'How to manage my clients?',
    a: 'You can manage your clients directly from the invoice creation flow. Add a new client by typing their name and email, and they will be saved automatically for future invoices. Client details are stored securely and can be reused across multiple invoices.',
  },
  {
    q: 'Can I customize the invoice template?',
    a: 'Yes, you can customize your invoice appearance including colors, logo, and layout. Go to Settings > Invoice Customization to upload your company logo, choose accent colors, and configure default payment terms and notes that will appear on every invoice.',
  },
  {
    q: 'How is my data kept secure?',
    a: 'We use industry-standard 256-bit SSL encryption for all data in transit and at rest. Your financial information is stored securely in compliance with data protection regulations. We perform regular security audits and never share your data with third parties without your explicit consent.',
  },
];

const Support = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-lg">
      <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-lg md:p-xl text-center">
        <Icon name="help" size={48} className="text-on-primary mb-md opacity-80" />
        <h1 className="text-headline-lg font-bold text-on-primary mb-sm">How can we help you?</h1>
      
      </div>

      <div>
        <h2 className="text-headline-md font-bold text-on-surface mb-md">Frequently Asked Questions</h2>
        <div className="space-y-sm">
          {faqs.length === 0 ? (
            <p className="text-body-md text-on-surface-variant text-center py-lg">No matching questions found. Try a different search term.</p>
          ) : (
            faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-outline-variant/30 custom-shadow overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-lg text-left gap-md hover:bg-surface-container-low transition-colors"
                  >
                    <span className="text-body-md font-bold text-on-surface">{faq.q}</span>
                    <Icon
                      name="chevron_right"
                      size={20}
                      className={`text-on-surface-variant shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-lg pb-lg animate-slide-up">
                      <p className="text-body-md text-on-surface-variant leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        <div className="lg:col-span-2 bg-white rounded-xl border border-outline-variant/30 custom-shadow p-lg">
          <div className="flex items-center gap-sm mb-md">
            <Icon name="mail" size={24} className="text-primary" />
            <h2 className="text-headline-md font-bold text-on-surface">Send us a message</h2>
          </div>
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-xl text-center">
              <Icon name="check_circle" size={48} className="text-primary mb-md" filled />
              <h3 className="text-headline-sm font-bold text-on-surface mb-sm">Message Sent!</h3>
              <p className="text-body-md text-on-surface-variant">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="space-y-1">
                  <label className="block text-label-md text-on-surface font-bold mb-sm" htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-label-md text-on-surface font-bold mb-sm" htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-label-md text-on-surface font-bold mb-sm" htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="How can we help?"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-label-md text-on-surface font-bold mb-sm" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[140px] resize-y"
                  placeholder="Describe your issue or question in detail..."
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-sm bg-primary text-on-primary font-bold px-lg py-sm rounded-xl text-label-md hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                <Icon name="send" size={16} />
                Send Message
              </button>
            </form>
          )}
        </div>

        <div className="space-y-md">
          <div className="bg-white rounded-xl border border-outline-variant/30 custom-shadow p-lg">
            <h3 className="text-headline-sm font-bold text-on-surface mb-md">Contact Information</h3>
            <div className="space-y-md">
              <a href="mailto:support@fluxinvoice.com" className="flex items-start gap-md p-sm -mx-sm rounded-lg hover:bg-surface-container-low transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center shrink-0">
                  <Icon name="mail" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-label-md text-on-surface-variant font-medium">Email</p>
                  <p className="text-body-sm font-bold text-on-surface group-hover:text-primary transition-colors">support@fluxinvoice.com</p>
                </div>
              </a>
              <div className="flex items-start gap-md p-sm -mx-sm rounded-lg hover:bg-surface-container-low transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center shrink-0">
                  <svg className="text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div>
                  <p className="text-label-md text-on-surface-variant font-medium">Phone</p>
                  <p className="text-body-sm font-bold text-on-surface">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-md p-sm -mx-sm rounded-lg hover:bg-surface-container-low transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center shrink-0">
                  <svg className="text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-label-md text-on-surface-variant font-medium">Live Chat</p>
                  <button className="text-body-sm font-bold text-primary hover:underline transition-all text-left">Start a conversation</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant/30 custom-shadow p-lg">
            <h3 className="text-headline-sm font-bold text-on-surface mb-md">Support Hours</h3>
            <div className="space-y-sm">
              <div className="flex justify-between items-center">
                <span className="text-body-sm text-on-surface-variant">Mon – Fri</span>
                <span className="text-body-sm font-bold text-on-surface">9:00 AM – 6:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body-sm text-on-surface-variant">Saturday</span>
                <span className="text-body-sm font-bold text-on-surface">10:00 AM – 4:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body-sm text-on-surface-variant">Sunday</span>
                <span className="text-body-sm font-bold text-error">Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
