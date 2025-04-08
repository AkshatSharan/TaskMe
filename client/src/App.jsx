import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Navigation from './components/Navigation';
import TaskGroups from './pages/TaskGroups';
import GroupDetails from './pages/GroupDetails';
import ProtectedRoute from './components/ProtectedRoutes';
import axios from 'axios';

const App = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 640);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("authChanged", handleAuthChange); // custom event

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, []);

  return (
    <Router>
      <main>
        {isLoggedIn && <Navigation />}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/task-groups" element={
            <ProtectedRoute>
              <TaskGroups />
            </ProtectedRoute>
          } />
          <Route path="/group" element={
            <ProtectedRoute>
              <GroupDetails />
            </ProtectedRoute>
          } />

          <Route path="*" element={isLoggedIn ? <Navigate to="/" /> : <Navigate to='/dashboard' />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
