class linkSpider {
  constructor() {
    this.newLinks = [];
    this.visitedLinks = [];
    this.CUTOFF = 10000;
    this.stopCrawl = false;
    this.domain = window.location.origin;
    this.startPage = window.location.href; //start from the current page
    //this.startPage = domain;  //start from the home page
    
    this.linkCollection = {
    	internal: [],
    	external: []
    }
  }

  stop(){
    this.stopCrawl = true;
  }

  getLinks(doc){
  	return [...doc.querySelectorAll('a')].reduce((collection,link) => {
  		collection.push({
  			title:link.title,
  			text:link.innerText.replace(/[^a-z0-9\s]/gim,"").replace(/[\s]+/gim," "),
  			href:link.href
  		})
  		return collection;
  	}, []);
  }

  parse(htmlString){
  		var parser = new DOMParser();
  		// Parse the text
  		var doc = parser.parseFromString(htmlString, "text/html");
  		var links = this.getLinks(doc);
  		links.filter(link => this.visitedLinks.indexOf(link.href) == -1).forEach(link => {
  				if(this.newLinks.indexOf(link.href) == -1){
  						if(link.href.indexOf(this.domain) > -1){
  							this.linkCollection.internal.push(link);
  							this.newLinks.push(link.href);
  						}else{
  							this.linkCollection.external.push(link);
  						}
  				}
  				this.visitedLinks.push(link.href);
  		})
  }

async fetchURL(url,options){
  try {
  	var response = await fetch(url, options);
    if(response.status == 200){
      var htmlString = await response.text();
      this.parse(htmlString,url);
    }else{
      console.log("ERROR: Server returned status:",response.status);
    }

  }
  catch(error) {
  	console.error(error);
  }
  if(this.newLinks.length > 0 && this.visitedLinks.length < this.CUTOFF && this.stopCrawl == false){
  	var newLink = this.newLinks.shift();
  	this.fetchURL(newLink)
  }else{
      if(this.visitedLinks.length >= this.CUTOFF){
        console.log("CUTOFF Reached");
      }else if(this.stopCrawl){
        console.log("Manually Stopped.",this.linkCollection)
      } else{
        console.log("DONE. No more links to crawl!",this.linkCollection)
      }
  				return true;
  		}
  }

}
var runLinkSpider = new linkSpider();
runLinkSpider.fetchURL(window.location.href);
