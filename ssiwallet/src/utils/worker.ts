export function registerWorker(val: string) {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register(val)
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });
  }
}

export function pushNotificationPermission() {
  if ("Notification" in window) {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted");
        } else {
          console.warn("Notification permission denied");
        }
      });
    }
  }
}

//!How to Implement
const handleOrder = async () => {
  navigator.serviceWorker.addEventListener("message", (e) => {
    console.log(e.data);
  });
  navigator.serviceWorker.ready.then((registration) => {
    // registration.active?.postMessage("hello");

    //@ts-ignore
    registration.sync.register("syncOrder");
  });
};

// useEffect(() => {
//   registerWorker("/service-worker.js");
//   pushNotificationPermission();
// }, []);
