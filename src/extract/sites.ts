import { SiteConfig, SiteSelectors, ExtractResult, EmbedInfo } from './types.js';

export const SITES: Record<string, SiteConfig> = {
  vdy: {
    name: 'vdy.to',
    domains: ['vdy.to', 'www.vdy.to', 'vdko.de', 'www.vdko.de'],
    embedPattern: /(?:vdy\.to|vdko\.de|streamrizz\.com)\/(?:e|d)\/([a-z0-9]+)/i,
    selectors: {
      embedIframe: '#videq_iframe',
      playButton: '.video-link',
      playerIframe: '.vv-player',
      videoElement: '#player',
      videoSource: '#player source'
    } as SiteSelectors,
    adDomains: [
      'qn.cacksencl.com',
      'js.wpadmngr.com',
      'wpadmngr.com',
      'pagead2.googlesyndication.com',
      'googlesyndication.com',
      'doubleclick.net',
      'google-analytics.com',
      'googletagmanager.com',
      'openfpcdn.io',
      'cacksencl.com'
    ],
    redirectPatterns: [
      '/aclk',
      '/adclick',
      '/click?',
      '/redirect?',
      '/popup',
      '/ads/',
      'doubleclick'
    ],
    referrer: 'https://vidoy.com/',
    tokenParam: 't'
  }
};

export function getConfig(url: string): SiteConfig {
  const config = Object.values(SITES).find((c) => c.embedPattern.test(url));
  if (!config) throw new Error(`URL tidak valid: ${url}`);
  return config;
}

export function getVideoId(url: string): string | null {
  const config = getConfig(url);
  return url.match(config.embedPattern)?.[1] ?? null;
}

export function isSupportedUrl(url: string): boolean {
  try {
    getConfig(url);
    return true;
  } catch {
    return false;
  }
}

export { SiteConfig, SiteSelectors, ExtractResult, EmbedInfo } from './types.js';