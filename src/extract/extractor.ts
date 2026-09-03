import { getConfig, getVideoId, SiteConfig, ExtractResult, EmbedInfo } from './sites.js';
import { VdyError, encodeUrl } from './types.js';

function extractEmbedInfo(html: string): EmbedInfo {
  const iframeId = html.match(/var iframeId\s*=\s*'([^']+)'/)?.[1];
  const embedToken = html.match(/var embedToken\s*=\s*'([^']+)'/)?.[1];
  if (!iframeId || !embedToken) {
    throw new VdyError('Tidak dapat menemukan iframeId/embedToken di halaman embed', 'EXTRACT_FAILED');
  }
  return { iframeId, embedToken };
}

function extractPlayerPath(html: string): string {
  const match = html.match(/playerPath\s*=\s*"([^"]+)"/);
  if (!match) {
    throw new VdyError('Tidak dapat menemukan playerPath di halaman perantara', 'EXTRACT_FAILED');
  }
  return match[1].replace(/\\u0026/g, '&');
}

function extractVideoSource(html: string): string {
  const match = html.match(/<source\s+src="([^"]+)"/i);
  if (!match) {
    const m3u8 = html.match(/src\s*[:=]\s*["']([^"']+\.m3u8[^"']*)["']/i);
    if (m3u8) return encodeUrl(m3u8[1]);
    throw new VdyError('Tidak dapat menemukan sumber video di halaman player', 'EXTRACT_FAILED');
  }
  return encodeUrl(match[1]);
}

export async function fetchText(url: string, referrer?: string, retries = 3): Promise<string> {
  const headers: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  };
  if (referrer) headers.Referer = referrer;

  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url, { headers, redirect: 'follow' });
    if (res.ok) return res.text();

    const isTransient = [502, 503, 504].includes(res.status);
    if (!isTransient || attempt === retries) {
      throw new VdyError(`HTTP ${res.status} untuk ${url}`, 'NETWORK_BLOCKED');
    }
    console.warn(`[WARN] HTTP ${res.status} (percobaan ${attempt}/${retries}), retry sebentar...`);
    await new Promise((r) => setTimeout(r, 1000 * attempt));
  }
  throw new VdyError(`HTTP gagal setelah ${retries} percobaan: ${url}`, 'NETWORK_BLOCKED');
}

export async function extractHttp(embedUrl: string): Promise<ExtractResult> {
  const config = getConfig(embedUrl);
  const videoId = getVideoId(embedUrl);
  if (!videoId) throw new VdyError('Video ID tidak ditemukan', 'INVALID_URL');

  console.log('[INFO] Langkah 1/3: Fetch halaman embed...');
  const embedHtml = await fetchText(embedUrl);

  const { iframeId, embedToken } = extractEmbedInfo(embedHtml);

  console.log('[INFO] Langkah 2/3: Fetch halaman perantara...');
  const origin = new URL(embedUrl).origin;
  const intermediaryUrl = `${origin}/ip129jk?id=${iframeId}&t=${encodeURIComponent(embedToken)}`;
  const intermediaryHtml = await fetchText(intermediaryUrl, `${origin}/`);

  const playerPath = extractPlayerPath(intermediaryHtml);
  console.log('[DEBUG] Player path:', playerPath);

  console.log('[INFO] Langkah 3/3: Fetch halaman player...');
  const playerHtml = await fetchText(playerPath, intermediaryUrl);
  const videoUrl = extractVideoSource(playerHtml);

  const title = playerHtml.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() || videoId;
  const thumbnail = playerHtml.match(/poster\s*=\s*"([^"]+)"/i)?.[1];

  console.log('[INFO] Video URL berhasil diekstrak:', videoUrl);
  return { videoUrl, title, thumbnail, videoId };
}