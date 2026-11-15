export const GUIDE_SUGGESTIONS = ['About Jaz', 'Explore programmes', 'Book a consultation', 'Prices & packages', 'Client stories', 'Contact Jaz'];

const link = (label, to) => ({ label, to });
const booking = link('Book a consultation', '/booking#book');
const contact = link('Contact Jaz', '/#contact');
const programmes = link('Explore programmes', '/#programmes');
const faq = link('Read the FAQs', '/faq');
const about = link('About Jaz', '/#about');
const stories = link('Client success stories', '/testimonials');
const normalise = (text) => String(text || '').normalize('NFKC').toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9@£?\s:]/g, ' ').replace(/\s+/g, ' ').trim();
const reply = (text, links = [], topic = null) => ({ text, links, topic });
const outside = () => reply("I can only help with information on this website: Jaz, his programmes, booking, client stories and contact details. I can’t help with unrelated questions or carry out tasks for you.", [about, programmes, booking]);
const uncertain = () => reply("I couldn’t find a clear answer to that in the website information. You can ask about Jaz, programmes, prices, booking or client stories, or contact Jaz for details.", [faq, contact]);

// Only these reviewed answers and local website links can be returned. User text
// never becomes an instruction, a URL, HTML, a tool call or a generated answer.
export function createWebsiteGuide({ siteConfig, programs = [], testimonials = [], highlights = {} }) {
  const programmeLinks = programs.map((program) => link(program.name, `/${program.page_url}`));
  const answers = {
    about: reply("Jaz is a Nutritionist and Personal Trainer who has helped people with their health and fitness since 2012. His own experience of managing long-term health conditions informs his focus on sustainable training, nutrition and everyday habits.", [about], 'about'),
    qualifications: reply("The website describes Jaz as a Nutritionist, Personal Trainer and former Expert Patient Programme Tutor. It doesn’t list a full set of formal qualifications, so ask Jaz if you need details of a particular certification.", [about, contact], 'about'),
    approach: reply("Jaz focuses on sustainable weight loss, strength, body toning and personalised nutrition and training. Programmes are shaped around your starting point, lifestyle and goals, with progress reviews and support. A consultation is the place to discuss your individual circumstances.", [link('Specialist areas', '/#services'), programmes, booking], 'approach'),
    programmes: reply('The website offers four programmes. Choose one below to see who it is for and what is included.', programmeLinks, 'programmes'),
    one: reply('1:1 Personal Training provides individual support with personalised training and nutrition, technique guidance and regular progress reviews. The programme page describes 60-minute training sessions.', [link('1:1 Personal Training', '/onetoonept'), booking], 'one'),
    couple: reply('2:1 Personal Training is for couples, friends or family members who can train together. You are supported individually while sharing the training experience. The programme page describes 60-minute sessions.', [link('2:1 Personal Training', '/couplept'), booking], 'couple'),
    online: reply('Online Coaching lets you follow a personalised training and nutrition programme remotely. The website describes regular progress reviews and 20-minute phone or video check-ins, with feedback and actions for the weeks ahead.', [link('Online Coaching', '/onlinept'), booking], 'online'),
    nutrition: reply('Health Check focuses on understanding the symptoms and habits that may be affecting your health and fitness goals. Jaz also offers personalised nutrition support within his programmes. Discuss your situation with Jaz in a consultation.', [link('Health Check', '/nutritionpt'), programmes, booking], 'nutrition'),
    compare: reply('1:1 training offers individual in-person support; 2:1 training lets two people train together; Online Coaching offers remote plans and check-ins; Health Check focuses on lifestyle habits and health goals. I can explain these options, but Jaz can help you decide which is suitable for you.', [programmes, booking], 'programmes'),
    booking: reply('Book a complimentary 15-minute phone consultation on the Booking page. Choose an available date and time in Calendly, then complete its booking steps. Jaz will discuss your goals and possible next steps. I can take you to the page, but I can’t make or change a booking.', [booking], 'booking'),
    price: reply('The consultation is free. Current personal-training and programme prices are not listed on the website. Ask Jaz for the price of the programme you are interested in; I won’t guess a fee or quote gym membership prices as a programme price.', [booking, contact], 'price'),
    location: reply('Jaz trains at The Gym Group, Pioneer Point, 3–5 Winston Way, Ilford, IG1 2ZG, Essex, United Kingdom. The Contact section has a directions link. Online Coaching is available for remote training.', [link('Address and directions', '/#contact'), link('Online Coaching', '/onlinept')], 'location'),
    contact: reply(`You can contact Jaz by email at ${siteConfig.email} or telephone on +44 (0) 7415 547566. The Contact section also has WhatsApp, Instagram and Facebook links.`, [contact, booking], 'contact'),
    membership: reply('The FAQ says a gym membership with The Gym Group Pioneer Point is needed for in-person personal training. Check current membership prices and terms with the gym; the membership is separate from Jaz’s programme fees.', [faq, contact], 'membership'),
    frequency: reply('The FAQ says training frequency depends on your lifestyle, budget and preferences, with options discussed with Jaz. It describes a minimum training term of 12 weeks. This is programme information, not a personalised training recommendation.', [faq, booking], 'frequency'),
    sessions: reply('The in-person programme pages describe 60-minute training sessions. The initial complimentary phone consultation is 15 minutes, and Online Coaching describes 20-minute phone or video check-ins.', [link('1:1 Personal Training', '/onetoonept'), link('Online Coaching', '/onlinept'), booking], 'sessions'),
    first: reply('The FAQ describes discussing your health questionnaire and nutrition plan, taking starting photos and assessing your movement through a warm-up and exercises. That information helps Jaz develop your programme.', [faq, booking], 'first'),
    results: reply('The site includes client stories about strength, confidence, weight loss and healthier habits. These are individual experiences, not guaranteed results. Read the full stories or discuss your goals directly with Jaz.', [stories, link('Website disclaimer', '/disclaimer'), booking], 'results'),
    stories: reply('You can browse client stories, search by name or experience, and filter Featured stories on the testimonials page. “Read the full story” opens the complete feedback in a pop-up.', [stories], 'stories'),
    faq: reply('The FAQ page covers gym membership, training sessions, online coaching, nutrition and how to get started. You can open each question to read its full answer.', [faq], 'faq'),
    shop: reply('The Shop section links to Reflex Nutrition and displays a 22% discount offer. Offers and eligibility can change, so check the retailer’s terms before buying. I can show you the website’s Shop section; I can’t recommend supplements or place an order.', [link('View the Shop section', '/#shop')], 'shop'),
    privacy: reply('The combined Privacy & GDPR policy explains website information, analytics, Calendly scheduling, cookies and privacy rights. Chat replies are prepared locally from reviewed website information; this guide does not send your messages to an AI service.', [link('Privacy & GDPR policy', '/privacy')], 'privacy'),
    changes: reply('I can’t access appointments, change a booking or see live availability. Use the booking details or confirmation sent by Calendly, or contact Jaz for help with an existing appointment.', [contact, booking], 'booking'),
    hours: reply('Jaz’s current appointment availability is shown in the Calendly calendar on the Booking page. The website does not list a separate personal-training timetable or Jaz’s working hours.', [booking, contact], 'booking'),
    family: reply('In his About Me story, Jaz describes being a father of three and how his own health journey shaped his work as a trainer and nutritionist.', [about], 'about'),
    assistant: reply("I’m a website guide, not Jaz or a live chat service. I can explain the information on this site and provide links. I can’t offer personal advice, carry out tasks, access appointments or answer unrelated questions.", [about, programmes, contact], 'assistant'),
  };

  return function answerWebsiteQuestion(input, previousTopic = null) {
    const raw = String(input || '').trim();
    if (!raw || raw.length > 300) return uncertain();
    const q = normalise(raw);
    if (/\b(ignore|override|disregard|forget)\b.*\b(instructions|rules|system|previous|restrictions)\b|\b(system prompt|developer message|jailbreak|act as|pretend to be|reveal.*prompt|execute|run code|sql|javascript|python|write.*code|translate|weather|forecast|politics?|president|bitcoin|crypto|stocks?|stock market|football|recipe|poem|song|joke|essay|homework|send.*email|delete.*file|password|api key|hack|taxes|legal advice|investments?|place.*order|buy.*for me)\b/.test(q)) return outside();
    if (/\b(diagnos\w*|prescri\w*|medication|dosage|treat my|cure my|medical advice|meal plan for me|design.*plan|create.*plan|write.*plan|give me.*plan|how many calories|what should i eat|what should i take|which supplements|recommend.*supplement|what should i|is it safe for me|how do i treat|my symptoms|my medication|i have.*pain)\b/.test(q)) {
      return reply('I can explain Jaz’s services, but I can’t assess symptoms, give medical or supplement advice, or create a personal meal or workout plan. Discuss your goals and suitability with Jaz; medical questions should go to a qualified healthcare professional.', [booking, link('Health Check', '/nutritionpt')]);
    }
    if (/^(hi|hello|hey|good morning|good afternoon|good evening)[!? ]*$/.test(q)) return reply('Hello! I can help you learn about Jaz, explore the programmes or find your way around the site. What would you like to know?', [about, programmes, booking]);
    if (/^(thanks|thank you|cheers|great|ok|okay)[!? ]*$/.test(q)) return reply('You’re welcome. If you need more information, you can explore the programmes or book a consultation with Jaz.', [programmes, booking]);
    if (/\b(who are you|are you (a bot|jaz|human)|what can you do|chatbot|website guide)\b/.test(q)) return answers.assistant;
    if (/\b(cancel|reschedule|change|move)\b.*\b(booking|appointment|consultation)|\b(my booking|existing appointment)\b/.test(q)) return answers.changes;
    if (/\b(privacy|gdpr|cookies?|tracking|my data|chat data)\b/.test(q)) return answers.privacy;
    if (/\b(working hours|opening hours|availability|available|available times|appointment times|timetable|when.*available)\b/.test(q)) return answers.hours;
    if (/\b(price|prices|pricing|cost|costs|fees?|rates?|packages?|how much|expensive|cheap|free)\b/.test(q) && !/\b(membership)\b/.test(q)) return answers.price;
    if (/\b(gym membership|membership|join the gym|gym member)\b/.test(q)) return answers.membership;
    if (/\b(how long|duration|minutes|session length|how many hours)\b/.test(q) && !/\b(weeks|months|programme|program|train with)\b/.test(q)) return answers.sessions;
    if (/\b(how often|how many times|per week|a week|weeks|minimum term|commitment|how long.*(programme|program|train with))\b/.test(q)) return answers.frequency;
    if (/\b(first session|first appointment|typical session|what happens|health questionnaire)\b/.test(q)) return answers.first;
    if (/\b(book|booking|consultation|appointment|calendly|start today|get started)\b/.test(q)) return answers.booking;
    if (/\b(client|customer)\b.*\b(email|phone number|address|private|records)\b/.test(q)) return reply('I can only share the public information on this website. I can’t provide private client details or records.', [contact, stories]);
    if (/\b(contact|email|phone|telephone|whatsapp|instagram|facebook|social media|number|reach jaz)\b/.test(q)) return answers.contact;
    if (/\b(location|address|directions|ilford|pioneer point|based|find jaz)\b|\bwhere\b.*\b(jaz|you|gym|train|training)\b/.test(q)) return answers.location;
    if (/\b(qualifications?|certifi\w*|credentials|expert patient)\b/.test(q)) return answers.qualifications;
    if (/\b(children|father|family story|health journey|his story|jaz s story)\b/.test(q)) return answers.family;
    if (/\b(compare|difference|which programme|which program|best programme|right programme|help me choose)\b/.test(q)) return answers.compare;
    if (/\b(couple|couples|partner|friend|together|2:1|two to one|2 to 1|two on one)\b/.test(q)) return answers.couple;
    if (/\b(online|remote|video|virtual)\b/.test(q)) return answers.online;
    if (/\b(1:1|one to one|1 to 1|one on one|individual training)\b/.test(q)) return answers.one;
    if (/\b(health check|nutrition|nutritionist|diet|blood sugar|cholesterol|blood pressure)\b/.test(q)) return answers.nutrition;
    if (/\b(shop|reflex|discount|supplements?|buy)\b/.test(q)) return answers.shop;
    const named = testimonials.find((entry) => {
      const name = normalise(entry.testimonial.author);
      return name && (` ${q} `).includes(` ${name} `);
    });
    if (named) {
      const summary = highlights[named.id]?.summary || `${named.testimonial.description.trim().split(/\s+/).slice(0, 35).join(' ')}…`;
      return reply(`${named.testimonial.author}’s story: ${summary}`, [link('Read the full story', `/testimonials#story-${named.id}`)], 'stories');
    }
    if (/\b(testimonials?|feedback|reviews?|stories|success stor\w*|clients?)\b/.test(q)) return answers.stories;
    if (/\b(results?|guarantee|lose weight|weight loss|strength|toning|sustainable|specialist|approach)\b/.test(q)) return /\b(guarantee|results?)\b/.test(q) ? answers.results : answers.approach;
    if (/\b(faq|faqs|frequently asked)\b/.test(q)) return answers.faq;
    if (/\b(programmes?|programs?|services?|personal training|training options)\b/.test(q)) return answers.programmes;
    if (/\b(about jaz|about jazz|who is jaz|who s jaz|jaz s background|about him|experience|background)\b|^(jaz|jazz|trainer)$/.test(q)) return answers.about;
    if (/^(tell me more|more details|more|what about that)[? ]*$/.test(q) && previousTopic && answers[previousTopic]) return answers[previousTopic];
    return uncertain();
  };
}
