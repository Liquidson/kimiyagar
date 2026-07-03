'use strict';
/* Minimal service worker — registers cleanly without aggressive caching */
const CACHE_NAME = 'kimiya-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
