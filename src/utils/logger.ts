export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug: (msg: string, meta?: Record<string, unknown>) => void;
  info: (msg: string, meta?: Record<string, unknown>) => void;
  warn: (msg: string, meta?: Record<string, unknown>) => void;
  error: (msg: string, meta?: Record<string, unknown>) => void;
}

const LEVELS: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
let currentLevel: LogLevel = 'info';

function formatTime(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function log(level: LogLevel, msg: string, meta?: Record<string, unknown>): void {
  if (LEVELS[level] < LEVELS[currentLevel]) return;
  const prefix = `[${formatTime()}] [${level.toUpperCase()}]`;
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  console.log(`${prefix} ${msg}${metaStr}`);
}

export const logger: Logger = {
  debug: (msg, meta) => log('debug', msg, meta),
  info: (msg, meta) => log('info', msg, meta),
  warn: (msg, meta) => log('warn', msg, meta),
  error: (msg, meta) => log('error', msg, meta)
};

export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}