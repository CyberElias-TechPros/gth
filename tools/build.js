#!/usr/bin/env node
/**
 * Grand Tokyu Hotel — static site generator
 * -----------------------------------------
 * The site is built from the Colorlib "Harborlights" template.
 * Run `node tools/build.js` from the repository root to regenerate every
 * HTML page. Output is plain static HTML at the repo root (no server needed).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

/* ------------------------------------------------------------------ *
 *  Site-wide facts (compiled from the hotel's public information)
 * ------------------------------------------------------------------ */
const SITE = {
  name: 'Grand Tokyu Hotel',
  short: 'Grand Tokyu',
  tagline: 'Comfort, elegance and a sense of home on Aba Road',
  address: '273/274 Aba Road, Port Harcourt, Rivers State, Nigeria',
  addressShort: '273/274 Aba Road, Port Harcourt',
  postal: '500272',
  phone: '+234 091 6000 7896',
  phoneHref: 'tel:+2349160007896',
  phone2: '+234 091 6000 7897',
  phone2Href: 'tel:+2349160007897',
  email: 'grandtokyuhotel@gmail.com',
  whatsapp: '2349160007896',
  checkin: '12:00',
  checkout: '11:00',
  checkinText: 'from 12:00 — confirmed with your reservation',
  checkoutText: 'by 11:00 — confirmed with your reservation',
  maps: 'https://www.google.com/maps/search/?api=1&query=Grand+Tokyu+Hotel+273%2F274+Aba+Road+Port+Harcourt+Nigeria',
  osm: 'https://www.openstreetmap.org/export/embed.html?bbox=6.9955%2C4.8085%2C7.0485%2C4.8435&layer=mapnik&marker=4.8260%2C7.0226'
};

const NAV = [
  { key: 'home', label: 'Home', href: 'index.html' },
  { key: 'rooms', label: 'Rooms', href: 'rooms.html' },
  { key: 'dining', label: 'Dining', href: 'restaurant.html' },
  { key: 'events', label: 'Events', href: 'events.html' },
  { key: 'gallery', label: 'Gallery', href: 'gallery.html' },
  { key: 'about', label: 'About', href: 'about.html' }
];

/* ------------------------------------------------------------------ *
 *  Rooms & spaces — prices, capacities and amenities are the ones the
 *  hotel publishes (naira, per night, starting rates).
 * ------------------------------------------------------------------ */
const SHARED_ROOM_FEATURES = [
  'Air conditioning',
  'Flat-screen LED television',
  'High-speed Wi-Fi',
  'Rainfall shower',
  'Premium toiletries',
  'Soft linen & spacious wardrobe',
  'Daily housekeeping',
  '24/7 front desk'
];

const ROOMS = [
  {
    slug: 'standard-room',
    name: 'Standard Room',
    from: 40000,
    sleeps: '2 adults',
    bed: 'King bed',
    view: '—',
    tagline: 'The easy, comfortable essential',
    image: 'images/gth-standard.jpg',
    gallery: ['images/gth-standard.jpg', 'images/room-1.jpg', 'images/room-4.jpg'],
    intro:
      'A calm, well-proportioned room with a king bed, crisp linen and everything you need to work, rest and reset. The Standard Room is the simplest way to enjoy Grand Tokyu — bright interiors, quiet air conditioning and a front desk that never sleeps.',
    amenities: ['40-inch Samsung® LED TV', 'Free Wi-Fi', 'Non-smoking', 'USB charging station']
  },
  {
    slug: 'classic-room',
    name: 'Classic Room',
    from: 50000,
    sleeps: '3 adults',
    bed: 'Bed',
    view: '—',
    tagline: 'A little more room to spread out',
    image: 'images/gth-classic.jpg',
    gallery: ['images/gth-classic.jpg', 'images/room-2.jpg', 'images/room-5.jpg'],
    intro:
      'The Classic Room adds breathing space and a dedicated work desk — a favourite for business trips, longer stays and anyone who likes to unpack properly. Warm lighting, soft textiles and a properly stocked minibar make it feel less like a hotel room and more like your own.',
    amenities: ['40-inch LED TV', 'Free Wi-Fi', 'Non-smoking', 'USB charging station', 'Work desk']
  },
  {
    slug: 'standard-suite',
    name: 'Standard Suite Room',
    from: 60000,
    sleeps: '4 adults',
    bed: 'King bed',
    view: 'City view',
    tagline: 'Great for families',
    image: 'images/gth-standard-suite.jpg',
    gallery: ['images/gth-standard-suite.jpg', 'images/room-3.jpg', 'images/about-1.jpg'],
    intro:
      'A suite built around the way families actually travel: one generous king bedroom, a sitting area to spread out in, and a city view that keeps Port Harcourt close. Book it for a weekend, a family celebration or a stay where the children need their own corner.',
    amenities: ['King bed', 'City view', 'Sitting area', 'Free Wi-Fi', 'Non-smoking']
  },
  {
    slug: 'classic-suite',
    name: 'Classic Suite Room',
    from: 85000,
    sleeps: '5 adults',
    bed: 'King bed',
    view: 'Sea view',
    tagline: 'Our signature suite',
    image: 'images/gth-classic-suite.jpg',
    gallery: ['images/gth-classic-suite.jpg', 'images/room-5.jpg', 'images/about-2.jpg'],
    intro:
      'The most requested suite in the house. A king bed, a lounge for receiving guests, a mini bar for slow evenings and a sea view that changes colour at sunset. It sleeps up to five, so it works just as well for a family as it does for a small delegation.',
    amenities: ['40-inch LED TV', 'Free Wi-Fi', 'Mini bar', 'Non-smoking', 'USB charging station', 'Work desk', 'Sea view']
  },
  {
    slug: 'apartment',
    name: 'The Apartment',
    from: 300000,
    sleeps: '10 adults',
    bed: '2 separate bedrooms',
    view: 'City view',
    tagline: 'Hotel living, with a kitchen',
    image: 'images/gth-apartment-living.jpg',
    gallery: ['images/gth-apartment-living.jpg', 'images/gth-apartment-kitchen.jpg', 'images/room-4.jpg'],
    intro:
      'Two separate bedrooms, a furnished living room with a powerful standing air conditioner, and a fully equipped kitchen with a modern refrigerator and washing machine. Designed for families, groups of friends and anyone staying long enough to want their own front door. The 75-inch LED television does the rest.',
    amenities: ['75-inch LED TV', 'Free Wi-Fi', 'Kitchen', 'Mini bar', 'USB charging station', 'Work desk', 'Washing machine', 'City view']
  }
];

const HALL = {
  name: 'The Hall',
  from: 400000,
  capacity: '200 guests',
  image: 'images/gth-hall.jpg',
  gallery: ['images/gth-hall.jpg', 'images/bg_2.jpg', 'images/gth-lobby.jpg'],
  intro:
    'A full-height event hall with four standing air conditioners, free chairs and free Wi-Fi — ready for weddings, conferences, board meetings, seminars, birthdays and everything in between. The hotel’s rooms page lists a 100-guest layout while the accommodation page lists capacity for 200, so tell the events team the shape of your day and they will set the room accordingly.',
  amenities: ['4 standing air conditioners', 'Free chairs', 'Free Wi-Fi', 'Flexible layouts', 'Catering from the hotel kitchen', 'On-site parking']
};

const DISHES = [
  { name: 'Whole grilled croaker', desc: 'Charred over open flame, finished with herb butter, avocado and confit tomatoes.', img: 'images/menu-5.jpg', tag: 'From the grill' },
  { name: 'Peppered beef fillet', desc: 'A thick-cut fillet with a deep pepper glaze, steamed greens and roast potatoes.', img: 'images/menu-4.jpg', tag: 'Continental' },
  { name: 'Seafood fried rice', desc: 'Wok-tossed rice with prawns, calamari and sweet peppers — a house favourite.', img: 'images/menu-6.jpg', tag: 'Local & continental' },
  { name: 'Crispy chicken & pepper dip', desc: 'Golden, spice-crusted chicken with a fiery dipping sauce and herbs.', img: 'images/menu-9.jpg', tag: 'Small chops' },
  { name: 'Berry cheesecake', desc: 'Baked vanilla cheesecake, forest berries and a dark chocolate flourish.', img: 'images/menu-1.jpg', tag: 'Dessert' },
  { name: 'Chocolate & banana crêpe', desc: 'Warm crêpe folded over banana, chocolate sauce and fresh fruit.', img: 'images/menu-2.jpg', tag: 'Dessert' },
  { name: 'Buttermilk pancakes', desc: 'Stacked high with berry compote, strawberries and maple syrup.', img: 'images/menu-3.jpg', tag: 'Breakfast' },
  { name: 'Grand Tokyu sunset', desc: 'The rooftop signature — a long, ruby-red cocktail served over ice with citrus.', img: 'images/menu-7.jpg', tag: 'Rooftop bar' },
  { name: 'Tropical fruit smoothies', desc: 'Mango, banana and berries blended thick with yoghurt and honey.', img: 'images/menu-8.jpg', tag: 'Fresh & light' }
];

const GALLERY = [
  { img: 'images/gth-exterior.jpg', cap: 'The entrance at golden hour', group: 'Hotel' },
  { img: 'images/gth-lobby.jpg', cap: 'Reception and lobby lounge', group: 'Hotel' },
  { img: 'images/insta-1.jpg', cap: 'The lounge', group: 'Hotel' },
  { img: 'images/gth-rooftop.jpg', cap: 'Rooftop bar, city views', group: 'Rooftop & pool' },
  { img: 'images/menu-7.jpg', cap: 'Sundown cocktails on the roof', group: 'Rooftop & pool' },
  { img: 'images/bg_2.jpg', cap: 'Poolside terrace', group: 'Rooftop & pool' },
  { img: 'images/bg_1.jpg', cap: 'Pool deck and loungers', group: 'Rooftop & pool' },
  { img: 'images/about-2.jpg', cap: 'Sun terrace', group: 'Rooftop & pool' },
  { img: 'images/gth-standard.jpg', cap: 'Standard Room', group: 'Rooms' },
  { img: 'images/gth-classic.jpg', cap: 'Classic Room', group: 'Rooms' },
  { img: 'images/gth-standard-suite.jpg', cap: 'Standard Suite Room', group: 'Rooms' },
  { img: 'images/gth-classic-suite.jpg', cap: 'Classic Suite Room', group: 'Rooms' },
  { img: 'images/gth-apartment-living.jpg', cap: 'The Apartment — living room', group: 'Rooms' },
  { img: 'images/gth-apartment-kitchen.jpg', cap: 'The Apartment — kitchen', group: 'Rooms' },
  { img: 'images/room-1.jpg', cap: 'Guest room', group: 'Rooms' },
  { img: 'images/room-2.jpg', cap: 'Guest room', group: 'Rooms' },
  { img: 'images/room-3.jpg', cap: 'Guest room', group: 'Rooms' },
  { img: 'images/room-5.jpg', cap: 'Bathroom and bedroom', group: 'Rooms' },
  { img: 'images/gth-hall.jpg', cap: 'The Hall, set for an event', group: 'Events & dining' },
  { img: 'images/resto.jpg', cap: 'Evening dining', group: 'Events & dining' },
  { img: 'images/menu-3.jpg', cap: 'Breakfast, served properly', group: 'Events & dining' },
  { img: 'images/menu-5.jpg', cap: 'From the grill', group: 'Events & dining' },
  { img: 'images/menu-9.jpg', cap: 'Small chops', group: 'Events & dining' },
  { img: 'images/menu-6.jpg', cap: 'Seafood fried rice', group: 'Events & dining' }
];

const FAQS = [
  {
    q: 'Where exactly is Grand Tokyu Hotel?',
    a: 'At 273/274 Aba Road, Port Harcourt, Rivers State — roughly five minutes from GRA Junction and ten minutes from Mile 1 Park. Port Harcourt International Airport is about 35 minutes away by taxi.'
  },
  {
    q: 'How do I book a room?',
    a: 'Call the reservation desk on +234 091 6000 7896 or +234 091 6000 7897, message the hotel on WhatsApp, or email grandtokyuhotel@gmail.com. The booking form on this site prepares your request and sends it straight to the front desk by WhatsApp or email.'
  },
  {
    q: 'What time is check-in and check-out?',
    a: 'Check-in is generally from 12:00 and check-out by 11:00, but the hotel confirms the exact times with every reservation — please check when you book, especially for late arrivals.'
  },
  {
    q: 'What do rooms cost?',
    a: 'Published starting rates are ₦40,000 for a Standard Room, ₦50,000 for a Classic Room, ₦60,000 for a Standard Suite, ₦85,000 for a Classic Suite and ₦300,000 for The Apartment, per night. The Hall starts at ₦400,000. Rates change with season and availability.'
  },
  {
    q: 'Do you have a pool and a rooftop bar?',
    a: 'Yes — the hotel has a poolside area and a rooftop bar looking out over the city, alongside the restaurant, lounge and 24/7 front desk.'
  },
  {
    q: 'Is there parking and Wi-Fi?',
    a: 'Wi-Fi is free throughout the hotel and there is on-site parking for guests. Ask the front desk about airport pick-up and car hire when you book — availability is confirmed with your reservation.'
  },
  {
    q: 'Can you host my event?',
    a: 'The Hall seats up to 200 guests and comes with four standing air conditioners, free chairs and free Wi-Fi. The team can arrange catering, layouts and AV — send your date and guest count through the events page.'
  },
  {
    q: 'Are the rates on this site live?',
    a: 'No. They are the hotel’s published starting rates and are shown for guidance. Availability and final pricing are confirmed by the reservations team.'
  }
];

