# UnlockedV2

Telegram bot untuk ekstrak video URL dari link embed **vdy.to**, **vdko.de**, **streamrizz.com** dan kirim ke user sebagai foto (thumbnail) + caption (title + video URL).

## Fitur

- Terima link vdy.to/vdko.de/streamrizz.com → ekstrak video URL langsung
- Kirim thumbnail sebagai foto Telegram + caption berisi title & video URL
- Command `/start` dan `/help`
- Deploy di Termux (Android) atau server biasa

## Instalasi

### Termux (Android)

```bash
pkg install nodejs git
git clone <repo-url> UnlockedV2
cd UnlockedV2
cp .env.example .env
# Edit .env dan isi BOT_TOKEN dari @BotFather
npm install
npm run build
```

### Server Linux (Ubuntu/Debian)

```bash
sudo apt update && sudo apt install nodejs npm git
git clone <repo-url> UnlockedV2
cd UnlockedV2
cp .env.example .env
# Edit .env
npm install
npm run build
```

## Konfigurasi

Edit file `.env`:

```
BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
```

Dapatkan token dari [@BotFather](https://t.me/BotFather) di Telegram.

## Menjalankan

### Development (hot reload)
```bash
npm run dev
```

### Production
```bash
npm run start
```

### Auto-restart dengan PM2 (direkomendasikan)

```bash
npm install -g pm2
pm2 start dist/index.js --name unlockedv2
pm2 startup
pm2 save
```

## Penggunaan

1. Start bot di Telegram
2. Kirim link embed, contoh:
   - `https://vdy.to/e/abc123`
   - `https://vdko.de/e/abc123`
   - `https://streamrizz.com/e/abc123`
3. Bot balas dengan foto thumbnail + caption:
   ```
   📹 Title Video
   🔗 https://hls-xx.overfetch.video/.../master.m3u8
   ```
4. Copy URL → buka di **mpv Android** (atau player HLS lain)

## Command

| Command | Deskripsi |
|---------|-----------|
| `/start` | Pesan sambutan + contoh |
| `/help` | Bantuan singkat |

## Struktur Project

```
UnlockedV2/
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── README.md
└── src/
    ├── index.ts          # Entry point
    ├── bot.ts            # Bot handlers
    ├── extract/
    │   ├── sites.ts      # Site configuration
    │   ├── extractor.ts  # HTTP extraction logic
    │   └── types.ts      # Types & error classes
    └── utils/
        ├── format.ts     # Response formatting
        └── logger.ts     # Simple logger
```

## Catatan

- Hanya untuk penggunaan pribadi/edukasi
- Butuh `ffmpeg` di device target untuk memutar HLS (mpv Android sudah include)
- Token kadaluarsa ±24 jam → kirim ulang link untuk refresh
- Mirror `vdko.de` & `streamrizz.com` didukung otomatis