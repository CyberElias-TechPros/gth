# Grand Tokyu Hotel — website

A complete, responsive marketing site for **Grand Tokyu Hotel**, 273/274 Aba Road, Port Harcourt,
Rivers State, Nigeria — built on the free Colorlib *Harborlights* template and populated with the
hotel's own details, rates, logo and photography.

Plain static HTML/CSS/JS — no build step needed to view it, no server, no framework.

```bash
# preview locally
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## What is new in this version

- **The hotel's own photography everywhere.** 51 photographs supplied by the hotel replaced all
  AI-generated and template stock imagery (see `MEDIA.md` and `images/hotel/README.md`).
- **The hotel's logo** in the navbar, footer, favicon, touch icon, social card and manifest, with
  the theme re-skinned to the logo's navy/azure palette.
- **Corrected rates and capacities** — Standard ₦32,000 (2 adults), Classic ₦40,000 (3), Standard
  Suite ₦48,000 (4), Classic Suite ₦68,000 (5), The Apartment ₦240,000 (10), The Hall ₦350,000 (200).
- **Instagram** (`@grandtokyu`) linked from the home page, contact page and footer.
- **“A five-star Michelin experience”** — the hotel's own standard, given its own section.
- **Built to be understood by AI and search engines**: `llms.txt`, `hotel-data.json`, schema.org
  JSON-LD on every page, real `<img>` elements with alt text, one `<h1>` per page, breadcrumbs,
  semantic landmarks, an AI-friendly `robots.txt` and a full sitemap.

---

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home — slider, quick availability bar, services, all five rooms and rates, pool, dining, stats, the hotel's promise, menu preview, gallery strip, Instagram, address & map, journal |
| `rooms.html` | Every room category with “max adults”, beds and the published rate table, room photography, amenities, good to know |
| `room-standard-room.html` · `room-classic-room.html` · `room-standard-suite.html` · `room-classic-suite.html` · `room-apartment.html` | One page per category: gallery slider, specs, amenities, booking notes, photographs |
| `restaurant.html` | Restaurant, bar & lounge, poolside terrace, sample menu, hours, private dining |
| `events.html` | The Hall — 200 guests from ₦350,000, layouts, inclusions, photography and an enquiry form |
| `gallery.html` | All photography, filterable by area (hotel, rooms, apartment & suites, pool, dining & bar, events) with a lightbox |
| `about.html` | Story, values, key-facts table, directions and map, sourcing notes, FAQs |
| `booking.html` | Reservation request that hands off to WhatsApp or email, plus the rate table |
| `contact.html` | Address, both phone lines, email, Instagram, map, what is nearby, enquiry form |
| `blog.html` + `journal-*.html` | Journal index and three guides (getting here, a day out, inside your room) |
| `llms.txt` | Plain-text summary of the hotel, written for AI assistants |
| `hotel-data.json` | The same facts as structured JSON |
| `sitemap.xml`, `robots.txt`, `site.webmanifest` | Generated with the pages |

`tools/build.js` regenerates every page from one set of shared data and templates:
`node tools/build.js`. Edit content there rather than in the generated HTML.

---

## Hotel facts used on the site

- **Name** — Grand Tokyu Hotel, Port Harcourt
- **Address** — 273/274 Aba Road, Port Harcourt, Rivers State, Nigeria (postal code 500272)
- **Reservations** — +234 091 6000 7896 · +234 091 6000 7897
- **Email** — grandtokyuhotel@gmail.com
- **Instagram** — [@grandtokyu](https://www.instagram.com/grandtokyu/)
- **Rooms, capacity and published “book now from” rates**

  | Room | Max adults | From / night |
  | --- | --- | --- |
  | Standard Room | 2 | ₦32,000 |
  | Classic Room | 3 | ₦40,000 |
  | Standard Suite Room | 4 | ₦48,000 |
  | Classic Suite Room | 5 | ₦68,000 |
  | The Apartment | 10 | ₦240,000 |
  | The Hall (event space) | 200 | ₦350,000 |

- **Amenities** — outdoor courtyard pool with terrace and sun loungers, restaurant (Nigerian and
  continental), bar & lounge, room service, free Wi-Fi, on-site parking, 24-hour front desk, daily
  housekeeping, air conditioning, event hall, airport pick-up and car hire on request
- **Check-in / check-out** — from 12:00 / by 11:00, confirmed with each reservation
- **Getting here** — about 5 minutes from GRA Junction, 10 minutes from Mile 1 Park; Port Harcourt
  International Airport around 35 minutes by taxi
- **Nearby** — Pleasure Park 5.5 km, The Boss Lounge 2.8 km, SOK Lounge 2.9 km; AsiaTown, Casablanca
  Restaurant Sports Bar & Karaoke and Blue Elephant among nearby restaurants

Rates are the hotel's **published starting rates**, not live availability. Every page that mentions
money says so.

---

## Designed for AI assistants and answer engines

The site is deliberately easy for machines to read:

1. **`llms.txt`** — a concise, factual summary (name, address, phones, rates, capacities, FAQs,
   citation guidance) in the emerging llms.txt convention. Linked from the footer and About page.
2. **`hotel-data.json`** — the same facts as structured JSON: rooms, rates, amenities, event space,
   photo captions, FAQs and page index.
3. **JSON-LD on every page** — a `@graph` containing `Hotel` (address, geo, phones, check-in/out,
   amenities, `makesOffer` per room, `containsPlace` = The Hall), `WebSite`, `BreadcrumbList`, plus
   page-specific `HotelRoom`, `Restaurant`, `EventVenue`, `ImageGallery`, `Blog`, `BlogPosting`,
   `AboutPage`, `ContactPage` and `FAQPage` nodes.
4. **Semantic HTML** — `header`/`main`/`footer`/`nav`/`article`/`figure`/`address`, one `h1` per page,
   real `<img>` tags with descriptive alt text and captions (not CSS background images), table
   captions and `scope` attributes, labelled form fields, a skip link.
5. **`robots.txt`** that welcomes AI crawlers by name (GPTBot, OAI-SearchBot, ClaudeBot,
   PerplexityBot, Google-Extended, CCBot and others) and points at the sitemap and `llms.txt`.
6. **Canonical URLs, Open Graph and Twitter cards** on every page, with a real 1200×630 social image.
7. **One canonical set of facts.** The address, both phone numbers, the email, the Instagram handle
   and the rate table appear in the same form on every page, in `llms.txt` and in the JSON — so a
   model reading any one of them gets the same answer.

## Design

- Palette taken from the hotel's logo: deep navy `#072a4e`, azure `#1c77c5`, ice blue `#a5ddf9` over
  white and a cool cream. Playfair Display for headings, Inter for body copy.
- `css/gth-theme.css` loads last and re-skins the template; the brand refresh block at the bottom
  adds the logo lockup, photo-based cards and the new components (photo tiles, highlight band).
- Fully responsive. All motion is opacity/transform based.

## Media

All photography is the hotel's own — no stock, no AI-generated imagery, no pictures of any other
property. The originals live in `images/hotel/`, the logo and social assets in `images/brand/`.
`MEDIA.md` explains where each came from and how to replace one;
`images/hotel/README.md` maps every file to what it shows and where it is used.

## Forms

`booking.html`, `events.html` and `contact.html` build a formatted message from the form fields and
hand it to WhatsApp (`+234 916 000 7896`) or the guest's email app. Nothing is transmitted by the
site itself — there is no backend and no data is stored. Wire the forms to a real endpoint if you
need server-side capture.

## Licence / attribution

Built on the Colorlib *Harborlights* template, licensed CC BY 3.0 — the attribution link is kept in
the footer as the licence requires. Site copy and the compiled hotel details are provided for the
hotel's own use.
