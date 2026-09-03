export interface ExtractResult {
  videoUrl: string;
  title: string;
  thumbnail?: string;
  videoId: string;
}

export interface EmbedInfo {
  iframeId: string;
  embedToken: string;
}

export interface SiteSelectors {
  embedIframe: string;
  playButton: string;
  playerIframe: string;
  videoElement: string;
  videoSource: string;
}

export interface SiteConfig {
  name: string;
  domains: string[];
  embedPattern: RegExp;
  selectors: SiteSelectors;
  adDomains: string[];
  redirectPatterns: string[];
  referrer: string;
  tokenParam: string;
}

export class VdyError extends Error {
  public readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'VdyError';
    this.code = code;
  }
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').slice(0, 200);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(0)}s`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
  return `${(seconds / 3600).toFixed(1)}h`;
}

export function isHlsUrl(url: string): boolean {
  return /\.m3u8(\?|#|$)/i.test(url);
}

export function encodeUrl(url: string): string {
  return url.replace(/ /g, '%20');
}