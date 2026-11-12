export const resources = {
  programme_pages: {
    title: ['title', 200], page_url: ['slug', 100], introduction: ['text', 10000],
    audience_title: ['text', 200], audience_content: ['text', 20000],
    included_title: ['text', 200], included_content: ['text', 20000],
    results_title: ['text', 200], results_content: ['text', 20000],
    investment_title: ['text', 200], investment_content: ['text', 20000],
  },
  about: { title: ['title', 200], introduction: ['text', 5000], description: ['text', 30000], image_url: ['image', 2048], alt: ['text', 500], cta_text: ['text', 500] },
  specialistareas: { name: ['name', 200], description: ['text', 5000], image_url: ['image', 2048] },
  programmes: { name: ['name', 200], short_description: ['description', 10000], image_url: ['image', 2048], program_id: ['slug', 100], page_url: ['slug', 100] },
  testimonials: { title: ['title', 500], author: ['author', 200], description: ['story', 30000], image: ['image', 2048], link: ['url', 2048], featured: ['boolean'], focus: ['text', 200], headline: ['text', 500], summary: ['text', 5000], excerpt: ['text', 5000] },
  images: { label: ['label', 200], location: ['location', 500], url: ['image', 2048], alt: ['text', 500] },
  settings: { label: ['label', 200], value: ['text', 5000] },
};
const required = {
  programme_pages: ['title', 'page_url', 'introduction'],
  about: ['title', 'introduction', 'description', 'image_url'], specialistareas: ['name', 'description', 'image_url'],
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
