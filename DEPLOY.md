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

## 3. Attaching fairwaytours.co.nz

The build is host-agnostic: Vite emits relative asset paths and the router reads
its mount point off the URL, so the same artifact serves correctly at both
`milkysbeta.github.io/fairwaytours/` and the domain root. Nothing needs
rebuilding differently for the domain.

### On GitHub Pages

1. At Porkbun (**Domain Management → DNS → fairwaytours.co.nz → Edit**), delete
   the parking records — `207.207.210.229` and `207.207.210.107` at the apex,
   and `www` → `pixie.porkbun.com` — then add:

   | Type | Host | Answer |
   | --- | --- | --- |
   | ALIAS | *(blank)* | `milkysbeta.github.io` |
   | CNAME | `www` | `milkysbeta.github.io` |

   If ALIAS is unavailable, use four `A` records at the blank host:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.

2. Wait until the apex actually resolves to GitHub. Check with
   `dig +short fairwaytours.co.nz` or dnschecker.org.

3. **Only then** add a file `public/CNAME` containing `fairwaytours.co.nz` and
   push. That is the whole change — Pages reads it and switches the site to the
   custom domain.

4. **Settings → Pages → Enforce HTTPS** once the certificate has issued, which
   can take up to an hour.

Doing step 3 before step 2 is what broke the site previously: Pages redirects the
github.io URL to a domain that does not resolve, so neither works.

## 3b. DNS at Porkbun (Netlify route)

Domain: **fairwaytours.co.nz** — registered, on Porkbun nameservers, currently
serving Porkbun's parking page.

In Netlify: **Domain management → Add a domain** → `fairwaytours.co.nz`. Netlify
will show you the exact records it wants — **use those over the values below if
they differ**, since load-balancer addresses do change.

At Porkbun: **Domain Management → DNS → the domain → Edit**.

**Delete the existing parking records first.** The domain currently answers with
`207.207.210.229` / `207.207.210.107` at the apex and `pixie.porkbun.com` on
`www` — Porkbun's parking page. Those will fight the records below.

| Type | Host | Answer |
| --- | --- | --- |
| ALIAS | *(blank — the apex)* | `apex-loadbalancer.netlify.com` |
| CNAME | `www` | `<your-site>.netlify.app` |

Porkbun supports ALIAS at the apex, which is the right record here — a CNAME is
not legal at the apex, and an A record pins you to an IP that can change. If
ALIAS is unavailable for any reason, use `A` → `75.2.60.5`.

### On the singular

`fairwaytour.co.nz` is **not** registered and does not resolve, despite naming
the project folder. Nothing to do unless you want it as a defensive
registration pointing at the real domain.

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
