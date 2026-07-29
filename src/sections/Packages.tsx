import { Link } from 'react-router-dom'
import { PACKAGES } from '@/data/packages'
import { courseById } from '@/data/courses'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'

export function Packages() {
  return (
    <section id="packages" className="relative py-28 md:py-40">
      {/* Section-wide tint so the packages read as a distinct plate. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_50%,var(--color-pine-900),transparent)]" />

      <div className="container-page relative">
        <SectionHeading
          eyebrow="Packages"
          title="Built around the days you have."
          lede="A morning, a long weekend, or a full circuit of the South Island. Every package is a starting point — tell us what you want and we will shape it."
          align="center"
        />

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {PACKAGES.map((pkg, i) => (
            <Reveal key={pkg.id} delay={i * 0.08}>
              <article
                className={`flex h-full flex-col rounded-2xl border p-8 transition-all duration-700 ${
                  pkg.featured
                    ? 'border-fairway-500/30 bg-fairway-500/[0.05]'
                    : 'border-bone-100/10 bg-pine-900/40 hover:border-bone-100/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl text-bone-50">{pkg.name}</h3>
                    <p className="mt-1.5 text-sm text-bone-400">{pkg.duration}</p>
                  </div>
                  {pkg.featured && (
                    <span className="shrink-0 rounded-full border border-fairway-500/40 px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-fairway-400">
                      Signature
                    </span>
                  )}
                </div>

                <p className="mt-5 text-sm leading-relaxed text-bone-400">{pkg.summary}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {pkg.courseIds.map((id) => (
                    <span
                      key={id}
                      className="rounded-full border border-bone-100/10 px-3 py-1 text-xs text-bone-200"
                    >
                      {courseById(id)?.name ?? id}
                    </span>
                  ))}
                </div>

                <ul className="mt-7 space-y-3 border-t border-bone-100/10 pt-6">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-bone-200">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-fairway-500" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                  <p className="text-sm text-bone-400">
                    {pkg.fromPriceNzd
                      ? `From NZ$${pkg.fromPriceNzd.toLocaleString()}`
                      : 'Price on enquiry'}
                  </p>
                  <Link
                    to={`/enquire?package=${pkg.id}`}
                    className="rounded-full border border-bone-100/20 px-5 py-2.5 text-sm text-bone-100 transition-colors duration-300 hover:border-fairway-500 hover:text-fairway-400"
                  >
                    Enquire
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
