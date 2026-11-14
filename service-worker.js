const VERSION='V22',CACHE='xiaobu-v22';
const ASSETS=['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./app-update.js','./receipt-import-core.js','./receipt-import.js','./accounts-core.js','./accounts-tools.js'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(async cache=>{for(const url of ASSETS){const r=await fetch(new Request(url,{cache:'reload'}));if(!r.ok)throw Error(url);await cache.put(url,r)}})));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('xiaobu-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();if(event.data?.type==='VERSION')event.ports[0]?.postMessage(VERSION)});
self.addEventListener('fetch',event=>{const r=event.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==self.location.origin)return;event.respondWith((async()=>{const cache=await caches.open(CACHE);const hit=await cache.match(r.mode==='navigate'?'./index.html':r);return hit||fetch(r)})())});