const POSTS = [
  {
    slug: 'journal-getting-here.html',
    title: 'Getting to Aba Road: a straightforward guide',
    date: 'February 2026',
    read: '4 min read',
    img: 'images/gth-exterior.jpg',
    excerpt:
      'Port Harcourt International Airport is roughly 35 minutes away, GRA Junction about five, Mile 1 Park about ten. Here is the simple version of how to arrive without the guesswork.'
  },
  {
    slug: 'journal-day-in-port-harcourt.html',
    title: 'A day out from the hotel',
    date: 'February 2026',
    read: '5 min read',
    img: 'images/bg_3.jpg',
    excerpt:
      'Pleasure Park, the stadium, the malls and the riverfront — a relaxed itinerary for guests who have a spare afternoon in Port Harcourt.'
  },
  {
    slug: 'journal-inside-your-room.html',
    title: 'Inside your room: what is already waiting',
    date: 'February 2026',
    read: '3 min read',
    img: 'images/gth-classic.jpg',
    excerpt:
      'From the 75-inch television in The Apartment to the USB charging point beside every bed — a short guide to the details in each room category.'
  }
];

/* ------------------------------------------------------------------ *
 *  Small helpers
 * ------------------------------------------------------------------ */
const money = (n) => '₦' + n.toLocaleString('en-NG');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function head({ title, description, active = '', bodyClass = '' }) {
  const navItems = NAV.map(
    (n) =>
      `\t\t\t\t\t<li class="nav-item${active === n.key ? ' active' : ''}"><a href="${n.href}" class="nav-link">${n.label}</a></li>`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="en">

<head>
	<title>${title} | ${SITE.name}, Port Harcourt</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<meta name="description" content="${description}">
	<meta name="theme-color" content="#0d3b34">
	<meta property="og:title" content="${title} | ${SITE.name}">
	<meta property="og:description" content="${description}">
	<meta property="og:type" content="website">
	<meta property="og:image" content="images/gth-exterior.jpg">

	<link rel="icon" href="images/favicon.svg" type="image/svg+xml">
	<link rel="apple-touch-icon" href="images/favicon.svg">

	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

	<link rel="stylesheet" href="css/open-iconic-bootstrap.min.css">
	<link rel="stylesheet" href="css/animate.css">
	<link rel="stylesheet" href="css/owl.carousel.min.css">
	<link rel="stylesheet" href="css/owl.theme.default.min.css">
	<link rel="stylesheet" href="css/magnific-popup.css">
	<link rel="stylesheet" href="css/aos.css">
	<link rel="stylesheet" href="css/ionicons.min.css">
	<link rel="stylesheet" href="css/bootstrap-datepicker.css">
	<link rel="stylesheet" href="css/jquery.timepicker.css">
	<link rel="stylesheet" href="css/flaticon.css">
	<link rel="stylesheet" href="css/icomoon.css">
	<link rel="stylesheet" href="css/style.css">
	<link rel="stylesheet" href="css/gth-theme.css">
	<noscript>
		<style>
			.ftco-animate { opacity: 1 !important; visibility: visible !important; }
			#ftco-loader { display: none !important; }
		</style>
	</noscript>
</head>

<body${bodyClass ? ` class="${bodyClass}"` : ''}>

	<nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
		<div class="container">
			<a class="navbar-brand" href="index.html">Grand <span>Tokyu</span><small>Port Harcourt</small></a>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav"
				aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="oi oi-menu"></span> Menu
			</button>

			<div class="collapse navbar-collapse" id="ftco-nav">
				<ul class="navbar-nav ml-auto">
${navItems}
					<li class="nav-item cta ml-lg-2"><a href="booking.html" class="nav-link"><span>Book Now</span></a></li>
				</ul>
			</div>
		</div>
	</nav>
	<!-- END nav -->`;
}

function footer() {
  const year = new Date().getFullYear();
  return `
	<footer class="ftco-footer ftco-section img" style="background-image: url(images/bg_4.jpg);">
		<div class="overlay"></div>
		<div class="container">
			<div class="row mb-5">
				<div class="col-lg-4 col-md-6">
					<div class="ftco-footer-widget mb-4">
						<h2 class="ftco-heading-2">Grand <span class="text-gold">Tokyu</span></h2>
						<p>Hospitality meets heart on Aba Road. Rooms and suites, a rooftop bar, a poolside, a restaurant
							serving local and continental cooking — and a front desk that never closes.</p>
						<ul class="ftco-footer-social list-unstyled float-md-left float-lft mt-4">
							<li class="ftco-animate"><a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp"><span class="icon-whatsapp"></span></a></li>
							<li class="ftco-animate"><a href="mailto:${SITE.email}" aria-label="Email"><span class="icon-envelope"></span></a></li>
							<li class="ftco-animate"><a href="${SITE.phoneHref}" aria-label="Call"><span class="icon-phone"></span></a></li>
						</ul>
					</div>
				</div>
				<div class="col-lg-2 col-md-6">
					<div class="ftco-footer-widget mb-4 ml-md-4">
						<h2 class="ftco-heading-2">Explore</h2>
						<ul class="list-unstyled">
							<li><a href="rooms.html" class="py-2 d-block">Rooms &amp; suites</a></li>
							<li><a href="restaurant.html" class="py-2 d-block">Dining</a></li>
							<li><a href="events.html" class="py-2 d-block">Events &amp; the Hall</a></li>
							<li><a href="gallery.html" class="py-2 d-block">Gallery</a></li>
							<li><a href="archive.html" class="py-2 d-block">Archive photographs</a></li>
							<li><a href="about.html" class="py-2 d-block">About us</a></li>
						</ul>
					</div>
				</div>
				<div class="col-lg-2 col-md-6">
					<div class="ftco-footer-widget mb-4">
						<h2 class="ftco-heading-2">Stay</h2>
						<ul class="list-unstyled">
							<li><a href="booking.html" class="py-2 d-block">Book a room</a></li>
							<li><a href="rooms.html#rates" class="py-2 d-block">Rates</a></li>
							<li><a href="about.html#good-to-know" class="py-2 d-block">Good to know</a></li>
							<li><a href="about.html#faqs" class="py-2 d-block">FAQs</a></li>
							<li><a href="blog.html" class="py-2 d-block">Journal</a></li>
						</ul>
					</div>
				</div>
				<div class="col-lg-4 col-md-6">
					<div class="ftco-footer-widget mb-4">
						<h2 class="ftco-heading-2">Find us</h2>
						<div class="block-23 mb-3">
							<ul>
								<li><span class="icon icon-map-marker"></span><span class="text">${SITE.address}</span></li>
								<li><a href="${SITE.phoneHref}"><span class="icon icon-phone"></span><span class="text">${SITE.phone}</span></a></li>
								<li><a href="${SITE.phone2Href}"><span class="icon icon-phone"></span><span class="text">${SITE.phone2}</span></a></li>
								<li><a href="mailto:${SITE.email}"><span class="icon icon-envelope"></span><span class="text">${SITE.email}</span></a></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div class="row border-top-gold pt-4">
				<div class="col-md-12 text-center">
					<p class="small mb-2">
						&copy; <script>document.write(new Date().getFullYear());</script> ${SITE.name}. Built on the
						<a href="https://colorlib.com" target="_blank" rel="noopener">Colorlib</a> Harborlights template
						(CC BY 3.0).
					</p>
					<p class="disclaimer small mb-0">
						Independent showcase site. Details were compiled from the hotel’s public listings and are shown
						for guidance only; photography is illustrative. Please confirm rates, availability and services
						directly with the hotel.
					</p>
				</div>
			</div>
		</div>
	</footer>

	<!-- loader -->
	<div id="ftco-loader" class="show fullscreen"><svg class="circular" width="48px" height="48px">
			<circle class="path-bg" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke="#eeeeee" />
			<circle class="path" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke-miterlimit="10"
				stroke="#c9a24a" />
		</svg></div>

	<script src="js/jquery.min.js"></script>
	<script src="js/jquery-migrate-3.0.1.min.js"></script>
	<script src="js/popper.min.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script src="js/jquery.easing.1.3.js"></script>
	<script src="js/jquery.waypoints.min.js"></script>
	<script src="js/jquery.stellar.min.js"></script>
	<script src="js/owl.carousel.min.js"></script>
	<script src="js/jquery.magnific-popup.min.js"></script>
	<script src="js/aos.js"></script>
	<script src="js/jquery.animateNumber.min.js"></script>
	<script src="js/scrollax.min.js"></script>
	<script src="js/gth.js"></script>
	<script src="js/main.js"></script>

</body>

</html>
`;
}

function pageHero({ image, crumbs = [], title, subtitle = '' }) {
  const crumbsHtml = crumbs
    .map((c, i) =>
      i === 0
        ? `<span class="mr-2"><a href="${c.href}">${c.label}</a></span>`
        : `<span class="mr-2">${c.href ? `<a href="${c.href}">${c.label}</a>` : c.label}</span>`
    )
    .join(' ');
  return `
	<div class="hero-wrap hero-sm" style="background-image: url('${image}');">
		<div class="overlay"></div>
		<div class="container">
			<div class="row no-gutters slider-text d-flex align-items-center justify-content-center">
				<div class="col-md-9 ftco-animate text-center d-flex align-items-end justify-content-center">
					<div class="text">
						<p class="breadcrumbs mb-2">${crumbsHtml}</p>
						<h1 class="mb-3 bread">${title}</h1>
						${subtitle ? `<p class="hero-sub mb-0">${subtitle}</p>` : ''}
					</div>
				</div>
			</div>
		</div>
	</div>`;
}

function ctaBand() {
  return `
	<section class="cta-band">
		<div class="container">
			<div class="row align-items-center">
				<div class="col-lg-8">
					<span class="subheading">Reservations</span>
					<h2 class="mb-3">Your room is ready when you are.</h2>
					<p class="mb-0">Speak to the front desk directly — no call centre, no waiting. We answer day and night.</p>
				</div>
				<div class="col-lg-4 text-lg-right mt-4 mt-lg-0">
					<a href="${SITE.phoneHref}" class="btn btn-primary btn-lg rounded-pill px-4">${SITE.phone}</a>
					<a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener" class="btn btn-outline-light btn-lg rounded-pill px-4 mt-2 mt-sm-0 ml-sm-2">WhatsApp</a>
				</div>
			</div>
		</div>
	</section>`;
}

function roomCard(room) {
  return `
				<div class="col-md-6 col-lg-4 d-flex ftco-animate">
					<div class="room-card w-100">
						<a href="room-${room.slug}.html" class="room-card-img" style="background-image:url(${room.image});">
							<span class="price-tag">From ${money(room.from)}<small>/night</small></span>
						</a>
						<div class="room-card-body">
							<h3><a href="room-${room.slug}.html">${room.name}</a></h3>
							<p class="room-meta mb-2">${room.sleeps} &middot; ${room.bed}${room.view && room.view !== '—' ? ' &middot; ' + room.view : ''}</p>
							<p class="room-copy">${room.intro.split('. ')[0]}.</p>
							<a href="room-${room.slug}.html" class="link-arrow">View details <span class="icon-long-arrow-right"></span></a>
						</div>
					</div>
				</div>`;
}

function dishCard(d) {
  return `
				<div class="col-md-6 col-lg-4 d-flex ftco-animate">
					<div class="dish-card w-100">
						<div class="dish-img" style="background-image:url(${d.img});"></div>
						<div class="dish-body">
							<span class="dish-tag">${d.tag}</span>
							<h3>${d.name}</h3>
							<p class="mb-0">${d.desc}</p>
						</div>
					</div>
				</div>`;
}

function galleryTile(item) {
  return `
						<a href="${item.img}" class="gallery-item image-popup" style="background-image:url(${item.img});">
							<span class="cap">${item.cap}</span>
						</a>`;
}

function writePage(file, html) {
  fs.writeFileSync(path.join(ROOT, file), html);
  console.log('  ✓', file);
}

module.exports = { ROOT, SITE, NAV, ROOMS, HALL, DISHES, GALLERY, FAQS, POSTS, SHARED_ROOM_FEATURES };

/* Page builders are appended below */

/* ------------------------------------------------------------------ *
 *  HOME
 * ------------------------------------------------------------------ */
function buildHome() {
  const slides = [
    {
      img: 'images/gth-exterior.jpg',
      kicker: 'Aba Road, Port Harcourt',
      title: 'Hospitality meets heart.',
      text: 'A warm, personal welcome in the middle of the city — and a room that feels like yours.',
      cta: 'Book your stay', href: 'booking.html', cta2: 'Explore rooms', href2: 'rooms.html'
    },
    {
      img: 'images/gth-rooftop.jpg',
      kicker: 'The rooftop bar',
      title: 'Sundown, above the city.',
      text: 'Cocktails, city lights and the kind of evening you plan the rest of your trip around.',
      cta: 'Dining & rooftop', href: 'restaurant.html', cta2: 'See the gallery', href2: 'gallery.html'
    },
    {
      img: 'images/bg_2.jpg',
      kicker: 'Poolside',
      title: 'Slow mornings by the water.',
      text: 'A quiet pool deck, cold drinks and nowhere in particular to be.',
      cta: 'Book a room', href: 'booking.html', cta2: 'Rooms & rates', href2: 'rooms.html'
    }
  ];

  const slidesHtml = slides
    .map(
      (s) => `
			<div class="slider-item" style="background-image:url(${s.img});">
				<div class="overlay"></div>
				<div class="container">
					<div class="row justify-content-center no-gutters slider-text align-items-center">
						<div class="col-md-9 ftco-animate">
							<div class="text text-center">
								<span class="hero-kicker">${s.kicker}</span>
								<h1 class="mb-3">${s.title}</h1>
								<p class="hero-lede">${s.text}</p>
								<p class="mt-4 mb-0">
									<a href="${s.href}" class="btn btn-primary btn-lg rounded-pill px-4">${s.cta}</a>
									<a href="${s.href2}" class="btn btn-outline-light btn-lg rounded-pill px-4 ml-sm-2">${s.cta2}</a>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>`
    )
    .join('');

  const services = [
    { icon: 'flaticon-reception-bell', title: '24/7 front desk', text: 'Someone at the desk at three in the afternoon and three in the morning.' },
    { icon: 'ion-ios-wine', title: 'Rooftop bar', text: 'Breathtaking city views, cocktails and a breeze you can actually feel.' },
    { icon: 'ion-ios-water', title: 'Poolside', text: 'A serene pool area to swim, read, or do absolutely nothing.' },
    { icon: 'ion-ios-restaurant', title: 'Local & continental', text: 'A restaurant serving Nigerian classics beside continental favourites.' },
    { icon: 'ion-ios-wifi', title: 'High-speed Wi-Fi', text: 'Free, fast and everywhere — from your room to the rooftop.' }
  ];

  const servicesHtml = services
    .map(
      (s, i) => `
				<div class="col-lg col-md-4 d-flex align-self-stretch ftco-animate">
					<div class="media block-6 services py-4 d-block text-center${i === 1 ? ' active' : ''}">
						<div class="d-flex justify-content-center">
							<div class="icon d-flex align-items-center justify-content-center">
								<span class="${s.icon}"></span>
							</div>
						</div>
						<div class="media-body">
							<h3 class="heading mb-2">${s.title}</h3>
							<p class="service-note mb-0">${s.text}</p>
						</div>
					</div>
				</div>`
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
					<div class="col-6 col-md-3 ftco-animate">
						<div class="stat">
							<span class="stat-number"><span class="number" data-number="${s.n}">${s.n}</span>${s.suffix}</span>
							<span class="stat-label">${s.label}</span>
						</div>
					</div>`
    )
    .join('');

  const listings = [
    {
      icon: 'icon-tripadvisor',
      name: 'Tripadvisor',
      status: 'Newly listed',
      detail: 'The Grand Tokyu Hotel listing at 273/274 Aba Road shows no traveller reviews or photos yet.',
      href: 'https://www.tripadvisor.com/Hotel_Review-g298363-d33282887-Reviews-Grand_Tokyu_Hotel-Port_Harcourt_Rivers_State.html',
      cta: 'See the listing'
    },
    {
      icon: 'icon-map-marker',
      name: 'Google Maps',
      status: 'Find us',
      detail: 'Directions, opening hours and the map pin for 273/274 Aba Road, Port Harcourt.',
      href: SITE.maps,
      cta: 'Open in Maps'
    }
  ];

  const listingsHtml = listings
    .map(
      (l) => `
					<div class="col-md-6 d-flex ftco-animate">
						<div class="rating-card w-100">
							<div class="d-flex align-items-start">
								<span class="${l.icon} rating-icon"></span>
								<div class="ml-3 flex-grow-1">
									<p class="mb-0 rating-name">${l.name}</p>
									<p class="mb-1 rating-count">${l.status}</p>
									<p class="mb-2 listing-detail">${l.detail}</p>
									<a class="link-arrow" href="${l.href}" target="_blank" rel="noopener">${l.cta} <span class="icon-long-arrow-right"></span></a>
								</div>
							</div>
						</div>
					</div>`
    )
    .join('');

  const houseNotes = [
    ['Rooftop bar', '“Our rooftop bar offers breathtaking views of the city, and our elegant reception sets the tone from the moment you arrive.”'],
    ['The rooms', '“Plush bedding, stylish décor, air-conditioning, and all the essentials for a relaxing stay.”'],
    ['The bathrooms', '“Sleek and sparkling, featuring rainfall showers, warm lighting, and premium toiletries.”']
  ];

  const notesHtml = houseNotes
    .map(
      ([label, quote]) => `
				<div class="col-md-4 d-flex ftco-animate">
					<div class="quote-card w-100">
						<span class="icon-quote-left quote-mark"></span>
						<p>${quote}</p>
						<span class="quote-source">${label} — quoted from the hotel’s own description</span>
					</div>
				</div>`
    )
    .join('');

  const postsHtml = POSTS.map(
    (p) => `
				<div class="col-md-4 d-flex ftco-animate">
					<div class="blog-entry align-self-stretch">
						<a href="${p.slug}" class="block-20 rounded" style="background-image: url(${p.img});"></a>
						<div class="text mt-3">
							<div class="meta mb-2">${p.date} &middot; ${p.read}</div>
							<h3 class="heading mb-2"><a href="${p.slug}">${p.title}</a></h3>
							<p class="mb-0">${p.excerpt}</p>
						</div>
					</div>
				</div>`
  ).join('');

  const features = [ROOMS[0], ROOMS[3], ROOMS[4]].map(roomCard).join('');

  const stripItems = [
    ['images/gth-lobby.jpg', 'Reception'],
    ['images/bg_2.jpg', 'Poolside'],
    ['images/gth-rooftop.jpg', 'Rooftop bar'],
    ['images/gth-classic-suite.jpg', 'Classic Suite'],
    ['images/resto.jpg', 'Restaurant'],
    ['images/gth-hall.jpg', 'The Hall']
  ];
  const strip = stripItems
    .map(([img, cap]) => `<a href="${img}" class="gallery-item image-popup" style="background-image:url(${img});"><span class="cap">${cap}</span></a>`)
    .join('');

  const dishesHtml = DISHES.slice(0, 3).map(dishCard).join('');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: SITE.name,
    description:
      'Boutique hotel on Aba Road, Port Harcourt with rooms and suites, a rooftop bar, pool, restaurant and 24-hour front desk.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '273/274 Aba Road',
      addressLocality: 'Port Harcourt',
      addressRegion: 'Rivers State',
      postalCode: SITE.postal,
      addressCountry: 'NG'
    },
    telephone: '+2349160007896',
    email: SITE.email,
    priceRange: '₦40,000 – ₦400,000',
    amenityFeature: [
      'Free Wi-Fi',
      'Outdoor pool',
      'Rooftop bar',
      'Restaurant',
      'Bar',
      'Room service',
      'Air conditioning',
      'Free parking',
      '24-hour front desk',
      'Event hall',
      'Laundry service',
      'Airport shuttle'
    ].map(function (name) {
      return { '@type': 'LocationFeatureSpecification', name: name, value: true };
    }),
    makesOffer: ROOMS.map(function (room) {
      return {
        '@type': 'Offer',
        name: room.name,
        price: room.from,
        priceCurrency: 'NGN',
        description: room.tagline
      };
    })
  };

  const html = `${head({
    title: 'Boutique comfort in Port Harcourt',
    description:
      'Grand Tokyu Hotel, 273/274 Aba Road, Port Harcourt — rooms and suites from ₦40,000, a rooftop bar, poolside, restaurant and a 24-hour front desk. Call +234 091 6000 7896.',
    active: 'home'
  })}

	<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
	</script>

	<div class="hero">
		<section class="home-slider owl-carousel">
${slidesHtml}
		</section>
	</div>

	<section class="booking-strip">
		<div class="container">
			<form class="booking-bar" id="quick-booking">
				<div class="row align-items-end">
					<div class="col-lg-3 col-md-6">
						<label for="qb-in">Check in</label>
						<input type="date" id="qb-in" class="form-control" required>
					</div>
					<div class="col-lg-3 col-md-6">
						<label for="qb-out">Check out</label>
						<input type="date" id="qb-out" class="form-control" required>
					</div>
					<div class="col-lg-2 col-md-6">
						<label for="qb-guests">Guests</label>
						<select id="qb-guests" class="form-control">
							<option>1 guest</option>
							<option selected>2 guests</option>
							<option>3 guests</option>
							<option>4 guests</option>
							<option>5+ guests</option>
						</select>
					</div>
					<div class="col-lg-2 col-md-6">
						<label for="qb-room">Room</label>
						<select id="qb-room" class="form-control">
							<option value="">Any room</option>
							${ROOMS.map((r) => `<option value="${r.slug}">${r.name}</option>`).join('\n\t\t\t\t\t\t\t')}
						</select>
					</div>
					<div class="col-lg-2">
						<button type="submit" class="btn btn-primary btn-block rounded-pill py-3">Check availability</button>
					</div>
				</div>
			</form>
		</div>
	</section>

	<section class="ftco-section">
		<div class="container">
			<div class="row justify-content-center mb-4 pb-2">
				<div class="col-md-8 heading-section text-center ftco-animate">
					<span class="subheading">Welcome to Grand Tokyu</span>
					<h2 class="mb-4">More than just a stay</h2>
					<p class="lead-copy">Every corner of the hotel is designed for comfort, elegance and a sense of home —
						whether you are here for business, for leisure or for a celebration.</p>
				</div>
			</div>
			<div class="row d-flex">
${servicesHtml}
			</div>
		</div>
	</section>

	<section class="ftco-section pt-0">
		<div class="container-fluid px-md-5">
			<div class="row justify-content-between align-items-center mb-4">
				<div class="col-md-7 heading-section ftco-animate">
					<span class="subheading">Rooms &amp; suites</span>
					<h2 class="mb-2">Somewhere to come back to</h2>
				</div>
				<div class="col-md-4 text-md-right ftco-animate mb-3 mb-md-0">
					<a href="rooms.html" class="btn btn-outline-dark rounded-pill px-4">All rooms &amp; rates</a>
				</div>
			</div>
			<div class="row">
${features}
			</div>
		</div>
	</section>

	<section class="split-feature">
		<div class="container-fluid px-0">
			<div class="row no-gutters align-items-stretch">
				<div class="col-lg-6 split-img" style="background-image:url(images/gth-rooftop.jpg);"></div>
				<div class="col-lg-6 split-copy">
					<div class="split-inner ftco-animate">
						<span class="subheading">The rooftop</span>
						<h2 class="mb-4">Breathtaking views, one floor above everything</h2>
						<p>Our rooftop bar looks out across Port Harcourt. Come up for golden hour, stay for the city
							lights, and let the team bring you something cold. It is the part of the hotel guests talk
							about long after check-out.</p>
						<ul class="tick-list">
							<li><span class="icon-check"></span> Cocktails, wine, beer and soft drinks</li>
							<li><span class="icon-check"></span> Open in the evenings, weather permitting</li>
							<li><span class="icon-check"></span> Private hire available for small celebrations</li>
						</ul>
						<a href="restaurant.html" class="btn btn-primary rounded-pill px-4">See dining &amp; bar</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="split-feature split-feature-reverse">
		<div class="container-fluid px-0">
			<div class="row no-gutters align-items-stretch">
				<div class="col-lg-6 order-lg-last split-img" style="background-image:url(images/bg_2.jpg);"></div>
				<div class="col-lg-6 split-copy">
					<div class="split-inner ftco-animate">
						<span class="subheading">Poolside</span>
						<h2 class="mb-4">A quiet corner of the city, with water</h2>
						<p>Sun loungers, shade, a poolside bar for light snacks and a pool that stays civilised all day.
							Guests come down for a morning swim and end up staying for lunch — that is rather the point.</p>
						<ul class="tick-list">
							<li><span class="icon-check"></span> Outdoor pool with loungers and shade</li>
							<li><span class="icon-check"></span> Poolside bar for drinks and snacks</li>
							<li><span class="icon-check"></span> Towels provided for house guests</li>
						</ul>
						<a href="gallery.html" class="btn btn-primary rounded-pill px-4">See the gallery</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="ftco-section stat-section" id="section-counter">
		<div class="container">
			<div class="row text-center">
${statsHtml}
			</div>
		</div>
	</section>

	<section class="ftco-section ftco-menu bg-light">
		<div class="container">
			<div class="row justify-content-center mb-5 pb-2">
				<div class="col-md-8 heading-section text-center ftco-animate">
					<span class="subheading">The restaurant</span>
					<h2 class="mb-3">Local and continental, cooked with care</h2>
					<p>From jollof and grilled fish to a properly rested steak — the kitchen cooks for the way you feel,
						not just the time of day.</p>
				</div>
			</div>
			<div class="row">
${dishesHtml}
			</div>
			<div class="row mt-3">
				<div class="col-md-12 text-center ftco-animate">
					<a href="restaurant.html" class="btn btn-primary rounded-pill px-4">View the menu</a>
				</div>
			</div>
		</div>
	</section>

	<section class="ftco-section">
		<div class="container-fluid px-md-5">
			<div class="row justify-content-between align-items-end mb-4">
				<div class="col-md-7 heading-section ftco-animate">
					<span class="subheading">Gallery</span>
					<h2 class="mb-0">A look around</h2>
				</div>
				<div class="col-md-4 text-md-right ftco-animate mb-3 mb-md-0">
					<a href="gallery.html" class="btn btn-outline-dark rounded-pill px-4">Full gallery</a>
				</div>
			</div>
			<div class="gallery-grid gallery-grid-6">
${strip}
			</div>
		</div>
	</section>

	<section class="ftco-section pt-0">
		<div class="container">
			<div class="row justify-content-center mb-4">
				<div class="col-md-8 heading-section text-center ftco-animate">
					<span class="subheading">In the hotel’s own words</span>
					<h2 class="mb-3">Find us, and read about us</h2>
					<p class="small mb-0">The hotel is a new listing, so there is no published guest score yet — we would
						rather show you nothing than invent one. The descriptions below are quoted from Grand Tokyu’s own
						listing.</p>
				</div>
			</div>
			<div class="row">
${listingsHtml}
			</div>
			<div class="row mt-4">
${notesHtml}
			</div>
		</div>
	</section>

	<section class="ftco-section bg-light">
		<div class="container">
			<div class="row justify-content-center mb-5 pb-2">
				<div class="col-md-8 heading-section text-center ftco-animate">
					<span class="subheading">Journal</span>
					<h2>Notes for your stay</h2>
				</div>
			</div>
			<div class="row">
${postsHtml}
			</div>
		</div>
	</section>
${ctaBand()}
${footer()}`;

  writePage('index.html', html);
}

