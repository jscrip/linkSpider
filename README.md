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
  4. Operates asynchronously, so the browser doesn't freeze during the crawl, allowing the user to use the browser while crawling the background.
  5. Using the browser's built-in network tab unlocks additional details like server response times, page sizes, etc. This allows the user to review crawl reports, look for errors, and track progress in realtime.

## Reporting (CSV Export):
Once the crawler stops, it generates a CSV report containing visited, queued, and external links. Visited links include the document title, if found.

## Notes on crawl speed & rate limiting: 
  1. Throttle controls can be adjusted using the built in delay timer. This reduces the chance of getting blocked by rate limiters.
  2. Use LIMIT to stop the crawler after visiting n links.

## Browser Security Limitations:
Out of the box, only 1 domain can be crawled per instance. External links cannot be followed due to baked-in browser security. While I can't recommend bypassing browser security, I have had success with the following two methods:

1. Browser Extensions
      1. Userscript Managers like Tampermonkey and Greasemonkey take browser-based automatation to another level.
      2. Automate custom JavaScript injection on any webpage.
      3. Match scripts to specific pages by creating filters & rules based on URL patterns, params, etc.
      4. Cross-tab Communication allows a tab to create, control, and delete other tabs. A crawler can use this feature to:
        1. make parallel page requests
        2. automatically spawn a crawler for each new domain
        3. automate the occassional bulk data-entry task.

2. Proxy Server
      1. While more complicated than browser extensions, the gist is simple: make external requests look like they are coming from the same domain.
      2. This requires a web server with at least a static home page and an API for processing external links
      3. Access the proxy server from the browser, then launch the crawler with a URL or list of links.
      4. Send external links to the proxy server as a URL param, POST request, or a WebSocket message.
      5. The proxy server handles the request and forwards the response to the browser, bypassing CORS restrictions.
  
## Future Plans:
Expanding on more than just link collection:
The DOM parser API can be used to collect more than just links. I have plans to expand on the capabilities, such as natural language processing, SEO reports, extracting tabular data, searching for certain types of files, etc.
