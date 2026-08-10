# Deploying

Three steps: put the code on GitHub, connect it to a host, point the domain at
the host. About twenty minutes end to end, most of it waiting for DNS.

## 1. GitHub

The repository has to be created by you — the integration used to build this
site can push to repositories but cannot create them.

1. github.com/new → name it **FairwayTours**, private, **no** README,
   **no** .gitignore, **no** licence. It must be empty.
2. Tell me it exists and I will push this history into it.

## 2. Netlify

Netlify is assumed below because the enquiry function in `netlify/functions`
is written for it. Vercel or Cloudflare Pages would work with a rewritten
function.

1. netlify.com → **Add new site → Import an existing project** → GitHub →
   `FairwayTours`.
2. Build settings come from `netlify.toml` — leave them alone.
3. Deploy. You get a `something-random.netlify.app` URL. Check it works before
   touching DNS.

### Environment variables

**Site settings → Environment variables.** Without the first three, the site
loads but every enquiry fails with a visible error. That is deliberate: an
unconfigured site must not appear to accept enquiries it is silently dropping.

| Variable | Value | Needed for |
| --- | --- | --- |
| `RESEND_API_KEY` | From resend.com, free tier | Sending enquiries |
| `ENQUIRY_TO` | Where enquiries land | Sending enquiries |
| `ENQUIRY_FROM` | A verified sender on your domain | Sending enquiries |
| `VITE_OPENWEATHER_KEY` | *(optional)* | Switches the forecast to OpenWeather |

Resend needs your sending domain verified before `ENQUIRY_FROM` will work —
that is a second set of DNS records, added the same way as below.

Leave `VITE_OPENWEATHER_KEY` unset unless you have a reason. Open-Meteo needs no
key and reaches 16 days; OpenWeather's free tier reaches 5.

## 3. DNS at Porkbun

Domain: **fairwaytour.co.nz**

In Netlify: **Domain management → Add a domain** → `fairwaytour.co.nz`. Netlify
will show you the exact records it wants — **use those over the values below if
they differ**, since load-balancer addresses do change.

At Porkbun: **Domain Management → DNS → the domain → Edit**. Delete Porkbun's
default parking records first, or they will fight these.

| Type | Host | Answer |
| --- | --- | --- |
| ALIAS | *(blank — the apex)* | `apex-loadbalancer.netlify.com` |
| CNAME | `www` | `<your-site>.netlify.app` |

Porkbun supports ALIAS at the apex, which is the right record here — a CNAME is
not legal at the apex, and an A record pins you to an IP that can change. If
ALIAS is unavailable for any reason, use `A` → `75.2.60.5`.

### The plural domain

The brand is **Fairway Tours** but the registered domain is the singular
**fairwaytour.co.nz**. Anyone typing the plural lands nowhere. Register
`fairwaytours.co.nz` and add it in Netlify as a domain alias — Netlify will
redirect it to the primary automatically — or accept the leak.

Propagation is usually minutes on Porkbun, occasionally an hour. Netlify issues
the Let's Encrypt certificate automatically once it can see the records; if HTTPS
is still failing after an hour, **Domain management → HTTPS → Renew certificate**.

Set the primary domain in Netlify so one of apex/www redirects to the other
rather than both serving — duplicate content otherwise.

## Checks before you call it live

- [ ] `/enquire` and `/trade` survive a hard refresh (SPA redirect is working)
- [ ] Submit a real enquiry and confirm the email arrives
- [ ] Submit with the function's env vars removed and confirm the guest sees an
      error rather than a false success
- [ ] Conditions calendar shows forecast markers on the next fortnight
- [ ] Check on a phone — the calendar grid and the five-day timeline are the
      two things most likely to break narrow

## Not ready for launch

- Photography is placeholder and not licence-cleared. See
  `public/media/CREDITS.md`.
- Journey prices are indicative, not costed against supplier rates.
- Lodge partners render unnamed until agreements exist.
- No payments, deposits or cancellation terms.
