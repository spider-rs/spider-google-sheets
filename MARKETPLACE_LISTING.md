# Google Workspace Marketplace Listing

Use this copy when filling out the Marketplace listing at:
https://console.cloud.google.com → Google Workspace Marketplace SDK → Configuration

---

## App Name
Spider for Google Sheets

## Short Description (≤140 chars)
Scrape websites, extract data with AI, and search the web — all from Google Sheets formulas.

## Detailed Description

Spider for Google Sheets brings powerful web scraping directly into your spreadsheet. Use simple formulas to scrape pages, extract links, search the web, and pull structured data with AI — no code required.

**Custom Functions**

• =SPIDER_SCRAPE(url) — Scrape any webpage and return its content as markdown, plain text, or raw HTML.
• =SPIDER_EXTRACT(url, prompt) — Use AI to extract specific data from a page. Just describe what you need in plain English.
• =SPIDER_SEARCH(query) — Search the web and get results (title, URL, description) directly in your sheet.
• =SPIDER_LINKS(url) — Extract every link from a page into a vertical list.
• =SPIDER_SCREENSHOT(url) — Get a screenshot URL for any webpage.
• =SPIDER_CREDITS() — Check your remaining credit balance.

**Bulk Actions via Menu**

• Scrape Selected URLs — Select cells with URLs, scrape them all at once, results appear in adjacent columns.
• Crawl Site to New Sheet — Enter a URL and page limit, get every crawled page in a new tab.
• AI Extract Column — Select URLs + enter a prompt, get AI-extracted data in a new column.
• Search to Sheet — Run a search query, results populate a new tab.

**Built for Speed**

Spider is the fastest web crawler available. Results are cached for 6 hours so repeated lookups are instant.

**How to Get Started**

1. Install the add-on
2. Open Spider → Settings from the menu bar
3. Enter your Spider API key (get one free at spider.cloud)
4. Start using =SPIDER_SCRAPE() in any cell

Requires a Spider API key. AI extraction features require an AI Studio subscription.

## Category
Productivity

## Supported Regions
All

---

## Assets Needed (prepare manually)

- **Icon 128x128**: Use Spider logo from https://spider.cloud/img/spider-logo.png (resize to 128x128)
- **Icon 32x32**: Same logo resized to 32x32
- **Screenshots**: Use preview.png from the repo (already has scrape + sidebar demo)
- **Banner (optional)**: 220x140 marquee banner

---

## Steps to Publish

1. Go to https://console.cloud.google.com
2. Select/create a GCP project for spider.cloud
3. Enable "Google Workspace Marketplace SDK" API
4. Link the Apps Script project to this GCP project:
   - Open https://script.google.com/d/1QyWXp7bHQSTc3Lm_87Y2U4ZbiPvbiC2sVVfoeNbvrwHh60HyQgcywkas/edit
   - Project Settings → Change GCP project → enter GCP project number
5. Configure OAuth consent screen (APIs & Services → OAuth consent screen):
   - External, app name "Spider for Google Sheets", support email
   - Add scopes: spreadsheets.currentonly, script.external_request, userinfo.email, script.container.ui
6. Go to Google Workspace Marketplace SDK → Configuration
   - Paste the copy above
   - Upload icons and screenshots
   - Set visibility to Public
   - Set deployment ID: AKfycbwNaGacVyE7rRfY7mfs7lTMZz-Mq998-YJ6J3wxPEZrcDqsb-FxxKEBkDmyAkQrJct8
7. Pay $5 developer fee at https://chrome.google.com/webstore/devconsole (one-time)
8. Submit for review
