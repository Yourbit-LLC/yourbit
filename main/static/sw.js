// This is the service worker with the Cache-first network

console.log('Service Worker Loaded...');

const CACHE_NAME = "yourbit-cache-v1";
const PRECACHE_ASSETS = [
    "/",
    "/static/css/main/yb_core.css",
    "/static/css/main/yb_buttons.css",
    "/static/css/main/yb_containers.css",
    "/static/css/main/yb_modifiers.css",
    "/static/css/yb_profile/yb_profile.css",
    "/static/css/conversation/conversation.css",
    "/static/css/yb_bits/yb_bits.css",
    "/static/scripts/main/yb_master.js",
    "/static/scripts/main/yb_create.js",
    "/static/scripts/main/yb_elements.js",
    "/static/scripts/menu/yb_menu.js",
    "/static/scripts/yb_profile/yb_profile.js",

];



self.addEventListener('install', function(event) {

    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        cache.addAll(PRECACHE_ASSETS);
    })());
});


self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request)
        .then(function(response) {
            // Cache hit - return response
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
}
);

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
  });

self.addEventListener('push', (event) => {
    let pushMessageJSON = event.data.json();

    event.waitUntil(self.registration.showNotification(pushMessageJSON.title, {
        body: pushMessageJSON.body,
        tag: pushMessageJSON.tag,
        actions: [{
            action: pushMessageJSON.actionURL,
            title: pushMessageJSON.actionTitle
        }]
    })
    
)});

self.addEventListener('notificationclick', function(event) {
    if (!event.action) {
        // Was a normal notification click
        console.log('Notification Click.');
        return;
    }

    clients.openWindow(event.action);
});    

