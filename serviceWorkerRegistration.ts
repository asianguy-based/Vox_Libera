
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Use a simple relative path to avoid URL constructor errors in preview environments
      const swUrl = './service-worker.js';
      
      navigator.serviceWorker.register(swUrl).then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, (err) => {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
}
