export function projectAssetUrl(value, domain) {
  if (!value) return '';
  try { return new URL(value.startsWith('/') || /^https:/.test(value) ? value : `/${value}`, domain).href; }
  catch { return ''; }
}

// Only assets shipped with this app can fall back to the studio's own host.
// Other projects' custom paths must never show an unrelated sample image.
export const bundledAdminImages = [
  'img/header-jaz-training.jpg', 'img/header-jaz-coaching.jpg',
  'img/profile/profile.jpg', 'img/logo/jazboom.png', 'img/shop/reflex.jpg',
  'img/testimonials/default.jpg',
  ...['treadmill', 'deadlift', 'balance', 'muscle', 'exercise-routine'].map(name => `img/icons/${name}.gif`),
  ...[1, 2, 3, 4].map(id => `img/programs/${id}.jpg`),
];
const bundledPaths = new Set(bundledAdminImages);
export function projectAssetFallback(value) {
  if (typeof value !== 'string') return '';
  const path = value.replace(/^\//, '');
  return bundledPaths.has(path) ? `/${path}` : '';
}
