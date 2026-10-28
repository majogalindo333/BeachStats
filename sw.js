/* CentralCourt offline app shell. No personal scouting data leave the browser. */
const CACHE='centralcourt-pwa-v1-20261028';
const SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon.svg','./icons/apple-touch-icon.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('centralcourt-pwa-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  event.respondWith(fetch(req).then(response=>{
   if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy)).catch(()=>{});}
   return response;
  }).catch(()=>caches.match('./index.html').then(r=>r||caches.match('./'))));
  return;
 }
 event.respondWith(caches.match(req).then(hit=>hit||fetch(req)));
});