# QR Studio — Telegram Mini App

Beautiful QR codes. **$2 per generation**. Pay with Stripe or TON.

## Features

- ✅ All QR types: URL, WiFi, Email, Phone, SMS, vCard, Event, WhatsApp, Crypto
- ✅ All formats: PNG, SVG, JPEG
- ✅ Custom styling: colors, patterns, sizes
- ✅ **Pay per use** — no subscription

## Payment Methods

| Method | Currency | Processing |
|--------|----------|------------|
| **Stripe** | USD ($2.00) | Telegram Native Payments |
| **TON** | Crypto (~0.5 TON) | TonConnect |

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/Frederickhqz/qr-gen-telegram.git
cd qr-gen-telegram
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```bash
VITE_BOT_USERNAME=your_bot_username
VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/test_...
VITE_TON_CONNECT_MANIFEST=https://your-domain.com/tonconnect-manifest.json
VITE_TON_WALLET_ADDRESS=YOUR_TON_WALLET_ADDRESS
```

### 3. Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create product: "QR Code Generation" — $2.00
3. Create Payment Link
4. Copy link to `VITE_STRIPE_PAYMENT_LINK`

### 4. TON Setup

1. Create `tonconnect-manifest.json`:
```json
{
  "url": "https://your-domain.com",
  "name": "QR Studio",
  "iconUrl": "https://your-domain.com/icon.png"
}
```

2. Upload to your domain root
3. Get TON wallet address for payments

### 5. Telegram Bot Setup

```bash
# Talk to @BotFather
/newbot
/payments  # Enable Stripe
```

### 6. Deploy to Hostinger

```bash
git add .
git commit -m "Initial Telegram Mini App"
git push origin main
```

Hostinger auto-deploys from GitHub.

## Flow

1. User opens app in Telegram
2. Sees payment wall: **$2.00** or **TON**
3. Pays via Stripe or TON Connect
4. QR editor unlocks
5. Design, generate, download

## File Structure

```
src/
├── main.tsx          # TON Connect provider
├── App.tsx           # Main component with payment wall
├── App.css           # Styles
└── index.css         # Base styles
public/
├── manifest.json     # PWA manifest
└── icon.png          # App icon
```

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** for building
- **Tailwind CSS** for styling
- **qr-code-styling** for QR generation
- **@tonconnect/ui-react** for TON payments
- **Telegram Web App SDK** for native integration

## Security

- Payments verified server-side (webhooks)
- No sensitive data stored client-side
- Stripe handles PCI compliance
- TON transactions on-chain verifiable

## License

MIT — Enchantia Realms

<!-- Deployment test: Mon Feb 23 17:23:00 EST 2026 -->
