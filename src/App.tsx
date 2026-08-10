import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Home } from '@/pages/Home'
import { Enquire } from '@/pages/Enquire'
import { Trade } from '@/pages/Trade'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'

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
 * Path routing in production. Hash routing when VITE_HASH_ROUTER is set, which
 * is how the standalone client-preview build works — that bundle is served from
 * an arbitrary path with no server rewrite behind it, so pushState navigation
 * would walk straight out of the app.
 */
const Router = import.meta.env.VITE_HASH_ROUTER ? HashRouter : BrowserRouter

export default function App() {
  if (import.meta.env.VITE_HASH_ROUTER) {
    return (
      <Router>
        <Shell />
      </Router>
    )
  }

  // BASE_URL is '/' on Netlify and '/fairwaytours/' on GitHub Pages, so the
  // router has to be told which prefix its paths sit behind.
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Shell />
    </BrowserRouter>
  )
}
