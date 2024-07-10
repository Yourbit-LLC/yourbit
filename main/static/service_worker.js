// This is the service worker with the Cache-first network

console.log('Service Worker Loaded...');

const CACHE_NAME = "yourbit-cache-v1";
const PRECACHE_ASSETS = [
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

    try {
        event.waitUntil(self.registration.showNotification(pushMessageJSON.title, {
            body: pushMessageJSON.body,
            tag: pushMessageJSON.tag,
            icon: pushMessageJSON.icon,
            actions: pushMessageJSON.actions,
            data: {
                url: JSON.parse(event.message).url
              }
        }));
    } catch(err) {
        console.error(err);
    }
    
});

self.addEventListener('notificationclick', function(event) {
    if (!event.action) {
        // Was a normal notification click
        console.log('Notification Click.');
        return;
    }

    clients.openWindow(event.action);
});    

