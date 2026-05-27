import { useState, useRef } from 'react';
import Icon from '../../components/ui/Icon';

const Toggle = ({ enabled, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-primary' : 'bg-outline-variant'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const SectionCard = ({ title, description, children }) => (
  <div className="bg-white rounded-xl custom-shadow border border-outline-variant/30 p-lg space-y-lg">
    <div>
      <h3 className="text-headline-sm font-bold text-on-surface">{title}</h3>
      {description && <p className="text-body-sm text-on-surface-variant">{description}</p>}
    </div>
    {children}
  </div>
);

const InputField = ({ label, value, onChange, type = 'text', placeholder }) => (
  <div className="space-y-sm">
    <label className="block text-label-md text-on-surface font-bold">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-2 text-body-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div className="space-y-sm">
    <label className="block text-label-md text-on-surface font-bold">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-2 text-body-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const paymentMethods = [
  { name: 'Bank Transfer', status: 'Connected', icon: 'account_balance' },
  { name: 'Credit Card', status: 'Connected', icon: 'credit_card' },
  { name: 'PayPal', status: 'Connected', icon: 'payments' },
];

const teamMembers = [
  { name: 'Alice Roberts', email: 'alice@fluxinvoice.com', role: 'Admin', avatar: 'AR' },
  { name: 'Brian Chen', email: 'brian@fluxinvoice.com', role: 'Editor', avatar: 'BC' },
  { name: 'Clara Davis', email: 'clara@fluxinvoice.com', role: 'Viewer', avatar: 'CD' },
];

const Settings = () => {
  const [profile, setProfile] = useState({ businessName: 'FluxInvoice Inc.', email: 'hello@fluxinvoice.com', phone: '+1 (555) 789-0123' });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    reminders: true,
    marketing: false,
  });
  const [defaults, setDefaults] = useState({ duePeriod: '14', taxRate: '18', prefix: 'INV-' });
  const [security, setSecurity] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [twoFactor, setTwoFactor] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [customization, setCustomization] = useState({ defaultNotes: 'Thank you for your business!', primaryColor: '#4648d4' });
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  const updateProfile = (field) => (e) => setProfile((p) => ({ ...p, [field]: e.target.value }));
  const toggleNotification = (key) => () => setNotifications((n) => ({ ...n, [key]: !n[key] }));
  const updateDefault = (field) => (e) => setDefaults((d) => ({ ...d, [field]: e.target.value }));
  const updateSecurity = (field) => (e) => setSecurity((s) => ({ ...s, [field]: e.target.value }));
  const updateCustomization = (field) => (e) => setCustomization((c) => ({ ...c, [field]: e.target.value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogoUpload = () => fileInputRef.current?.click();

  const duePeriodOptions = [
    { value: '7', label: '7 days' },
    { value: '14', label: '14 days' },
    { value: '30', label: '30 days' },
  ];

  return (
    <div className="space-y-xl">
      <div>
        <h1 className="text-headline-lg font-bold text-on-surface">Settings</h1>
        <p className="text-body-md text-on-surface-variant">Manage your account and invoice preferences</p>
      </div>

      <SectionCard title="Profile" description="Update your business details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <InputField label="Business Name" value={profile.businessName} onChange={updateProfile('businessName')} placeholder="Your business name" />
          <InputField label="Email Address" type="email" value={profile.email} onChange={updateProfile('email')} placeholder="business@example.com" />
          <InputField label="Phone Number" type="tel" value={profile.phone} onChange={updateProfile('phone')} placeholder="+1 234 567 890" />
        </div>
      </SectionCard>

      <SectionCard title="Notifications" description="Choose how you receive updates">
        <div className="space-y-md">
          {[
            { key: 'email', label: 'Email notifications', desc: 'Receive invoice updates via email' },
            { key: 'sms', label: 'SMS alerts', desc: 'Get text messages for payment received' },
            { key: 'reminders', label: 'Invoice reminders', desc: 'Automated reminders for upcoming and overdue invoices' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-sm">
              <div>
                <p className="text-label-md font-bold text-on-surface">{label}</p>
                <p className="text-body-sm text-on-surface-variant">{desc}</p>
              </div>
              <Toggle enabled={notifications[key]} onChange={toggleNotification(key)} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Invoice Defaults" description="Set default values for new invoices">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          <SelectField label="Default Due Period" value={defaults.duePeriod} onChange={updateDefault('duePeriod')} options={duePeriodOptions} />
          <InputField label="Default Tax Rate (%)" type="number" value={defaults.taxRate} onChange={updateDefault('taxRate')} placeholder="18" />
          <InputField label="Invoice Prefix" value={defaults.prefix} onChange={updateDefault('prefix')} placeholder="INV-" />
        </div>
      </SectionCard>

      <SectionCard title="Payment Methods" description="Your connected payment gateways">
        <div className="space-y-md">
          {paymentMethods.map((method) => (
            <div key={method.name} className="flex items-center justify-between py-sm">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-outline">
                  <Icon name={method.icon} size={20} />
                </div>
                <span className="text-label-md font-bold text-on-surface">{method.name}</span>
              </div>
              <span className="inline-flex items-center px-sm py-xs rounded-lg bg-primary/10 text-label-sm font-bold text-primary">
                {method.status}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Invoice Customization" description="Personalize your invoice appearance">
        <div className="space-y-md">
          <div className="flex items-center gap-lg">
            <div className="w-16 h-16 rounded-xl bg-surface-container-low border-2 border-dashed border-outline-variant flex items-center justify-center text-outline cursor-pointer hover:bg-surface-container-high transition-colors" onClick={handleLogoUpload}>
              <Icon name="add" size={24} />
            </div>
            <div>
              <p className="text-label-md font-bold text-on-surface">Company Logo</p>
              <p className="text-body-sm text-on-surface-variant">Upload a PNG or JPG (max 2MB)</p>
              <button onClick={handleLogoUpload} className="text-label-sm font-bold text-primary mt-xs hover:underline">Upload Logo</button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
          </div>
          <div className="flex items-center gap-lg">
            <div className="space-y-1">
              <label className="block text-label-md text-on-surface font-bold">Primary Color</label>
              <div className="flex items-center gap-md">
                <input type="color" value={customization.primaryColor} onChange={updateCustomization('primaryColor')} className="w-10 h-10 rounded-lg border border-outline-variant cursor-pointer" />
                <span className="text-body-sm text-outline">{customization.primaryColor}</span>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-label-md text-on-surface font-bold">Default Notes</label>
            <textarea value={customization.defaultNotes} onChange={updateCustomization('defaultNotes')} rows={3} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-2 text-body-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y" placeholder="Invoice notes..." />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Security" description="Manage your account security">
        <div className="space-y-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <InputField label="Current Password" type="password" value={security.currentPassword} onChange={updateSecurity('currentPassword')} placeholder="Enter current password" />
            <div />
            <InputField label="New Password" type="password" value={security.newPassword} onChange={updateSecurity('newPassword')} placeholder="Enter new password" />
            <InputField label="Confirm Password" type="password" value={security.confirmPassword} onChange={updateSecurity('confirmPassword')} placeholder="Confirm new password" />
          </div>
          <div className="flex items-center justify-between py-sm">
            <div>
              <p className="text-label-md font-bold text-on-surface">Two-Factor Authentication</p>
              <p className="text-body-sm text-on-surface-variant">Add an extra layer of security to your account</p>
            </div>
            <Toggle enabled={twoFactor} onChange={() => setTwoFactor((t) => !t)} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Appearance" description="Customize your interface">
        <div className="space-y-md">
          <div className="flex items-center justify-between py-sm">
            <div>
              <p className="text-label-md font-bold text-on-surface">Dark Mode</p>
              <p className="text-body-sm text-on-surface-variant">Switch between light and dark themes</p>
            </div>
            <Toggle enabled={darkMode} onChange={() => setDarkMode((d) => !d)} />
          </div>
          <div className="flex items-center justify-between py-sm">
            <div>
              <p className="text-label-md font-bold text-on-surface">Compact View</p>
              <p className="text-body-sm text-on-surface-variant">Reduce spacing for a denser layout</p>
            </div>
            <Toggle enabled={compactView} onChange={() => setCompactView((c) => !c)} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Team Members" description="Manage people with access to your account">
        <div className="space-y-sm">
          {teamMembers.map((member) => (
            <div key={member.email} className="flex items-center justify-between py-sm">
              <div className="flex items-center gap-md">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-label-sm font-bold text-primary shrink-0">
                  {member.avatar}
                </div>
                <div>
                  <p className="text-label-md font-bold text-on-surface">{member.name}</p>
                  <p className="text-body-sm text-on-surface-variant">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-md">
                <span className={`inline-flex items-center px-sm py-xs rounded-lg text-label-sm font-bold ${member.role === 'Admin' ? 'bg-primary/10 text-primary' : member.role === 'Editor' ? 'bg-secondary/10 text-secondary' : 'bg-surface-container-high text-outline'}`}>
                  {member.role}
                </span>
                <button className="text-outline hover:text-on-surface transition-colors">
                  <Icon name="more_vert" size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Data Management" description="Export or manage your account data">
        <div className="flex flex-wrap gap-md">
          <button className="inline-flex items-center gap-sm bg-surface-container-low border border-outline-variant px-lg py-2 rounded-xl text-label-md font-bold text-on-surface hover:bg-surface-container-high transition-all">
            <Icon name="download" size={16} />
            Export Invoices (CSV)
          </button>
          <button className="inline-flex items-center gap-sm bg-surface-container-low border border-outline-variant px-lg py-2 rounded-xl text-label-md font-bold text-on-surface hover:bg-surface-container-high transition-all">
            <Icon name="download" size={16} />
            Export All Data (JSON)
          </button>
          <button className="inline-flex items-center gap-sm bg-error/10 border border-error/30 px-lg py-2 rounded-xl text-label-md font-bold text-error hover:bg-error/20 transition-all">
            <Icon name="delete" size={16} />
            Delete Account
          </button>
        </div>
      </SectionCard>

      <div className="flex items-center justify-end gap-md pt-sm">
        {saved && (
          <span className="inline-flex items-center gap-xs text-label-sm font-bold text-secondary">
            <Icon name="check_circle" size={14} filled />
            All changes saved
          </span>
        )}
        <button onClick={handleSave} className="inline-flex items-center gap-sm bg-primary text-on-primary font-bold px-lg py-sm rounded-xl text-label-md hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
          <Icon name="save" size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
