# linkSpider (v2)

An injectable, high-performance JavaScript web crawler designed for modern browsers. This script is built to be pasted directly into the developer console to automate link discovery and SEO data extraction without requiring any software installation.

## Key Features

- **Zero-Install**: Runs entirely in the browser console using native APIs (`Fetch`, `DOMParser`, `AbortSignal`).
- **Intelligent Normalization**: Automatically handles trailing slashes and query strings to prevent duplicate crawling of the same page.
- **Extension-Aware**: Detects file extensions (like `.html`, `.php`) to ensure correct link formatting.
- **SEO Extraction**: Automatically captures Page Title, H1 tags, and Meta Descriptions.
- **Redirect Handling**: Monitors redirects and captures the final destination URL for accurate reporting.
- **Anti-Bot Friendly**: Includes configurable delays and random jitter to mimic human-like browsing speeds.
- **Automated Reporting**: Generates a comprehensive JSON report and prompts for download upon completion or manual stop.

## How to Use

1. Navigate to the target domain in your browser.
2. Open the Developer Tools (F12 or Ctrl+Shift+I).
3. Copy the contents of `index.js` and paste it into the **Console** tab.
4. Press **Enter** to start the crawl.

### Configuration

You can adjust the crawler's behavior by modifying the parameters in the first line of the script:

```javascript
(async (lim = 250, gap = 300, to = 8000, skip = 'pdf|mp4|zip|jpg|png|gif|css|js|ico') => {
```

- `lim`: Maximum number of pages to crawl (default: 250).
- `gap`: Base delay between requests in milliseconds (default: 300).
- `to`: Request timeout in milliseconds (default: 8000).
- `skip`: Pipe-separated list of file extensions to ignore.

## Console API

While the crawler is running, you can interact with it via the `window.crawler` object:

- `crawler.stop()`: Halts the crawler immediately and prompts for a results download.
- `crawler.report()`: Returns a live summary of the current crawl status, including visited, failed, and external links.
- `crawler.docs`: An array of all successfully crawled page data.
- `crawler.links`: Access the raw `Set` objects for visited, queued, and external links.

## Output

The crawler generates a JSON report containing:
- **Summary**: Counts of successful, failed, and external links.
- **Docs**: Detailed data for each page (URL, Final URL, Title, H1, Description).
- **Failed**: A list of URLs that returned errors.
- **External**: A list of all unique external domains discovered.

## Limitations

- **CORS**: Subject to browser Same-Origin Policy. It can only crawl the domain it was injected into.
- **Dynamic Content**: Does not execute client-side JavaScript. Content rendered purely via JS frameworks (like React/Vue) after the initial load may not be fully captured.
- **Browser Security**: Some sites with strict security headers or advanced anti-bot protections may block the crawler.

---
*Note: Always ensure you have permission to crawl a website. Use responsibly.*
