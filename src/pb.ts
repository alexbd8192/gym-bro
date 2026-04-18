import PocketBase from 'pocketbase';

// Single PocketBase client instance shared across the app.
// Uses window.location.origin so it works in both environments:
//   dev  → http://localhost:5173  (Vite proxies /api/ → localhost:8090)
//   prod → https://gymbro.yourdomain.com  (nginx proxies /api/ → pocketbase container)
const pb = new PocketBase(window.location.origin);

export default pb;