/* ------------------------------------------------------------------ *
 *  ROOMS
 * ------------------------------------------------------------------ */
function buildRooms() {
  const cards = ROOMS.map(roomCard).join('');
  const rateRows = ROOMS.concat([{ ...HALL, slug: 'the-hall' }])
    .map(
      (r) => `
						<tr>
							<td><strong>${r.name}</strong></td>
							<td>${r.sleeps || r.capacity || '—'}</td>
							<td>${r.bed || 'Event space'}</td>
							<td class="text-right">${money(r.from)}</td>
						</tr>`
    )
    .join('');

  const html = `${head({
    title: 'Rooms & suites from ₦40,000',
    description:
      'Standard and Classic rooms, two suite categories and a two-bedroom apartment with a kitchen — published starting rates from ₦40,000 per night at Grand Tokyu Hotel, Port Harcourt.',
    active: 'rooms'
  })}

${pageHero({
    image: 'images/gth-classic-suite.jpg',
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Rooms' }],
    title: 'Rooms &amp; suites',
    subtitle: 'Exceptional comfort in the heart of Port Harcourt — from ₦40,000 a night.'
  })}

	<section class="ftco-section">
		<div class="container">
			<div class="row justify-content-center mb-5 pb-2">
				<div class="col-md-9 heading-section text-center ftco-animate">
					<span class="subheading">Unwind in style</span>
					<h2 class="mb-4">Your private space</h2>
					<p>Step into plush bedding, stylish décor, air conditioning and all the essentials for a relaxing
						stay. From cosy standard rooms to a spacious apartment with a living room and kitchen, there is
						something here for individuals, couples and families.</p>
				</div>
			</div>
			<div class="row">
${cards}
			</div>
		</div>
	</section>

	<section class="ftco-section bg-light" id="rates">
		<div class="container">
			<div class="row justify-content-center mb-4">
				<div class="col-md-9 heading-section text-center ftco-animate">
					<span class="subheading">Rates</span>
					<h2 class="mb-3">Published starting rates</h2>
					<p class="small mb-0">Naira, per night, room only unless stated otherwise. Rates vary by season and
						availability — reservations confirm the final price.</p>
				</div>
			</div>
			<div class="row justify-content-center">
				<div class="col-lg-10">
					<div class="table-responsive rate-table ftco-animate">
						<table class="table">
							<thead>
								<tr>
									<th>Room</th>
									<th>Sleeps</th>
									<th>Bed</th>
									<th class="text-right">From / night</th>
								</tr>
							</thead>
							<tbody>
${rateRows}
							</tbody>
						</table>
					</div>
					<p class="small text-muted mt-3 mb-0">The Hall is an event space rather than a guest room and is
						priced for exclusive use — see <a href="events.html">Events</a>.</p>
				</div>
			</div>
		</div>
	</section>

	<section class="ftco-section">
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-md-10">
					<div class="row">
						<div class="col-md-6 ftco-animate">
							<h2 class="mb-4">In every room</h2>
							<ul class="amenity-grid">
								${SHARED_ROOM_FEATURES.map((f) => `<li><span class="icon-check"></span>${f}</li>`).join('')}
							</ul>
						</div>
						<div class="col-md-6 ftco-animate">
							<h2 class="mb-4">Good to know</h2>
							<ul class="info-list">
								<li><span>Check-in</span>${SITE.checkinText}</li>
								<li><span>Check-out</span>${SITE.checkoutText}</li>
								<li><span>Payment</span> Naira, at the hotel or by transfer</li>
								<li><span>Front desk</span> open 24 hours</li>
								<li><span>Wi-Fi</span> free throughout the hotel</li>
								<li><span>Parking</span> on site</li>
							</ul>
							<a href="booking.html" class="btn btn-primary rounded-pill px-4 mt-3">Request a room</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
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
        (img) => `
							<div class="item">
								<div class="room-img" style="background-image: url(${img});"></div>
							</div>`
      )
      .join('');

    const page = `${head({
      title: `${room.name} from ${money(room.from)}`,
      description: `${room.name} at Grand Tokyu Hotel, Port Harcourt — ${room.sleeps}, ${room.bed}. From ${money(room.from)} per night.`,
      active: 'rooms'
    })}

${pageHero({
      image: room.image,
      crumbs: [
        { label: 'Home', href: 'index.html' },
        { label: 'Rooms', href: 'rooms.html' },
        { label: room.name }
      ],
      title: room.name,
      subtitle: room.tagline
    })}

	<section class="ftco-section">
		<div class="container">
			<div class="row justify-content-between">
				<div class="col-lg-7 ftco-animate">
					<div class="single-slider owl-carousel mb-4">
${gallerySlides}
					</div>
				</div>
				<div class="col-lg-5 pl-lg-5 ftco-animate">
					<span class="subheading">From ${money(room.from)} per night</span>
					<h2 class="mb-4">${room.name}</h2>
					<p>${room.intro}</p>
					<ul class="spec-list">
						<li><span>Sleeps</span>${room.sleeps}</li>
						<li><span>Bed</span>${room.bed}</li>
						<li><span>View</span>${room.view}</li>
						<li><span>Rate</span>from ${money(room.from)} / night</li>
					</ul>
					<a href="booking.html?room=${room.slug}" class="btn btn-primary rounded-pill px-4 mt-2">Request this room</a>
					<a href="https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hello Grand Tokyu Hotel, I would like to ask about the ' + room.name + '.')}" target="_blank" rel="noopener" class="btn btn-outline-dark rounded-pill px-4 mt-2 ml-sm-2">WhatsApp</a>
				</div>
			</div>
		</div>
	</section>

	<section class="ftco-section bg-light">
		<div class="container">
			<div class="row">
				<div class="col-md-6 ftco-animate">
					<h3 class="mb-4">Room amenities</h3>
					<ul class="amenity-grid amenities-two">
						${room.amenities.map((a) => `<li><span class="icon-check"></span>${a}</li>`).join('')}
					</ul>
					<h3 class="mb-3 mt-4">In every room</h3>
					<ul class="amenity-grid amenities-two">
						${SHARED_ROOM_FEATURES.map((a) => `<li><span class="icon-check"></span>${a}</li>`).join('')}
					</ul>
				</div>
				<div class="col-md-6 ftco-animate pl-lg-5">
					<h3 class="mb-4">Booking notes</h3>
					<ul class="info-list">
						<li><span>Check-in</span>${SITE.checkinText}</li>
						<li><span>Check-out</span>${SITE.checkoutText}</li>
						<li><span>Reservations</span> ${SITE.phone}</li>
						<li><span>Email</span> <a href="mailto:${SITE.email}">${SITE.email}</a></li>
						<li><span>Address</span> ${SITE.address}</li>
					</ul>
					<div class="note-card mt-4">
						<p class="mb-0"><strong>Please note:</strong> rates shown are the hotel’s published starting rates
							and are not live availability. The reservations team will confirm your dates and the final
							price.</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="ftco-section">
		<div class="container-fluid px-md-5">
			<div class="row justify-content-between align-items-end mb-4">
				<div class="col-md-7 heading-section ftco-animate">
					<span class="subheading">Also available</span>
					<h2 class="mb-0">Other rooms</h2>
				</div>
				<div class="col-md-4 text-md-right ftco-animate mb-3 mb-md-0">
					<a href="rooms.html" class="btn btn-outline-dark rounded-pill px-4">All rooms</a>
				</div>
			</div>
			<div class="row">
${others}
			</div>
		</div>
	</section>
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
      text: 'Local and continental cooking from breakfast through dinner, served in a warm dining room or sent up to your room.'
    },
    {
      icon: 'ion-ios-wine',
      title: 'The Rooftop Bar',
      text: 'Breathtaking views over the city, cocktails and cold drinks, open into the evening.'
    },
    {
      icon: 'ion-ios-water',
      title: 'Poolside',
      text: 'Light snacks and drinks beside the pool — the easiest place to lose an afternoon.'
    }
  ];

  const venuesHtml = venues
    .map(
      (v) => `
					<div class="col-md-4 d-flex ftco-animate">
						<div class="venue-card w-100">
							<span class="${v.icon} venue-icon"></span>
							<h3>${v.title}</h3>
							<p class="mb-0">${v.text}</p>
						</div>
					</div>`
    )
    .join('');

  const dishesHtml = DISHES.map(dishCard).join('');

  const html = `${head({
    title: 'Restaurant, rooftop bar & poolside',
    description:
      'The restaurant at Grand Tokyu Hotel serves local and continental dishes, with a rooftop bar overlooking Port Harcourt and a poolside bar for light snacks.',
    active: 'dining'
  })}

${pageHero({
    image: 'images/resto.jpg',
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Dining' }],
    title: 'Dining',
    subtitle: 'Local and continental cooking, a rooftop bar and a poolside that is hard to leave.'
  })}

	<section class="ftco-section">
		<div class="container">
			<div class="row align-items-center">
				<div class="col-lg-6 ftco-animate">
					<span class="subheading">The restaurant</span>
					<h2 class="mb-4">Food that tastes like somebody thought about it</h2>
					<p>Cooking here moves between the Nigerian classics you grew up with and the continental dishes you
						crave after a long flight — jollof and grilled fish one night, a rested fillet the next. The
						kitchen keeps the menu generous, the portions honest and the seasoning confident.</p>
					<p>Breakfast is served in the dining room, lunch runs into the afternoon, and dinner is available
						late. Room service brings the same food upstairs, so the only decision left is whether to dress
						for dinner.</p>
					<ul class="tick-list">
						<li><span class="icon-check"></span> Local Nigerian and continental dishes</li>
						<li><span class="icon-check"></span> Breakfast, lunch and dinner</li>
						<li><span class="icon-check"></span> Room service for house guests</li>
						<li><span class="icon-check"></span> Private dining for small groups</li>
					</ul>
					<a href="booking.html" class="btn btn-primary rounded-pill px-4">Book a table</a>
				</div>
				<div class="col-lg-6 ftco-animate">
					<div class="stacked-imgs">
						<div class="img-main" style="background-image:url(images/resto.jpg);"></div>
						<div class="img-small" style="background-image:url(images/menu-3.jpg);"></div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="ftco-section bg-light">
		<div class="container">
			<div class="row justify-content-center mb-5 pb-2">
				<div class="col-md-8 heading-section text-center ftco-animate">
					<span class="subheading">Where to sit</span>
					<h2>Three places to eat and drink</h2>
				</div>
			</div>
			<div class="row">
${venuesHtml}
			</div>
		</div>
	</section>

	<section class="ftco-section">
		<div class="container">
			<div class="row justify-content-center mb-5 pb-2">
				<div class="col-md-8 heading-section text-center ftco-animate">
					<span class="subheading">From the kitchen</span>
					<h2 class="mb-3">A taste of the menu</h2>
					<p>The kitchen’s range in nine plates — grilled, peppered, comforting and sweet. The menu changes with
						the season and the market, so ask your server what is good today.</p>
				</div>
			</div>
			<div class="row">
${dishesHtml}
			</div>
			<p class="small text-muted text-center mt-4 mb-0">Dishes shown are representative of the restaurant’s local
				and continental offering. Please confirm the current menu and any dietary requirements with the hotel.</p>
		</div>
	</section>

	<section class="ftco-section bg-light">
		<div class="container">
			<div class="row align-items-center">
				<div class="col-lg-6 order-lg-last ftco-animate">
					<div class="hours-card">
						<h3 class="mb-4">Opening hours</h3>
						<ul class="info-list">
							<li><span>Restaurant</span> Breakfast &middot; Lunch &middot; Dinner</li>
							<li><span>Room service</span> For house guests during kitchen hours</li>
							<li><span>Rooftop bar</span> Evenings, weather permitting</li>
							<li><span>Poolside bar</span> Daytime</li>
							<li><span>Front desk</span> Open 24 hours</li>
						</ul>
						<p class="small mb-0">Hours can shift around events and private bookings — call
							<a href="${SITE.phoneHref}">${SITE.phone}</a> to check before you travel.</p>
					</div>
				</div>
				<div class="col-lg-6 ftco-animate">
					<span class="subheading">Private dining</span>
					<h2 class="mb-4">Birthdays, boardrooms and long lunches</h2>
					<p>Small celebrations can be hosted in the restaurant or up on the rooftop, and larger gatherings move
						to The Hall, which takes up to 200 guests with four standing air conditioners and free Wi-Fi.</p>
					<p>Tell the team the date, the number of guests and the mood you are after, and they will build the
						menu around it.</p>
					<a href="events.html" class="btn btn-outline-dark rounded-pill px-4">Enquire about an event</a>
				</div>
			</div>
		</div>
	</section>
${ctaBand()}
${footer()}`;

  writePage('restaurant.html', html);
}

