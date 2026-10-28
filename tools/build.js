/* ==========================================================================
   Grand Tokyu Hotel — static site generator
   --------------------------------------------------------------------------
   Every page is generated from the data and templates in this file:

     node tools/build.js

   All photography is the hotel's own, supplied by the hotel. The images in
   images/hotel/ are the originals (lightly re-encoded, long edge 1600 px);
   images/brand/ holds the logo and social cards.

   The site is written to be as legible to machines as it is to people:
   semantic landmarks, descriptive alt text, one <h1> per page, rich
   JSON-LD (Hotel, HotelRoom, Restaurant, EventVenue, FAQPage,
   BreadcrumbList), llms.txt, hotel-data.json, a full sitemap and a
   robots.txt that welcomes AI crawlers.
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

/* ------------------------------------------------------------------ *
 *  Hotel facts (edit here — every page follows)
 * ------------------------------------------------------------------ */
const SITE = {
  name: 'Grand Tokyu Hotel',
  short: 'Grand Tokyu',
  legalName: 'Grand Tokyu Hotel',
  tagline: 'A five-star experience on Aba Road, Port Harcourt',
  slogan: 'Hospitality meets heart.',
  address: '273/274 Aba Road, Port Harcourt, Rivers State, Nigeria',
  addressShort: '273/274 Aba Road, Port Harcourt',
  street: '273/274 Aba Road',
  city: 'Port Harcourt',
  region: 'Rivers State',
  country: 'Nigeria',
  countryCode: 'NG',
  postal: '500272',
  phone: '+234 091 6000 7896',
  phoneHref: 'tel:+2349160007896',
  phone2: '+234 091 6000 7897',
  phone2Href: 'tel:+2349160007897',
  email: 'grandtokyuhotel@gmail.com',
  whatsapp: '2349160007896',
  instagram: 'https://www.instagram.com/grandtokyu/',
  instagramHandle: '@grandtokyu',
  checkin: '12:00',
  checkout: '11:00',
  checkinText: 'from 12:00 — confirmed with your reservation',
  checkoutText: 'by 11:00 — confirmed with your reservation',
  base: 'https://www.grandtokyuhotels.com/',
  geo: { lat: 4.826, lng: 7.0226 },
  maps:
    'https://www.google.com/maps/search/?api=1&query=Grand+Tokyu+Hotel+273%2F274+Aba+Road+Port+Harcourt+Nigeria',
  osm:
    'https://www.openstreetmap.org/export/embed.html?bbox=6.9955%2C4.8085%2C7.0485%2C4.8435&layer=mapnik&marker=4.8260%2C7.0226',
  tripadvisor:
    'https://www.tripadvisor.com/Hotel_Review-g298363-d33282887-Reviews-Grand_Tokyu_Hotel-Port_Harcourt_Rivers_State.html'
};

const NAV = [
  { key: 'home', label: 'Home', href: 'index.html' },
  { key: 'rooms', label: 'Rooms', href: 'rooms.html' },
  { key: 'dining', label: 'Dining', href: 'restaurant.html' },
  { key: 'events', label: 'Events', href: 'events.html' },
  { key: 'gallery', label: 'Gallery', href: 'gallery.html' },
  { key: 'about', label: 'About', href: 'about.html' },
  { key: 'contact', label: 'Contact', href: 'contact.html' }
];

/* ------------------------------------------------------------------ *
 *  Photography — the hotel's own pictures, in images/hotel/
 * ------------------------------------------------------------------ */
const IMG = (name) => `images/hotel/${name}.jpg`;

const PHOTO = {
  exterior: {
    src: IMG('exterior-sign'),
    alt: 'The Grand Tokyu Hotel signboard above the arched entrance on Aba Road, Port Harcourt'
  },
  forecourt: {
    src: IMG('exterior-forecourt'),
    alt: 'The hotel forecourt and paved drive with the dark glass façade of Grand Tokyu Hotel behind'
  },
  reception: {
    src: IMG('reception-desk'),
    alt: 'The reception desk at Grand Tokyu Hotel, with two staff in dark suits behind the counter'
  },
  receptionLobby: {
    src: IMG('reception-lobby'),
    alt: 'Reception staff at the marble-clad front desk of Grand Tokyu Hotel'
  },
  lounge: {
    src: IMG('lounge-tv'),
    alt: 'The lounge at Grand Tokyu Hotel: cream sofas around a low table, marble-pattern walls and a wall-mounted television'
  },
  loungeWide: {
    src: IMG('lounge-wide'),
    alt: 'A wide view of the lounge and bar seating at Grand Tokyu Hotel, lit with blue accent lighting'
  },
  loungeSofas: {
    src: IMG('lounge-sofas'),
    alt: 'Cream upholstered sofas and a round ottoman in the hotel lounge'
  },
  bar: {
    src: IMG('bar-shelves'),
    alt: 'Backlit shelves of spirits behind the hotel bar'
  },
  barAlt: {
    src: IMG('bar-shelves-alt'),
    alt: 'The bar at Grand Tokyu Hotel, its illuminated bottle shelves glowing purple and white'
  },
  restaurant: {
    src: IMG('restaurant-dining'),
    alt: 'The air-conditioned restaurant at Grand Tokyu Hotel, set with dark chairs and marble-topped tables'
  },
  restaurantTables: {
    src: IMG('restaurant-tables'),
    alt: 'Dining tables ready for service in the hotel restaurant'
  },
  pool: {
    src: IMG('pool-courtyard'),
    alt: 'The outdoor pool in the hotel courtyard, framed by covered walkways and sun loungers'
  },
  poolCorner: {
    src: IMG('pool-corner'),
    alt: 'The courtyard pool seen from the terrace, with loungers along the water'
  },
  poolLoungers: {
    src: IMG('pool-loungers'),
    alt: 'Red-cushioned sun loungers beside the hotel pool'
  },
  courtyard: {
    src: IMG('courtyard-terrace'),
    alt: 'Cane chairs and tables on the poolside terrace beneath a planted pergola'
  },
  eggChair: {
    src: IMG('pool-egg-chair'),
    alt: 'A woven egg chair on the pool deck at Grand Tokyu Hotel'
  },
  bath: {
    src: IMG('bathroom-tub'),
    alt: 'A guest bathroom with a bathtub and tiled walls'
  }
};

/* ------------------------------------------------------------------ *
 *  Rooms & spaces
 *  Prices are the hotel's published "Book Now From" nightly rates.
 *  "max" is the maximum number of adults the hotel states per room.
 * ------------------------------------------------------------------ */
const SHARED_ROOM_FEATURES = [
  'Air conditioning in every room',
  'Flat-screen LED television',
  'Free high-speed Wi-Fi',
  'Hot water showers',
  'Premium toiletries',
  'Soft linen and spacious wardrobes',
  'Daily housekeeping',
  '24/7 front desk'
];

const ROOMS = [
  {
    slug: 'standard-room',
    name: 'Standard Room',
    from: 32000,
    max: 2,
    sleeps: '2 adults',
    bed: 'King bed',
    view: 'Courtyard view',
    tagline: 'The easy, comfortable essential',
    image: IMG('room-standard-1'),
    alt: 'Standard Room at Grand Tokyu Hotel with a king bed, brown runner and a work desk',
    gallery: [
      { src: IMG('room-standard-1'), alt: 'Standard Room: king bed with white linen and a brown runner' },
      { src: IMG('room-standard-3'), alt: 'Standard Room: bed dressed with gold cushions and warm lighting' },
      { src: IMG('room-standard-2'), alt: 'Standard Room: bed and desk beside the window' },
      { src: IMG('bathroom-simple'), alt: 'Standard Room bathroom with basin, mirror and toilet' }
    ],
    intro:
      'A calm, well-proportioned room with a king bed, crisp linen and everything you need to work, rest and reset. The Standard Room is the simplest way to enjoy Grand Tokyu — bright interiors, quiet air conditioning and a front desk that never sleeps.',
    amenities: ['40-inch Samsung® LED TV', 'Free Wi-Fi', 'Non-smoking', 'USB charging station', 'Work desk']
  },
  {
    slug: 'classic-room',
    name: 'Classic Room',
    from: 40000,
    max: 3,
    sleeps: '3 adults',
    bed: 'King bed',
    view: 'City view',
    tagline: 'A little more room to spread out',
    image: IMG('room-classic-1'),
    alt: 'Classic Room at Grand Tokyu Hotel with a padded chevron headboard, white bedding and gold accents',
    gallery: [
      { src: IMG('room-classic-1'), alt: 'Classic Room: chevron-padded headboard with white bedding and gold cushions' },
      { src: IMG('room-classic-2'), alt: 'Classic Room: bed, artwork and bedside lighting' },
      { src: IMG('room-classic-3'), alt: 'Classic Room: bed beside the window with air conditioning and television' },
      { src: IMG('bathroom-basic'), alt: 'Classic Room bathroom with basin, mirror and toilet' }
    ],
    intro:
      'The Classic Room adds breathing space and a dedicated work desk — a favourite for business trips, longer stays and anyone who likes to unpack properly. Warm lighting, soft textiles and a properly stocked minibar make it feel less like a hotel room and more like your own.',
    amenities: ['40-inch LED TV', 'Free Wi-Fi', 'Non-smoking', 'USB charging station', 'Work desk', 'Mini bar']
  },
  {
    slug: 'standard-suite',
    name: 'Standard Suite Room',
    from: 48000,
    max: 4,
    sleeps: '4 adults',
    bed: 'King bed + sitting area',
    view: 'City view',
    tagline: 'Great for families',
    image: IMG('room-executive-1'),
    alt: 'Standard Suite Room at Grand Tokyu Hotel with a king bed and a separate seating corner',
    gallery: [
      { src: IMG('room-executive-1'), alt: 'Standard Suite Room: king bed with an armchair and coffee table' },
      { src: IMG('room-executive-2'), alt: 'Standard Suite Room: bed, luggage bench and dressing mirror' },
      { src: IMG('suite-living-1'), alt: 'Standard Suite Room sitting area with leather sofas and a television' },
      { src: IMG('bathroom-floral'), alt: 'Suite bathroom with patterned tiles, basin and shower' }
    ],
    intro:
      'A suite built around the way families actually travel: one generous king bedroom, a sitting area to spread out in, and a city view that keeps Port Harcourt close. Book it for a weekend, a family celebration or a stay where the children need their own corner.',
    amenities: ['King bed', 'Sitting area', 'City view', 'Free Wi-Fi', 'Non-smoking', 'Smart TV']
  },
  {
    slug: 'classic-suite',
    name: 'Classic Suite Room',
    from: 68000,
    max: 5,
    sleeps: '5 adults',
    bed: 'King bed + lounge',
    view: 'City view',
    tagline: 'Our signature suite',
    image: IMG('room-deluxe-1'),
    alt: 'Classic Suite Room at Grand Tokyu Hotel with an upholstered headboard, tufted panels and a lounge chair',
    gallery: [
      { src: IMG('room-deluxe-1'), alt: 'Classic Suite Room: king bed with tufted headboard and wall sconces' },
      { src: IMG('room-deluxe-2'), alt: 'Classic Suite Room: bed with soft throws and gold cushions' },
      { src: IMG('suite-living-2'), alt: 'Classic Suite lounge with sofa, television and wood panelling' },
      { src: IMG('bathroom-tub'), alt: 'Classic Suite bathroom with a bathtub and tiled surround' }
    ],
    intro:
      'The most requested suite in the house. A king bed, a lounge for receiving guests, a mini bar for slow evenings and a view that changes colour at sunset. It sleeps up to five, so it works just as well for a family as it does for a small delegation.',
    amenities: ['King bed', 'Lounge area', 'Mini bar', 'Free Wi-Fi', 'Non-smoking', 'USB charging station', 'Work desk']
  },
  {
    slug: 'apartment',
    name: 'The Apartment',
    from: 240000,
    max: 10,
    sleeps: '10 adults',
    bed: '2 separate bedrooms',
    view: 'City view',
    tagline: 'Hotel living, with a kitchen',
    image: IMG('apartment-living-1'),
    alt: 'The Apartment at Grand Tokyu Hotel: a living room with black sofas, wood coffee tables and gold curtains',
    gallery: [
      { src: IMG('apartment-living-1'), alt: 'The Apartment living room with black sofas and two wood coffee tables' },
      { src: IMG('apartment-living-2'), alt: 'The Apartment lounge with a large wall-mounted television' },
      { src: IMG('apartment-kitchen-1'), alt: 'The Apartment kitchen with white units, sink and a washing machine' },
      { src: IMG('apartment-dining'), alt: 'The Apartment dining area with a marble table and upholstered chairs' },
      { src: IMG('apartment-living-4'), alt: 'The Apartment living space with blue velvet seating and city-blue lighting' },
      { src: IMG('bathroom-shower'), alt: 'The Apartment bathroom with a walk-in shower, basin and mirror' }
    ],
    intro:
      'Two separate bedrooms, a furnished living room with a powerful standing air conditioner, and a fully equipped kitchen with a modern refrigerator and washing machine. Designed for families, groups of friends and anyone staying long enough to want their own front door. The 75-inch LED television does the rest.',
    amenities: [
      '75-inch LED TV',
      'Free Wi-Fi',
      'Full kitchen',
      'Washing machine',
      'Dining table',
      'USB charging station',
      'Work desk',
      'City view'
    ]
  }
];

const HALL = {
  name: 'The Hall',
  slug: 'the-hall',
  from: 350000,
  max: 200,
  capacity: '200 guests',
  sleeps: 'Up to 200 guests',
  bed: 'Event space',
  image: IMG('restaurant-dining'),
  alt: 'A large air-conditioned function room set with tables at Grand Tokyu Hotel',
  gallery: [
    { src: IMG('restaurant-dining'), alt: 'A large function room laid out with tables and chairs' },
    { src: IMG('restaurant-tables'), alt: 'Banquet tables set for a function' },
    { src: IMG('courtyard-terrace'), alt: 'The poolside terrace, used for drinks receptions' },
    { src: IMG('lounge-wide'), alt: 'The lounge and bar area, available for private hire' }
  ],
  intro:
    'A full-height event hall with four standing air conditioners, free chairs and free Wi-Fi — ready for weddings, conferences, board meetings, seminars, birthdays and everything in between. The hotel also publishes a 100-guest layout for some set-ups, so tell the events team the shape of your day and they will arrange the room to match.',
  amenities: [
    '4 standing air conditioners',
    'Free chairs',
    'Free Wi-Fi',
    'Flexible layouts',
    'Catering from the hotel kitchen',
    'On-site parking',
    'Dedicated events team'
  ]
};

/* ------------------------------------------------------------------ *
 *  The kitchen — written descriptions, no stock food photography
 * ------------------------------------------------------------------ */
const KITCHEN = [
  { name: 'Whole grilled croaker', tag: 'From the grill', desc: 'Charred over open flame and finished with herb butter, avocado and confit tomatoes.' },
  { name: 'Peppered beef fillet', tag: 'Continental', desc: 'A thick-cut fillet with a deep pepper glaze, steamed greens and roast potatoes.' },
  { name: 'Seafood fried rice', tag: 'Local & continental', desc: 'Wok-tossed rice with prawns, calamari and sweet peppers — a house favourite.' },
  { name: 'Jollof rice & grilled chicken', tag: 'Nigerian classic', desc: 'Smoky party-style jollof with marinated chicken and fried plantain.' },
  { name: 'Pepper soup', tag: 'Nigerian classic', desc: 'A hot, aromatic broth with catfish or goat — the cure for a long flight.' },
  { name: 'Crispy chicken & pepper dip', tag: 'Small chops', desc: 'Golden, spice-crusted chicken with a fiery dipping sauce and fresh herbs.' },
  { name: 'Buttermilk pancakes', tag: 'Breakfast', desc: 'Stacked high with berry compote, strawberries and maple syrup.' },
  { name: 'Berry cheesecake', tag: 'Dessert', desc: 'Baked vanilla cheesecake, forest berries and a dark chocolate flourish.' },
  { name: 'Tropical fruit smoothies', tag: 'Fresh & light', desc: 'Mango, banana and berries blended thick with yoghurt and honey.' }
];

/* ------------------------------------------------------------------ *
 *  Gallery — every image is the hotel's own photography
 * ------------------------------------------------------------------ */
const GALLERY = [
  { img: IMG('exterior-sign'), alt: PHOTO.exterior.alt, cap: 'The signboard on Aba Road', group: 'Hotel' },
  { img: IMG('exterior-forecourt'), alt: PHOTO.forecourt.alt, cap: 'The forecourt and drive', group: 'Hotel' },
  { img: IMG('reception-desk'), alt: PHOTO.reception.alt, cap: 'Reception', group: 'Hotel' },
  { img: IMG('reception-staff'), alt: 'Front-desk staff welcoming arriving guests', cap: 'The front desk team', group: 'Hotel' },
  { img: IMG('reception-lobby'), alt: 'Reception staff at the front desk', cap: 'Check-in', group: 'Hotel' },
  { img: IMG('lounge-tv'), alt: PHOTO.lounge.alt, cap: 'The lounge', group: 'Hotel' },
  { img: IMG('lounge-sofas'), alt: PHOTO.loungeSofas.alt, cap: 'Lounge seating', group: 'Hotel' },
  { img: IMG('lounge-corner'), alt: 'Corner of the hotel lounge with banquette seating', cap: 'Lounge corner', group: 'Hotel' },

  { img: IMG('room-standard-1'), alt: 'Standard Room with a king bed and work desk', cap: 'Standard Room', group: 'Rooms' },
  { img: IMG('room-standard-3'), alt: 'Standard Room bed with gold cushions', cap: 'Standard Room', group: 'Rooms' },
  { img: IMG('room-classic-1'), alt: 'Classic Room with a chevron headboard', cap: 'Classic Room', group: 'Rooms' },
  { img: IMG('room-classic-2'), alt: 'Classic Room bed with artwork above', cap: 'Classic Room', group: 'Rooms' },
  { img: IMG('room-classic-3'), alt: 'Classic Room with a wall-mounted television', cap: 'Classic Room', group: 'Rooms' },
  { img: IMG('room-executive-1'), alt: 'Standard Suite Room with a seating corner', cap: 'Standard Suite Room', group: 'Rooms' },
  { img: IMG('room-executive-2'), alt: 'Standard Suite Room with a luggage bench', cap: 'Standard Suite Room', group: 'Rooms' },
  { img: IMG('room-deluxe-1'), alt: 'Classic Suite Room with a tufted headboard', cap: 'Classic Suite Room', group: 'Rooms' },
  { img: IMG('room-deluxe-2'), alt: 'Classic Suite Room bed with soft throws', cap: 'Classic Suite Room', group: 'Rooms' },
  { img: IMG('room-desk'), alt: 'A work desk and television in a guest room', cap: 'Work desk', group: 'Rooms' },
  { img: IMG('room-premium-1'), alt: 'A guest room with blue cove lighting above the bed', cap: 'A guest room at night', group: 'Rooms' },
  { img: IMG('room-premium-2'), alt: 'A guest room with armchair and blue cove lighting', cap: 'Evening light', group: 'Rooms' },
  { img: IMG('room-premium-3'), alt: 'A guest room with a bed, curtains and blue ceiling lighting', cap: 'A guest room', group: 'Rooms' },
  { img: IMG('room-bluesuite'), alt: 'A guest room with a desk and blue drapes', cap: 'Desk and wardrobe', group: 'Rooms' },
  { img: IMG('bathroom-tub'), alt: 'A guest bathroom with a bathtub', cap: 'The bathroom', group: 'Rooms' },
  { img: IMG('bathroom-shower'), alt: 'A guest bathroom with a walk-in shower', cap: 'Shower bathroom', group: 'Rooms' },
  { img: IMG('bathroom-vanity'), alt: 'A guest bathroom with a mirror and basin', cap: 'Bathroom vanity', group: 'Rooms' },

  { img: IMG('apartment-living-1'), alt: 'The Apartment living room with black sofas', cap: 'The Apartment — living room', group: 'Apartment & suites' },
  { img: IMG('apartment-living-2'), alt: 'The Apartment lounge with a large television', cap: 'The Apartment — lounge', group: 'Apartment & suites' },
  { img: IMG('apartment-kitchen-1'), alt: 'The Apartment kitchen with washing machine', cap: 'The Apartment — kitchen', group: 'Apartment & suites' },
  { img: IMG('apartment-kitchen-2'), alt: 'The Apartment kitchen worktops and sink', cap: 'The Apartment — kitchen', group: 'Apartment & suites' },
  { img: IMG('apartment-dining'), alt: 'The Apartment dining table', cap: 'The Apartment — dining', group: 'Apartment & suites' },
  { img: IMG('apartment-living-3'), alt: 'The Apartment seating with a wall-mounted television', cap: 'The Apartment — sitting area', group: 'Apartment & suites' },
  { img: IMG('apartment-living-4'), alt: 'The Apartment living room in evening light', cap: 'The Apartment — evening', group: 'Apartment & suites' },
  { img: IMG('suite-living-1'), alt: 'A suite sitting area with leather sofas', cap: 'Suite sitting area', group: 'Apartment & suites' },
  { img: IMG('suite-living-2'), alt: 'A suite lounge with a sofa and television', cap: 'Suite lounge', group: 'Apartment & suites' },

  { img: IMG('pool-courtyard'), alt: PHOTO.pool.alt, cap: 'The courtyard pool', group: 'Pool & courtyard' },
  { img: IMG('pool-from-above'), alt: 'The pool seen from a guest-room balcony', cap: 'Pool from above', group: 'Pool & courtyard' },
  { img: IMG('pool-corner'), alt: PHOTO.poolCorner.alt, cap: 'Poolside', group: 'Pool & courtyard' },
  { img: IMG('pool-loungers'), alt: PHOTO.poolLoungers.alt, cap: 'Sun loungers', group: 'Pool & courtyard' },
  { img: IMG('pool-egg-chair'), alt: PHOTO.eggChair.alt, cap: 'The egg chair', group: 'Pool & courtyard' },
  { img: IMG('pool-leaves'), alt: 'The pool framed by a large leaf plant', cap: 'Green corners', group: 'Pool & courtyard' },
  { img: IMG('courtyard-terrace'), alt: PHOTO.courtyard.alt, cap: 'The terrace', group: 'Pool & courtyard' },

  { img: IMG('restaurant-dining'), alt: PHOTO.restaurant.alt, cap: 'The restaurant', group: 'Dining & bar' },
  { img: IMG('restaurant-tables'), alt: PHOTO.restaurantTables.alt, cap: 'A table for two', group: 'Dining & bar' },
  { img: IMG('bar-shelves'), alt: PHOTO.bar.alt, cap: 'The bar', group: 'Dining & bar' },
  { img: IMG('bar-shelves-alt'), alt: PHOTO.barAlt.alt, cap: 'Behind the bar', group: 'Dining & bar' },
  { img: IMG('bar-counter'), alt: 'The bar counter lit in blue', cap: 'Evening at the bar', group: 'Dining & bar' },

  { img: IMG('lounge-wide'), alt: PHOTO.loungeWide.alt, cap: 'Private hire — the lounge', group: 'Events' },
  { img: IMG('restaurant-dining'), alt: 'A function room set for a dinner', cap: 'Event dining', group: 'Events' },
  { img: IMG('courtyard-terrace'), alt: 'The terrace set for a drinks reception', cap: 'Drinks receptions', group: 'Events' }
];

