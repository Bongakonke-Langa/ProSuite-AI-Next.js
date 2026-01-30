'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, ChevronRight, LogOut } from 'lucide-react';
import { menuItems, bottomMenuItems } from '@/lib/menu-items';

export default function Sidebar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const isActive = (path?: string) => {
    if (!path) return false;
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <div className="flex">
      {/* Main Sidebar */}
      <div className="flex flex-col w-16 bg-prosuite-800 text-white relative z-20">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-prosuite-700">
          <Shield className="w-8 h-8" />
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 flex flex-col items-center py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const hasSecondary = item.secondaryMenu && item.secondaryMenu.length > 0;
            
            return (
              <div
                key={index}
                onMouseEnter={() => hasSecondary && setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
                className="relative"
              >
                {item.path ? (
                  <Link
                    href={item.path}
                    className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${
                      active
                        ? 'bg-prosuite-600 text-white'
                        : 'text-prosuite-300 hover:bg-prosuite-700 hover:text-white'
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                ) : (
                  <button
                    className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${
                      active
                        ? 'bg-prosuite-600 text-white'
                        : 'text-prosuite-300 hover:bg-prosuite-700 hover:text-white'
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                )}

                {/* Secondary Menu Popup */}
                {hasSecondary && hoveredItem === item.label && (
                  <div className="absolute left-full top-0 ml-1 w-64 bg-white shadow-lg rounded-lg border border-gray-200 py-2 z-30">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">{item.label}</h3>
                    </div>
                    {item.secondaryMenu?.map((subItem, subIndex) => {
                      const SubIcon = subItem.icon;
                      const subActive = isActive(subItem.path);
                      return (
                        <Link
                          key={subIndex}
                          href={subItem.path || '#'}
                          className={`flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors ${
                            subActive ? 'bg-prosuite-50 text-prosuite-700' : 'text-gray-700'
                          }`}
                        >
                          <SubIcon className="w-4 h-4" />
                          <span className="text-sm">{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Icons */}
        <div className="flex flex-col items-center py-4 space-y-1 border-t border-prosuite-700">
          {bottomMenuItems.map((item, index) => {
            const Icon = item.icon;
            const hasSecondary = item.secondaryMenu && item.secondaryMenu.length > 0;
            
            return (
              <div
                key={index}
                onMouseEnter={() => hasSecondary && setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
                className="relative"
              >
                <button
                  className="flex items-center justify-center w-12 h-12 rounded-lg text-prosuite-300 hover:bg-prosuite-700 hover:text-white transition-colors"
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                </button>

                {/* Secondary Menu Popup */}
                {hasSecondary && hoveredItem === item.label && (
                  <div className="absolute left-full bottom-0 ml-1 w-48 bg-white shadow-lg rounded-lg border border-gray-200 py-2 z-30">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">{item.label}</h3>
                    </div>
                    {item.secondaryMenu?.map((subItem, subIndex) => {
                      const SubIcon = subItem.icon;
                      const subActive = isActive(subItem.path);
                      return (
                        <Link
                          key={subIndex}
                          href={subItem.path || '#'}
                          className={`flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors ${
                            subActive ? 'bg-prosuite-50 text-prosuite-700' : 'text-gray-700'
                          }`}
                        >
                          <SubIcon className="w-4 h-4" />
                          <span className="text-sm">{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          
          <button
            className="flex items-center justify-center w-12 h-12 rounded-lg text-prosuite-300 hover:bg-prosuite-700 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
