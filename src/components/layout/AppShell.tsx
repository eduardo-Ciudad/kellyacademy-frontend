import { Outlet } from 'react-router-dom';
import { BottomNav } from '@/components/layout/BottomNav';
import { Sidebar } from '@/components/layout/Sidebar';

export function AppShell() {
  return (
    <div className="bg-bg min-h-screen font-sans">
      <Sidebar />
      <main className="min-h-screen pb-[calc(var(--bottom-nav-h)+24px)] lg:ml-[248px] lg:px-12 lg:py-8">
        <div className="mx-auto max-w-[1200px]">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
