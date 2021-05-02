var crawler;
(() => {
class linkSpider {
  constructor() {
    this.limit = 10;
    this.errorLimit = 50;
    this.delay = async ms => (console.log(`Delaying ${this.ms} milliseconds`),new Promise(r => setTimeout(r, ms)));
    this.ms = 0;// 500;
    this.stop = false;
    this.stopped = false;
    this.domain = window.location.origin;
    this.startPage = window.location.href;
    this.timer = setInterval(() => console.log({links:this.links, limit:this.limit}), 4000);
    this.report = [];
    this.errors = [];
    this.links = {
      internal: new Set(),
      other: new Set(),
      visited: new Set(),
      errors:new Set(),
      q: new Set()
    }
  }
  emptyQ(){
    return this.links.q.size == 0;
  }
  limitReached(){
    return this.limit == -1;
  }
  save(data, fileName){
      var d = document;
      var a = d.createElement('a');
      a.href = window.URL.createObjectURL(new Blob([d3.csvFormat(data)],{type:'text/csv;charset=utf-8;'}));
      a.setAttribute('download', `${fileName}.csv`);
      d.body.appendChild(a);
      a.click();
      d.body.removeChild(a);
  }
  halt() {
    this.stopped = true;
    this.stop = true;
    clearInterval(this.timer);
    console.log("Crawl Complete. Saving Link Report...");
    try{
      this.save(this.report, `${this.domain}_link_report`);
    }catch(e){console.log({"saveError":e})}
  }
  cleanStr(s) { return s.replace(/[^a-z0-9\s]/gim,"").replace(/[\s]+/gim, " ").trim()}
  extractLinks(doc, url){
      for(let a of doc.links){
        a = a.attributes.href.nodeValue.split("#")[0];
        if(a.indexOf("http") == 0){}else if(a.indexOf("/") == 0){
            a = this.domain+a;
        }else{
    		var relDir = a.match(/\.\.\//gim) || [];
    		var baseURL = (url.replace("//","@@")).split("/").slice(0,(-1*relDir.length-1)).join("/")+"/"
    		a = a.replace(/\.\.\//gim,"");
        a = (baseURL+a).replace(/\/+/gim,"/");
        a = a.replace("@@","//")
      }
        if(a && typeof a == "string" && !this.links.visited.has(a)){
            if (a.indexOf(this.domain) > -1) {
              this.links.q.add(a);
              this.links.internal.add(a);
            } else {
              this.links.other.add(a);
            }
        }
    }
  }
  buildReportItem(doc,status,url){
    return {
      title:this.cleanStr(doc.querySelector("title").innerText),
      h1:[...doc.querySelectorAll("h1")].map(el => this.cleanStr(el.innerText)),
      status,
      url
    }
  }
  processReportError(status,url){
    this.links.errors.add(url);
    var obj = {
      title:`Error`,
      status,
      url
    };
    this.report.push(obj);
    this.errors.push(obj);
    if(this.errors.length > this.errorLimit) this.stop = true;
  }
  async processResponse(response){
    var htmlString = await response.text();
    var doc = this.parseHTML(htmlString,response.url);
    this.extractLinks(doc, response.url);
    this.report.push(this.buildReportItem(doc,response.status,response.url));
  }
  parseHTML(htmlString,url) {
    var parser = new DOMParser();
    return parser.parseFromString(htmlString, "text/html");
  }
  next(){
    !this.emptyQ() && !this.limitReached() && !this.stop ?
      this.fetchURL([...this.links.q].shift()) :
      this.stopped ? null : this.halt();
  }
  async fetchURL(url) {
    if(typeof url == "string" && url.indexOf("http") == 0){
    this.links.q.delete(url);
    this.links.visited.add(url);
    try {
      if(this.ms > 0) await this.delay(this.ms);
      var response = await fetch(url);
      var status = response.status;
      status == 200 ? this.processResponse(response) : this.processReportError(status,url);

    }catch(e){
      this.processReportError("Error when attempting to fetch url",url)
      console.log({e})}
    }
    this.limit--;
    this.next();
  }
}
  var options = {
    scripts: ["https://d3js.org/d3.v6.min.js"]
  }
	var run = () => {
    crawler = new linkSpider();
    crawler.extractLinks(document, document.location.href);
    crawler.fetchURL(crawler.next());
  }
  const loadScripts = ({scripts}) => {
    var loaded = 0;
    var loadScript = (url) => {
      var scriptsLoaded = () => loaded == scripts.length ? run() : null;
      var imported = document.createElement('script');
      imported.src = url;
      imported.addEventListener("load", () => {
        loaded++;
        scriptsLoaded();
      });
      document.head.appendChild(imported);
    }
    scripts.forEach(loadScript)
  }
  loadScripts(options);
})()
