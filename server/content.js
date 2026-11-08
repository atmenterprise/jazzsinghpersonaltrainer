export const resources = {
  programmes: { name: ['name', 200], short_description: ['description', 10000], image_url: ['image', 2048], program_id: ['slug', 100], page_url: ['slug', 100] },
  testimonials: { title: ['title', 500], author: ['author', 200], description: ['story', 30000], image: ['image', 2048], link: ['url', 2048], featured: ['boolean'], focus: ['text', 200], headline: ['text', 500], summary: ['text', 5000], excerpt: ['text', 5000] },
  images: { label: ['label', 200], location: ['location', 500], url: ['image', 2048], alt: ['text', 500] },
  settings: { label: ['label', 200], value: ['text', 5000] },
};
const required = {
  programmes: ['name', 'short_description', 'image_url', 'program_id', 'page_url'],
  testimonials: ['title', 'author', 'description'], images: ['label', 'location', 'url'], settings: ['label'],
};
export function safeUrl(value, image = false) {
  if (!value) return true;
  if (image && /^(img\/|\/(?!\/))[\w./-]+$/.test(value) && !value.includes('..')) return true;
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
}
export function validate(resource, input) {
  if (!resources[resource] || !input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid record.');
  const data = {};
  for (const [key, [type, max]] of Object.entries(resources[resource])) {
    const value = input[key] ?? (type === 'boolean' ? false : '');
    if (type === 'boolean') {
      if (typeof value !== 'boolean') throw new Error(`${key} must be a boolean.`);
    } else {
      if (typeof value !== 'string' || value.length > max) throw new Error(`${key} must be text up to ${max} characters.`);
      if (required[resource].includes(key) && !value.trim()) throw new Error(`${key} is required.`);
      if (['image', 'url'].includes(type) && !safeUrl(value, type === 'image')) throw new Error(`${key} must use HTTPS or an existing local image path.`);
      if (type === 'slug' && !/^[a-z0-9-]+$/.test(value)) throw new Error(`${key} must be a page slug.`);
    }
    data[key] = typeof value === 'string' ? value.trim() : value;
  }
  return data;
}
