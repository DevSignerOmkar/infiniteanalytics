import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Icon from '../components/ui/Icon';

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/invoices', label: 'Invoices', icon: 'description' },
];

const bottomItems = [
  { to: '/settings', label: 'Settings', icon: 'settings' },
  { to: '/support', label: 'Support', icon: 'help' },
];

const SidebarLayout = ({ children }) => {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, text: 'INV-0012 has been paid', time: '2 min ago', read: false },
    { id: 2, text: 'INV-0008 payment overdue', time: '1 hr ago', read: false },
    { id: 3, text: 'New invoice created for Meridian Health', time: '3 hrs ago', read: true },
    { id: 4, text: 'INV-0011 sent to Stellar Labs', time: '1 day ago', read: true },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden md:flex flex-col h-screen w-64 bg-surface-container-low border-r border-outline-variant py-xl px-md gap-lg shrink-0">
        <div className="flex items-center gap-md px-md">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="description" className="text-on-primary" filled size={24} />
          </div>
          <div>
            <h1 className="text-headline-sm font-black text-primary">FluxInvoice</h1>
            <p className="text-label-sm text-outline opacity-70">Premium Billing</p>
          </div>
        </div>

        <nav className="flex flex-col gap-xs mt-xl flex-grow">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active translate-x-1' : ''}`
              }
            >
              <Icon name={item.icon} />
              <span className="text-label-md">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-col gap-xs">
          {bottomItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="sidebar-link"
            >
              <Icon name={item.icon} />
              <span className="text-label-md">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        <header className="bg-surface shadow-sm sticky top-0 z-40 w-full border-b border-outline-variant/30">
          <div className="flex justify-between items-center w-full px-lg py-md max-w-[1440px] mx-auto">
            <div className="flex items-center gap-lg flex-1">
              <div className="relative w-full max-w-md hidden sm:block">
                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={20} />
                <input
                  className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-body-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Search invoices, clients..."
                  type="text"
                />
              </div>
              <h2 className="md:hidden font-extrabold text-primary text-headline-md">FluxInvoice</h2>
            </div>
            <div className="flex items-center gap-md">
              <button
                onClick={() => navigate('/create')}
                className="hidden lg:flex items-center gap-sm bg-primary text-on-primary px-lg py-2 rounded-xl text-label-md font-bold hover:opacity-90 active:scale-[0.98] transition-all"
              >
                <Icon name="add" size={20} />
                Quick Create
              </button>
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen((p) => !p)}
                  className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors relative"
                >
                  <Icon name="notifications" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-outline-variant z-50 overflow-hidden">
                    <div className="px-lg py-md border-b border-outline-variant">
                      <h4 className="text-label-md font-bold text-on-surface">Notifications</h4>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`px-lg py-md border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors ${!n.read ? 'bg-primary-container/5' : ''}`}
                        >
                          <p className="text-body-sm text-on-surface">{n.text}</p>
                          <p className="text-label-sm text-outline mt-xs">{n.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="px-lg py-sm text-center border-t border-outline-variant">
                      <button className="text-label-md text-primary font-bold hover:underline">View all notifications</button>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((p) => !p)}
                  className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant hover:ring-2 hover:ring-primary/30 transition-all"
                >
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-label-md">
                    AR
                  </div>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-outline-variant z-50 overflow-hidden">
                    <div className="px-lg py-md border-b border-outline-variant">
                      <p className="text-label-md font-bold text-on-surface">Alex Rivera</p>
                      <p className="text-label-sm text-outline">alex@fluxinvoice.com</p>
                    </div>
                    <div className="py-sm">
                      <button onClick={() => { navigate('/settings'); setUserMenuOpen(false); }} className="w-full flex items-center gap-sm px-lg py-sm text-body-sm text-on-surface hover:bg-surface-container-low transition-colors">
                        <Icon name="settings" size={18} />
                        Settings
                      </button>
                      <button onClick={() => { navigate('/support'); setUserMenuOpen(false); }} className="w-full flex items-center gap-sm px-lg py-sm text-body-sm text-on-surface hover:bg-surface-container-low transition-colors">
                        <Icon name="help" size={18} />
                        Support
                      </button>
                    </div>
                    <div className="border-t border-outline-variant py-sm">
                      <button className="w-full flex items-center gap-sm px-lg py-sm text-body-sm text-error hover:bg-error-container/10 transition-colors">
                        <Icon name="logout" size={18} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-lg md:p-xl max-w-[1440px] mx-auto w-full space-y-lg">
          {children}
        </div>

        <div className="h-20 md:hidden" />
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface shadow-lg border-t border-outline-variant/30 flex justify-around items-center h-16 z-50">
        <NavLink to="/" end className="flex flex-col items-center text-primary font-bold">
          <Icon name="dashboard" filled size={20} />
          <span className="text-[10px]">Dashboard</span>
        </NavLink>
        <NavLink to="/invoices" className="flex flex-col items-center text-outline">
          <Icon name="description" size={20} />
          <span className="text-[10px]">Invoices</span>
        </NavLink>
        <button onClick={() => navigate('/create')} className="relative -top-6">
          <div className="w-12 h-12 bg-primary rounded-full shadow-lg text-on-primary flex items-center justify-center">
            <Icon name="add" size={24} />
          </div>
        </button>
        <NavLink to="/clients" className="flex flex-col items-center text-outline">
          <Icon name="group" size={20} />
          <span className="text-[10px]">Clients</span>
        </NavLink>
        <NavLink to="/settings" className="flex flex-col items-center text-outline">
          <Icon name="settings" size={20} />
          <span className="text-[10px]">Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default SidebarLayout;
