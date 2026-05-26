import fs from 'fs';

async function fetchAndSave() {
  try {
    const res = await fetch('https://raw.githubusercontent.com/atmenterprise/jazzsinghpersonaltrainer/main/_data/testimonials.yml');
    const text = await res.text();
    fs.writeFileSync('testimonials-raw.yml', text);
    console.log('Successfully saved testimonials-raw.yml, length:', text.length);
  } catch (err) {
    console.error('Error fetching testimonials:', err);
  }
}

fetchAndSave();
