import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/** Default English descriptions for route segments (Georgia / Caucasus keywords for regional SEO). */
const ROUTE_SEO_EN: Record<string, { title: string; description: string }> = {
  '/ka': {
    title: 'Photon | Drone Light Shows Georgia & Caucasus | დრონ შოუ საქართველო',
    description:
      'Professional drone light shows and drone swarm displays in Georgia, Tbilisi, and the Caucasus. Book spectacular LED drone shows for weddings, corporate events, and festivals. Skybrush-compatible .skyc player.'
  },
  '/en': {
    title: 'Photon | Drone Light Shows Georgia & Caucasus',
    description:
      'Professional drone light shows in Georgia, Tbilisi, and the Caucasus region. Weddings, corporate events, festivals — spectacular synchronized drone displays. Preview .skyc shows in our web player.'
  },
  '/ka/booking': {
    title: 'Book a Drone Show | Pricing Georgia | Photon',
    description:
      'Request a quote for a drone light show in Georgia or the Caucasus. Transparent pricing for custom aerial LED performances and event drone displays.'
  },
  '/en/booking': {
    title: 'Book a Drone Show | Pricing | Photon Georgia',
    description:
      'Book a professional drone light show in Georgia, Tbilisi, or the wider Caucasus. Get pricing for weddings, brands, and public events.'
  },
  '/ka/how-it-works': {
    title: 'How Drone Shows Work | Photon საქართველო',
    description:
      'How we plan and run safe, spectacular drone light shows in Georgia — from design to flight day.'
  },
  '/en/how-it-works': {
    title: 'How Drone Light Shows Work | Photon',
    description:
      'Learn how drone swarm light shows are designed and executed safely for events in Georgia and the Caucasus.'
  },
  '/ka/blog': {
    title: 'Drone Show Blog | News & Tips | Photon',
    description:
      'Articles on drone shows, safety, technology, and events in Georgia and beyond.'
  },
  '/en/blog': {
    title: 'Drone Show Blog | Photon',
    description:
      'Drone light show news, safety, and technology — focused on Georgia and the Caucasus region.'
  },
  '/ka/drone-show': {
    title: 'Skybrush .skyc Player | Preview Drone Shows Online | Photon',
    description:
      'Free browser viewer for Skybrush .skyc drone show files. Preview trajectories and LED programs before your event in Georgia or anywhere.'
  },
  '/en/drone-show': {
    title: 'Skybrush .skyc Drone Show Player | Photon',
    description:
      'Open and preview Skybrush compiled drone show files (.skyc) in the browser — trajectories and lights synchronized.'
  }
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private jsonLdInjected = false;

  constructor(
    private title: Title,
    private meta: Meta,
    private router: Router,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  init(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.applyForCurrentUrl());

    this.applyForCurrentUrl();
    this.injectJsonLdOnce();
  }

  private baseUrl(): string {
    const configured = environment.siteUrl?.replace(/\/$/, '') ?? '';
    if (configured) return configured;
    if (typeof window === 'undefined') return '';
    const baseHref = this.doc.querySelector('base')?.getAttribute('href') || '/';
    const path = baseHref === '/' ? '' : baseHref.replace(/\/$/, '');
    return `${window.location.origin}${path}`;
  }

  private applyForCurrentUrl(): void {
    const url = this.router.url.split('?')[0].split('#')[0] || '/ka';
    const base = this.baseUrl();

    const config = ROUTE_SEO_EN[url]
      ?? (url.startsWith('/en/blog/') || url.startsWith('/ka/blog/')
        ? {
            title: 'Drone Show Article | Photon',
            description:
              'Drone light show insights from Photon — Georgia, Caucasus, and international events.'
          }
        : ROUTE_SEO_EN[url.startsWith('/en') ? '/en' : '/ka']);

    this.title.setTitle(config.title);

    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({
      name: 'keywords',
      content:
        'drone show, drone light show, droneshow, Georgia, საქართველო, Tbilisi, თბილისი, Caucasus, კავკასიონი, swarm drones, LED drone show, Skybrush, skyc viewer, wedding drone show, corporate drone show, aerial display, dron show'
    });
    this.meta.updateTag({ name: 'geo.region', content: 'GE' });
    this.meta.updateTag({ name: 'geo.placename', content: 'Tbilisi, Georgia' });
    this.meta.updateTag({ name: 'ICBM', content: '41.7151, 44.8271' });
    this.meta.updateTag({ name: 'language', content: url.includes('/en') ? 'English' : 'Georgian' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large' });
    this.meta.updateTag({ name: 'author', content: 'Photon' });

    const canonical = `${base}${url.startsWith('/') ? url : '/' + url}`;
    this.setOrCreateLink('canonical', canonical);

    const ogImage = `${base}/assets/images/showExample1.png`;
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:locale', content: url.includes('/en') ? 'en_US' : 'ka_GE' });
    this.meta.updateTag({ property: 'og:image', content: ogImage });
    this.meta.updateTag({ property: 'og:site_name', content: 'Photon' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: ogImage });

    this.setHreflang(base, url);
    this.setDocumentLang(url);
  }

  /** Match visible language to route (/en vs /ka) for accessibility and SEO hints. */
  private setDocumentLang(url: string): void {
    const lang = url.includes('/en') ? 'en' : 'ka';
    this.doc.documentElement.lang = lang;
  }

  private setOrCreateLink(rel: string, href: string): void {
    const selector = `link[rel="${rel}"]`;
    let el = this.doc.querySelector(selector) as HTMLLinkElement | null;
    if (!el) {
      el = this.doc.createElement('link');
      el.setAttribute('rel', rel);
      this.doc.head.appendChild(el);
    }
    el.setAttribute('href', href);
  }

  private setHreflang(base: string, currentUrl: string): void {
    const path = currentUrl.replace(/^\/(en|ka)/, '');
    const suffix = path.startsWith('/') ? path : path ? `/${path}` : '';
    const kaPath = `/ka${suffix}`;
    const enPath = `/en${suffix}`;

    this.upsertHreflang('ka', `${base}${kaPath}`);
    this.upsertHreflang('en', `${base}${enPath}`);
    this.upsertHreflang('x-default', `${base}/ka${suffix}`);
  }

  private upsertHreflang(lang: string, href: string): void {
    const selector = `link[hreflang="${lang}"]`;
    let el = this.doc.querySelector(selector) as HTMLLinkElement | null;
    if (!el) {
      el = this.doc.createElement('link');
      el.setAttribute('rel', 'alternate');
      el.setAttribute('hreflang', lang);
      this.doc.head.appendChild(el);
    }
    el.setAttribute('href', href);
  }

  private injectJsonLdOnce(): void {
    if (this.jsonLdInjected) return;
    this.jsonLdInjected = true;

    const base = this.baseUrl();
    const data = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${base}/#website`,
          url: base,
          name: 'Photon',
          description:
            'Drone light shows and synchronized swarm displays in Georgia, Tbilisi, and the Caucasus. Book events and preview .skyc files online.',
          inLanguage: ['ka-GE', 'en-US'],
          publisher: { '@id': `${base}/#organization` }
        },
        {
          '@type': 'Organization',
          '@id': `${base}/#organization`,
          name: 'Photon',
          url: base,
          logo: `${base}/assets/images/logo.svg`,
          areaServed: [
            { '@type': 'Country', name: 'Georgia' },
            { '@type': 'AdministrativeArea', name: 'Caucasus' }
          ],
          knowsAbout: [
            'Drone light show',
            'Drone swarm',
            'LED drone display',
            'Skybrush',
            'Event production'
          ]
        },
        {
          '@type': 'ProfessionalService',
          '@id': `${base}/#service`,
          name: 'Photon — Drone light shows',
          provider: { '@id': `${base}/#organization` },
          areaServed: { '@type': 'Country', name: 'Georgia' },
          serviceType: 'Drone light show production',
          url: base
        }
      ]
    };

    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.doc.head.appendChild(script);
  }
}
