import 'dotenv/config';
import { createBot } from './bot.js';
import { logger } from './utils/logger.js';

const DEFAULT_TOKEN = '8656472599:AAEXLUmlfHJD1pgaeIGL0v7Zr4rE-kXNCFU';

function main(): void {
  const token = process.env.BOT_TOKEN || DEFAULT_TOKEN;

  logger.info('Memulai UnlockedV2 bot...');
  
  const bot = createBot(token);
  
  bot.start({
    onStart: () => {
      logger.info('=======================================');
      logger.info('  Bot UnlockedV2 AKTIF ✅');
      logger.info('  Polling Telegram berjalan...');
      logger.info('=======================================');
    },
    allowed_updates: ['message']
  });

  process.once('SIGINT', () => {
    logger.info('Menghentikan bot...');
    bot.stop();
  });
  
  process.once('SIGTERM', () => {
    logger.info('Menghentikan bot...');
    bot.stop();
  });
}

main();