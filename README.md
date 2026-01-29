# Facebook Revolico Inspector

A browser automation tool for inspecting Facebook content and analyze the behavior of Cuba's most active buying and selling groups using scraping with Playwright.

> In development...

## Installation

```bash
pnpm install
```

## Setup

### 1. Configure Environment Variables

Create a `.env` file based on `.env.example`

```sh
cp .env.example .env
```

### 2. Create Facebook Session

Run the session creation script:

```bash
pnpm run create:session
```

This will:

- Launch a Chromium browser instance
- Navigate to Facebook login
- Wait for manual authentication (5-minute timeout)
- Save the authenticated session to `.fb-session.json`

## Authentication Methods

### Option A: Local Session File (Default)

After running `create:session`, your session is saved to `.fb-session.json` in the project root.

### Option B: Environment Variable

Alternatively, set the `FB_SESSION_JSON` environment variable with the session JSON content:

```bash
export FB_SESSION_JSON='{"cookies":[...],"origins":[...]}'
```

## Security Notes

- Session files contain authentication cookies and should be treated as sensitive data
- Use environment variables for production deployment
