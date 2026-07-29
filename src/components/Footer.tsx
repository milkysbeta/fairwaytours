import { Link } from 'react-router-dom'
import { SITE } from '@/data/site'

export function Footer() {
  return (
    <footer className="border-t border-bone-100/10 py-16">
      <div className="container-page grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl text-bone-50">{SITE.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-bone-400">
            Private golf touring across Wanaka, Arrowtown and Queenstown. Door to door, every time.
          </p>
        </div>

        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-4 space-y-2.5 text-sm text-bone-400">
            <li>
              <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-bone-50">
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${SITE.phone.replace(/\s/g, '')}`}
                className="transition-colors hover:text-bone-50"
              >
                {SITE.phone}
              </a>
            </li>
            <li>{SITE.base.label}</li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Book</p>
          <ul className="mt-4 space-y-2.5 text-sm text-bone-400">
            <li>
              <Link to="/enquire" className="transition-colors hover:text-bone-50">
                Plan your round
              </Link>
            </li>
            {SITE.airbnbUrl && (
              <li>
                <a
                  href={SITE.airbnbUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-bone-50"
                >
                  Book on Airbnb
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="container-page mt-14 border-t border-bone-100/10 pt-8">
        <p className="text-xs text-bone-400/50">
          © {new Date().getFullYear()} {SITE.name}. Wanaka, New Zealand.
        </p>
      </div>
    </footer>
  )
}
