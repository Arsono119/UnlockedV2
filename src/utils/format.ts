export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function formatCaption(title: string, videoUrl: string): string {
  const safeTitle = escapeHtml(title);
  const safeUrl = escapeHtml(videoUrl);
  return `📹 <b>${safeTitle}</b>\n🔗 <code>${safeUrl}</code>`;
}

export function formatWelcome(): string {
  return `🤖 <b>UnlockedV2 Bot</b>

Kirim link embed dari:
• <code>vdy.to/e/...</code>
• <code>vdko.de/e/...</code>
• <code>streamrizz.com/e/...</code>

Bot akan ekstrak video URL dan kirim thumbnail + link langsung.

Contoh:
<code>https://vdy.to/e/abc123xyz</code>`;
}

export function formatHelp(): string {
  return `<b>Bantuan UnlockedV2</b>

Kirim link embed vdy.to/vdko.de/streamrizz.com → dapatkan video URL + thumbnail.

Command:
/start - Pesan sambutan
/help - Bantuan ini

Format balasan:
📹 <b>Title</b>
🔗 <code>video_url</code>

Copy URL → buka di mpv Android / player HLS lain.`;
}

export function formatError(message: string): string {
  return `❌ <b>Error</b>\n${escapeHtml(message)}`;
}
