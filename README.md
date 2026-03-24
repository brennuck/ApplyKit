# ApplyKit

Your clipboard, supercharged for applications. One-click copy for LinkedIn, GitHub, portfolio, and more — right on the page where you're applying.

## Features

- **One-click copy buttons** — floating sidebar with quick-copy for LinkedIn, GitHub, portfolio, email, phone, and custom fields
- **Auto-fill** — automatically detects and fills matching inputs (first name, last name, full name, email, phone, etc.)
- **Auto-paste** — click a copy button to paste directly into the focused input
- **Resume drag & drop** — drag your uploaded resume onto file inputs
- **Custom fields** — add any extra values you copy frequently
- **Synced settings** — your config syncs across Chrome instances

## Supported Sites

- LinkedIn
- Indeed
- Greenhouse
- Lever
- Workday
- BambooHR
- Gusto
- Ashby
- ADP Workforce Now
- Paylocity

## Development

### Prerequisites

- Node.js 18+
- Google Chrome

### Setup

```bash
npm install
```

### Dev Server

```bash
npm run dev
```

Then load the extension in Chrome:

1. Navigate to `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `dist` folder in this project

Vite will hot-reload changes automatically.

### Production Build

```bash
npm run build
```

The built extension will be in `dist/`.

## Configuration

1. Right-click the ApplyKit icon in Chrome's toolbar → **Options**
2. Fill in your first name, last name, LinkedIn, GitHub, portfolio, email, and phone
3. Upload your resume for drag & drop
4. Toggle **Auto-paste** and **Auto-fill** under Preferences
5. Add any custom fields you need
6. Click **Save Settings**
