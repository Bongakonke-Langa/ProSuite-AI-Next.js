import { create } from 'zustand';

interface AppState {
  isSecondarySidebarVisible: boolean;
  isSecondarySidebarPinned: boolean;
  isHovering: boolean;
  hoverTimeoutId: NodeJS.Timeout | null;
  activeMenuLabel: string | null;
  
  setIsSecondarySidebarVisible: (visible: boolean, fromHover?: boolean) => void;
  setIsSecondarySidebarPinned: (pinned: boolean) => void;
  setIsHovering: (hovering: boolean) => void;
  setHoverTimeout: (timeoutId: NodeJS.Timeout | null) => void;
  setActiveMenuLabel: (label: string | null) => void;
  getActiveMenuItemWithFilteredSecondaryMenu: (moduleStatuses?: any[]) => any;
}

export const useAppStore = create<AppState>((set, get) => ({
  isSecondarySidebarVisible: false,
  isSecondarySidebarPinned: false,
  isHovering: false,
  hoverTimeoutId: null,
  activeMenuLabel: null,
  
  setIsSecondarySidebarVisible: (visible, fromHover = false) => 
    set({ isSecondarySidebarVisible: visible }),
  
  setIsSecondarySidebarPinned: (pinned) => 
    set({ isSecondarySidebarPinned: pinned }),
  
  setIsHovering: (hovering) => 
    set({ isHovering: hovering }),
  
  setHoverTimeout: (timeoutId) => 
    set({ hoverTimeoutId: timeoutId }),
  
  setActiveMenuLabel: (label) => 
    set({ activeMenuLabel: label }),
  
  getActiveMenuItemWithFilteredSecondaryMenu: (moduleStatuses = []) => {
    // Return null for now - can be implemented later if needed
    return null;
  },
}));
