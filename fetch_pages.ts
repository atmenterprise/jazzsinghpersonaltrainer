import fs from 'fs';

const pages = [
  'onetoonept.html',
  'couplept.html',
  'onlinept.html',
  'nutritionpt.html',
  'disclaimer.html',
  'privacy.html'
];

async function fetchPages() {
  for (const page of pages) {
    try {
      const res = await fetch(`https://raw.githubusercontent.com/atmenterprise/jazzsinghpersonaltrainer/main/_pages/${page}`);
      const text = await res.text();
      fs.writeFileSync(`page-raw-${page}`, text);
      console.log(`Saved page-raw-${page} of size`, text.length);
    } catch (err) {
      console.error(`Error fetching ${page}:`, err);
    }
  }
}

fetchPages();
