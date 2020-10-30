class linkSpider {
  constructor() {
    this.LIMIT = 200;
    this.delay = async ms => new Promise(r => setTimeout(r, ms));
    this.ms = false;// 500;
    this.stop = false;
    this.domain = window.location.origin;
    this.startPage = window.location.href;
    this.timer = setInterval(() => console.log({links:this.links, limit:this.LIMIT}), 4000);
    this.titles = {};
    this.links = {
      internal: new Set(),
      other: new Set(),
      visited: new Set(),
      q: new Set()
    }
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
  flattenJSON(o) {
    return Object.entries(o).reduce((arr,e) => {
      for (let url of e[1]){
        if(e[0] == "internal"){
          
        }else if(e[0] == "visited"){
          arr.push({type:e[0],url:url,title:this.titles[url]});
        }else{
          arr.push({type:e[0],url:url,title:""});
        }      
      }
      return arr;
    },[]);
  }
  halt() {
    this.stop = true;
    clearInterval(this.timer);
    console.log("Crawl Complete. Saving Link Report...");
    try{
      this.save(this.flattenJSON(this.links), `${this.domain}_link_report`);  
    }catch(e){console.log({"saveError":e})}
  }
  cleanStr(s) { return s.replace(/[^a-z0-9\s]/gim,"").replace(/[\s]+/gim, " ").trim()}
  parse(htmlString,url) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlString, "text/html");
    var links = new Set(doc.links);
    var title = doc.title;
    this.titles[url] = title;
    [...links].forEach(link => {
      var a = link.href;
      if (a.indexOf(this.domain) > -1) {
        this.links.q.add(a);
        this.links.internal.add(a);
      } else {
        this.links.other.add(a);
      }
  });
  }
  async fetchURL(url) {
    this.links.visited.add(url);
    this.links.q.delete(url);
    try {
      if(!isNaN(this.ms) && this.ms > 0){
        console.log(`Delaying ${this.ms} milliseconds`);
        await this.delay(this.ms);
      }
      var response = await fetch(url.split("#")[0].split("?")[0]);
      if (response.status == 200) {
        var htmlString = await response.text();
        this.parse(htmlString,url);
      }
    }catch(e){console.log({e})}
    if(this.links.q.size > 0 && this.links.visited.size < this.LIMIT && this.stop == false){
        this.fetchURL([...this.links.q].shift())
    }else{
      this.halt();
    }
  }
}
  var options = {
    scripts: ["https://d3js.org/d3.v6.min.js"]
  }
	var run = () => {
    var crawler = new linkSpider();
    crawler.fetchURL(window.location.href);
    
  }
  const loadScripts = ({scripts}) => {
    var scriptCountdown = scripts.length;
    var loadScript = (url) => {
      var scriptsLoaded = () => scriptCountdown == 0 ? run() : null;
      var imported = document.createElement('script');
      imported.src = url;
      imported.addEventListener("load", () => {
        scriptCountdown--;
        scriptsLoaded();
      });
      document.head.appendChild(imported);
    }
    scripts.forEach(loadScript)
  }
  loadScripts(options);
