import { Routes, Route } from 'react-router-dom';
import SidebarLayout from '../layouts/SidebarLayout';
import TopNavLayout from '../layouts/TopNavLayout';
import Dashboard from '../pages/Dashboard';
import InvoiceManagement from '../pages/InvoiceManagement';
import CreateInvoice from '../pages/CreateInvoice';
import Settings from '../pages/Settings';
import Support from '../pages/Support';

const SidebarPage = ({ children }) => (
  <SidebarLayout>{children}</SidebarLayout>
);

const TopNavPage = ({ children }) => (
  <TopNavLayout>{children}</TopNavLayout>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<SidebarPage><Dashboard /></SidebarPage>} />
    <Route path="/invoices" element={<SidebarPage><InvoiceManagement /></SidebarPage>} />
    <Route path="/create" element={<TopNavPage><CreateInvoice /></TopNavPage>} />
    <Route path="/edit/:id" element={<TopNavPage><CreateInvoice /></TopNavPage>} />
    <Route path="/settings" element={<SidebarPage><Settings /></SidebarPage>} />
    <Route path="/support" element={<SidebarPage><Support /></SidebarPage>} />
    <Route path="/clients" element={<SidebarPage><InvoiceManagement /></SidebarPage>} />
  </Routes>
);

export default AppRoutes;
