import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Home } from '@/pages/Home'
import { Enquire } from '@/pages/Enquire'
import { Trade } from '@/pages/Trade'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { routerBasename } from '@/lib/basename'

function Shell() {
  useSmoothScroll()

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/enquire" element={<Enquire />} />
        <Route path="/trade" element={<Trade />} />
      </Routes>
      <Footer />
    </>
  )
}

/**
 * Hash routing for the standalone client-preview bundle, which is served from
 * an arbitrary path with no server rewrite behind it — pushState navigation
 * would walk straight out of the app.
 *
 * Otherwise path routing, with the mount point read off the URL at runtime. See
 * lib/basename: one build now serves the domain root and the GitHub Pages
 * project path, so neither has to be chosen at build time.
 */
export default function App() {
  if (import.meta.env.VITE_HASH_ROUTER) {
    return (
      <HashRouter>
        <Shell />
      </HashRouter>
    )
  }

  return (
    <BrowserRouter basename={routerBasename()}>
      <Shell />
    </BrowserRouter>
  )
}
