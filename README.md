# Númera Drops Telegram Mini App

Visual Mini App MVP for Númera Drop #001.

## What it does

- Mobile-first Telegram Mini App screen.
- 00-99 mystery grid with reveal interaction.
- Selection limit of 5 numbers.
- Sends the selected numbers back to the Telegram bot with `Telegram.WebApp.sendData`.
- The bot creates the real reservation and returns payment instructions.
- The visual grid can be static/demo data in v0; the bot is the source of truth for final availability.
- Participant ID display.
- Activation progress and drop stats.
- ONCE España result source link.
- Arbitrum USDC official wallet summary.
- Community/support link.

## Run locally

```bash
cd luckypool/apps/mini-app
python3 -m http.server 5174
```

Open:

```text
http://localhost:5174
```

## Telegram setup

Telegram Mini Apps require an HTTPS URL. For production, host this folder on a service such as Cloudflare Pages, Vercel, Netlify, or a VPS with HTTPS.

After hosting, configure the Telegram bot with:

```env
MINI_APP_URL=https://your-mini-app-url.example
```

Then restart the bot.

The bot will show an `Abrir Drop` button in the main menu only when `MINI_APP_URL` is set.
