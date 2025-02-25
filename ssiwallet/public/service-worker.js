//!Inits
self.addEventListener("install", () => {
  console.log("service worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("service worker activated");
});

//!Cache
const cacheName = "v1";
const cacheClone = async (e) => {
  const res = await fetch(e.request);
  const resClone = res.clone();

  const cache = await caches.open(cacheName);
  await cache.put(e.request, resClone);
  return res;
};

const fetchEvent = () => {
  self.addEventListener("fetch", (e) => {
    e.respondWith(
      cacheClone(e)
        .catch(() => caches.match(e.request))
        .then((res) => res)
    );
  });
};

// fetchEvent();

//!Notification
self.addEventListener("push", (event) => {
  const data = event.data.json();
  const title = data.title;
  const body = data.message;
  const icon = "some-icon.png";
  const notificationOptions = {
    body: body,
    tag: "esquire-cms-notification",
    icon: icon,
  };

  return self.Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      return new self.Notification(title, notificationOptions);
    }
  });
});

//!Message
self.addEventListener("message", (e) => {
  console.log(e.data);
});
self.addEventListener("sync", (e) => {
  if (e.tag == "syncOrder") {
    e.waitUntil(handleOrder(e));
  }
});

function handleOrder(e) {
  console.log("Order");
}
