export interface MenuItem {
  icon: any;
  label: string;
  path?: string;
  permissions?: string[];
  module?: string;
  secondaryMenu?: MenuItem[];
}
