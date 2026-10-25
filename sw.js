var CACHE='pocket-player-v17';
var FILES=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==CACHE}).map(function(n){return caches.delete(n)}))}).then(function(){return self.clients.claim()}))});
// Offline first: answer from the saved copy instantly, refresh it in the background when online.
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  if(new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(hit){
    var net=fetch(e.request).then(function(res){
      if(res&&res.ok&&new URL(e.request.url).origin===location.origin){var c=res.clone();caches.open(CACHE).then(function(ca){ca.put(e.request,c)})}
      return res;
    }).catch(function(){return null});
    if(hit){e.waitUntil(net);return hit}
    return net.then(function(res){return res||caches.match('index.html')});
  }));
});
