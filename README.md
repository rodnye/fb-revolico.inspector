# Facebook Groups Scraper

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=typescript&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

A browser automation tool for scraping Facebook groups, analyzing activity metrics, and generating ranked lists based on group engagement.

> [!IMPORTANT]
> Experimental Scraping Technique: This project implements an experimental scraping approach for Facebook. Since Facebook typically detects and redirects automation attempts to CAPTCHA, this tool requires a pre-authenticated browser session to bypass these restrictions.

> [!NOTE]
> Output files from GitHub Actions automations are available in [this branch](https://github.com/rodnye/fb-revolico.inspector/tree/output/ranking).

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

Available environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `HEADLESS` | Run browser in headless mode | `true` |
| `PREFIX_OUTPUT_FILE` | Prefix for ranking output files | `ranking` |
| `SEARCH_QUERIES_JSON` | JSON string with search queries (overrides file) | - |
| `FB_SESSION_JSON` | Facebook session data as JSON string | - |
| `EXECUTABLE_PATH` | Path to custom Chrome executable | - |

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
- Saves results to `output/{PREFIX_OUTPUT_FILE}_TIMESTAMP.json`

### Customize Search Queries

You can provide search queries in two ways:

1. **Via file** (default): Edit `src/constants/search-queries.json`:

```json
[
  { "query": "Revolico Habana", "max": 20 },
  { "query": "Compra Habana", "max": 20 }
]
```

2. **Via environment variable**: Set `SEARCH_QUERIES_JSON`:

```bash
export SEARCH_QUERIES_JSON='[{"query":"Revolico Habana","max":20}]'
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

---

Enjoy! ;)