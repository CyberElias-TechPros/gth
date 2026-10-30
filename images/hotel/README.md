# The hotel's own photography

Every photograph on the site comes from this folder. They were supplied by the hotel
(WhatsApp originals, October 2026), re-encoded to a 1600 px long edge at JPEG quality 82
and renamed so that each file says what it shows. Nothing here is stock, AI-generated or
borrowed from another property.

| File | What it shows | Used for |
| --- | --- | --- |
| `exterior-sign.jpg` | The "Grand Tokyu" signboard above the arched entrance, shot upwards | Home slide 1, Contact hero, gallery |
| `exterior-forecourt.jpg` | The forecourt, paved drive and the dark-glass façade | About hero, Journal (getting here), OG card source |
| `reception-desk.jpg` | The reception desk and staff | Gallery, About, home strip |
| `reception-lobby.jpg` | Reception from the guest side | Gallery |
| `reception-staff.jpg` | Front-desk team | Gallery hero |
| `lounge-tv.jpg` | Lounge with cream sofas and a television | Home, About, Journal hero, gallery |
| `lounge-sofas.jpg`, `lounge-corner.jpg`, `lounge-wide.jpg` | Lounge seating and banquettes | Gallery, Events hero |
| `bar-shelves.jpg`, `bar-shelves-alt.jpg`, `bar-counter.jpg` | The bar and its lit bottle shelves | Dining, home promise section, gallery |
| `rooftop-bar-1/2/3.jpg` | The Rooftop Bar — counter, stools and seating (October 2026 set) | Dining page, gallery |
| `restaurant-dining.jpg` | The restaurant, tables laid | Home slide 3, Dining hero, Events, gallery |
| `restaurant-tables.jpg` | A laid dining table | Dining, gallery |
| `pool-courtyard.jpg`, `pool-from-above.jpg`, `pool-corner.jpg`, `pool-leaves.jpg` | The courtyard pool | Home slide 2, Rooms/Home splits, gallery |
| `pool-loungers.jpg`, `pool-egg-chair.jpg` | Poolside loungers and seating | Gallery, home Instagram strip |
| `courtyard-terrace.jpg` | The covered poolside terrace | Dining, Events, gallery |
| `room-standard-1/2/3.jpg` | Standard Room (max 2 adults) | Room card, room page, gallery |
| `room-classic-1/2/3/4/5.jpg` | Classic Room (max 3 adults) — the October 2026 five-photo set: room views plus a bathroom | Room card, room page, gallery |
| `room-executive-1/2.jpg` | Standard Suite Room (max 4 adults) | Room card, room page, gallery |
| `room-deluxe-1/2.jpg` | Classic Suite Room (max 5 adults) | Room card, room page, booking hero, gallery |
| `room-premium-1/2/3.jpg`, `room-bluesuite.jpg`, `room-desk.jpg` | Further guest-room angles | Gallery |
| `suite-living-1/2.jpg` | Suite sitting areas | Room pages, gallery |
| `apartment-living-1/2/3/4.jpg`, `apartment-kitchen-1/2.jpg`, `apartment-dining.jpg` | The Apartment (max 10 adults) | Apartment page, gallery |
| `bathroom-tub.jpg`, `bathroom-shower.jpg`, `bathroom-vanity.jpg`, `bathroom-simple.jpg`, `bathroom-floral.jpg` | Guest bathrooms | Room pages, gallery |
| `bathroom-basic.jpg` | A simple guest bathroom | Spare — the Classic Room page now carries the hotel's newer five-photo set, so this one is not currently placed |

`images/brand/` holds the logo (the supplied roundel, with a light variant for dark
backgrounds), the SVG mark, the touch icon and the 1200×630 social card.

To swap a picture, replace the file with the same name and run `node tools/build.js`.
Alt text and captions live in `tools/build.js` (`PHOTO`, `ROOMS`, `GALLERY`) — update them
whenever a photo changes so screen readers and search engines stay accurate.
