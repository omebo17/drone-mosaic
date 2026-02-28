import { NavItem } from '../../shared/models/nav-item.model';
import { SECTION_IDS } from './layout.constants';

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', labelKey: 'header.nav.home', type: 'scroll', sectionId: SECTION_IDS.HOME, defaultLabel: 'Home' },
  { id: 'about', labelKey: 'header.nav.about', type: 'scroll', sectionId: SECTION_IDS.ABOUT, defaultLabel: 'About' },
  { id: 'services', labelKey: 'header.nav.services', type: 'scroll', sectionId: SECTION_IDS.SERVICES, defaultLabel: 'Services' },
  { id: 'pricing', labelKey: 'header.nav.pricing', type: 'route', routePath: 'booking', defaultLabel: 'Pricing' },
  { id: 'howItWorks', labelKey: 'header.nav.howItWorks', type: 'route', routePath: 'how-it-works', defaultLabel: 'How It Works' },
];
