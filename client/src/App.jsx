import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Navigation from './components/Navigation';
import TaskGroups from './pages/TaskGroups';
import GroupDetails from './pages/GroupDetails';
import { ProtectedRoute, GuestOnlyRoute } from './components/ProtectedRoutes';

const App = () => {
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
          <Route path="/" element={
            <GuestOnlyRoute isLoggedIn={isLoggedIn}>
              <Landing />
            </GuestOnlyRoute>
          } />
          <Route path="/login" element={
            <GuestOnlyRoute isLoggedIn={isLoggedIn}>
              <Login />
            </GuestOnlyRoute>
          } />
          <Route path="/signup" element={
            <GuestOnlyRoute isLoggedIn={isLoggedIn}>
              <Signup />
            </GuestOnlyRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/task-groups" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <TaskGroups />
            </ProtectedRoute>
          } />
          <Route path="/group/:groupId" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <GroupDetails />
            </ProtectedRoute>
          } />

          <Route path="*" element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/" />
          } />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