/* ------------------------------------------------------------------ *
 *  FAQs
 * ------------------------------------------------------------------ */
const FAQS = [
  {
    q: 'Where exactly is Grand Tokyu Hotel?',
    a: 'At 273/274 Aba Road, Port Harcourt, Rivers State, Nigeria — roughly five minutes from GRA Junction and ten minutes from Mile 1 Park. Port Harcourt International Airport is about 35 minutes away by taxi.'
  },
  {
    q: 'How much does a room cost?',
    a: 'Published “book now from” rates are ₦32,000 for a Standard Room (2 adults), ₦40,000 for a Classic Room (3 adults), ₦48,000 for a Standard Suite Room (4 adults), ₦68,000 for a Classic Suite Room (5 adults) and ₦240,000 for The Apartment (10 adults), per night. The Hall starts at ₦350,000. Rates change with season and availability.'
  },
  {
    q: 'How do I book?',
    a: 'Call the reservation desk on +234 091 6000 7896 or +234 091 6000 7897, message the hotel on WhatsApp, email grandtokyuhotel@gmail.com, or send a request from the booking page on this site.'
  },
  {
    q: 'How many people can each room sleep?',
    a: 'Standard Room 2 adults, Classic Room 3 adults, Standard Suite Room 4 adults, Classic Suite Room 5 adults and The Apartment 10 adults. The Hall holds up to 200 guests.'
  },
  {
    q: 'What time is check-in and check-out?',
    a: 'Check-in is generally from 12:00 and check-out by 11:00, but the hotel confirms the exact times with every reservation — please check when you book, especially for late arrivals.'
  },
  {
    q: 'Do you have a pool, a bar and a restaurant?',
    a: 'Yes. The hotel has an outdoor courtyard pool with a terrace and sun loungers, a bar and lounge, and a restaurant serving Nigerian and continental cooking, plus room service for house guests.'
  },
  {
    q: 'Is there parking and free Wi-Fi?',
    a: 'Wi-Fi is free throughout the hotel and there is on-site parking for guests. Ask the front desk about airport pick-up and car hire when you book — availability is confirmed with your reservation.'
  },
  {
    q: 'Can you host my event or wedding?',
    a: 'The Hall takes up to 200 guests and comes with four standing air conditioners, free chairs and free Wi-Fi. The team arranges catering, layouts and AV — send your date and guest count through the events page. Smaller gatherings can use the restaurant, lounge or poolside terrace.'
  },
  {
    q: 'Are the rates on this site live?',
    a: 'No. They are the hotel’s published starting rates and are shown for guidance. Availability and final pricing are confirmed by the reservations team.'
  }
];

/* ------------------------------------------------------------------ *
 *  Journal
 * ------------------------------------------------------------------ */
const POSTS = [
  {
    slug: 'journal-getting-here.html',
    title: 'Getting to Aba Road: a straightforward guide',
    date: 'February 2026',
    read: '4 min read',
    img: IMG('exterior-forecourt'),
    alt: PHOTO.forecourt.alt,
    excerpt:
      'Port Harcourt International Airport is roughly 35 minutes away, GRA Junction about five, Mile 1 Park about ten. Here is the simple version of how to arrive without the guesswork.'
  },
  {
    slug: 'journal-day-in-port-harcourt.html',
    title: 'A day out from the hotel',
    date: 'February 2026',
    read: '5 min read',
    img: IMG('pool-courtyard'),
    alt: PHOTO.pool.alt,
    excerpt:
      'Pleasure Park, the lounges, the riverfront and the pool deck you will not want to leave — a relaxed itinerary for guests with a spare afternoon in Port Harcourt.'
  },
  {
    slug: 'journal-inside-your-room.html',
    title: 'Inside your room: what is already waiting',
    date: 'February 2026',
    read: '3 min read',
    img: IMG('room-classic-1'),
    alt: 'Classic Room with a padded chevron headboard',
    excerpt:
      'From the 75-inch television in The Apartment to the USB charging point beside every bed — a short guide to each room category and who it suits.'
  }
];

/* ------------------------------------------------------------------ *
 *  Helpers
 * ------------------------------------------------------------------ */
const money = (n) => '₦' + n.toLocaleString('en-NG');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const abs = (p) => (p.startsWith('http') ? p : SITE.base + p.replace(/^\/+/, ''));
const priceRange = `${money(ROOMS[0].from)} – ${money(HALL.from)}`;

const HOTEL_ID = `${SITE.base}#hotel`;
const WEBSITE_ID = `${SITE.base}#website`;

function postalAddress() {
  return {
    '@type': 'PostalAddress',
    streetAddress: SITE.street,
    addressLocality: SITE.city,
    addressRegion: SITE.region,
    postalCode: SITE.postal,
    addressCountry: SITE.countryCode
  };
}

const HOTEL_IMAGES = [
  IMG('exterior-forecourt'),
  IMG('exterior-sign'),
  IMG('reception-desk'),
  IMG('lounge-tv'),
  IMG('restaurant-dining'),
  IMG('pool-courtyard'),
  IMG('room-standard-1'),
  IMG('room-classic-1'),
  IMG('room-executive-1'),
  IMG('room-deluxe-1'),
  IMG('apartment-living-1'),
  IMG('apartment-kitchen-1')
];

/* A complete Hotel entity, reused (by @id) on every page. */
function hotelLd() {
  return {
    '@type': 'Hotel',
    '@id': HOTEL_ID,
    name: SITE.name,
    alternateName: 'Grand Tokyu Hotel Port Harcourt',
    description:
      'Grand Tokyu Hotel is a hotel at 273/274 Aba Road, Port Harcourt, Rivers State, Nigeria, with five room categories (Standard, Classic, two suites and a two-bedroom Apartment), an outdoor courtyard pool, a restaurant serving Nigerian and continental food, a bar and lounge, a 24-hour front desk and The Hall event space for up to 200 guests.',
    url: SITE.base,
    logo: abs('images/brand/logo.png'),
    image: HOTEL_IMAGES.map(abs),
    telephone: '+2349160007896',
    email: SITE.email,
    priceRange: priceRange,
    currenciesAccepted: 'NGN',
    paymentAccepted: 'Cash, bank transfer, card',
    starRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    address: postalAddress(),
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    hasMap: SITE.maps,
    checkinTime: SITE.checkin,
    checkoutTime: SITE.checkout,
    sameAs: [SITE.instagram, SITE.maps, SITE.tripadvisor],
    amenityFeature: [
      'Free Wi-Fi',
      'Outdoor swimming pool',
      'Restaurant',
      'Bar and lounge',
      'Room service',
      '24-hour front desk',
      'Air conditioning',
      'Free on-site parking',
      'Daily housekeeping',
      'Laundry service',
      'Event hall for up to 200 guests',
      'Airport pick-up on request',
      'Car hire on request'
    ].map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
    makesOffer: ROOMS.map((room) => ({
      '@type': 'Offer',
      name: room.name,
      price: room.from,
      priceCurrency: 'NGN',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: room.from,
        priceCurrency: 'NGN',
        unitCode: 'DAY',
        unitText: 'per night'
      },
      itemOffered: {
        '@type': 'HotelRoom',
        name: room.name,
        description: room.intro,
        occupancy: { '@type': 'QuantitativeValue', maxValue: room.max, unitText: 'adults' },
        bed: room.bed,
        amenityFeature: room.amenities.map((name) => ({
          '@type': 'LocationFeatureSpecification',
          name,
          value: true
        }))
      },
      url: abs(`room-${room.slug}.html`)
    })),
    containsPlace: {
      '@type': 'EventVenue',
      name: 'The Hall at Grand Tokyu Hotel',
      description: HALL.intro,
      maximumAttendeeCapacity: HALL.max,
      amenityFeature: HALL.amenities.map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
      address: postalAddress(),
      url: abs('events.html')
    },
    hasMenu: abs('restaurant.html#kitchen'),
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: abs('booking.html'),
        actionPlatform: 'https://schema.org/DesktopWebPlatform'
      },
      result: { '@type': 'LodgingReservation', name: 'Room reservation request' }
    }
  };
}

function websiteLd() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE.base,
    name: SITE.name,
    inLanguage: 'en-NG',
    publisher: { '@id': HOTEL_ID },
    about: { '@id': HOTEL_ID }
  };
}

function breadcrumbLd(crumbs) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label.replace(/&amp;/g, '&'),
      item: c.href ? abs(c.href) : undefined
    }))
  };
}

function jsonLdScript(items) {
  const graph = items.filter(Boolean);
  const data = { '@context': 'https://schema.org', '@graph': graph };
  return `\t<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n\t</script>`;
}

/* ------------------------------------------------------------------ *
 *  Layout
 * ------------------------------------------------------------------ */
function head({ title, description, active = '', file = '', image = 'images/brand/og-cover.jpg', jsonLd = [] }) {
  const navItems = NAV.map(
    (n) =>
      `\t\t\t\t\t<li class="nav-item${active === n.key ? ' active' : ''}"><a href="${n.href}" class="nav-link">${n.label}</a></li>`
  ).join('\n');

  const canonical = !file || file === 'index.html' ? SITE.base : abs(file);
  const img = abs(image);
  const fullTitle = `${title} | ${SITE.name}, Port Harcourt`;

  return `<!DOCTYPE html>
<html lang="en-NG">

<head>
\t<title>${fullTitle}</title>
\t<meta charset="utf-8">
\t<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
\t<meta name="description" content="${description}">
\t<meta name="theme-color" content="#072a4e">
\t<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
\t<meta name="author" content="${SITE.name}">
\t<link rel="canonical" href="${canonical}">

\t<meta property="og:site_name" content="${SITE.name}">
\t<meta property="og:locale" content="en_NG">
\t<meta property="og:title" content="${title} | ${SITE.name}">
\t<meta property="og:description" content="${description}">
\t<meta property="og:type" content="website">
\t<meta property="og:url" content="${canonical}">
\t<meta property="og:image" content="${img}">
\t<meta property="og:image:alt" content="${SITE.name}, ${SITE.addressShort}">
\t<meta property="og:image:width" content="1200">
\t<meta property="og:image:height" content="630">
\t<meta name="twitter:card" content="summary_large_image">
\t<meta name="twitter:title" content="${title} | ${SITE.name}">
\t<meta name="twitter:description" content="${description}">
\t<meta name="twitter:image" content="${img}">

\t<link rel="icon" href="images/favicon.svg" type="image/svg+xml">
\t<link rel="apple-touch-icon" href="images/brand/apple-touch-icon.png">
\t<link rel="manifest" href="site.webmanifest">

\t<link rel="preconnect" href="https://fonts.googleapis.com">
\t<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
\t<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

\t<link rel="stylesheet" href="css/open-iconic-bootstrap.min.css">
\t<link rel="stylesheet" href="css/animate.css">
\t<link rel="stylesheet" href="css/owl.carousel.min.css">
\t<link rel="stylesheet" href="css/owl.theme.default.min.css">
\t<link rel="stylesheet" href="css/magnific-popup.css">
\t<link rel="stylesheet" href="css/aos.css">
\t<link rel="stylesheet" href="css/ionicons.min.css">
\t<link rel="stylesheet" href="css/bootstrap-datepicker.css">
\t<link rel="stylesheet" href="css/jquery.timepicker.css">
\t<link rel="stylesheet" href="css/flaticon.css">
\t<link rel="stylesheet" href="css/icomoon.css">
\t<link rel="stylesheet" href="css/style.css">
\t<link rel="stylesheet" href="css/gth-theme.css">
\t<noscript>
\t\t<style>
\t\t\t.ftco-animate { opacity: 1 !important; visibility: visible !important; }
\t\t\t#ftco-loader { display: none !important; }
\t\t</style>
\t</noscript>
${jsonLdScript([websiteLd(), hotelLd()].concat(jsonLd))}
</head>

<body${active ? ` class="page-${active}"` : ''}>

\t<a class="skip-link" href="#main">Skip to content</a>

\t<header>
\t\t<nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar" aria-label="Main navigation">
\t\t\t<div class="container">
\t\t\t\t<a class="navbar-brand brand-lockup" href="index.html" aria-label="${SITE.name} — home">
\t\t\t\t\t<img class="logo-on-dark" src="images/brand/logo-mark-light.png" width="54" height="54" alt="">
\t\t\t\t\t<img class="logo-on-light" src="images/brand/logo-mark.png" width="54" height="54" alt="">
\t\t\t\t\t<span class="brand-text">Grand <span>Tokyu</span><small>Port Harcourt</small></span>
\t\t\t\t</a>
\t\t\t\t<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav"
\t\t\t\t\taria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
\t\t\t\t\t<span class="oi oi-menu"></span> Menu
\t\t\t\t</button>

\t\t\t\t<div class="collapse navbar-collapse" id="ftco-nav">
\t\t\t\t\t<ul class="navbar-nav ml-auto">
${navItems}
\t\t\t\t\t\t<li class="nav-item cta ml-lg-2"><a href="booking.html" class="nav-link"><span>Book Now</span></a></li>
\t\t\t\t\t</ul>
\t\t\t\t</div>
\t\t\t</div>
\t\t</nav>
\t</header>
\t<!-- END nav -->`;
}

function footer() {
  return `
\t<footer class="ftco-footer ftco-section">
\t\t<div class="overlay"></div>
\t\t<div class="container">
\t\t\t<div class="row mb-5">
\t\t\t\t<div class="col-lg-4 col-md-6">
\t\t\t\t\t<div class="ftco-footer-widget mb-4">
\t\t\t\t\t\t<img class="footer-logo" src="images/brand/logo-light.png" width="82" height="82"
\t\t\t\t\t\t\talt="${SITE.name} logo — a blue roundel with a sun over a wave, reading Grand Tokyu Hotel">
\t\t\t\t\t\t<h2 class="ftco-heading-2">Grand <span class="text-sky">Tokyu</span></h2>
\t\t\t\t\t\t<p>Hospitality meets heart on Aba Road. Rooms, suites and a two-bedroom apartment, a courtyard pool,
\t\t\t\t\t\t\ta restaurant serving Nigerian and continental cooking, a bar, and a front desk that never closes.</p>
\t\t\t\t\t\t<ul class="ftco-footer-social list-unstyled float-md-left float-lft mt-4">
\t\t\t\t\t\t\t<li class="ftco-animate"><a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener" aria-label="Message ${SITE.name} on WhatsApp"><span class="icon-whatsapp"></span></a></li>
\t\t\t\t\t\t\t<li class="ftco-animate"><a href="${SITE.instagram}" target="_blank" rel="noopener" aria-label="Grand Tokyu Hotel on Instagram"><span class="icon-instagram"></span></a></li>
\t\t\t\t\t\t\t<li class="ftco-animate"><a href="mailto:${SITE.email}" aria-label="Email ${SITE.name}"><span class="icon-envelope"></span></a></li>
\t\t\t\t\t\t\t<li class="ftco-animate"><a href="${SITE.phoneHref}" aria-label="Call ${SITE.name}"><span class="icon-phone"></span></a></li>
\t\t\t\t\t\t</ul>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t<div class="col-lg-2 col-md-6">
\t\t\t\t\t<div class="ftco-footer-widget mb-4 ml-md-4">
\t\t\t\t\t\t<h2 class="ftco-heading-2">Explore</h2>
\t\t\t\t\t\t<ul class="list-unstyled">
\t\t\t\t\t\t\t<li><a href="rooms.html" class="py-2 d-block">Rooms &amp; suites</a></li>
\t\t\t\t\t\t\t<li><a href="rooms.html#rates" class="py-2 d-block">Rates</a></li>
\t\t\t\t\t\t\t<li><a href="restaurant.html" class="py-2 d-block">Dining</a></li>
\t\t\t\t\t\t\t<li><a href="events.html" class="py-2 d-block">Events &amp; the Hall</a></li>
\t\t\t\t\t\t\t<li><a href="gallery.html" class="py-2 d-block">Gallery</a></li>
\t\t\t\t\t\t\t<li><a href="about.html" class="py-2 d-block">About us</a></li>
\t\t\t\t\t\t</ul>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t<div class="col-lg-2 col-md-6">
\t\t\t\t\t<div class="ftco-footer-widget mb-4">
\t\t\t\t\t\t<h2 class="ftco-heading-2">Stay</h2>
\t\t\t\t\t\t<ul class="list-unstyled">
\t\t\t\t\t\t\t<li><a href="booking.html" class="py-2 d-block">Book a room</a></li>
\t\t\t\t\t\t\t<li><a href="about.html#good-to-know" class="py-2 d-block">Good to know</a></li>
\t\t\t\t\t\t\t<li><a href="about.html#faqs" class="py-2 d-block">FAQs</a></li>
\t\t\t\t\t\t\t<li><a href="blog.html" class="py-2 d-block">Journal</a></li>
\t\t\t\t\t\t\t<li><a href="contact.html" class="py-2 d-block">Contact &amp; directions</a></li>
\t\t\t\t\t\t\t<li><a href="llms.txt" class="py-2 d-block">Information for AI assistants</a></li>
\t\t\t\t\t\t</ul>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t<div class="col-lg-4 col-md-6">
\t\t\t\t\t<div class="ftco-footer-widget mb-4">
\t\t\t\t\t\t<h2 class="ftco-heading-2">Find us</h2>
\t\t\t\t\t\t<div class="block-23 mb-3">
\t\t\t\t\t\t\t<address class="mb-0">
\t\t\t\t\t\t\t\t<ul>
\t\t\t\t\t\t\t\t\t<li><span class="icon icon-map-marker"></span><span class="text">${SITE.address}</span></li>
\t\t\t\t\t\t\t\t\t<li><a href="${SITE.phoneHref}"><span class="icon icon-phone"></span><span class="text">${SITE.phone}</span></a></li>
\t\t\t\t\t\t\t\t\t<li><a href="${SITE.phone2Href}"><span class="icon icon-phone"></span><span class="text">${SITE.phone2}</span></a></li>
\t\t\t\t\t\t\t\t\t<li><a href="mailto:${SITE.email}"><span class="icon icon-envelope"></span><span class="text">${SITE.email}</span></a></li>
\t\t\t\t\t\t\t\t\t<li><a href="${SITE.instagram}" target="_blank" rel="noopener"><span class="icon icon-instagram"></span><span class="text">${SITE.instagramHandle}</span></a></li>
\t\t\t\t\t\t\t\t</ul>
\t\t\t\t\t\t\t</address>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="row border-top-gold pt-4">
\t\t\t\t<div class="col-md-12 text-center">
\t\t\t\t\t<p class="small mb-2">
\t\t\t\t\t\t&copy; <span id="year">${new Date().getFullYear()}</span> ${SITE.name}, 273/274 Aba Road, Port Harcourt.
\t\t\t\t\t\tBuilt on the <a href="https://colorlib.com" target="_blank" rel="noopener">Colorlib</a> Harborlights
\t\t\t\t\t\ttemplate (CC BY 3.0).
\t\t\t\t\t</p>
\t\t\t\t\t<p class="disclaimer small mb-0">
\t\t\t\t\t\tPhotography is the hotel’s own. Rates are published starting prices, not live availability —
\t\t\t\t\t\tplease confirm dates and prices with the reservations desk on ${SITE.phone}.
\t\t\t\t\t</p>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</footer>

\t<!-- loader -->
\t<div id="ftco-loader" class="show fullscreen" aria-hidden="true"><svg class="circular" width="48px" height="48px">
\t\t\t<circle class="path-bg" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke="#eeeeee" />
\t\t\t<circle class="path" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke-miterlimit="10"
\t\t\t\tstroke="#1c77c5" />
\t\t</svg></div>

\t<script src="js/jquery.min.js"></script>
\t<script src="js/jquery-migrate-3.0.1.min.js"></script>
\t<script src="js/popper.min.js"></script>
\t<script src="js/bootstrap.min.js"></script>
\t<script src="js/jquery.easing.1.3.js"></script>
\t<script src="js/jquery.waypoints.min.js"></script>
\t<script src="js/jquery.stellar.min.js"></script>
\t<script src="js/owl.carousel.min.js"></script>
\t<script src="js/jquery.magnific-popup.min.js"></script>
\t<script src="js/aos.js"></script>
\t<script src="js/jquery.animateNumber.min.js"></script>
\t<script src="js/scrollax.min.js"></script>
\t<script src="js/gth.js"></script>
\t<script src="js/main.js"></script>

</body>

</html>
`;
}

