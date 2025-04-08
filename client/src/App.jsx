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
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <main>
        {isLoggedIn && <Navigation />}
        <Routes>
          {/* Conditionally render home route */}
          <Route path="/" element={isLoggedIn ? <Dashboard /> : <Landing />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
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

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
