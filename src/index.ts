import 'dotenv/config';
import { createBot } from './bot.js';
import { logger } from './utils/logger.js';

const DEFAULT_TOKEN = '8911723259:AAFQqzrthDZBKHT7N4dgfuG-Qb6RAoibf_I';

function main(): void {
  const token = process.env.BOT_TOKEN || DEFAULT_TOKEN;

  logger.info('Memulai UnlockedV2 bot...');
  
  const bot = createBot(token);
  
  bot.start({
    onStart: () => logger.info('Bot polling dimulai'),
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