import { Bot, Context } from 'grammy';
import { extractHttp } from './extract/extractor.js';
import { isSupportedUrl } from './extract/sites.js';
import { formatCaption, formatWelcome, formatHelp, formatError } from './utils/format.js';
import { logger } from './utils/logger.js';

export function createBot(token: string): Bot<Context> {
  const bot = new Bot<Context>(token);

  bot.command('start', async (ctx) => {
    await ctx.reply(formatWelcome(), { parse_mode: 'MarkdownV2' });
  });

  bot.command('help', async (ctx) => {
    await ctx.reply(formatHelp(), { parse_mode: 'MarkdownV2' });
  });

  bot.on('message:text', async (ctx) => {
    const text = ctx.message?.text?.trim() ?? '';

    if (!text || !isSupportedUrl(text)) {
      return;
    }

    const statusMsg = await ctx.reply('🔄 Mengekstrak video URL...', { parse_mode: 'MarkdownV2' });

    try {
      const result = await extractHttp(text);

      await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id).catch(() => {});

      if (result.thumbnail) {
        await ctx.replyWithPhoto(result.thumbnail, {
          caption: formatCaption(result.title, result.videoUrl),
          parse_mode: 'MarkdownV2'
        });
      } else {
        await ctx.reply(formatCaption(result.title, result.videoUrl), {
          parse_mode: 'MarkdownV2'
        });
      }

      logger.info('Video extracted and sent', { videoId: result.videoId, chatId: ctx.chat.id });
    } catch (err) {
      await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id).catch(() => {});

      const msg = err instanceof Error ? err.message : 'Gagal ekstrak video';
      logger.error('Extraction failed', { error: msg, url: text, chatId: ctx.chat.id });

      await ctx.reply(formatError(msg), { parse_mode: 'MarkdownV2' });
    }
  });

  bot.catch((err): void => {
    const info = (err as { error?: unknown }).error;
    logger.error('Bot error', {
      error: info instanceof Error ? info.message : info ? String(info) : String(err)
    });
  });

  return bot;
}
