# Spider for Google Sheets

Google Sheets add-on with custom functions for web scraping, AI extraction, and search powered by the Spider API.

## Custom Functions

| Function | Description |
|----------|-------------|
| `=SPIDER_SCRAPE(url, [format])` | Scrape a URL. Format: `"markdown"`, `"text"`, `"raw"` |
| `=SPIDER_EXTRACT(url, prompt)` | AI extraction with a prompt |
| `=SPIDER_SEARCH(query, [num])` | Web search results (title, url, description) |
| `=SPIDER_LINKS(url)` | Extract all links from a page |
| `=SPIDER_SCREENSHOT(url)` | Get a screenshot URL |
| `=SPIDER_CREDITS()` | Check credit balance |

## Menu Actions

- **Settings** — Enter API key, set default format, view credits
- **Scrape Selected URLs** — Bulk scrape from selected cells
- **Crawl Site to New Sheet** — Crawl a site into a new tab
- **AI Extract Column** — AI extract from URL column with a prompt
- **Search to Sheet** — Search results into a new tab

## Setup

```bash
npm install
npx clasp login
npx clasp create --type sheets --title "Spider for Google Sheets"
# Copy the script ID into .clasp.json
npx clasp push
npx clasp open
```

Then open the linked Google Sheet — the **Spider** menu will appear after reload.

## Development

```bash
npx clasp push --watch   # Auto-push on file changes
npx clasp open           # Open Apps Script editor
```

## Requirements

- Node.js 18+
- Google account with Apps Script access
- Spider API key from [spider.cloud](https://spider.cloud)
