self.addEventListener('install', function(event) {
    var CACHE_NAME = "yourbit-cache-v1";
    var urlsToCache = [
        "/",
        "/profile/templates/history/",
        "/profile/templates/messages/",
        "/profile/templates/orbits/",
        "/profile/templates/people/",
        "/profile/templates/stuff/",
        "/profile/templates/user/",
        "https://objects-in-yourbit-2.us-ord-1.linodeobjects.com/scripts/main/yb_master.js",
        "https://objects-in-yourbit-2.us-ord-1.linodeobjects.com/scripts/menu/yb_menu.js",  
        "https://objects-in-yourbit-2.us-ord-1.linodeobjects.com/scripts/yb_worker.js",
        "https://objects-in-yourbit-2.us-ord-1.linodeobjects.com/css/main/yb_core.css",
        "https://objects-in-yourbit-2.us-ord-1.linodeobjects.com/css/main/yb_animations.css",
        "https://objects-in-yourbit-2.us-ord-1.linodeobjects.com/css/main/yb_containers.css",
        "https://objects-in-yourbit-2.us-ord-1.linodeobjects.com/css/main/yb_buttons.css",
        "https://objects-in-yourbit-2.us-ord-1.linodeobjects.com/css/main/yb_modifiers.css",
        "https://objects-in-yourbit-2.us-ord-1.linodeobjects.com/css/main/yb_inputs.css",
        "https://objects-in-yourbit-2.us-ord-1.linodeobjects.com/scripts/yb_bitstream/yb_bitstream.js",
    ];
    

    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            // Cache hit - return response
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});

self.addEventListener('activate', function(event) {
    var cacheWhitelist = ['yourbit-cache-v1'];

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});