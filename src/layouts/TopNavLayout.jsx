import { useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';

const TopNavLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="bg-surface shadow-sm sticky top-0 z-40 w-full border-b border-outline-variant/30">
        <div className="flex justify-between items-center w-full px-lg py-md max-w-[1440px] mx-auto">
          <div className="flex items-center gap-xl">
            <button onClick={() => navigate('/')} className="text-headline-md font-extrabold text-primary">
              FluxInvoice
            </button>
            <nav className="hidden md:flex gap-lg items-center">
              <button onClick={() => navigate('/')} className="text-on-surface-variant text-label-md hover:text-primary transition-colors">
                Dashboard
              </button>
              <button onClick={() => navigate('/invoices')} className="text-primary font-bold border-b-2 border-primary text-label-md py-1">
                Invoices
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-md">
            <button className="p-sm text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all">
              <Icon name="notifications" />
            </button>
            <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant">
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-label-md">
                AR
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-[1440px] mx-auto w-full px-lg py-md">
        {children}
      </main>

      <footer className="mt-lg border-t border-outline-variant/20 py-xl bg-surface-container-lowest">
        <div className="max-w-[1440px] mx-auto px-lg flex flex-col md:flex-row justify-between items-center gap-lg">
          <span className="text-label-md text-outline">&copy; 2024 FluxInvoice. Built for the modern enterprise.</span>
          <div className="flex items-center gap-xl">
            <button className="text-label-md text-on-surface-variant hover:text-primary transition-colors">Security</button>
            <button className="text-label-md text-on-surface-variant hover:text-primary transition-colors">Terms of Service</button>
            <button className="text-label-md text-on-surface-variant hover:text-primary transition-colors">Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TopNavLayout;
