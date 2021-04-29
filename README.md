# linkSpider.js

## What is linkSpider.js?
An injectable JavaScript Web Crawler built for modern browsers.

## Why ?
There are many great web crawlers already, but I needed a solution that didn't require software to be installed. My work was performed on a heavily restricted machine in an Enterprise environment, forcing me to push the limits of JavaScript-based automation. Over the years, I built a toolbox that is slowly becoming more modular, re-usable, and adaptable.

## How to use?
1. First, you will need a website to crawl, we'll call this the target domain.
1. Open the browser, go to the target domain, then open the developer console.
3. Copy and paste the linkSpider script into the console.
   !*WARNING*!: adjust the crawler's page LIMIT if needed.  Press Enter to start the crawler. 
4. Upon injection, the crawler gets all links from the page, downloads any new web pages that match the target domain, then repeats this process until it:
   1. reaches the page limit set by the user
   2. runs out of links to process
5. Once the crawler stops, a link report is generated, containing visited, queued, and external links. Visited links include the document title, if found.

## Notes on crawl speed & rate limiting: 
  1. Throttle controls can be adjusted using the built in delay timer. This reduces the chance of getting blocked by rate limiters.
  2. Use LIMIT to stop the crawler after visiting n links.

### Tracking Crawler Status
While the crawler is running, you can check the status in the console by typing in:

```crawler.links```
returns an object containing visted, internal, and "other" links for external links, and links that don't use a standard url.

### Crawler Killswitch
```crawler.stop()```
stop the crawler


## Benefits:
1. no install, assuming a web browser is available.
2. bypass weak anti-bot security without having to spoof the user agent.
   1. pages are processed in the background, using the Fetch & DOM Parser APIs. Crawling in the background improves performance by skipping the need to render each tab, and reduces bandwidth external resources from loading, such as tracking scripts, images, etc.
  4. Operates asynchronously, so the browser doesn't freeze during the crawl, allowing the user to use the browser while crawling the background.
  5. Using the browser's built-in network tab unlocks additional details like server response times, page sizes, etc. This allows the user to review crawl reports, look for errors, and track progress in realtime.



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
