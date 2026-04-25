const CACHE = "attendease-v13"

const ASSETS = [
  "/AttendEase/",
  "/AttendEase/index.html",
]

self.addEventListener("install", (e) => {
  self.skipWaiting()
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  )
})

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
})

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  )
})

// open app when notification is tapped
self.addEventListener("notificationclick", (e) => {
  e.notification.close()
  e.waitUntil(
    clients.openWindow("/AttendEase/")
  )
})