function pageHero({ image, imageAlt = '', crumbs = [], title, subtitle = '', kicker = '' }) {
  const crumbsHtml = crumbs
    .map((c, i) =>
      i === 0
        ? `<span class="mr-2"><a href="${c.href}">${c.label}</a></span>`
        : `<span class="mr-2">${c.href ? `<a href="${c.href}">${c.label}</a>` : c.label}</span>`
    )
    .join(' ');
  return `
\t<section class="hero-wrap hero-sm" style="background-image: url('${image}');" aria-label="${imageAlt}">
\t\t<div class="overlay"></div>
\t\t<div class="container">
\t\t\t<div class="row no-gutters slider-text d-flex align-items-center justify-content-center">
\t\t\t\t<div class="col-md-9 ftco-animate text-center d-flex align-items-end justify-content-center">
\t\t\t\t\t<div class="text">
\t\t\t\t\t\t<nav class="breadcrumbs mb-2" aria-label="Breadcrumb">${crumbsHtml}</nav>
\t\t\t\t\t\t${kicker ? `<span class="hero-kicker">${kicker}</span>` : ''}
\t\t\t\t\t\t<h1 class="mb-3 bread">${title}</h1>
\t\t\t\t\t\t${subtitle ? `<p class="hero-sub mb-0">${subtitle}</p>` : ''}
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>`;
}

function ctaBand() {
  return `
\t<section class="cta-band">
\t\t<div class="container">
\t\t\t<div class="row align-items-center">
\t\t\t\t<div class="col-lg-8">
\t\t\t\t\t<span class="subheading">Reservations</span>
\t\t\t\t\t<h2 class="mb-3">Your room is ready when you are.</h2>
\t\t\t\t\t<p class="mb-0">Speak to the front desk directly — no call centre, no waiting. We answer day and night.
\t\t\t\t\t\tTwo lines: ${SITE.phone} and ${SITE.phone2}.</p>
\t\t\t\t</div>
\t\t\t\t<div class="col-lg-4 text-lg-right mt-4 mt-lg-0">
\t\t\t\t\t<a href="${SITE.phoneHref}" class="btn btn-primary btn-lg rounded-pill px-4">${SITE.phone}</a>
\t\t\t\t\t<a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener" class="btn btn-outline-light btn-lg rounded-pill px-4 mt-2 mt-sm-0 ml-sm-2">WhatsApp</a>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>`;
}

function roomCard(room) {
  return `
\t\t\t\t<div class="col-md-6 col-lg-4 d-flex ftco-animate">
\t\t\t\t\t<article class="room-card w-100">
\t\t\t\t\t\t<a href="room-${room.slug}.html" class="room-card-img">
\t\t\t\t\t\t\t<img src="${room.image}" alt="${room.alt}" loading="lazy" width="800" height="533">
\t\t\t\t\t\t\t<span class="price-tag">From ${money(room.from)}<small>/night</small></span>
\t\t\t\t\t\t</a>
\t\t\t\t\t\t<div class="room-card-body">
\t\t\t\t\t\t\t<p class="room-max mb-1"><strong>${room.max}</strong> Max Adults</p>
\t\t\t\t\t\t\t<h3><a href="room-${room.slug}.html">${room.name}</a></h3>
\t\t\t\t\t\t\t<p class="room-meta mb-2">${room.sleeps} &middot; ${room.bed}${room.view && room.view !== '—' ? ' &middot; ' + room.view : ''}</p>
\t\t\t\t\t\t\t<p class="room-copy">${room.intro.split('. ')[0]}.</p>
\t\t\t\t\t\t\t<p class="mb-0 mt-3">
\t\t\t\t\t\t\t\t<a href="booking.html?room=${room.slug}" class="btn btn-primary rounded-pill px-3 py-2">Book now</a>
\t\t\t\t\t\t\t\t<a href="room-${room.slug}.html" class="link-arrow ml-2">Details <span class="icon-long-arrow-right"></span></a>
\t\t\t\t\t\t\t</p>
\t\t\t\t\t\t</div>
\t\t\t\t\t</article>
\t\t\t\t</div>`;
}

function kitchenCard(item) {
  return `
\t\t\t\t<div class="col-md-6 col-lg-4 d-flex ftco-animate">
\t\t\t\t\t<div class="dish-card dish-card-plain w-100">
\t\t\t\t\t\t<div class="dish-body">
\t\t\t\t\t\t\t<span class="dish-tag">${item.tag}</span>
\t\t\t\t\t\t\t<h3>${item.name}</h3>
\t\t\t\t\t\t\t<p class="mb-0">${item.desc}</p>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>`;
}

function galleryTile(item, extraClass = '') {
  return `
\t\t\t\t\t<a href="${item.img}" class="gallery-item image-popup${extraClass}"${
    item.group ? ` data-group="${item.group.replace(/&/g, '&amp;')}"` : ''
  }>
\t\t\t\t\t\t<img src="${item.img}" alt="${item.alt}" loading="lazy" width="800" height="600">
\t\t\t\t\t\t<span class="cap">${item.cap}</span>
\t\t\t\t\t</a>`;
}

function writePage(file, html) {
  fs.writeFileSync(path.join(ROOT, file), html);
  console.log('  ✓', file);
}

function writeFile(file, body) {
  fs.writeFileSync(path.join(ROOT, file), body);
  console.log('  ✓', file);
}

module.exports = { ROOT, SITE, NAV, ROOMS, HALL, GALLERY, FAQS, POSTS, SHARED_ROOM_FEATURES };

/* ------------------------------------------------------------------ *
 *  HOME
 * ------------------------------------------------------------------ */
function buildHome() {
  const slides = [
    {
      img: IMG('exterior-sign'),
      kicker: 'Aba Road, Port Harcourt',
      title: 'Hospitality meets heart.',
      text: 'A warm, personal welcome in the middle of the city — and a room that feels like yours.',
      cta: 'Book your stay',
      href: 'booking.html',
      cta2: 'Explore rooms',
      href2: 'rooms.html'
    },
    {
      img: IMG('pool-courtyard'),
      kicker: 'The courtyard pool',
      title: 'Slow mornings by the water.',
      text: 'A quiet pool deck, cold drinks and nowhere in particular to be.',
      cta: 'See the gallery',
      href: 'gallery.html',
      cta2: 'Rooms & rates',
      href2: 'rooms.html'
    },
    {
      img: IMG('restaurant-dining'),
      kicker: 'The restaurant & bar',
      title: 'A table worth staying in.',
      text: 'Nigerian classics beside continental favourites, and a bar that keeps its own hours.',
      cta: 'Dining & bar',
      href: 'restaurant.html',
      cta2: 'Book a table',
      href2: 'booking.html'
    }
  ];

  const slidesHtml = slides
    .map(
      (s, i) => `
\t\t\t<div class="slider-item" style="background-image:url(${s.img});" aria-label="${s.title} — ${s.kicker}">
\t\t\t\t<div class="overlay"></div>
\t\t\t\t<div class="container">
\t\t\t\t\t<div class="row justify-content-center no-gutters slider-text align-items-center">
\t\t\t\t\t\t<div class="col-md-9 ftco-animate">
\t\t\t\t\t\t\t<div class="text text-center">
\t\t\t\t\t\t\t\t<span class="hero-kicker">${s.kicker}</span>
\t\t\t\t\t\t\t\t${i === 0 ? `<h1 class="mb-3">${s.title}</h1>` : `<p class="slide-title mb-3">${s.title}</p>`}
\t\t\t\t\t\t\t\t<p class="hero-lede">${s.text}</p>
\t\t\t\t\t\t\t\t<p class="mt-4 mb-0">
\t\t\t\t\t\t\t\t\t<a href="${s.href}" class="btn btn-primary btn-lg rounded-pill px-4">${s.cta}</a>
\t\t\t\t\t\t\t\t\t<a href="${s.href2}" class="btn btn-outline-light btn-lg rounded-pill px-4 ml-sm-2">${s.cta2}</a>
\t\t\t\t\t\t\t\t</p>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>`
    )
    .join('');

  const services = [
    { icon: 'flaticon-reception-bell', title: '24/7 front desk', text: 'Someone at the desk at three in the afternoon and three in the morning.' },
    { icon: 'ion-ios-wine', title: 'Bar & lounge', text: 'Cold drinks, low light and a corner of the hotel that stays open late.' },
    { icon: 'ion-ios-water', title: 'Courtyard pool', text: 'A calm pool with a terrace, sun loungers and a side of shade.' },
    { icon: 'ion-ios-restaurant', title: 'Local & continental', text: 'A restaurant serving Nigerian classics beside continental favourites.' },
    { icon: 'ion-ios-wifi', title: 'High-speed Wi-Fi', text: 'Free, fast and everywhere — from your room to the lounge.' }
  ];

  const servicesHtml = services
    .map(
      (s, i) => `
\t\t\t\t<div class="col-lg col-md-4 d-flex align-self-stretch ftco-animate">
\t\t\t\t\t<div class="media block-6 services py-4 d-block text-center${i === 1 ? ' active' : ''}">
\t\t\t\t\t\t<div class="d-flex justify-content-center">
\t\t\t\t\t\t\t<div class="icon d-flex align-items-center justify-content-center">
\t\t\t\t\t\t\t\t<span class="${s.icon}"></span>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="media-body">
\t\t\t\t\t\t\t<h3 class="heading mb-2">${s.title}</h3>
\t\t\t\t\t\t\t<p class="service-note mb-0">${s.text}</p>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>`
    )
    .join('');

  const stats = [
    { n: 5, suffix: '', label: 'room categories' },
    { n: 200, suffix: '', label: 'guests in The Hall' },
    { n: 24, suffix: '/7', label: 'front desk' },
    { n: 3, suffix: '', label: 'places to eat & drink' }
  ];

  const statsHtml = stats
    .map(
      (s) => `
\t\t\t\t\t<div class="col-6 col-md-3 ftco-animate">
\t\t\t\t\t\t<div class="stat">
\t\t\t\t\t\t\t<span class="stat-number"><span class="number" data-number="${s.n}">${s.n}</span>${s.suffix}</span>
\t\t\t\t\t\t\t<span class="stat-label">${s.label}</span>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>`
    )
    .join('');

  const listingCards = [
    {
      icon: 'icon-map-marker',
      name: 'Google Maps',
      status: 'Find us',
      detail: 'Directions and the map pin for 273/274 Aba Road, Port Harcourt.',
      href: SITE.maps,
      cta: 'Open in Maps'
    },
    {
      icon: 'icon-instagram',
      name: 'Instagram',
      status: SITE.instagramHandle,
      detail: 'New photography, events and offers are posted to the hotel’s Instagram first.',
      href: SITE.instagram,
      cta: 'Follow on Instagram'
    }
  ];

  const listingsHtml = listingCards
    .map(
      (l) => `
\t\t\t\t\t<div class="col-md-6 d-flex ftco-animate">
\t\t\t\t\t\t<div class="rating-card w-100">
\t\t\t\t\t\t\t<div class="d-flex align-items-start">
\t\t\t\t\t\t\t\t<span class="${l.icon} rating-icon"></span>
\t\t\t\t\t\t\t\t<div class="ml-3 flex-grow-1">
\t\t\t\t\t\t\t\t\t<p class="mb-0 rating-name">${l.name}</p>
\t\t\t\t\t\t\t\t\t<p class="mb-1 rating-count">${l.status}</p>
\t\t\t\t\t\t\t\t\t<p class="mb-2 listing-detail">${l.detail}</p>
\t\t\t\t\t\t\t\t\t<a class="link-arrow" href="${l.href}" target="_blank" rel="noopener">${l.cta} <span class="icon-long-arrow-right"></span></a>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>`
    )
    .join('');

  const postsHtml = POSTS.map(
    (p) => `
\t\t\t\t<div class="col-md-4 d-flex ftco-animate">
\t\t\t\t\t<article class="blog-entry align-self-stretch">
\t\t\t\t\t\t<a href="${p.slug}" class="block-20 rounded" style="background-image: url(${p.img});" aria-label="${p.title}"></a>
\t\t\t\t\t\t<div class="text mt-3">
\t\t\t\t\t\t\t<div class="meta mb-2">${p.date} &middot; ${p.read}</div>
\t\t\t\t\t\t\t<h3 class="heading mb-2"><a href="${p.slug}">${p.title}</a></h3>
\t\t\t\t\t\t\t<p class="mb-0">${p.excerpt}</p>
\t\t\t\t\t\t</div>
\t\t\t\t\t</article>
\t\t\t\t</div>`
  ).join('');

  const features = ROOMS.map(roomCard).join('');

  const stripItems = [
    { img: IMG('reception-desk'), alt: PHOTO.reception.alt, cap: 'Reception' },
    { img: IMG('pool-courtyard'), alt: PHOTO.pool.alt, cap: 'Courtyard pool' },
    { img: IMG('room-classic-1'), alt: 'Classic Room', cap: 'Classic Room' },
    { img: IMG('restaurant-dining'), alt: PHOTO.restaurant.alt, cap: 'Restaurant' },
    { img: IMG('apartment-living-1'), alt: 'The Apartment living room', cap: 'The Apartment' },
    { img: IMG('bar-shelves'), alt: PHOTO.bar.alt, cap: 'The bar' }
  ];
  const strip = stripItems.map((i) => galleryTile(i)).join('');

  const instaItems = [
    { img: IMG('lounge-tv'), alt: PHOTO.lounge.alt, cap: 'The lounge' },
    { img: IMG('room-deluxe-1'), alt: 'Classic Suite Room', cap: 'Classic Suite' },
    { img: IMG('pool-loungers'), alt: PHOTO.poolLoungers.alt, cap: 'Poolside' },
    { img: IMG('apartment-kitchen-1'), alt: 'The Apartment kitchen', cap: 'The Apartment' },
    { img: IMG('restaurant-tables'), alt: PHOTO.restaurantTables.alt, cap: 'Dinner service' }
  ];
  const instaHtml = instaItems
    .map(
      (i) => `
\t\t\t\t\t<a href="${SITE.instagram}" target="_blank" rel="noopener" class="gallery-item" aria-label="See more on Instagram: ${i.cap}">
\t\t\t\t\t\t<img src="${i.img}" alt="${i.alt}" loading="lazy" width="800" height="600">
\t\t\t\t\t\t<span class="cap">${i.cap}</span>
\t\t\t\t\t</a>`
    )
    .join('');

  const kitchenHtml = KITCHEN.slice(0, 3).map(kitchenCard).join('');

  const html = `${head({
    title: 'Boutique comfort on Aba Road',
    description:
      'Grand Tokyu Hotel, 273/274 Aba Road, Port Harcourt — rooms and suites from ₦32,000 a night, a courtyard pool, restaurant and bar, and The Hall for up to 200 guests. Call +234 091 6000 7896.',
    active: 'home',
    file: 'index.html'
  })}

\t<main id="main">

\t<section class="hero" aria-label="Grand Tokyu Hotel highlights">
\t\t<div class="home-slider owl-carousel">
${slidesHtml}
\t\t</div>
\t</section>

\t<section class="booking-strip" aria-label="Quick availability check">
\t\t<div class="container">
\t\t\t<form class="booking-bar" id="quick-booking">
\t\t\t\t<div class="row align-items-end">
\t\t\t\t\t<div class="col-lg-3 col-md-6">
\t\t\t\t\t\t<label for="qb-in">Check in</label>
\t\t\t\t\t\t<input type="date" id="qb-in" class="form-control" required>
\t\t\t\t\t</div>
\t\t\t\t\t<div class="col-lg-3 col-md-6">
\t\t\t\t\t\t<label for="qb-out">Check out</label>
\t\t\t\t\t\t<input type="date" id="qb-out" class="form-control" required>
\t\t\t\t\t</div>
\t\t\t\t\t<div class="col-lg-2 col-md-6">
\t\t\t\t\t\t<label for="qb-guests">Guests</label>
\t\t\t\t\t\t<select id="qb-guests" class="form-control">
\t\t\t\t\t\t\t<option>1 guest</option>
\t\t\t\t\t\t\t<option selected>2 guests</option>
\t\t\t\t\t\t\t<option>3 guests</option>
\t\t\t\t\t\t\t<option>4 guests</option>
\t\t\t\t\t\t\t<option>5 guests</option>
\t\t\t\t\t\t\t<option>6+ guests</option>
\t\t\t\t\t\t</select>
\t\t\t\t\t</div>
\t\t\t\t\t<div class="col-lg-2 col-md-6">
\t\t\t\t\t\t<label for="qb-room">Room</label>
\t\t\t\t\t\t<select id="qb-room" class="form-control">
\t\t\t\t\t\t\t<option value="">Any room</option>
\t\t\t\t\t\t\t${ROOMS.map((r) => `<option value="${r.slug}">${r.name}</option>`).join('\n\t\t\t\t\t\t\t')}
\t\t\t\t\t\t</select>
\t\t\t\t\t</div>
\t\t\t\t\t<div class="col-lg-2">
\t\t\t\t\t\t<button type="submit" class="btn btn-primary btn-block rounded-pill py-3">Check availability</button>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</form>
\t\t</div>
\t</section>

\t<section class="ftco-section">
\t\t<div class="container">
\t\t\t<div class="row justify-content-center mb-4 pb-2">
\t\t\t\t<div class="col-md-8 heading-section text-center ftco-animate">
\t\t\t\t\t<span class="subheading">Welcome to Grand Tokyu</span>
\t\t\t\t\t<h2 class="mb-4">More than just a stay</h2>
\t\t\t\t\t<p class="lead-copy">Every corner of the hotel is designed for comfort, elegance and a sense of home —
\t\t\t\t\t\twhether you are here for business, for leisure or for a celebration.</p>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="row d-flex">
${servicesHtml}
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section pt-0" id="rooms">
\t\t<div class="container-fluid px-md-5">
\t\t\t<div class="row justify-content-between align-items-center mb-4">
\t\t\t\t<div class="col-md-7 heading-section ftco-animate">
\t\t\t\t\t<span class="subheading">Rooms &amp; suites</span>
\t\t\t\t\t<h2 class="mb-2">Somewhere to come back to</h2>
\t\t\t\t\t<p class="mb-0">Five categories, from a two-adult Classic to a ten-adult apartment with its own kitchen.
\t\t\t\t\t\tAll rates are the hotel’s published “book now from” prices per night.</p>
\t\t\t\t</div>
\t\t\t\t<div class="col-md-4 text-md-right ftco-animate mb-3 mb-md-0">
\t\t\t\t\t<a href="rooms.html" class="btn btn-outline-dark rounded-pill px-4">All rooms &amp; rates</a>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="row">
${features}
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="split-feature">
\t\t<div class="container-fluid px-0">
\t\t\t<div class="row no-gutters align-items-stretch">
\t\t\t\t<div class="col-lg-6 split-img" style="background-image:url(${IMG('pool-courtyard')});" role="img" aria-label="${PHOTO.pool.alt}"></div>
\t\t\t\t<div class="col-lg-6 split-copy">
\t\t\t\t\t<div class="split-inner ftco-animate">
\t\t\t\t\t\t<span class="subheading">The courtyard pool</span>
\t\t\t\t\t\t<h2 class="mb-4">A quiet corner of the city, with water</h2>
\t\t\t\t\t\t<p>Sun loungers, shade, a terrace for lunch and a pool that stays civilised all day. Guests come
\t\t\t\t\t\t\tdown for a morning swim and end up staying until the afternoon — that is rather the point.</p>
\t\t\t\t\t\t<ul class="tick-list">
\t\t\t\t\t\t\t<li><span class="icon-check"></span> Outdoor courtyard pool with sun loungers</li>
\t\t\t\t\t\t\t<li><span class="icon-check"></span> Covered terrace for drinks and light meals</li>
\t\t\t\t\t\t\t<li><span class="icon-check"></span> Towels provided for house guests</li>
\t\t\t\t\t\t</ul>
\t\t\t\t\t\t<a href="gallery.html" class="btn btn-primary rounded-pill px-4">See the pool</a>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="split-feature split-feature-reverse">
\t\t<div class="container-fluid px-0">
\t\t\t<div class="row no-gutters align-items-stretch">
\t\t\t\t<div class="col-lg-6 order-lg-last split-img" style="background-image:url(${IMG('restaurant-dining')});" role="img" aria-label="${PHOTO.restaurant.alt}"></div>
\t\t\t\t<div class="col-lg-6 split-copy">
\t\t\t\t\t<div class="split-inner ftco-animate">
\t\t\t\t\t\t<span class="subheading">The restaurant &amp; bar</span>
\t\t\t\t\t\t<h2 class="mb-4">Local and continental, cooked with care</h2>
\t\t\t\t\t\t<p>From jollof and grilled fish to a properly rested steak — the kitchen cooks for the way you feel,
\t\t\t\t\t\t\tnot just the time of day. The bar next door keeps the evening going.</p>
\t\t\t\t\t\t<ul class="tick-list">
\t\t\t\t\t\t\t<li><span class="icon-check"></span> Nigerian and continental dishes</li>
\t\t\t\t\t\t\t<li><span class="icon-check"></span> Breakfast, lunch and dinner</li>
\t\t\t\t\t\t\t<li><span class="icon-check"></span> Room service for house guests</li>
\t\t\t\t\t\t</ul>
\t\t\t\t\t\t<a href="restaurant.html" class="btn btn-primary rounded-pill px-4">Dining &amp; bar</a>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section stat-section" id="section-counter">
\t\t<div class="container">
\t\t\t<div class="row text-center">
${statsHtml}
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section">
\t\t<div class="container">
\t\t\t<div class="row justify-content-center mb-5 pb-2">
\t\t\t\t<div class="col-md-9 heading-section text-center ftco-animate">
\t\t\t\t\t<span class="subheading">The Grand Tokyu promise</span>
\t\t\t\t\t<h2 class="mb-3">A five-star Michelin experience</h2>
\t\t\t\t\t<p class="mb-0">That is the standard the hotel sets itself: rooms that feel finished, a kitchen that
\t\t\t\t\t\tcooks with intent, and service that notices before you ask — the promise the team is measured
\t\t\t\t\t\tagainst every day.</p>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="row align-items-center">
\t\t\t\t<div class="col-lg-6 ftco-animate">
\t\t\t\t\t<figure class="stacked-imgs mb-0">
\t\t\t\t\t\t<a href="${IMG('bar-shelves-alt')}" class="img-main image-popup" style="background-image:url(${IMG('bar-shelves-alt')});" aria-label="${PHOTO.barAlt.alt}"></a>
\t\t\t\t\t\t<a href="${IMG('room-deluxe-1')}" class="img-small image-popup" style="background-image:url(${IMG('room-deluxe-1')});" aria-label="Classic Suite Room"></a>
\t\t\t\t\t</figure>
\t\t\t\t</div>
\t\t\t\t<div class="col-lg-6 ftco-animate pl-lg-5 mt-4 mt-lg-0">
\t\t\t\t\t<h3 class="mb-3">What that looks like in practice</h3>
\t\t\t\t\t<ul class="tick-list">
\t\t\t\t\t\t<li><span class="icon-check"></span> Rooms turned daily, linen changed and aired</li>
\t\t\t\t\t\t<li><span class="icon-check"></span> A kitchen that cooks Nigerian and continental menus to order</li>
\t\t\t\t\t\t<li><span class="icon-check"></span> Two reservation lines answered around the clock</li>
\t\t\t\t\t\t<li><span class="icon-check"></span> Events handled end to end — layout, catering, timing</li>
\t\t\t\t\t\t<li><span class="icon-check"></span> Airport pick-up and car hire arranged on request</li>
\t\t\t\t\t</ul>
\t\t\t\t\t<a href="about.html" class="link-arrow">About the hotel <span class="icon-long-arrow-right"></span></a>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section bg-light">
\t\t<div class="container">
\t\t\t<div class="row justify-content-center mb-5 pb-2">
\t\t\t\t<div class="col-md-8 heading-section text-center ftco-animate">
\t\t\t\t\t<span class="subheading">From the kitchen</span>
\t\t\t\t\t<h2 class="mb-3">A taste of the menu</h2>
\t\t\t\t\t<p>Three plates to start with — the menu follows the market, so ask your server what is good today.</p>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="row">
${kitchenHtml}
\t\t\t</div>
\t\t\t<div class="row mt-3">
\t\t\t\t<div class="col-md-12 text-center ftco-animate">
\t\t\t\t\t<a href="restaurant.html" class="btn btn-primary rounded-pill px-4">View the menu</a>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section">
\t\t<div class="container-fluid px-md-5">
\t\t\t<div class="row justify-content-between align-items-end mb-4">
\t\t\t\t<div class="col-md-7 heading-section ftco-animate">
\t\t\t\t\t<span class="subheading">Gallery</span>
\t\t\t\t\t<h2 class="mb-0">A look around</h2>
\t\t\t\t\t<p class="mb-0">Real photographs of the hotel, taken on Aba Road.</p>
\t\t\t\t</div>
\t\t\t\t<div class="col-md-4 text-md-right ftco-animate mb-3 mb-md-0">
\t\t\t\t\t<a href="gallery.html" class="btn btn-outline-dark rounded-pill px-4">Full gallery</a>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="gallery-grid gallery-grid-6">
${strip}
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section pt-0">
\t\t<div class="container">
\t\t\t<div class="row justify-content-center mb-4">
\t\t\t\t<div class="col-md-8 heading-section text-center ftco-animate">
\t\t\t\t\t<span class="subheading">Follow the hotel</span>
\t\t\t\t\t<h2 class="mb-3">@grandtokyu on Instagram</h2>
\t\t\t\t\t<p class="mb-0">New photography, events and offers go up on the hotel’s Instagram first.</p>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="gallery-grid gallery-grid-6">
${instaHtml}
\t\t\t</div>
\t\t\t<div class="row mt-4">
\t\t\t\t<div class="col-md-12 text-center">
\t\t\t\t\t<a href="${SITE.instagram}" target="_blank" rel="noopener" class="btn btn-outline-dark rounded-pill px-4">
\t\t\t\t\t\t<span class="icon-instagram mr-1"></span> Follow ${SITE.instagramHandle}
\t\t\t\t\t</a>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="row mt-5">
${listingsHtml}
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section bg-light">
\t\t<div class="container">
\t\t\t<div class="row">
\t\t\t\t<div class="col-lg-5 ftco-animate">
\t\t\t\t\t<span class="subheading">Our address</span>
\t\t\t\t\t<h2 class="mb-3">${SITE.name}</h2>
\t\t\t\t\t<address class="mb-3">
\t\t\t\t\t\t273/274 Aba Road,<br>
\t\t\t\t\t\tPort Harcourt, Rivers State,<br>
\t\t\t\t\t\tNigeria
\t\t\t\t\t</address>
\t\t\t\t\t<ul class="info-list">
\t\t\t\t\t\t<li><span>Tel</span><a href="${SITE.phoneHref}">${SITE.phone}</a></li>
\t\t\t\t\t\t<li><span>Tel 2</span><a href="${SITE.phone2Href}">${SITE.phone2}</a></li>
\t\t\t\t\t\t<li><span>Email</span><a href="mailto:${SITE.email}">${SITE.email}</a></li>
\t\t\t\t\t\t<li><span>Instagram</span><a href="${SITE.instagram}" target="_blank" rel="noopener">${SITE.instagramHandle}</a></li>
\t\t\t\t\t\t<li><span>Check-in</span>from 12:00</li>
\t\t\t\t\t\t<li><span>Check-out</span>by 11:00</li>
\t\t\t\t\t</ul>
\t\t\t\t\t<a href="contact.html" class="btn btn-outline-dark rounded-pill px-4 mt-2">Directions &amp; map</a>
\t\t\t\t</div>
\t\t\t\t<div class="col-lg-7 ftco-animate">
\t\t\t\t\t<div class="map-frame">
\t\t\t\t\t\t<iframe src="${SITE.osm}" title="Map of 273/274 Aba Road, Port Harcourt" loading="lazy"></iframe>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section">
\t\t<div class="container">
\t\t\t<div class="row justify-content-between align-items-end mb-4">
\t\t\t\t<div class="col-md-8 heading-section ftco-animate">
\t\t\t\t\t<span class="subheading">Journal</span>
\t\t\t\t\t<h2 class="mb-0">Notes for your stay</h2>
\t\t\t\t</div>
\t\t\t\t<div class="col-md-3 text-md-right ftco-animate mb-3 mb-md-0">
\t\t\t\t\t<a href="blog.html" class="btn btn-outline-dark rounded-pill px-4">All notes</a>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="row">
${postsHtml}
\t\t\t</div>
\t\t</div>
\t</section>

\t</main>
${ctaBand()}
${footer()}`;

  writePage('index.html', html);
}

