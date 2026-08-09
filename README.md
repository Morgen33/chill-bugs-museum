# Chill Bugs Museum

Personal museum wall for [Chill Bugs](https://opensea.io/collection/the-chillbugs) holders. Connect a wallet, hang your bugs in rarity-tiered frames.

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Purpose |
|----------|---------|
| `OPENSEA_API_KEY` | Server-side OpenSea API key |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect Cloud project id |
| `NEXT_PUBLIC_CHILLBUGS_CONTRACT` | Optional contract override |

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Rarity frames

OpenSea OpenRarity rank → top %:

- **Legendary** — top 1%
- **Rare** — top 10%
- **Uncommon** — top 25%
- **Common** — rest (also used when rarity is unavailable)

## Stack

Next.js, Tailwind, wagmi, RainbowKit, OpenSea API.
