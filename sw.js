/**
 * Service Worker for Markdown转换器 PWA
 * 提供离线缓存和性能优化功能
 */

const CACHE_NAME = 'markdown-converter-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './converter.js',
  './markdown-parser.js',
  './manifest.json',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

/**
 * Service Worker 安装事件
 * 预缓存核心资源
 */
self.addEventListener('install', event => {
  console.log('[SW] 安装中...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] 缓存文件...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] 安装完成');
        // 强制激活新的Service Worker
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] 安装失败:', error);
      })
  );
});

/**
 * Service Worker 激活事件
 * 清理旧缓存
 */
self.addEventListener('activate', event => {
  console.log('[SW] 激活中...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] 删除旧缓存:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] 激活完成');
        // 立即控制所有客户端
        return self.clients.claim();
      })
      .catch(error => {
        console.error('[SW] 激活失败:', error);
      })
  );
});

/**
 * 网络请求拦截
 * 实现缓存优先策略
 */
self.addEventListener('fetch', event => {
  // 只处理同源请求
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存中有，直接返回缓存
        if (response) {
          console.log('[SW] 从缓存返回:', event.request.url);
          return response;
        }

        // 缓存中没有，从网络获取
        console.log('[SW] 从网络获取:', event.request.url);
        return fetch(event.request)
          .then(response => {
            // 检查响应是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 克隆响应用于缓存
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
                console.log('[SW] 已缓存:', event.request.url);
              });

            return response;
          })
          .catch(error => {
            console.error('[SW] 网络请求失败:', error);

            // 如果是导航请求且网络失败，返回离线页面
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }

            throw error;
          });
      })
  );
});

/**
 * 处理消息事件
 * 支持客户端与Service Worker通信
 */
self.addEventListener('message', event => {
  console.log('[SW] 收到消息:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION',
      version: CACHE_NAME
    });
  }
});

/**
 * 后台同步事件
 * 处理离线时的操作
 */
self.addEventListener('sync', event => {
  console.log('[SW] 后台同步:', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(
      // 这里可以处理离线时保存的数据
      console.log('[SW] 执行后台同步任务')
    );
  }
});

/**
 * 推送通知事件
 * 处理推送消息（可选功能）
 */
self.addEventListener('push', event => {
  console.log('[SW] 收到推送消息');

  const options = {
    body: event.data ? event.data.text() : 'Markdown转换器有新的更新',
    icon: './icons/icon-192x192.png',
    badge: './icons/icon-72x72.png',
    tag: 'markdown-converter',
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification('Markdown转换器', options)
  );
});

/**
 * 通知点击事件
 * 处理用户点击通知的行为
 */
self.addEventListener('notificationclick', event => {
  console.log('[SW] 通知被点击');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('./')
  );
});