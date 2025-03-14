import React from 'react'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Navbar from './component/Navbar'
import LoginModal from './pages/Login'
import FirebaseTest from './pages/FirebaseTest'
import TrackPackage from './pages/TrackPackage'

const App = () => { 
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/About' element={<About />}/>
        <Route path='/Services' element={<Services />}/>
        <Route path='/Contact' element={<Contact />}/>
        <Route path='/Login' element={<LoginModal />}/>
        <Route path='/FirebaseTest' element={<FirebaseTest />}/>
        <Route path='/TrackPackage' element={<TrackPackage />}/>
      </Routes>
    </div>
  )
}

export default App
