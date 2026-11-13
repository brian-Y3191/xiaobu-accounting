const CACHE="xiaobu-v12";
const ASSETS=["./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>e.waitUntil(
  caches.open(CACHE).then(c=>Promise.allSettled(ASSETS.map(a=>c.add(a)))).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.origin!==self.location.origin)return;
  e.respondWith(fetch(r).then(res=>{
    if(res.status===200&&res.type==="basic"){const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy)).catch(()=>{})}
    return res;
  }).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==="navigate"?caches.match("./index.html"):undefined))));
});
