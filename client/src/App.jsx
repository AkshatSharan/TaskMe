import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import './index.css'
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import MobileNavbar from './components/MobileNavbar';
import DesktopNavbar from './components/DesktopNavbar';
import { useState, useEffect } from "react";
import Navigation from './components/Navigation';

const App = () => {

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 640);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 640);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <Router>
      <main className=''>
      <Navigation />

        <Routes>
          {/* <Route path='/' element={<Landing />} /> */}
          <Route path='/' element={<Dashboard />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App