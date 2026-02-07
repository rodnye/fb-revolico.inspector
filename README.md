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
pnpm run session:create
```

This will:

- Launch a Chromium browser instance
- Navigate to Facebook login
- Wait for manual authentication (5-minute timeout)
- Save the authenticated session to `.fb-session.json`

### 3. Verify Session Validity

After creating a session, you can verify if it's still valid and usable:

```bash
pnpm run session:check
```

This will:
- Check if the session file exists
- Validate that the session is still active
- Inform you if the session is valid or has expired

## Authentication Methods

### Option A: Local Session File (Default)

After running `session:create`, your session is saved to `.fb-session.json` in the project root.

### Option B: Environment Variable

Alternatively, set the `FB_SESSION_JSON` environment variable with the session JSON content:

```bash
export FB_SESSION_JSON='{"cookies":[...],"origins":[...]}'
```

## Workflow

1. **Create session**: `pnpm run session:create`
2. **Verify session**: `pnpm run session:check`
3. Use session

## Security Notes

- Session files contain authentication cookies and should be treated as sensitive data
- Use environment variables for production deployment
- Regularly check session validity with `session:check` to ensure your automation runs smoothly