/* ------------------------------------------------------------------ *
 *  ROOMS
 * ------------------------------------------------------------------ */
const RATE_ROWS = ROOMS.concat([HALL]);

function buildRooms() {
  const cards = ROOMS.map(roomCard).join('');
  const rateRows = RATE_ROWS.map(
    (r) => `
\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t<td><strong>${r.slug ? `<a href="${r.slug === 'the-hall' ? 'events.html' : `room-${r.slug}.html`}">${r.name}</a>` : r.name}</strong></td>
\t\t\t\t\t\t\t<td>${r.max} adults${r.slug === 'the-hall' ? ' (event guests)' : ''}</td>
\t\t\t\t\t\t\t<td>${r.bed}</td>
\t\t\t\t\t\t\t<td class="text-right">${money(r.from)}</td>
\t\t\t\t\t\t</tr>`
  ).join('');

  const roomPhotos = [
    { img: IMG('room-standard-2'), alt: 'Standard Room bed and desk', cap: 'Standard Room' },
    { img: IMG('room-classic-3'), alt: 'Classic Room with a television', cap: 'Classic Room' },
    { img: IMG('suite-living-1'), alt: 'Suite sitting area with leather sofas', cap: 'Suite sitting area' }
  ]
    .map((p) => galleryTile(p))
    .join('');

  const html = `${head({
    title: 'Rooms & suites from ₦32,000',
    description:
      'Standard and Classic rooms, two suite categories and a two-bedroom apartment with a kitchen at Grand Tokyu Hotel, Port Harcourt — published starting rates from ₦32,000 per night.',
    active: 'rooms',
    file: 'rooms.html',
    image: IMG('room-classic-1'),
    jsonLd: [
      breadcrumbLd([
        { label: 'Home', href: 'index.html' },
        { label: 'Rooms', href: 'rooms.html' }
      ])
    ]
  })}

\t<main id="main">

${pageHero({
    image: IMG('room-classic-1'),
    imageAlt: 'Classic Room at Grand Tokyu Hotel',
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Rooms' }],
    title: 'Rooms &amp; suites',
    subtitle: 'Five categories on Aba Road — from ₦32,000 a night. Prices are the hotel’s published starting rates.'
  })}

\t<section class="ftco-section">
\t\t<div class="container">
\t\t\t<div class="row justify-content-center mb-5 pb-2">
\t\t\t\t<div class="col-md-9 heading-section text-center ftco-animate">
\t\t\t\t\t<span class="subheading">Unwind in style</span>
\t\t\t\t\t<h2 class="mb-4">Your private space</h2>
\t\t\t\t\t<p>Step into plush bedding, stylish décor, air conditioning and all the essentials for a relaxing
\t\t\t\t\t\tstay. From a cosy Standard Room for two to a ten-adult apartment with a living room and kitchen,
\t\t\t\t\t\tthere is something here for individuals, couples, families and groups.</p>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="row">
${cards}
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section bg-light" id="rates">
\t\t<div class="container">
\t\t\t<div class="row justify-content-center mb-4">
\t\t\t\t<div class="col-md-9 heading-section text-center ftco-animate">
\t\t\t\t\t<span class="subheading">Rates</span>
\t\t\t\t\t<h2 class="mb-3">Published starting rates</h2>
\t\t\t\t\t<p class="small mb-0">Naira, per night, room only unless stated otherwise. “Max adults” is the maximum
\t\t\t\t\t\tnumber of adults the hotel states for each category. Rates vary by season and availability —
\t\t\t\t\t\treservations confirm the final price.</p>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="row justify-content-center">
\t\t\t\t<div class="col-lg-10">
\t\t\t\t\t<div class="table-responsive rate-table ftco-animate">
\t\t\t\t\t\t<table class="table">
\t\t\t\t\t\t\t<caption class="sr-only">Published starting rates per room, per night, in Nigerian naira</caption>
\t\t\t\t\t\t\t<thead>
\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t<th scope="col">Room</th>
\t\t\t\t\t\t\t\t\t<th scope="col">Max adults</th>
\t\t\t\t\t\t\t\t\t<th scope="col">Beds</th>
\t\t\t\t\t\t\t\t\t<th scope="col" class="text-right">Book now from / night</th>
\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t</thead>
\t\t\t\t\t\t\t<tbody>
${rateRows}
\t\t\t\t\t\t\t</tbody>
\t\t\t\t\t\t</table>
\t\t\t\t\t</div>
\t\t\t\t\t<p class="small text-muted mt-3 mb-0">The Hall is an event space rather than a guest room and is
\t\t\t\t\t\tpriced for exclusive use — see <a href="events.html">Events</a>.</p>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section">
\t\t<div class="container">
\t\t\t<div class="row justify-content-between align-items-end mb-4">
\t\t\t\t<div class="col-md-8 ftco-animate">
\t\t\t\t\t<span class="subheading">In the rooms</span>
\t\t\t\t\t<h2 class="mb-2">Photographs, category by category</h2>
\t\t\t\t\t<p class="mb-0">Every picture on this site is the hotel’s own photography — the rooms you see are the
\t\t\t\t\t\trooms you book.</p>
\t\t\t\t</div>
\t\t\t\t<div class="col-md-3 text-md-right ftco-animate mb-3 mb-md-0">
\t\t\t\t\t<a href="gallery.html" class="btn btn-outline-dark rounded-pill px-4">Full gallery</a>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="gallery-grid gallery-grid-4">
${roomPhotos}
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section bg-light">
\t\t<div class="container">
\t\t\t<div class="row justify-content-center">
\t\t\t\t<div class="col-md-10">
\t\t\t\t\t<div class="row">
\t\t\t\t\t\t<div class="col-md-6 ftco-animate">
\t\t\t\t\t\t\t<h2 class="mb-4">In every room</h2>
\t\t\t\t\t\t\t<ul class="amenity-grid">
\t\t\t\t\t\t\t\t${SHARED_ROOM_FEATURES.map((f) => `<li><span class="icon-check"></span>${f}</li>`).join('')}
\t\t\t\t\t\t\t</ul>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="col-md-6 ftco-animate">
\t\t\t\t\t\t\t<h2 class="mb-4">Good to know</h2>
\t\t\t\t\t\t\t<ul class="info-list">
\t\t\t\t\t\t\t\t<li><span>Check-in</span>${SITE.checkinText}</li>
\t\t\t\t\t\t\t\t<li><span>Check-out</span>${SITE.checkoutText}</li>
\t\t\t\t\t\t\t\t<li><span>Payment</span>Naira, at the hotel or by transfer</li>
\t\t\t\t\t\t\t\t<li><span>Front desk</span>open 24 hours</li>
\t\t\t\t\t\t\t\t<li><span>Wi-Fi</span>free throughout the hotel</li>
\t\t\t\t\t\t\t\t<li><span>Parking</span>on site</li>
\t\t\t\t\t\t\t</ul>
\t\t\t\t\t\t\t<a href="booking.html" class="btn btn-primary rounded-pill px-4 mt-3">Request a room</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t</main>
${ctaBand()}
${footer()}`;

  writePage('rooms.html', html);

  /* ---- individual room pages ---- */
  ROOMS.forEach((room) => {
    const others = ROOMS.filter((r) => r.slug !== room.slug)
      .slice(0, 3)
      .map(roomCard)
      .join('');

    const gallerySlides = room.gallery
      .map(
        (g) => `
\t\t\t\t\t\t\t<div class="item">
\t\t\t\t\t\t\t\t<div class="room-img" style="background-image: url(${g.src});" role="img" aria-label="${g.alt}"></div>
\t\t\t\t\t\t\t</div>`
      )
      .join('');

    const photoStrip = room.gallery
      .slice(0, 4)
      .map((g, i) => galleryTile({ img: g.src, alt: g.alt, cap: `${room.name} — ${i === 0 ? 'the room' : 'detail ' + i}` }))
      .join('');

    const roomLd = {
      '@type': 'HotelRoom',
      '@id': abs(`room-${room.slug}.html#room`),
      name: room.name,
      description: room.intro,
      url: abs(`room-${room.slug}.html`),
      image: room.gallery.map((g) => abs(g.src)),
      occupancy: { '@type': 'QuantitativeValue', maxValue: room.max, unitText: 'adults' },
      bed: { '@type': 'BedDetails', typeOfBed: room.bed, numberOfBeds: 1 },
      amenityFeature: room.amenities.map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
      containedInPlace: { '@id': HOTEL_ID },
      offers: {
        '@type': 'Offer',
        price: room.from,
        priceCurrency: 'NGN',
        availability: 'https://schema.org/InStock',
        url: abs('booking.html'),
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: room.from,
          priceCurrency: 'NGN',
          unitCode: 'DAY',
          unitText: 'per night'
        }
      }
    };

    const page = `${head({
      title: `${room.name} from ${money(room.from)}`,
      description: `${room.name} at Grand Tokyu Hotel, Port Harcourt — ${room.sleeps}, ${room.bed}. From ${money(room.from)} per night. ${room.tagline}.`,
      active: 'rooms',
      file: `room-${room.slug}.html`,
      image: room.image,
      jsonLd: [
        roomLd,
        breadcrumbLd([
          { label: 'Home', href: 'index.html' },
          { label: 'Rooms', href: 'rooms.html' },
          { label: room.name, href: `room-${room.slug}.html` }
        ])
      ]
    })}

\t<main id="main">

${pageHero({
      image: room.image,
      imageAlt: room.alt,
      crumbs: [
        { label: 'Home', href: 'index.html' },
        { label: 'Rooms', href: 'rooms.html' },
        { label: room.name }
      ],
      title: room.name,
      subtitle: room.tagline
    })}

\t<section class="ftco-section">
\t\t<div class="container">
\t\t\t<div class="row justify-content-between">
\t\t\t\t<div class="col-lg-7 ftco-animate">
\t\t\t\t\t<div class="single-slider owl-carousel mb-4">
${gallerySlides}
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t<div class="col-lg-5 pl-lg-5 ftco-animate">
\t\t\t\t\t<span class="subheading">Book now from ${money(room.from)} per night</span>
\t\t\t\t\t<h2 class="mb-4">${room.name}</h2>
\t\t\t\t\t<p>${room.intro}</p>
\t\t\t\t\t<ul class="spec-list">
\t\t\t\t\t\t<li><span>Max adults</span>${room.max}</li>
\t\t\t\t\t\t<li><span>Sleeps</span>${room.sleeps}</li>
\t\t\t\t\t\t<li><span>Bed</span>${room.bed}</li>
\t\t\t\t\t\t<li><span>View</span>${room.view}</li>
\t\t\t\t\t\t<li><span>Rate</span>from ${money(room.from)} / night</li>
\t\t\t\t\t</ul>
\t\t\t\t\t<a href="booking.html?room=${room.slug}" class="btn btn-primary rounded-pill px-4 mt-2">Book this room</a>
\t\t\t\t\t<a href="https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
      'Hello Grand Tokyu Hotel, I would like to ask about the ' + room.name + '.'
    )}" target="_blank" rel="noopener" class="btn btn-outline-dark rounded-pill px-4 mt-2 ml-sm-2">WhatsApp</a>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section bg-light">
\t\t<div class="container">
\t\t\t<div class="row">
\t\t\t\t<div class="col-md-6 ftco-animate">
\t\t\t\t\t<h3 class="mb-4">Room amenities</h3>
\t\t\t\t\t<ul class="amenity-grid amenities-two">
\t\t\t\t\t\t${room.amenities.map((a) => `<li><span class="icon-check"></span>${a}</li>`).join('')}
\t\t\t\t\t</ul>
\t\t\t\t\t<h3 class="mb-3 mt-4">In every room</h3>
\t\t\t\t\t<ul class="amenity-grid amenities-two">
\t\t\t\t\t\t${SHARED_ROOM_FEATURES.map((a) => `<li><span class="icon-check"></span>${a}</li>`).join('')}
\t\t\t\t\t</ul>
\t\t\t\t</div>
\t\t\t\t<div class="col-md-6 ftco-animate pl-lg-5">
\t\t\t\t\t<h3 class="mb-4">Booking notes</h3>
\t\t\t\t\t<ul class="info-list">
\t\t\t\t\t\t<li><span>Check-in</span>${SITE.checkinText}</li>
\t\t\t\t\t\t<li><span>Check-out</span>${SITE.checkoutText}</li>
\t\t\t\t\t\t<li><span>Reservations</span>${SITE.phone}</li>
\t\t\t\t\t\t<li><span>Email</span><a href="mailto:${SITE.email}">${SITE.email}</a></li>
\t\t\t\t\t\t<li><span>Address</span>${SITE.address}</li>
\t\t\t\t\t</ul>
\t\t\t\t\t<div class="note-card mt-4">
\t\t\t\t\t\t<p class="mb-0"><strong>Please note:</strong> rates shown are the hotel’s published starting rates
\t\t\t\t\t\t\tand are not live availability. The reservations team will confirm your dates and the final price.</p>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section">
\t\t<div class="container">
\t\t\t<div class="row justify-content-between align-items-end mb-4">
\t\t\t\t<div class="col-md-7 heading-section ftco-animate">
\t\t\t\t\t<span class="subheading">Photographs</span>
\t\t\t\t\t<h2 class="mb-0">${room.name} in pictures</h2>
\t\t\t\t</div>
\t\t\t\t<div class="col-md-4 text-md-right ftco-animate mb-3 mb-md-0">
\t\t\t\t\t<a href="rooms.html#rates" class="btn btn-outline-dark rounded-pill px-4">All rates</a>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="gallery-grid gallery-grid-4">
${photoStrip}
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section pt-0">
\t\t<div class="container-fluid px-md-5">
\t\t\t<div class="row justify-content-between align-items-end mb-4">
\t\t\t\t<div class="col-md-7 heading-section ftco-animate">
\t\t\t\t\t<span class="subheading">Also available</span>
\t\t\t\t\t<h2 class="mb-0">Other rooms</h2>
\t\t\t\t</div>
\t\t\t\t<div class="col-md-4 text-md-right ftco-animate mb-3 mb-md-0">
\t\t\t\t\t<a href="rooms.html" class="btn btn-outline-dark rounded-pill px-4">All rooms</a>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="row">
${others}
\t\t\t</div>
\t\t</div>
\t</section>

\t</main>
${ctaBand()}
${footer()}`;

    writePage(`room-${room.slug}.html`, page);
  });
}

