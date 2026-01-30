'use client';

import React, { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainSidebar from '@/components/MainSidebar';
import { SecondarySidebar } from '@/components/SecondarySidebar';
import Header from '@/components/Header';
import { menuItems } from '@/lib/menu-items';
import type { MenuItem } from '@/types/menu';
import { useAppStore } from '@/store/appStore';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const { isSecondarySidebarVisible, setActiveMenuLabel } = useAppStore();

  const handleMenuItemClick = (item: MenuItem) => {
    setActiveItem(item);
    setActiveMenuLabel(item.label);
    
    // Navigate to the item's path if it exists
    if (item.path) {
      router.push(item.path);
    }
  };

  const handleSecondaryItemClick = (item: MenuItem) => {
    // Handle secondary menu item clicks
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <MainSidebar
        items={menuItems}
        onMenuItemClick={handleMenuItemClick}
        activeItem={activeItem}
        isHydrated={true}
      />
      <SecondarySidebar
        activeItem={activeItem}
        visible={isSecondarySidebarVisible}
        onSecondaryItemClick={handleSecondaryItemClick}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header moduleStatuses={[]} />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
