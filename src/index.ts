import 'dotenv/config';
import { createBot } from './bot.js';
import { logger } from './utils/logger.js';

function main(): void {
  const token = process.env.BOT_TOKEN;
  
  if (!token || token === 'your_bot_token_here') {
    logger.error('BOT_TOKEN tidak ditemukan di .env');
    logger.error('Salin .env.example ke .env dan isi BOT_TOKEN dari @BotFather');
    process.exit(1);
  }

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