/* ------------------------------------------------------------------ *
 *  EVENTS
 * ------------------------------------------------------------------ */
function buildEvents() {
  const layouts = [
    ['Wedding reception', 'Up to 200 guests'],
    ['Conference / seminar', 'Theatre or boardroom style'],
    ['Corporate dinner', 'Round tables of ten'],
    ['Birthday / celebration', 'Flexible floor plan'],
    ['Training & workshops', 'Chairs and Wi-Fi included'],
    ['Exhibition / launch', 'Open-floor layout']
  ]
    .map(
      ([name, detail]) => `
							<tr>
								<td>${name}</td>
								<td class="text-muted">${detail}</td>
							</tr>`
    )
    .join('');

  const html = `${head({
    title: 'Events & The Hall',
    description:
      'The Hall at Grand Tokyu Hotel holds up to 200 guests with four standing air conditioners, free chairs and free Wi-Fi. Enquire about weddings, conferences and private dining in Port Harcourt.',
    active: 'events'
  })}

${pageHero({
    image: 'images/gth-hall.jpg',
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Events' }],
    title: 'Events',
    subtitle: 'One generous hall, a rooftop, and a kitchen that can feed all of it.'
  })}

	<section class="ftco-section">
		<div class="container">
			<div class="row align-items-center">
				<div class="col-lg-6 ftco-animate">
					<span class="subheading">The Hall</span>
					<h2 class="mb-4">Room for the whole guest list</h2>
					<p>Full-height, air-conditioned and deliberately flexible, The Hall is the hotel’s largest space. Four
						standing air conditioners keep it cool, chairs are included, and the Wi-Fi is free — so the only
						thing you need to think about is the programme.</p>
					<p>Weddings, conferences, seminars, board meetings, birthdays and launches have all found a home here.
						The hotel’s kitchen caters from the same building, which means hot food arrives hot.</p>
					<ul class="spec-list spec-list-lg">
						<li><span>Capacity</span>Up to 200 guests</li>
						<li><span>Rate</span>from ${money(HALL.from)} per night</li>
						<li><span>Included</span>4 standing A/Cs, free chairs, free Wi-Fi</li>
						<li><span>Catering</span>Available from the hotel kitchen</li>
					</ul>
					<a href="#enquiry" class="btn btn-primary rounded-pill px-4">Check your date</a>
				</div>
				<div class="col-lg-6 ftco-animate">
					<div class="stacked-imgs">
						<div class="img-main" style="background-image:url(images/gth-hall.jpg);"></div>
						<div class="img-small" style="background-image:url(images/gth-rooftop.jpg);"></div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="ftco-section bg-light">
		<div class="container">
			<div class="row">
				<div class="col-lg-7 ftco-animate">
					<h2 class="mb-4">Ways to use the space</h2>
					<div class="table-responsive rate-table">
						<table class="table">
							<thead>
								<tr><th>Occasion</th><th>Layout</th></tr>
							</thead>
							<tbody>
${layouts}
							</tbody>
						</table>
					</div>
					<p class="small text-muted">The hotel lists capacity for 200 guests on its accommodation page and a
						100-guest layout on its rooms page — send your guest count and the team will confirm the right
						arrangement.</p>
				</div>
				<div class="col-lg-5 ftco-animate">
					<h3 class="mb-4">What is included</h3>
					<ul class="amenity-grid">
						${HALL.amenities.map((a) => `<li><span class="icon-check"></span>${a}</li>`).join('')}
					</ul>
					<div class="note-card mt-4">
						<p class="mb-0"><strong>Also worth knowing:</strong> the rooftop and restaurant can be reserved for
							smaller gatherings, and guest rooms can be blocked for out-of-town attendees.</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="ftco-section" id="enquiry">
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-lg-8">
					<div class="heading-section text-center mb-4 ftco-animate">
						<span class="subheading">Enquiries</span>
						<h2>Tell us about your event</h2>
					</div>
					<form class="form-card" data-enquiry-form data-kind="Event enquiry">
						<div class="row">
							<div class="col-md-6 form-group">
								<label>Your name</label>
								<input type="text" name="name" class="form-control" placeholder="Full name" required>
							</div>
							<div class="col-md-6 form-group">
								<label>Phone / WhatsApp</label>
								<input type="tel" name="phone" class="form-control" placeholder="+234 ..." required>
							</div>
							<div class="col-md-6 form-group">
								<label>Email</label>
								<input type="email" name="email" class="form-control" placeholder="you@example.com">
							</div>
							<div class="col-md-6 form-group">
								<label>Event date</label>
								<input type="date" name="date" class="form-control">
							</div>
							<div class="col-md-6 form-group">
								<label>Event type</label>
								<select name="type" class="form-control">
									<option>Wedding reception</option>
									<option>Conference / seminar</option>
									<option>Corporate dinner</option>
									<option>Birthday / celebration</option>
									<option>Training / workshop</option>
									<option>Other</option>
								</select>
							</div>
							<div class="col-md-6 form-group">
								<label>Guests</label>
								<input type="number" name="guests" min="1" class="form-control" placeholder="e.g. 120">
							</div>
							<div class="col-12 form-group">
								<label>Anything else?</label>
								<textarea name="notes" rows="4" class="form-control" placeholder="Layout, catering, AV, timing..."></textarea>
							</div>
							<div class="col-12 form-group mb-0">
								<button type="submit" class="btn btn-primary rounded-pill px-5 py-3" data-send="whatsapp">Send on WhatsApp</button>
								<button type="submit" class="btn btn-outline-dark rounded-pill px-5 py-3 ml-sm-2" data-send="email">Send by email</button>
								<p class="form-note small mt-3 mb-0">This opens WhatsApp or your email app with the details filled in — nothing is sent automatically.</p>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</section>
${ctaBand()}
${footer()}`;

  writePage('events.html', html);
}

