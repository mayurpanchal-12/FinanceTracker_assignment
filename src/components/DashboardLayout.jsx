import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import EditTransactionModal from './EditTransactionModal';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-full relative">
      <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Global edit modal — renders on top of any page */}
      <EditTransactionModal />

      <main className="w-full pb-10">
        <Outlet />
      </main>
    </div>
  );
}
