var idbKeyval=function(e){"use strict";class t{constructor(e="keyval-store",t="keyval"){this.storeName=t,this._dbp=new Promise((r,n)=>{const o=indexedDB.open(e,1);o.onerror=(()=>n(o.error)),o.onsuccess=(()=>r(o.result)),o.onupgradeneeded=(()=>{o.result.createObjectStore(t)})})}_withIDBStore(e,t){return this._dbp.then(r=>new Promise((n,o)=>{const s=r.transaction(this.storeName,e);s.oncomplete=(()=>n()),s.onabort=s.onerror=(()=>o(s.error)),t(s.objectStore(this.storeName))}))}}let r;function n(){return r||(r=new t),r}return e.Store=t,e.get=function(e,t=n()){let r;return t._withIDBStore("readonly",t=>{r=t.get(e)}).then(()=>r.result)},e.set=function(e,t,r=n()){return r._withIDBStore("readwrite",r=>{r.put(t,e)})},e.del=function(e,t=n()){return t._withIDBStore("readwrite",t=>{t.delete(e)})},e.clear=function(e=n()){return e._withIDBStore("readwrite",e=>{e.clear()})},e.keys=function(e=n()){const t=[];return e._withIDBStore("readonly",e=>{(e.openKeyCursor||e.openCursor).call(e).onsuccess=function(){this.result&&(t.push(this.result.key),this.result.continue())}}).then(()=>t)},e}({});

const CACHE_NAME = 'P2P-CDN-v1';
const version = '1.2.3';
var config = {}
var urlsToShare = "";
let hasClientConnection = false;

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
});

function setConfig(){
  idbKeyval.get('swConfig').then(function(wsConfig){
    config = wsConfig;

    if(typeof(config) !== 'undefined' && typeof(config.urlsToShare) !== 'undefined'){
      urlsToShare = config.urlsToShare.join('|');
    }
  });
}

self.addEventListener('activate', function(event) {
  // hasClientConnection = false;
  event.waitUntil(self.skipWaiting());
  self.clients.claim(); // Become available to all pages
});

function isClientReady(client){
  return new Promise(async function(resolve, reject) {
    const msg_chan = new MessageChannel();
    const timeout = 200;
    const msg = { type: 'heartbeat' }
    let receivedResponse = false;

    msg_chan.port1.onmessage = function(event) {
      receivedResponse = true;
      resolve(true);
    };

    // Send message to service worker along with port for reply
    setTimeout(function() {
      if (!receivedResponse) {
        msg_chan.port1.close();
        msg_chan.port2.close();
        console.log("client not ready")
        resolve(false)
      }
    }, timeout);

    client.postMessage(msg, [msg_chan.port2]);
  })
}

function sendMessageToClient(msg, clientID) {
  return new Promise(async function(resolve, reject) {
    const client = await clients.get(clientID);
    const clientReady = await isClientReady(client);
    if (typeof client === 'undefined' || !clientReady){
      resolve(false);
      return false;
    }

    const msg_chan = new MessageChannel();
    const timeout = 2000;
    let receivedResponse = false;

    // Handler for receiving message reply from service worker
    msg_chan.port1.onmessage = function(event) {
      receivedResponse = true;
      console.log('received message from client ', event.data);
      resolve(event);
    };

    // Send message to service worker along with port for reply
    setTimeout(function() {
      if (!receivedResponse) {
        msg_chan.port1.close();
        msg_chan.port2.close();
        console.log('close message channel');
        resolve(false);
      }
    }, timeout);

    client.postMessage(msg, [msg_chan.port2]);
  });
}

function getCacheKeys() {
  const result = [];

  return caches.open(version).then(cache => {
    return cache.keys().then(keys => {
      keys.forEach(key => {
        let url = key.url;
        result.push(url.substr(url.lastIndexOf('/') + 1));
      });

      return result;
    });
  });
}

function getFromCache(key) {
  return caches.open(version).then(cache => {
    return cache.match(key).then(response => {
      return response;
    });
  });
}

async function getFromClient(clientId, hash) {
  console.log('ask client to get: ', hash);
  // if(!hasClientConnection){
  //   console.log("client is not ready");
  //   return undefined;
  // }
  const msg = {type: 'request', hash};
  const message = await sendMessageToClient(msg, clientId);

  if (message.data)
    return new Response(message.data);

  return undefined;
}

function getFromInternet(url) {
  return fetch(url).then(response => {
    return response;
  });
}

// the request size is currently just an estimate for the needed size in the cache
async function getRequestSize(request){
  const obj = request.clone();
  const buffer = await obj.arrayBuffer()
  var view = new DataView(buffer);
  const offset = 3000;
  var requestSize = view.byteLength;
  var it = request.headers.entries();
  var header = it.next();
  var size = 0;
  while(!header.done){
    size += header.value[0].length;
    size += header.value[1].length;

    header = it.next();
  }
  requestSize += size
  requestSize += offset;

  // In case something goes wrong it is better to estimate the size with 0 than NaN,
  // to prevent the cache to be completely emptied
  if(isNaN(requestSize)){
    requestSize = 0;
  }

  return requestSize;
}