/* ------------------------------------------------------------------ *
 *  GALLERY
 * ------------------------------------------------------------------ */
function buildGallery() {
  const groups = ['Hotel', 'Rooms', 'Rooftop & pool', 'Events & dining'];
  const filters = groups
    .map(
      (g, i) =>
        `<button class="filter-btn${i === 0 ? ' is-active' : ''}" data-filter="${g.replace(/&/g, '&amp;')}">${g}</button>`
    )
    .join('');

  const tiles = GALLERY.map(
    (item) => `
					<a href="${item.img}" class="gallery-item image-popup" data-group="${item.group.replace(/&/g, '&amp;')}" style="background-image:url(${item.img});">
						<span class="cap">${item.cap}</span>
					</a>`
  ).join('');

  const html = `${head({
    title: 'Gallery',
    description:
      'A look around Grand Tokyu Hotel, Port Harcourt — the entrance, lobby, rooftop bar, pool, rooms, suites and event hall.',
    active: 'gallery'
  })}

${pageHero({
    image: 'images/gth-lobby.jpg',
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Gallery' }],
    title: 'Gallery',
    subtitle: 'The hotel, room by room and corner by corner.'
  })}

	<section class="ftco-section">
		<div class="container-fluid px-md-5">
			<div class="row justify-content-center mb-4">
				<div class="col-lg-9 text-center">
					<div class="filter-bar">
						<button class="filter-btn is-active" data-filter="all">Everything</button>
						${filters}
					</div>
				</div>
			</div>
			<div class="gallery-grid gallery-grid-4" id="gallery-grid">
${tiles}
			</div>
			<p class="small text-muted text-center mt-4 mb-0">Click any image to open it full size. The marketing imagery
				on this page is illustrative of the hotel’s interiors — the <a href="archive.html">archive page</a> has
				the genuine photographs of the building from before the rebrand.</p>
		</div>
	</section>
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
    { icon: 'ion-ios-star', title: 'Detail, quietly done', text: 'Rainfall showers, premium toiletries, soft linen and daily housekeeping.' },
    { icon: 'ion-ios-location', title: 'Genuinely central', text: 'On Aba Road — five minutes from GRA Junction, ten from Mile 1 Park.' }
  ];

  const valuesHtml = values
    .map(
      (v) => `
					<div class="col-md-6 col-lg-3 d-flex ftco-animate">
						<div class="value-card w-100">
							<span class="${v.icon} value-icon"></span>
							<h3>${v.title}</h3>
							<p class="mb-0">${v.text}</p>
						</div>
					</div>`
    )
    .join('');

  const facts = [
    ['Address', SITE.address + ' (' + SITE.postal + ')'],
    ['Reservations', SITE.phone + ' &middot; ' + SITE.phone2],
    ['Email', SITE.email],
    ['Check-in', SITE.checkinText],
    ['Check-out', SITE.checkoutText],
    ['Room categories', 'Standard, Classic, Standard Suite, Classic Suite, Apartment'],
    ['Starting rate', money(40000) + ' per night'],
    ['Event space', 'The Hall — up to 200 guests, from ' + money(HALL.from)],
    ['Dining', 'Restaurant, rooftop bar, poolside'],
    ['Wi-Fi', 'Free throughout the hotel'],
    ['Parking', 'On site'],
    ['Front desk', 'Open 24 hours']
  ];

  const factRows = facts
    .map(
      ([k, v]) => `
							<tr>
								<th>${k}</th>
								<td>${v}</td>
							</tr>`
    )
    .join('');

  const faqHtml = FAQS.map(
    (f, i) => `
				<div class="faq-item">
					<button class="faq-question" type="button" data-toggle="collapse" data-target="#faq-${i}" aria-expanded="${i === 0 ? 'true' : 'false'}">
						<span>${f.q}</span><span class="icon-chevron-down"></span>
					</button>
					<div id="faq-${i}" class="collapse${i === 0 ? ' show' : ''}">
						<div class="faq-answer"><p class="mb-0">${f.a}</p></div>
					</div>
				</div>`
  ).join('');

  const preview = GALLERY.slice(0, 8)
    .map((g) => `<a href="${g.img}" class="gallery-item image-popup" style="background-image:url(${g.img});"><span class="cap">${g.cap}</span></a>`)
    .join('');

  const html = `${head({
    title: 'About the hotel',
    description:
      'Grand Tokyu Hotel is a Port Harcourt hotel on Aba Road — comfortable rooms and suites, a rooftop bar, a pool, all-day dining and a 24-hour front desk.',
    active: 'about'
  })}

${pageHero({
    image: 'images/gth-lobby.jpg',
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'About us' }],
    title: 'About the hotel',
    subtitle: 'Hospitality meets heart on Aba Road.'
  })}

	<section class="ftco-section">
		<div class="container">
			<div class="row align-items-center">
				<div class="col-lg-6 ftco-animate">
					<span class="subheading">Our story</span>
					<h2 class="mb-4">A Port Harcourt address, done properly</h2>
					<p>Grand Tokyu Hotel is a hotel for people who want the city within reach but the noise kept at the
						door. It sits on Aba Road, one of Port Harcourt’s main arteries, close enough to GRA Junction and
						Mile 1 Park to make the day easy, and far enough from the traffic to make the evening quiet.</p>
					<p>Inside, the hotel works the way a good hotel should. Reception sets the tone the moment you arrive.
						The rooms are furnished for real life — plush bedding, soft linen, spacious wardrobes, a proper
						desk, air conditioning and a flat-screen television. The bathrooms are sleek, with rainfall
						showers, warm lighting and premium toiletries.</p>
					<p>Then there is the rest of it: a restaurant cooking Nigerian and continental food, a rooftop bar with
						the best view in the building, a poolside for the slow hours, and a front desk that stays awake so
						you do not have to worry about the time.</p>
					<a href="booking.html" class="btn btn-primary rounded-pill px-4">Reserve your room</a>
				</div>
				<div class="col-lg-6 ftco-animate">
					<div class="stacked-imgs stacked-imgs-tall">
						<div class="img-main" style="background-image:url(images/gth-exterior.jpg);"></div>
						<div class="img-small" style="background-image:url(images/gth-lobby.jpg);"></div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="ftco-section bg-light">
		<div class="container">
			<div class="row justify-content-center mb-5 pb-2">
				<div class="col-md-8 heading-section text-center ftco-animate">
					<span class="subheading">What we care about</span>
					<h2>Four things we get right</h2>
				</div>
			</div>
			<div class="row">
