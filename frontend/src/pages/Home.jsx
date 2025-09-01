import React from 'react'
import Navbar from '../components/NavBar'
import HeroSection from '../components/Hero'
import Feature from '../components/Feature'
import TopResturents from './TopResturents'
import TopFood from './TopFood'
import AboutPage from './AboutPage'
import Footer from '../components/Footer'
import ContactUs from '../components/ContactUs'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <Feature/>
      <TopResturents/>
      <TopFood/>
      <AboutPage/>
      <ContactUs/>
      <Footer/>
    </div>
  )
}

export default Home
