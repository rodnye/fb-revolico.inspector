```
# Facebook Groups Scraper & Ranking Tool

A browser automation tool for scraping Facebook groups, analyzing activity metrics, and generating ranked lists based on group engagement. Built with Playwright and TypeScript.

> In development...

## Installation

```bash
pnpm install
```

## Setup

### 1. Configure Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

### 2. Create Facebook Session

Run the session creation script:

```bash
pnpm run session:create
```

This will:
- Launch a Chromium browser instance
- Navigate to Facebook login
- Wait for manual authentication (5-minute timeout)
- Save the authenticated session to `.fb-session.json`

### 3. Verify Session Validity

Check if your session is still active:

```bash
pnpm run session:check
```

## Core Features

### Generate Groups Ranking

Scrape and rank Facebook groups by activity level:

```bash
pnpm run scrap:ranking
```

**What this does:**
- Searches for groups using predefined queries from `search-queries.json`
- Extracts group metrics (member count, posts per day, privacy status)
- Removes duplicate groups by URL
- Ranks groups by activity (posts/day → member count → alphabetical)
- Saves results to `output/ranking_TIMESTAMP.json`

### Customize Search Queries

Edit `src/constants/search-queries.json` to modify search terms and result limits:

```json
[
  { "query": "Revolico Habana", "max": 20 },
  { "query": "Compra Habana", "max": 20 }
]
```

## Authentication Methods

### Option A: Local Session File (Default)

Session is saved to `.fb-session.json` after running `session:create`.

### Option B: Environment Variable

Set the `FB_SESSION_JSON` environment variable:

```bash
export FB_SESSION_JSON='{"cookies":[...],"origins":[...]}'
```

## Workflow

1. **Create session**: `pnpm run session:create`
2. **Verify session**: `pnpm run session:check`
3. **Generate ranking**: `pnpm run scrap:ranking`

## Project Structure

```
src/
├── logic/ranking.ts          # Ranking and deduplication logic
├── scraping/first-groups.ts  # Groups scraping functions
├── scraping/pipes/parse.ts   # Data parsing utilities
├── constants/                # Search queries configuration
├── scripts/                  # CLI entry points
└── types/                    # TypeScript definitions

output/                       # Generated ranking files
```

## Security Notes

- Session files contain authentication cookies - treat as sensitive data
- Use environment variables for production deployment
- Generated files are saved to `output/` directory (gitignored)