${valuesHtml}
			</div>
		</div>
	</section>

	<section class="ftco-section" id="good-to-know">
		<div class="container">
			<div class="row">
				<div class="col-lg-7 ftco-animate">
					<span class="subheading">Good to know</span>
					<h2 class="mb-4">The facts, in one place</h2>
					<div class="table-responsive">
						<table class="table facts-table">
							<tbody>
${factRows}
							</tbody>
						</table>
					</div>
					<p class="small text-muted">Details compiled from the hotel’s public listings and shown for guidance.
						Please confirm anything time-sensitive with reservations.</p>
				</div>
				<div class="col-lg-5 ftco-animate">
					<span class="subheading">Getting here</span>
					<h2 class="mb-4">Directions</h2>
					<div class="map-frame mb-4">
						<iframe src="${SITE.osm}" title="Map showing Aba Road, Port Harcourt" loading="lazy"></iframe>
					</div>
					<ul class="info-list">
						<li><span>By car</span>About 5 minutes from GRA Junction, 10 minutes from Mile 1 Park</li>
						<li><span>Airport</span>Port Harcourt International is roughly 35 minutes by taxi</li>
						<li><span>Parking</span>On site, for guests and visitors</li>
					</ul>
					<a href="${SITE.maps}" target="_blank" rel="noopener" class="btn btn-outline-dark rounded-pill px-4 mt-3">Open in Google Maps</a>
				</div>
			</div>
		</div>
	</section>

	<section class="ftco-section bg-light">
		<div class="container-fluid px-md-5">
			<div class="row justify-content-between align-items-end mb-4">
				<div class="col-md-7 heading-section ftco-animate">
					<span class="subheading">Gallery</span>
					<h2 class="mb-0">The hotel in pictures</h2>
				</div>
				<div class="col-md-4 text-md-right ftco-animate mb-3 mb-md-0">
					<a href="gallery.html" class="btn btn-outline-dark rounded-pill px-4">Full gallery</a>
				</div>
			</div>
			<div class="gallery-grid gallery-grid-4">
${preview}
			</div>
		</div>
	</section>


	<section class="ftco-section bg-light" id="sources">
		<div class="container">
			<div class="row justify-content-center mb-4">
				<div class="col-md-9 heading-section text-center ftco-animate">
					<span class="subheading">Transparency</span>
					<h2 class="mb-3">Where these details come from</h2>
					<p class="small mb-0">This is an independent showcase site, not an official publication. Everything
						below was taken from public sources, and anything we could not verify is marked as such.</p>
				</div>
			</div>
			<div class="row justify-content-center">
				<div class="col-lg-10">
					<div class="table-responsive ftco-animate">
						<table class="table facts-table sources-table">
							<thead>
								<tr><th>Detail</th><th>Source</th><th>Confidence</th></tr>
							</thead>
							<tbody>
								<tr>
									<td>Name, address, phone numbers, email, room categories, rates, amenities and The Hall</td>
									<td>grandtokyuhotels.com (the hotel’s own website, July 2026 snapshot)</td>
									<td><span class="tag-ok">Published by the hotel</span></td>
								</tr>
								<tr>
									<td>Rooftop bar, poolside, 24/7 front desk, restaurant</td>
									<td>grandtokyuhotels.com — about, rooms and contact pages</td>
									<td><span class="tag-ok">Published by the hotel</span></td>
								</tr>
								<tr>
									<td>Nearby distances (Pleasure Park 5.5&nbsp;km, Boss Lounge 2.8&nbsp;km, SOK 2.9&nbsp;km) and the street address for listings</td>
									<td>Tripadvisor listing (d33282887) for 273/274 Aba Road</td>
									<td><span class="tag-ok">Third-party listing</span></td>
								</tr>
								<tr>
									<td>Airport drive time (~35 minutes) and “5 min from GRA Junction / 10 min from Mile 1 Park”</td>
									<td>Hotel contact page for the drive times; Tripadvisor for airport distance (13.4&nbsp;mi)</td>
									<td><span class="tag-mid">Approximate</span></td>
								</tr>
								<tr>
									<td>Check-in / check-out times</td>
									<td>Not published by the hotel — shown as “confirm with your reservation”</td>
									<td><span class="tag-low">Unconfirmed</span></td>
								</tr>
								<tr>
									<td>Hall capacity (200 vs 100 guests)</td>
									<td>Two pages of the hotel’s own site disagree — both figures are shown</td>
									<td><span class="tag-mid">Conflicting</span></td>
								</tr>
								<tr>
									<td>Guest ratings</td>
									<td>None published: the Grand Tokyu Hotel Tripadvisor listing has no reviews or photos yet</td>
									<td><span class="tag-low">Not shown</span></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<div class="row justify-content-center mt-4">
				<div class="col-lg-10">
					<div class="note-card note-card-wide ftco-animate">
						<h3>A note on similar names</h3>
						<p>Port Harcourt has another, older establishment called <strong>Tokyu Grand Hotel</strong> off 22
							Stadium Road, about 4&nbsp;km away. It is a <em>different property</em> — a 2-star hotel with 102
							rooms that opened in 2014. Its room counts, ratings, breakfast times and facilities have
							deliberately <strong>not</strong> been used anywhere on this site.</p>
						<p class="mb-0">For completeness: the address 273/274 Aba Road previously traded as
							<strong>Claridon Hotels &amp; Resorts</strong>, and older listings under that name still exist
							online. Its photographs are the only genuine pictures of the building we could verify, so they
							are published — clearly labelled as archive material — on the
							<a href="archive.html">archive page</a>. Nothing else on this site is drawn from those older
							listings.</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="ftco-section" id="faqs">
		<div class="container">
			<div class="row justify-content-center mb-4">
				<div class="col-md-8 heading-section text-center ftco-animate">
					<span class="subheading">FAQs</span>
					<h2>Questions guests ask</h2>
				</div>
			</div>
			<div class="row justify-content-center">
				<div class="col-lg-9">
${faqHtml}
				</div>
			</div>
		</div>
	</section>

	<section class="ftco-section bg-light">
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-lg-9">
					<div class="note-card note-card-wide ftco-animate">
						<h3>About this site</h3>
						<p>This is an independent showcase site built on the free Colorlib Harborlights template. Every
							detail — address, telephone numbers, room categories, published starting rates, amenities and
							distances — was compiled from the hotel’s own website and public listings (Google,
							Tripadvisor). Where sources disagree (for example on hall capacity or check-in time), both
							figures have been noted.</p>
						<p class="mb-0">Rates and availability are not live. To confirm anything, please contact the hotel
							directly on <a href="${SITE.phoneHref}">${SITE.phone}</a> or
							<a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
					</div>
				</div>
			</div>
		</div>
	</section>
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
							<tr>
								<td><strong>${r.name}</strong></td>
								<td>${r.sleeps}</td>
								<td class="text-right">${money(r.from)}</td>
							</tr>`
  ).join('');

  const html = `${head({
    title: 'Book a room',
    description:
      'Request a room at Grand Tokyu Hotel, Port Harcourt. Send your dates straight to the front desk by WhatsApp or email, or call +234 091 6000 7896.',
    active: ''
  })}

${pageHero({
    image: 'images/bg_2.jpg',
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Book a room' }],
    title: 'Book your stay',
    subtitle: 'Tell us your dates — the front desk replies personally, day or night.'
  })}

	<section class="ftco-section">
		<div class="container">
			<div class="row">
				<div class="col-lg-7 ftco-animate">
					<span class="subheading">Reservation request</span>
					<h2 class="mb-4">Your dates, our desk</h2>
					<form class="form-card" data-enquiry-form data-kind="Booking request">
						<div class="row">
							<div class="col-md-6 form-group">
								<label>Full name</label>
								<input type="text" name="name" class="form-control" placeholder="Full name" required>
							</div>
							<div class="col-md-6 form-group">
								<label>Phone / WhatsApp</label>
								<input type="tel" name="phone" class="form-control" placeholder="+234 ..." required>
							</div>
							<div class="col-md-6 form-group">
								<label>Email</label>
								<input type="email" name="email" class="form-control" placeholder="you@example.com">
							</div>
							<div class="col-md-6 form-group">
								<label>Room</label>
								<select name="room" class="form-control" id="booking-room">
									${ROOMS.map((r) => `<option value="${r.name}">${r.name} — from ${money(r.from)}</option>`).join('\n\t\t\t\t\t\t\t\t\t')}
								</select>
							</div>
							<div class="col-md-6 form-group">
								<label>Check in</label>
								<input type="date" name="checkin" class="form-control">
							</div>
							<div class="col-md-6 form-group">
								<label>Check out</label>
								<input type="date" name="checkout" class="form-control">
							</div>
							<div class="col-md-6 form-group">
								<label>Adults</label>
								<select name="adults" class="form-control">
									<option>1</option><option selected>2</option><option>3</option><option>4</option><option>5</option><option>6+</option>
								</select>
							</div>
							<div class="col-md-6 form-group">
								<label>Children</label>
								<select name="children" class="form-control">
									<option selected>0</option><option>1</option><option>2</option><option>3</option><option>4+</option>
								</select>
							</div>
							<div class="col-12 form-group">
								<label>Anything we should know?</label>
								<textarea name="notes" rows="4" class="form-control" placeholder="Airport pickup, late arrival, dietary needs, cot..."></textarea>
							</div>
							<div class="col-12 form-group mb-0">
								<button type="submit" class="btn btn-primary rounded-pill px-5 py-3" data-send="whatsapp">Send on WhatsApp</button>
								<button type="submit" class="btn btn-outline-dark rounded-pill px-5 py-3 ml-sm-2" data-send="email">Send by email</button>
								<p class="form-note small mt-3 mb-0">This opens WhatsApp or your email app with your request
									filled in. Nothing is sent automatically, and no payment is taken here.</p>
							</div>
						</div>
					</form>
				</div>
				<div class="col-lg-5 ftco-animate pl-lg-5">
					<div class="contact-card mb-4">
						<h3 class="mb-3">Reservations desk</h3>
						<ul class="block-23">
							<li><span class="icon icon-phone"></span><a href="${SITE.phoneHref}">${SITE.phone}</a></li>
							<li><span class="icon icon-phone"></span><a href="${SITE.phone2Href}">${SITE.phone2}</a></li>
							<li><span class="icon icon-envelope"></span><a href="mailto:${SITE.email}">${SITE.email}</a></li>
							<li><span class="icon icon-map-marker"></span><span>${SITE.address}</span></li>
						</ul>
						<a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener" class="btn btn-dark rounded-pill px-4 mt-2">Message on WhatsApp</a>
					</div>
					<div class="note-card">
						<h3 class="mb-3">Before you book</h3>
						<ul class="info-list info-list-tight">
							<li><span>Check-in</span>${SITE.checkinText}</li>
							<li><span>Check-out</span>${SITE.checkoutText}</li>
							<li><span>Rates</span>Naira, per night</li>
							<li><span>Payment</span>at the hotel or by transfer</li>
							<li><span>Rates shown</span>starting prices, not live availability</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="ftco-section bg-light" id="rates">
		<div class="container">
			<div class="row justify-content-center mb-4">
				<div class="col-md-9 heading-section text-center ftco-animate">
					<span class="subheading">Rates</span>
					<h2 class="mb-3">Starting rates per night</h2>
				</div>
			</div>
			<div class="row justify-content-center">
				<div class="col-lg-8">
					<div class="table-responsive rate-table ftco-animate">
						<table class="table">
							<thead>
								<tr><th>Room</th><th>Sleeps</th><th class="text-right">From</th></tr>
							</thead>
							<tbody>
