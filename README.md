# linkSpider.js
A JavaScript Link Crawler you can inject in the browser.

I built this tool to discover all "visible" links on a few domains I own.

# How does it work?
As soon as you copy and paste this code into the console view of your browser and hit enter, you should see the requests logging  to the console. At any point while the crawler is running, you can check the status by typing in:

runLinkSpider.visitedLinks  - returns an array of the visted links
runLinkSpider.linkCollection  - returns an object containing 2 arrays, one for internal links, the other for external links
runLinkSpider.stop()  - stop the crawler

The crawler grabs all the links from the existing page by default. You can change the starting point to any page within the domain of the site you are visiting.

Once the crawler runs out of links to crawl or when the cutoff is reached (based on the number of visited links), the collected links will be logged to the console in the browser. Internal and External links are contained in different lists, but I plan to create a CSV export option soon.

# Use at your own risk. Don't run on sites you don't own without permission
This tool could break slow, outdated websites. This tool does not care about "nofollow" links by design. Always ask before running any script on a site you don't own. 

# Notes on crawl speed & rate limiting: 

Throttle controls can be added. Adding a simple delay timer would keep the request frequency within the bounds of most rate limiters. 
Just in case, there is a CUTOFF setting that will stop the crawler after it visits 10,000 links, this of course can be changed to meet your needs.

# Limitations:
Due to CORS, following external links typically won't work, but they are added to the collection of links. This tool wasn't intended to run in the wild. There are plenty of fancier crawlers to help you on your quest to download the entire internet.

# Future plans:
CSV exports:
As mentioned, I will be adding CSV downloader. So instead of just logging to the console, the scraped data will be exported to a CSV file.

Expanding on more than just link collection:
The DOM parser API can be used to collect more than just links. I have plans to expand on the capabilities, such as natural language processing, SEO reports, extracting tabular data, searching for certain types of files, etc.
