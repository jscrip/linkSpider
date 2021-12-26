(async function(){
var links = new Set();
var otherLinks = new Set();
var docs = [];
var crawled = new Set();
var crawlLimit = 250;
const getLinks = doc => {
 [...doc.querySelectorAll("a")].forEach(function(a){
  var link = a.href ? a.href.split("#")[0] : false;
  link && link.indexOf(window.location.origin) == 0 && ![".mp4",".pdf"].some(ext => link.indexOf(ext) > -1)? links.add(link) : otherLinks.add(link);
 })
}
const parseDoc = async (response) => {
 var htmlString = await response.text();
 var parser = new DOMParser();
 return parser.parseFromString(htmlString, "text/html");
}
await getLinks(document);
var linkIterator = links.values();
var fetchLink = async (url,options) => {
  try{
var response = await fetch(url,options);
if (response.status == 200) {
        if(crawled.has(link+"/") || crawled.has(link)){
        console.log("skipping..."+link)
         }else{
  crawled.add(link);
  var doc = await parseDoc(response);
        var {type,url,status,ok,redirected} = response;
        if(options.redirect == "follow"){
          console.log({type,link,url,status,ok,redirected,title:doc.title})
        }
        docs.push({type,link,url,status,ok,redirected,title:doc.title});
  await getLinks(doc);
}
} 
else if(response.status == 0){
    await fetchLink(link,{redirect:"follow"});
  }else{
  docs.push({type,link,url,status,ok,redirected,title:"Not Fetched"});
  console.log("ERROR: Server returned:", response);} //end if/else response.status == 200
  }catch(err){console.log({err})}
}
for await (var link of linkIterator){
      await fetchLink(link,{redirect:"manual"});
      crawled.size % 10 == 0 ? console.log({crawlLimit,crawled:crawled.size,docs}) : null; //log progess every 10 links
      if(crawlLimit <= crawled.size){break}
   }
 console.log({links,docs})
})()