/* ------------------------------------------------------------------ *
 *  DINING
 * ------------------------------------------------------------------ */
function buildDining() {
  const venues = [
    {
      icon: 'ion-ios-restaurant',
      title: 'The Restaurant',
      text: 'Local and continental cooking from breakfast through dinner, served in an air-conditioned dining room or sent up to your room.'
    },
    {
      icon: 'ion-ios-wine',
      title: 'The Bar & Lounge',
      text: 'Backlit shelves, low seating and cold drinks — the hotel’s evening room, and the one guests linger in.'
    },
    {
      icon: 'ion-ios-water',
      title: 'The Poolside Terrace',
      text: 'Light snacks and drinks beside the courtyard pool — the easiest place to lose an afternoon.'
    }
  ];

  const venuesHtml = venues
    .map(
      (v) => `
\t\t\t\t\t<div class="col-md-4 d-flex ftco-animate">
\t\t\t\t\t\t<div class="venue-card w-100">
\t\t\t\t\t\t\t<span class="${v.icon} venue-icon"></span>
\t\t\t\t\t\t\t<h3>${v.title}</h3>
\t\t\t\t\t\t\t<p class="mb-0">${v.text}</p>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>`
    )
    .join('');

  const kitchenHtml = KITCHEN.map(kitchenCard).join('');

  const restaurantLd = {
    '@type': 'Restaurant',
    '@id': abs('restaurant.html#restaurant'),
    name: 'The Restaurant at Grand Tokyu Hotel',
    servesCuisine: ['Nigerian', 'Continental', 'West African'],
    url: abs('restaurant.html'),
    image: [abs(IMG('restaurant-dining')), abs(IMG('restaurant-tables')), abs(IMG('bar-shelves'))],
    telephone: '+2349160007896',
    priceRange: '₦₦',
    address: postalAddress(),
    containedInPlace: { '@id': HOTEL_ID },
    acceptsReservations: abs('booking.html'),
    hasMenu: abs('restaurant.html#kitchen')
  };

  const html = `${head({
    title: 'Restaurant, bar & poolside terrace',
    description:
      'Dining at Grand Tokyu Hotel, Port Harcourt: a restaurant serving Nigerian and continental dishes, a bar and lounge, and a poolside terrace. Room service for house guests.',
    active: 'dining',
    file: 'restaurant.html',
    image: IMG('restaurant-dining'),
    jsonLd: [
      restaurantLd,
      breadcrumbLd([
        { label: 'Home', href: 'index.html' },
        { label: 'Dining', href: 'restaurant.html' }
      ])
    ]
  })}

\t<main id="main">

${pageHero({
    image: IMG('restaurant-dining'),
    imageAlt: PHOTO.restaurant.alt,
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Dining' }],
    title: 'Dining',
    subtitle: 'Nigerian and continental cooking, a bar that stays up late and a poolside that is hard to leave.'
  })}

\t<section class="ftco-section">
\t\t<div class="container">
\t\t\t<div class="row align-items-center">
\t\t\t\t<div class="col-lg-6 ftco-animate">
\t\t\t\t\t<span class="subheading">The restaurant</span>
\t\t\t\t\t<h2 class="mb-4">Food that tastes like somebody thought about it</h2>
\t\t\t\t\t<p>Cooking here moves between the Nigerian classics you grew up with and the continental dishes you
\t\t\t\t\t\tcrave after a long flight — jollof and grilled fish one night, a rested fillet the next. The
\t\t\t\t\t\tkitchen keeps the menu generous, the portions honest and the seasoning confident.</p>
\t\t\t\t\t<p>Breakfast is served in the dining room, lunch runs into the afternoon, and dinner is available
\t\t\t\t\t\tlate. Room service brings the same food upstairs, so the only decision left is whether to dress
\t\t\t\t\t\tfor dinner.</p>
\t\t\t\t\t<ul class="tick-list">
\t\t\t\t\t\t<li><span class="icon-check"></span> Local Nigerian and continental dishes</li>
\t\t\t\t\t\t<li><span class="icon-check"></span> Breakfast, lunch and dinner</li>
\t\t\t\t\t\t<li><span class="icon-check"></span> Room service for house guests</li>
\t\t\t\t\t\t<li><span class="icon-check"></span> Private dining for small groups</li>
\t\t\t\t\t</ul>
\t\t\t\t\t<a href="booking.html" class="btn btn-primary rounded-pill px-4">Book a table</a>
\t\t\t\t</div>
\t\t\t\t<div class="col-lg-6 ftco-animate">
\t\t\t\t\t<div class="stacked-imgs">
\t\t\t\t\t\t<a href="${IMG('restaurant-dining')}" class="img-main image-popup" style="background-image:url(${IMG('restaurant-dining')});" aria-label="${PHOTO.restaurant.alt}"></a>
\t\t\t\t\t\t<a href="${IMG('restaurant-tables')}" class="img-small image-popup" style="background-image:url(${IMG('restaurant-tables')});" aria-label="${PHOTO.restaurantTables.alt}"></a>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section bg-light">
\t\t<div class="container">
\t\t\t<div class="row justify-content-center mb-5 pb-2">
\t\t\t\t<div class="col-md-8 heading-section text-center ftco-animate">
\t\t\t\t\t<span class="subheading">Where to sit</span>
\t\t\t\t\t<h2>Three places to eat and drink</h2>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="row">
${venuesHtml}
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section" id="kitchen">
\t\t<div class="container">
\t\t\t<div class="row justify-content-center mb-5 pb-2">
\t\t\t\t<div class="col-md-9 heading-section text-center ftco-animate">
\t\t\t\t\t<span class="subheading">From the kitchen</span>
\t\t\t\t\t<h2 class="mb-3">A taste of the menu</h2>
\t\t\t\t\t<p>The kitchen’s range in nine plates — grilled, peppered, comforting and sweet. The menu changes with
\t\t\t\t\t\tthe season and the market, so ask your server what is good today.</p>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="row">
${kitchenHtml}
\t\t\t</div>
\t\t\t<p class="small text-muted text-center mt-4 mb-0">Dishes are described rather than photographed. Please
\t\t\t\tconfirm the current menu, prices and any dietary requirements with the hotel.</p>
\t\t</div>
\t</section>

\t<section class="ftco-section bg-light">
\t\t<div class="container">
\t\t\t<div class="row justify-content-between align-items-end mb-4">
\t\t\t\t<div class="col-md-8 heading-section ftco-animate">
\t\t\t\t\t<span class="subheading">The bar &amp; lounge</span>
\t\t\t\t\t<h2 class="mb-2">Where the evening ends up</h2>
\t\t\t\t\t<p class="mb-0">A bar, a lounge and a corner table — the part of the hotel that keeps its own hours.</p>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="gallery-grid gallery-grid-4">
\t\t\t\t${galleryTile({ img: IMG('bar-shelves'), alt: PHOTO.bar.alt, cap: 'The bar' })}
\t\t\t\t${galleryTile({ img: IMG('bar-shelves-alt'), alt: PHOTO.barAlt.alt, cap: 'Behind the bar' })}
\t\t\t\t${galleryTile({ img: IMG('lounge-tv'), alt: PHOTO.lounge.alt, cap: 'The lounge' })}
\t\t\t\t${galleryTile({ img: IMG('lounge-sofas'), alt: PHOTO.loungeSofas.alt, cap: 'Lounge seating' })}
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section">
\t\t<div class="container">
\t\t\t<div class="row align-items-center">
\t\t\t\t<div class="col-lg-6 order-lg-last ftco-animate">
\t\t\t\t\t<div class="hours-card">
\t\t\t\t\t\t<h3 class="mb-4">Opening hours</h3>
\t\t\t\t\t\t<ul class="info-list">
\t\t\t\t\t\t\t<li><span>Restaurant</span>breakfast &middot; lunch &middot; dinner</li>
\t\t\t\t\t\t\t<li><span>Room service</span>for house guests during kitchen hours</li>
\t\t\t\t\t\t\t<li><span>Bar &amp; lounge</span>into the evening</li>
\t\t\t\t\t\t\t<li><span>Poolside terrace</span>daytime</li>
\t\t\t\t\t\t\t<li><span>Front desk</span>open 24 hours</li>
\t\t\t\t\t\t</ul>
\t\t\t\t\t\t<p class="small mb-0">Hours can shift around events and private bookings — call
\t\t\t\t\t\t\t<a href="${SITE.phoneHref}">${SITE.phone}</a> to check before you travel.</p>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t<div class="col-lg-6 ftco-animate">
\t\t\t\t\t<span class="subheading">Private dining</span>
\t\t\t\t\t<h2 class="mb-4">Birthdays, boardrooms and long lunches</h2>
\t\t\t\t\t<p>Small celebrations can be hosted in the restaurant, in the lounge or on the poolside terrace, and
\t\t\t\t\t\tlarger gatherings move to The Hall, which takes up to 200 guests with four standing air
\t\t\t\t\t\tconditioners and free Wi-Fi.</p>
\t\t\t\t\t<p>Tell the team the date, the number of guests and the mood you are after, and they will build the
\t\t\t\t\t\tmenu around it.</p>
\t\t\t\t\t<a href="events.html" class="btn btn-outline-dark rounded-pill px-4">Enquire about an event</a>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="highlight-band">
\t\t<div class="container text-center">
\t\t\t<span class="eyebrow">The hotel’s own standard</span>
\t\t\t<h2 class="mt-3 mb-3" style="color:#fff">A five-star Michelin experience</h2>
\t\t\t<p class="mb-0" style="color:rgba(255,255,255,.8);max-width:720px;margin:0 auto">A kitchen that cooks to
\t\t\t\torder, a room that feels finished and service that notices before you ask. Book a table on
\t\t\t\t<a href="${SITE.phoneHref}" style="color:var(--sky)">${SITE.phone}</a>.</p>
\t\t</div>
\t</section>

\t</main>
${ctaBand()}
${footer()}`;

  writePage('restaurant.html', html);
}

/* ------------------------------------------------------------------ *
 *  EVENTS
 * ------------------------------------------------------------------ */
function buildEvents() {
  const layouts = [
    ['Wedding reception', 'Up to 200 guests, round tables'],
    ['Conference / seminar', 'Theatre or boardroom style'],
    ['Corporate dinner', 'Round tables of ten'],
    ['Birthday / celebration', 'Flexible floor plan'],
    ['Training & workshops', 'Chairs and Wi-Fi included'],
    ['Exhibition / launch', 'Open-floor layout']
  ]
    .map(
      ([name, detail]) => `
\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t<td>${name}</td>
\t\t\t\t\t\t\t\t<td class="text-muted">${detail}</td>
\t\t\t\t\t\t\t</tr>`
    )
    .join('');

  const venueLd = {
    '@type': 'EventVenue',
    '@id': abs('events.html#hall'),
    name: 'The Hall at Grand Tokyu Hotel',
    description: HALL.intro,
    url: abs('events.html'),
    maximumAttendeeCapacity: HALL.max,
    image: HALL.gallery.map((g) => abs(g.src)),
    address: postalAddress(),
    telephone: '+2349160007896',
    containedInPlace: { '@id': HOTEL_ID },
    amenityFeature: HALL.amenities.map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true }))
  };

  const html = `${head({
    title: 'Events & The Hall — up to 200 guests',
    description:
      'The Hall at Grand Tokyu Hotel, Port Harcourt: up to 200 guests, four standing air conditioners, free chairs and free Wi-Fi, from ₦350,000. Weddings, conferences, dinners and launches.',
    active: 'events',
    file: 'events.html',
    image: IMG('restaurant-dining'),
    jsonLd: [
      venueLd,
      breadcrumbLd([
        { label: 'Home', href: 'index.html' },
        { label: 'Events', href: 'events.html' }
      ])
    ]
  })}

\t<main id="main">

${pageHero({
    image: IMG('lounge-wide'),
    imageAlt: PHOTO.loungeWide.alt,
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Events' }],
    title: 'Events',
    subtitle: 'One generous hall, a lounge, a poolside terrace — and a kitchen that can feed all of it.'
  })}

\t<section class="ftco-section">
\t\t<div class="container">
\t\t\t<div class="row align-items-center">
\t\t\t\t<div class="col-lg-6 ftco-animate">
\t\t\t\t\t<span class="subheading">The Hall</span>
\t\t\t\t\t<h2 class="mb-4">Room for the whole guest list</h2>
\t\t\t\t\t<p>Full-height, air-conditioned and deliberately flexible, The Hall is the hotel’s largest space. Four
\t\t\t\t\t\tstanding air conditioners keep it cool, chairs are included, and the Wi-Fi is free — so the only
\t\t\t\t\t\tthing you need to think about is the programme.</p>
\t\t\t\t\t<p>Weddings, conferences, seminars, board meetings, birthdays and launches have all found a home here.
\t\t\t\t\t\tThe hotel’s kitchen caters from the same building, which means hot food arrives hot.</p>
\t\t\t\t\t<ul class="spec-list spec-list-lg">
\t\t\t\t\t\t<li><span>Max guests</span>${HALL.max} adults</li>
\t\t\t\t\t\t<li><span>Rate</span>from ${money(HALL.from)} per night</li>
\t\t\t\t\t\t<li><span>Included</span>4 standing A/Cs, free chairs, free Wi-Fi</li>
\t\t\t\t\t\t<li><span>Catering</span>available from the hotel kitchen</li>
\t\t\t\t\t</ul>
\t\t\t\t\t<a href="#enquiry" class="btn btn-primary rounded-pill px-4">Check your date</a>
\t\t\t\t</div>
\t\t\t\t<div class="col-lg-6 ftco-animate">
\t\t\t\t\t<div class="stacked-imgs">
\t\t\t\t\t\t<a href="${IMG('restaurant-dining')}" class="img-main image-popup" style="background-image:url(${IMG('restaurant-dining')});" aria-label="${HALL.alt}"></a>
\t\t\t\t\t\t<a href="${IMG('courtyard-terrace')}" class="img-small image-popup" style="background-image:url(${IMG('courtyard-terrace')});" aria-label="${PHOTO.courtyard.alt}"></a>
\t\t\t\t\t</div>
\t\t\t\t\t<p class="photo-note mt-2 mb-0">The hotel’s function space, set for dining — layouts are arranged to
\t\t\t\t\t\tyour programme.</p>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section bg-light">
\t\t<div class="container">
\t\t\t<div class="row">
\t\t\t\t<div class="col-lg-7 ftco-animate">
\t\t\t\t\t<h2 class="mb-4">Ways to use the space</h2>
\t\t\t\t\t<div class="table-responsive rate-table">
\t\t\t\t\t\t<table class="table">
\t\t\t\t\t\t\t<caption class="sr-only">Event layouts at The Hall, Grand Tokyu Hotel</caption>
\t\t\t\t\t\t\t<thead>
\t\t\t\t\t\t\t\t<tr><th scope="col">Occasion</th><th scope="col">Layout</th></tr>
\t\t\t\t\t\t\t</thead>
\t\t\t\t\t\t\t<tbody>
${layouts}
\t\t\t\t\t\t\t</tbody>
\t\t\t\t\t\t</table>
\t\t\t\t\t</div>
\t\t\t\t\t<p class="small text-muted">The hotel lists capacity for 200 guests on its accommodation page and a
\t\t\t\t\t\t100-guest layout on its rooms page — send your guest count and the team will confirm the right
\t\t\t\t\t\tarrangement.</p>
\t\t\t\t</div>
\t\t\t\t<div class="col-lg-5 ftco-animate">
\t\t\t\t\t<h3 class="mb-4">What is included</h3>
\t\t\t\t\t<ul class="amenity-grid">
\t\t\t\t\t\t${HALL.amenities.map((a) => `<li><span class="icon-check"></span>${a}</li>`).join('')}
\t\t\t\t\t</ul>
\t\t\t\t\t<div class="note-card mt-4">
\t\t\t\t\t\t<p class="mb-0"><strong>Also worth knowing:</strong> the lounge, restaurant and poolside terrace can
\t\t\t\t\t\t\tbe reserved for smaller gatherings, and guest rooms can be blocked for out-of-town attendees.</p>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section">
\t\t<div class="container-fluid px-md-5">
\t\t\t<div class="row justify-content-between align-items-end mb-4">
\t\t\t\t<div class="col-md-8 heading-section ftco-animate">
\t\t\t\t\t<span class="subheading">The spaces</span>
\t\t\t\t\t<h2 class="mb-0">Where your guests will be</h2>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="gallery-grid gallery-grid-4">
\t\t\t\t${HALL.gallery.map((g) => galleryTile({ img: g.src, alt: g.alt, cap: 'Event space' })).join('')}
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section bg-light" id="enquiry">
\t\t<div class="container">
\t\t\t<div class="row justify-content-center">
\t\t\t\t<div class="col-lg-8">
\t\t\t\t\t<div class="heading-section text-center mb-4 ftco-animate">
\t\t\t\t\t\t<span class="subheading">Enquiries</span>
\t\t\t\t\t\t<h2>Tell us about your event</h2>
\t\t\t\t\t</div>
\t\t\t\t\t<form class="form-card" data-enquiry-form data-kind="Event enquiry">
\t\t\t\t\t\t<div class="row">
\t\t\t\t\t\t\t<div class="col-md-6 form-group">
\t\t\t\t\t\t\t\t<label for="ev-name">Your name</label>
\t\t\t\t\t\t\t\t<input type="text" id="ev-name" name="name" class="form-control" placeholder="Full name" required>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-md-6 form-group">
\t\t\t\t\t\t\t\t<label for="ev-phone">Phone / WhatsApp</label>
\t\t\t\t\t\t\t\t<input type="tel" id="ev-phone" name="phone" class="form-control" placeholder="+234 ..." required>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-md-6 form-group">
\t\t\t\t\t\t\t\t<label for="ev-email">Email</label>
\t\t\t\t\t\t\t\t<input type="email" id="ev-email" name="email" class="form-control" placeholder="you@example.com">
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-md-6 form-group">
\t\t\t\t\t\t\t\t<label for="ev-date">Event date</label>
\t\t\t\t\t\t\t\t<input type="date" id="ev-date" name="date" class="form-control">
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-md-6 form-group">
\t\t\t\t\t\t\t\t<label for="ev-type">Event type</label>
\t\t\t\t\t\t\t\t<select id="ev-type" name="type" class="form-control">
\t\t\t\t\t\t\t\t\t<option>Wedding reception</option>
\t\t\t\t\t\t\t\t\t<option>Conference / seminar</option>
\t\t\t\t\t\t\t\t\t<option>Corporate dinner</option>
\t\t\t\t\t\t\t\t\t<option>Birthday / celebration</option>
\t\t\t\t\t\t\t\t\t<option>Training / workshop</option>
\t\t\t\t\t\t\t\t\t<option>Other</option>
\t\t\t\t\t\t\t\t</select>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-md-6 form-group">
\t\t\t\t\t\t\t\t<label for="ev-guests">Guests</label>
\t\t\t\t\t\t\t\t<input type="number" id="ev-guests" name="guests" min="1" max="200" class="form-control" placeholder="e.g. 120">
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-12 form-group">
\t\t\t\t\t\t\t\t<label for="ev-notes">Anything else?</label>
\t\t\t\t\t\t\t\t<textarea id="ev-notes" name="notes" rows="4" class="form-control" placeholder="Layout, catering, AV, timing..."></textarea>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-12 form-group mb-0">
\t\t\t\t\t\t\t\t<button type="submit" class="btn btn-primary rounded-pill px-5 py-3" data-send="whatsapp">Send on WhatsApp</button>
\t\t\t\t\t\t\t\t<button type="submit" class="btn btn-outline-dark rounded-pill px-5 py-3 ml-sm-2" data-send="email">Send by email</button>
\t\t\t\t\t\t\t\t<p class="form-note small mt-3 mb-0">This opens WhatsApp or your email app with the details filled in — nothing is sent automatically.</p>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</form>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t</main>
${ctaBand()}
${footer()}`;

  writePage('events.html', html);
}

