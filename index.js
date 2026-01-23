(async (lim = 250, gap = 300, to = 8000, skip = 'pdf|mp4|zip|jpg|png|gif|css|js|ico') => {
  const start = location.href.replace(/\/(\?|$)/, '$1');
  const v = new Set(), q = [location.href], seen = new Set([start]), docs = [], failed = [], ext = new Set();
  const c = window.crawler = { 
    run: 1, done: 0, s: location.href.replace(/\?.*/, '').endsWith('/'), docs, failed, links: { v, q, ext }, 
    stop: () => { c.run = 0; c.dl(); },
    report: () => ({ summary: { ok: docs.length, fail: failed.length, ext: ext.size, q: q.length }, docs, failed, ext: [...ext] }),
    dl: () => !c.done++ && confirm('Download results?') && Object.assign(document.createElement('a'), {href: URL.createObjectURL(new Blob([JSON.stringify(c.report(), null, 2)], {type: 'application/json'})), download: 'crawl.json'}).click()
  };
  
  const add = (d, base) => d.querySelectorAll('a[href]').forEach(a => {
    try {
      const u = new URL(a.getAttribute('href'), base); u.hash = '';
      const h = u.href.replace(/\/(\?|$)/, '$1'), home = u.origin === location.origin;
      if (home && !seen.has(h) && !new RegExp(`\\.(${skip})$`, 'i').test(h)) {
        seen.add(h); q.push(c.s && !/\.[a-z0-9]+$/i.test(u.pathname) ? h.replace(/(\?|$)/, '/$1') : h);
      } else if (!home) ext.add(h);
    } catch {}
  });

  console.log("Spider active. Use crawler.stop() to halt.");
  while (q.length && c.run && v.size < lim) {
    const url = q.shift(); v.add(url);
    try {
      if (v.size > 1) await new Promise(r => setTimeout(r, gap + Math.random() * 100));
      const res = await fetch(url, { signal: AbortSignal.timeout(to) });
      if (!res.ok) throw `Status ${res.status}`;
      c.s = res.url.replace(/\?.*/, '').endsWith('/');
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      docs.push({ url, final: res.url, title: doc.title, h1: doc.querySelector('h1')?.innerText.trim(), desc: doc.querySelector('meta[name="description"]')?.content });
      add(doc, res.url);
    } catch (e) { failed.push({ url, err: e.message || e }) }
    if (v.size % 10 === 0) console.log(`Progress: ${v.size}/${lim} | Queue: ${q.length}`);
  }
  console.log("Crawl Finished!", c.report());
  c.dl();
})(250, 300, 8000);