// removes the oldest request from the cache
// TODO: evtl so ändern das speicher bis zu einem bestimmten wert geschaffen wird --> performance
async function freeStorage(clientId){
  return new Promise(resolve =>{

    console.log("starting to free storage");
    caches.open(version).then(cache => {
      cache.keys().then(keys => {
        if(keys[0]){
          cache.delete(keys[0]).then( function() {
            resolve();
          });

          const urlArray = keys[0].url.split("/");
          const hash = urlArray[urlArray.length-1];
          notifyPeersAboutRemove(hash, clientId)
          console.log("Removed " + keys[0] + "from the cache")
        } else{
          resolve();
        }
      });
    });
  })
}

async function putIntoCache(key, response, clientId, iteration) {
  iteration = iteration || 0;
  const maxIteration = 100;
  const obj = response.clone();
  var storage = await navigator.storage.estimate();
  const usedStorage = storage.usage;
  var futureUsage = await getRequestSize(obj);
  futureUsage += usedStorage;

  if(!config.storageQuota ||
    (parseInt(config.storageQuota)*1000000 >= futureUsage &&
    storage.quota >= futureUsage)) {

    await caches.open(version).then(cache => {
      return cache.put(key, obj);
    });
  } else {
    if(iteration <= maxIteration){
      await freeStorage(clientId);
      putIntoCache(key, obj, clientId, iteration+1);
    }
  }
}

function handleRequest(url, clientId) {
  return new Promise((resolve) => {
    sha256(url).then(hash => {
      // check cache
      getFromCache(hash).then(cacheResponse => {
        if (cacheResponse && config.cachingEnabled) {
          console.log('cacheResponse ', cacheResponse);

          // This notify should not be needed
          notifyPeersAboutAdd(hash, clientId);
          resolve(cacheResponse);
          return;
        }
        // check peers
        getFromClient(clientId, hash).then(peerResponse => {
          if (peerResponse) {
            console.log('peerResponse ', peerResponse);
            putIntoCache(hash, peerResponse, clientId);
            notifyPeersAboutAdd(hash, clientId);
            resolve(peerResponse);
            return;
          }
          // get from the internet
          getFromInternet(url).then(response => {
            console.log('internet response ', response);
            putIntoCache(hash, response, clientId);
            notifyPeersAboutAdd(hash, clientId);
            resolve(response);
          });
        });
      });
    });
  });
}

self.addEventListener('fetch', function(event) {
  const request = event.request;
  const url = new URL(event.request.url);

  console.log('received request: ' + url);

  if (urlsToShare === "") {
    setConfig();
    return;
  }

  if (!new RegExp(urlsToShare, 'gi').test(url.href)) return;

  console.log('sw handles request: ' + url);

  if (!event.clientId) return;

  console.log('fetch --> ', event.request.url);

  event.respondWith(handleRequest(event.request.url, event.clientId));
});

self.addEventListener('message', function(event) {
  const msg = event.data;

  if (msg.type === 'cache') {
    getCacheKeys().then(keys => {
      event.ports[0].postMessage(keys);
    });
  } else if (msg.type === 'resource') {
    getFromCache(msg.resource).then(cacheResponse => {
      console.log('cached object ', cacheResponse);
      cacheResponse.arrayBuffer().then(buffer => {
        console.log('got buffer ', buffer);
        event.ports[0].postMessage(buffer, [buffer]);
      });
    });
  } else if (msg.type === 'status' && msg.msg === 'ready') {
    setConfig();
    hasClientConnection = true;
  }
});

'use strict';

function getLogger(scope) {
  if (typeof debug !== 'undefined') {
    return debug(scope);
  }
  return function () {};
}

function toHex(buffer) {
  var hexCodes = [];
  var view = new DataView(buffer);

  for (var i = 0; i < view.byteLength; i += 4) {
    var value = view.getUint32(i);
    var stringValue = value.toString(16);
    var padding = '00000000';
    var paddedValue = (padding + stringValue).slice(-padding.length);

    hexCodes.push(paddedValue);
  }
  // Join all the hex strings into one
  return hexCodes.join('');
}

function sha256(str) {
  var buffer = new TextEncoder('utf-8').encode(str);

  return crypto.subtle.digest('SHA-256', buffer).then(function (hash) {
    return toHex(hash);
  });
}

function abToStr(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function strToAb(input) {
  var str = input;
  if (typeof input === 'number') str = input.toString();

  var buf = new ArrayBuffer(str.length); // 1 bytes for each char
  var bufView = new Uint8Array(buf);

  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }

  return buf;
}

function concatAbs(abs) {
  var byteLength = 0;
  var length = 0;

  abs.forEach(function (ab) {
    byteLength += ab.byteLength;
  });

  var result = new Uint8Array(byteLength);

  abs.forEach(function (ab) {
    result.set(new Uint8Array(ab), length);
    length += ab.byteLength;
  });

  return result;
}

async function notifyPeers(hash, clientID, type) {
  const msg = {type: type, hash};
  const client = await clients.get(clientID);

  if(!client) return;

  client.postMessage(msg);
}

async function notifyPeersAboutAdd(hash, clientID) {
  notifyPeers(hash, clientID, 'addedResource');
}

async function notifyPeersAboutRemove(hash, clientID) {
  notifyPeers(hash, clientID, 'removedResource');
}