/* ------------------------------------------------------------------ *
 *  GALLERY
 * ------------------------------------------------------------------ */
function buildGallery() {
  const groups = ['Hotel', 'Rooms', 'Apartment & suites', 'Pool & courtyard', 'Dining & bar', 'Events'];
  const filters = groups
    .map(
      (g) =>
        `<button class="filter-btn" data-filter="${g.replace(/&/g, '&amp;')}" aria-pressed="false">${g.replace(/&/g, '&amp;')}</button>`
    )
    .join('');

  const tiles = GALLERY.map((item) => galleryTile(item, ' gallery-item-filterable')).join('');
  const imageLd = [
    {
      '@type': 'ImageGallery',
      '@id': abs('gallery.html#gallery'),
      name: 'Grand Tokyu Hotel photo gallery',
      about: { '@id': HOTEL_ID },
      image: GALLERY.slice(0, 20).map((g) => ({
        '@type': 'ImageObject',
        contentUrl: abs(g.img),
        caption: g.cap,
        creditText: SITE.name
      }))
    }
  ];

  const html = `${head({
    title: 'Photo gallery',
    description:
      'Photographs of Grand Tokyu Hotel, Port Harcourt: the entrance, reception, lounge, bar, restaurant, courtyard pool, guest rooms, suites, the apartment and event spaces.',
    active: 'gallery',
    file: 'gallery.html',
    image: IMG('pool-courtyard'),
    jsonLd: imageLd.concat([
      breadcrumbLd([
        { label: 'Home', href: 'index.html' },
        { label: 'Gallery', href: 'gallery.html' }
      ])
    ])
  })}

\t<main id="main">

${pageHero({
    image: IMG('reception-staff'),
    imageAlt: 'Front-desk staff at Grand Tokyu Hotel',
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Gallery' }],
    title: 'Gallery',
    subtitle: 'The hotel, room by room and corner by corner — all photography is the hotel’s own.'
  })}

\t<section class="ftco-section">
\t\t<div class="container-fluid px-md-5">
\t\t\t<div class="row justify-content-center mb-4">
\t\t\t\t<div class="col-lg-9 text-center">
\t\t\t\t\t<div class="filter-bar" role="group" aria-label="Filter photographs">
\t\t\t\t\t\t<button class="filter-btn is-active" data-filter="all" aria-pressed="true">Everything</button>
\t\t\t\t\t\t${filters}
\t\t\t\t\t</div>
\t\t\t\t\t<p class="small text-muted mt-3 mb-0">${GALLERY.length} photographs. Click any image to open it full
\t\t\t\t\t\tsize with its caption.</p>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="gallery-grid gallery-grid-4" id="gallery-grid">
${tiles}
\t\t\t</div>
\t\t\t<p class="small text-muted text-center mt-4 mb-0">Follow <a href="${SITE.instagram}" target="_blank" rel="noopener">${SITE.instagramHandle}</a>
\t\t\t\ton Instagram for new photography and events.</p>
\t\t</div>
\t</section>

\t</main>
${ctaBand()}
${footer()}`;

  writePage('gallery.html', html);
}

/* ------------------------------------------------------------------ *
 *  ABOUT
 * ------------------------------------------------------------------ */
function buildAbout() {
  const values = [
    { icon: 'flaticon-reception-bell', title: 'Friendly & relaxed', text: 'Warm hospitality without the performance — staff who remember your name and your coffee.' },
    { icon: 'ion-ios-bed', title: 'Comfort meets function', text: 'Flat-screen televisions, air conditioning, high-speed Wi-Fi and beds worth staying in.' },
    { icon: 'ion-ios-star', title: 'Detail, quietly done', text: 'Hot water showers, premium toiletries, soft linen and daily housekeeping.' },
    { icon: 'ion-ios-location', title: 'Genuinely central', text: 'On Aba Road — five minutes from GRA Junction, ten from Mile 1 Park.' }
  ];

  const valuesHtml = values
    .map(
      (v) => `
\t\t\t\t\t<div class="col-md-6 col-lg-3 d-flex ftco-animate">
\t\t\t\t\t\t<div class="value-card w-100">
\t\t\t\t\t\t\t<span class="${v.icon} value-icon"></span>
\t\t\t\t\t\t\t<h3>${v.title}</h3>
\t\t\t\t\t\t\t<p class="mb-0">${v.text}</p>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>`
    )
    .join('');

  const facts = [
    ['Address', `${SITE.address} (${SITE.postal})`],
    ['Reservations', `${SITE.phone} &middot; ${SITE.phone2}`],
    ['Email', SITE.email],
    ['Instagram', `<a href="${SITE.instagram}" target="_blank" rel="noopener">${SITE.instagramHandle}</a>`],
    ['Check-in', SITE.checkinText],
    ['Check-out', SITE.checkoutText],
    ['Room categories', 'Standard, Classic, Standard Suite, Classic Suite, Apartment'],
    ['Max adults per room', '2 · 3 · 4 · 5 · 10'],
    ['Starting rate', money(ROOMS[0].from) + ' per night'],
    ['Event space', `The Hall — up to ${HALL.max} guests, from ${money(HALL.from)}`],
    ['Dining', 'Restaurant, bar &amp; lounge, poolside terrace'],
    ['Wi-Fi', 'Free throughout the hotel'],
    ['Parking', 'On site'],
    ['Front desk', 'Open 24 hours']
  ];

  const factRows = facts
    .map(
      ([k, v]) => `
\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t<th scope="row">${k}</th>
\t\t\t\t\t\t\t\t<td>${v}</td>
\t\t\t\t\t\t\t</tr>`
    )
    .join('');

  const faqHtml = FAQS.map(
    (f, i) => `
\t\t\t\t<div class="faq-item">
\t\t\t\t\t<button class="faq-question" type="button" data-toggle="collapse" data-target="#faq-${i}" aria-expanded="${i === 0 ? 'true' : 'false'}" aria-controls="faq-${i}">
\t\t\t\t\t\t<span>${f.q}</span><span class="icon-chevron-down"></span>
\t\t\t\t\t</button>
\t\t\t\t\t<div id="faq-${i}" class="collapse${i === 0 ? ' show' : ''}">
\t\t\t\t\t\t<div class="faq-answer"><p class="mb-0">${f.a}</p></div>
\t\t\t\t\t</div>
\t\t\t\t</div>`
  ).join('');

  const previewItems = [
    { img: IMG('exterior-sign'), alt: PHOTO.exterior.alt, cap: 'The hotel on Aba Road' },
    { img: IMG('reception-desk'), alt: PHOTO.reception.alt, cap: 'Reception' },
    { img: IMG('room-classic-1'), alt: 'Classic Room', cap: 'Classic Room' },
    { img: IMG('pool-courtyard'), alt: PHOTO.pool.alt, cap: 'The courtyard pool' }
  ]
    .map((p) => galleryTile(p))
    .join('');

  const aboutLd = {
    '@type': 'AboutPage',
    '@id': abs('about.html#page'),
    name: `About ${SITE.name}`,
    url: abs('about.html'),
    mainEntity: { '@id': HOTEL_ID },
    primaryImageOfPage: { '@type': 'ImageObject', contentUrl: abs(IMG('exterior-sign')) }
  };

  const faqLd = {
    '@type': 'FAQPage',
    '@id': abs('about.html#faqs'),
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };

  const html = `${head({
    title: 'About the hotel',
    description:
      'Grand Tokyu Hotel is a Port Harcourt hotel on Aba Road — five room categories sleeping 2 to 10 adults, a courtyard pool, a restaurant and bar, The Hall for 200 guests and a 24-hour front desk.',
    active: 'about',
    file: 'about.html',
    image: IMG('exterior-forecourt'),
    jsonLd: [
      aboutLd,
      faqLd,
      breadcrumbLd([
        { label: 'Home', href: 'index.html' },
        { label: 'About', href: 'about.html' }
      ])
    ]
  })}

\t<main id="main">

${pageHero({
    image: IMG('exterior-forecourt'),
    imageAlt: PHOTO.forecourt.alt,
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'About us' }],
    title: 'About the hotel',
    subtitle: 'Hospitality meets heart on Aba Road.'
  })}

\t<section class="ftco-section">
\t\t<div class="container">
\t\t\t<div class="row align-items-center">
\t\t\t\t<div class="col-lg-6 ftco-animate">
\t\t\t\t\t<span class="subheading">Our story</span>
\t\t\t\t\t<h2 class="mb-4">A Port Harcourt address, done properly</h2>
\t\t\t\t\t<p>Grand Tokyu Hotel is a hotel for people who want the city within reach but the noise kept at the
\t\t\t\t\t\tdoor. It sits on Aba Road, one of Port Harcourt’s main arteries, close enough to GRA Junction and
\t\t\t\t\t\tMile 1 Park to make the day easy, and far enough from the traffic to make the evening quiet.</p>
\t\t\t\t\t<p>Inside, the hotel works the way a good hotel should. Reception sets the tone the moment you arrive.
\t\t\t\t\t\tThe rooms are furnished for real life — plush bedding, soft linen, spacious wardrobes, a proper
\t\t\t\t\t\tdesk, air conditioning and a flat-screen television. The bathrooms are sleek, with hot water,
\t\t\t\t\t\twarm lighting and premium toiletries.</p>
\t\t\t\t\t<p>Then there is the rest of it: a restaurant cooking Nigerian and continental food, a bar and lounge,
\t\t\t\t\t\ta courtyard pool for the slow hours, and a front desk that stays awake so you do not have to worry
\t\t\t\t\t\tabout the time.</p>
\t\t\t\t\t<a href="booking.html" class="btn btn-primary rounded-pill px-4">Reserve your room</a>
\t\t\t\t</div>
\t\t\t\t<div class="col-lg-6 ftco-animate">
\t\t\t\t\t<div class="stacked-imgs stacked-imgs-tall">
\t\t\t\t\t\t<a href="${IMG('reception-desk')}" class="img-main image-popup" style="background-image:url(${IMG('reception-desk')});" aria-label="${PHOTO.reception.alt}"></a>
\t\t\t\t\t\t<a href="${IMG('lounge-tv')}" class="img-small image-popup" style="background-image:url(${IMG('lounge-tv')});" aria-label="${PHOTO.lounge.alt}"></a>
\t\t\t\t\t</div>
\t\t\t\t\t<p class="photo-note mt-2">Reception and the lounge — photographs taken at the hotel.</p>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section bg-light">
\t\t<div class="container">
\t\t\t<div class="row justify-content-center mb-5 pb-2">
\t\t\t\t<div class="col-md-8 heading-section text-center ftco-animate">
\t\t\t\t\t<span class="subheading">What we care about</span>
\t\t\t\t\t<h2>Four things we get right</h2>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="row">
${valuesHtml}
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section" id="good-to-know">
\t\t<div class="container">
\t\t\t<div class="row">
\t\t\t\t<div class="col-lg-7 ftco-animate">
\t\t\t\t\t<span class="subheading">Good to know</span>
\t\t\t\t\t<h2 class="mb-4">The facts, in one place</h2>
\t\t\t\t\t<div class="table-responsive">
\t\t\t\t\t\t<table class="table facts-table">
\t\t\t\t\t\t\t<caption class="sr-only">Grand Tokyu Hotel key facts</caption>
\t\t\t\t\t\t\t<tbody>
${factRows}
\t\t\t\t\t\t\t</tbody>
\t\t\t\t\t\t</table>
\t\t\t\t\t</div>
\t\t\t\t\t<p class="small text-muted">Please confirm anything time-sensitive with reservations.</p>
\t\t\t\t</div>
\t\t\t\t<div class="col-lg-5 ftco-animate">
\t\t\t\t\t<span class="subheading">Getting here</span>
\t\t\t\t\t<h2 class="mb-4">Directions</h2>
\t\t\t\t\t<div class="map-frame mb-4">
\t\t\t\t\t\t<iframe src="${SITE.osm}" title="Map showing 273/274 Aba Road, Port Harcourt" loading="lazy"></iframe>
\t\t\t\t\t</div>
\t\t\t\t\t<ul class="info-list">
\t\t\t\t\t\t<li><span>By car</span>about 5 minutes from GRA Junction, 10 minutes from Mile 1 Park</li>
\t\t\t\t\t\t<li><span>Airport</span>Port Harcourt International is roughly 35 minutes by taxi</li>
\t\t\t\t\t\t<li><span>Parking</span>on site, for guests and visitors</li>
\t\t\t\t\t</ul>
\t\t\t\t\t<a href="${SITE.maps}" target="_blank" rel="noopener" class="btn btn-outline-dark rounded-pill px-4 mt-3">Open in Google Maps</a>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section bg-light">
\t\t<div class="container-fluid px-md-5">
\t\t\t<div class="row justify-content-between align-items-end mb-4">
\t\t\t\t<div class="col-md-7 heading-section ftco-animate">
\t\t\t\t\t<span class="subheading">Gallery</span>
\t\t\t\t\t<h2 class="mb-0">The hotel in pictures</h2>
\t\t\t\t</div>
\t\t\t\t<div class="col-md-4 text-md-right ftco-animate mb-3 mb-md-0">
\t\t\t\t\t<a href="gallery.html" class="btn btn-outline-dark rounded-pill px-4">Full gallery</a>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="gallery-grid gallery-grid-4">
${previewItems}
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section">
\t\t<div class="container">
\t\t\t<div class="row justify-content-center mb-4">
\t\t\t\t<div class="col-md-9 heading-section text-center ftco-animate">
\t\t\t\t\t<span class="subheading">Transparency</span>
\t\t\t\t\t<h2 class="mb-3">How this site is put together</h2>
\t\t\t\t\t<p class="small mb-0">Every fact here can be checked against the hotel directly, and every photograph
\t\t\t\t\t\twas supplied by the hotel.</p>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="row justify-content-center">
\t\t\t\t<div class="col-lg-10">
\t\t\t\t\t<div class="table-responsive ftco-animate">
\t\t\t\t\t\t<table class="table facts-table sources-table">
\t\t\t\t\t\t\t<caption class="sr-only">Sources for the information on this site</caption>
\t\t\t\t\t\t\t<thead>
\t\t\t\t\t\t\t\t<tr><th scope="col">Detail</th><th scope="col">Source</th></tr>
\t\t\t\t\t\t\t</thead>
\t\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t<td>Name, address, both reservation lines, email and Instagram</td>
\t\t\t\t\t\t\t\t\t<td>Provided by the hotel</td>
\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t<td>Room categories, maximum adults per room and published starting rates</td>
\t\t\t\t\t\t\t\t\t<td>Provided by the hotel (Standard ₦32,000 · Classic ₦40,000 · Standard Suite ₦48,000 · Classic Suite ₦68,000 · Apartment ₦240,000 · Hall ₦350,000)</td>
\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t<td>Photography</td>
\t\t\t\t\t\t\t\t\t<td>The hotel’s own photographs of the property on Aba Road</td>
\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t<td>Drive times (GRA Junction ~5 min, Mile 1 Park ~10 min, airport ~35 min)</td>
\t\t\t\t\t\t\t\t\t<td>Approximate, traffic dependent — ask the front desk for a pickup</td>
\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t<td>Hall capacity (200 guests, with a 100-guest layout listed for some set-ups)</td>
\t\t\t\t\t\t\t\t\t<td>Two published figures — the events team confirms your layout</td>
\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t</tbody>
\t\t\t\t\t\t</table>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>

\t\t\t<div class="row justify-content-center mt-4">
\t\t\t\t<div class="col-lg-10">
\t\t\t\t\t<div class="note-card note-card-wide ftco-animate">
\t\t\t\t\t\t<h3>Machines welcome</h3>
\t\t\t\t\t\t<p>This site publishes a plain-text summary for AI assistants and search engines at
\t\t\t\t\t\t\t<a href="llms.txt">/llms.txt</a>, a machine-readable fact sheet at
\t\t\t\t\t\t\t<a href="hotel-data.json">/hotel-data.json</a>, and structured data (schema.org) on every page —
\t\t\t\t\t\t\thotel, rooms and rates, restaurant, event venue, FAQs and breadcrumbs. Quoting the hotel?
\t\t\t\t\t\t\tUse the address and phone numbers above; they are the canonical ones.</p>
\t\t\t\t\t\t<p class="mb-0">Rates and availability are not live. To confirm anything, contact the hotel
\t\t\t\t\t\t\tdirectly on <a href="${SITE.phoneHref}">${SITE.phone}</a> or
\t\t\t\t\t\t\t<a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section bg-light" id="faqs">
\t\t<div class="container">
\t\t\t<div class="row justify-content-center mb-4">
\t\t\t\t<div class="col-md-8 heading-section text-center ftco-animate">
\t\t\t\t\t<span class="subheading">FAQs</span>
\t\t\t\t\t<h2>Questions guests ask</h2>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="row justify-content-center">
\t\t\t\t<div class="col-lg-9">
${faqHtml}
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t</main>
${ctaBand()}
${footer()}`;

  writePage('about.html', html);
}

/* ------------------------------------------------------------------ *
 *  BOOKING
 * ------------------------------------------------------------------ */
