import type { MenuItem } from '@/types/menu';

interface ModuleStatus {
  alias_name: string;
  status_slug: string;
  is_disable: number;
}

export function filterMenuItemsByPermissions(
  items: MenuItem[],
  permissions: string[],
  userRoles: string[],
  moduleStatuses?: ModuleStatus[]
): MenuItem[] {
  if (!items) return [];
  
  // If user has all permissions, return all items
  if (permissions.includes('*') || userRoles.includes('Super Admin')) {
    return items;
  }
  
  return items.filter(item => {
    // If no permissions required, show the item
    if (!item.permissions || item.permissions.length === 0) {
      return true;
    }
    
    // Check if user has any of the required permissions
    return item.permissions.some(permission => 
      permissions.includes(permission)
    );
  });
}
