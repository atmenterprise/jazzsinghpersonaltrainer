import fs from 'fs';

async function fetchBooking() {
  try {
    const res = await fetch('https://raw.githubusercontent.com/atmenterprise/jazzsinghpersonaltrainer/main/_pages/booking.html');
    const text = await res.text();
    fs.writeFileSync('booking-raw.html', text);
    console.log('Saved booking-raw.html of size', text.length);
  } catch (err) {
    console.error(err);
  }
}

fetchBooking();