${rateRows}
							</tbody>
						</table>
					</div>
					<div class="row mt-4">
						<div class="col-md-6 ftco-animate">
							<h3 class="mb-3">Included with every stay</h3>
							<ul class="amenity-grid amenities-two">
								<li><span class="icon-check"></span>Free Wi-Fi</li>
								<li><span class="icon-check"></span>Air conditioning</li>
								<li><span class="icon-check"></span>Daily housekeeping</li>
								<li><span class="icon-check"></span>Rainfall shower</li>
								<li><span class="icon-check"></span>Premium toiletries</li>
								<li><span class="icon-check"></span>24/7 front desk</li>
								<li><span class="icon-check"></span>Pool access</li>
								<li><span class="icon-check"></span>On-site parking</li>
							</ul>
						</div>
						<div class="col-md-6 ftco-animate">
							<h3 class="mb-3">Good to know</h3>
							<p class="mb-2">The rates above are the hotel’s published starting rates. Weekends, holidays
								and peak periods are usually higher, and the apartment and suites are best booked early.</p>
							<p class="mb-0">Travelling with a group, or need the hall as well? The events team can hold
								rooms and event space together — see <a href="events.html">Events</a>.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
${ctaBand()}
${footer()}`;

  writePage('booking.html', html);
}

/* ------------------------------------------------------------------ *
 *  CONTACT
 * ------------------------------------------------------------------ */
function buildContact() {
  const html = `${head({
    title: 'Contact & directions',
    description:
      'Contact Grand Tokyu Hotel: 273/274 Aba Road, Port Harcourt, Rivers State. Reservations +234 091 6000 7896, email grandtokyuhotel@gmail.com.',
    active: ''
  })}

${pageHero({
    image: 'images/gth-exterior.jpg',
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Contact' }],
    title: 'Contact us',
    subtitle: 'In the heart of Port Harcourt — and easy to reach from anywhere in it.'
  })}

	<section class="ftco-section">
		<div class="container">
			<div class="row mb-5">
				<div class="col-md-4 d-flex ftco-animate">
					<div class="contact-card w-100">
						<span class="icon icon-map-marker contact-icon"></span>
						<h3>Visit</h3>
						<p class="mb-2">${SITE.address}</p>
						<p class="small mb-0">Postal code ${SITE.postal}</p>
					</div>
				</div>
				<div class="col-md-4 d-flex ftco-animate">
					<div class="contact-card w-100">
						<span class="icon icon-phone contact-icon"></span>
						<h3>Call</h3>
						<p class="mb-1"><a href="${SITE.phoneHref}">${SITE.phone}</a></p>
						<p class="mb-0"><a href="${SITE.phone2Href}">${SITE.phone2}</a></p>
					</div>
				</div>
				<div class="col-md-4 d-flex ftco-animate">
					<div class="contact-card w-100">
						<span class="icon icon-envelope contact-icon"></span>
						<h3>Write</h3>
						<p class="mb-1"><a href="mailto:${SITE.email}">${SITE.email}</a></p>
						<p class="small mb-0">The desk is staffed 24/7 — we answer every message.</p>
					</div>
				</div>
			</div>

			<div class="row align-items-center">
				<div class="col-lg-6 ftco-animate">
					<div class="map-frame map-frame-lg">
						<iframe src="${SITE.osm}" title="Map showing Aba Road, Port Harcourt" loading="lazy"></iframe>
					</div>
					<p class="small text-muted mt-2 mb-0">Map is approximate — Aba Road, Port Harcourt.
						<a href="${SITE.maps}" target="_blank" rel="noopener">Open in Google Maps</a>.</p>
				</div>
				<div class="col-lg-6 ftco-animate pl-lg-5">
					<span class="subheading">Getting here</span>
					<h2 class="mb-4">Five minutes from GRA Junction</h2>
					<p>By car, the hotel is about five minutes from GRA Junction and ten minutes from Mile 1 Park.
						Port Harcourt International Airport is roughly 35 minutes away by taxi. Ask the front desk about
						airport pick-up when you book — availability is confirmed with your reservation.</p>
					<ul class="info-list">
						<li><span>Address</span>${SITE.address}</li>
						<li><span>Landmark</span>On Aba Road, near GRA Junction</li>
						<li><span>Airport</span>Port Harcourt International — about 35 minutes</li>
						<li><span>Parking</span>On site</li>
						<li><span>Front desk</span>Open 24 hours</li>
					</ul>
				</div>
			</div>
		</div>
	</section>

	<section class="ftco-section">
		<div class="container">
			<div class="row justify-content-center mb-5 pb-2">
				<div class="col-md-8 heading-section text-center ftco-animate">
					<span class="subheading">Around the hotel</span>
					<h2>What is close by</h2>
					<p>Distances as published on the hotel’s listings — all within easy reach of Aba Road.</p>
				</div>
			</div>
			<div class="row">
				<div class="col-md-6 col-lg-3 d-flex ftco-animate">
					<div class="venue-card w-100">
						<span class="icon-map-marker venue-icon"></span>
						<h3>Pleasure Park</h3>
						<p class="mb-1">5.5 km — gardens, water features and family time.</p>
						<span class="dish-tag">Attraction</span>
					</div>
				</div>
				<div class="col-md-6 col-lg-3 d-flex ftco-animate">
					<div class="venue-card w-100">
						<span class="icon-glass venue-icon"></span>
						<h3>Lounges nearby</h3>
						<p class="mb-1">The Boss Lounge 2.8 km, SOK Lounge 2.9 km.</p>
						<span class="dish-tag">Nightlife</span>
					</div>
				</div>
				<div class="col-md-6 col-lg-3 d-flex ftco-animate">
					<div class="venue-card w-100">
						<span class="icon-cutlery venue-icon"></span>
						<h3>Restaurants</h3>
						<p class="mb-1">AsiaTown, Casablanca Sports Bar &amp; Karaoke, Blue Elephant.</p>
						<span class="dish-tag">Dining</span>
					</div>
				</div>
				<div class="col-md-6 col-lg-3 d-flex ftco-animate">
					<div class="venue-card w-100">
						<span class="icon-plane venue-icon"></span>
						<h3>Airport</h3>
						<p class="mb-1">Port Harcourt International — about 35 minutes by taxi.</p>
						<span class="dish-tag">Travel</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="ftco-section bg-light">
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-lg-8">
					<div class="heading-section text-center mb-4 ftco-animate">
						<span class="subheading">Say hello</span>
						<h2>Do you have a wish or a question?</h2>
					</div>
					<form class="form-card" data-enquiry-form data-kind="Website enquiry">
						<div class="row">
							<div class="col-md-6 form-group">
								<label>Your name</label>
								<input type="text" name="name" class="form-control" placeholder="Full name" required>
							</div>
							<div class="col-md-6 form-group">
								<label>Your email</label>
								<input type="email" name="email" class="form-control" placeholder="you@example.com" required>
							</div>
							<div class="col-md-6 form-group">
								<label>Phone</label>
								<input type="tel" name="phone" class="form-control" placeholder="+234 ...">
							</div>
							<div class="col-md-6 form-group">
								<label>Subject</label>
								<input type="text" name="subject" class="form-control" placeholder="What is this about?">
							</div>
							<div class="col-12 form-group">
								<label>Message</label>
								<textarea name="notes" rows="6" class="form-control" placeholder="How can we help?" required></textarea>
							</div>
							<div class="col-12 form-group mb-0">
								<button type="submit" class="btn btn-primary rounded-pill px-5 py-3" data-send="whatsapp">Send on WhatsApp</button>
								<button type="submit" class="btn btn-outline-dark rounded-pill px-5 py-3 ml-sm-2" data-send="email">Send by email</button>
								<p class="form-note small mt-3 mb-0">Your message opens in WhatsApp or your email app — you
									can review it before sending.</p>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</section>
${ctaBand()}
${footer()}`;

  writePage('contact.html', html);
}

/* ------------------------------------------------------------------ *
 *  JOURNAL
 * ------------------------------------------------------------------ */
const ARTICLE_BODIES = {
  'journal-getting-here.html': `
						<p class="lead">Port Harcourt is a city of bridges, traffic and very warm welcomes. The good news is
							that Grand Tokyu Hotel sits on one of its straightest roads, which makes arriving simpler than
							most first-time visitors expect.</p>
						<p>The hotel is at <strong>273/274 Aba Road, Port Harcourt, Rivers State</strong>. If you are coming
							from the city centre, you are roughly five minutes from GRA Junction and about ten minutes from
							Mile 1 Park — close enough that a taxi driver will know exactly where you mean.</p>

						<h2>From the airport</h2>
						<p>Port Harcourt International Airport is about 21 kilometres away, which usually works out to
							roughly 35 minutes by taxi depending on traffic. Sam Mbakwe International Cargo Airport, in
							Owerri, is a much longer drive — around 70 kilometres, or close to two hours.</p>
						<p>If you would rather not negotiate a fare at arrivals, call the front desk before you fly and ask
							them whether a pick-up can be arranged. Car hire is worth asking about at the same time —
							availability is confirmed with your reservation.</p>

						<h2>By car</h2>
						<ul>
							<li>Head for <strong>Aba Road</strong> and continue to number 273/274 — the hotel is on the main
								road, so there is no turn into a side street to miss.</li>
							<li>Allow extra time between 7–10am and 4–8pm; Port Harcourt traffic is not a rumour.</li>
							<li>On-site parking is available, so you can leave the car and walk to dinner.</li>
						</ul>

						<h2>When you get here</h2>
						<p>Check-in is from 12:00 and check-out is by 11:00, though both can shift slightly with your rate
							plan. Reception is staffed 24 hours a day, so a late arrival is not a problem — just tell them
							your flight number when you book.</p>
						<p>Have your reservation name, dates and a phone number to hand, and the whole thing takes a few
							minutes. Then the only decision left is whether to unpack first, or go straight up to the
							rooftop.</p>

						<div class="article-callout">
							<h3>Quick numbers</h3>
							<ul class="info-list info-list-tight mb-0">
								<li><span>Reservations</span>+234 091 6000 7896 &middot; +234 091 6000 7897</li>
								<li><span>Email</span><a href="mailto:grandtokyuhotel@gmail.com">grandtokyuhotel@gmail.com</a></li>
								<li><span>Address</span>273/274 Aba Road, Port Harcourt</li>
							</ul>
						</div>`,
  'journal-day-in-port-harcourt.html': `
						<p class="lead">You have a spare afternoon in Port Harcourt and no desire to spend it in traffic.
							Here is a version of the day that stays close to Aba Road, leaves room for the pool, and ends
							on a roof.</p>

						<h2>Morning — slowly</h2>
						<p>Start with breakfast at the restaurant: eggs, pastries, fruit, something hot and Nigerian if you
							want it. Then take your coffee to the pool deck and let the morning happen to you. Guests tend
							to underestimate how long they will stay there.</p>

						<h2>Early afternoon — Pleasure Park</h2>
						<p>About 5.5 kilometres away, <strong>Pleasure Park</strong> is the city’s best-known family
							outing — gardens, water features and enough space for children to burn off a morning indoors.
							It is a straightforward taxi ride and an easy way to see a greener side of Port Harcourt.</p>

						<h2>Later — the city</h2>
						<p>If you would rather stay indoors, the lounges nearby are close: The Boss Lounge is around 2.8
							kilometres away and SOK Lounge about 2.9 kilometres. For dinner there is plenty within reach,
							including Casablanca Restaurant Sports Bar &amp; Karaoke, Blue Elephant and AsiaTown, all
							within a few kilometres of the hotel.</p>

						<h2>Evening — back to the roof</h2>
						<p>Return for sunset. The rooftop bar is the hotel’s best trick: city lights, a breeze and a
							cocktail that arrives faster than your taxi did. Stay for dinner downstairs, or order room
							service and call it an early night.</p>

						<div class="article-callout">
							<h3>Worth knowing</h3>
							<p class="mb-0">Distances are approximate and depend on traffic. Ask the front desk to arrange
								a car — they will also tell you what is open that day, which is more useful than any
								guidebook.</p>
						</div>`,
  'journal-inside-your-room.html': `
						<p class="lead">Every room at Grand Tokyu is built around the same idea: comfort should be
							effortless. Here is exactly what that means, category by category, so you can book the room
							that matches the trip.</p>

						<h2>Standard Room — ₦40,000</h2>
						<p>Sleeps two, with a king bed and a 40-inch Samsung® LED television. Non-smoking, free Wi-Fi and a
							USB charging station beside the bed. The right choice for a solo business trip or a couple’s
							weekend.</p>

						<h2>Classic Room — ₦50,000</h2>
						<p>Sleeps three and adds a proper work desk to the same 40-inch LED television, free Wi-Fi,
							non-smoking policy and USB charging. If you plan to answer email at midnight, take this one.</p>

						<h2>Standard Suite Room — ₦60,000</h2>
						<p>Sleeps four with a king bed and a city view — the hotel recommends it for families, and the
							extra space is what makes that work.</p>

						<h2>Classic Suite Room — ₦85,000</h2>
						<p>Sleeps five with a king bed, a sea view, a mini bar, a work desk, a 40-inch LED television, free
							Wi-Fi and USB charging. The signature suite, and the one to book for a celebration.</p>

						<h2>The Apartment — ₦300,000</h2>
						<p>A different proposition entirely: two separate bedrooms, a furnished living room with a powerful
							standing air conditioner, a fully equipped kitchen with a modern refrigerator and a washing
							machine, and a 75-inch LED television. Sleeps up to ten. Ideal for a family or a group staying
							long enough to want a home rather than a hotel room.</p>

						<h2>In every room</h2>
						<ul>
							<li>Air conditioning and a flat-screen television</li>
							<li>Free high-speed Wi-Fi throughout the hotel</li>
							<li>Rainfall shower, premium toiletries and warm lighting</li>
							<li>Soft linen, spacious wardrobes and daily housekeeping</li>
							<li>A 24-hour front desk and room service</li>
						</ul>

						<div class="article-callout">
							<h3>Booking tip</h3>
							<p class="mb-0">Rates shown are the hotel’s published starting prices. Call the reservations
								desk on <a href="tel:+2349160007896">+234 091 6000 7896</a> with your dates and they will
								confirm what is actually available.</p>
						</div>`
};

function buildBlog() {
  const cards = POSTS.map(
    (p) => `
				<div class="col-md-4 d-flex ftco-animate">
					<div class="blog-entry align-self-stretch w-100">
						<a href="${p.slug}" class="block-20 rounded" style="background-image: url(${p.img});"></a>
						<div class="text mt-3">
							<div class="meta mb-2">${p.date} &middot; ${p.read}</div>
							<h3 class="heading mb-2"><a href="${p.slug}">${p.title}</a></h3>
							<p>${p.excerpt}</p>
							<a href="${p.slug}" class="link-arrow">Read the note <span class="icon-long-arrow-right"></span></a>
						</div>
					</div>
				</div>`
  ).join('');

  const html = `${head({
    title: 'Journal',
    description:
      'Practical notes for staying at Grand Tokyu Hotel, Port Harcourt: getting here from the airport, a day out nearby, and a guide to every room category.',
    active: ''
  })}

