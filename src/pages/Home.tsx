import { useEffect } from 'react'

import About from '../components/About'
import FinalCTA from '../components/FinalCTA'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Projects from '../components/Projects'
import Stats from '../components/Stats'
import Structure from '../components/Structure'

export default function Home() {
  useEffect(() => {
    document.title = 'Showmate — the Shellmates archive'
  }, [])

  return (
    <>
      <main id="main">
        <Hero />
        <Projects />
        <About />
        <Stats />
        <Structure />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
