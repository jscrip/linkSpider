class linkSpider {
  constructor() {
    this.CUTOFF = 100;
    this.stopCrawl = false;
    this.domain = window.location.origin;
    this.startPage = window.location.href; //start from the current page
    //this.startPage = domain;  //start from the home page

    this.links = {
      internal: [],
      external: [],
      misc: [],
      visited: new Set(),
      q: new Set()
    }

  }

  stop() {
    this.stopCrawl = true;
  }

  getLinks(doc) {
    return [...doc.querySelectorAll('a')].reduce((collection, link) => {
      collection.push({
        title: link.title,
        text: link.innerText.replace(/[^a-z0-9\s]/gim, "").replace(/[\s]+/gim, " "),
        href: link.href
      })
      return collection;
    }, []);
  }

  parse(htmlString) {
    var regExURL = RegExp('([--:\w?@%&+~#=]*\.[a-z]{2,4}\/{0,2})((?:[?&](?:\w+)=(?:\w+))+|[--:\w?@%&+~#=]+)?', 'g');
    var parser = new DOMParser();
    // Parse the text
    var doc = parser.parseFromString(htmlString, "text/html");
    var links = new Set(this.getLinks(doc));

    /*
    	filter out the links that have already been visited, then loop through each remaining link

    */
    [...links].filter(link => !this.links.visited.has(link.href)).forEach(link => {
      //try to add the link to the link queue. Since it is a set, duplicates will not be added, so we can skip needing an extra conditional statement

      if (link.href.indexOf(this.domain) > -1) {
        this.links.q.add(link.href);
        var alreadyExists = this.links.internal.find(i => i.href == link.href);
        if(!alreadyExists){
            this.links.internal.push(link); //if the link contains the domain, add it to the internal link list
        }
      } else if (regExURL.test(link.href)) {
        //	this.links.q.add(link.href);
        var alreadyExists = this.links.external.find(e => e.href == link.href);
        if(!alreadyExists){
            this.links.external.push(link); //otherwise add links containing URLs to the external link list
        }
      
      } else {
        this.links.misc.push(link); //otherwise add it to misc links.
      }
    })

  }

  async fetchURL(url, options) {

    this.links.visited.add(url);
    this.links.q.delete(url)

    try {
      var response = await fetch(url, options);
      if (response.status == 200) {
        var htmlString = await response.text();
        this.parse(htmlString);
      } else {
        console.log("ERROR: Server returned status:", response.status);
      }

    } catch (error) {
      console.error(error);
    }
    /*if there are still links to crawl & we haven't reached our cutoff point & we haven't forced the crawler to stop,
    	then fetch the next link.
    */
    if (this.links.q.size > 0 && this.links.visited.size < this.CUTOFF && this.stopCrawl == false) {
      this.fetchURL([...this.links.q].shift())
    } else { //Logic to log the reason the crawler stopped.
      if (this.links.visited.size >= this.CUTOFF) {
        console.log("CUTOFF Reached", this.links);
      } else if (this.stopCrawl) {
        console.log("Manually Stopped.", this.links)
      } else {
        console.log("DONE. No more links to crawl!", this.links)
      }
      return this.links;
    }

  }

}
var crawler = new linkSpider();
crawler.fetchURL(window.location.href)
