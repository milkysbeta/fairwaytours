# Fairway NZ

Private golf touring in Wanaka, Arrowtown and Queenstown — marketing site and
enquiry flow.

```bash
npm install
npm run dev
```

## Stack

React 19 · TypeScript · Vite · Tailwind v4 · Framer Motion · Lenis (momentum
scroll) · React Router.

## Layout

| Path | What lives there |
| --- | --- |
| `src/data/` | **All client-editable content.** Courses, packages, services, hero film, contact details. |
| `src/sections/` | Homepage sections, one file each. |
| `src/pages/` | Routed pages — `Home`, `Enquire`. |
| `src/lib/weather.ts` | Open-Meteo forecast + the golf-conditions score. |
| `src/lib/enquiry.ts` | Enquiry shape, price estimator, submit. |
| `public/media/` | Photography and hero footage (see below). |

Anything needing the client's input is marked `TODO(client)`; anything needing a
server is marked `TODO(backend)`.

## Media

Nothing is committed yet — the site degrades to gradients wherever a file is
missing, so it looks intentional rather than broken while we gather assets.

```
public/media/
  hero/01-arrival.mp4   04-table.mp4 …   # hero film segments (src/data/hero.ts)
  courses/wanaka.jpg    millbrook.jpg …  # one per course id
  jacob.jpg                              # portrait for the About section
```

Drop files in with these names and they appear automatically.

## Weather scoring

`scoreDay()` in `src/lib/weather.ts` weights wind first, then rain, then
temperature, and returns 0–100 plus a verdict. It is deliberately transparent
and deliberately gentle — the guest picks the day, we only inform the choice.

## Not built yet

- **Payments.** Stripe deposits, cancellation terms. Rates are not set, so
  `estimate()` returns `null` and the UI shows "on enquiry".
- **Backend.** `submitEnquiry()` POSTs to `/api/enquiries`, which does not
  exist yet — enquiries currently surface the error and fall back to email.
- **Availability.** The date picker offers the forecast window; real blackout
  dates need Jacob's calendar and an admin view.
- **Course maps.** Per-course hole maps.