${pageHero({
    image: 'images/gth-rooftop.jpg',
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Journal' }],
    title: 'The Journal',
    subtitle: 'Practical notes for your stay — directions, days out, and what is in the room.'
  })}

	<section class="ftco-section">
		<div class="container">
			<div class="row justify-content-center mb-5 pb-2">
				<div class="col-md-8 heading-section text-center ftco-animate">
					<span class="subheading">Notes from Aba Road</span>
					<h2 class="mb-3">Three things worth reading before you arrive</h2>
					<p>Short, useful guides written from the hotel’s own details — no filler, no listicles.</p>
				</div>
			</div>
			<div class="row">
${cards}
			</div>
		</div>
	</section>
${ctaBand()}
${footer()}`;

  writePage('blog.html', html);

  POSTS.forEach((post) => {
    const body = ARTICLE_BODIES[post.slug] || '<p>' + post.excerpt + '</p>';
    const more = POSTS.filter((p) => p.slug !== post.slug)
      .map(
        (p) => `
				<div class="col-md-6 d-flex ftco-animate">
					<div class="blog-entry align-self-stretch w-100">
						<a href="${p.slug}" class="block-20 rounded" style="background-image: url(${p.img});"></a>
						<div class="text mt-3">
							<div class="meta mb-2">${post.date} &middot; ${p.read}</div>
							<h3 class="heading mb-0"><a href="${p.slug}">${p.title}</a></h3>
						</div>
					</div>
				</div>`
      )
      .join('');

    const page = `${head({
      title: post.title,
      description: post.excerpt,
      active: ''
    })}

${pageHero({
      image: post.img,
      crumbs: [
        { label: 'Home', href: 'index.html' },
        { label: 'Journal', href: 'blog.html' },
        { label: 'Note' }
      ],
      title: post.title,
      subtitle: `${post.date} &middot; ${post.read}`
    })}

	<section class="ftco-section">
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-lg-8 article-body ftco-animate">
${body}
				</div>
			</div>
			<div class="row justify-content-center mt-5">
				<div class="col-lg-8">
					<div class="article-footer d-flex flex-wrap align-items-center justify-content-between">
						<div>
							<span class="subheading">Ready when you are</span>
							<p class="mb-0">Reservations: <a href="${SITE.phoneHref}">${SITE.phone}</a></p>
						</div>
						<a href="booking.html" class="btn btn-primary rounded-pill px-4">Book a room</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="ftco-section bg-light">
		<div class="container">
			<div class="row justify-content-between align-items-end mb-4">
				<div class="col-md-7 heading-section ftco-animate">
					<span class="subheading">Keep reading</span>
					<h2 class="mb-0">More from the journal</h2>
				</div>
				<div class="col-md-4 text-md-right ftco-animate mb-3 mb-md-0">
					<a href="blog.html" class="btn btn-outline-dark rounded-pill px-4">All notes</a>
				</div>
			</div>
			<div class="row">
${more}
			</div>
		</div>
	</section>
${footer()}`;

    writePage(post.slug, page);
  });
}


/* ------------------------------------------------------------------ *
 *  ARCHIVE — genuine photographs of 273/274 Aba Road from before the
 *  Grand Tokyu rebrand (Claridon Hotels & Resorts era). Kept separate
 *  from the illustrative marketing imagery and labelled as such.
 * ------------------------------------------------------------------ */
const ARCHIVE = [
  {
    img: 'images/archive/claridon-courtyard-2017.jpg',
    title: 'The building, from the inside',
    note: 'The courtyard well: guest-room balconies, the covered walkway and the pool below, with the property’s distinctive red-roofed crown structure in the middle of the block.',
    tag: 'Building'
  },
  {
    img: 'images/archive/claridon-pool-2017.jpg',
    title: 'The courtyard pool',
    note: 'The small pool sits in the centre of the block, surrounded by the room wings — the same arrangement described in older guest reviews of the property.',
    tag: 'Pool',
    small: true
  },
  {
    img: 'images/archive/claridon-lobby-2017.jpg',
    title: 'Lobby & reception',
    note: 'Reception and the lounge areas, with the glass-topped tables that ran through the lobby. Full-height windows look onto the courtyard.',
    tag: 'Reception'
  },
  {
    img: 'images/archive/claridon-restaurant-2017.jpg',
    title: 'The restaurant',
    note: 'The dining room, laid with white-covered tables and dark chairs, with the bar and a television at the far end of the room.',
    tag: 'Restaurant'
  },
  {
    img: 'images/archive/claridon-double-room-2017.jpg',
    title: 'A double room',
    note: 'A guest room in the Claridon years: two beds, dark timber headboard and nightstand, tiled floor and a rug.',
    tag: 'Rooms'
  },
  {
    img: 'images/archive/claridon-room-2017.jpg',
    title: 'Desk & bed',
    note: 'The same room category from another angle — work desk, wall-mounted television and the room’s dressing area.',
    tag: 'Rooms'
  },
  {
    img: 'images/archive/claridon-bathroom-2017.jpg',
    title: 'The bathroom',
    note: 'Tiled bathroom with a shower over the bath, a vanity and the mirror lighting typical of the period.',
    tag: 'Rooms'
  }
];

function buildArchive() {
  const tiles = ARCHIVE.map(
    (a) => `
				<div class="col-md-6 ftco-animate mb-4">
					<figure class="archive-tile${a.small ? ' archive-tile-small' : ''}">
						<a href="${a.img}" class="archive-img image-popup" style="background-image:url(${a.img});">
							<span class="archive-badge">Archive photo</span>
						</a>
						<figcaption>
							<span class="dish-tag">${a.tag}</span>
							<h3>${a.title}</h3>
							<p class="mb-0">${a.note}</p>
						</figcaption>
					</figure>
				</div>`
  ).join('');

  const html = `${head({
    title: 'Archive photographs of the building',
    description:
      'Genuine photographs of 273/274 Aba Road, Port Harcourt, taken when the property traded as Claridon Hotels & Resorts — the building Grand Tokyu Hotel now occupies.',
    active: 'archive'
  })}

${pageHero({
    image: 'images/archive/claridon-lobby-2017.jpg',
    crumbs: [
      { label: 'Home', href: 'index.html' },
      { label: 'About', href: 'about.html' },
      { label: 'Archive' }
    ],
    title: 'The building, before the name changed',
    subtitle: 'Real photographs of 273/274 Aba Road — from its Claridon Hotels &amp; Resorts years.'
  })}

	<section class="ftco-section">
		<div class="container">
			<div class="row justify-content-center mb-5 pb-2">
				<div class="col-lg-9 heading-section text-center ftco-animate">
					<span class="subheading">Why these photos exist</span>
					<h2 class="mb-4">The only pictures of this address we could actually verify</h2>
					<p>Grand Tokyu Hotel’s own website is currently offline and it publishes no photo library, and its
						Tripadvisor listing has no photos or reviews yet. But the address has a history: 273/274 Aba Road
						traded for years as <strong>Claridon Hotels &amp; Resorts</strong>, and a set of its photographs
						survives on Tripadvisor and the OTAs.</p>
					<p class="mb-0">They are published here — plainly labelled — because they are the only genuine
						photographs of the building we could find. They show the property as it was, not necessarily as it
						is today: Grand Tokyu has since refurbished and rebranded it.</p>
				</div>
			</div>

			<div class="archive-warning ftco-animate mb-5">
				<span class="icon-info-circle"></span>
				<div>
					<p class="mb-0"><strong>Read this before you book on the strength of these pictures.</strong> These are
						archive photographs of the building from the Claridon era. Room finishes, furniture, the restaurant
						and the pool area may all have changed since. For how the hotel presents itself now, see the
						<a href="rooms.html">rooms</a> and <a href="gallery.html">gallery</a> pages — and note that the
						marketing imagery there is explicitly illustrative.</p>
				</div>
			</div>

			<div class="row">
${tiles}
			</div>
		</div>
	</section>

	<section class="ftco-section bg-light">
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-lg-10">
					<div class="heading-section mb-4 ftco-animate">
						<span class="subheading">Provenance</span>
						<h2>Where each photo comes from</h2>
					</div>
					<div class="table-responsive ftco-animate">
						<table class="table facts-table sources-table">
							<thead>
								<tr><th>Photograph</th><th>Source</th><th>What we know</th></tr>
							</thead>
							<tbody>
								<tr>
									<td>Courtyard, pool and rooms</td>
									<td>Zenhotels listing for Claridon Hotels &amp; Resorts, Port Harcourt</td>
									<td><span class="tag-ok">Same address</span> 273/274 Aba Road</td>
								</tr>
								<tr>
									<td>Lobby, restaurant, two double rooms and the bathroom</td>
									<td>Tripadvisor property photographs, Claridon Hotels &amp; Resorts (<code>d2177947</code>) — traveller-submitted, 2017</td>
									<td><span class="tag-ok">Same address</span> reviewed by guests in 2015–2017</td>
								</tr>
								<tr>
									<td>Date of the photographs</td>
									<td>2017 (Tripadvisor uploads) and the Claridon trading era (property founded 2009)</td>
									<td><span class="tag-mid">Archive</span> not current</td>
								</tr>
								<tr>
									<td>Brand under which they were taken</td>
									<td>Claridon Hotels &amp; Resorts — the hotel’s earlier identity at the same address</td>
									<td><span class="tag-mid">Pre-rebrand</span></td>
								</tr>
							</tbody>
						</table>
					</div>

					<div class="row mt-4">
						<div class="col-md-6 ftco-animate">
							<div class="note-card mb-4">
								<h3>What we did <em>not</em> use</h3>
								<p class="mb-0">Photographs of <strong>Tokyu Grand Hotel</strong> off 22 Stadium Road — a
									separate hotel about 4&nbsp;km away — or of any other Port Harcourt property whose
									listings happened to appear in the same searches. Where a photo could not be tied to
									273/274 Aba Road, it was discarded.</p>
							</div>
						</div>
						<div class="col-md-6 ftco-animate">
							<div class="note-card mb-4">
								<h3>Have current photographs?</h3>
								<p class="mb-0">Send them to the hotel, or drop them into
									<code>images/official/</code> in this project and follow <code>MEDIA.md</code>. They can
									replace both the archive set and the illustrative imagery in a single rebuild.</p>
							</div>
						</div>
					</div>

					<p class="small text-muted mb-0">Photographs remain the copyright of their owners and are reproduced
						here at reduced size for reference and identification only. If you own one of these images and
						would like it removed, contact the site owner and it will be taken down.</p>
				</div>
			</div>
		</div>
	</section>
${ctaBand()}
${footer()}`;

  writePage('archive.html', html);
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
buildArchive();
buildAbout();
buildBooking();
buildContact();
buildBlog();
/* sitemap + robots */
const pages = fs
  .readdirSync(ROOT)
  .filter((f) => f.endsWith('.html'))
  .sort((a, b) => (a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.localeCompare(b)));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>https://grandtokyuhotels.com/${p}</loc>
    <changefreq>${p === 'index.html' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${p === 'index.html' ? '1.0' : '0.7'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(ROOT, 'robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: https://grandtokyuhotels.com/sitemap.xml\n');
console.log('  ✓ sitemap.xml, robots.txt');

console.log('Done.');
