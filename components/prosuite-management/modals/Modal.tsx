import React from 'react';
import type { MenuItem } from '@/types/menu';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  items: MenuItem[];
  handlePrimaryMenuItemClick: (item: MenuItem) => void;
  activeMenuItem?: string;
  position: { top: number; left: number } | null;
}

export default function Modal({
  isVisible,
  onClose,
  items,
  handlePrimaryMenuItemClick,
  activeMenuItem,
  position,
}: ModalProps) {
  if (!isVisible || !position) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 bg-white rounded-lg shadow-lg p-4 w-64"
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        <div className="space-y-2">
          {items.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeMenuItem === item.label;
            return (
              <button
                key={index}
                onClick={() => handlePrimaryMenuItemClick(item)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-prosuite-50 text-prosuite-700' : 'hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
