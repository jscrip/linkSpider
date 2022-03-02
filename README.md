# linkSpider.js

## What is linkSpider.js?
An injectable JavaScript Web Crawler built for modern browsers.

## Why ?
I saw an opportunity to automate redundant tasks at work, but I couldn't install software on my work PC. It was difficult to get new software approved, so I experimented with building web crawlers that could be injected into a browser such as firefox or chrome.

## How to use?
1. First, you will need a website to crawl, we'll call this the target domain.
2. Open the browser, go to the target domain, then copy and paste the code into the developer console. 
3. Adjust the settings such as PAGE LIMIT, then to start the crawler, Press Enter. 
4. Upon injection, the crawler gets all links from the page, then crawls inbound links until it:
   1. reaches the page limit
   2. visits all pages found on to the target domain
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
2. bypass weak anti-bot security without spoofing the user agent.
3. Crawler runs asynchronously in the background, using the Fetch & DOM Parser APIs. 
   1. Parsing pages in the background improves performance and reduces the request volume by skipping external resources like tracking scripts and images.
   2. Other browser tabs can be used while the crawler runs.
4. Easily monitor the crawl in realtime using the network tab in the developer console. Get additional data such as server response time, and page size.

## Limitations:
1. Does not work for pages that rely on Front-End Javascript to display content. In theory, this can be solved by using a userscript plugin and opening each page in a new tab. It is possible to manage tabs and inject scripts using such a tool. While I have experimented with this method, I do not require this method, and have ceased to work on it for the time being.
2. Bugs are likely, and anti-bot security can still detect the crawler in some cases. Use at your own risk and never use this script on a site without permission. You may get banned from certain sites if they believe you are abusing their systems.

## Additional Browser Security Limitations:
Out of the box, only 1 domain can be crawled per instance. External links cannot be followed due to baked-in browser security. While I can't recommend bypassing browser security, I have had success with the following two methods:

1. Browser Extensions
   1. Userscript Managers like Tampermonkey and Greasemonkey take browser-based automatation to another level.
   2. Automate custom JavaScript injection on any webpage.
   3. Match scripts to specific pages by creating filters & rules based on URL patterns, params, etc.
   4. Cross-tab Communication enables tabs to control other tabs. Bypass the 1-domain limitation by automatically creating a new tab for each external domain.
  
2. Proxy Server
   1. An attempt to trick the browser into making external requests by tunneling requests through a proxy server.
   2. Access the proxy server from the browser, and launch the crawler with a seed URL or list of links.
   3. The proxy server handles the request and forwards the response to the browser, bypassing CORS restrictions.
  
## Future Plans:
Expanding on more than just link collection:
The DOM parser API can be used to collect more than just links. I have plans to expand on the capabilities, such as natural language processing, SEO reports, extracting tabular data, searching for certain types of files, etc.