function buildBooking() {
  const rateRows = ROOMS.map(
    (r) => `
\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t<td><strong>${r.name}</strong></td>
\t\t\t\t\t\t\t\t<td>${r.max} adults</td>
\t\t\t\t\t\t\t\t<td class="text-right">${money(r.from)}</td>
\t\t\t\t\t\t\t</tr>`
  ).join('');

  const html = `${head({
    title: 'Book a room',
    description:
      'Request a room at Grand Tokyu Hotel, 273/274 Aba Road, Port Harcourt. Send your dates to the front desk by WhatsApp or email, or call +234 091 6000 7896 or +234 091 6000 7897.',
    active: '',
    file: 'booking.html',
    image: IMG('room-deluxe-1'),
    jsonLd: [
      {
        '@type': 'WebPage',
        '@id': abs('booking.html#page'),
        name: 'Book a room at Grand Tokyu Hotel',
        url: abs('booking.html'),
        potentialAction: {
          '@type': 'ReserveAction',
          target: abs('booking.html'),
          result: { '@type': 'LodgingReservation', name: 'Room reservation request' }
        }
      },
      breadcrumbLd([
        { label: 'Home', href: 'index.html' },
        { label: 'Book a room', href: 'booking.html' }
      ])
    ]
  })}

\t<main id="main">

${pageHero({
    image: IMG('room-deluxe-1'),
    imageAlt: 'Classic Suite Room at Grand Tokyu Hotel',
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Book a room' }],
    title: 'Book your stay',
    subtitle: 'Tell us your dates — the front desk replies personally, day or night.'
  })}

\t<section class="ftco-section">
\t\t<div class="container">
\t\t\t<div class="row">
\t\t\t\t<div class="col-lg-7 ftco-animate">
\t\t\t\t\t<span class="subheading">Reservation request</span>
\t\t\t\t\t<h2 class="mb-4">Your dates, our desk</h2>
\t\t\t\t\t<form class="form-card" data-enquiry-form data-kind="Booking request">
\t\t\t\t\t\t<div class="row">
\t\t\t\t\t\t\t<div class="col-md-6 form-group">
\t\t\t\t\t\t\t\t<label for="bk-name">Full name</label>
\t\t\t\t\t\t\t\t<input type="text" id="bk-name" name="name" class="form-control" placeholder="Full name" required>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-md-6 form-group">
\t\t\t\t\t\t\t\t<label for="bk-phone">Phone / WhatsApp</label>
\t\t\t\t\t\t\t\t<input type="tel" id="bk-phone" name="phone" class="form-control" placeholder="+234 ..." required>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-md-6 form-group">
\t\t\t\t\t\t\t\t<label for="bk-email">Email</label>
\t\t\t\t\t\t\t\t<input type="email" id="bk-email" name="email" class="form-control" placeholder="you@example.com">
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-md-6 form-group">
\t\t\t\t\t\t\t\t<label for="booking-room">Room</label>
\t\t\t\t\t\t\t\t<select name="room" class="form-control" id="booking-room">
\t\t\t\t\t\t\t\t\t${ROOMS.map((r) => `<option value="${r.name}">${r.name} — from ${money(r.from)} (max ${r.max})</option>`).join('\n\t\t\t\t\t\t\t\t\t')}
\t\t\t\t\t\t\t\t</select>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-md-6 form-group">
\t\t\t\t\t\t\t\t<label for="bk-in">Check in</label>
\t\t\t\t\t\t\t\t<input type="date" id="bk-in" name="checkin" class="form-control">
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-md-6 form-group">
\t\t\t\t\t\t\t\t<label for="bk-out">Check out</label>
\t\t\t\t\t\t\t\t<input type="date" id="bk-out" name="checkout" class="form-control">
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-md-6 form-group">
\t\t\t\t\t\t\t\t<label for="bk-adults">Adults</label>
\t\t\t\t\t\t\t\t<select id="bk-adults" name="adults" class="form-control">
\t\t\t\t\t\t\t\t\t<option>1</option><option selected>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7+</option>
\t\t\t\t\t\t\t\t</select>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-md-6 form-group">
\t\t\t\t\t\t\t\t<label for="bk-children">Children</label>
\t\t\t\t\t\t\t\t<select id="bk-children" name="children" class="form-control">
\t\t\t\t\t\t\t\t\t<option selected>0</option><option>1</option><option>2</option><option>3</option><option>4+</option>
\t\t\t\t\t\t\t\t</select>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-12 form-group">
\t\t\t\t\t\t\t\t<label for="bk-notes">Anything we should know?</label>
\t\t\t\t\t\t\t\t<textarea id="bk-notes" name="notes" rows="4" class="form-control" placeholder="Airport pickup, late arrival, dietary needs, cot..."></textarea>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-12 form-group mb-0">
\t\t\t\t\t\t\t\t<button type="submit" class="btn btn-primary rounded-pill px-5 py-3" data-send="whatsapp">Send on WhatsApp</button>
\t\t\t\t\t\t\t\t<button type="submit" class="btn btn-outline-dark rounded-pill px-5 py-3 ml-sm-2" data-send="email">Send by email</button>
\t\t\t\t\t\t\t\t<p class="form-note small mt-3 mb-0">This opens WhatsApp or your email app with your request filled
\t\t\t\t\t\t\t\t\tin. Nothing is sent automatically, and no payment is taken here.</p>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</form>
\t\t\t\t</div>
\t\t\t\t<div class="col-lg-5 ftco-animate pl-lg-5">
\t\t\t\t\t<div class="contact-card mb-4">
\t\t\t\t\t\t<h3 class="mb-3">Reservations desk</h3>
\t\t\t\t\t\t<ul class="block-23">
\t\t\t\t\t\t\t<li><span class="icon icon-phone"></span><a href="${SITE.phoneHref}">${SITE.phone}</a></li>
\t\t\t\t\t\t\t<li><span class="icon icon-phone"></span><a href="${SITE.phone2Href}">${SITE.phone2}</a></li>
\t\t\t\t\t\t\t<li><span class="icon icon-envelope"></span><a href="mailto:${SITE.email}">${SITE.email}</a></li>
\t\t\t\t\t\t\t<li><span class="icon icon-map-marker"></span><span>${SITE.address}</span></li>
\t\t\t\t\t\t</ul>
\t\t\t\t\t\t<a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener" class="btn btn-dark rounded-pill px-4 mt-2">Message on WhatsApp</a>
\t\t\t\t\t</div>
\t\t\t\t\t<div class="note-card">
\t\t\t\t\t\t<h3 class="mb-3">Before you book</h3>
\t\t\t\t\t\t<ul class="info-list info-list-tight">
\t\t\t\t\t\t\t<li><span>Check-in</span>${SITE.checkinText}</li>
\t\t\t\t\t\t\t<li><span>Check-out</span>${SITE.checkoutText}</li>
\t\t\t\t\t\t\t<li><span>Rates</span>naira, per night</li>
\t\t\t\t\t\t\t<li><span>Payment</span>at the hotel or by transfer</li>
\t\t\t\t\t\t\t<li><span>Rates shown</span>starting prices, not live availability</li>
\t\t\t\t\t\t</ul>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section bg-light" id="rates">
\t\t<div class="container">
\t\t\t<div class="row justify-content-center mb-4">
\t\t\t\t<div class="col-md-9 heading-section text-center ftco-animate">
\t\t\t\t\t<span class="subheading">Rates</span>
\t\t\t\t\t<h2 class="mb-3">Starting rates per night</h2>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="row justify-content-center">
\t\t\t\t<div class="col-lg-8">
\t\t\t\t\t<div class="table-responsive rate-table ftco-animate">
\t\t\t\t\t\t<table class="table">
\t\t\t\t\t\t\t<caption class="sr-only">Published starting rates per night</caption>
\t\t\t\t\t\t\t<thead>
\t\t\t\t\t\t\t\t<tr><th scope="col">Room</th><th scope="col">Max adults</th><th scope="col" class="text-right">Book now from</th></tr>
\t\t\t\t\t\t\t</thead>
\t\t\t\t\t\t\t<tbody>
${rateRows}
\t\t\t\t\t\t\t</tbody>
\t\t\t\t\t\t</table>
\t\t\t\t\t</div>
\t\t\t\t\t<div class="row mt-4">
\t\t\t\t\t\t<div class="col-md-6 ftco-animate">
\t\t\t\t\t\t\t<h3 class="mb-3">Included with every stay</h3>
\t\t\t\t\t\t\t<ul class="amenity-grid amenities-two">
\t\t\t\t\t\t\t\t<li><span class="icon-check"></span>Free Wi-Fi</li>
\t\t\t\t\t\t\t\t<li><span class="icon-check"></span>Air conditioning</li>
\t\t\t\t\t\t\t\t<li><span class="icon-check"></span>Daily housekeeping</li>
\t\t\t\t\t\t\t\t<li><span class="icon-check"></span>Hot water showers</li>
\t\t\t\t\t\t\t\t<li><span class="icon-check"></span>Premium toiletries</li>
\t\t\t\t\t\t\t\t<li><span class="icon-check"></span>24/7 front desk</li>
\t\t\t\t\t\t\t\t<li><span class="icon-check"></span>Pool access</li>
\t\t\t\t\t\t\t\t<li><span class="icon-check"></span>On-site parking</li>
\t\t\t\t\t\t\t</ul>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="col-md-6 ftco-animate">
\t\t\t\t\t\t\t<h3 class="mb-3">Good to know</h3>
\t\t\t\t\t\t\t<p class="mb-2">The rates above are the hotel’s published starting rates. Weekends, holidays
\t\t\t\t\t\t\t\tand peak periods are usually higher, and the apartment and suites are best booked early.</p>
\t\t\t\t\t\t\t<p class="mb-0">Travelling with a group, or need the hall as well? The events team can hold
\t\t\t\t\t\t\t\trooms and event space together — see <a href="events.html">Events</a>.</p>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t</main>
${ctaBand()}
${footer()}`;

  writePage('booking.html', html);
}

/* ------------------------------------------------------------------ *
 *  CONTACT
 * ------------------------------------------------------------------ */
function buildContact() {
  const html = `${head({
    title: 'Contact, address & directions',
    description:
      'Contact Grand Tokyu Hotel: 273/274 Aba Road, Port Harcourt, Rivers State, Nigeria. Reservations +234 091 6000 7896 and +234 091 6000 7897, email grandtokyuhotel@gmail.com, Instagram @grandtokyu.',
    active: 'contact',
    file: 'contact.html',
    image: IMG('exterior-sign'),
    jsonLd: [
      {
        '@type': 'ContactPage',
        '@id': abs('contact.html#page'),
        name: 'Contact Grand Tokyu Hotel',
        url: abs('contact.html'),
        mainEntity: { '@id': HOTEL_ID }
      },
      breadcrumbLd([
        { label: 'Home', href: 'index.html' },
        { label: 'Contact', href: 'contact.html' }
      ])
    ]
  })}

\t<main id="main">

${pageHero({
    image: IMG('exterior-sign'),
    imageAlt: PHOTO.exterior.alt,
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Contact' }],
    title: 'Contact us',
    subtitle: 'In the heart of Port Harcourt — and easy to reach from anywhere in it.'
  })}

\t<section class="ftco-section">
\t\t<div class="container">
\t\t\t<div class="row mb-5">
\t\t\t\t<div class="col-md-4 d-flex ftco-animate">
\t\t\t\t\t<div class="contact-card w-100">
\t\t\t\t\t\t<span class="icon icon-map-marker contact-icon"></span>
\t\t\t\t\t\t<h2 class="h3">Visit</h2>
\t\t\t\t\t\t<address class="mb-2">273/274 Aba Road,<br>Port Harcourt, Rivers State,<br>Nigeria</address>
\t\t\t\t\t\t<p class="small mb-0">Postal code ${SITE.postal}</p>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t<div class="col-md-4 d-flex ftco-animate">
\t\t\t\t\t<div class="contact-card w-100">
\t\t\t\t\t\t<span class="icon icon-phone contact-icon"></span>
\t\t\t\t\t\t<h2 class="h3">Call</h2>
\t\t\t\t\t\t<p class="mb-1"><a href="${SITE.phoneHref}">${SITE.phone}</a></p>
\t\t\t\t\t\t<p class="mb-0"><a href="${SITE.phone2Href}">${SITE.phone2}</a></p>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t<div class="col-md-4 d-flex ftco-animate">
\t\t\t\t\t<div class="contact-card w-100">
\t\t\t\t\t\t<span class="icon icon-envelope contact-icon"></span>
\t\t\t\t\t\t<h2 class="h3">Write</h2>
\t\t\t\t\t\t<p class="mb-1"><a href="mailto:${SITE.email}">${SITE.email}</a></p>
\t\t\t\t\t\t<p class="mb-1"><a href="${SITE.instagram}" target="_blank" rel="noopener">${SITE.instagramHandle}</a></p>
\t\t\t\t\t\t<p class="small mb-0">The desk is staffed 24/7 — we answer every message.</p>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>

\t\t\t<div class="row align-items-center">
\t\t\t\t<div class="col-lg-6 ftco-animate">
\t\t\t\t\t<div class="map-frame map-frame-lg">
\t\t\t\t\t\t<iframe src="${SITE.osm}" title="Map showing 273/274 Aba Road, Port Harcourt" loading="lazy"></iframe>
\t\t\t\t\t</div>
\t\t\t\t\t<p class="small text-muted mt-2 mb-0">Map is approximate — Aba Road, Port Harcourt.
\t\t\t\t\t\t<a href="${SITE.maps}" target="_blank" rel="noopener">Open in Google Maps</a>.</p>
\t\t\t\t</div>
\t\t\t\t<div class="col-lg-6 ftco-animate pl-lg-5">
\t\t\t\t\t<span class="subheading">Getting here</span>
\t\t\t\t\t<h2 class="mb-4">Five minutes from GRA Junction</h2>
\t\t\t\t\t<p>By car, the hotel is about five minutes from GRA Junction and ten minutes from Mile 1 Park.
\t\t\t\t\t\tPort Harcourt International Airport is roughly 35 minutes away by taxi. Ask the front desk about
\t\t\t\t\t\tairport pick-up when you book — availability is confirmed with your reservation.</p>
\t\t\t\t\t<ul class="info-list">
\t\t\t\t\t\t<li><span>Address</span>${SITE.address}</li>
\t\t\t\t\t\t<li><span>Landmark</span>on Aba Road, near GRA Junction</li>
\t\t\t\t\t\t<li><span>Airport</span>Port Harcourt International — about 35 minutes</li>
\t\t\t\t\t\t<li><span>Parking</span>on site</li>
\t\t\t\t\t\t<li><span>Front desk</span>open 24 hours</li>
\t\t\t\t\t</ul>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section bg-light">
\t\t<div class="container">
\t\t\t<div class="row justify-content-center mb-5 pb-2">
\t\t\t\t<div class="col-md-8 heading-section text-center ftco-animate">
\t\t\t\t\t<span class="subheading">Around the hotel</span>
\t\t\t\t\t<h2>What is close by</h2>
\t\t\t\t\t<p>Distances are approximate and depend on traffic.</p>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="row">
\t\t\t\t<div class="col-md-6 col-lg-3 d-flex ftco-animate">
\t\t\t\t\t<div class="venue-card w-100">
\t\t\t\t\t\t<span class="icon-map-marker venue-icon"></span>
\t\t\t\t\t\t<h3>Pleasure Park</h3>
\t\t\t\t\t\t<p class="mb-1">5.5 km — gardens, water features and family time.</p>
\t\t\t\t\t\t<span class="dish-tag">Attraction</span>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t<div class="col-md-6 col-lg-3 d-flex ftco-animate">
\t\t\t\t\t<div class="venue-card w-100">
\t\t\t\t\t\t<span class="icon-glass venue-icon"></span>
\t\t\t\t\t\t<h3>Lounges nearby</h3>
\t\t\t\t\t\t<p class="mb-1">The Boss Lounge 2.8 km, SOK Lounge 2.9 km.</p>
\t\t\t\t\t\t<span class="dish-tag">Nightlife</span>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t<div class="col-md-6 col-lg-3 d-flex ftco-animate">
\t\t\t\t\t<div class="venue-card w-100">
\t\t\t\t\t\t<span class="icon-cutlery venue-icon"></span>
\t\t\t\t\t\t<h3>Restaurants</h3>
\t\t\t\t\t\t<p class="mb-1">AsiaTown, Casablanca Sports Bar &amp; Karaoke, Blue Elephant.</p>
\t\t\t\t\t\t<span class="dish-tag">Dining</span>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t<div class="col-md-6 col-lg-3 d-flex ftco-animate">
\t\t\t\t\t<div class="venue-card w-100">
\t\t\t\t\t\t<span class="icon-plane venue-icon"></span>
\t\t\t\t\t\t<h3>Airport</h3>
\t\t\t\t\t\t<p class="mb-1">Port Harcourt International — about 35 minutes by taxi.</p>
\t\t\t\t\t\t<span class="dish-tag">Travel</span>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section">
\t\t<div class="container">
\t\t\t<div class="row justify-content-center">
\t\t\t\t<div class="col-lg-8">
\t\t\t\t\t<div class="heading-section text-center mb-4 ftco-animate">
\t\t\t\t\t\t<span class="subheading">Say hello</span>
\t\t\t\t\t\t<h2>Do you have a wish or a question?</h2>
\t\t\t\t\t</div>
\t\t\t\t\t<form class="form-card" data-enquiry-form data-kind="Website enquiry">
\t\t\t\t\t\t<div class="row">
\t\t\t\t\t\t\t<div class="col-md-6 form-group">
\t\t\t\t\t\t\t\t<label for="ct-name">Your name</label>
\t\t\t\t\t\t\t\t<input type="text" id="ct-name" name="name" class="form-control" placeholder="Full name" required>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-md-6 form-group">
\t\t\t\t\t\t\t\t<label for="ct-email">Your email</label>
\t\t\t\t\t\t\t\t<input type="email" id="ct-email" name="email" class="form-control" placeholder="you@example.com" required>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-md-6 form-group">
\t\t\t\t\t\t\t\t<label for="ct-phone">Phone</label>
\t\t\t\t\t\t\t\t<input type="tel" id="ct-phone" name="phone" class="form-control" placeholder="+234 ...">
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-md-6 form-group">
\t\t\t\t\t\t\t\t<label for="ct-subject">Subject</label>
\t\t\t\t\t\t\t\t<input type="text" id="ct-subject" name="subject" class="form-control" placeholder="What is this about?">
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-12 form-group">
\t\t\t\t\t\t\t\t<label for="ct-notes">Message</label>
\t\t\t\t\t\t\t\t<textarea id="ct-notes" name="notes" rows="6" class="form-control" placeholder="How can we help?" required></textarea>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="col-12 form-group mb-0">
\t\t\t\t\t\t\t\t<button type="submit" class="btn btn-primary rounded-pill px-5 py-3" data-send="whatsapp">Send on WhatsApp</button>
\t\t\t\t\t\t\t\t<button type="submit" class="btn btn-outline-dark rounded-pill px-5 py-3 ml-sm-2" data-send="email">Send by email</button>
\t\t\t\t\t\t\t\t<p class="form-note small mt-3 mb-0">Your message opens in WhatsApp or your email app — you
\t\t\t\t\t\t\t\t\tcan review it before sending.</p>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</form>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t</main>
${ctaBand()}
${footer()}`;

  writePage('contact.html', html);
}

/* ------------------------------------------------------------------ *
 *  JOURNAL
 * ------------------------------------------------------------------ */
