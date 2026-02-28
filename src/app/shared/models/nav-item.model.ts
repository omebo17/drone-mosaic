export interface NavItem {
  id: string;
  labelKey: string;
  type: 'scroll' | 'route';
  sectionId?: string;
  routePath?: string;
  /** Default label when translation is missing (e.g. 'Home', 'About'). */
  defaultLabel?: string;
}
