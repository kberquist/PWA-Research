var CACHE_STATIC_NAME = 'static-v4';
var CACHE_DYNAMIC_NAME = 'dynamic-v4';

self.addEventListener('install',function(event){
    console.log('[Service Worker] Installing Service worker ...',event);
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME).then(
            function(cache){
                console.log('[Service Worker] Precaching App Shell');
                
                //Be careful, if one url is wrong, it seems like the entire
                //array will not be cached
                cache.addAll([
                    '/',
                    '/index.html',
                    '/src/js/app.js',
                    '/src/js/feed.js',
                    '/src/js/promise.js',
                    '/src/js/fetch.js',
                    '/src/js/material.min.js',
                    '/src/css/app.css',
                    '/src/css/feed.css',
                    '/src/images/main-image.jpg',
                    'https://fonts.googleapis.com/css?family=Roboto:400,700',
                    'https://fonts.googleapis.com/icon?family=Material+Icons',
                    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
                ]);
                                
                // cache.add('/')
                // cache.add('/index.html')
                // cache.add('/src/js/app.js')
                // cache.add('/src/js/feed.js')
                // cache.add('/src/js/promise.js')
                // cache.add('/src/js/fetch.js')
                // cache.add('/src/js/material.min.js')
                // cache.add('/src/css/app.css')
                // cache.add('/src/css/feed.css')
                // cache.add('/src/images/main-image.jpg')
                // cache.add('https://fonts.googleapis.com/css?family=Roboto:400,700')
                // cache.add('https://fonts.googleapis.com/icon?family=Material+Icons')
                // cache.add('https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css')
            }
        ))     
}); 

self.addEventListener('activate',function(event){
    console.log('[Service Worker] Activating Service worker ...',event);
    event.waitUntil(
        caches.keys()
            .then(function(keyList){
                return Promise.all(keyList.map(
                    function(key){
                        if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME){
                            console.log('[Service Worker] removing old cache', key);
                            return caches.delete(key);
                        }
                    }));
            })
    );
    return self.clients.claim();
});

self.addEventListener('fetch',function(event){
    //console.log('[Service Worker] Fetching something....',event);
    //event.respondWith(fetch(event.request));
    event.respondWith(
        caches.match(event.request)
            .then(function(response){
                if(response){
                    return response;
                }else{
                    return fetch(event.request)
                    .then(function(res){
                        return caches.open(CACHE_DYNAMIC_NAME)
                        .then(function(cache){
                            cache.put(event.request.url,res.clone());
                            return res;
                        })
                    }).catch(function(err){
                        
                    }); 
                }
            })
    );    
});  