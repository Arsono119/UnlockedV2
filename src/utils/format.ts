export function escapeMarkdownV2(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

export function formatCaption(title: string, videoUrl: string): string {
  const safeTitle = escapeMarkdownV2(title);
  const safeUrl = escapeMarkdownV2(videoUrl);
  return `📹 *${safeTitle}*\n🔗 \`${safeUrl}\``;
}

export function formatWelcome(): string {
  return `🤖 *UnlockedV2 Bot*

Kirim link embed dari:
• \`vdy.to/e/...\`
• \`vdko.de/e/...\`
• \`streamrizz.com/e/...\`

Bot akan ekstrak video URL dan kirim thumbnail + link langsung.

Contoh:
\`https://vdy.to/e/abc123xyz\``;
}

export function formatHelp(): string {
  return `*Bantuan UnlockedV2*

Kirim link embed vdy.to/vdko.de/streamrizz.com → dapatkan video URL + thumbnail.

Command:
/start - Pesan sambutan
/help - Bantuan ini

Format balasan:
📹 *Title*
🔗 \`video_url\`

Copy URL → buka di mpv Android / player HLS lain.`;
}

export function formatError(message: string): string {
  return `❌ *Error*\n${escapeMarkdownV2(message)}`;
}