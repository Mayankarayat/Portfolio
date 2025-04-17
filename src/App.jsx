import './App.css'
import Footer from './Components/Footer'
import Hero from './Components/Hero'
import Navbar from './Components/Navbar'
import About from './Components/About'
import Experience from './Components/Experience'
import Projects from './Components/Projects'
import Contact from './Components/Contact'

import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
      <div>
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />
          <Routes>
            <Route path='/' element={<Hero />} />
            <Route path='/about' element={<About />} />
            {/* <Route path='/experience' element={<Experience />} /> */}
            <Route path='/projects' element={<Projects />} />
            <Route path='/contact' element={<Contact />} />
          </Routes>
          <About/>
          {/* <Experience/> */}
          <Projects/>
          <Contact/>
        <Footer />
      </div>
    </>
  )
}

export default App
