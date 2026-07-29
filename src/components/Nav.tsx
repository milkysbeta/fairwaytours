import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SITE } from '@/data/site'

const LINKS = [
  { href: '/#journeys', label: 'Journeys' },
  { href: '/#itinerary', label: 'The five days' },
  { href: '/#courses', label: 'Courses' },
  { href: '/#experiences', label: 'Experiences' },
  { href: '/#seasons', label: 'When to come' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'border-b border-bone-100/10 bg-pine-950/70 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <nav className="container-page flex h-20 items-center justify-between">
        <Link to="/" className="font-display text-lg tracking-tight text-bone-50">
          {SITE.name}
        </Link>

        <ul className="hidden items-center gap-9 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-bone-400 transition-colors duration-300 hover:text-bone-50"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            to="/enquire"
            className="rounded-full border border-fairway-500/40 bg-fairway-500/10 px-5 py-2.5 text-sm text-fairway-400 transition-all duration-300 hover:border-fairway-500 hover:bg-fairway-500 hover:text-pine-950"
          >
            Begin
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="lg:hidden rounded-full border border-bone-100/15 p-2.5"
          >
            <span className="block h-px w-4 bg-bone-100" />
            <span className="mt-1.5 block h-px w-4 bg-bone-100" />
          </button>
        </div>
      </nav>

      {open && (
        <ul className="container-page flex flex-col gap-1 pb-6 lg:hidden">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-sm text-bone-400"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
