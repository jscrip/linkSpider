# linkSpider.js
An Injectable Web Crawler for the browser.

## How does it work?
Upon injection, the crawler gathers links from the page, then continues to crawl the target domain until it:

1. visits all internal links, or
2. reaches the page limit set by the user.

At any point while the crawler is running, you can check the status in the console by typing in:

```crawler.links```
returns an object containing visted, internal, and "other" links for external links, and links that don't use a standard url.

```crawler.stop()```
stop the crawler

## Why?
While Puppeteer, Nightmare, Selenium, Scrapy, and the heaps of other tools are great, I needed a no-install solution for automating web-based tasks at work, using a PC with restricted user policies. After building the same basic functionality a few times over, I began making things more modular. This script is a general starting point for more advanced solutions like report generators and bulk data tools.

## Benefits:
  1. no install, assuming a web browser is available. This is especially useful on machines with limited admin rights & privelages.
  2. bypass anti-bot security without having to spoof the user agent. Not foolproof, but surpisingly effective at evading anomaly detection on some systems.
  3. pages are loaded in the background, using the Fetch & DOM Parser APIs. While improving performance, this also helps prevent detection by preventing external   resources from loading, such as tracking scripts, images, etc.
  4. Operates asynchronously, reducing the chance that the browser will crash and allowing the user to multitask while crawling.
  5. Use the dev console to unlock additional details like response times, page sizes, etc.

## Reporting (CSV Export):
Once the crawler stops, it generates a CSV report containing visited, queued, and external links. Visited links include the document title, if found.

## Notes on crawl speed & rate limiting: 
Throttle controls can be adjusted using the built in delay timer. This reduces the chance of getting blocked by rate limiters.
Also, there is a LIMIT setting that will stop the crawler after it visits n links.

## Browser Security Limitations:
Due to CORS, following external links typically won't work in the browser, but they are still collected in the crawl report.

## Future Plans:
Expanding on more than just link collection:
The DOM parser API can be used to collect more than just links. I have plans to expand on the capabilities, such as natural language processing, SEO reports, extracting tabular data, searching for certain types of files, etc.
