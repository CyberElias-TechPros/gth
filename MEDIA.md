# Media notes — Grand Tokyu Hotel site

## What is on the site now

The imagery is **illustrative, not official photography of the property**:

| File | What it shows | Origin |
| --- | --- | --- |
| `images/gth-exterior.jpg` | Entrance at golden hour | AI-generated |
| `images/gth-lobby.jpg` | Reception and lobby | AI-generated |
| `images/gth-rooftop.jpg` | Rooftop bar at sunset | AI-generated |
| `images/gth-standard.jpg` | Standard Room | AI-generated |
| `images/gth-classic.jpg` | Classic Room | AI-generated |
| `images/gth-standard-suite.jpg` | Standard Suite Room | AI-generated |
| `images/gth-classic-suite.jpg` | Classic Suite Room | AI-generated |
| `images/gth-apartment-living.jpg` | The Apartment — living room | AI-generated |
| `images/gth-apartment-kitchen.jpg` | The Apartment — kitchen | AI-generated |
| `images/gth-hall.jpg` | The Hall set for an event | AI-generated |
| `images/bg_*.jpg`, `room-*.jpg`, `menu-*.jpg`, `resto.jpg`, `about-*.jpg`, `insta-*.jpg`, `image_*.jpg` | Supporting room, pool, dining and terrace photography | Colorlib *Harborlights* template (CC BY 3.0) |

The site itself says so: the footer carries a “photography is illustrative” line, and the About page
explains it under *About this site*.

## Archive photographs (real, but not current)

`images/archive/` holds genuine photographs of 273/274 Aba Road from before the Grand Tokyu rebrand, when
the property traded as **Claridon Hotels & Resorts**. They are the only photos of this building we could
verify, and they are published on `archive.html` only — never mixed into the marketing pages.

| File | Shows | Source |
| --- | --- | --- |
| `claridon-courtyard-2017.jpg` | Courtyard, balconies, pool and the red-roofed crown structure | Zenhotels listing for Claridon Hotels & Resorts, Port Harcourt (cross-checked against the Tripadvisor courtyard shot) |
| `claridon-pool-2017.jpg` | The courtyard pool (low resolution — displayed small, contained) | Tripadvisor property photo, Claridon `d2177947` |
| `claridon-lobby-2017.jpg` | Lobby and reception | Claridon listing interior shot (also used as the archive hero) |
| `claridon-restaurant-2017.jpg` | The dining room | Tripadvisor property photo, Claridon `d2177947` |
| `claridon-double-room-2017.jpg` | Twin/double guest room | Tripadvisor property photo, Claridon `d2177947` |
| `claridon-room-2017.jpg` | Bedroom with desk and television | Tripadvisor property photo, Claridon `d2177947` |
| `claridon-bathroom-2017.jpg` | Bathroom with shower over bath | Tripadvisor property photo, Claridon `d2177947` |

Deleting the `images/archive/` folder plus the `ARCHIVE` array in `tools/build.js` removes the archive page
cleanly; deleting `buildArchive()` from the build list removes the page itself.

## Why there is no official photography

Checked during build (July 2026):

1. **The hotel’s own website is offline.** `grandtokyuhotels.com` now returns an empty Apache directory
   index, and `/about-us/`, `/wp-content/uploads/` and `/wp-json/wp/v2/media` all 404. The WordPress
   media library — where the hotel’s real gallery lived — is not reachable.
2. **The Wayback Machine could not help**: `web.archive.org` was returning “Temporarily Offline”, so the
   archived copies of those `wp-content/uploads` images could not be retrieved.
3. **Tripadvisor has no media for this property.** The Grand Tokyu Hotel listing
   (`d33282887`, 273/274 Aba Road) shows *“No photos for this property yet”* and no reviews.
4. **No OTA listing exists** for Grand Tokyu Hotel (Aba Road) that we could find — no Booking.com,
   Agoda, Expedia or Hotels.com page with its photography.
5. **Beware the similarly named hotel.** *Tokyu Grand Hotel*, Off 22 Stadium Road (about 4 km away) is a
   different 2-star property that opened in 2014 with 102 rooms. Its photos are the ones that surface when
   you search “Tokyu Grand Hotel Port Harcourt” — do **not** drop those into this site; they are somebody
   else’s hotel.
6. **The address has history.** 273/274 Aba Road previously traded as **Claridon Hotels & Resorts**.
   Photos under that name still exist on OTAs and show the same building, but a different brand and era —
   again, not used here.

## How to drop in official photography

Every image is referenced from `tools/build.js` by its path in `images/`. The simplest swap is to keep the
filenames and replace the files (same aspect ratio; ~1800 px on the long edge, JPEG quality 80):

```bash
# example: replace the six key shots with the hotel’s own photography
cp ~/downloads/gt-entrance.jpg   images/gth-exterior.jpg
cp ~/downloads/gt-lobby.jpg      images/gth-lobby.jpg
cp ~/downloads/gt-rooftop.jpg    images/gth-rooftop.jpg
cp ~/downloads/gt-standard.jpg   images/gth-standard.jpg
cp ~/downloads/gt-classic.jpg    images/gth-classic.jpg
cp ~/downloads/gt-hall.jpg       images/gth-hall.jpg
node tools/build.js     # rebuild the pages
```

Room galleries reuse those files; the mapping is the `ROOMS` array in `tools/build.js`
(`image` for the card/hero, `gallery[]` for the slider), and `GALLERY` for the gallery page.

When official photos are in place, delete the disclosure sentences:

- footer: *“photography is illustrative”* in `footer()` in `tools/build.js`
- About page: the **Photography** paragraph in `buildAbout()`
- the `small text-muted` captions under the gallery and dining grids

## Licensing

Colorlib *Harborlights* is CC BY 3.0 — the attribution link in the footer must stay.
OTA photographs belong to the hotel; if you use them, use the hotel’s own originals rather than
re-saving them from an OTA page, and get the hotel’s permission before publishing.
