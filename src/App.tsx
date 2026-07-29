import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Home } from '@/pages/Home'
import { Enquire } from '@/pages/Enquire'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'

function Shell() {
  useSmoothScroll()

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/enquire" element={<Enquire />} />
      </Routes>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}
