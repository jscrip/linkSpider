(async () => {
var options = {
  maxDelay:20,
  crawlLimit:5000,
  errorLimit:20,
  domain:window.location.origin,
  startURL:window.location.href.split("#")[0],
  scripts: ["https://d3js.org/d3.v6.min.js"],
}
var delay = ms => new Promise(r => setTimeout(r, ms));
var ms = (n) => Math.round(Math.random()*n);
var downloadCSV = (data, fileName) => {
  var d = document;
  var a = d.createElement('a');
  a.href = window.URL.createObjectURL(new Blob([d3.csvFormat(data)],{type:'text/csv;charset=utf-8;'}));
  a.setAttribute('download', `${fileName}.csv`);
  d.body.appendChild(a);
  a.click();
  d.body.removeChild(a);
};
var crawler = async options => {
  const report = {
    errors:[],
    docs:[],
    links:new Set(),
    otherLinks:new Set(),
    mediaLinks:new Set(),
    crawled:new Set()
  };
  const cond = {
      crawled: (a) => !report.crawled.has(a+"/") && !report.crawled.has(a),
      status200: (r) => r.status == 200,
      mediaLink: (a) => a.match(/\.(jpg|jpeg|png|gif|webp|webm|mov|pdf|svg|css|js|mp4|mpeg|mpg|csv|xls|doc)/gim),
      startsOnDir: (a) => a.indexOf("/") == 0 || a.indexOf("./") == 0,
      absoluteRef: (a) => a.indexOf("http") == 0,
      inboundLink:(a) => a.indexOf(options.domain) > -1,
      otherLink:(a) => a.indexOf(":") > 0,
      fileExt: (a) => a.lastIndexOf("/") < a.lastIndexOf("."),
      endsOnDir: (a) => a.match(/\/$/gim),
      alphaNumLink: (a) => a.match(/^[a-z0-9]/gim),
      relDirParent: (a) => a.indexOf("../") == 0,
      limitReached: () => options.crawlLimit <= report.crawled.size || options.errorLimit <= report.errors.length
    };
  const labelLink = (el,url) => {
   var testInbound = (a) => {
    var inboundA = cond.inboundLink(a);
     if((inboundA || cond.inboundLink(a)) && cond.mediaLink(a) === null){ //inbound link (same domain as startURL)
      inboundA ? report.links.add(a) :report.links.add(el.href);
     }else{
			console.log({otherLink:a})
      report.otherLinks.add(a);
     }
   }
   var rebuildRelativeURL = (a) => {
     var relDir = a.match(/\.\.\//gim) || [];
      var baseURL = (url.replace("//","@@")).split("/").slice(0,(-1*relDir.length-1)).join("/")+"/"
      a = a.replace(/\.\.\//gim,"");
      a = (baseURL+a).replace(/\/+/gim,"/");
      return a.replace("@@","//");
   }
   var a = el.href ? el.attributes.href.nodeValue.split("#")[0] : "";
   el.href = el.href ? el.href.split("#")[0] : "";
   if(a != ""){
     if(cond.mediaLink(a)){
       if(cond.startsOnDir(a))
          a = el.href;
       report.mediaLinks.add(a);
     }else if(cond.absoluteRef(a) && cond.absoluteRef(el.href)){
       testInbound(a)
     }else if(cond.startsOnDir(a)){
      a = el.href;
      report.links.add(a)
     }else if(cond.otherLink(a)){ //tel: , mailto: , etc
      report.otherLinks.add(a);
     }else if(cond.relDirParent(a)){ //link contains a relative parent directory
      a = rebuildRelativeURL(a)
      report.links.add(a)
     }else if (cond.alphaNumLink(a)) { //relative link that starts with alphanum
      a = cond.endsOnDir(url) ?
       `${url}${a}` :
      cond.fileExt(url) ?
       `${url.replace("//","@@").split("/").slice(0,-1).join("/").replace("@@","//")}/${a}` :
      cond.fileExt(a) ?
       `${url}/${a}` :
      a;
      report.links.add(a)
    }
   }
 };
  const getLinks = (doc,url) => [...doc.querySelectorAll("a[href]")].forEach(el => labelLink(el,url));
  const parseDoc = async response => {
   var htmlString = await response.text();
   var parser = new DOMParser();
   return parser.parseFromString(htmlString, "text/html");
 };
  const processResponse = async (r,link) => {
    var {type,url,status,ok,redirected} = r;
    const buildReportItem = async () => {
      var doc = await parseDoc(r);
      report.docs.push({requestURL:link,type,responseURL:url,status,ok,redirected,title:doc ? doc.title || "" : ""});
      await getLinks(doc,url);
    }
    const buildReportError = () => {
      report.errors.push(r);
      report.docs.push({requestURL:link,type,responseURL:url,status,ok,redirected,title:"Error"});
    }
    cond.status200(r) ? await buildReportItem() : buildReportError();
  };
  const fetchURL = async link => {
    var t = ms(options.maxDelay);
     await delay(t);
     report.crawled.add(link);
    try{
		 console.log(link)
     var res = await fetch(link,{mode:"cors",redirect:"follow"});
     await processResponse(res,link);
    }catch(err){
     report.errors.push(err)
     console.log({err})
   }
  };
  const save = () => {
    downloadCSV(report.docs, "crawlReport-"+window.location.origin.replace(/\./gim,"_"));
    downloadCSV([
      ...[...report.links].map(a => ({url:a,type:"inbound"})),
      ...[...report.mediaLinks].map(a => ({url:a,type:"media"})),
      ...[...report.otherLinks].map(a => ({url:a,type:"outbound/other"}))],"linkReport-"+options.domain.replace(/\./gim,"_"))
  };
  const crawl = async () => {
    report.crawled.add(options.startURL);
    report.links.add(options.startURL);
    await getLinks(document,options.startURL);
    var linkIterator = report.links.values();
    for await (var link of linkIterator){
     if(cond.crawled(link)) await fetchURL(link); //request page if not visited
     if(report.crawled.size % 10 == 0) console.log({report,options}); //log report on every tenth page
     if(cond.limitReached()) break; //stop crawler if a limit is reached
    }
  };
  await crawl();
  save();
};
const loadScripts = ({scripts}) => {
  console.log(`Loading External Scripts`);
  var scriptCountdown = scripts.length;
  var loadScript = (url) => {
    var scriptsLoaded = async () => scriptCountdown == 0 ? crawler(options) : null;
    var imported = document.createElement('script');
    imported.src = url;
    imported.addEventListener("load", () => {
      scriptCountdown--;
      scriptsLoaded();
    });
    document.head.appendChild(imported);
  }
  scripts.forEach(loadScript)
};
loadScripts(options);

})()