const ARTICLE_BODIES = {
  'journal-getting-here.html': `
\t\t\t\t\t\t<p class="lead">Port Harcourt is a city of bridges, traffic and very warm welcomes. The good news is
\t\t\t\t\t\t\tthat Grand Tokyu Hotel sits on one of its straightest roads, which makes arriving simpler than
\t\t\t\t\t\t\tmost first-time visitors expect.</p>
\t\t\t\t\t\t<p>The hotel is at <strong>273/274 Aba Road, Port Harcourt, Rivers State</strong>. If you are coming
\t\t\t\t\t\t\tfrom the city centre, you are roughly five minutes from GRA Junction and about ten minutes from
\t\t\t\t\t\t\tMile 1 Park — close enough that a taxi driver will know exactly where you mean.</p>

\t\t\t\t\t\t<h2>From the airport</h2>
\t\t\t\t\t\t<p>Port Harcourt International Airport is about 21 kilometres away, which usually works out to
\t\t\t\t\t\t\troughly 35 minutes by taxi depending on traffic. Sam Mbakwe International Cargo Airport, in
\t\t\t\t\t\t\tOwerri, is a much longer drive — around 70 kilometres, or close to two hours.</p>
\t\t\t\t\t\t<p>If you would rather not negotiate a fare at arrivals, call the front desk before you fly and ask
\t\t\t\t\t\t\tthem whether a pick-up can be arranged. Car hire is worth asking about at the same time —
\t\t\t\t\t\t\tavailability is confirmed with your reservation.</p>

\t\t\t\t\t\t<h2>What to look for</h2>
\t\t\t\t\t\t<p>The hotel is the dark-glass building set back behind a paved forecourt, with its signboard above
\t\t\t\t\t\t\tthe arched entrance. If your driver is unsure, the reservation desk will happily talk them
\t\t\t\t\t\t\tthrough the last turn on <a href="tel:+2349160007896">+234 091 6000 7896</a>.</p>

\t\t\t\t\t\t<h2>Parking and arrival</h2>
\t\t\t\t\t\t<p>There is on-site parking for guests and visitors. Reception is staffed 24 hours, so a late
\t\t\t\t\t\t\tarrival is fine — but tell the hotel your estimated time when you book, especially if you are
\t\t\t\t\t\t\tcoming in on the last flight.</p>

\t\t\t\t\t\t<div class="article-callout">
\t\t\t\t\t\t\t<h3>The short version</h3>
\t\t\t\t\t\t\t<p class="mb-0">Aba Road, 273/274. Five minutes from GRA Junction, ten from Mile 1 Park, about
\t\t\t\t\t\t\t\t35 minutes from the airport. Call ahead for a pick-up and you will not have to think about
\t\t\t\t\t\t\t\tany of it again.</p>
\t\t\t\t\t\t</div>`,
  'journal-day-in-port-harcourt.html': `
\t\t\t\t\t\t<p class="lead">You have a spare afternoon in Port Harcourt and no desire to spend it in traffic.
\t\t\t\t\t\t\tHere is a version of the day that stays close to Aba Road, leaves room for the pool, and ends
\t\t\t\t\t\t\twith a drink.</p>

\t\t\t\t\t\t<h2>Morning — slowly</h2>
\t\t\t\t\t\t<p>Start with breakfast at the restaurant: eggs, pastries, fruit, something hot and Nigerian if you
\t\t\t\t\t\t\twant it. Then take your coffee to the pool terrace and let the morning happen to you. Guests tend
\t\t\t\t\t\t\tto underestimate how long they will stay there.</p>

\t\t\t\t\t\t<h2>Early afternoon — Pleasure Park</h2>
\t\t\t\t\t\t<p>About 5.5 kilometres away, <strong>Pleasure Park</strong> is the city’s best-known family
\t\t\t\t\t\t\touting — gardens, water features and enough space for children to burn off a morning indoors.
\t\t\t\t\t\t\tIt is a straightforward taxi ride and an easy way to see a greener side of Port Harcourt.</p>

\t\t\t\t\t\t<h2>Later — the city</h2>
\t\t\t\t\t\t<p>If you would rather stay indoors, the lounges nearby are close: The Boss Lounge is around 2.8
\t\t\t\t\t\t\tkilometres away and SOK Lounge about 2.9 kilometres. For dinner there is plenty within reach,
\t\t\t\t\t\t\tincluding Casablanca Restaurant Sports Bar &amp; Karaoke, Blue Elephant and AsiaTown, all
\t\t\t\t\t\t\twithin a few kilometres of the hotel.</p>

\t\t\t\t\t\t<h2>Evening — back to the hotel</h2>
\t\t\t\t\t\t<p>Return for a drink in the bar and lounge: low light, a cold glass and a corner table. Stay for
\t\t\t\t\t\t\tdinner in the restaurant, or order room service and call it an early night.</p>

\t\t\t\t\t\t<div class="article-callout">
\t\t\t\t\t\t\t<h3>Worth knowing</h3>
\t\t\t\t\t\t\t<p class="mb-0">Distances are approximate and depend on traffic. Ask the front desk to arrange
\t\t\t\t\t\t\t\ta car — they will also tell you what is open that day, which is more useful than any
\t\t\t\t\t\t\t\tguidebook.</p>
\t\t\t\t\t\t</div>`,
  'journal-inside-your-room.html': `
\t\t\t\t\t\t<p class="lead">Every room at Grand Tokyu is built around the same idea: comfort should be
\t\t\t\t\t\t\teffortless. Here is exactly what that means, category by category, so you can book the room
\t\t\t\t\t\t\tthat matches the trip.</p>

\t\t\t\t\t\t<h2>Standard Room — ${money(ROOMS[0].from)}</h2>
\t\t\t\t\t\t<p>Sleeps ${ROOMS[0].max} adults, with a king bed and a 40-inch Samsung® LED television. Non-smoking,
\t\t\t\t\t\t\tfree Wi-Fi and a USB charging station beside the bed. The right choice for a solo business trip
\t\t\t\t\t\t\tor a couple’s weekend.</p>

\t\t\t\t\t\t<h2>Classic Room — ${money(ROOMS[1].from)}</h2>
\t\t\t\t\t\t<p>Sleeps ${ROOMS[1].max} adults and adds a proper work desk to the same 40-inch LED television, free
\t\t\t\t\t\t\tWi-Fi, non-smoking policy and USB charging. If you plan to answer email at midnight, take this one.</p>

\t\t\t\t\t\t<h2>Standard Suite Room — ${money(ROOMS[2].from)}</h2>
\t\t\t\t\t\t<p>Sleeps ${ROOMS[2].max} adults with a king bed, a sitting area and a city view — the hotel recommends
\t\t\t\t\t\t\tit for families, and the extra space is what makes that work.</p>

\t\t\t\t\t\t<h2>Classic Suite Room — ${money(ROOMS[3].from)}</h2>
\t\t\t\t\t\t<p>Sleeps ${ROOMS[3].max} adults with a king bed, a lounge, a mini bar, a work desk, a television, free
\t\t\t\t\t\t\tWi-Fi and USB charging. The signature suite, and the one to book for a celebration.</p>

\t\t\t\t\t\t<h2>The Apartment — ${money(ROOMS[4].from)}</h2>
\t\t\t\t\t\t<p>A different proposition entirely: two separate bedrooms, a furnished living room with a powerful
\t\t\t\t\t\t\tstanding air conditioner, a fully equipped kitchen with a modern refrigerator and a washing
\t\t\t\t\t\t\tmachine, and a 75-inch LED television. Sleeps up to ${ROOMS[4].max} adults. Ideal for a family or a
\t\t\t\t\t\t\tgroup staying long enough to want a home rather than a hotel room.</p>

\t\t\t\t\t\t<h2>In every room</h2>
\t\t\t\t\t\t<ul>
\t\t\t\t\t\t\t<li>Air conditioning and a flat-screen television</li>
\t\t\t\t\t\t\t<li>Free high-speed Wi-Fi throughout the hotel</li>
\t\t\t\t\t\t\t<li>Hot water showers, premium toiletries and warm lighting</li>
\t\t\t\t\t\t\t<li>Soft linen, spacious wardrobes and daily housekeeping</li>
\t\t\t\t\t\t\t<li>A 24-hour front desk and room service</li>
\t\t\t\t\t\t</ul>

\t\t\t\t\t\t<div class="article-callout">
\t\t\t\t\t\t\t<h3>Booking tip</h3>
\t\t\t\t\t\t\t<p class="mb-0">Rates shown are the hotel’s published starting prices. Call the reservations
\t\t\t\t\t\t\t\tdesk on <a href="tel:+2349160007896">+234 091 6000 7896</a> with your dates and they will
\t\t\t\t\t\t\t\tconfirm what is actually available.</p>
\t\t\t\t\t\t</div>`
};

function buildBlog() {
  const cards = POSTS.map(
    (p) => `
\t\t\t\t<div class="col-md-4 d-flex ftco-animate">
\t\t\t\t\t<article class="blog-entry align-self-stretch w-100">
\t\t\t\t\t\t<a href="${p.slug}" class="block-20 rounded" style="background-image: url(${p.img});" aria-label="${p.title}"></a>
\t\t\t\t\t\t<div class="text mt-3">
\t\t\t\t\t\t\t<div class="meta mb-2">${p.date} &middot; ${p.read}</div>
\t\t\t\t\t\t\t<h3 class="heading mb-2"><a href="${p.slug}">${p.title}</a></h3>
\t\t\t\t\t\t\t<p>${p.excerpt}</p>
\t\t\t\t\t\t\t<a href="${p.slug}" class="link-arrow">Read the note <span class="icon-long-arrow-right"></span></a>
\t\t\t\t\t\t</div>
\t\t\t\t\t</article>
\t\t\t\t</div>`
  ).join('');

  const html = `${head({
    title: 'Journal',
    description:
      'Practical notes for staying at Grand Tokyu Hotel, Port Harcourt: getting here from the airport, a day out nearby, and a guide to every room category.',
    active: '',
    file: 'blog.html',
    image: IMG('pool-courtyard'),
    jsonLd: [
      {
        '@type': 'Blog',
        '@id': abs('blog.html#blog'),
        name: 'The Grand Tokyu Journal',
        url: abs('blog.html'),
        publisher: { '@id': HOTEL_ID },
        blogPost: POSTS.map((p) => ({
          '@type': 'BlogPosting',
          headline: p.title,
          description: p.excerpt,
          url: abs(p.slug),
          image: abs(p.img),
          datePublished: '2026-02-01',
          author: { '@id': HOTEL_ID }
        }))
      },
      breadcrumbLd([
        { label: 'Home', href: 'index.html' },
        { label: 'Journal', href: 'blog.html' }
      ])
    ]
  })}

\t<main id="main">

${pageHero({
    image: IMG('lounge-tv'),
    imageAlt: PHOTO.lounge.alt,
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Journal' }],
    title: 'The Journal',
    subtitle: 'Practical notes for your stay — directions, days out, and what is in the room.'
  })}

\t<section class="ftco-section">
\t\t<div class="container">
\t\t\t<div class="row justify-content-center mb-5 pb-2">
\t\t\t\t<div class="col-md-8 heading-section text-center ftco-animate">
\t\t\t\t\t<span class="subheading">Notes from Aba Road</span>
\t\t\t\t\t<h2 class="mb-3">Three things worth reading before you arrive</h2>
\t\t\t\t\t<p>Short, useful guides written from the hotel’s own details — no filler, no listicles.</p>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="row">
${cards}
\t\t\t</div>
\t\t</div>
\t</section>

\t</main>
${ctaBand()}
${footer()}`;

  writePage('blog.html', html);

  POSTS.forEach((post) => {
    const body = ARTICLE_BODIES[post.slug] || '<p>' + post.excerpt + '</p>';
    const more = POSTS.filter((p) => p.slug !== post.slug)
      .map(
        (p) => `
\t\t\t\t<div class="col-md-6 d-flex ftco-animate">
\t\t\t\t\t<article class="blog-entry align-self-stretch w-100">
\t\t\t\t\t\t<a href="${p.slug}" class="block-20 rounded" style="background-image: url(${p.img});" aria-label="${p.title}"></a>
\t\t\t\t\t\t<div class="text mt-3">
\t\t\t\t\t\t\t<div class="meta mb-2">${p.date} &middot; ${p.read}</div>
\t\t\t\t\t\t\t<h3 class="heading mb-0"><a href="${p.slug}">${p.title}</a></h3>
\t\t\t\t\t\t</div>
\t\t\t\t\t</article>
\t\t\t\t</div>`
      )
      .join('');

    const page = `${head({
      title: post.title,
      description: post.excerpt,
      active: '',
      file: post.slug,
      image: post.img,
      jsonLd: [
        {
          '@type': 'BlogPosting',
          '@id': abs(post.slug + '#post'),
          headline: post.title,
          description: post.excerpt,
          image: abs(post.img),
          url: abs(post.slug),
          datePublished: '2026-02-01',
          author: { '@id': HOTEL_ID },
          publisher: { '@id': HOTEL_ID },
          isPartOf: { '@id': abs('blog.html#blog') }
        },
        breadcrumbLd([
          { label: 'Home', href: 'index.html' },
          { label: 'Journal', href: 'blog.html' },
          { label: post.title, href: post.slug }
        ])
      ]
    })}

\t<main id="main">

${pageHero({
      image: post.img,
      imageAlt: post.alt,
      crumbs: [
        { label: 'Home', href: 'index.html' },
        { label: 'Journal', href: 'blog.html' },
        { label: 'Note' }
      ],
      title: post.title,
      subtitle: `${post.date} &middot; ${post.read}`
    })}

\t<section class="ftco-section">
\t\t<div class="container">
\t\t\t<div class="row justify-content-center">
\t\t\t\t<div class="col-lg-8 article-body ftco-animate">
${body}
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="row justify-content-center mt-5">
\t\t\t\t<div class="col-lg-8">
\t\t\t\t\t<div class="article-footer d-flex flex-wrap align-items-center justify-content-between">
\t\t\t\t\t\t<div>
\t\t\t\t\t\t\t<span class="subheading">Ready when you are</span>
\t\t\t\t\t\t\t<p class="mb-0">Reservations: <a href="${SITE.phoneHref}">${SITE.phone}</a></p>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<a href="booking.html" class="btn btn-primary rounded-pill px-4">Book a room</a>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

\t<section class="ftco-section bg-light">
\t\t<div class="container">
\t\t\t<div class="row justify-content-between align-items-end mb-4">
\t\t\t\t<div class="col-md-7 heading-section ftco-animate">
\t\t\t\t\t<span class="subheading">Keep reading</span>
\t\t\t\t\t<h2 class="mb-0">More from the journal</h2>
\t\t\t\t</div>
\t\t\t\t<div class="col-md-4 text-md-right ftco-animate mb-3 mb-md-0">
\t\t\t\t\t<a href="blog.html" class="btn btn-outline-dark rounded-pill px-4">All notes</a>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="row">
${more}
\t\t\t</div>
\t\t</div>
\t</section>

\t</main>
${footer()}`;

    writePage(post.slug, page);
  });
}

/* ------------------------------------------------------------------ *
 *  MACHINE-READABLE FILES — llms.txt, hotel-data.json, sitemap, robots
 * ------------------------------------------------------------------ */
function buildMachineFiles() {
  const roomLines = ROOMS.map(
    (r) =>
      `- **${r.name}** — max ${r.max} adults, ${r.bed}, ${r.view.toLowerCase()}. Book now from ${money(
        r.from
      )} per night. Details: ${abs(`room-${r.slug}.html`)}`
  ).join('\n');

  const faqLines = FAQS.map((f) => `**${f.q}**\n${f.a}`).join('\n\n');

  const llms = `# ${SITE.name}

> ${SITE.name} is a hotel at ${SITE.address}. Five room categories (Standard Room for 2 adults, Classic
> Room for 3, Standard Suite Room for 4, Classic Suite Room for 5 and a two-bedroom Apartment for 10)
> offer published "book now from" rates of ${money(ROOMS[0].from)} to ${money(ROOMS[4].from)} per night.
> The hotel also has an outdoor courtyard pool, a restaurant serving Nigerian and continental food, a bar
> and lounge, free Wi-Fi throughout, free on-site parking, a 24-hour front desk, and The Hall — an event
> space for up to ${HALL.max} guests from ${money(HALL.from)} per night.

Key facts (canonical — cite these exactly):

- Name: ${SITE.name}
- Address: ${SITE.address} (postal code ${SITE.postal})
- Reservations: ${SITE.phone} and ${SITE.phone2}
- Email: ${SITE.email}
- Instagram: ${SITE.instagramHandle} (${SITE.instagram})
- Check-in / check-out: from ${SITE.checkin} / by ${SITE.checkout}, confirmed with each reservation
- Currency: Nigerian naira (NGN), rates per night
- Location: on Aba Road, about 5 minutes from GRA Junction and 10 minutes from Mile 1 Park; Port Harcourt
  International Airport about 35 minutes by taxi
- Amenities: outdoor pool, restaurant, bar and lounge, room service, free Wi-Fi, free parking,
  air conditioning, daily housekeeping, 24-hour front desk, event hall for ${HALL.max} guests
- The hotel describes itself as offering "a five-star Michelin experience"
- Rates are published starting prices, not live availability; the reservations desk confirms the final price

## Rooms and rates

${roomLines}
- **The Hall** — event space for up to ${HALL.max} guests (four standing air conditioners, free chairs, free
  Wi-Fi). Book now from ${money(HALL.from)} per night. Details: ${abs('events.html')}

## Pages

- [Home](${abs('index.html')}): overview, quick availability form, rooms, pool, dining, gallery, contact
- [Rooms and rates](${abs('rooms.html')}): all five categories with maximum adults, beds and starting rates
- [Dining](${abs('restaurant.html')}): restaurant, bar and lounge, poolside terrace, sample menu, hours
- [Events](${abs('events.html')}): The Hall — capacity, layouts, inclusions and an enquiry form
- [Gallery](${abs('gallery.html')}): the hotel's own photography, filterable by area
- [About](${abs('about.html')}): the hotel, key facts, directions, FAQs and sourcing notes
- [Booking](${abs('booking.html')}): reservation request form plus rate table
- [Contact](${abs('contact.html')}): address, phone numbers, email, map and what is nearby
- [Journal](${abs('blog.html')}): practical guides — getting here, a day out, inside your room

## Frequently asked questions

${faqLines}

## How to use this information

- You may quote the facts above when answering questions about ${SITE.name} in Port Harcourt.
- Always show prices as "from" prices in naira, per night, and note that they are not live availability.
- For bookings, direct people to ${SITE.phone} (or WhatsApp on https://wa.me/${SITE.whatsapp}) or
  ${SITE.email}.
- Machine-readable copies: ${abs('hotel-data.json')} (JSON) and schema.org JSON-LD on every page.
- Do not confuse this hotel with "Tokyu Grand Hotel" on Stadium Road, Port Harcourt, which is a different
  property.

## Contact

- Website: ${SITE.base}
- Phone: ${SITE.phone} / ${SITE.phone2}
- Email: ${SITE.email}
- Instagram: ${SITE.instagram}

Last updated: ${new Date().toISOString().slice(0, 10)}
`;

  const data = {
    name: SITE.name,
    url: SITE.base,
    description:
      'Hotel on Aba Road, Port Harcourt with five room categories, a courtyard pool, restaurant and bar, and an event hall for up to 200 guests.',
    address: {
      street: SITE.street,
      city: SITE.city,
      region: SITE.region,
      postalCode: SITE.postal,
      country: SITE.country,
      countryCode: SITE.countryCode
    },
    geo: SITE.geo,
    contact: {
      phone: SITE.phone,
      phoneAlt: SITE.phone2,
      whatsapp: `https://wa.me/${SITE.whatsapp}`,
      email: SITE.email,
      instagram: SITE.instagram,
      maps: SITE.maps
    },
    checkin: SITE.checkin,
    checkout: SITE.checkout,
    currency: 'NGN',
    priceNote: 'Published "book now from" starting rates per night; not live availability.',
    rooms: ROOMS.map((r) => ({
      name: r.name,
      slug: r.slug,
      url: abs(`room-${r.slug}.html`),
      maxAdults: r.max,
      bed: r.bed,
      view: r.view,
      rateFromPerNight: r.from,
      currency: 'NGN',
      amenities: r.amenities,
      images: r.gallery.map((g) => abs(g.src))
    })),
    eventSpace: {
      name: HALL.name,
      maxGuests: HALL.max,
      rateFromPerNight: HALL.from,
      currency: 'NGN',
      inclusions: HALL.amenities,
      url: abs('events.html')
    },
    amenities: [
      'Free Wi-Fi',
      'Outdoor swimming pool',
      'Restaurant (Nigerian and continental)',
      'Bar and lounge',
      'Room service',
      '24-hour front desk',
      'Air conditioning',
      'Free on-site parking',
      'Daily housekeeping',
      'Event hall for up to 200 guests'
    ],
    faqs: FAQS,
    pages: NAV.map((n) => ({ label: n.label, url: abs(n.href) })),
    photographs: GALLERY.map((g) => ({ url: abs(g.img), caption: g.cap, area: g.group, alt: g.alt })),
    llms: abs('llms.txt'),
    updated: new Date().toISOString().slice(0, 10)
  };

  writeFile('llms.txt', llms);
  writeFile('hotel-data.json', JSON.stringify(data, null, 2) + '\n');

  const manifest = {
    name: SITE.name,
    short_name: 'Grand Tokyu',
    description: 'Hotel on Aba Road, Port Harcourt — rooms, suites, apartment, pool, restaurant and events.',
    start_url: 'index.html',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#072a4e',
    icons: [
      { src: 'images/brand/logo-mark.png', sizes: '160x160', type: 'image/png', purpose: 'any' },
      { src: 'images/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  };
  writeFile('site.webmanifest', JSON.stringify(manifest, null, 2) + '\n');
}

/* ------------------------------------------------------------------ *
 *  BUILD
 * ------------------------------------------------------------------ */
console.log('Building Grand Tokyu Hotel site…');
buildHome();
buildRooms();
buildDining();
buildEvents();
buildGallery();
buildAbout();
buildBooking();
buildContact();
buildBlog();
buildMachineFiles();

/* sitemap + robots */
const pages = fs
  .readdirSync(ROOT)
  .filter((f) => f.endsWith('.html'))
  .sort((a, b) => (a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.localeCompare(b)));

const lastmod = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${abs(p)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p === 'index.html' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${p === 'index.html' ? '1.0' : p.startsWith('room-') || p === 'rooms.html' ? '0.9' : '0.7'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);

const robots = `# ${SITE.name} — ${SITE.address}
# All crawlers welcome, including AI assistants. A plain-text summary lives at /llms.txt
User-agent: *
Allow: /

# AI assistants and answer engines are explicitly welcome
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: CCBot
Allow: /
User-agent: Bingbot
Allow: /

Sitemap: ${abs('sitemap.xml')}
# Machine-readable summary: ${abs('llms.txt')}
# Structured data:       ${abs('hotel-data.json')}
`;
fs.writeFileSync(path.join(ROOT, 'robots.txt'), robots);
console.log('  ✓ sitemap.xml, robots.txt');

console.log('Done.');
