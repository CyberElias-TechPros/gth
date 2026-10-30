# Media notes — Grand Tokyu Hotel site

## What is on the site

**All photography is the hotel's own.** It was supplied by the hotel in October 2026 and lives in
`images/hotel/`, re-encoded to a 1600 px long edge at JPEG quality 82 and renamed so each file says
what it shows. `images/hotel/README.md` maps every file to a description and a place on the site.

| Set | Files | Where it appears |
| --- | --- | --- |
| Exterior | `exterior-front.jpg`, `exterior-sign.jpg`, `exterior-forecourt.jpg` | Home slide 1 (front picture), About hero, Contact hero, social card |
| Reception & lounge | `reception-*.jpg`, `lounge-*.jpg` | Home, About, Events, Journal, gallery |
| Bar & restaurant | `bar-*.jpg`, `restaurant-*.jpg` | Home slide 3, Dining, Events, gallery |
| Rooftop bar | `rooftop-bar-*.jpg` | Dining page, gallery |
| Pool & courtyard | `pool-*.jpg`, `courtyard-terrace.jpg` | Home slide 2, home split features, gallery |
| Guest rooms | `room-standard-*`, `room-classic-*`, `room-executive-*`, `room-deluxe-*`, `room-premium-*`, `room-desk`, `room-bluesuite` | Room cards and pages, booking hero, gallery |
| Suites & apartment | `suite-living-*`, `apartment-*` | Suite/apartment pages, gallery |
| Bathrooms | `bathroom-*.jpg` | Room pages, gallery |

Brand assets in `images/brand/`:

| File | What it is |
| --- | --- |
| `logo.png` | The hotel's roundel, background removed, for light backgrounds |
| `logo-light.png` | The same roundel in cream/ice blue for dark backgrounds (navbar, footer) |
| `logo-mark.png`, `logo-mark-light.png` | 160 px marks for small spaces |
| `logo-mark.svg`, `../favicon.svg` | Vector marks, drawn to match the roundel (sun over a wave) |
| `apple-touch-icon.png` | 180 px icon |
| `og-cover.jpg` | 1200×630 social card, built from `exterior-forecourt.jpg` |

The logo artwork itself is the file the hotel supplied; only the black background was removed and
sizes were generated from it.

## Removed with this update

- The **twelve archive photographs** from 273/274 Aba Road's Claridon Hotels & Resorts years, and the
  `archive.html` page that explained them. Real current photography made them unnecessary; the old
  files remain in git history if they are ever wanted back.
- The **AI-generated marketing imagery** (`gth-*.jpg`) and the **template's stock photography**
  (`bg_*`, `room-*`, `menu-*`, `resto.jpg`, `insta-*`, `about-*`, `staff-*`, `person_*`, `image_*`,
  `testimony-img.jpg`). Nothing on the site is illustrative any more, so the old "photography is
  illustrative" disclaimers are gone too.
- Food photography. The kitchen section now *describes* dishes instead of showing stock plates, so
  no picture on the site misrepresents a dish.

## Adding or replacing a photograph

1. Drop the file into `images/hotel/` with a descriptive, lowercase, hyphenated name.
2. Resize (long edge ~1600 px) and compress:
   ```bash
   convert new-photo.jpg -auto-orient -strip -resize '1600x1600>' -sampling-factor 4:2:0 -quality 82 images/hotel/new-photo.jpg
   ```
3. Reference it from `tools/build.js` — `PHOTO`, `ROOMS`, `HALL` or `GALLERY` — and write the **alt
   text and caption at the same time** (they are what screen readers, search engines and AI
   assistants read).
4. `node tools/build.js` to rebuild every page, `llms.txt` and `hotel-data.json`.

Keep the ratio of people-free detail shots to wide shots sensible: rooms pages want the room, the
home page wants the building.

## Why this matters for AI and search

Alt text, captions, file names and the machine-readable files (`llms.txt`, `hotel-data.json`,
JSON-LD) all describe the same reality. If a photograph changes, update the description in
`tools/build.js` so those stay true.

## Licensing

- The hotel's photography and logo: the hotel's own material, used with permission for this site.
- Colorlib *Harborlights* (the template): CC BY 3.0 — the attribution link in the footer must stay.
