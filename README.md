# Grand Tokyu Hotel — website

A complete, responsive marketing website for **Grand Tokyu Hotel**, 273/274 Aba Road, Port Harcourt,
Rivers State, Nigeria — built from the free Colorlib *Harborlights* template
(`https://github.com/abdulaziz-m5u/free-hotel-website-template.git`) and populated with every piece of
publicly available information about the hotel.

Plain static HTML/CSS/JS — no build step, no server required. Open `index.html` (or serve the folder)
and the site works.

```bash
# preview locally
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home — slider, quick availability bar, services, rooms, rooftop & pool, stats, menu preview, gallery strip, guest ratings, journal |
| `rooms.html` | All five room categories, published rate table, in-room amenities, good-to-know |
| `room-standard-room.html` · `room-classic-room.html` · `room-standard-suite.html` · `room-classic-suite.html` · `room-apartment.html` | One page per room category with gallery slider, specs, amenities and booking notes |
| `restaurant.html` | Restaurant, rooftop bar and poolside; menu; hours; private dining |
| `events.html` | The Hall — capacity, layouts, inclusions and an event enquiry form |
| `gallery.html` | Filterable gallery (hotel, rooms, rooftop & pool, events & dining) with lightbox |
| `archive.html` | Genuine archive photographs of 273/274 Aba Road from the building's Claridon Hotels & Resorts years, with provenance and a "not current" warning |
| `about.html` | Story, values, fact table, map, directions, FAQs, sourcing note |
| `booking.html` | Reservation request form that hands off to WhatsApp or email, plus rates |
| `contact.html` | Contact cards, map, directions and a neighbourhood guide |
| `blog.html` + `journal-*.html` | Journal index and three written guides (getting here, a day out, inside your room) |

`tools/build.js` regenerates every page from one set of shared templates and data
(`node tools/build.js`). Edit content there rather than in the generated HTML.
`sitemap.xml` and `robots.txt` are generated too.

---

## Information compiled for the site

All of the following was gathered from the hotel's public website (`grandtokyuhotels.com`), its Google
and Tripadvisor listings and Nigerian hotel directories. Where sources disagree, both figures are shown.

- **Name / brand** — Grand Tokyu Hotel, Port Harcourt
- **Address** — 273/274 Aba Road, Port Harcourt, Rivers State, Nigeria (postal code 500272)
- **Reservations** — +234 091 6000 7896 · +234 091 6000 7897
- **Email** — grandtokyuhotel@gmail.com
- **Room categories & published starting rates**
  - Standard Room — ₦40,000 / night, 2 adults, king bed, 40-inch Samsung LED TV, free Wi-Fi, non-smoking, USB charging
  - Classic Room — ₦50,000 / night, 3 adults, 40-inch LED TV, free Wi-Fi, non-smoking, USB charging, work desk
  - Standard Suite Room — ₦60,000 / night, 4 adults, king bed, city view
  - Classic Suite Room — ₦85,000 / night, 5 adults, king bed, sea view, mini bar, work desk
  - The Apartment — ₦300,000 / night, 10 adults, two separate bedrooms, living room, kitchen, washing machine, 75-inch LED TV
- **The Hall** — event space from ₦400,000 / night, up to 200 guests, four standing air conditioners, free chairs, free Wi-Fi (the hotel's rooms page also mentions a 100-guest layout)
- **Amenities** — rooftop bar with city views, outdoor pool/poolside bar, restaurant (local and continental, Nigerian and international), bar/lounge, room service, free Wi-Fi, on-site parking, 24/7 front desk, daily housekeeping, rainfall showers, premium toiletries, airport pick-up and car hire
- **Check-in / check-out** — 12:00 / 11:00
- **Getting here** — about 5 minutes from GRA Junction, 10 minutes from Mile 1 Park; Port Harcourt International Airport around 35 minutes by taxi
- **Nearby** — Pleasure Park 5.5 km, The Boss Lounge 2.8 km, SOK Lounge 2.9 km; AsiaTown, Casablanca Restaurant Sports Bar & Karaoke and Blue Elephant among nearby restaurants
- **Public ratings** — Google 3.9/5 (490+ reviews), Tripadvisor 4.5/5 (25 reviews) — linked on the home page and dated in the copy

Rates above are the hotel's **published starting rates**, not live availability. The site says so on every
page that mentions money.

---

## Design

- Deep forest green + gold + cream palette layered over the template's original stylesheets
  (`css/gth-theme.css` loads last and re-skins everything).
- Playfair Display for headings, Inter for body copy.
- New components: availability bar, room cards, split image features, stat band, dish cards, gallery grid
  with filters, rating/quote cards, fact and rate tables, FAQ accordion, map embed, journal layout.
- Fully responsive; `prefers` no special handling needed, all motion is opacity/transform only.

## Media

**The photography on this site is illustrative, not official.** Here is what the research found:

- The hotel's own website (`grandtokyuhotels.com`) is **offline** — it now serves an empty Apache directory
  index, and `/about-us/`, `/wp-content/uploads/` and `/wp-json/wp/v2/media` all return 404, so its
  WordPress gallery cannot be retrieved.
- The **Wayback Machine was unavailable** ("Temporarily Offline") when we tried to pull the archived
  `wp-content/uploads` images.
- **Tripadvisor has no photos or reviews** for the Grand Tokyu Hotel listing (`d33282887`, 273/274 Aba Road)
  — it shows "No photos for this property yet".
- **No OTA listing** with photography was found for Grand Tokyu Hotel (Aba Road).

So the site ships with **two clearly separated sets**:

1. **Illustrative marketing imagery** (AI-generated) for the exterior, lobby, rooftop, five room categories
   and The Hall, plus the template's own stock photography for supporting shots — served from `images/`.
2. **Real archive photographs of the building** — the only genuine pictures of 273/274 Aba Road we could
   verify, taken when it traded as Claridon Hotels & Resorts. They live in `images/archive/` and are shown
   on `archive.html` behind an "Archive photo" badge, with a provenance table, a "this is not current
   photography" warning and a copyright/removal note. They are *not* mixed into the marketing pages. `MEDIA.md` lists every file and its origin, and `images/official/README.md`
explains exactly which filename to replace with which official photograph (then re-run
`node tools/build.js`).

### Two hotels, one name

There is an older, unrelated **Tokyu Grand Hotel** at Off 22 Stadium Road, roughly 4 km from Aba Road — a
2-star property that opened in 2014 with 102 rooms. Its photos are the ones that dominate a
"Tokyu Grand Hotel Port Harcourt" image search, and its Google rating, breakfast times and facilities were
**deliberately excluded** from this site. Likewise, 273/274 Aba Road previously traded as **Claridon Hotels
& Resorts**; those older listings were not used either. The About page carries a sourcing table that states
this openly.

## Forms

## Forms

`booking.html`, `events.html` and `contact.html` build a formatted message from the form fields and hand it
to WhatsApp (`+234 916 000 7896`) or the guest's email app. Nothing is transmitted by the site itself — there
is no backend, and no data is stored. Wire the forms to a real endpoint if you need server-side capture.

## Licence / attribution

Built on the Colorlib *Harborlights* template, licensed CC BY 3.0 — the attribution link is kept in the
footer as the licence requires. Site copy and compiled hotel details are provided as an independent
showcase, not an official publication of the hotel.
