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

`images/archive/` holds **twelve genuine photographs of 273/274 Aba Road** from before the Grand Tokyu
rebrand, when the property at that address traded as **Claridon Hotels & Resorts** (the address match is
the basis for that — see the caution below). They are the only photos of this building we could verify.

**They are confined to `archive.html`.** No marketing page uses them: the home, rooms, dining, gallery,
about, contact and booking pages are entirely Grand Tokyu / illustrative imagery, so nothing on the site
presents another hotel's photographs as the brand's own. The archive page badges every photo, lists each
source and era, and opens with a "not current photography" warning.

The `archive: true` ribbon option in `pageHero()` and the `.archive-ribbon` class still exist if you ever
want to surface an archive image on a page again — they are simply unused at present.

| File | Shows | Source |
| --- | --- | --- |
| `claridon-exterior-2016.jpg` | The Aba Road frontage and its two red arched gates | Claridon Hotels & Resorts gallery (Zenhotels) |
| `claridon-courtyard-2017.jpg` | Courtyard, balconies, pool and the red-roofed crown structure | Claridon gallery (Zenhotels), cross-checked against the Tripadvisor courtyard shot |
| `claridon-pool-2017.jpg` | The courtyard pool (184 px — shown contained, never stretched) | Tripadvisor property photo, Claridon `d2177947` |
| `claridon-lobby-2017.jpg` | Lobby and lounge | Claridon gallery (OTA set) |
| `claridon-reception-2017.jpg` | Reception seen from the mezzanine | Claridon gallery (Zenhotels) |
| `claridon-restaurant-2017.jpg` | The dining room | Tripadvisor property photo, Claridon `d2177947` |
| `claridon-room-classic-2017.jpg` | Standard room | Claridon gallery (Destinia / OTA set) |
| `claridon-room-suite-2017.jpg` | Larger room with desk | Claridon gallery (Destinia / OTA set) |
| `claridon-living-room-2017.jpg` | Suite living area | Claridon gallery (Zenhotels) |
| `claridon-double-room-2017.jpg` | Twin room | Tripadvisor property photo, Claridon `d2177947` |
| `claridon-room-2017.jpg` | Bedroom with desk and television | Tripadvisor property photo, Claridon `d2177947` |
| `claridon-bathroom-2017.jpg` | Bathroom with shower over bath | Tripadvisor property photo, Claridon `d2177947` |

To retire the archive material once official photography arrives: empty the `ARCHIVE` array in
`tools/build.js`, remove the `archive: true` flags and the `previewItems` archive entries, drop the
"Archive" filter from `buildGallery()`, and delete `buildArchive()` from the build list — then delete
`images/archive/`. Re-run `node tools/build.js`.

### Caution: what the Claridon link actually rests on

Both hotels are listed at **273/274 Aba Road**:

| Property | Address on public listings |
| --- | --- |
| Grand Tokyu Hotel | 273/274 Aba Road, Port Harcourt 500272 (Tripadvisor `d33282887`) |
| Claridon Hotels & Resorts | 273/274 Aba Road, Port Harcourt 500211 (KAYAK, Expedia, hotelsclick, Destinia, guestreservations, trivago) |

The same, unusually specific two-number plot on the same road is the whole basis for treating them as the
same building under a new brand. No source states the rebrand outright — the hotel's site is offline and
the Wayback Machine was unavailable — so treat it as a strong inference, not a confirmed fact. Postal codes
differ between the two sets of listings (500211 vs 500272), which is a further reason for caution. If the
hotel confirms it is a different property, delete `images/archive/` and the archive page.

Also note there is a genuinely unrelated **Tokyu Grand Hotel** off 22 Stadium Road — hotels.ng's 2018 guide
lists it separately from Claridon at Aba Road, which is how we know the two are different.

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
